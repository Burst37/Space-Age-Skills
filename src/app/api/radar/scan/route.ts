import { run } from "@/lib/runner";
import { mkdir, writeFile, readFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_WORKSPACE = os.homedir();
const RADAR_DIR = path.join(os.homedir(), ".agentic-os", "radar");
const HISTORY_DIR = path.join(RADAR_DIR, "history");
const LATEST = path.join(RADAR_DIR, "latest.json");
const STATUS = path.join(RADAR_DIR, "status.json");
const VAULT_AI_NEWS = config.vaultRoot ? path.join(config.vaultRoot, "AI News") : "";

export interface Signal {
  headline: string; why_now: string; angle: string; format: string;
  heat: number; posted: string; freshness: string; category: string;
  post_count: string; url: string; handle: string; sources: string[]; hook: string;
}

function scanPrompt(now: Date): string {
  const today = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const who = config.userName && config.userName !== "You" ? config.userName : "the user";
  return [
    `You are THE RADAR for ${who} — a creator/founder building with AI agents (Claude Code, Hermes, the Agent OS, AI automation, SEO).`,
    "Their audience: creators, agency owners and founders building with AI agents.",
    "",
    `TODAY IS ${today}. You only care about what is breaking RIGHT NOW, today.`,
    "Use your x_search tool to surface the BIG mainstream AI + tech NEWS that broke in the LAST 24 HOURS.",
    "Real news: model + product launches, company announcements, benchmarks, funding, acquisitions and drama.",
    "",
    "HARD RECENCY RULE: Every story MUST have broken in the last 24 hours. 48 hours is the absolute maximum.",
    "Run x_search sorted by LATEST. Rank by RECENCY FIRST, then by post volume.",
    "",
    "Return ONLY a JSON array of exactly 6 objects (newest + biggest first). Each object:",
    "{",
    '  "headline": "<= 8 words naming the news story",',
    '  "post_count": "the X post count, e.g. \"5,352 posts\"",',
    '  "why_now": "1-2 sentences on why it is trending",',
    '  "angle": "the user unique content angle or hot take, 1 sentence",',
    '  "format": one of "Guide" | "Video" | "Short" | "Substack note",',
    '  "heat": integer 1-100,',
    '  "posted": "how long ago it broke TODAY, e.g. \"2h ago\"",',
    '  "freshness": "short relative age, e.g. \"2h ago\", \"today\"",',
    '  "category": one of "Models" | "Agents" | "Tools" | "SEO" | "Drama" | "Money",',
    '  "handle": "the main X account behind it, WITHOUT the @",',
    '  "url": "the REAL x.com permalink to the single biggest post",',
    '  "sources": ["1-3 short refs: @handles or outlets"],',
    '  "hook": "a ready punchy opening line in the user creator voice"',
    "}",
    "Output ONLY the raw JSON array — no commentary, no markdown fences.",
  ].join("\n");
}

function extractRaw(raw: string): unknown[] {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf("["); const end = s.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];
  try { const arr = JSON.parse(s.slice(start, end + 1)); return Array.isArray(arr) ? arr : []; }
  catch { return []; }
}

function xLink(url: string): string {
  const u = String(url || "").trim();
  if (/x\.com\/i\/trending\/\d+/i.test(u)) return u.slice(0, 400);
  if (/(?:x|twitter)\.com\/[A-Za-z0-9_]+\/status\/\d+/i.test(u)) return u.slice(0, 400);
  if (/^https?:\/\//i.test(u) && !/(?:x|twitter)\.com\/(?:search|[A-Za-z0-9_]+\/?$)/i.test(u)) return u.slice(0, 400);
  return "https://x.com/explore/tabs/trending";
}

function permalinksByHandle(raw: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re = /https?:\/\/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,20})\/status\/(\d{5,25})/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) { const h = m[1].toLowerCase(); if (!map[h]) map[h] = `https://x.com/${m[1]}/status/${m[2]}`; }
  return map;
}

function normalize(arr: unknown[], raw = ""): Signal[] {
  const perma = permalinksByHandle(raw);
  return arr
    .filter((x): x is Record<string, unknown> => !!x && typeof (x as Record<string, unknown>).headline === "string")
    .map((x) => {
      const handle = String(x.handle || "").replace(/^@/, "").slice(0, 40);
      let rawUrl = String(x.url || "").trim();
      if (!/(?:i\/trending|status)\//i.test(rawUrl) && handle && perma[handle.toLowerCase()]) rawUrl = perma[handle.toLowerCase()];
      return {
        headline: String(x.headline || "").slice(0, 120),
        why_now: String(x.why_now || "").slice(0, 500),
        angle: String(x.angle || "").slice(0, 300),
        format: String(x.format || "Video"),
        heat: Math.max(1, Math.min(100, Math.round(Number(x.heat) || 50))),
        posted: String(x.posted || x.freshness || "today").slice(0, 60),
        freshness: String(x.freshness || "today").slice(0, 40),
        category: String(x.category || "Agents"),
        post_count: String(x.post_count || "").slice(0, 40),
        handle,
        url: xLink(rawUrl),
        sources: Array.isArray(x.sources) ? x.sources.slice(0, 3).map((v) => String(v).slice(0, 160)) : [],
        hook: String(x.hook || "").slice(0, 300),
      };
    });
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function obsidianBlock(signals: Signal[], when: Date): string {
  const time = `${pad(when.getHours())}:${pad(when.getMinutes())}`;
  const lines = [`\n## Sweep · ${time}\n`];
  signals.forEach((s, i) => {
    lines.push(`### ${i + 1}. ${s.headline}`);
    lines.push(`*${s.post_count ? s.post_count + " · " : ""}heat ${s.heat} · ${s.category} · ${s.posted}*`);
    lines.push(s.why_now);
    lines.push(`- **Your angle:** ${s.angle}`);
    lines.push(`- **Source (X):** ${s.url}${s.handle ? ` — @${s.handle}` : ""}`);
    if (s.hook) lines.push(`- **Hook:** "${s.hook}"`);
    lines.push("");
  });
  return lines.join("\n");
}

async function persist(signals: Signal[], scannedAt: string) {
  const when = new Date(scannedAt);
  const day = `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}`;
  const payload = { ok: true, scannedAt, day, signals };
  try {
    await mkdir(HISTORY_DIR, { recursive: true });
    await writeFile(LATEST, JSON.stringify(payload, null, 2), "utf8");
    await writeFile(path.join(HISTORY_DIR, `${day}.json`), JSON.stringify(payload, null, 2), "utf8");
  } catch { /* best effort */ }
  if (VAULT_AI_NEWS) try {
    await mkdir(VAULT_AI_NEWS, { recursive: true });
    const file = path.join(VAULT_AI_NEWS, `${day}.md`);
    const block = obsidianBlock(signals, when);
    if (existsSync(file)) {
      await appendFile(file, block, "utf8");
    } else {
      const niceDay = when.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      await writeFile(file, `# AI News — ${niceDay}\n\n> Auto-logged by The Radar (Agent OS).\n` + block, "utf8");
    }
  } catch { /* best effort */ }
  return payload;
}

interface SweepStatus { running: boolean; startedAt?: string; endedAt?: string; phase?: string; error?: string }

async function readStatus(): Promise<SweepStatus> {
  try { return JSON.parse(await readFile(STATUS, "utf8")); } catch { return { running: false }; }
}
async function writeStatus(s: SweepStatus) {
  try { await mkdir(RADAR_DIR, { recursive: true }); await writeFile(STATUS, JSON.stringify(s), "utf8"); } catch { /* best effort */ }
}

async function runSweep(): Promise<void> {
  const startedAt = new Date().toISOString();
  await writeStatus({ running: true, startedAt, phase: "Reading the live X firehose…" });
  try {
    if (!existsSync(HERMES_WORKSPACE)) { try { await mkdir(HERMES_WORKSPACE, { recursive: true }); } catch {} }
    const res = await run("hermes", ["-z", scanPrompt(new Date())], { cwd: HERMES_WORKSPACE, timeoutMs: 420_000 });
    const raw = res.stdout || "";
    const signals = normalize(extractRaw(raw), raw);
    if (!signals.length) {
      const se = (res.stderr || "").trim();
      const error = /not (logged|signed) in|unauthor|no xai|credential/i.test(se)
        ? "Hermes isn't signed into xAI Grok. Run `hermes auth add xai-oauth`."
        : (se.slice(-200) || "The oracle came back empty — try again in a moment.");
      await writeStatus({ running: false, startedAt, endedAt: new Date().toISOString(), error });
      return;
    }
    await persist(signals, new Date().toISOString());
    await writeStatus({ running: false, startedAt, endedAt: new Date().toISOString() });
  } catch (e) {
    await writeStatus({ running: false, startedAt, endedAt: new Date().toISOString(), error: (e as Error).message });
  }
}

export async function GET() {
  return Response.json(await readStatus(), { headers: { "cache-control": "no-store" } });
}

export async function POST() {
  const st = await readStatus();
  if (st.running) return Response.json({ ok: true, already: true });
  runSweep().catch(() => {});
  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}