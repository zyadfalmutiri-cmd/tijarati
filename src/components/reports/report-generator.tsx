"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, FileDown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useOrders } from "@/hooks/use-orders";
import { useBranches } from "@/hooks/use-branches";
import { useEmployees } from "@/hooks/use-employees";
import { useKPIs } from "@/hooks/use-kpis";
import { exportToCSV } from "@/lib/export/csv";
import { exportToExcel } from "@/lib/export/excel";
import { exportToPDF } from "@/lib/export/pdf";
import { formatCurrency } from "@/lib/utils";

const reportTypes = [
  { value: "sales", label: "تقرير المبيعات" },
  { value: "branches", label: "تقرير الفروع" },
  { value: "employees", label: "تقرير الموظفين" },
  { value: "financial", label: "تقرير مالي شامل" },
];

export function ReportGenerator() {
  const [reportType, setReportType] = useState("sales");
  const { data: orders = [] } = useOrders();
  const { data: branches = [] } = useBranches();
  const { data: employees = [] } = useEmployees();
  const { data: kpis } = useKPIs();

  function buildRows() {
    switch (reportType) {
      case "sales":
        return orders.slice(0, 200).map((o) => ({
          "رقم الطلب": o.id, العميل: o.customerName, الفرع: o.branchId,
          القيمة: o.total, الحالة: o.status, التاريخ: new Date(o.createdAt).toLocaleDateString("en-GB"),
        }));
      case "branches":
        return branches.map((b) => ({ الفرع: b.name, المدينة: b.city, المبيعات: b.sales, الطلبات: b.orders, الربح: b.profit }));
      case "employees":
        return employees.map((e) => ({ الاسم: e.name, الوظيفة: e.role, الفرع: e.branchName, المبيعات: e.salesTotal, الطلبات: e.ordersHandled }));
      case "financial":
      default:
        return [{
          الإيرادات: kpis?.revenue ?? 0, "صافي الربح": kpis?.netProfit ?? 0, المصروفات: kpis?.expenses ?? 0,
          الضرائب: kpis?.taxes ?? 0, "هامش الربح %": kpis?.profitMargin ?? 0,
        }];
    }
  }

  async function handleExport(format: "csv" | "excel" | "pdf") {
    const rows = buildRows();
    const name = `تجارتي-${reportType}-${new Date().toISOString().slice(0, 10)}`;
    if (format === "csv") exportToCSV(name, rows as any);
    if (format === "excel") await exportToExcel(name, [{ name: "التقرير", rows: rows as any }]);
    if (format === "pdf") {
      const columns = Object.keys(rows[0] ?? {});
      await exportToPDF(
        reportTypes.find((r) => r.value === reportType)?.label ?? "تقرير",
        [{ heading: "البيانات", columns, rows: rows.map((r: any) => columns.map((c) => r[c])) }],
        name
      );
    }
    toast.success("تم إنشاء التقرير بنجاح", { description: `تم تصدير ${rows.length} سجل` });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> إنشاء تقرير جديد</CardTitle>
        <CardDescription>اختر نوع التقرير وصيغة التصدير المناسبة لك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs value={reportType} onValueChange={setReportType}>
          <TabsList className="flex-wrap h-auto">
            {reportTypes.map((r) => <TabsTrigger key={r.value} value={r.value}>{r.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => handleExport("pdf")}>
              <FileText className="h-6 w-6 text-destructive" /><span>تصدير PDF</span>
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="h-6 w-6 text-success" /><span>تصدير Excel</span>
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => handleExport("csv")}>
              <FileDown className="h-6 w-6 text-primary" /><span>تصدير CSV</span>
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
