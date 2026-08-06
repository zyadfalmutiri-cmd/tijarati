"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>معلومات الحساب</CardTitle>
          <CardDescription>بيانات مؤسستك على تجارتي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>اسم المؤسسة</Label><Input defaultValue="مؤسسة تجارتي التجريبية" /></div>
          <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input defaultValue="owner@tijarati.demo" type="email" /></div>
          <Button onClick={() => toast.success("تم حفظ التغييرات")}>حفظ التغييرات</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المظهر</CardTitle>
          <CardDescription>تخصيص شكل المنصة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">الوضع الليلي</p><p className="text-xs text-muted-foreground">تفعيل المظهر الداكن للمنصة</p></div>
            <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>تفضيلات الإشعارات</CardTitle>
          <CardDescription>اختر التنبيهات التي تريد استلامها</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "ارتفاع/انخفاض المبيعات", desc: "تنبيه عند تغيّر ملحوظ في أداء المبيعات" },
            { label: "تنبيهات المخزون", desc: "تنبيه عند اقتراب نفاد أي منتج" },
            { label: "المبالغ المستردة الكبيرة", desc: "تنبيه فوري عند استرداد أعلى من 500 ر.س" },
            { label: "تنبيهات النظام والتكاملات", desc: "أخطاء المزامنة وانقطاع الاتصال" },
          ].map((item, i) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch defaultChecked />
              </div>
              {i < 3 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border-primary/20 bg-primary/[0.03]">
        <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">تجارتي مجانية بالكامل، دائمًا</p>
            <p className="text-xs text-muted-foreground mt-1">لا اشتراكات ولا رسوم مخفية ولا إعلانات — نلتزم بذلك دون استثناء.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
