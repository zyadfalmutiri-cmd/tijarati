import { BaseConnectorAdapter } from "../../core/base-adapter";
import { getConnector } from "../../core/registry";

/**
 * Square POS adapter — API key (access token) auth.
 * Real integration would call the Square SDK:
 *   squareClient.ordersApi.searchOrders(), squareClient.catalogApi.listCatalog()
 * Requires SQUARE_ACCESS_TOKEN.
 */
export class SquareAdapter extends BaseConnectorAdapter {
  definition = getConnector("square-pos")!;
}

export const squareAdapter = new SquareAdapter();
