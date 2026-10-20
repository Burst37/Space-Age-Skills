# Cinematic Website Builder v3

Goal: distinctive, fast, accessible, verified site in one HTML file. Cinema = composition, type, media, *restrained* motion. Never "more effects".

## Files

| Path | Use |
|---|---|
| `runtime/cwb-runtime.js` · `cwb-base.css` | Kernel (isolation, env gating, fail-open) + tokens |
| `runtime/cwb-modules.{js,css}` | 39 modules, one `@module` block each |
| `templates/starter.html` | Page skeleton (SEO head, fail-open gate, nav, hero) |
| `templates/direction-brief.yaml` · `build-manifest.yaml` | P0 output · per-build plan |
| `templates/api/voice-token.mjs` | Gemini Live token endpoint (Vercel) for `voice-gemini` |
| `scripts/assemble.mjs` | Inline only used modules + GSAP plugins → one file |
| `scripts/verify.mjs` | 5-pass Chromium QA → `qa/REPORT.md`, exit 1 on blockers |
| `references/` | Load per phase: `direction-intake`, `web-research-agent-reach`, `modules`, `asset-pipeline`, `prompt-tokens`, `storyboard-to-video` (multi-shot video only), `qa-gate`, `ai-font-packs` |
| `tests/gallery.html` + `proof/` | All modules on one page + passing QA run |

## Phases (exit condition in *italics*)

- **P0 Intake** — always first. Two-round questionnaire (`references/direction-intake.md`); person uploads images/links/videos with likes/avoids. Analyze each; read links + competitor scan via `agent-reach`. Pre-filled briefs shorten intake, never skip it. *Direction Brief `confirmed: true`.*
- **P1 Direction** — audience, promise, 3 dials (variance/motion/density), tokens, banned-font check. Confidence < 0.7 → one batched question. *Tokens in `:root`.*
- **P2 Score** — pick tier, beat sheet (Hook → Problem → Proof → Offer → CTA), motion table (section · module · trigger · mobile · RM), one signature moment, costs ≤ budget. *`build-manifest.yaml` filled.*
- **P3 Assets** — `references/asset-pipeline.md`: anchor frames → generate → QC → encode → re-host. *Every slot hosted, real dimensions.*
- **P4 Build** — starter → compose from `references/modules.md` → `assemble.mjs`. *Cost within budget.*
- **P5 Verify** — `verify.mjs` until exit 0, then visual loop in `references/qa-gate.md`. *Gate passed with evidence.*
- **P6 Ship** — `sa-deploy-operator`; log to Drive SESSION_MEMORY. *Live URL verified.*

## Tiers

| Tier | Client | Motion budget | Pins | Page weight |
|---|---|---|---|---|
| Factory | mass SMB | 15–30 | 0 | ≤ 900 KB |
| Enhanced | premium SMB, SaaS | 25–45 | ≤ 1 | ≤ 1.5 MB |
| Cinematic | hospitality, fashion, studios | 40–70 | ≤ 2 | ≤ 3 MB |
| Flagship | launches, named clients | 60–100 | ≤ 3 | per manifest |

Never default to Flagship. Non-code platform (Wix/Framer/Webflow/Shopify/WP) → `cinematic-website-director`.

Budget rules: signature moment ≈ 40 %, rest quiet · never pin consecutive sections · hero entrance < 1.2 s · each animation has a one-sentence purpose or gets cut.

## Routing (load on demand)

| Need | Skill |
|---|---|
| Reference analysis, competitor research | `agent-reach`, `brand-extractor`, `extract-design-system`, `firecrawl-mcp` |
| Direction / taste | `taste-pro`, `design-taste-frontend`, `ui-ux-pro-max` |
| Motion beyond modules | `design-motion-principles`, `gsap-*`, `animation-vocabulary` |
| 3D / scroll film | `sa-figma-framer-spline`, `scroll-film-studio` |
| Media | Higgsfield MCP (default) / OpenArt; prompts via `cinematic-prompt-director`, `seedance-2-5-prompting` |
| Copy · SEO | `stop-slop-pro` · `sa-local-seo-geo` |
| Voice agent | `voice-agent` + `voice-gemini` modules (Gemini Live; token endpoint `templates/api/voice-token.mjs`) |
| Critique | `design-review-pro`, `design-loop` |
| Deploy | `sa-deploy-operator` |

Conflicts: client tokens > brand-extractor > defaults · taste ban list wins (no Inter/Poppins/Lato/Fraunces/Instrument Serif unless client brand) · one font provider · VL-01 indigo glass only on Space Age's own sites · native scroll default, Lenis only with a written reason, never touch/RM · assets before build · modules here beat `gsap-supercharged` snippets.

## Stack — smallest tool first

CSS `view()` reveal → `reveal` module · CSS `scroll()` progress · ScrollTrigger for pins/scrub · SplitText (`mask:'lines'`, `aria:'auto'`) · View Transitions for state + multi-page · scroll-snap carousel · `grid-template-rows 0fr→1fr` accordion · `@property` color · Draggable+Inertia · WebGL never for decoration. GSAP is free since 3.13: use real plugins.

## Engineering laws

1. Modules only via `CWB.define` + `data-cwb`. No top-level `const` in page scripts, no inline `onclick`.
2. Fail-open: hidden pre-states only under `.cwb-js` + no-reduced-motion. JS off / CDN down → page complete.
3. Reduced motion = parallel design (instant or cross-fade), not "off".
4. Pointer effects gated on `(hover:hover) and (pointer:fine)`; touch gets a real equivalent.
5. Native controls (`button[aria-expanded]`, `dialog`, links); hidden content `inert`; keyboard reaches everything.
6. Only transform/opacity for continuous motion; no `transition: all`; `will-change` only while moving.
7. No per-element `mousemove` layout reads; `quickTo`; loops on `gsap.ticker`, paused offscreen.
8. Measured values are function-based + `invalidateOnRefresh`.
9. Mobile recomposed: no pins < 900 px, lighter parallax, CTA inside first 390×844.
10. Real content only: no lorem, invented stats, testimonials or logos. No Space Age/LoyaltyBot copy in client builds.
11. Colors only as `:root` tokens.
12. One H1, landmarks, skip link, visible focus, descriptive alt.
13. Media hosted + sized: `width`/`height`, AVIF/WebP, video poster, no presigned URLs.
14. No claims without evidence (`references/qa-gate.md`).

## Design laws

Kill AI tells: purple-blue gradients on white, emoji icons, three equal cards, centered everything, glass everywhere, Inter + `rounded-2xl` + drop shadow, "Unlock the power of…". Fluid jumbo display, tracking −0.02 to −0.04 em, body 1.5–1.6, ≤ 3 type levels, ≤ 70ch, `text-wrap: balance`. OKLCH, ≤ 3 accents, contrast ≥ 4.5:1 on busiest background. Asymmetric grids, one dominant element per viewport. Headline = outcome, CTA = verb, proof next to the ask.

## Degradation

| System | Phone | Reduced motion | CDN down |
|---|---|---|---|
| Pinned scenes | swipe / stacked | stacked | stacked |
| Frame scrub | every 2nd frame | poster | poster |
| Parallax | 30 % | none | none |
| Pointer effects | off | off | off |
| Text reveals | on | static | static |
| Video hero | plays (pause button) | poster | plays (HTML autoplay) |

## Commands

```bash
SKILL=~/.claude/skills/cinematic-website-builder
cp $SKILL/templates/starter.html site/index.src.html
node $SKILL/scripts/assemble.mjs site/index.src.html -o site/index.html [--with page-transition]
node $SKILL/scripts/verify.mjs site/index.html --out site/qa --budget-kb 900
```
Needs Node ≥ 20 + Playwright Chromium. Runtime regression: `node tests/make-assets.mjs && node scripts/assemble.mjs tests/gallery.html -o tests/gallery.dist.html --with page-transition && node scripts/verify.mjs tests/gallery.dist.html --out tests/qa`.

Output must have: lang, title ≤ 60, description 150–160, canonical, OG, valid JSON-LD (NAP = GBP), GSAP 3.15.0 from cdnjs `defer`, LCP preloaded `fetchpriority="high"`, `verify.mjs` exit 0 + `qa/REPORT.md`.

## Never

Curtain/gate/scramble over the LCP element · pin on phones or hijack scroll · autoplay carousels without controls · text-to-video hero without approved anchor frame · unfilled `{{placeholders}}` · call a build done without passing `verify.mjs` + visual loop.
