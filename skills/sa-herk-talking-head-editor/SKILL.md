---
name: sa-herk-talking-head-editor
description: Nate Herk edit kit on HyperFrames: raw talking-head footage → transcript → cut silences → cut mistakes → visual storytelling beats → motion graphics, captions, B-roll, music, SFX; plus short-form reels and 10–30 s motion showreels. Use when the user says edit my video, cut the silences, remove mistakes, make a reel/Short from this recording, or motion showreel.
---

# SA Herk Talking-Head Editor
Agent pipeline for editing real footage, built on HyperFrames + GSAP. Projects live in `video-projects/<slug>/`; source recording is never overwritten.

## Setup
Clone, `npm i`, ffmpeg. Read `docs/TOOLS-AND-API-KEYS.md`. Transcription default ElevenLabs (paid → ask); local Whisper is the free route.

## Workflow (edit-video)
1. ffprobe the source; copy into project assets.
2. Word transcript (reuse if present).
3. cut-silences → EDL + retimed transcript.
4. cut-mistakes → review candidates in context, keep intentional emphasis.
5. video-storytelling + hyperframes-video-beats → beat sheet, one visual idea per beat.
6. MOTION_PHILOSOPHY.md + style-library card → author compositions.
7. Preflight, `hyperframes lint`, transcript-sync validator, Studio review, then render.
- Short-form: short-form-edit. Showreel: motion-showreel. Beginners: make-a-video.
- Overlap: his `hyperframes`, `gsap-*`, `post-production-orchestrator`, `capcut-video-director`. The kit's hyperframes/gsap sub-skills are omitted in favour of his.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).
- Video generation: never a Grok video model (grok-imagine-video, "Grok Video"). Use Seedance 2.5/2.0 in Dreamina, Kling 4.0 or MiniMax H3. If the upstream text names Grok video, swap in one of those.

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| cut-mistakes | Agent 2 of the video editing pipeline. Finds and removes spoken mistakes — stutters, repeated words, false starts, and retakes (re-recorded lines) — from a talking-head recording. Use after cut-silences, when asked to... | `.claude/skills/cut-mistakes/SKILL.md` |
| cut-silences | Agent 1 of the video editing pipeline. Removes silences and dead air from a talking-head recording. Use when asked to cut silences, trim pauses, remove dead air / gaps, or tighten the pacing of a raw video, given a wo... | `.claude/skills/cut-silences/SKILL.md` |
| edit-video | Edit a raw talking-head video through transcription, silence trimming, mistake review, visual storytelling, motion graphics, and verified HyperFrames rendering. Use for a complete edit; route a single requested operat... | `.claude/skills/edit-video/SKILL.md` |
| hyperframes-video-beats | Plan, write, time, style, and validate motion-graphic beats for long-form talking-head HyperFrames videos. Use when Codex is asked to add or improve visual beats, glassmorphism lower thirds, crumpled-paper full-screen... | `.claude/skills/hyperframes-video-beats/SKILL.md` |
| make-a-video | Beginner-friendly end-to-end video creator for HyperFrames. Use when the user says "make a video", "create a video", "new video", "build a video", "video from scratch", "I want to make a video", "help me create a vide... | `.claude/skills/make-a-video/SKILL.md` |
| motion-showreel | Design and build a 10-30 second motion-design showreel or brand reel in the style of Nate's Opus 5.5 "CLAUDE / MOTION REEL": one brand motif transformed through labeled craft chapters, a persistent HUD, cuts locked to... | `.claude/skills/motion-showreel/SKILL.md` |
| short-form-edit | Turn talking-head footage into a finished reel, YouTube Short, or short advertisement with curiosity-led openings, earned payoffs, story-driven cuts, transcript-synced motion graphics, moving B-roll, captions, subtle ... | `.claude/skills/short-form-edit/SKILL.md` |
| short-form-video | Maintain the existing May Shorts teaching compositions using their legacy face-mode, scene-overlay, and karaoke-caption patterns. Use only when working on those examples or explicitly requesting this legacy scaffold. ... | `.claude/skills/short-form-video/SKILL.md` |
| style-library | Select, customize, or extend the project's reusable motion-graphics card library and style templates. Use for choosing a visual style, adding a card, building a new style pack, or reusing a template in a HyperFrames v... | `.claude/skills/style-library/SKILL.md` |
| video-storytelling | Design and build the visual layer of a long-form talking-head video as one persistent world the camera moves through, instead of a sequence of separate graphics. Use when asked to edit a video, add motion graphics, de... | `.claude/skills/video-storytelling/SKILL.md` |
| website-to-hyperframes | Capture a website and create a HyperFrames video from it. Use when: (1) a user provides a URL and wants a video, (2) someone says "capture this site", "turn this into a video", "make a promo from my site", (3) the use... | `.claude/skills/website-to-hyperframes/SKILL.md` |

## Appendix B — Pipeline skills

### `.claude/skills/edit-video/SKILL.md`
_Edit a raw talking-head video through transcription, silence trimming, mistake review, visual storytelling, motion graphics, and verified HyperFrames rendering. Use for a complete edit; route a single requested operation directly to its specialist skill._

#### Edit a video

Keep each project in `video-projects/<slug>/`, preserving the source recording.
Read the workspace guide and the project's brief or DESIGN.md. If a direction is
missing, propose a style from `style-library/registry.json` based on the footage.

1. Inspect duration, streams, and source resolution with ffprobe. Copy the source
   into the project's assets or reference an explicitly provided local path.
2. Read `docs/TOOLS-AND-API-KEYS.md` before service setup. Reuse a matching word
   transcript. Otherwise use the student's chosen provider; Nate defaults to
   `node scripts/transcribe-elevenlabs.mjs <source>`. OpenAI Whisper and local
   Whisper are supported workflow alternatives after transcript normalization.
   Check available credentials or local dependencies. Explain uploads and costs
   before any service call whose authorization is still missing.
3. Read `../cut-silences/SKILL.md`. Produce an EDL and a retimed transcript, and
   render the silence pass when editing is authorized.
4. Read `../cut-mistakes/SKILL.md`. Inspect candidates in context and preserve
   intentional emphasis. Record the reviewed cuts. If no mistakes need cutting,
   carry forward the silence output. Match every transcript to its actual video.
5. Read `../video-storytelling/SKILL.md` for the visual arc and
   `../hyperframes-video-beats/SKILL.md` for overlays. Write a beat sheet with
   transcript anchors, one visual idea per beat, and deliberate callbacks.
6. Read `MOTION_PHILOSOPHY.md`, `../hyperframes/SKILL.md`, and relevant GSAP
   references before authoring. Use `../style-library/SKILL.md` to select or
   adapt a card. Localize every asset used by the composition.
7. Run preflight and HyperFrames lint from the project, plus the transcript-sync
   validator for anchored sub-compositions. Review Studio before the draft.
8. Render a draft, inspect encoded frames and transitions, and listen across cut
   boundaries. Check face framing, text legibility, black frames, and A/V sync.
   Resolve failures before the final render. Follow any review approvals already
   provided; do not repeat approval requests for the same authorized action.

Deliver the final MP4 path, edit decisions, retimed transcript, composition,
and `VERIFY.md` describing what was checked and any remaining limitations.
An automated detector proposes edits; editorial judgment remains necessary.

### `.claude/skills/cut-silences/SKILL.md`
_Agent 1 of the video editing pipeline. Removes silences and dead air from a talking-head recording. Use when asked to cut silences, trim pauses, remove dead air / gaps, or tighten the pacing of a raw video, given a word-level transcript. Produces an edit list (EDL), a re-timed transcript for downstream agents, and optionally the cut video via ffmpeg. Does NOT cut mistakes, repeats, or false starts — that is the cut-mistakes agent._

#### Cut Silences (Pipeline Agent 1)

First step of the automated edit. Takes a raw recording + its word-level transcript and removes **only silence**: dead air before the first word and after the last word, plus inter-word pauses longer than a threshold (trimmed down to a natural breath, never a hard zero-gap). It leaves the speaker's words untouched — false starts, retakes, and stutters are the **cut-mistakes** agent's job (Agent 2).

This agent is deterministic and transcript-driven, so its output (`*.silence-transcript.json`) feeds cleanly into the next agents and the beat-sync validator.

##### When to use

- "cut the silences", "trim the pauses", "remove dead air", "tighten the pacing"
- As the first stage of the master edit workflow, right after transcription.

##### Prerequisites

A word-level transcript JSON. Either the ElevenLabs Scribe shape
(`{ words: [{ text, start, end, type }], audio_duration_secs }`) or a generic
`{ words: [{ text, start, end }] }`. Generate one with the workspace transcriber:

```bash
node scripts/transcribe-elevenlabs.mjs path/to/raw.mp4    # -> path/to/raw.json
```

##### Usage

```bash
# 1) Plan only — compute the cut, write EDL + re-timed transcript (no video touched)
node .claude/skills/cut-silences/scripts/cut-silences.mjs <transcript.json> \
  --out-dir video-projects/<slug>/assets

# 2) With a video — also write the ffmpeg command (still does not render yet)
node .claude/skills/cut-silences/scripts/cut-silences.mjs <transcript.json> \
  --video video-projects/<slug>/assets/raw.mp4 --out-dir video-projects/<slug>/assets

# 3) Render the cut video (local ffmpeg, re-encode, A/V kept in sync)
#    add --apply to actually run ffmpeg
node .claude/skills/cut-silences/scripts/cut-silences.mjs <transcript.json> \
  --video video-projects/<slug>/assets/raw.mp4 --apply \
  --output video-projects/<slug>/assets/edited-silenced.mp4
```

###### Options

| Flag | Default | Meaning |
| --- | --- | --- |
| `--video <path>` | — | Source video; enables the ffmpeg command / render |
| `--out-dir <dir>` | next to transcript | Where outputs are written |
| `--output <path>` | `<video-stem>.silenced.mp4` | Cut-video path |
| `--gap <s>` | `0.55` | Minimum pause treated as trimmable silence |
| `--head-pad <s>` | `0.22` | Silence kept before the first word |
| `--tail-pad <s>` | `0.34` | Silence kept after the last word |
| `--apply` | off | Actually run ffmpeg to render the cut |

##### How it decides (the silence rules)

- Pauses below `--gap` (0.55s) are left alone — natural speech rhythm.
- For a trimmed pause, a **natural breath is kept**, scaled by context: `0.24s` for long pauses (≥2s), `0.20s` after a sentence ender (`. ! ?`), `0.14s` otherwise. The kept breath is biased slightly toward the end of the previous phrase.
- Head/tail dead air is trimmed to `--head-pad` / `--tail-pad`.
- Delete ranges are merged; keep ranges are the complement. The cut is rendered with an ffmpeg `trim`/`atrim` + `concat` filtergraph (written to a `*.silence-filter.txt` script and passed via `-/filter_complex`), so video and audio stay in sync.

##### Outputs (written to `--out-dir`)

| File | Purpose |
| --- | --- |
| `<stem>.silence-edl.json` | Keep/delete ranges, durations, params — the edit list |
| `<stem>.silence-transcript.json` | Words re-timed onto the edited timeline (feeds Agent 2 + beats) |
| `<stem>.silence-decisions.md` | Human-readable summary + largest pauses trimmed |
| `<stem>.silence-filter.txt` | The ffmpeg filtergraph (only with `--video`) |
| `<video-stem>.silenced.mp4` | The cut video (only with `--apply`) |

The JSON summary printed to stdout includes `removed`, `removedPct`, range counts, and output paths — useful for the master workflow to log and chain.

##### Tuning notes

- Talking-head YouTube default (`--gap 0.55`) removes roughly 15-20% of a typical raw take as pure silence. Lower `--gap` for a punchier, faster cut; raise it to preserve more natural breathing room.
- If a cut feels too aggressive at sentence boundaries, raise the sentence-break breath, or raise `--gap`.

##### Hand-off to the next agent

Pass `<stem>.silence-transcript.json` (and the `silenced.mp4` if rendered) to the **cut-mistakes** agent. Because timestamps are already on the edited timeline, downstream beat timing and `scripts/validate-beat-sync.mjs` work without further adjustment.

### `.claude/skills/cut-mistakes/SKILL.md`
_Agent 2 of the video editing pipeline. Finds and removes spoken mistakes — stutters, repeated words, false starts, and retakes (re-recorded lines) — from a talking-head recording. Use after cut-silences, when asked to cut mistakes, remove stutters / repeats / filler restarts, clean up flubs, or keep the best take. Works review-gated: it proposes every cut with context and a reason for approval, then renders only the approved cuts via ffmpeg. Requires a word-level transcript._

#### Cut Mistakes & Repeats (Pipeline Agent 2)

Second step of the automated edit, run after **cut-silences**. It removes the things a human editor cuts on a second pass: stutters ("the the", "I- I-"), immediately repeated words, false starts (an abandoned phrase that restarts), and retakes (a line re-recorded — keep the clean take, drop the botched one).

Deciding what counts as a mistake is **judgment, not a formula** — emphatic repetition ("never, never") and rhetorical doubling ("the first piece is, is this…") look identical to a stutter mechanically. So this agent is **review-gated by default**: it surfaces candidates with full context; the agent (and the user) decide; only approved cuts are rendered.

##### When to use

- "cut the mistakes", "remove stutters / repeats", "clean up the flubs", "keep the best take", "cut false starts"
- As the second stage of the master edit workflow, on cut-silences' output.

##### The three-part flow

###### 1. Find candidates (mechanical)

```bash
node .claude/skills/cut-mistakes/scripts/find-cut-candidates.mjs \
  <silence-transcript.json> --out-dir video-projects/<slug>/assets
```

Input is normally Agent 1's `<stem>.silence-transcript.json`, so cuts land on the already-silenced timeline. Writes:

- `<stem>.cut-candidates.json` — structured candidates (type, confidence, proposed `cut` range, `removes`/`keeps` text, context, recommendation)
- `<stem>.cut-candidates.md` — readable proposal

Candidate types: `stutter` (immediate word repeat), `retake` (duplicate/near-duplicate segment via Jaccard similarity), `false_start` (short abandoned phrase that restarts).

###### 2. Review (the gate — REQUIRED)

Read each candidate **in context** and decide keep-or-cut. The mechanical detector cannot tell intentional emphasis/rhetoric from a real flub, so do not trust `recommend` blindly — read `removes` + `context`. Common false positives: emphatic repetition ("it's never, never hands-off"), copula-then-question ("the piece is, is this…"), listing.

Present the candidates to the user with a recommendation per item; collect approvals. Write the approved cuts to a file:

```json
{ "cuts": [ { "start": 100.93, "end": 101.06, "reason": "I- false start" }, ... ] }
```

(`start`/`end` in seconds on the input transcript/video timeline. You can widen a candidate's range — e.g. for a retake, cut from the botched take's start to the clean restart.)

###### 3. Apply approved cuts

```bash
node .claude/skills/cut-mistakes/scripts/apply-cuts.mjs \
  <silence-transcript.json> --cuts approved-cuts.json \
  --video video-projects/<slug>/assets/edited-silenced.mp4 \
  --output video-projects/<slug>/assets/edited-clean.mp4 --apply
```

Writes the EDL, a re-timed `<stem>.mistakes-transcript.json` (feeds the motion-graphics agent + `validate-beat-sync.mjs`), a decisions log, and — with `--apply` — the cut video (ffmpeg trim+concat, A/V in sync). Drop `--apply` for a dry run.

##### Reviewing the result

Use the shared review tool to eyeball the cuts and spot-check boundaries:

```bash
node scripts/build-edl-review.mjs <stem>.mistakes-edl.json \
  --original video-projects/<slug>/assets/edited-silenced.mp4 \
  --edited   video-projects/<slug>/assets/edited-clean.mp4 \
  --output   video-projects/<slug>/assets/mistakes-review.html
npx serve . -p 8080 -n
```

##### Notes

- A very clean delivery may yield few or zero real cuts — that's a valid outcome; don't cut natural speech to hit a quota.
- Cuts between two spoken words are hard joins. They're usually clean for stutters/false starts; for tighter audio a 20-30ms fade can be added later.
- Hand the `mistakes-transcript.json` + the clean video to **Agent 3 (motion graphics / tiered cards)**.

### `.claude/skills/video-storytelling/SKILL.md`
_Design and build the visual layer of a long-form talking-head video as one persistent world the camera moves through, instead of a sequence of separate graphics. Use when asked to edit a video, add motion graphics, design the visuals for a script, plan an edit, or fix an edit judged confusing, text-heavy, hard to follow, or "clearly made by an AI". Covers the persistent world, camera grammar, the spotlight rule, spatial open loops, ornament and token discipline, transcript timing, and the verification gates._

#### Video storytelling

How to build the visual layer of a long-form video so a viewer is still oriented
at minute nine. Applies to any talking-head video with a script: a news take, a
single-topic deep dive, a comparison, a tutorial, a listicle.

The failure this replaces is scene-thinking. A new graphic every few seconds
makes the viewer restart comprehension every few seconds, and no individual
graphic is at fault, which is why the feedback comes back as the vague
"confusing" or "too much going on" rather than as a specific defect.

For a neutral practice beat sheet, read `docs/STORYTELLING-WORKBOOK.md` at the
repository root. The reusable design system is in this skill's
`reference/design-system.md`; the worked open-loop geometry is in
`reference/patterns/wall-of-slots/`. Private source videos are not required.

This is not `hyperframes-video-beats`. That skill places overlay cards on top of
a talking head. This one designs the thing the video is *about*.

##### 1 · The four principles

###### One persistent world

The video lives in a single space, and it never resets. Everything the viewer has
already seen still exists where they left it, and new material is added to it
rather than replacing it. An element, once drawn, is never redrawn, moved, or
relabelled.

Everything else in this skill depends on that. The camera has nowhere to go if
the space keeps changing, a spotlight means nothing if there is nothing else on
screen, and an open loop cannot stay open in a world that resets.

The world also has to be worth staying in, so decide the spatial grammar before
building anything and hold it for the whole runtime. In the reference build:
left to right is toward the outcome, up is toward a human and is the only warm
thing on screen, down is into a system of record. A viewer who learns that in the
first two minutes reads the rest of the video for free.

Break the grammar exactly once, deliberately, for meaning. The reference build's
only right-to-left move in ten minutes is a resolved ticket reversing back into
the queue on the words "reopen rate". It lands without a word because direction
had meant something for the previous three minutes.

###### The camera is the edit

Cutting to a new graphic costs the viewer their bearings every time. Moving
through a space that stays put costs them nothing. A push-in then reads as "look
closer at the part of the thing you already understand", and the pull-back is
where the work pays off, because everything built so far is still there.

Work in three altitudes and move between adjacent ones:

| Altitude | Shows | Used for |
| --- | --- | --- |
| World | the whole space | orienting, payoffs, "here is where we are" |
| Region | the subgraph under discussion | most of the runtime |
| Detail | one element | a number, a state change, a decision |

Jumping detail to world is disorienting unless it is a deliberate payoff beat, in
which case it is the best move available.

Rules that cost a rebuild each to learn:

- **Name framings as exact world windows, not as scale factors.** Window
  boundaries must fall *between* labels. Specifying a framing as "scale 0.6"
  slices words in half at the frame edge.
- **Reuse the same window for the same purpose.** If the orient shot is a
  particular window, always use that exact window. Near-identical framings read
  as drift.
- **Vary duration with distance travelled**, not one global preset.
- **Camera and full-frame wipes sequence, never overlap.** Concurrent, they
  guillotine content. Camera first, then wipe.
- **A cover layer goes opaque before the camera moves underneath it.** Reversed,
  part of the move is exposed and reads as a jump cut.
- **No label within 60px of the frame edge.** An element may bleed and read as
  "the world continues"; a word cut mid-glyph reads as a bug. Solve it by
  placement, not by masking, since a feather cannot catch a blade travelling
  ~1800 px/s.
- **Two sequential moves on the same subject read as a glitch.** A reframe that
  finishes and THEN a wipe that starts is a zoom, a dead stop, and a second
  motion — the client calls it "a glitch and a pause". Merge them into ONE
  gesture: shared symmetric ease (power2.inOut), landing on the same frame, so
  the panel reads as pushing the footage aside. Related: front-loaded eases
  (power3/4.out) on a *visible footage* move front-load ~90% of the travel and
  crawl to a stop; reserve them for element entrances, where the crawl reads as
  settling. (Cost a client-flagged revision on the worked example intro.)

###### Attention is a spotlight

**Exactly one element at full brightness at any moment. Everything else already
drawn stays quiet but legible.** Not optional. This is the rule that lets a world
accrete to a dozen elements without ever feeling busy, and it is what makes the
pull-back readable rather than overwhelming.

Hierarchy comes from the RATIO between active and quiet, never from making
everything dark. The first prototype of the reference build had a brightest pixel
of 101/255 and was unreadable at 960x540; the fix was brighter ink, not more dim.

| State | Target luma (Y, 16-235) | Opacity in the reference |
| --- | ---: | ---: |
| Active stroke + label | 200-235 | 1.0 |
| Context, drawn and still relevant | 120-150 | 0.56 |
| Spent, said its piece | 85-105 | 0.33 |
| Any label, any state | never below 90 | |

Implementation is one function, called at every narration beat with the ids being
talked about (`build_s01.py`, `lit()`):

```python
def lit(t, active, warm=(), dur=0.5, floor=FLOOR):
    active = list(active) + [g + "-l" for g in active if g + "-l" in order]
    for gid in order:
        if gid not in opac:      # never drawn: nothing to light
            continue
        tgt = 1.0 if gid in active else (WARM if gid in warm else floor)
        if gid not in active:
            tgt = min(tgt, MUTED.get(gid, 1.0))
        ...
```

Three details in there are load-bearing:

- **A label always inherits its element's state** (the `-l` suffix fold-in). A lit
  element with an unreadable label under it is the exact defect being fixed.
- **A prop that is finished retires to opacity 0**, via a `MUTED` cap, not to 0.3.
  Muting to 0.3 leaves unexplained confetti on screen for the rest of the section.
  Generator rule: emit the `mute()` **before** any later-starting `lit()`, or the
  mute is overwritten when its tween completes.
- **Opacity events must be emitted in timeline order** or the tracker sees stale
  state and computes the wrong target. Keep a `seq()` guard that raises on
  out-of-order emission.
- **One opacity authority per element per window.** Two simultaneously-active
  tweens driving the same element's opacity to different values render smoothly
  in a standalone section but strobe at ~10Hz in the assembled master, where the
  winning tween alternates per frame. The reference build shipped this defect at
  every dock. When a sweep like `lit()` overlaps an explicit brighten or mute,
  the later-starting tween is the sole driver and the sweep skips those ids
  (`lit(..., skip=(...))`). Gate it: scan assembled renders for one-frame
  out-and-back luminance pops in every transition window
  (`qa/v4/flicker/qa-flicker.mjs` in the reference build).

###### Open loops are spatial

Never say "we'll come back to this." Leave something visibly incomplete in the
world and return to it. A promise the viewer can see is a promise they can feel
outstanding.

The mechanic is identical whatever the shape:

1. **Plant it in the hook**, in the space, on the line that makes the promise.
2. **Re-show it at every boundary.** Any section handoff is a boundary. The
   re-show costs about two seconds and is the retention mechanic; skipping it is
   how a payoff ends up paying off nothing.
3. **Advance it visibly.** The viewer must see the incompleteness shrink.
4. **Close on the image you opened on.**

Pick the shape from the script:

| Script shape | The world | What is incomplete |
| --- | --- | --- |
| N parallel items | N sockets on a spine | empty slots (see `reference/patterns/wall-of-slots/`) |
| One process, deep | the full pipeline, laid out | a broken or missing link |
| Levels or tiers | a stack that builds upward | the top of the stack is a ghost |
| Comparison | two columns on one shared axis | one column empty, or an unfilled scorecard |
| News or announcement | a timeline, or a landscape map | the right side, the future, is blank |
| Tutorial or build-along | the finished architecture, ghosted | every node not yet built |

Handing an item to its slot is a live camera move, ~1.4s, never a cut to a
pre-made picture of the filled state. The viewer watches the thing they just
learned become the tile. If the video has a numeral or counter, roll it inside
that same move, as an odometer, with the same start, duration and ease for both
digits or they merge into one band mid-roll.

**The counter needs a name, not just a number.** A corner numeral tells the
viewer where they are in the sequence but not what the current item *is*; nine
minutes in, "03" carries nothing. Pair the numeral with a 1-2 word label naming
the current item (SUPPORT, VOICE AI), in the same plate chemistry, moving as one
rigid fixture with the numeral, swapping inside the same odometer roll. Client
review of the reference build asked for exactly this: the visuals were good and
the viewer still lost track of which use case was on screen.

##### 2 · Discipline

###### If it doesn't get a word, it doesn't get drawn

Every shape is a labelled element, a connector between labelled elements, the
travelling subject, or the ambient ground. Nothing else.

This came from a mute-test review that scored comprehension 7/10 and named the
cause: the diagram was clean, the decorations were not. A dozen unlabeled shapes
drawn in the same weight and palette as the meaningful ones, so a first-time
viewer cannot tell signal from texture and spends real attention decoding things
that were never meant to be decoded. That is "too much going on" relocated from
words into shapes.

Budget: **~20 on-screen words per section.** No sentences. Labels are 1-2 words,
under their element. The reference section 1 is 21 words in 84 seconds.

**Corollary: an anti-pattern visual never overlays the recommendation.** Take the
world to near-black first, or put the counter-example where the good diagram
isn't.

###### Give the viewer one thing to follow

Carry the story on a single travelling subject whose state visibly changes: a
chip with data rows and a score bar, a document, a request. Rows fill, a bar
moves, a border changes colour. A viewer must be able to follow an entire section
by watching that one object, and it must never teleport; it moves along drawn
connectors at a constant speed.

###### One global token set

Full detail in `reference/design-system.md`.

| Token | Values |
| --- | --- |
| Stroke | 1.5 / 2.5 / 4 / 7, and nothing else |
| Type | 22 / 30 / 42 / 60 / 84 |
| Radius | 10 / 22 / 40, always superellipse(2) |

Five colours, five fixed meanings, zero decoration. Warm means a human is
involved and nothing else is ever warm. Never pure white for type; it halates on
dark.

The failure this prevents, from the craft review of the first build: *"every
decision was made locally and correctly; no decision was made globally."* 18
stroke weights and 9 type sizes, most of them 0.2 apart, individually invisible
and collectively fatal. The eye gets noise instead of hierarchy. Gate it with a
token linter that fails the build.

###### Motion

Entrances on `cubic-bezier(0.16,1,0.3,1)`, exits faster than entrances, duration
varies with mass so a 290px node and a 40px label do not decelerate identically,
and `back.out` **exactly once per section**, on the beat that deserves it.

**No cross-fade, ever.** Full-bleed layers enter and exit by clip on an already
opaque background. At any instant a pixel is either graphic or footage.

##### 3 · Build contract

- **One generator per section.** `scripts/build_<id>.py` writes only
  `compositions/<id>.html`. Edit the generator, never the generated HTML. Section
  roots `index-*.html` are hand-maintained, so framing changes go there.
- **Shared modules stay shared.** Anything that defines shared geometry is
  imported by every section. If sections are built by parallel agents, forbid them
  from touching shared modules; divergent geometry silently breaks every handoff.
- **Namespace the SVG defs before assembly.** Each section defines its own
  `gEdge`, `shadow`, `edgeFade`. In one assembled DOM `url(#id)` resolves to the
  first match in document order, so once an earlier composition unmounts, every
  later graphic paints **nothing**. Cost in the reference build: 35 seconds of
  empty screen with every gate green. Only looking at the assembled render caught
  it.
- **Time everything to word starts** from a word-level transcript, entering
  0.15-0.25s **ahead** of the anchor word. Never divide a section evenly into
  beats.
- **Audit gaps.** Any stretch over ~1.5s with nothing happening is a dead screen;
  have the generator print them.
- **Leave air in the cut.** Aggressive pause-capping produces near-zero gaps at
  sentence boundaries that the client hears as "stutters" and jump-cuts.
  Calibrate against the speaker's own norm: flag sentence-boundary gaps that are
  ~10x tighter than their median (the reference speaker's was 470ms; the flagged
  junctions sat at 20-40ms), and repair by inserting 4-8 frames of air, words
  never touched. Air is a donor slice of the track's real room tone with 10ms
  fades, never `anullsrc`: digital silence against a -50dBFS floor is an audible
  dropout. Video holds the frame; between sentences a talking head is near-still
  and 4-8 frames of hold is invisible. Insertion-only changes shift the
  transcript deterministically, so no re-transcription is needed. **An insert's
  edges must respect the speech envelope**: butting donor tone against a word
  tail in 1ms amputates a decay that naturally takes 60-120ms, and the client
  hears the cliff as a stutter. Splice with a 40ms equal-power crossfade into
  the tail's own decay, never a hard butt.
- **Baked times mean scripted shifts.** Generators bake hundreds of proto-time
  literals, and section offsets, seam tables, and root tweens all hold absolute
  times. Any timeline change after graphics exist (even a 2s air pass) must go
  through a reviewed AST/parse-level transform that shifts every literal after
  each edit point, then a diff review, never hand edits. Derive every shift from
  the canonical edit list itself; the reference pass caught a 2-frame error in
  its own audit's precomputed offsets by re-deriving.
- `--workers 1` on render. Parallel workers make the video layer paint black.

##### 4 · Gates

Run all of them, then look anyway.

```bash
node scripts/qa-tokens.mjs          # 0 off-system strokes / type sizes / radii
node scripts/qa-no-crossfade.mjs    # 0 full-bleed layers animating opacity
node scripts/qa-legibility.mjs <render>
node scripts/qa-seamjump.mjs <render> plan/cover-seams.json --control <cut>
node scripts/qa-deadframe.mjs <render> --control <cut>
node scripts/qa-presence.mjs <render> --every 1      # speaker on-screen share
node scripts/integrate.mjs --check                   # 0 gaps, 0 stale mounts
npx hyperframes lint
```

**Gates do not replace looking**, and gates that have never failed are not gates.

- **Motion smoothness is verified on contiguous frames, never on beat frames.**
  A single frame per beat proves composition; every motion defect — a jump into
  a move, a crawl to a dead stop before a second move, a freeze, a one-frame
  pop — lives *between* beat frames and survives every other gate. Before any
  delivery, tile a contiguous strip across EVERY transition window (camera
  move, wipe, reframe, dock, section seam) and read the strips:

  ```bash
  ffmpeg -i render.mp4 -vf "select='between(n,A,B)',scale=480:270,tile=layout=6x7" \
    -frames:v 1 tile-<window>.png
  ```

  Defect signatures to read for: adjacent tiles with a large jump then several
  near-identical tiles (front-loaded ease / dead stop); motion that halts and
  a *different* motion that then begins (two moves that should be one gesture);
  any single tile unlike both neighbours (pop). The worked example intro
  shipped a zoom-freeze glitch that passed tokens, cross-fade, legibility,
  dead-gap and per-beat frame reads; the client caught it in one viewing. This
  class recurs — treat this strip-read as load-bearing, not optional.
- **Legibility is not automatable.** Absolute pixel-share thresholds measure text
  volume, not legibility; a wordy build scores *higher* than a sparse one. Read a
  960x540 downscale of every major beat by eye.
- **Validate every gate against a control** known to trip it. A seam gate that
  reports zero on a broken build is worse than no gate.
- **Verify the assembled artifact**, never section prototypes. Most of the bugs
  that survived this build's gates existed only in the assembly.
- **Audit audio at the acoustic level, not the transcript level.** A transcript
  derived from the pre-edit source is structurally blind to artifacts the edit
  created, and a text sweep over it will report "clean" while the client hears
  stutters. What actually finds them, in yield order from the reference build:
  a whole-track dead-span scan (runs of digital-zero samples inside pauses whose
  real floor is ~-70dBFS read as dead holes; fill with room tone), 1ms-resolution
  envelope forensics at every junction edge (a sample-derivative click check
  passes an envelope cliff that the ear flags instantly), and a fresh ASR pass
  on the delivered audio diffed against the expected text. Phoneme-repeat
  autocorrelation found nothing: what clients call "stutters" are usually
  truncation cliffs and dead holes, not doubled words.

Presence: aim for ~40% speaker-on-screen across a graphics-led video. Long
absences are fine at payoff beats that need full width; audit them rather than
capping them.

##### 5 · Order of work

1. Lock the cut and get a word-level transcript. Everything is timed to it.
2. Choose the world, the spatial grammar, and the travelling subject. Write them
   down before building.
3. Choose the open loop from the script shape and build its shared module first.
   Its geometry is referenced by the hook, every boundary, and the payoff.
4. Build **one** section end to end and render it. Prove the system there before
   touching the others.
5. Review that section by eye, muted, for ornament and legibility. Fix the
   system, not the section.
6. Build the rest against the proven section. Then namespace, assemble, render,
   gate, and read the assembled render.

Steps 4 and 5 are where the quality comes from. The reference build's entire
visual system is the output of reviewing its first section three times.

### `.claude/skills/hyperframes-video-beats/SKILL.md`
_Plan, write, time, style, and validate motion-graphic beats for long-form talking-head HyperFrames videos. Use when Codex is asked to add or improve visual beats, glassmorphism lower thirds, crumpled-paper full-screen takeovers, transcript-synced callouts, pacing coverage, YouTube retention graphics, or render-ready overlays in an existing HyperFrames video project._

#### HyperFrames Video Beats

Use this skill to turn a talking-head video plus transcript into a paced set of motion graphics that support the narration without covering the speaker unnecessarily.

##### Core Goal

Keep the viewer oriented and engaged. Every beat must answer one of these:

- What should the viewer remember?
- What concept needs visual structure?
- What stat, contrast, or pivot deserves emphasis?
- Where is the pacing getting quiet enough that the viewer may drift?

Do not add graphics just because a gap exists. Add graphics because the narration has a topic, transition, proof point, or mental model that benefits from visual support.

##### First Pass

1. Read project instructions (`AGENTS.md`, local skill docs, and project-specific notes).
2. Inspect the root composition, current beat schedule, shared CSS, and transcript.
3. Build a coverage map from the root `data-start` / `data-duration` entries or the master `SHOW` array.
4. Extract transcript chunks for any requested region and any uncovered gaps.
5. Identify topic spans by narration, not by arbitrary timestamps.
6. Decide whether each topic needs a full-screen paper beat, a lower-third glass card, or no new beat.

Use fast local commands. Prefer `rg`, `Select-String`, and small Node/PowerShell transcript scripts.

##### Beat Type Decision

###### Use Full-Screen Crumpled Paper

Use a paper takeover when the narration reaches a major thesis, list, section marker, quote, or stat that should briefly become the whole frame.

Good uses:

- Hook payoff or "in this video" overview
- Major section transition
- Big stat or study result
- Memorable thesis line
- Short quote or mantra
- Contrast that needs the audience to stop and look

Rules:

- Keep it short, usually 4-12 seconds.
- Use sparse black text.
- Let only true stat numbers or one extremely important word use accent color.
- Do not cover long explanations with paper takeovers.
- Do not make full-screen text playful, huge, or over-bold by default.

###### Use Glassmorphism Lower Third

Use a glass lower-third when the speaker should remain visible and the graphic should support the current idea.

Good uses:

- Explanation scaffolds
- Topic labels
- Equation-style mental models
- Small lists
- "What this means" translations
- Pacing fills during long talking-head stretches
- Follow-up cards after a shortened full-screen or split-screen beat

Rules:

- Keep lower thirds in the lower third or lower half.
- Avoid covering the face.
- Use concise text: one headline plus optional short subline, or a 2-4 item list.
- Prefer one card per topic span over many tiny flashes.
- Preserve the existing glass-card style unless the user asks for a design change.

##### Pacing Heuristics

For long-form YouTube talking-head videos:

- Early video: avoid more than 20-30 seconds without a visual beat.
- Main body: avoid more than 30-45 seconds without a beat.
- Dense explanation sections: use lower thirds roughly every topic span, not every sentence.
- Big paper takeovers should be occasional punctuation, not the default.
- If an existing beat was manually shortened because it felt too long, respect that choice and fill after it with a new shorter card.

When scanning a schedule, report true gaps from the visibility schedule, not just the DOM order. If the root timeline uses a `SHOW` array, that is usually the authoritative visible range.

##### Timing Method

Time every beat to the transcript topic:

1. Find the first word or phrase where the topic starts.
2. Start the beat 0.2-0.6 seconds before that anchor when possible.
3. Keep the beat visible until the topic ends or naturally hands off.
4. If the next beat begins immediately, clear 0.1-0.5 seconds before it unless the handoff is intentional.
5. Match sub-element entrances to spoken phrases.

Avoid this failure mode:

- Card appears on the right topic but only lasts 5-8 seconds while the speaker keeps discussing the topic for 20-40 seconds.

Prefer:

- One card lives across the whole topic, with a subline or list item building midway through if the narration evolves.

##### Content Writing

Write for glance comprehension. The viewer should understand the card in under one second.

Use:

- Short noun phrases
- Direct labels
- One mental model per card
- Numbers only when they are meaningful
- Verbs when they clarify the action

Avoid:

- Repeating the whole voiceover
- Long sentences
- Vague hype language
- Too many highlighted words
- Explaining how to use the video inside the graphic

Good patterns:

```text
The bottleneck
Not enough AI inside real workflows.
The problem is adoption, not raw talent.
```

```text
The bridge
Skills + Workflows = 40 hrs saved
```

```text
In this video
-> The study
-> The stats
-> The paths you can take
-> What actually matters
```

##### Visual Style Rules

Follow the local design system first. For this project family, use:

- Serious professional typography.
- Black primary text on paper beats.
- Accent blue only for major stat numbers or rare power words.
- Glass cards with the existing dark frosted style.
- Lower-third cards that do not cover the speaker's face.

For paper beats:

- Use black for kickers, labels, arrows, sources, quotes, and supporting text.
- Keep font weight restrained.
- Avoid oversized playful type unless the user explicitly asks for it.
- Make the crumpled-paper motion deterministic.

For glass cards:

- Reuse `.glass-card dim lower-third` or the closest existing class.
- Prefer bottom-center placement.
- Keep cards compact.
- Use equation/list helpers when the idea is structural.

##### HyperFrames Implementation Rules

Follow project `AGENTS.md` and HyperFrames lint rules:

- Every mounted timed element needs `data-start`, `data-duration`, and `data-track-index`.
- Visible timed root-mounted elements should have the expected clip/layer class used by the project.
- Sub-compositions should register a paused GSAP timeline on `window.__timelines`.
- Pin each sub-composition timeline with `tl.set({}, {}, SLOT);`.
- Keep deterministic logic only.
- Do not animate video element dimensions or media properties in ways that can freeze renders.
- Run `npx hyperframes lint` after editing HTML.

When adding a beat:

1. Create `compositions/beats/NNN-short-name.html`.
2. Add the root mount in `index.html`.
3. Add or update the master visibility schedule if one exists.
4. Make the sub-composition `SLOT` match the mounted duration.
5. Verify no same-track overlaps unless the project intentionally uses multiple overlay tracks.

##### Coverage Scan

After edits, scan the master schedule:

- List beats sorted by visible start.
- Print gaps over the target threshold.
- Add or retime beats only where the transcript has a supportable concept.

For this project pattern, use 30 seconds as the strict scan threshold and 45 seconds as the maximum acceptable main-body threshold.

##### Validation

Before finishing:

1. Run the HyperFrames linter.
2. Fix all errors.
3. Mention warnings separately if they are known and non-blocking.
4. If the user asked for render-ready output, render or smoke-render as appropriate.
5. Give the user exact file paths and timestamps changed.

##### Practical Defaults

Use these defaults unless project context says otherwise:

- Full-screen paper overview: 8-10 seconds.
- Full-screen paper stat: 5-8 seconds.
- Glass lower-third explanation: 12-30 seconds.
- Long topic glass card: 25-45 seconds with staggered sub-elements.
- Beat start lead-in: 0.2-0.6 seconds.
- Gap scan threshold: 30 seconds.
- Lower-third width: about 68-72vw, max about 1240-1280px.

##### What To Preserve

Preserve user taste decisions discovered during review:

- If the user says a beat is too long, do not restore it just to satisfy a generic coverage rule.
- If glass card style is approved, reuse it instead of redesigning it.
- If typography is approved, keep it stable and adjust only local sizing/weight.
- If the speaker's face is important, prefer lower-third cards over center-screen cards.

### `.claude/skills/short-form-edit/SKILL.md`
_Turn talking-head footage into a finished reel, YouTube Short, or short advertisement with curiosity-led openings, earned payoffs, story-driven cuts, transcript-synced motion graphics, moving B-roll, captions, subtle music, and synchronized sound effects. Use for short-form editing; use edit-video for long-form videos and cut-silences for pause removal alone._

#### Short form edit

Input: a source-video path and an optional reference-reel path.

Deliver the requested formats and the editable project. Default to 1080x1920;
when requested, also compose 1920x1080 with its own framing and text placement.
Verify each aspect ratio independently, including its opening and CTA. The edit must tell the
speaker's story through images, timing, and sound. Virality is an aspiration, not
a result that editing can guarantee. Work locally unless delegation is requested.

##### Priority

The first creative gate is: **"In the first 3 seconds is someone convinced they
need to watch until the end?"** Establish a specific reason to stay and earn its
payoff inside the video. Effects, asset volume, and production polish come after
this test. Treat the answer as editorial judgment until audience data exists.

##### House style and notes

Read `docs/EDITING-PLAYBOOK.md` before planning. It holds Nate's measured reel
style (pacing, layouts, captions, B-roll order, sound palette), the raw-reel,
long-to-Short, and narrated-explainer variants, and the lessons that cost time.
Use it as the default when the user gives no style; the user's brief wins.

When the user gives a note on a draft, fix the edit, then offer to write the
note into the relevant skill or reference as a rule, check, or script change, so
the next edit starts from it. Record the note and the resulting rule together.

##### Establish the edit

1. Read the scoped workspace guide, `MOTION_PHILOSOPHY.md`, and the HyperFrames
   and video-storytelling skills before composition work. Use the user's brief
   over aesthetic defaults. Keep all artifacts in `video-projects/<slug>/`.
2. Probe the supplied source and reference: duration, dimensions, frame rate,
   audio, and existing transcript identity. Preserve originals. Transcribe with
   the student's chosen provider; ElevenLabs Scribe is Nate's default. Read
   `docs/TOOLS-AND-API-KEYS.md` for Whisper alternatives, word-timestamp
   normalization, credentials, and service costs. Never substitute an older take.
3. When a reference is supplied, inspect the entire reel using contact sheets,
   individual full-size frames, and contiguous frame strips at representative
   transitions. Review its sound when an audio-capable review surface is available.
   Save `REFERENCE-ANALYSIS.md` with timestamped observations, inferred principles,
   and explicit limits. Do not imply you heard audio based on waveform analysis.
   Read [reference-analysis.md](references/reference-analysis.md) for the reusable
   worksheet and analysis questions. Borrow editorial mechanisms, not branded copy.
4. Before locking the concept, inspect the supplied footage, brand assets, and
   relevant source demos. Save an asset shortlist with exact usable intervals,
   visible action, consequence, provenance, and a possible story role. Let a
   distinctive source moment shape the idea. Choose what reads in one glance;
   fit the complete action and result before considering a tighter crop. A filled
   frame is not useful if the viewer cannot see what is happening.
5. Read every spoken line. Run silence and mistake tools, then manually review
   the full transcript: a zero-candidate report can miss an obvious retake.
   Remove abandoned takes, preserve meaningful qualifications and the payoff,
   and keep natural breath around joins. Save reviewed source-time cut reasons.
   Render the clean cut once and derive word timing from the actual frame-aligned
   EDL. Lock the cut after the rough animatic, before polished graphics. Every later timing change rebuilds dependent
   captions, graphics, and sound from the same map.

User authorization persists. An instruction to make a finished video and iterate
authorizes ordinary local editing and rendering. An explicit request for Kie
B-roll authorizes those generations. Resolve review gates through the current
authorization; ask only for missing approval, not again at every draft. Never post
the reel or contact anyone without explicit authorization.

##### Design the emotional journey

Write `DESIGN.md` and a beat plan before HTML. Identify the hook, open loop,
escalation, evidence, payoff, and CTA. Give every shot a reason to exist.

Read [curiosity-and-entertainment.md](references/curiosity-and-entertainment.md).
Create `OPEN-LOOPS.json` with each honest viewer question, planted object,
setup time, reminders or partial answers, closure time, and the spoken evidence
that earns the closure. Default to one main loop and at most one secondary loop
open at once. Close the promised lesson before the CTA; a comment request must
not be the only answer. A recurring object alone is not an open loop: establish
what is missing or unresolved, then visibly change that state.

Build three materially different rough openings using the same truthful source
speech. Compare the first three seconds for topic clarity, curiosity, muted
comprehension, and follow-through. Choose and record the reason; do not select
only the loudest effect. Render a low-resolution moving animatic with speech and
rough sound before polishing materials. Fix predictability, missing context, or
weak payoffs at this stage. Existing approved materials can be reused, but still
review the new sequence before spending time on final rendering.

Vary rhythm by sequence: a short cluster of discoveries, a brief anticipation,
then a payoff. Preserve word timing while varying animation speed and scale.
The 1-2 second event guideline is not a metronome or permission to add filler.
Allow the speaker's expression to carry a conviction beat. For every shot record
the viewer's expectation and the new information or consequence it supplies.

Audit information duplication. Narration and captions carry the exact words;
graphics should usually show the example, relationship, evidence, or consequence.
Remove a third restatement as a headline unless deliberate emphasis earns it.
Prefer a specific product action or source detail to generic typing footage.
Do not invent a product result simply to make a more satisfying payoff.

###### Treat the first three seconds as a separate edit

For each opening record the viewer benefit, unresolved question, visible evidence
by second three, and the exact payoff scene. Reject vague teasing and any promise
that this footage cannot fulfill. An advertisement may resolve a concrete example
or explain a mechanism before inviting the viewer to learn more; it must not
promise a complete tutorial and deliver only a registration CTA.

Make the first frame immediately meaningful. A surprising action, contradiction,
result glimpse, or revealing human expression can establish the tension. Choose
an impact or transition only when it sharpens that idea. A quiet impossible-looking
result can beat a loud montage. Avoid a mandatory stamp, flash, or 0.3-second effect.

Use a supplied sound reference when available. Remove recording lead-in, align
the effect's audible impact with the visual landing within two frames, and shape
its level and tail around the first words. Make the hit noticeable while keeping
speech clear; briefly dip the music if helpful. Do not make loudness the only hook.

The opening still has to work muted. Establish the topic or tension immediately,
then reveal another meaningful state within the first three seconds. Avoid an
unrelated logo bumper, added silence, repeated flashes, or an effect that delays
the argument. Match the chosen material style. Vary the device between reels;
do not automatically stamp STOP on every video.

Save a first-three-seconds shot/sound plan and inspect the encoded opening
frame by frame, including its first frame, impact, reveal, and return to the main
edit. Check that the first spoken word survives the impact mix. Record this as
a distinct opening-hook gate in the verification report.

###### Build the visual world

- Choose a visual direction from the subject, audience, source material, and
  brand brief. Record why it suits this story. Documentary footage, visual comedy,
  product demonstrations, and designed objects are options, not required quotas.
  Use coherent colors, type, and transitions without imposing paper on every reel.
- Choose full speaker, split, or full supporting footage by the current attention
  target. Preserve expressions, gestures, and the evidence in each requested ratio.
- Plan rhythm by sequence: burst, anticipation, reveal, and breathing room. Treat
  1-2 seconds as a pacing diagnostic, not a cutting schedule. Keep longer holds
  when a developing action or performance earns them, and record the reason.
  Assign transitions by their editorial purpose, never by shot-index rotation.
- Escalate and release. Use short moments of relative stillness to land conviction
  or a reveal. Do not enforce the long-form 4-6-second outro on a short reel.
- Use an object callback: the unfinished model planted in the hook should resolve
  at the payoff. Show relationships and transformations, not just successive
  title cards. A viewer watching muted should still follow the central idea.
- Keep text within a phone-safe region. For 1080x1920, start with x=90..930,
  y=200..1600, reserving the right edge and bottom for social UI. Adjust captions
  to actual face position in every layout. Use short phrase groups and exact
  word onsets; keyword emphasis must preserve the speaker's wording.

For a minimal, Apple-style brief, read
[premium-motion-and-footage.md](references/premium-motion-and-footage.md).
Use restrained type, negative space, real object depth, directional light, and
soft contact shadows. Minimal composition can still have rich, purposeful motion
and sound. Do not mistake a small object on a blank slide for premium design.

###### Make the reel entertaining through layers and actions

Give the eye one clear attention target. Use depth, occlusion, light, and camera
movement when they make the action easier to follow. Keep typography readable
and use dimensional treatment only when the chosen material world calls for it.
For a paper brief, inspect fibers, edges, folds, contact shadows, and perspective
in the encoded output. These are conditional craft checks, not universal style rules.

Give every extended graphic beat an action with an outcome: a key seats and a
project starts, criteria turn into checks, a card opens to reveal a result, or a
stack assembles into a system. A card such as Define good can swivel or tilt so
its edge and moving contact shadow remain visible as its criteria resolve.
Avoid settle-and-freeze title cards. Subtle secondary motion supports the main
action; identical idle bobbing applied to every object is not storytelling.

Use the supplied human-edited reference to study how attention moves: wide
context, isolated detail, interaction, visible consequence, then return to the
speaker. Before delivery ask what makes each sequence entertaining beyond looking
professional. A new heading or a new caption alone is not the answer.

Audit named people, products, and places in the transcript before storyboarding.
Use a verified portrait when recognizing a real person matters, rather than
defaulting to their name in text. Prefer their own site or an attributable source,
save provenance, and inspect the actual image. Animate the photograph as a
physical object when appropriate, with a meaningful callback. Never generate
a likeness and present it as an authentic photo. A moving portrait remains a
photographic layer and does not count as moving B-roll.

Review adjacent shots as silhouettes and actions, with headings hidden. If they
still look like the same card reveal, redesign the weaker beat. Vary mechanisms:
tear to reveal, unfold to show scale, press to create, connect to enable, process
to produce a result. Preserve a coherent world and understandable cause and
effect. Spend the strongest action on the most important spoken idea. A user's
engagement score is feedback for iteration, not a metric a validator can certify.

For product stories, seek real source material: public product pages, official
documentation, authentic screen recordings, and official logos. Record actual
scrolls, selections, or visible interactions when useful. Present real logos on
dimensional surfaces without redrawing an approximate mark or implying endorsement.
Retain source URLs and distinguish authentic product footage from illustrative
interfaces and generated B-roll. Never expose real credentials in captured UI.
An animated source screenshot may be one layer in an explanatory composition,
but it must not substitute for moving B-roll when the brief requires video.

###### Verify brand assets before drawing

Never invent, approximate, trace from memory, or generate an existing brand's
logo. A radial star is not a substitute for the Claude mark. Use the exact
user-supplied asset first; otherwise obtain the asset from the brand's official
site or media kit. Search engines help locate sources, but do not establish
authenticity. Save the source URL or supplied path, original file, and checksum.
Inspect the artwork before use, preserve its shape and proportions, and animate
the authentic asset or the surface carrying it. Do not alter a logo's geometry
to create depth. Audit every logo occurrence in the final encoded reel against
its source asset, including small marks and recurring motifs. If no verified
asset is available, use plain brand-name text rather than fabricate a mark.

###### Balance graphics with moving footage

Choose the mix from the story and available evidence. There is no default
graphics/B-roll percentage. Keep a duration ledger with authentic footage,
generated illustration, designed graphics, and speaker-only time; explain the
denominator and count split panels once. Captions over footage remain footage.
A still image with a camera move is a photographic layer, not moving B-roll.

Use each distinct B-roll scene only once per reel. Another crop, filename, speed,
reverse, or grade does not make it a new scene. Reusing the same selected scene
across the two requested aspect ratios is expected. Record source scene identity,
file hash, and selected interval in `assets/footage-ledger.json`; run the footage
validator below. A graphic callback must develop the original idea into a new
state and composition. It is not permission to replay footage.

Default to containing the full source frame when a tighter crop hides context.
Keep the subject, action, and consequence visible throughout the selected interval,
with captions outside that action. Inspect beginning, middle, and end in each
ratio at phone size. Dense demo text must not be required to understand a fleeting
insert; isolate a meaningful visible action or give it more time. Avoid duplicated,
blurred background video as an automatic solution for vertical framing.

Prefer a specific action with a readable consequence. Compare adjacent shots
with headings hidden: if the sequence repeats the same visual mechanism or could
belong in any AI advertisement, replace the weakest insert. Generated metaphors
can add surprise but cannot stand in for captured evidence. Prioritize authentic
human reactions where they support the story.

##### Generate and assemble

1. Kie.ai is Nate's optional provider for generated moving inserts and images.
   Use the student's chosen provider or supplied assets; check its account, credits,
   and integration before generating. See `docs/TOOLS-AND-API-KEYS.md`. Verify the
   current official API schema. Save model, prompt, task ID, selected output,
   and generation state; reuse successful jobs rather than resubmitting blindly.
   Download and inspect real video files, including full-size corners throughout
   the selected interval for generated text, logos, or malformed objects. Reframe
   or regenerate defects, then verify the encoded result. B-roll must have genuine motion, not
   a still with a zoom. Static diagrams may be source assets only if the final
   animation meaningfully transforms them. Never generate fake evidence or
   imply a synthetic person is the real named person.
2. Animate graphics from the retimed words. Store each shot's anchor phrase and
   time. Bind sub-element reveals to their own spoken nouns, not arbitrary
   `index * 0.4` staggers. Target within 2 frames of word onset for captions and
   impact events, with at most 0.15 seconds of deliberate visual anticipation.
3. Use the HyperFrames timeline contract: one registered paused timeline per
   composition, full duration coverage, local assets, muted video and separate
   audio. Animate the footage wrapper. Deterministic canvas or CSS 3D is fine;
   use genuine rendered 3D when the metaphor needs it. The framework is a tool,
   not an aesthetic. Preserve editable source.
4. Source or generate an instrumental bed with clear narration space. Save its
   provenance. Normalize the voice before mixing; start the bed roughly 14-20 dB
   below voice, then adjust to the actual track. Duck under speech, fade cleanly,
   and measure the final mix. Aim around -16 LUFS and <= -1 dBTP, adapting to
   source dynamics rather than crushing them.
   When the user says music is too loud, reduce its gain relative to the reviewed
   version and save the measured change. Verify after final normalization that
   the bed-to-voice ratio is lower; a lower master level alone is not a fix.
5. Build SFX from the visual-event map. Paper impacts land on object contact;
   swipes support movement; restrained success tones support checks. Align the
   audible onset or impact peak, not just the beginning of an audio file with
   leading silence. Vary effect density and levels. Voice remains dominant.
   Score anticipation, contact, and release separately. A brief bed dip can make
   the next contact more distinct without raising its volume. Let some cuts pass
   without a whoosh. Record cue purpose and audition transitions when supported.
   A request for more SFX calls for a richer event score: paper movement, object
   contact, docking, connection, anticipation, and reveal can each have distinct
   sounds. Make meaningful contacts perceptible, vary texture and density, and
   retain quieter conviction beats. Do not substitute louder music or a whoosh
   on every cut. Inspect the actual animation landing before setting each cue.
6. Run lint and inspect the live preview before rendering. Browser automation is
   headless with Pointer Lock and pointer capture disabled in every context.
   Local automated review is permitted when the user authorized autonomous
   iteration. Render a draft, inspect it, revise, then render final quality.
   If the framework capture stalls, a deterministic graphics export plus FFmpeg
   assembly is acceptable. Await local fonts before capturing canvas. Normalize
   every video input to the same frame time base before overlaying, and inspect
   every encoded cut for one-frame mismatches. Build final face crops from the
   native-resolution source rather than a downscaled editing proxy.

##### Gates before delivery

Use [quality-gates.md](references/quality-gates.md). The plan validator catches
structural defects but cannot certify taste, motion, or the audio listening pass:

```powershell
node .claude/skills/short-form-edit/scripts/validate-plan.mjs video-projects/<slug>
node .claude/skills/short-form-edit/scripts/validate-footage.mjs video-projects/<slug>
```

It reads `assets/plan.json`, `assets/transcript.json`, and
`assets/edit-decisions.json`. See [plan-schema.md](references/plan-schema.md).
For another implementation, export that schema or adapt the validator explicitly;
never silently skip checks because the schema differs.

Inspect encoded hero frames for every shot at full size and phone scale. Inspect
contiguous strips across every cut and transition, plus the complete motion where
supported. Check speech joins, fresh ASR from final audio, voice/bed balance,
SFX timing, clipping, and the last syllable. Distinguish listening from signal
analysis. Record any unavailable review modality honestly.

Run a separate uninterrupted entertainment review of the animatic and final
where real-time video review is supported. Record attention-drop timestamps,
predictable sequences, unresolved promises, and reading overload in
`ENTERTAINMENT-REVIEW.md`. Fix the weakest sequences, then recheck them in context.
Automated playback completion and contact sheets are technical/visual evidence,
not a claim of uninterrupted perceptual viewing. If that modality is unavailable,
use chronological sequence strips and explicit loop-state checks, and disclose
the limit. Never manufacture retention scores or call internal hook comparisons
an audience A/B test.

Fix findings, archive superseded versions, and repeat the checks affected by each
change. Give `VERIFY.md` the actual output hash, measured results, inspected
artifacts, revisions, and unresolved limits. Do not claim passes based on code
inspection, file existence, or an empty validator result.

##### Delivery

Return a playable final MP4, its absolute path, and the skill path. Keep the
composition, assets, source and retimed transcripts, EDL, shot/event plan, audio
stems, reference analysis, and QA evidence in the project. Clearly identify the
final version. Never label a draft final or claim guaranteed viral performance.

### `.claude/skills/motion-showreel/SKILL.md`
_Design and build a 10-30 second motion-design showreel or brand reel in the style of Nate's Opus 5.5 "CLAUDE / MOTION REEL": one brand motif transformed through labeled craft chapters, a persistent HUD, cuts locked to a 120-130 BPM grid, a sub-second flurry, and a held logo lockup that answers the opening. Use when asked for a showreel, sizzle reel, brand reel, motion reel, "a reel like the Opus one", "show off motion design for <brand>", a 15-second brand film cut to music, or to study why a reference reel works and rebuild that energy for another brand._

#### Motion Showreel

A showreel promises that every frame was a decision. This skill turns that into a
repeatable build: pick one motif, push it through six or seven craft chapters that
each look nothing alike, cut on the beat, and end on the motif.

The style source is [the reference breakdown](references/reference-breakdown.md), a
measured second-by-second analysis of the reel this skill was built from. Read it first.
Techniques per chapter live in [the chapter library](references/chapter-library.md).

##### The grammar

1. **One motif, transformed.** Pick the brand's most reduced element (a dot, a play
   triangle, a letter, a logo corner). It opens the reel, turns into each chapter's
   material, and closes the reel as punctuation in the lockup. Nearly every
   transition turns the current object into the next one. Hard cuts are reserved
   for the flurry.
2. **Labeled craft chapters.** Six or seven, each named in the HUD by the discipline
   it demonstrates (`01 · SQUASH & STRETCH`). Use the brand's own words when it has
   them (YouTube has "chapters" and an "end screen").
3. **Show the work.** Every chapter gets one tool overlay: a physics readout, a
   selection box with a cursor, a parameter panel, a bezier graph, or a brand-native
   equivalent (a search bar, a counter, a settings menu).
4. **Persistent HUD.** Corner crop marks, a title line top left, a spec line top
   right (`1920×1080 · 60P · 129 BPM`, blinking dot), timecode bottom left, a
   progress ruler with chapter gaps bottom center, and the chapter label bottom
   right. Mono caps, tracking 0.2em, about 16px. It flips ink/paper with the
   background. Start from [the HUD template](templates/hud.html).
5. **Ink, paper, one accent, and one held-back color.** The held-back color only
   appears in the climax flurry. Every chapter change flips value (dark/light) or
   saturation (neutral/full-bleed accent).
6. **Cut on the beat, animate on the off-beats.** 120-130 BPM. Every hard cut,
   flash, and invert lands within 2 frames of a grid line. One pre-drop gap (music
   ducked for half a beat) comes before the midpoint hit.
7. **Accelerate, then hold.** For 15s at about 129 BPM (32 beats): physics intro 4
   beats, type chapter 8 beats with an internal invert, three 4-beat chapters (drop
   in the middle), a flurry of about 6 cuts in 4 beats (one beat each, then half
   beats), then about 4 beats of lockup. Roughly 75% development, 13% flurry, and
   12% resolve.
8. **Density breathes.** One object, then a wall of type, a grid of 100, thousands
   of particles, one hero object, the flurry, and one word again.
9. **Three type voices.** A heavy display face for statements, a contrasting accent
   voice (an italic serif, or the brand's UI face), and wide-tracked mono for the
   machine layer. Type also works as texture: repeated into wallpaper, banded, and
   inverted.
10. **Physical finish.** Squash and stretch, motion blur on fast moves, bloom on
    light-on-dark, slight chromatic fringe, grain, vignette, and a dot grid on dark
    frames. It should look photographed, not exported.
11. **Bookend.** The lockup resolves from noise, a rule draws, the subtitles type on
    with a block cursor, the motif lands as the final punctuation with a squash, and
    a quiet tagline arrives last.

##### Workflow

Run the scripts from the kit root. They need Node 22+ and FFmpeg with ffprobe.

###### 1. Study the reference (when one is given)

```sh
node .claude/skills/motion-showreel/scripts/analyze-reference.mjs path/to/reference.mp4 video-projects/my-reel/qa/reference --fps 6 --bpm 128
```

Read every contact sheet, then `report.txt` (cuts, luminance rhythm, RMS, onsets,
and cut offsets from the beat). Write the timeline down in the shape of the
reference breakdown.

###### 2. Brand intake: `BRAND.md`

Collect exact colors (from the current logo file, not a blog), typography (the
proprietary face plus the closest free substitute), official logo SVGs, signature UI
and objects, and 3-5 verified facts with dates for kinetic type. Gather real
imagery the user owns or can use. Pick the motif and the held-back climax color.
Only use brand marks the user has the right to use for the intended purpose.

###### 3. Chapter map: `STORYBOARD.md`

Create the project with `npm run new-video -- my-reel`, then fill in
[the storyboard template](templates/storyboard.md). For each chapter, record the
discipline label, the brand-native object, the tool overlay, the in-transform, the
out-transform, the value (dark/paper/accent), and the SFX. Before building:

- Freeze any frame in your head: does it read as the brand with the HUD covered?
- Does every transition transform the object, except the flurry cuts?
- Does the value flip at every chapter change?

###### 4. Music and the beat grid

Read `docs/TOOLS-AND-API-KEYS.md` first. Music can be the user's own licensed track
or generated. Generation is a paid call, so confirm before running it:

```sh
node .claude/skills/motion-showreel/scripts/kie.mjs music --title "Reel" --style "punchy electronic showreel, instrumental, 128 bpm, starts instantly, riser into a big drop" --out video-projects/my-reel/assets/audio
node .claude/skills/motion-showreel/scripts/music-grid.mjs video-projects/my-reel/assets/audio/take-0.mp3 --bpm 128 --beats
```

`music-grid` prints the period, the **kick-band phase** (use it), and per-bar and
per-beat energy. The full-band phase can lock onto off-beat hats and put every
splice half a beat late; the script warns when the two disagree. In the per-beat
low-band column, find the riser, the drop (a jump of 10+ dB), the break, and the
return. Then splice 32 beats: intro and build (16, ending on the drop's downbeat),
drop (8), break (4, under the flurry), and the return hit plus a tail:

```sh
node .claude/skills/motion-showreel/scripts/splice-music.mjs take-0.mp3 --period 0.4644 --phase 0.085 --segments "4-28,48-56.7" --length 15 --gap 16 --out music-bed.wav
node .claude/skills/motion-showreel/scripts/music-grid.mjs music-bed.wav --bpm 129
node .claude/skills/motion-showreel/scripts/beatgrid.mjs --period 0.4644 --length 15 --chapters "01 Physics:4, 02 Type:8, 03 Grid:4, 04 Drop:4, 05 Lookdev:4, Flurry:4, 07 End:rest"
```

The re-measured bed's kick phase should be within about 25 ms of 0. Put the
measured BPM in the HUD (129, not 128). `beatgrid` prints the frame sheet for
`STORYBOARD.md`.

###### 5. SFX and the mix

Generate a kit (paid, confirm first) with `scripts/sfx.mjs` (pops, clicks,
whooshes, glitch, ticks, shimmer, sub boom, final hit, and brand-native sounds), or
use the user's own library. Place cues on the beat sheet in an `events.json` and
premix:

```sh
node .claude/skills/motion-showreel/scripts/mix.mjs --bed music-bed.wav --events events.json --out master.wav
```

Use `master.wav` as the composition's single `<audio>` track. It targets -14 LUFS
and -1.2 dBTP.

###### 6. Assets

- **Hero lookdev object.** Run `kie.mjs image --ref <logo.png>` (Seedream
  image-to-image keeps the silhouette), then `kie.mjs video --image <still>` for a
  5s Kling camera move. Both are paid calls. Kling returns 24fps: speed it up and
  re-encode at 60fps all-intra (the command is in the header of `kie.mjs`).
- **Fonts.** Download them into the project's `assets/fonts/` and use `@font-face`.
  Never rely on system fonts.

###### 7. Build (HyperFrames)

Load `hyperframes` and `gsap` before writing HTML. Read `MOTION_PHILOSOPHY.md`
(showreel pacing is its fast sizzle mode) and `video-storytelling` for
persistent-world camera moves. Build one `index.html` with one paused GSAP timeline.
Chapters are timed `.clip` layers, and the HUD sits on top.

- Every time comes from the beat sheet: `const B = (n) => n * PERIOD`.
- Put a **per-frame driver** on the timeline and make it a pure function of time:
  `tl.fromTo(drv, {t:0}, {t:END, duration:END, ease:'none', onUpdate:() => frame(drv.t)}, 0)`.
  Draw canvas effects (particles, noise, big grids) there from seeded values, never
  from `Math.random()` at draw time. Drive the HUD from the same function.
- Tween only transforms and opacity. Never tween `left/top/width/height`. To morph
  a dot into a tile, draw the final tile and scale it down into a circle
  (`border-radius: 128px / 72px` on a 256x144 tile), then tween back to scale 1.
- A property animated by several tweens across the reel (a shared flash layer)
  can stick on a backward seek. Compute it in the per-frame driver instead, and
  do the same for class swaps like an invert.
- Measure layout (`getBoundingClientRect`) once, at the top of the build, before
  any `immediateRender` tween applies a transform. Never measure inside `onUpdate`.
- `<video data-start>` must not sit inside a timed `.clip`. Put videos in an
  untimed wrapper, which you can still scale for push-ins.
- Staggered phases must finish before their cut: latest completion = start + max
  delay + duration. Check it on paper, then in a render strip.
- `background-clip: text` renders invisible in capture. Use solid fills and
  `text-shadow` for bloom.

###### 8. Verify before calling it done

- `npx hyperframes lint`, then Studio preview, then a draft render (`hyperframes-cli`).
- Run `analyze-reference.mjs` on your own render with `--bpm` and `--phase`: cut
  offsets must be within about 35 ms of a beat or half beat, luminance must
  alternate by chapter, and the audio must show the pre-drop dip.
- Extract 10-frame strips across every transition and look at them. Snapshots
  miss stuck or ghost layers:
  `ffmpeg -i render.mp4 -vf "select='between(n\,440\,449)',scale=384:-1,tile=layout=5x2" -frames:v 1 -fps_mode passthrough strip.png`
- Brand test: pick 6 random frames. Each must read as the brand with the HUD covered.
- Loudness is about -14 LUFS. HyperFrames re-encodes audio slightly quieter, so
  remux `master.wav` into the render (see the header of `mix.mjs`).
- Save the evidence in `VERIFY.md`.

##### Example brief

The skill's first test was a 15s YouTube reel: the red scrubber dot bounces on a
progress bar, scrubs into a laser, types "broadcast yourself" into a rebuilt search
bar, becomes eight dots, then a feed of real thumbnails, and bursts from a like button
into particles that spell a verified stat. It becomes a lacquer play button and a
Silver Creator Award, runs a flurry of Subscribe, Shorts, LIVE, Skip, and "+10
seconds", and lands as the play icon in the logo. Use it as a model for mapping
chapters to a brand's native objects, not as a template to copy.

### `.claude/skills/make-a-video/SKILL.md`
_Beginner-friendly end-to-end video creator for HyperFrames. Use when the user says "make a video", "create a video", "new video", "build a video", "video from scratch", "I want to make a video", "help me create a video", or when someone who's never used HyperFrames before arrives with a concept, script, or rough idea and wants a finished MP4. Interviews the user in one pass, then builds the full video with mandatory preview and visual-verification gates._

#### Make a Video — The Beginner-to-Finished-MP4 Skill

Two phases, eight sequential gates. Every gate produces a concrete artifact the next gate consumes. Don't skip gates.

##### When to use this skill — and when to hand off

**Use this skill when:**
- The user is new to HyperFrames and starting from a concept, script, or outline
- They want an end-to-end walkthrough, not framework reference material
- They haven't decided on format yet

**Hand off when:**
- The user pastes a URL and wants a video from that site → invoke `/website-to-hyperframes`
- The user explicitly wants a 9:16 vertical talking-head with face-cam + scene overlays → run Gates 1–4 here, then invoke `/short-form-edit` from Gate 5 onward
- The user asks for framework rules, not a video → invoke `/hyperframes`

##### The two phases

- **Phase 1 — INTERVIEW (Gates 1–4):** one conversational pass to gather *everything* before touching code. Intent, format, script, voice, style, assets, pacing. Synthesize into a `BRIEF.md` and wait for explicit approval.
- **Phase 2 — BUILD (Gates 5–8):** scaffold → storyboard → compositions → lint → Studio preview → draft render → visual verification → MP4 preview → final render.

---

##### Gate 1 · Intent & format

Ask one question at a time via `AskUserQuestion`, multiple-choice where possible.

1. What's this video for? (promo · social ad · launch teaser · product demo · tutorial · explainer · intro/outro card · other)
2. Who's the audience? (open-ended)
3. Target duration? (10–20s short · 20–45s promo · 45–90s explainer · 1.5–3 min lesson · custom)
4. Aspect ratio? (16:9 1920×1080 · 9:16 1080×1920 · 1:1 1080×1080)
5. Frame rate? (30 default · 60 for crisp UI · 24 cinematic)
6. Platform / delivery constraints? (file size · deadline · where it'll play)

**Gate:** all six captured. If the answer is 9:16 + face-cam, plan to hand off to `/short-form-edit` at Gate 5.

Full question bank: `Read: references/interview-questions.md`

---

##### Gate 2 · Script & voice

1. Script source? (paste · outline → I'll draft · I'll record · TTS from text · no narration)
2. If TTS: voice preference. Offer choices from `npx hyperframes tts --help`. Also capture pace.
3. If face-cam: recording path · full-screen or corner placement · need transcription? (`npx hyperframes transcribe <file> --model small.en --json`)
4. Captions? (off · hype · corporate · karaoke-word-by-word · minimal)

**Gate:** script captured (or drafted), audio plan captured, caption plan captured.

---

##### Gate 3 · Style intake

**Before asking the user anything, inventory existing assets.** Check `<workspace-root>/assets/` and any project `assets/` folder. Don't ask for what's already there.

Then ask progressively — they don't need answers to all of these:

1. Style guide or brand doc? (paste/path · no)
2. Color palette? (hex codes · none — use MOTION_PHILOSOPHY defaults)
3. Fonts? (Google Fonts name(s) · file paths · none — use Inter + JetBrains Mono defaults)
4. Logo file? (path · none — use text wordmark instead)
5. Reference videos for vibe? (URLs/paths · none)
6. Other assets? (screenshots · product photos · b-roll · music — list paths)
7. MOTION_PHILOSOPHY aesthetic (black canvas · chrome type · perspective grid · whip transitions) or a different feel?
8. Pacing? (kinetic 1–2s · balanced 2–3s · relaxed 3–5s)
9. Music? (none · ambient pad 0.15 · music bed 0.4 · full 0.8 — file path if they have one)
10. Outro / call-to-action text?

**Never impose a brand on the user.** Fall back to MOTION_PHILOSOPHY defaults *only* when they explicitly decline to supply a style.

Full style flow + MOTION_PHILOSOPHY defaults: `Read: references/style-intake.md`

---

##### Gate 4 · Brief synthesis (HARD-GATE before building)

1. **Read `MOTION_PHILOSOPHY.md`** if it exists in the workspace root — mandatory if present. If missing, proceed with the defaults in `references/style-intake.md` and note the absence in the brief.
2. **Ask where projects live** if it's not obvious:
   - If `video-projects/` exists → use `video-projects/<slug>/`
   - Otherwise → ask the user
3. **Write `<project-folder>/BRIEF.md`**:
   - slug · intent · audience · dimensions · fps · duration
   - script (full or outline)
   - voice choice · caption plan · face-cam plan
   - style profile: palette (hex), fonts, logo path, reference videos
   - pacing
   - asset inventory with paths
   - outro / CTA text
4. **Show the brief. WAIT for explicit approval.** Don't proceed to Gate 5 without a clear "yes, build it."

---

##### Gate 5 · Scaffold & storyboard

###### Handoff check first

If the brief describes a 9:16 vertical talking-head with face-cam + scene overlays, invoke `/short-form-edit` NOW and hand off the brief. Its transcript-driven workflow covers hooks, cuts, captions, footage, and sound.

Otherwise continue:

###### Scaffold

1. `mkdir <project-folder>`
2. If a sibling project with similar format exists, offer to copy its `hyperframes.json` + `meta.json` as a template. Otherwise from inside the folder: `npx hyperframes init`
3. Edit `meta.json` with the user's slug, dimensions, fps.
4. Copy supplied assets into `<project-folder>/assets/`.
5. Create `<project-folder>/assets/style-profile.md` from Gate 3 — single source of truth for palette/fonts/logo.

###### Storyboard

Generate `<project-folder>/STORYBOARD.md` using the template in `references/storyboard-template.md`. Every beat gets:

```
Beat N — TITLE (start–end, duration) — Concept in one sentence
Visual elements: [each element, size, animation, timing]
Motion language: [kind of motion]
Eases used: [3–4 distinct GSAP eases]
Exit: [transition into next beat]
Audio: [VO line / SFX / music layer]
```

Top of file: a timing table with scene · start · duration · composition file.

**Propose a rule-of-threes structure:**
- Act 1 (hook) ≈ 20% of duration
- Act 2 (body) ≈ 55%
- Act 3 (payoff + outro with 4–6 second hold) ≈ 25%

(MOTION_PHILOSOPHY §0 Law 9, §1.)

**Map user intents → catalog blocks:** `Read: references/catalog-intent-map.md`

**Gate:** show storyboard + timing table. Iterate until the user approves.

---

##### Gate 6 · Build compositions

Invoke `/hyperframes` for framework rules. This skill owns the scaffold and discipline; `/hyperframes` enforces the rules.

###### Scaffold every sub-composition

```html
<div data-composition-id="scene-name" data-start="..." data-duration="...">
  <style>[data-composition-id="scene-name"] { /* scoped */ }</style>
  <!-- DOM -->
  <script>
    (function(){
      const SLOT_DURATION = ...;
      const tl = gsap.timeline({ paused: true });
      // ... tweens ...
      tl.to({}, { duration: SLOT_DURATION }, 0);   // anchor — MOTION_PHILOSOPHY Law 11
      window.__timelines["scene-name"] = tl;
    })();
  </script>
</div>
```

Full boilerplate + captions pattern + ambient-bg pattern: `Read: references/composition-scaffold.md`

###### Build rules

- **Ambient background** on `data-track-index="0"` for the full composition duration.
- **Kinetic-type openers:** per-word stagger 0.06–0.10s.
- **Captions** as body-level siblings of the root composition in `index.html`, each with `data-track-index ≥ 20`. Never inside scene timelines (MOTION_PHILOSOPHY §3.13).
- **Catalog blocks** installed via `npx hyperframes add <name>`. Immediately **scope the block's CSS** to `[data-composition-id="..."]` — catalog blocks ship with `html, body { ... }` rules that bleed into the parent document when loaded as sub-compositions.
- **Vertical + face-cam:** wrap native 1920×1080 face in a transform (`translate` + `scale`) for bottom-half or full-screen mode. (If you end up here instead of `/short-form-edit`, strongly consider the handoff.)
- **Apply ONLY what the user supplied.** Their palette, their fonts, their logo. Don't inject anything else. If they chose MOTION_PHILOSOPHY defaults, pull the palette + font pair from `references/style-intake.md`.

###### Determinism

No `Math.random()`, no `Date.now()`, no render-time `fetch()`. Use seeded PRNGs or harmonic-sin hashes (MOTION_PHILOSOPHY §3.10).

---

##### Gate 7 · Lint → Studio preview (PREVIEW GATE 1 — MANDATORY)

1. `npx hyperframes lint` — fix all errors, triage warnings.
2. `npx hyperframes preview` in the background.
3. Wait for "Studio running" on `http://localhost:3002`.
4. Hand the user the URL **plus** individual composition URLs (`http://localhost:3002/?comp=<id>`). If the project has WebGL shader blocks, lead with the individual URLs — software WebGL fallback can stall the master composition.
5. **WAIT for explicit "looks good, render a draft"** before proceeding. Silence is not approval.

Hot reload is on — edits show up live.

---

##### Gate 8 · Draft render → visual verification → MP4 preview → final

###### Draft render

```bash
npx hyperframes render --quality draft --output renders/<slug>-draft.mp4
```

###### Visual verification (MANDATORY before delivery)

Lint passing ≠ design working. Extract frames and **view them**.

1. `mkdir -p renders/frames`
2. For every beat hero moment AND every transition:
   ```bash
   ffmpeg -y -ss <t> -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 renders/frames/t<t>.png
   ```
3. **Call the `Read` tool on every PNG.** The Read tool loads the image into context — don't just list filenames.
4. Confirm per frame: no cropped faces, correct face-mode per scene, text readable and on-palette, no overflow, transitions land on intended words, no blank frames.
5. If anything's wrong: fix → re-render → re-verify. Never ship a broken draft.

###### MP4 preview (PREVIEW GATE 2 — MANDATORY)

```bash
npx serve renders -p 8080 -n
```

Do NOT use Python's `http.server` — it doesn't support HTTP Range requests, so scrubbing breaks.

Hand the user `http://localhost:8080/<slug>-draft.mp4`. **WAIT for explicit sign-off** on playback and audio sync.

###### Final render

```bash
npx hyperframes render --quality standard --output renders/<slug>-final.mp4
```

Report the output path. Done.

Full preflight + pre-delivery checklist: `Read: references/build-checklist.md`

---

##### Non-negotiables (load-bearing — do not soften)

- **DO NOT skip PREVIEW GATE 1 (Studio) or PREVIEW GATE 2 (rendered MP4).** Two gates per build, always.
- **DO NOT claim a render is done** until frames have been extracted AND Read via the Read tool.
- **DO NOT build anywhere but inside a dedicated project folder.** Never put `index.html` at the workspace root.
- **DO NOT ask the user for assets** before inventorying their workspace.
- **DO NOT skip the `tl.to({}, { duration: SLOT_DURATION }, 0)` anchor tween** at the end of every sub-composition timeline. MOTION_PHILOSOPHY Law 11.
- **DO NOT use `Math.random()` / `Date.now()`** inside render logic. Seeded hashes only.
- **DO NOT add `class="clip"` to `<video>` tags.** It breaks them.
- **DO NOT impose a brand on the user.** Ask first; fall back to MOTION_PHILOSOPHY defaults only when they explicitly decline.

---

##### References

- `references/interview-questions.md` — full question bank by Gate
- `references/style-intake.md` — style interview + MOTION_PHILOSOPHY defaults
- `references/catalog-intent-map.md` — "user says X → install Y"
- `references/storyboard-template.md` — beat-by-beat template + worked example
- `references/composition-scaffold.md` — scoped-styles + IIFE GSAP boilerplate
- `references/build-checklist.md` — preflight + pre-delivery gates

External (workspace-level):
- `MOTION_PHILOSOPHY.md` — the one external reference this skill assumes exists. Aesthetic baseline. Fallback lives in `references/style-intake.md` if the file is missing.

##### Related skills

- `/hyperframes` — framework rules, invoke at Gate 6
- `/hyperframes-cli` — init · lint · preview · render · transcribe · tts
- `/hyperframes-registry` — installing catalog blocks
- `/gsap` — GSAP animation reference
- `/short-form-edit` — hand off at Gate 5 for 9:16 talking-head format
- `/website-to-hyperframes` — hand off at Gate 1 if the starting input is a URL

### `.claude/skills/style-library/SKILL.md`
_Select, customize, or extend the project's reusable motion-graphics card library and style templates. Use for choosing a visual style, adding a card, building a new style pack, or reusing a template in a HyperFrames video._

#### Reuse the style library

Read `style-library/GUIDE.md`, then `style-library/registry.json`. Filter by
style, tier, and purpose before opening individual cards. Read the selected
style's `DESIGN.md`, `tokens.css`, and manifest slot limits.

For an overlay, preserve transparency outside the card and the speaker's face.
For a takeover, use an opaque background. Copy the chosen card into the video's
`compositions/`, localize its CSS, fonts, and GSAP dependency, fill its named
`data-slot` values, and wire its timing using the HyperFrames skill. Copying a
card without its relative dependencies does not produce a complete asset.

Use `style-templates/` for a whole-scene starting point. A media template may
require the student's own `assets/source.mp4`; check its README before rendering.

The catalog contains draft resources, not a promise that every card has passed
rendered QA. Lint and render the selected card at actual project resolution,
inspect its hero frame and transition, and check slot text at its maximum length.

When adding a style, use `node scripts/style-library/new-style.mjs 03 my-style "My Style"`, then
complete its design tokens, manifest, and cards. Run
`node scripts/style-library/build-registry.mjs` after manifest changes. Keep
project-specific copy in the project, leaving reusable library cards generic.

### `.claude/skills/website-to-hyperframes/SKILL.md`
_Capture a website and create a HyperFrames video from it. Use when: (1) a user provides a URL and wants a video, (2) someone says "capture this site", "turn this into a video", "make a promo from my site", (3) the user wants a social ad, product tour, or any video based on an existing website, (4) the user shares a link and asks for any kind of video content. Even if the user just pastes a URL — this is the skill to use._

#### Website to HyperFrames

Capture a website, then produce a professional video from it.

Users say things like:

- "Capture https://... and make me a 25-second product launch video"
- "Turn this website into a 15-second social ad for Instagram"
- "Create a 30-second product tour from https://..."

The workflow has 7 steps. Each produces an artifact that gates the next.

---

##### Step 1: Capture & Understand

**Read:** [references/step-1-capture.md](references/step-1-capture.md)

Run the capture, read the extracted data, and build a working summary using the write-down-and-forget method.

**Gate:** Print your site summary (name, top colors, fonts, key assets, one-sentence vibe).

---

##### Step 2: Write DESIGN.md

**Read:** [references/step-2-design.md](references/step-2-design.md)

Write a simple brand reference for the captured website. 6 sections, ~90 lines. This is a cheat sheet, not the creative plan — that comes in Step 4.

**Gate:** `DESIGN.md` exists in the project directory.

---

##### Step 3: Write SCRIPT

**Read:** [references/step-3-script.md](references/step-3-script.md)

Write the narration script. The story backbone. Scene durations come from the narration, not from guessing.

**Gate:** `SCRIPT.md` exists in the project directory.

---

##### Step 4: Write STORYBOARD

**Read:** [references/step-4-storyboard.md](references/step-4-storyboard.md)

Write per-beat creative direction: mood, camera, animations, transitions, assets, depth layers, SFX. This is the creative north star — the document the engineer follows to build each composition.

**Gate:** `STORYBOARD.md` exists with beat-by-beat direction and an asset audit table.

---

##### Step 5: Generate VO + Map Timing

**Read:** [references/step-5-vo.md](references/step-5-vo.md)

Generate TTS audio, transcribe for word-level timestamps, and map timestamps to beats. Update STORYBOARD.md with real durations.

**Gate:** `narration.wav` (or .mp3) + `transcript.json` exist. Beat timings in STORYBOARD.md updated.

---

##### Step 6: Build Compositions

**Read:** The `/hyperframes` skill (invoke it — every rule matters)
**Read:** [references/step-6-build.md](references/step-6-build.md)

Build each composition following the storyboard. After each one: self-review for layout, asset placement, and animation quality.

**Gate:** Every composition has been self-reviewed. No overlapping elements, no misplaced assets, no static images without motion.

---

##### Step 7: Validate & Deliver

**Read:** [references/step-7-validate.md](references/step-7-validate.md)

Lint, validate, preview. Create a HANDOFF.md for multi-session continuity.

**Gate:** `npx hyperframes lint` and `npx hyperframes validate` pass with zero errors.

---

##### Quick Reference

###### Video Types

| Type                  | Duration | Beats | Narration              |
| --------------------- | -------- | ----- | ---------------------- |
| Social ad (IG/TikTok) | 10-15s   | 3-4   | Optional hook sentence |
| Product demo          | 30-60s   | 5-8   | Full narration         |
| Feature announcement  | 15-30s   | 3-5   | Full narration         |
| Brand reel            | 20-45s   | 4-6   | Optional, music focus  |
| Launch teaser         | 10-20s   | 2-4   | Minimal, high energy   |

###### Format

- **Landscape**: 1920x1080 (default)
- **Portrait**: 1080x1920 (Instagram Stories, TikTok)
- **Square**: 1080x1080 (Instagram feed)

###### Reference Files

| File                                                    | When to read                                                                                                                                                   |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [step-1-capture.md](references/step-1-capture.md)       | Step 1 — reading captured data                                                                                                                                 |
| [step-2-design.md](references/step-2-design.md)         | Step 2 — writing DESIGN.md                                                                                                                                     |
| [step-3-script.md](references/step-3-script.md)         | Step 3 — writing the narration script                                                                                                                          |
| [step-4-storyboard.md](references/step-4-storyboard.md) | Step 4 — per-beat creative direction                                                                                                                           |
| [step-5-vo.md](references/step-5-vo.md)                 | Step 5 — TTS, transcription, timing                                                                                                                            |
| [step-6-build.md](references/step-6-build.md)           | Step 6 — building compositions with self-review                                                                                                                |
| [step-7-validate.md](references/step-7-validate.md)     | Step 7 — lint, validate, preview, handoff                                                                                                                      |
| [techniques.md](references/techniques.md)               | Steps 4 & 6 — 10 visual techniques with code patterns (SVG drawing, Canvas 2D, 3D, typography, Lottie, video, typing, variable fonts, MotionPath, transitions) |

### `.claude/skills/short-form-video/SKILL.md`
_Maintain the existing May Shorts teaching compositions using their legacy face-mode, scene-overlay, and karaoke-caption patterns. Use only when working on those examples or explicitly requesting this legacy scaffold. For new reels, Shorts, or short advertisements, use short-form-edit._

#### Short-Form Vertical Video (Hyperframes)

Short-form = 1080x1920 vertical, 10–30s, talking-head face + motion-graphic scene overlays + karaoke captions. Everything in this skill is distilled from the May Shorts 19 iteration autopsy (v1 → v4) and is preserved for maintenance of those examples. Use `short-form-edit` for new recordings.

**Always invoke `/hyperframes` first.** This skill sits on top of it — it does not replace the framework rules (`data-*` attributes, `window.__timelines`, composition structure). Those are non-negotiable regardless of the format.

##### When this skill fires

- Maintaining the existing May Shorts examples.
- Explicitly requesting their legacy four-layer scaffold.

##### The playbook (high-level)

1. **Audio is source of truth.** Edit audio FIRST (cut retakes, pauses). Save as `<name>-edit.mp4`. Measure exact duration with `ffprobe` — this is the composition's `data-duration`.
2. **Transcribe the edited audio** with the root `scripts/transcribe-elevenlabs.mjs` helper (ElevenLabs Scribe), a student-selected alternative normalized per `docs/TOOLS-AND-API-KEYS.md`, or if retiming an existing build with a `shift()` function in captions, keep the existing captions and just shift scene starts.
3. **Author scene boundaries in edited-time** — NEVER mix original-time and edited-time anchors in the same file. See "Audio-sync protocol" below.
4. **Build the composition scaffold** (4 layers: ambient-bg, seam-treatment, captions, face) — see "Composition scaffold" below.
5. **Author scenes with LOCAL offsets** relative to each scene's `data-start`. Each scene is its own sub-composition under `compositions/scene<N>-<label>.html`.
6. **Lint → draft render → word-exact frame verification → final render.** This is the verification gate. Never skip step 3 (frame verification).

##### Composition scaffold (the 4 always-on layers)

Every short-form vertical has these four sub-compositions under `compositions/`, loaded on shared tracks:

```
index.html (root, 1080x1920, data-composition-id="main")
├── ambient-bg.html        track-index="3" — radial gradient + drift grid + particles + vignette
├── face-wrapper + <video> track-index="0" — talking head (see face-mode choreography)
├── seam-treatment.html    track-index="5" — feathers y=960 edge (bottom-half scenes only)
├── scene1-<label>.html    track-index="1" — scene overlays (back-to-back, no gaps)
├── scene2-<label>.html    track-index="1"
├── …
└── captions.html          track-index="2" — karaoke captions, word-synced
```

- `data-duration` is identical across root, ambient-bg, seam-treatment, face-video, face-audio, captions. Only scene overlays change over time.
- `<audio>` for the face is a SEPARATE element (mixer needs it), never use the video's own audio track.
- `class="clip"` goes on timed divs — NEVER on `<video>` or `<audio>`.

##### Face-mode choreography (the signature move of short-form)

The face lives in a wrapper div sized at the source's native landscape (1920x1080). GSAP animates the WRAPPER (never the video element — animating `<video>` dimensions freezes frames).

Two modes:

```js
const BOTTOM     = { x: 0,       y: 1136, scale: 0.5625 }; // bottom-half, full landscape visible
const FULLSCREEN = { x: -1166.5, y: 0,    scale: 1.7778 }; // cropped-cover, fills 1080x1920
const MODE_DUR = 0.32;
```

`BOTTOM` renders the 1920x1080 source at 1080x607.5 centered in the bottom 960px. `FULLSCREEN` crops horizontally to fill the portrait frame.

**Transition 0.15s BEFORE the new scene's content lands**, using `ease: "expo.inOut"`:

```js
[
  { t: <scene-4-start>, mode: FULLSCREEN },
  { t: <scene-5-start>, mode: BOTTOM },
  …
].forEach(({ t, mode }) => {
  mainTl.to("#face-wrapper", { ...mode, duration: MODE_DUR, ease: "expo.inOut" }, t - 0.15);
});
```

A face that snaps modes instantly is the single most jarring frame in a vertical video. Always interpolate.

###### Face grading (every short, no exceptions)

```css
#face-video {
  filter: contrast(1.08) saturate(1.08) brightness(0.97);
}
```

Plus a subtle 1.00 → 1.025 Ken Burns zoom over the full duration (`ease: "none"`) and a side-vignette `::after` pseudo-element so the face sinks into the surrounding navy instead of butting against a razor edge.

###### Seam treatment (required for bottom-half scenes)

A navy→transparent gradient band (60–100px) at y=960 plus a 2px accent scan line with soft glow. Draw it AFTER the face so it sits on top; full-screen scenes will cover it when they take over. Razor-sharp y=960 cuts are the #2 tell for AI-edited content (after background flatness).

##### Audio-sync protocol (DO NOT skip)

**Problem:** if audio is edited (retakes/pauses removed), timestamps in the source transcript no longer match the edited video. Scene starts authored in original-time will fire late.

**The rule:** ALL timing lives in edited-time. Never mix.

**Verification procedure for any short-form retime:**

1. Measure both audio files:
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 assets/original.mp4
   ffprobe -v error -show_entries format=duration -of csv=p=0 assets/<name>-edit.mp4
   ```
   Difference = total cut time.
2. If using a `shift()` function in `captions.html` to map transcript words, treat that as the source of truth. The map `shift(originalTime) = editedTime` applies to EVERY scene `data-start` too.
3. Scene internal offsets (inside `compositions/sceneN.html`) are LOCAL relative to the scene's `data-start`. If a scene's parent `data-start` is correct in edited-time, internal offsets stay correct WITHOUT modification — UNLESS a scene straddles a cut, in which case both the parent duration AND internal offsets shift.
4. Face-mode transition array times MUST use edited-time. They are NOT automatically shifted.

**Plan format for retimes** (use this table structure every time):

| Scene | Current start | Current dur | New start | New dur | Rationale |
|-------|---------------|-------------|-----------|---------|-----------|
| ...   | ...           | ...         | ...       | ...     | ...       |

Then the face-mode array, then any internal-offset changes, then frame-verification list.

##### Scene authoring

One scene = one sub-composition file. Scenes sit on the same `data-track-index` back-to-back (no gaps). Inside each scene:

- `data-duration` matches the parent's slot exactly
- All GSAP anchors are LOCAL (0-based from scene start)
- Use `tl.set({}, {}, <data-duration>)` to pad the timeline so GSAP `tl.duration()` matches `data-duration`

###### Scene pacing rules (from the 10 principles)

- **No dead frames.** Every 100ms has ≥1 animating element. Offset first entrance 0.1–0.3s, not t=0.
- **Payoff ≥ 1s hold.** The "big reveal" of the scene (stamp, number lock, punchline) must have ≥1s on screen, ideally 1.5s. Budget scenes by reveal time, not total time.
- **Motion through full duration.** If entrance anims all land by local 2s on a 4s scene, add secondary motion: underline sweeps, checkmark pops, ambient drift on cards, small oscillating glows on pills. Dead pacing = swipe-away.
- **Vary eases.** At least 3 different eases per scene across entrances.
- **One jaw-dropper per 5s of runtime.** Typography slam, glitch/chromatic reveal, whip-pan, audio-sync slam. Without these, the video reads as "labeled talking head" — correct but forgettable.

##### Captions (karaoke style)

- Montserrat 900, 46–58px (for 1080 width), 100% white base
- Active word: scale-1.08 pop + color change to accent (`#37bdf8` for AIS, adapt to brand)
- Stroke via layered `text-shadow`, NEVER `-webkit-text-stroke` (renders inconsistently in Chromium render)
- Drop the rgba background pill — let the stroke hold readability. Captions should feel like graffiti on the frame, not a subtitle track.
- For retimes, use a `shift()` function inside `captions.html` to map transcript word timestamps → edited-time. This keeps the transcript JSON untouched and makes retimes mechanical.

See `references/captions.md` under `/hyperframes` for the full karaoke implementation. TL;DR: per-word `<span>` elements with `data-word-start`, GSAP tweens scoped to each span, tight 0.08–0.12s pop durations.

##### Ambient background (never ship flat navy)

Minimum viable background stack:

1. **Radial gradient base** (center lighter than edges by 15–20%)
2. **Animated noise/grain overlay** at 8–12% opacity
3. **4–8 drifting particle dots** or grid traces
4. **Subtle vignette**

`background: #07121c` alone is a placeholder, not a design. For techy/control-room aesthetic, use the 6-layer stack from `feedback_techy_background_layers.md` (HUD grid masked to vignette + circuit traces + pulse nodes + scan beam + telemetry ticker + corner mono labels).

##### Audio reactivity

- Headlines pulse 3–6% on beat. Backgrounds can go 10–30% on bass.
- Text reactivity kept subtle (3–6%) so captions stay readable; backgrounds can push harder.
- Use a SEEDED offline analyser (pre-compute the audio feature track) so renders are deterministic. Do NOT use `AnalyserNode` in the render path — `Math.random()` and real-time audio nodes break determinism.

##### Transitions

- **Rotate flavors.** No two consecutive transitions the same type. Six hard cuts in a row is the #1 tell for AI editing.
- Face-mode transitions (`BOTTOM ↔ FULLSCREEN`) double as scene transitions when the mode changes between scenes.
- For pure overlay scene-to-scene, install from registry: `push-up`, `flash-through-white`, `sdf-iris`, or the full shader-transitions pack. `npx hyperframes catalog --type block` to browse.

##### The verification gate (mandatory — DO NOT ship without)

Lint passing ≠ design working. Never report a short-form render done until you have extracted frames at word-exact timestamps and READ every PNG.

###### Step 1 — draft render

```bash
cd video-projects/<slug>
npx hyperframes lint
npx hyperframes render --quality draft --output renders/<slug>-vN-draft.mp4
```

###### Step 2 — word-exact frame extraction

Pick 8–15 timestamps that each correspond to a SPOKEN WORD where a specific visual should be on-screen. Not round numbers. Not mid-scene. The exact word.

```bash
mkdir -p renders/frames-vN
for pair in "<t>:<label>" "<t>:<label>" ...; do
  t="${pair%%:*}"; label="${pair##*:}"
  ffmpeg -y -ss "$t" -i renders/<slug>-vN-draft.mp4 \
    -frames:v 1 -q:v 2 "renders/frames-vN/t${t}-${label}.png"
done
```

###### Step 3 — Read every PNG

Call `Read` on every PNG so the image loads into context. Do NOT just list filenames. For each frame confirm:

- The expected visual is on-screen at the expected moment (not 1s late, not early)
- Speaker's face is not cropped in any bottom-half scene
- Full-screen vs bottom-half face mode is correct for that scene
- Captions are on-brand, readable, not overflowing
- No blank frames, no unintentional overlap, no text-off-canvas

###### Step 4 — if anything fails, fix + re-verify. Never ship broken.

###### Step 5 — final render

```bash
npx hyperframes render --quality standard --output renders/<slug>-vN.mp4
```

Spot-check 3–4 frames from the final render (same timestamps, different folder `frames-vN-final/`) to confirm the standard-quality encode didn't change anything.

##### The 10 rules (quality checklist — run BEFORE first draft)

Every short-form build. Run this list during authoring, not after.

1. **No dead frames.** Every 100ms has an animating element.
2. **Scene payoff ≥ 1s hold.** Budget by reveal time, not total time.
3. **Face is a character.** Grade + Ken Burns + side vignette.
4. **No hard seams.** Feather y=960 with gradient + scan line.
5. **One jaw-dropper per 5s.** Typography slam, glitch, whip-pan, audio slam.
6. **Audio reactivity non-negotiable.** 3–6% text, 10–30% background.
7. **Rotate transition flavors.** No two consecutive the same.
8. **Captions pop, don't politely label.** Stroke not pill. Scale + color on active word.
9. **Motion through full scene duration.** Secondary motion if entrances land early.
10. **Background is a layer, not a color.** Radial + noise + particles + vignette minimum.
11. **Slam/stamp overlays land AFTER target text is fully visible.** Reveal logic > word-sync. Stamp `t` ≥ target-visible `t` + 0.10–0.25s. Otherwise the punchline lands before the setup.

##### Project structure (every short-form project)

```
video-projects/<slug>/
├── hyperframes.json
├── meta.json                    (id, name, dimensions 1080x1920, fps 30)
├── index.html                   (root composition, the 4-layer scaffold)
├── compositions/
│   ├── ambient-bg.html
│   ├── seam-treatment.html
│   ├── captions.html            (with shift() function if retiming)
│   ├── scene1-<label>.html
│   ├── scene2-<label>.html
│   └── ...
├── assets/
│   ├── <name>.mp4               (original recording)
│   ├── <name>-edit.mp4          (edited — cuts removed — this is what the comp uses)
│   ├── transcript.json          (whisper output)
│   └── brand assets (logo, brand-tokens.css, background music)
└── renders/
    ├── <slug>-v1-draft.mp4
    ├── frames-v1/
    ├── <slug>-v1.mp4
    └── ...
```

##### Retime protocol (when audio is re-edited or timestamps drift)

1. Measure old and new edited audio durations with `ffprobe`. Delta = total cut time.
2. Identify cut window(s): which seconds were removed, from where.
3. Write the Plan table: every scene `data-start`, `data-duration`, every face-mode transition `t`, any scene whose internal offsets straddle a cut.
4. For each scene that straddles a cut, both its parent duration AND its internal offsets change. Scenes entirely on one side of the cut just need parent `data-start` shifted.
5. Lint → draft render → word-exact frame verify → final render. No shortcuts.

##### What NOT to do in short-form

- Don't animate `<video>` element dimensions — freezes frames. Animate wrapper div.
- Don't use `repeat: -1` on any timeline — breaks the capture engine. Finite counts only.
- Don't use `Math.random()` or `Date.now()` — breaks determinism. Seeded PRNG if pseudo-random needed.
- Don't use `<br>` inside captions — natural wrapping + `<br>` produces extra unwanted breaks.
- Don't skip the frame verification gate. Lint exit code is not visual truth.
- Don't author in original-time if the audio is edited. Edited-time or nothing.
- Don't leave `background: #07121c` flat. Layer it.
- Don't hard-cut between scenes. Rotate transition flavors.
- Don't polite-caption. Pop them.
- Don't let the face sit still. Grade + Ken Burns always.

##### Lessons from may-shorts-18 (v1 → v2)

Distilled from the 4 concrete problems the v1 render had and what fixed them in v2. Apply these on every new short.

###### 1. Slam/stamp timing — reveal logic beats word-sync

A SLAM/STAMP overlay (KILLED, DEAD, STOP, etc.) lands AFTER its target text is fully visible, **not** during the spoken word. In may-shorts-18 v1 scene 1, CLAUDE and CHATGPT were pitched as opponents — KILLED fired at local 0.46s while CHATGPT didn't appear until 0.66s, so viewers saw "Claude … KILLED" with no visible target. The joke collapsed.

**Rule:** `stamp_t ≥ target-text-visible_t + 0.10–0.25s`. The "visible" timestamp is the END of the target's entrance animation, not its start. Word-sync is a guideline; visual reveal order is the constraint.

###### 2. BOTTOM face-mode scale — don't ship the default

Default `BOTTOM = { x: 0, y: 1136, scale: 0.5625 }` (exact horizontal fit for a 1920×1080 source) leaves empty studio background flanking the speaker if they occupy <70% of the source frame. This is the default in may-shorts-19 and was copied into may-shorts-18 v1 — both videos had visible dead space left and right of the speaker in every BOTTOM scene.

**Rule:** prefer `BOTTOM = { x: -180, y: 1110, scale: 0.75 }` — crops 180px each side, bottom-anchors to y=1920. Preview ONE frame of BOTTOM mode against the actual source video before committing the constant. If the source speaker is tight-framed already, scale 0.65 may be enough; if the source is wide studio framing, push to scale 0.80 and re-tune x.

Always keep HIDDEN's `x`, `y`, `scale` identical to BOTTOM — they only differ in `opacity` — so the opacity-fade scenes don't drift geometrically mid-fade.

###### 3. Face-mode transitions — three things at once, not one

When the face changes mode between adjacent scenes, a bare 0.15s pre-roll + 0.32s duration `expo.inOut` on just the face wrapper reads as rigid — the outgoing scene's panels are still fully opaque behind the morphing face, so the eye sees two things fighting instead of a crossfade.

**Rule:** for any "hero" scene-to-scene face-mode change (especially BOTTOM ↔ FULLSCREEN), do all three:
1. Extend that specific transition's duration to 0.45–0.55s (not the default 0.32s)
2. Start it 0.25–0.30s before the new scene's `data-start` (not the default 0.15s)
3. Fade + blur the outgoing scene's panel wrapper to `opacity: 0, filter: blur(6px)` over 0.20–0.25s, starting 0.25s before scene end

Implementation-wise, promote the face-mode transition array to per-entry `dur` so one transition can be longer than the others:
```js
[ { t: 2.06, mode: FULLSCREEN, dur: 0.50 }, { t: 3.71, mode: HIDDEN, dur: 0.32 }, ... ]
  .forEach(({ t, mode, dur }) => mainTl.to("#face-wrapper", { ...mode, duration: dur, ease: "expo.inOut" }, t));
```

Three simultaneous changes = "a real editor edited this." Any one alone = rigid.

###### 4. Data-feel scenes beat decoration scenes mid-video

For scenes 3–5 of a 15–20s short (the "middle grind" where attention drops the hardest), lean on visuals that read as information — bar races, stat grids with counting numbers, heatmaps, sparklines, flowcharts, dashboard chrome with telemetry ticking, pain-point grids that flash red in sequence. may-shorts-18 v1 scene 4 was a radar-rings + terminal-chip + sparks combo — functional but decorative, and Nate called it "bland." v2 replaced it with a 3×3 pain-point grid lighting up red-orange in sequence + a sparkline stroke-drawing with a YOU-ARE-HERE marker + the payoff slam — same time budget, much higher engagement.

**Rule:** pure typography-plus-icon scenes feel like slides. Data-feel scenes feel like evidence. When a middle scene feels bland, replace the decoration with something that reads as *information*: a small number ticking up, a bar filling, a chart stroking in, a grid flashing in sequence.

##### Reference compositions

- `video-projects/may-shorts-19/` — the canonical short-form example (18.84s, 1080x1920, 7 scenes, face-mode choreography, karaoke captions with shift(), ambient bg + seam treatment). Read `index.html` and any `compositions/scene*.html` before authoring a new short.
- `video-projects/may-shorts-18/` — secondary reference with the 4 lessons above baked in: BOTTOM scale=0.75, KILLED stamp timed after CHATGPT reveal, scene-1→2 fluid fade, scene 4 data-dashboard "THE PATTERN" grid.

##### Related skills (invoke in addition)

- `/hyperframes` — framework rules (always first)
- `/hyperframes-cli` — CLI commands (init, lint, preview, render)
- `/gsap` — animation library reference
- `/hyperframes-registry` — installing transition blocks
- `/seedance-loop-prompt` — if the short needs an AI-generated looping background video

##### Memory pointers (relevant feedback entries)

- `feedback_short_form_principles.md` — the 10 rules, full rationale
- `feedback_contrast_technique.md` — glow localization + text-shadow halos + brightening dim text
- `feedback_techy_background_layers.md` — 6-layer control-room background stack
- `feedback_visual_verification.md` — the verification gate
- `project_ais_brand_specs.md` — if the short is AIS-branded (hex codes, fonts, logo glow)

## Appendix C — Kit docs

### `MOTION_PHILOSOPHY.md`
#### MOTION PHILOSOPHY — The Gold Standard

> Deconstruction of the **Infinite — Global Payments** 30s spot. The reference every Hyperframes motion build aspires to. Re-read §0 and §4 before and during any creative session.

---

##### 0 · The 11 Laws (memorize)

1. **One idea per beat. Cut fast.** Avg scene ≈ **1.5s**. Each visual lands ONE concept. If a scene says two things, split it.
2. **Black is the canvas.** ~90% of every frame is black or near-black. Negative space is the design.
3. **Light is the brand, not color.** Chrome gradients, halos, vignettes, light beams. The piece is *lit*, not *colored*.
4. **Camera never sleeps.** Grid recedes, coin rotates, particles drift, vignette breathes. Static = death.
5. **Motion blur is a feature.** Every transition rides a streak/blur trail — masks the cut AND conveys energy.
6. **Object metaphors carry meaning.** Red card = broken. Teal coin = working. Same coin returns 3×.
7. **Palette is symbolic, not decorative.** Each color owns one concept. If you can't name its meaning, it hasn't earned its place.
8. **Type is a character.** Words SCALE 8×, MORPH, GLOW. Typography drives ~60% of storytelling.
9. **Hold the hero shot.** Logo reveal ~2s. Outro card 5+s. Kinetic chaos → calm = catharsis.
10. **One unifying texture.** Perspective grid + crosshair (+) markers are the spine of the whole piece.
11. **Timelines must fill their slots.** HF hides a sub-composition the moment `timeline.duration()` < `data-duration` → black-frame flash. Every timeline ends with `tl.to({}, { duration: SLOT_DURATION }, 0)`. Non-negotiable. (Recipe §3.5; diagnostic §4.)

**Three-act structure / rule of threes:** problem→brand · benefits→surfaces→products · foundation→CTA→silence. 3 benefits, 3 surfaces, 3 product names, 3 coins.

---

##### 2 · Visual Vocabulary

###### 2.1 Core Backgrounds

- **Perspective grid floor** — always. `<div>` with `transform: perspective(900px) rotateX(60deg)` + two `repeating-linear-gradient` axes at `rgba(255,255,255,.05) 0 1px, transparent 1px 80px`. GSAP animates `background-position-y` for parallax.
- **Vignette** — always on top. `radial-gradient(ellipse at center, transparent 30%, #000 95%)`, `pointer-events: none`.
- **Grain overlay** — always. `npx hyperframes add grain-overlay`.
- **Sparkle particles** (grid scenes) — 20–40 absolute `+` shapes at random intersections, GSAP `stagger.from('random')` opacity, `repeat: -1, yoyo: true`.
- **Iridescent gradient stage** (wheel scenes) — soft conic-gradient or pre-rendered `<video muted loop>` for true chromatic shimmer.
- **Conical light beam** (finales) — `conic-gradient(from 180deg at 50% 0%, transparent, rgba(0,255,200,.15) 50%, transparent)`, blurred.
- **Liquid-glass card** — 4-stop diagonal gradient `rgba(255,255,255,.075/.025/.010/.055)` + `backdrop-filter: blur(14px) saturate(1.12)` + inner highlight `inset 0 1px 0 rgba(255,255,255,.22)` + 1px border. Inner highlight is the iOS-26 tell.

###### 2.2 Type System

- **Single sans-serif.** Geometric, generous tracking (Inter, Suisse Int'l, SF Pro).
- **Chrome gradient on all headlines:** `background: linear-gradient(180deg, #fff 0%, #999 60%, #ccc 100%); -webkit-background-clip: text; color: transparent;`
- **Halo glow on emphasis:** `text-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)`
- **Word-by-word reveal** (not character-by-character):
  ```html
  <span class="clip word" data-start="0.0">Global</span>
  <span class="clip word" data-start="0.4">payments</span>
  ```
  `tl.from('.word', { y: 30, opacity: 0, scale: 0.85, duration: 0.6, ease: 'power3.out', stagger: 0.35 })`
- **Type SCALES dramatically.** Labels 48px. Hero kinetic-type 480px+. Animate via `scale`.
- **Title Case for emphasis**, not sentence-case.
- **Chrome-gradient sweep.** 8-stop gradient with DARK BOOKENDS (prevents edge tear):
  ```css
  background: linear-gradient(90deg,
    #14110a 0%, #14110a 15%,
    #5a3215 25%, #c84f1c 40%, #e2b53f 55%, #2a8a7c 70%,
    #14110a 85%, #14110a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 100%;
  background-position: 100% 0;
  ```
  Tween `backgroundPosition` `100% 0` → `0% 0` over `0.6s` `power2.out`, `stagger: 0.04`.
- **Word-reveal carrier.** First word carries momentum with a 360px slide; tail words decay: `360 → 120 → 60 → 25 → 12px`. Carrier `expo.out 0.33s`; tail `power2.out 0.20s`. Anchor to Whisper onsets. On punchlines, lead the VISUAL 0.2s ahead of audio — reads as inevitable.
- **Per-beat font discipline.** Every beat uses a DIFFERENT Google Fonts family; the contrast sells "different universes." Roster: Instrument Serif · Space Grotesk · Bebas Neue · Inter · EB Garamond italic · Cormorant Garamond italic · Azeret Mono · Geist · JetBrains Mono / SF Mono.

###### 2.3 Color Discipline

For every new scene, name the one color carrying the beat. If you can't, you haven't earned it.

Reference palette (Infinite-spot specific — AIS or other briefs override): Chrome white→gray `#fff → #999` (premium/brand voice) · Red `#e10b1f` (problem/broken) · Teal `#33d4c8`/`#5ee2d9` (solution/core) · Magenta/purple `#a155ff`/`#7e42d8` (speed/energy/API) · Blue `#3b82f6`/`#5db4ff` (connection/global) · Neon orange/yellow `#ff9430`/`#ffd84a` (value/affordability).

**Palette cap: 5 active hues, each with a meaning.** Over that, you're decorating.

###### 2.4 Motion Vocabulary

| Move | GSAP recipe |
|------|-------------|
| **Camera dolly through type** | `tl.fromTo(text, { scale: 1, opacity: 1 }, { scale: 8, opacity: 0, duration: 1.5, ease: 'power2.in' })` |
| **Light-streak whip** | `gsap.fromTo(streak, { xPercent: -150 }, { xPercent: 250, duration: 0.4, ease: 'power3.in' })` — fire AT the cut |
| **Word ghost reveal** | `stagger: 0.35` with exits at `+= 0.5` → 0.15s overlap |
| **Object morph drift** | `to A: { x: 200, scale: 0.5, opacity: 0 }`, `from B: { x: -200, scale: 0.5, opacity: 0 }`, both 0.5s. Light streak hides swap. |
| **Coin spin reveal** | `tl.from(coin, { rotateY: 90, duration: 0.8, ease: 'back.out(1.4)' })` — needs `transform-style: preserve-3d` |
| **Crystallize → wordmark** | Two aligned timelines: coin scales 1→0.3 + moves to logo pos, wordmark fades 0→1, both end at same X/Y |
| **Energy pulse along path** | SVG `stroke-dasharray + stroke-dashoffset` 1→0; node `boxShadow` tween at path end |
| **Color recolor (no cut)** | `tl.to(':root', { '--accent': '#ff9430', duration: 0.6 })` — CSS vars |
| **Slide-up phone reveal** | `tl.from(phone, { y: '100%', duration: 1, ease: 'power3.out' }).from(headline, { y: 30, opacity: 0, duration: 0.6 }, 0.3)` |
| **Wheel + side-panel** | `tl.to(wheel, { rotation: 120, duration: 1.5 }).from(panel, { x: -100, opacity: 0, duration: 0.6 }, '<0.3')` |
| **Floating cluster drift** | `gsap.to(coins, { y: '-=15', duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: { each: 0.4, from: 'random' } })` |
| **Vignette breath** | `gsap.to(vignette, { opacity: 0.9, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })` |
| **Cut-the-curve vertical whip** (default adjacent-beat transition) | **Exit:** `tl.to(wrap, { y: -150, filter: "blur(30px)", duration: 0.33, ease: "power2.in" })` · **Entry:** `gsap.set(wrap, { y: 150, filter: "blur(30px)" })` then `tl.to(wrap, { y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" }, 0)` — same direction both sides, velocity matched at the cut |

**Transitions menu:** light-streak whip (default) · cross-warp morph (object→object) · color recolor (related ideas same comp) · slide-up (product mockups) · flash-through-white (act break) · swirl-vortex (product-family rotations). Registry blocks for most: `whip-pan`, `cross-warp-morph`, `flash-through-white`, `swirl-vortex`, `cinematic-zoom`, `chromatic-radial-split`.

###### 2.5 Pacing

- **Scene length:** 1.0–2.0s. Longer only for hero moments or outro.
- **Reveal cadence:** new element every 0.3–0.6s within a scene. No dead air > 1s mid-piece.
- **Word stagger:** 0.3–0.4s narrative, 0.5–0.6s dramatic.
- **Whip transition:** 0.3–0.4s.
- **Holds:** logo crystallize 1.5–2s · CTA card 4–6s · section headlines 1–1.5s after full reveal.
- **Breathing rule:** every ~7–8s of kinetic density, give a 1s rest beat.

###### 2.6 Audio Mix

Every audio scene sets `data-volume` explicitly. Default to a 0.15 warm pad, not a music track.

| Layer | `data-volume` | Role |
|------|---------------|------|
| Voiceover | `1.0` | Primary, drives timing |
| Underscore (warm pad) | `0.15` | Barely there |
| SFX (clicks, whooshes) | `0.2` | Tails bleed into next beat |

Wire as sibling `<audio>` elements in root, never inside `<video>`.

---

##### 3 · HyperFrames Recipes

###### 3.1 Grid background (re-use everywhere)

```html
<div class="stage" data-composition-id="...">
  <div class="grid-floor clip" data-start="0" data-duration="30" data-track-index="0"></div>
  <svg class="crosshairs clip" data-start="0" data-duration="30" data-track-index="1">
    <!-- 16 + marks at grid intersections -->
  </svg>
  <div class="vignette clip" data-start="0" data-duration="30" data-track-index="9"></div>
  <div class="grain    clip" data-start="0" data-duration="30" data-track-index="10"></div>
  <!-- Content in tracks 2–8 -->
</div>

<style>
.grid-floor {
  position: absolute; inset: 0;
  transform: perspective(900px) rotateX(60deg) translateY(20%);
  background:
    repeating-linear-gradient(0deg,  rgba(255,255,255,.05) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 80px);
  background-color: #000;
}
.vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 30%, #000 95%);
}
</style>
```

###### 3.2 Whip-streak transition

```html
<div class="whip-streak clip" data-start="3.6" data-duration="0.4" data-track-index="8"></div>

<style>
.whip-streak {
  position: absolute; top: 50%; left: 0;
  width: 40%; height: 8px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  filter: blur(6px); transform: translateY(-50%);
}
</style>

<script>
gsap.fromTo('.whip-streak',
  { xPercent: -100, scaleX: 0.5 },
  { xPercent: 250, scaleX: 1.5, duration: 0.4, ease: 'power3.in' }
);
</script>
```

Next scene's `data-start` lands at the streak's peak (~halfway through) so the cut hides in the brightness.

###### 3.3 Color Recolor Trick (no cut)

```html
<div class="flowchart" style="--edge: #5db4ff; --node-glow: rgba(91,180,255,.6);">
  <!-- nodes use var(--edge) for borders, var(--node-glow) for shadow -->
</div>

<script>
tl.to('.flowchart', {
  '--edge': '#ffd84a',
  '--node-glow': 'rgba(255,148,48,0.7)',
  duration: 0.6, ease: 'power2.inOut'
}, 2.5);
</script>
```

Same DOM, meaning shifts (Global → Affordable). Cheap to build, expensive to look at.

###### 3.4 3D objects — pre-render or CSS?

- Iridescent chrome / chromatic refraction → **pre-render MP4** (alpha or loop). WebGL overkill.
- Planar motion, spinning flat textures → **CSS 3D + GSAP**.
- Card with motion blur → PNG + `filter: blur()` keyframe at peak.

###### 3.5 Timeline-padding rule (framework-critical)

Every sub-composition ends its timeline with a no-op anchor:

```js
const tl = gsap.timeline({ paused: true });
// … tweens …
tl.to({}, { duration: SLOT_DURATION }, 0);  // forces timeline.duration() >= SLOT_DURATION
window.__timelines['my-comp'] = tl;
```

HF sets `visibility: hidden` when `timeline.duration() < data-duration` — black-frame flash at the beat tail. The anchor has zero animation cost but keeps the composition alive for its full slot.

###### 3.6 GSAP proxy pattern (Canvas 2D / shaders in a timeline)

Drive procedural rendering from a single tween advancing a proxy time value:

```js
const proxy = { time: 0 };
tl.to(proxy, {
  time: DURATION, duration: DURATION, ease: "none",
  onUpdate: () => renderAtTime(proxy.time)
}, 0);
```

Rules:
1. **Canvas 2D is headless-safe; live WebGL can stall the render.** Ship a Canvas 2D fallback keyed off `renderOptions.headless`.
2. **No `Math.random()` / `Date.now()`.** Use seeded PRNGs or harmonic-sin hashes — renders must be deterministic.

###### 3.7 `<video>` poster + lastframe bracketing

`<video>` tags flicker on startup and black-frame after source ends. Bracket with static JPG stills:

```html
<img id="beat-poster"    src="assets/beat4-poster.jpg">
<video id="beat-video"   src="assets/beat4-clip.mp4"
       data-start="7.1" data-duration="8.94" data-track-index="5" muted></video>
<img id="beat-lastframe" src="assets/beat4-lastframe.jpg">
```

```js
tl.set("#beat-poster",    { display: "none" }, 7.1);   // hand off at video-start
tl.set("#beat-lastframe", { opacity: 1 },      16.04); // cover video-end → beat-end
```

```bash
ffmpeg -y -ss 0        -i clip.mp4 -frames:v 1 -q:v 2 poster.jpg
ffmpeg -y -sseof -0.04 -i clip.mp4 -frames:v 1 -q:v 2 lastframe.jpg
```

###### 3.8 Captions as body-level siblings

Keep captions OUT of sub-composition timelines. Place in `index.html` outside the master composition `<div>`, each with unique `data-track-index ≥ 20`:

```html
<div class="cap clip" data-start="7.29"  data-duration="1.86" data-track-index="30">HyperFrames by HeyGen.</div>
<div class="cap clip" data-start="9.10"  data-duration="3.44" data-track-index="31">Agents write HTML and render MP4s.</div>

<style>
.cap {
  position: absolute; bottom: 72px; left: 50%; transform: translateX(-50%);
  padding: 12px 22px; border-radius: 14px;
  background: rgba(10, 8, 5, 0.55);
  backdrop-filter: blur(8px);
  font: 500 28px/1.3 Inter, sans-serif; color: #fff;
}
</style>
```

###### 3.9 Tween-comment convention

Every entry/exit tween's comment names the matching tween in the adjacent beat:

```js
// ENTRY — blur de-ramps from 22px to match outgoing "circle" beat's 22px exit.
gsap.set(wrap, { filter: "blur(22px)" });
tl.to(wrap, { filter: "blur(0px)", duration: 0.33, ease: "power2.out" }, 0);

// EXIT — matches incoming "engine" beat's 150px y + 30px blur entry.
tl.to(wrap, { y: -150, filter: "blur(30px)", duration: 0.33, ease: "power2.in" }, 1.89);
```

If you can't name the matching tween, you haven't designed the seam.

---

##### 4 · Pre-flight Checklist (before claiming "done")

- [ ] **Avg scene length ≤ 2s** in mid-section
- [ ] **No dead air > 1s** outside deliberate holds
- [ ] **Every transition uses motion** (no hard fades)
- [ ] **Palette ≤ 5 active hues**, each with a meaning
- [ ] **Every text block uses chrome gradient + halo** — no flat white
- [ ] **Grid + crosshairs in ≥ 60% of scenes**
- [ ] **Vignette + grain on every scene**
- [ ] **One callback minimum** — a visual that returns later
- [ ] **Outro holds 4+ seconds**
- [ ] **Visual verification done** — frames extracted, Read, confirmed: no cropped faces, no text overflow, no beat on wrong word, no broken transitions
- [ ] **Every timeline ends with `tl.to({}, { duration: SLOT_DURATION }, 0)`** (Law #11)
- [ ] **All tween end-times snap to multiples of `1/fps`** — steep-tail easings (`expo.in`, `power4.in`) alias at sub-frame boundaries
- [ ] **Ran the timeline-duration diagnostic:**
  ```js
  const p = document.querySelector('hyperframes-player');
  const iw = p.shadowRoot.querySelector('iframe').contentWindow;
  Object.fromEntries(Object.entries(iw.__timelines).map(([k, v]) =>
    [k, +v.duration().toFixed(4)]));
  ```
  Any gap where `timeline.duration() < data-duration` is a black-frame risk.

###### 4.1 GSAP Code Dictionary

| Purpose | Ease | Duration |
|---|---|---|
| Word reveal (slide-in) | `expo.out` | 0.20–0.33s |
| Generic enter | `power2.out` | 0.2–0.5s |
| Generic exit | `power2.in` | 0.2–0.33s |
| Beat whip EXIT | `expo.in` / `power2.in` | 0.2–0.33s |
| Beat whip ENTRY | `expo.out` / `power2.out` | 0.5–1.0s |
| Camera pan between stops | `power2.inOut` | 1.2–2.3s |
| Linear hold (after entry) | `"none"` | 0.4–0.65s |
| Bouncy card settle | `back.out(1.2–1.5)` | 0.3–0.5s |
| UI overshoot | `elastic.out(1, 0.3–0.4)` | 0.20s |
| Breathe / drift | `sine.inOut` yoyo | 2–4s, `repeat: -1` |

**Staggers:** chrome sweep across words `0.04` · dot-grid ripple per-column `0.019`, within-column `0.004` · code-stream lines `0.06`.

**No `gsap.defaults()`** — declare ease/duration per tween. Inheritance bugs are harder to diagnose than verbose tweens.

**Timeline skeleton:**
```js
(() => {
  const tl = gsap.timeline({ paused: true });
  // … tweens …
  tl.to({}, { duration: SLOT_DURATION }, 0);  // Law #11 anchor
  window.__timelines['<data-composition-id>'] = tl;
})();
```
Key must match `data-composition-id` exactly.

---

##### 5 · Anti-patterns (beyond Law inversions)

- ❌ **`Math.random()` / `Date.now()` / unseeded PRNGs in a render loop.** Use harmonic hashes: `80 + 220 * Math.abs(Math.sin(i*0.7 + 0.3) * Math.cos(i*1.3 + 0.7))`.
- ❌ **Leaning on `npx hyperframes add <block>` for benchmark pieces.** The HF launch video installs ZERO registry blocks. Registry = velocity; hand-built = reference quality.
- ❌ **Shipping without viewing frames.** Lint passing ≠ design working. **VIEW THE FRAMES.**
- ❌ **Decorative grain or vignette.** Not decoration — unifying *texture*. Every scene, every time.

---

##### 6 · TL;DR

> **One idea per beat, lit not colored, kinetic not still, callbacks not novelty, hold the hero, breathe the outro — the grid is always under everything, every timeline fills its slot, every exit snaps to a frame boundary, and every cut hides inside a motion-blurred whip.**

### `docs/WORKFLOW.md`
#### From recording to finished edit

##### 1. Create a project and transcribe

From the repository root run `npm run new-video -- my-video`. Put your recording
at `video-projects/my-video/assets/raw.mp4`. Preserve this original.

```sh
node scripts/transcribe-elevenlabs.mjs video-projects/my-video/assets/raw.mp4
```

This is Nate's default and uploads audio to ElevenLabs using your key and credits.
You may choose OpenAI Whisper, local Whisper, or another provider instead; see
[provider setup and transcript normalization](TOOLS-AND-API-KEYS.md).
You can also supply an existing word-level
JSON transcript with `words: [{text, start, end}]` and `audio_duration_secs`.

##### 2. Remove dead air

```sh
node .agents/skills/cut-silences/scripts/cut-silences.mjs video-projects/my-video/assets/raw.json --video video-projects/my-video/assets/raw.mp4 --out-dir video-projects/my-video/assets --output video-projects/my-video/assets/silenced.mp4 --apply
```

The retimed transcript is `raw.silence-transcript.json`. Tune gap and breathing
parameters in the skill; do not remove pauses that carry meaning.

##### 3. Review mistakes

```sh
node .agents/skills/cut-mistakes/scripts/find-cut-candidates.mjs video-projects/my-video/assets/raw.silence-transcript.json --out-dir video-projects/my-video/assets
```

Read each proposal against the speech. Write reviewed decisions to
`approved-cuts.json` using `{ "cuts": [{ "start": 1.2, "end": 1.5, "reason": "stutter" }] }`.
These times are on the SILENCED timeline. Empty cuts are valid.

```sh
node .agents/skills/cut-mistakes/scripts/apply-cuts.mjs video-projects/my-video/assets/raw.silence-transcript.json --cuts video-projects/my-video/assets/approved-cuts.json --video video-projects/my-video/assets/silenced.mp4 --out-dir video-projects/my-video/assets --output video-projects/my-video/assets/clean.mp4 --apply
```

Use `raw.mistakes-transcript.json` alongside `clean.mp4`. Copy that transcript to
the project's `assets/transcript.json` for beat validation. Never use raw timings
against the cleaned video. Claude users can substitute `.claude` for `.agents`.

##### 4. Design the visual layer

Read video-storytelling and the motion philosophy. Fill a beat sheet with the
spoken anchor, on-screen idea, visual, entry time, and callback. Pick a style and
copy cards with their CSS/assets into your composition. Preserve the speaker's
face and use a non-timed wrapper for camera reframing. See style-library skill.
The graph-paper template is a background; it needs your story content on top.

##### 5. Check, preview, and render

```sh
node scripts/preflight.mjs video-projects/my-video
node scripts/validate-beat-sync.mjs video-projects/my-video
cd video-projects/my-video
npx hyperframes lint
npx hyperframes preview
```

Run beat-sync only for anchored external sub-compositions; it fails when none
are present. For inline compositions, check timing manually. Review Studio, then
render a draft. Inspect encoded frames at hero moments and transitions, and
listen at joins. Fix problems and write VERIFY.md before a standard render.
Publication is a separate action requiring the student's instruction.

### `docs/EDITING-PLAYBOOK.md`
#### Editing playbook: how Nate's videos get edited with AI

Nate's reels, Shorts, and explainers are now edited by an AI agent (Claude Code or Codex) running skills like the ones in this kit. Nate records himself talking, hands over the file, and the agent cuts it, captions it, finds the B-roll, builds the motion graphics, mixes the music and sound effects, and checks its own work.

This page explains how that works and what we learned building it. The numbers come from studying Nate's own top reels frame by frame and from dozens of edit rounds where he gave notes.

- [The loop that makes it work](#the-loop-that-makes-it-work)
- [The edit, step by step](#the-edit-step-by-step)
- [House reel style (the numbers)](#house-reel-style-the-numbers)
- [B-roll](#b-roll)
- [Captions](#captions)
- [Music and sound effects](#music-and-sound-effects)
- [Other formats](#other-formats)
- [Checking the edit](#checking-the-edit)
- [Lessons that cost us time](#lessons-that-cost-us-time)

##### The loop that makes it work

The edits got good because every note Nate gave became a permanent rule in a skill. He never had to give the same note twice.

1. **Record and hand over the file.** No editing app.
2. **The agent edits and renders a draft.**
3. **You watch it and say what you don't like, in plain words.** "I can't read that caption." "That shot doesn't move." "Those sound effects sound cheap."
4. **The agent fixes the edit AND writes the fix into the skill** as a rule, a check, or a script change. Ask for that explicitly: "Fix it, then add this to the skill so it never happens again."
5. **The next edit starts from the improved skill.**

Real examples of notes that became rules:

| Nate's note | What the skill does now |
|---|---|
| "White captions on a bright website are unreadable." | Every caption sits in the same dark box, and a contrast check measures the pixels behind each one. |
| "AI-generated B-roll always beats AI-generated images." | An AI still image used as B-roll is a build error. Stills only become first frames for AI video. |
| "Every shot has to move." | Each shot is real footage, a screen recording, an animated UI, or AI video, with a slow push-in. No frozen frames. |
| "Those laser sound effects sound cheap." | The sound palette switched to soft taps, dry clicks, paper, and air. No pitch-drop plops or zaps. |
| "The lips are behind the voice by the end." | Cuts select exact frames in one pass, and a sync check compares every cut frame against the raw. |
| "Captions should never blink out." | On shots full of text to read, captions move to a clear zone instead of disappearing. |
| "You cut out my natural pause after 'first', it feels too quick." Then, after a fix that added silence there: "You muted out the word first." | Speech is cut between phrases at real silence, never inside one. A filler that runs straight into the next word stays, because cutting it clips the words around it. |
| "The caption covers my mouth in the first second." | A caption that runs across a cut moves with the cut, and the first 2.5 s are checked frame by frame for anything over the mouth. |

The editing knowledge lives in the skill files, so you can read it, edit it, and share it.

##### The edit, step by step

This is the order the `short-form-edit` and `edit-video` skills follow.

1. **Transcribe** with word-level timestamps (ElevenLabs Scribe is Nate's default; Whisper works).
2. **Cut retakes.** Keep the last clean take of each line. Join two takes only where both sides are silent; if the takes run together, play one take whole.
3. **Cut between phrases, never inside one.** A phrase is what you say in one breath. Remove the dead air between phrases and keep your natural beats (after a comma, after "First,"). Drop a filler only when there is silence on both sides of it: "First, what it does is it transcribes" is one phrase, and cutting "what it does is" clips the word "First". Never speed the voice up.
4. **Plan the story before any visuals:** hook, proof, the items, the payoff, the CTA. Write it down.
5. **Source B-roll**, one visual per noun phrase, in the preference order below.
6. **Build the composition** in HyperFrames, every shot anchored to the spoken word it illustrates.
7. **Mix** voice, music, and sound effects.
8. **Render a draft, check it** (frames, sync, sound, captions), fix, then render the final.

##### House reel style (the numbers)

Measured on Nate's 27 top Instagram Reels (March to September 2026). Use them as a starting point for your own style, not as law.

**Pacing**
- Speech starts within 0.1 s. The file ends right after the last word. No intro or outro card.
- No dead air: pauses between phrases stay under about 0.2 s. Natural beats after a comma or a list marker ("First,") run 0.2 to 0.4 s and stay. Typical gap between words is 0.04 s (median) and 0.1 s (90th percentile), at 4.0 to 4.7 words per second. Tightness comes from removing dead air between phrases.
- Shots average 1.1 to 1.4 s, none over about 2.8 s. The first cut lands at 0.6 to 1.0 s, on the first charged word.
- Each item in a spoken list gets its own shot.

**Layouts** (1080x1920; every change is a hard cut)
- **Split:** B-roll on top (y 0 to 880), speaker below. 30 to 42% of the reel.
- **Full B-roll:** footage fills the frame. 50 to 55%.
- **Punch-in:** a tight shot of the speaker for pivots, emphasis, and the CTA. 5 to 15%.
- The speaker is on screen about 45% of the time and never gone for more than about 3.5 s.
- The first frame is a split with the topic's tool or brand on top.

**Story**
1. Hook in the first 3 seconds: a claim or command that names the tool or person.
2. One line of credibility or context.
3. If there's a list, show all items early, blurred, as an open loop.
4. Each item: a section card, a one-line definition, two or three literal visuals, a punch-in on the key line.
5. Resolution that calls back to the hook visual.
6. CTA: show the resource first, then a punch-in with the comment keyword.

##### B-roll

**Video beats images, every time.** The reel has to hold attention from the first frame to the last, so every shot moves. Preference order:

1. Real footage of the thing named: the person's talk, the product's demo, your own long-form video.
2. A real screen recording of the site or app, zoomed into the part being talked about, with a visible cursor.
3. An animated UI mock: typing, rows ticking, a counter climbing. Label mocks as examples.
4. AI video. Concrete metaphors work ("burn your money" = a bill burning, "hoping it works" = a slot machine). Generic "person at a computer" clips read as stock.
5. Short highlight crops of a real page (under 1 s) on tool names, prices, badges.

Rules that came from mistakes:
- Never invent numbers, results, or a successful test to decorate a claim.
- A whole web page shrunk to phone size is unreadable. Crop to the phrase and highlight it on the spoken word.
- Small UI floating in empty space is the fastest "AI edit" tell. Zoom UI so it fills the panel.
- Never click "Accept" on cookie or terms dialogs while recording. Close them or use another page.
- AI video models often cut to a second camera angle around 2.5 to 3 s, and text on AI screens turns to gibberish. Use the first continuous seconds and keep screens small in frame.
- Consecutive AI shots of the same person must match (same outfit, same room). Pass the previous frame as a reference.
- Use each B-roll scene once per reel.

##### Captions

- 1 to 3 words per chunk, split on phrase boundaries. They hard-swap with no pop animation and appear 2 frames before the first word.
- Montserrat ExtraBold, all caps, about 62 to 64 px, with a heavy serif accent (Abril Fatface) on 5 to 20% of chunks for soft words. Never two serif chunks in a row.
- Color on 25 to 45% of chunks, whole chunk only: red for the wrong way or a loss, teal for the concept or keyword, green for the action or payoff.
- **One look for the whole reel:** every caption in the same dark box with a thin light edge, so it reads on black, white, and footage alike. Mixing boxed and bare captions looked cheap.
- **Never white on light.** Measure the pixels behind every caption.
- Position: on the seam in a split, on the shirt in a punch-in (not the jaw), and in a clear zone when the shot is text to read.
- **Never over the mouth or chin,** least of all in the first second, when the viewer decides whether the person on screen is real. A caption that runs across a cut moves to the new shot's spot on the cut frame.

##### Music and sound effects

- **Pick music by mood:** a darker, confident beat for claims and news, lo-fi or chill groove for methods.
- The bed sits about 11 dB under the voice (working range 9 to 14 dB). Duck it under speech. The first 1 to 2 s are often quieter, with the beat landing on the second line.
- **Sound effects follow visible actions,** not every cut: a soft air whoosh on a real spatial move, a damped tap when a logo lands, a dry click for small UI, paper for documents, one short warm tone for a check, a dry stop for an X.
- Avoid laser zaps, pitch-drop plops, sci-fi chirps, and a whoosh on every cut.
- Vary the actual sound files for repeated items (click, tap, ceramic touch) so a list doesn't sound like a percussion loop.
- Master near -14 LUFS with true peak at or below -1.5 dBTP. **Measure the final encoded file,** not just the WAV.
- Never fade the last spoken word.

##### Other formats

**Raw reel (lighter style):** no B-roll and no music. Cut retakes, stutters, and dead air only, keeping the last clean take. One word on screen at a time, small, lower middle, synced to the exact word. When the speaker points while naming a tool, pop the tool's real logo where they point with a quiet tap. Cut only after a word fully decays; transcripts end words 40 to 80 ms before the consonant dies.

**YouTube Short from a long-form video:** screen recording on top, face cam below, word-highlight captions on the seam. Put the value or claim in the first 3 seconds, then proofs in the long-form's order, and end on a complete takeaway. Every number on screen must be explainable from what the Short showed. Name things before using them. Keep labels below the top 130 px. Never assemble a CTA the speaker didn't say.

**Narrated explainer (AI voice):**
- Put the whole timeline on one clock (a beat grid) so picture, music, and sound effects all move when a line changes. Never hard-code a time a word should anchor.
- Level every voice line to the same loudness and limit only the peaks. Scaling a whole line down to fit its loudest peak made one line 5 dB quieter.
- Re-transcribe the full narration and compare it to the script before every render.
- Don't play the narrator over footage of a real person talking. Viewers think that person is speaking in the AI voice.
- End on the thesis line, spoken in the decay of the last music hit, then the logo.
- Dim UI panels and waveforms lose viewers. Put real footage in those scenes.

##### Checking the edit

The agent checks its own work before you see it:
- **Lip sync:** match cut frames against the raw. A matching frame count alone does not prove the right frames were picked.
- **Frame strips** across every cut (10 frames each side). They catch one-frame empty panels and captions flashing over the wrong shot that single screenshots miss.
- **Contrast** behind every caption.
- **Every word whole:** transcribe the final render and compare the words at every cut with the raw recording. A transcript alone is not proof: speech-to-text guesses a clipped word correctly while a listener hears it broken.
- **The first second:** read the first 2.5 s frame by frame and the first frame of every face shot. Nothing covers the mouth.
- **Loudness and true peak** on the delivered file.
- **AI watch tests** (a video model watching the render) are useful for candidate problems, but they are noisy and hallucinate effects. Verify every complaint on real frames before acting. A persona panel ("would this viewer finish? where did they stop?") is more useful than a 1 to 10 score.
- **Your review is the final gate.** Nate caught a lip-sync drift that every automated check missed.

##### Lessons that cost us time

- Encoding each segment separately and concatenating drifts lip sync by about a frame at half the joins. Select exact frame numbers in one pass.
- Download the full video stream and cut locally; seeking over HTTP for a 3 s clip took 10+ minutes.
- Browser screen recorders capture CSS pixels, so high-DPR recordings come out small. Capture frame by frame instead.
- Some docs sites scroll an inner container; scroll with the mouse wheel, not `window.scrollTo`.
- A dark caption box disappears on a dark background unless it has a thin light edge.
- Animate transforms (x, y, scale), not `top` or `left`.
- Cutting a filler out of the middle of a phrase clips the words around it, and putting a pause there makes the clipped word sound muted. The version that worked had fewer cuts, all between phrases, and ran 5 s longer.
- Measure loudness on the stereo delivery. A mono file reads 3 dB lower and one reel shipped too loud because of it.
- A raw recording caps the edit. A clip with no hook and no CTA scores low no matter how well it's cut. Script the hook before you record.

### `docs/TOOLS-AND-API-KEYS.md`
#### Tools, accounts, and API keys

Nate uses **ElevenLabs Scribe for transcription** and **Kie.ai for generated video
and image assets**. These are his preferred services, not requirements for every
edit. Bring your own accounts and credits, and configure only what you use.

##### What you need

| Tool or service | When you need it | Setup and cost |
| --- | --- | --- |
| Codex or Claude Code | Following the agent-guided editing skills | Your own assistant access. External service API credits are separate. |
| Node.js 22+, npm, Git, FFmpeg with ffprobe, and Chrome/Chromium | Local editing, preview, and rendering | Install on your computer. See [setup](SETUP.md). |
| HyperFrames and GSAP | Video compositions and animation | Installed by `npm ci`. Rendering runs locally. Some templates use online fonts or CDNs; localize selected assets for final rendering. |
| ElevenLabs Scribe | Nate's default for speech transcription | Your own key with `speech_to_text` access and available usage. The included helper sends audio to ElevenLabs. |
| OpenAI Whisper API | Alternative cloud transcription | Your own OpenAI API key and API billing. Ask the assistant to configure the call and normalize its word timestamps. |
| Local Whisper or whisper.cpp | Alternative transcription on your computer | Separate runtime and model installation. No cloud transcription key; needs model downloads, disk space, and local compute. |
| Kie.ai | Optional generated moving B-roll, images, and other supported assets | Your own account, key, and credits. Existing footage and supplied assets can be used instead. |
| Your footage, logos, fonts, music, and sound effects | Building the actual edit | Supply assets you can use. The kit does not include a stock-media or music subscription. |

The synthetic starter and checks need no paid transcription or generation API.
Choose a provider only when the next stage needs it.

##### ElevenLabs: the included helper

Create a key in [ElevenLabs API settings](https://elevenlabs.io/app/settings/api-keys)
and put it in the root `.env` as `ELEVENLABS_API_KEY`. Then run:

```sh
node scripts/transcribe-elevenlabs.mjs video-projects/my-video/assets/raw.mp4
```

The helper writes word-level JSON beside the input. Reuse a verified transcript
instead of paying to transcribe the same take again. See the official
[Scribe API documentation](https://elevenlabs.io/docs/api-reference/speech-to-text/convert)
for current model options and usage details.

##### Whisper and other transcription alternatives

You can prompt the assistant to use another provider. The bundled
`transcribe-elevenlabs.mjs` script itself only calls ElevenLabs; changing the key
does not switch its provider.

For the OpenAI API, use `whisper-1`, `response_format="verbose_json"`, and
`timestamp_granularities=["word"]`. Store `OPENAI_API_KEY` locally. Check current
upload limits before sending long recordings; split audio when needed and retain
chunk offsets. See [OpenAI's guide](https://developers.openai.com/api/docs/guides/speech-to-text).

For local transcription, ask the assistant to configure
[OpenAI Whisper](https://github.com/openai/whisper) or
[whisper.cpp](https://github.com/ggml-org/whisper.cpp). Python Whisper requires
Python and model dependencies; whisper.cpp has its own installation. Neither is
installed by `npm ci`.

The cutting tools require this common format, with **word-level times in seconds**
on the exact source recording's timeline:

```json
{
  "text": "Hello world.",
  "audio_duration_secs": 2.0,
  "words": [
    { "text": "Hello", "start": 0.2, "end": 0.6 },
    { "text": "world.", "start": 0.7, "end": 1.2 }
  ]
}
```

Ask the assistant to map a provider's `word` field to `text` when necessary,
preserve numeric start/end times, and get full source duration from ffprobe.
Paragraphs, SRT subtitles, and segment-only transcripts do not supply the required
word timing. Request word timestamps or perform alignment; do not invent timing.
Later edits must retime words using their EDL. Short-form plans additionally track
`sourceStart` and `sourceEnd`.

Copy either prompt:

> Use OpenAI Whisper instead of ElevenLabs for this recording. Use my locally
> configured API key, request word timestamps, and normalize the result for this
> kit before cutting. Preserve the source and verify timing against its audio.

> Use local Whisper for transcription. Check its installation and model downloads
> first, then normalize the word timestamps for this kit. Keep transcription local
> and use my supplied footage and assets without paid generation.

##### Kie.ai: generated video and assets

Nate uses [Kie.ai](https://kie.ai/) for generated video and image assets. Set
`KIE_API_KEY` in `.env` if you choose it. Follow the
[official API guide](https://docs.kie.ai/) for keys, model-specific requests,
task status, and credits.

The short-form skill describes a Kie workflow; the kit does **not** bundle a
universal Kie generation script or connected account. The `motion-showreel` skill
includes a small client (`scripts/kie.mjs`) for its three showreel assets: Suno
instrumental music, Seedream stills from a logo reference, and Kling camera moves.
Ask the assistant to configure your selected model using current documentation. Adding a key alone does not
create an integration. Model inputs, formats, availability, and credit costs vary.

Prepare the proposed assets and expected cost before paid work that you have not
already authorized. Keep task IDs, reuse successful outputs, and save chosen
results inside your private project's assets. Inspect their motion, duration,
aspect ratio, and framing in the final edit.

> Use Kie.ai for moving B-roll in the approved scenes. Check my local configuration
> and current model documentation, then show me the assets you propose and expected
> credit cost. Reuse existing footage wherever it fits.

##### Other optional tools referenced by bundled skills

These are workflow options, not a claim that every example used them:

- **Narration:** HyperFrames guides describe local Kokoro TTS with extra runtime
  and model setup. ElevenLabs and HeyGen TTS are also mentioned; each needs your
  service access and a configured API or connector.
- **Website capture:** Gemini can optionally provide richer image descriptions.
  Basic capture does not require that key.
- **Other transcription:** the framework reference mentions Groq Whisper. It
  needs its own key and the same transcript normalization checks.
- **Older integration examples:** ClickUp or OpenAI access is needed only when
  your selected project actually calls those services.
- **Sound effects:** `motion-showreel` can generate an SFX kit with ElevenLabs
  sound generation (`scripts/sfx.mjs`). It uses `ELEVENLABS_API_KEY`; the key needs
  sound-effects access as well as `speech_to_text`. Your own SFX library works too.
- **Helper runtimes:** some optional scripts require Python. Playwright is
  included for relevant browser workflows; browser binaries may need installation.

A skill's mention of an MCP tool does not install that integration. Ask the
assistant to check which connectors or API clients are available first.

##### Configure only what you use

`npm run setup` creates `.env` from [`.env.example`](../.env.example) if absent.
Leave unused entries blank. Existing `.env` files are preserved, so add newly
needed entries yourself. The ElevenLabs helper loads the root `.env`; other
providers need their own client or environment loading configured by the assistant.
Keep credentials out of compositions, screenshots, and commits.

Check current provider pricing and your balance before paid calls. The student
kit does not include transcription, generation, voiceover, or assistant credits.

### `docs/SHORT-FORM.md`
#### Reels and YouTube Shorts

Use `short-form-edit` for a raw talking-head recording, reel, YouTube Short, or
short advertisement. It defaults to 1080x1920. Request a separately composed
1920x1080 version when needed; a center crop is not a second composition.

##### Start

Run `npm run new-video -- my-reel`, then ask Codex (`$short-form-edit`) or Claude
Code (`/short-form-edit`) to edit your local recording into that project. State
the audience, intended action, target duration, and any brand preferences.
The starter is landscape; the skill must set the reel's composition dimensions,
layout, and metadata to 1080x1920 before authoring. Keep all source footage and
outputs inside the new project.

1. Transcribe with ElevenLabs Scribe, your chosen alternative, or reuse verified word timestamps.
2. Review mistakes in context and establish one frame-aligned edit decision list.
3. Explore three opening directions and choose a truthful promise and payoff.
4. Plan scenes, exact captions, moving footage, and sound cues against retained words.
5. Build the composition with the HyperFrames and GSAP skills. Use a footage ledger
   to record provenance and prevent unintentional reuse of the same source scene.
6. Validate, preview, render a draft, inspect frames, and listen to the full edit.
7. Resolve timing, audio, and composition problems before exporting the final video.

Nate uses ElevenLabs Scribe for transcription and Kie.ai for generated video and
image assets. Students need their own keys and credits for those services. Whisper
is a transcription alternative, and existing footage can replace generated assets.
See [tools, accounts, and API keys](TOOLS-AND-API-KEYS.md) for setup and copyable
prompts. Honor existing authorization when proposing paid assets. The synthetic
validation example needs no paid service.

##### Validate from the repository root

```sh
npm run validate:short-form -- video-projects/my-reel
npm run validate:footage -- video-projects/my-reel
node scripts/preflight.mjs video-projects/my-reel
```

The first validator reads `assets/plan.json`, `assets/transcript.json`, and
`assets/edit-decisions.json`. The second reads the plan and, for moving footage,
`assets/footage-ledger.json`, checks hashes, and confirms referenced files exist.
Follow the [plan schema](../.claude/skills/short-form-edit/references/plan-schema.md).
Use the [reference worksheet](../.claude/skills/short-form-edit/references/reference-analysis.md)
when analyzing a supplied reference video.

Try the synthetic fixture without a recording or API key:

```sh
npm run validate:short-form -- examples/short-form
npm run validate:footage -- examples/short-form
npm test
```

The fixture contains invented words and timing data, not a rendered reel.
Validators check structure and declared timing. They do not prove a compelling
hook, factual claims, rights to footage, correct visual cropping, or audible sync.
The skill's quality gates require watching and listening to the actual output.

### `docs/STORYTELLING-WORKBOOK.md`
#### Storytelling workbook

This neutral exercise replaces private worked video projects. The complete
techniques and Python geometry helpers remain in the video-storytelling skill.

Topic: explain how a seed becomes a plant. Use three fixed regions: seed, roots,
and leaves. The camera explores the same world throughout. Empty sockets in the
opening promise three stages; each stage fills its socket, and the ending shows
the same complete world. A warm accent consistently means sunlight.

| Beat | Spoken idea | Visual | Camera | Payoff |
| --- | --- | --- | --- | --- |
| Hook | Three changes make a plant | Three empty sockets | World | Promise the completed plant |
| Seed | Water wakes the seed | Seed opens | Detail | Fill socket one |
| Roots | Roots find water | Roots extend below | Region | Fill socket two |
| Leaves | Leaves collect light | Warm light reaches leaves | Region | Fill socket three |
| Recap | The parts work together | One line connects all three | World | Resolve the opening image |

For real footage, replace these ideas with exact phrases and timestamps from
the final edited transcript. Keep labels away from the frame edge, use one
spotlight at a time, and reuse the same camera window for the same purpose.

The wall-of-slots Python helpers are reusable geometry from an earlier example.
They retain example-specific slot layouts. Adapt their labels and coordinates;
they are not an automatic storyboard generator or a required runtime dependency.

### `docs/VERIFICATION.md`
#### Release verification

##### Consolidated Herk Edit Kit, version 2

- All 14 canonical skills passed frontmatter validation, and all 94 skill resources
  match the Codex mirrors. The distribution check reports zero errors across
  406 cards and both skill trees.
- A clean `npm ci` succeeded. All 11 behavior tests passed, including new checks
  for caption drift, incorrect source mapping, scene coverage, footage reuse,
  missing ledger rows, and changed footage hashes.
- The starter passed preflight and HyperFrames lint with zero errors or warnings.
- The synthetic media smoke check passed again: silence output 3.960 seconds,
  clean output 3.673 seconds versus a 3.660-second transcript.
- All original `video-projects/` and root `assets/` files were retained unchanged.
  They were not all re-rendered. No real reel or paid generation was run for this
  migration; short-form verification covers its validators and resource package.

##### Original pipeline release evidence

The following rendering evidence comes from the pipeline release before this
merge. Its starter and editing implementation are retained.


Verified locally on Windows, September 8, 2026, using Node 24.15.0,
FFmpeg 8.1.1, and HyperFrames 0.7.109.

- Clean dependency install succeeded; npm reported zero known vulnerabilities.
- Root AGENTS.md and CLAUDE.md match. Ten skill packages and every supporting
  resource match their generated Codex mirrors.
- The kit check validates JavaScript syntax, skill frontmatter and linked resources,
  registry counts, unique IDs, declared slots, and local card dependencies.
  All 406 card files resolve. Two cards construct some slots in JavaScript;
  their source declarations are checked, not their executed DOM.
- Five behavior tests pass: silence retiming, reviewed stutter removal, empty-cut
  identity behavior, invalid cut bounds, and early/late beat timing. The CLI
  accepts explicit project paths and attribute order independent of old examples.
- `npm run test:media` generated an eight-second test pattern with a sine tone,
  rendered both editing stages, and built the EDL review HTML. The silence output
  was 3.960 seconds; the clean output was 3.673 seconds against a 3.660-second
  transcript. A/V durations differ by less than 0.04 seconds.
- The starter passed preflight and HyperFrames lint with zero errors/warnings.
  Studio loaded and played to eight seconds. Draft render produced 240 H.264
  frames at 1920x1080 and 30fps. Extracted frames were visually inspected across
  the eight-second sequence. No black interval of 0.1 seconds or longer was detected.

##### Scope and limits

This is a working toolkit, not a promise of fully automatic editorial judgment.
The library's 406 cards retain draft status; this release did not individually
render and visually approve all of them. Test each selected card with your copy.
The starter is motion graphics only, with no speech. The media smoke exercise
checks timing and stream integrity with a tone, not subjective speech-cut quality.
Paid Scribe transcription was not called during release QA. The templates require
adaptation; the glass popout needs the student's footage. HyperFrames can download
font substitutions on the first render. Cross-platform checks run in GitHub CI;
local media and rendering QA were performed on Windows.

Repeat: `npm ci`, `npm run check`, `npm test`, `npm run test:media`, then create a
new starter project and lint, preview, render, and inspect its output.

### `AGENTS.md`
#### Herk Edit Kit: workspace guide

Turn a talking-head recording into an intentional edit using local HyperFrames
rendering, transcript-driven cuts, and reusable motion graphics.

##### Runtime routing

`AGENTS.md` and `CLAUDE.md` contain the same standing guide. Keep them synchronized.
Claude Code uses `.claude/skills/`. Codex uses the generated `.agents/skills/`.
Edit canonical skills in `.claude/skills/`, then run `npm run sync:skills`.
Use `$edit-video` in Codex, `/edit-video` in Claude Code, or natural language.
Model and permission choices belong to the user; `.codex/config.toml` only adds
document loading defaults. Work locally unless the user requests subagents.

##### Start and route

Read `README.md` for installation and `docs/WORKFLOW.md` for a complete edit.
Use `edit-video` to coordinate transcription, cuts, design, and verification.
For one stage, load the matching local skill:

| Need | Skill |
| --- | --- |
| Reels, Shorts, and short advertisements | `short-form-edit` |
| Motion-design showreels and brand reels cut to music | `motion-showreel` |
| Existing May Shorts example maintenance | `short-form-video` |
| New motion-graphics video from a brief | `make-a-video` |
| Website-inspired compositions | `website-to-hyperframes` |
| Full raw-video edit | `edit-video` |
| Silence removal | `cut-silences` |
| Retakes, false starts, or stutters | `cut-mistakes` |
| Narrative arc, persistent world, and visual callbacks | `video-storytelling` |
| Overlay beats, paper takeovers, and glass cards | `hyperframes-video-beats` |
| Select or extend styles and templates | `style-library` |
| HTML compositions and media timing | `hyperframes` |
| Preview, lint, and rendering | `hyperframes-cli` |
| Timeline animation | `gsap` |
| Install HyperFrames catalog blocks | `hyperframes-registry` |

Before a creative session read `MOTION_PHILOSOPHY.md` and the project's DESIGN.md.
The philosophy's fast sizzle pacing is a style reference. Give educational speech
room to breathe. The project brief controls pacing, palette, and typography.
Framework skill contracts override historical code recipes in the style guide.

##### Workspace

Create a project with `npm run new-video -- my-video`. Keep source media, EDLs,
transcripts, compositions, and renders together under `video-projects/<slug>/`.
Run HyperFrames from that project's directory. The root `scripts/` utilities
accept paths from the working directory. `style-library/registry.json` indexes
cards; each style has a DESIGN.md, CSS tokens, and named text slots.
See `style-templates/README.md` for whole-scene templates.

Preserve raw files. Use a new output filename for each editing stage. Archive
obsolete work. Video projects, personal footage, transcripts, credentials, and
renders are gitignored. The 12 already-published projects are retained as teaching examples; new private
projects stay ignored. Do not treat existing public examples as permission to add
new personal footage. Never print secrets or copy private media into library examples.

##### Editing and timing

Before choosing a transcription, asset-generation, or voiceover service, read
`docs/TOOLS-AND-API-KEYS.md` and check the user's provider choice and local setup.
ElevenLabs Scribe is Nate's default; honor requests for OpenAI Whisper, local
Whisper, or another provider. Normalize verified word timestamps for the cutting
tools. The included transcription script is ElevenLabs-only. Kie.ai is optional
and needs a configured integration and credits. Reuse existing transcripts and
assets; make any unapproved uploads or paid calls concrete before asking.

Cut silences first; use its edited video AND retimed transcript for cut-mistakes.
Review each mistake in context. Intentional repetition is not a mistake. Record
the reviewed decisions before applying them. If no cuts are needed, preserve the
input or use an empty cuts list. Never mix original timestamps with edited footage.

Load the relevant skills before changing HTML. Root compositions use a visible
div with id, data-composition-id, data-start, duration, width, and height. Timed
elements carry data-start, data-duration, and data-track-index; same-track clips
must not overlap. Visible timed divs use class="clip"; videos do not.
Mute videos and use sibling audio for the mix. Animate a non-timed video wrapper.
Register one synchronous paused GSAP timeline per composition in window.__timelines
using its exact composition ID. Keep finite timelines and explicit durations.
HyperFrames owns media playback. Use deterministic animation and local assets.

##### Verification and approvals

Run `node scripts/preflight.mjs <project>` and HyperFrames lint. For anchored
sub-compositions, run `node scripts/validate-beat-sync.mjs <project>`; each beat
needs data-anchor with an exact transcript phrase. Enter between 0.2 seconds after
and 1.8 seconds before that word. Inline timelines require manual timing review.

Review Studio before draft rendering. Review the encoded draft, extract and
inspect hero frames and transition boundaries, and listen to the audio joins.
Check cropped faces, overflow, black flashes, readable labels, clipping, and A/V
sync. Resolve problems before the final render. Save evidence in VERIFY.md.
Use a Range-capable preview server for MP4 scrubbing (for example `npx serve`).

Honor approvals already provided. When review approval is missing, prepare the
concrete preview or cut proposal first. Never claim a lint result proves visual
quality. Only publish or upload a finished video when the user authorizes it.
Automated browser checks must be headless, with Pointer Lock and cursor capture
disabled; synthetic input must remain inside the virtual browser.

For short-form edits, read `docs/SHORT-FORM.md` and `docs/EDITING-PLAYBOOK.md`
(Nate's measured house style and lessons), and use the plan and footage
validators. Structural checks supplement rendered video and audio review.

## Appendix D — Sub-skill references

### `.claude/skills/make-a-video/references/build-checklist.md`
#### Build Checklist — Preflight + Pre-Delivery

Used by `/make-a-video` Gates 7 and 8. Run before any render and before telling the user "it's done."

---

##### Preflight — structural (before PREVIEW GATE 1)

- [ ] Root `<div>` in `index.html` has `id`, `data-composition-id`, `data-start="0"`, `data-width`, `data-height`
- [ ] Every sub-composition `.html` has a root `<div>` with `data-composition-id`, `data-start`, `data-duration`
- [ ] Every timed visible element has `class="clip"`, `data-start`, `data-duration`, `data-track-index`
- [ ] NO `class="clip"` on `<video>` tags
- [ ] `<video>` elements are `muted`; audio lives in sibling `<audio>` elements
- [ ] Same-track clips never overlap (different `data-track-index` for overlapping elements)
- [ ] Every GSAP timeline ends with `tl.to({}, { duration: SLOT_DURATION }, 0)`
- [ ] Every timeline registered on `window.__timelines['<id>']` with key matching `data-composition-id` exactly
- [ ] Captions are body-level siblings in `index.html` (not inside sub-compositions), each with `data-track-index ≥ 20`
- [ ] No `Math.random()`, no `Date.now()`, no render-time `fetch()`
- [ ] Catalog block CSS is scoped under `[data-composition-id="..."]` (no leaked `html, body { ... }`)
- [ ] `npx hyperframes lint` — all errors fixed, warnings triaged

---

##### Preflight — aesthetic

- [ ] Palette on-brief — no rogue colors, ≤5 symbolic hues
- [ ] Typography on-brief — only the fonts declared in `assets/style-profile.md`
- [ ] Grid / vignette / grain texture present on every scene (or on the full-composition background)
- [ ] Ambient background composition on `data-track-index="0"` for full duration
- [ ] Every scene transition is a *motion* transition (whip · morph · blur · recolor), not a hard fade
- [ ] Outro holds 4–6 seconds
- [ ] At least one visual callback (element returns later)
- [ ] Scene lengths follow the brief's pacing tier (kinetic 1–2s · balanced 2–3s · relaxed 3–5s)

---

##### PREVIEW GATE 1 — Studio

- [ ] `npx hyperframes preview` running (background)
- [ ] User given `http://localhost:3002`
- [ ] If the project has shader blocks, user also given individual composition URLs (`http://localhost:3002/?comp=<id>`)
- [ ] Hot-reload edits show up correctly
- [ ] **Explicit "looks good, render a draft" captured** — silence is not approval

---

##### Draft render

- [ ] `npx hyperframes render --quality draft --output renders/<slug>-draft.mp4` completed
- [ ] No render errors or warnings
- [ ] Output file exists and plays in a standard video player

---

##### Visual verification (NON-NEGOTIABLE)

- [ ] `mkdir -p renders/frames`
- [ ] Frame extracted at each beat hero moment:
      ```bash
      ffmpeg -y -ss <t> -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 renders/frames/t<t>.png
      ```
- [ ] Frame extracted at each transition moment (the mid-streak / mid-morph timestamp)
- [ ] **Every PNG opened via the `Read` tool** — not just listed by filename
- [ ] For each frame confirmed:
  - [ ] No cropped faces
  - [ ] Face-mode correct per scene (full-screen vs. corner as storyboarded)
  - [ ] Text readable, on-palette, not overflowing
  - [ ] Transition lands on the intended word / beat
  - [ ] No blank frames, no black-frame flashes
- [ ] Any regression → fixed → re-rendered → re-verified

---

##### PREVIEW GATE 2 — Rendered MP4

- [ ] `npx serve renders -p 8080 -n` running (NOT Python's `http.server` — no Range support breaks scrubbing)
- [ ] User given `http://localhost:8080/<slug>-draft.mp4`
- [ ] Playback scrubs cleanly end-to-end
- [ ] Audio syncs with visuals (voiceover · SFX · music bed)
- [ ] **Explicit sign-off captured**

---

##### Final render

- [ ] `npx hyperframes render --quality standard --output renders/<slug>-final.mp4`
- [ ] File exists, size reasonable for duration (roughly 3–10 MB per 10 seconds at 1080p)
- [ ] Final file plays cleanly in a standard player
- [ ] Output path reported to the user

---

##### After delivery

- [ ] Update `BRIEF.md` with a `## Delivery` section: final render path, render command used, any post-delivery notes
- [ ] Offer one round of revisions — the user almost always has one
- [ ] If the user wants a different format (e.g. 1:1 crop from 16:9), plan that as a new pass through Gates 1–8 with the original `BRIEF.md` as the starting point

---

##### Common fail-modes and how they look

| Symptom in the render | Likely cause | Fix |
|---|---|---|
| Black frame flash at end of a scene | Timeline shorter than `data-duration` | Add / extend the anchor tween in that sub-composition |
| `<video>` freezes on a still frame | Animating `width`/`height` on the video element directly | Wrap in a `<div>` and animate the wrapper |
| Text clipped / cropped | Scoped style missing `overflow: visible` on the container | Add it |
| Catalog block's background covers the whole stage | Block's `html, body { ... }` rule leaked | Scope it under `[data-composition-id="..."]` |
| Transition lands mid-word | `data-start` on the incoming scene is off | Align to the transition's peak frame (usually midway through its duration) |
| Grain flickers / looks random | Using `Math.random()` in the grain script | Replace with a seeded hash |

### `.claude/skills/make-a-video/references/catalog-intent-map.md`
#### Catalog Intent Map — "User Says X → Install Y"

Used by `/make-a-video` Gate 5. Translates beginner language into `npx hyperframes add <block>` commands.

##### The map

| User says… | Install |
|---|---|
| "title card / opener / kinetic type" | hand-build — registry has no kinetic-type block; see MOTION_PHILOSOPHY §3.3 |
| "logo reveal / outro / final card" | `logo-outro` |
| "film grain / texture on everything" | `grain-overlay` (component) |
| "shimmer on my logo / light glint" | `shimmer-sweep` (component) |
| "smooth transition / soft fade" | `transitions-blur` · `transitions-dissolve` |
| "energetic transition / fast cut / punchy" | `whip-pan` · `cinematic-zoom` · `glitch` |
| "cinematic transition / premium morph" | `cross-warp-morph` · `swirl-vortex` |
| "act break / dramatic flash" | `flash-through-white` · `light-leak` |
| "zoom-through text" | `cinematic-zoom` |
| "color change on same scene" | `chromatic-radial-split` — or hand-build the CSS-variable recolor in MOTION_PHILOSOPHY §3.5 |
| "phone showcase / mobile demo" | `app-showcase` |
| "3D UI reveal / perspective product" | `ui-3d-reveal` |
| "macOS notification popup" | `macos-notification` |
| "chart / data viz / bar graph" | `data-chart` |
| "flowchart / decision tree / node diagram" | `flowchart` |
| "grid tile transition / pixelate wipe" | `grid-pixelate-wipe` (component) · `transitions-grid` |
| "TikTok follow overlay" | `tiktok-follow` |
| "Instagram follow overlay" | `instagram-follow` |
| "YouTube subscribe lower-third" | `yt-lower-third` |
| "Twitter/X post card" | `x-post` |
| "Reddit post card" | `reddit-post` |
| "Spotify now-playing card" | `spotify-card` |
| "thermal / heat distortion" | `thermal-distortion` |
| "ripple / water / concentric waves" | `ripple-waves` |
| "iris / circular reveal" | `sdf-iris` |
| "domain warp / noise dissolve" | `domain-warp-dissolve` |
| "ridged burn / fire effect" | `ridged-burn` |
| "gravitational lens / warp" | `gravitational-lens` |

For the full catalog browse live with `npx hyperframes catalog --type block` and `npx hyperframes catalog --type component`.

---

##### Install + wire workflow

1. **From inside the project folder:**
   ```bash
   npx hyperframes add <block-name>
   ```
2. **Block installs to** `<project>/compositions/<block-name>.html` (or `<project>/compositions/components/<name>.html` for components).
3. **Immediately scope its CSS.** Catalog blocks ship with top-level `html, body { ... }` rules. When loaded as a sub-composition via `data-composition-src`, those rules bleed into the parent document.
   - Open the installed file
   - Wrap the `html, body { ... }` rule under `[data-composition-id="<block-id>"]`
   - Do the same for any other un-scoped global rule
4. **Wire into `index.html`:**
   ```html
   <template
     data-composition-src="compositions/<block-name>.html"
     data-start="..."
     data-duration="..."
     data-track-index="..."></template>
   ```
5. **Apply the user's palette.** Most blocks accept CSS variables at the top of the file — find them and override with the user's hex codes from `style-profile.md`.

---

##### Components vs. blocks

- **Blocks** are standalone sub-compositions — their own timeline, their own root `<div>`. Reference via `data-composition-src`. Examples: `logo-outro`, `app-showcase`, `tiktok-follow`.
- **Components** are snippets you merge *into* an existing composition's HTML. Paste the component's DOM + CSS + a slice of its script into the host composition. Examples: `grain-overlay`, `shimmer-sweep`, `grid-pixelate-wipe`.

The installer handles the distinction automatically; you mainly need to know which to reach for when planning the storyboard.

---

##### When NOT to install

Catalog blocks buy production velocity. When you have time, hand-building hero moments (kinetic-type openers, logo reveals) usually looks better than installing a block — the MOTION_PHILOSOPHY reference spot installs **zero** blocks.

**Rule of thumb for this skill:**
- Transitions and social/UI overlays → install
- Hero opener and final CTA → hand-build unless the user is on a tight deadline
- Film grain and shimmer → always install (they're components, meant to be dropped in)

---

##### Gotchas

- After installing a block, always run `npx hyperframes lint` — the installer can create `data-composition-id` collisions if you already have one with the same name.
- Blocks ship with their own fonts. If the user specified custom fonts in the style profile, override the block's font family with a scoped rule.
- Some blocks (notably `logo-outro`) expect specific asset filenames — read the installed file and rename / re-path to the user's logo.
- Shader blocks (the 14 shader transitions) use WebGL. In the Studio's software WebGL fallback, they can stall the master composition preview. Gate 7 routes users to individual composition URLs to work around this.

### `.claude/skills/make-a-video/references/composition-scaffold.md`
#### Composition Scaffold — Scoped Styles + IIFE GSAP Pattern

Used by `/make-a-video` Gate 6. Every sub-composition follows this pattern.

##### Why this pattern

- **Scoped styles** (`[data-composition-id="..."] { ... }`) prevent CSS bleed between compositions and from catalog blocks.
- **IIFE** keeps GSAP variables out of the global namespace — multiple sub-compositions won't collide.
- **Anchor tween** (`tl.to({}, { duration: SLOT_DURATION }, 0)`) guarantees `timeline.duration() ≥ data-duration`, preventing the black-frame flash HyperFrames emits when a timeline ends short. MOTION_PHILOSOPHY Law 11.

---

##### Boilerplate — one sub-composition file

```html
<div data-composition-id="scene-01-hook" data-start="0" data-duration="1.5">
  <!-- Scoped styles — every selector under the [data-composition-id] -->
  <style>
    [data-composition-id="scene-01-hook"] {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }
    [data-composition-id="scene-01-hook"] .word {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 96px;
      background: linear-gradient(180deg, #fff 0%, #999 100%);
      -webkit-background-clip: text;
      color: transparent;
    }
  </style>

  <!-- DOM — timed elements get class="clip" + data-start/duration/track -->
  <span class="word w1 clip" data-start="0.0" data-duration="0.8" data-track-index="2">Why</span>
  <span class="word w2 clip" data-start="0.2" data-duration="0.8" data-track-index="2">is</span>
  <span class="word w3 clip" data-start="0.4" data-duration="0.8" data-track-index="2">this</span>
  <span class="word w4 clip" data-start="0.6" data-duration="0.8" data-track-index="2">still</span>
  <span class="word w5 clip" data-start="0.8" data-duration="0.7" data-track-index="2">hard?</span>

  <!-- IIFE + anchor tween -->
  <script>
    (function(){
      const SLOT_DURATION = 1.5;
      const tl = gsap.timeline({ paused: true });

      // Per-word reveal stagger
      tl.from('[data-composition-id="scene-01-hook"] .w1',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0);
      tl.from('[data-composition-id="scene-01-hook"] .w2',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0.2);
      tl.from('[data-composition-id="scene-01-hook"] .w3',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0.4);
      tl.from('[data-composition-id="scene-01-hook"] .w4',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0.6);
      tl.fromTo('[data-composition-id="scene-01-hook"] .w5',
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, 0.8);
      // Dolly-through on the hero word
      tl.to('[data-composition-id="scene-01-hook"] .w5',
        { scale: 8, opacity: 0, duration: 0.4, ease: 'power2.in' }, 1.1);

      // ANCHOR — keeps timeline.duration() >= SLOT_DURATION. Non-negotiable.
      tl.to({}, { duration: SLOT_DURATION }, 0);

      // Register — key MUST exactly match data-composition-id
      window.__timelines['scene-01-hook'] = tl;
    })();
  </script>
</div>
```

---

##### Hard rules the scaffold enforces

1. **Root composition `<div>` in `index.html`** has `id`, `data-composition-id`, `data-start="0"`, `data-width`, `data-height`. Sub-composition roots have `data-composition-id`, `data-start`, `data-duration` — no width/height.
2. **Every timed visible element** has `class="clip"`, `data-start`, `data-duration`, `data-track-index`. **Exceptions:** `<video>` and `<audio>` do NOT get `class="clip"` — it breaks them.
3. **CSS is scoped.** No top-level rules inside a sub-composition file. Every selector lives under `[data-composition-id="..."]`.
4. **Timeline registered** on `window.__timelines['<id>']` with key exactly matching `data-composition-id`.
5. **Anchor tween** at the end of every timeline: `tl.to({}, { duration: SLOT_DURATION }, 0)`.
6. **Never** `masterTL.add(child)` — HyperFrames auto-links sub-composition timelines to the parent.
7. **Never** call `.play()` / `.pause()` / set `.currentTime` on media. The framework owns playback.
8. **Never animate** `width` · `height` · `top` · `left` directly on a `<video>` — browsers freeze frames. Wrap in a `<div>` and animate the wrapper.
9. **Same-track clips never overlap** (same `data-track-index`). Use separate track indices for overlapping elements.

---

##### Ambient background pattern

One persistent composition, bottom layer, full video duration.

In `index.html`:
```html
<template
  data-composition-src="compositions/ambient-bg.html"
  data-start="0"
  data-duration="<total-seconds>"
  data-track-index="0"></template>
```

`compositions/ambient-bg.html` is its own sub-composition: grid + vignette + grain + slow drifts (breathing vignette, parallax grid). Uses the same scaffold pattern — scoped styles, IIFE, anchor tween.

---

##### Caption pattern (body-level siblings)

Captions go OUTSIDE the master composition `<div>` in `index.html`, each with `data-track-index ≥ 20`:

```html
<div class="cap clip"
     data-start="0.5" data-duration="1.8" data-track-index="30">
  Why is this still so hard?
</div>
<div class="cap clip"
     data-start="2.4" data-duration="2.2" data-track-index="31">
  Ship faster with ACME.
</div>

<style>
  .cap {
    position: absolute;
    bottom: 72px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 22px;
    border-radius: 14px;
    background: rgba(10, 8, 5, 0.55);
    backdrop-filter: blur(8px);
    font: 500 28px/1.3 Inter, sans-serif;
    color: #fff;
  }
</style>
```

Central control, zero coupling to scene timelines. MOTION_PHILOSOPHY §3.13.

---

##### Time-reference aliasing

A clip's `data-start` can reference another clip by id:

```html
<span id="intro" data-start="0" data-duration="2">...</span>
<span data-start="intro + 1.5" data-duration="2">...</span>
<span data-start="intro - 0.3" data-duration="2">...</span>
```

Useful for small offsets around a named beat without hard-coding seconds.

---

##### Diagnostic — every timeline fills its slot

Before shipping, open Studio devtools and run:

```js
const p = document.querySelector('hyperframes-player');
const iw = p.shadowRoot.querySelector('iframe').contentWindow;
Object.fromEntries(Object.entries(iw.__timelines).map(([k, v]) =>
  [k, +v.duration().toFixed(4)]));
```

Compare every value against the corresponding `data-duration`. Any gap where `timeline.duration() < data-duration` is a black-frame risk. Fix by adjusting the anchor tween's duration.

---

##### Time-snapping

Tween end-times should snap to multiples of `1 / fps`:
- 30fps: 0.0333, 0.0667, 0.1, 0.1333, 0.1667, 0.2, …
- 60fps: 0.0167, 0.0333, 0.05, 0.0667, …

Steep-tail easings (`expo.in`, `power4.in`) visibly alias at sub-frame boundaries. MOTION_PHILOSOPHY §4.

---

##### Determinism

Never use `Math.random()` or `Date.now()` inside render logic. Use seeded hashes:

```js
// Deterministic pseudo-random per index
const noise = i => 80 + 220 * Math.abs(Math.sin(i * 0.7 + 0.3) * Math.cos(i * 1.3 + 0.7));
```

Renders must be identical frame-to-frame across runs.

### `.claude/skills/make-a-video/references/interview-questions.md`
#### Interview Questions — Full Bank

Used by `/make-a-video` Gates 1–3. Ask one at a time via `AskUserQuestion`, multiple-choice where possible.

##### Before asking anything — inventory first

Run these to see what already exists so you don't ask for supplied assets:

```bash
ls "<workspace-root>/assets" 2>/dev/null
ls "<project-folder>/assets" 2>/dev/null
```

Reference anything you find by path in the eventual `BRIEF.md`.

---

##### Gate 1 · Intent & format

**Q1. What's this video for?**
- Promo / marketing video
- Social ad (TikTok · Reels · Shorts · X)
- Launch teaser
- Product demo
- Tutorial
- Explainer
- Intro / outro card
- Other (describe)

**Q2. Who's the audience?** (open-ended)
Probe: industry · expertise level · platform they'll watch on · what should they feel

**Q3. Target duration?**
- Short — 10–20s
- Promo — 20–45s
- Explainer — 45–90s
- Lesson — 1.5–3 min
- Custom — ask for a number

**Q4. Aspect ratio?**
- 16:9 landscape — 1920×1080
- 9:16 vertical — 1080×1920
- 1:1 square — 1080×1080

**Q5. Frame rate?**
- 30 fps (default, good for everything)
- 60 fps (crisp UI, product demos, game footage)
- 24 fps (cinematic)

**Q6. Platform / delivery constraints?**
- Where will it play? (site hero · TikTok · LinkedIn · YouTube · internal deck · other)
- File-size ceiling?
- Deadline?

---

##### Gate 2 · Script & voice

**Q7. Script source?**
- Paste the full script now
- I have an outline — draft the full script for me
- I'll record it myself (need path to voiceover or face-cam file)
- Generate TTS narration from text
- No narration — visuals + music only

**Q8. If TTS:**
- Voice choice (offer from `npx hyperframes tts --help`). Common: `am_adam`, `am_michael` (male US) · `af_bella`, `bf_emma` (female US/UK)
- Speaking pace (normal · slightly faster · slightly slower)

**Q9. If face-cam or recorded voiceover:**
- File path
- Full-screen or corner? (bottom-right · bottom-left · top-right · top-left)
- Need transcription? If yes: `npx hyperframes transcribe <file> --model small.en --json`

**Q10. Captions?**
- Off
- On — hype (bold, punchy, colored accent words)
- On — corporate (clean, single-line, no emphasis)
- On — karaoke (per-word sync, reveal as spoken)
- On — minimal (single sub-line, low contrast)

---

##### Gate 3 · Style intake

**Q11. Style guide or brand document?**
- Yes — paste or give path (look for hex codes, fonts, logo rules, spacing rules)
- No

**Q12. Color palette?**
- Paste hex codes. Ask for at least: background · text/primary · accent (the "emotion" color). Optional: surface · border · warn.
- None — use MOTION_PHILOSOPHY defaults (see `style-intake.md`)

**Q13. Fonts?**
- Google Fonts names (e.g. Inter · Montserrat · JetBrains Mono · Bebas Neue · Space Grotesk)
- Font file paths
- None — use Inter + JetBrains Mono defaults

**Q14. Logo file?**
- Path to file
- None — text wordmark instead? Ask for the text and weight/style

**Q15. Reference videos?**
- URLs or file paths — "the vibe I want"
- None

**Q16. Other assets?**
- Screenshots (paths)
- Product photos (paths)
- B-roll clips (paths)
- Music tracks (paths)
- Any SVGs / icons / illustrations (paths)

**Q17. MOTION_PHILOSOPHY aesthetic or different feel?**
- MOTION_PHILOSOPHY: black canvas · chrome-gradient type · perspective grid · whip-pan transitions · 4–6s outro hold
- Different — describe or give references

**Q18. Pacing?**
- Kinetic — 1–2s scenes, energetic (reference-quality motion graphics)
- Balanced — 2–3s scenes (most promos)
- Relaxed — 3–5s scenes (explainers · lessons · luxury feel)

**Q19. Music?**
- None (silence)
- Ambient pad — `data-volume="0.15"` (premium, barely there)
- Music bed — `data-volume="0.4"` (standard promo layer)
- Full music — `data-volume="0.8"` (music-driven edit)
- File path if they have one

**Q20. Outro / call-to-action text?**
- CTA line (e.g. "Get started at example.com")
- Hold duration (4–6s recommended — the longest shot in the whole video)

---

##### Sequencing rules

- **One question per `AskUserQuestion` call.** Don't batch. The user can't focus on three questions at once.
- **Multiple-choice over open-ended** when the answer has discrete valid forms.
- **Follow-ups happen inline.** If Q7 = "record it myself," the next question is Q9 (not Q8).
- **Capture every answer to the brief as you go** — short phrases, not full sentences. The `BRIEF.md` at Gate 4 is a synthesis, not a transcript.
- **If an answer is surprising** (e.g. "I want a 4-hour TikTok ad"), confirm before proceeding. Don't assume.
- **Never ask for what's already known.** If the user mentioned a file path earlier or it's sitting in `assets/`, skip that question and just confirm the interpretation.

### `.claude/skills/make-a-video/references/storyboard-template.md`
#### Storyboard Template — Beat-by-Beat

Used by `/make-a-video` Gate 5. Generates `<project-folder>/STORYBOARD.md` — the build blueprint.

##### Header

```markdown
# STORYBOARD — <project-slug>

**Total duration:** <duration>s · <fps>fps · <width>×<height>
**Style profile:** see `assets/style-profile.md`
**Script / brief:** see `BRIEF.md`

## Act structure

- **Act 1 (0 → ≈20%):** hook — grab attention in the first 1–2 seconds
- **Act 2 (≈20% → ≈75%):** body — one idea per beat, 1–2 second scenes
- **Act 3 (≈75% → end):** payoff + outro with 4–6 second hold

## Timing table

| # | Start | Dur | Scene file | Concept |
|---|-------|-----|------------|---------|
| 0 | 0.0 | <total> | `ambient-bg.html` | Persistent background |
| 1 | 0.0 | 1.5 | `01-opener.html` | Hook |
| 2 | 1.5 | 1.2 | `02-...` | ... |
| N | ... | 4.5 | `N-cta-outro.html` | CTA hold |
```

---

##### Per-beat format (one block per beat)

```markdown
## Beat N — <TITLE> (<start>s–<end>s, <duration>s) — <one-sentence concept>

**Visual elements:**
- <element 1> — position, size, animation, timing
- <element 2> — ...

**Motion language:** <1–2 sentences: what kind of motion carries this beat?>

**Eases used:**
- Entry: `<ease>` (e.g. `power3.out`)
- Hold: `<ease>` (or `none` for linear)
- Exit: `<ease>`

**Exit transition:** <how this beat hands off — whip streak · morph · blur crossfade · color recolor · hard cut aligned to streak peak>

**Audio:** <VO line if any · SFX · music layer notes>
```

---

##### Worked example — 15-second product promo

```markdown
# STORYBOARD — acme-promo-15s

**Total duration:** 15s · 30fps · 1920×1080
**Style profile:** see `assets/style-profile.md`

## Act structure

- Act 1 (0–3s): hook — "Why is this still so hard?"
- Act 2 (3–11s): body — three benefits in kinetic type + product shot
- Act 3 (11–15s): CTA — logo + URL, 4s hold

## Timing table

| # | Start | Dur | Scene file | Concept |
|---|-------|-----|------------|---------|
| 0 | 0.0 | 15.0 | `ambient-bg.html` | Perspective-grid background |
| 1 | 0.0 | 1.5 | `01-hook.html` | "Why is this still so hard?" kinetic type |
| 2 | 1.4 | 0.4 | `02-whip.html` | Light-streak whip transition |
| 3 | 1.5 | 2.0 | `03-benefit-fast.html` | "Fast" + comet streak |
| 4 | 3.5 | 2.0 | `04-benefit-simple.html` | "Simple" + object morph |
| 5 | 5.5 | 2.0 | `05-benefit-reliable.html` | "Reliable" + flowchart |
| 6 | 7.5 | 2.5 | `06-product-shot.html` | App showcase block |
| 7 | 10.0 | 1.0 | `07-logo-crystallize.html` | Logo crystallizes |
| 8 | 11.0 | 4.0 | `08-cta-outro.html` | Wordmark + URL hold |

## Beat 1 — Hook (0.0–1.5s, 1.5s) — "Why is this still so hard?"

**Visual elements:**
- Perspective grid floor (ambient, already on)
- Five words, chrome gradient, Inter 96px, centered
- Hero word "hard?" scales 1× → 8× camera-dolly-through at 1.0–1.5s

**Motion language:** kinetic typography, per-word stagger, final word dolly-through

**Eases used:**
- Entry per word: `power3.out`, duration 0.5s, stagger 0.08s
- Each word fade-out: `power2.in`, duration 0.4s, overlaps next by 0.15s
- "Hard?" dolly: `power2.in`, duration 1.0s, scale 1 → 8, opacity 1 → 0

**Exit transition:** light-streak whip (Beat 2) fires at t=1.4s, crosses the grid, hard cut on the streak peak at t=1.6s

**Audio:** VO "Why is this still so hard?" (TTS `am_adam`) · ambient pad `data-volume="0.15"`

## Beat 2 — Whip (1.4–1.8s, 0.4s) — Motion-blur transition

**Visual elements:**
- Single horizontal streak: `linear-gradient(90deg, transparent, #fff, transparent)`, 40% width, 8px tall, blur 6px
- Hides the cut between Beat 1 and Beat 3

**Motion language:** speed line, no content

**Eases used:**
- `xPercent: -100` → `xPercent: 250`, duration 0.4s, `power3.in`

**Exit transition:** N/A (is itself the transition)

**Audio:** whoosh SFX at 0.2 volume

## Beat 3 — Fast (1.5–3.5s, 2.0s) — "Fast" benefit

... (and so on)
```

---

##### Rules the storyboard enforces

1. **Every beat ≤ 2 seconds** unless it's the hero moment or outro.
2. **Every transition has a name and a duration** — no "and then we cut to the next scene" hand-waving.
3. **Every beat names its eases** (at least entry + exit). Don't let every beat default to `power2.out`.
4. **The outro holds 4–6 seconds.** No exceptions.
5. **At least one visual callback** appears in Act 2 or Act 3 — an element that echoes something set up earlier (MOTION_PHILOSOPHY §0 Law 6).
6. **Rule of threes** where possible — 3 benefits · 3 product surfaces · 3 icons. The reference Infinite spot uses it everywhere.
7. **Ambient background composition** always present on `data-track-index="0"` for the full duration.

---

##### After writing

Show the storyboard + timing table to the user. They will often:
- Cut a beat ("I don't need 'Reliable,' combine it with 'Simple'")
- Shift an emphasis ("the hook should be longer so it lands")
- Ask for different transition feel ("this should feel more cinematic, less energetic")

Iterate. Don't build until they approve.

### `.claude/skills/make-a-video/references/style-intake.md`
#### Style Intake — How to Interview Without Imposing a Brand

Used by `/make-a-video` Gate 3. The goal: extract the user's visual identity (or fall back cleanly when they don't have one) without ever picking a brand *for* them.

##### The decision tree

```
Does the user have a style guide, brand doc, or explicit palette?
├── Yes → Extract values → Use exactly what they supplied
├── Partial (some answers, not all) → Fill gaps with MOTION_PHILOSOPHY defaults, flag the gaps in BRIEF.md
└── No → Offer MOTION_PHILOSOPHY defaults AND ask for reference videos as a fallback
```

##### MOTION_PHILOSOPHY defaults (the fallback, only when user declines to supply a style)

###### Palette

| Role | Value |
|---|---|
| Background | `#000` (pure black) or `#0a0a0a` (near-black) |
| Chrome text gradient | `linear-gradient(180deg, #ffffff 0%, #999999 60%, #cccccc 100%)` with `-webkit-background-clip: text; color: transparent;` |
| Grid lines | `rgba(255, 255, 255, 0.05)` |
| Vignette | `radial-gradient(ellipse at center, transparent 30%, black 100%)` |
| Accent | ONE hex picked for symbolic meaning — ask the user "what's the ONE emotion of this video?" and map it |

Keep accent discipline tight. MOTION_PHILOSOPHY §0 Law 7: ≤5 symbolic colors across the whole video, each with a named meaning.

###### Fonts

- **Headlines / kinetic type:** Inter (Google Fonts), weight 700
- **Mono (code, numbers, terminal):** JetBrains Mono, weight 500
- Load via `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@500&display=swap">`

Variations allowed: Space Grotesk or Geist for a tech feel, Instrument Serif for editorial, Bebas Neue for impact. **One display family plus one mono.** Two sans-serifs in the same piece almost always looks wrong.

###### Textures (always on, even with custom palette)

- Perspective grid floor (low-opacity lines)
- Vignette layer on top
- Film grain: `npx hyperframes add grain-overlay` installed as a component
- Crosshair `+` markers at grid intersections (optional but recommended)

---

##### When the user supplies hex codes

1. **Ask for at least three roles:**
   - Background
   - Primary text / main accent
   - Secondary accent (the "emotion" color)
   - (Optional: surface · border · warn)

2. **Enforce the ≤5 symbolic colors rule.** If they give you 8 colors, ask which three carry narrative work and which five are decorative — drop the decorative.

3. **Assign meaning to each color.** One sentence per color, e.g. "cyan = action, orange = warning, white = brand voice." Save the mapping in the project's `style-profile.md`.

4. **Check contrast.** If accent hex on background hex is below 4.5:1 for text-sized elements, flag it to the user. Text on a dark background often needs a `text-shadow` halo to read well — MOTION_PHILOSOPHY §2.2 covers the recipe.

##### When the user supplies fonts

1. Resolve Google Fonts names → `<link>` tags. If a font is custom, capture the file path and plan a `@font-face` declaration.
2. Confirm weights: default to Regular (400) + Bold (700) + one display weight if specified.
3. Pair rule: one display / headline family + one mono. Avoid stacking two sans-serifs.

##### When the user supplies a logo

1. Ask for: file path · clearspace preference · any known glow/effect spec
2. In `style-profile.md` record: path · dimensions · CSS filter recipe (e.g. `drop-shadow(0 0 40px rgba(accent, 0.6))` if they want a glow)
3. Never recolor or stretch the logo in compositions.

##### When the user supplies reference videos

1. Watch / read the references. If URLs, fetch them.
2. Extract:
   - Dominant palette (2–4 hex codes)
   - Type feel (serif · sans · mono · display)
   - Pacing (kinetic · balanced · relaxed)
   - Primary motion vocabulary (whip-pans · morphs · fades · glitches · 3D reveals)
3. Propose a derived palette + font pair + pacing. **Confirm with the user** before building.

---

##### `<project-folder>/assets/style-profile.md` — what it contains

```markdown
# Style Profile — <project-slug>

## Palette
- bg: #...              (role: background)
- text: #...            (role: primary text)
- accent: #...          (role: <named meaning>)
- warn: #...            (optional, role: ...)
- surface: #...         (optional)

## Fonts
- Display: <Family Name> (weight(s), loaded from Google Fonts or file path)
- Mono: <Family Name> (weight, loaded from ...)

## Logo
- Path: assets/<logo-file>
- Clearspace: <e.g. half a logo-height on all sides>
- CSS filter (if any): filter: drop-shadow(0 0 40px rgba(..., 0.6));

## Source of profile
- [ ] Provided by user (style guide / brand doc)
- [ ] Derived from reference videos (confirmed by user)
- [ ] MOTION_PHILOSOPHY defaults (user declined to supply)

## Meanings (≤5 colors)
- <color> = <meaning>
- ...
```

Every composition in Gate 6 pulls from this file. It's the project's single source of truth.

---

##### The discipline that applies regardless of palette

Even when the user chooses a fully custom palette, keep these MOTION_PHILOSOPHY principles. They're aesthetic-agnostic:

- 1–2 second scenes in the body of the video
- One idea per beat
- ≤5 symbolic colors, each with a named meaning
- Grid / vignette / grain texture on every scene
- Motion-blur transitions (whip-pans, morphs) — never hard cuts
- Hold the outro 4–6 seconds
- At least one visual callback (element that returns later)

Brand changes. Discipline doesn't.

### `.claude/skills/motion-showreel/references/chapter-library.md`
#### Chapter library

Each entry covers the technique, how the reference used it, how to build it seek-safe in HyperFrames (GSAP on one paused timeline), and brand swaps. Pick 5-7 and chain them so each one's out-transform is the next one's in-transform.

##### Physics: squash and stretch
- **Reference:** a red dot falls onto a tick ruler and bounces three times, with a ground ellipse and a POS/SCL/VEL readout on a leader line.
- **Build:** hand-key the bounce from the beat sheet (a contact on each beat). Fall uses `power2.in`, rise uses `power2.out`. On contact, set `scaleX 1.35 / scaleY 0.7` for 2-3 frames, then `elastic.out(1, 0.5)` back. While falling fast, stretch to `scaleY 1.3`. Compute the readout text in an `onUpdate` from the dot's current `y` and velocity (the difference from the previous frame), formatted to one decimal.
- **Out-transform:** the dot accelerates sideways into a laser line (`scaleX` to 200, `height` 4px, glow), which blooms to a full-frame flash (a white layer at opacity 1 for 2 frames), then becomes the paper of the next chapter.
- **Swaps:** a video scrubber dot on a progress bar (YouTube), a cursor dot (a SaaS app), a drop of liquid (a drink brand), a pin (maps).

##### Kinetic type
- **Reference:** letters drop in out of order with overshoot and motion blur. A red selection box with W/H/SX numbers and a cursor drags the word bigger. A red italic serif aside plays against heavy grotesk caps. The key word repeats into outline wallpaper, which turns diagonal with red bands, then the frame inverts.
- **Build:** split words into `<span>`s. Stagger `y: -120 -> 0` with `back.out(2)`, 1-frame offsets in a shuffled order. Fake motion blur by tweening `filter: blur(6px) -> 0` together with a `scaleY` stretch. For the selection box, an absolutely positioned div with 8 handle squares follows the word's box (read the width once after `document.fonts.ready`) and a cursor SVG moves along. For wallpaper, generate 12 rows of the word with `-webkit-text-stroke` (outline). Rotate the container -12deg, slide alternate rows in opposite directions, and fill 2 rows with the accent. For the invert, one `tl.set` swaps a background layer and the text colors on the beat.
- **Swaps:** a search bar that types the phrase (YouTube, Google), a chat input (AI products), a price tag, a headline from the brand's first slogan.

##### Letters to dots to grid (shape language)
- **Reference:** letters of DECISION become red dots one by one, the dots line up in a row of 8, and the row becomes a full-frame grid. A red wave ripples, circles morph to squares, then crosses, then triangles, and the camera tilts and pushes in.
- **Build:** a grid of divs (for example 16x9) with `border-radius`. The wave is a function of time and distance from an origin: in `onUpdate`, for each cell, `phase = t*speed - dist`, then set its scale, color mix, and radius from `phase`. That is seek-safe because it is a pure function of `t`. Shape morphs are `border-radius` 50% to 8% and a `clip-path` polygon. The camera is a parent with `perspective` and `rotateX`/`rotateZ`.
- **Swaps:** a 16:9 thumbnail grid (YouTube) with real images fading into cells, app icons, product SKUs, a pixel mosaic of the logo.

##### Particle system
- **Reference:** a lens iris flashes on the midpoint drop, particles burst in red, white, and blue on navy, swirl, and condense into a ring.
- **Build:** one `<canvas>` of 2,000-4,000 particles. Precompute seeded start positions and targets (any shape: a ring, a logo from sampled pixels of an image, a number). Draw every particle from `lerp(start, target, ease(clamp((t - t0)/d - delay_i)))` plus a curl offset `sin(i*1.7 + t*3)*amp*(1 - progress)`. Redraw in a proxy tween's `onUpdate` so the frame is a pure function of `tl.time()`. Use additive blending (`globalCompositeOperation = 'lighter'`) for glow.
- **Out-transform:** particles condense into the silhouette of the next chapter's hero object, then the real object crossfades in within 2-3 frames of a flash.
- **Swaps:** a like-button burst (social), confetti of product colors, data points, stars.

##### Lookdev / hero object
- **Reference:** an iridescent chrome torus SDF-morphs into blobs and a cube, with a parameter readout (SDF, SMOOTH UNION, MORPH, IOR, ROUGH), and pushes into the lens.
- **Build:** a generated photoreal still (seedream i2i from the logo) plus a Kling camera move, sped up about 3x and re-encoded at 60fps all-intra. For a second material, cut or crossfade to another material of the same object (lacquer to chrome, silver to gold). Put a readout on a leader line with numbers that count up in `onUpdate`. The out push is `scale 1 -> 3` plus `blur 0 -> 20px` over the last half beat, with a hard cut on the beat.
- **Swaps:** a creator award plaque (YouTube), a bottle or can, a device, a logo sculpture.

##### Easing graph
- **Reference:** a cubic-bezier(0.83, 0, 0.17, 1) curve on paper, with a ball riding it and leaving onion-skin ghosts.
- **Build:** an SVG path with `stroke-dasharray` draw-on. The ball position comes from evaluating the bezier at `ease(t)`, and the ghosts are 8 copies at earlier times with falling opacity.
- **Swaps:** a growth curve of a brand metric, a playback-speed curve.

##### Flurry (4 beats, about 6 cuts)
- **Reference:** Easing, then Op Art (stripes plus target), Glitch ("REEL" RGB split), Isometric blocks, Symmetry (kaleidoscope), and pixel noise, cut on beats and then half beats, introducing the held-back blue.
- **Build:** each cut is a full-bleed layer shown by `tl.set` on its grid time with one internal move (a spin, slide, scale pop, or stutter). Glitch uses 3 copies of the text (red, cyan, and white) offset by a few px with `mix-blend-mode: screen`, plus 4-6 horizontal slices (`clip-path: inset()`) jittered on alternating frames. Noise is a canvas of big pixels in brand colors, seeded per frame.
- **Swaps:** each flurry frame is one brand signature UI moment at full bleed (YouTube: Subscribe click, a Shorts swipe, a LIVE badge, Skip Ad, a double-tap +10s, a 4K/HD badge).

##### Lockup (end card)
- **Reference:** the wordmark resolves from noise with bloom, a rule draws beneath it, two mono subtitles type on with a red block cursor, the motif lands as the period with a squash and a ground ellipse, and the tagline fades in last at low opacity.
- **Build:** the noise canvas fades as the wordmark's `filter: blur(20px) -> 0` and `opacity` rise over 12 frames, and bloom is a `text-shadow` or `drop-shadow`. The rule is `scaleX 0 -> 1` from the left. For typing, reveal characters with a `steps()` tween on a width mask, or `tl.set` per character, and a blinking block via `tl.set` toggles every 16 frames. The motif fall reuses the physics chapter's contact keys.
- **Swaps:** the motif becomes the logo's own element (a scrubber dot becomes the play button, a dot becomes the i's tittle, a drop becomes the O).

### `.claude/skills/short-form-edit/references/curiosity-and-entertainment.md`
#### Curiosity and entertainment workflow

First and highest-priority test: "In the first 3 seconds is someone convinced
they need to watch until the end?" Record the benefit, question, and earned
payoff that support the judgment. A technical validator or internal comparison
cannot establish that actual viewers are convinced.

Prioritize this gate over every aesthetic score. If the opening only earns
"that looked cool" and cannot answer "why should I stay?", revise it before
rendering the final. Document the editorial reason to pass or revise; never
invent a percentage of viewers convinced. Check again on the encoded export.

##### Before composition

1. Read the exact retained speech. State the useful lesson a viewer receives by
   the end. Keep qualifications and do not manufacture a claim for a hook.
2. Pick an unresolved state viewers can understand immediately. Examples:
   three empty slots around an AI model; a project with an unfilled access slot;
   two parts that appear incompatible. Make the missing information specific.
3. Map setup, partial answer, reminder, and resolution. Use one main question
   with short subordinate questions, rather than many unrelated mysteries.
4. Draft three different openings: problem first, result glimpse, or recognition
   first. Each must lead naturally into the same source narration. Render their
   first three seconds cheaply, compare, and record the choice.
5. Build the entire moving rough edit. Use simple shapes and existing assets.
   Judge story before shadows. Recut speech only when needed and preserve its
   meaning; rebuild all timing-dependent artifacts after any EDL change.

##### Loop ledger

Save OPEN-LOOPS.json as an array. Each item has:

```json
{
  "id": "main",
  "question": "What fills the three missing slots?",
  "object": "Three numbered empty slots around the model",
  "setup": 2.3,
  "updates": [{"time": 5.1, "state": "First slot becomes the specification"}],
  "closure": 38.4,
  "resolution": "All three named layers assemble around the same model",
  "supportingSpeech": "an entire system around Claude"
}
```

Times are output seconds. A checker can verify order, coverage, and source
anchors; only rendered inspection establishes whether the question is clear.
An object reappearing without resolving anything is a callback, not a closed loop.
Add an `opening` object with `benefit`, `evidenceBy3`, and `payoffTime` so the
highest-priority test has concrete evidence. Keep `supportingSpeech` verbatim
when quoting; label any paraphrased explanation as a paraphrase.

##### Direct each sequence

- Expectation: what does the viewer think happens next?
- Development: what changes their understanding or gives a partial answer?
- Payoff: what result, contrast, or connection lands?
- Attention: which single thing should their eye follow?
- Rhythm: where does density increase, briefly release, then resolve?
- Sound: which cue anticipates, contacts, or releases? Which cuts stay quiet?

Do not force suspense into a straightforward explanation. Do not withhold the
topic, fabricate a failure, or add a vague "wait for it". A deliberately incomplete
editorial model must not be presented as an actual product failure or output.
Showing all answers on the first card closes a list-based loop prematurely.

##### Review

At rough and final stages, review uninterrupted motion and actual sound when
the runtime supports perception of them. Record the actual modality. When only
stills/strips and signal analysis are available, use those honestly: inspect
chronological 0.25-0.5 second samples plus contiguous action strips, audit every
loop state, and do not call successful automated playback a listening/viewing pass.

Write timestamped weaknesses and decisions in ENTERTAINMENT-REVIEW.md. Compare
adjacent shots without headings; remove generic footage and repeated headline
copy that add no information. Distinguish audience measurements from editorial
judgment. If future user-provided retention data exists, relate drop-offs to exact
edit moments without assuming the edit caused them.

### `.claude/skills/short-form-edit/references/reference-analysis.md`
#### Analyze a short-form reference

Use a reference the student supplies and has permission to use. Keep the recording
and analysis inside the private video project. Do not copy its script or assets.

##### Watch and record

Watch the full video once for its promise and payoff, then again with timestamps.
For each meaningful change, record:

| Time | Spoken idea | Visual change | Sound cue | Viewer question | Payoff |
| --- | --- | --- | --- | --- | --- |
| Fill from the supplied reference | Verbatim phrase | Framing, footage, or graphic | Audible impact | What remains unresolved | Where it resolves |

Measure the actual resolution, duration, and frame rate. Separate observations
from your interpretation of why a choice works. A fast montage does not imply
that every new edit needs the same number of cuts.

##### Transfer the mechanism

- Make the opening visual support a truthful promise in the spoken hook.
- Use a brief crop or caption emphasis on a specific word, then return to rest.
- Cut to moving footage when it supplies evidence or explains something concrete.
- Give each sound cue a visible event; align its audible impact, not its file start.
- Build curiosity that the retained recording actually resolves.
- End after the payoff with enough room for the intended action to be understood.

Write which mechanisms fit this recording and which would distract from it.
Design new copy, scenes, and motion from the student's own transcript and brief.

## Appendix E — Not inlined (size budget), read from source when needed
- [`.claude/skills/motion-showreel/references/reference-breakdown.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/motion-showreel/references/reference-breakdown.md)
- [`.claude/skills/short-form-edit/references/plan-schema.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/short-form-edit/references/plan-schema.md)
- [`.claude/skills/short-form-edit/references/premium-motion-and-footage.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/short-form-edit/references/premium-motion-and-footage.md)
- [`.claude/skills/short-form-edit/references/quality-gates.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/short-form-edit/references/quality-gates.md)
- [`.claude/skills/website-to-hyperframes/references/step-1-capture.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-1-capture.md)
- [`.claude/skills/website-to-hyperframes/references/step-2-design.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-2-design.md)
- [`.claude/skills/website-to-hyperframes/references/step-3-script.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-3-script.md)
- [`.claude/skills/website-to-hyperframes/references/step-4-storyboard.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-4-storyboard.md)
- [`.claude/skills/website-to-hyperframes/references/step-5-vo.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-5-vo.md)
- [`.claude/skills/website-to-hyperframes/references/step-6-build.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-6-build.md)
- [`.claude/skills/website-to-hyperframes/references/step-7-validate.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/step-7-validate.md)
- [`.claude/skills/website-to-hyperframes/references/techniques.md`](https://github.com/nateherkai/herk-edit-kit/blob/10511e5/.claude/skills/website-to-hyperframes/references/techniques.md)

---
**Source & credit:** [nateherkai/herk-edit-kit](https://github.com/nateherkai/herk-edit-kit) @ `10511e5` (cloned 2026-11-22). License: MIT (see THIRD_PARTY_NOTICES.md). All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
