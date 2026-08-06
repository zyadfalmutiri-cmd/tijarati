"use client";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useProducts } from "@/hooks/use-products";

export function LowStockAlert() {
  const { data: products } = useProducts();
  const lowStock = products?.filter((p) => p.stock <= p.reorderLevel) ?? [];
  if (lowStock.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-warning">تنبيه مخزون منخفض</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {lowStock.length} منتج بحاجة لإعادة الطلب: {lowStock.slice(0, 3).map((p) => p.name).join("، ")}
          {lowStock.length > 3 ? ` و${lowStock.length - 3} آخرين` : ""}
        </p>
      </div>
    </motion.div>
  );
}
