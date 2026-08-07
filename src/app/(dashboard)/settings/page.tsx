"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";

interface OrgSettings {
  orgId: string;
  orgName: string;
  userEmail: string;
}

async function fetchSettings(): Promise<OrgSettings | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const orgId = await getCurrentOrgId(supabase);
  if (!orgId) return null;

  const { data, error } = await supabase.from("organizations").select("id, name").eq("id", orgId).single();
  if (error) throw error;

  return { orgId: data.id, orgName: data.name, userEmail: user?.email ?? "" };
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["org-settings"],
    queryFn: fetchSettings,
  });

  const [orgName, setOrgName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setOrgName(settings.orgName);
  }, [settings]);

  async function handleSave() {
    if (!supabase || !settings) {
      toast.error("حفظ اسم المؤسسة متاح فقط بعد ربط سوبابيس (وضع العرض التجريبي للقراءة فقط).");
      return;
    }
    if (!orgName.trim()) {
      toast.error("اسم المؤسسة لا يمكن أن يكون فارغًا.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("organizations").update({ name: orgName.trim() }).eq("id", settings.orgId);
    setSaving(false);

    if (error) {
      toast.error(error.message.includes("policy") || error.message.includes("permission")
        ? "ليست لديك صلاحية تعديل بيانات المؤسسة. يلزم دور مالك أو مدير."
        : error.message);
      return;
    }

    toast.success("تم حفظ التغييرات");
    queryClient.invalidateQueries({ queryKey: ["org-settings"] });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>معلومات الحساب</CardTitle>
          <CardDescription>بيانات مؤسستك على تجارتي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>اسم المؤسسة</Label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={!settings} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input value={settings?.userEmail ?? "—"} type="email" disabled readOnly />
              </div>
              {!settings && (
                <p className="text-xs text-muted-foreground">
                  تعذّر تحميل بيانات المؤسسة (وضع العرض التجريبي أو لا يوجد اشتراك في منظمة).
                </p>
              )}
              <Button onClick={handleSave} disabled={saving || !settings}>
                {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </Button>
            </>
          )}
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
          <CardDescription>اختر التنبيهات التي تريد استلامها (هذا القسم عرض أولي فقط ولا يُحفظ بعد)</CardDescription>
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
