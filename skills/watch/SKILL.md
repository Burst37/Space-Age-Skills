---
name: watch
description: Watch any video (URL or local path). Extracts scene-change frames, timestamped transcript, editorial pacing metrics, hook microscope (dense 0-10s analysis), auto-highlight detection, sentiment arc, chapter analysis, and side-by-side video comparison. Generates structured report.md and optional HTML storyboard. Obsidian vault ingest included.
argument-hint: "<video-url-or-path> [why you're watching it]"
allowed-tools: Bash, Read, AskUserQuestion
homepage: https://github.com/burst37/space-age-skills
repository: https://github.com/burst37/space-age-skills
author: burst37
license: MIT
user-invocable: true
---

# /watch — Claude watches a video (v3)

Built from the best of [claude-watch](https://github.com/taoufik123-collab/claude-watch) and [claude-video](https://github.com/bradautomates/claude-video), then supercharged with five new analysis modules.

## What’s new in v3

- **`--compare VIDEO_B`** — side-by-side two-video analysis: pacing delta table, interleaved frames, transcript contrast
- **`--chapters`** — YouTube chapter-aware scanning; per-chapter frames + transcript slice; auto-segments when no chapters exist
- **`--highlights N`** — auto-detect top N most engaging moments using pacing + transcript density + keyword scoring
- **`--storyboard`** — generates a self-contained dark-theme HTML contact sheet with all frames, hero badges, highlight stars, and transcript snippets; base64-embedded, no external refs
- **`--output-format json`** — machine-readable JSON output for programmatic use
- **Sentiment arc** — always computed when a transcript is available; shows mood arc across the video timeline
- **Chapters in report.md** — chapter frames and per-chapter transcript snippets embedded in the ingest artifact

All v2 features remain: scene-change frame sampling, hook microscope (dense 0-10s analysis with word-level Whisper), editorial pacing metrics (cuts/min, mean/median shot length), structured `report.md`, Obsidian vault ingest.

## Configuration — Obsidian vault

Resolve vault directory in this order (first hit wins):

1. `$WATCH_VAULT_DIR` env var
2. `~/Second brain/`
3. `~/Documents/Obsidian/`
4. `~/Obsidian/`
5. None — skip vault steps, print `📄 Report (no vault detected): <workdir>/report.md`

## Step 0 — Setup preflight (silent on success)

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/setup.py" --check
```

Exit codes: `0` = ready, `2` = missing binaries, `3` = no Whisper key, `4` = both missing.

Installer (idempotent — safe to re-run):
```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/setup.py"
```

On macOS: auto-installs `ffmpeg` and `yt-dlp` via Homebrew. On Linux/Windows: prints exact install commands. Scaffolds `~/.config/watch/.env` at `0600` perms.

If an API key is still needed, use `AskUserQuestion` to ask for a Groq key (preferred) or OpenAI key. Write it to `~/.config/watch/.env`. Without a key, proceed `--no-whisper` and tell the user.

## When to use

- User pastes a video URL (YouTube, Vimeo, X, TikTok, Twitch, most yt-dlp-supported sites)
- User points at a local file (`.mp4`, `.mov`, `.mkv`, `.webm`, etc.)
- User types `/watch <url-or-path> [question]`
- User asks to compare two videos: `/watch url1 --compare url2`
- User asks for highlights, storyboard, chapter breakdown, or sentiment analysis

## Recommended limits

- **Best: videos under 10 minutes.** Frame coverage scales inversely with duration.
- **Hard caps: 100 frames, 2 fps max.**
  - ≤30s → ~1-2 fps (up to 30 frames)
  - 30s-1min → ~40 frames
  - 1-3min → ~60 frames
  - 3-10min → ~80 frames
  - >10min → 100 frames sparse (warning printed)

## How to invoke

**Step 1 — parse user input.** Separate source from question. The question IS the intent — pass via `--intent`.

**Step 2 — run the watch script.**

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "<source>" --intent "<intent>"
```

### Optional flags

| Flag | Default | Description |
|------|---------|-------------|
| `--compare SOURCE_B` | off | Compare two videos side-by-side |
| `--chapters` | off | Chapter-aware scanning |
| `--highlights N` | 0 | Auto-detect top N highlight moments |
| `--storyboard` | off | Generate HTML contact sheet |
| `--output-format json` | markdown | Machine-readable JSON output |
| `--start T` / `--end T` | off | Focus on a section (MM:SS or HH:MM:SS) |
| `--max-frames N` | 80 | Cap frame count |
| `--resolution W` | 512 | Frame width in pixels |
| `--fps F` | auto | Override auto-fps (capped at 2) |
| `--no-whisper` | off | Disable Whisper fallback |
| `--whisper groq\|openai` | auto | Force Whisper backend |
| `--no-scene-change` | off | Force uniform sampling |
| `--no-hook-microscope` | off | Skip dense 0-10s pass |

### Compare mode

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "$URL_A" --compare "$URL_B" --intent "which one has better pacing?"
```

Produces a metrics delta table (cuts/min, shot length, duration), interleaved frame lists, and side-by-side transcripts. Good for A/B creative analysis, before/after edits, or competing content.

### Chapter-aware scanning

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "$URL" --chapters --intent "what does each chapter cover?"
```

Extracts YouTube chapters from the yt-dlp info.json. If no chapters exist, auto-segments into 5 equal parts. Each chapter gets its own frame set and transcript slice.

### Highlight detection

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "$URL" --highlights 5
```

Slides a 30s window over the video, scores each window on transcript density + edit pacing + engagement keywords, and returns the top 5 non-overlapping moments. Frame paths and transcript snippets included.

### Storyboard

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "$URL" --storyboard
```

Generates a dark-theme HTML contact sheet at `<workdir>/storyboard.html`. Hero frames are highlighted with a blue border + HERO badge. Highlight moments get a gold star badge. Transcript snippets appear beneath each frame. All images base64-embedded — one portable file.

### Focusing on a section

```bash
# Dense scan of 2:15 to 2:45
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "$URL" --start 2:15 --end 2:45

# From 1h12m to end
python3 "${CLAUDE_SKILL_DIR}/scripts/watch.py" "$URL" --start 1:12:00
```

Focused-mode budgets are denser (more fps) than full-video budgets.

**Step 3 — Read every frame path the script lists.** The Read tool renders JPEGs as images. Read all frames in a single message (parallel tool calls).

**Step 4 — answer the user, then fill the report.**

You now have:
- **Frames** — what’s on screen at each timestamp
- **Transcript** — what’s said at each timestamp
- **Highlights** — auto-scored top moments (if `--highlights` was used)
- **Sentiment arc** — mood timeline across the video
- **Chapters** — per-chapter frames and transcript (if `--chapters` was used)
- **`report.md`** — structured artifact with `<!-- pending Claude fill: ... -->` markers

First, answer the user’s question in chat citing timestamps.

Then **fill every `<!-- pending Claude fill: ... -->` marker** in `report.md` using the Edit tool:
- **TL;DR** — 3-5 bullets through the lens of the user’s intent
- **Key moments** — 5-10 timestamped bullets
- **Hook microscope** — frame-by-frame interpretation of the first 10s; identify hook pattern
- **Editorial profile** — one-line style fingerprint from pacing numbers + frames
- **Quotable moments** — top 3-5 punchy lines with [MM:SS]
- **Entities** — people, companies, tools, places as `[[wikilinks]]`
- **Concepts** — frameworks and mental models with brief gists

Never offer ingest on a half-filled report.

**Step 4.4 — Stage to Obsidian vault (when detected).** After filling markers:
1. Slugify the title: lowercase, ASCII-only, hyphens, max 60 chars, append `-YYYY-MM-DD`
2. `mkdir -p "$VAULT_DIR/raw/watched/<slug>"`
3. Copy `report.md` + hero frames into that dir
4. Open in Obsidian: `open "obsidian://open?vault=${VAULT_NAME}&file=raw/watched/<slug>/report.md"`
5. Print: `📄 Report: raw/watched/<slug>/report.md`

**Step 4.5 — Offer vault ingest** (skip if no vault detected):

Use `AskUserQuestion` with options:
- **Yes — same angle** (`<intent>`)
- **Yes — different angle** (user specifies via notes)
- **Stage to `raw/watched/` for later**
- **No, drop it**

For "Yes": run Ingest op per `$VAULT_DIR/CLAUDE.md` (or generic: append to `log.md`, touch entity/concept pages).
For "Stage": already done at 4.4 — tell user the path.
For "No, drop it": `rm -rf "$VAULT_DIR/raw/watched/<slug>"`.

**Step 5 — clean up.** `rm -rf <work_dir>` after ingest/stage. Leave in place if user might ask follow-ups.

## Transcription

1. **Native captions (free, preferred)** — yt-dlp pulls manual or auto-generated VTT subs
2. **Whisper API fallback** — extracts mono 16kHz 64kbps MP3 (~0.5 MB/min), uploads to:
   - **Groq** — `whisper-large-v3`. Preferred: cheaper, faster. Key at console.groq.com/keys
   - **OpenAI** — `whisper-1`. Fallback. Key at platform.openai.com/api-keys

Keys in `~/.config/watch/.env`. Groq preferred when both set.

## Failure modes

| Failure | Action |
|---------|--------|
| Setup preflight failed | Run installer |
| No transcript | Proceed frames-only, tell user |
| Long video warning | Acknowledge; offer `--start`/`--end` focused re-run |
| Download fails | Print yt-dlp error; don’t retry |
| Whisper fails | Try other backend; report frames-only |
| Half-filled report markers | Go back, fill every marker via Edit |
| Ingest fails partway | Leave artifact in `raw/watched/<slug>/`; it’s idempotent on retry |

## Sentiment arc

Automatically computed from the transcript (no API needed). Keyword-based scorer in [-1, 1] per segment, bucketed into 60s windows. Displayed as a table in the markdown output and embedded in report.md. Useful for:
- Finding the emotional climax of a talk
- Detecting when a product review turns critical
- Mapping the tension arc of a story video

## Token efficiency

- 80 frames at 512px wide ≈ 50-80k image tokens
- Transcript: a few thousand tokens for a 10-min video
- `--resolution 1024` roughly 4× more image tokens per frame — only when text legibility is needed
- Storyboard is generated locally; it does NOT consume additional Claude tokens
- Sentiment and highlights are computed locally; they do NOT consume additional Claude tokens
- If you already watched a video this session, do NOT re-run — answer from context

## Security

**What this skill does:**
- Runs `yt-dlp` locally to download video and pull native captions
- Runs `ffmpeg`/`ffprobe` locally for frame extraction and audio slicing
- Sends extracted audio to Groq/OpenAI Whisper API (not the video itself)
- Reads/creates `~/.config/watch/.env` (mode `0600`) for API keys
- Writes frames, audio, and `report.md` to a temp working directory
- Stages `report.md` + hero frames into `$VAULT_DIR/raw/watched/<slug>/` when a vault is detected
- Writes/touches vault pages only when the user explicitly consents at Step 4.5

**What this skill does NOT do:**
- Upload the video to any API
- Access any platform account or session cookies
- Share API keys between providers
- Log or write API keys to output files
- Write to Second Brain without explicit consent

## Scripts reference

| Script | Purpose |
|--------|---------|
| `watch.py` | Entry point — orchestrates all modules |
| `compare.py` | Side-by-side two-video analysis |
| `chapters.py` | YouTube chapter extraction + per-chapter processing |
| `highlights.py` | Sliding-window highlight detection |
| `sentiment.py` | Keyword-based sentiment arc computation |
| `storyboard.py` | HTML contact sheet generator |
| `download.py` | yt-dlp wrapper + chapter extraction from info.json |
| `frames.py` | ffmpeg frame extraction (uniform + scene-change) + hero selection |
| `transcribe.py` | VTT subtitle parser + deduplicator |
| `whisper.py` | Groq/OpenAI Whisper clients (pure stdlib) |
| `pacing.py` | Editorial pacing metrics |
| `hook.py` | Dense 0-10s hook microscope |
| `report.py` | Structured report.md emitter |
| `setup.py` | Preflight + installer |
