"use client";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIntegrationsStore } from "@/store/integrations-store";
import type { ConnectorDefinition } from "@/lib/integrations/core/types";
import { toast } from "sonner";

export function ConnectDialog({
  connector, open, onOpenChange,
}: { connector: ConnectorDefinition; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { upsert } = useIntegrationsStore();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [shopDomain, setShopDomain] = useState("");

  async function handleConnect() {
    setLoading(true);
    // In production this calls POST /api/integrations/[connector]/connect
    // which invokes the matching ConnectorAdapter.connect(). For OAuth
    // connectors that instead redirects to getAuthUrl().
    await new Promise((r) => setTimeout(r, 1100));
    upsert({
      connectorId: connector.id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: connector.authMethod === "oauth2" ? (shopDomain || `${connector.id}-account`) : apiKey ? `${apiKey.slice(0, 6)}••••` : "demo-account",
    });
    setLoading(false);
    onOpenChange(false);
    toast.success(`تم الاتصال بـ ${connector.nameAr} بنجاح`, { description: "بدأت المزامنة الأولى في الخلفية" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ربط {connector.nameAr}</DialogTitle>
          <DialogDescription>
            {connector.authMethod === "oauth2"
              ? "سيتم توجيهك لصفحة تسجيل الدخول الرسمية للخدمة لمنح الأذونات اللازمة."
              : connector.authMethod === "file-upload"
              ? "ارفع الملف لبدء استيراد بياناتك مباشرة."
              : "أدخل مفتاح API الخاص بحسابك لبدء المزامنة."}
          </DialogDescription>
        </DialogHeader>

        {connector.authMethod === "oauth2" && (
          <div className="space-y-2">
            <Label htmlFor="domain">نطاق/معرّف المتجر (اختياري)</Label>
            <Input id="domain" placeholder={`example.${connector.id}.com`} value={shopDomain} onChange={(e) => setShopDomain(e.target.value)} />
          </div>
        )}

        {connector.authMethod === "api-key" && (
          <div className="space-y-2">
            <Label htmlFor="apikey">مفتاح API</Label>
            <Input id="apikey" type="password" placeholder="sk_live_••••••••••" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
        )}

        {connector.authMethod === "file-upload" && (
          <div className="rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
            اسحب الملف هنا أو انقر للاختيار
          </div>
        )}

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-success shrink-0" />
          بياناتك مشفّرة ولن تُستخدم لأي غرض تسويقي أو إعلاني.
        </div>

        <DialogFooter>
          <Button onClick={handleConnect} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "جارٍ الاتصال..." : "ربط الآن"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
