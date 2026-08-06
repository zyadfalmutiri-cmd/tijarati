import { BaseConnectorAdapter } from "../../core/base-adapter";
import { getConnector } from "../../core/registry";
import type { ConnectionRecord, SyncResult } from "../../core/types";

/**
 * Stripe adapter — Secret API key auth.
 * Real integration would call the Stripe SDK:
 *   stripe.charges.list(), stripe.balanceTransactions.list(), stripe.refunds.list()
 * Requires STRIPE_API_KEY (server-side secret, never exposed to the client).
 */
export class StripeAdapter extends BaseConnectorAdapter {
  definition = getConnector("stripe")!;

  async connect(params: { apiKey?: string }): Promise<ConnectionRecord> {
    await this.simulateLatency();
    if (params.apiKey && !params.apiKey.startsWith("sk_") && !params.apiKey.startsWith("demo")) {
      return { connectorId: this.definition.id, status: "error", lastError: "مفتاح API غير صالح، يجب أن يبدأ بـ sk_" };
    }
    return {
      connectorId: this.definition.id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: "acct_••••8421",
    };
  }

  async sync(): Promise<SyncResult> {
    await this.simulateLatency(900);
    return {
      success: true,
      ordersImported: 0,
      productsImported: 0,
      transactionsImported: Math.floor(Math.random() * 120) + 30,
      message: "تمت مزامنة معاملات Stripe والمبالغ المستردة",
      syncedAt: new Date().toISOString(),
    };
  }
}

export const stripeAdapter = new StripeAdapter();
