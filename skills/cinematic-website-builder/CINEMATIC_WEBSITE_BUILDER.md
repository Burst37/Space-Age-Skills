# Cinematic Website Builder v3
### Space Age AI Solutions — Production Web Experience Layer

You are the director and the engineer. The job is a site a senior creative director would put in
a portfolio **and** a performance engineer would sign off: distinctive, fast, accessible, verified.
Cinema is composition + rhythm + hierarchy + type + media + *restrained* motion. It is never
"more effects".

v2 → v3 was a forensic rebuild: 19 systemic and 31 per-module defects fixed, including modules
that crashed when combined, content invisible to reduced-motion users, and seven references to
skills that don't exist. Full report: `references/forensic-audit-v2.md`.

## 0. What ships in this skill

| Path | Purpose |
|---|---|
| `runtime/cwb-runtime.js` | Kernel: module isolation, env gating, fail-open, lifecycle, refresh |
| `runtime/cwb-base.css` | Tokens (OKLCH color, fluid type, 4 durations/4 curves) + base + a11y parallels |
| `runtime/cwb-modules.{js,css}` | 36 modules, one `@module` block each |
| `SKILL.md` | Loader stub (the filename every skill loader requires) — points here |
| `templates/starter.html` | Page skeleton: SEO head, fail-open gate, island nav, hero |
| `templates/direction-brief.yaml` | P0 output: answers, analyzed references, synthesis, proposed tokens |
| `references/direction-intake.md` | P0 questionnaire (uploads: images, links, videos) + reference-analysis protocol |
| `templates/build-manifest.yaml` | Per-build plan: tier, modules, budgets, assets, gate status |
| `scripts/assemble.mjs` | Inline only the modules + GSAP plugins the page uses → one file |
| `scripts/verify.mjs` | 5-pass Chromium QA → `qa/REPORT.md`, exit 1 on blockers |
| `references/modules.md` | Catalog: markup contracts, cost, degradation, recipes |
| `references/asset-pipeline.md` | Media tiers, Higgsfield routing, prompt contract, ffmpeg encodes |
| `references/qa-gate.md` | Stage 4 gate, rubric, manual checks, delivery package |
| `references/ai-font-packs.md` | SA AI display-type packs, accessible patterns |
| `tests/gallery.html` + `proof/` | Every module on one page + its passing QA evidence |

Load reference files when their phase starts — not all up front.

## 1. Pipeline position and routing

```
P0 DIRECTION INTAKE (this skill, always first) ◄── uploads: images · links · videos
   pre-filled by: lead-to-brief · brand-extractor · ui-ux-designer handoff (if they exist)
   → Direction Brief → P1–P4 BUILD (this skill) → P5 QA GATE (this skill)
   → S5 sa-deploy-operator → S6 voice → S7 outreach → S8 log
```

Route each concern to the skill that owns it. Pull on demand; never restate their content here.

| Concern | Owner (verified to exist) | When to load |
|---|---|---|
| Analyzing uploaded references (images, sites, videos, Figma) | `brand-extractor`, `extract-design-system`, `defuddle`, `firecrawl-mcp`, `sa-watch`, `sa-video-skill-extractor`, `sa-youtube-cli`, `mobbin-operator`, Figma MCP, Higgsfield `video_analysis_create` | P0 intake |
| Brief from a lead row | `lead-to-brief` | pipeline builds |
| Client brand tokens from a URL | `brand-extractor` / `extract-design-system` | client has a site |
| Creative strategy, references, Site DNA | `spaceage-savo-creative-director-os` | new brand / no direction |
| Moodboard, palette, type pairing, sections | `ui-ux-designer` + `ui-ux-pro-max` | direction not locked |
| Anti-slop taste, banned fonts, 3 dials | `design-taste-frontend` / `taste-pro` / `frontend-design` | every build (direction check) |
| Motion *why* (hierarchy, vocabulary) | `design-motion-principles` | writing the motion score |
| Motion *how* beyond the modules | `gsap-supercharged`, `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline` | custom choreography |
| Naming an effect the client described | `animation-vocabulary` | vague motion requests |
| Polish details (shadows, radii, optical alignment) | `make-interfaces-feel-better` | refinement pass |
| WebGL planes / full-canvas scrollytelling | `sa-scroll-cinematics` | Tier T4 / module X1 |
| Scroll-film / fly-through | `scroll-film-studio`, `scroll-world` | Tier T3 narrative |
| Apple-grade material, carousel, transitions | `spaceage-apple-immersive-web-design` | Premium chrome/glass |
| Real 3D, liquid glass, Framer physics, Figma tokens | `sa-figma-framer-spline` | Premium path |
| Gesture/hand cursor | `add-hand-tracking` | explicit request |
| Image/video prompts | `cinematic-prompt-director`, `banana-pro-director-30`, `cinema-director-v3`, `seedance-2-5-prompting`, `character-builder` | asset phase |
| Copy that doesn't read as AI | `stop-slop-pro` | every build |
| Local SEO + GEO schema | `sa-local-seo-geo` | every public site |
| Design critique loop | `design-review-pro`, `design-loop` | QA pass 3 / Flagship |
| Factory, platforms (Wix/Framer/Webflow/Shopify/WP), voice agent, evidence package | `cinematic-website-director` | multi-site, non-code platform, or director-level gate |
| Shopify theme | `shopify-cinematic-builder` | Shopify target |
| Deploy | `sa-deploy-operator` | after the gate passes |
| Memory log | `sa-obsidian-vault-ops` | session end |
| Code discipline | `karpathy-guidelines` | always |

### Precedence when skills disagree

| Conflict | Ruling |
|---|---|
| Color / type / moodboard values | Locked Handoff Package > `brand-extractor` BTP > `ui-ux-designer` defaults > v3 starter tokens |
| Font allowed? | `design-taste-frontend` banned list wins (Inter, Poppins, Lato, Fraunces, Instrument Serif out unless the client's brand already uses them) |
| Font provider | One provider per page: Fontshare / Bunny (Google-compatible API, GDPR-safe) by default; self-host WOFF2 on Premium |
| VL-01 indigo glass (`#6366f1`) | Space Age's **own** properties only. Client builds use client tokens |
| Smooth scroll | Native by default. Lenis only with a documented reason, never on touch/RM (`design-motion-principles` Lenis rules apply when enabled) |
| Asset timing | Assets before build (this skill + director agree; v2-synced was wrong) |
| Module code vs `gsap-supercharged` snippets | Modules here are the production versions (isolated, tested); use gsap-supercharged for patterns not in the catalog |

## 2. Workflow — seven phases, each with an exit condition

**P0 — Direction Intake (always first, every build).** Run the questionnaire in
`references/direction-intake.md` in three rounds: business, proof and personality; then visual,
motion and content references; then practical details. The person answers and **uploads references —
images, website links, videos/screen recordings** — each with a note on what they like or want avoided.
Analyze every reference with the protocol in that file (palette, type, layout, motion inventory
mapped to catalog modules), then compile `templates/direction-brief.yaml` and show a one-screen
summary. Existing lead briefs, Brand Token Packages or Handoff Packages pre-fill answers; they
shorten the intake, never replace it. *Exit: Direction Brief `confirmed: true`.*

**P1 — Direction lock.** From the confirmed Direction Brief, write the Design Read (taste-pro §0): audience, promise, three dials
(VARIANCE / MOTION / DENSITY), moodboard letter, tokens, banned-list check. Confidence < 0.7 on
any line → ask one batched question. *Exit: tokens filled into `:root`.*

**P2 — Score.** Pick the tier (§3). Choose a narrative recipe (PRODUCT_REVEAL, LOCAL_BUSINESS,
STUDIO_AGENCY… — director §7). Write the beat sheet (Hook → Problem → Proof → Offer → CTA) and the
motion score table (section · element · module · trigger · duration · ease · mobile · RM). Name
the **signature moment**. Sum module costs ≤ tier budget. *Exit: `build-manifest.yaml` filled.*

**P3 — Assets.** Follow `references/asset-pipeline.md`: manifest → anchor frames → generate →
QC → encode → re-host. *Exit: every slot `hosted`, real dimensions known.*

**P4 — Build.** Copy `templates/starter.html` → `site/index.src.html`. Compose sections from
`references/modules.md`. Copy through `stop-slop-pro`; schema from `sa-local-seo-geo`. Then
`node scripts/assemble.mjs site/index.src.html -o site/index.html`. *Exit: assembled file, cost
within budget (assemble prints `motionCost`).*

**P5 — Verify.** `node scripts/verify.mjs site/index.html` → fix → re-run until exit 0; then the
three-pass visual loop and rubric in `references/qa-gate.md`. *Exit: gate passed with evidence.*

**P6 — Ship.** `sa-deploy-operator` → live URL; log to Drive SESSION_MEMORY. *Exit: URL verified.*

## 3. Tier router

| Tier | Typical client | Media tier | Motion budget | Pins | Path |
|---|---|---|---|---|---|
| **Factory** | mass lead-gen SMB | T0–T1 | 15–30 | 0 | Standard single-file |
| **Enhanced** | premium SMB, SaaS | T1–T2 | 25–45 | ≤ 1 | Standard single-file |
| **Cinematic** | hospitality, fashion, music, studios | T2–T3 | 40–70 | ≤ 2 | Standard, or Premium for 3D |
| **Flagship** | launches, named clients | T3–T4 | 60–100 | ≤ 3 | Premium (`sa-figma-framer-spline`) or director |

Never default to Flagship. A local plumber gets Factory done beautifully, not a scroll film.
Non-code platform (Wix, Framer, Webflow, Shopify, WordPress) → `cinematic-website-director` adapter.

## 4. Motion budget and the signature moment

Module costs are in the catalog index (`reveal` 2 · `parallax` 5 · `horizontal-pan` 10 ·
`frame-scrub` 20 …). Budget is a design constraint, not a performance promise — `verify.mjs`
measures performance. Rules:

- One signature moment per page gets ~40 % of the budget. Everything around it stays quiet.
- Max one scroll-pinned sequence per viewport-story; never pin consecutive sections.
- Hero entrance completes < 1.2 s; the LCP element is never hidden by a curtain, gate or scramble.
- Every animation has a purpose you can say in one sentence (reveals structure / guides the eye to
  the CTA / tells the story). If not, cut it.

## 5. Stack router — smallest reliable tool first

| Need | First choice | Escalate to |
|---|---|---|
| Reveal on enter | CSS `animation-timeline: view()` (`data-nreveal`) | `reveal` module (batching, older engines) |
| Progress bar | CSS `scroll()` timeline | — |
| Pinned scene / scrub / horizontal | GSAP ScrollTrigger (modules 04, 08, 32) | — |
| Text split reveal | SplitText `mask:'lines'`, `autoSplit`, `aria:'auto'` (31) | — |
| Same-page state morph | View Transitions (18) | GSAP Flip |
| Multi-page continuity | `@view-transition { navigation: auto }` (36) | — |
| Carousel | CSS scroll-snap + `view(inline)` (21) | Embla / Draggable |
| Accordion height | `grid-template-rows: 0fr → 1fr` / `interpolate-size` | — |
| Color transitions | registered `@property` (09) | — |
| Drag with throw | Draggable + InertiaPlugin (17) | — |
| True 3D | Three.js/WebGL via routed skill | never for a decorative background |

GSAP is fully free since 3.13 — use the real plugins; don't hand-roll weaker copies.

## 6. Engineering laws (non-negotiable)

1. **Modules only through the runtime.** `CWB.define` + `data-cwb`. No top-level `const` in page scripts; no inline `onclick`.
2. **Fail-open.** Hidden pre-states only under `.cwb-js` + `prefers-reduced-motion: no-preference`. With JS off or the CDN down, the page is complete and readable (verified by the offline pass).
3. **Reduced motion is a parallel design,** not "animations off": state changes still happen, instantly or as cross-fades.
4. **Pointer effects gate on `(hover:hover) and (pointer:fine)`.** Touch gets a working, non-degraded equivalent. Never hide the native cursor on touch or in form fields.
5. **Native controls for interaction:** `<button aria-expanded>`, `<input type=range>`, `<dialog>`, links. Hidden content is `inert`. Keyboard reaches everything a pointer does.
6. **Transforms and opacity only** for continuous motion. No `transition: all`. `will-change` only on elements actively transforming.
7. **Measure, don't guess:** no `mousemove` layout reads per element; cache rects; `quickTo` for pointer followers; loops on `gsap.ticker` and paused offscreen.
8. **Layout truth:** function-based values + `invalidateOnRefresh` for anything measured; the runtime refreshes after fonts and `load`.
9. **Mobile is recomposed, not shrunk:** no pins < 900 px (native swipe/scroll-snap instead), lighter parallax, hero CTA inside the first 390×844 viewport.
10. **Real content only:** no lorem, no invented stats/testimonials/logos. Counters show real numbers in the HTML. No Space Age / LoyaltyBot copy in client builds.
11. **Tokens only:** modules never hard-code color; every hex/oklch lives in `:root`.
12. **One H1, semantic landmarks, skip link, visible focus, alt text that describes.**
13. **Assets are hosted, sized and budgeted:** `width`/`height` on media, AVIF/WebP, poster on video, no presigned URLs.
14. **No claims without evidence** — see `references/qa-gate.md`.

## 7. Design laws (taste)

- Pass `design-taste-frontend`'s ban list and 35-point pre-flight. Signature AI tells to kill on sight: purple-to-blue gradients on white, emoji icons, three equal feature cards, centered everything, glass on every surface, `Inter` + `rounded-2xl` + drop-shadow defaults, lorem, "Unlock the power of…".
- Type: jumbo fluid display (`--t-hero`), tight display tracking (−0.02 to −0.04 em), body 1.5–1.6 line-height, ≤ 3 levels, measure ≤ 70ch, `text-wrap: balance` on headings.
- Color: OKLCH tokens; ≤ 3 accents; body contrast ≥ 4.5:1 checked on the busiest background state.
- Composition: asymmetric grids, real negative space, section transitions designed (not just padding), one dominant element per viewport.
- Media: art-directed crops with text-safe zones; film grain over gradients to kill banding.
- Copy: headline states the outcome, not the feature; CTA is a verb; proof sits next to the ask.

## 8. Responsive degradation matrix

| System | Desktop ≥ 900 | Phone | Reduced motion | CDN down |
|---|---|---|---|---|
| Pinned scenes (04, 08) | full sequence | native swipe / stacked | stacked | stacked |
| Frame scrub (32) | full frames | every 2nd frame, shorter pin | poster | poster |
| Parallax (03) | 12 % × depth | 30 % of that | none | none |
| Pointer effects (10, 13, 15, 16, 23) | on | off (content intact) | off | off |
| Line/word reveals (01, 31) | on | on | static | static |
| Smooth scroll | only if justified | off | never | off |
| Carousel (21) | 3D tilt | 3D tilt (CSS) | flat snap | flat snap |
| Nav (22) | condenses on scroll | tap menu | instant | static header |

## 9. Build commands

```bash
SKILL=~/.claude/skills/cinematic-website-builder     # or the repo path
cp $SKILL/templates/starter.html site/index.src.html
cp $SKILL/templates/build-manifest.yaml site/
# … author sections using references/modules.md …
node $SKILL/scripts/assemble.mjs site/index.src.html -o site/index.html [--with page-transition]
node $SKILL/scripts/verify.mjs site/index.html --out site/qa --budget-kb 900
```
Requirements: Node ≥ 20; Playwright + Chromium for verify (`npm i -g playwright && npx playwright install chromium`).
Regression-test the runtime itself: `node tests/make-assets.mjs && node scripts/assemble.mjs tests/gallery.html -o tests/gallery.dist.html --with page-transition && node scripts/verify.mjs tests/gallery.dist.html --out tests/qa`.

## 10. Output standards (the assembled file)

1. `<!DOCTYPE html>`, `lang`, viewport, title (≤ 60 ch), meta description (150–160 ch), canonical, OG/Twitter, theme-color.
2. Valid JSON-LD from `sa-local-seo-geo`; NAP identical to the Google Business Profile.
3. Fail-open head snippet, then assembled CSS (base + used modules).
4. GSAP 3.15.0 + only the plugins used, from cdnjs, `defer`; runtime + used modules inline.
5. LCP media preloaded with `fetchpriority="high"` and real dimensions; everything else lazy.
6. Total transfer (desktop, first load) within the tier budget: Factory ≤ 900 KB, Enhanced ≤ 1.5 MB, Cinematic ≤ 3 MB, Flagship by manifest.
7. `verify.mjs` exit 0 and `qa/REPORT.md` alongside the file.

## 11. Inputs read

```yaml
direction_brief (P0, primary)                 → everything below is pre-fill for it
direction_brief.references[].findings         → P1 tokens, P2 layout + motion plan
direction_brief.synthesis.hard_bans           → never ship these

handoff_package.brand_personality.moodboard   → P1 Design Read, tokens
handoff_package.design_system                 → :root tokens (color, type, radius)
handoff_package.design_system.display_font_type → references/ai-font-packs.md
handoff_package.modules_selected              → map to v3 names via references/modules.md (v2 numbers 01–30 are preserved)
handoff_package.user_flow                     → section order / beat sheet
build_brief (lead-to-brief)                   → business facts, category, city, SEO keywords, deploy slug
```

## 12. Never

- Ship a module outside the runtime, or combine v2 module snippets on one page.
- Put a curtain, gate or scramble over the first-viewport LCP element.
- Pin on phones, hijack scroll, autoplay carousels without controls, or loop flashing content.
- Hard-code brand colors in modules, or reuse another client's (or Space Age's) copy, numbers or colors.
- Generate hero video text-to-video without an approved anchor frame.
- Ship presigned media URLs, unfilled `{{placeholders}}`, or invented proof.
- Report a build as done without a passing `verify.mjs` report and the visual loop.
