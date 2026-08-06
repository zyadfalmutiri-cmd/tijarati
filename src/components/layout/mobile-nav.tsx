"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import {
  LayoutDashboard, Building2, LineChart, Boxes, Users, FileBarChart,
  Plug, Bot, Bell, Settings,
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

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent">
        <Menu className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 w-72 bg-sidebar border-l border-sidebar-border p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="font-bold">تجارتي</p>
                </div>
                <button onClick={() => setOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-1 overflow-y-auto">
                {nav.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                      className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium", active ? "bg-primary/10 text-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/5")}>
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
