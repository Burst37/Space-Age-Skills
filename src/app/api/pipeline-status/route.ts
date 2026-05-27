import { NextResponse } from "next/server";
import { run } from "@/lib/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Read pipeline stats from VPS log file via SSH
  const result = await run("ssh", [
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=5",
    "-i", process.env.VPS_KEY_PATH || "~/.ssh/id_rsa",
    `${process.env.VPS_USER || "root"}@${process.env.VPS_HOST || "146.190.78.120"}`,
    "cat /home/pipeline/stats.json 2>/dev/null || echo '{}'",
  ], { timeoutMs: 10_000 });

  let stats = { sitesToday: 0, totalCost: 0, lastBuilt: null as string | null, agentStatus: {} };
  try { stats = { ...stats, ...JSON.parse(result.stdout || "{}") }; } catch { /* no stats yet */ }

  return NextResponse.json({ ok: result.ok, ...stats, ts: Date.now() });
}
