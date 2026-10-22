---
name: seedance-2-5-prompting
description: >
  Technical reference for Dreamina Seedance 2.5's official prompt syntax and rules — the
  core prompt formula, reference-material role mapping (@Image/@Video/@Audio), multi-reference
  organization (name/map/group/profile/select), staging and timestamp rules, continuity system,
  camera-direction grammar, audio syntax, and the parameter rules for editing, subject/background
  replacement, forward/backward extension, first-and-last-frame, multi-keyframe, storyboard-grid,
  and blockout modes. Use this skill when the question is about *how Seedance 2.5 syntax works* —
  reference mapping, multi-reference setup, staging/timestamp structure, editing/extension
  parameter rules, or "what's the correct format for X." For actually writing a finished,
  ready-to-paste Seedance/Higgsfield prompt from a concept, use `cinema-director-v3` instead —
  that skill owns end-to-end prompt generation; this one is the syntax reference it (and you) can
  cite. Trigger on: "Seedance syntax", "reference material roles", "multi-reference mapping",
  "Seedance timestamp rules", "Seedance editing/extension parameters", "official Seedance prompt
  formula", "how do @Image/@Video/@Audio tags work".
---

# Seedance 2.5 Prompting — Official Syntax Reference

A technical reference for Dreamina Seedance 2.5's prompt grammar: what each syntax construct means, when to use stages vs. timestamps, how to map multi-reference materials, and the parameter rules for each of Seedance's generation modes.

**Scope note:** this is the *rules and syntax* layer. If the ask is "write me a Seedance/Higgsfield prompt for X," hand off to `cinema-director-v3` — it's the persona/generation skill and already knows this grammar. Reach for this skill when someone needs the underlying rule explained, wants to sanity-check a prompt against the spec, or needs a mode's exact parameter structure (editing, extension, keyframes, blockout, etc.).

**Sourcing:** ByteDance's own Feishu doc for this guide only survived as a table of contents in the browser snapshot that produced this skill (Feishu renders body text dynamically; see `references/bytedance-official-toc.md` for exactly what was and wasn't captured, plus the link to the real official doc and ByteDance's own installable skill command). The substantive rules below come from a third-party "Director Engine" system prompt (metricsmule.com) that independently documents the same Seedance 2.5 syntax in much more depth — full text in `references/director-engine-system-prompt.md`. Treat this skill as a well-sourced secondary reference, not a verbatim copy of ByteDance's own guide; when precision matters, cross-check against `docs.byteplus.com/en/docs/ModelArk/2607689`.

## Core Prompt Formula

For standard text-to-video:
```
SUBJECT + ACTION OR EVENT + SCENE AND ENVIRONMENT + VISUAL TREATMENT + CAMERA MOVEMENT OR CUTS + AUDIO
```
Always establish subject and primary action clearly; add optional elements only when they improve the result.

## Staging vs. timestamps

- **Default to stages** for ordinary narrative/process/demo videos: `[Generation Goal]` → `[Stage 1..N]` each with an *initial state*, *primary event* (one state change), and *end state* → `[Maintain Consistency]` listing identities, clothing, prop ownership, spatial direction, lighting, environment, audio relationships that must hold across stages. End states must be observable on screen ("the red case remains open beside her right hand"), never vague ("the scene feels complete").
- **Use timestamps** only when a moment needs precision — an entrance/exit, a handoff, a reveal, dialogue sync, a musical impact. Three forms: time range (`0–4 seconds: ...`), exact point (`At 6 seconds, ...`), relative (`Three seconds after X, Y happens`). Ranges must be consecutive, non-overlapping, and paced realistically — no "three attacks in one second."

Full templates: `references/director-engine-system-prompt.md` → STAGES AND END STATES / TIMESTAMP RULES.

## Reference-material mapping (@Image / @Video / @Audio)

Never say "use the uploaded references." Every reference gets an explicit job: what to inherit, what *not* to inherit, and which subject/prop/scene/motion/sound it belongs to.
```
@Image 1 defines <Character A>'s face, hairstyle, body proportions, and clothing.
@Video 1 defines only the fighting choreography and movement rhythm. Do not use the person, clothing, or environment from the video.
```
Multiple images of the same subject must say so explicitly ("all four images define one motorcycle — output contains only one continuous motorcycle") to prevent the model from treating views as copies.

## Multi-reference organization

For reference-heavy projects, work in this order: define every material's role → name and map every subject → group references by type → build a profile for important subjects → select only the relevant references per scene. Full `[Characters]` / `[Props]` / `[Scenes]` / `[Motion and Audio]` / `[Subject Profile]` / `[Scene N]` block structure: `references/director-engine-system-prompt.md` → MULTI-REFERENCE ORGANIZATION. Don't force every reference into every scene — the model should select per scene.

## Continuity system

Any multi-shot, multi-stage, extension, keyframe, or reference-based prompt needs an explicit continuity block covering: facial identity, hairstyle, body proportions, clothing, accessories, character/object count, prop ownership, environment layout, lighting/weather/time of day, camera axis, motion direction, dialogue ownership. State plainly: "keep each subject as the same continuous instance," "do not transfer clothing, props, dialogue, or actions between characters."

## Camera-direction grammar

Every shot needs: shot size, camera position/angle, focus subject, movement, movement direction/speed, and how it resolves. One dominant camera intention per shot, motivated by subject movement, new information, emotional change, impact, reveal, or a location change — not a random buzzword list. Named techniques (one-take, dolly zoom, aerial/FPV, bullet time, handheld, speed ramp, whip-pan transition) each have their own required parameters — see `references/director-engine-system-prompt.md` → CAMERA-DIRECTION SYSTEM / SPECIAL CAMERA TECHNIQUES.

## Audio syntax

```
Music: (description)
Sound effects: <description>
Dialogue: {spoken dialogue}
Subtitles: 【text】
```
For non-Chinese dialogue, reinforce language explicitly: `Dialogue language + accent + delivery style + speaker + {dialogue}`. Assign dialogue to a specific character — never let voice/audio roles drift between subjects.

## Mode-specific parameter rules

Each of these has its own required block structure — see the matching section in `references/director-engine-system-prompt.md`:

| Mode | Key rule |
|---|---|
| Existing-video editing | The source video is the *sole* editing master; state edit scope + everything to preserve explicitly. Never "make this video better." |
| Subject/object replacement | Name original + replacement, state exact count, replacement inherits the original's full timeline (position/rotation/occlusion/timing). |
| Background replacement | Preserve subject silhouette/identity/position/size/movement entirely; replace only the area outside the subject. |
| Audio editing | State which category changes, which timing/other sounds stay untouched. |
| Forward/backward extension | The source video's boundary frame controls continuity — match pose, props, background, camera, lighting, motion direction exactly before describing new content. |
| First-and-last-frame | Define `@Image 1` (first frame) and `@Image 2` (last frame) *separately*, never combined. First image controls aspect ratio. |
| Multi-keyframe | `@Image 1..N` in order, each describing a visible stage end-state; keyframes set stage order, not every intermediate frame. |
| Storyboard-grid | Grid defines shot order/composition only, not final style — explicitly exclude its line-art/labels unless requested. Keep to ≤ ~15 panels. |
| Blockout (coarse/fine) | Coarse = map each blockout object to a subject, ignore its gray geometry. Fine = preserve structure/action/camera, re-render appearance/materials/lighting. |
| One-click / seamless transition | One-click: assign each image a role + define per-image motion. Transition: define trigger, camera, visual transformation, arrival state, and audio bridge between the two clips. |

## Output format (when generating a full prompt)

1. **Recommended Settings** — mode, duration, aspect ratio, one-take vs. multi-shot, audio on/off (list separately from the prompt; note when the source material controls aspect ratio/duration instead, e.g. editing or extension).
2. **Final Seedance 2.5 Prompt** — one copy-paste-ready block, no explanations inside it.
3. **Reference Assignments** — only if references are used; what each one controls.
4. **Optional Creative Variations** — at most 3, only if they add real value.

## Quality checklist before shipping a prompt

Subject and primary action clear · beginning/development/ending present · each stage has one manageable state change with an observable end state · every reference states what to inherit and exclude · identity/clothing/count/prop-ownership/spatial relationships protected · camera direction visibly motivated · emotions backed by visible/audible cues · audio assigned to the right speaker · timestamps consecutive and non-overlapping · edit/extension/keyframe/blockout mode parameters fully specified · locked aspect-ratio/duration rules respected · no contradictions.

## Further reading

- `references/director-engine-system-prompt.md` — full verbatim source (interaction flow, smart-intake defaults, physical-realism and visual-treatment rules, natural-transition techniques, and every mode's complete template).
- `references/bytedance-official-toc.md` — what ByteDance's own guide covers (outline only) plus the official docs link and ByteDance's own installable skill command, for anyone who wants to go straight to the primary source.
