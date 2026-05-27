import { NextResponse } from "next/server";
import { run } from "@/lib/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [claude, openclaw, hermes, gemini, antigravity, codex] = await Promise.all([
    run("claude",      ["--version"],  { timeoutMs: 5000 }),
    run("openclaw",    ["health"],     { timeoutMs: 5000 }),
    run("hermes",      ["status"],     { timeoutMs: 6000 }),
    run("gemini",      ["--version"],  { timeoutMs: 5000 }),
    run("antigravity", ["--version"],  { timeoutMs: 5000 }),
    run("codex",       ["--version"],  { timeoutMs: 5000 }),
  ]);

  const hermesModel    = hermes.stdout.match(/Model:\s+(\S+)/)?.[1]   || "unknown";
  const hermesProvider = hermes.stdout.match(/Provider:\s+([^\n]+)/)?.[1]?.trim() || "unknown";

  return NextResponse.json({
    ts: Date.now(),
    claude:    { ok: claude.ok,    version: claude.stdout.trim()      || claude.stderr.trim(),    latencyMs: claude.durationMs },
    codex:     { ok: codex.ok,     version: codex.stdout.trim()       || codex.stderr.trim(),     latencyMs: codex.durationMs },
    openclaw:  { ok: openclaw.ok,  agents: [], latencyMs: openclaw.durationMs, raw: openclaw.stdout.slice(0,1000) },
    hermes:    { ok: hermes.ok,    model: hermesModel, provider: hermesProvider, latencyMs: hermes.durationMs },
    gemini:    { ok: gemini.ok,    version: gemini.stdout.trim()      || gemini.stderr.trim(),    latencyMs: gemini.durationMs },
    antigravity:{ ok: antigravity.ok, version: antigravity.stdout.trim() || antigravity.stderr.trim(), latencyMs: antigravity.durationMs },
  });
}
