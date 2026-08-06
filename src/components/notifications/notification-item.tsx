"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, PackageX, ReceiptText, Settings2 } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import type { AppNotification } from "@/lib/types/domain";

const iconMap = {
  sales_up: { icon: TrendingUp, className: "bg-success/10 text-success" },
  sales_down: { icon: TrendingDown, className: "bg-destructive/10 text-destructive" },
  inventory_low: { icon: PackageX, className: "bg-warning/10 text-warning" },
  large_refund: { icon: ReceiptText, className: "bg-destructive/10 text-destructive" },
  system: { icon: Settings2, className: "bg-primary/10 text-primary" },
} as const;

export function NotificationItem({ notification, compact = false }: { notification: AppNotification; compact?: boolean }) {
  const { icon: Icon, className } = iconMap[notification.type];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={cn("flex items-start gap-3 px-3 py-2.5", !notification.read && "bg-primary/[0.03]")}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", className)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", !notification.read && "font-semibold")}>{notification.title}</p>
        <p className={cn("text-xs text-muted-foreground mt-0.5", compact && "line-clamp-2")}>{notification.message}</p>
        <p className="text-[11px] text-muted-foreground/70 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />}
    </motion.div>
  );
}
