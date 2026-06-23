---
name: sa-presentation-engine
description: >
  SA-supercharged version of presenton/presenton (~4.8k stars) — open-source
  Gamma alternative, self-hostable, MCP-native, Docker deploy. Combined with
  VL-01 Dark Glassmorphism design standards and Gamma MCP for cloud delivery.
  Two modes: PRESENTON (self-hosted, PPTX/PDF export) and GAMMA MCP (cloud,
  shareable links). Use for: client pitch decks, Space Age investor decks,
  artist EPK slides, onboarding decks, lead gen explainers.
  Trigger: "make a deck", "pitch deck", "slide deck", "onboarding slides",
  "EPK slides", "investor presentation", "create a presentation".
license: Space Age AI Solutions — internal use
---

# SA Presentation Engine Skill
## Base: presenton/presenton + Gamma MCP | SA-extended May 2026

---

## MODE DECISION MATRIX

Client-facing deliverable -> GAMMA MCP (polished, shareable link)
Internal operations deck -> PRESENTON (self-hosted, PPTX export)
Artist EPK slides -> GAMMA MCP (branded theme + cinematic)
Investor/partner pitch -> GAMMA MCP (professional delivery)
Lead gen explainer -> PRESENTON (fast, template-based)
Training/onboarding -> PRESENTON (PDF export for distribution)

---

## PRESENTON SETUP

Docker (one-line):
docker run -d -p 5000:80 -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY --name presenton ghcr.io/presenton/presenton:latest

SA VPS (146.190.78.120):
docker run -d -p 5000:80 \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY \
  -e DEEPSEEK_BASE_URL=https://api.deepseek.com/v1 \
  --name presenton --restart unless-stopped \
  ghcr.io/presenton/presenton:latest

Hermes trigger: /deck <topic> <slide_count>

MCP Integration:
Add to Claude Code MCP config:
{ "presenton": { "url": "http://146.190.78.120:5000/mcp" } }

---

## VL-01 DARK GLASSMORPHISM SLIDE THEME

Background: #050508 (NEVER pure black)
Secondary BG: #0a0a0f
Glass card: rgba(255,255,255,0.04)
Glass border: rgba(255,255,255,0.08)
Glass blur: blur(40px) saturate(180%)

Typography (Fontsource CDN):
Heading: Orbitron (title slides only)
Body: DM Sans
Data: JetBrains Mono

Colors:
Primary: #FF6B00 (SA orange)
Accent: #00FF94 (lime green)
Text: #F0F0F0

---

## SLIDE LAYOUT TEMPLATES

Title Slide:
- Full bleed dark bg
- Top-left: SA logo mark
- Center: H1 Orbitron 64px left-aligned
- Below: Subtitle DM Sans 24px muted
- Bottom-left: Date/version | Bottom-right: Name
- Single #FF6B00 horizontal rule under H1

Content Slide (3-col):
- Section label: JetBrains Mono small caps orange
- H2: DM Sans Bold 36px
- 3 glass cards: icon + headline + 2 bullets
- Footer: slide number + brand mark

Metrics Slide:
- 3-4 big number cells, JetBrains Mono 72px, orange
- Label below each, DM Sans 14px muted
- Context text 1 sentence right-aligned

Image + Text Split:
- Left 55%: full-bleed image or Higgsfield visual
- Right 45%: dark glass panel, headline + 3 bullets + CTA

---

## SA PRESENTATION TEMPLATES

Space Age Agency Pitch (9 slides):
1. Title: "AI That Builds. Automatically."
2. Problem: Local businesses with no web presence
3. Solution: 5-agent swarm, 25-80 sites/day
4. Product: Cinematic websites at $300-750
5. Pipeline: Lead -> Brief -> Site -> Outreach -> Close
6. Results: Live pipeline metrics
7. Sub-brands: 6 active verticals
8. Technology: Agent stack diagram
9. Ask / Next Step

Artist EPK Deck (8 slides):
1. Artist name + Higgsfield Soul ID hero image
2. Bio: 100 words, present tense, no AI slop
3. Sound: Genre, influences, comparable artists
4. Top tracks: 3 releases with streaming numbers
5. Visuals: 4 AI-generated artist images
6. Social presence: follower counts + engagement
7. Press / highlights
8. Booking / management contact

Client Website Proposal (8 slides):
1. "[Business Name] — Digital Presence Upgrade"
2. Current state audit (screenshot + gaps)
3. Proposed design (mockup or Stitch preview)
4. What's included
5. Investment: $300/500/750 tiers
6. Timeline: 48-hour delivery
7. Samples: 3 comparable sites built
8. Next step CTA

---

## SCRIPT GENERATION (DeepSeek V4 Pro)

Prompt template:
Generate {slide_count} slides for {topic}, audience {audience}, goal {goal}.
Each slide: title (max 8 words) + 3 bullets (max 12 words each).
No AI openers. Data-backed claims only. Progressive narrative.
Final slide: one clear action. Output as JSON array.

---

## EXPORT

PPTX: curl http://localhost:5000/export/pptx?presentation_id=<id>
PDF: curl http://localhost:5000/export/pdf?presentation_id=<id>

---

## REPOS

- https://github.com/presenton/presenton (~4.8k stars, Apache 2.0)
- https://github.com/calcom/cal.diy (scheduling for booking CTAs)
