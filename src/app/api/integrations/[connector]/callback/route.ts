import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/integrations/core/get-adapter";

// OAuth redirect target: GET /api/integrations/:connector/callback?code=...&state=...
export async function GET(req: NextRequest, { params }: { params: { connector: string } }) {
  const adapter = getAdapter(params.connector);
  if (!adapter) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });

  const code = req.nextUrl.searchParams.get("code") ?? undefined;
  const record = await adapter.connect({ code });
  // In production: persist `record`, then redirect back into the app.
  const redirectTo = new URL("/integrations", process.env.NEXT_PUBLIC_APP_URL);
  redirectTo.searchParams.set("connected", params.connector);
  return NextResponse.redirect(redirectTo);
}
