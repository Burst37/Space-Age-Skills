import { readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LATEST = path.join(os.homedir(), ".agentic-os", "radar", "latest.json");

export async function GET() {
  try {
    const data = JSON.parse(await readFile(LATEST, "utf8"));
    return Response.json(data);
  } catch {
    return Response.json({ ok: true, scannedAt: null, signals: [] });
  }
}