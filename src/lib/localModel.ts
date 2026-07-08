// Single source of truth for "which local model is the Local agent using right now".
// The agent FOLLOWS whatever model you've pinned warm in Ollama, so labels never lie
// and you never eat a cold-load. Precedence:
//   1. LOCAL_MODEL env (explicit override) — respected even if not warm
//   2. whatever model is currently loaded/warm (ollama ps) — the common case
//   3. FALLBACK_MODEL (nothing warm, no override)
export const OLLAMA = "http://127.0.0.1:11434";
export const FALLBACK_MODEL = "xentriom/gemma-4-12B-coder-fable5-composer2.5-v1";

export async function resolveModel(): Promise<{ model: string; warm: boolean }> {
  const forced = process.env.LOCAL_MODEL;
  if (forced) return { model: forced, warm: true };
  try {
    const r = await fetch(`${OLLAMA}/api/ps`, { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      const loaded: string[] = (j.models || [])
        .map((m: { name?: string; model?: string }) => m.name || m.model)
        .filter(Boolean);
      if (loaded.length) return { model: loaded[0], warm: true };
    }
  } catch { /* ollama down — fall through */ }
  return { model: FALLBACK_MODEL, warm: false };
}
