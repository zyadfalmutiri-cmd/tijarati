"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { useBranches } from "@/hooks/use-branches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddEmployeeDialog() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: branches = [] } = useBranches();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [branchId, setBranchId] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("إضافة الموظفين متاحة فقط بعد ربط سوبابيس (وضع العرض التجريبي للقراءة فقط).");
      return;
    }

    setLoading(true);
    const orgId = await getCurrentOrgId(supabase);
    if (!orgId) {
      setLoading(false);
      setError("تعذّر تحديد منظمتك. سجّل الدخول من جديد.");
      return;
    }

    const { error } = await supabase.from("employees").insert({
      org_id: orgId,
      branch_id: branchId || null,
      name,
      role: role || null,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setName("");
    setRole("");
    setBranchId("");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["employees"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          إضافة موظف
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
          <DialogDescription>أدخل بيانات الموظف الأساسية</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emp-name">اسم الموظف</Label>
            <Input id="emp-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-role">المسمى الوظيفي</Label>
            <Input id="emp-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="كاشير، بائع، مشرف..." />
          </div>
          <div className="space-y-2">
            <Label>الفرع</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "جارٍ الحفظ..." : "حفظ الموظف"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
