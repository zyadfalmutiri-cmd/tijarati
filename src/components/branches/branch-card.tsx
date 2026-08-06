"use client";
import { motion } from "framer-motion";
import { Building2, TrendingUp, TrendingDown, ShoppingBag, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { BranchPerformance } from "@/hooks/use-branches";
import { formatCurrency } from "@/lib/utils";

export function BranchCard({ branch, index, maxSales }: { branch: BranchPerformance; index: number; maxSales: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="card-hover h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{branch.name}</p>
                <p className="text-xs text-muted-foreground">{branch.city} · {branch.manager}</p>
              </div>
            </div>
            <Badge variant={branch.status === "active" ? "success" : "secondary"}>
              {branch.status === "active" ? "نشط" : "متوقف"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> المبيعات</p>
              <p className="text-base font-bold number-tabular mt-0.5">{formatCurrency(branch.sales)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> الطلبات</p>
              <p className="text-base font-bold number-tabular mt-0.5">{branch.orders}</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>نسبة من أعلى فرع</span>
              <span>{Math.round((branch.sales / maxSales) * 100)}%</span>
            </div>
            <Progress value={(branch.sales / maxSales) * 100} />
          </div>

          <div className={`flex items-center gap-1 text-xs font-medium ${branch.growth >= 0 ? "text-success" : "text-destructive"}`}>
            {branch.growth >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {branch.growth >= 0 ? "+" : ""}{branch.growth}% مقارنة بالشهر الماضي
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
