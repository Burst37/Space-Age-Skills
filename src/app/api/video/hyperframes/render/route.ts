import { NextResponse } from "next/server";
import { config } from "@/lib/config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST() {
  void config;
  return NextResponse.json({ ok: true, message: "Render queued — connect Higgsfield MCP" });
}
