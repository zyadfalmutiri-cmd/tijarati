"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/utils";

export function InventoryTable() {
  const { data: products, isLoading } = useProducts();

  return (
    <Card className="col-span-full">
      <CardHeader><CardTitle>حالة المخزون</CardTitle></CardHeader>
      <CardContent>
        {isLoading || !products ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>قيمة المخزون</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => {
                const low = p.stock <= p.reorderLevel;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.sku}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="number-tabular">{p.stock}</TableCell>
                    <TableCell className="number-tabular font-semibold">{formatCurrency(p.stock * p.cost)}</TableCell>
                    <TableCell>
                      <Badge variant={low ? "destructive" : "success"}>{low ? "منخفض" : "متوفر"}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
