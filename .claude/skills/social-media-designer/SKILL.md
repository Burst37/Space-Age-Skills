---
name: social-media-designer
version: 1.0
description: Full-service social media brand design skill. Creates brand-consistent visual systems for Instagram, TikTok, LinkedIn, and other platforms. Covers templates, content calendars, and creative direction.
allowed-tools: Read, Write
---

# SOCIAL MEDIA DESIGNER v1.0
## Space Age AI Solutions — Social Media Brand Design

## When to load this skill

- Client needs a social media visual identity
- Creating Instagram/TikTok/LinkedIn templates or templates
- Building a content calendar with visual direction
- Brand needs social media aesthetic direction

---

## PLATFORM DESIGN SPECIFICATIONS

### Instagram
```yaml
feed_post:
  dimensions: "1080 x 1080 (1:1) or 1080 x 1350 (4:5)"
  safe_zone: "Avoid text in bottom 250px (covered by UI)"
  font_min: "24px minimum for readability"

reels:
  dimensions: "1080 x 1920 (9:16)"
  safe_zones:
    top: "150px (status bar + header)"
    bottom: "300px (controls + caption)"
    sides: "50px each"

story:
  dimensions: "1080 x 1920"
  interactive_zone: "Middle 60% of screen"
```

### TikTok
```yaml
video:
  dimensions: "1080 x 1920 (9:16)"
  text_safe_zone: "Top 15% and bottom 20% — avoid both"
  thumbnail: "Center 80% of frame"
```

### LinkedIn
```yaml
feed_post: "1200 x 1200 (1:1) or 1200 x 628 (1.91:1)"
banner: "1128 x 191"
article_cover: "1280 x 720"
```

---

## BRAND VISUAL SYSTEM (Social)

### Color Application Rules

```
PRIMARY: Used on hero images, key text, CTA elements
SECONDARY: Supporting graphics, borders, icon fills
ACCENT: Badges, tags, highlights, data callouts
NEUTRAL DARK: Backgrounds for text-heavy posts
NEUTRAL LIGHT: Quote backgrounds, clean layouts
```

### Template Types

```
QUOTE POST — brand voice quote on solid/gradient background
INFO CARD — value/tip with icon and supporting text
ANNOUNCEMENT — product/service launch, bold headline
BEHIND THE SCENES — authentic moment, minimal text
CARROUSEL OPENER — bold hook slide, max 8 words
TESTIMONIAL — client quote with photo/avatar
CTA POST — offer or action-focused
```

---

## CONTENT CALENDAR FRAMEWORK

### Weekly Post Mix (recommended)

```
MON: Value/educational post
WED: Behind the scenes / authentic
FRI: Social proof / testimonial
SUN: CTA or promotional
+ 1 Reel/video per week
```

### Monthly Content Pillars

Choose 3-5 content pillars per brand:
```
EDUCATION — teach something
INSPIRATION — motivate or aspire
SOCIAL PROOF — results and testimonials
BEHIND THE BRAND — process and culture
PROMOTION — offers and CTAs (max 20% of content)
```

---

## DESIGN HANDOFF

After designing social media system:
1. Deliver template files (Canva / Figma)
2. Color hex codes + font stack
3. 2-week starter content calendar
4. Caption framework per post type
5. Hashtag strategy (niche + engagement tags)

---

## PIPELINE INTEGRATION

- Brand inputs: `brand-extractor` → `sa-design-md`
- Content copy: `ai-content-creator`
- Video content: `music-video-editor` or `cinematic-video-architect`
- Image generation: `production-pipeline-orchestrator` Phase 2
