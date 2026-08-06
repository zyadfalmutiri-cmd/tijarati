"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrend } from "@/hooks/use-trend";
import { formatCompact, formatCurrency } from "@/lib/utils";
import type { Granularity } from "@/lib/types/domain";

const options: { value: Granularity; label: string }[] = [
  { value: "hourly", label: "بالساعة" }, { value: "daily", label: "يومي" },
  { value: "weekly", label: "أسبوعي" }, { value: "monthly", label: "شهري" }, { value: "yearly", label: "سنوي" },
];

export function TrendExplorer() {
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const { data, isLoading } = useTrend(granularity);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-3 space-y-0">
        <CardTitle>مقارنة الإيرادات والمصروفات والمبيعات</CardTitle>
        <Tabs value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
          <TabsList>{options.map((o) => <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>)}</TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? <Skeleton className="h-[320px] w-full" /> : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="sales" name="المبيعات" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="revenue" name="الإيرادات" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="expenses" name="المصروفات" stroke="hsl(var(--chart-4))" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
