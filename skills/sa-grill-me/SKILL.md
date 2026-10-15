---  
name: SA-grill-me  
description: >  
 Relentless requirements interviewing skill adapted for Space Age AI Solutions pipeline.  
 Use IMMEDIATELY when starting ANY new project, client engagement, feature build, or pipeline  
 component — before writing a single line of code or copy. Conducts branch-by-branch decision  
 tree resolution so Claude and Mr. Black reach shared understanding before execution. Eliminates  
 the #1 failure mode: agent builds the wrong thing. Trigger on: "grill me", "let's plan this",  
 "I want to build X", "new client", "new feature", any vague project description, or any time  
 a build brief is being formed. ALSO trigger for non-code scenarios: naming, positioning,  
 pricing, campaign strategy, outreach copy direction. This skill runs BEFORE lead-to-brief,  
 outreach-copywriter, cinematic-website-builder, or any production skill.  
allowed-tools: Read, Bash  
---  
  
# SA-Grill-Me — Space Age Requirements Interviewer  
  
Adapted from Matt Pocock's `/grill-me` skill. Core mechanic preserved, SA pipeline  
context injected. Eliminates YOLO→spaghetti failure mode for Space Age projects.  
  
---  
  
## The Problem This Solves  
  
Agents (and humans) converge to "understood" too fast. What looks like understanding is  
literally interpretation. By the time you see the output, 3 sessions of work are  
wasted because the foundation was wrong.  
  
Pocock's insight: **the fix is a grilling session** — force the decision tree to be  
walked completely before any tool fires.  
  
---  
  
## Trigger Conditions  
  
Fire this skill when:  
  
- Mr. Black describes a new project, feature, or client even loosely  
- A new lead arrives and needs a site built  
- A pipeline step needs to be designed or rebuilt  
- Any SA sub-brand needs a strategic decision  
- Naming, pricing, offer structure is being figured out  
- Outreach copy direction hasn't been locked  
- A new automation component is being specced  
- Anything where "I'll figure it out as I go" is tempting  
  
**Do NOT skip grill-me to save time. It always costs more time than it saves.**  
  
---  
  
## The Interview Loop  
  
### Step 1 — Open  
  
Acknowledge what the user said. State what you understood. Then say:  
  
> "Before I build anything, I need to grill you on this. I'll ask one question at a  
> time. Some will feel obvious. Answer them anyway — the point is to surface hidden  
> decisions, not test your knowledge."  
  
### Step 2 — Question Cadence  
  
- **One question per message.** Never bundle.  
- Always suggest an answer with the question (reduces friction, forces reaction rather than invention)  
- Format: `[Question]? My guess: [suggested default]. Correct me or confirm.`  
- After answer: acknowledge, then probe the branch it opens  
- Never move forward until each branch is fully resolved  
  
### Step 3 — SA Context Injection  
  
For every question category, apply Space Age pipeline awareness:  
  
| Topic | SA-Specific Probe |  
|-------|------------------|  
| Target audience | Local? National? What city? What vertical? |  
| Offer | $300/$450/$750 site tier? Or custom? |  
| Differentiator | What do they have that the 5 competitors don't? |  
| Timeline | Is this pipeline (scrape→build→outreach) or direct client? |  
| Visual direction | Archetype: luxury/clinical/bold/cinematic/playful? |  
| Copy tone | Professional/street/aspirational/authoritative? |  
| CTA | Book call / buy now / get quote / contact? |  
| Tech stack | HTML single-file / Shopify / n8n / Vapi / Telegram? |  
| Domain | Do they have one? Does it need buying? |  
| SEO | Local? National? Schema needed? |  
| Budget | Who's paying — pipeline lead or paying client? |  
| Success metric | Close rate / traffic / leads / brand awareness? |  
  
### Step 4 — Depth Triggers  
  
When the answer reveals ambiguity, escalate depth:  
  
> "You said [X]. That branches into two different approaches:  
> - Path A: [describe]  
> - Path B: [describe]  
> Which one? Or is there a third option I'm not seeing?"  
  
Keep branching until all paths resolve to a single direction.  
  
### Step 5 — Completion Signal  
  
When the decision tree is fully resolved, output a **SA Build Brief** block:  
  
```  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
SA BUILD BRIEF  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
Project: [name]  
Client/Lead: [name, city, vertical]  
Offer Tier: [$X — pipeline / direct client]  
Visual Archetype: [luxury/bold/cinematic/etc]  
Copy Tone: [professional/street/etc]  
Primary CTA: [book/buy/contact]  
Tech Stack: [HTML/Shopify/etc]  
SEO: [local/national/none]  
Key Differentiator: [1 sentence]  
Success Metric: [measurable]  
Next Skill: [→ which SA skill fires next]  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
```  
  
---  
  
## SA Pipeline Handoff  
  
| Project Type | After Grill → Next Skill |  
|-------------|--------------------------|  
| Lead gen site | → `lead-to-brief` → `cinematic-website-builder` |  
| Client site | → `ui-ux-designer` → `cinematic-website-builder` |  
| Outreach campaign | → `outreach-copywriter` |  
| Voice agent setup | → `vapi-orchestrator` |  
| Shopify store | → `shopify-cinematic-builder` |  
| Social content | → `social-media-designer` |  
| Music/artist | → `record-exec-in-a-box` |  
| Credit client | → `credit-repair` |  
  
---  
  
## Anti-Patterns to Avoid  
  
- ❌ Asking multiple questions at once ("Tell me about your audience, goals, and budget")  
- ❌ Accepting vague answers without probing ("Okay, so professional tone — got it")  
- ❌ Moving to production before brief is complete  
- ❌ Assuming "I know what you mean" because it sounds familiar  
- ❌ Skipping grill because "this one is simple"  
  
---  
  
## Token Efficiency Mode  
  
For speed-critical sessions (pipeline run at scale), compress to rapid-fire 3-question  
sprint covering only: **Vertical / Tone / CTA**. Then lock brief. Use only when the  
project type is a known pipeline template with no novel decisions.  
  
---  
  
## Variant: SA-Grill-With-Context  
  
For established SA sub-brands (WYSIWYG Eyewear, Pilot's Son, Encore Home Care, etc.),  
pull existing brand context from memory first. Pre-answer known fields. Only grill on  
the delta — what's new or changed about this specific build.  
  
> "I know [Brand] — [summarize known context]. The only open questions are [X, Y, Z].  
> Let's resolve those."  
