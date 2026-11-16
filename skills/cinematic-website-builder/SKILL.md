---
name: cinematic-website-builder
version: 3.5.0
description: >-
  Use this to build cinematic, production-grade websites (one self-contained HTML file, or multi-page
  Astro/Next.js) and to run the Google Maps lead → spec site → pitch pipeline across several agent harnesses at
  once. Runtime kernel + 43 modules (GSAP 3.15 + CSS scroll timelines), hand-off folder, motion and type
  pickers, grey-box wireframes, goldfish reviews, 8-pass verify, launch gate. v3.5: lead mode (score leads with no
  or weak websites, one job folder per site, atomic claiming, done-gate), live image/video model roster picked by
  role (asks when the pick changed), JSON shot specs for video directed by space-age-cinematic-director v4.1, a
  built-in SEO/AEO gate that runs on any harness, and the voice and outreach steps restored. Triggers: landing
  page, hero, portfolio, product page, local business site, redesign, 'make it cinematic', 'Awwwards-level',
  'build sites for these leads', 'businesses without websites', 'like Astonishing Touch'.
source: "Burst37/Space-Age-Skills:skills/cinematic-website-builder"
---
# Cinematic Website Builder v3.5.0

Always on: `ponytail` (smallest complete change) and `caveman` (terse chat; never compress deliverables, copy or warnings).

## 1. Pick the mode

| You have | Mode | Read next | Human stops |
|---|---|---|---|
| A list of Google Maps leads, or "build sites for businesses with no/weak website" | **lead** | `references/lead-pipeline.md`, then `references/multi-harness.md` if more than one site | 1: batch review before outreach |
| A `JOB.md` path | **lead worker** | that `JOB.md` only | 0 |
| A real client, a brief, or a redesign | **client** | `CINEMATIC_WEBSITE_BUILDER.md` §1–§2 | 2: moodboard, wireframe |
| One section or effect on an existing site | **effect** | `references/motion-picker.md`, `references/modules.md` | 0 |

## 2. The gates (all modes; lead mode decides G2–G4 automatically)

`G0 intake → G1 teardown + SEO/AEO → G2 moodboard → G3 motion + type pickers → G4 grey-box wireframe → G5 design-spec + page-text (beat sheet) → G6 assets → G7 build → G8 verify → G9 launch gate → G10 ship → G11 voice (if sold) → G12 outreach + log`

Load a reference when its gate starts, not before:

| Gate | Load | Script (must exit 0) |
|---|---|---|
| G0 | `references/direction-intake.md` · lead: `templates/lead/brief.md` is prefilled | — |
| G1 | `references/seo-aeo-gate.md` | — |
| G3 | `references/motion-picker.md`, `references/type-picker.md` | `motion-pick.mjs`, `type-specimens.mjs` |
| G4 | `references/handoff-folder.md`, `references/spacing-system.md` | `greybox.mjs` |
| G5 | `templates/handoff/design-spec.md`; regulated sector: `references/subtle-cinematic.md` | `goldfish.mjs` (GR2) |
| G6 | `references/model-roster.md` → `space-age-cinematic-director` → `references/video-json-prompting.md` → `references/asset-pipeline.md` | `shot-lint.mjs`, `letter-check.mjs` |
| G7 | `references/build-chain.md`, `references/modules.md` | `assemble.mjs` |
| G8 | `references/qa-gate.md` | `verify.mjs` |
| G9 | `references/launch-gate.md` | `launch-check.mjs` |

## 3. Four rules that are easy to break

1. **Models are read live, never remembered.** At G6 read the roster, pick per role, record it; client mode asks when the pick changed.
2. **Video is a JSON shot spec first**, with camera, lens, light and movement from `space-age-cinematic-director`; one primary move per shot; hero video is image-to-video from an approved still.
3. **No invented facts.** Unknown stays off the page. Lead-mode demos are `noindex` with a visible preview notice.
4. **Done means `verify.mjs` exit 0** with the report next to the site. If an owner skill is missing, use the stand-in in `references/pipeline-coverage.md` and say so.

Laws, routing, precedence, tiers and budgets: `CINEMATIC_WEBSITE_BUILDER.md`. Regression before any release: `tests/run-all.sh`. History: `CHANGELOG.md`.
