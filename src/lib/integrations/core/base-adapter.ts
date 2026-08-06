import type { ConnectorAdapter, ConnectorDefinition, ConnectionRecord, SyncResult } from "./types";

/**
 * BaseConnectorAdapter centralizes the boilerplate every adapter needs
 * (timestamps, error wrapping, simulated network I/O in demo mode) so
 * concrete adapters only implement the vendor-specific bits: building the
 * OAuth URL, shaping the API calls, and mapping vendor payloads to our
 * normalized Order/Product/Transaction shapes.
 *
 * In demo mode (no server credentials configured) adapters return
 * realistic simulated results so the Integrations Center is fully
 * interactive without requiring real API keys.
 */
export abstract class BaseConnectorAdapter implements ConnectorAdapter {
  abstract definition: ConnectorDefinition;

  protected simulateLatency(ms = 700) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async connect(params: { code?: string; apiKey?: string; apiSecret?: string; shopDomain?: string }): Promise<ConnectionRecord> {
    await this.simulateLatency();
    return {
      connectorId: this.definition.id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: params.shopDomain ?? params.apiKey?.slice(0, 6).concat("••••") ?? "demo-account",
    };
  }

  async sync(): Promise<SyncResult> {
    await this.simulateLatency(1100);
    return {
      success: true,
      ordersImported: Math.floor(Math.random() * 60) + 5,
      productsImported: Math.floor(Math.random() * 25),
      transactionsImported: Math.floor(Math.random() * 80) + 10,
      message: `تمت المزامنة بنجاح مع ${this.definition.nameAr}`,
      syncedAt: new Date().toISOString(),
    };
  }

  async disconnect(): Promise<void> {
    await this.simulateLatency(300);
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    await this.simulateLatency(400);
    return { ok: true, message: "الاتصال يعمل بشكل طبيعي" };
  }
}
