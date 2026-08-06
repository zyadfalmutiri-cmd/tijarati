"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionRecord } from "@/lib/integrations/core/types";

interface IntegrationsState {
  connections: Record<string, ConnectionRecord>;
  upsert: (record: ConnectionRecord) => void;
  remove: (connectorId: string) => void;
  setSyncing: (connectorId: string) => void;
}

export const useIntegrationsStore = create<IntegrationsState>()(
  persist(
    (set) => ({
      connections: {
        stripe: {
          connectorId: "stripe",
          status: "connected",
          connectedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          lastSyncAt: new Date(Date.now() - 3600_000 * 2).toISOString(),
          accountLabel: "acct_••••8421",
        },
        shopify: {
          connectorId: "shopify",
          status: "connected",
          connectedAt: new Date(Date.now() - 86400000 * 40).toISOString(),
          lastSyncAt: new Date(Date.now() - 3600_000 * 5).toISOString(),
          accountLabel: "tijarati-demo.myshopify.com",
        },
        tap: {
          connectorId: "tap",
          status: "error",
          connectedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
          lastSyncAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          lastError: "انتهت صلاحية بيانات الاعتماد، يرجى إعادة الاتصال",
          accountLabel: "merchant_774",
        },
      },
      upsert: (record) =>
        set((s) => ({ connections: { ...s.connections, [record.connectorId]: record } })),
      remove: (connectorId) =>
        set((s) => {
          const next = { ...s.connections };
          delete next[connectorId];
          return { connections: next };
        }),
      setSyncing: (connectorId) =>
        set((s) => ({
          connections: {
            ...s.connections,
            [connectorId]: { ...s.connections[connectorId], status: "syncing" },
          },
        })),
    }),
    { name: "tijarati-integrations" }
  )
);
