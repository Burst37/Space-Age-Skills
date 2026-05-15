---
name: SA-zoom-out
description: >
  Tells Claude to step back from the code/task level and explain what a system,
  pipeline component, or codebase section does in the context of the entire Space Age
  operation. Use when: encountering an unfamiliar file or script on the VPS, reviewing
  a pipeline component built in a previous session, onboarding a sub-agent to an existing
  codebase, trying to understand how a piece fits into the full 5-agent swarm, or when
  deep in implementation and need to re-orient before the next decision.
  Trigger on: "zoom out", "big picture", "how does this fit", "what is this file doing",
  "explain the system", "orient me", "what does this whole thing do", "I'm lost in the code",
  "explain this in context", or any when Mr. Black pastes code that's been dormant for weeks.
allowed-tools: Read, Bash
---

# SA-Zoom-Out — Space Age System Orientation Skill

Adapted from Matt Pocock's /zoom-out skill. Upgraded with Space Age infrastructure
map and pipeline topology so every orientation response includes system context.

---

## The Problem This Solves

After weeks of building across VPS, Claude Code, Claude.ai, and Antigravity IDE,
individual files lose their narrative. You open a script from 3 weeks ago and can't
instantly answer: where does this fire? What feeds it? What does it produce?

Zoom-out forces system-level framing before going deeper.

---

## Execution Steps

### Step 1 — Read the Code / File

Don't ask questions first. Read the code.
cat [file] | head -100
Or on VPS: ssh root@146.190.78.120 "cat [path]"

### Step 2 — SA System Map Lookup

Map against the Space Age pipeline topology:

LEAD ACQUISITION LAYER
  Google Maps Playwright Scraper (4-file Node.js package)
    ↓
  leads.csv → Google Sheets

BRIEF GENERATION LAYER
  SA lead-to-brief skill
    ↓
  build_brief.json per lead

SITE BUILD LAYER
  5-agent swarm (Claude orchestrates)
    DeepSeek V4 Pro, Gemini Flash, Minimax 2.7, Codex, Gemma
  cinematic-website-builder skill
    ↓
  /outputs/[lead-id].html

OUTREACH LAYER
  SA outreach-copywriter skill → email + Vapi script
  SA vapi-orchestrator skill → Vapi API → deployed call
  SA voice agent (Gemini Flash 3.1 TTS + Firecrawl rapport profiles)
    ↓
  Google Calendar booking

CONTROL LAYER
  Hermes Agent (DO VPS 146.190.78.120)
  Telegram bot control
  n8n/Make automation backbone

SUB-BRAND STORES
  TheOtherLevelOnline (Shopify dropship)
  WYSIWYG Eyewear (Shopify configurator)
  Pilot's Son Apparel Co. (custom HTML + Shopify Buy Button)
  Space Age Credit Solutions (credit repair)
  Record Exec in a Box (Space Age Entertainment)

### Step 3 — Orient the Code

Output structured orientation:

ZOOM-OUT: [filename or system name]
LAYER:     [Which pipeline layer]
PURPOSE:   [One sentence]
INPUTS:    [What feeds this]
OUTPUTS:   [What this produces]
TRIGGERS:  [What starts this — cron, webhook, manual, n8n, Telegram]
CALLED BY: [What calls this]
CALLS:     [What this calls downstream]
STATUS:    [Active / Built but not deployed / Deprecated / Unknown]

### Step 4 — Flag Risks

RISK: [What could break if you modify this without knowing the context]
DEPENDENCY: [Other component that depends on this]
RECOMMENDATION: [Suggested approach given full system context]

---

## Variant: VPS Full System Scan

When called on VPS without a specific file:
ssh root@146.190.78.120 "pm2 list && crontab -l && ls /var/www/ && ls /home/"
Output a complete running-services map.

---

## Variant: Skill Catalog Zoom-Out

When asked "what skills do we have" or "what can this system do":
List all SA skills at /mnt/skills/user/ with one-line purpose, organized by pipeline layer:
Acquisition → Brief → Build → Outreach → Control → Sub-brand

---

## Integration with SA-Diagnose

When zoom-out reveals a component that looks broken or orphaned:
"This file appears to be [layer] component but [signal that suggests problem].
Want to run SA-diagnose on it?"
