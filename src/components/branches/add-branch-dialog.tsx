"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddBranchDialog() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [manager, setManager] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("إضافة الفروع متاحة فقط بعد ربط سوبابيس (وضع العرض التجريبي للقراءة فقط).");
      return;
    }

    setLoading(true);
    const orgId = await getCurrentOrgId(supabase);
    if (!orgId) {
      setLoading(false);
      setError("تعذّر تحديد منظمتك. سجّل الدخول من جديد.");
      return;
    }

    const { error } = await supabase.from("branches").insert({
      org_id: orgId,
      name,
      city: city || null,
      manager: manager || null,
      status: "active",
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setName("");
    setCity("");
    setManager("");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["branches"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          إضافة فرع
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة فرع جديد</DialogTitle>
          <DialogDescription>أدخل بيانات الفرع الأساسية</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch-name">اسم الفرع</Label>
            <Input id="branch-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: فرع الرياض - العليا" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-city">المدينة</Label>
            <Input id="branch-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="الرياض" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-manager">اسم المدير</Label>
            <Input id="branch-manager" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="اسم مدير الفرع" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "جارٍ الحفظ..." : "حفظ الفرع"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
