---
name: sa-orchestrator-v2
version: 2.0.0
description: Universal capability reasoning engine for Space Age AI Solutions. v2 variant with updated skill paths. Identical to sa-orchestrator but references ~/.claude/skills/ paths.
allowed-tools: Read, Write, Bash
---

# SA-ORCHESTRATOR v2.0.0
## Space Age AI Solutions — Universal Capability Reasoning Engine

**Note:** This is the v2 variant. See `sa-orchestrator` for full documentation. Skill paths reference `~/.claude/skills/`.

## When to load this skill

- Incoming task doesn't map cleanly to a specific skill
- User request spans multiple domains
- Need to determine the right execution path

---

## SKILL REGISTRY (~/.claude/skills/)

```yaml
orchestration:
  - sa-orchestrator
  - production-pipeline-orchestrator
  - post-production-orchestrator
  - hermes-agent

creative:
  - ai-content-creator
  - music-video-editor
  - cinematic-video-architect
  - seedance-prompt-engineer
  - sa-character-sheet
  - record-exec-in-a-box

design_web:
  - brand-extractor
  - sa-design-md
  - ui-ux-designer
  - social-media-designer
  - page-upgrade
  - framer-web-design
  - framer-shaders
  - tweak

animation:
  - SA-immersive-reveal
  - SA-3d-slider
  - SA-explode-to-menu

shopify:
  - shopify-mcp
  - shopify-theme-dev

platforms:
  - tiktok-mcp
  - youtube-mcp
  - vapi-orchestrator
  - sa-email
  - gemini-cli
  - opencode
  - claude-code-router

browser_web:
  - browserbase-browser
  - browserbase-cli
  - browserbase-fetch
  - browserbase-scraper
  - firecrawl-mcp

business:
  - claude-for-legal
  - credit-repair

developer:
  - karpathy-guidelines
  - calibrate
  - sa-watch
```

## Routing

Load `sa-orchestrator` for the full routing decision tree and orchestration rules.
