import { BaseConnectorAdapter } from "../../core/base-adapter";
import { getConnector } from "../../core/registry";
import type { ConnectionRecord } from "../../core/types";

/**
 * WooCommerce adapter — REST API Consumer Key/Secret auth.
 * Real integration: GET https://{store}/wp-json/wc/v3/orders with
 * Basic Auth using WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET.
 */
export class WooCommerceAdapter extends BaseConnectorAdapter {
  definition = getConnector("woocommerce")!;

  async connect(params: { apiKey?: string; apiSecret?: string; shopDomain?: string }): Promise<ConnectionRecord> {
    await this.simulateLatency();
    return {
      connectorId: this.definition.id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: params.shopDomain ?? "mystore.com",
    };
  }
}

export const wooCommerceAdapter = new WooCommerceAdapter();
