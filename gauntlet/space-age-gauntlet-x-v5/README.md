# Space Age Gauntlet X V5 — Full Gauntlet Execution System

## V5 — Close the evidence loop

**V4 judged rendered work from file paths. V5 judges the pixels.**

V4 handed its visual judge a JSON object containing screenshot *paths* and asked it to score
`visualQuality` and `motionFidelity`. The model never saw an image. V5 sends real inline
evidence — full-page stills, ordered scroll-path keyframes, and the scroll recording itself
to providers that accept video.

New in V5:
- multimodal post-build judging (images + native video via Gemini Files API)
- multi-model judge panels (GPT-5.6 Sol / Gemini 3.7 Flash / Kimi K3 / DeepSeek V4 Flash /
  Opus 5 / Grok 4.6) with weighted median, majority-ship, any-seat veto, quorum and
  split-panel blocking — all slugs verified against the live OpenRouter catalog
- per-model video capability routing (Gemini + Kimi get the recording, the rest keyframes)
- `.env` loaded automatically by every script — keys are set once, never re-entered
- direct adapters for Anthropic, Moonshot and DeepSeek, so the all-direct panel
  (`presets/judge-panel-direct.json`) runs six labs over six transports with no broker
- panel diversity warnings + `npm run verify:panel` seat preflight
- scripted scroll-path video recording per viewport + ffmpeg keyframes
- evidence adaptation per provider (video → keyframes, flagged, never silently dropped)
- unevidenced visual scores can no longer clear a gate
- mid-run provider failover with retry/backoff
- delta workspace snapshots + cache-safe prompt ordering + per-role token budgets
  (~1.48M → ~380k input tokens on a 6-round × 3-candidate run)
- real pricing registry and per-role token telemetry (V4 reported `cost≈$0` always)
- live SSE run monitor at `/api/runs/stream?run=<id>`
- opt-in `gauntlet/*` branch push on ship

See `docs/SPACE_AGE_GAUNTLET_X_V5_HANDOFF.md`.

```bash
npm run runner      # V5
npm run verify:panel # check every judge seat resolves before spending anything
npm run doctor      # what is configured and what it costs you
npm run test:smoke  # 26 offline invariant tests, no API keys needed
```

Requires `ffmpeg` on PATH for keyframe sampling (absent → stills only, run continues) and
`GEMINI_API_KEY` for native video judging (absent → keyframes, flagged as degraded).

## Inherited from V4


V4 intentionally collapses the previously planned V3.3–V3.6 staircase into one architecture.

It now includes:
- multimodal reference ingestion
- Gemini direct video forensics
- Reference DNA
- reference-aware post-build judging
- parallel candidate builders
- blind candidate selection
- live benchmark scout
- Git checkpoints / gauntlet branches
- provider health and fallback
- per-round cost ledger
- Playwright responsive inspection
- axe accessibility checks
- regression ledger
- plateau strategy switching
- resumable run state
- War Mode preset


Reference ingestion supports:
- screenshots: PNG, JPG, WEBP
- short screen recordings: MP4, WEBM, MOV

The new **Reference Lab** converts media into structured `Reference DNA`:
- layout geometry
- typography traits
- spacing/rhythm
- scroll model
- motion primitives
- triggers
- timing/easing
- pin/sticky behavior
- parallax/depth
- hover/cursor/microinteraction patterns
- likely GSAP/CSS implementation mappings
- responsive behavior
- adopt / transform / do-not-copy rules

### Video paths

**Preferred:** Gemini direct video understanding for one short video. This preserves temporal information.

**Fallback:** V3.2 uses local FFmpeg to sample temporal keyframes and submits the frame sequence to OpenAI, xAI, or Gemini vision.

Install FFmpeg if you want keyframe fallback:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

### Workflow

```text
UPLOAD SCREENSHOT / VIDEO
        ↓
REFERENCE FORENSICS
        ↓
REFERENCE DNA
        ↓
OWN-STYLE TRANSFORMATION RULES
        ↓
GAUNTLET COMPILER
        ↓
BUILDER
        ↓
RENDER
        ↓
REFERENCE-AWARE CRITIC
        ↓
ITERATE
```

The design goal is **technique transfer, not literal cloning**. The analyzer explicitly separates reusable motion/design principles from distinctive expression that should not be copied.


V3 is both a **Gauntlet compiler** and a **local/self-hosted autonomous execution runner**.

## What makes V3 materially different

V2 generated intelligent prompts.

V3 can:
1. compile a task-aware gauntlet in the browser,
2. export a runnable `gauntlet.project.json`,
3. call live model providers,
4. ask builders for actual workspace file replacements,
5. safely write those files inside the configured workspace,
6. execute project checks/build commands,
7. optionally inspect a running website with Playwright at multiple viewports,
8. send the actual artifact/check evidence to a fresh critic,
9. use an independent judge,
10. persist a pass/regression ledger,
11. detect score plateaus,
12. alter the next-round strategy,
13. stop only when the configured gate is genuinely met or max rounds is reached.

## Supported live provider adapters

- OpenAI Responses API
- xAI Responses API
- Google Gemini `generateContent`
- OpenRouter Chat Completions
- Generic OpenAI-compatible Chat Completions endpoint

You need at least one API key for live execution. More than one provider is recommended because builder != critic != judge is stronger when model families differ.

## Install

Use a current Node.js LTS.

```bash
npm install
npx playwright install
```

Copy:
```bash
cp .env.example .env
```

Add at least one API key to your shell or `.env` loader/environment. Node does not automatically read `.env` for plain scripts in every setup, so the most reliable option is to export keys in your shell or use your process manager's environment configuration.

## Run the web compiler

```bash
npm run dev
```

Open:
`http://localhost:3000`

Compile a mission and download `gauntlet.project.json`.

## Run the autonomous engine

Put the downloaded config in the V3 root, then:

```bash
npm run runner -- gauntlet.project.json
```

The runner creates:
- `runs/<project>-<timestamp>/state.json`
- one JSON evidence packet per round
- Playwright screenshots when visual inspection is enabled

## Run against an existing codebase

Edit:

```json
"workspace": "/absolute/or/relative/path/to/your/project"
```

Protected paths prevent the model from writing `.git`, `.env`, `node_modules`, and run state by default.

## Website visual judging

Your target site must already be running.

For example:

```bash
cd /path/to/site
npm run dev
```

Then set:

```json
"web": {
  "enabled": true,
  "url": "http://127.0.0.1:3000"
}
```

The runner captures full-page screenshots and console errors for every configured viewport each round.

## Safety boundary

The runner intentionally does NOT give a model arbitrary shell access. Models can only return full replacement files under the configured workspace. Shell commands come from the human-authored `checks` array in `gauntlet.project.json`.

This keeps execution useful while avoiding the most dangerous version of “agent can run anything it invents.”

## Current limitations

This is a real autonomous loop, but it is not yet a full cloud coding sandbox:
- no GitHub PR writer yet,
- no remote container provisioning,
- no automatic dev-server lifecycle manager,
- screenshots are collected as evidence but not yet uploaded as multimodal inputs to every provider adapter,
- live benchmark web research is not automatically called by the runner yet,
- provider token-cost normalization is not yet implemented.

Those are V3.x extensions, not structural blockers.

## Recommended provider topology

For strongest separation:
- Builder: strong coding model
- Critic: different model family
- Judge: third strong reasoning model

For low-cost:
- Builder: low-cost coding-capable model via OpenRouter/generic endpoint
- Critic: Gemini or low-cost independent model
- Judge: frontier model only at final/high-leverage rounds

## Important

Do not point the runner at a codebase without version control or backups. It writes full replacement files by design. Use Git.

## File architecture

- `app/` — browser compiler UI/API
- `lib/compiler.ts` — gauntlet compiler
- `lib/providers/` — live model adapters
- `runner/` — safe filesystem, checks, prompts, run state
- `scripts/gauntlet-runner.mjs` — autonomous loop
- `scripts/inspect-web.mjs` — standalone visual inspector
- `examples/` — example runner config
