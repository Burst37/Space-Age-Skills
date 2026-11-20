import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { spawn } from "child_process";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROOT = process.cwd();
const REG = path.join(ROOT, "stack", "tools.json");

async function skills() {
  const out: { name: string; model: string; description: string }[] = [];
  for (const d of await readdir(path.join(ROOT, "skills")).catch(() => [])) {
    const t = await readFile(path.join(ROOT, "skills", d, "SKILL.md"), "utf8").catch(() => "");
    const fm = t.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
    const get = (k: string) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1].trim() || "";
    if (t) out.push({ name: d, model: get("model") || "default", description: get("description").slice(0, 140) });
  }
  return out;
}

export async function GET() {
  const reg = JSON.parse(await readFile(REG, "utf8"));
  return NextResponse.json({ ...reg, skills: await skills() });
}

// replace registry (tools + routines) from the UI
export async function PUT(req: NextRequest) {
  const { tools, routines } = await req.json();
  if (!Array.isArray(tools) || !Array.isArray(routines)) return NextResponse.json({ error: "bad body" }, { status: 400 });
  await writeFile(REG, JSON.stringify({ tools, routines }, null, 2));
  return NextResponse.json({ ok: true });
}

// run a skill headless: claude -p, model picked in UI
export async function POST(req: NextRequest) {
  const { skill, model } = await req.json();
  if (!/^[a-z0-9-]+$/.test(skill || "") || !/^[a-z0-9.-]*$/.test(model || ""))
    return NextResponse.json({ error: "bad skill/model" }, { status: 400 });
  const args = ["-p", `Run the /${skill} skill. Reply with a short report.`, ...(model ? ["--model", model] : [])];
  const out = await new Promise<string>((res) => {
    const p = spawn("claude", args, { cwd: ROOT });
    let s = "";
    p.stdout.on("data", (d) => (s += d));
    p.stderr.on("data", (d) => (s += d));
    p.on("error", (e) => res(String(e)));
    p.on("close", () => res(s));
    setTimeout(() => p.kill(), 120_000);
  });
  return NextResponse.json({ report: out });
}
