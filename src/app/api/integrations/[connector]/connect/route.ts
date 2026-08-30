import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/integrations/core/get-adapter";

// POST /api/integrations/:connector/connect
// Body: { apiKey?, apiSecret?, shopDomain? } for api-key connectors, or
// nothing for oauth2 connectors (client should instead call GET .../connect
// to receive the authUrl and redirect the user there).
export async function POST(req: NextRequest, { params }: { params: { connector: string } }) {
  const adapter = getAdapter(params.connector);
  if (!adapter) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const record = await adapter.connect(body);
  // In production: persist `record` into integration_connections (Supabase),
  // scoped to the caller's org_id from the session.
  return NextResponse.json(record);
}

export async function GET(req: NextRequest, { params }: { params: { connector: string } }) {
  const adapter = getAdapter(params.connector);
  if (!adapter) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
  if (!adapter.getAuthUrl) return NextResponse.json({ error: "هذه الخدمة لا تستخدم OAuth" }, { status: 400 });

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/${params.connector}/callback`;
  const state = crypto.randomUUID();
  const authUrl = adapter.getAuthUrl(redirectUri, state);

  const response = NextResponse.json({ authUrl });
  // نخزّن state في كوكي httpOnly بدل الاكتفاء بإرجاعه للعميل — هذا هو مصدر
  // الحقيقة الوحيد الذي يتحقق منه الـ callback لاحقًا لمنع CSRF على تدفق
  // OAuth (تدقيق الأمان S4). صلاحية 10 دقائق تكفي لإكمال الدخول عند المزوّد.
  response.cookies.set(`oauth_state_${params.connector}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: `/api/integrations/${params.connector}`,
  });
  return response;
}
