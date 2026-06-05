---

## name: design-taste-frontend description: "SA-enhanced anti-slop frontend skill for landing pages, portfolios, redesigns, and Space Age cinematic production sites. Combines the original taste-skill, brutalist-skill, minimalist-skill, and stitch-skill into a unified system. Reads the brief first, infers the design direction, and ships interfaces that do not look templated. Adds Space Age extensions: VL-01 Dark Glassmorphism enforcement, moodboard A–HH aesthetic routing, Liquid Glass approximation spec, cinematic bento architecture, and direct handoff to ui-ux-designer and cinematic-website-builder. Never defaults to: Inter, AI-purple gradient, centered hero, three equal cards, glassmorphism everywhere, or beige+brass+espresso. Trigger on: any landing page, portfolio, hero section, redesign, product page, or request to 'make it look premium'."

# Design Taste Frontend — SA-Enhanced Edition

## SCOPE

Landing pages, portfolios, redesigns, Space Age cinematic production sites, VL-01 dashboards, brutalist editorial UIs, minimalist editorial UIs. NOT: dashboards with dense data tables, multi-step wizards, native mobile app UI.

---

## STEP 0: BRIEF INFERENCE (READ THE ROOM FIRST)

Before any code or dial-setting, **infer what the user actually wants**.

### 0.A Read These Signals

1. **Page kind** — landing (SaaS / consumer / agency / event), portfolio (dev / designer), redesign, editorial/blog, Space Age cinematic site  
2. **Vibe words** — "minimalist", "cinematic", "brutalist", "glassmorphism", "VL-01", "Awwwards", "dark tech", "premium consumer", "Apple-y", "editorial"  
3. **Reference signals** — URLs, screenshots, brands named  
4. **Audience** — B2B procurement, design-conscious consumer, recruiter, Space Age client prospect  
5. **Brand assets** — logo, color, type already locked. For redesigns, these are starting material.  
6. **SA Moodboard signal** — if any moodboard letter is mentioned (A, D, FF, HH, etc.) → route to `ui-ux-designer` moodboard system first

### 0.B Declare Design Read Before Any Code

One line: **"Reading this as: \<page kind\> for \<audience\>, with a \<vibe\>, leaning toward \<aesthetic family\>."**

Examples:

- *"Reading this as: Space Age cinematic landing for local business prospects, OLED dark, Moodboard A, leaning toward VL-01 glassmorphism \+ GSAP."*  
- *"Reading this as: DTC apparel portfolio for creative directors, cold luxury palette, Moodboard HH, editorial bento architecture."*  
- *"Reading this as: brutalist editorial site for tech founders, Swiss industrial, Moodboard G, monospace-dominant."*

### 0.C If Ambiguous, Ask ONE Question

Never a multi-question dump. Example: *"Should this feel closer to VL-01 cinematic dark or brutalist editorial?"*

### 0.D Anti-Default Discipline

Never default to:

- AI-purple gradients  
- Centered hero over dark mesh  
- Three equal feature cards  
- Generic glassmorphism on everything  
- Infinite-loop micro-animations everywhere  
- Inter \+ slate-900  
- Beige \+ brass \+ espresso for premium-consumer briefs  
- Fraunces or Instrument\_Serif as default display serifs

---

## AESTHETIC ROUTING TABLE

Map brief signals to aesthetic system:

| Signal | Aesthetic Family | SA Moodboard |
| :---- | :---- | :---- |
| "dark", "OLED", "Space Age", "cinematic", "premium" | VL-01 Dark Glassmorphism | A, D |
| "iridescent", "holographic", "rainbow", "soap glass" | Liquid Glass / Iridescent Editorial | D, FF |
| "brutalist", "mechanical", "Swiss", "terminal" | Industrial Brutalism | G |
| "minimalist", "editorial", "clean", "document" | Premium Utilitarian Minimalism | B, C |
| "e-commerce", "DTC", "product", "luxury retail" | Commercial Hero / Digital Product | HH |
| "agency", "Awwwards", "experimental", "portfolio" | Agency Kinetic | E, F |
| "glassmorphism", "frosted", "Apple-style" | Liquid Glass Approximation | D |
| "landing", "SaaS", "marketing" | Modern SaaS Dark or Light | A, B |

**If a moodboard letter is mentioned** → load `ui-ux-designer` skill for full moodboard spec before building.

---

## THE THREE DIALS

After design read, set dials. All layout, motion, and density decisions are gated by these.

- **`DESIGN_VARIANCE: 8`** — 1 \= Perfect Symmetry, 10 \= Artsy Chaos  
- **`MOTION_INTENSITY: 6`** — 1 \= Static, 10 \= Cinematic / Physics  
- **`VISUAL_DENSITY: 4`** — 1 \= Art Gallery / Airy, 10 \= Cockpit / Packed

**Baseline:** 8 / 6 / 4\. Override via design read.

### Dial Inference

| Signal | VARIANCE | MOTION | DENSITY |
| :---- | :---- | :---- | :---- |
| "minimalist / clean / editorial" | 5–6 | 3–4 | 2–3 |
| "premium consumer / Apple / luxury" | 7–8 | 5–7 | 3–4 |
| "agency / Awwwards / experimental" | 9–10 | 8–10 | 3–4 |
| **"Space Age / cinematic / VL-01"** | **8–9** | **7–9** | **4–6** |
| **"brutalist / Swiss / mechanical"** | **7–8** | **3–5** | **7–9** |
| "trust-first / public-sector" | 3–4 | 2–3 | 4–5 |
| "redesign – preserve" | match | match+1 | match |

---

## SPACE AGE AESTHETIC SYSTEMS

### VL-01 Dark Glassmorphism (Moodboard A, D)

**Mandatory when:** Space Age client site, Space Age dashboard, any `#050508` background request.

**Token lock:**

:root {

  \--bg-base: \#050508;           /\* NEVER pure \#000 \*/

  \--surface-1: rgba(255,255,255,0.03);

  \--surface-2: rgba(255,255,255,0.06);

  \--border-subtle: rgba(255,255,255,0.07);

  \--border-medium: rgba(255,255,255,0.12);

  \--accent-orange: \#FF6B00;

  \--accent-lime: \#A8FF3E;

  \--text-primary: rgba(255,255,255,0.92);

  \--text-secondary: rgba(255,255,255,0.55);

  \--shadow-sm: 0 2px 8px rgba(0,0,0,0.4);

  \--shadow-md: 0 8px 32px rgba(0,0,0,0.6);

  \--shadow-lg: 0 24px 64px rgba(0,0,0,0.8);

}

**Glass panel spec:**

.glass-panel {

  background: var(--surface-1);

  border: 1px solid var(--border-subtle);

  backdrop-filter: blur(40px) saturate(180%);

  \-webkit-backdrop-filter: blur(40px) saturate(180%);

  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.12);

  border-radius: 16px;

}

**Fonts (LOCKED — never change for VL-01):**

- Headers: `Orbitron` via Fontsource CDN only (`@fontsource/orbitron`)  
- Body: `DM Sans` via Fontsource CDN only (`@fontsource/dm-sans`)  
- Data/Labels: `JetBrains Mono` via Fontsource CDN only (`@fontsource/jetbrains-mono`)  
- **NEVER use Google Fonts CDN or Bunny CDN**

### Liquid Glass / Iridescent (Moodboard D, FF)

WYSIWYG Eyewear brand voice. Rainbow gradient cursive typography locked.

**Web approximation (label in comments — NOT official Apple Liquid Glass):**

.liquid-glass-approx {

  position: relative;

  isolation: isolate;

  border-radius: 999px;

  border: 1px solid rgba(255,255,255,0.32);

  background: linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.08)),

              rgba(255,255,255,0.12);

  backdrop-filter: blur(24px) saturate(180%) contrast(1.05);

  \-webkit-backdrop-filter: blur(24px) saturate(180%) contrast(1.05);

  box-shadow: inset 0 1px 0 rgba(255,255,255,0.48),

              inset 0 \-1px 0 rgba(255,255,255,0.12),

              0 18px 60px rgba(0,0,0,0.18);

}

.liquid-glass-approx::before {

  content: "";

  position: absolute;

  inset: 0;

  border-radius: inherit;

  background: radial-gradient(circle at 20% 0%, rgba(255,255,255,0.55), transparent 34%),

              linear-gradient(90deg, rgba(255,255,255,0.18), transparent 42%, rgba(255,255,255,0.14));

  pointer-events: none;

}

@media (prefers-reduced-transparency: reduce) {

  .liquid-glass-approx { background: rgba(255,255,255,0.96); backdrop-filter: none; }

}

**Iridescent gradient text (WYSIWYG brand):**

.iridescent-text {

  background: linear-gradient(135deg, \#ff0080, \#ff8c00, \#40e0d0, \#8a2be2, \#ff0080);

  background-size: 300% 300%;

  \-webkit-background-clip: text;

  \-webkit-text-fill-color: transparent;

  background-clip: text;

  animation: shimmer 4s ease-in-out infinite;

}

@keyframes shimmer {

  0%, 100% { background-position: 0% 50%; }

  50% { background-position: 100% 50%; }

}

### Industrial Brutalism (Moodboard G)

Swiss Industrial Print \+ Tactical Telemetry.

**Pick ONE substrate per project. Never mix light and dark substrates.**

**Swiss Industrial (Light):**

- Background: `#F4F4F0` or `#EAE8E3`  
- Foreground: `#050505`  
- Accent: `#E61919` ONLY — no other accent colors  
- All corners: `border-radius: 0` — absolute requirement  
- Grid: CSS Grid with `gap: 1px` on contrasting parent to create mathematical dividing lines

**Tactical Telemetry (Dark):**

- Background: `#0A0A0A` (never `#000000`)  
- Foreground: `#EAEAEA`  
- Accent: `#E61919` ONLY  
- Terminal green `#4AF626` maximum ONE element only

**Type tokens (Brutalism):**

- Macro headers: Neue Haas Grotesk Black, Archivo Black, or Monument Extended — `clamp(4rem, 10vw, 15rem)`, `letter-spacing: -0.05em`, `line-height: 0.9`, uppercase  
- Data/telemetry: JetBrains Mono, IBM Plex Mono, VT323 — `10–14px`, `letter-spacing: 0.08em`, uppercase  
- NO border-radius. NO gradients. NO glassmorphism. NO drop shadows with soft radius.

**ASCII framing vocabulary:**

\[ DELIVERY SYSTEMS \]   \< RE-IND \>   \>\>\> LOADING   /// CLASSIFIED

REV 2.6   UNIT / D-01   SECTOR: 04   ──────────────────────

**CRT scanline overlay (Tactical mode):**

.crt-overlay {

  position: fixed;

  inset: 0;

  pointer-events: none;

  z-index: 9999;

  background: repeating-linear-gradient(

    0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px

  );

}

### Premium Utilitarian Minimalism (Moodboard B, C)

Document-style workspace interfaces (Notion-ish, Linear-ish).

**Palette:**

- Canvas: `#FFFFFF` or `#F7F6F3`  
- Borders: `#EAEAEA` or `rgba(0,0,0,0.06)`  
- Text: `#111111` (never `#000000`), secondary `#787774`  
- Accents: Desaturated pastels only (Pale Red `#FDEBEC`, Pale Blue `#E1F3FE`, Pale Green `#EDF3EC`, Pale Yellow `#FBF3DB`)

**Type:** Geist, Switzer, or Satoshi for sans. NOT Inter as default. NOT Fraunces.

**Component rules:**

- Cards: `border: 1px solid #EAEAEA`, `border-radius: 8–12px`, generous padding 24–40px  
- Buttons: `#111111` bg, `#FFFFFF` text, `border-radius: 4–6px`, NO box-shadow  
- NO pill containers for cards. NO heavy drop shadows. NO gradients.

---

## TYPOGRAPHY SYSTEM

### Font Decision Tree

Brief type → Font choice:

VL-01 / Space Age → Orbitron (headers) \+ DM Sans (body) \+ JetBrains Mono (data)

Brutalist → Archivo Black / Monument Extended \+ IBM Plex Mono

Minimalist editorial → Geist / Satoshi \+ Geist Mono

Agency / portfolio → Cabinet Grotesk / PP Neue Montreal \+ custom pairing

Premium consumer → Satoshi / Outfit \+ appropriate mono

SaaS → Geist \+ Geist Mono

### Banned Fonts (Default Context)

- **Inter** — Too generic. Override only if user explicitly requests "Linear-style neutral feel"  
- **Fraunces** — LLM's default display serif. Banned.  
- **Instrument\_Serif** — LLM's second default display serif. Banned.  
- **Times New Roman / Georgia** — Never as display.

### Serif Discipline

Serif is STRONGLY DISCOURAGED as default. Only acceptable when:

1. Brief explicitly names a serif font, OR  
2. Aesthetic is genuinely editorial / luxury / publication AND you can articulate why

If serif is justified, rotate from: PP Editorial New, GT Sectra Display, Tiempos Headline, Recoleta, IvyPresto, Canela, Tobias, Söhne Breit Kursiv.

### Italic Descender Clearance (Mandatory)

When italic used in display and word contains `y g j p q`: use `leading-[1.1]` minimum \+ `pb-1` on wrapper.

---

## COLOR SYSTEM

### The SA Orange Rule

`#FF6B00` is the Space Age primary accent. When building for Space Age brand: lock it. No substitution.

### The Lila Rule

AI-purple/blue glow aesthetic is BANNED as default. No purple button glows, no random neon gradients. Override only when brief explicitly asks for purple.

### Premium-Consumer Palette Ban (Critical)

For premium-consumer briefs (cookware, wellness, artisan, luxury, DTC home), the LLM default is beige+brass+espresso. **BANNED.**

Banned hex families:

- Backgrounds: `#f5f1ea`, `#fbf8f1`, `#efeae0`, `#e8dfcb` (all "warm paper/cream")  
- Accents: `#b08947`, `#b6553a`, `#9a2436`, `#bc7c3a` (all "brass/clay/oxblood")

**Default alternatives (rotate):**

- Cold Luxury: silver-grey \+ chrome \+ smoke  
- Forest: deep green \+ bone \+ amber  
- Black and Tan: true off-black \+ warm tan, sharp contrast  
- Cobalt \+ Cream: saturated blue \+ single neutral  
- Pure monochrome \+ one saturated pop

### Color Consistency Lock (Mandatory)

One accent color, used identically across ALL sections. Warm-grey site doesn't get a blue CTA in section 7\.

---

## LAYOUT ARCHITECTURE

### Anti-Center Bias

Centered hero avoided when `DESIGN_VARIANCE > 4`. Force:

- Split Screen 50/50  
- Left-aligned content / right-aligned asset  
- Asymmetric whitespace  
- Scroll-pinned structures

### Hero Discipline

- **Fits viewport**: Headline ≤ 2 lines desktop, subtext ≤ 20 words AND ≤ 4 lines, CTAs visible without scroll  
- **Max 4 text elements**: eyebrow OR brand strip, headline, subtext, CTAs — no tagline below CTAs  
- **Top padding cap**: `pt-24` max at desktop  
- **Font scale**: plan with asset size. 4-line hero \= font-size error, not copy length error.  
- Use `min-h-[100dvh]` NEVER `h-screen`

### Bento Grid Rules

- EXACTLY as many cells as content items — no empty cells  
- At least 2–3 cells need real visual variation (image, gradient, pattern)  
- No 6 white-on-white text cards in a row

### Layout Repetition Bans

- Max 2 consecutive sections with image+text-split zigzag (3rd \= Pre-Flight Fail)  
- No two sections sharing same layout family across 8-section page (min 4 different families)  
- No split-header (left big headline \+ right small explainer) as section header — stack vertically instead

### Eyebrow Restraint (Critical — Most Violated)

- Max 1 eyebrow per 3 sections. Hero counts as 1\.  
- Count `uppercase tracking` instances before shipping. Fail if count \> `ceil(sectionCount / 3)`.  
- Default: drop the eyebrow. The headline alone is enough.

---

## STACK & ARCHITECTURE

### Default

- Framework: React/Next.js, Server Components default  
- Styling: Tailwind v4 (`@tailwindcss/postcss`, not `tailwindcss` postcss plugin)  
- Animation: Motion (`import { motion } from "motion/react"`)  
- Fonts: Fontsource CDN only (`@fontsource/font-name`) — NEVER Google Fonts `<link>` in production  
- Icons: Phosphor, HugeIcons, Radix, Tabler (in priority order). NOT Lucide by default. NEVER hand-roll SVG paths.

### State Rules

- `useMotionValue` / `useTransform` for continuous mouse/scroll values — NEVER `useState` for these  
- Server Components for static layouts, isolated `"use client"` leaves for all motion

### Image Strategy

1. Image-gen tool (if available) — generate at right aspect ratio  
2. Picsum with descriptive seed: `https://picsum.photos/seed/space-age-hero-city/1600/900`  
3. Explicit labeled placeholder slots — NEVER div-based fake screenshots

---

## AI TELLS — COMPLETE BAN LIST

### Visual

- NO neon outer glows (only inner borders or tinted shadows)  
- NO pure `#000000` — off-black, zinc-950, or charcoal  
- NO oversaturated accents  
- NO excessive gradient text on large headers (exception: WYSIWYG iridescent brand)  
- NO custom mouse cursors (Module 10 cursor systems from cinematic-website-builder are the exception)

### Typography

- NO Inter as default  
- NO Fraunces or Instrument\_Serif  
- NO oversized H1s that only scream without hierarchy  
- NO em-dash `—` anywhere. ZERO. Headlines, eyebrows, body, attribution, buttons, captions. Use `-` or restructure. This is non-negotiable.  
- NO en-dash `–` as separator. Use `-` for ranges.

### Layout

- NO three-column equal feature cards  
- NO 3+ consecutive zigzag sections  
- NO eyebrow above every section  
- NO split-header (left headline \+ right floating explainer) by default  
- NO "Used by" logo wall inside the hero — goes BELOW  
- NO text-only logos in trust strips — use Simple Icons SVGs (`https://cdn.simpleicons.org/{slug}/ffffff`)  
- NO scroll cues (`Scroll`, `↓`, animated mouse wheel)  
- NO section-number eyebrows (`001 · Capabilities`)  
- NO decoration text strip at hero bottom (`BRAND. MOTION. SPATIAL.`)  
- NO locale/city/time/weather strips unless brief is genuinely place-focused  
- NO pills/labels overlaid on images  
- NO version footers on marketing pages

### Content

- NO "John Doe" / "Jane Doe" / "Acme Corp" — realistic contextual names  
- NO fake-precise numbers without justification  
- NO filler verbs: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize"  
- NO AI-invented cute copy — plain functional sentences over "elegant nothing" phrases  
- NO duplicate CTA intent on same page  
- NO quotes longer than 3 lines  
- NO generic startup brand names ("Nexus", "SmartFlow", "Cloudly")

---

## DESIGN SYSTEM ROUTING

When brief reads as an established system, install and use the **official package**:

| Brief | System | Install |
| :---- | :---- | :---- |
| Microsoft/enterprise SaaS | `@fluentui/react-components` | `npm i @fluentui/react-components` |
| Material-flavored | `@material/web` | `npm i @material/web` |
| IBM-style B2B | `@carbon/react @carbon/styles` | `npm i @carbon/react @carbon/styles` |
| Shopify app surfaces | Polaris React | (per Shopify docs) |
| GitHub-style devtool | `@primer/css` | `npm i @primer/css` |
| UK public-sector | `govuk-frontend` | `npm i govuk-frontend` |
| Modern React foundation | `@radix-ui/themes` | `npm i @radix-ui/themes` |
| Modern SaaS (you own code) | `shadcn/ui` | `npx shadcn@latest init` |
| Tailwind-based default | Tailwind v4 | `npm i tailwindcss @tailwindcss/postcss` |

**One system per project. Never mix.** Never use a system's tokens but override 90% of them.

---

## REDESIGN PROTOCOL

### Detect Mode First

- **Greenfield** — no existing site, full overhaul approved  
- **Redesign \- Preserve** — modernize without breaking brand  
- **Redesign \- Overhaul** — new visual language, preserve content

### Modernization Levers (Apply in Order)

1. Typography refresh — biggest lift per unit of risk  
2. Spacing & rhythm  
3. Color recalibration  
4. Motion layer  
5. Hero & key-section recomposition  
6. Full block replacement (only if unsalvageable)

### Never Change Without Explicit Approval

- URL structure / route slugs  
- Primary nav labels  
- Form field names (breaks analytics \+ autofill)  
- Brand logo or wordmark  
- Legal / consent / cookie copy

---

## PRE-FLIGHT CHECK (MANDATORY — RUN EVERY BOX)

- [ ] Design Read declared (one-liner)?  
- [ ] Dial values explicit and reasoned?  
- [ ] ZERO em-dashes (`—`) anywhere on page?  
- [ ] Page theme lock: ONE theme, no section flips?  
- [ ] Color Consistency Lock: one accent used identically everywhere?  
- [ ] Shape Consistency Lock: one corner-radius system?  
- [ ] Fonts: Fontsource CDN only (no Google Fonts `<link>`)?  
- [ ] VL-01 enforcement: Orbitron \+ DM Sans \+ JetBrains Mono locked if Space Age?  
- [ ] No Inter, Fraunces, Instrument\_Serif as default?  
- [ ] No beige+brass+espresso for premium-consumer?  
- [ ] Hero fits viewport: ≤2 lines headline, ≤20 words subtext, CTA visible?  
- [ ] Hero max 4 text elements, no tagline below CTAs?  
- [ ] Hero top padding ≤ `pt-24`?  
- [ ] Eyebrow count ≤ `ceil(sectionCount / 3)`?  
- [ ] No split-header (left headline \+ right floating explainer)?  
- [ ] No 3+ consecutive zigzag sections?  
- [ ] No duplicate CTA intent?  
- [ ] Logo wall uses SVG logos, lives UNDER hero?  
- [ ] Bento cells \= content item count, ≥2–3 cells with visual variation?  
- [ ] No div-based fake screenshots?  
- [ ] No hand-rolled decorative SVGs?  
- [ ] Real images used (gen-tool → picsum-seed → labeled placeholder)?  
- [ ] Navigation single line desktop, height ≤80px?  
- [ ] `min-h-[100dvh]` never `h-screen`?  
- [ ] Button contrast WCAG AA (4.5:1)?  
- [ ] CTA labels fit one line at desktop?  
- [ ] Form contrast WCAG AA?  
- [ ] All motion guards for `prefers-reduced-motion`?  
- [ ] Motion motivated (can justify each animation in one sentence)?  
- [ ] No `window.addEventListener("scroll")`?  
- [ ] No `useState` for mouse position / scroll progress?  
- [ ] useEffect animations have cleanup functions?  
- [ ] Dark mode tokens defined and tested in both modes?  
- [ ] Copy self-audit: no broken grammar, no AI hallucination phrases, no filler verbs?  
- [ ] Italic descender clearance on words with `y g j p q`?  
- [ ] No locale/city/time strips unless brief demands it?  
- [ ] No scroll cues?  
- [ ] No section-number eyebrows?  
- [ ] No version footers on marketing pages?  
- [ ] No pills/labels overlaid on images?  
- [ ] No photo-credit captions as decoration?  
- [ ] Quotes ≤3 lines, attribution has name \+ role?  
- [ ] Core Web Vitals plausible (LCP \<2.5s, INP \<200ms, CLS \<0.1)?

If ANY box fails, output is not done.

---

## HANDOFF ROUTING

| Situation | Route To |
| :---- | :---- |
| Need layout direction before coding | `ui-ux-designer` |
| Moodboard letter mentioned | `ui-ux-designer` → moodboard system |
| Want quick layout variations | `google-stitch` |
| Full cinematic single-file HTML site | `cinematic-website-builder` |
| Shopify theme/section | `shopify-cinematic-builder` |
| Motion audit or complex scroll choreography | `design-motion-principles` |
| Client URL provided for brand extraction | `brand-extractor` first |
| Existing site redesign | `page-upgrade` |

