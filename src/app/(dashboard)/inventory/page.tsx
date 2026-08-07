import { Leaderboard } from "@/components/employees/leaderboard";
import { AttendanceGrid } from "@/components/employees/attendance-grid";
import { ProductivityChart } from "@/components/employees/productivity-chart";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <AddEmployeeDialog />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AttendanceGrid />
        <ProductivityChart />
      </div>
      <Leaderboard />
    </div>
  );
}
