# Storyboard Generator — on deck (asset phase)

**This is an on-deck tool, not a pipeline step.** Most builds never touch it. Pull it in only when a
section's video needs more than one shot or has to tell a story — typically the hero. It can also be
called on its own: "storyboard this hero", "give me a storyboard for the product section".

Mr. Black's production method for multi-shot video, distilled from his prompt
library (Google Drive): *Storyboard Cinematic Video Prompt for GPT Image 2.0* (NOX/LUMOS),
*GPT Image 2 Prompt for Storyboard — Endless Bedroom*, *GPT Image 2 Prompt for storyboard (Haze)*,
*Chatgpt Image 2.0 Storyboard prompt*, *Northgate UGC storyboard prompt*, *Video and Storyboard
Prompt for GPT IMAGE 2.0 and SEEDANCE 2.0*, *Consistent character with Storyboard sheet prompt*,
*Character Identity and Storyboard Prompt Sheet*, *Character Reference Sheet/Prompt/Storyboard Combo*
(Banyu), and the *Seedance 2.5 Director's Engine*.
Models are the current roster (`asset-pipeline.md` §3); tokens come from `prompt-tokens.md`.

## 1. When to pull it in

Decide per video slot while filling `assets.yaml` (P3). Default is **no storyboard**.

| Video slot needs… | Storyboard? | Path |
|---|---|---|
| One continuous shot — a loop, a slow push-in, ambient motion (most hero sections) | **No** | Anchor still → MiniMax H3, start frame = end frame |
| Several shots, a reveal, a character or product doing something, a mini story | **Yes** | Full chain below |

Typical "yes" cases:

| Asset | Path |
|---|---|
| Multi-shot **hero film** (brand, AI services, hospitality, launches) | Full chain below. |
| **T3 scroll film** (`frame-scrub`, `sticky-narrative`) | Full chain; each panel = one scroll beat. |
| Product ad / campaign section | Full chain; commercial board (§3B) for client sign-off, previs board (§3A) for generation. |

## 2. The three-asset chain

```
1 IDENTITY SHEET  ── ChatGPT Images 2.5 ──►  @character_sheet / @product_sheet
      (front / side / back / ¾, wardrobe or material details, key prop, expressions, palette)
2 STORYBOARD SHEET ─ ChatGPT Images 2.5 (16:9, uses the sheet as reference) ──► @storyboard
3 VIDEO ─────────── Seedance 2.5 (default) or Seedance 2.0 Omni, both refs attached ──► master clip
                    MiniMax H3 only for single-shot loops
→ QC → encode (asset-pipeline §5) → frames for frame-scrub if T3
```

"The more detailed the identity sheet, the less Seedance drifts." Always build the sheet first; the
storyboard controls staging only, never identity.

### 2A. Identity sheet prompt (ChatGPT Images 2.5) — from *Character Reference Sheet/Prompt/Storyboard Combo*

```
Create a 16:9 image. Use the provided image as the authoritative character reference. It controls
face, hair, wardrobe, proportions, body type, and silhouette. Do not redesign, age-shift, beautify,
or stylize away from it.

[SHEET CARD]
Create a compact designed masthead, not a table.
NAME: […]
ROLE LINE: […]
CORE TRAITS: […four words]
VISUAL SIGNATURE: […the 3–5 details that identify them at a glance]

[SHEET CONTENTS]
Lay out a professional animation production character sheet on a clean off-white studio background:
- HERO POSE: full-body character at largest scale, […signature pose + signature effect/prop]
- TURNAROUND: front, three-quarter, side, and back views at identical scale and height line
- EXPRESSION STUDIES: 5 head studies — […the five emotions the film needs]
- ACTION POSES: 3 small dynamic poses showing […the three key actions in the storyboard]
- SILHOUETTE STUDIES: small solid-black silhouette row proving readable shape
- DETAIL CALLOUTS: zoomed crops of […wardrobe closures, hands, footwear, key prop, effect crop]
- COLOR PALETTE: labeled swatch chips of […wardrobe, skin and hair tones, accent/effect color]

[SHEET PURITY]
Flat catalog layout, clean typographic labels, generous whitespace. No scene background, no
environment, no narrative panels, no duplicate inconsistent versions, no extra characters,
no watermark, no logo.
```

**Product version** (e-commerce, SaaS device, packaging): swap TURNAROUND for front / ¾ / side /
back / top at identical scale, EXPRESSION STUDIES for material close-ups (finish, texture, seams,
logo placement), ACTION POSES for 3 in-use states; keep SILHOUETTE, DETAIL CALLOUTS and PALETTE.

**Environment reference** (optional second anchor): a clean plate of the location — for web, the
client's real space or an approved ChatGPT Images 2.5 plate. In the storyboard's REFERENCE PRIORITY:
*"First provided image controls C1 identity; second provided image controls environment anchors:
[floor, fixed landmarks, skyline, practical lights, surfaces]."* Then name those anchors' screen
positions in ENVIRONMENT LOCK and SPATIAL CONTINUITY LOCK (e.g. "tanks stay screen right, skyline
background, practical light screen left, wet deck foreground").

**MUST READ contrast:** state what the sequence IS and what it is NOT ("a disciplined pencak silat
power-reveal … NOT generic waterbending, slow tai-chi flow, or a dance number") — it stops the
model defaulting to the nearest cliché.

## 3. Storyboard sheet prompts (ChatGPT Images 2.5)

### 3A. Previs board — the generation blueprint (default)

Monochrome rough-sketch panels (they carry staging, not style — color inside panels leaks into the
video). Fill every block; `[…]` are the per-project values.

```
Create a 16:9 image.

[PROJECT CARD]
Create a compact designed masthead, not a table.
TITLE: […]
META LINE: […tone] / […genre] / […pace, e.g. fast 15-second burst flow]
PRIORITY: […what must read: first frame, signature moment, end state]
MICRO BRIEF: […one sentence: N-panel storyboard of who does what, ending where]

[CONTINUITY HEADER]
SEQUENCE ID: […]
STYLE PACKET: storyboard panels are raw black-and-white pencil sketch previs on off-white paper;
final video target is […final look + prompt-tokens.md camera/lens/light/grade tokens].
REFERENCE PRIORITY: @[character_sheet] controls C1 face, body, wardrobe, proportions, props and
silhouette; this storyboard controls staging, motion, geography, continuity and rhythm only.

[SCENE PACKET]
PREMISE: […]
LOCATION: […layout, surfaces, landmarks that stay fixed]
START -> END: […observable first frame] -> […observable final frame]
ACTION CHAIN: […beat -> beat -> beat]
PROP / EFFECT STATE: […what exists, how effects look, what never appears]
MUST READ: […the one idea the sequence must communicate]

[CHARACTER SANITIZATION]
C1: […only what can appear on screen]. Remove contradictory traits, invisible psychology,
excessive costume detail, and backstory that cannot appear in a panel.

[IDENTITY CONSISTENCY]
Reference controls identity; storyboard controls staging only. Keep C1 […fixed traits] consistent.
Do not redesign, age-shift, beautify, merge, add characters or change wardrobe silhouette.

[STORYBOARD PURITY]
Panel images are visual-only low-detail monochrome light-gray rough sketches. Put panel numbers,
beat names and lens tags in the header strip outside each panel. No color, labels, arrows,
captions, subtitles, speech bubbles, logos, watermarks, timing marks, diagrams, UI, ghost poses,
duplicate bodies or technical overlays inside panels.

[MASTER SHOT RULE]
P01 shows the full playable geography: […]. [Web: keep the text-safe zone empty, e.g. "left 45 %
of frame is open sky/negative space".]

[EMOTIONAL ARC]
[…state -> state -> state], shown through […visible cues].

[STYLE LOCKS]
STYLE LOCK: […panel sketch style; sheet accent colors only outside panel artwork]
EFFECT LOCK: […how effects are drawn in panels and how they look in the final video]
ENVIRONMENT LOCK: […what stays constant from P01 to the last panel]

[SPATIAL CONTINUITY LOCK]
P… share the same layout: […fixed positions]. Allowed changes: camera distance, pose, light
state, effect state. The last panel is the same location, not a new establishing shot.

[DIRECTOR STRIP]
Bottom animatic track board aligned to panel columns. Tracks: BEAT LINE, CAMERA PATH, ACTION PATH,
RHYTHM TRACK, ESCALATION MAP, STATE TRACK, STYLE TRACK. Shot chips, thin lines, rhythm blocks,
small intensity bars, one-to-three-word labels. No seconds or timestamps.
RHYTHM TRACK format: `RHY P##: [hold|slow reveal|build|burst|impact|pause|recover|final hit] /
[short block|medium block|long block] / [clean beat|match beat|smash beat|held beat|whip beat]`
ESCALATION MAP format: `ESC P##: [L1 calm|L2 tension|L3 rise|L4 surge|L5 peak] /
[flat|rise|spike|drop|release|unresolved]`
PANEL HEADERS: P01 / [lens] / [beat] -> P02 / … 
CAMERA + LENS PLAN: […per panel]
ACTION PATH: […per panel]
RHYTHM TRACK: […per panel]
ESCALATION MAP: […per panel]
STATE TRACK: […per panel]
STYLE TRACK: […per panel]

[SEQUENCE]
Grid: [N] panels in a [cols x rows] storyboard sheet; [hard-cut sequence | one continuous
same-lens master shot].
```

Per-panel detail (Haze format) when a beat needs precision: `Shot intent · Camera (size, lens,
angle, movement) · Action · Continuity · Strip cell [P## beat] / [camera] / [action] / [rhythm] /
[escalation] / [state] / [style]`.

Optional additions from the library: **[STYLE KEYFRAMES]** — 2–3 tiny top swatches of the final
render look (not character refs); **[SHEET POLISH]** — premium off-white sheet, even gutters,
accent colors outside panels only; **[DRAWING ENERGY]** — line quality and framing rhythm per beat.

### 3B. Commercial board — client presentation

Photoreal 3×3 advertisement layout the client can approve: each panel has a bold title top-left, a
cinematic photoreal image and a bottom text area with **VISUAL / ACTION / SFX-MUSIC**; brand tagline
footer; negative prompt (no cartoon, no distorted logo, no messy layout, no low-quality text). Use it
to sell the concept, then generate from a 3A previs board of the same beats.

### Panel counts for the web

| Use | Panels | Grid |
|---|---|---|
| Hero film 8–12 s | 6–8 | 3×2 / 4×2 |
| Brand film 15 s | 9–12 | 3×3 / 4×3 |
| Scroll film (T3) | 8–12 (one per scroll beat) | 4×3 |
| Fast burst sequence | up to 18 | 3×6 |
Seedance reads clean boards up to ~15 panels best; split longer films into parts (Part 1 / Part 2
with a shared last-frame → first-frame hand-off).

## 4. Video handoff prompt (Seedance 2.5 / 2.0 Omni)

```
Use @[storyboard ref] as the authoritative director-approved storyboard blueprint for the sequence.
Treat every storyboard panel as a consecutive shot within a single cinematic sequence. Read it left
to right, top to bottom. Follow panel order exactly and do not invent alternative coverage. Do not
render the storyboard sheet itself; do not use its line-art style, labels, arrows or placeholder
figures. Preserve camera placement, framing, lens intent, shot scale, character staging, screen
direction, environmental geography, prop placement, action choreography, continuity and emotional
escalation shown by the storyboard. Recreate the filmed sequence implied by the panels rather than
the physical storyboard artwork.

Use @[character ref] as the authoritative C1 identity reference: face, hairstyle, body proportions,
wardrobe, props. Do not use its background, pose sheet layout or labels.

ENVIRONMENT: […]
EMOTIONAL GUIDANCE: Valence: […]. Arousal: […], shown through […visible cues].
VISUAL STYLE: […final look + prompt-tokens.md tokens: body, lens, lighting, grade, movement]
AUDIO: […]   (web hero: "No music, no dialogue — silent clip" )

PANEL BEATS:
P01: [shot size + camera]; [action]; [end state].
P02: …
Final panel: [closing action]; [observable final frame].

MAINTAIN CONSISTENCY: same C1 as one continuous instance; stable subject and object counts; no
transferred props or clothing; same screen direction and axis; same lighting direction and grade.

NO SUBTITLES. NO TEXT ON SCREEN. NO CAPTIONS. NO TITLES. NO WATERMARKS. NO LOGOS unless the brand
asset is supplied. NO UI ELEMENTS. NO PANEL BORDERS. NO SPEECH BUBBLES. NO COMIC LAYOUT.
NO CHINESE OR ENGLISH CHARACTERS ANYWHERE IN FRAME.
```

Timed variant (when a reveal, cut or beat must land at a moment): replace PANEL BEATS with
consecutive, non-overlapping ranges — `[0s–2s] SHOT 1 — TITLE. Framing. Action. SFX. Camera.` —
and end with `Hold final frame 0.8s.` Keep settings (duration, aspect, audio on/off, mode) **outside**
the prompt, in the tool parameters.

## 5. Seedance 2.5 Director's Engine — rules that apply to every video prompt

- **Direct a scene, don't describe a picture:** who, what happens, where, how it progresses, how
  the camera captures it, what changes, what stays fixed, the final frame, what is heard.
- **Formula:** subject + action/event + scene + visual treatment + camera + audio.
- **Structure:** opening state → inciting action → development → turning point → final action →
  visible end state. One primary state change per stage; every end state observable
  ("the glass remains centered on the table"), never "it feels complete".
- **Every reference gets one job**, plus what to inherit and what not to inherit
  (`@Image 3 defines the architecture and lighting. Do not use the people in it.`). Multiple views of
  one product/person = one instance ("All four images define one motorcycle").
- **Fewer, stronger references** beat many conflicting ones; select references per scene.
- **Camera:** one dominant, motivated intention per shot — size, position, focus subject, movement,
  direction, speed, final composition. Connected direction, never a buzzword list.
- **Emotion = 2–4 visible cues** (gaze, brow, breath, hands, posture), tied to the event that causes it.
- **Physics:** weight, momentum, contact, recoil, cloth and hair response, environmental reaction.
- **Visual treatment:** describe what creates the look (light sources, materials, texture), not
  adjective stacks.
- **Transitions:** physically motivated (occlusion, whip pan, match move, push through an opening) —
  state trigger, direction, speed, transformation, arrival composition, audio change.
- **Modes:** first-and-last-frame (define each image separately; first image sets aspect), multi-keyframe
  (`@Image 1…N in order`, each with its visible state), forward/backward extension (boundary frame
  continuity), storyboard-grid (reading order, don't inherit line-art).
- Silent QC before output: subject clear, stages manageable, end states observable, references mapped,
  continuity protected, camera motivated, timestamps consecutive, no contradictions.

## 6. Web-specific rules

- **Hero clips are silent** (autoplay requires muted) — set audio off; no dialogue.
- **Loops:** the final panel's end state = P01's opening state; generate with MiniMax H3 first/last
  frame = the same anchor still, or with Seedance first-and-last-frame mode.
- **Text-safe zone** from `assets.yaml` goes into the MASTER SHOT RULE and every wide panel.
- **Two aspect ratios:** generate 16:9 and 9:16 as separate runs from the same board (reframe the board
  or add a 9:16 variant), never crop a 16:9 face shot into portrait.
- **Duration:** T2 hero ≤ 12 s; T3 scroll film total ≤ 150 frames after extraction (asset-pipeline §5).
- **Scroll films:** one panel = one scroll beat = one `sticky-narrative` step or a frame range of
  `frame-scrub`; keep one virtual lens (Endless Bedroom "same-lens master shot") for scrubs so the
  scroll never jumps.
- **Faces:** background loops stay face-free; brand/founder films use an identity sheet of the real
  person with written consent.
- Record the board, handoff prompt and model per slot in `assets.yaml` (`storyboard:`, `prompt:`).

## 7. Worked skeleton — AI-services brand hero (12 s, 8 panels, Seedance 2.5)

`PROJECT CARD — TITLE: SIGNAL / META LINE: precise awe / AI systems brand film / continuous rise /
PRIORITY: dark void to lit neural city, product mark resolves in the text-safe right third`
`PANEL HEADERS: P01 / 24mm wide / Dark void master -> P02 / 85mm macro / First spark -> P03 / 35mm
orbit / Lines connect -> P04 / 50mm push / Grid wakes -> P05 / 24mm crane / City of light -> P06 /
85mm tight / Hands on interface -> P07 / 35mm pull / System hums -> P08 / 24mm wide / Hold, safe zone left`
`VISUAL STYLE: shot on RED V-Raptor 8K, Zeiss Master Prime 50mm T1.3, Technocrane Super 30 movement,
ARRI SkyPanel S120-C cyan accents, DaVinci Resolve ACES workflow, deep ink-blue grade`
`AUDIO: none (silent web hero)` — end state P08 matches P01 composition for a clean loop.
