"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { useBranches } from "@/hooks/use-branches";
import { formatCurrency, timeAgo } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  completed: { label: "مكتمل", variant: "success" },
  pending: { label: "قيد الانتظار", variant: "warning" },
  refunded: { label: "مسترد", variant: "destructive" },
  cancelled: { label: "ملغي", variant: "secondary" },
};

const channelMap: Record<string, string> = {
  "in-store": "داخل المتجر", online: "أونلاين", pos: "نقطة بيع", marketplace: "سوق إلكتروني",
};

export function RecentOrders() {
  const { data: orders, isLoading } = useOrders(8);
  const { data: branches } = useBranches();
  const branchName = (id: string) => branches?.find((b) => b.id === id)?.name ?? id;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>أحدث الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !orders ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الفرع</TableHead>
                <TableHead>القناة</TableHead>
                <TableHead>القيمة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الوقت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.customerName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{branchName(o.branchId)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{channelMap[o.channel]}</TableCell>
                  <TableCell className="number-tabular font-semibold">{formatCurrency(o.total)}</TableCell>
                  <TableCell><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(o.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
