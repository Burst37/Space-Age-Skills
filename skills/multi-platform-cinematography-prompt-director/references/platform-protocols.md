# Platform Protocols — Compile Layer (verified 2026-09-29)

The same DP decision compiles differently per model. Use the template of the target model **verbatim**. If the user's UI or API shows different limits, the UI wins, so flag the mismatch.

Status markers: **GA** = generally available · **BETA** = limited access · **ANNOUNCED** = not shippable yet · **LEGACY** = available but not recommended · **SUNSET** = do not use.

---

## House video lineup — the only video models this skill routes to

**Seedance 2.5 · Seedance 2.0 · MiniMax H3 · Grok Imagine Video 1.5 · Google Omni (Gemini Omni Flash).**

Everything else (Veo 3.1, Kling, Runway, Luma, Wan, Happy Horse, Hailuo 02, Sora) is **outside the house lineup**: behind these five or unused. See the end of the video section. Compile for an outside model only when the user explicitly names it.

## Routing table — which house model for which job

### Video
| Job | 1st pick | 2nd pick | Why |
|---|---|---|---|
| Multi-shot narrative / music video sequence up to 30s | **Seedance 2.5** | Seedance 2.0 (≤15s) | 30s one-take, 30 image + 10 video + 10 audio refs, timestamps, `@Clay Render` camera paths |
| Performance / lip-sync to a real track or voice | **Seedance 2.5** (`@Audio` ref) | MiniMax H3 (voice ref + `[t]` audio beats) | The only house models that take audio references |
| Identity / product preservation with fine control of what transfers | **MiniMax H3** | Seedance 2.5 | Explicit preservation levels per reference |
| Dialogue written in the prompt (no audio ref), conversational edits, extension to 40s | **Gemini Omni Flash** | Seedance 2.5 | Multi-turn editing that preserves unmentioned elements; extends up to 40s |
| Animating a hero still fast (social cuts, product loops, portrait motion) | **Grok Imagine Video 1.5** | Gemini Omni Flash (image_to_video) | I2V-first, 1–15s, native audio, 7 aspect ratios, extend from last frame |
| Compound optical moves (dolly zoom, yoyo zoom, 3D rotation) | **Seedance 2.5** with a `@Video` / `@Clay Render` camera-path ref | MiniMax H3 | A camera-path reference beats text for complex optics |
| Editing existing footage | **Gemini Omni Flash** (`edit`) | Seedance 2.5 edit modes | Conversational, change-only edits |
| Fast previz / animatic | **Seedance 2.0 Fast** · **Gemini Omni 360p draft** | Grok Imagine 480p | Cheap iteration; recompile finals |
| 4K delivery | **Gemini Omni Flash** (4K upscale) | Seedance 2.5 + external upscale | |
| Higgsfield workflow (Seedance via Higgsfield) | → `cinema-director-v3` | | House Seedance spine |

### Stills
| Job | 1st pick | 2nd pick |
|---|---|---|
| Photoreal hero frames, editing, multi-image compositing | **Nano Banana Pro** (Gemini 3 Pro Image) | GPT Image 2.5 |
| Exact text, packaging, typography, infographic, prompt adherence | **GPT Image 2.5** (ChatGPT Images 2.5, 2026-09-08) | Seedream 5.0 Pro |
| Art-directed concept, moodboards, stylized campaigns | **Midjourney V8.x** | FLUX.2 |
| Controllable / deployable / exact HEX brand colors | **FLUX.2** | — |
| Marketing layouts mixing text and imagery | **Seedream 5.0 Pro** | GPT Image 2.5 |
| High-volume variants | **Nano Banana 2** | FLUX.2 |
| Higgsfield face-lock, character sheets, outfit swaps | → `banana-pro-director-30` | |
| Start frames for video (Grok / Omni / H3 I2V) | Nano Banana Pro / GPT Image 2.5 at the video's aspect | |

---

## VIDEO — house lineup

### Seedance 2.5 (ByteDance / Dreamina) — primary sequence engine
- **Limits:** up to **30s** single pass; refs up to **30 images + 10 videos + 10 audio**; multi-round extension to multi-minute; T2V, R2V, extension, and edit modes; `@Clay Render` refs for 3D blocking/pose/camera path.
- **Syntax:** `@Image1`, `@Video1`, `@Audio1`, and each must be **given a role**. Time ranges are written `0–5s:`. Multi-shot sections are labeled `Shot 1 … Hard cut.`
- **Formula:** Format → Subject + Action → Reference roles → Timeline → Camera → Continuity → Audio → Constraints.
- **Rules:** one reference per element that must stay consistent (face, product, location, style); don't max out slots with noise. Each shot gets its own action, camera position, and **end point**. Keep dialogue in quotes with speaker.
- For the house's full 16-slot locked spine, hand off to `cinema-director-v3`; for syntax edge cases, use `seedance-2-5-prompting`.

**Template**
```
Format: 30s, 16:9, 24fps, cinematic multi-shot, photoreal, no on-screen text, no background music.
References: @Image1 = [NAME] face and hair — fully preserve identity. @Image2 = [NAME] wardrobe — preserve cut, color, fabric. @Image3 = location plate — preserve architecture and palette. @Audio1 = voice timbre only.
Look: [camera body prose], [lens prose], [grade/stock prose], [director + DP influence], [2–3 translated meta tokens].
0–6s — Shot 1 [WS · ESTABLISH]: [subject lock]. [start → trajectory → end]. Camera: [rig, move, speed, endpoint]. Light: [key/fill/back fixture+placement+CCT, ratio]. Atmosphere: [source-bound]. Hard cut.
6–12s — Shot 2 [MCU · INTIMACY]: ...
...
Audio: [0–6s ambience], [7.5s SFX], [NAME, low and tired]: "line".
Continuity: identical wardrobe and hair across shots; key light always camera left; screen direction left to right.
```

### Seedance 2.0 — budget/fast sequences
- **Limits:** **15s**; up to **9 image** refs (+ up to 3 video + 3 audio, 12 files total); T2V/I2V/R2V.
- The same syntax as 2.5. Anything past 15s splits into two generations with an end-frame → start-frame handoff.
- 2.0 Fast is good for previz.

### MiniMax H3 / Hailuo 3.0 (Jul 2026) — preservation control
- **Limits:** 5–15s; 24fps; up to 2K (API); up to 12 reference files (images/video/audio); native stereo; first + last frame.
- **Formula:** References → Retention → Scene → Timeline → Camera → Audio → Constraints.
- **Preservation levels** (per reference): `fully_preserved` · `partially_preserved` · `attribute_transfer` · `weak_reference`. Always say what to **ignore**, e.g. "Image 2: attribute_transfer — preserve the jacket's color, material, and cut, not the person wearing it."
- **Camera:** natural film language only (dolly in, track left, orbit, crane, handheld, locked-off, whip pan, rack focus) with speed. **Do NOT use bracket commands**; they degrade H3.
- **Audio:** timestamped beats in four layers: `[5.4s] The glass touches the table with a quiet ceramic click.` Dialogue / SFX / ambience / music are kept separate.
- Describe actions as trajectories, and separate subject motion, camera motion, and edits.

### Grok Imagine Video 1.5 (xAI, GA 2026-06-16) — still-to-motion engine
- **Limits:** **1–15s** (5–8s is the most stable); 480p or 720p; 24fps; aspect Auto / 16:9 / 9:16 / 1:1 / 4:3 / 3:4 / 3:2 / 2:3; **image-to-video** (every generation takes a start image; text-only generation runs on the base Grok Imagine model); reference images to hold a character or style across clips; **extend from the last frame** for longer sequences; native audio (dialogue with lip-sync, SFX, ambience, music) in the same pass. Audio does not land on every clip, so plan a fallback audio pass for client work.
- **Engine behavior:** the first **20–30 words carry the most weight**. Put the command line first.
- **Rules:** one subject, one action, one camera move per clip, then extend. Describe **only what changes**; never re-describe or contradict the start frame. Use strong verbs with intensity ("racing past at high speed", not "passing"). **Always name the audio**, or the clip comes back silent. For dialogue, use a front-facing start frame with the mouth in frame, and keep lines short.
- **Prompt length — follow Grok's own guidance: 30–60 words.** This is the one exception to the 150–200+ word Detail Floor. The floor applies in full to the **start-frame** prompt (body, lens, lighting rig, grade, meta tokens) built on Nano Banana Pro / GPT Image 2.5. The Grok motion prompt itself stays 30–60 words, front-loaded: the first sentence carries subject + action + one named camera move, and the rest adds only secondary motion, a light change, and the audio.

**Template (30–60 words total)**
```
[Subject] [one action verb with intensity]; [one named camera move with speed and endpoint]. [Secondary motion with physics — hair, fabric, rain, liquid]; [one light change with timing]. Audio: [dialogue "short line" / key SFX / ambience or music].
```

### Google Omni — Gemini Omni Flash (`gemini-omni-1.1-flash`, I/O 2026-05-19) — omni-input + conversational editing
- **Limits:** **3–10s** per generation, **extend to 40s** total (append-only); 360p draft / 720p default / 1080p and 4K upscaled; 16:9 or 9:16; 24fps.
- **Tasks:** `text_to_video` · `image_to_video` (1 image, or 2 for first/last frame) · `reference_to_video` (**up to 3 subject images**, addressed in the prompt as `<IMAGE_REF_0>`, `<IMAGE_REF_1>`, `<IMAGE_REF_2>`) · `edit` · `extend`.
- **Audio:** described in text only (**no audio-reference uploads**). Dialogue, SFX, and music are written in the prompt; English is the evaluated language.
- **Syntax:** timecodes `[0-3s] action`; natural timing ("After 3 seconds, a woman enters"); say **"In a single continuous shot"** when you want no cuts; inline negatives are supported ("No dialogue"). On-screen text renders when quoted exactly.
- **Editing:** multi-turn via `previous_interaction_id`. Write **change-only** instructions; unmentioned elements are preserved. Voice editing isn't supported, and dialogue can't be added to an uploaded clip of someone talking.
- Every clip carries a SynthID watermark. Editing and extending uploads are unavailable in the EEA, Switzerland, and the UK.

**Template**
```
In a single continuous shot, [subject identity lock — or <IMAGE_REF_0> as NAME, preserving face, hair, and wardrobe] [action] in [environment + source-bound atmosphere].
Camera: [body prose], [lens prose + T-stop], [move + rig + speed + endpoint].
Light: [key/fill/back fixtures, modifiers, placement, CCT, ratio].
Style: [director + DP], [grade/stock prose], [2–3 translated meta tokens].
[0-3s] [beat]. [3-7s] [beat]. [7-10s] [beat].
Audio: NAME, [delivery]: "line". SFX: [timed]. Ambience: [bed]. [Music or "No music"].
```

---

## Outside the house lineup (compile only on explicit request)

| Model | Status | If the user insists, compile with |
|---|---|---|
| Veo 3.1 | Behind the house lineup | Prose or JSON; 4/6/8s; quoted dialogue with speaker; up to 3 ingredient images |
| Kling 4.0 | ANNOUNCED 2026-09-28/29; 4.0 Flash closed beta; GA slated Oct 2026 | Scene → Characters → Action → Camera → Audio & Style; `0–5s:` segments; `KF1 @0s:` keyframes; 30s / 15 refs / 10 keyframes (provisional). Re-evaluate for the house lineup at GA. |
| Kling 3.0 / Omni / Turbo | Legacy | `Shot 1 (0–3s):`; 15s; ≤6 shots |
| Runway Gen-4.5 | Outside | Positive phrasing; I2V = motion only |
| Luma Ray3 | Outside | Full paragraph; name the HDR intent |
| Wan 3.0 | Outside (open weights) | Long prompt + negative field; token-receptive |
| Happy Horse 1.0 | Outside | ≤2,500 chars; 1–9 subject refs |
| Hailuo 02 | Legacy (superseded by H3) | `[Push in]`-style brackets, ≤3 combined |
| Sora 2 | **SUNSET** (API retired 2026-09-24) | Do not use; recompile for Seedance 2.5 or Gemini Omni Flash |

---

## STILLS

### Nano Banana Pro (Gemini 3 Pro Image) / Nano Banana 2 — GA
- **Narrative sentences only, no keyword lists.** Write it like a DP describing the frame to a gaffer.
- Strong multi-image composition and editing, so give each input image a role. Good text rendering.
- Translate every meta token into prose (§12 of the database).

**Template**
```
A [shot size] [angle] photograph of [subject identity lock], [action / pose / expression], in [environment + atmosphere]. Shot on [body prose] with [lens prose at T-stop]; focus on [plane], background [falloff]. Light: [key fixture + modifier + placement + CCT], [fill/negative fill], [rim], [practicals], [ratio]. [Director + DP influence] sensibility; graded like [stock/pipeline prose]. [2–3 translated meta tokens as texture sentences]. Aspect ratio [x:y].
```

### GPT Image 2 / 2.5 (OpenAI) — GA
- The most literal prompt adherence and the best exact text. Write a **structured spec paragraph** or labeled lines: Subject / Composition / Camera / Lighting / Palette / Text (exact, in quotes, with font style + placement) / Constraints.
- Good for packaging, posters, and UI-in-scene.

### Midjourney V8.x — GA · token-receptive
- Tokens OK. Front-load the subject and composition, then camera/lens/light tokens, then meta tokens.
- **Params:** `--ar` · `--style raw` (for photoreal) · `--s` (stylize, lower = more literal) · `--sref` (style ref) · `--oref` / `--ow` (omni/character ref). Verify the current V8 param set in the UI.
- Put no prose instructions in the params.

**Template**
```
[subject identity lock], [action], [environment + atmosphere], [SHOT SIZE], [ANGLE], [CAMERA_TOKEN], [LENS_TOKEN], [lighting grammar tokens + fixture], [DIRECTOR] [DP] signature, [STYLE], [GRADE/STOCK], [META ×3–5] --ar 16:9 --style raw --s 100
```

### FLUX.2 (Black Forest Labs) — GA
- **Positive phrasing only.** Negations are ignored or can invert.
- Supports **structured JSON prompts** and **HEX colors** (use them for brand palettes). Token-receptive.

### Seedream 5.0 Pro (ByteDance) — GA
- Narrative + layout. Exact text goes in quotes. Strong for marketing composites that mix product, copy, and imagery.

---

## I2V hand-off protocol (still → video)

This is the core Grok Imagine workflow, and it also applies to Omni `image_to_video` and H3 first-frame clips.

1. Generate the start frame on Nano Banana Pro or GPT Image 2.5 at the **video's exact aspect ratio**, using the full 150–200+ word DP prompt.
2. The video prompt **does not re-describe** the frame. It writes: what moves, how (physics), where the camera goes (endpoint), what light changes, and what is heard.
3. Carry the identity-lock string and the grade line verbatim, so a model that re-renders stays anchored.
4. For a last-frame-controlled clip, generate the end frame from the start frame via an edit (the same seed/refs) so geometry matches.

---

## Verification sources (2026-09-29): re-check these when a model updates

- Kling 4.0 announcement: futunn.com (Kuaishou Kling 4.0, 30s), pixelsham.com (2026-09-28), evolink.ai (Flash status: unconfirmed API); official release notes at kling.ai/release-note (empty at time of writing)
- Kling 3.0 Turbo / Omni: atlascloud.ai (2026-06-17 launch)
- Seedance 2.5: seed.bytedance.com ("One-take creation, flexible referencing"), fal.ai, higgsfield.ai prompting guides
- MiniMax H3: kapwing.com "How to Prompt MiniMax H3"; platform.minimax.io API docs
- Gemini Omni Flash: ai.google.dev/gemini-api/docs/omni (official: 3–10s, extend to 40s, `<IMAGE_REF_n>` ×3, `[0-3s]` timecodes, no audio refs); DeepMind model card
- Grok Imagine Video 1.5: replicate.com/xai/grok-imagine-video-1.5 (I2V schema: 1–15s, 480p/720p, 7 aspect ratios); morphic.com, imagine.art, and grokaiimagegenerator.net 1.5 guides (30–60 words covers most use cases; front-load the first 20–30 words; one action + one move; always name the audio); GA 2026-06-16
- Sora sunset: OpenAI notices (app closed 2026-04-26, API sunset 2026-09-24)
- Leaderboards: llm-stats.com video/image arenas, Artificial Analysis
- Image models: GPT Image 2.5 (2026-09-08), Nano Banana Pro, Midjourney V8.2, FLUX.2, Seedream 5.0 Pro (buildmvpfast.com Sep 2026 roundup)
