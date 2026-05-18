---
name: sa-site-intelligence
description: >
  Claude's orchestration intelligence layer. Runs at two moments: (1) at session START as the
  intake questionnaire to determine pipeline mode (batch leads / single build / existing site rebuild),
  and (2) before coding agent dispatch to generate a site-specific brief with context-aware module
  selection. TRIGGER IMMEDIATELY when starting any new project, when the pipeline mode is unclear,
  or when building the per-site coding brief. Prevents over-engineering simple sites and
  under-building complex ones. Claude acts as project director — it writes the brief, selects
  modules, and delegates to the right coding agent.
version: 1.0
updated: 2026-05-18
---

# SA SITE INTELLIGENCE
## Claude as Project Director — Intake, Analysis & Coding Brief Generator

Claude is the orchestrator. It does not build the site — it thinks about the site, writes the brief,
selects the right tools, and dispatches the right agent. This skill governs that reasoning.

---

## PART 1 — SESSION START QUESTIONNAIRE

Run this FIRST, before any other phase. Ask only these questions — nothing else yet.

```
SA INTAKE — PROJECT TYPE
━━━━━━━━━━━━━━━━━━━━━━━

What are we building today?

  [A] BATCH BUILD — I have leads from the prospecting sheet
       → I'll need niche, city, and how many sites to run in parallel

  [B] SINGLE SITE BUILD — One specific client or business
       → I'll ask about the business, style, and goals

  [C] EXISTING SITE REBUILD / UPGRADE — I have a URL to work from
       → I'll scrape and audit the existing site, then rebuild or upgrade

  [D] FRESH CLIENT BRIEF — I have a client intake form or brief to parse
       → Paste it and I'll extract everything needed

Reply A, B, C, or D (or just describe what you're doing):
```

### Route Based on Answer

```
MODE_ROUTING:
  A — batch_build:
    next: sa-prospecting-agent (if not already run)
    or:   production-pipeline-orchestrator → parallel_batch mode
    agent_count: min(lead_count, 7)   # one agent per site, max 7 simultaneous

  B — single_build:
    next: brand-extractor → sa-design-md → [this skill: Phase 4.5 brief]
    agent_count: 1

  C — existing_rebuild:
    next: page-upgrade (audit) → brand-extractor → sa-design-md → [this skill: Phase 4.5 brief]
    agent_count: 1
    note: "Scrape existing site for brand DNA before building"

  D — client_brief_parse:
    next: parse brief → brand-extractor → sa-design-md → [this skill: Phase 4.5 brief]
    agent_count: 1
```

---

## PART 2 — BUSINESS INTELLIGENCE ANALYSIS

Before writing the coding brief, Claude analyzes the business. This determines module selection,
tone, complexity ceiling, and which coding agent to use.

### Business Type Classification

```yaml
BUSINESS_PROFILES:

  professional_services:
    includes: [dentist, doctor, lawyer, accountant, financial advisor, therapist, chiropractor]
    tone: "clean, trustworthy, professional, calm"
    complexity_ceiling: MEDIUM
    modules_max: 5
    recommended:
      - text-mask-reveal        # hero headline entrance
      - sticky-card-stack       # services or pricing cards
      - odometer-counter        # patient count, years in practice, 5-star reviews
      - spotlight-border-cards  # team or service highlights
      - scroll-color-shift      # subtle section transitions
    avoid:
      - particle-explosion-button
      - glitch-effect
      - image-trail
      - drag-to-pan-grid
    hero_video_style: "M1 Narrative — calm, cinematic, people-focused"

  trades_home_services:
    includes: [landscaper, HVAC, plumber, electrician, roofer, painter, pest control, cleaning]
    tone: "capable, local, reliable, straightforward"
    complexity_ceiling: MEDIUM
    modules_max: 5
    recommended:
      - curtain-reveal          # before/after reveal for work portfolio
      - before-after            # project transformations
      - scroll-color-shift      # season or service transitions
      - kinetic-marquee         # services ticker
      - text-mask-reveal        # hero headline
    avoid:
      - horizontal-scroll-hijack
      - 3d-coverflow-carousel
      - macos-dock-nav
      - glitch-effect
    hero_video_style: "M1 Narrative — outdoor work, natural light, B-roll of results"
    special_note: "Show the RESULT not the process. Before/After is the single most powerful module."

  restaurant_hospitality:
    includes: [restaurant, cafe, bar, hotel, bakery, food truck, catering, nightclub]
    tone: "warm, inviting, atmospheric, sensory"
    complexity_ceiling: MEDIUM-HIGH
    modules_max: 6
    recommended:
      - layered-zoom-parallax   # food/atmosphere imagery at depth
      - curtain-reveal          # menu or dish reveals
      - typewriter-effect       # specials, taglines
      - circular-text-path      # ambient branding element
      - mesh-gradient-background # ambient warmth
      - odometer-counter        # years open, dishes served
    avoid:
      - glitch-effect
      - 3d-flip-cards
      - drag-to-pan-grid
    hero_video_style: "M4 Performance — energy, atmosphere, food close-ups"

  retail_ecommerce:
    includes: [boutique, clothing store, jewelry, beauty, furniture, electronics retail]
    tone: "desirable, editorial, product-focused"
    complexity_ceiling: HIGH
    modules_max: 7
    recommended:
      - horizontal-scroll-hijack # product gallery scrolling
      - 3d-flip-cards           # product variants
      - image-trail             # cursor creates editorial feel
      - magnetic-repel-grid     # product grid interaction
      - accordion-slider        # lookbook or collection reveal
      - kinetic-marquee         # brand or offer ticker
      - view-transition-morphing # cart / product transitions
    hero_video_style: "M2 Studio/Editorial — product-forward, locked-off, saturated"

  creative_agency:
    includes: [design agency, marketing agency, photography studio, video production, ad agency]
    tone: "bold, expressive, distinctive, confident"
    complexity_ceiling: FULL
    modules_max: 8
    recommended:
      - image-trail             # cursor identity — THE signature module
      - horizontal-scroll-hijack # portfolio flow
      - mesh-gradient-background # ambient brand color
      - 3d-coverflow-carousel   # case studies or work showcase
      - scroll-svg-draw         # process or timeline
      - glitch-effect           # brand edge (use sparingly)
      - text-scramble-decode    # hero tagline entrance
      - sticky-stack-narrative  # story scrolling
    hero_video_style: "M3 Action or M2 Editorial — depends on agency personality"

  tech_saas:
    includes: [software company, SaaS, app, AI product, startup, fintech]
    tone: "smart, fast, innovative, credible"
    complexity_ceiling: HIGH
    modules_max: 7
    recommended:
      - text-mask-reveal        # hero value prop
      - scroll-svg-draw         # product flow or architecture diagram
      - sticky-stack-narrative  # feature-by-feature scroll story
      - odometer-counter        # users, uptime, savings stats
      - spotlight-border-cards  # feature cards
      - typewriter-effect       # rotating value propositions
      - dynamic-island-nav      # modern nav pattern
    hero_video_style: "M2 Studio/Editorial — product UI in motion, or M5 Atmospheric"

  fitness_wellness:
    includes: [gym, personal trainer, yoga studio, spa, meditation app, nutrition coach]
    tone: "energetic or calm — depends on brand, ask"
    complexity_ceiling: MEDIUM
    modules_max: 5
    recommended:
      - layered-zoom-parallax   # body/movement imagery
      - text-mask-reveal        # hero statement
      - kinetic-marquee         # class schedule or testimonial ticker
      - scroll-color-shift      # energy shift between sections
      - odometer-counter        # members, classes, transformations
    hero_video_style: "M3 Action (gym) or M5 Atmospheric (spa/wellness)"

  real_estate:
    includes: [real estate agent, property developer, rental company, mortgage broker]
    tone: "aspirational, trustworthy, location-specific"
    complexity_ceiling: MEDIUM-HIGH
    modules_max: 6
    recommended:
      - layered-zoom-parallax   # property imagery at depth
      - sticky-card-stack       # listing cards
      - before-after            # renovation reveals
      - curtain-reveal          # property section transitions
      - odometer-counter        # homes sold, years in market, listings
      - spotlight-border-cards  # agent profiles
    hero_video_style: "M1 Narrative — neighborhood walk, property tours, golden hour"

  personal_brand:
    includes: [influencer, speaker, coach, consultant, author, musician, athlete]
    tone: "authentic, personal, aspirational — match their personality"
    complexity_ceiling: MEDIUM-HIGH
    modules_max: 6
    recommended:
      - text-mask-reveal        # name/tagline hero
      - image-trail             # personality cursor effect
      - accordion-slider        # content categories or offerings
      - circular-text-path      # ambient personal brand mark
      - sticky-stack-narrative  # story / journey scroll
      - typewriter-effect       # rotating roles or achievements
    hero_video_style: "M4 Performance — them in action, on stage, or in their element"
```

---

## PART 3 — SITE BRIEF GENERATION

After business classification, Claude writes a brief for the coding agent. This is what the agent
actually receives — it should be complete enough to build without further questions.

### Brief Template

```
SITE BUILD BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client:         [Business name]
Business Type:  [Classification]
Location:       [City, State]
Pipeline Mode:  [batch_build / single_build / rebuild]

BRAND
Primary Color:    [hex]
Secondary Color:  [hex]
Accent Color:     [hex]
Font — Heading:   [font name, Fontsource CDN]
Font — Body:      [font name, Fontsource CDN]
Design System:    VL-01 Dark Glassmorphism (default) | [override if brand specifies]

HERO SECTION
Video:          [URL from Phase 3 — FFmpeg processed]
Poster Image:   [URL from Phase 2 — fallback frame]
Overlay:        [gradient spec for text readability]
Headline:       "[Headline copy]"
Subheadline:    "[Subheadline copy]"
CTA Button:     "[CTA text]" → [action: scroll / link / form]

SELECTED MODULES (ordered by page position)
1. [Module name] — [what it does in this specific context]
2. [Module name] — [what it does in this specific context]
3. [Module name] — [what it does in this specific context]
[max: modules_max for this business type]

SECTIONS (in order)
1. Hero (full-screen video)
2. [Section name + purpose]
3. [Section name + purpose]
4. [Section name + purpose]
5. [Section name + purpose]
6. Footer (contact, hours, address, phone)

CONTENT TO POPULATE
[Actual copy for each section — pulled from scrape, intake, or generated]

CONSTRAINTS
- Single-file HTML output
- GSAP + ScrollTrigger via CDN (no build tooling)
- Mobile-first, Playwright QA on 3 devices after delivery
- Max [N] modules — do not add more without approval
- No placeholder text — every section must have real content

ASSIGNED AGENT: [agent name]
REASON: [one sentence on why this agent was chosen]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## PART 4 — CODING AGENT DISPATCH MATRIX

Claude selects the agent based on site complexity and type. For batch builds, Claude assigns
one agent per site and dispatches all simultaneously.

```yaml
AGENT_DISPATCH_MATRIX:

  codex:
    best_for: [tech_saas, creative_agency, complex_interactions]
    strengths: ["JavaScript mastery", "GSAP animation precision", "clean component structure"]
    assign_when: "Site needs heavy custom JS logic or complex state"

  claude_code:
    best_for: [professional_services, personal_brand, any site needing copy generation]
    strengths: ["Full-stack reasoning", "content + code together", "TypeScript", "API integration"]
    assign_when: "Site needs intelligent copy written alongside the build, or Supabase backend"
    note: "Claude Code is also the ORCHESTRATOR — it manages the other agents, not just builds"

  gemini_pro:
    best_for: [retail_ecommerce, restaurant_hospitality]
    strengths: ["Multi-modal understanding", "SEO copy generation", "Google ecosystem integration"]
    assign_when: "Site is Google-ecosystem heavy (Maps embed, Analytics, Search Console)"

  minimax_27:
    best_for: [creative_agency, fitness_wellness, personal_brand]
    strengths: ["Visual layout reasoning", "creative design decisions", "image-text harmony"]
    assign_when: "Site is highly visual and layout-design-driven"

  deepseek_v4:
    best_for: [tech_saas, complex_logic, data-heavy sites]
    strengths: ["Code efficiency", "algorithmic precision", "dense technical builds"]
    assign_when: "Site needs performant, lean code over visual flair"

  kimi_k2:
    best_for: [trades_home_services, real_estate, local_business]
    strengths: ["Local SEO patterns", "straightforward builds", "fast delivery"]
    assign_when: "Site is local business, no frills, needs to rank and convert"

  hermes_agent:
    best_for: [ANY — Hermes is the cross-platform connector]
    strengths: ["API orchestration", "multi-service integration", "webhook handling", "CRM hooks"]
    assign_when: "Site needs backend integrations: CRM, booking system, email automation, payment"
    role_in_pipeline: |
      Hermes Agent is NOT a primary builder — it is the INTEGRATION SPECIALIST.
      After the coding agent delivers the HTML, Hermes connects it to:
        - CRM (HubSpot, GoHighLevel, Salesforce)
        - Booking (Calendly, Acuity, Square)
        - Email (Mailchimp, ConvertKit, Klaviyo)
        - Payments (Stripe, Square)
        - Review platforms (Birdeye, Podium)
        - AI chat widget (custom or third-party)
      Every site goes through Hermes after the primary build for integration layer.
```

### Batch Dispatch Example

```
PARALLEL DISPATCH — 7 leads from Mesquite TX dentist sheet

Lead 1: Sunrise Family Dentistry
  Agent: Kimi K2 (local professional services, fast delivery)
  Modules: text-mask-reveal, odometer-counter, spotlight-border-cards, scroll-color-shift, sticky-card-stack
  Then: Hermes Agent → Calendly booking embed + Birdeye review widget

Lead 2: Mesquite Smiles Dental
  Agent: Claude Code (needs copy generation alongside build)
  Modules: text-mask-reveal, sticky-card-stack, odometer-counter, curtain-reveal, spotlight-border-cards
  Then: Hermes Agent → HubSpot CRM + Mailchimp

Lead 3: Premier Dental of Mesquite
  Agent: Gemini Pro (strong Google presence, needs Maps + Analytics)
  Modules: text-mask-reveal, scroll-color-shift, kinetic-marquee, spotlight-border-cards, odometer-counter
  Then: Hermes Agent → Google Maps embed + Review automation

[All 7 run simultaneously. Hermes runs integration pass after each primary build completes.]
```

---

## PART 5 — COMPLEXITY GUARDRAILS

Claude enforces these before writing any brief:

```
GUARDRAILS:
  never_exceed_8_modules: true
  minimum_modules: 3
  never_use_glitch_on_professional_services: true
  never_use_particle_explosion_on_local_trades: true
  always_include_real_content: true   # no Lorem ipsum
  always_include_phone_cta_for_local_business: true
  hero_video_is_required: true        # every site has a video hero
  mobile_first: true
  single_file_html: true              # unless scope explicitly expands to Next.js
  playwright_qa_is_mandatory: true
```

---

## EXECUTION SUMMARY

```
SESSION START
  → Run Part 1 questionnaire → determine mode (A/B/C/D)

PER SITE (for each lead or single client)
  → Classify business type (Part 2)
  → Select modules based on profile (Part 2 → BUSINESS_PROFILES)
  → Write full site brief (Part 3)
  → Select coding agent (Part 4 → AGENT_DISPATCH_MATRIX)
  → Dispatch agent with brief
  → After build: assign Hermes Agent for integration layer
  → Playwright QA → Vercel deploy
```
