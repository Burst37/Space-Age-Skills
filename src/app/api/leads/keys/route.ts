import { saveProviderKey, providerStatus } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { provider, key } = await req.json().catch(() => ({}));
  const res = saveProviderKey(String(provider || ""), String(key || ""));
  if (!res.ok) return Response.json({ error: res.error || "Could not save key." }, { status: 400 });
  return Response.json({ ok: true, providers: providerStatus() }, { headers: { "cache-control": "no-store" } });
}