"use client";
import { useQuery } from "@tanstack/react-query";
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

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: async (): Promise<BranchPerformance[]> => {
      return branches.map((b, i) => {
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
      }).sort((a, b) => b.sales - a.sales);
    },
  });
}
