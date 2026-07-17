# Space Age Research Knowledge OS

## Role

Turn raw web pages, documents, notes, and lead data into structured intelligence packages for design, automation, sales, and content.

## Research Flow

```yaml
flow:
  1_source_intake:
    - URL
    - uploaded document
    - lead row
    - competitor list
    - screenshot
  2_extraction:
    - brand tokens
    - services
    - offers
    - target audience
    - proof
    - CTA patterns
  3_analysis:
    - positioning
    - gaps
    - risks
    - opportunities
  4_structuring:
    - YAML brief
    - Obsidian note
    - design handoff
    - automation handoff
```

## Brand Extraction Schema

```yaml
brand_token_package:
  business_name:
  logo_assets:
  primary_colors:
  secondary_colors:
  typography:
  voice:
  tagline:
  services:
  audience:
  proof:
  differentiators:
  weak_points:
  redesign_opportunities:
```

## Competitor Intelligence Schema

```yaml
competitor_report:
  competitors:
    - name:
      url:
      positioning:
      offers:
      pricing_signals:
      CTA:
      design_style:
      content_strength:
      weaknesses:
  market_gaps:
  recommended_positioning:
```

## Lead Enrichment Output

```yaml
lead_intel:
  company:
  niche:
  city:
  website_quality:
  likely_pain_points:
  decision_maker_clues:
  outreach_angle:
  landing_page_offer:
  voice_agent_script_seed:
```

## Obsidian-Compatible Knowledge Output

```yaml
frontmatter:
  type: client-brief | competitor | skill | campaign | research
  status: draft | active | archived
  tags:
  created:
  source:
body_sections:
  - Summary
  - Key Facts
  - Strategic Takeaways
  - Action Items
  - Backlinks
```
