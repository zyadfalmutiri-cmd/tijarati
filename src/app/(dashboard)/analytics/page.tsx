import { TrendExplorer } from "@/components/analytics/trend-explorer";
import { CustomerGrowthChart } from "@/components/analytics/customer-growth-chart";
import { ProductPerformanceChart } from "@/components/analytics/product-performance-chart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <TrendExplorer />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CustomerGrowthChart />
        <ProductPerformanceChart />
      </div>
    </div>
  );
}
