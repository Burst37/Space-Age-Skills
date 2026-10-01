import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Captures an email for the venue list. Deduplicates on email. */
export async function POST(req: Request) {
  let p: { email?: string; name?: string; source?: string };
  try {
    p = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = String(p?.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 422 });
  }

  try {
    const supabase = db();
    const { error } = await supabase.from("signups").upsert(
      {
        email,
        name: p?.name ? String(p.name).slice(0, 80) : null,
        source: p?.source ? String(p.source).slice(0, 40) : "join",
      },
      { onConflict: "email", ignoreDuplicates: true },
    );
    if (error) throw error;
  } catch (err) {
    console.error("[signup] upsert failed:", err);
    return NextResponse.json({ ok: false, error: "Could not save right now." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
