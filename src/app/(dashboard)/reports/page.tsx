import { ReportGenerator } from "@/components/reports/report-generator";
import { ReportPreview } from "@/components/reports/report-preview";

export default function ReportsPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2"><ReportGenerator /></div>
      <ReportPreview />
    </div>
  );
}
