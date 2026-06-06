---
name: sa-watch
version: 2.0
updated: 2026-05-15
description: >
  Space Age AI Solutions universal video intelligence engine. AUTO-TRIGGERS
  immediately on any video URL (YouTube, Vimeo, Loom, TikTok, X, Instagram,
  local file). Classifies intent, extracts frames + transcript, and hands off
  to downstream SA skills (cinematic-website-builder, brand-extractor,
  ui-ux-designer, ai-content-creator, record-exec-in-a-box). Seven intent
  modes: DESIGN_EXTRACT, BRAND_PACKAGE, CODE_AUDIT, CONTENT_AUDIT,
  MOTION_STUDY, FULL_REPORT, BATCH.
argument-hint: "<video-url-or-path> [intent-mode] [question]"
allowed-tools: Bash, Read, AskUserQuestion
homepage: https://github.com/bradautomates/claude-video
author: Space Age AI Solutions (supercharged from bradautomates/claude-video)
license: MIT
user-invocable: true
---

# SA-WATCH — Space Age Video Intelligence Engine
**Built on:** bradautomates/claude-video | **Supercharged by:** Space Age AI Solutions
**Install path:** `~/.claude/skills/sa-watch/` or `/mnt/skills/user/sa-watch/`

---

## AUTO-TRIGGER RULE

This skill fires **immediately and automatically** the instant any of these appear
in the conversation — no `/watch` command required, no explicit instruction needed:

- A YouTube URL, Vimeo URL, Loom link, TikTok URL, X/Twitter video, Instagram reel
- A local file path ending in `.mp4`, `.mov`, `.mkv`, `.webm`, `.avi`, `.m4v`
- The words "watch this", "analyze this video", "look at this clip", "screen recording"
- Any URL that yt-dlp can handle

**Do NOT wait for the user to say `/watch`.** Classify intent, run the pipeline, deliver output.

---

## INTENT ENGINE — 7 MODES

Classify intent automatically from context before running. If intent is ambiguous,
default to **FULL_REPORT**.

| Mode | Trigger Signals | Primary Output |
|------|----------------|----------------|
| `DESIGN_EXTRACT` | "design", "UI", "layout", "website", "landing page", "brand colors", "typography", "Figma" | SA Design Token Package → feeds cinematic-website-builder |
| `BRAND_PACKAGE` | "brand", "identity", "logo", "style", "aesthetic", "vibe", "competitor" | Brand Token Package → feeds brand-extractor / DESIGN.md |
| `CODE_AUDIT` | "bug", "error", "broken", "screen recording", "debugging", "code", "terminal" | Frame-by-frame bug diagnosis with timestamp citations |
| `CONTENT_AUDIT` | "summarize", "what happens", "structure", "hook", "breakdown", "viral", "creator" | Content structure report with hook analysis |
| `MOTION_STUDY` | "animation", "motion", "transition", "effect", "GSAP", "scroll", "parallax", "timing" | Motion spec for cinematic-website-builder module selection |
| `FULL_REPORT` | No specific signal / default | Comprehensive: metadata + frames + transcript + structure + SA handoff |
| `BATCH` | Multiple URLs in one message | Sequential processing with consolidated report |

---

## STEP 0 — PREFLIGHT (every invocation, silent on success)

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/setup.py" --check
```

Sub-100ms. Exit 0 = silent, proceed. On non-zero:

| Exit | Problem | Action |
|------|---------|--------|
| `2` | Missing `ffmpeg`/`ffprobe`/`yt-dlp` | Run installer |
| `3` | No Whisper API key | Scaffold `.env`, ask user for Groq key |
| `4` | Both missing | Installer + ask for key |

**Space Age note:** On the VPS (146.190.78.120 / DO), `ffmpeg` and `yt-dlp` should
already be present. If not, Linux install path:

```bash
# VPS install (run once)
sudo apt install -y ffmpeg
pip install --user yt-dlp
# Add Groq key
echo "GROQ_API_KEY=your_key_here" >> ~/.config/watch/.env
chmod 600 ~/.config/watch/.env
```

**Default for Space Age pipeline:** always run with `--no-whisper` unless the user
explicitly needs audio transcription. Visual frame analysis is the primary modality.
Whisper is opt-in, not default, to keep VPS processing cost at zero.

---

## STEP 1 — PARSE INPUT

Separate from user message:
- `source` — URL or local path
- `intent_mode` — explicit override OR auto-classified
- `question` — any specific query
- `range` — `--start`/`--end` if user named a specific moment

---

## STEP 2 — RUN WATCH SCRIPT

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "<source>" [flags]
```

### Flag Reference

| Flag | Default | When to use |
|------|---------|-------------|
| `--no-whisper` | off | **SA default** — visual-first, no API cost |
| `--start T` | — | User names a moment: "at 2:30", "the intro" |
| `--end T` | — | Pair with `--start` for focused scans |
| `--resolution 1024` | 512 | Code on screen, slides, on-screen text, brand logos |
| `--resolution 512` | default | General motion, design review, content audit |
| `--max-frames 40` | 80 | Budget-conscious, long video rough pass |
| `--fps 1` | auto | Slow moving content, talking head, product demo |
| `--whisper groq` | — | Explicit audio transcription request |
| `--out-dir DIR` | tmp | Persistent session (follow-up questions expected) |

### Frame Budget Reference

**Full-video auto mode:**

| Duration | Target Frames | Effective FPS |
|----------|--------------|---------------|
| ≤30s | ~30 | ~1 fps |
| 30s–1min | ~40 | ~0.7 fps |
| 1–3min | ~60 | ~0.3 fps |
| 3–10min | ~80 | ~0.1 fps |
| >10min | 100 | sparse — warn user |

**Focused mode (`--start`/`--end` set):**

| Window | Target Frames | Effective FPS |
|--------|--------------|---------------|
| ≤5s | ~10 | up to 2 fps |
| 5–15s | ~30 | up to 2 fps |
| 15–30s | ~60 | ~2 fps |
| 30–60s | ~80 | ~1.3 fps |
| 60–180s | 100 | ~0.6 fps |

**Hard caps:** 2 fps max, 100 frames max.

---

## STEP 3 — READ FRAMES

Read ALL frame paths in a **single parallel tool call batch**. Never read one at a time.
Frames arrive in chronological order with `t=MM:SS` absolute timestamps.

```
Read frame_0001.jpg, frame_0002.jpg, ... frame_00XX.jpg (all at once)
```

---

## STEP 4 — INTENT-SPECIFIC ANALYSIS

After reading frames + transcript, execute the analysis protocol for the classified intent.

---

### DESIGN_EXTRACT Protocol

**Goal:** Extract complete design intelligence to feed cinematic-website-builder or DESIGN.md.

Analyze every frame for:

**Color System**
- Primary brand color (dominant, used for CTAs/headers)
- Secondary color (supporting elements)
- Background color(s) — exact hex where determinable
- Accent/highlight color
- Text color(s)
- Gradient patterns — direction, stops, approximate values

**Typography**
- Header font — family, weight, approximate size, letter-spacing
- Body font — family, weight, line-height
- Label/UI font — any monospace or condensed variants
- Font rendering style (sharp, rounded, serif, slab)

**Layout & Spacing**
- Grid structure — columns, gutters
- Section rhythm — tight, airy, cinematic
- Card/container styles — flat, elevated, glassmorphism, neumorphic
- Border radius patterns — sharp (0-4px), moderate (8-16px), rounded (20px+), pill

**Motion & Interaction** (if present)
- Scroll behavior — parallax, fade-in, slide, none
- Hover states visible
- Transition timing feel — snap, ease, slow drift
- Any GSAP/ScrollTrigger pattern signatures

**Output format:**
```
## SA DESIGN EXTRACT — [Video Title]

### Color Tokens
primary: [hex or description]
secondary: [hex or description]
background: [hex or description]
accent: [hex or description]
text-primary: [hex or description]

### Typography
header: [font family] [weight] — [style notes]
body: [font family] [weight]
label: [font or N/A]

### Layout Pattern
grid: [columns/structure]
spacing: [tight/airy/cinematic]
containers: [style]
radius: [scale]

### Motion Signals
scroll: [yes/no — type]
transitions: [description]
GSAP modules suggested: [list from cinematic-website-builder]

### SA Pipeline Handoff
→ Next skill: cinematic-website-builder
→ VL-01 match: [yes/no — override recommendations]
→ DESIGN.md ready: [yes/no]
```

---

### BRAND_PACKAGE Protocol

**Goal:** Reverse-engineer complete brand identity for brand-extractor handoff.

Extract:
- Brand name (from logo, title cards, on-screen text)
- Primary logo — shape, colors, style (wordmark/icon/combo)
- Color palette — full extraction
- Typography hierarchy
- Brand voice signals — luxury, friendly, technical, aggressive, minimal
- Visual motifs — patterns, textures, iconography style
- Competitor positioning signals

**Output format:**
```
## SA BRAND PACKAGE — [Brand Name]

### Identity
Name: [brand name]
Logo style: [wordmark/icon/combo] — [description]
Tagline (if visible): [text]

### Color Palette
[name]: [hex] — [usage role]
[repeat for all colors]

### Typography
[See DESIGN_EXTRACT typography format]

### Brand Voice
Tone: [luxury/technical/friendly/aggressive/minimal]
Visual language: [cinematic/flat/material/glass/editorial]
Target audience signals: [observations]

### SA Pipeline Handoff
→ Next skill: brand-extractor → DESIGN.md → cinematic-website-builder
→ Fontsource equivalents: [font recommendations]
→ VL-01 compatibility: [full/partial/custom]
```

---

### CODE_AUDIT Protocol

**Goal:** Diagnose bugs, UI issues, or unexpected behavior from screen recordings.

For each frame where something appears wrong:
- Timestamp citation: `t=MM:SS`
- What is on screen (exact description)
- Error message text (verbatim if readable)
- Network requests visible (DevTools panels)
- Console output visible
- State before and after the issue

**Output format:**
```
## SA CODE AUDIT — [Recording Name]

### Issue Timeline
t=MM:SS — [what is observed]
t=MM:SS — [state change / error appears]
t=MM:SS — [consequence]

### Diagnosis
Root cause: [assessment]
Error type: [runtime/logic/network/render/state]
Reproduction path: [steps observed]

### Fix Recommendation
[Specific code-level recommendation]
```

---

### CONTENT_AUDIT Protocol

**Goal:** Content structure analysis for Creator Intelligence (Record Exec in a Box, client content strategy).

Analyze:
- Hook (first 3–5 seconds) — what's shown, what's said, pattern interrupt used
- Structure — act 1/2/3 or listicle or narrative or tutorial
- CTA placement and wording
- B-roll vs talking head ratio
- Pacing — cuts per minute estimate
- Engagement mechanics — open loops, callbacks, payoffs
- Platform optimization signals — captions, safe zones, aspect ratio

**Output format:**
```
## SA CONTENT AUDIT — [Video Title / Creator]

### Hook Analysis (0:00–0:05)
Visual: [what's on screen]
Audio: [what's said]
Pattern interrupt: [yes/no — type]
Hook score: [1–10]

### Structure
Format: [listicle/narrative/tutorial/cinematic/vlog]
Act 1 (setup): [summary + timestamp]
Act 2 (conflict/value): [summary + timestamp]
Act 3 (resolution/CTA): [summary + timestamp]

### Production Notes
Cuts/min: [estimate]
B-roll ratio: [%]
Captions: [yes/no]
Safe zone compliance: [yes/no]

### SA Strategy Recommendation
[Actionable content creation takeaway]
```

---

### MOTION_STUDY Protocol

**Goal:** Decode animation and motion design for cinematic-website-builder module selection.

Identify:
- Scroll-triggered animations — fade, slide, scale, parallax
- Cursor interactions — magnetic, trail, blend mode
- Ambient effects — particles, gradients shifting, noise
- Entry animations — page load, section reveal
- Micro-interactions — button hover, link states
- Timing curves — spring, ease-in-out, linear, custom
- Stagger patterns — cascade, random, wave

**Output format:**
```
## SA MOTION STUDY — [Source]

### Detected Motion Patterns
[pattern]: [description] at t=MM:SS
[...]

### GSAP Module Mapping
[cinematic-website-builder module number]: [why it matches]
[...]

### Implementation Notes
Timing: [fast/medium/slow] — [easing feel]
Stagger: [yes/no — pattern]
ScrollTrigger: [yes/no — scrub/snap/pin]
Recommended modules: [list]
```

---

### FULL_REPORT Protocol

Default mode. Combines all relevant extracts based on content type detected.

```
## SA VIDEO INTELLIGENCE REPORT — [Title]

### Metadata
Source: [url/path]
Duration: [time]
Resolution: [WxH]
Transcript source: [captions/whisper/none]

### Visual Summary
[3–5 sentence summary of what's on screen]

### Audio/Transcript Summary
[3–5 sentence summary of spoken content, if available]

### Key Moments
t=MM:SS — [what happens]
[...]

### SA Relevance Assessment
Applicable intents: [list which modes apply]
Pipeline recommendation: [which SA skill to invoke next]

### Extracted Assets
[Any design tokens, brand elements, or content structure identified]
```

---

### BATCH Protocol

For multiple URLs in one message:

1. Process sequentially — full pipeline per video
2. Consolidate into a comparative report
3. Flag the strongest asset for each mode

```
## SA BATCH REPORT — [N] videos processed

| # | Source | Duration | Intent | Key Finding |
|---|--------|----------|--------|-------------|
[one row per video]

### Consolidated Recommendations
[Cross-video pattern synthesis]
```

---

## STEP 5 — CLEANUP

After delivering the report:
- If follow-up questions are likely: leave working dir in place, note the path
- If analysis is complete: `rm -rf <work_dir>`
- Never leave working dirs silently — always state disposition

---

## FAILURE HANDLING

| Failure | Response |
|---------|----------|
| `yt-dlp` can't reach URL | State plainly — login-required or region-locked. Don't retry. |
| No transcript, no Whisper | Proceed frames-only. Label output "VISUAL ANALYSIS — no transcript". |
| Long video (>10min) warning | Acknowledge. Offer focused re-run on the relevant section. |
| Download produces no video file | Report the yt-dlp stderr. Suggest checking URL validity. |
| Whisper API fails | Try other backend (`--whisper openai` if groq failed, vice versa). If both fail, frames-only. |
| Frame extraction produces 0 frames | Video may be audio-only or corrupt. Report and offer Whisper-only run. |

---

## SPACE AGE PIPELINE INTEGRATION

### Downstream Handoffs

After completing analysis, proactively route to the correct SA skill:

| Intent Mode | Next Skill | Trigger |
|-------------|-----------|----------|
| `DESIGN_EXTRACT` | `cinematic-website-builder` | Pass SA Design Token Package as Phase 0 input |
| `BRAND_PACKAGE` | `brand-extractor` → `SpaceAge_DesignMD_SKILL` | Pass Brand Token Package |
| `MOTION_STUDY` | `cinematic-website-builder` | Pass GSAP module list directly |
| `CONTENT_AUDIT` | `record-exec-in-a-box` or `ai-content-creator` | Pass structure breakdown |
| `CODE_AUDIT` | Direct to DeepSeek V4 Pro for code fix | Pass diagnosis + timestamps |

### Lead Gen Pipeline Usage

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "<competitor_url>" \
  --no-whisper \
  --resolution 1024 \
  --max-frames 60
# Intent: DESIGN_EXTRACT → feeds lead-to-brief as visual reference
```

### Record Exec in a Box Usage

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "<mv_url>" \
  --no-whisper \
  --resolution 512
# Intent: MOTION_STUDY + CONTENT_AUDIT dual mode
# Output feeds ai-content-creator
```

---

## CLAUDE CODE INTEGRATION

```bash
# Option A — Plugin marketplace
/plugin marketplace add bradautomates/claude-video
/plugin install watch@claude-video

# Option B — Manual install (Space Age version)
git clone https://github.com/bradautomates/claude-video.git ~/.claude/skills/sa-watch
cp SpaceAge_VideoIntelligence_SKILL.md ~/.claude/skills/sa-watch/SKILL.md
```

CLAUDE.md entry:
```markdown
## Skills
- sa-watch: Auto-triggers on any video URL or local video file path.
  Intent engine auto-classifies. Default mode: --no-whisper (visual-first).
  Downstream: cinematic-website-builder, brand-extractor, record-exec-in-a-box.
  Skill path: ~/.claude/skills/sa-watch/
```

VPS environment (`/home/user/.config/watch/.env` on 146.190.78.120):
```bash
GROQ_API_KEY=your_groq_key
SETUP_COMPLETE=true
```

---

## TOKEN COST REFERENCE

| Configuration | Approx Token Cost |
|--------------|------------------|
| 30 frames @ 512px | ~20–30k image tokens |
| 60 frames @ 512px | ~40–60k image tokens |
| 80 frames @ 512px | ~50–80k image tokens |
| 80 frames @ 1024px | ~200–320k image tokens |
| Transcript (10min video) | ~3–5k text tokens |

Default 512px, 60–80 frames covers most analysis needs. Only bump to 1024px for CODE_AUDIT or when logo/text legibility is required for BRAND_PACKAGE.

---

## SKILL METADATA

```yaml
skill_id: SA-WATCH
version: 2.0.0
base: bradautomates/claude-video v0.1.3
category: video-intelligence
dependencies:
  - ffmpeg + ffprobe (system)
  - yt-dlp (system)
  - GROQ_API_KEY or OPENAI_API_KEY (optional — Whisper only)
downstream_skills:
  - cinematic-website-builder
  - brand-extractor
  - SpaceAge_DesignMD_SKILL
  - record-exec-in-a-box
  - ai-content-creator
auto_trigger: true
default_flags: --no-whisper
vps: 146.190.78.120
install_paths:
  - ~/.claude/skills/sa-watch/SKILL.md
  - /mnt/skills/user/sa-watch/SKILL.md
scripts:
  - scripts/watch.py
  - scripts/download.py
  - scripts/frames.py
  - scripts/transcribe.py
  - scripts/whisper.py
  - scripts/setup.py
```
