"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { getTrend } from "@/lib/mock-data/generators";
import type { Granularity, TrendPoint } from "@/lib/types/domain";

const dayLabels = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const monthLabels = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function bucketKey(date: Date, granularity: Granularity): { key: string; label: string } {
  switch (granularity) {
    case "hourly":
      return { key: String(date.getHours()), label: `${date.getHours()}:00` };
    case "daily":
      return { key: String(date.getDay()), label: dayLabels[date.getDay()] };
    case "weekly": {
      const week = Math.ceil(date.getDate() / 7);
      return { key: `w${week}`, label: `الأسبوع ${week}` };
    }
    case "monthly":
      return { key: String(date.getMonth()), label: monthLabels[date.getMonth()] };
    case "yearly":
      return { key: String(date.getFullYear()), label: String(date.getFullYear()) };
  }
}

async function fromSupabase(granularity: Granularity): Promise<TrendPoint[]> {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return [];

  const [ordersRes, expensesRes] = await Promise.all([
    supabase.from("orders").select("total, created_at").eq("org_id", orgId).eq("status", "completed"),
    supabase.from("expenses").select("amount, date").eq("org_id", orgId),
  ]);
  if (ordersRes.error) throw ordersRes.error;
  if (expensesRes.error) throw expensesRes.error;

  const buckets = new Map<string, TrendPoint>();

  for (const o of ordersRes.data ?? []) {
    const { key, label } = bucketKey(new Date(o.created_at), granularity);
    const point = buckets.get(key) ?? { label, sales: 0, revenue: 0, expenses: 0, customers: 0 };
    point.sales += Number(o.total);
    point.revenue = (point.revenue ?? 0) + Number(o.total);
    point.customers = (point.customers ?? 0) + 1;
    buckets.set(key, point);
  }

  for (const e of expensesRes.data ?? []) {
    const { key, label } = bucketKey(new Date(e.date), granularity);
    const point = buckets.get(key) ?? { label, sales: 0, revenue: 0, expenses: 0, customers: 0 };
    point.expenses = (point.expenses ?? 0) + Number(e.amount);
    buckets.set(key, point);
  }

  return Array.from(buckets.values());
}

export function useTrend(granularity: Granularity) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["trend", granularity],
    queryFn: async (): Promise<TrendPoint[]> =>
      supabase ? fromSupabase(granularity) : getTrend(granularity),
  });
}
