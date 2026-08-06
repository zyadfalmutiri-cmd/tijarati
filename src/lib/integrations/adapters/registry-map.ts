import { shopifyAdapter } from "./shopify";
import { stripeAdapter } from "./stripe";
import { quickbooksAdapter } from "./quickbooks";
import { squareAdapter } from "./square";
import { wooCommerceAdapter } from "./woocommerce";
import type { ConnectorAdapter } from "../core/types";

// Maps connector id -> concrete adapter instance. Connectors without a
// concrete adapter yet fall back to a generic BaseConnectorAdapter instance
// created on demand (see getAdapter), so every registry entry is clickable
// and functional in the demo even before its dedicated class is written.
export const adapterMap: Record<string, ConnectorAdapter> = {
  shopify: shopifyAdapter,
  stripe: stripeAdapter,
  quickbooks: quickbooksAdapter,
  "square-pos": squareAdapter,
  woocommerce: wooCommerceAdapter,
};
