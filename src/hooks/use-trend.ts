"use client";
import { useQuery } from "@tanstack/react-query";
import { getTrend } from "@/lib/mock-data/generators";
import type { Granularity } from "@/lib/types/domain";

export function useTrend(granularity: Granularity) {
  return useQuery({
    queryKey: ["trend", granularity],
    queryFn: async () => getTrend(granularity),
  });
}
