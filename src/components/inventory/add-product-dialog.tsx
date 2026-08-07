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

export function AddProductDialog() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: branches = [] } = useBranches();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [branchId, setBranchId] = useState<string>("");

  function reset() {
    setName("");
    setSku("");
    setCategory("");
    setPrice("");
    setCost("");
    setStock("");
    setReorderLevel("10");
    setBranchId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("إضافة المنتجات متاحة فقط بعد ربط سوبابيس (وضع العرض التجريبي للقراءة فقط).");
      return;
    }

    setLoading(true);
    const orgId = await getCurrentOrgId(supabase);
    if (!orgId) {
      setLoading(false);
      setError("تعذّر تحديد منظمتك. سجّل الدخول من جديد.");
      return;
    }

    const { error } = await supabase.from("products").insert({
      org_id: orgId,
      branch_id: branchId || null,
      name,
      sku: sku || null,
      category: category || null,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      reorder_level: Number(reorderLevel) || 10,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    reset();
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة منتج جديد</DialogTitle>
          <DialogDescription>أدخل بيانات المنتج والمخزون</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">اسم المنتج</Label>
            <Input id="product-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: ساعة ذكية X2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="product-sku">رمز المنتج (SKU)</Label>
              <Input id="product-sku" dir="ltr" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">الفئة</Label>
              <Input id="product-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="إلكترونيات" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="product-price">سعر البيع (ر.س)</Label>
              <Input id="product-price" type="number" min="0" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-cost">التكلفة (ر.س)</Label>
              <Input id="product-cost" type="number" min="0" step="0.01" required value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="product-stock">الكمية الحالية</Label>
              <Input id="product-stock" type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-reorder">حد إعادة الطلب</Label>
              <Input id="product-reorder" type="number" min="0" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>الفرع</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger><SelectValue placeholder="اختر الفرع (اختياري)" /></SelectTrigger>
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
              {loading ? "جارٍ الحفظ..." : "حفظ المنتج"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
