---
name: brand-extractor
description: Reverse-engineer client brand identity from URLs, social profiles, or uploaded assets. Produces a Brand Token Package (BTP) that feeds all downstream creative skills.
allowed-tools: WebFetch, Read, Write, Bash
---

# BRAND EXTRACTOR
## Space Age AI Solutions — Brand Intelligence Engine

## When to load this skill

- User provides a business URL, social handle, or brand assets
- Any site build, content creation, or design task requires brand context
- User says "extract the brand", "analyze their brand", "what's their style"
- Upstream of: `sa-design-md`, `ui-ux-designer`, `ai-content-creator`, `sa-email`

---

## PHASE 1 — BRAND EXTRACTION

### 1.1 Fetch & Analyze

For each provided URL:
1. Fetch the homepage (and About/Services pages if available)
2. Extract visual signals: color palette, typography choices, image style
3. Extract copy signals: tone, vocabulary, CTA language, taglines
4. Extract positioning: who they serve, what they promise, how they're different

### 1.2 Social Profile Analysis (if handles provided)

For Instagram/TikTok/LinkedIn:
- Caption tone and vocabulary patterns
- Content themes and recurring visual motifs
- Engagement language (how they talk to followers)
- Brand personality markers

---

## PHASE 2 — BUILD THE BRAND TOKEN PACKAGE (BTP)

Output a structured BTP:

```yaml
brand_token_package:
  brand_name: ""
  tagline: ""
  industry: ""
  
  voice:
    tone_primary: ""     # luxury / bold / warm / technical / playful
    tone_secondary: ""   # second adjective
    personality: []      # 3-5 adjectives
    example_phrases: []  # actual phrases from their copy
    forbidden_words: []  # words that break voice
    cta_style: ""        # imperative / inviting / urgent / soft
    
  colors:
    primary: ""          # hex
    secondary: ""        # hex  
    accent: ""           # hex
    background: ""       # hex
    text: ""             # hex
    palette_mood: ""     # e.g. "dark luxury", "clean tech", "warm organic"
    
  typography:
    heading_font: ""     # if identifiable
    body_font: ""        # if identifiable
    type_style: ""       # e.g. "geometric sans", "editorial serif"
    
  imagery:
    style: ""            # e.g. "cinematic photography", "flat illustration"
    subjects: []         # what appears in their visuals
    mood: ""             # the feeling their images convey
    avoid: []            # visual styles to avoid
    
  positioning:
    target_audience: ""
    core_promise: ""
    differentiator: ""
    competitors: []
    
  content_patterns:
    posting_frequency: ""
    top_themes: []
    content_formats: []
```

---

## PHASE 3 — DOWNSTREAM HANDOFF

After generating the BTP:
1. Confirm BTP with user (30-second review)
2. Save to `DESIGN.md` if building a site (use `sa-design-md` skill)
3. Pass BTP to downstream skills as session context

### Downstream consumers:
- `sa-design-md` — translates BTP into full design token system
- `ui-ux-designer` — uses BTP for cinematic design brief
- `ai-content-creator` — uses voice tokens for on-brand copy
- `sa-email` — uses voice tokens for email campaigns
- `social-media-designer` — uses visual tokens for creatives

---

## FAILURE HANDLING

| Situation | Response |
|-----------|----------|
| URL inaccessible | Try WebFetch with different approach; note gaps in BTP |
| No visual data available | Extract copy-only BTP; flag visual tokens as estimated |
| Brand is generic/unclear | Ask 3 targeted questions to fill gaps |
| Conflicting signals | Present both interpretations; ask user to confirm |
