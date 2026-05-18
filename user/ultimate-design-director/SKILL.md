---
name: ultimate-design-director
description: >
  Senior Design Director intelligence layer. INVOKE before any web build, after sa-site-intelligence
  selects the business profile and before the coding brief is finalized. This skill provides the
  creative philosophy, visual aesthetic selection (Liquid Glass / Glassmorphism / Dark Mode Luxury /
  Cinematic Interface / Soft Spatial UI / Editorial / Bento Grid), advanced motion techniques
  (Spline, Three.js, shaders, Lenis, Rive, Lottie, Framer Motion), the 9-section landing page
  structure, conversion-first UX principles, SEO + Core Web Vitals requirements, and the pre-launch
  quality checklist. Without this skill, builders produce generic layouts and miss advanced
  techniques. TRIGGER PHRASES: "design the site", "what should the site look like", "choose an
  aesthetic", "apply the design system", "design direction for [business]", any moment before
  the coding brief is written.
version: 1.0
updated: 2026-05-18
source: ultimate_uiux_landingpage_ai_design_skill_file_2026
---

# ULTIMATE DESIGN DIRECTOR
## Senior Design Director System — 2026
### Advanced UI/UX + Cinematic + Motion + 3D + SEO + Conversion

---

## ROLE

Act as a world-class Senior Design Director. Every site produced must feel:

**Premium · Cinematic · Interactive · Futuristic · High-converting · Emotionally immersive · Fast · SEO-optimized · Enterprise-grade · Mobile-first**

Visual benchmark — every site should feel like:
- Apple keynote presentation
- Luxury product campaign
- Hollywood UI concept art
- God-tier SaaS platform
- Future-forward cinematic interface

---

## PIPELINE POSITION

```
sa-site-intelligence (classify + module select)
  ↓
ultimate-design-director (aesthetic + advanced technique layer)  ← HERE
  ↓
sa-design-md (token generation — colors, fonts, spacing)
  ↓
cinematic-website-builder (30-module GSAP build)
  ↓
[Coding agent dispatch with complete brief]
```

---

## STEP 1 — AESTHETIC SELECTION

Based on the business profile from `sa-site-intelligence`, select one primary aesthetic
(+ optional secondary blend). Claude selects — do not ask the user unless genuinely ambiguous.

```yaml
AESTHETIC_PROFILES:

  01_liquid_glass:
    best_for: [tech_saas, ai_agency, luxury_brand, personal_brand_premium]
    signature: "Refractive translucent surfaces, optical distortion, floating glass cards, frosted panels"
    inspiration: "Apple Vision Pro, iOS spatial UI, luxury AI platforms"
    use:
      - Refractive translucent surfaces
      - Dynamic blur + ambient glow
      - Floating glass cards
      - Soft edge lighting
      - Frosted navigation panels
      - Layered transparency

  02_glassmorphism:
    best_for: [tech_saas, fintech, creative_agency, fitness_wellness]
    signature: "Blur overlays, transparent cards, gradient lighting, thin borders"
    use:
      - Blur overlays
      - Transparent cards
      - Gradient lighting + thin borders
      - Soft shadow depth
      - Floating UI panels + glow effects
    avoid:
      - Over-cluttering
      - Excessive opacity
      - Weak contrast

  03_dark_mode_luxury:
    best_for: [professional_services, real_estate, restaurant_hospitality, personal_brand]
    signature: "Deep blacks, graphite surfaces, chrome highlights, neon edge lighting"
    palette:
      - "#050505 / #0B0B0F / #121218 (backgrounds)"
      - "Violet glow, electric blue, emerald accents"
      - "White typography"
    use:
      - Deep blacks + graphite surfaces
      - Soft gradients + chrome highlights
      - Metallic accents + neon edge lighting
      - Ambient atmosphere + cinematic contrast

  04_cinematic_interface:
    best_for: [creative_agency, entertainment, film, music, personal_brand_bold]
    signature: "Every section directed like a film scene — Denis Villeneuve futurism, Ridley Scott tech minimalism"
    use:
      - Atmospheric depth + cinematic composition
      - Layered foreground/background
      - Large typography + strong focal hierarchy
      - Volumetric lighting + spatial composition
      - Motion-based reveals

  05_soft_spatial_ui:
    best_for: [ai_product, meditation, wellness, productivity_tools]
    signature: "Floating layers, depth hierarchy, atmospheric blur — AR/VR operating system feel"
    use:
      - Floating layers + depth hierarchy
      - Atmospheric blur + stacked cards
      - Ambient shadows + spatial grouping
      - Floating interface systems

  06_editorial_web:
    best_for: [creative_agency, fashion, photography, luxury_retail, personal_brand]
    signature: "Jumbo typography, asymmetrical composition, magazine-style hierarchy"
    inspiration: "Vogue, high fashion campaigns, luxury editorials"
    use:
      - Jumbo typography + intentional whitespace
      - Asymmetrical composition
      - Magazine-style hierarchy + large image treatment
      - Cinematic framing

  07_bento_grid:
    best_for: [ai_services, saas, analytics, dashboards, productized_services]
    signature: "Apple-inspired modular card systems, dashboard layouts, smart spacing"
    use:
      - Modular card systems
      - Apple-inspired feature grids
      - Content segmentation
      - Responsive card stacking
```

**Aesthetic decision output:**
```
AESTHETIC SELECTED: [name]
REASON: [one sentence — why this matches the business + audience]
SECONDARY BLEND: [optional — e.g. "Glassmorphism cards within Dark Mode Luxury structure"]
```

---

## STEP 2 — MOTION TECHNIQUE SELECTION

Select from the motion library based on aesthetic and business complexity ceiling.

### GSAP ScrollTrigger (always included)
Primary animation framework. Used for:
- Pinned sections
- Scroll storytelling
- Timeline reveals + text animation
- Product reveals + section choreography

Animation philosophy: **Smooth · Cinematic · Purposeful · Controlled · Premium**
Avoid: Cheap animations, excessive bounce, random movement, over-animation

### Parallax Scrolling
```
PARALLAX_LAYERS:
  foreground: fastest movement
  midground: moderate
  background: subtle drift
Use for: Cinematic depth, spatial immersion, atmospheric scroll
```

### Lenis Smooth Scroll
Include on ALL premium sites. Replaces native scroll with physics-based momentum.
```html
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@latest/dist/lenis.min.js"></script>
```

### Microinteractions
Apply to: Buttons, inputs, forms, cards, navigation, CTAs, hover states, success states
Quality: Soft easing · Responsive feedback · Magnetic behavior · Tactile feeling

### Magnetic Cursor Effects
Use sparingly. Best for: Hero CTAs, portfolio cards, luxury interactions.
Feel: Elegant · Smooth · Physics-based · Refined

### 3D Hover / Tilt Cards
- Perspective transforms + layer shifting
- Glow interaction + dynamic shadows
- Mouse-reactive movement
Feel: Physical · Responsive · Spatial · Premium

### Scroll-Jacked Storytelling
Use ONLY for: Premium storytelling, product launches, investor presentations, cinematic showcases.
Scrolling must: Feel guided · Feel immersive · Maintain orientation · Preserve usability

---

## STEP 3 — 3D + WEBGL SELECTION

Select if business profile allows HIGH or FULL complexity ceiling.

### Spline Integration
```
USE FOR:
  - AI avatars / floating hero objects
  - Interactive 3D devices or product showcases
  - 3D icons + spatial scenes

RULES:
  - Optimize performance (Spline viewer via CDN)
  - Keep motion smooth, clean lighting
  - Avoid excessive geometry or clutter
```

### Three.js / WebGL
```
USE FOR:
  - WebGL environments + particle systems
  - Spatial interfaces + physics interactions
  - Interactive scenes + dynamic lighting
  - Advanced 3D storytelling

FEEL: Cinematic · Smooth · Expensive · Interactive · Immersive
```

### Shader Effects
```
SHADER_TYPES:
  - Liquid distortion (hero backgrounds)
  - Aurora backgrounds (ambient section fills)
  - Glow fields (around CTAs or key elements)
  - Interactive gradients (mouse-reactive)
  - Noise distortion (texture depth)
  - Atmospheric motion (ambient background life)

LIBRARY: Use Three.js ShaderMaterial or vanilla WebGL
```

### Particle Systems
Use sparingly.
- Best for: AI themes, space/futuristic themes, hero sections, ambient atmosphere
- Avoid: Excessive density, performance issues, visual clutter

---

## STEP 4 — TYPOGRAPHY DIRECTION

Typography IS the visual system, not decoration.

```
TYPOGRAPHY_RULES:
  hero: Jumbo scale (clamp: 4rem → 8rem)
  sub_hero: Bold hierarchy, cinematic scale
  body: Editorial spacing, strong contrast
  
KINETIC_TYPOGRAPHY:
  - Scroll-reactive mask reveals
  - Animated word transitions
  - Large-scale motion text
  - Layered text systems
  
FONT_PAIRING:
  heading: Strong modern sans-serif (geometric or neo-grotesk)
  secondary: Elegant serif OR clean UI sans
  mono: For code, data, terminal aesthetics only
  source: Fontsource CDN ONLY (never Google Fonts or Bunny)
  
AVOID:
  - Too many fonts (max 2 in Fontsource)
  - Generic combinations
  - Poor spacing
  - Hard-to-read kinetic effects
```

---

## STEP 5 — 9-SECTION PAGE STRUCTURE

Apply this structure for all landing pages. Claude adapts based on business type —
some sections are skipped or merged, but the order and logic stay consistent.

```
SECTION_01_HERO:
  required: true
  include:
    - Jumbo headline (value proposition in 5–8 words)
    - Cinematic visual (video background from Phase 3)
    - Primary CTA (high contrast, magnetic button)
    - Secondary CTA (text link or ghost button)
    - Social proof hook (star rating, client count, or logo strip)
    - Interactive hero motion (GSAP entrance)
  must: Communicate value in under 3 seconds

SECTION_02_TRUST_PROOF:
  required: true
  include:
    - Client logos OR review stars OR notable metrics
    - Testimonials (1–3 concise, real-looking)
    - Odometer counters (years, clients, projects)
  motion: scroll-triggered count-up + fade-in

SECTION_03_PROBLEM_SOLUTION:
  required: true (adapt framing to industry)
  structure:
    - Problem statement (mirror their pain)
    - Emotional pain points
    - Solution breakdown
    - Visual explanation
  motion: curtain-reveal or sticky-stack-narrative

SECTION_04_SERVICES_FEATURES:
  required: true
  layout: Bento grid OR floating cards OR accordion slider
  include:
    - Service/feature cards with hover effects
    - Icon systems
    - Motion reveals per card
  motion: spotlight-border-cards or 3d-flip-cards

SECTION_05_PROCESS:
  required: for service businesses
  layout: Scroll-triggered interactive timeline
  motion: scroll-svg-draw or sticky-stack-narrative

SECTION_06_CASE_STUDIES:
  required: when social proof exists
  include:
    - Before/after reveals
    - Metrics + results
    - Video snippets (if available)
    - Interactive cards
  motion: before-after module or curtain-reveal

SECTION_07_ROI_CALCULATOR:
  required: for B2B, AI agencies, services with clear ROI
  skip: restaurants, personal brands, simple local trades
  should:
    - Drive engagement + provide instant value
    - Capture leads via email gate on result
    - Show personalized ROI in real-time

SECTION_08_CTA:
  required: true
  feel: Bold · Premium · Clear · Emotional · Urgent
  use:
    - Jumbo typography
    - Cinematic background (mesh gradient or video clip)
    - Floating CTA button
    - Interactive magnetic hover

SECTION_09_FOOTER:
  required: true
  feel: Premium (footer ≠ afterthought)
  include:
    - Strong brand typography
    - Newsletter signup
    - Navigation links
    - Contact (phone, address, hours for local)
    - Social links
    - Brand statement
    - Final CTA
```

---

## STEP 6 — CONVERSION-FIRST UX RULES

Every section must answer:
1. What is this?
2. Why should I care?
3. Why trust this?
4. What problem does this solve?
5. Why is this different?
6. What should I do next?

```
CONVERSION_RULES:
  never_allow:
    - Competing focal points
    - Weak CTA hierarchy
    - Cluttered layouts
    - Confusion about next step
    - Long overwhelming forms
  always_include:
    - Phone number in hero for local businesses
    - CTA above the fold
    - Sticky mobile CTA button
    - Trust signals in first two sections
  
  visual_hierarchy:
    1: Headline
    2: Primary CTA
    3: Supporting proof
    4: Visual reinforcement
    5: Secondary details
```

---

## STEP 7 — SEO + PERFORMANCE MANDATES

```
SEO_REQUIREMENTS:
  - Semantic HTML (h1 → h6 hierarchy, never skip levels)
  - Proper meta title + description
  - OG tags for social sharing
  - LocalBusiness schema markup (for local businesses)
  - Fast load speed (LCP < 2.5s)
  - Optimized image loading (lazy load below fold)
  - Internal linking structure

CORE_WEB_VITALS:
  LCP: < 2.5s (optimize hero image/video poster)
  INP: < 200ms (GPU-friendly animations only)
  CLS: < 0.1 (reserve space for all dynamic elements)

PERFORMANCE_RULES:
  - Lazy loading for all below-fold assets
  - Compressed + WebP images
  - GPU-friendly animation (transform/opacity only, avoid layout thrash)
  - Optimized video (H.264, < 10MB, autoplay muted loop)
  - Minimal blocking scripts
  - Lenis replaces scroll events (performance improvement)

ACCESSIBILITY:
  - Keyboard navigation support
  - Proper contrast ratios (WCAG AA minimum)
  - ARIA labels on interactive elements
  - prefers-reduced-motion media query on all GSAP animations
  - Screen-reader compatible structure
```

---

## STEP 8 — DEVELOPMENT STACK SELECTION

Claude selects the appropriate stack based on pipeline mode.

```yaml
STACK_DECISION:

  single_file_html:
    when: [local_business, simple_landing_page, batch_build, tight_timeline]
    stack:
      - Vanilla HTML/CSS/JS
      - GSAP + ScrollTrigger (CDN)
      - Lenis smooth scroll (CDN)
      - Fontsource fonts (CDN)
      - Spline viewer (CDN, if 3D needed)
    note: "Default for cinematic-website-builder output"

  next_js_full:
    when: [saas, ai_agency, complex_backend, cms_needed, ecommerce]
    stack:
      frontend: [Next.js, React, TypeScript, TailwindCSS]
      animation: [GSAP, Framer Motion, Lenis, Rive, Lottie]
      3d: [Spline, Three.js, React Three Fiber]
      cms: [Sanity, Payload, Supabase]
      seo: [Next SEO, structured metadata, schema markup]
    note: "Requires full Next.js build — route to Claude Code or Codex"
```

---

## STEP 9 — PRE-LAUNCH QUALITY CHECKLIST

Run before marking any site complete (in addition to Playwright QA).

```
VISUAL CHECKLIST:
  ✓ Premium aesthetic consistently applied
  ✓ Strong visual hierarchy throughout
  ✓ Cinematic composition in hero + key sections
  ✓ Consistent spacing system
  ✓ No cluttered layouts
  ✓ Luxury feel — nothing looks templated or generic

UX CHECKLIST:
  ✓ Clear CTAs — no ambiguity about next step
  ✓ Logical scroll flow — momentum builds toward conversion
  ✓ Easy navigation — user never lost
  ✓ Strong readability at all viewport sizes
  ✓ Touch interactions work naturally on mobile

PERFORMANCE CHECKLIST:
  ✓ Fast load speed (test with PageSpeed Insights)
  ✓ All assets optimized
  ✓ Animations smooth (no jank, no layout thrash)
  ✓ Mobile optimized and tested
  ✓ GPU-friendly effects only

SEO CHECKLIST:
  ✓ Semantic HTML structure
  ✓ Meta title + description present
  ✓ Heading hierarchy (one H1, logical H2/H3)
  ✓ LocalBusiness schema (for local businesses)
  ✓ Images have alt text

ACCESSIBILITY CHECKLIST:
  ✓ Contrast ratios pass WCAG AA
  ✓ Keyboard navigation works
  ✓ prefers-reduced-motion respected
  ✓ ARIA labels on interactive elements
```

---

## BRIEF ADDITION FORMAT

After running this skill, append this block to the coding brief from `sa-site-intelligence`:

```
DESIGN DIRECTION (from ultimate-design-director)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Aesthetic:    [aesthetic name + one-line signature]
Secondary Blend:      [optional]
Motion Level:         [Basic / Intermediate / Advanced / Full WebGL]
3D / WebGL:           [None / Spline / Three.js + shaders]
Smooth Scroll:        Lenis (always)
Stack:                [Single-file HTML / Next.js]
Page Structure:       [Which of the 9 sections to include, in order]
Sections to Skip:     [Any sections not appropriate for this business]
ROI Calculator:       [Yes / No + reason]
Chatbot:              [Yes — Hermes Agent integration / No]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## CREATIVE NORTH STAR

Every website should feel like:
- A premium cinematic digital experience
- A luxury technology campaign
- A next-generation AI product ecosystem
- A Hollywood-grade interactive brand presentation

The goal is not to create a website.
The goal is to create: **digital presence · emotional immersion · brand authority · conversion momentum · visual obsession**
