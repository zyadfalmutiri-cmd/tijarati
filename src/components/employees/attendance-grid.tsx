"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";

function levelClass(rate: number) {
  if (rate >= 95) return "bg-success";
  if (rate >= 85) return "bg-success/60";
  if (rate >= 75) return "bg-warning/70";
  return "bg-destructive/70";
}

export function AttendanceGrid() {
  const { data: employees = [] } = useEmployees();
  const days = Array.from({ length: 14 }, (_, i) => i);

  return (
    <Card>
      <CardHeader><CardTitle>الحضور (آخر 14 يوم)</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {employees.slice(0, 8).map((e) => (
            <div key={e.id} className="flex items-center gap-3">
              <p className="w-24 shrink-0 truncate text-xs font-medium">{e.name}</p>
              <div className="flex gap-1 flex-1">
                {days.map((d) => {
                  const seedRate = (e.attendanceRate + d * 3) % 100;
                  return <div key={d} className={cn("h-4 flex-1 rounded-sm", levelClass(seedRate))} title={`${seedRate}%`} />;
                })}
              </div>
              <span className="w-10 shrink-0 text-xs text-muted-foreground text-left">{e.attendanceRate}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
