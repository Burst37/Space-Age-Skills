import { resolveModel, OLLAMA } from "@/lib/localModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Local chat — streams from Ollama running 100% on this Mac (no cloud, no cost).
// Uses Ollama's native /api/chat so we get REAL eval_count/eval_duration → live tok/s.
// Envelope: {"t":"model","model":"…"} · {"t":"d","c":"…"} · {"t":"stats","tps":37,"tokens":120,"model":"…"} · {"t":"done"} · {"t":"error","m":"…"}
// Model follows whatever's pinned warm in Ollama (see resolveModel in lib/localModel).
const CHAT_ENDPOINT = `${OLLAMA}/api/chat`;

interface ChatMsg { role: "user" | "assistant"; text: string; }

export async function POST(req: Request) {
  const { prompt, history = [] } = (await req.json()) as { prompt: string; history?: ChatMsg[] };
  const { model } = await resolveModel();
  const enc = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      send({ t: "model", model }); // tell the UI which model is actually answering
      const messages = [
        {
          role: "system",
          content:
            `You are a fast local model (${model}) running entirely on the user's own computer via Ollama — no cloud, no cost, fully offline. Be concise and direct.\n\n` +
            "BUILD MODE: When the user asks you to build, make, create, design, or show something visual (a web page, UI, landing page, game, animation, chart, SVG, calculator, dashboard, demo, etc.), respond with ONE short sentence, then output a COMPLETE, self-contained single-file HTML document inside ONE ```html code block.\n" +
            "Hard requirements for the build:\n" +
            "- It must ACTUALLY RUN AND WORK on first load — the animation/game loop starts immediately, every control responds, nothing is left as a stub or TODO. Mentally trace the JS to confirm it runs before you finish.\n" +
            "- Fill the screen: center the content and size any <canvas> large (about min(90vw,90vh)), never a tiny corner box. Dark background.\n" +
            "- For games: a continuous game loop, keyboard/mouse controls that work, a visible score, collision + game-over, and restart. Genuinely playable.\n" +
            "- Polish it: clear colors, readable text, smooth motion.\n" +
            "- Inline ALL CSS in <style> and ALL JS in <script>. No external local files. You MAY load CDN libraries via <script src> (three.js, GSAP). Never split into multiple files. Do not write anything after the closing ``` fence.\n\n" +
            "Otherwise (questions, quick snippets, drafts, explanations) just answer normally — no HTML wrapper. If a task truly needs huge context or long-horizon reasoning, say so briefly and suggest a cloud agent (GLM/Kimi/Claude).",
        },
        ...history.slice(-20).map((h) => ({ role: h.role, content: h.text })),
        { role: "user", content: prompt },
      ];
      try {
        // keep_alive:"30m" keeps the model warm for half an hour after use, then frees
        // the RAM (we used to pin -1 = forever, which swapped the Mac when a big model
        // got loaded). We target whatever's already warm, so there's nothing to reload.
        const r = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // think:false — for thinking models (e.g. North Mini Code) skip the reasoning
          // pass so builds stay instant; harmless no-op for non-thinking models (gpt-oss).
          body: JSON.stringify({ model, messages, stream: true, keep_alive: "30m", think: false }),
        });
        if (!r.ok || !r.body) {
          const t = await r.text().catch(() => "");
          send({ t: "error", m: `Ollama HTTP ${r.status}: ${t.slice(0, 200) || "model not found? try: ollama pull " + model}` });
          send({ t: "done" }); controller.close(); return;
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
            const s = line.trim();
            if (!s) continue;
            try {
              const j = JSON.parse(s);
              const c = j.message?.content;
              if (c) send({ t: "d", c });
              if (j.done) {
                const ec = j.eval_count || 0;
                const ed = (j.eval_duration || 0) / 1e9;
                if (ec && ed) send({ t: "stats", tps: Math.round(ec / ed), tokens: ec, model });
              }
            } catch { /* skip partials */ }
          }
        }
        send({ t: "done" }); controller.close();
      } catch (e) {
        send({ t: "error", m: `Can't reach local Ollama at 127.0.0.1:11434 — is Ollama running? ${String(e).slice(0, 120)}` });
        send({ t: "done" }); controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" } });
}
