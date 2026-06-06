---
name: brand-extractor
description: >
  Reverse-engineer any client brand identity from their website and apply it to
  deliverables.
---

# Brand Extractor — Universal Client Brand Analysis Skill
**Purpose:** Extract → Document → Apply any client brand to any deliverable
**Maintained by:** Space Age AI Solutions

## HOW THIS SKILL WORKS

Three phases, always in order:

PHASE 1: EXTRACT    → Fetch the site, pull every visual signal
PHASE 2: DOCUMENT   → Output a Brand Token Package (BTP)
PHASE 3: APPLY      → Feed the BTP into the target deliverable

Never skip Phase 1 even if you think you know the brand. Always fetch fresh.

## PHASE 1 — EXTRACTION

### Step 1: Fetch the site
Use web_fetch on the provided URL. If no URL is given, ask for it before proceeding.
Also fetch: [client URL]/about  (if homepage is sparse)

Look for:
- Inline CSS and style blocks → color values, font declarations
- link tags → external font sources
- CSS custom properties (:root { --color-primary: ... }) — these are gold
- Tailwind or Bootstrap class names that hint at the design system
- Meta tags, favicon color, theme-color

### Step 2: Visual audit checklist

Colors
- Primary brand color (most prominent CTA, header accent, or logo)
- Secondary color (supporting elements, hover states)
- Background color(s) — main, card, section alternates
- Text color(s) — body, headings, muted/secondary
- Accent / highlight color (if distinct from primary)

Typography
- Heading font — family name, weight, size range
- Body font — family name, weight, line-height
- Font source — Google Fonts URL, Adobe, self-hosted, system stack

Visual language
- Border radius style — sharp, subtle, rounded, pill
- Shadow style — none, subtle, dramatic, neumorphic
- Spacing density — tight, balanced, airy
- Button style — filled, outlined, ghost, pill, square
- Image treatment — photography, illustration, icon-heavy, no images

Tone and personality
- Industry / vertical
- Tone — corporate formal, startup casual, luxury premium, bold aggressive
- One sentence that captures the brand feeling

### Step 3: Confidence scoring
HIGH   — pulled directly from CSS/source code
MEDIUM — inferred from rendered appearance or class names
LOW    — estimated from visual description, could be off
UNKNOWN — not determinable from fetch

## PHASE 2 — BRAND TOKEN PACKAGE (BTP)

Output this exact format. Every client gets a BTP before any work begins.

BRAND TOKEN PACKAGE — [CLIENT NAME]
Site: [URL] | Extracted: [date]

COLOR TOKENS
--color-primary:     #XXXXXX  [confidence]
--color-secondary:   #XXXXXX  [confidence]
--color-bg-main:     #XXXXXX  [confidence]
--color-bg-surface:  #XXXXXX  [confidence]
--color-text-hi:     #XXXXXX  [confidence]
--color-text-mid:    #XXXXXX  [confidence]
--color-accent:      #XXXXXX  [confidence]

TYPOGRAPHY TOKENS
--font-display:  [Font Name], [fallback stack]
--font-body:     [Font Name], [fallback stack]
--font-source:   [Google Fonts URL or system or self-hosted]
--font-weight-heading: [400/500/600/700/800/900]
--font-weight-body:    [300/400/500]

VISUAL LANGUAGE
--border-radius:  [0px / 4px / 8px / 12px / 20px / 9999px]
--shadow-style:   [none / subtle / elevated / dramatic]
--spacing-density: [tight / balanced / airy]
--button-style:   [filled / outlined / ghost / pill]

BRAND PERSONALITY
Industry:  [vertical]
Tone:      [adjective, adjective, adjective]
Feeling:   [one sentence that captures it]

CONFIDENCE FLAGS
[List any LOW or UNKNOWN items here]

## PHASE 3 — APPLY

Route to correct output skill based on what the client needs:
- Website / landing page    → cinematic-website-builder
- Dashboard / tool UI       → frontend-design
- Social posts / graphics   → social-media-designer
- Document / PDF / PPTX     → docx/pptx/pdf skills
- Brand style guide doc     → brand-guidelines

## QUALITY RULES

1. Never invent colors. If you cannot extract it, mark UNKNOWN and ask.
2. Never skip the BTP. Every client gets a token package before output begins.
3. Always fetch fresh. Do not rely on memory of a brand even if seen before.
4. Check for dark mode. If prefers-color-scheme dark rules exist, capture both palettes.
5. Font fallbacks matter. Always include a generic fallback stack.
6. One BTP per client session. If resuming, load the existing BTP and skip Phase 1.
