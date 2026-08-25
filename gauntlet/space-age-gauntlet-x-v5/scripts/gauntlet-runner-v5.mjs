import fs from "node:fs/promises";
import path from "node:path";
import { callWithFailover, adaptEvidence, providerAvailable } from "../lib/providers/index.mjs";
import { extractJson } from "../lib/providers/base.mjs";
import { collectFiles, createSnapshotCache, deltaSnapshot, writeFiles } from "../runner/fs-tools.mjs";
import { runChecks } from "../runner/checks.mjs";
import { BUILDER_SYSTEM, builderPrompt, CRITIC_SYSTEM, criticPrompt, JUDGE_SYSTEM, judgePrompt } from "../runner/prompts.mjs";
import { compressChecks, compressWebInspection, assertBudget, tok, j } from "../runner/token-budget.mjs";
import { createRun, saveRound, saveState } from "../runner/state.mjs";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ensureCheckpoint, commitRound, pushBranch } from "../lib/git/git-tools.mjs";
import { newLedger, recordCall, estimateCost, mergePricing, ledgerSummary } from "../lib/cost/ledger.mjs";
import { captureScrollPath } from "../lib/visual/capture.mjs";
import { buildEvidencePacket, visualJudgeSystem, visualJudgePrompt } from "../lib/visual/evidence.mjs";
import { scoutBenchmarks } from "../lib/benchmark/scout.mjs";
import { emit } from "../lib/monitor/bus.mjs";
import { normalizeSeats, diversityReport, runPanel, aggregate, quorumMet, panelSummary } from "../lib/judge/panel.mjs";

const resumeMode = process.argv.includes("--resume");
const configArg = process.argv.find((x) => x.endsWith(".json")) || "gauntlet.project.json";
const config = JSON.parse(await fs.readFile(configArg, "utf8"));
await fs.mkdir(config.workspace, { recursive: true });

const PRICING = mergePricing(config.pricing);
const BUDGET = { builder: 60000, critic: 45000, judge: 15000, visual: 30000, ...(config.tokenBudget || {}) };

// V5: chains, not single picks — a mid-run 429 no longer kills the gauntlet.
const POOL = ["openai", "gemini", "xai", "openrouter", "generic"];
const chainFor = (role, preferred) => [preferred, ...POOL.filter((p) => p !== preferred)].filter(providerAvailable);
const builderChain = chainFor("builder", config.provider?.builder || "openai");
const criticChain = chainFor("critic", config.provider?.critic || "gemini");
const judgeChain = chainFor("judge", config.provider?.judge || "xai");
// The visual judge must see. Gemini first: it is the only adapter with native video.
const visualChain = chainFor("visual", config.provider?.visual || "gemini");
if (!builderChain.length) throw new Error("No provider credentials available.");

// Judge panels. Declare seats in config.judgePanel / config.visualPanel; omit for a single
// seat on the role's chain (V4 behaviour). OpenRouter is the cheapest way to seat several
// model families at once — but diversity is asserted here, not assumed.
const judgeSeats = normalizeSeats(config.judgePanel, judgeChain);
const visualSeats = normalizeSeats(config.visualPanel, visualChain);
const judgeDiversity = diversityReport(judgeSeats);
const visualDiversity = diversityReport(visualSeats);
for (const w of [...judgeDiversity.warnings, ...visualDiversity.warnings]) console.warn(`[panel] ${w}`);

let run;
if (resumeMode && config.resumeStatePath) {
  const state = JSON.parse(await fs.readFile(config.resumeStatePath, "utf8"));
  run = { dir: path.dirname(config.resumeStatePath), state };
} else run = await createRun(config);
let { dir: runDir, state } = run;
state.costLedger = state.costLedger || newLedger();
state.visualLedger = state.visualLedger || {};
state.events = state.events || [];
state.panels = { judge: judgeDiversity, visual: visualDiversity };

const snapCache = createSnapshotCache();
const note = (e) => { state.events.push({ ts: new Date().toISOString(), ...e }); emit(runDir, e); };

if (config.git?.enabled !== false && !resumeMode) {
  state.git = await ensureCheckpoint(config.workspace, "pre-gauntlet checkpoint");
  await saveState(runDir, state);
}

if (config.liveBenchmarkScout && !state.benchmarkManifest) {
  try {
    const b = await scoutBenchmarks({ goal: config.goal, taskType: config.taskType, provider: config.benchmarkProvider || judgeChain[0], model: config.benchmarkModel || "", knownReferences: config.references || "" });
    state.benchmarkManifest = b.manifest;
    recordCall(state.costLedger, { provider: b.provider, model: config.benchmarkModel || "", role: "benchmark", usage: b.usage, estimatedUsd: estimateCost({ provider: b.provider, model: config.benchmarkModel, usage: b.usage }, PRICING), round: 0 });
    await saveState(runDir, state);
  } catch (e) { note({ type: "benchmark_error", error: e.message }); }
}

/**
 * V5 inspection. V4 took a still per viewport and handed the judge the file PATH.
 * Here each viewport also records a scripted scroll journey, which is what any honest
 * motionFidelity score has to be based on.
 */
async function inspectWeb(round) {
  if (!config.web?.enabled) return null;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const vp of config.web.viewports || []) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const consoleErrors = [];
      page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
      const res = await page.goto(config.web.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
      const shot = path.join(runDir, `round-${String(round).padStart(2, "0")}-${vp.name}.png`);
      await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
      let axe = null;
      try { axe = await new AxeBuilder({ page }).analyze(); } catch {}
      await page.close();

      let scrollPath = null;
      if (config.web.captureScroll !== false) {
        scrollPath = await captureScrollPath(browser, {
          url: config.web.url,
          viewport: vp,
          outDir: path.join(runDir, `round-${String(round).padStart(2, "0")}-${vp.name}-scroll`),
          steps: config.web.scrollSteps ?? 8,
          maxFrames: config.web.maxFrames ?? 12,
        }).catch((e) => { note({ type: "scroll_capture_failed", vp: vp.name, error: e.message }); return null; });
      }

      results.push({
        viewport: vp, status: res?.status() || 0, title: await Promise.resolve(scrollPath?.title || ""),
        consoleErrors, screenshot: shot, scrollPath,
        accessibility: axe ? { violations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })) } : null,
      });
    }
  } finally { await browser.close(); }
  return results;
}

async function callLogged(chain, args, role, round, extra = {}) {
  const r = await callWithFailover(chain, args, { onEvent: note });
  recordCall(state.costLedger, {
    provider: r.provider, model: args.model || "", role, round, usage: r.usage,
    estimatedUsd: estimateCost({ provider: r.provider, model: args.model, usage: r.usage }, PRICING),
    ...extra,
  });
  return r;
}

const startRound = resumeMode ? (state.round || 0) + 1 : 1;
let critiqueText = "", previousChecks = [], plateauCount = 0;
state.scores = state.scores || [];
let lastScore = state.scores.length ? state.scores.at(-1) : null;

for (let round = startRound; round <= config.maxRounds; round++) {
  state.round = round;
  console.log(`\n=== V5 ROUND ${round}/${config.maxRounds} ===`);
  note({ type: "round_start", round });

  const files = await collectFiles(config.workspace, { maxFiles: config.snapshot?.maxFiles ?? 80 });
  // Round 1 sends full bodies; later rounds send only what changed plus a manifest.
  const before = deltaSnapshot(files, snapCache, { full: round === 1, maxChars: config.snapshot?.maxChars ?? 140000 });

  const candidates = Math.max(1, config.parallelCandidates || 1);
  const candidateResults = [];
  for (let c = 0; c < candidates; c++) {
    const bp = builderPrompt({ config, round, snapshot: before, critique: critiqueText, checks: previousChecks }) +
      (candidates > 1 ? `\n\nCANDIDATE ${c + 1}/${candidates}\nProduce an independent solution strategy.` : "");
    assertBudget(bp, { maxTokens: BUDGET.builder, label: `builder(round ${round})` });
    const br = await callLogged(builderChain, { model: config.model?.builder || undefined, system: BUILDER_SYSTEM, prompt: bp, maxOutputTokens: config.maxOutputTokens?.builder }, "builder", round);
    candidateResults.push({ index: c, parsed: extractJson(br.text), raw: br });
  }

  let winner = candidateResults[0];
  if (candidateResults.length > 1) {
    const judgeCandidates = candidateResults.map((x) => ({ index: x.index, summary: x.parsed.summary, files: (x.parsed.files || []).map((f) => ({ path: f.path, chars: String(f.content || "").length })) }));
    const jr = await callLogged(judgeChain, {
      model: config.model?.judge || undefined,
      system: 'You are a blind implementation tournament judge. Return strict JSON: {"winner":0,"reason":"..."}',
      prompt: `MISSION\n${config.goal}\n\nCANDIDATES\n${j(judgeCandidates)}`,
    }, "candidate_judge", round);
    const pick = extractJson(jr.text);
    winner = candidateResults.find((x) => x.index === Number(pick.winner)) || winner;
  }

  const written = await writeFiles(config.workspace, winner.parsed.files || [], config.protectedPaths || []);
  const rawChecks = await runChecks(config.checks || [], config.workspace);
  const checks = compressChecks(rawChecks);
  const rawWeb = await inspectWeb(round).catch((e) => ({ error: e.message }));
  const afterFiles = await collectFiles(config.workspace, { maxFiles: config.snapshot?.maxFiles ?? 80 });
  const after = deltaSnapshot(afterFiles, snapCache, { maxChars: config.snapshot?.maxChars ?? 140000 });

  // ---- Visual judge: the round's headline change. Real pixels, not file paths. ----
  let visualVerdict = null;
  if (Array.isArray(rawWeb) && rawWeb.length && visualChain.length) {
    const packet = await buildEvidencePacket(rawWeb, config.referenceDNA, { maxImages: config.web?.maxEvidenceImages ?? 10 });
    // Route by the lead seat's actual model — video support is a model property, not a
    // transport one (OpenRouter carries both video-capable Kimi K3 and text-only DeepSeek).
    const lead = visualSeats[0];
    const ev = adaptEvidence(lead.provider, { images: packet.images, video: config.web?.sendVideo === false ? null : packet.video, frames: packet.frames, model: lead.model });
    const target = lead.provider;
    if (ev.degraded) note({ type: "evidence_degraded", provider: target, mode: ev.degraded });
    const seatResults = await runPanel({
      seats: visualSeats,
      system: visualJudgeSystem(),
      prompt: visualJudgePrompt(packet),
      images: packet.images,
      video: config.web?.sendVideo === false ? null : packet.video,
      frames: packet.frames,
      maxOutputTokens: config.maxOutputTokens?.visual,
      onCall: ({ seat, usage, provider, error, degraded }) => {
        if (error) return note({ type: "visual_seat_failed", seat: seat.id, error });
        if (degraded) note({ type: "seat_evidence_degraded", seat: seat.id, model: seat.model, mode: degraded });
        recordCall(state.costLedger, { provider: provider || seat.provider, model: seat.model, role: "visual_judge", round, usage, estimatedUsd: estimateCost({ provider: provider || seat.provider, model: seat.model, usage }, PRICING), degraded });
      },
    });
    const agg = aggregate(seatResults, ["techniqueFidelity", "originality", "visualQuality", "responsiveQuality", "motionFidelity"]);
    if (!quorumMet(agg, { minSeats: config.panelQuorum?.visual ?? 1 })) {
      note({ type: "visual_panel_no_quorum", ...agg });
      visualVerdict = { unevidenced: true, error: "visual panel failed to reach quorum", failures: agg.failures };
    } else {
      visualVerdict = {
        ...agg,
        largestMismatch: agg.reasons[0]?.reason || "",
        evidence: { images: ev.images.length, video: Boolean(ev.video), degraded: ev.degraded },
      };
      if (agg.dissent.length) note({ type: "visual_panel_dissent", round, dissent: agg.dissent, spread: agg.spread });
    }
  }

  const webInspection = compressWebInspection(rawWeb);

  const cp = criticPrompt({ config, round, snapshot: after, checks, webInspection, previousLedger: state.ledger, visualVerdict });
  assertBudget(cp, { maxTokens: BUDGET.critic, label: `critic(round ${round})` });
  const cr = await callLogged(criticChain, { model: config.model?.critic || undefined, system: CRITIC_SYSTEM, prompt: cp, maxOutputTokens: config.maxOutputTokens?.critic }, "critic", round);
  const critique = extractJson(cr.text);

  const jp = judgePrompt({ config, critique, checks, scoreHistory: state.scores });
  assertBudget(jp, { maxTokens: BUDGET.judge, label: `judge(round ${round})` });
  const judgeResults = await runPanel({
    seats: judgeSeats,
    system: JUDGE_SYSTEM,
    prompt: jp,
    maxOutputTokens: config.maxOutputTokens?.judge,
    onCall: ({ seat, usage, provider, error }) => {
      if (error) return note({ type: "judge_seat_failed", seat: seat.id, error });
      recordCall(state.costLedger, { provider: provider || seat.provider, model: seat.model, role: "judge", round, usage, estimatedUsd: estimateCost({ provider: provider || seat.provider, model: seat.model, usage }, PRICING) });
    },
  });
  const judgeAgg = aggregate(judgeResults, ["score"]);
  if (!quorumMet(judgeAgg, { minSeats: config.panelQuorum?.judge ?? 1 })) {
    note({ type: "judge_panel_no_quorum", round, ...judgeAgg });
    throw new Error(`Judge panel failed to reach quorum in round ${round}: ${j(judgeAgg.failures)}`);
  }
  // Weighted median across seats; any seat calling hardFailure wins; ship needs a majority.
  const judge = {
    score: judgeAgg.score,
    ship: judgeAgg.ship,
    hardFailure: judgeAgg.hardFailure,
    reason: judgeAgg.reasons.map((r) => `${r.id}: ${r.reason}`).join(" || "),
    acceptedPasses: critique.passed || [],
    rejectedPasses: critique.regressions || [],
    panel: { spread: judgeAgg.spread.score, shipVotes: judgeAgg.shipVotes, seats: `${judgeAgg.seatsResponded}/${judgeAgg.seatsTotal}`, dissent: judgeAgg.dissent },
  };
  if (judgeAgg.dissent.length) note({ type: "judge_panel_dissent", round, dissent: judgeAgg.dissent, spread: judgeAgg.spread.score });
  const score = Number(judge.score ?? critique.score ?? 0);
  // A split panel is not a consensus. Refuse to ship on a wide disagreement.
  const splitPanel = Number(judgeAgg.spread.score || 0) > Number(config.maxJudgeSpread ?? 25);
  if (splitPanel) note({ type: "judge_panel_split", round, spread: judgeAgg.spread.score });

  for (const p of judge.acceptedPasses || critique.passed || []) state.ledger[p] = { round, score };
  for (const p of judge.rejectedPasses || critique.regressions || []) delete state.ledger[p];
  state.scores.push(score);
  state.visualLedger[round] = visualVerdict;

  if (lastScore !== null && Math.abs(score - lastScore) < (config.plateauDelta ?? 1)) plateauCount++; else plateauCount = 0;
  lastScore = score;

  await saveRound(runDir, round, { round, written, checks, webInspection, visualVerdict, critique, judge, judgeSeats: judgeResults.map((r) => ({ id: r.id, model: r.model, ok: r.ok, score: r.verdict?.score, ship: r.verdict?.ship, error: r.error })), score, costLedger: state.costLedger, ledger: state.ledger });
  if (state.git?.enabled) await commitRound(config.workspace, round, score);
  await saveState(runDir, state);

  const checksPass = checks.every((x) => x.ok);
  // A verdict with no imagery behind it cannot clear a visual gate.
  const refPass = !visualVerdict || (
    !visualVerdict.unevidenced &&
    Number(visualVerdict.techniqueFidelity || 0) >= Number(config.referenceGate || 85) &&
    Number(visualVerdict.originality || 0) >= Number(config.originalityGate || 85)
  );

  const sum = ledgerSummary(state.costLedger);
  console.log(`score=${score} (panel ${judge.panel.seats}, spread ${judge.panel.spread}, ship ${judge.panel.shipVotes}) checks=${checksPass} visual=${refPass} tok=${sum.inTok}in/${sum.outTok}out cost≈$${sum.usd}`);
  note({ type: "round_end", round, score, checksPass, refPass, ...sum });

  if (judge.ship && !judge.hardFailure && !splitPanel && checksPass && refPass && score >= config.hardGate) {
    state.status = "shipped"; state.finishedAt = new Date().toISOString();
    if (config.git?.pushOnShip) state.push = await pushBranch(config.workspace, config.git?.remote || "origin");
    await saveState(runDir, state);
    console.log("V5 GAUNTLET PASSED — SHIP.");
    note({ type: "shipped", round, score });
    process.exit(0);
  }

  if (plateauCount >= (config.plateauRounds ?? 2)) {
    critiqueText = `PLATEAU DETECTED. Change strategy, root cause, decomposition or implementation approach. Do not repeat prior tactics. ` +
      j({ largestGap: critique.largestGap, regressions: critique.regressions, visualGap: visualVerdict?.largestMismatch });
    plateauCount = 0;
  } else {
    // Carry the verdict, not the evidence blob.
    critiqueText = j({ largestGap: critique.largestGap, recommendation: critique.recommendation, regressions: critique.regressions, visual: visualVerdict && { largestMismatch: visualVerdict.largestMismatch, evidenceGaps: visualVerdict.evidenceGaps } });
  }
  previousChecks = checks;
}

state.status = "max_rounds"; state.finishedAt = new Date().toISOString();
await saveState(runDir, state);
console.log(`V5 stopped at max rounds. ${j(ledgerSummary(state.costLedger))}`);
process.exit(2);
