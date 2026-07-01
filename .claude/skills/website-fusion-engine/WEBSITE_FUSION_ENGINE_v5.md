---
name: website-fusion-engine
version: 5.0.0
status: production
argument-hint: "<project-manifest.json | onboarding-answer-sheet.md> [--tier quick|standard|flagship]"
description: >-
  Use when cloning, recreating, migrating, rebranding, remixing, or fusing one or more
  websites from URLs, screenshots, recordings, uploaded assets, Drive libraries,
  wireframes, brand files, or existing code while preserving selected layout, motion,
  responsive, SEO, conversion, and application behavior.
---

# Website Fusion Engine — Portable Single-File Master Skill (v5.0.0)

> **Portability note:** This is a single-file bundle of the modular `website-fusion-engine`
> skill, generated for agents/platforms that load one markdown file (Codex, Antigravity,
> Cursor rules, generic agents, etc.) instead of a multi-file skill folder with
> progressive disclosure. The canonical, modular source lives in
> `skills/website-fusion-engine/` (SKILL.md + `tools/` + `references/`) — update that
> first, then regenerate this file. Companion CLI tools (`tools/fusion.mjs`,
> `tools/forensics.mjs`) are referenced below by name; copy them alongside this file if
> your platform can execute Node scripts, or treat their described behavior as manual
> steps if it cannot.


# Part 1 — Decision Spine


# Website Fusion Engine

Turn one or more reference websites into a new, **authorized** website — preserving only what the user explicitly chooses to keep, and rebuilding it with real engineering instead of screenshot-matching.

This file is the canonical source. It is a **decision spine**, not a manual: it routes you to the right reference file at the right moment. Load reference files only when the phase needs them (progressive disclosure).

## The one rule

**Build from evidence. Never report a crawl, capture, test, review, or deploy as done unless its artifact exists on disk and the command exited 0.** Confident prose is not a completed tool run. If you cannot get evidence, mark the work `blocked` or drop the mode to `inspired-by` with the user's approval — never paper over a gap with design taste.

## Step 0 — Pick the tier (this scales everything else)

Do not run a flagship process on a landing page. Choose:

| Tier | When | Gates that fire | Required artifacts |
|---|---|---|---|
| `quick` | 1–2 pages, `inspired-by` or simple rebrand, motion optional | Authorization, Completion | manifest, DESIGN.md, final-status |
| `standard` | Multi-section site, real rebrand/migration, some motion | + Capability, Forensic-sufficiency, Design-approval | + forensic-report, remix-matrix, section-specs |
| `flagship` | Motion-led / multi-source / exact recreation | All 7 gates | + motion-map, asset-ledger, visual-diff, motion-audit |

The tier comes from `--tier`, the manifest `project.tier`, or your judgment of the request. State the tier you picked and why, in one line, before proceeding.

## The pipeline

```
onboarding → authorization → capability → capture → forensics →
keep/adapt/replace/drop decisions → DESIGN.md (approved) →
plan → test-first build → review → browser verification → delivery
```

Run it with the shipped CLI. These commands exist in `tools/` — they are real, not placeholders:

```bash
node tools/fusion.mjs doctor --json                 # capability report
node tools/fusion.mjs init <project-dir>            # scaffold docs/ tree + manifest
node tools/fusion.mjs validate <manifest.json>      # manifest is complete + no UNDECIDED critical fields
node tools/fusion.mjs scan <project-dir>            # secret scan (real, fails closed on findings)
node tools/fusion.mjs gate <project-dir> --tier T   # are the artifacts for this tier present? exit 0 = authorized
```

`gate` is the forcing function: **implementation is forbidden until `gate` exits 0** for the chosen tier.

## Build modes (pick one before building)

- **Faithful recreation** — reproduce IA, layout, proportions, motion, pacing. Requires `owned` / `client-approved` / `licensed`.
- **Rebrand** — keep structure + behavior, replace identity/logo/colors/type/copy/media/data.
- **Controlled remix** — route named systems from named sources (A=layout, B=menu+transitions, C=gallery, library=media, new=identity).
- **Inspired-by** — keep principles only, build a distinct implementation. Never call this a clone.
- **Migration** — preserve approved behavior+content, move to a new stack/CMS/host.

## Source routing (never blend silently)

Every section and global system names its source: Site A · Site B · uploaded assets · user brand · user content · generated · retained code. Precedence when they conflict:

```
explicit user instruction → section route → global route →
approved DESIGN.md → verified evidence → documented inference → generated fallback
```

## What each phase needs — load on demand

| Phase | Reference | Tools |
|---|---|---|
| Onboarding / intake | `references/onboarding.md` | `fusion.mjs init` |
| Authorization + capability | `references/onboarding.md` (§Authorization) | `fusion.mjs doctor` |
| Capture + forensics | `references/forensics.md` | `tools/forensics.mjs` (Playwright) |
| Motion reconstruction | `references/motion.md` + `references/recipes/` | `tools/forensics.mjs --motion` |
| Design system / tokens | `references/design-system.md` | — |
| Remix routing + section contracts | `references/remix-routing.md` | — |
| Build → QA → completion | `references/build-and-qa.md` | `fusion.mjs gate`, `fusion.mjs scan` |

Concrete, copy-paste-ready code lives in `references/recipes/` (Lenis smooth-scroll, ScrollTrigger pin/scrub, clip-path fullscreen menu, FLIP route transition). **Use these instead of inventing motion from a screenshot.**

## Motion is structural

When a reference is motion-led, animation is architecture, not decoration. A recreation is incomplete until the selected items among these are mapped *and rebuilt*: page-load choreography, menu open/close, route transitions, scroll-linked transforms, pinned/scrubbed sections, image masks/reveals, hover/focus, custom cursor, kinetic type, media behavior, desktop/tablet/mobile differences, and a `prefers-reduced-motion` fallback. Capture each with the schema in `references/motion.md`; unknown values stay marked `inferred` until the user approves.

## Hard stops

- No implementation before `gate` exits 0 for the tier.
- No retained third-party logos/names/trademarks/copy/private-data in any mode except an authorized faithful recreation that the user told you to keep them in.
- No fabricated reviews, ratings, addresses, awards, credentials, or business facts. Ever. (See `references/build-and-qa.md` §Safe SEO.)
- No temporary remote asset URLs in production delivery.
- No "browser-tested" claim without a screenshot/report artifact.

## Delivery — truthful status only

End with the template in `references/build-and-qa.md` §Completion: STATUS, DELIVERED, VERIFIED, NOT VERIFIED / UNAVAILABLE, KNOWN DIFFERENCES, FILES. No promotional language. State what failed or was skipped plainly.

## Adapters

This bundle IS the adapter payload for single-file platforms. The canonical, modular source (with progressive disclosure, the tested CLI, and generated thin adapters for Cursor/Windsurf/Cline/etc.) lives at `skills/website-fusion-engine/` in the Space Age skills repos. Regenerate this file from there — don't hand-edit both copies.

---

# Part 2 — Onboarding (Intake Questionnaire)

# Onboarding (load only at intake)

Ask only what the tier needs. Convert answers → `docs/intake/project-manifest.json` (stub from `fusion.mjs init`). Any `UNDECIDED` critical field blocks the build.

## Tier → questions to ask

- **quick**: identity (name, domain, purpose), authorization, 1 source + role, brand (colors/fonts/logo), pages, mode.
- **standard**: + per-category KEEP/ADAPT/REPLACE/DROP table, asset sources, content origin, applications, target stack/host, acceptance.
- **flagship**: + full motion direction, multi-source roles, per-app keep/adapt/replace/drop, batch rules, deliverables list.

## Authorization (always)

1. Own / have permission? `owned | client-approved | licensed | inspiration-only`
2. Retain exact layout? motion? copy? images/video?
3. Remove all logos/names/trademarks?

`faithful-recreation` needs owned/client-approved/licensed. `inspiration-only` → principles only, no retained logos/copy/private data.

## Source block (repeat per source)

`url|file · label · role(s) [layout|motion|type|nav|gallery|content|forms|...] · priority [primary|secondary|optional] · exactness [exact|close|conceptual]`

## KEEP / ADAPT / REPLACE / DROP categories

page structure · header/nav · fullscreen menu · hero layout · hero motion · type system · palette · image composition · scroll behavior · scroll reveals · pinned sections · horizontal scroll · parallax · custom cursor · hover · page transitions · kinetic type · galleries · video · forms · booking · payments · CMS · SEO · analytics · mobile · a11y. Mark each. `UNDECIDED` = blocker.

## Brand

name shown · tagline · logo source · primary/secondary hex · forbidden colors · fonts · type direction (minimal|editorial|luxury|industrial|kinetic|futuristic|streetwear|corporate) · match reference proportions? · mood · "must NOT become" words.

## Assets

sources (chat upload|Drive|Dropbox|local|existing site|generate) · use existing before generating? · mandatory · forbidden · edits allowed? · generation allowed? · aspect ratios · hero media (image|video|canvas|webgl|none).

## Content

existing copy vs rewrite vs new · who supplies facts · pages · sections · CTAs · social · contact · legal · testimonials (user-supplied only).

## Motion (flagship)

closeness (frame-close|behavior-close|same-technique-new-timing|inspired) · intensity (subtle|standard|premium|flagship) · additions · removals · smooth scroll? · mobile motion (full|reduced|minimal|none) · max intro ms · max route-transition ms · forbidden motion.

## Applications (keep/adapt/replace/drop each)

CMS · forms · email · CRM · booking · payments · ecommerce · chat · analytics · pixels · maps · media host · auth · portal.

## Technical

stack · agent · host · CMS target · repo · browser support · perf target · a11y target · SEO target · environments · tests · deadline · cost cap · batch count.

## Acceptance

must match exactly · must look different · must behave different · instant-reject conditions · final approver · deliverables (code|repo|zip|preview|prod|forensic|motion-map|asset-ledger|design-system|QA|walkthrough).

---

# Part 3 — Forensics (Capture + Detection)

# Forensics (capture + detection)

Goal: replace guesses with `observed` evidence. Two layers.

- **Static (Firecrawl / fetch)** = routes, metadata, copy, links, public assets, sitemap. Proves content, NOT runtime motion.
- **Behavioral (Playwright)** = computed CSS, DOM state, hover/scroll/focus, network, console, screenshots, motion. Run `tools/forensics.mjs <url> docs/research/sources/<id>/ --motion`.

Per source → own folder under `docs/research/sources/<id>/` with provenance. Never mix sources before provenance is recorded.

## Evidence labels (tag every fact)

`observed` (tool saw it) · `computed` (derived from observed) · `inferred` (best guess, needs approval) · `generated` (you made it up). Easing curves, scrub ratios, intent → `inferred` unless source code seen.

## Detection cheats (from `technologies.json`)

| Signal | Means |
|---|---|
| `#__next` / `__NEXT_DATA__` | Next.js |
| `#__nuxt`, `astro-island`, `html.w-mod-js` | Nuxt / Astro / Webflow |
| `window.gsap`, `ScrollTrigger`, src `gsap` | GSAP (+ScrollTrigger) |
| `window.Lenis`, `studio-freight` | Lenis smooth scroll |
| `locomotive` | Locomotive Scroll |
| `framer-motion` | Framer Motion |
| `window.THREE` | Three.js / WebGL hero |
| `window.Swiper` | Swiper gallery |
| `barba`, route-swap w/o reload | Barba/SPA transitions |
| `wp-content` | WordPress |

Confirm framework before choosing target stack. Detecting a lib ≠ must reuse it (see remix-routing).

## Token extraction (`css-forensics.json`)

Live computed styles → seed `DESIGN.md`. Cluster near-duplicate colors, snap font sizes to a scale, read heading size/weight/line-height/letter-spacing off real `h1/h2/h3`. Mark all `computed`.

## Forensic sufficiency gate (flagship motion source)

A `motion`-role source needs ONE of: successful Playwright capture · user screen-recording · source code with the animation. Static HTML alone ≠ enough for frame-close motion. Else: block or downgrade to `inspired-by`.

## Outputs per source

`source-audit.json · technologies.json · css-forensics.json · network-resources.json · runtime-errors.json · motion-map.json · page.html · screenshots/ · FORENSIC_REPORT.md` (human summary: stack, libs, 3rd-party apps, evidence, tradeoffs, portable rebuild recipe, keep/adapt/replace/drop recommendation).

---

# Part 4 — Motion Reconstruction

# Motion reconstruction

Rebuild the **interaction model**, not a screenshot, and not "install every lib detected." Pick the lightest stack that reproduces the behavior.

## Capture schema (one record per interaction → `motion-map.json`)

```json
{
  "id": "home-image-reveal-01",
  "route": "/", "trigger": "scroll", "target": ".project-image:nth-child(1)",
  "initial": { "opacity": 0, "transform": "translateY(80px) scale(1.08)", "clipPath": "inset(100% 0 0 0)" },
  "final":   { "opacity": 1, "transform": "translateY(0) scale(1)",       "clipPath": "inset(0 0 0 0)" },
  "durationMs": 900, "easing": "power3.out",
  "scroll": { "start": "top 85%", "end": "top 45%", "scrub": false, "pin": false },
  "desktop": "full", "tablet": "reduced-distance", "mobile": "fade-translate",
  "reducedMotion": "opacity-only",
  "evidence": "browser-capture", "confidence": 0.95
}
```

`initial/final/top` = `observed` (forensics.mjs). `easing/duration/scrub` = `inferred` unless source seen. Unknown stays unknown until user approves.

## Stack choice

| Need | Use |
|---|---|
| Smooth scroll | Lenis (modern, light) — recipe `recipes/smooth-scroll-lenis.md` |
| Scroll-linked transforms, pin, scrub | GSAP + ScrollTrigger — `recipes/scrolltrigger-pin.md` |
| Component enter/exit, layout, React | Framer Motion |
| Fullscreen menu, masks | CSS `clip-path` + transitions — `recipes/fullscreen-menu.md` |
| Route transition (SPA) | FLIP / View Transitions API / Framer — `recipes/route-transition.md` |
| 3D / particle hero | Three.js / R3F (only if source truly uses it) |

Rule: Lenis + GSAP covers ~80% of award-site motion. Don't add Locomotive *and* Lenis. Don't add Framer *and* GSAP for the same job.

## Non-negotiables

- `prefers-reduced-motion: reduce` → kill transforms/scrub, keep opacity ≤200ms. Required.
- No hydration flash: set initial hidden state in CSS, not just JS.
- Kill ScrollTrigger/Lenis on route unmount (cleanup) — memory + double-bind bugs.
- Mobile: usually downgrade distance/scrub; test on 390px.
- Pin/scrub must be tested at every breakpoint — pin heights break responsive.

## Completeness (motion-led source)

Map + rebuild selected: page-load choreography · menu open/close · route transitions · scroll transforms · pinned/scrubbed · image masks/reveals · hover/focus · custom cursor · kinetic type · media behavior · per-breakpoint differences · reduced-motion fallback.

---

# Part 5 — Design System Synthesis

# Design system synthesis

Turn `css-forensics.json` + brand answers → approved `DESIGN.md` + tokens. User approves before any code.

## Outputs

- `docs/design/DESIGN.md` — human-readable system + rationale.
- `docs/design/design-tokens.json` — machine tokens.
- Tailwind/CSS var export (match target stack).

## Token set (extract, then snap to scale)

- **Color**: brand primary/secondary (from brand answers, NOT reference if rebranding) + neutral ramp + semantic (bg/fg/border/success/error). Cluster reference colors; drop near-duplicates.
- **Type**: family (brand fonts override reference), modular scale (e.g. 1.2–1.333), weights, line-height per role, letter-spacing on display. Read real h1/h2/h3 from forensics for proportion.
- **Space**: 4px or 8px base, consistent ramp.
- **Radii / shadows / borders**.
- **Motion tokens**: durations (fast 150 / base 300 / slow 600), easings (standard, emphasized), stagger step.
- **Breakpoints**: match target (e.g. 390 / 768 / 1024 / 1440).

## Rules

- Rebrand/remix: identity tokens (color, type, logo) come from the NEW brand, not the reference. Reference supplies proportion/structure only.
- One canonical token source. Components read tokens, never hardcode hex.
- Contrast: every fg/bg pair ≥ WCAG AA (4.5:1 text, 3:1 large/UI).
- Forbidden colors from onboarding → assert none appear.

## Example token shape

```json
{
  "color": { "brand": { "500": "#0a84ff" }, "neutral": { "0":"#fff","900":"#0a0a0a" }, "bg":"#fff","fg":"#0a0a0a" },
  "font": { "display": "Rajdhani, sans-serif", "body": "Inter, sans-serif" },
  "fontSize": { "xs":"0.8rem","base":"1rem","xl":"1.5rem","display":"clamp(2.5rem,6vw,5rem)" },
  "space": { "1":"4px","2":"8px","4":"16px","8":"32px" },
  "radius": { "sm":"6px","lg":"16px" },
  "motion": { "fast":"150ms","base":"300ms","slow":"600ms","ease":"cubic-bezier(.22,1,.36,1)" }
}
```

---

# Part 6 — Remix Routing + Section Contracts

# Remix routing + section contracts

## Remix matrix (`docs/design/remix-matrix.json`)

Route every global system + every section to ONE approved source. No silent blends.

```json
{
  "globals": {
    "layout": "site-a", "navigation": "site-a", "menu": "site-b",
    "motion": "site-b", "typography": "new-brand", "palette": "new-brand",
    "forms": "generated", "cms": "generated"
  },
  "sections": [
    { "id": "hero", "structure": "site-a", "motion": "site-b", "content": "user", "assets": "library" },
    { "id": "work-gallery", "structure": "site-c", "motion": "site-c", "content": "user", "assets": "library" }
  ]
}
```

Sources: `site-a|b|c · uploaded · user-brand · user-content · generated · retained-code`. Precedence: explicit user instruction → section route → global route → approved DESIGN.md → verified evidence → inference → generated fallback.

## Section contract (one file per section → `docs/design/section-specs/<id>.md`)

Each section = independently testable unit:

- **purpose** + conversion role
- **source evidence** (paths into `docs/research/sources/`)
- **content source** + **asset source** (filenames from asset-ledger)
- **structure**: desktop / tablet / mobile layout
- **motion**: motion-map ids that apply
- **states**: hover / focus / active / loading / empty / error
- **dependencies**: libs, data, integrations
- **acceptance tests**: what must pass to call it done

## Builder contracts

One focused builder per section/feature. Explicit file ownership. No two builders write the same file. Use git worktrees when available. Test-first.

## Asset ledger (`docs/design/asset-ledger.json`)

Per asset: `filename · source · license/authorization · dims · format · subject · intended slot · crop/focal · accepted|rejected`. Search user library before generating. Never ship temp remote URLs to prod.

---

# Part 7 — Build, QA, and Delivery

# Build → QA → delivery

## Build (after `gate` exits 0)

Test-first per section: write failing test → confirm fail → minimum code → pass → refactor. One builder per section contract. Resolve animation-lib conflicts deliberately (don't stack Lenis+Locomotive). Reproduce interaction model, not every detected lib.

If Superpowers skills are installed, use them (`brainstorming`, `writing-plans`, `test-driven-development`, `subagent-driven-development`, `verification-before-completion`). If NOT installed, follow their intent inline — never block on a missing skill.

## QA artifacts (`docs/qa/`)

`build-report · browser-report · visual-diff-report · motion-audit · accessibility-report · performance-report · security-report` → `final-qa-report.md`.

- **build**: compile + lint + unit/e2e pass.
- **browser**: re-run `tools/forensics.mjs` on YOUR build; compare to reference capture.
- **visual diff**: screenshot per viewport, diff vs reference (ImageMagick `compare` if available) to the approved exactness level.
- **motion audit**: each selected motion-map id reproduced; reduced-motion verified; no hydration flash.
- **a11y**: keyboard nav, focus visible, semantic controls, contrast AA, labeled media/forms, no cursor-only function.
- **perf**: responsive images, lazy-load, font strategy, code-split, animation cleanup, mobile memory, Core Web Vitals.
- **security**: `node tools/fusion.mjs scan <project>` → 0 findings (fails closed).

## Safe SEO

ALLOWED: accurate metadata, structured data from verified facts, local SEO from user business data, canonical, sitemap/robots.
FORBIDDEN: fabricated reviews/ratings, fake addresses, false ranking/credential/membership claims, invented awards.

## Prohibited shortcuts

replace requested recreation w/ original concept · infer motion from static markup + call it confirmed · claim browser-tested w/o artifact · ship temp remote asset URLs · code before keep/adapt/replace/drop resolved · copy every detected lib · keep 3rd-party identity when rebrand required · fabricate any business fact · hide failed tests · call inspired-by a clone · deliver plans when impl requested (or vice-versa).

## Completion gate

Claim done only when: build passes · required routes work · selected motion works · desktop/tablet/mobile verified · reduced-motion works · forms/apps function · visual+motion meet approved standard · no blocking a11y · no blocking security · no placeholder/temp-remote asset left.

## Delivery template (verbatim shape)

```text
STATUS: completed | partially completed | blocked
DELIVERED
- ...
VERIFIED
- ...
NOT VERIFIED / UNAVAILABLE
- ...
KNOWN DIFFERENCES FROM REFERENCE
- ...
FILES
- ...
```

No promo language. State failures and skips plainly.

---

# Part 8 — Recipe: Lenis Smooth Scroll

# Recipe: Lenis smooth scroll (+ GSAP sync)

```bash
npm i lenis gsap
```

```js
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;
if (!reduce) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);              // keep ScrollTrigger in sync
  gsap.ticker.add((time) => lenis.raf(time * 1000));     // one RAF loop, not two
  gsap.ticker.lagSmoothing(0);
}
```

Cleanup on SPA route unmount:

```js
lenis?.destroy();
gsap.ticker.remove(updateFn);
ScrollTrigger.getAll().forEach((t) => t.kill());
```

Notes: reduced-motion → skip Lenis entirely (native scroll). Never run Lenis + Locomotive together. `lenis.raf` must be the only RAF driving it.

---

# Part 9 — Recipe: ScrollTrigger Pin + Scrub + Reveal

# Recipe: ScrollTrigger pin + scrub + reveal

## Pinned scrub section (e.g. horizontal gallery)

```js
const panels = gsap.utils.toArray('.panel');
const mm = gsap.matchMedia();

mm.add('(min-width: 768px)', () => {              // pin only on desktop — pin breaks mobile
  const tween = gsap.to('.track', {
    x: () => -(document.querySelector('.track').scrollWidth - innerWidth),
    ease: 'none',
  });
  ScrollTrigger.create({
    trigger: '.gallery', start: 'top top',
    end: () => '+=' + (document.querySelector('.track').scrollWidth - innerWidth),
    pin: true, scrub: 1, animation: tween, invalidateOnRefresh: true,
  });
});
```

## Scroll reveal (initial state in CSS to avoid flash)

```css
.reveal { opacity: 0; transform: translateY(80px); }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }
```

```js
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', toggleActions: 'play none none reverse' },
    });
  });
}
```

Rules: `invalidateOnRefresh: true` for responsive pins · `ScrollTrigger.refresh()` after fonts/images load · kill all triggers on unmount · always set hidden state in CSS so SSR doesn't flash content.

---

# Part 10 — Recipe: Fullscreen Overlay Menu

# Recipe: fullscreen overlay menu (clip-path reveal + staggered links)

```css
.menu {
  position: fixed; inset: 0; z-index: 100;
  clip-path: inset(0 0 100% 0);                 /* hidden: collapsed from bottom */
  transition: clip-path .7s cubic-bezier(.76,0,.24,1);
  visibility: hidden;
}
.menu[data-open="true"] { clip-path: inset(0 0 0 0); visibility: visible; }

.menu a { transform: translateY(120%); transition: transform .6s cubic-bezier(.22,1,.36,1); display:block; overflow:hidden; }
.menu[data-open="true"] a { transform: translateY(0); }
.menu[data-open="true"] a:nth-child(1){ transition-delay:.15s }
.menu[data-open="true"] a:nth-child(2){ transition-delay:.22s }
.menu[data-open="true"] a:nth-child(3){ transition-delay:.29s }

@media (prefers-reduced-motion: reduce) {
  .menu, .menu a { transition: opacity .2s; clip-path: none; transform: none; }
  .menu { opacity:0 } .menu[data-open="true"]{ opacity:1 }
}
```

```js
const btn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
btn.addEventListener('click', () => {
  const open = menu.dataset.open === 'true';
  menu.dataset.open = String(!open);
  btn.setAttribute('aria-expanded', String(!open));
  document.body.style.overflow = open ? '' : 'hidden';     // lock scroll while open
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menu.dataset.open = 'false'; });
```

A11y: `aria-expanded` on toggle · `Esc` closes · trap focus inside while open · restore focus to toggle on close · lock body scroll.

---

# Part 11 — Recipe: Route Transitions

# Recipe: route transitions

## Option A — View Transitions API (simplest, native)

```js
// Same-document (SPA) navigation
function navigate(updateDOM) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return updateDOM();
  document.startViewTransition(updateDOM);
}
```
```css
::view-transition-old(root){ animation: fade .3s both }
::view-transition-new(root){ animation: fade .3s reverse both }
@keyframes fade { from{opacity:0} to{opacity:1} }
```
Next.js App Router: enable `experimental.viewTransition` or use the `next-view-transitions` pkg.

## Option B — Framer Motion (React, full control)

```jsx
<AnimatePresence mode="wait">
  <motion.main key={pathname}
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
    {children}
  </motion.main>
</AnimatePresence>
```

## Option C — Overlay wipe (framework-agnostic)

Cover screen with a panel (clip-path/transform) → swap content behind it → reveal. Use when reference does a colored "curtain" between pages.

Rules: reduced-motion → instant swap, no animation · keep transition < the onboarding "max route-transition ms" · don't block first paint waiting for exit anim · scroll to top on new route.

---

# Part 12 — CLI Reference (tools/fusion.mjs, tools/forensics.mjs)

These ship as real, tested Node scripts in the modular skill's `tools/` directory. If your
platform can run Node, copy `tools/fusion.mjs` and `tools/forensics.mjs` alongside this
file and use them as described. If it cannot execute code, perform the same checks
manually and be explicit that they were done by hand, not by the tool.

```bash
node tools/fusion.mjs doctor --json                 # capability report
node tools/fusion.mjs init <project-dir>            # scaffold docs/ tree + manifest stub
node tools/fusion.mjs validate <manifest.json>      # manifest complete, no UNDECIDED critical fields
node tools/fusion.mjs scan <project-dir>            # secret scan, fails closed on any finding
node tools/fusion.mjs gate <project-dir> --tier T   # tier artifacts present? exit 0 = authorized
node tools/forensics.mjs <url> <out-dir> [--motion] [--viewports 1440,768,390]
                                                     # Playwright capture: tech detect, tokens,
                                                     # network, console errors, screenshots, motion
```

`gate` is the forcing function: **implementation is forbidden until `gate` exits 0** for the
chosen tier (`quick`, `standard`, `flagship` — see Part 1).


---

# Part 13 — Evaluation Fixtures

## Good trace (passes)

# GOOD trace (passes)

Tier: standard. Mode: rebrand. Authorization: client-approved.

1. Ran `fusion.mjs doctor` → capability-report.json written; firecrawl missing → marked `missing`, used Playwright.
2. Ran `forensics.mjs https://ref.example docs/research/sources/site-a/ --motion` → page.html, technologies.json (Next.js + GSAP + Lenis, `observed`), css-forensics.json, screenshots/, motion-map.json all present.
3. Presented detected techniques; user marked nav=KEEP, hero motion=ADAPT, custom cursor=DROP.
4. Wrote DESIGN.md with NEW brand colors (reference palette dropped), tokens snapped to scale, contrast AA verified.
5. remix-matrix.json routes hero structure=site-a, motion=site-a(adapted), content=user, assets=library.
6. `fusion.mjs gate docs/ --tier standard` → exit 0, implementation-gate.json status=authorized.
7. Built test-first; Lenis+GSAP only (no Locomotive); reduced-motion fallback present; cleanup on unmount.
8. `fusion.mjs scan` → 0 findings. Visual diff within approved tolerance. Reference logo removed.
9. Delivery used STATUS template; noted hero timing differs from reference (ADAPT, intentional).

Why good: every claim has an artifact; identity rebranded; gate passed before code; motion has reduced-motion + cleanup; honest known-difference.

## Bad trace (must be rejected)

# BAD trace (must be rejected)

"I will just clone site A, put the assets in public, estimate the exact extracted values, and keep their logo until the end."

Violations:
- No authorization established (logo kept on a rebrand → trademark breach).
- "Estimate exact values" = fabricated as `observed`; no forensics artifact exists.
- Started implementation with no gate (`implementation-gate.json` absent / status≠authorized).
- Temp remote asset URLs (`public` dump of source assets, no asset-ledger, no provenance).
- No motion map, no reduced-motion plan, no source routing.
- Claims a clone without browser evidence.

Correct response: STOP. Run onboarding → authorization → doctor → forensics → decisions → DESIGN.md → gate. Downgrade to `inspired-by` if rights are absent. Never keep the third-party logo.
