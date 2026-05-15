---
name: sa-orchestrator
version: 1.0.0
updated: 2026-05-15
description: >
  Autonomous capability router for Space Age AI Solutions. Fires on every message before
  any other skill. Reads intent, scores every registered skill/MCP/CLI/model against
  extracted signals, resolves conflicts, and silently executes the highest-confidence
  match. Zero slash-commands required. Covers all SA user skills, public skills, connected
  MCPs, CLIs, and AI model routing. Load order: 0 — always first.
---

# SA-ORCHESTRATOR — Autonomous Capability Router
**Version:** 1.0.0 | **Class:** Meta-Skill | **Priority:** HIGHEST — loads before everything else

---

## WHAT THIS IS

This is the **routing brain** of the Space Age AI Solutions capability stack.

It gives Claude complete awareness of every skill, MCP, CLI, and plugin available —
and maps any raw input (URL, file, description, fragment, question) to the right
tool automatically. Zero manual invocation. Zero `/commands`. Zero "use X for this."

Claude reads intent → consults this registry → executes the highest-confidence match → delivers output.

---

## INSTALLATION

### Claude Code (CLAUDE.md — VPS + local)

```markdown
## ORCHESTRATOR — Autonomous Tool Router

Before responding to ANY message, run the SA Intent Classifier (defined in
~/.claude/skills/sa-orchestrator/SKILL.md). Match input signals against the
Capability Registry. Load and execute the highest-confidence skill/MCP/CLI.
Never ask the user which tool to use. Never require a / command.
The orchestrator fires on every turn. It is always active.
```

### Claude.ai (Web)

Loaded automatically when this skill is installed. It runs as the **first
evaluation pass** on every user message before any other skill is considered.

---

## HOW IT WORKS — 4-STEP LOOP

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

---

## SIGNAL EXTRACTION RULES

| Signal Type | Examples | How to Extract |
|-------------|---------|----------------|
| URL pattern | `youtu.be`, `github.com`, `shopify.com`, `figma.com` | Parse domain + path |
| File extension | `.mp4`, `.pdf`, `.docx`, `.xlsx`, `.png`, `.mov` | Scan for extensions |
| Entity name | brand names, artist names, business names, product names | Named entity recognition |
| Intent verb | "build", "generate", "analyze", "fix", "write", "design", "export" | First verb in message |
| Domain signal | "credit", "music", "video", "website", "landing page", "shoes" | Topic classifier |
| Urgency/mode | "quick", "draft", "full", "cinematic", "production" | Modifier extraction |
| Pipeline signal | "lead", "outreach", "brief", "pipeline", "swarm" | Pipeline keyword match |

---

## CAPABILITY REGISTRY

### TIER 1 — SA USER SKILLS
*Highest priority. Always checked first.*

---

**`sa-watch` / SpaceAge_VideoIntelligence**
- Path: `/mnt/skills/user/sa-watch/SKILL.md`
- Fires on: ANY video URL (youtube, vimeo, tiktok, loom, instagram, x.com/video), `.mp4`, `.mov`, `.mkv`, `.webm` file path, words "watch", "video", "clip", "reel", "recording", "screen recording"
- Do NOT wait for `/watch` — fire immediately
- Default flags: `--no-whisper`

---

**`cinematic-website-builder`**
- Path: `/mnt/skills/user/cinematic-website-builder/SKILL.md`
- Fires on: "build a site", "landing page", "website", "web page", "hero section", "single page", any HTML deliverable request, receiving a Handoff Package from ui-ux-designer
- Prerequisite check: has ui-ux-designer run? If not, load ui-ux-designer first

---

**`shopify-cinematic-builder`**
- Path: `/mnt/skills/user/shopify-cinematic-builder/SKILL.md`
- Fires on: "shopify", "store", "product page", "collection page", "shopify theme", "liquid", mentions of TheOtherLevelOnline, WYSIWYG Eyewear, Pilot's Son Apparel
- Overrides cinematic-website-builder when Shopify context is confirmed

---

**`ui-ux-designer`**
- Path: `/mnt/skills/user/ui-ux-designer/SKILL.md`
- Fires on: "design direction", "wireframe", "moodboard", "what should it look like", "layout", "color palette for", "typography for", any build request where visual direction is NOT yet established
- Always runs BEFORE cinematic-website-builder or shopify-cinematic-builder unless a Handoff Package already exists

---

**`brand-extractor`**
- Path: `/mnt/skills/user/brand-extractor/SKILL.md`
- Fires on: any client URL provided, "match their branding", "use their colors", "looks like their site", "analyze this website", named client with known website, any URL that isn't a video/GitHub/doc
- Runs BEFORE ui-ux-designer and cinematic-website-builder in client work

---

**`sa-higgsfield-operator`**
- Path: `/mnt/skills/user/sa-higgsfield-operator/SKILL.md`
- Fires on: "generate image", "generate video", "create a visual", "make a photo", "make a video", any Higgsfield model name (Seedance, Kling, NanoBanana, Soul, Veo, Hailuo, flux_kontext, gpt_image_2), "DTC ad", "product video", "brand kit", "virality predictor"
- ALL image/video generation routes here first

---

**`cinematic-prompt-director`**
- Path: `/mnt/skills/user/cinematic-prompt-director/SKILL.md`
- Fires on: "write a prompt", "image prompt", "video prompt", "prompt for", any mention of NanoBanana, Kling, Seedance, Veo, Sora, Luma, Midjourney, FLUX, "cinematic shot", "scene description for AI"
- Always used when the output IS a generation prompt (not when generating directly)

---

**`ai-content-creator`**
- Path: `/mnt/skills/user/ai-content-creator/SKILL.md`
- Fires on: artist name + visual request, "album cover", "music video", "artist shoot", "merch mockup", "character sheet", "editorial shoot", "fashion shoot", Record Exec context
- Overlaps with cinematic-prompt-director — use this when artist/music context is present

---

**`record-exec-in-a-box`**
- Path: `/mnt/skills/user/record-exec-in-a-box/SKILL.md`
- Fires on: enrolled artist name, "EPK", "content calendar", "release campaign", "music marketing", "social schedule", "artist branding", "merch store", "weekly cadence", "Dre Nova"
- Covers the full artist management workflow

---

**`social-media-designer`**
- Path: `/mnt/skills/user/social-media-designer/SKILL.md`
- Fires on: "Instagram post", "carousel", "social graphic", "story template", "TikTok cover", "LinkedIn post", "Facebook post", "social media content", "content template"

---

**`page-upgrade`**
- Path: `/mnt/skills/user/page-upgrade/SKILL.md`
- Fires on: client has existing site + "improve", "modernize", "redesign", "upgrade", "it looks outdated", URL shared for improvement (not analysis)
- Distinction from brand-extractor: brand-extractor = extract tokens; page-upgrade = full redesign workflow

---

**`credit-repair`**
- Path: `/mnt/skills/user/credit-repair/SKILL.md`
- Fires on: "credit repair", "dispute", "credit score", "bureau", "collection", "tradeline", "FCRA", "FDCPA", "affidavit", "pay for delete", "goodwill", "Tradeline Express", "Space Age Credit Solutions"
- ALWAYS use Accelerated Pressure Protocol Mode 3 for all credit docs

---

**`claude-for-legal`**
- Path: `/mnt/skills/user/claude-for-legal/SKILL.md`
- Fires on: "contract", "NDA", "demand letter", "CFPB complaint", "DMCA", "trademark", "legal hold", "attorney review", "IP dispute", "worker classification", "GDPR", "CCPA", "P4D agreement", any legal escalation signal from credit-repair or record-exec-in-a-box context
- Load order: AFTER domain skill (credit-repair or record-exec-in-a-box). This is a supporting legal layer, not a standalone domain skill.

---

**`lead-to-brief`**
- Path: `/mnt/skills/user/lead-to-brief/SKILL.md`
- Fires on: raw CSV row from Google Maps scraper, "convert this lead", "build a brief for", lead data with business name + phone + address + category, pipeline webhook payload

---

**`outreach-copywriter`**
- Path: `/mnt/skills/user/outreach-copywriter/SKILL.md`
- Fires on: receiving a build_brief, "write the email", "outreach copy", "cold email", "phone script", "vapi script", "email the lead"
- Always runs AFTER lead-to-brief produces a build_brief

---

**`vapi-orchestrator`**
- Path: `/mnt/skills/user/vapi-orchestrator/SKILL.md`
- Fires on: "deploy the agent", "make the call", "queue the call", "set up voice agent", "vapi config", "outbound call", receiving build_brief at voice step
- Runs AFTER outreach-copywriter produces vapi_script

---

**`local-business-seo`**
- Path: `/mnt/skills/user/local-business-seo/SKILL.md`
- Fires on: ANY local business site build — always co-loads with cinematic-website-builder for lead gen pipeline builds
- Signals: "local business", "rank on Google", "SEO", "Google Business", "schema", "local search", any lead gen site

---

**`n8n-pipeline-architect`**
- Path: `/mnt/skills/user/n8n-pipeline-architect/SKILL.md`
- Fires on: "n8n", "automation flow", "workflow", "wire up the pipeline", "webhook", "trigger", "node"
- NOTE: Current pipeline uses direct API calls, not n8n — confirm context before loading

---

**`loyaltybot`**
- Path: `/mnt/skills/user/loyaltybot/SKILL.md`
- Fires on: "loyaltybot", "loyalty program", "auto-signup", "the bot", "tyjuan", "tyjuan01", "dashboard.html", "loyaltybot_server", "2724", "rewards signup"

---

**`music-visualizer`**
- Path: `/mnt/skills/user/music-visualizer/SKILL.md`
- Fires on: "music visualizer", "audio reactive", "looping video with music", "beat-synced", "frequency bars", "waveform", "visualizer render", audio file + video loop

---

**`add-hand-tracking`**
- Path: `/mnt/skills/user/add-hand-tracking/SKILL.md`
- Fires on: "hand tracking", "gesture control", "webcam cursor", "touchless", "spatial UI", "mediapipe", "gesture-based"

---

**`google-stitch`**
- Path: `/mnt/skills/user/google-stitch/SKILL.md`
- Fires on: "show me layout options", "prototype fast", "stitch this", "UI mockups", receiving Handoff Package with `next_step: google_stitch`

---

**`tweak`**
- Path: `/mnt/skills/user/tweak/SKILL.md`
- Fires on: `/tweak`, "tweak this", "add tweak panel", "bake tweak", "tweak strip", "tweak max", "dial in the sliders", any request to visually adjust CSS values on a single-file HTML output
- Default level: light (5 sliders). Use max only when user says "tweak max".

---

**`sa-video-skill-extractor`**
- Path: `/mnt/skills/user/sa-video-skill-extractor/SKILL.md`
- Fires on: video URL + "learn from this", "build a skill from this", "extract the workflow", "turn this into a SKILL.md", "replicate this", "what does this video teach"
- Distinction from sa-watch: sa-watch = analyze content; sa-video-skill-extractor = convert to reusable skill

---

**`SpaceAge_DesignMD_SKILL`** *(sa-design-md)*
- Path: `/mnt/skills/user/sa-design-md/SKILL.md`
- Fires on: "DESIGN.md", "design tokens", "create a design system", "export to Tailwind", "DTCG", "brand tokens", "lint this design file", receiving Brand Token Package needing formal encoding

---

**`karpathy-guidelines`**
- Path: `/mnt/skills/user/karpathy-guidelines/SKILL.md`
- Fires on: any coding task on the SA stack — pipeline edits, script changes, Shopify Liquid, cinematic HTML, voice agent config, affidavit generator, any request to write/debug/refactor code
- Load order: Co-load alongside the domain skill for any task involving code. Does NOT replace the domain skill — it enforces coding discipline across all of them.

---

**`calibrate`**
- Path: `/mnt/skills/user/calibrate/SKILL.md`
- Fires on: "calibrate", "calibrate lite", "what can you improve", "update your skills", "what did we learn", "tune up", "anything to fix?", end-of-session review requests
- Class: Meta-skill (self-improvement loop). Does not chain to other skills.

---

### TIER 2 — PUBLIC SKILLS
*Load when SA skills don't cover the format need.*

| Skill | Path | Fires On |
|-------|------|----------|
| `docx` | `/mnt/skills/public/docx/` | `.docx` request, "Word doc", "download as Word" |
| `pdf` | `/mnt/skills/public/pdf/` | `.pdf` request, "create a PDF", "fill this PDF", "merge PDFs" |
| `pdf-reading` | `/mnt/skills/public/pdf-reading/` | `.pdf` uploaded, "read this PDF", "extract from PDF" |
| `xlsx` | `/mnt/skills/public/xlsx/` | `.xlsx`, "spreadsheet", "Excel file", "CSV to spreadsheet" |
| `pptx` | `/mnt/skills/public/pptx/` | `.pptx`, "presentation", "slide deck", "PowerPoint" |
| `frontend-design` | `/mnt/skills/public/frontend-design/` | React/Vue component, web UI without cinematic requirement |
| `file-reading` | `/mnt/skills/public/file-reading/` | File uploaded at `/mnt/user-data/uploads/` with unknown format |

---

### TIER 3 — CONNECTED MCPs

| MCP | Server | Fires On |
|-----|--------|----------|
| **Google Drive** | `drivemcp.googleapis.com` | "save to Drive", "find in Drive", "upload to Drive", saving skills/transcripts |
| **Google Calendar** | `calendarmcp.googleapis.com` | "schedule", "book a call", "calendar", "availability", "add event" |
| **Gmail** | `gmailmcp.googleapis.com` | "send email", "check email", "draft email", "my inbox" |
| **Notion** | `mcp.notion.com` | "Notion", "my notes", "create a page", "Notion database" |
| **Airtable** | `mcp.airtable.com` | "Airtable", "my base", "CRM records", "update the table" |
| **Supabase** | `mcp.supabase.com` | "database", "Supabase", "SQL", "create table", "query" |
| **Stripe** | `mcp.stripe.com` | "payment", "invoice", "Stripe", "charge", "subscription" |
| **Figma** | `mcp.figma.com` | "Figma", "design file", "component", "design system sync", "export from Figma" |
| **Vercel** | `mcp.vercel.com` | "deploy", "Vercel", "deployment logs", "production URL" |
| **Canva** | `mcp.canva.com` | "Canva template", "design in Canva", when social-media-designer routes to Canva |
| **GitHub** | (via Zapier/Make) | "repo", "commit", "PR", "GitHub", "push to GitHub" |
| **Zapier** | `mcp.zapier.com` | "automate", "Zap", "trigger", when no direct API available |
| **Make** | `mcp.make.com` | "Make scenario", "Make workflow" |
| **PayPal** | `mcp.paypal.com` | "invoice", "PayPal", "send payment request" |
| **Docusign** | `mcp.docusign.com` | "contract", "sign", "DocuSign", "e-signature" |
| **Apollo.io** | `mcp.apollo.io` | "find leads", "prospect", "Apollo", "email lookup", "company data" |
| **Spotify** | `mcp.spotify.com` | "playlist", "Spotify", "find a song", "music search" — Record Exec context |
| **Higgsfield** | `mcp.higgsfield.ai` | Always route through `sa-higgsfield-operator` FIRST — MCP is the execution layer |
| **Jotform** | `mcp.jotform.com` | "form", "Jotform", "survey", "create a form" |
| **Gamma** | `mcp.gamma.app` | "presentation", "Gamma", "slides" — if not pptx |
| **GoDaddy** | `api.godaddy.com` | "domain", "check domain", "register domain" |
| **Zoom** | `mcp.zoom.us` | "Zoom meeting", "recording", "meeting notes", "transcript" |
| **Granola** | `mcp.granola.ai` | "meeting notes", "call summary", "Granola" |
| **LegalZoom** | `legalzoom.com/mcp` | "legal", "attorney", "LLC", "contract review" |
| **Intuit Credit Karma** | `anthropic.mcp.creditkarma.com` | "credit score", "spending" — personal use only, NOT Tradeline Express client work |

---

### TIER 4 — CLIs & SYSTEM TOOLS

| Tool | Fires On | Notes |
|------|----------|-------|
| `yt-dlp` | Video URLs needing download | Via sa-watch scripts |
| `ffmpeg` / `ffprobe` | Video/audio processing, frame extraction | Via sa-watch scripts |
| `python3` | Script execution, data processing | Always available |
| `node` / `npx` | JS execution, `@google/design.md` CLI | For sa-design-md |
| `git` | Repo operations, cloning skills | Always available |
| `curl` / `wget` | Direct HTTP, API calls without MCP | Fallback when MCP unavailable |
| `playwright` | Browser automation, loyalty bot, scraping | LoyaltyBot + Google Maps scraper |
| `rclone` | Google Drive sync from VPS | Skill backups to Space Age Skills folder |
| `ssh` | VPS access (`146.190.78.120`) | Hermes Agent control |

---

### TIER 5 — AI MODEL ROUTING

| Task | Route To | API |
|------|----------|-----|
| Code generation / execution | DeepSeek V4 Pro | `api.deepseek.com/v1` → `deepseek-v4-pro` |
| Fast code iteration | DeepSeek V4 Flash | `api.deepseek.com/v1` → `deepseek-v4-flash` |
| Site builds (swarm agent 2) | Gemini Flash | `generativelanguage.googleapis.com` |
| Site builds (swarm agent 3) | Minimax 2.7 | Direct API |
| Site builds (swarm agent 4) | Codex | Direct API |
| Site builds (swarm agent 5) | Gemma | Direct API |
| Orchestration / planning / prompts | Claude (stay here) | Always |
| Image generation | Higgsfield MCP → sa-higgsfield-operator | Zero marginal cost |

---

## CONFLICT RESOLUTION MATRIX

```
1. SA User Skill (most specific match wins)
2. SA User Skill (pipeline position — upstream before downstream)
3. Public Skill (format-specific)
4. MCP (action-specific)
5. CLI (direct execution)
6. General Claude knowledge (no tool needed)
```

### Common Conflict Examples

| Input | Conflict | Resolution |
|-------|----------|------------|
| Client URL provided | brand-extractor vs sa-watch vs page-upgrade | brand-extractor first → page-upgrade if redesign requested |
| "Generate an image of X" | sa-higgsfield-operator vs cinematic-prompt-director | cinematic-prompt-director writes prompt THEN sa-higgsfield-operator executes |
| Video URL + "build a site like this" | sa-watch vs cinematic-website-builder | sa-watch DESIGN_EXTRACT mode → output feeds cinematic-website-builder |
| "Write the outreach" with no brief | outreach-copywriter vs lead-to-brief | lead-to-brief first → outreach-copywriter second |
| "Create a presentation" | pptx vs Gamma vs Canva | pptx if download needed; Gamma if web-first; Canva if template-based |
| GitHub URL | sa-video-skill-extractor vs brand-extractor vs general | Analyze repo type → general knowledge (no video, no brand) |
| Audio file uploaded | sa-watch (Whisper) vs music-visualizer | music-visualizer if "make a visualizer"; sa-watch if "transcribe this" |
| Legal trigger during credit repair session | credit-repair vs claude-for-legal | credit-repair remains primary; claude-for-legal co-loads for the legal subtask |
| Coding task during any pipeline session | domain skill vs karpathy-guidelines | domain skill primary; karpathy-guidelines co-loads as enforcement layer |

---

## PIPELINE AUTO-CHAINS

### Chain A — Lead Gen Pipeline
```
Trigger: CSV row / business data with name + address + category
1. lead-to-brief → build_brief
2. outreach-copywriter → email HTML + vapi_script
3. cinematic-website-builder + local-business-seo → site HTML
4. vapi-orchestrator → Vapi agent config
```

### Chain B — Client Site Build (new client)
```
Trigger: Client URL + "build them a site" / "make a website for"
1. brand-extractor → Brand Token Package
2. ui-ux-designer → Handoff Package
3. cinematic-website-builder → production HTML
```

### Chain C — Client Site Build (Shopify)
```
Trigger: Shopify store URL or "Shopify" + build request
1. brand-extractor → Brand Token Package
2. ui-ux-designer → Handoff Package
3. shopify-cinematic-builder → .liquid files
```

### Chain D — Video → Site
```
Trigger: Video URL + "build a site like this" / "match this design"
1. sa-watch (DESIGN_EXTRACT mode) → SA Design Token Package
2. SpaceAge_DesignMD_SKILL → DESIGN.md
3. cinematic-website-builder → production HTML
```

### Chain E — Artist Onboarding (Record Exec)
```
Trigger: Artist name + "onboard" / "set up" / "EPK" / "content calendar"
1. record-exec-in-a-box → full artist profile
2. ai-content-creator → character reference sheet
3. social-media-designer → content template system
```

### Chain F — Image Generation
```
Trigger: Visual generation request
1. cinematic-prompt-director → YAML prompt (150-200 words minimum)
2. sa-higgsfield-operator → Higgsfield MCP → generated asset
```

### Chain G — Skill from Video Tutorial
```
Trigger: Tutorial URL + "learn from", "build a skill", "replicate"
1. sa-video-skill-extractor → workflow decomposition
2. skill-creator (examples) → SKILL.md synthesis
3. Google Drive MCP → save to Space Age Skills folder
```

---

## EXECUTION RULES

### Silent Operation
Never announce "I'm loading skill X" or "Using the Y MCP." Execute and deliver output.
The only acceptable tool mention is a brief footnote at the END if it adds context:
`*(via sa-watch DESIGN_EXTRACT → cinematic-website-builder)*`

### No Manual Invocation Required
If the user types `/skill-name` — honor it. But NEVER require it.

### Upstream First
- cinematic-website-builder needs: ui-ux-designer or brand-extractor
- outreach-copywriter needs: lead-to-brief (build_brief)
- vapi-orchestrator needs: outreach-copywriter (vapi_script)
- sa-higgsfield-operator needs: cinematic-prompt-director (prompt)
- claude-for-legal needs: credit-repair or record-exec-in-a-box (domain context)

If upstream hasn't run, run it first silently.

### Confidence Threshold
- >80% signal match → execute silently
- 50–80% match → execute with brief inline note: "Treating this as [X] — if that's wrong, say so."
- <50% match → ask ONE clarifying question before executing

### Claude Code vs Claude.ai
- Claude Code: CLIs and Python scripts are directly executable
- Claude.ai: CLIs route through bash_tool; file operations route through create_file/present_files

---

## REGISTRY MAINTENANCE

### Adding a New Skill
```
**`skill-id`**
- Path: `/mnt/skills/user/[skill-id]/SKILL.md`
- Fires on: [trigger signals]
- Notes: [any pipeline position rules]
```

### Adding a New MCP
Add to TIER 3 table with MCP name, server URL, trigger signals, routing notes.

### Adding a New CLI
Add to TIER 4 table with tool name, trigger context, preference over MCP equivalent.

---

## QUICK-READ TRIGGER MAP

```
youtube.com / youtu.be / vimeo / tiktok / loom / .mp4 / .mov
    → sa-watch

any client URL (non-video)
    → brand-extractor

"build a site" / "landing page" / "website"
    → ui-ux-designer → cinematic-website-builder

"shopify" / "store" / "liquid"
    → ui-ux-designer → shopify-cinematic-builder

"generate image" / "generate video" / model name
    → cinematic-prompt-director → sa-higgsfield-operator

"credit" / "dispute" / "bureau" / "affidavit"
    → credit-repair

"contract" / "NDA" / "demand letter" / "DMCA" / "trademark"
    → claude-for-legal (+ domain skill if in active session)

"lead" / CSV row / business data
    → lead-to-brief → outreach-copywriter → [site + vapi]

"artist" / "EPK" / "content calendar" / "release"
    → record-exec-in-a-box

"social" / "instagram" / "carousel" / "post"
    → social-media-designer

"DESIGN.md" / "design tokens" / "tailwind export"
    → SpaceAge_DesignMD_SKILL

tutorial URL + "learn" / "build skill"
    → sa-video-skill-extractor

"/tweak" / "tweak this" / "bake tweak"
    → tweak

"calibrate" / "what did we learn" / "tune up"
    → calibrate

any coding task on SA stack
    → [domain skill] + karpathy-guidelines (co-load)

.pdf uploaded
    → pdf-reading

.docx / .xlsx / .pptx request
    → docx / xlsx / pptx

"save to Drive" / "backup"
    → Google Drive MCP

"schedule" / "book"
    → Google Calendar MCP

"email" / "inbox"
    → Gmail MCP

"deploy" / "Vercel"
    → Vercel MCP

code task
    → route to DeepSeek V4 Pro (Claude Code) or execute directly (claude.ai)
```

---

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
registry_version: 1.1.0
last_updated: 2026-05-15
sa_skills_count: 27
public_skills_count: 7
mcp_count: 24
cli_count: 9
model_routes: 5
```
