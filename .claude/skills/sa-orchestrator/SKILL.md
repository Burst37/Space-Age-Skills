---
name: sa-orchestrator
version: 2.0.0
description: Universal capability reasoning engine for Space Age AI Solutions. Analyzes any incoming request, maps it to the appropriate skills and tools, and orchestrates execution. Start here when the task type is unclear.
allowed-tools: Read, Write, Bash
---

# SA-ORCHESTRATOR v2.0.0
## Space Age AI Solutions — Universal Capability Reasoning Engine

## When to load this skill

- Incoming task doesn't map cleanly to a specific skill
- User request spans multiple domains
- Need to determine the right execution path
- "What should I do with this?" type questions

---

## CAPABILITY MAP

### Input Classification

Receive any task. Classify into one of:

```
CLASS: CONTENT_CREATION
  → ai-content-creator (social), music-video-editor (video), sa-email (email)

CLASS: SITE_BUILD
  → brand-extractor → sa-design-md → ui-ux-designer → production-pipeline-orchestrator

CLASS: LEAD_GEN_PIPELINE
  → production-pipeline-orchestrator (MAX)

CLASS: MUSIC_PRODUCTION
  → record-exec-in-a-box → music-video-editor → post-production-orchestrator

CLASS: SHOPIFY
  → shopify-mcp or shopify-theme-dev

CLASS: LEGAL
  → claude-for-legal

CLASS: CREDIT_REPAIR
  → credit-repair

CLASS: CODING
  → karpathy-guidelines + opencode or claude-code-router

CLASS: PLATFORM_API
  → tiktok-mcp, youtube-mcp, vapi-orchestrator, shopify-mcp

CLASS: WEB_RESEARCH
  → browserbase-scraper, firecrawl-mcp, browserbase-fetch

CLASS: DESIGN_UPGRADE
  → page-upgrade or sa-design-md + ui-ux-designer
```

---

## ROUTING DECISION TREE

```
STEP 1: Is there a specific skill in ~/.claude/skills/ that matches?
  YES → Load and use that skill
  NO  → STEP 2

STEP 2: Does this require multiple skills in sequence?
  YES → Identify the pipeline (e.g., brand-extractor → sa-design-md → ui-ux-designer)
  NO  → STEP 3

STEP 3: Does this require a platform API?
  YES → Check MCP tools available, map to skill
  NO  → STEP 4

STEP 4: Is this an orchestration task (multiple parallel workstreams)?
  YES → Use dispatching-parallel-agents skill
  NO  → Execute directly with standard Claude Code capabilities
```

---

## ORCHESTRATION RULES

1. **Never start a site build without `brand-extractor`** (unless brand tokens exist in session)
2. **Always run `sa-design-md` before any UI/UX work**
3. **All image generation via Higgsfield MCP** (production-pipeline-orchestrator handles routing)
4. **Code generation**: Claude Code orchestrates, cheaper models write code
5. **Content creation**: Always inject brand voice before generating copy

---

## OUTPUT FORMAT

When routing a task:

```
TASK ANALYSIS:
  Input: [What the user wants]
  Class: [CONTENT_CREATION / SITE_BUILD / etc.]
  Pipeline: [skill1 → skill2 → skill3]
  Starting with: [first skill to load]
  Estimated phases: [N]
  
READY TO PROCEED? [Confirm or provide missing info]
```
