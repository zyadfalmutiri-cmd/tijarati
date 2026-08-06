"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { TrendingUp, TrendingDown } from "lucide-react";

export function BestWorstSellers() {
  const { data: products = [] } = useProducts();
  const sorted = [...products].sort((a, b) => b.unitsSoldLast30Days - a.unitsSoldLast30Days);
  const best = sorted.slice(0, 5);
  const worst = sorted.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <TrendingUp className="h-4 w-4 text-success" /><CardTitle>الأكثر مبيعًا</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {best.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{i + 1}. {p.name}</span>
              <span className="font-semibold number-tabular shrink-0">{p.unitsSoldLast30Days} وحدة</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <TrendingDown className="h-4 w-4 text-destructive" /><CardTitle>الأقل مبيعًا</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {worst.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{i + 1}. {p.name}</span>
              <span className="font-semibold number-tabular shrink-0">{p.unitsSoldLast30Days} وحدة</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
