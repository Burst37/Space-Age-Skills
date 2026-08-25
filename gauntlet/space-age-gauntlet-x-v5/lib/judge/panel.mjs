// V5 — judge panels. A single judge is one model's taste wearing a scoreboard. A panel of
// distinct model families disagreeing is the only cheap signal we have for "is this score real".
import { callWithFailover, adaptEvidence } from "../providers/index.mjs";
import { extractJson } from "../providers/base.mjs";
import { j } from "../../runner/token-budget.mjs";

export const median = (xs) => {
  const s = xs.filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (!s.length) return 0;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * Seats are declared as {provider, model, weight}. Mixing transports is deliberate:
 * OpenRouter gives cheap access to many families, but at least one seat should sit on a
 * direct API so an OpenRouter outage cannot blind the whole panel.
 */
export function normalizeSeats(panel, fallbackChain) {
  // `enabled: false` benches a seat without deleting it — trialling a model should not mean
  // restructuring the panel, and a benched seat stays visible in the config as a record.
  const seats = (panel || []).filter((s) => s?.provider && s.enabled !== false).map((s, i) => ({
    id: s.id || `seat${i + 1}`,
    provider: s.provider,
    model: s.model || "",
    weight: Number(s.weight ?? 1),
  }));
  if (seats.length) return seats;
  return [{ id: "seat1", provider: fallbackChain[0], model: "", weight: 1 }];
}

/**
 * Warn when a panel is not actually diverse. Three seats on the same family is one opinion
 * billed three times — the runner surfaces this rather than letting it look like consensus.
 */
export function diversityReport(seats) {
  const family = (s) => {
    const m = (s.model || "").toLowerCase();
    if (/gpt|codex|o[34]|openai/.test(m)) return "openai";
    if (/claude|anthropic/.test(m)) return "anthropic";
    if (/gemini|google/.test(m)) return "google";
    if (/grok|xai/.test(m)) return "xai";
    if (/llama|meta/.test(m)) return "meta";
    if (/mistral|mixtral/.test(m)) return "mistral";
    if (/deepseek/.test(m)) return "deepseek";
    if (/kimi|moonshot/.test(m)) return "moonshot";
    if (/qwen/.test(m)) return "qwen";
    return s.provider; // unlabelled model on a direct API == that provider's family
  };
  const families = [...new Set(seats.map(family))];
  const transports = [...new Set(seats.map((s) => s.provider))];
  return {
    seats: seats.length,
    families,
    diverse: families.length > 1,
    singleTransport: transports.length === 1 ? transports[0] : null,
    warnings: [
      families.length === 1 ? `all ${seats.length} seats are the same model family (${families[0]}) — this is one opinion, not a panel` : null,
      transports.length === 1 && seats.length > 1 ? `all seats route through ${transports[0]} — one outage blinds the panel` : null,
    ].filter(Boolean),
  };
}

/**
 * Run every seat on the same prompt/evidence, in parallel. A seat that fails is recorded and
 * excluded — it never silently becomes a zero, which would drag the median down and read as
 * a quality problem in the build.
 */
export async function runPanel({ seats, system, prompt, images = [], video = null, frames = [], maxOutputTokens, onCall = () => {} }) {
  const results = await Promise.all(seats.map(async (seat) => {
    try {
      // Each seat gets the richest evidence IT can consume: the recording if the model takes
      // video, sampled keyframes otherwise. A blind seat never silently scores on nothing.
      const ev = adaptEvidence(seat.provider, { images, video, frames, model: seat.model });
      const r = await callWithFailover([seat.provider], { system, prompt, images: ev.images, video: ev.video, model: seat.model || undefined, maxOutputTokens });
      onCall({ seat, usage: r.usage, provider: r.provider, model: seat.model, degraded: ev.degraded });
      return { ...seat, ok: true, degraded: ev.degraded, verdict: extractJson(r.text) };
    } catch (e) {
      onCall({ seat, error: e.message });
      return { ...seat, ok: false, error: e.message?.slice(0, 200) };
    }
  }));
  return results;
}

/**
 * Aggregate by weighted median, not mean — one outlier seat cannot swing the gate.
 * Spread is reported so a split panel is visible instead of being averaged away.
 */
export function aggregate(results, fields = ["score"]) {
  const live = results.filter((r) => r.ok && r.verdict);
  const out = { seatsTotal: results.length, seatsResponded: live.length, perSeat: {}, spread: {}, failures: results.filter((r) => !r.ok).map((r) => ({ id: r.id, error: r.error })) };

  for (const f of fields) {
    const vals = [];
    for (const r of live) {
      const v = Number(r.verdict?.[f]);
      if (Number.isFinite(v)) { vals.push(v); (out.perSeat[r.id] ||= {})[f] = v; }
    }
    out[f] = median(vals);
    out.spread[f] = vals.length ? Math.max(...vals) - Math.min(...vals) : null;
  }

  // Any seat calling a hard failure is a hard failure. Safety is not a popularity contest.
  out.hardFailure = live.some((r) => r.verdict?.hardFailure === true);
  // Ship requires an actual majority of responding seats, not a median artifact.
  const ships = live.filter((r) => r.verdict?.ship === true).length;
  out.ship = live.length > 0 && ships > live.length / 2;
  out.shipVotes = `${ships}/${live.length}`;

  out.dissent = live
    .filter((r) => fields.some((f) => Math.abs(Number(r.verdict?.[f] ?? 0) - out[f]) > 15))
    .map((r) => ({ id: r.id, model: r.model, reason: (r.verdict?.reason || r.verdict?.largestMismatch || "").slice(0, 200) }));

  out.reasons = live.map((r) => ({ id: r.id, model: r.model, reason: (r.verdict?.reason || r.verdict?.recommendation || r.verdict?.largestMismatch || "").slice(0, 300) }));
  return out;
}

/** A panel that mostly failed to respond is not a verdict. */
export function quorumMet(agg, { minSeats = 1 } = {}) {
  return agg.seatsResponded >= Math.max(1, minSeats);
}

export function panelSummary(agg, fields = ["score"]) {
  return j({
    ...Object.fromEntries(fields.map((f) => [f, agg[f]])),
    spread: agg.spread,
    ship: agg.ship,
    shipVotes: agg.shipVotes,
    hardFailure: agg.hardFailure,
    seats: `${agg.seatsResponded}/${agg.seatsTotal}`,
    dissent: agg.dissent,
  });
}
