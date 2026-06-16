import { readFile } from "node:fs/promises";
import path from "node:path";
import { VAULT_ROOT } from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serve a saved thumbnail image from <vault>/Thumbnails/<rel>. Path-guarded.
export async function GET(req: Request) {
  if (!VAULT_ROOT) return new Response("no vault", { status: 404 });
  const rel = new URL(req.url).searchParams.get("path") || "";
  const base = path.join(VAULT_ROOT, "Thumbnails");
  const abs = path.resolve(base, rel);
  if (!abs.startsWith(base + path.sep)) return new Response("forbidden", { status: 403 });
  if (!/\.(jpe?g|png|webp)$/i.test(abs)) return new Response("not an image", { status: 400 });
  try {
    const buf = await readFile(abs);
    const ext = abs.split(".").pop()!.toLowerCase();
    const type = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return new Response(new Uint8Array(buf), { headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" } });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
