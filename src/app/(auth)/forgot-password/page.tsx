"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("سوبابيس غير مهيأ بعد. راجع ملف .env.local.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect=/reset-password`,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>نسيت كلمة المرور</CardTitle>
        <CardDescription>
          {sent
            ? "تفقد بريدك الإلكتروني"
            : "بنرسل لك رابط لإعادة تعيين كلمة المرور"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              إذا كان البريد الإلكتروني <span dir="ltr">{email}</span> مسجل عندنا، بيوصلك رابط لإعادة تعيين كلمة المرور خلال دقائق. تأكد من مجلد الرسائل غير المرغوبة أيضًا.
            </p>
            <Link href="/login" className="text-primary font-medium hover:underline text-sm">
              الرجوع لتسجيل الدخول
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              تذكرت كلمة المرور؟{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
