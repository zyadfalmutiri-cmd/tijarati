"use client";
import { useQuery } from "@tanstack/react-query";
import { orders } from "@/lib/mock-data/generators";

export function useOrders(limit?: number) {
  return useQuery({
    queryKey: ["orders", limit],
    queryFn: async () => (limit ? orders.slice(0, limit) : orders),
  });
}
