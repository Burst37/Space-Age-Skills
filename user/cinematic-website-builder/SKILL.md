---
name: cinematic-website-builder
description: >
  Build cinematic, production-grade websites using 30 scroll, cursor, click, and ambient effect
  modules. Use when the user asks to build a landing page, website, hero section, portfolio,
  product page, or any web experience that should feel premium, dynamic, or visually
  extraordinary. All output is single-file HTML — no frameworks, no build step. GSAP +
  ScrollTrigger via CDN only. This skill is the PRODUCTION LAYER of a three-skill pipeline —
  it receives a Handoff Package from UI/UX Designer and/or a Build Brief from Google Stitch.
  If the user hasn't gone through those skills yet and the design direction is unclear, trigger
  ui-ux-designer first.
---

# CINEMATIC WEBSITE BUILDER SKILL
## Space Age AI Solutions — Production Web Experience Layer

This skill is the **final stage** of the three-skill website pipeline. It takes a locked design direction and produces the real, animated, production-grade single-file HTML. Never skip to this skill without knowing the moodboard, color system, font stack, and section structure — if those are unclear, load ui-ux-designer first.

---

## THE THREE-SKILL PIPELINE (READ THIS FIRST)

```
╔══════════════════╗     ╔══════════════════╗     ╔══════════════════════════╗
║  UI/UX DESIGNER  ║ ──► ║  GOOGLE STITCH   ║ ──► ║  CINEMATIC WEBSITE       ║
║                  ║     ║                  ║     ║  BUILDER  ← YOU ARE HERE ║
║  • Brand audit   ║     ║  • Rapid layout  ║     ║                          ║
║  • Moodboard A–N ║     ║    ideation      ║     ║  • 30 effect modules     ║
║  • Design system ║     ║  • Screen protos ║     ║  • GSAP animations       ║
║  • User flow map ║     ║  • Variation set ║     ║  • Single-file HTML      ║
║  • Handoff pkg   ║     ║  • Build brief   ║     ║  • Production delivery   ║
╚══════════════════╝     ╚══════════════════╝     ╚══════════════════════════╝
```

### When to call other skills:
- **User says "I don't know what I want"** → Load `ui-ux-designer` first
- **User wants to SEE layout options** → Load `google-stitch` after UI/UX
- **Design + layout is locked** → Build directly in this skill

### If arriving with a Handoff Package, read these fields:
```yaml
# From UI/UX Designer:
handoff_package.brand_personality.moodboard    → apply as visual language
handoff_package.design_system                  → set CSS variables
handoff_package.modules_selected               → use these modules
handoff_package.user_flow                      → build these sections

# From Google Stitch:
website_build_brief.stitch_variation_chosen    → reference the layout
website_build_brief.sections[].layout_notes    → honor Stitch decisions
website_build_brief.sections[].modules         → confirmed module assignments
```

---

## BEFORE YOU CODE — MANDATORY DIRECTION PHASE

Answer these before writing a single line:

1. **Has a Handoff Package or Build Brief arrived?** If YES — skip to the package. If NO — run these 5 questions:
2. **What is the brand's personality?** (Dark/luxury? Clean/tech? Organic/human? Aggressive/edgy?)
3. **What is the #1 feeling on first load?** (Awe? Trust? Excitement? Intrigue?)
4. **What are the 3-5 modules that serve this feeling best?** (Pick from the 30 below)
5. **What is the scroll story?** (Map out: Hero → Problem → Solution → Proof → CTA)
6. **What stays in memory?** (One effect should be so good users mention it)

**Never use more than 6-8 modules per page. Restraint is cinematic. Pile-on is noise.**

### Moodboard Quick Reference (from UI/UX Designer skill):
| Letter | Aesthetic | Primary Use |
|--------|-----------|-------------|
| A | Space Age Dark Data-Viz | LoyaltyBot, dashboards |
| B | Hardware Console | Developer tools |
| C | 3D Clay | Consumer apps |
| D | Liquid Glass | Music, luxury |
| E | Exploded Diagram | Tech hardware |
| F | Urban Street/Hip-Hop | Record Exec, music |
| G | Forest/Organic | Terra Root, wellness |
| H | Fashion Editorial | Portfolio, luxury brands |
| I | Brutalist | Art, anti-establishment |
| J | Cinematic Film | Film projects, portfolios |
| K | Neon Cyberpunk | Gaming, nightlife |
| L | Silicon Valley Clean | SaaS, B2B |
| M | Maximalist Luxury | Space Age Credit |
| N | Retro Futurist | Space Age AI brand |

---

## TECH STACK (ALWAYS USE THESE CDNs)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=FONT_A&family=FONT_B&display=swap" rel="stylesheet">
```

Always register ScrollTrigger: `gsap.registerPlugin(ScrollTrigger);`

---

## THE 30 MODULES

### SCROLL-DRIVEN (01–09)

**01 — TEXT MASK REVEAL** | Scroll-Driven | Hero headlines, section titles, manifesto text
Headline fills with bright/gradient color from left to right as you scroll — like live highlighting.

**02 — STICKY STACK NARRATIVE** | Scroll-Driven | Product feature walkthroughs, service explanations
Product image pins left. Feature cards scroll past on the right while the image stays locked.

**03 — LAYERED ZOOM PARALLAX** | Scroll-Driven | Hero sections, dramatic openings
Multiple layers move at different scroll speeds creating a 3D depth illusion.

**04 — HORIZONTAL SCROLL HIJACK** | Scroll-Driven | Portfolios, galleries, timelines
Vertical scroll intercepted and converted to horizontal panel movement.

**05 — STICKY CARD STACK** | Scroll-Driven | Testimonials, process steps, pricing tiers
Cards pin and stack one by one like a physical card deck building up. Pure CSS — no JS.

**06 — SCROLL SVG DRAW** | Scroll-Driven | Diagrams, process flows, decorative dividers
SVG paths draw themselves via `stroke-dashoffset` animation as you scroll.

**07 — CURTAIN REVEAL** | Scroll-Driven | Hero sections, dramatic content reveals
Two panels slide apart like stage curtains on scroll, revealing what's underneath.

**08 — SPLIT SCREEN SCROLL** | Scroll-Driven | Before/after, compare/contrast, dual brand stories
Left half and right half scroll in opposite directions simultaneously.

**09 — SCROLL COLOR SHIFT** | Scroll-Driven | Multi-section storytelling, mood progression
Background smoothly transitions through a color sequence as you scroll between sections.

### CURSOR & HOVER (10–17)

**10 — CURSOR REACTIVE** | Cursor & Hover | Premium brands, portfolios, any hero
Custom cursor with smooth lag follow, 3D tilt on hover, magnetic button pull, ripple clicks.

**11 — ACCORDION SLIDER** | Cursor & Hover | Team sections, services, image galleries
Strips expand on hover to reveal content while others contract. Pure CSS transitions.

**12 — CURSOR IMAGE REVEAL / BEFORE-AFTER** | Cursor & Hover | Portfolio, before/after showcases
Wipe divider tracks mouse X position — left shows before, right shows after.

**13 — HOVER IMAGE TRAIL** | Cursor & Hover | Creative agencies, portfolios, luxury brands
Images appear and fade at cursor position leaving a ghost trail of visuals.

**14 — 3D FLIP CARDS** | Cursor & Hover | Team bios, service features, product specs
Cards rotate 180° on Y axis on hover to reveal a back face.

**15 — MAGNETIC REPEL GRID** | Cursor & Hover | Skills grids, logo walls, navigation menus
Grid tiles push away as cursor approaches with spring physics snap-back.

**16 — SPOTLIGHT BORDER CARDS** | Cursor & Hover | Feature cards, pricing, testimonials
Gradient border glow follows cursor position like a spotlight. Popular SaaS effect.

**17 — DRAG-TO-PAN GRID** | Cursor & Hover | Project galleries, infinite canvases, mood boards
Larger-than-viewport grid. Click-drag to pan with inertia momentum after release.

### CLICK & TAP (18–23)

**18 — VIEW TRANSITION MORPHING** | Click & Tap | Product detail reveals, page-like state changes
Clicking a card smoothly morphs/expands it to fill screen via View Transitions API.

**19 — PARTICLE EXPLOSION BUTTON** | Click & Tap | Primary CTAs, form submits, purchase buttons
Burst of colored particles on click — makes CTAs feel rewarding to interact with.

**20 — ODOMETER COUNTER** | Click & Tap | Stats sections, social proof, metrics dashboards
Numbers scroll through digit wheels (like an odometer) when scrolled into view.

**21 — 3D COVERFLOW CAROUSEL** | Click & Tap | Testimonials, featured products, portfolio pieces
Center item large and front-facing, side items angled in 3D and dimmed.

**22 — DYNAMIC ISLAND NAV** | Click & Tap | Minimal navigation, notification UI, modern nav bars
Pill-shaped nav bar that morphs — expands for menu, contracts for notifications.

**23 — macOS DOCK NAV** | Click & Tap | App-style navigation, tool palettes, bottom nav
Icons magnify on hover with spring physics exactly like macOS Dock.

### AMBIENT & AUTO (24–30)

**24 — TEXT SCRAMBLE DECODE** | Ambient & Auto | Hero headlines, loading states, tech brands
Text displays as random characters cycling rapidly, then resolves into readable words.

**25 — KINETIC MARQUEE** | Ambient & Auto | Client logos, skill lists, social proof banners
Infinite scrolling text band that speeds up reactively when the user scrolls fast.

**26 — MESH GRADIENT BACKGROUND** | Ambient & Auto | Hero backgrounds, section backgrounds
Animated organic color blobs that morph and drift — a living gradient that never repeats.

**27 — CIRCULAR TEXT PATH** | Ambient & Auto | Decorative badges, rotating labels, logo embellishments
Text follows a circular arc and slowly rotates. "Available for work •" badge style.

**28 — GLITCH EFFECT** | Ambient & Auto | Tech brands, gaming, bold attention-grabbers
Text or images periodically glitch — RGB channels split, slices shift, scanlines flicker.

**29 — TYPEWRITER EFFECT** | Ambient & Auto | Subheadings, rotating value props, taglines
Text types character by character with blinking cursor. Loops through multiple phrases.

**30 — GRADIENT STROKE TEXT** | Ambient & Auto | Display headlines, section dividers, logo text
Large outlined text where only the animated gradient stroke is visible — hollow text.

---

## COMPOSITION RULES

### Module assignments by page type:

**Landing Page (SaaS/Agency):**
- Hero: 07 (Curtain) + 24 (Scramble) + 10 (Cursor)
- Features: 02 (Sticky Stack) or 16 (Spotlight Cards)
- Social Proof: 20 (Odometer) + 25 (Marquee)
- CTA: 19 (Particle Button)
- Footer: 27 (Circle Text) + 29 (Typewriter)

**Portfolio:**
- Hero: 03 (Parallax) + 30 (Stroke Text)
- Gallery: 04 (Horizontal Hijack) or 13 (Image Trail)
- Projects: 17 (Drag Grid) or 18 (Morphing)
- Skills: 15 (Repel Grid) + 20 (Odometer)

**Product Page:**
- Hero: 01 (Text Mask) + 26 (Mesh Gradient)
- Features: 05 (Card Stack) + 11 (Accordion)
- Specs: 14 (Flip Cards)
- Purchase CTA: 19 (Particle Button) + 22 (Island Nav)

**Storytelling/Brand:**
- Opening: 07 (Curtain) or 08 (Split Screen)
- Narrative: 09 (Color Shift) + 06 (SVG Draw)
- Pull Quote: 28 (Glitch) or 24 (Scramble)
- Closing: 01 (Text Mask) + 19 (Particle CTA)

---

## OUTPUT STANDARDS

Every output HTML file must include:
1. `<!DOCTYPE html>` with `lang="en"`
2. Mobile-responsive viewport meta tag
3. CSS custom properties at `:root` for all brand colors
4. All fonts from Google Fonts CDN
5. GSAP + ScrollTrigger from cdnjs CDN
6. `gsap.registerPlugin(ScrollTrigger)` before any animation
7. `html { scroll-behavior: smooth; }`
8. `prefers-reduced-motion` respected — wrap GSAP calls in media query check
9. No external dependencies beyond CDNs

---

## QUALITY CHECK BEFORE DELIVERING

- [ ] Does the page have ONE unforgettable moment?
- [ ] Are modules serving the content or showing off?
- [ ] Does it load fast? (No images over 500kb placeholder-wise)
- [ ] Does the cursor effect feel premium, not janky?
- [ ] Is the typography actually beautiful (not Arial/Roboto)?
- [ ] Does scroll feel smooth (scrub values tuned, not snappy)?
- [ ] Does it work on mobile? (Touch events, no cursor effects)

---

## PLAYWRIGHT QA INTEGRATION — AUTOMATED DELIVERY PROTOCOL

The 7-point manual checklist above is the minimum. The full delivery standard requires Playwright automation.
Load `playwright-browser-automation` skill and run this protocol before every client handoff.

### Pre-Flight: Start Dev Server
```bash
npx serve . -p 3000
# or
python -m http.server 3000
```

### QA Run — Automated (replaces manual checklist)

```
LOAD: playwright-browser-automation skill
SET:  PLAYWRIGHT_MCP_HEADLESS=false for first run (visual confirm), true for CI

DEVICE MATRIX — run all three:
  Desktop  → browser_resize({ width: 1440, height: 900 })
  Tablet   → browser_resize({ device: "iPad Pro 11" })
  Mobile   → browser_resize({ device: "iPhone 15" })

FOR EACH DEVICE:
  1. browser_navigate → http://localhost:3000/[file].html
  2. browser_screenshot → ./qa/[project]-[device]-initial-load.png

  SCROLL QA:
  3. browser_evaluate → document.documentElement.scrollHeight
  4-7. browser_scroll at 25% / 50% / 75% / 100% + screenshot each

  INTERACTION QA:
  8. Module 10/13/15 → browser_hover over trigger zones
     Module 05/16    → browser_hover each card
     Module 04/17    → browser_drag test
     Module 11       → browser_click each trigger
     Module 19       → browser_click → verify state change
     Module 29       → browser_wait_for 3s → screenshot
     Any form        → browser_type test data → browser_click submit

  TECHNICAL QA:
  9.  browser_console → capture all messages → flag errors
  10. browser_network_requests → flag any 4xx/5xx
  11. browser_evaluate → window.performance.timing → calculate LCP proxy
  12. browser_evaluate → getComputedStyle(document.body).fontFamily
      → verify correct font loaded (not system fallback)

PASS CRITERIA:
  ✅ Zero JS console errors
  ✅ Zero 404s / 500s on any asset or CDN request
  ✅ All scroll animations trigger at correct positions
  ✅ All hover/click interactions respond correctly
  ✅ Fonts loaded (not system-ui fallback)
  ✅ No layout breaks on mobile
  ✅ prefers-reduced-motion respected
  ✅ Custom cursor hidden on touch devices
  ✅ LCP proxy under 3s on Desktop

FAIL ACTIONS:
  - Console error → identify module, fix JS, re-run QA
  - 404 on asset → fix path or CDN URL, re-run
  - Animation not triggering → check ScrollTrigger start/end values, re-run
  - Font fallback → verify Google Fonts CDN link, re-run
  - Mobile overflow → inspect CSS, fix clamp/overflow, re-run
```

### QA Report — Auto-Generate After Run
Save as `./qa/[project-name]-delivery-qa.md`:

```markdown
# QA Report: [Project Name]
Date: [timestamp] | Tester: Playwright MCP | Version: [file version]

## Device Results
| Device | Load | Scroll | Interactions | Console | Network | Fonts | PASS/FAIL |
|---|---|---|---|---|---|---|---|
| Desktop 1440px | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| iPad Pro 11" | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| iPhone 15 | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | PASS |

## Modules Tested
| Module | Behavior | Status |
|---|---|---|
| [#] [Name] | [what was tested] | ✅ PASS / ❌ FAIL |

## Issues Found
| Severity | Description | Fix Applied |
|---|---|---|
| HIGH | [issue] | [fix] |

## Delivery Status
[ ] QA PASS — approved for client delivery
[ ] QA FAIL — issues require fix before delivery
```

---

## ASSET PIPELINE INTEGRATION

When building sites that require AI-generated images or videos, **do not build the site first**.

```
CORRECT ORDER:
  1. Lock design direction (UI/UX Designer + Google Stitch)
  2. Write assets-to-generate.md based on confirmed section list
  3. Run asset-automation skill → generate all assets via Higgsfield
  4. Run FFmpeg frame extraction if hero uses scroll-scrub (animated-website-pipeline skill)
  5. Drop assets into /public/assets/
  6. THEN build the HTML referencing real asset paths
  7. Run Playwright QA

WRONG ORDER (causes rework):
  ❌ Build site with placeholder images → swap assets later
  ❌ Use lorem images → real assets never match placeholder dimensions
  ❌ Reference assets before generation is confirmed complete
```

### Asset Path Convention
```html
<!-- Images -->
<img src="./assets/images/[project]-[section]-[descriptor].png"
     alt="[descriptive alt text]"
     loading="lazy"
     width="1920" height="1080">

<!-- Videos (hover / ambient) -->
<video src="./assets/videos/[project]-[section]-[descriptor].mp4"
       muted loop playsinline preload="metadata">

<!-- Scroll-scrub frames (canvas) -->
<!-- Frames named: hero-frame-0001.jpg → hero-frame-XXXX.jpg -->
<!-- Loaded via JS preloader, not <img> tags -->
```

### Module × Asset Type Matrix
| Module | Asset Type Needed | Generation Model |
|---|---|---|
| 03 Parallax | High-res hero image | NanoBanana 2 |
| 07 Curtain Reveal | Full-bleed image | NanoBanana 2 |
| 08 Split Screen | Two contrasting images | NanoBanana 2 × 2 |
| 09 Color Shift | Section background images | NanoBanana 2 |
| 12 Video Reveal | Short ambient video loop | Seedance 2.0 |
| 21 Scroll Scrub Video | Hero video (frame extraction) | Seedance 2.0 / Kling 3.0 |
| 16 Spotlight Cards | Product/feature images | NanoBanana 2 |
| 25 Marquee | Brand logos or thumbnails | NanoBanana 2 |

---

## FULL PIPELINE MAP (UPDATED)

```
╔══════════════════╗     ╔══════════════════╗     ╔══════════════════════════╗
║  UI/UX DESIGNER  ║ ──► ║  GOOGLE STITCH   ║ ──► ║  CINEMATIC WEBSITE       ║
║                  ║     ║                  ║     ║  BUILDER  ← YOU ARE HERE ║
╚══════════════════╝     ╚══════════════════╝     ╚══════════╤═══════════════╝
                                                             │
              ╔══════════════════════╗                       │ (runs in parallel
              ║  ASSET AUTOMATION    ║ ─────────────────────►║  with build phase)
              ║  + Higgsfield MCP    ║                       │
              ╚══════════════════════╝                       │
                                                             ▼
                                              ╔══════════════════════════╗
                                              ║  PLAYWRIGHT QA           ║
                                              ║  • 3-device matrix       ║
                                              ║  • Console/network check ║
                                              ║  • Interaction testing   ║
                                              ║  • QA report generated   ║
                                              ╚══════════════════════════╝
                                                             │
                                                             ▼
                                                   CLIENT DELIVERY ✅
```

**Skill load order for a full website project:**
1. `ui-ux-designer` → design direction
2. `google-stitch` → layout confirmed
3. `asset-automation` → assets generated (parallel)
4. `animated-website-pipeline` → if using Next.js + scroll scrub
5. `cinematic-website-builder` → HTML production ← THIS SKILL
6. `playwright-browser-automation` → QA + delivery validation
