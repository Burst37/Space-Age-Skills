---
name: sa-presenter-engine
description: >
  SA-supercharged version of presenton/presenton (~4.8k stars) — open-source
  Gamma alternative you self-host. Generates slide decks from a prompt, exports
  to PowerPoint or PDF, runs via Docker or native desktop app. Bring your own
  LLM (OpenAI, Anthropic, Gemini, Ollama). Has a built-in MCP server so any
  agent can trigger deck generation. SA extends with: VL-01 Dark Glassmorphism
  theme for Space Age decks, client proposal templates, pitch deck templates
  for all SA sub-brands, integration with the cinematic-website-builder visual
  system, and Hermes Agent /make-deck Telegram command. Use when: building a
  client proposal, pitch deck, investor deck, onboarding presentation, service
  overview, or any slide deliverable. Trigger: "make a deck", "build slides",
  "client proposal", "pitch deck", "presentation", "PowerPoint", "PDF slides".
license: Space Age AI Solutions — internal use
---

# SA Presenter Engine Skill
## Base: presenton/presenton | SA-extended May 2026

---

## WHAT THIS SKILL DOES

Self-hosted presentation generator. Prompt → slides → PowerPoint/PDF.
No Gamma subscription. No Canva lock-in. Runs on your VPS or local machine.
SA extends with dark glassmorphism themes, client proposal templates, and
Hermes Agent Telegram command for on-demand deck generation.

---

## INSTALL

### Docker (VPS — Recommended)
```bash
# On DigitalOcean 146.190.78.120
docker run -d \
  --name presenton \
  -p 5000:80 \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY \
  ghcr.io/presenton/presenton:latest

# Access at: http://146.190.78.120:5000
```

### Desktop App
```bash
# Mac
brew install --cask presenton

# Windows / Linux
# Download from: https://presenton.ai → Desktop App
```

### SA LLM Routing
```
Primary: Claude claude-sonnet-4-20250514 (Anthropic key)
Fallback: DeepSeek V4 Pro (cheapest, fast)
Local option: Ollama + llama3.3 (fully offline)
```

---

## MCP SERVER (Agent Trigger)

Presenton ships a built-in MCP server — any agent (Claude Code, Hermes)
can trigger deck generation programmatically:

```json
// Add to Claude Code MCP config
{
  "mcpServers": {
    "presenton": {
      "url": "http://146.190.78.120:5000/mcp",
      "transport": "http"
    }
  }
}
```

```typescript
// Available MCP tools after connection
generate_presentation(prompt: string, theme?: string, slides?: number)
export_to_pptx(presentation_id: string)
export_to_pdf(presentation_id: string)
list_templates()
apply_template(presentation_id: string, template_id: string)
```

### Hermes Agent Command
```python
# Telegram: /make-deck <topic> [slides] [format]
# Example: /make-deck "Space Age AI Services Overview" 12 pptx

@bot.message_handler(commands=['make-deck'])
async def make_deck(message):
    args = message.text.split()[1:]
    topic = args[0] if args else "Space Age AI Solutions"
    slides = int(args[1]) if len(args) > 1 else 10
    fmt = args[2] if len(args) > 2 else "pptx"

    result = await presenton_mcp.generate_presentation(
        prompt=topic,
        theme="sa-dark-glass",
        slides=slides
    )
    file = await presenton_mcp.export_to_pptx(result.id)
    await bot.send_document(message.chat.id, file)
```

---

## SA THEME: VL-01 DARK GLASSMORPHISM

Custom Presenton theme matching Space Age brand standards:

```json
{
  "theme_id": "sa-dark-glass",
  "name": "Space Age Dark Glassmorphism",
  "colors": {
    "background": "#050508",
    "surface": "rgba(255,255,255,0.04)",
    "primary": "#FF6B00",
    "accent": "#39FF14",
    "text_primary": "#FFFFFF",
    "text_secondary": "rgba(255,255,255,0.6)",
    "border": "rgba(255,255,255,0.08)"
  },
  "typography": {
    "heading": "Orbitron",
    "body": "DM Sans",
    "data": "JetBrains Mono"
  },
  "effects": {
    "backdrop_filter": "blur(40px) saturate(180%)",
    "card_shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
    "border_radius": "16px"
  }
}
```

---

## SA DECK TEMPLATES

### Template 1: Client Website Proposal
```
Slide 1: Cover — Client name + "Your New Digital Presence"
Slide 2: Current State — Screenshot of existing site + pain points
Slide 3: The Gap — What they're losing (leads, credibility)
Slide 4: The Solution — Cinematic site mockup
Slide 5: What's Included — Feature list (cinematic, SEO, mobile)
Slide 6: Timeline — 48-hour turnaround
Slide 7: Investment — $300 / $500 / $750 tier breakdown
Slide 8: Next Step — Single CTA

Prompt template:
"Create a client website proposal deck for [BUSINESS_NAME], a [TYPE] business
in [CITY]. Current site: [URL or 'no website']. Show the gap between their
current presence and a cinematic alternative. Include investment tiers.
Dark professional theme. 8 slides."
```

### Template 2: Space Age AI Services Overview
```
Slide 1: Cover — Space Age AI Solutions
Slide 2: What We Do — 5 service lines
Slide 3: Cinematic Web Production
Slide 4: Social Media Marketing
Slide 5: AI Assistant Services
Slide 6: Lead Gen Pipeline
Slide 7: Results / Case Studies
Slide 8: Sub-Brands Overview
Slide 9: Technology Stack
Slide 10: Engagement Models + Pricing
Slide 11: Next Step

Prompt template:
"Create a company overview deck for Space Age AI Solutions, an AI-native
production agency. Services: cinematic web production, social media marketing,
AI assistants, lead gen automation, record label consulting. Dark glassmorphism
aesthetic. 11 slides. Professional but bold."
```

### Template 3: Record Exec in a Box Artist Pitch
```
Slide 1: Artist name + cover art
Slide 2: The Artist — bio snapshot, genre, stats
Slide 3: Current Presence — social + streaming numbers
Slide 4: Growth Plan — 90-day content strategy
Slide 5: Content Calendar — weekly cadence visual
Slide 6: Visual Identity — mood board + character sheet
Slide 7: Distribution + Sync Opportunities
Slide 8: Investment — monthly retainer

Prompt template:
"Create an artist development pitch deck for [ARTIST_NAME], a [GENRE] artist
from [CITY]. Include growth strategy, content calendar, and visual identity
plan. Dark music industry aesthetic. 8 slides."
```

### Template 4: Investor / Partner Deck
```
Slide 1: Cover + tagline
Slide 2: Problem
Slide 3: Solution
Slide 4: Market Size
Slide 5: Business Model
Slide 6: Traction
Slide 7: Team
Slide 8: The Ask

Prompt template:
"Create a [SEED/SERIES A] investor deck for [COMPANY]. Market: [MARKET].
Traction: [KEY METRICS]. Ask: [AMOUNT]. Keep it tight — 8 slides.
Dark professional theme."
```

---

## EXPORT WORKFLOW

```python
# Full pipeline: prompt → PPTX → Google Drive

async def generate_and_backup(topic: str, slides: int = 10):
    # 1. Generate
    deck = await presenton_mcp.generate_presentation(
        prompt=topic,
        theme="sa-dark-glass",
        slides=slides
    )

    # 2. Export PPTX
    pptx_file = await presenton_mcp.export_to_pptx(deck.id)

    # 3. Upload to Google Drive Skills folder
    drive_file = await google_drive.upload(
        file=pptx_file,
        parent_id="1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9",
        name=f"{topic}_{date.today()}.pptx"
    )

    return drive_file.url
```

---

## WHEN TO USE PRESENTON VS CANVA MCP

```
Presenton → Use when:
  - Generating from a text prompt (no existing design)
  - Need PPTX export for client delivery
  - Want full brand control via custom theme
  - Running from Hermes Agent (automated)
  - Building proposal or pitch from brief

Canva MCP → Use when:
  - Starting from an existing Canva template
  - Need specific branding assets (logos, photos)
  - Client expects Canva-style polish
  - Social media size variations needed
  - Collaborative editing required
```

---

## REPO

- https://github.com/presenton/presenton (~4.8k ⭐)
