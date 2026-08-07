"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { useBranches } from "@/hooks/use-branches";
import { AddOrderDialog } from "@/components/orders/add-order-dialog";
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

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const { data: branches } = useBranches();
  const branchName = (id: string) => branches?.find((b) => b.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>الطلبات ({orders?.length ?? 0})</CardTitle>
          <AddOrderDialog />
        </CardHeader>
        <CardContent>
          {isLoading || !orders ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
              <p className="text-sm font-medium">لا توجد طلبات بعد</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                سجّل أول طلب يدويًا من زر «تسجيل طلب»، أو اربط تكاملًا مثل Shopify أو Stripe من صفحة التكاملات ليتم استيراد الطلبات تلقائيًا.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>الفرع</TableHead>
                  <TableHead>القناة</TableHead>
                  <TableHead>القيمة</TableHead>
                  <TableHead>عدد القطع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الوقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.customerName || "عميل نقدي"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{branchName(o.branchId)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{channelMap[o.channel]}</TableCell>
                    <TableCell className="number-tabular font-semibold">{formatCurrency(o.total)}</TableCell>
                    <TableCell className="number-tabular text-xs">{o.itemsCount}</TableCell>
                    <TableCell><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(o.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
