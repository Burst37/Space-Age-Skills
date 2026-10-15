---  
name: SA-to-issues  
description: >  
 Break any Space Age pipeline plan, PRD, or feature spec into independently executable  
 issues/tasks using vertical tracer-bullet slices. Use when Mr. Black has a plan that  
 needs to be broken into action items, when a new pipeline component needs to be built  
 in stages, when a multi-step project needs to be tracked across sessions, or when work  
 needs to be distributed to sub-agents (DeepSeek, Gemini, Minimax). Trigger on:  
 "break this down", "give me the tasks", "create a build plan", "what's the order",  
 "make this into steps", "turn this into a checklist", "what do I need to build",  
 or after SA-grill-me outputs a complete build brief. Outputs HITL vs AFK classification  
 per task so Mr. Black knows which steps require his input vs can run autonomously.  
allowed-tools: Read, Bash  
---  
  
# SA-To-Issues — Space Age Vertical Slice Decomposer  
  
Adapted from Matt Pocock's `/to-issues` skill. Upgraded with Space Age agent routing,  
HITL/AFK classification, and pipeline-specific issue templates.  
  
---  
  
## Core Principle: Vertical Slices Only  
  
**Never horizontal slicing.** Horizontal = "finish all backend, then all frontend."  
This is the failure mode. Agent gets through backend, realizes frontend requirements  
changed, entire backend is wrong.  
  
**Vertical slice** = one thin tracer bullet through every layer for one behavior.  
Each issue is independently buildable AND testable.  
  
```  
❌ HORIZONTAL (wrong):  
 Issue 1: Build all database models  
 Issue 2: Build all API endpoints   
Issue 3: Build all UI components  
  
✅ VERTICAL (correct):  
 Issue 1: Lead arrives → stored in DB + confirmation logged [full slice]  
 Issue 2: Lead triggers site build → HTML file created at /outputs/[lead-id].html [full slice]  
 Issue 3: Site build complete → outreach email queued [full slice]  
```  
  
---  
  
## HITL vs AFK Classification  
  
Every issue gets labeled:  
  
**HITL** (Human In The Loop) — Mr. Black must make a decision or review before proceeding:  
- Visual direction approval  
- Pricing / offer decisions  
- Client-facing copy sign-off  
- Deploying to production  
- API key changes or new credentials  
- Any step where a wrong decision is expensive to reverse  
  
**AFK** (Away From Keyboard) — Agent executes autonomously, queues PR/result for review:  
- Code generation following a confirmed spec  
- Batch processing following a tested template  
- Schema migrations following approved design  
- Adding a new SA skill following the existing format  
- Unit/integration tests  
  
---  
  
## Issue Format  
  
For each issue output:  
  
```  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
ISSUE [N] | [HITL/AFK] | [BLOCKS: N+X or NONE]  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
Title: [Short verb phrase — what this issue accomplishes]  
  
Slice: [One sentence — what vertical behavior this delivers end-to-end]  
  
Acceptance Criteria:  
 ✅ [Thing 1 that must be true for this to be "done"]  
 ✅ [Thing 2]  
 ✅ [Thing 3 — no more than 4]  
  
Inputs:  
 - [What this issue needs to start — file, data, decision, credential]  
  
Outputs:  
 - [Exact deliverable — file path, endpoint, HTML, JSON, etc]  
  
Agent:  
 - [Claude / DeepSeek / Gemini / Minimax / Human — with reason]  
  
SA Skills:  
 - [Which SA skills fire for this issue]  
```  
  
---  
  
## SA Pipeline Issue Templates  
  
### Lead Gen Pipeline Issue Set  
  
Standard 8-issue decomposition for a lead→site→outreach pipeline build:  
  
```  
Issue 1 [AFK]: Google Maps scraper validates target vertical + exports CSV  
Issue 2 [HITL]: Visual archetype approved for target vertical  
Issue 3 [AFK]: lead-to-brief converts CSV row → build brief JSON  
Issue 4 [AFK]: cinematic-website-builder generates HTML from brief  
Issue 5 [HITL]: Sample site reviewed + approved for batch deployment  
Issue 6 [AFK]: outreach-copywriter generates email + Vapi script per lead  
Issue 7 [HITL]: Outreach copy reviewed + approved for send  
Issue 8 [AFK]: Vapi agent deployed + first outbound call queued  
```  
  
### New SA Sub-Brand Issue Set  
  
Standard 6-issue decomposition for launching a new sub-brand storefront:  
  
```  
Issue 1 [HITL]: Brand direction locked (grill-me output → brief)  
Issue 2 [AFK]: Visual identity generated (Higgsfield + Canva)  
Issue 3 [HITL]: Visual identity reviewed + approved  
Issue 4 [AFK]: Website/store built (cinematic-website-builder or shopify-cinematic)  
Issue 5 [HITL]: Site reviewed + approved for launch  
Issue 6 [AFK]: Site deployed + first social content queued  
```  
  
### New SA Skill Issue Set  
  
Standard 4-issue decomposition for creating a new pipeline skill:  
  
```  
Issue 1 [HITL]: Skill scope defined (SA-grill-me output → skill spec)  
Issue 2 [AFK]: SKILL.md drafted following SA naming convention  
Issue 3 [HITL]: Skill reviewed + approved  
Issue 4 [AFK]: Skill saved to /mnt/skills/user/ + backed up to Google Drive  
```  
  
---  
  
## Blocking Relationships  
  
After listing all issues, output a blocking map:  
  
```  
Issue 1 → unblocks Issue 3  
Issue 2 → unblocks Issue 4  
Issue 3 + Issue 2 → unblocks Issue 4  
Issue 5 → unblocks Issue 6 + 7 + 8  
```  
  
Issues with no blockers = can start immediately (parallel execution candidates).  
  
---  
  
## Ralph Loop Mode  
  
For fully AFK issue chains, format as a Telegram command queue the Hermes agent  
can execute autonomously:  
  
```  
/hermes run  
- issue-3: node lead-to-brief.js --input leads.csv --output briefs/  
- issue-4: node build-sites.js --input briefs/ --output sites/  
- issue-6: node generate-outreach.js --input briefs/ --output outreach/  
- issue-8: node deploy-vapi.js --input outreach/ --leads 25  
```  
  
Mr. Black comes back to results, not work-in-progress.  
  
---  
  
## Output Format Options  
  
`--format list` — numbered task list (default, good for Claude.ai)   
`--format github` — GitHub issue markdown (for repo issue tracker)   
`--format telegram` — compressed command blocks for Hermes   
`--format linear` — Linear.app ticket format   
`--format local` — `.scratch/issues.md` local file  
