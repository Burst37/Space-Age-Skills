import { writeFile, readdir, readFile } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { FCC_SCRATCH_ROOT, ensureProject } from "@/lib/freeClaudeWorkspace";
import { logTokens, normalizeUsage } from "@/lib/tokenLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fast "speak → build" generation. We do NOT route through the Claude agentic
// CLI (its tool-use loop hangs local general models). Instead we ask a model for
// the HTML in ONE shot, stream the tokens to the UI, then write the file.
//
// Two engines:
//   • "local"  → on-device Ollama (the original $0, offline path)
//   • "n2"     → Nex-N2-Pro (free) via OpenRouter — a much stronger build model,
//                still $0, used for the N2 voice-build mode.

const OLLAMA = process.env.OLLAMA_HOST || "http://localhost:11434";
const N2_MODEL = "nex-agi/nex-n2-pro:free";

function localModel(): string {
  try {
    const env = readFileSync(path.join(os.homedir(), ".fcc", ".env"), "utf8");
    const line = env.split("\n").find((l) => l.startsWith("MODEL="));
    if (line) {
      const v = line.slice(6).replace(/^["']|["']$/g, "").trim();
      if (v.startsWith("ollama/")) return v.slice("ollama/".length);
    }
  } catch { /* ignore */ }
  return "gemma4:latest";
}

// OpenRouter key for the N2 engine — read from ~/.hermes/.env (never committed,
// never sent to the client).
async function openRouterKey(): Promise<string | null> {
  for (const f of [path.join(os.homedir(), ".hermes", ".env"), path.join(os.homedir(), ".fcc", ".env")]) {
    try {
      const txt = await readFile(f, "utf8");
      const m = txt.match(/OPENROUTER_API_KEY\s*=\s*"?([^"\n]+)"?/i);
      if (m) return m[1].trim();
    } catch { /* next */ }
  }
  return process.env.OPENROUTER_API_KEY || null;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "build";
}

function extractHtml(text: string): string {
  const fence = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
  let h = fence ? fence[1] : text;
  const start = h.search(/<!DOCTYPE html|<html/i);
  if (start > 0) h = h.slice(start);
  const end = h.toLowerCase().lastIndexOf("</html>");
  if (end !== -1) h = h.slice(0, end + 7);
  return h.trim();
}

async function uniqueFile(dir: string, slug: string): Promise<string> {
  let names: string[] = [];
  try { names = await readdir(dir); } catch { /* */ }
  let name = `${slug}.html`;
  let n = 2;
  while (names.includes(name)) { name = `${slug}-${n}.html`; n++; }
  return name;
}

const SYSTEM = "You are a world-class creative front-end developer. Output ONLY a single, complete, self-contained HTML file — vanilla JS + HTML5 canvas where useful, NO external libraries, no build step. CRITICAL: NO external resources of any kind — no external images, no <img src> to the web, no icon/image URLs, no web fonts, no CDNs, no network requests. Draw EVERY visual yourself with Canvas, CSS, SVG, gradients, shapes, or emoji so it works perfectly offline. It must be visually stunning, full-window, dark background, smooth 60fps. Start your output with <!DOCTYPE html> and output NOTHING else: no markdown fences, no explanation, no preamble.";

export async function POST(req: Request) {
  let body: { prompt?: string; project?: string; engine?: string };
  try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
  const prompt = (body.prompt ?? "").toString().trim().slice(0, 2000);
  if (!prompt) return new Response("empty prompt", { status: 400 });

  const engine = body.engine === "n2" ? "n2" : "local";
  // N2 builds default into the "n2" project so they collect in the n2 workspace folder.
  const fallbackProject = engine === "n2" ? "n2" : "free-claude-code";
  const projectName = typeof body.project === "string" && /^[A-Za-z0-9_.-]+$/.test(body.project)
    ? body.project : fallbackProject;
  const dir = (await ensureProject(projectName)) ?? path.join(FCC_SCRATCH_ROOT, projectName);

  const orKey = engine === "n2" ? await openRouterKey() : null;

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (o: unknown) => { try { controller.enqueue(enc.encode(JSON.stringify(o) + "\n")); } catch { /* */ } };
      let full = "";
      let usage: unknown = null; // OpenRouter usage from the final SSE chunk (N2 only)
      try {
        if (engine === "n2") {
          if (!orKey) { send({ t: "error", m: "No OpenRouter key found for N2 (expected OPENROUTER_API_KEY in ~/.hermes/.env)." }); controller.close(); return; }
          const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${orKey}`,
              "HTTP-Referer": "https://agentos.guide",
              "X-Title": "Agent OS · N2 voice build",
            },
            body: JSON.stringify({
              // 16000 (not 9000): N2 reasons before it writes code, and a
              // functional app (to-do list, calculator) burns a big chunk of the
              // budget thinking. Too small a budget = reasoning eats it all and no
              // HTML streams. 16k leaves plenty of room for the actual build.
              model: N2_MODEL, stream: true, temperature: 0.8, max_tokens: 16000,
              // include_usage → OpenRouter appends a final chunk with token usage.
              stream_options: { include_usage: true },
              // Disable reasoning: N2 is a reasoning model and on some prompts it
              // spends the whole token budget "thinking" and streams no HTML. We
              // want the code straight away, so turn reasoning off for builds.
              reasoning: { enabled: false },
              messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
            }),
          });
          if (!r.ok || !r.body) {
            const detail = await r.text().catch(() => "");
            send({ t: "error", m: `N2 (OpenRouter ${r.status}) unreachable. ${detail.slice(0, 160)}` });
            controller.close(); return;
          }
          const reader = r.body.getReader();
          const dec = new TextDecoder();
          let buf = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              const t = line.trim();
              if (!t.startsWith("data:")) continue;
              const payload = t.slice(5).trim();
              if (payload === "[DONE]") continue;
              try {
                const j = JSON.parse(payload);
                const tok = j?.choices?.[0]?.delta?.content;
                if (tok) { full += tok; send({ t: "d", c: tok }); }
                if (j?.usage) usage = j.usage; // final chunk carries token counts
              } catch { /* partial SSE line */ }
            }
          }
          // N2's free endpoint sometimes streams nothing (reasoning model drops
          // the stream). If we got no usable HTML, retry ONCE non-streaming —
          // that path is reliable — so a voice build never silently fails.
          if (full.replace(/\s/g, "").length < 60) {
            const r2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: { "content-type": "application/json", authorization: `Bearer ${orKey}`, "HTTP-Referer": "https://agentos.guide", "X-Title": "Agent OS · N2 voice build" },
              body: JSON.stringify({ model: N2_MODEL, temperature: 0.8, max_tokens: 16000, reasoning: { enabled: false }, messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }] }),
            });
            if (r2.ok) {
              const j2 = await r2.json().catch(() => null) as { choices?: { message?: { content?: string } }[]; usage?: unknown } | null;
              const c = j2?.choices?.[0]?.message?.content;
              if (c) { full = c; send({ t: "d", c }); }
              if (j2?.usage) usage = j2.usage;
            }
          }
        } else {
          const model = localModel();
          const r = await fetch(`${OLLAMA}/api/chat`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              model, stream: true,
              messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
              options: { num_predict: 4096, temperature: 0.7 },
            }),
          });
          if (!r.ok || !r.body) {
            send({ t: "error", m: `local model not reachable (ollama ${r.status}). Is Ollama running?` });
            controller.close(); return;
          }
          const reader = r.body.getReader();
          const dec = new TextDecoder();
          let buf = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const j = JSON.parse(line);
                const tok = j?.message?.content;
                if (tok) { full += tok; send({ t: "d", c: tok }); }
              } catch { /* */ }
            }
          }
        }
      } catch (e) {
        send({ t: "error", m: String(e).slice(0, 200) });
        controller.close(); return;
      }

      const html = extractHtml(full);
      if (!html || html.length < 40) {
        send({ t: "error", m: "model did not return usable HTML — try rephrasing." });
        controller.close(); return;
      }
      try {
        const file = await uniqueFile(dir, slugify(prompt));
        await writeFile(path.join(dir, file), html, "utf8");
        send({ t: "done", file, bytes: html.length, engine, project: projectName });
      } catch (e) {
        send({ t: "error", m: `could not save file: ${String(e).slice(0, 120)}` });
      }
      // Record token usage for the dashboard (N2 only — Ollama is local + untracked).
      if (engine === "n2") {
        const nu = normalizeUsage(usage);
        if (nu) void logTokens({ agent: "freeclaude", model: N2_MODEL, ...nu, kind: "build" });
      }
      controller.close();
    },
  });

  return new Response(stream, { headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" } });
}

// avoid unused import lint
void existsSync;
