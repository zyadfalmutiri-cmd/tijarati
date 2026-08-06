"use client";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/hooks/use-employees";

export function ProductivityChart() {
  const { data: employees = [] } = useEmployees();
  const byRole = ["مندوب مبيعات", "كاشير", "مشرف فرع", "أمين مخزون"].map((role) => {
    const roleEmployees = employees.filter((e) => e.role === role);
    const avg = roleEmployees.reduce((s, e) => s + e.productivityScore, 0) / (roleEmployees.length || 1);
    return { role, productivity: Math.round(avg || 0) };
  });

  return (
    <Card>
      <CardHeader><CardTitle>الإنتاجية حسب الوظيفة</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={byRole}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="role" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} axisLine={false} />
            <Radar dataKey="productivity" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
