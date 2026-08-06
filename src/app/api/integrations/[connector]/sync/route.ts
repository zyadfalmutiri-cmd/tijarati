import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/integrations/core/get-adapter";

// POST /api/integrations/:connector/sync — pulls the latest data from the
// vendor and normalizes it into orders/products/transactions. Intended to
// also be triggered by a scheduled background job (e.g. Supabase Edge
// Function on a cron) for automatic periodic synchronization.
export async function POST(_req: NextRequest, { params }: { params: { connector: string } }) {
  const adapter = getAdapter(params.connector);
  if (!adapter) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });

  const result = await adapter.sync();
  // In production: write result rows into orders/products/integration_sync_logs,
  // then emit a `system` notification summarizing the sync.
  return NextResponse.json(result);
}
