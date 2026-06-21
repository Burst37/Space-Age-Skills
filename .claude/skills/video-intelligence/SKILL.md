---
name: video-intelligence
description: >
  Space Age AI Solutions — Video Intelligence Engine. Watch, analyze, reverse-engineer,
  and extract actionable intelligence from any video (URL or local file). Downloads via
  yt-dlp, extracts auto-scaled frames via ffmpeg, pulls timestamped transcripts (native
  captions → Whisper API fallback), and applies director-level cinematic analysis,
  competitive intelligence, content strategy, ad deconstruction, and client deliverable
  generation. Universal skill — works for any business context (agencies, brands,
  creators, consultants). Supercharged fork of bradautomates/claude-video.
argument-hint: "<video-url-or-path> [mode] [question]"
allowed-tools: Bash, Read, AskUserQuestion
homepage: https://github.com/bradautomates/claude-video
author: Space Age AI Solutions (supercharged fork)
license: MIT
user-invocable: true
---

# Video Intelligence Engine — Space Age AI Solutions

**Tier:** Universal (Personal Brand → Client Services)
**Revenue Layer:** Standalone deliverable service — sell as Video Intelligence Reports, Ad Deconstruction, Competitive Analysis, Content Strategy Audits

---

## WHAT THIS SKILL DOES

This skill gives Claude the ability to **watch any video** and produce premium, client-ready intelligence. It goes far beyond basic summarization — it operates as a:

- **Cinematic Director** — shot composition, lighting analysis, visual storytelling breakdown
- **Content Strategist** — hook engineering, retention structure, platform optimization
- **Competitive Intelligence Analyst** — reverse-engineer competitor ads, brand videos, product launches
- **Ad Creative Director** — deconstruct high-performing ads frame by frame
- **Business Intelligence Tool** — extract actionable insights for any client industry

---

## WHEN TO TRIGGER

Trigger immediately when any of the following appear:

- User pastes a video URL (YouTube, TikTok, Instagram, Vimeo, Twitter/X, Loom, etc.)
- User points to a local video file (`.mp4`, `.mov`, `.mkv`, `.webm`, `.avi`)
- User asks to "analyze," "break down," "reverse-engineer," "deconstruct," "audit," or "study" a video
- User wants a "competitive analysis," "ad breakdown," "content audit," or "hook analysis"
- User wants to know: what works, why it works, how to replicate it, or how to beat it
- User is preparing a client deliverable involving video content strategy

**Client service contexts that automatically trigger this skill:**
- "Analyze my competitor's ad"
- "What makes this video convert?"
- "Break down this hook"
- "Reverse engineer this music video"
- "What's the visual strategy in this brand film?"
- "I need a video audit for my client"
- "Watch this and tell me how to beat it"

---

## INTELLIGENCE MODES

When invoking this skill, select the appropriate intelligence mode. If the user doesn't specify, infer from context.

### MODE 1 — `CINEMATIC` (Default for creative/production work)
Full director-level breakdown: shot types, camera movement, lighting, color grade, pacing, music, wardrobe, location, VFX. Outputs a production brief and a list of replicable techniques.

**Best for:** Music videos, brand films, cinematic ads, spec work, production reference

### MODE 2 — `CONTENT` (Default for creators/social media)
Hook structure, retention mapping, thumbnail strategy, caption/CTA analysis, platform algorithm alignment, repurposing opportunities.

**Best for:** YouTube, TikTok, Instagram Reels, podcast clips, content audits

### MODE 3 — `AD` (Default for marketing/business clients)
Ad structure (hook → problem → solution → proof → CTA), emotional triggers, offer clarity, targeting inference, funnel stage identification, conversion optimization notes.

**Best for:** Facebook/Meta ads, YouTube pre-roll, TV spots, product demos, sales videos

### MODE 4 — `COMPETITIVE` (Default for business intelligence)
Extract the strategy: positioning, messaging hierarchy, brand voice, visual identity signals, audience targeting clues, what's working and why, gap analysis vs. client brand.

**Best for:** Competitor research, client pitches, market entry analysis

### MODE 5 — `TRANSCRIPT` (Fastest, cheapest — dialogue/talking head)
Pure transcript extraction + analysis. No heavy frame processing. Speaker attribution, key quotes, topic timestamps, content outline.

**Best for:** Podcasts, webinars, interviews, talking head videos, conference keynotes

### MODE 6 — `FULL AUDIT` (Premium deliverable)
All five modes combined. Produces a structured client-ready report. Bill at agency rates.

**Best for:** Paid client deliverables, strategy decks, onboarding packages

---

## EXECUTION PROTOCOL

### STEP 0 — SETUP PREFLIGHT (Silent on success)

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/setup.py" --check
```

Exit 0 = silent proceed. Non-zero:

| Exit | Problem | Fix |
|------|---------|-----|
| `2` | Missing ffmpeg/ffprobe/yt-dlp | Run installer |
| `3` | No Whisper API key | Scaffold `.env`, ask user for key |
| `4` | Both missing | Run installer + ask for key |

Installer (idempotent):
```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/setup.py"
```

macOS: auto-installs via Homebrew. Linux/Windows: prints exact commands. Scaffolds `~/.config/watch/.env` at `0600` perms.

**API key preference:** Groq `whisper-large-v3` (faster, cheaper) > OpenAI `whisper-1`. Store in `~/.config/watch/.env`.

---

### STEP 1 — PARSE INPUT

Extract from the user message:
1. **Source** — URL or local path
2. **Mode** — explicit or inferred from context
3. **Question** — the specific intelligence request
4. **Time range** — if user references a specific moment, extract `--start` / `--end`
5. **Client context** — if this is for a client deliverable, note the industry/goal

---

### STEP 2 — DOWNLOAD + EXTRACT

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "<source>" [flags]
```

**Standard flags:**
- `--start T` / `--end T` — focus on a section (SS, MM:SS, HH:MM:SS)
- `--max-frames N` — token budget control (default 80, hard max 100)
- `--resolution W` — frame width px (default 512; use 1024 for on-screen text/UI)
- `--fps F` — override auto-fps (hard cap 2 fps)
- `--whisper groq|openai` — force backend
- `--no-whisper` — frames-only mode

**Space Age recommended defaults by mode:**

| Mode | Resolution | Strategy |
|------|-----------|----------|
| CINEMATIC | 1024 | Full video; use `--start/--end` for key sequences |
| CONTENT | 512 | Full video for structure; focused for hook (0:00–0:15) |
| AD | 512 | Usually short (< 2 min); full scan |
| COMPETITIVE | 512 | Full scan first; focused on key moments |
| TRANSCRIPT | 512, `--max-frames 20` | Transcript-dominant; minimal frames |
| FULL AUDIT | 1024 | Multiple targeted runs |

---

### STEP 3 — READ FRAMES

Read every frame path the script lists. Use parallel Read calls. Frames are chronological with `t=MM:SS` timestamps.

---

### STEP 4 — GENERATE INTELLIGENCE OUTPUT

Apply the mode-specific analysis framework below. All outputs should be structured, client-ready, and dense with actionable value. **No filler. No generic observations.**

---

## MODE ANALYSIS FRAMEWORKS

### MODE 1 — CINEMATIC BREAKDOWN

Deliver a structured production analysis:

```
## CINEMATIC INTELLIGENCE REPORT

### OVERVIEW
- Title / Source / Duration / Aspect Ratio
- Director / DOP influence signatures (if identifiable)
- Overall aesthetic classification

### SHOT-BY-SHOT ANALYSIS
For each major sequence:
- Timestamp range
- Shot type (ECU, CU, MCU, MS, WS, EWS, OTS, POV, aerial, etc.)
- Camera movement (static, dolly, crane, handheld, gimbal, drone, push/pull)
- Lens character (wide, normal, telephoto — compression, distortion)
- Estimated camera system (if identifiable by sensor rendering, color science)
- Lighting setup (key/fill/rim presence, source type, modifier inference)
- Color grade notes (temperature, saturation, contrast curve, LUT signature)
- Wardrobe / props / set details relevant to the shot

### PACING ANALYSIS
- Average shot length
- Rhythm pattern (montage, deliberate, dynamic)
- Music sync points
- Cut style (hard cut, J-cut, L-cut, match cut, smash cut)

### LIGHTING ARCHITECTURE
- Primary lighting approach (natural, studio, mixed, practical)
- Key light placement and modifier inference
- Color temperature choices
- Practical sources used
- Shadow management

### COLOR STRATEGY
- Dominant palette
- Contrast rationale
- Skin tone treatment
- Background separation technique

### REPLICATION BRIEF
Step-by-step production notes to recreate this aesthetic:
1. Camera + lens selection
2. Lighting setup
3. Color grade approach
4. Post-production workflow
5. Estimated budget tier (low/mid/high)
```

---

### MODE 2 — CONTENT STRATEGY BREAKDOWN

```
## CONTENT INTELLIGENCE REPORT

### HOOK ANALYSIS (0:00 – 0:15)
- Hook type (question, bold statement, visual shock, pattern interrupt, story open)
- Visual hook (what's on screen frame 1?)
- Audio hook (first spoken words verbatim or paraphrased)
- Engagement prediction score (1-10) + rationale
- Rewrite: improved hook alternative

### STRUCTURE MAP
- [0:00] Hook
- [0:XX] Problem / Context
- [0:XX] Value delivery begins
- [0:XX] Proof / credibility moment
- [0:XX] CTA
- Overall structure type (AIDA, PAS, Hook-Story-CTA, etc.)

### RETENTION MECHANICS
- Re-engagement points (moments designed to keep viewer watching)
- Pattern interrupts used
- Visual variety rate (scene changes per minute)
- Caption/text overlays strategy

### PLATFORM OPTIMIZATION SCORE
- Optimal platform(s) for this content
- What's working for the algorithm
- What would improve distribution
- Repurposing opportunities (clip extraction, thumbnail moments)

### THUMBNAIL ANALYSIS (if applicable)
- Visual hierarchy
- Text legibility
- CTR optimization grade

### CONTENT CALENDAR INTELLIGENCE
- Post cadence signal (is this from a high-output creator?)
- Series potential
- Audience signals
```

---

### MODE 3 — AD DECONSTRUCTION

```
## AD INTELLIGENCE REPORT

### AD SPECS
- Platform (inferred or stated)
- Length + format (pre-roll, in-feed, story, etc.)
- Estimated spend tier (organic test / scaled / evergreen)

### STRUCTURE BREAKDOWN
- [0:00-0:03] HOOK: [what it is + why it works]
- [0:03-0:XX] PROBLEM: [how pain is established]
- [0:XX-0:XX] SOLUTION: [product/offer introduction]
- [0:XX-0:XX] PROOF: [social proof, demo, testimonial]
- [0:XX-end] CTA: [exact CTA + offer clarity score]

### EMOTIONAL TRIGGERS INVENTORY
List every emotional lever used:
- Fear / FOMO / urgency
- Aspiration / identity
- Social proof / authority
- Curiosity / open loop
- Humor / relatability

### OFFER ANALYSIS
- Clarity score (1-10)
- Value proposition strength
- Risk reversal present? (guarantee, trial, free)
- Urgency mechanism

### AUDIENCE TARGETING INFERENCE
- Demographics (age, gender signals)
- Psychographics (lifestyle, values, pain points addressed)
- Funnel stage (cold/warm/hot)
- Retargeting signals?

### CONVERSION OPTIMIZATION NOTES
- What's converting this ad
- 3 specific improvements to increase CVR
- A/B test recommendations

### REPLICATION BRIEF
How to build a competing or inspired version:
- Hook rewrite (3 variations)
- Visual direction notes
- Script skeleton
- Platform + targeting recommendation
```

---

### MODE 4 — COMPETITIVE INTELLIGENCE

```
## COMPETITIVE INTELLIGENCE REPORT

### BRAND FINGERPRINT
- Visual identity signals (colors, typography, logo usage)
- Tone of voice (formal/casual, aspirational/practical, etc.)
- Production value tier (DIY / prosumer / professional / cinematic)
- Brand archetype (Hero, Sage, Creator, Rebel, etc.)

### MESSAGING HIERARCHY
1. Primary message (what they lead with)
2. Secondary message (supporting claim)
3. Differentiator (how they position vs. alternatives)
4. Target audience signal (who they're speaking to)

### STRENGTHS ANALYSIS
- What they're doing extremely well
- What's likely performing (based on production investment signals)
- Audience resonance indicators

### GAPS + VULNERABILITIES
- What's missing from their content
- Weaknesses in their visual/messaging approach
- Opportunities for your client to differentiate

### STRATEGIC RECOMMENDATIONS
For [client/your brand] to compete:
1. [Specific positioning move]
2. [Content angle to own]
3. [Visual differentiation strategy]
4. [Messaging gap to exploit]

### WATCH LIST
- Other videos from this creator/brand to analyze
- Keywords/themes to track
```

---

### MODE 5 — TRANSCRIPT EXTRACTION

```
## TRANSCRIPT INTELLIGENCE REPORT

### SUMMARY
2-3 sentence overview of the video content.

### SPEAKER MAP
- Speaker 1: [name/role if identifiable]
- Speaker 2: [name/role if identifiable]

### TIMESTAMPED OUTLINE
- [0:00] Introduction / Context
- [X:XX] Topic 1
- [X:XX] Topic 2
...

### KEY QUOTES
Most quotable / shareable moments with timestamps.

### CONTENT EXTRACTION
- Blog post outline (from this video)
- Social clip recommendations (top 3 moments to clip)
- Email newsletter angle
- LinkedIn post hook

### SEO INTELLIGENCE
- Primary keywords naturally used
- Secondary keywords
- Content gaps (questions raised but not answered)
```

---

### MODE 6 — FULL AUDIT (Client Deliverable)

Run all five modes in sequence. Deliver as a structured report with:

```
## VIDEO INTELLIGENCE AUDIT
### Prepared by: Space Age AI Solutions
### Client: [client name]
### Date: [date]

[CINEMATIC BREAKDOWN]
[CONTENT STRATEGY BREAKDOWN]
[AD/CONVERSION ANALYSIS — if applicable]
[COMPETITIVE INTELLIGENCE — if applicable]
[TRANSCRIPT + CONTENT EXTRACTION]

## EXECUTIVE SUMMARY
Top 5 actionable insights from this video.

## RECOMMENDED NEXT STEPS
Specific actions for the client based on the audit.
```

---

## CINEMATIC INTELLIGENCE LAYER

When MODE is CINEMATIC or FULL AUDIT, apply full director-level analysis:

### Camera Recognition Signatures
- **Sony Venice 2** — warm skin tones, dual ISO, filmic highlight rolloff
- **ARRI Alexa LF** — organic grain, natural color science, cinema-standard shadow detail
- **RED Komodo / V-RAPTOR** — clinical sharpness, high dynamic range, aggressive color
- **Blackmagic URSA Cine 17K** — extremely high res, wide color gamut, flat profile
- **Sony FX3/A7SIII** — prosumer, excellent low light, slightly digital look
- **DJI Ronin 4D** — stabilized, aerial-capable, 6K

### Lighting Architecture Inference
From frame analysis, infer:
- Hard vs. soft light (shadow edge quality)
- Key light direction (catch light position in eyes, shadow fall direction)
- Fill ratio (shadow side brightness vs. key side)
- Rim/hair light (separation from background)
- Practical sources (windows, monitors, neon, candles)
- Color temperature mixing (warm/cool split)

### Color Grade Signatures
- **Teal & Orange** — complementary split, most common commercial grade
- **Desaturated / Bleach Bypass** — gritty, editorial, crime aesthetic
- **High Contrast / Crushed Blacks** — dramatic, cinematic, music video standard
- **Warm Film Emulation** — organic, lifestyle, fashion
- **Cool / Blue Shadows** — night, tech, corporate thriller
- **Clean & Neutral** — luxury, minimal, Apple-style

### Shot Language Reference
| Shot | Code | Use |
|------|------|-----|
| Extreme Close-Up | ECU | Emotion, detail, product |
| Close-Up | CU | Face, reaction, product hero |
| Medium Close-Up | MCU | Interview, dialogue |
| Medium Shot | MS | Subject in environment |
| Wide Shot | WS | Context, scale, establishing |
| Extreme Wide | EWS | Epic, isolation, landscape |
| Over the Shoulder | OTS | Conversation, POV |
| Dutch Angle | DA | Tension, unease |
| Bird's Eye | BE | Scale, surveillance, graphic |
| Worm's Eye | WE | Power, scale, awe |

---

## CLIENT SERVICE PACKAGING

This skill produces deliverables that are billable at professional rates:

| Deliverable | Description | Rate Tier |
|-------------|-------------|-----------|
| **Hook Analysis Report** | 1 video, MODE 2 focus | $150–300 |
| **Ad Deconstruction** | 1 ad, MODE 3 full output | $250–500 |
| **Competitive Intelligence Brief** | 3-5 videos, MODE 4 | $500–1,500 |
| **Content Audit (5 videos)** | MODE 2 × 5 | $750–2,000 |
| **Full Video Intelligence Audit** | 1 video, MODE 6 | $400–800 |
| **Monthly Video Intelligence Retainer** | 4-8 videos/month | $1,500–3,500/mo |

**Target clients:**
- Brands running video ads (need ad deconstruction / competitor intel)
- Content creators scaling their channel (need content strategy audits)
- Marketing agencies (need video analysis for client strategy)
- Music artists / labels (need cinematic breakdowns for production direction)
- eCommerce brands (need product video + competitor ad analysis)
- Real estate, medical, legal, fitness — any local business running video

---

## TOKEN EFFICIENCY GUIDELINES

| Duration | Default Budget | Notes |
|----------|---------------|-------|
| ≤30s | ~30 frames | Dense — full coverage |
| 30s–1min | ~40 frames | Still comprehensive |
| 1–3min | ~60 frames | Comfortable |
| 3–10min | ~80 frames | Workable with focused follow-up |
| >10min | 100 frames max | Sparse scan — warn user, offer focused re-run |

**Resolution strategy:**
- `512px` — default for most analysis
- `1024px` — use when reading on-screen text, UI, captions, product labels, or fine wardrobe/set detail matters (CINEMATIC mode)

**Cost control for client work:**
- TRANSCRIPT mode: `--max-frames 20` saves 60–70% of token cost
- Focused sections: use `--start / --end` on viral moments rather than full scans
- Never re-run a video you already watched in the same session

---

## TRANSCRIPTION PIPELINE

1. **Native captions** (yt-dlp — free, preferred)
2. **Groq Whisper `whisper-large-v3`** (fast, cheap — preferred fallback)
3. **OpenAI `whisper-1`** (reliable, standard pricing)
4. **Frames-only** (last resort with `--no-whisper`)

Keys live in `~/.config/watch/.env`. Groq preferred when both present. Max audio upload: 25 MB (~50 min at mono 16kHz).

---

## FAILURE HANDLING

| Problem | Response |
|---------|----------|
| Setup preflight fails | Run `python3 "${CLAUDE_SKILL_DIR}/scripts/setup.py"` |
| No transcript | Proceed frames-only, tell user, offer Whisper setup |
| Long video (>10min) warning | Acknowledge, offer focused re-run on specific section |
| Download fails (login/geo-block) | Tell user plainly, do not retry |
| Whisper fails (key/rate/size) | Retry with alternate backend; proceed frames-only if both fail |
| URL not supported | Check yt-dlp compatibility; suggest downloading file locally |

---

## SECURITY

**What this skill does:**
- Downloads public video via yt-dlp (local only)
- Extracts frames as JPEGs via ffmpeg (local only)
- Sends audio to Groq or OpenAI Whisper API when captions unavailable
- Reads/creates `~/.config/watch/.env` at `0600` perms

**What this skill does NOT do:**
- Never uploads the video file itself (audio clip only)
- Never accesses platform accounts or session data
- Never logs API keys to stdout/stderr/files
- Never persists outside the working directory + `.env`

---

## BUNDLED SCRIPTS

| Script | Role |
|--------|------|
| `scripts/watch.py` | Main entry point — orchestrates full pipeline |
| `scripts/download.py` | yt-dlp wrapper |
| `scripts/frames.py` | ffmpeg frame extraction + auto-fps logic |
| `scripts/transcribe.py` | VTT parsing + dedup + Whisper orchestration |
| `scripts/whisper.py` | Groq / OpenAI clients (pure stdlib) |
| `scripts/setup.py` | Preflight check + dependency installer |

---

## EXAMPLES

```bash
# Deconstruct a competitor's ad
/watch https://youtu.be/abc123 ad what's their hook strategy?

# Full cinematic breakdown of a music video
/watch https://youtu.be/xyz789 cinematic break down every shot

# Content audit — first 30 seconds only
python3 watch.py "https://youtu.be/abc" --start 0 --end 30 --resolution 1024

# Competitive intelligence on 3 competitor videos
/watch [URL1] competitive
/watch [URL2] competitive
/watch [URL3] competitive
# → synthesize into one competitive brief

# Transcript-only for a long podcast
python3 watch.py "https://youtu.be/podcast" --max-frames 20

# Full audit for a client deliverable
/watch https://client-competitor.com/video full audit prepare a client report
```

---

## SPACE AGE BRAND INTEGRATION

When producing client-facing reports, apply Space Age AI Solutions standards:

- Reports headed with: **Space Age AI Solutions | Video Intelligence Division**
- Tone: Executive briefing quality — authoritative, strategic, no filler
- Always include: Executive Summary + Recommended Next Steps
- Format for easy slide extraction (each section = one potential slide)
- Upsell signal: end every report with "Next intelligence layer: [relevant service]"

**Upsell ladder from video intelligence:**
1. Video Intelligence Report → 2. Competitive Content Strategy → 3. Ad Creative Brief → 4. Full Brand Audit → 5. Monthly Intelligence Retainer

---

*Space Age AI Solutions — Video Intelligence Engine v2.0*
*Supercharged fork of bradautomates/claude-video (MIT)*
