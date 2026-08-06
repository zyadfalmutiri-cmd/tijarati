"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranches } from "@/hooks/use-branches";
import { BranchCard } from "@/components/branches/branch-card";
import { BranchComparisonChart } from "@/components/branches/branch-comparison-chart";
import { BranchMap } from "@/components/branches/branch-map";

export default function BranchesPage() {
  const { data: branches, isLoading } = useBranches();
  const maxSales = Math.max(...(branches?.map((b) => b.sales) ?? [1]), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><BranchComparisonChart branches={branches ?? []} /></div>
        <BranchMap branches={branches ?? []} />
      </div>

      <div>
        <h2 className="text-base font-bold mb-4">جميع الفروع ({branches?.length ?? 0})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading || !branches
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)
            : branches.map((b, i) => <BranchCard key={b.id} branch={b} index={i} maxSales={maxSales} />)}
        </div>
      </div>
    </div>
  );
}
