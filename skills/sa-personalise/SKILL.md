---  
name: personalise  
description: Takes any external input — tutorial, repo, article, prompt, tool, framework, skill — and recommends how to adapt it to the Space Age AI Solutions ecosystem. SA-aware: knows sub-brands, tech stack, VL-01 UI standard, model routing rules, Drive backup structure, cinematic prompt conventions, and all active pipeline skills. Triggers on "personalise this", "adapt this for me", "make this fit our setup", "/personalise [thing]", or when any external repo/URL/skill is dropped in for evaluation.  
---  
  
# SA-Personalise  
## Space Age AI Solutions Edition  
  
## What This Does  
  
Drop in any external input — URL, paste, repo, skill, framework, prompt template, tutorial. Get back a focused recommendation on how (and whether) to adapt it to the Space Age pipeline. Not a generic summary. Not a blind install. A real fit assessment filtered through the SA stack, goals, and conventions.  
  
---  
  
## Trigger Phrases  
  
- `personalise this` / `personalise [thing]`  
- `/personalise [URL or description]`  
- `adapt this for me`  
- `make this fit our setup`  
- Dropping any external repo/skill/URL with implicit "should we use this?" intent  
  
---  
  
## Process  
  
### 1. Classify  
One line: what type of input is this? (skill, tool, repo, article, prompt template, workflow, framework, content piece, API, service)  
  
### 2. Pull Context (only what's needed)  
- **Always:** SA goals, active sub-brands, model routing rules, skill naming conventions  
- **For skills/code:** tech stack (Node.js, Python, Playwright, GSAP, Shopify Liquid, n8n), available APIs, VPS config (DO 146.190.78.120)  
- **For voice/content:** tone rules (direct, execution-focused, no preamble), brand voice per sub-brand  
- **For UI/visual:** VL-01 Dark Glassmorphism standard, Space Age brand colors, font roles  
- **For pipeline additions:** check existing SA- skills for overlap (grep before suggesting new)  
- **For paid services:** flag cost against Higgsfield subscription model (marginal cost = Claude tokens only)  
  
### 3. Assess Fit  
What's gold, what's mismatched, what's missing, what overlaps with what's already built.  
  
---  
  
## Output Format  
  
**What this is** — one line.  
  
**Take rate** — `HIGH` / `MEDIUM` / `LOW` / `SKIP` + one-line reason filtered through SA goals.  
  
**Personalisation Plan:**  
  
| Item | Detail |  
|---|---|  
| **Placement** | Which skill folder, which sub-brand, which pipeline stage |  
| **Rename** | Strip upstream branding → SA- prefix + descriptive name |  
| **Drop** | Anything conflicting with SA conventions (list specifically) |  
| **Add** | Links to existing SA skills it should reference or call |  
| **Adapt** | Specific SA overrides to apply (colors, fonts, model routing, etc.) |  
| **Prereqs** | Env vars, packages, infra needed |  
| **Gates** | Paid generation? External API write? Needs approval before run |  
| **Drive sync** | YES/NO — if it creates a skill file, it syncs to `1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9` |  
  
End with ONE branching question only if a real choice exists. Otherwise stop.  
  
---  
  
## SA Personalisation Lenses  
  
Apply ALL of these when assessing any input:  
  
### Pipeline Fit  
Does it slot into an existing pipeline stage?  
- Lead gen: Google Maps scraper → lead-to-brief → cinematic-website-builder → outreach-copywriter → vapi-orchestrator  
- Media: cinematic-prompt-director → sa-higgsfield-operator → music-visualizer / record-exec-in-a-box  
- Client work: brand-extractor → ui-ux-designer → google-stitch → cinematic-website-builder / shopify-cinematic-builder  
- Credit: credit-repair skill (Accelerated Pressure Protocol Mode 3)  
  
### Model Routing  
Any code execution must route correctly:  
- Claude = orchestration, planning, prompt engineering ONLY  
- DeepSeek V4 Pro (`deepseek-v4-pro`, `https://api.deepseek.com/v1`) = primary coding  
- Minimax 2.7 = secondary coding  
- Gemma = tertiary coding  
- Gemini Flash = site generation in swarm  
- Codex = site generation in swarm  
- If the external input assumes Claude does code: flag and reroute  
  
### UI/Visual Standards (VL-01 Dark Glassmorphism)  
Any UI component must use:  
- Base background: `#050508` (never pure `#000`)  
- `backdrop-filter: blur(40px) saturate(180%)`  
- Shadow system: `--shadow-sm/md/lg`  
- Specular highlights: `inset 0 1px 0 rgba(255,255,255,0.12)`  
- Fonts: Orbitron (headers), DM Sans (body), JetBrains Mono (data/labels) — Fontsource CDN only  
- Never: Google Fonts, Bunny Fonts, flat/terminal aesthetics  
  
### Brand Colors  
- Space Age agency brand: chrome gradient + electric blue — NO orange  
- Orange (`#FF6B00`): internal product UIs ONLY (LoyaltyBot dashboard, etc.)  
- If external input uses orange on agency-facing elements: flag and swap to electric blue  
  
### Naming Convention  
- Skills: `SA-[descriptive-name]` prefix required  
- Output files: specific descriptive names (e.g., `SpaceAge_VideoIntelligence_SKILL.md`)  
- Never generic names  
  
### Sub-Brand Awareness  
Match placement and tone to the correct brand:  
| Sub-Brand | Stack | Tone |  
|---|---|---|  
| Space Age AI Solutions (parent) | Full pipeline | Professional, cinematic |  
| Record Exec in a Box | Higgsfield, Vapi, content calendar | Artist-forward, creative |  
| Space Age Credit Solutions | Credit-repair skill, legal templates | Formal, Accelerated Pressure Protocol |  
| TheOtherLevelOnline | Shopify | Product-focused |  
| WYSIWYG Eyewear | Shopify + configurator | Luxury, playful (rainbow gradient cursive) |  
| The Pilot's Son Apparel Co. | Custom HTML + Shopify Buy Button | Cinematic, mythological, premium |  
| Encore Home Care Services | Cinematic landing page | Warm, trust-forward |  
  
### Overlap Detection  
Before recommending installation, grep existing skills:  
```  
ls /mnt/skills/user/ | grep -i [keyword]  
```  
If overlap found: recommend UPDATING the existing skill, not creating a new one.  
  
### Cost Gate  
Flag any input that triggers:  
- Paid model API calls beyond Higgsfield subscription  
- Outbound voice calls (Vapi)  
- External data writes (n8n, webhooks)  
- Telegram bot actions on VPS  
  
---  
  
## What NOT to Do  
  
- Do not install or apply without confirmation — recommend first, execute on go  
- Do not create a new skill if an existing one covers the same ground  
- Do not generate the adapted artifact until take rate and placement are confirmed  
- Do not route code execution to Claude  
- Do not apply orange to any Space Age agency-facing output  
- Do not use Google Fonts or Bunny Fonts in any UI output  
- Do not use generic file names  
