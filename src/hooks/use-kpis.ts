"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { useOrgId } from "@/hooks/use-org-id";
import { computeKPIs } from "@/lib/mock-data/generators";
import type { KPISet } from "@/lib/types/domain";

const EMPTY_KPIS: KPISet = {
  todaySales: 0,
  todaySalesChange: 0,
  weekSales: 0,
  monthSales: 0,
  yearSales: 0,
  revenue: 0,
  netProfit: 0,
  netProfitChange: 0,
  expenses: 0,
  profitMargin: 0,
  taxes: 0,
  orders: 0,
  ordersChange: 0,
  avgOrderValue: 0,
  refunds: 0,
  refundsChange: 0,
};

async function fromSupabase(): Promise<KPISet> {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return EMPTY_KPIS;

  const [ordersRes, expensesRes, refundsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total, status, created_at")
      .eq("org_id", orgId)
      .eq("status", "completed"),
    supabase.from("expenses").select("amount").eq("org_id", orgId),
    supabase.from("refunds").select("amount, orders!inner(org_id)").eq("orders.org_id", orgId),
  ]);

  if (ordersRes.error) throw ordersRes.error;
  if (expensesRes.error) throw expensesRes.error;
  if (refundsRes.error) throw refundsRes.error;

  const orderRows = ordersRes.data ?? [];
  const now = new Date();

  const todaySales = orderRows
    .filter((o) => new Date(o.created_at).toDateString() === now.toDateString())
    .reduce((s, o) => s + Number(o.total), 0);

  const weekSales = orderRows
    .filter((o) => Date.now() - +new Date(o.created_at) < 7 * 86400000)
    .reduce((s, o) => s + Number(o.total), 0);

  const monthSales = orderRows.reduce((s, o) => s + Number(o.total), 0);
  const revenue = monthSales;
  const totalExpenses = (expensesRes.data ?? []).reduce((s, e) => s + Number(e.amount), 0);
  const taxes = Math.round(revenue * 0.15);
  const netProfit = revenue - totalExpenses - taxes;
  const refundsTotal = (refundsRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0);

  return {
    todaySales,
    todaySalesChange: 0,
    weekSales,
    monthSales,
    yearSales: monthSales * 8.4,
    revenue,
    netProfit,
    netProfitChange: 0,
    expenses: totalExpenses,
    profitMargin: revenue > 0 ? Number(((netProfit / revenue) * 100).toFixed(1)) : 0,
    taxes,
    orders: orderRows.length,
    ordersChange: 0,
    avgOrderValue: orderRows.length ? Math.round(revenue / orderRows.length) : 0,
    refunds: refundsTotal,
    refundsChange: 0,
  };
}

export function useKPIs() {
  const supabase = createClient();
  const { data: orgId } = useOrgId();
  return useQuery({
    queryKey: ["kpis", orgId],
    queryFn: async (): Promise<KPISet> => (supabase ? fromSupabase() : computeKPIs()),
    refetchInterval: 60_000,
  });
}
