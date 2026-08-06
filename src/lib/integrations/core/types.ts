// ============================================================================
// Core Integration Architecture
// ----------------------------------------------------------------------------
// Every external system (e-commerce, POS, payments, accounting, banking,
// shipping, marketing, data import) is represented as a `ConnectorDefinition`
// (static metadata for the marketplace UI) plus a `ConnectorAdapter`
// (runtime logic implementing a shared contract). Adding a new integration
// never touches the core app: you only add a new folder under
// `lib/integrations/adapters/<name>` and register it in `registry.ts`.
// ============================================================================

export type ConnectorCategory =
  | "ecommerce"
  | "pos"
  | "payments"
  | "accounting"
  | "banking"
  | "shipping"
  | "marketing"
  | "data-import";

export type AuthMethod = "oauth2" | "api-key" | "file-upload";

export type ConnectionStatus = "not_connected" | "connected" | "error" | "syncing";

export interface ConnectorDefinition {
  id: string; // unique slug, e.g. "shopify"
  name: string;
  nameAr: string;
  category: ConnectorCategory;
  authMethod: AuthMethod;
  description: string;
  color: string; // brand accent used for the marketplace card
  docsUrl?: string;
  /** Whether a fully working adapter class exists in /adapters, or the
   * connector is currently registry-only (still shown in the marketplace,
   * "قريبًا" style, ready for an adapter to be dropped in). */
  hasAdapter: boolean;
}

export interface SyncResult {
  success: boolean;
  ordersImported: number;
  productsImported: number;
  transactionsImported: number;
  message: string;
  syncedAt: string;
}

export interface ConnectionRecord {
  connectorId: string;
  status: ConnectionStatus;
  connectedAt?: string;
  lastSyncAt?: string;
  lastError?: string;
  accountLabel?: string; // e.g. store domain or account email
}

/** Every adapter must implement this contract so the core app (sync engine,
 * dashboard aggregation, notifications) can treat all integrations uniformly
 * regardless of the vendor's actual API shape. */
export interface ConnectorAdapter {
  definition: ConnectorDefinition;

  /** Build the OAuth authorization URL (oauth2 connectors only). */
  getAuthUrl?(redirectUri: string, state: string): string;

  /** Exchange an OAuth code, or validate an API key, and persist credentials. */
  connect(params: { code?: string; apiKey?: string; apiSecret?: string; shopDomain?: string }): Promise<ConnectionRecord>;

  /** Pull the latest orders/products/transactions since the last sync. */
  sync(): Promise<SyncResult>;

  /** Revoke credentials / disconnect. */
  disconnect(): Promise<void>;

  /** Lightweight health check used to power the "connection status" badge. */
  testConnection(): Promise<{ ok: boolean; message: string }>;
}
