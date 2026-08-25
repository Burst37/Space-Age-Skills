// V5 smoke tests — no network, no API keys. Guards the invariants V5 was built to fix.
import assert from "node:assert/strict";
import { adaptEvidence, callProvider, supportsVideo } from "../lib/providers/index.mjs";
import { assertBudget, compressChecks, deltaSnapshot, createSnapshotCache, tok } from "../runner/token-budget.mjs";
import { newLedger, recordCall, estimateCost, ledgerSummary } from "../lib/cost/ledger.mjs";
import { builderPrompt, judgePrompt } from "../runner/prompts.mjs";
import { aggregate, quorumMet, diversityReport, median, normalizeSeats } from "../lib/judge/panel.mjs";

let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); console.log("  ok", name); pass++; } catch (e) { console.log("  FAIL", name, "—", e.message); fail++; } };

console.log("evidence routing");
await t("gemini receives the real video", () => {
  const r = adaptEvidence("gemini", { images: ["i"], video: { path: "v.webm" }, frames: ["f1"] });
  assert.ok(r.video); assert.equal(r.degraded, false);
});
await t("non-video provider degrades to keyframes, flagged", () => {
  const r = adaptEvidence("openai", { images: ["i"], video: { path: "v" }, frames: ["f1", "f2"] });
  assert.equal(r.video, null);
  assert.equal(r.degraded, "video->frames");
  assert.equal(r.images.length, 3, "frames must be folded into images, never dropped");
});
await t("video to a text-only provider is refused, not silently dropped", async () => {
  await assert.rejects(() => callProvider("openrouter", { prompt: "x", video: { path: "v" } }), /cannot accept video/);
});

await t("video capability follows the model, not the transport", () => {
  assert.equal(supportsVideo("openrouter", "moonshotai/kimi-k3"), true, "Kimi K3 takes video");
  assert.equal(supportsVideo("openrouter", "deepseek/deepseek-v4-flash"), false, "DeepSeek Flash is text-only");
  assert.equal(supportsVideo("openrouter", "anthropic/claude-opus-5"), false);
  assert.equal(supportsVideo("gemini", ""), true);
  // Same transport, opposite answers — the old provider-level set got this wrong.
  assert.notEqual(supportsVideo("openrouter", "moonshotai/kimi-k3"), supportsVideo("openrouter", "deepseek/deepseek-v4-flash"));
});
await t("each seat gets the richest evidence it can consume", () => {
  const kimi = adaptEvidence("openrouter", { images: ["i"], video: { path: "v" }, frames: ["f"], model: "moonshotai/kimi-k3" });
  assert.ok(kimi.video, "video-capable seat keeps the recording");
  const ds = adaptEvidence("openrouter", { images: ["i"], video: { path: "v" }, frames: ["f"], model: "deepseek/deepseek-v4-flash" });
  assert.equal(ds.video, null);
  assert.equal(ds.degraded, "video->frames");
});
await t("real prices are wired for every panel seat", async () => {
  const { PRICE_TABLE, estimateCost } = await import("../runner/token-budget.mjs");
  for (const m of ["openai/gpt-5.6-sol", "moonshotai/kimi-k3", "deepseek/deepseek-v4-flash", "anthropic/claude-opus-5"]) {
    assert.ok(PRICE_TABLE[`openrouter:${m}`], `no price for ${m}`);
  }
  const cheap = estimateCost({ provider: "openrouter", model: "deepseek/deepseek-v4-flash", usage: { input_tokens: 1e6 } });
  const dear = estimateCost({ provider: "openrouter", model: "anthropic/claude-opus-5", usage: { input_tokens: 1e6 } });
  assert.ok(dear > cheap * 10, "per-model pricing must actually differentiate");
});

console.log("token budget");
await t("over-budget prompt throws before the call", () => {
  assert.throws(() => assertBudget("x".repeat(400000), { maxTokens: 1000 }), /over budget/);
});
await t("passing check carries no stdout", () => {
  const c = compressChecks([{ command: "build", ok: true, stdout: "x".repeat(20000), stderr: "" }]);
  assert.ok(tok(JSON.stringify(c)) < 20, "a green check must be ~free");
});
await t("failing check keeps the error lines", () => {
  const c = compressChecks([{ command: "test", ok: false, code: 1, stdout: "noise\n".repeat(999), stderr: "Error: boom at foo.ts:12" }]);
  assert.match(JSON.stringify(c), /boom at foo\.ts:12/);
});
await t("unchanged files are not re-sent", () => {
  const files = [{ path: "a.ts", content: "A".repeat(5000) }, { path: "b.ts", content: "B".repeat(5000) }];
  const cache = createSnapshotCache();
  const full = deltaSnapshot(files, cache, { full: true });
  const next = deltaSnapshot(files, cache);
  assert.ok(tok(next) < tok(full) * 0.2, `delta ${tok(next)} vs full ${tok(full)}`);
  assert.match(next, /unchanged/);
});

console.log("cost ledger");
await t("pricing is real, tokens are recorded", () => {
  const l = newLedger();
  const usage = { input_tokens: 1e6, output_tokens: 1e5 };
  recordCall(l, { provider: "openai", role: "builder", usage, estimatedUsd: estimateCost({ provider: "openai", usage }), round: 1 });
  const s = ledgerSummary(l);
  assert.ok(s.usd > 0, "V4 reported $0 forever");
  assert.equal(s.inTok, 1e6);
});

console.log("prompt assembly");
await t("mission leads; round number never precedes it", () => {
  const cfg = { prompt: "MISSION-TEXT", hardGate: 90 };
  const a = builderPrompt({ config: cfg, round: 1, snapshot: "s1", critique: "", checks: [] });
  const b = builderPrompt({ config: cfg, round: 7, snapshot: "s2", critique: "c", checks: [] });
  assert.ok(a.startsWith("MISSION-TEXT") && b.startsWith("MISSION-TEXT"));
  assert.ok(a.indexOf("ROUND") > a.indexOf("MISSION-TEXT"), "volatile token must not sit above the payload");
  const stable = a.slice(0, a.indexOf("ROUND"));
  assert.equal(stable, b.slice(0, b.indexOf("ROUND")), "stable prefix must be byte-identical across rounds");
});
await t("judge gets the verdict, not the evidence", () => {
  const p = judgePrompt({ config: { prompt: "M", hardGate: 90 }, critique: { score: 1 }, checks: [{ cmd: "npm test", ok: true }], scoreHistory: [1] });
  assert.doesNotMatch(p, /data:image/);
  assert.ok(p.length < 2000, `judge prompt bloated: ${p.length}`);
});

console.log("judge panel");
await t("median ignores an outlier seat", () => {
  const agg = aggregate([
    { id: "a", ok: true, verdict: { score: 88, ship: true } },
    { id: "b", ok: true, verdict: { score: 90, ship: true } },
    { id: "c", ok: true, verdict: { score: 12, ship: false } },
  ], ["score"]);
  assert.equal(agg.score, 88, "one hostile seat must not swing the gate");
  assert.equal(agg.spread.score, 78);
  assert.equal(agg.dissent.length, 1);
});
await t("ship needs a real majority, not a median artifact", () => {
  const agg = aggregate([
    { id: "a", ok: true, verdict: { score: 95, ship: true } },
    { id: "b", ok: true, verdict: { score: 94, ship: false } },
    { id: "c", ok: true, verdict: { score: 93, ship: false } },
  ], ["score"]);
  assert.equal(agg.ship, false, "2 of 3 seats refused to ship");
  assert.equal(agg.shipVotes, "1/3");
});
await t("any seat can veto with hardFailure", () => {
  const agg = aggregate([
    { id: "a", ok: true, verdict: { score: 99, ship: true } },
    { id: "b", ok: true, verdict: { score: 99, ship: true, hardFailure: true } },
  ], ["score"]);
  assert.equal(agg.hardFailure, true, "safety is not a popularity contest");
});
await t("a failed seat is excluded, never scored as zero", () => {
  const agg = aggregate([
    { id: "a", ok: true, verdict: { score: 90 } },
    { id: "b", ok: false, error: "429" },
  ], ["score"]);
  assert.equal(agg.score, 90, "a dead seat must not drag the median down");
  assert.equal(agg.seatsResponded, 1);
  assert.equal(agg.failures.length, 1);
});
await t("quorum blocks a panel that mostly died", () => {
  const agg = aggregate([{ id: "a", ok: false, error: "x" }, { id: "b", ok: false, error: "y" }], ["score"]);
  assert.equal(quorumMet(agg, { minSeats: 1 }), false);
});
await t("monoculture panel is flagged, not mistaken for consensus", () => {
  const d = diversityReport([
    { id: "a", provider: "openrouter", model: "openai/gpt-5.6" },
    { id: "b", provider: "openrouter", model: "openai/gpt-5.6-mini" },
  ]);
  assert.equal(d.diverse, false);
  assert.equal(d.warnings.length, 2, "same family AND single transport");
});
await t("mixed families across mixed transports passes clean", () => {
  const d = diversityReport([
    { id: "a", provider: "openrouter", model: "anthropic/claude-sonnet-4.5" },
    { id: "b", provider: "openrouter", model: "meta-llama/llama-4-maverick" },
    { id: "c", provider: "gemini", model: "" },
  ]);
  assert.equal(d.diverse, true);
  assert.deepEqual(d.warnings, []);
});

await t("enabled:false benches a seat without deleting it", () => {
  const seats = normalizeSeats([
    { id: "a", provider: "openrouter", model: "x/y" },
    { id: "grok", provider: "xai", model: "grok-4.6", enabled: false },
  ], ["openai"]);
  assert.equal(seats.length, 1);
  assert.equal(seats[0].id, "a");
});
await t("shipped preset is six distinct families, no warnings", async () => {
  const fs = await import("node:fs/promises");
  const cfg = JSON.parse(await fs.readFile(new URL("../presets/judge-panel.json", import.meta.url), "utf8"));
  const d = diversityReport(normalizeSeats(cfg.judgePanel, ["openai"]));
  assert.equal(d.seats, 6);
  assert.equal(d.families.length, 6, "six seats must be six labs, not six slugs");
  assert.deepEqual(d.warnings, []);
  const v = diversityReport(normalizeSeats(cfg.visualPanel, ["gemini"]));
  assert.ok(v.diverse);
  assert.ok(cfg.panelQuorum.judge <= d.seats);
  assert.ok(cfg.panelQuorum.visual <= v.seats);
  // A text-only model must never sit on the panel that scores visual evidence.
  const visualModels = cfg.visualPanel.map((s) => s.model);
  assert.ok(!visualModels.includes("deepseek/deepseek-v4-flash"), "text-only seat on the visual panel");
});

await t("single-key preset keeps six labs and disables video honestly", async () => {
  const fs = await import("node:fs/promises");
  const cfg = JSON.parse(await fs.readFile(new URL("../presets/judge-panel-openrouter-only.json", import.meta.url), "utf8"));
  const seats = normalizeSeats(cfg.judgePanel, ["openrouter"]);
  const d = diversityReport(seats);
  assert.equal(d.families.length, 6, "narrowing the transport must not narrow the labs");
  assert.equal(d.singleTransport, "openrouter");
  assert.equal(d.warnings.length, 1, "single-transport risk must still be surfaced");
  assert.equal(cfg.web.sendVideo, false, "no video path over OpenRouter — say so, do not silently degrade");
  assert.ok(seats.every((x) => x.provider === "openrouter"), "one key must mean one provider");
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
