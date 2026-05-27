import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Terminal WebSocket is handled by a custom Next.js server (see /terminal page notes)
// This endpoint returns SSH connection config for the client
export async function GET(_req: NextRequest) {
  return NextResponse.json({
    host: process.env.VPS_HOST || "146.190.78.120",
    user: process.env.VPS_USER || "root",
    port: parseInt(process.env.VPS_PORT || "22"),
    ready: true,
  });
}
