import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/runner";
import { runApiAgent } from "@/lib/openrouterRunner";
import type { ApiAgentId } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent") || "claude";
  const mode  = searchParams.get("mode")  || "cli";
  const body  = await req.json() as { prompt?: string; messages?: { role: string; content: string }[]; history?: { role: string; content: string }[] };

  if (mode === "api") {
    const msgs = (body.messages || []) as { role: "user" | "assistant" | "system"; content: string }[];
    const result = await runApiAgent(agent as ApiAgentId, msgs);
    return NextResponse.json({ content: result.content, durationMs: result.durationMs, ok: result.ok, error: result.error });
  }

  // CLI mode — pipe prompt to agent
  const prompt = body.prompt || "";
  const result = await run(agent as "claude", ["--print", prompt], { timeoutMs: 90_000, input: prompt });
  return NextResponse.json({ content: result.stdout || result.stderr, durationMs: result.durationMs, ok: result.ok });
}
