"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployees } from "@/hooks/use-employees";
import { formatCurrency } from "@/lib/utils";
import { Trophy } from "lucide-react";

export function Leaderboard() {
  const { data: employees, isLoading } = useEmployees();

  return (
    <Card className="col-span-full">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Trophy className="h-4 w-4 text-warning" />
        <CardTitle>لوحة صدارة المبيعات</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !employees ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>الموظف</TableHead>
                <TableHead>الفرع</TableHead>
                <TableHead>المبيعات</TableHead>
                <TableHead>الطلبات</TableHead>
                <TableHead>الإنتاجية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.slice(0, 10).map((e, i) => (
                <TableRow key={e.id}>
                  <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback style={{ backgroundColor: `${e.avatarColor}20`, color: e.avatarColor }}>{e.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium text-sm">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">{e.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.branchName}</TableCell>
                  <TableCell className="number-tabular font-semibold">{formatCurrency(e.salesTotal)}</TableCell>
                  <TableCell className="number-tabular">{e.ordersHandled}</TableCell>
                  <TableCell className="w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={e.productivityScore} className="h-1.5" />
                      <span className="text-xs text-muted-foreground w-8">{e.productivityScore}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
