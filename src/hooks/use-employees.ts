"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { employees, branches } from "@/lib/mock-data/generators";

async function fromSupabase() {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return [];

  const [employeesRes, branchesRes] = await Promise.all([
    supabase.from("employees").select("*").eq("org_id", orgId),
    supabase.from("branches").select("id, name").eq("org_id", orgId),
  ]);
  if (employeesRes.error) throw employeesRes.error;
  if (branchesRes.error) throw branchesRes.error;

  const branchNames = new Map((branchesRes.data ?? []).map((b) => [b.id, b.name]));
  const avatarColors = ["#6D5EF7", "#22C58B", "#F5A524", "#EC4899", "#0EA5E9", "#F43F5E"];

  return (employeesRes.data ?? [])
    .map((e, i) => ({
      id: e.id,
      name: e.name,
      role: e.role ?? "",
      branchId: e.branch_id ?? "",
      branchName: branchNames.get(e.branch_id) ?? "",
      avatarColor: avatarColors[i % avatarColors.length],
      salesTotal: Number(e.sales_total),
      ordersHandled: e.orders_handled,
      attendanceRate: Number(e.attendance_rate),
      productivityScore: Number(e.productivity_score),
    }))
    .sort((a, b) => b.salesTotal - a.salesTotal);
}

function fromMock() {
  return employees
    .map((e) => ({ ...e, branchName: branches.find((b) => b.id === e.branchId)?.name ?? "" }))
    .sort((a, b) => b.salesTotal - a.salesTotal);
}

export function useEmployees() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => (supabase ? fromSupabase() : fromMock()),
  });
}
