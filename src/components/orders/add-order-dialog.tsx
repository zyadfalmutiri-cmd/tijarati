"use client";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";
import { useBranches } from "@/hooks/use-branches";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

const channelOptions = [
  { value: "in-store", label: "داخل المتجر" },
  { value: "online", label: "أونلاين" },
  { value: "pos", label: "نقطة بيع" },
  { value: "marketplace", label: "سوق إلكتروني" },
];

const statusOptions = [
  { value: "completed", label: "مكتمل" },
  { value: "pending", label: "قيد الانتظار" },
];

interface LineItem {
  key: string;
  productId: string | null; // null = عنصر يدوي بدون منتج مرتبط
  name: string;
  quantity: number;
  unitPrice: number;
}

function emptyLine(): LineItem {
  return { key: crypto.randomUUID(), productId: null, name: "", quantity: 1, unitPrice: 0 };
}

export function AddOrderDialog() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: branches } = useBranches();
  const { data: products } = useProducts();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [branchId, setBranchId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [channel, setChannel] = useState("in-store");
  const [status, setStatus] = useState("completed");
  const [items, setItems] = useState<LineItem[]>([emptyLine()]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0),
    [items]
  );
  const itemsCount = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);

  function updateItem(key: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  function selectProduct(key: string, productId: string) {
    const product = products?.find((p) => p.id === productId);
    updateItem(key, {
      productId,
      name: product?.name ?? "",
      unitPrice: product?.price ?? 0,
    });
  }

  function addLine() {
    setItems((prev) => [...prev, emptyLine()]);
  }

  function removeLine(key: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.key !== key) : prev));
  }

  function reset() {
    setBranchId("");
    setCustomerName("");
    setChannel("in-store");
    setStatus("completed");
    setItems([emptyLine()]);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("تسجيل الطلبات متاح فقط بعد ربط سوبابيس (وضع العرض التجريبي للقراءة فقط).");
      return;
    }
    if (!branchId) {
      setError("اختر الفرع الذي تم فيه الطلب.");
      return;
    }
    if (total <= 0) {
      setError("أضف عنصرًا واحدًا على الأقل بسعر أكبر من صفر، أو أدخل القيمة يدويًا.");
      return;
    }

    setLoading(true);
    const orgId = await getCurrentOrgId(supabase);
    if (!orgId) {
      setLoading(false);
      setError("تعذّر تحديد منظمتك. سجّل الدخول من جديد.");
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        org_id: orgId,
        branch_id: branchId,
        customer_name: customerName || null,
        total,
        items_count: itemsCount,
        status,
        channel,
        source_connector: null, // طلب أُدخل يدويًا
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setLoading(false);
      setError(orderError?.message ?? "تعذّر إنشاء الطلب.");
      return;
    }

    const rows = items
      .filter((it) => it.quantity > 0)
      .map((it) => ({
        order_id: order.id,
        product_id: it.productId,
        quantity: it.quantity,
        unit_price: it.unitPrice,
      }));

    const { error: itemsError } = await supabase.from("order_items").insert(rows);
    setLoading(false);

    if (itemsError) {
      setError(itemsError.message);
      return;
    }

    reset();
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["kpis"] });
    queryClient.invalidateQueries({ queryKey: ["branches"] });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          تسجيل طلب
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تسجيل طلب جديد</DialogTitle>
          <DialogDescription>أدخل بيانات الطلب لتظهر في المبيعات والتقارير فورًا</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin px-0.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>الفرع</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
                <SelectContent>
                  {branches?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>اسم العميل (اختياري)</Label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="عميل نقدي" />
            </div>
            <div className="space-y-2">
              <Label>القناة</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {channelOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>عناصر الطلب</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={addLine}>
                <Plus className="h-3.5 w-3.5" /> إضافة عنصر
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.key} className="flex items-center gap-2">
                  {products && products.length > 0 ? (
                    <Select value={it.productId ?? "custom"} onValueChange={(v) => (v === "custom" ? updateItem(it.key, { productId: null }) : selectProduct(it.key, v))}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="اختر منتجًا" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">عنصر يدوي (بدون منتج)</SelectItem>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="flex-1"
                      placeholder="اسم العنصر"
                      value={it.name}
                      onChange={(e) => updateItem(it.key, { name: e.target.value })}
                    />
                  )}
                  <Input
                    type="number"
                    min={1}
                    className="w-16"
                    value={it.quantity}
                    onChange={(e) => updateItem(it.key, { quantity: Number(e.target.value) || 1 })}
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-24"
                    value={it.unitPrice}
                    onChange={(e) => updateItem(it.key, { unitPrice: Number(e.target.value) || 0 })}
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => removeLine(it.key)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">الإجمالي ({itemsCount} قطعة)</span>
            <span className="font-bold number-tabular">{formatCurrency(total)}</span>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "جارٍ الحفظ..." : "حفظ الطلب"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
