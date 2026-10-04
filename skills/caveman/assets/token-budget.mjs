// caveman/token-budget.mjs — machine-side token reduction for builder/critic/judge loops.
// Drop-in for Space Age Gauntlet X V4 (runner/) or any multi-round agent runner.

/** Rough token estimate. 1 tok ~= 4 chars for code/JSON. Good enough for budgeting. */
export const tok = (s) => Math.ceil(String(s ?? "").length / 4);

/** Compact JSON. Never pretty-print into a prompt: indentation is billed. */
export const j = (v) => JSON.stringify(v ?? null);

/**
 * Delta snapshot. Round 1 sends full bodies; later rounds send bodies only for
 * files whose hash changed, plus a one-line manifest for everything else.
 */
export function createSnapshotCache() {
  return new Map(); // path -> {hash, chars}
}

export function hashOf(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * @param files [{path, content}]
 * @param cache from createSnapshotCache()
 * @param opts {full:boolean, maxChars:number}
 */
export function deltaSnapshot(files, cache, { full = false, maxChars = 140000 } = {}) {
  const bodies = [], manifest = [];
  let chars = 0;
  for (const f of files) {
    const h = hashOf(f.content);
    const known = cache.get(f.path);
    const changed = full || !known || known.hash !== h;
    cache.set(f.path, { hash: h, chars: f.content.length });
    if (changed && chars < maxChars) {
      const body = f.content.slice(0, maxChars - chars);
      bodies.push(`--- FILE: ${f.path}\n${body}`);
      chars += body.length;
    } else {
      manifest.push(`${f.path} (${f.content.length}c, unchanged)`);
    }
  }
  const parts = [];
  if (bodies.length) parts.push(bodies.join("\n\n"));
  if (manifest.length) parts.push(`--- UNCHANGED SINCE LAST ROUND (content already reviewed)\n${manifest.join("\n")}`);
  return parts.join("\n\n");
}

/**
 * Check-result compressor. A passing build's stdout is pure cost — drop it.
 * A failing one only needs the tail and the lines that name an error.
 */
export function compressChecks(checks = [], { tailChars = 1500, maxErrLines = 20 } = {}) {
  return (checks || []).map((c) => {
    if (c.ok) return { cmd: c.command, ok: true };
    const blob = `${c.stdout || ""}\n${c.stderr || ""}`;
    const errLines = blob
      .split("\n")
      .filter((l) => /error|fail|✕|✗|cannot|undefined is not|Expected/i.test(l))
      .slice(0, maxErrLines);
    return {
      cmd: c.command,
      ok: false,
      code: c.code,
      errors: errLines,
      tail: blob.slice(-tailChars),
    };
  });
}

/** Strip screenshot paths / raw axe nodes; keep the judgeable signal only. */
export function compressWebInspection(web) {
  if (!web || web.error) return web || null;
  return (web || []).map((r) => ({
    vp: r.viewport?.name,
    status: r.status,
    title: r.title,
    consoleErrors: (r.consoleErrors || []).slice(0, 10),
    a11y: (r.accessibility?.violations || [])
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}:${v.impact}:${v.nodes}`),
  }));
}

/**
 * Cache-friendly prompt assembly. Providers cache on an exact prefix match, so
 * everything stable (mission, system, constraints) must come FIRST and byte-identical
 * every round. Round numbers and volatile state go last.
 */
export function assemblePrompt({ stable = [], volatile = [] }) {
  return [...stable, ...volatile].filter(Boolean).join("\n\n");
}

/** Hard budget. Throw before spending, not after. */
export function assertBudget(prompt, { maxTokens = 60000, label = "prompt" } = {}) {
  const n = tok(prompt);
  if (n > maxTokens) {
    throw new Error(`[caveman] ${label} is ${n} tok, over budget ${maxTokens}. Tighten snapshot/checks before calling.`);
  }
  return n;
}

/** Real pricing so the ledger stops reporting $0. USD per 1M tokens. */
export const PRICE_TABLE = {
  "openai:default": { in: 1.25, out: 10 },
  "gemini:default": { in: 0.3, out: 2.5 },
  "xai:default": { in: 3, out: 15 },
  "openrouter:default": { in: 1, out: 5 },
  "generic:default": { in: 0, out: 0 },
};

export function estimateCost({ provider, model, usage }, table = PRICE_TABLE) {
  const inTok = usage?.input_tokens ?? usage?.prompt_tokens ?? usage?.promptTokenCount ?? 0;
  const outTok = usage?.output_tokens ?? usage?.completion_tokens ?? usage?.candidatesTokenCount ?? 0;
  const p = table[`${provider}:${model || "default"}`] || table[`${provider}:default`] || { in: 0, out: 0 };
  return (inTok / 1e6) * p.in + (outTok / 1e6) * p.out;
}
