import { BaseConnectorAdapter } from "../../core/base-adapter";
import { getConnector } from "../../core/registry";
import type { ConnectionRecord } from "../../core/types";

/**
 * Shopify adapter — OAuth 2.0.
 * Real integration would call:
 *   GET https://{shop}.myshopify.com/admin/oauth/authorize
 *   POST https://{shop}.myshopify.com/admin/oauth/access_token
 *   GET  https://{shop}.myshopify.com/admin/api/2024-07/orders.json
 * Requires SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET env vars.
 */
export class ShopifyAdapter extends BaseConnectorAdapter {
  definition = getConnector("shopify")!;

  getAuthUrl(redirectUri: string, state: string) {
    const clientId = process.env.SHOPIFY_CLIENT_ID ?? "demo-client-id";
    const scopes = ["read_orders", "read_products", "read_customers", "read_inventory"].join(",");
    return `https://{shop}.myshopify.com/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }

  async connect(params: { code?: string; shopDomain?: string }): Promise<ConnectionRecord> {
    await this.simulateLatency();
    return {
      connectorId: this.definition.id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: params.shopDomain ?? "demo-store.myshopify.com",
    };
  }
}

export const shopifyAdapter = new ShopifyAdapter();
