---
name: last30days
version: "3.3.2"
description: "Research what people actually say about any topic in the last 30 days. Pulls posts and engagement from Reddit, X, YouTube, TikTok, Hacker News, Polymarket, GitHub, and the web."
argument-hint: 'last30days nvidia earnings reaction | last30days AI video tools | last30days what users want in react'
allowed-tools: Bash, Read, Write, AskUserQuestion, WebSearch
homepage: https://github.com/mvanhorn/last30days-skill
repository: https://github.com/mvanhorn/last30days-skill
author: mvanhorn
license: MIT
user-invocable: true
metadata:
  openclaw:
    emoji: "📰"
    requires:
      env: []
      optionalEnv:
        - SCRAPECREATORS_API_KEY
        - OPENAI_API_KEY
        - XAI_API_KEY
        - OPENROUTER_API_KEY
        - PARALLEL_API_KEY
        - BRAVE_API_KEY
        - APIFY_API_TOKEN
        - AUTH_TOKEN
        - CT0
        - BSKY_HANDLE
        - BSKY_APP_PASSWORD
        - TRUTHSOCIAL_TOKEN
      bins:
        - node
        - python3
    primaryEnv: SCRAPECREATORS_API_KEY
    tags:
      - research
      - deep-research
      - reddit
      - x
      - twitter
      - youtube
      - tiktok
      - hackernews
      - polymarket
      - multi-source
      - social-media
      - analysis
      - trends
      - recency
---

# last30days

Research what people actually say about any topic in the **last 30 days**.

Pulls real posts, comments, and engagement from:
- Reddit, X/Twitter, YouTube, TikTok
- Hacker News, Polymarket, GitHub
- Bluesky, TruthSocial, Instagram, Pinterest, Digg
- Web search (Brave/Perplexity)

## Usage
```
/last30days <topic>
```

## Examples
```
/last30days nvidia earnings reaction
/last30days AI video tools
/last30days what users want in react
/last30days landscaping Dallas complaints
/last30days roofing contractor near me
```

## Space Age Workflow Integration
- **Pre-pitch research**: Run before any client sales call to know their market
- **Pipeline copy fuel**: Pull pain points → use in landing page copy
- **Competitor intel**: Surface what people say about competing services
- **Content strategy**: Find what's viral in any niche before building client sites

## Scripts
Full implementation at: `skills/last30days/scripts/last30days.py`

## Setup
Primary key: `SCRAPECREATORS_API_KEY`
Optional: `OPENAI_API_KEY`, `XAI_API_KEY`, `BRAVE_API_KEY`, `APIFY_API_TOKEN`
