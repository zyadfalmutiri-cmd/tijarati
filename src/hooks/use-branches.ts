"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { useOrgId } from "@/hooks/use-org-id";
import { branches, orders, expenses } from "@/lib/mock-data/generators";

export interface BranchPerformance {
  id: string;
  name: string;
  city: string;
  manager: string;
  status: "active" | "paused";
  lat: number;
  lng: number;
  sales: number;
  orders: number;
  expenses: number;
  profit: number;
  growth: number;
}

function fromMock(): BranchPerformance[] {
  return branches
    .map((b, i) => {
      const branchOrders = orders.filter((o) => o.branchId === b.id && o.status === "completed");
      const sales = branchOrders.reduce((s, o) => s + o.total, 0);
      const branchExpenses = expenses.filter((e) => e.branchId === b.id).reduce((s, e) => s + e.amount, 0);
      return {
        id: b.id,
        name: b.name,
        city: b.city,
        manager: b.manager,
        status: b.status,
        lat: b.lat,
        lng: b.lng,
        sales,
        orders: branchOrders.length,
        expenses: branchExpenses,
        profit: sales - branchExpenses,
        growth: Number((((i * 7) % 23) - 6 + (sales % 10)).toFixed(1)),
      };
    })
    .sort((a, b) => b.sales - a.sales);
}

async function fromSupabase(): Promise<BranchPerformance[]> {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return [];

  const [branchesRes, ordersRes, expensesRes] = await Promise.all([
    supabase.from("branches").select("*").eq("org_id", orgId),
    supabase.from("orders").select("branch_id, total, status").eq("org_id", orgId).eq("status", "completed"),
    supabase.from("expenses").select("branch_id, amount").eq("org_id", orgId),
  ]);

  if (branchesRes.error) throw branchesRes.error;
  if (ordersRes.error) throw ordersRes.error;
  if (expensesRes.error) throw expensesRes.error;

  const branchRows = branchesRes.data ?? [];
  const orderRows = ordersRes.data ?? [];
  const expenseRows = expensesRes.data ?? [];

  return branchRows
    .map((b, i) => {
      const branchOrders = orderRows.filter((o) => o.branch_id === b.id);
      const sales = branchOrders.reduce((s, o) => s + Number(o.total), 0);
      const branchExpenses = expenseRows
        .filter((e) => e.branch_id === b.id)
        .reduce((s, e) => s + Number(e.amount), 0);
      return {
        id: b.id,
        name: b.name,
        city: b.city ?? "",
        manager: b.manager ?? "",
        status: b.status,
        lat: b.lat ?? 0,
        lng: b.lng ?? 0,
        sales,
        orders: branchOrders.length,
        expenses: branchExpenses,
        profit: sales - branchExpenses,
        growth: Number((((i * 7) % 23) - 6 + (sales % 10)).toFixed(1)),
      };
    })
    .sort((a, b) => b.sales - a.sales);
}

export function useBranches() {
  const supabase = createClient();
  const { data: orgId } = useOrgId();
  return useQuery({
    queryKey: ["branches", orgId],
    queryFn: async (): Promise<BranchPerformance[]> => (supabase ? fromSupabase() : fromMock()),
  });
}
