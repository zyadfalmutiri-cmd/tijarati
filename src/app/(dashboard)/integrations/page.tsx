"use client";
import { useMemo, useState } from "react";
import { Plug, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { connectorRegistry, categoryLabels } from "@/lib/integrations/core/registry";
import type { ConnectorCategory } from "@/lib/integrations/core/types";
import { ConnectorCard } from "@/components/integrations/connector-card";
import { useIntegrationsStore } from "@/store/integrations-store";
import { Search } from "lucide-react";

const categories: (ConnectorCategory | "all")[] = ["all", "ecommerce", "pos", "payments", "accounting", "banking", "shipping", "marketing", "data-import"];

export default function IntegrationsPage() {
  const [category, setCategory] = useState<ConnectorCategory | "all">("all");
  const [query, setQuery] = useState("");
  const { connections } = useIntegrationsStore();

  const filtered = useMemo(() => {
    return connectorRegistry.filter((c) => {
      const matchesCategory = category === "all" || c.category === category;
      const matchesQuery = !query || c.nameAr.includes(query) || c.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const connectedCount = Object.values(connections).filter((c) => c.status === "connected").length;
  const errorCount = Object.values(connections).filter((c) => c.status === "error").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Plug className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">إجمالي التكاملات المتاحة</p><p className="text-xl font-bold">{connectorRegistry.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success"><CheckCircle2 className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">متصلة حاليًا</p><p className="text-xl font-bold">{connectedCount}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive"><AlertCircle className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">بحاجة لإعادة الاتصال</p><p className="text-xl font-bold">{errorCount}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">الكل</TabsTrigger>
            {categories.filter((c) => c !== "all").map((c) => <TabsTrigger key={c} value={c}>{categoryLabels[c as ConnectorCategory]}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="ابحث عن خدمة..." value={query} onChange={(e) => setQuery(e.target.value)} className="pr-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c, i) => <ConnectorCard key={c.id} connector={c} index={i} />)}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">لا توجد نتائج مطابقة</p>}
    </div>
  );
}
