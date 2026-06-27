/**
 * Shared owner-session helpers. The session cookie holds a SHA-256 token
 * derived from OWNER_PASSCODE so the raw passcode is never stored in the
 * cookie. crypto.subtle is available in both the Edge middleware and Node
 * route handlers, so this one helper works in both runtimes.
 */
export const OWNER_COOKIE = "owner_session";

export async function expectedToken(): Promise<string> {
  const secret = process.env.OWNER_PASSCODE ?? "";
  const data = new TextEncoder().encode(`nightclub-owner:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
