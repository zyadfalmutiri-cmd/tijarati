"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications as seedNotifications } from "@/lib/mock-data/generators";
import type { AppNotification } from "@/lib/types/domain";

const liveMessages: Omit<AppNotification, "id" | "createdAt" | "read">[] = [
  { type: "sales_up", title: "ارتفاع في المبيعات", message: "فرع الدمام - الشاطئ سجّل ارتفاعًا بنسبة 14% في الساعة الأخيرة" },
  { type: "system", title: "طلب جديد", message: "تم استلام طلب جديد عبر متجر Shopify بقيمة 340 ر.س" },
  { type: "inventory_low", title: "تنبيه مخزون منخفض", message: "منتج \"ساعة ذكية X2\" أوشك على النفاد" },
];

export function useNotifications() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => seedNotifications,
    staleTime: Infinity,
  });

  // Simulate real-time notifications arriving in the background.
  useEffect(() => {
    const interval = setInterval(() => {
      const template = liveMessages[Math.floor(Math.random() * liveMessages.length)];
      queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) => [
        { ...template, id: `live-${Date.now()}`, createdAt: new Date().toISOString(), read: false },
        ...old,
      ]);
    }, 45_000);
    return () => clearInterval(interval);
  }, [queryClient]);

  return query;
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) => old.map((n) => ({ ...n, read: true })));
}
