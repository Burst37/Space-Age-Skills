---
name: sa-site-intelligence
description: >
  Claude's orchestration intelligence layer. Runs at two moments: (1) at session START as the
  intake system — first checks for reference inputs (URLs, images, MP4s) and extracts design DNA
  from them before falling back to the A/B/C/D questionnaire, and (2) before coding agent dispatch
  to generate a site-specific brief with context-aware module selection. TRIGGER IMMEDIATELY when
  starting any new project, when references are uploaded, or when building the per-site coding
  brief. Claude acts as project director — it reads the references, classifies the business,
  selects modules, writes the brief, and dispatches the right agent.
version: 1.1
updated: 2026-05-18
---

# SA SITE INTELLIGENCE
## Claude as Project Director — Reference Intake, Analysis & Coding Brief Generator

Claude is the orchestrator. It reads what you give it, extracts what it needs, and builds the
brief. Drop references first. Answer questions only if there's nothing to extract from.

---

## PART 0 — REFERENCE INTAKE MODE

**Run this BEFORE the questionnaire.** Check for any reference inputs in the session.
If references exist, extract from them. Only fall back to the questionnaire if nothing is provided.

```
REFERENCE_DETECTION:
  on session start, check for:
    □ URL(s) pasted into chat
    □ Image(s) uploaded (PNG, JPG, WEBP, screenshot)
    □ MP4 / video file uploaded
    □ Pinterest link
    □ Any combination of the above
  
  if references found → run Reference Extraction (below)
  if no references → run Part 1 Questionnaire
  if partial references → extract what exists, ask only for what's missing
```

---

### 0A — URL REFERENCE EXTRACTION

When a URL is provided (competitor site, inspiration site, client's existing site):

**Tool:** `browserbase-fetch` or `firecrawl-mcp`

```
URL_EXTRACTION_PROTOCOL:

  step_1_scrape:
    action: "Fetch the full page — HTML, CSS, visible text"
    extract:
      - Page title + meta description
      - Color values (background, text, buttons, accents)
      - Font families in use
      - Section structure (what sections exist, in what order)
      - Navigation pattern (sticky / floating / hidden)
      - CTA text and placement
      - Animation/motion signals (GSAP classes, scroll triggers, CSS transitions)
      - 3D elements (Spline embeds, Three.js canvas, WebGL)
      - Social proof signals (reviews, logos, counters)
      - Form type (contact / booking / multi-step / chatbot)
      - Business type inference

  step_2_assess:
    what_is_working:
      - Strong visual hierarchy? (yes/no)
      - Clear CTA? (yes/no)
      - Premium aesthetic? (yes/no)
      - Motion present? (yes/no + level)
      - Mobile-first signals? (yes/no)
    what_is_missing:
      - List gaps against the 9-section structure
      - List missing trust signals
      - Note aesthetic category mismatch if any
      - Note performance red flags

  step_3_output:
    format: |
      URL ANALYSIS — [domain]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Business type detected:  [type]
      Aesthetic category:      [01–07 from ultimate-design-director]
      Color palette extracted: [hex values]
      Fonts detected:          [names]
      Sections present:        [list]
      Sections missing:        [list vs. 9-section ideal]
      Motion level:            [None / Basic / Intermediate / Advanced]
      3D detected:             [None / Spline / Three.js / other]
      What's working:          [bullet list]
      What's missing/weak:     [bullet list]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      RECOMMENDATION: [rebuild / upgrade / reference only]
      PIPELINE MODE:  [batch_build / single_build / existing_rebuild]
```

**Multiple URLs:** Run extraction on each. Synthesize a composite: take the best elements
from each (strongest color palette, best section structure, highest motion level that fits
the business type). Note: "From site A I'm taking the dark color system. From site B I'm
taking the bento grid section structure."

---

### 0B — IMAGE REFERENCE EXTRACTION

When one or more images are uploaded (brand assets, competitor screenshots, mood board,
Pinterest saves, logo files, hero image inspiration):

**Tool:** Claude native vision — analyze directly, no external tool needed.

```
IMAGE_EXTRACTION_PROTOCOL:

  for_each_image:
    extract:
      color_palette:
        - Dominant background color → hex estimate
        - Primary text/element color → hex estimate
        - Accent color(s) → hex estimate
        - Overall temperature (warm / cool / neutral)
      aesthetic_category:
        - Match to one of 7 aesthetics from ultimate-design-director
        - Confidence: high / medium / low
      composition_signals:
        - Layout type (centered / asymmetric / grid / editorial)
        - Typography scale (jumbo / editorial / minimal)
        - Whitespace usage (generous / tight / mixed)
        - Depth cues (layers / flat / spatial)
      mood_and_tone:
        - Energy level (calm / dynamic / bold / minimal)
        - Industry signals (professional / creative / luxury / local / tech)
        - Cinema mode match (M1 Narrative / M2 Editorial / M3 Action / M4 Performance / M5 Atmospheric)
      if_logo_or_brand_asset:
        - Extract brand colors
        - Note typography style
        - Feed directly into sa-design-md token generation
      if_hero_image:
        - Note subject, lighting, camera angle
        - This becomes the first-frame reference for video prompt generation
        - Route to cinematic-video-architect for hero video prompt

  synthesis_output:
    format: |
      IMAGE ANALYSIS — [count] image(s)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Aesthetic match:         [name] (confidence: high/medium/low)
      Palette extracted:
        Background:  [hex]
        Primary:     [hex]
        Accent:      [hex]
      Mood/tone:               [descriptor]
      Cinema mode for video:   [M1–M5]
      Hero image detected:     [yes → will use as first-frame reference / no]
      Brand assets detected:   [yes → routing to sa-design-md / no]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      APPLYING TO: design tokens + aesthetic selection + hero video brief
```

**Multiple images:** Cross-reference for consistency. If palettes conflict, ask:
"I see two different color directions — [palette A] vs [palette B]. Which feel closer to
what you want?" This is the ONE clarifying question allowed for image conflicts.

---

### 0C — MP4 / VIDEO REFERENCE EXTRACTION

When a video file is uploaded or a video URL is provided:

**Tool:** Claude vision on key frames + `cinematic-video-architect` for prompt extraction

```
VIDEO_EXTRACTION_PROTOCOL:

  step_1_analyze_frames:
    sample: first frame / middle frame / last frame
    extract_per_frame:
      - Color grading (warm / cool / desaturated / high contrast / filmic)
      - Lighting style (natural / studio / dramatic / ambient)
      - Subject (person / product / environment / abstract)
      - Composition (wide / close / overhead / POV)

  step_2_motion_analysis:
    extract:
      camera_movement:   [static / dolly / orbit / handheld / tracking]
      pacing:            [slow cinematic / moderate / fast dynamic]
      cut_frequency:     [long takes / quick cuts / mixed]
      physics_quality:   [realistic / stylized / abstract]
    map_to_cinema_mode:
      - Static + slow + atmospheric → M5 Atmospheric
      - Handheld + gritty + fast → M3 Action
      - Locked-off + saturated + editorial → M2 Studio
      - Mixed + narrative + character-driven → M1 Narrative
      - Energy + performance + crowd → M4 Performance

  step_3_style_extraction:
    extract:
      - Overall aesthetic → match to ultimate-design-director aesthetics
      - GSAP motion level implied → Basic / Intermediate / Advanced
      - Whether this is: hero video reference / motion style reference / full site inspiration

  output:
    format: |
      VIDEO ANALYSIS — [filename or URL]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Cinema mode:             [M1–M5 + name]
      Camera movement:         [descriptor]
      Color grading:           [descriptor + temp estimate]
      Pacing:                  [slow / moderate / fast]
      Aesthetic match:         [from ultimate-design-director]
      GSAP motion level:       [Basic / Intermediate / Advanced]
      Use as:                  [hero video reference / motion style / full inspiration]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ROUTING: cinematic-video-architect will use this as style reference for hero video prompt
```

---

### 0D — COMBINED REFERENCE SYNTHESIS

When multiple reference types are provided together (e.g. a URL + 3 images + an MP4):

```
SYNTHESIS_PROTOCOL:
  priority_order:
    1: Images (direct brand DNA — highest specificity)
    2: MP4 (motion + cinema direction)
    3: URL (structural reference + section gaps)

  conflict_resolution:
    if color conflict:   → images win over URL scrape
    if motion conflict:  → MP4 wins over URL motion level
    if structure conflict: → note both options, ask one question max

  synthesis_output:
    format: |
      REFERENCE SYNTHESIS — [count] inputs analyzed
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Sources: [URL: domain] + [N images] + [MP4: filename]

      DESIGN DNA EXTRACTED:
      Aesthetic:          [selected] — from [source]
      Color palette:
        Background:       [hex] — from [source]
        Primary:          [hex] — from [source]
        Accent:           [hex] — from [source]
      Cinema mode:        [M1–M5] — from [source]
      Motion level:       [Basic / Intermediate / Advanced] — from [source]
      Section structure:  [what to include] — from [source]
      What to improve:    [gaps found in URL analysis]

      BUSINESS TYPE:      [inferred from all inputs]
      PIPELINE MODE:      [batch / single / rebuild]
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Proceeding to brief generation — confirm or redirect →
```

---

## PART 1 — SESSION START QUESTIONNAIRE

**Only runs if no references were provided in Part 0.**

```
SA INTAKE — PROJECT TYPE
━━━━━━━━━━━━━━━━━━━━━━━

What are we building today?

  [A] BATCH BUILD — I have leads from the prospecting sheet
  [B] SINGLE SITE BUILD — One specific client or business
  [C] EXISTING SITE REBUILD — I have a URL to work from
  [D] FRESH CLIENT BRIEF — Paste it and I'll extract everything

Reply A, B, C, or D (or just describe what you're doing):
```

### Route Based on Answer

```
MODE_ROUTING:
  A — batch_build:
    next: sa-prospecting-agent → production-pipeline-orchestrator (parallel batch)
    agent_count: min(lead_count, 7)

  B — single_build:
    next: ultimate-design-director → sa-design-md → coding brief → agent dispatch
    agent_count: 1

  C — existing_rebuild:
    action: run 0A URL extraction first, then treat as single_build
    next: page-upgrade (audit) → ultimate-design-director → sa-design-md → brief
    agent_count: 1

  D — client_brief_parse:
    action: parse brief → extract business type + goals → treat as single_build
    agent_count: 1
```

---

## PART 2 — BUSINESS INTELLIGENCE & MODULE SELECTION

After reference extraction or questionnaire, classify the business and apply constraints.

### Business Type → Complexity Ceiling → Module Cap

```yaml
BUSINESS_PROFILES:

  professional_services:
    includes: [dentist, doctor, lawyer, accountant, financial advisor, therapist, chiropractor]
    tone: "clean, trustworthy, professional, calm"
    complexity_ceiling: MEDIUM
    modules_max: 5
    recommended: [text-mask-reveal, sticky-card-stack, odometer-counter, spotlight-border-cards, scroll-color-shift]
    avoid: [particle-explosion-button, glitch-effect, image-trail, drag-to-pan-grid]
    3d_webgl: false
    hero_video_style: "M1 Narrative — calm, cinematic, people-focused"

  trades_home_services:
    includes: [landscaper, HVAC, plumber, electrician, roofer, painter, pest control, cleaning]
    tone: "capable, local, reliable, straightforward"
    complexity_ceiling: MEDIUM
    modules_max: 5
    recommended: [curtain-reveal, before-after, scroll-color-shift, kinetic-marquee, text-mask-reveal]
    avoid: [horizontal-scroll-hijack, 3d-coverflow-carousel, macos-dock-nav, glitch-effect]
    3d_webgl: false
    hero_video_style: "M1 Narrative — outdoor work, natural light, results-focused"
    special: "Before/After is the single highest-converting module for this type"

  restaurant_hospitality:
    includes: [restaurant, cafe, bar, hotel, bakery, food truck, catering, nightclub]
    tone: "warm, inviting, atmospheric, sensory"
    complexity_ceiling: MEDIUM_HIGH
    modules_max: 6
    recommended: [layered-zoom-parallax, curtain-reveal, typewriter-effect, circular-text-path, mesh-gradient-background, odometer-counter]
    avoid: [glitch-effect, 3d-flip-cards, drag-to-pan-grid]
    3d_webgl: false
    hero_video_style: "M4 Performance — energy, atmosphere, food close-ups"

  retail_ecommerce:
    includes: [boutique, clothing store, jewelry, beauty, furniture, electronics]
    tone: "desirable, editorial, product-focused"
    complexity_ceiling: HIGH
    modules_max: 7
    recommended: [horizontal-scroll-hijack, 3d-flip-cards, image-trail, magnetic-repel-grid, accordion-slider, kinetic-marquee, view-transition-morphing]
    3d_webgl: spline_only
    hero_video_style: "M2 Studio/Editorial — product-forward, saturated"

  creative_agency:
    includes: [design agency, marketing agency, photography studio, video production]
    tone: "bold, expressive, distinctive, confident"
    complexity_ceiling: FULL
    modules_max: 8
    recommended: [image-trail, horizontal-scroll-hijack, mesh-gradient-background, 3d-coverflow-carousel, scroll-svg-draw, glitch-effect, text-scramble-decode, sticky-stack-narrative]
    3d_webgl: three_js_or_spline
    hero_video_style: "M3 Action or M2 Editorial"

  tech_saas:
    includes: [software, SaaS, app, AI product, startup, fintech]
    tone: "smart, fast, innovative, credible"
    complexity_ceiling: HIGH
    modules_max: 7
    recommended: [text-mask-reveal, scroll-svg-draw, sticky-stack-narrative, odometer-counter, spotlight-border-cards, typewriter-effect, dynamic-island-nav]
    3d_webgl: spline_preferred
    hero_video_style: "M2 Studio/Editorial or M5 Atmospheric"

  fitness_wellness:
    includes: [gym, personal trainer, yoga studio, spa, meditation, nutrition coach]
    tone: "energetic or calm — ask if unclear"
    complexity_ceiling: MEDIUM
    modules_max: 5
    recommended: [layered-zoom-parallax, text-mask-reveal, kinetic-marquee, scroll-color-shift, odometer-counter]
    3d_webgl: false
    hero_video_style: "M3 Action (gym) or M5 Atmospheric (spa/wellness)"

  real_estate:
    includes: [real estate agent, property developer, rental, mortgage broker]
    tone: "aspirational, trustworthy, location-specific"
    complexity_ceiling: MEDIUM_HIGH
    modules_max: 6
    recommended: [layered-zoom-parallax, sticky-card-stack, before-after, curtain-reveal, odometer-counter, spotlight-border-cards]
    3d_webgl: false
    hero_video_style: "M1 Narrative — neighborhood walk, golden hour"

  personal_brand:
    includes: [influencer, speaker, coach, consultant, author, musician, athlete]
    tone: "authentic, personal, aspirational — match personality"
    complexity_ceiling: MEDIUM_HIGH
    modules_max: 6
    recommended: [text-mask-reveal, image-trail, accordion-slider, circular-text-path, sticky-stack-narrative, typewriter-effect]
    3d_webgl: spline_only
    hero_video_style: "M4 Performance — them in action or in their element"
```

---

## PART 3 — MANDATORY PRE-BUILD DECLARATION

Claude MUST output this before any coding agent fires. No exceptions.
The user approves or redirects. Build only starts after confirmation.

```
SITE BUILD BRIEF — [Business Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUTS USED
  References:     [URL: domain / N images / MP4: filename / none — questionnaire]
  Business type:  [classification]
  Pipeline mode:  [batch / single / rebuild]

DESIGN DIRECTION
  Aesthetic:      [name from ultimate-design-director]
  Motion level:   [Basic / Intermediate / Advanced / Full WebGL]
  3D / WebGL:     [None / Spline / Three.js + shaders]
  Smooth scroll:  Lenis (always included)
  Stack:          [Single-file HTML / Next.js]

BRAND TOKENS (from references or sa-design-md)
  Background:     [hex]
  Primary:        [hex]
  Accent:         [hex]
  Heading font:   [name — Fontsource]
  Body font:      [name — Fontsource]

HERO
  Video style:    [cinema mode + description]
  First frame:    [from uploaded image / generated]
  Headline:       "[copy]"
  CTA:            "[button text]" → [action]

SELECTED MODULES ([N] of max [N])
  1. [module] — [what it does in this context]
  2. [module] — [what it does in this context]
  3. [module] — [what it does in this context]
  [...]

PAGE SECTIONS (in order)
  ✓ Hero
  ✓ [section] — [purpose]
  ✓ [section] — [purpose]
  ✗ ROI Calculator — [reason skipped, if applicable]
  ✓ CTA
  ✓ Footer

AGENT ASSIGNMENT
  Coding agent:   [name]
  Reason:         [one sentence]
  Hermes after:   [integrations: CRM / booking / email / reviews / chatbot]

WHY I CHOSE THIS
  [2 sentences explaining the key decisions — aesthetic choice + module rationale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confirm to build → or redirect any item above
```

---

## PART 4 — CODING AGENT DISPATCH MATRIX

```yaml
AGENT_DISPATCH:
  codex:
    best_for: [tech_saas, creative_agency, complex_JS]
    strengths: ["GSAP precision", "complex state", "clean JS architecture"]

  claude_code:
    best_for: [professional_services, personal_brand, sites needing copy + code]
    strengths: ["full-stack reasoning", "copy generation", "TypeScript", "Supabase"]
    note: "Also the ORCHESTRATOR — manages all other agents"

  gemini_pro:
    best_for: [retail_ecommerce, restaurant, Google-ecosystem sites]
    strengths: ["multi-modal", "SEO copy", "Google integrations"]

  minimax_27:
    best_for: [creative_agency, fitness, personal_brand]
    strengths: ["visual layout reasoning", "image-text harmony"]

  deepseek_v4:
    best_for: [tech_saas, data-heavy, performance-critical]
    strengths: ["code efficiency", "algorithmic precision", "lean builds"]

  kimi_k2:
    best_for: [trades, real_estate, local_business]
    strengths: ["local SEO patterns", "fast delivery", "straightforward builds"]

  hermes_agent:
    role: "Integration specialist — runs AFTER primary build on every site"
    connects: [CRM, booking, email automation, payments, review platforms, AI chatbot]
    always_runs: true
```

---

## PART 5 — COMPLEXITY GUARDRAILS

```
HARD RULES — non-negotiable:
  ✗ Never exceed 8 modules per page
  ✗ Never fewer than 3 modules
  ✗ Never use glitch-effect on professional_services
  ✗ Never use particle-explosion on local trades
  ✗ Never Three.js on MEDIUM complexity ceiling
  ✗ Never Lorem ipsum — every section needs real content
  ✗ Never skip the pre-build declaration (Part 3)
  ✓ Always include Lenis smooth scroll
  ✓ Always include phone CTA for local businesses
  ✓ Always include hero video
  ✓ Always run Hermes Agent after primary build
  ✓ Always run Playwright QA before Vercel deploy
```
