import { BaseConnectorAdapter } from "../../core/base-adapter";
import { getConnector } from "../../core/registry";
import type { ConnectionRecord, SyncResult, SyncContext, NormalizedOrder } from "../../core/types";

const API_BASE = "https://api.loyverse.com/v1.0";

// Free-tier Loyverse accounts only expose the last 31 days of receipts via
// the API (older data needs the paid "Unlimited Sales History" add-on).
const MAX_LOOKBACK_MS = 31 * 24 * 60 * 60 * 1000;

interface LoyverseStore {
  id: string;
  name: string;
}

interface LoyverseLineItem {
  item_name?: string;
  variant_name?: string;
  quantity?: number;
  price?: number;
  total_money?: number;
}

interface LoyverseReceipt {
  receipt_number: string;
  receipt_date?: string;
  created_at?: string;
  cancelled_at?: string | null;
  total_money?: number;
  line_items?: LoyverseLineItem[];
}

/**
 * Loyverse POS adapter — Personal Access Token auth (Back Office →
 * Integrations → Access Tokens, no OAuth app registration needed — the
 * simplest path for a single independent store).
 *
 * Real API docs: https://developer.loyverse.com/docs/
 */
export class LoyverseAdapter extends BaseConnectorAdapter {
  definition = getConnector("loyverse")!;

  async connect(params: { apiKey?: string }): Promise<ConnectionRecord> {
    if (!params.apiKey) {
      return {
        connectorId: this.definition.id,
        status: "error",
        lastError: "أدخل رمز الوصول (Access Token) من Back Office ← Integrations ← Access Tokens",
      };
    }

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/stores`, {
        headers: { Authorization: `Bearer ${params.apiKey}` },
      });
    } catch {
      return { connectorId: this.definition.id, status: "error", lastError: "تعذر الوصول إلى Loyverse، تحقق من الاتصال بالإنترنت" };
    }

    if (!res.ok) {
      return {
        connectorId: this.definition.id,
        status: "error",
        lastError: res.status === 401 ? "الرمز غير صحيح أو منتهي الصلاحية" : `فشل الاتصال بـ Loyverse (${res.status})`,
      };
    }

    const data = (await res.json()) as { stores?: LoyverseStore[] };
    const storeName = data.stores?.[0]?.name ?? "Loyverse";

    return {
      connectorId: this.definition.id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      accountLabel: storeName,
    };
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    // Real verification needs the stored token, which only the sync route
    // has access to (it reads it from integration_connections). This stub
    // satisfies the interface for callers that don't have DB access.
    return { ok: true, message: "استخدم زر المزامنة للتحقق من الاتصال الفعلي" };
  }

  async sync(ctx?: SyncContext): Promise<SyncResult> {
    const token = ctx?.credentials?.apiKey;
    const now = new Date().toISOString();

    if (!token) {
      return {
        success: false,
        ordersImported: 0,
        productsImported: 0,
        transactionsImported: 0,
        message: "لا يوجد رمز وصول محفوظ لهذا الاتصال",
        syncedAt: now,
      };
    }

    const earliestAllowed = Date.now() - MAX_LOOKBACK_MS;
    const sinceMs = ctx?.sinceIso ? Math.max(new Date(ctx.sinceIso).getTime(), earliestAllowed) : earliestAllowed;
    const since = new Date(sinceMs).toISOString();

    const orders: NormalizedOrder[] = [];
    let cursor: string | undefined;

    do {
      const url = new URL(`${API_BASE}/receipts`);
      url.searchParams.set("created_at_min", since);
      url.searchParams.set("limit", "250");
      if (cursor) url.searchParams.set("cursor", cursor);

      let res: Response;
      try {
        res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        return {
          success: false,
          ordersImported: orders.length,
          productsImported: 0,
          transactionsImported: 0,
          message: "تعذر الوصول إلى Loyverse أثناء المزامنة، تحقق من الاتصال بالإنترنت",
          syncedAt: now,
        };
      }

      if (res.status === 402) {
        return {
          success: false,
          ordersImported: 0,
          productsImported: 0,
          transactionsImported: 0,
          message: "الفترة المطلوبة تحتاج إضافة \"Unlimited Sales History\" المدفوعة من Loyverse (الافتراضي: آخر 31 يوم فقط)",
          syncedAt: now,
        };
      }

      if (!res.ok) {
        return {
          success: false,
          ordersImported: orders.length,
          productsImported: 0,
          transactionsImported: 0,
          message: `فشلت المزامنة: Loyverse رجّع خطأ (${res.status})`,
          syncedAt: now,
        };
      }

      const data = (await res.json()) as { receipts?: LoyverseReceipt[]; cursor?: string };

      for (const r of data.receipts ?? []) {
        const items = r.line_items ?? [];
        orders.push({
          externalId: String(r.receipt_number),
          total: Number(r.total_money ?? 0),
          itemsCount: items.reduce((sum, li) => sum + Number(li.quantity ?? 1), 0) || 1,
          status: r.cancelled_at ? "cancelled" : "completed",
          createdAt: r.receipt_date ?? r.created_at ?? now,
          items: items.map((li) => ({
            productName: li.item_name ?? li.variant_name,
            quantity: Number(li.quantity ?? 1),
            unitPrice: Number(li.price ?? 0),
          })),
        });
      }

      cursor = data.cursor || undefined;
    } while (cursor);

    return {
      success: true,
      ordersImported: orders.length,
      productsImported: 0,
      transactionsImported: orders.length,
      message: orders.length ? `تمت المزامنة: ${orders.length} عملية بيع من Loyverse` : "تمت المزامنة، ما فيه عمليات بيع جديدة",
      syncedAt: now,
      orders,
    };
  }
}

export const loyverseAdapter = new LoyverseAdapter();
