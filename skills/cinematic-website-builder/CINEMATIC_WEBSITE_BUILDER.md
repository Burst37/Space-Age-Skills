# Cinematic Website Builder v3.5
### Space Age AI Solutions — Production Web Experience Layer

You are the director and the engineer. The job is a site a senior creative director would put in
a portfolio **and** a performance engineer would sign off: distinctive, fast, accessible, verified.
Cinema is composition + rhythm + hierarchy + type + media + *restrained* motion. It is never
"more effects".

**Three modes** (pick in `SKILL.md`, then follow the same gates):
- **client**: a real client. Every gate, two hard stops (moodboard, wireframe), three goldfish reviews.
- **lead**: a spec demo for a Google Maps lead with no site or a weak one. Gates are decided from the listing,
  sector and `taste-profile.yaml`; scripts still enforce every exit condition; one human stop (batch review before
  outreach). `references/lead-pipeline.md`, run in parallel per `references/multi-harness.md`.
- **effect**: one section or effect for an existing site. G3 (motion pick) → G7 → G8 only.

What each version added is in `CHANGELOG.md`; which earlier steps were restored is in
`references/pipeline-coverage.md`.

## 0. What ships in this skill

| Path | Purpose |
|---|---|
| `runtime/cwb-runtime.js` | Kernel: module isolation, env gating, fail-open, lifecycle, `CWB.mount/unmount` for SPA routes, soft Lenis |
| `runtime/cwb-base.css` | Tokens: OKLCH colour, fluid type + **jumbo** (`--t-jumbo`), **spacing scale** (`--space-3xs…4xl`), section rhythm (`--section-y-*`), container (`--gutter`, `--max-content`, `--max-page`), motion |
| `runtime/cwb-modules.{js,css}` | 43 JS modules + CSS-only recipes (`native-reveal`, `custom-type`), one `@module` block each |
| `templates/handoff/` | **The hand-off folder** templates: `brief.md`, `design-spec.md`, `page-text.md`, `wireframe.yaml`, `motion-plan.yaml`, `type-inputs.yaml` |
| `templates/starter.html` | Page skeleton: SEO head, favicon/theme-color, fail-open gate, island nav, jumbo hero |
| `templates/robots.txt` · `llms.txt` · `sitemap.xml` · `localbusiness.jsonld` | Ship-time SEO/AEO files |
| `scripts/greybox.mjs` | `wireframe.yaml` → greyscale page per sitemap URL + PNGs at 1440/390 + lint (the wireframe hard stop) |
| `scripts/motion-pick.mjs` | Motion picker → `motion-plan.yaml` + one-screen review with live demos |
| `scripts/type-specimens.mjs` | Type picker → 3 specimen cards (PNG), `type-pick.yaml`, `type-tokens.css`, custom-type style ranking |
| `scripts/letter-check.mjs` | OCR spell-check for AI-rendered lettering (build rejects misspelled renders) |
| `scripts/type-refs-index.mjs` | Copies Chuma's custom-type references, builds `references/type-refs/INDEX.png` + `INDEX.md` |
| `scripts/assemble.mjs` | Inline only the modules + GSAP plugins the page uses → one file |
| `scripts/verify.mjs` | Up to 8-pass Chromium QA (desktop, tablet, mobile, reduced, offline, 1920, 2560, 320) + axe + motion/type/spacing/jumbo checks + section diff + AEO |
| `scripts/goldfish.mjs` | **v3.4** `pack` one fresh-reviewer packet per lens (doc + rules + sources, no conversation); `lint` the merged report and the elephant's decisions |
| `scripts/lead-jobs.mjs` + `templates/lead/` | **v3.5** Maps rows → scored leads → one job folder per site (`JOB.md`) → atomic claim → done-gate |
| `scripts/shot-lint.mjs` + `templates/handoff/assets/shots/` | **v3.5** JSON shot spec per clip: lint (one move, path, invariants, loop, fresh roster) + compile to prose |
| `references/lead-pipeline.md` · `multi-harness.md` | **v3.5** lead mode L0–L8, spec-demo rules; job contract, lanes, parallel runs |
| `references/model-roster.md` · `video-json-prompting.md` | **v3.5** live model roster by role (ask when the pick changed); JSON video prompting mapped to the director skill |
| `references/pipeline-coverage.md` | **v3.5** step audit: original skill vs v3.2 vs v3.4 vs now; stand-ins for owners not in the repos |
| `scripts/launch-check.mjs` | Launch gate on the live URL (robots, noindex, canonical/sitemap/llms hosts, favicon) |
| `references/goldfish-review.md` + `goldfish-lenses.yaml` | **v3.4** GR1/GR2/GR3 protocol and 9 website lenses (naive client, conversion, search & answers, trust & tone, accessibility, motion & performance, brand & type, zoom-out, drift) |
| `references/handoff-folder.md` | What lives in the hand-off folder and who writes each file |
| `references/motion-picker.md` + `motion-catalog.yaml` | 34 effects: plain name, technique, module, cost, gentle/bold, sector fit |
| `references/type-picker.md` + `type-pairings.yaml` | 37 curated pairings (Fontshare/Bunny, licences verified), jumbo support, banned lists |
| `references/custom-typography.md` + `type-refs/` | 26 custom-type styles (type behind subject, AI material letters, glyph kits…), prompts, sector table |
| `references/spacing-system.md` | Fluid spacing scale, section rhythm, container rules, verify checks |
| `references/video-per-section.md` | Chuma's signature style: one distinct clip per section, one plays at a time |
| `references/subtle-cinematic.md` | Profile for home care / law / medical / SaaS + home-care compliance, AI disclosure, LocalBusiness schema |
| `references/multi-page.md` | Astro / Next.js path, service-page template, no-design pages |
| `references/build-chain.md` | Numbered build prompts P0–P15, commit + clear context after each |
| `references/launch-gate.md` | Preview-vs-production checklist, launch-check, Cloudflare Workers free host |
| `references/clean-room.md` | Rebuilding an effect you saw: observed behaviour only (`replica-skill-sa` + `reanimate`) |
| `references/examples/astonishing/` | Worked example: brief, design-spec (both revised after goldfish review), wireframe.yaml, type-inputs.yaml, findings, `reviews/`, `EVAL.md` (baseline vs goldfish test) |
| `references/examples/menken-clean-room.md` | Observed-behaviour spec behind `expand-panels` / `view-switch` |
| `references/modules.md` · `asset-pipeline.md` · `prompt-tokens.md` · `storyboard-to-video.md` · `qa-gate.md` · `seo-aeo-gate.md` · `direction-intake.md` · `web-research-agent-reach.md` · `ai-font-packs.md` | Unchanged roles from v3.2 (updated where noted in the CHANGELOG) |
| `taste-profile.yaml` | Chuma's defaults; both pickers read it and write back to it |
| `tests/gallery.html` · `tests/run-all.sh` · `tests/fixtures/` | Every module on one page + the full regression (positive and negative fixtures) |

Load reference files when their phase starts, not all up front.

## 1. Gate order

```
G0  INTAKE ─ direction-intake.md + "The website will…" highlight (auto) ─────────► handoff/brief.md (confirmed)
G1  TOP-3 COMPETITOR TEARDOWN + SEO/AEO BLUEPRINT (seo-aeo-optimizer) ────────────► design-spec.md §SEO/AEO
 ↳ GR1 GOLDFISH REVIEW of brief + blueprint (fresh reviewers, no chat history) ────► reviews/GR1-brief.md (asks ride with G2)
G2  MUSE MOODBOARD — design + motion references ─────────── HARD STOP ──────────► moodboard_approved
G3  MOTION PICKER (motion-pick.mjs) + TYPE PICKER (type-specimens.mjs) ── review ─► motion_approved, type_approved
G4  GREY-BOX WIREFRAMES (greybox.mjs, every sitemap URL, spacing tokens) ─ HARD STOP ► wireframe_approved
G5  DESIGN-SPEC + PAGE-TEXT locked in handoff/ (tokens, type, spacing, motion score, SEO/AEO, budgets)
 ↳ GR2 GOLDFISH REVIEW of design-spec + page-text + motion plan ─────────────────► reviews/GR2-design-spec.md
G6  MOTION SCORE + ASSETS (asset-pipeline.md, video-per-section.md, custom-typography.md, letter-check)
G7  NUMBERED BUILD CHAIN (build-chain.md: P0 setup → tokens → chrome → one prompt per section → pages → wide → a11y → SEO/AEO)
G8  QA — verify.mjs (+ --motion-plan --type --sections --letters) exit 0, then the visual loop (qa-gate.md)
 ↳ GR3 DRIFT CHECK — one fresh reviewer: built preview vs design-spec + page-text ──► reviews/GR3-drift.md
G9  LAUNCH GATE — launch-check.mjs on the live domain (launch-gate.md)
G10 SHIP — deploy (sa-deploy-operator), sitemap, IndexNow, live aeo-check
G11 VOICE — only when sold: voice-agent #38 + voice-gemini #43 (Gemini Live; sa-voice-agent-builder), AI disclosure on the page
G12 OUTREACH + LOG — outreach-copywriter (lead mode: after batch review); Drive SESSION_MEMORY log
```
Lead mode maps onto the same gates (table in `references/lead-pipeline.md`): G2/G3/G4 are decided automatically
and logged, GR1/GR3 and G9 are skipped until the business buys, G12 waits for the batch review.
No code, assets or assemble before G2 and G4 approvals. Goldfish reviews add **no new approval stop**: their `ask` items
are shown with the next approval Chuma already gives (GR1 → moodboard, GR2 → one message before assets are generated, only if there are asks, GR3 → launch). Max 2 rounds each. The gates live in `handoff/brief.md` front
matter (`confirmed`, `moodboard_approved`, `motion_approved`, `type_approved`, `wireframe_approved`).
**Review mode** (default) shows Chuma one screen per picker and waits. **Full-auto mode** decides from
the taste profile, sector, moodboard and budget, records *why* in the plan, and still stops at G2 and G4.

### Routing

Route each concern to the skill that owns it. Pull on demand; never restate their content here.

| Concern | Owner (verified to exist) | When to load |
|---|---|---|
| Reading reference links + design / voice-of-customer research (web, YouTube, X, Reddit, Instagram) | `agent-reach` — protocol in `references/web-research-agent-reach.md` | P0 intake |
| Top-3 competitor teardown (Google, Map Pack, AI answers) + SEO/AEO blueprint | `seo-aeo-optimizer` — gates in `references/seo-aeo-gate.md`. Run `scripts/teardown.py --aeo`. Do not duplicate that skill here. | After the brief, before the moodboard |
| Analyzing uploaded references (images, sites, videos, Figma) | `brand-extractor`, `extract-design-system`, `defuddle`, `firecrawl-mcp`, `sa-watch`, `sa-video-skill-extractor`, `sa-youtube-cli`, `mobbin-operator`, Figma MCP, Higgsfield `video_analysis_create` | P0 intake |
| Lead scrape (Google Maps) | `spaceage-geofusion-x`; any Maps export works (`scripts/lead-jobs.mjs` column aliases) | lead mode L0 |
| Lead scoring, job queue, claiming | `scripts/lead-jobs.mjs` — `references/lead-pipeline.md`, `multi-harness.md` | lead mode L1–L4 |
| Brief from a lead row | `templates/lead/brief.md` (facts). `lead-to-brief` only for its outreach fields | lead mode |
| Outreach after a build | `outreach-copywriter` (email / SMS) | G12 / lead L6 |
| Voice agent on the site | modules #38 `voice-agent` + #43 `voice-gemini` (Gemini Live, `templates/api/voice-token.mjs`); `sa-voice-agent-builder` for the script | G11, when sold |
| Client brand tokens from a URL | `brand-extractor` / `extract-design-system` | client has a site |
| Creative strategy, references, Site DNA | `spaceage-savo-creative-director-os` | new brand / no direction |
| Moodboard (design + motion references) | Muse + `design-reference-moodboard`; when those are not installed: `ui-ux-designer` + `ui-ux-pro-max` | G2; approval is a hard stop before any code |
| Type pairing | **type picker** (`references/type-picker.md`); `type-as-brand` for identity-led type | G3 |
| Motion selection | **motion picker** (`references/motion-picker.md`); effect names from `animation-vocabulary` / `site-reverse-engineer` | G3 |
| Rebuilding an effect seen on another site | `replica-skill-sa` (observed behaviour) + `reanimate` frame compare — `references/clean-room.md`; `rea-sa` only for software Chuma owns | G3/G6 |
| Wireframes, page text, numbered build prompts | Fadel workflow (adapted here: `build-chain.md`, `handoff-folder.md`) | G4–G7 |
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
| Cinematography for every still and clip (intent, camera, lens, light, movement, tokens) | **`space-age-cinematic-director`** v4.1 (`skills/space-age-cinematic-director-v3/`). Helpers: `banana-pro-director-30`, `seedance-2-5-prompting`, `character-builder` | asset phase |
| Video prompt format | JSON shot spec — `references/video-json-prompting.md`, `scripts/shot-lint.mjs` | asset phase |
| Image/video generation | **Live roster, by role** — `references/model-roster.md` (Higgsfield MCP `models_explore` first). No model name is fixed in this skill; client mode asks when the pick changed | asset phase |
| Copy that doesn't read as AI | `stop-slop-pro` | every build |
| Local SEO + GEO schema | `seo-aeo-optimizer` (plan + templates) and `sa-local-seo-geo` (implementation helper) | every public site; plan is done in P0c |
| Design critique loop | `design-review-pro`, `design-loop` | QA pass 3 / Flagship |
| Fresh-eyes doc review (elephant/goldfish) | **goldfish review** (`references/goldfish-review.md`, `scripts/goldfish.mjs`); upstream EGM plugin in Space-Age-Skills `skills/egm-elephant-goldfish/` | GR1 after G1, GR2 after G5, GR3 after G8 |
| Factory, platforms (Wix/Framer/Webflow/Shopify/WP), voice agent, evidence package | `cinematic-website-director` | multi-site, non-code platform, or director-level gate |
| Shopify theme | `shopify-cinematic-builder` | Shopify target |
| Deploy | `sa-deploy-operator` | after the gate passes |
| Memory log | `sa-obsidian-vault-ops` | session end |
| Code discipline | `karpathy-guidelines` + `ponytail` (smallest complete change) | always |
| Token discipline | `caveman` (terse chat) + `ponytail` | always (Tier 0) |

Some owners above exist only on the machine that built v3.4 (`seo-aeo-optimizer`, Muse / `design-reference-moodboard`,
`site-reverse-engineer`, `type-as-brand`, `reanimate`). If one is not installed, use the stand-in listed in
`references/pipeline-coverage.md` and say so in the report. Never skip the step.

### Precedence when skills disagree

| Conflict | Ruling |
|---|---|
| Color / type / moodboard values | Locked Handoff Package > `brand-extractor` BTP > approved Muse moodboard > `ui-ux-designer` defaults > v3 starter tokens |
| Sitemap / page types / schema / answer capsules | Confirmed `seo-aeo-optimizer` blueprint wins over recipe defaults |
| Liquid glass / 3D goo typography | Banned on law, SaaS, medical and home-healthcare sites — no Flagship or Premium exception |
| Font allowed? | `design-taste-frontend` banned list wins (Inter, Poppins, Lato, Fraunces, Instrument Serif out unless the client's brand already uses them) |
| Font provider | One provider per page: Fontshare / Bunny (Google-compatible API, GDPR-safe) by default; self-host WOFF2 on Premium |
| VL-01 indigo glass (`#6366f1`) | Space Age's **own** properties only. Client builds use client tokens |
| Smooth scroll | Native by default. **Soft Lenis** (`<html data-cwb-smooth="soft">`, lerp 0.14) is Chuma's taste default and may be on without further justification, desktop fine pointer only; **never on touch or reduced motion**. Other Lenis settings need a documented reason |
| Signature defaults | `video-per-section` and jumbo custom type (style 1, type behind subject) come from `taste-profile.yaml`; the brief can opt out; regulated sectors get their calm forms |
| Conflicting docs | `handoff/design-spec.md` wins; its decisions-on-conflicts log records every override |
| Camera, lens, lighting, tokens | `space-age-cinematic-director` v4.1 wins over `prompt-tokens.md` and any older prompt rule here |
| Which image/video model | The live roster read that day wins over any name in a doc, an old `assets.yaml` or memory |
| Asset timing | Assets before build (this skill + director agree; v2-synced was wrong) |
| Module code vs `gsap-supercharged` snippets | Modules here are the production versions (isolated, tested); use gsap-supercharged for patterns not in the catalog |

## 2. Workflow — gates, each with an exit condition

**G0 — Intake.** Run `references/direction-intake.md` (two rounds; uploads: images, links, videos). Then
write the **"The website will…" highlight** automatically: 5–8 lines, each starting "The website will…",
covering outcome, audience, proof, the main CTA and the feeling (Fadel's brief highlight). Show it with the
one-screen summary. *Exit: `handoff/brief.md` with `confirmed: true`.*

**G1 — Teardown + SEO/AEO blueprint.** `seo-aeo-optimizer` §1, `scripts/teardown.py --aeo`. Borrow
structure and patterns only. The blueprint (sitemap, page types, schema, question H2s + 40–60 word
capsules, entity/NAP, robots/llms/sitemap/IndexNow) goes into `design-spec.md` §SEO/AEO.
*Exit: blueprint filled.*

**GR1 — Goldfish review of the brief (v3.4).** `node scripts/goldfish.mjs pack GR1 --handoff handoff --source <existing site or GBP URL>`
→ one packet per lens (naive-client, search-and-answers, trust-and-tone, zoom-out). Launch one **fresh** subagent per packet whose
whole task is "Read <packet>/PROMPT.md and follow it." Merge into `handoff/reviews/GR1-brief.md`, decide each blocker/should (fix ·
contest with evidence · ask · accept-risk), `goldfish.mjs lint … --resolved` exit 0. Round 2 only if a blocker was fixed.
Missing client facts become **ask** items, never inventions. `references/goldfish-review.md`. *Exit: `review_gr1: done`.*

**G2 — Muse moodboard (hard stop).** Design references **and** motion references (screen recordings or
URLs; name each effect with `animation-vocabulary`; for live sites the motion inventory comes from
`site-reverse-engineer`, observed behaviour only). Write the Design Read (taste-pro §0). Tag any custom-type
styles Chuma points at in `references/type-refs/INDEX.png`. *Exit: `moodboard_approved: true`.*

**G3 — Pickers.**
`node scripts/motion-pick.mjs handoff/wireframe.yaml --moodboard handoff/moodboard.yaml --taste taste-profile.yaml`
→ `handoff/motion-plan.yaml` + `motion-review.html` (one screen, live demos, alternates).
`node scripts/type-specimens.mjs handoff/type-inputs.yaml --taste taste-profile.yaml --spec handoff/design-spec.md`
→ 3 specimen cards (headline, H2, body, button, jumbo word at 1440/390) + custom-type style ranking.
Approve or swap (`--swap page/section=effect`, `--choose pairing-id`); picks feed the taste profile.
*Exit: `motion_approved`, `type_approved`.*

**G4 — Grey-box wireframes (hard stop).** `node scripts/greybox.mjs handoff/wireframe.yaml --sitemap handoff/sitemap.xml`
→ one greyscale page per sitemap URL (templates expand with `use:` + `each:`), screenshots at 1440 and
390, contact sheet, `sections.md`. Spacing is approved here because the greybox renders with the real
spacing tokens. Lint fails on: a sitemap URL with no wireframe, a page without exactly one H1, a service
page without a question H2 + capsule slot. *Exit: `wireframe_approved: true`.*

**G5 — Design-spec + page-text.** Fill `handoff/design-spec.md` (tokens ~8 colours primitives→roles,
optional dark; type block from the picker; spacing; grid 744/1200, max 2400; motion score from the plan;
SEO/AEO plan; perf budgets; decisions log; **beat sheet**: Hook → Problem → Proof → Offer → CTA, one line per section, before the motion score) and `handoff/page-text.md` (every word on every page, through
`stop-slop-pro`). Section reference PNGs go to `handoff/sections/` (approved greybox or design frames).
*Exit: both files have no TODOs.*

**GR2 — Goldfish review of the spec (v3.4).** Same loop with `pack GR2` (brand-and-type, accessibility, motion-and-performance,
conversion) on `design-spec.md`, `page-text.md`, `motion-plan.yaml`, `wireframe.yaml`. This is the check that catches a spec that would
fail verify later (e.g. system-font headings vs `--type`), a missing SEO/AEO section, unsourced claims and contrast pairs.
*Exit: `review_gr2: done`, no open blocker.*

**G6 — Motion score + assets.** First `references/model-roster.md` (read the live roster, pick per role, ask in
client mode when the pick changed). Load `space-age-cinematic-director` for every camera, lens, light and movement
decision. Each clip is a JSON shot spec (`references/video-json-prompting.md`) that passes
`node scripts/shot-lint.mjs handoff/assets/shots`. Then `references/asset-pipeline.md`; video-per-section clips planned per section
(distinct subject, camera move, pacing) in `references/video-per-section.md`; custom-type renders in
`references/custom-typography.md`, each AI word through `scripts/letter-check.mjs`. *Exit: every slot hosted,
sized, budgeted; `shot-lint` exit 0; model + `roster_checked` recorded per slot; `ai-letters.yaml` all pass/confirmed.*

**G7 — Numbered build chain.** `references/build-chain.md`: P0 setup → P1 tokens → P2 chrome → one prompt
per section → pages → responsive + wide → a11y → SEO/AEO. Commit after each prompt and clear context.
Single file: `assemble.mjs`. Multi-page: `references/multi-page.md` (Astro or Next.js). *Exit: build runs.*

**G8 — QA.** `node scripts/verify.mjs site/index.html [more pages] --motion-plan handoff/motion-plan.yaml --type handoff/type/type-pick.yaml --sections handoff/sections --letters handoff/type/ai-letters.yaml`
→ fix → re-run until exit 0. Then the visual loop in `references/qa-gate.md`. *Exit: `qa/REPORT.md` PASS.*

**GR3 — Drift check (v3.4).** `pack GR3 --source <preview URL> --source qa/report.json` → one fresh drift reviewer lists only where the
build differs from `design-spec.md` / `page-text.md`. Elephant decides per drift: fix the build or update the spec (with a §11 log line).
*Exit: `review_gr3: done`.* Factory tier skips GR3.

**G9 — Launch gate.** `node scripts/launch-check.mjs https://domain --pages /,/services/x` on the live domain
(preview with `--preview`). `references/launch-gate.md`. *Exit: PASS.*

**G10 — Ship.** `sa-deploy-operator`; sitemap submitted, IndexNow pinged, live `aeo-check.py`.

**G11 — Voice (only when sold).** Modules #38 `voice-agent` + #43 `voice-gemini` (Gemini Live, token endpoint from `templates/api/voice-token.mjs`); the AI
disclosure line is on the page. *Exit: a test call completes.*

**G12 — Outreach + log.** `outreach-copywriter` with the preview or live URL and the evidence (lead mode: the
`why[]` lines from scoring, after the batch review). Log to Drive SESSION_MEMORY. *Exit: sent list + log written.*

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
15. **Crawlers see the same copy humans do.** All copy, headings, NAP, prices, FAQs and JSON-LD live in the server-rendered initial HTML. Animations enhance content; they never hide it. No text that exists only in canvas or WebGL — `frame-scrub` and 3D scenes keep a poster plus the real caption in HTML.
16. **Service pages use question-shaped H2s** with a 40–60 word answer in the first 1–2 sentences.
17. **Core Web Vitals budgets (field, mobile, 75th):** LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Lazy-load heavy assets; every video has a poster; reserve space for media.
18. **Ship `robots.txt` that allows retrieval AI bots**, an XML sitemap, IndexNow on deploy, and optional `llms.txt`. Templates are in `templates/`.

## 7. Design laws (taste)

- Pass `design-taste-frontend`'s ban list and 35-point pre-flight. Signature AI tells to kill on sight: purple-to-blue gradients on white, emoji icons, three equal feature cards, centered everything, glass on every surface, `Inter` + `rounded-2xl` + drop-shadow defaults, lorem, "Unlock the power of…".
- **No liquid-glass or 3D goo typography on law, SaaS, medical or home-healthcare sites.** No Flagship or Premium exception.
- Type: from the type picker only (max 2 families, ≤ 4 files). **Jumbo display is the signature**: `--t-jumbo`, tracking −0.04 to −0.06em, leading 0.85–0.95, `text-wrap: balance`, fitted with `cqi` + `jumbo-fit` so nothing overflows at 320–2560; the jumbo word is always real HTML text. Body 1.5–1.6 line-height, measure ≤ 70ch.
- Spacing: `references/spacing-system.md`. Fluid `--space-*` scale tied to the type scale; gaps between sections > gaps within; one dominant element per viewport; real negative space; side padding never < 16px; tap targets ≥ 44px.
- Custom type: `references/custom-typography.md`. Regulated sectors get styles 1 and 5 in calm form only.
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
| Smooth scroll | soft Lenis (taste default) | off | never | off |
| Video-per-section | one chapter plays | one chapter plays (posters on save-data) | posters | posters |
| Jumbo / custom type | fitted, scrub/parallax | fitted, gentle | static | CSS-fitted (cqi) |
| Carousel (21) | 3D tilt | 3D tilt (CSS) | flat snap | flat snap |
| Nav (22) | condenses on scroll | tap menu | instant | static header |

## 9. Build commands

```bash
SKILL=<this folder>                                                   # e.g. ~/.claude/skills/cinematic-website-builder
# CWB_NODE_MODULES=<dir> only if deps are not in ./node_modules or the global npm root
# lead mode (references/lead-pipeline.md)
node $SKILL/scripts/lead-jobs.mjs score leads.csv --audit && node $SKILL/scripts/lead-jobs.mjs init leads.scored.json --out jobs --top 10
node $SKILL/scripts/lead-jobs.mjs claim jobs --by <harness-id>       # then: "Read <job>/JOB.md and follow it."
# client mode
cp -r $SKILL/templates/handoff handoff                               # G0: the hand-off folder
node $SKILL/scripts/motion-pick.mjs handoff/wireframe.yaml --taste $SKILL/taste-profile.yaml         # G3
node $SKILL/scripts/type-specimens.mjs handoff/type-inputs.yaml --taste $SKILL/taste-profile.yaml --spec handoff/design-spec.md
node $SKILL/scripts/greybox.mjs handoff/wireframe.yaml --sitemap handoff/sitemap.xml                  # G4
node $SKILL/scripts/goldfish.mjs pack GR1 --handoff handoff --source https://client-site/              # GR1 (GR2 after G5, GR3 after G8)
node $SKILL/scripts/goldfish.mjs lint handoff/reviews/GR1-brief.md --resolved
node $SKILL/scripts/shot-lint.mjs handoff/assets/shots [--compile]                                   # G6: JSON shot specs
node $SKILL/scripts/letter-check.mjs handoff/type/ai-letters.yaml                                    # G6
cp $SKILL/templates/starter.html site/index.src.html
node $SKILL/scripts/assemble.mjs site/index.src.html -o site/index.html                              # G7
node $SKILL/scripts/verify.mjs site/index.html --motion-plan handoff/motion-plan.yaml --type handoff/type/type-pick.yaml --sections handoff/sections --letters handoff/type/ai-letters.yaml   # G8
node $SKILL/scripts/launch-check.mjs https://example.com --pages /,/services/x                       # G9
```
Requirements: Node ≥ 20; Playwright + Chromium; `axe-core`, `pngjs`, `pixelmatch`, `tesseract.js`
(`npm i -D playwright axe-core pngjs pixelmatch js-yaml tesseract.js && npx playwright install chromium`, or point
`CWB_NODE_MODULES` at an existing install). The full AEO audit needs Python 3 and `seo-aeo-optimizer` (`SEO_AEO_SKILL`); without it `verify.mjs` runs its built-in blocking AEO checks and flags that in the report.
Skill regression (must pass before any release): `tests/run-all.sh`.

## 10. Output standards (the assembled file)

1. `<!DOCTYPE html>`, `lang`, viewport, title (≤ 60 ch), meta description (150–160 ch), canonical, OG/Twitter, theme-color.
2. Valid JSON-LD (LocalBusiness / vertical subtype + Service where relevant) from the SEO/AEO blueprint; NAP identical to the Google Business Profile; all of it in the initial HTML.
2b. `robots.txt` allows retrieval AI bots; XML sitemap of indexable URLs; IndexNow on deploy; optional `llms.txt`.
3. Fail-open head snippet, then assembled CSS (base + used modules).
4. GSAP 3.15.0 + only the plugins used, from cdnjs, `defer`; runtime + used modules inline.
5. LCP media preloaded with `fetchpriority="high"` and real dimensions; everything else lazy.
6. Total transfer (desktop, first load) within the tier budget: Factory ≤ 900 KB, Enhanced ≤ 1.5 MB, Cinematic ≤ 3 MB, Flagship by manifest.
7. `verify.mjs` exit 0, `qa/REPORT.md` and `qa/aeo.json` alongside the file; `launch-check.mjs` PASS on the live domain.

## 11. Inputs read

```yaml
direction_brief (P0, primary)                 → everything below is pre-fill for it
direction_brief.confirmed                     → required before P0b
direction_brief.seo_aeo                       → P0b/P0c teardown + blueprint; required before P1 code
direction_brief.moodboard_approved            → required before G3
handoff/brief.md gates                        → confirmed · moodboard_approved · motion_approved · type_approved · wireframe_approved
handoff/brief.md reviews (v3.4)               → review_gr1 · review_gr2 · review_gr3 (pending | done | skipped — reason)
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

- Code, generate assets or assemble before teardown, the SEO/AEO blueprint, moodboard approval and wireframe approval.
- Ship an AI-rendered word that has not passed `letter-check.mjs`, or a custom-type moment without real HTML text.
- Name an image or video model from memory or an old doc: read the live roster (`model-roster.md`). Standing preference: not Grok's video model for site clips.
- Generate a clip without a JSON shot spec that passes `shot-lint.mjs`, or stack camera moves, cameras or filename tokens to sound cinematic.
- Lead mode: invent a fact, present generated imagery as the business's own, publish a spec demo without `noindex` + the preview notice, or send outreach before the batch review.
- Add a third-party voice vendor SDK: voice is Gemini Live through `voice-gemini`.
- Skip a step because its owner skill is not installed: use the stand-in in `pipeline-coverage.md` and report it.
- Cite or reuse anything derived from another site's JS bundles (clean-room: observed behaviour only).
- Copy competitor text, images, design or code; or hide copy in JS, canvas or WebGL.
- Use liquid-glass or 3D goo typography on law, SaaS, medical or home-healthcare sites.
- Ship a module outside the runtime, or combine v2 module snippets on one page.
- Put a curtain, gate or scramble over the first-viewport LCP element.
- Pin on phones, hijack scroll, autoplay carousels without controls, or loop flashing content.
- Hard-code brand colors in modules, or reuse another client's (or Space Age's) copy, numbers or colors.
- Generate hero video text-to-video without an approved anchor frame.
- Ship presigned media URLs, unfilled `{{placeholders}}`, or invented proof.
- Call a same-context self-check a goldfish review, or pass the conversation, parent summary, notes or memory to a goldfish.
- Fill a missing client fact (licence, service area, reviews, years) to close a goldfish finding; it becomes an `ask`.
- Report a build as done without a passing `verify.mjs` report (including SEO/AEO hard gates) and the visual loop.
