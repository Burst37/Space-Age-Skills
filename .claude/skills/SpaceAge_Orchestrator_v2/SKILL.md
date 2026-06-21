---
name: SpaceAge_Orchestrator_v2
description: >
  SA-ORCHESTRATOR — Autonomous Capability Router. Class: Meta-Skill. Priority: HIGHEST.
  Loads before everything else. Fires on every message. Routes any input (URL, file, text,
  fragment) to the correct skill/MCP/CLI automatically. Zero manual invocation. Zero /commands.
  Claude reads intent → consults Capability Registry → executes highest-confidence match → delivers output.
---

# SA-ORCHESTRATOR — Autonomous Capability Router

**Version:** 1.0.0 | **Class:** Meta-Skill | **Priority:** HIGHEST — loads before everything else

## WHAT THIS IS

This is the **routing brain** of the Space Age AI Solutions capability stack.

It gives Claude complete awareness of every skill, MCP, CLI, and plugin available — and maps any raw input (URL, file, description, fragment, question) to the right tool automatically. Zero manual invocation. Zero `/commands`. Zero "use X for this."

Claude reads intent → consults this registry → executes the highest-confidence match → delivers output.

## HOW IT WORKS — 4-STEP LOOP

Every message enters this loop before Claude does anything else:

```
INPUT (url / file / text / fragment)
↓
STEP 1: SIGNAL EXTRACTION
Extract: URLs, file extensions, keywords, entity types, intent verbs
↓
STEP 2: REGISTRY MATCH
Score every capability against extracted signals
Highest confidence score wins
↓
STEP 3: CONFLICT RESOLUTION (if tie)
SA Skills > MCPs > CLIs > Plugins > General Knowledge
↓
STEP 4: SILENT EXECUTION
Load the winning capability
Execute immediately
Deliver output (footnote tool used only if directly relevant)
```

## SIGNAL EXTRACTION RULES

| Signal Type | Examples | How to Extract |
|---|---|---|
| URL pattern | youtu.be, github.com, shopify.com, figma.com | Parse domain + path |
| File extension | .mp4, .pdf, .docx, .xlsx, .png, .mov | Scan for extensions |
| Entity name | brand names, artist names, business names | Named entity recognition |
| Intent verb | "build", "generate", "analyze", "fix", "write", "design" | First verb in message |
| Domain signal | "credit", "music", "video", "website", "landing page" | Topic classifier |
| Urgency/mode | "quick", "draft", "full", "cinematic", "production" | Modifier extraction |
| Pipeline signal | "lead", "outreach", "brief", "pipeline", "swarm" | Pipeline keyword match |

## CAPABILITY REGISTRY

### TIER 1 — SA USER SKILLS
*Highest priority. Always checked first.*

**`sa-watch / video-intelligence`**
- Path: `.claude/skills/video-intelligence/SKILL.md`
- Fires on: ANY video URL (youtube, vimeo, tiktok, loom, instagram, x.com/video), .mp4, .mov, .mkv, .webm file path, words "watch", "video", "clip", "reel", "recording", "screen recording"
- Do NOT wait for /watch — fire immediately
- Default flags: --no-whisper

**`cinematic-website-builder`** (alias: website-intelligence)
- Path: `.claude/skills/website-intelligence/SKILL.md`
- Fires on: "build a site", "landing page", "website", "web page", "hero section", "single page", any HTML deliverable request, receiving a Handoff Package from ui-ux-designer
- Prerequisite check: has ui-ux-designer run? If not, load spaceage-savo-creative-director-os first

**`spaceage-savo-creative-director-os`** (ui-ux-designer)
- Path: `.claude/skills/spaceage-savo-creative-director-os/SKILL.md`
- Fires on: "design direction", "wireframe", "moodboard", "what should it look like", "layout", "color palette for", "typography for", any build request where visual direction is NOT yet established
- Always runs BEFORE cinematic-website-builder unless a Handoff Package already exists

**`design-taste-frontend`** (brand-extractor + design taste)
- Path: `.claude/skills/design-taste-frontend/SKILL.md`
- Fires on: any client URL provided, "match their branding", "use their colors", "analyze this website", named client with known website, any URL that isn't video/GitHub/doc
- Runs BEFORE ui-ux-designer and cinematic-website-builder in client work

**`sa-higgsfield-operator`**
- Fires on: "generate image", "generate video", "create a visual", "make a photo", "make a video", any Higgsfield model name (Seedance, Kling, NanoBanana, Soul, Veo, Hailuo, flux_kontext, gpt_image_2), "DTC ad", "product video", "brand kit", "virality predictor"
- ALL image/video generation routes here first — route via `mcp__Higgsfield__*`

**`cinematic-prompt-director`**
- Fires on: "write a prompt", "image prompt", "video prompt", "prompt for", any mention of NanoBanana, Kling, Seedance, Veo, Sora, Luma, Midjourney, FLUX, "cinematic shot", "scene description for AI"
- Always used when the output IS a generation prompt (not when generating directly)

**`record-exec-in-a-box`**
- Fires on: enrolled artist name, "EPK", "content calendar", "release campaign", "music marketing", "social schedule", "artist branding", "merch store", "weekly cadence", "Dre Nova"

**`social-media-designer`**
- Fires on: "Instagram post", "carousel", "social graphic", "story template", "TikTok cover", "LinkedIn post", "Facebook post", "social media content", "content template"

**`page-upgrade`**
- Fires on: client has existing site + "improve", "modernize", "redesign", "upgrade", "it looks outdated", URL shared for improvement (not analysis)

**`credit-repair`**
- Fires on: "credit repair", "dispute", "credit score", "bureau", "collection", "tradeline", "FCRA", "FDCPA", "affidavit", "pay for delete", "goodwill", "Tradeline Express", "Space Age Credit Solutions"
- ALWAYS use Accelerated Pressure Protocol Mode 3 for all credit docs

**`lead-to-brief`**
- Fires on: raw CSV row from Google Maps scraper, "convert this lead", "build a brief for", lead data with business name + phone + address + category, pipeline webhook payload

**`outreach-copywriter`** (alias: sa-anti-slop-writer)
- Path: `.claude/skills/sa-anti-slop-writer/SKILL.md`
- Fires on: receiving a build_brief, "write the email", "outreach copy", "cold email", "phone script", "vapi script", "email the lead"
- Always runs AFTER lead-to-brief produces a build_brief

**`vapi-orchestrator`** (alias: sa-voice-agent-builder)
- Path: `.claude/skills/sa-voice-agent-builder/SKILL.md`
- Fires on: "deploy the agent", "make the call", "queue the call", "set up voice agent", "vapi config", "outbound call", receiving build_brief at voice step

**`local-business-seo`** (alias: sa-local-seo-geo)
- Path: `.claude/skills/sa-local-seo-geo/SKILL.md`
- Fires on: ANY local business site build — always co-loads with cinematic-website-builder for lead gen pipeline builds
- Signals: "local business", "rank on Google", "SEO", "Google Business", "schema", "local search"

**`loyaltybot`**
- Fires on: "loyaltybot", "loyalty program", "auto-signup", "the bot", "tyjuan", "tyjuan01", "dashboard.html", "loyaltybot_server", "2724", "rewards signup"
- IMPORTANT: Standalone product, zero connection to website pipeline

**`sa-swarm-orchestrator`**
- Path: `.claude/skills/sa-swarm-orchestrator/SKILL.md`
- Fires on: "swarm", "run all agents", "parallel build", "5-agent", receiving multi-site batch
- 5-agent roster: Claude (driver), DeepSeek Pro, Gemini Flash, Minimax, Codex

**`sa-stop-slop / sa-anti-slop-writer`**
- Fires on: copy review, "check this writing", "is this good copy", "rewrite this", credit dispute letters, cold email, artist bio
- ALWAYS use sa-stop-slop rules when reviewing any written copy output

**`sa-graphify-operator`**
- Path: `.claude/skills/sa-graphify-operator/SKILL.md`
- Fires on: "knowledge graph", "graphify", "map relationships", "project intelligence", "cross-project analysis"

**`sa-video-skill-extractor`**
- Fires on: video URL + "learn from this", "build a skill from this", "extract the workflow", "turn this into a SKILL.md", "replicate this"
- Distinction from video-intelligence: video-intelligence = analyze content; sa-video-skill-extractor = convert to reusable skill

**`universal-build-handoff`**
- Path: `.claude/skills/universal-build-handoff/SKILL.md`
- Fires on: "hand off to builder", "create handoff package", "send to Codex/Cursor/Antigravity", completing any design phase

**`three-brain`**
- Path: `.claude/skills/three-brain/SKILL.md`
- Fires on: "check your work", "review your code", "second opinion", "sanity check", auth/billing/migration file edits (forced), Claude failing same task 2x in a row, video/audio file analysis, whole-repo scan

**`design-motion-principles`**
- Path: `.claude/skills/design-motion-principles/SKILL.md`
- Fires on: "GSAP", "ScrollTrigger", "Lenis", "animation spec", "motion choreography", "reduced motion"

### TIER 2 — PUBLIC SKILLS

| Skill | Fires On |
|---|---|
| docx | .docx request, "Word doc", "download as Word" |
| pdf | .pdf request, "create a PDF", "fill this PDF" |
| pdf-reading | .pdf uploaded, "read this PDF", "extract from PDF" |
| xlsx | .xlsx, "spreadsheet", "Excel file", "CSV to spreadsheet" |
| pptx | .pptx, "presentation", "slide deck", "PowerPoint" |
| quarkdown | Rich doc/report, "quarkdown", compile to HTML/PDF/slides |
| frontend-design | React/Vue component, web UI without cinematic requirement |

### TIER 3 — CONNECTED MCPs

| MCP | Fires On |
|---|---|
| Google Drive | "save to Drive", "find in Drive", "upload to Drive" — SESSION_MEMORY folder |
| Google Calendar | "schedule", "book a call", "calendar", "add event" |
| Gmail | "send email", "check email", "draft email", "my inbox" |
| Notion | "Notion", "my notes", "create a page" |
| Airtable | "Airtable", "my base", "CRM records", "update the table" |
| Supabase | "database", "Supabase", "SQL", "create table", "query" |
| Figma | "Figma", "design file", "component", "design system sync" |
| Vercel | "deploy", "Vercel", "deployment logs", "production URL" |
| Canva | "Canva template", "design in Canva" |
| GitHub (mcp__github__*) | "repo", "commit", "PR", "GitHub", "push to GitHub" |
| Zapier | "automate", "Zap", "trigger", when no direct API available |
| Make | "Make scenario", "Make workflow" |
| Apollo.io | "find leads", "prospect", "Apollo", "email lookup" |
| Higgsfield | Always route through sa-higgsfield-operator FIRST |
| Gamma | "presentation", "Gamma", "slides" — if not pptx |
| GoDaddy | "domain", "check domain", "register domain" |
| Zoom | "Zoom meeting", "recording", "meeting notes" |
| Granola | "meeting notes", "call summary", "Granola" |
| Intuit Credit Karma | "credit score", "spending" — personal use ONLY, NOT Tradeline Express client work |
| Webflow | "Webflow", "CMS", "webflow site" |

### TIER 4 — CLIs & SYSTEM TOOLS

| Tool | Fires On | Notes |
|---|---|---|
| yt-dlp | Video URLs needing download | Via video-intelligence scripts |
| ffmpeg / ffprobe | Video/audio processing, frame extraction | Via video-intelligence scripts |
| python3 | Script execution, data processing | Always available |
| node / npx | JS execution, @google/design.md CLI | Always available |
| git | Repo operations, cloning skills | Always available |
| curl / wget | Direct HTTP, API calls without MCP | Fallback when MCP unavailable |
| playwright | Browser automation, loyalty bot, scraping | LoyaltyBot + Google Maps scraper |
| rclone | Google Drive sync from VPS | Skill backups to Space Age Skills folder |
| ssh | VPS access (146.190.78.120) | Hermes Agent control |

### TIER 5 — AI MODEL ROUTING

| Task | Route To | API |
|---|---|---|
| Code generation / execution | DeepSeek V4 Pro | api.deepseek.com/v1 → deepseek-v4-pro |
| Fast code iteration | DeepSeek V4 Flash | api.deepseek.com/v1 → deepseek-v4-flash |
| Site builds (swarm agent 2) | Gemini Flash | generativelanguage.googleapis.com |
| Site builds (swarm agent 3) | Minimax 2.7 | Direct API |
| Site builds (swarm agent 4) | Codex | Direct API |
| Site builds (swarm agent 5) | Gemma | Direct API |
| Orchestration / planning / prompts | Claude (stay here) | Always |
| Image generation | Higgsfield MCP → sa-higgsfield-operator | Zero marginal cost |
| Code review (Claude's own work) | Codex via three-brain | git diff piped to codex exec |
| Video/audio analysis | Gemini 2.5 Pro via three-brain | gemini -p @ file |

## CONFLICT RESOLUTION MATRIX

When 2+ tools match, resolve by this priority order:
1. SA User Skill (most specific match wins)
2. SA User Skill (pipeline position — upstream before downstream)
3. Public Skill (format-specific)
4. MCP (action-specific)
5. CLI (direct execution)
6. General Claude knowledge (no tool needed)

### Common Conflicts

| Input | Conflict | Resolution |
|---|---|---|
| Client URL provided | brand-extractor vs sa-watch vs page-upgrade | design-taste-frontend first → page-upgrade if redesign requested |
| "Generate an image of X" | sa-higgsfield-operator vs cinematic-prompt-director | cinematic-prompt-director writes prompt THEN sa-higgsfield-operator executes |
| Video URL + "build a site like this" | video-intelligence vs cinematic-website-builder | video-intelligence DESIGN_EXTRACT mode → output feeds cinematic-website-builder |
| "Write the outreach" with no brief | outreach-copywriter vs lead-to-brief | lead-to-brief first → outreach-copywriter second |
| "Create a presentation" | pptx vs Gamma vs Canva | pptx if download needed; Gamma if web-first; Canva if template-based |
| Audio file uploaded | video-intelligence (Whisper) vs music-visualizer | music-visualizer if "make a visualizer"; video-intelligence if "transcribe this" |

## PIPELINE AUTO-CHAINS

These multi-step sequences fire automatically when the first signal matches.

**Chain A — Lead Gen Pipeline**
Trigger: CSV row / business data with name + address + category
1. lead-to-brief → build_brief
2. outreach-copywriter → email HTML + vapi_script
3. cinematic-website-builder + local-business-seo → site HTML
4. vapi-orchestrator → Vapi agent config

**Chain B — Client Site Build (new client)**
Trigger: Client URL + "build them a site" / "make a website for"
1. design-taste-frontend → Brand Token Package
2. spaceage-savo-creative-director-os → Handoff Package
3. cinematic-website-builder → production HTML

**Chain C — Client Site Build (Shopify)**
Trigger: Shopify store URL or "Shopify" + build request
1. design-taste-frontend → Brand Token Package
2. spaceage-savo-creative-director-os → Handoff Package
3. shopify-cinematic-builder → .liquid files

**Chain D — Video → Site**
Trigger: Video URL + "build a site like this" / "match this design"
1. video-intelligence (DESIGN_EXTRACT mode) → SA Design Token Package
2. design-taste-frontend → DESIGN.md
3. cinematic-website-builder → production HTML

**Chain E — Artist Onboarding**
Trigger: Artist name + "onboard" / "set up" / "EPK" / "content calendar"
1. record-exec-in-a-box → full artist profile
2. ai-content-creator → character reference sheet
3. social-media-designer → content template system

**Chain F — Image Generation**
Trigger: Visual generation request
1. cinematic-prompt-director → YAML prompt (150-200 words minimum)
2. sa-higgsfield-operator → Higgsfield MCP → generated asset

**Chain G — Skill from Video Tutorial**
Trigger: Tutorial URL + "learn from", "build a skill", "replicate"
1. sa-video-skill-extractor → workflow decomposition
2. skill-creator → SKILL.md synthesis
3. Google Drive MCP → save to Space Age Skills folder

## WEBSITE FACTORY PIPELINE

When building a website, follow this mandatory order:

```
Client Brief
↓ Superpowers Planning Pass (superpowers)
↓ Memory Recall (sa-obsidian-vault-ops → Google Drive)
↓ Website Type Routing (sa-local-seo-geo)
↓ Visual Intelligence Research (website-intelligence)
↓ Design DNA Extraction (spaceage-savo-creative-director-os)
↓ Design Taste + Anti-Slop (design-taste-frontend + sa-stop-slop)
↓ Motion Blueprint (design-motion-principles)
↓ Universal Build Handoff (universal-build-handoff)
↓ Builder: Codex / Claude Code / Cursor / Antigravity / DeepSeek / Gemini
↓ QA / Mobile / Accessibility / Performance
↓ Deployment (Vercel MCP)
```

**Locked Space Age Visual Signature (every site, no exceptions):**
- jumbo_typography + full_screen_animated_hero + scroll_triggers + parallax_scrolling

**Global Rejection Rule:** Reject any output that looks generic, ignores website type, skips the Space Age visual signature, uses effects without conversion purpose, lacks mobile fallback, or lacks reduced-motion fallback.

## EXECUTION RULES

**Silent Operation** — Never announce "I'm loading skill X." Execute and deliver. Only acceptable footnote at END if it adds context: *(via video-intelligence → cinematic-website-builder)*

**No Manual Invocation Required** — If the user types /skill-name honor it. But NEVER require it.

**Upstream First** — Always check if prerequisite skill should run first:
- cinematic-website-builder needs: spaceage-savo-creative-director-os (design direction) or design-taste-frontend (client URL)
- outreach-copywriter needs: lead-to-brief (build_brief)
- vapi-orchestrator needs: outreach-copywriter (vapi_script)
- sa-higgsfield-operator needs: cinematic-prompt-director (prompt)
- three-brain Codex review needs: the actual diff or code to review

**Confidence Threshold:**
- 80%+ signal match → execute silently
- 50–80% match → execute with brief inline note: "Treating this as [X] — if that's wrong, say so."
- <50% match → ask ONE clarifying question before executing

## QUICK-READ TRIGGER MAP

```
youtube.com / youtu.be / vimeo / tiktok / loom / .mp4 / .mov
  → video-intelligence

any client URL (non-video)
  → design-taste-frontend

"build a site" / "landing page" / "website"
  → spaceage-savo-creative-director-os → cinematic-website-builder

"shopify" / "store" / "liquid"
  → spaceage-savo-creative-director-os → shopify-cinematic-builder

"generate image" / "generate video" / model name
  → cinematic-prompt-director → sa-higgsfield-operator

"credit" / "dispute" / "bureau" / "affidavit"
  → credit-repair

"lead" / CSV row / business data
  → lead-to-brief → outreach-copywriter → [site + vapi]

"artist" / "EPK" / "content calendar" / "release"
  → record-exec-in-a-box

"social" / "instagram" / "carousel" / "post"
  → social-media-designer

"check your work" / "review your code" / "is this right?"
  → three-brain → Codex review (MUST-FIRE)

"design tokens" / "tailwind export" / "brand tokens"
  → design-taste-frontend

tutorial URL + "learn" / "build skill"
  → sa-video-skill-extractor

.pdf uploaded → pdf-reading skill
.docx / .xlsx / .pptx request → docx / xlsx / pptx skill
"save to Drive" / "backup" → Google Drive MCP
"schedule" / "book" → Google Calendar MCP
"email" / "inbox" → Gmail MCP
"deploy" / "Vercel" → Vercel MCP
```

## SESSION START ROUTING (SpaceAge_Orchestrator_v2 specific)

On session start, BEFORE routing any task:

1. Read Drive SESSION_MEMORY: search folder `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU` for today's `YYYY-MM-DD.md`
2. Load all Tier 0 skills: caveman (ACTIVE NOW) + superpowers + karpathy-guidelines + icm-workspace-architect + sa-obsidian-vault-ops
3. Confirm model routing: `claude-opus-4-8` heavy tasks / `claude-haiku-4-5-20251001` light tasks
4. Confirm tool priority: MCP > CLI > SDK > raw API key

Memory write at session end: completed work + pending + new IDs → same Drive file.
Credential logging: names ONLY. NEVER values.

## SKILL METADATA

```yaml
skill_id: SA-ORCHESTRATOR
version: 1.0.0
class: meta-skill
priority: highest
load_order: 0
fires_on: every_message
execution: silent
surfaces:
  - claude_code (CLAUDE.md)
  - claude_ai (skill install)
sa_skills_count: 25+
mcp_count: 24+
cli_count: 9
model_routes: 5
```
