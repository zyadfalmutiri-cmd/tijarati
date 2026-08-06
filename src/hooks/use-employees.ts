"use client";
import { useQuery } from "@tanstack/react-query";
import { employees, branches } from "@/lib/mock-data/generators";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () =>
      employees
        .map((e) => ({ ...e, branchName: branches.find((b) => b.id === e.branchId)?.name ?? "" }))
        .sort((a, b) => b.salesTotal - a.salesTotal),
  });
}
