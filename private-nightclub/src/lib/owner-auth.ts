/**
 * Shared owner-session helpers. The session cookie holds a SHA-256 token
 * derived from OWNER_PASSCODE so the raw passcode is never stored in the
 * cookie. crypto.subtle is available in both the Edge middleware and Node
 * route handlers, so this one helper works in both runtimes.
 */
export const OWNER_COOKIE = "owner_session";

export async function expectedToken(): Promise<string> {
  const secret = process.env.OWNER_PASSCODE ?? "";
  // Fail closed: with no configured passcode, return an unguessable,
  // non-reproducible token so no cookie can ever validate. Otherwise an
  // attacker could forge the cookie as SHA-256 of the known empty secret and
  // walk into /owner and /api/owner/*. Login already rejects an empty passcode.
  if (!secret) {
    return `${crypto.randomUUID()}${crypto.randomUUID()}`;
  }
  const data = new TextEncoder().encode(`nightclub-owner:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
