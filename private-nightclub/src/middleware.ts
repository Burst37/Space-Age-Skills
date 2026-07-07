import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { OWNER_COOKIE, expectedToken } from "@/lib/owner-auth";

/** Guards the owner dashboard and its read API behind the session cookie. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page and login endpoint must stay open.
  if (pathname === "/owner/login" || pathname === "/api/owner/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(OWNER_COOKIE)?.value;
  const authed = !!token && token === (await expectedToken());
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/owner")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/owner/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/owner", "/owner/:path*", "/api/owner/:path*"],
};
