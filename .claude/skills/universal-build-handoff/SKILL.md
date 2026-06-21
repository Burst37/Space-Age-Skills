---
name: universal-build-handoff
description: >
  Space Age Universal Build Handoff system. Produces a standardized handoff package that any
  downstream builder (Claude Code, Codex, Cursor, Antigravity, DeepSeek, Framer, Webflow, Gemini)
  can consume without drift. Runs after design direction and before code. Part of the 7-phase
  Website Factory pipeline.
---

# Universal Build Handoff OS

## Purpose

The handoff package is the contract between the design/direction layer and the code/builder layer.

Without it, builders receive vague instructions like "make it premium" and produce generic output.
With it, builders receive exact tokens, motion specs, section schemas, and component routing.

## Output Contract Schema

Every handoff package MUST contain all of these:

```yaml
handoff_package:
  meta:
    client: ""
    project_type: ""
    date: ""
    builder_target: []   # Claude Code / Codex / Cursor / Antigravity / Framer / Webflow / DeepSeek

  brand_tokens:
    colors:
      bg_primary: ""
      bg_secondary: ""
      accent_primary: ""
      accent_secondary: ""
      text_primary: ""
      text_muted: ""
      glass_surface: ""
      glass_border: ""
    typography:
      font_display: ""
      font_body: ""
      font_mono: ""
      hero_size: "clamp(4rem, 10vw, 9rem)"
      body_size: "clamp(1rem, 1.5vw, 1.125rem)"
    spacing:
      section_padding: "clamp(6rem, 12vw, 10rem)"
      content_max_width: "1440px"

  tech_stack:
    framework: ""        # Next.js / Framer / Webflow / Vanilla
    styling: ""          # Tailwind / CSS Modules / Vanilla CSS
    motion: ""           # GSAP + Lenis / Framer Motion
    3d: ""               # Spline / Three.js / none
    cms: ""              # Sanity / Airtable / none
    hosting: ""          # Vercel / VPS / Webflow

  sections:
    - id: hero
      type: full_screen_animated
      content:
        headline: ""
        subheadline: ""
        cta_primary: ""
        cta_secondary: ""
      visual: ""
      motion:
        entrance: ""
        scroll_behavior: ""
    - id: ""
      type: ""
      content: {}
      motion: {}

  motion_spec:
    scroll_library: "Lenis"
    animation_library: "GSAP"
    reduced_motion_fallback: true
    hero_entrance_duration: "< 1.2s"
    animations: []

  components:
    routing: ""           # shadcn/ui / Radix / Magic UI / Aceternity / custom
    nav: ""
    cta_button: ""
    cards: ""
    modals: ""

  conversion:
    primary_cta: ""
    proof_sections: []
    trust_signals: []

  performance:
    lcp_target: "< 2.5s"
    video_poster: true
    lazy_loading: true
    3d_fallback: true

  accessibility:
    contrast_ratio: ">= 4.5:1"
    keyboard_nav: true
    focus_visible: true
    reduced_motion: true
    semantic_html: true

  seo:
    title: ""
    description: ""
    schema_type: ""       # LocalBusiness / Organization / Person / Product
    local_nap: {}         # name, address, phone

  builder_notes: ""
  known_constraints: ""
  next_step: ""           # claude_code / codex / cursor / antigravity / framer / webflow / deploy
```

## Builder Routing Rules

| Builder | Use When | Strength |
|---|---|---|
| Claude Code | Complex logic, Supabase, full-stack Next.js | Architecture + reasoning |
| Codex (GPT-5.5) | Pure code generation, second opinion reviews | Speed + code output |
| Cursor | IDE-based iteration, existing codebase edits | In-context editing |
| Antigravity | Rapid Next.js/Tailwind scaffolding | Fast MVP |
| DeepSeek V4 Pro | Swarm agent 1, complex code at low cost | Cost-efficient generation |
| Framer | Interactive prototypes, motion-heavy sites | Built-in animations |
| Webflow | CMS-driven, non-technical client editing | Visual CMS |
| Gemini Flash | Swarm agents 2-5, parallel generation | Parallel throughput |

## 7-Phase Website Factory

```
Phase 1: RESEARCH
  → video-intelligence (competitor sites)
  → design-taste-frontend (client brand extraction)
  → Output: Visual Intelligence Report

Phase 2: DESIGN DNA
  → spaceage-savo-creative-director-os
  → Output: Design DNA Package (colors, fonts, motion, vibe)

Phase 3: GENOME SELECTION
  → Pattern Genome Library (layout patterns)
  → Hero Genome (hero formula selection)
  → Output: Section Blueprint

Phase 4: MOTION + CONVERSION BLUEPRINT
  → design-motion-principles (motion spec)
  → Conversion Psychology (CTA placement, proof hierarchy)
  → Output: Motion Spec Table + Conversion Map

Phase 5: HANDOFF PACKAGE (this skill)
  → Compile all Phase 1-4 outputs into Universal Build Handoff
  → Output: Structured YAML handoff package

Phase 6: BUILD
  → Route to correct builder per routing table
  → Output: Production HTML / Next.js / Framer / Webflow

Phase 7: QA
  → Run 35-point design checklist (design-taste-frontend)
  → Run motion audit (design-motion-principles)
  → Run accessibility + performance gates
  → Output: QA Pass or Rejection List
```

## VL-01 Enforcement Checklist (Required in Every Handoff)

- [ ] BG: `#050508` (or client-approved dark)
- [ ] Glass surface: `rgba(255,255,255,0.04)` with `backdrop-filter: blur(20px)`
- [ ] Hero: Full viewport, GSAP entrance, jumbo type
- [ ] Font: Orbitron/Space Grotesk (display), DM Sans (body), JetBrains Mono (code/mono)
- [ ] Motion: Lenis + GSAP ScrollTrigger initialized
- [ ] Reduced motion: fallback present
- [ ] Mobile: all sections tested at 375px width
- [ ] CTA: Above fold, high contrast, outcome-focused copy

## Handoff to Claude Code (Prompt Wrapper)

```
You are implementing a Space Age Website Factory build.
You have been handed a Universal Build Handoff Package.
Follow it exactly. Do not add features not in the package.
Do not use fonts, colors, or components not specified.
Do not skip the motion spec.
Do not ship without the reduced-motion fallback.

[PASTE HANDOFF YAML HERE]
```

## Handoff to Codex

```
Website build task. Spec is locked. Implement only what's in the package.
Stack: [framework], [styling], [motion library]
Brand tokens: [paste tokens block]
Sections: [paste sections array]
Motion spec: [paste motion spec]

Do not freestyle. Do not add sections not listed. Ship the handoff.
```
