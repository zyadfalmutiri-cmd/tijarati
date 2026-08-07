"use client";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Boxes, Wallet, AlertTriangle, PackageCheck } from "lucide-react";
import { LowStockAlert } from "@/components/inventory/low-stock-alert";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryMovementChart } from "@/components/inventory/inventory-movement-chart";
import { BestWorstSellers } from "@/components/inventory/best-worst-sellers";
import { AddProductDialog } from "@/components/inventory/add-product-dialog";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function InventoryPage() {
  const { data: products = [] } = useProducts();
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const stockValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.reorderLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <AddProductDialog />
      </div>
      <LowStockAlert />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard index={0} title="إجمالي الكمية" value={formatNumber(totalStock)} icon={Boxes} accent="primary" />
        <KpiCard index={1} title="قيمة المخزون" value={formatCurrency(stockValue)} icon={Wallet} accent="success" />
        <KpiCard index={2} title="منتجات منخفضة" value={formatNumber(lowStockCount)} icon={AlertTriangle} accent="warning" />
        <KpiCard index={3} title="إجمالي المنتجات" value={formatNumber(products.length)} icon={PackageCheck} accent="primary" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><InventoryMovementChart /></div>
      </div>
      <BestWorstSellers />
      <InventoryTable />
    </div>
  );
}
