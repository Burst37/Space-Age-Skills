# Changelog

## Unreleased
- **Model roster updated** (asset-pipeline §3): Higgsfield MCP default, OpenArt as second platform. Images: Nano Banana Pro (default), ChatGPT Images 2.5, Grok Imagine 1.5 (OpenArt). Video: MiniMax H3 (default hero loop, start = end frame), Seedance 2.5 (narrative/scroll film, extension), Seedance 2.0 (identity-consistent, 4K). Per-slot `platform:` / `model:` in `assets.yaml`.
- **Runtime:** `video-hero` and `voice-agent` modules added (house standard, WIP).

## 3.1.0 — 2026-09-26
- **Removed Google Stitch** from the pipeline.
- **New P0 Direction Intake**, always the first step: two-round questionnaire (no deadline/approval/revision filler), with image / link / video uploads as design and UI/UX direction, a per-type reference-analysis protocol, and a `direction-brief.yaml` output confirmed before any build work.

## 3.0.0 — 2026-09-26 — forensic rebuild
- **Runtime kernel** (`runtime/cwb-runtime.js`): module isolation via `CWB.define` + `gsap.matchMedia`, fail-open motion gate with watchdog, live env gating (reduced motion, fine pointer, viewport, save-data, low-power), auto-cleanup of listeners/loops, offscreen pausing, post-font/load `ScrollTrigger.refresh()`.
- **All 30 v2 modules rebuilt** (same IDs) + 6 new: `reveal`, `line-reveal` (SplitText masks), `frame-scrub` (progressive canvas sequence), native `view()` reveal + scroll progress (CSS-only), `velocity-skew` (with return-to-rest), `intro-gate`, cross-document page transitions, `magnetic` split out of the cursor.
- **Stack**: GSAP 3.12.5 → 3.15.0 with the now-free plugins; native-first CSS (scroll/view timelines, View Transitions, `@property`, scroll-snap).
- **Tooling**: `assemble.mjs` (ships only used modules/plugins, reports motion cost), `verify.mjs` (5-pass Playwright QA, blocking checks, screenshots, report).
- **Docs**: playbook (`CINEMATIC_WEBSITE_BUILDER.md`, with a `SKILL.md` loader stub) with verified routing to 30+ SA skills and a precedence table; catalog, asset pipeline (prompt contract, ffmpeg encodes, media tiers), QA gate, AI font packs.
- **Removed**: hard-coded brand colors and SA/LoyaltyBot copy in modules, seven dangling skill references, `scroll-behavior: smooth` mandate, font-pack sales content, banned fonts in pairing tables.
- See `references/forensic-audit-v2.md` for the full defect list and `proof/REPORT.md` for the passing run.

## 2.x — pre-audit
- Two diverging copies (claude.ai synced 1,709 lines; web-agent 1,351 lines). Superseded.
