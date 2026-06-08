---
name: sa-character-sheet
version: 1.0.0
description: Identity-invariant character reference sheet system for Space Age AI Solutions. Creates and maintains consistent character DNA across all AI image and video generation.
allowed-tools: Read, Write, Bash
---

# SA-CHARACTER-SHEET v1.0.0
## Space Age AI Solutions — Character Reference System

## When to load this skill

- Client or project requires a recurring character (brand mascot, model, AI persona)
- Music video needs character consistency across multiple shots
- Brand ambassador needs consistent visual identity
- User says "keep the character the same", "same person throughout", "character sheet"

---

## CHARACTER SHEET COMPONENTS

### 1. Identity Block
```yaml
character_id: "[CHAR_ID]"
name: "[Character Name]"
project: "[Project/Brand]"
created: "[Date]"
version: "1.0"
```

### 2. Facial DNA (forensic-level)
```yaml
facial_dna:
  face_shape: "[oval/round/square/heart/diamond]"
  jawline: "[strong/soft/defined/rounded]"
  cheekbones: "[high/prominent/subtle]"
  forehead: "[wide/narrow/prominent]"
  eye_shape: "[almond/round/hooded/upturned]"
  eye_color: "[specific description]"
  nose: "[straight/aquiline/button]"
  lips: "[full/thin/defined bow]"
  skin_tone: "[hex or foundation shade]"
  distinctive_marks: "[moles, freckles, scars]"
```

### 3. Body Specs
```yaml
body:
  height: "[ft/in]"
  build: "[athletic/slim/average/muscular]"
  shoulders: "[narrow/medium/broad]"
```

### 4. Style Matrix
```yaml
style_matrix:
  casual: "[outfit description]"
  professional: "[outfit description]"
  hero: "[signature look for key shots]"
  accessories: "[consistent accessories]"
```

### 5. Consistency Token
```
[CHAR_ID]_LOCK = "face_id:[hash], body:[build], hair:[current_style], style:[look]"
```

---

## GENERATION PROMPT TEMPLATE

For every image generation call:

```
[Character Name], [facial_dna summary], [height/build],
[current outfit from style_matrix].
[Scene/action description].
[Lighting]. [Camera]. [Aesthetic reference].
Consistency: [CHAR_ID]_LOCK applied.
```

---

## MULTI-SHOT CONSISTENCY PROTOCOL

For music videos and campaigns:
1. Generate base reference sheet (turnaround) first
2. Lock the character DNA as a style reference
3. Include turnaround image as reference in all subsequent generations
4. Use identical camera specs and lighting for same-scene shots
5. Vary only: pose, expression, environment, outfit (from style matrix)

---

## INTEGRATION

- Feeds into: `cinematic-video-architect` (include character DNA in prompts)
- Feeds into: `music-video-editor` (character consistency across shots)
- Uses: `production-pipeline-orchestrator` Phase 2B for detailed sheet generation
- Works with: Higgsfield MCP reference image input
