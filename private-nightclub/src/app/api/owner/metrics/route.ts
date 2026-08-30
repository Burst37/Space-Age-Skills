import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Aggregated owner metrics. Access is gated by middleware (owner cookie). */
export async function GET() {
  const supabase = db();
  const [opensRes, ctaRes, signupsRes] = await Promise.all([
    supabase.from("menu_opens").select("item,category,tab"),
    supabase.from("cta_clicks").select("label"),
    supabase
      .from("signups")
      .select("email,name,source,created_at")
      .order("created_at", { ascending: false }),
  ]);

  const opens = opensRes.data ?? [];
  const cta = ctaRes.data ?? [];
  const signups = signupsRes.data ?? [];

  // Rank menu items by number of opens, keyed within their tab.
  const byItem = new Map<string, { item: string; tab: string; category: string; count: number }>();
  const byCategory = new Map<string, number>();
  for (const r of opens) {
    const tab = r.tab ?? "";
    const key = `${tab}|${r.item}`;
    const cur = byItem.get(key) ?? { item: r.item, tab, category: r.category ?? "", count: 0 };
    cur.count += 1;
    byItem.set(key, cur);
    if (r.category) byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + 1);
  }
  const items = [...byItem.values()].sort((a, b) => b.count - a.count);

  const ctaCounts: Record<string, number> = {};
  for (const c of cta) ctaCounts[c.label] = (ctaCounts[c.label] ?? 0) + 1;

  const topItem = items[0]?.item ?? "—";
  const busiestCategory =
    [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return NextResponse.json({
    totals: { signups: signups.length, opens: opens.length },
    items,
    ctaCounts,
    topItem,
    busiestCategory,
    signups,
  });
}
