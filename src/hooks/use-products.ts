"use client";
import { useQuery } from "@tanstack/react-query";
import { products } from "@/lib/mock-data/generators";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: async () => products });
}
