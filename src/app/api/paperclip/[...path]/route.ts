/**
 * Proxy: /api/paperclip/** → http://localhost:3100/api/**
 *
 * Allows browser-side React components to call Paperclip's REST API
 * through Next.js (avoids CORS issues when both servers are local).
 *
 * Example:
 *   fetch('/api/paperclip/agents')     → Paperclip GET /api/agents
 *   fetch('/api/paperclip/issues', ..) → Paperclip POST /api/issues
 *
 * Set PAPERCLIP_API_URL in .env.local to override the default localhost:3100.
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = (process.env.PAPERCLIP_API_URL ?? "http://localhost:3100").replace(/\/$/, "");
const API_KEY = process.env.PAPERCLIP_API_KEY ?? "";

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const upstreamPath = path.join("/");
  const search = req.nextUrl.search;
  const url = `${UPSTREAM}/api/${upstreamPath}${search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;

  const runId = req.headers.get("x-paperclip-run-id");
  if (runId) headers["X-Paperclip-Run-Id"] = runId;

  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", upstream.headers.get("Content-Type") ?? "application/json");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { error: "Paperclip unreachable", hint: "Run: cd tools/paperclip && pnpm dev" },
      { status: 503 }
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as PUT, proxy as DELETE };
