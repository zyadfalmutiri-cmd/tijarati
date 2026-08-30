"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { useOrgId } from "@/hooks/use-org-id";
import { products } from "@/lib/mock-data/generators";
import type { Product } from "@/lib/types/domain";

async function fromSupabase(): Promise<Product[]> {
  const supabase = createClient()!;
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return [];

  const { data, error } = await supabase.from("products").select("*").eq("org_id", orgId);
  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku ?? "",
    category: p.category ?? "",
    price: Number(p.price),
    cost: Number(p.cost),
    stock: p.stock,
    reorderLevel: p.reorder_level,
    unitsSoldLast30Days: 0, // derived from inventory_movements once that view exists
    branchId: p.branch_id ?? "",
  }));
}

export function useProducts() {
  const supabase = createClient();
  const { data: orgId } = useOrgId();
  return useQuery({
    queryKey: ["products", orgId],
    queryFn: async (): Promise<Product[]> => (supabase ? fromSupabase() : products),
  });
}
