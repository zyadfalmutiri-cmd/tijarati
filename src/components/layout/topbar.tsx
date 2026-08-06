"use client";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { NotificationsBell } from "./notifications-bell";
import { UserMenu } from "./user-menu";
import { LiveBadge } from "@/components/dashboard/live-badge";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "اللوحة الرئيسية", subtitle: "نظرة شاملة على أداء أعمالك اليوم" },
  "/branches": { title: "إدارة الفروع", subtitle: "قارن وصنّف أداء جميع فروعك" },
  "/analytics": { title: "التحليلات", subtitle: "رؤى تفاعلية وعميقة حول بيانات أعمالك" },
  "/inventory": { title: "المخزون", subtitle: "تتبّع المخزون والحركة والتنبيهات" },
  "/employees": { title: "الموظفون", subtitle: "أداء وإنتاجية وحضور فريقك" },
  "/reports": { title: "التقارير", subtitle: "أنشئ وصدّر تقارير احترافية" },
  "/integrations": { title: "مركز التكاملات", subtitle: "اربط متاجرك وأنظمتك في دقائق" },
  "/assistant": { title: "المساعد الذكي", subtitle: "اسأل عن أعمالك واحصل على إجابات فورية" },
  "/notifications": { title: "الإشعارات", subtitle: "كل التنبيهات المهمة في مكان واحد" },
  "/settings": { title: "الإعدادات", subtitle: "تخصيص حسابك ومنصتك" },
};

export function Topbar() {
  const pathname = usePathname();
  const base = Object.keys(titles).find((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k))) ?? "/";
  const { title, subtitle } = titles[base];

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileNav />
          <div>
            <h1 className="text-base lg:text-lg font-bold leading-tight">{title}</h1>
            <p className="hidden sm:block text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LiveBadge />
          <ThemeToggle />
          <NotificationsBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
