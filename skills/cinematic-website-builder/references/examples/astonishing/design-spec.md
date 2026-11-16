# Worked example — Design spec (revised after goldfish review GR2, v3.4)

Tokens reverse-extracted from the Astonishing Touch preview CSS and computed styles, 15 Nov 2026, America/Chicago. This is the single source of truth a Design System stage should have locked *after* moodboard approval and *before* hi-fi or code. Unused shadcn/default theme values found in the bundle are called out so the skill can purge them.

**Industry constraint:** home healthcare — no liquid-glass, no 3D goo typography. Frosted pills on chrome are allowed only at the level used here (see Motion & materials).

## Personality

Warm, calm, editorial. Big serif headlines over cinematic care photography; navy ink on white for reading pages; teal as a single accent. Motion is a quiet reveal, not a showpiece. One signature moment: the full-viewport hero film with a pause control.

## Color (8 in use)

| Token | Value | Use |
|---|---|---|
| `--background` | `#ffffff` | Page ground |
| `--foreground` / `--primary` | `#102c46` | Navy ink, primary buttons, header (scrolled) |
| `--muted-foreground` | `#536471` | Body supporting text |
| `--accent` / `--ring` | `#007f88` | Teal accent, italic emphasis, focus ring, hover |
| `--secondary` / `--muted` | `#edf4f4` | Soft mint wash, button hover, chips |
| `--border` | `#d7e0e4` | Hairlines, scrolled header rule |
| `--input` | `#cbd6dc` | Form borders |
| `--primary-foreground` | `#ffffff` | Text on navy |

Supporting (hero/film, not in the 8-color core):

- Hero stage: `#233e42`, left shade `#061c20c9` → transparent
- Chapter body type on film: `#f0f5f6`; chapter eyebrow `#cde8e9`; promise italic `#91e1df`
- Neumorphic chrome (chat launcher, inquiry, active chapter nav): `--neo-face: #e3eaee`, `--neo-ink: #13364b`

Do **not** ship the leftover shadcn palettes also present in the CSS (`--background: #0a0a0a`, purple `--sidebar-primary: #8e51ff`, orange charts). They are unused defaults and violate “client tokens only.”

## Typography

**Revised (GR2-1):** the shipped build used Georgia (system) + Arial (system) + Satoshi 700/900 — three families, system-font headings.
That fails 3.3+ `verify --type` and the two-family rule. The type picker (auto, same inputs) chose **care-modern-serif**:

| Role | Family | Source | Notes |
|---|---|---|---|
| Display / H1–H3 + calm jumbo | Erode 500 | Fontshare | Tracking −0.035 to −0.045em; jumbo −0.04em, leading 0.92. `text-wrap: balance` on the promise heading. |
| Body + UI | Satoshi 400 / 700 | Fontshare | Regular cut loaded for body (fixes "bold-only" drift). Line-height 1.6. Measure ≤ 66ch. |
| Eyebrows / labels | Satoshi 700 | Fontshare | Uppercase, tracking 0.11–0.15em, **≥ 0.8125rem (13px)**. |

`type-pick.yaml`: `declared_families: [Erode, Satoshi]`, 3 files. Chuma confirms at the G3 type screen; a brand override goes in §Conflicts with a reason.

**Jumbo (GR2-5):** calm jumbo on one word of the promise heading (“home”), `--t-jumbo` fitted with `cqi`, no distortion. Custom-type styles off (no cut-outs of real clients).

### Fluid type scale (observed)

| Step | Rule | Size |
|---|---|---|
| Hero H1 | `.hero h1` | `clamp(4.5rem, 8.3vw, 8.7rem)` / line-height 1.03 (smaller clamps on mid and mobile) |
| Section H2 | `h2` | `clamp(2.7rem, 5.2vw, 5.6rem)` / 1.08; intro and promise go up to ~6.9–7.4rem |
| Resource-page H1 | `.resource-page h1` | `clamp(40px, 6vw, 76px)` / 1.12 |
| Resource-page H2 | `.resource-page h2` | `clamp(28px, 3vw, 40px)` |
| Body | `.hero-description`, chapter, intro | **clamp(1.0625rem, 0.3vw + 1rem, 1.1875rem)** (17–19px, GR2-3) / 1.6 |
| Small | eyebrows, legal, scroll cue | 0.8125–0.875rem (13–14px floor) |

## Spacing, radius, grid

**Revised (GR2-4):** tokens from `references/spacing-system.md`, not raw px. The shipped build's values are kept as the measured reference.

- Section rhythm: `--section-y: var(--section-y-gentle)` (regulated profile). Shipped: 110px desktop / 80 / 65px.
- Gutters: `--gutter` (≥ 16px); shipped `clamp(24px, 5.2vw, 84px)` maps to it.
- Container: `--max-content: 1520px` inside `--max-page: 2400px`. Shipped: padding cap `max(84px, 50vw - 720px)` (~1440px content). No horizontal overflow at 1920 or 2560.
- Stacks: `--space-m` inside groups, `--space-xl` heading ↔ content, `--space-2xl` between sub-sections.
- Hero: `100svh`, min 720px, max 1200px. Copy `max-width: 900px`, vertically centred.
- Grids: intro `30% 1fr` (asymmetric, one column on mobile); intro-bottom `1fr 1fr`; service chapters are full-bleed stacked scenes.
- Radius (GR2-9), three values: `--radius-s: 4px` (inputs, tight UI), `--radius-m: 24px` (cards, FAQ triggers), `--radius-pill: 999px` (buttons, chips).
- Buttons: primary navy, hover teal, `translateY(-2px)`; min-height 52px (46px small). Nav and phone chips are light pills.
- Small text on the mint wash uses navy, not teal (teal on mint = 4.29:1, GR2-7).

## Motion score (subtle cinematic)

| Token | Value |
|---|---|
| `--care-motion-fast` | `0.22s` |
| `--care-motion-reveal` | `0.82s` |
| `--care-motion-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` |

Stack actually used (no GSAP, no Lenis, no Framer, no WebGL, no Three):

- CSS view/scroll timelines for a few reveals
- Custom `data-reveal` + `.motion-ready.scene-transitions` + `.chapter-visible` clip/fade
- Keyframes: `reveal-heading`, `scroll-fade-reveal-*`, `gallery-caption-in`, accordion, shimmer
- Hero and chapter `<video>` loops, `muted`, `playsInline`, `preload="none"`, posters, explicit Pause/Play
- `prefers-reduced-motion: reduce` is a parallel design: animations off, opacity forced to 1, scroll-behavior auto, videos paused (control reads “Play motion”)
- `prefers-reduced-transparency` and `prefers-contrast: more` drop backdrop blur on the chapter nav

**Materials:** `backdrop-filter: blur(8–12px)` appears only on the film-control chip, gallery `orbit-card-label` pills, and the chapter nav. Backgrounds stay nearly opaque (`#ffffffed`, `#102c4660`). This is chrome, not glass type. Do not escalate.

**Risk this build showed:** `data-reveal` pre-states use `opacity: 0`. After a full scroll-through, many off-screen nodes were still at opacity 0 in headless QA (81 on desktop). Reduced-motion had zero invisible nodes. The skill’s fail-open rule stands: hidden pre-states only under `.js` + `prefers-reduced-motion: no-preference`, and verify must keep the “stuck invisible” check (refined so closed accordions are not false positives).

## Media

- Formats: WebP stills, MP4 loops, PNG logo (`/brand/astonishing-touch-sharp.png` is 509 KB — too heavy; ship SVG or compressed WebP).
- Homepage loads as many as 11 video sources (hero, promise, nine chapters). Hero ~786 KB, promise ~639 KB, a service loop ~474 KB. Desktop transfer in verify: **9,804 KB**. Lighthouse mobile (partial media): **2,830 KiB**. Over the Enhanced 1.5 MB budget and the Cinematic 3 MB budget once all loops download.
- **Locked numbers (GR2-6):** tier Enhanced → first load ≤ 1.5 MB (posters only below the fold). `video-chapters` on `<main>`: one clip plays at a time, `preload="none"` + `data-src`, clips ≤ 2.5 MB (4–8 s, 1080p, H.264 + WebM), posters ≤ 120 KB with width/height, header logo ≤ 100 KB (SVG or WebP).
- **AI disclosure (GR2-10):** caption “Illustrative care scene” on every generated still/loop, plus a footer line: “Some images on this site are AI-generated illustrations; our caregivers are real people.”

## SEO/AEO plan (from the G1 blueprint) — added by GR2-2

- Sitemap and page types: `brief.md` §Sitemap (15 URLs). Money pages: `/services/{slug}` × 9, `/care-questions`, `/`.
- Schema: `LocalBusiness` (stable `@id`, NAP identical to the footer, hours, founder, `hasOfferCatalog`), `geo` + `areaServed` + `sameAs` after GR1-2; `Service` + `BreadcrumbList` on service pages; `FAQPage` only where FAQs are visible. All JSON-LD in the first HTML response. Logo `@id` URLs on the production host.
- Answer capsules: every service page gets a question H2 (“What does respite care include?”) with a 40–60 word answer in the first two sentences, plus two FAQ H3s with 40–60 word answers. Care Questions is the pattern.
- Entity/NAP: identical on site, JSON-LD, GBP and `llms.txt`.
- Ship files: production `robots.txt` allows retrieval AI bots; previews noindex; sitemap and canonical on `www.astonishingtouchhealthcare.org`; `llms.txt` with nonmedical cautions; IndexNow on deploy.
- Teardown + keywords: pending (brief §G1 evidence).

## A11y & SEO chrome (spec-level)

- `lang="en"`, skip link to `#main`, header/main/footer landmarks, visible focus rings (`--ring: #007f88`).
- One H1 per page. Alt text on editorial images; the Ask Brittany launcher image may use empty alt if the control has a name.
- Favicon and `apple-touch-icon` are required (this build 404s `/favicon.ico`).
- Light theme only for the public site. Do not activate the leftover dark tokens.

## Conflicts log

| Conflict | Ruling |
|---|---|
| Georgia vs. “never system Times/Georgia for a premium face” | **Reversed in v3.4 (GR2-1):** system-font headings fail `verify --type` and the two-family rule. Use the picker’s Erode + Satoshi unless Chuma overrides at G3. |
| Satoshi loaded but body is Arial | Resolved: Satoshi 400/700 is the body + UI face. |
| Frosted pills vs. glass ban | Allowed at this opacity; banned on type and large surfaces. |
| shadcn default theme in the CSS | Purge. Client tokens only. |
| Next.js vs. the skill’s single-file / proposed Astro path | The shipped site is Next.js on Vercel. The multi-page path must accept Next.js or Astro, not Astro only. |
