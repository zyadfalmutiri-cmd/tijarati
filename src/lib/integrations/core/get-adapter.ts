import { BaseConnectorAdapter } from "./base-adapter";
import { adapterMap } from "../adapters/registry-map";
import { getConnector } from "./registry";
import type { ConnectorAdapter, ConnectorDefinition } from "./types";

class GenericAdapter extends BaseConnectorAdapter {
  definition: ConnectorDefinition;
  constructor(def: ConnectorDefinition) {
    super();
    this.definition = def;
  }
}

/** Resolve a connector id to its adapter — concrete implementation if one
 * exists, otherwise a fully functional generic adapter so every connector
 * in the marketplace is immediately connectable in demo mode. */
export function getAdapter(connectorId: string): ConnectorAdapter | null {
  if (adapterMap[connectorId]) return adapterMap[connectorId];
  const def = getConnector(connectorId);
  if (!def) return null;
  return new GenericAdapter(def);
}
