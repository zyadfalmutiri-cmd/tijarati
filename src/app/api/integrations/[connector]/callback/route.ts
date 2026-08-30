import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/integrations/core/get-adapter";

// OAuth redirect target: GET /api/integrations/:connector/callback?code=...&state=...
export async function GET(req: NextRequest, { params }: { params: { connector: string } }) {
  const adapter = getAdapter(params.connector);
  if (!adapter) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });

  const code = req.nextUrl.searchParams.get("code") ?? undefined;
  const returnedState = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get(`oauth_state_${params.connector}`)?.value;

  // S4: تحقق من CSRF — لو ما تطابق state المُرجَع من المزوّد مع الذي أصدرناه
  // في /connect (أو انتهت صلاحيته/محذوف)، نرفض الاتصال بدل قبول أي code وارد.
  if (!expectedState || !returnedState || returnedState !== expectedState) {
    const redirectTo = new URL("/integrations", process.env.NEXT_PUBLIC_APP_URL);
    redirectTo.searchParams.set("error", "invalid_oauth_state");
    redirectTo.searchParams.set("connector", params.connector);
    const response = NextResponse.redirect(redirectTo);
    response.cookies.delete(`oauth_state_${params.connector}`);
    return response;
  }

  const record = await adapter.connect({ code });
  // In production: persist `record`, then redirect back into the app.
  const redirectTo = new URL("/integrations", process.env.NEXT_PUBLIC_APP_URL);
  redirectTo.searchParams.set("connected", params.connector);
  const response = NextResponse.redirect(redirectTo);
  response.cookies.delete(`oauth_state_${params.connector}`);
  return response;
}
