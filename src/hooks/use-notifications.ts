"use client";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { notifications as seedNotifications } from "@/lib/mock-data/generators";
import type { AppNotification } from "@/lib/types/domain";

// Demo-mode only: fake live notifications so the mock dashboard feels alive.
const liveMessages: Omit<AppNotification, "id" | "createdAt" | "read">[] = [
  { type: "sales_up", title: "ارتفاع في المبيعات", message: "فرع الدمام - الشاطئ سجّل ارتفاعًا بنسبة 14% في الساعة الأخيرة" },
  { type: "system", title: "طلب جديد", message: "تم استلام طلب جديد عبر متجر Shopify بقيمة 340 ر.س" },
  { type: "inventory_low", title: "تنبيه مخزون منخفض", message: "منتج \"ساعة ذكية X2\" أوشك على النفاد" },
];

async function fromSupabase(): Promise<AppNotification[]> {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    createdAt: n.created_at,
    read: n.read,
    branchId: n.branch_id ?? undefined,
  }));
}

export function useNotifications() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<AppNotification[]> => (supabase ? fromSupabase() : seedNotifications),
    staleTime: supabase ? 30_000 : Infinity,
  });

  // Demo mode only — real deployments get real notifications from the DB.
  useEffect(() => {
    if (supabase) return;
    const interval = setInterval(() => {
      const template = liveMessages[Math.floor(Math.random() * liveMessages.length)];
      queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) => [
        { ...template, id: `live-${Date.now()}`, createdAt: new Date().toISOString(), read: false },
        ...old,
      ]);
    }, 45_000);
    return () => clearInterval(interval);
  }, [supabase, queryClient]);

  return query;
}

export function useMarkAllRead() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return async () => {
    if (supabase) {
      const orgId = await getCurrentOrgId(supabase);
      if (orgId) {
        await supabase.from("notifications").update({ read: true }).eq("org_id", orgId).eq("read", false);
      }
    }
    queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) => old.map((n) => ({ ...n, read: true })));
  };
}
