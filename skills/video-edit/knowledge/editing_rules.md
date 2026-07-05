# Editing rules — video-edit skill

These rules govern the cut/cover/caption decisions the skill makes. The pipeline scripts encode the math; this file explains the *why* so you can tune intelligently.

## 1. Cuts

**Filler words** (cut on sight):
- `um`, `uh`, `uhm`, `uhh`, `ah`, `ahh`, `er`, `erm`, `hmm`, `mm`, `mhm`

**Weak fillers** (cut only if surrounded by a >250ms pause — otherwise they're part of natural speech):
- `like`, `basically`, `actually`, `literally`, `honestly`

**Silences**: any inter-word gap > `MAX_SILENCE` (default 0.5s) gets compressed to `SILENCE_PAD` (0.15s) on each side. Anything shorter is preserved — natural pacing matters.

**Pre-roll / post-roll**: trim to `HEAD_PAD` (0.20s) before first word and `TAIL_PAD` (0.30s) after last word.

## 2. Cover decisions (the rule that makes cuts not look amateur)

A naked jump cut on a face = jumpy and unprofessional. Every cut must be covered:

1. **B-roll image** preferred — bonus, it adds visual interest. The `cover_points` list in `cut_plan.json` tells you exactly where these are.
2. **Zoom-punch fallback** — applied automatically by the comp. At each cover point, the talking-head footage scales from 1.0 → `zoomPunchIntensity` (default 1.04) over ~0.13s on each side, hiding the head pop.

If you place a b-roll over a cover point, the zoom-punch is invisible behind it — that's fine, redundant safety.

## 3. B-roll selection (Claude does this, not a script)

Read the transcript. Pick **3–6 beats**, each 2.5–4.5 seconds. Criteria:

- **Concept-anchored**: a noun, claim, or number is being explained. Examples: "the funnel", "$10K MRR", "Stripe webhook".
- **Cover the cut**: prefer placing b-roll over a `cover_point`. Bonus value.
- **Skip already-visual moments**: if the speaker says "as you can see here..." they're already showing something.
- **Don't compete with captions**: place b-roll during multi-word phrases, not single-word emphasis beats.
- **Vary the rhythm**: don't dump 4 b-rolls in the first 30s and none in the last 2 minutes.

### 3a. The `reason` field is non-negotiable

Every beat in `broll_plan.json` MUST have a one-line `reason` that names what the speaker is saying and what the visual contributes. The lint script blocks render if any are missing.

Bad (blocked): `"reason": "visual interest"` / `"general b-roll"` / `"speaker is talking about software"`
Good: `"Speaker names Stripe Dashboard — show the actual interface so the viewer recognizes what's being explained"`
Good: `"Speaker enumerates three reasons indie devs ship faster — reinforce structure with a numbered list"`

If you can't write a sharp reason, drop the beat. Random abstract illustrations are worse than no b-roll — they make the video feel padded and AI-generated.

### 3b. Visual sourcing priority (real beats stock beats generated)

In order — try each tier before falling through:

1. **Real screenshots / product UI.** When the speaker names a real tool (Claude Code, Stripe, Cursor, Linear, Supabase, etc.), fetch the actual interface. `WebSearch` for the official press kit / product page, `WebFetch` to confirm, `curl -L` to download into `<workdir>/broll/<i>.<ext>`. Always verify the file is a real image (`file <path>`) — search engines sometimes return HTML error pages.
2. **Stock photo libraries.** For generic real-world concepts (a team meeting, a busy laptop, a coffee cup). Easiest path: `curl -L -o <workdir>/broll/<i>.jpg "https://source.unsplash.com/1920x1080/?<comma,sep,query>"`. If the user has `PEXELS_API_KEY` exported, prefer the Pexels API for higher curation quality.
3. **Generated illustration.** Only when the concept has no real-world referent — pure metaphors like "the funnel", "guardrails", "the pile of unread emails." Use `gpt_image_2` (Higgsfield) with the brand-styling prefix.

Tag the source with `"source": "real-screenshot" | "stock" | "generated"` so we can audit the mix later. A healthy video has more real/stock than generated — if every beat is generated, you're padding metaphors instead of showing real things.

### 3c. The `list` kind — required when the speaker enumerates

Whenever the script enumerates points ("three reasons…", "first… second… third…", "five steps", "a few things to know"), add a `kind: "list"` beat covering the whole enumeration span. Provide an optional `title` and an `items` array. The Remotion comp renders a brand-styled card (raisin black, lime accent numbers, Space Grotesk) with each row springing in on cue — way better than reaching for a stock photo of "a list."

Don't double up: when a list overlay is active, don't add a separate static b-roll on top.

## 3d. Placement — center is the default

The speaker is the show. An icon parked in the corner reads as a sticker pasted on someone else's video. Defaults:

- **`static` full-screen takeover** = the default kind. Reads clearly, looks intentional, never fights the speaker.
- **`icon` overlays** = used sparingly, only for ≤1.5s callouts. Default `anchor` is `"center"` (true vertical+horizontal center, with a slight upward bias to clear the bottom-12% caption zone). Corner anchors (`top-left`, `bottom-right`, …) are escape hatches — only use one when the framing demands it (e.g., the speaker's head fills the right half).
- **`list`** = always centered. The card is sized to ~62% of frame width and animates in from below.

## 4. Captions

- 3 words per page. More words = harder to read at speed.
- Current word: lime accent (`#CFFF05`), upscaled 1.06×, lifted 2px.
- Inactive words: white. Background: `rgba(0,0,0,0.55)` for guaranteed contrast.
- Position: 12% from bottom of frame.
- Font: Space Grotesk Bold (Everyman AI brand), uppercase.

## 5. Image generation prompts (b-roll)

Always prepend the brand styling line when calling `gpt_image_2`:

> "Editorial illustration, raisin black background (#1A0F1A), accent strokes in neo lime (#CFFF05), restrained palette, no text, no logos, clean composition, premium magazine aesthetic. Subject: <your subject here>"

This keeps every b-roll visually consistent with the brand and the captions. Without it, you get random stock-image-looking output that breaks the cohesion.

## 6. When the heuristics fail

Symptom → fix:

- **Too many cuts (compression < 60%)**: `MAX_SILENCE=0.7 ./cutplan.py ...` — be more lenient with pauses.
- **Too few cuts (compression > 95%)**: filler list isn't matching. Check transcript for what filler words the speaker actually uses; add to `HARD_FILLERS` in `cutplan.py`.
- **Cuts feel jumpy even with zoom-punch**: increase `ZOOM_PUNCH_INTENSITY=1.06`. Don't go above 1.08 or it looks like a glitch.
- **Captions out of sync**: WhisperX alignment drifted. Try `WHISPER_MODEL=small` (default is `base`) — slower but more accurate.
- **B-roll image clashes with footage colors**: re-prompt with the brand-styling prefix and explicit "no faces, no people, abstract concept".
