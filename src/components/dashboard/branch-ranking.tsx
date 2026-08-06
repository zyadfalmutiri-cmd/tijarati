"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useBranches } from "@/hooks/use-branches";
import { formatCurrency } from "@/lib/utils";

export function BranchRanking() {
  const { data: branches, isLoading } = useBranches();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>ترتيب الفروع</CardTitle>
        <Link href="/branches" className="text-xs text-primary hover:underline">عرض الكل</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading || !branches
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
          : branches.slice(0, 5).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.city}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="text-sm font-bold number-tabular">{formatCurrency(b.sales)}</p>
                  <Badge variant={b.growth >= 0 ? "success" : "destructive"} className="mt-0.5">
                    {b.growth >= 0 ? "+" : ""}{b.growth}%
                  </Badge>
                </div>
              </motion.div>
            ))}
      </CardContent>
    </Card>
  );
}
