import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <p className="text-lg font-semibold">الصفحة غير موجودة</p>
      <p className="text-sm text-muted-foreground">تحقق من الرابط أو عد إلى اللوحة الرئيسية.</p>
      <Button asChild><Link href="/">العودة للوحة الرئيسية</Link></Button>
    </div>
  );
}
