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
