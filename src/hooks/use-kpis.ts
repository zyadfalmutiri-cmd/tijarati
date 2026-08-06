"use client";
import { useQuery } from "@tanstack/react-query";
import { computeKPIs } from "@/lib/mock-data/generators";

export function useKPIs() {
  return useQuery({
    queryKey: ["kpis"],
    queryFn: async () => computeKPIs(),
    refetchInterval: 60_000,
  });
}
