import { BaseConnectorAdapter } from "../../core/base-adapter";
import { getConnector } from "../../core/registry";

/**
 * QuickBooks Online adapter — OAuth 2.0 (Intuit).
 * Real integration: https://appcenter.intuit.com/connect/oauth2 then
 * calls against https://quickbooks.api.intuit.com/v3/company/{realmId}/...
 * Requires QUICKBOOKS_CLIENT_ID / QUICKBOOKS_CLIENT_SECRET.
 */
export class QuickBooksAdapter extends BaseConnectorAdapter {
  definition = getConnector("quickbooks")!;

  getAuthUrl(redirectUri: string, state: string) {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID ?? "demo-client-id";
    return `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }
}

export const quickbooksAdapter = new QuickBooksAdapter();
