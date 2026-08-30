import { NextResponse } from "next/server";
import { OWNER_COOKIE } from "@/lib/owner-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
