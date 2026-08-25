# SPACE AGE GAUNTLET X V5 — MASTER HANDOFF

## Thesis

**V4 judged rendered work from file paths. V5 judges the pixels.**

V4's `lib/visual/diff.mjs` built an evidence object containing `screenshot: "/runs/.../mobile.png"`
and asked a text-only model to score `visualQuality` and `motionFidelity` from it. The model
never saw an image. Every visual gate in V4 was scored on metadata.

The capability was already in the repo — `lib/reference/analyzer.mjs` had full multimodal
image and video analysis for the *reference* side. It was simply never wired to the
*post-build* judge. V5 wires it, and everything else follows from making that affordable.

## What changed

### 1. The visual judge can see (`lib/visual/evidence.mjs`)
`buildEvidencePacket()` returns real inline evidence:
- full-page stills per viewport as data URLs
- ordered scroll keyframes with their scroll positions
- the raw scroll recording for providers that take video
- an image legend so the judge knows what it is looking at

`visualJudgePrompt()` instructs scoring from the imagery, and requires the model to list
`evidenceGaps` rather than assume an unseen feature works.

### 2. Motion is actually recorded (`lib/visual/capture.mjs`)
`captureScrollPath()` drives a scripted scroll down the page under Playwright video
recording, then samples keyframes with ffmpeg. A still frame cannot evidence pinning,
parallax, scrub behavior or reveal timing — V4 scored `motionFidelity` from PNGs.

If ffmpeg is missing, frame extraction fails soft and the run continues on stills.

### 3. Providers accept images and video (`lib/providers/*`)
Every adapter now takes `images: [dataUrl]`. Gemini additionally takes `video` — via the
Files API for recordings, inline for small clips — since it is the only provider here with
native video understanding.

`adaptEvidence(provider, {images, video, frames})` routes evidence to what the target can
consume: video-capable providers get the recording, the rest get the keyframes sampled from
it. Evidence is **never silently dropped** — the returned `degraded` flag is recorded on the
round, so a weak motion score is attributable to the adapter rather than blamed on the build.
Sending video to a text-only provider throws.

### 4. Unevidenced scores cannot ship
```js
const refPass = !visualVerdict || (!visualVerdict.unevidenced && techniqueFidelity >= gate && originality >= gate);
```
If the visual judge failed or saw nothing, the round cannot clear the visual gate. V4 would
happily pass a gate on a hallucinated score.

### 5. Judge panels, not a judge (`lib/judge/panel.mjs`)

A single judge is one model's taste wearing a scoreboard. V5 seats a panel:

```json
"judgePanel": [
  { "id": "codex",    "provider": "openrouter", "model": "openai/gpt-5.6-codex" },
  { "id": "gemini",   "provider": "gemini",     "model": "gemini-3.7-flash" },
  { "id": "kimi",     "provider": "openrouter", "model": "moonshotai/kimi-k3" },
  { "id": "deepseek", "provider": "openrouter", "model": "deepseek/deepseek-v4-flash" },
  { "id": "opus",     "provider": "openrouter", "model": "anthropic/claude-opus-5" },
  { "id": "grok",     "provider": "xai",        "model": "grok-4.6", "enabled": true }
]
```

Six seats, six labs. `enabled: false` benches a seat without deleting it, so trialling a
model is one word rather than a restructure.

Aggregation rules, each chosen against a specific failure:

| Rule | Why |
|---|---|
| **Weighted median**, not mean | one hostile or broken seat cannot swing the gate |
| **Ship needs a majority** of responding seats | a high median with 1-of-3 ship votes is not consensus |
| **Any seat may veto** via `hardFailure` | safety is not a popularity contest |
| **Failed seats are excluded, never scored 0** | a 429 must not read as a quality problem in the build |
| **Quorum** (`panelQuorum`) | a panel that mostly died is not a verdict |
| **`maxJudgeSpread` blocks shipping** | a genuinely split panel should stop the run, not be averaged away |
| **Dissent is recorded** per round | the minority opinion is usually the interesting one |

**Diversity is asserted, not assumed.** `diversityReport()` warns when every seat is the same
model family (one opinion billed five times) or when every seat routes through one transport
(one outage blinds the panel). The shipped preset deliberately puts the Gemini seat on the
direct API for exactly that reason.

`visualPanel` is separate and omits the DeepSeek and Kimi seats — a seat that cannot see the
evidence would contribute a confident guess to the median — and leads with Gemini, the only
adapter with native video.

Run `npm run verify:panel` before a gauntlet: it checks credentials per seat and validates
every OpenRouter slug against the live catalog, so a bad model ID costs a second at startup
instead of a dead seat forty minutes in.

### 6. The run survives a bad provider (`lib/providers/index.mjs`)
V4 picked one provider per role at startup; a 429 thirty minutes in killed the gauntlet.
`callWithFailover()` retries with exponential backoff on retryable status codes, then falls
through the remaining credentialed providers, recording every attempt.

### 7. The loop became affordable (`runner/token-budget.mjs`)
Multimodal evidence is expensive, so the text side had to get cheap. Measured on a
130k-char workspace, 6 rounds, 3 candidates: **~1.48M → ~380k input tokens.**

- **Delta snapshots** — round 1 sends full bodies, later rounds send only changed files plus
  a `path (Nc, unchanged)` manifest. V4 rebuilt the entire workspace twice per round and
  handed a copy to every parallel candidate. (−76% after round 1.)
- **Green checks carry nothing** — V4 kept 20k chars of stdout *and* stderr on success and
  pasted it into three prompts. (5,028 tok → 9 tok.)
- **Compact JSON** — `JSON.stringify(x)`, not `null, 2`. Indentation is billed.
- **Cache-safe ordering** — stable text (mission, contract) first and byte-identical every
  round; `ROUND n` and the payload last. V4 put the round counter above everything, so no
  provider prefix cache could ever hit.
- **The judge gets the verdict, not the evidence** — V4 pasted the same `referenceJudge`
  JSON into both the critic and judge prompts.
- **Pre-flight budgets** — `assertBudget()` throws before the HTTP call, per role.

### 8. The ledger reports a real number (`lib/cost/ledger.mjs`)
V4's price registry was all zeros, so every run printed `cost≈$0` and nobody noticed the
burn. V5 ships real per-1M rates (overrideable via `config.pricing`) and records input/output
tokens per role per round.

### 9. Runs can be watched live
`lib/monitor/bus.mjs` appends events to `runs/<id>/events.jsonl`; `app/api/runs/stream`
tails it over SSE. V4 offered no view of a run until it finished.

### 10. Opt-in push on ship (`lib/git/git-tools.mjs`)
`pushBranch()` fires only when `git.pushOnShip` is true, only after the gate passes, only on
a `gauntlet/*` branch, never force, and never opens a PR. The handoff to a human stays
deliberate.

## Round flow

```text
COLLECT FILES → DELTA SNAPSHOT (changed bodies + manifest)
        ↓
N PARALLEL BUILD CANDIDATES → BLIND TOURNAMENT
        ↓
WRITE FILES → CHECKS (green output discarded)
        ↓
PER VIEWPORT: full-page still + scripted scroll recording + ffmpeg keyframes + axe
        ↓
EVIDENCE PACKET (images + video + legend)
        ↓
VISUAL PANEL — sees real pixels
        ↓
CRITIC (gets the visual verdict, not the raw evidence)
        ↓
JUDGE PANEL (5 seats, weighted median + majority ship + any-seat veto)
        ↓
GATE: score AND checks AND evidenced visual pass
        ↓
ROUND COMMIT → REPEAT / SHIP (+ optional branch push)
```

## Config additions over V4

```json
"provider": { "visual": "gemini" },
"judgePanel": [ ... ], "visualPanel": [ ... ],
"panelQuorum": { "judge": 4, "visual": 2 },
"maxJudgeSpread": 25,
"web": { "captureScroll": true, "scrollSteps": 8, "maxFrames": 12, "maxEvidenceImages": 10, "sendVideo": true },
"snapshot": { "maxFiles": 80, "maxChars": 140000 },
"tokenBudget": { "builder": 60000, "critic": 45000, "judge": 15000, "visual": 30000 },
"maxOutputTokens": { "builder": 16000, "critic": 4000, "judge": 2000, "visual": 2000 },
"pricing": {},
"git": { "pushOnShip": false }
```

## Commands

```bash
npm run runner       # V5
npm run runner:v4    # V4, kept for comparison runs
npm run resume
npm run verify:panel # check every judge seat resolves before spending anything
npm run test:smoke   # 19 offline invariant tests, no API keys
npm run health
```

## Requirements

- **ffmpeg** on PATH for keyframe sampling. Absent → stills only, run continues, and the
  judge is told motion is unevidenced rather than being left to guess.
- **GEMINI_API_KEY** for native video judging. Absent → keyframes to whichever vision
  provider is credentialed, flagged `degraded: "video->frames"`.

## Safety boundaries (unchanged from V4)

- no arbitrary model shell commands
- no writes outside the workspace; protected paths enforced
- human-authored checks only
- builder ≠ critic ≠ judge
- no automatic production deployment

## Still deliberately out of scope

- cloud container provisioning
- automatic production deploy
- automatic PR creation (branch push is opt-in; the PR stays human)
