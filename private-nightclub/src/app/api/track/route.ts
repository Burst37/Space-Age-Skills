import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Records a menu-card open or a CTA click. Always acknowledges; failures are
 *  logged but never surfaced (analytics must not break the page). */
export async function POST(req: Request) {
  let p: { type?: string; item?: string; category?: string; tab?: string; label?: string };
  try {
    p = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const supabase = db();
    if (p?.type === "menu" && typeof p.item === "string") {
      await supabase.from("menu_opens").insert({
        item: p.item.slice(0, 120),
        category: p.category ? String(p.category).slice(0, 60) : null,
        tab: p.tab ? String(p.tab).slice(0, 20) : null,
      });
    } else if (p?.type === "cta" && typeof p.label === "string") {
      await supabase.from("cta_clicks").insert({ label: p.label.slice(0, 60) });
    } else {
      return NextResponse.json({ ok: false }, { status: 422 });
    }
  } catch (err) {
    console.error("[track] insert failed:", err);
  }
  return NextResponse.json({ ok: true });
}
