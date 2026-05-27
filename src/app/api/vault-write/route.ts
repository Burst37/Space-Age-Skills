import { NextRequest, NextResponse } from "next/server";
import { appendToVault, appendDailyLog } from "@/lib/vaultWriter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json() as { path?: string; content: string; daily?: boolean };
  try {
    if (body.daily || !body.path) {
      await appendDailyLog(body.content);
    } else {
      await appendToVault(body.path, body.content);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
