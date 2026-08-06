"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Building2, LineChart, Boxes, Users, FileBarChart,
  Plug, Bot, Bell, Settings, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "اللوحة الرئيسية", icon: LayoutDashboard },
  { href: "/branches", label: "الفروع", icon: Building2 },
  { href: "/analytics", label: "التحليلات", icon: LineChart },
  { href: "/inventory", label: "المخزون", icon: Boxes },
  { href: "/employees", label: "الموظفون", icon: Users },
  { href: "/reports", label: "التقارير", icon: FileBarChart },
  { href: "/integrations", label: "التكاملات", icon: Plug },
  { href: "/assistant", label: "المساعد الذكي", icon: Bot },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 right-0 z-40 w-64 flex-col border-l border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 h-16 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-base leading-none text-sidebar-foreground">تجارتي</p>
          <p className="text-[11px] text-muted-foreground mt-1">مجانية بالكامل</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-1">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative block">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 p-4">
          <p className="text-xs font-semibold text-primary">100% مجاني للأبد</p>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            لا اشتراكات، لا رسوم مخفية، لا إعلانات. تحليلات أعمالك كما تستحق.
          </p>
        </div>
      </div>
    </aside>
  );
}
