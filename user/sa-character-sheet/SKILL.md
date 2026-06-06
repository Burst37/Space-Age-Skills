---
name: sa-character-sheet
display_name: SPACE AGE — Consistent Character Sheet System
version: 1.0.0
last_updated: 2026-05
authority: Space Age AI Solutions — PROPRIETARY
description: >
  Generates ultra-realistic, identity-invariant consistent character reference
  sheets for use across image generation (ChatGPT Image 2.0 / NanoBanana Pro
  via Higgsfield MCP) and video generation (Seedance 2.0 / Kling 3.0).
  Supports all morphological classes: humanoid, creature, mecha, mascot, hybrid.
  8-page decomposition system. Storyboard-to-video handoff built in.
  Trigger on: "character sheet", "consistent character", "character reference",
  "create a character", "build a character", "character for the site".
trigger_phrases:
  - character sheet
  - consistent character
  - character reference
  - create a character
  - build a character
  - character for the site
  - character DNA
---

# SA CHARACTER SHEET SKILL
## Space Age AI Solutions — Identity-Invariant Character System

Generates production-ready consistent character reference sheets that maintain
identity across every image, video, and marketing asset in the pipeline.
Characters built here feed directly into Phase 2 (image gen) and Phase 3
(video gen via Seedance storyboard handoff).

---

## CORE PRINCIPLE

**Identity invariance** — once a character is defined, every output locks:
- Morphology (face topology, build, proportions)
- Chromatic signature (skin tone, hair color, eye color)
- Wardrobe DNA (garment shapes, materials, colors)
- Accessory topology (jewelry, props, signature items)
- Emotional range (expression set stays in character)

Never drift. Never reinterpret. Lock and propagate.

---

## MORPHOLOGICAL CLASSES

Declare the class before generating. Default is `humanoid` if unmarked.

| Class | Description | Example |
|-------|-------------|---------|
| `humanoid` | Realistic human character | Legend Grandma, Lianna, Chosen Legend, Haeun Park |
| `mecha` | Mechanical / robotic character | Kōda-08 |
| `creature` | Non-human organic character | Animals, monsters, fantasy beings |
| `mascot` | Stylized brand character | Logos brought to life |
| `hybrid` | Mix of two or more classes | Cyborg, creature-humanoid |

---

## CHARACTER SPECIFICATION SCHEMA

Fill all fields before generating any output. Claude auto-fills defaults
for non-critical fields and flags any gaps that affect core topology.

```yaml
CHARACTER_SPEC:

  # ── IDENTITY ──────────────────────────────────────────────────────────────
  identity:
    name: "[Character name]"
    title: "[Optional title or alias]"
    character_class: "humanoid | mecha | creature | mascot | hybrid"
    role_archetype: "[e.g. Music Artist / DJ, Retired Art Teacher, AI Guardian]"
    world_setting: "[e.g. Contemporary urban, Coastal California, Deep Space]"
    tagline: "[One sentence — who they are in their own words]"

  # ── PERSONALITY VECTOR ────────────────────────────────────────────────────
  personality:
    traits: ["[Trait 1]", "[Trait 2]", "[Trait 3]", "[Trait 4]", "[Trait 5]"]
    emotional_tone: "[e.g. Quiet / Reflective / Warm under calm]"
    energy_level: "introvert ←───●──── extrovert"
    core_theme: "[What this character represents in one phrase]"

  # ── MORPHOLOGY & SILHOUETTE ───────────────────────────────────────────────
  morphology:
    age: "[Number or range]"
    height: "[ft/in or cm]"
    build: "[e.g. Compact/Stocky, Slender, Athletic, Ethereal]"
    posture: "[e.g. Upright and commanding, Relaxed and grounded]"
    proportion_notes: "[Any distinctive proportions to preserve]"
    locomotion: "[How they move — striding, flowing, mechanical, etc.]"

  # ── FACE & HEAD ───────────────────────────────────────────────────────────
  face:
    face_shape: "[Oval, square, round, angular, etc.]"
    skin_tone: "[Descriptive + hex if known]"
    eye_color: "[Color + shape notes]"
    hair_color: "[Color + condition — e.g. silver-gray, natural coils]"
    hair_style: "[Style — e.g. loose updo, voluminous waves, cropped fade]"
    facial_hair: "[None / stubble / full beard — describe]"
    distinctive_features: "[Freckles, wrinkles, scars, jewelry, glasses]"
    makeup: "[None / natural glam / editorial / no makeup]"

  # ── CHROMATIC SIGNATURE ───────────────────────────────────────────────────
  color_palette:
    primary: "[Color name + hex]"
    secondary: "[Color name + hex]"
    accent: "[Color name + hex]"
    neutral: "[Color name + hex]"
    skin_reference: "[Hex or Pantone skin tone anchor]"
    notes: "[e.g. Sun-faded fabrics, muted earth tones, high-contrast brand colors]"

  # ── WARDROBE DNA ──────────────────────────────────────────────────────────
  wardrobe:
    style_category: "[e.g. Coastal Street / Timeless, Luxury Romantic, Urban Streetwear]"
    signature_pieces:
      - item: "[e.g. Lightweight olive overshirt]"
        detail: "[Material, condition, notable feature]"
      - item: "[e.g. Cream utility cargo pants]"
        detail: "[Material, condition, notable feature]"
      - item: "[e.g. Strap sandals]"
        detail: "[Material, condition, notable feature]"
    fabric_qualities: "[e.g. Sun-faded, worn-in, soft satin sheen, layered]"
    accessories:
      - "[Layered necklaces with pendant]"
      - "[Beaded bracelets]"
      - "[Round tinted sunglasses]"
    signature_prop: "[e.g. 7'2 mid-length surfboard, worn notebook, DJ equipment]"

  # ── HUMANOID FACE LOCK (identity invariance anchors) ─────────────────────
  face_lock:
    anchor_1: "[Most distinctive facial feature — locks first]"
    anchor_2: "[Second most distinctive — hair or eye color]"
    anchor_3: "[Skin tone reference]"
    variation_allowed: "[What CAN change — expression, lighting, angle]"
    variation_forbidden: "[What CANNOT change — bone structure, eye color, skin tone]"
```

---

## 8-PAGE DECOMPOSITION SYSTEM

Every character gets exactly 8 production pages. Never merge pages.
Each page is a standalone prompt optimized for image generation.

```
PAGE 1 — HERO PORTRAIT
  Full character reveal. Hero lighting. Primary composition.
  Establishes the definitive look. All identity anchors present.

PAGE 2 — TURNAROUND (4-VIEW)
  Front / 3-Quarter / Side / Back
  Neutral expression. Neutral lighting. Full wardrobe visible.
  Used for: 3D modeling reference, consistency checking.

PAGE 3 — EXPRESSION GRID (6-PANEL)
  Neutral / Joy / Serious / Contemplative / Surprised / Signature
  Consistent camera angle (medium close-up). Consistent lighting.
  Used for: video generation, marketing assets, social content.

PAGE 4 — OUTFIT BREAKDOWN
  Individual garment and accessory macros.
  Each item isolated: garment flat, detail close-up, material texture.
  Used for: wardrobe continuity, product integration.

PAGE 5 — ACTION POSES (4 POSES)
  Walking forward / Seated relaxed / Standing confident / Signature pose
  Full body. Environment appropriate to character world.
  Used for: lifestyle imagery, website hero, video start/end frames.

PAGE 6 — DETAIL STUDIES
  Face macro (skin texture, eyes, hair detail)
  Hands / accessories macro
  Signature prop macro
  Material texture macro
  Used for: video generation reference, close-up shots.

PAGE 7 — SILHOUETTE STUDY
  5 silhouettes: front / 3/4 / side / back / action
  Solid fill, no detail. Tests readability of character shape.
  Used for: logo integration, motion graphics, icon design.

PAGE 8 — IN ACTION / ENVIRONMENT
  Character in their natural world setting.
  3 scenarios: primary setting / secondary setting / unexpected setting
  Used for: storyboard reference, Phase 3 video start frames.
```

---

## PROMPT ARCHITECTURE — HUMANOID CLASS

Use this template for every page. Swap `[PAGE_DIRECTIVE]` per page above.

```
CHARACTER SHEET — [PAGE NAME]
Character: [Name], [Age], [Build]
Face lock: [Anchor 1] + [Anchor 2] + [Anchor 3]
Wardrobe: [Signature pieces from spec]
Color palette: [Primary] / [Secondary] / [Accent]

[PAGE_DIRECTIVE]

Lighting: [Page-appropriate lighting]
Camera: [Shot size and angle]
Style: [Photorealistic / Editorial / Illustrated]
Quality: Phase_One_IQ4_150MP.IIQ, DXO_MARK_tested, HDR10+,
         ARRI Alexa LF, Vogue editorial, commercial_hero_frame

IDENTITY LOCK — do not alter:
- Face structure: [Anchor 1]
- Hair: [Anchor 2]  
- Skin tone: [Anchor 3]
- [Any other critical locks]
```

---

## SA HOUSE STYLE — VISUAL DNA

Extracted from uploaded reference sheets. Apply to all SA character work.

### Photorealism Tier (Humanoid — Lifestyle/Business)
*Reference: Legend Grandma, Chosen Legend, Haeun Park*

```yaml
PHOTOREALISM_STYLE:
  feel: "Documentary editorial — real people, real moments, real texture"
  lighting:
    - "Natural light dominant — golden hour, overcast, window light"
    - "No artificial studio flatness — motivated, environmental"
    - "Shadows present and meaningful — not filled to death"
  color_grading:
    - "Muted, grounded palettes — sand, earth, ocean, charcoal"
    - "No oversaturation — life-worn, sun-faded, timeless"
    - "Skin tones anchor the grade — never drift from real"
  composition:
    - "Subject breathes in the frame — generous negative space"
    - "Environment tells the story — location is character"
    - "Rule of thirds preferred — centered only for power poses"
  texture:
    - "Fabric imperfections visible — worn-in, lived-in"
    - "Skin texture real — pores, lines, character marks preserved"
    - "No AI polish — no plastic skin, no over-smoothed surfaces"
  camera_reference: "ARRI Alexa LF, Leica Summilux, Phase_One_IQ4_150MP"
```

### Fashion Editorial Tier (Humanoid — Luxury/Brand)
*Reference: Lianna*

```yaml
FASHION_EDITORIAL_STYLE:
  feel: "Luxury editorial — confident, aspirational, intentional"
  lighting:
    - "Soft key with rim separation — luminous, not harsh"
    - "Fabric catches light — satin sheen, lace detail visible"
    - "Warm gold tones in highlights"
  color_grading:
    - "Blush / rose dust / warm gold / soft satin"
    - "High-end warmth — never cold or clinical"
  composition:
    - "Multiple angles per sheet — front, back, 3/4, low angle, full fours"
    - "Annotation arrows pointing to detail features"
    - "Aged parchment or cream background — not stark white"
  texture:
    - "Fabric hero — satin sheen, lace pattern, sheer movement"
    - "Skin luminous but real — not airbrushed flat"
  camera_reference: "Sony Venice 2, Leica Summilux, Phase_One_IQ4_150MP"
```

### Technical Illustration Tier (Mecha/Creature)
*Reference: Kōda-08*

```yaml
TECHNICAL_ILLUSTRATION_STYLE:
  feel: "Concept art + technical drawing — museum-quality design documentation"
  lighting:
    - "Clean ambient base + directional accent to show form"
    - "Glowing internal elements — energy cores, sensor arrays"
    - "White or near-white background for technical pages"
  color_grading:
    - "Desaturated base with accent color pops"
    - "Material-based: ceramic ivory, oxidized bronze, pale teal glow"
  composition:
    - "Multi-panel technical layout — orthographic views"
    - "Scale indicators included"
    - "Detail study panels alongside primary view"
    - "Silhouette study row at bottom"
  annotation: "Technical labels in clean sans-serif — part names, materials"
  style_tokens: "concept art, technical illustration, orthographic, design sheet"
```

---

## STORYBOARD → VIDEO HANDOFF

After character is approved, generate a storyboard for Phase 3 video.

```
STORYBOARD_PROMPT_STRUCTURE:
  format: "Sequential shot-by-shot — treat every panel as independent cinematic shot"
  rule: "Follow storyboard shot for shot — character = character reference, no text/labels/watermarks in video"
  audio: "No score or music cues in the prompt — handled separately in Phase post-production"

STORYBOARD_SHOT_TEMPLATE:
  Shot [N]: [Shot size] — [Action description]
  [Subject action] / [Camera movement] / [Lighting note] / [Emotional beat]

EXAMPLE (from uploaded reference):
  Shot 1: Extreme close-up — only spear visible, birds perched, total stillness, tense silence, elegant composition
  Shot 2: Spear suddenly shifts into motion, birds violently burst into flight, feathers explode outward
  Shot 3: Reveal — female performer, spear completes powerful rotational flourish
  Shot 4: Medium shot — controlled spin, intense focus, sharp foot placement
  ...
  Shot 12: Final hero finish — overwhelming pose, entire arena visually erupts around performer

VIDEO_GENERATION_HANDOFF:
  tool: "Seedance 2.0 (default) or Kling 3.0 (camera-move-heavy storyboards)"
  delivery: "Higgsfield MCP"
  reference: "Page 8 (In Action) + Page 5 (Action Poses) as start/end frames"
  prompt_input: "Full storyboard sequence above"
```

---

## PHASE 2 INTEGRATION

When building a website for a client (pipeline or direct), generate:

```yaml
WEBSITE_CHARACTER_BRIEF:
  required_pages: [1, 2, 5, 8]   # Hero + Turnaround + Action + Environment
  optional_pages: [3, 4, 6, 7]   # Add if character features heavily in site
  image_model:
    default: "ChatGPT Image 2.0 via Higgsfield MCP"
    gemini_lane: "NanoBanana Pro via Higgsfield MCP"
  output_formats:
    hero_banner: "21:9 — Page 1 hero shot"
    social_square: "1:1 — Page 3 expression grid crops"
    mobile_portrait: "9:16 — Page 5 action pose"
    og_image: "1200×630 — Page 1 hero crop"
```

---

## NEVER DO

- Never merge multiple pages into one collage output
- Never let face topology drift between pages — re-anchor every prompt
- Never use generic beauty lighting for documentary-style characters
- Never over-smooth skin on photorealistic humanoids — texture = authenticity
- Never generate a storyboard before Pages 1 and 2 are approved
- Never send character to video generation without Page 8 as the start frame reference
