"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useKPIs } from "@/hooks/use-kpis";
import { formatCurrency } from "@/lib/utils";

export function ReportPreview() {
  const { data: kpis } = useKPIs();
  const rows = [
    { label: "الإيرادات", value: kpis?.revenue },
    { label: "صافي الربح", value: kpis?.netProfit },
    { label: "المصروفات", value: kpis?.expenses },
    { label: "الضرائب", value: kpis?.taxes },
    { label: "المبالغ المستردة", value: kpis?.refunds },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>ملخص مالي سريع</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>البند</TableHead><TableHead>القيمة</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="number-tabular font-semibold">{formatCurrency(r.value ?? 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
