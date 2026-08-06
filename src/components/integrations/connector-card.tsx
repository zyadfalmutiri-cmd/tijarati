"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Plug, RefreshCw, Unplug } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIntegrationsStore } from "@/store/integrations-store";
import { timeAgo } from "@/lib/utils";
import type { ConnectorDefinition } from "@/lib/integrations/core/types";
import { ConnectDialog } from "./connect-dialog";
import { toast } from "sonner";

const authLabel = { "oauth2": "OAuth", "api-key": "مفتاح API", "file-upload": "رفع ملف" } as const;

export function ConnectorCard({ connector, index }: { connector: ConnectorDefinition; index: number }) {
  const { connections, remove, setSyncing, upsert } = useIntegrationsStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [syncing, setSyncing2] = useState(false);
  const connection = connections[connector.id];
  const status = connection?.status ?? "not_connected";

  async function handleSync() {
    setSyncing2(true);
    setSyncing(connector.id);
    await new Promise((r) => setTimeout(r, 1200));
    upsert({ ...connection, connectorId: connector.id, status: "connected", lastSyncAt: new Date().toISOString() });
    setSyncing2(false);
    toast.success(`تمت مزامنة ${connector.nameAr} بنجاح`);
  }

  function handleDisconnect() {
    remove(connector.id);
    toast.info(`تم فصل ${connector.nameAr}`);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % 12) * 0.03 }}>
        <Card className="card-hover h-full">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white shrink-0" style={{ backgroundColor: connector.color }}>
                  {connector.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{connector.nameAr}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{connector.name}</p>
                </div>
              </div>
              {status === "connected" && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
              {status === "error" && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
              {status === "syncing" && <Loader2 className="h-4 w-4 text-primary shrink-0 animate-spin" />}
            </div>

            <p className="text-xs text-muted-foreground mb-3 flex-1">{connector.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-[10px]">{authLabel[connector.authMethod]}</Badge>
              {!connector.hasAdapter && <Badge variant="secondary" className="text-[10px]">جاهز للتوصيل</Badge>}
            </div>

            {connection && (
              <div className="mb-3 text-[11px] text-muted-foreground space-y-0.5">
                {connection.accountLabel && <p className="truncate">الحساب: {connection.accountLabel}</p>}
                {connection.lastSyncAt && <p>آخر مزامنة: {timeAgo(connection.lastSyncAt)}</p>}
                {connection.lastError && <p className="text-destructive">{connection.lastError}</p>}
              </div>
            )}

            {status === "not_connected" ? (
              <Button size="sm" className="w-full" onClick={() => setDialogOpen(true)}>
                <Plug className="h-3.5 w-3.5" /> ربط
              </Button>
            ) : status === "error" ? (
              <Button size="sm" variant="outline" className="w-full text-destructive" onClick={() => setDialogOpen(true)}>
                <RefreshCw className="h-3.5 w-3.5" /> إعادة الاتصال
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={handleSync} disabled={syncing}>
                  <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} /> مزامنة
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDisconnect}><Unplug className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <ConnectDialog connector={connector} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
