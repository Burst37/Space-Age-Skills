# Longform workflow — multi-minute YT videos (16:9)

For videos over ~30s the intro recipe doesn't scale: you can't hand-author every beat. This is the chapter-pass workflow that produces ~1 beat per 25–60s of content with the right templates picked by content type.

## Mental model

A longform video is **one intro + N chapter sections**. The intro uses [intro_recipe.md](intro_recipe.md). Each chapter gets:

- **One opener** — `title_card` or `chapter_bar` at the start of the section (only if the speaker explicitly transitions)
- **2–4 mid-chapter beats** — driven by what the speaker is doing
- **Captions throughout** — emphasis on ~1 phrase per chapter

The skill renders this as one continuous edit. There's no chapter splitting at the file level.

## ⚠️ Run the concept-visualization pass FIRST

Before the surface picker below, walk the transcript once through the lens in
[concept_visualization.md](concept_visualization.md). That doc catches the most
important — and most often missed — educational moments: **the speaker explaining how
something works.** The picker below answers "what speech act is happening?"; the concept
doc answers "is this an explanation, and what's the one visual that would make a muted
viewer understand it?" For this channel (educational), **at least one true concept visual
— a diagram/build that BUILDS in sync with the voice, not a text card — per ~60s of
explanation-heavy content.** A chapter that's all callouts and stat_punches has failed
the brief. Do the concept pass, then fall through to the picker for everything else.

## Template picker — content-type → kind mapping

This is the decision tree applied at every "could there be a beat here?" moment. Walk the transcript top to bottom; for each candidate moment, classify what the speaker is doing and pick the kind from the right column.

**Cinematic / kinetic templates** (added May 9 2026 batch):

| Speaker is doing | Kind | When NOT to use |
|---|---|---|
| Magnitudes of multiple numbers ARE the point | `bar_chart` | Single number → use `metric_reveal` instead |
| Explaining how systems CONNECT (graph topology, data flow between nodes) | `network_diagram` (set `flowing: true` on edges with data movement) | Linear pipeline (A→B→C only) → use `flow_diagram` |
| Pointing at something tiny in a screenshot | `annotated_screenshot` with `highlights[]` + `zoom_to_highlights: true` | Whole screenshot is the message → use `static` with `inset` |
| Major section transition in a 5+ min video | `cinematic_title` (chapter + title + subtitle) | Mid-section beat → use `chapter_bar` |
| Sequence of events HAPPENING IN TIME (not just listed) | `ticker_feed` (kinetic, items slide) | Static enumeration → use `bulleted_list` or `list` |
| Visual proof of a change (before/after) | `split_reveal` with two screenshots | Conceptual contrast (no images) → use `vs_split` |

**Sequential / categorical / structural templates:**

| Speaker is doing | Kind | When NOT to use |
|---|---|---|
| Naming a tool / product / brand for the first time | `icon` (bare:true, top-center, ~1.5s) | If the brand recurs every minute — once is enough |
| Showing or referencing their actual screen / dashboard / app | `static` (inset: 0.10) | Don't use for hypothetical screens — need a real screenshot |
| Showing actual code / config / command / terminal output | `code_block` (with `language` + `filename`) | Use when the EXACT text matters; for a vague "code is involved", use `static` of an editor screenshot or `ai_image_on_grid` |
| Stating a single hero number or stat | `stat_punch` | Don't double-up with a callout on the same line |
| Hero number with growth/revenue/retention story (magnitude should feel earned) | `metric_reveal` (animated count-up) | If number is incidental, `stat_punch` is enough |
| Quoting an inbound message ("I got a Slack saying", "my routine emailed me") | `notification_toast` (partial overlay) | If it's the speaker's OWN words, use `callout`; if it's published / public quote, use `quote_pull` |
| Reading a tweet, comment, customer line | `quote_pull` | Speaker's own words → callout, not quote_pull |
| Arguing X vs Y / before/after / old/new | `vs_split` (3 items per side, 3–5s) | If only one side matters — use callout instead |
| Name-dropping 4–8 short tokens | `keyword_chips` | Single token → no overlay needed |
| Walking through 3–5 ordered steps with descriptions | `vertical_timeline` | If items are punchier than descriptions — use `progress_steps` instead |
| Listing 3–5 step labels (no descriptions) | `progress_steps` | If you have descriptions, use `vertical_timeline` |
| Enumerating short items (no descriptions, fast cadence) | `list` | If items need 2-line descriptions, use `vertical_timeline` |
| Section/chapter opener with a "5 things" framing | `title_card` | Only at the very top of a section, not mid-flow |
| Persistent context tag while speaker continues | `chapter_bar` (bottom-third, doesn't take over) | Don't use for one-off labels — use callout |
| Concrete physical thing (a key, a server, a lock) — no real referent | `ai_image_on_grid` (Higgsfield gpt_image_2) | Skip if a real screenshot exists; real beats AI |
| Punchline / "remember this line" | `callout` (prefix + lime highlight + suffix) | Don't use for filler — every callout must EARN being there |
| The roadmap / "what we're covering today" | `horizontal_timeline` (4 cards, static, 1s spacing) | Only once per video, in the intro section |

## Density rules

- **≤4 beats in any 12-second rolling window.** Higher density feels frantic.
- **≥1 beat per 60s.** Lower density feels like there's no edit at all.
- **No back-to-back same-kind beats** (two callouts in a row) — alternate kinds even if both fit.

The lint script enforces these. If lint warns "density exceeds cap", drop the lowest-priority beat in that stretch (priority order: `vs_split` / `quote_pull` / `stat_punch` > `static` real screenshot > template re-statements > `ai_image_on_grid`).

## Caption strategy for longform

- **Run captions for the whole video.** They generate from `words.json` automatically, no per-section work.
- **Pick ~1 emphasis phrase per minute.** Total: 5–15 phrases for a 5–15 min video. Format: `CAPTION_EMPHASIS="phrase1|phrase2|...|phraseN"`.
- **Each emphasis phrase fires a pen-scratch SFX, EXCEPT the last one** (closer rule). So if you mark the final CTA as emphasis, it gets the typographic pop without the audio sting.

## Step-by-step

### 1. Probe + transcribe + polish

Same as intro recipe, no change.

### 2. Skim the transcript and identify chapters

Open `<workdir>/words.json`. Look for natural transitions:

- Speaker says "OK so [topic]" / "next up" / "now let's"
- A pause >1.5s (often a chapter break)
- A topic shift (you'll feel it)

For each chapter, note:
- Approx start/end time
- The 1–2 beats you'd plan for the section (use the picker above)

### 3. Author the b-roll plan in chunks

Don't try to write the whole plan at once. Author chapter-by-chapter, then concatenate into one `broll_plan.json`. Pattern:

```json
[
  // ── Intro section (≤30s) — uses intro_recipe.md verbatim ────────
  { "kind": "icon",                "start_sec": 0.55, ... },
  { "kind": "static",              "start_sec": 2.10, ... },
  { "kind": "callout",             "start_sec": 7.0,  ... },
  { "kind": "horizontal_timeline", "start_sec": 9.55, ... },

  // ── Chapter 1: <topic> ────────────────────────────────────────
  { "kind": "title_card", "start_sec": 31.0, "end_sec": 33.5, "number": "01", "title": "<chapter title>", ... },
  { "kind": "callout",    "start_sec": 48.2, ... },
  { "kind": "stat_punch", "start_sec": 65.0, ... },

  // ── Chapter 2: <topic> ────────────────────────────────────────
  { "kind": "title_card", "start_sec": 90.0, ... },
  { "kind": "vs_split",   "start_sec": 110.0, ... },
  ...
]
```

### 4. Pick the music track

Default `bg-feelgood-builder.mp3` works for tutorial / longform / "founder builder" energy. Other options in [music_library.md](music_library.md). Override per render:

```bash
MUSIC_TRACK=bg-feelgood-fretless.mp3 bash render.sh ...
```

For longer videos (10+ min) the same track loops. Loop point feels natural for all the current options.

### 5. Render

```bash
CAPTION_EMPHASIS="<phrases pipe-separated>" \
  bash scripts/render.sh "<input.mp4>"
```

The pipeline scales — same scripts, same outputs, just a longer Remotion render. Expect ~5–10 min render time per minute of source for 4K → 1080p output (depends on machine).

### 6. QA loop

For longform, watch in 30s scrubs and verify:

- Each chapter has at least one beat
- No 60s stretch has zero beats
- No 12s stretch has 4+ beats
- Density caps are respected (lint will tell you upfront)
- Captions disappear cleanly when takeovers land
- Music doesn't loop awkwardly mid-sentence (rare; if so, switch tracks)

## Authoring acceleration ideas (future work)

- **Chapter detector**: auto-segment `words.json` on long pauses + topic-shift LLM call. Output: list of (start, end, gist) tuples. Dramatically speeds up step 2.
- **Beat suggester**: given a chapter's transcript chunk, LLM picks the kind + drafts the props. Human reviews. Currently this step is hand-authored.
- **Plan diff viewer**: render a single "preview slate" image showing where every beat lands on a timeline. Useful for QA before committing to a 10-min render.

These don't exist yet (May 2026). Build them when the manual workflow becomes the bottleneck — we're not there yet for the volume of longform Luuk produces.
