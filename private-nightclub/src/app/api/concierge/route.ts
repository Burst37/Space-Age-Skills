import { NextResponse } from "next/server";
import { venue, events, faqs, membershipTiers } from "@/lib/site";
import { systemPrompt, type Msg } from "@/lib/concierge-knowledge";

/**
 * Concierge endpoint ("Tory"). Tries Gemini first (grounded in the whole venue
 * incl. the full menu), then Claude, then a built-in knowledge base — so it
 * always answers, with or without keys configured. The venue/menu grounding
 * lives in `@/lib/concierge-knowledge` so the text and live-voice brains share it.
 */

const tonight = events[0];

const KB: { match: RegExp; answer: string }[] = [
  {
    match: /(vip|table|bottle|service|pricing|price|cost|minimum|spend|reserve|booking)/i,
    answer: `VIP tables come with reserved seating, a dedicated host, and bottle service. Pricing is set by a minimum spend that scales with the night and the section, and your host confirms it when you book. Use the Reserve VIP form on this page or call ${venue.phone} and we will set it up.`,
  },
  {
    match: /(dress|wear|code|attire|outfit)/i,
    answer:
      faqs.find((f) => /dress/i.test(f.q))?.a ??
      "The dress code is upscale: collared shirts or elevated streetwear, clean footwear, no athletic or baggy fits.",
  },
  {
    match: /(park|valet|garage|drive)/i,
    answer: faqs.find((f) => /park/i.test(f.q))?.a ?? "Valet runs at the front door from 10 PM.",
  },
  {
    match: /(hour|open|close|time|when|late)/i,
    answer: `We are open ${venue.hours
      .slice(0, 3)
      .map((h) => h.day)
      .join(", ")} from 10 PM to 3 AM. Sunday through Wednesday is reserved for private events.`,
  },
  {
    match: /(event|tonight|weekend|dj|lineup|playing|show|who)/i,
    answer: `Coming up: ${tonight.name} on ${tonight.weekday} (${tonight.date}) with ${tonight.host}. ${tonight.blurb} Want a table or the guestlist for it?`,
  },
  {
    match: /(birthday|bday|celebrat|party|private|buyout|corporate)/i,
    answer:
      "Birthday packages include a reserved section, a bottle with a sparkler parade, and a dedicated host. Full buyouts are available any night. Send the details through the VIP form and a host will build it with you.",
  },
  {
    match: /(guest ?list|list|free|entry|cover)/i,
    answer:
      "The guestlist is free and speeds up entry. Add your name for the night on the Guestlist form. It does not guarantee admission once we hit capacity, and tables and members always enter first.",
  },
  {
    match: /(member|black card|gold list|join)/i,
    answer: `Membership opens with ${membershipTiers[0].name}: ${membershipTiers[0].perks
      .slice(0, 3)
      .join(", ")}. Request an invitation from the Membership section.`,
  },
  {
    match: /(where|address|location|directions|find)/i,
    answer: `You will find us at ${venue.address.line1}, ${venue.address.line2}. Valet is at the front door.`,
  },
  {
    match: /(contact|phone|call|email|reach)/i,
    answer: `Reach the booking line at ${venue.phone} or email ${venue.email}.`,
  },
];

function knowledgeReply(text: string): string {
  const hit = KB.find((k) => k.match.test(text));
  if (hit) return hit.answer;
  return `I can help with tables and bottle service, dress code, parking, hours, events, birthdays, the guestlist, and membership. Tell me which one, or call ${venue.phone} for the desk directly.`;
}

async function geminiReply(messages: Msg[]): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const base = process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta";
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  try {
    const res = await fetch(`${base}/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        contents,
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("");
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

async function liveReply(messages: Msg[]): Promise<string | null> {
  const key = process.env.CONCIERGE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CONCIERGE_MODEL ?? "claude-opus-4-8",
        max_tokens: 320,
        system: systemPrompt(),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" ? text : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let messages: Msg[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ reply: "Sorry, I missed that. Could you ask again?" });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const reply =
    (await geminiReply(messages)) ?? (await liveReply(messages)) ?? knowledgeReply(lastUser);
  return NextResponse.json({ reply });
}
