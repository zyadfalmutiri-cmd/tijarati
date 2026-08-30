"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { useOrgId } from "@/hooks/use-org-id";
import { orders } from "@/lib/mock-data/generators";
import type { Order } from "@/lib/types/domain";

async function fromSupabase(limit?: number): Promise<Order[]> {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return [];

  let query = supabase.from("orders").select("*").eq("org_id", orgId).order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((o) => ({
    id: o.id,
    branchId: o.branch_id ?? "",
    customerName: o.customer_name ?? "",
    total: Number(o.total),
    itemsCount: o.items_count,
    status: o.status,
    channel: o.channel,
    createdAt: o.created_at,
  }));
}

export function useOrders(limit?: number) {
  const supabase = createClient();
  const { data: orgId } = useOrgId();
  return useQuery({
    queryKey: ["orders", orgId, limit],
    queryFn: async (): Promise<Order[]> =>
      supabase ? fromSupabase(limit) : limit ? orders.slice(0, limit) : orders,
  });
}
