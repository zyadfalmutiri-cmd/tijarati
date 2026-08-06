"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrend } from "@/hooks/use-trend";
import { formatCompact, formatCurrency } from "@/lib/utils";
import type { Granularity } from "@/lib/types/domain";

const options: { value: Granularity; label: string }[] = [
  { value: "hourly", label: "بالساعة" },
  { value: "daily", label: "يومي" },
  { value: "weekly", label: "أسبوعي" },
  { value: "monthly", label: "شهري" },
  { value: "yearly", label: "سنوي" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-glow text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="number-tabular">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export function SalesTrendChart() {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const { data, isLoading } = useTrend(granularity);

  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0 flex-wrap gap-3">
        <div>
          <CardTitle>اتجاه المبيعات</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">تحليل تفاعلي لأداء المبيعات عبر الزمن</p>
        </div>
        <Tabs value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
          <TabsList>
            {options.map((o) => <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" name="المبيعات" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
