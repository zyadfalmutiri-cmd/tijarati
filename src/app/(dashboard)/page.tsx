"use client";
import {
  Wallet, TrendingUp, Receipt, PiggyBank, Percent, Landmark,
  ShoppingCart, Package, ReceiptText, RefreshCcw,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { LiveSalesCounter } from "@/components/dashboard/live-sales-counter";
import { SalesTrendChart } from "@/components/dashboard/sales-trend-chart";
import { BranchRanking } from "@/components/dashboard/branch-ranking";
import { RevenueExpenseChart } from "@/components/dashboard/revenue-expense-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { useKPIs } from "@/hooks/use-kpis";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { data: kpis } = useKPIs();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiveSalesCounter />
        <KpiCard index={0} title="مبيعات هذا الأسبوع" value={formatCurrency(kpis?.weekSales ?? 0)} icon={TrendingUp} accent="success" />
        <KpiCard index={1} title="مبيعات هذا الشهر" value={formatCurrency(kpis?.monthSales ?? 0)} icon={Wallet} accent="primary" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard index={2} title="الإيرادات" value={formatCurrency(kpis?.revenue ?? 0)} icon={Landmark} change={9.2} />
        <KpiCard index={3} title="صافي الربح" value={formatCurrency(kpis?.netProfit ?? 0)} icon={PiggyBank} change={kpis?.netProfitChange} accent="success" />
        <KpiCard index={4} title="المصروفات" value={formatCurrency(kpis?.expenses ?? 0)} icon={Receipt} accent="warning" />
        <KpiCard index={5} title="هامش الربح" value={`${kpis?.profitMargin ?? 0}`} suffix="%" icon={Percent} accent="success" />
        <KpiCard index={6} title="الضرائب" value={formatCurrency(kpis?.taxes ?? 0)} icon={ReceiptText} accent="warning" />
        <KpiCard index={7} title="عدد الطلبات" value={formatNumber(kpis?.orders ?? 0)} icon={ShoppingCart} change={kpis?.ordersChange} />
        <KpiCard index={8} title="متوسط قيمة الطلب" value={formatCurrency(kpis?.avgOrderValue ?? 0)} icon={Package} accent="primary" />
        <KpiCard index={9} title="المبالغ المستردة" value={formatCurrency(kpis?.refunds ?? 0)} icon={RefreshCcw} change={kpis?.refundsChange} accent="destructive" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SalesTrendChart />
        <BranchRanking />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <RevenueExpenseChart />
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
