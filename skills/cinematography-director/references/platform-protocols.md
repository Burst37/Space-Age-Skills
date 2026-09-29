# Platform Protocols — Compile Layer (verified 2026-09-29)

The same DP decision compiles differently per model. Use the template of the target model **verbatim**. If the user's UI or API shows different limits, the UI wins, so flag the mismatch.

Status markers: **GA** = generally available · **BETA** = limited access · **ANNOUNCED** = not shippable yet · **LEGACY** = available but not recommended · **SUNSET** = do not use.

---

## Routing table — which model for which job

### Video
| Job | 1st pick | 2nd pick | Why |
|---|---|---|---|
| Multi-shot narrative / music video sequence up to 30s | **Seedance 2.5** | Kling 4.0 (when GA) | 30s one-take, 30 image + 10 video + 10 audio refs, timestamps |
| Dialogue, lip-sync, native audio realism | **Veo 3.1** | Seedance 2.5 / MiniMax H3 | Best prompt adherence plus native audio |
| Identity/product preservation with fine control of what transfers | **MiniMax H3** | Seedance 2.5 | Explicit preservation levels per reference |
| Omni-reference remix (image + video + audio together) | **Gemini Omni Flash** | Seedance 2.5 | Accepts mixed refs in one prompt |
| Granular creative control (motion brush, scene consistency) | **Runway Gen-4.5** | — | The editor-grade toolset |
| HDR/EXR pipeline, VFX-friendly plates | **Luma Ray3** | — | 16-bit HDR output, keyframes |
| Open-weight / self-hosted / fine-tunable | **Wan 3.0** | — | Top open model |
| E-commerce / short-drama with a recurring subject | **Happy Horse 1.0** | Seedance 2.5 | 1–9 subject refs, cheap per second |
| Fast previz / animatic | Seedance 2.0 Fast / Kling 3.0 Turbo (LEGACY) | — | Cheap iteration only; never final |
| Editing existing footage | Seedance 2.5 edit modes · Runway | — | |
| Higgsfield workflow (any of the above via Higgsfield) | → `cinema-director-v3` | | House Seedance spine |

**Not recommended:** **Kling 3.0 / 3.0 Omni / Turbo** — LEGACY, behind the frontier; previz only. **Sora 2** — SUNSET: app closed 2026-04-26 and API sunset 2026-09-24, so never start new work on it.

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
| Start frames for video (I2V) | Nano Banana Pro / GPT Image 2.5 at the video's aspect | |

---

## VIDEO

### Seedance 2.5 (ByteDance / Dreamina) — GA · primary sequence engine
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

### Seedance 2.0 — GA · budget/fast sequences
- **Limits:** **15s**; up to **9 image** refs (+ up to 3 video + 3 audio, 12 files total); T2V/I2V/R2V.
- The same syntax as 2.5. Anything past 15s splits into two generations with an end-frame → start-frame handoff.
- 2.0 Fast is good for previz.

### Veo 3.1 (Google DeepMind) — GA · dialogue and audio king
- **Limits:** 4/6/8s per generation (extend for longer); 720p/1080p/4K; 16:9 or 9:16; native audio (dialogue, SFX, ambience); "ingredients" up to 3 reference images; first + last frame control.
- **Syntax:** rich prose **or** structured JSON. Dialogue goes in quotes with the speaker and delivery, and you can add "(no subtitles)". Audio is written as separate sentences: `SFX:`, `Ambient:`.
- **Rules:** one continuous shot per generation (it cuts poorly inside 8s). Front-load the subject and action. The camera sentence gets its own line.

**JSON template**
```json
{
  "shot": {"size": "MCU", "angle": "eye level, 1.6m", "duration_s": 8, "aspect": "16:9"},
  "subject": "[identity lock: height, build, eyes, hair, face, expression, wardrobe]",
  "action": "[start → trajectory → end]",
  "environment": "[setting + source-bound atmosphere]",
  "camera": "[body prose], [lens prose + T-stop], [move + rig + speed + endpoint]",
  "lighting": "[key/fill/back fixtures, modifiers, placement, CCT, ratio]",
  "style": "[director + DP], [grade/stock], [translated meta tokens]",
  "audio": {"dialogue": "[NAME, hushed]: \"line\" (no subtitles)", "sfx": "[timed]", "ambience": "[bed]"},
  "constraints": "photoreal, no on-screen text, no music"
}
```

### MiniMax H3 / Hailuo 3.0 — GA (Jul 2026) · preservation control
- **Limits:** 5–15s; 24fps; up to 2K (API); up to 12 reference files (images/video/audio); native stereo; first + last frame.
- **Formula:** References → Retention → Scene → Timeline → Camera → Audio → Constraints.
- **Preservation levels** (per reference): `fully_preserved` · `partially_preserved` · `attribute_transfer` · `weak_reference`. Always say what to **ignore**, e.g. "Image 2: attribute_transfer — preserve the jacket's color, material, and cut, not the person wearing it."
- **Camera:** natural film language only (dolly in, track left, orbit, crane, handheld, locked-off, whip pan, rack focus) with speed. **Do NOT use bracket commands**; they degrade H3.
- **Audio:** timestamped beats in four layers: `[5.4s] The glass touches the table with a quiet ceramic click.` Dialogue / SFX / ambience / music are kept separate.
- Describe actions as trajectories, and separate subject motion, camera motion, and edits.

### Hailuo 02 / Director — LEGACY
- Bracket commands in the prompt, ≤3 combined: `[Push in]` `[Pull out]` `[Pan left]` `[Pan right]` `[Tilt up]` `[Tilt down]` `[Truck left]` `[Truck right]` `[Pedestal up]` `[Pedestal down]` `[Zoom in]` `[Zoom out]` `[Shake]` `[Tracking shot]` `[Static shot]`.
- Use only if the user is locked to 02; otherwise move to H3.

### Kling 4.0 (Kuaishou) — ANNOUNCED 2026-09-28/29 · staged template
- **Status:** 4.0 Flash is in closed beta for Black Gold annual members; full release is slated for **October 2026**. The API contract is unpublished. **Do not promise client output on it until the user confirms access.**
- **Announced specs (provisional):** up to **30s** single generation; multi-shot continuation to ~**2 min**; **Omni Reference up to 15 multimodal refs**; **up to 10 keyframes**; up to **4K, 10-bit HDR**; stereo audio; improved multilingual lip sync.
- **Provisional syntax** (carried from Kling's documented grammar and launch materials): order is Scene → Characters → Action → Camera → Audio & Style. Timecoded segments are written `0–5s:`. Speaker-labeled dialogue is written `[Character A: descriptor, voice tone]: "line"`, and sound effects `SFX: …`. Always give motion endpoints; open-ended motion hangs.
- **Keyframes:** list them as `KF1 @0s: [frame description] · KF2 @6s: …` and describe the motion *between* keyframes.
- Re-verify on GA and update this section.

### Kling 3.0 / 3.0 Omni / 3.0 Turbo — LEGACY (previz only)
- 15s max; ≤6 shots via `Shot 1 (0–3s): …`; native audio; negative field available.
- Only for cheap animatics. Recompile the final version for Seedance 2.5 / Veo 3.1 / MiniMax H3.

### Gemini Omni Flash (Google, May 2026) — GA
- Accepts text + images + audio + video refs in one prompt, and outputs high-res video with audio.
- **Rules:** describe the whole scene (subject, action, setting, light, camera). **Say "one continuous shot"** when you want no cuts. Assign a role to each attached ref. Direct the audio explicitly, including music if wanted. Outputs carry a SynthID watermark.

### Runway Gen-4.5 — GA · control
- Positive phrasing only; keep it simple and focused on motion.
- **I2V: describe motion, camera, and performance, and never re-describe the image.** Use references for consistency and motion brushes in the UI.
- The Detail Floor still applies: spend the 150+ words on physics, micro-performance, camera path, and light changes.

### Luma Ray3 family — GA · HDR plates
- Native 16-bit HDR (EXR) output; draft mode for iteration; keyframes (start/end); a reasoning-driven prompt interpreter.
- Write the full cinematic paragraph; name the HDR highlight intent ("specular highlights preserved above 1000 nits for HDR finishing").

### Wan 3.0 (Alibaba, open weights) — GA · open pipeline
- Prompt extension on; long descriptive English/Chinese prompts; **negative prompt supported and useful** (warped hands, flicker, text, watermark, low quality).
- Token-receptive, so raw meta tokens are OK.

### Happy Horse 1.0 (Alibaba) — GA
- Prompts up to **2,500 characters**; T2V, I2V, and R2V with **1–9 subject refs**; 720p/1080p.
- Best for e-commerce and short drama with a recurring subject. Be specific on subject, camera move, light, and mood.

### Sora 2 — SUNSET
- The API was retired 2026-09-24. Migrate existing Sora prompts to Veo 3.1 (dialogue) or Seedance 2.5 (sequences).

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

1. Generate the start frame on Nano Banana Pro or GPT Image 2.5 at the **video's exact aspect ratio**.
2. The video prompt **does not re-describe** the frame. It writes: what moves, how (physics), where the camera goes (endpoint), what light changes, and what is heard.
3. Carry the identity-lock string and the grade line verbatim, so a model that re-renders stays anchored.
4. For a last-frame-controlled clip, generate the end frame from the start frame via an edit (the same seed/refs) so geometry matches.

---

## Verification sources (2026-09-29): re-check these when a model updates

- Kling 4.0 announcement: futunn.com (Kuaishou Kling 4.0, 30s), pixelsham.com (2026-09-28), evolink.ai (Flash status: unconfirmed API); official release notes at kling.ai/release-note (empty at time of writing)
- Kling 3.0 Turbo / Omni: atlascloud.ai (2026-06-17 launch)
- Seedance 2.5: seed.bytedance.com ("One-take creation, flexible referencing"), fal.ai, higgsfield.ai prompting guides
- MiniMax H3: kapwing.com "How to Prompt MiniMax H3"; platform.minimax.io API docs
- Veo 3.1 / Gemini Omni Flash: Google DeepMind docs; atlabs.ai, openart.ai Omni Flash guides
- Sora sunset: OpenAI notices (app closed 2026-04-26, API sunset 2026-09-24)
- Leaderboards: llm-stats.com video/image arenas, Artificial Analysis
- Image models: GPT Image 2.5 (2026-09-08), Nano Banana Pro, Midjourney V8.2, FLUX.2, Seedream 5.0 Pro (buildmvpfast.com Sep 2026 roundup)
