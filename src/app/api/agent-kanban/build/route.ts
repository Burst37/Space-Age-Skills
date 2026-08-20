import { NextResponse } from "next/server";
import { resolveModel, localChat, extractHtml } from "@/lib/localOllama";
import { recordBuild } from "@/lib/kanbanStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The Builder agent — turns one card into a complete single-file HTML, offline.
const SYS =
  "You are the Builder on a small team. Build EXACTLY what the card asks as ONE complete, self-contained HTML document. " +
  "Inline all CSS in <style> and all JS in <script>. It must run on its own with no build step and no external local files " +
  "(CDN <script src> is fine). Make it look good — dark background, a bold accent colour, clean layout. " +
  "Output ONLY the HTML in a single ```html code block. No explanation.";

export async function POST(req: Request) {
  const { id, title, brief, goal } = await req.json();
  if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,40}$/.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  if (typeof title !== "string" || !title.trim()) return NextResponse.json({ error: "missing title" }, { status: 400 });

  const model = await resolveModel();
  const prompt = `Card: ${title}\nBuild: ${brief || title}`;
  try {
    const raw = await localChat(model, SYS, prompt, { temperature: 0.5 });
    const html = extractHtml(raw);
    // The Reviewer: verify a real, renderable HTML artifact actually came out.
    const ok = !!html && /<(html|body|canvas|svg|div|style)/i.test(html) && html.length > 120;
    if (!ok) {
      return NextResponse.json({ ok: false, model, bytes: 0, verdict: "rejected", note: "no usable HTML came back — the local model may have rambled instead of building" });
    }
    const bytes = Buffer.byteLength(html!);
    // Save into the durable workspace (survives reload + reboot, unlike /tmp).
    await recordBuild({ id, title: String(title).slice(0, 80), brief: String(brief ?? "").slice(0, 240), goal: String(goal ?? "").slice(0, 160), model, bytes, createdAt: Date.now() }, html!);
    return NextResponse.json({ ok: true, model, bytes, verdict: "approved", note: "real HTML in your workspace — verified" });
  } catch (e) {
    return NextResponse.json({ ok: false, model, bytes: 0, verdict: "error", note: String(e).slice(0, 160) }, { status: 502 });
  }
}
