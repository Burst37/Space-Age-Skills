import { run } from "@/lib/runner";
import os from "node:os";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_WORKSPACE = os.homedir();

function toBold(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 65 && c <= 90) out += String.fromCodePoint(0x1d5d4 + (c - 65));
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(0x1d5ee + (c - 97));
    else if (c >= 48 && c <= 57) out += String.fromCodePoint(0x1d7ec + (c - 48));
    else out += ch;
  }
  return out;
}

function formatTweet(raw: string): string {
  let t = raw.trim();
  const fence = t.match(/```(?:[a-z]*)?\ s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  t = t.replace(/^(?:tweet|post|x post)\s*:\s*/i, "");
  t = t.replace(/\*\*([\s\S]+?)\*\*/g, (_m, inner) => toBold(inner));
  t = t.replace(/__([\s\S]+?)__/g, (_m, inner) => toBold(inner));
  t = t.replace(/\*/g, "");
  t = t.replace(/(^|\s)#[A-Za-z0-9_]+/g, "$1");
  t = t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const headline = String(body.headline || "").slice(0, 200);
  const why = String(body.why_now || "").slice(0, 600);
  const angle = String(body.angle || "").slice(0, 400);
  const hook = String(body.hook || "").slice(0, 300);
  if (!headline) return Response.json({ ok: false, error: "missing signal" }, { status: 400 });

  const who = config.userName && config.userName !== "You" ? config.userName : "you";
  const prompt = [
    `You are writing an X (Twitter) post as ${who}. Turn this trending AI story into ONE banger tweet to QUOTE-POST on top of the original.`,
    "",
    `TREND: ${headline}`,
    `WHY IT'S HOT: ${why}`,
    `THE ANGLE: ${angle}`,
    hook ? `A HOOK TO BUILD ON: ${hook}` : "",
    "",
    "Write it as a scroll-stopping X post — direct, punchy, confident, like a viral tech-founder tweet.",
    "RULES:",
    "- Open with a SHORT punchy hook. Wrap ONLY that hook in **double asterisks** to bold it.",
    "- Then 3-6 short lines, ONE sentence per line, blank lines between beats.",
    "- Deliver a real insight or hot take. NO hashtags, NO links, NO 'thread', NO 'follow me'.",
    "- At most ONE tasteful emoji. Keep it tight.",
    "- Output ONLY the tweet text, nothing before or after.",
  ].filter(Boolean).join("\n");

  const res = await run("hermes", ["-z", prompt], { cwd: HERMES_WORKSPACE, timeoutMs: 150_000 });
  const text = (res.stdout || "").trim();
  if (!text) return Response.json({ ok: false, error: (res.stderr || "").slice(-260) || "Hermes returned nothing." }, { status: 502 });
  return Response.json({ ok: true, draft: formatTweet(text) });
}