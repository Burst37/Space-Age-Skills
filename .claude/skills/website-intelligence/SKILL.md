---
name: website-intelligence
description: >
  Space Age website intelligence system. Uses Firecrawl MCP + visual analysis to extract
  competitor DNA, generate competitive analysis reports, and produce build briefs from
  existing websites. 6 phases: brand extraction, competitive analysis, report, build brief,
  build, QA audit. Load when given any client/competitor URL with intent to analyze or build.
---

# Website Intelligence OS

## When to Load

- Client provides a competitor URL: "build something like this"
- Client provides their own URL: "analyze my site" or "upgrade this"
- Pipeline step: brand extraction before design direction
- Post-build: QA audit against competitor benchmarks

## 6-Phase Pipeline

### Phase 1: Brand Extraction
**Input:** URL
**Tools:** Firecrawl MCP (`mcp__firecrawl__*`) or WebFetch + defuddle skill

```
Extract:
- Color palette (primary, secondary, accent, BG, text)
- Font stack (display, body, mono)
- Logo style (wordmark / icon / combination)
- Visual aesthetic (glassmorphism / brutalism / editorial / etc.)
- Motion presence (animations visible? level?)
- Layout density (spacious / medium / dense)
- Hero type (full-screen video / static image / illustrated / no hero)
- CTA style and copy
- Trust signals (testimonials, logos, credentials)
```

**Output:** Brand Token Package
```yaml
brand_tokens:
  source_url: ""
  extracted:
    bg_primary: ""
    bg_secondary: ""
    accent_primary: ""
    text_primary: ""
    font_display: ""
    font_body: ""
    aesthetic: ""
    motion_level: low|medium|high|cinematic
    layout_density: spacious|medium|dense
    hero_type: ""
    cta_copy: ""
    trust_signals: []
```

### Phase 2: Competitive Analysis
**Input:** 2-5 competitor URLs
**Tools:** Firecrawl MCP (batch) or sequential WebFetch

Compare across:
- Visual differentiation (who looks generic vs unique)
- Hero section strength (weak / medium / strong)
- Motion sophistication (static / transitional / cinematic)
- CTA clarity and conversion optimization
- Mobile experience quality
- Loading performance signals (video heavy? image heavy?)
- Trust signal density

**Output:** Competitive Gap Report (markdown table)

### Phase 3: Visual Intelligence Report

```markdown
## Visual Intelligence Report — [Client Name]

### Competitive Landscape
[3-5 competitor analysis table]

### Differentiation Opportunity
[What's missing from all competitors that we can own]

### Design DNA Recommendation
[Visual direction that differentiates + converts]

### Risk Signals
[What to avoid based on competitor patterns]
```

### Phase 4: Build Brief
**Input:** Brand tokens + Competitive analysis + Client goal

Produce a Space Age Build Brief that feeds into `universal-build-handoff`:
```yaml
build_brief:
  client: ""
  website_type: ""
  differentiation_strategy: ""
  aesthetic_route: ""
  motion_level: ""
  conversion_goal: ""
  hero_concept: ""
  color_direction: ""
  font_direction: ""
  sections: []
  must_avoid: []
  inspiration_blend: ""
```

### Phase 5: Build
Pass Build Brief to `universal-build-handoff` → route to appropriate builder.

### Phase 6: QA Audit
After build, re-run website intelligence to compare built site vs:
- Original competitor set (does it differentiate?)
- Client's old site (is it better?)
- Space Age visual signature (does it meet standards?)

## Firecrawl MCP Integration

```
# Crawl a single URL
mcp__firecrawl__scrape: { url: "https://example.com", formats: ["markdown"] }

# Crawl full site (for larger analysis)
mcp__firecrawl__crawl: { url: "https://example.com", maxDepth: 2, limit: 10 }

# Extract structured data
mcp__firecrawl__extract: { urls: ["https://example.com"], prompt: "Extract colors, fonts, and hero copy" }
```

If Firecrawl MCP not available, fallback:
1. defuddle skill on the URL
2. WebFetch on the URL
3. Screenshot via Higgsfield if visual analysis needed

## DESIGN_EXTRACT Mode

When triggered by: video URL + "build a site like this"

```
1. video-intelligence → extract visual DNA from video frames
2. website-intelligence DESIGN_EXTRACT mode:
   - Map extracted visual DNA to CSS tokens
   - Identify layout patterns visible in video
   - Score aesthetic route
3. Output: SA Design Token Package for universal-build-handoff
```

## Anti-Copy Transformation Rules

After extracting competitor DNA, apply transformation:
- Change color temperature by ±15% hue shift
- Change font to Space Age approved stack (keep weight/personality, change face)
- Increase motion sophistication by 1 level
- Add Space Age signature elements (glassmorphism layer, jumbo type)
- Maintain inspiration feel while owning the differentiation

Result: inspired-by, not copied-from.
