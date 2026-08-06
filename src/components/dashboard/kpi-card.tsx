"use client";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  title, value, change, icon: Icon, accent = "primary", suffix, index = 0,
}: {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "destructive";
  suffix?: string;
  index?: number;
}) {
  const accentClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Card className="card-hover h-full">
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", accentClasses[accent])}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
            {typeof change === "number" && (
              <span className={cn("flex items-center gap-0.5 text-xs font-semibold", change >= 0 ? "text-success" : "text-destructive")}>
                {change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(change)}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="number-tabular text-xl lg:text-2xl font-bold tracking-tight">
            {value}{suffix && <span className="text-sm text-muted-foreground font-medium mr-1">{suffix}</span>}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
