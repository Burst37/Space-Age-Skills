import { NextResponse } from "next/server";
import { OWNER_COOKIE, expectedToken } from "@/lib/owner-auth";

/** Exchanges the owner passcode for a session cookie. */
export async function POST(req: Request) {
  let p: { passcode?: string };
  try {
    p = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const expected = process.env.OWNER_PASSCODE;
  if (!expected || String(p?.passcode ?? "") !== expected) {
    return NextResponse.json({ ok: false, error: "Wrong passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE, await expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
