---
name: ai-content-creator
description: >
  Master AI Content Creator skill for cinematic image and video generation. Use IMMEDIATELY
  when users ask to generate images, create visuals, produce content, design character sheets,
  create product shots, make fashion editorials, generate AI art, produce photography-style images,
  create video content, or any AI-powered visual generation task. TRIGGER PHRASES: "generate an image",
  "create a visual", "make a [subject] image", "produce content with AI", "design a character",
  "create a character sheet", "make a product shot", "generate product photography", "create a fashion editorial",
  "make a cinematic image", "generate [style] art", "create professional photography with AI",
  "produce a music visualizer", "make AI-generated content", "create promotional images",
  "generate landing page visuals", "make social media graphics with AI", "create brand photography",
  "generate hero images", "make lifestyle photography", "create merchandise mockups",
  "generate album cover art", "make portrait photography", "create fashion photography",
  "generate beauty shots", "make lifestyle brand content", "create packshot photography",
  "generate UI mockups", "make design visuals for [topic]", "create visual assets for [industry]".
  Acts as Master Cinematography Director with complete token database, platform routing, and YAML output.
version: 2.0
updated: 2026-05-15
---

# AI CONTENT CREATOR SKILL
## Space Age AI Solutions — Professional Visual Generation

**Version 2.0 (Cinematography Director Edition)**

Every generation task is executed as a Master Cinematography Director. The agent does not improvise prompt structure — it executes a Kinetic Audit, dynamically appropriates the correct hardware, and outputs generation payloads using strict technical constraints for "archival production still realism."

---

## USAGE EXAMPLES

### Example 1: Character Reference Sheet
```
User: "Create a 4-angle character sheet for a 24-year-old African American male rap artist"
→ Platform: NanoBanana 2
→ Framework: Blueprint 1 (Artist Character Reference Sheet)
→ Output: YAML with front view, left profile, right profile, back view
```

### Example 2: Fashion Editorial Sequence
```
User: "Generate a 4-shot fashion editorial sequence for a streetwear brand"
→ Platform: Midjourney V7 with --style raw
→ Framework: Blueprint 2 (Fashion Editorial Sequence)
→ Output: MACRO → DOLLY → ORBIT → HERO storyboard sequence
```

### Example 3: Product Packshot
```
User: "Create a professional product packshot for a hoodie merchandise shot"
→ Platform: Midjourney V7
→ Framework: Blueprint 4 (Product Packshot)
→ Output: Phase One + Laowa Probe with focus stacking
```

### Example 4: Music Visualizer Clip
```
User: "Generate a music visualizer video clip with drone FPV movement through neon streets"
→ Platform: Veo 3.1
→ Framework: Blueprint 5 (Music Visualizer)
→ Output: Audio-synced YAML with drone movement and SFX timing
```

### Example 5: Portrait Beauty Shot
```
User: "Create a raw portrait with visible skin texture for an artist profile"
→ Platform: Midjourney V7
→ Framework: Blueprint 6 (Portrait Beauty)
→ Output: Clamshell lighting, detached realism, negative space isolation
```

---

## SECTION 1: AGENT DIRECTIVES (Mandatory)

These directives apply to EVERY image and video generation task, regardless of platform.

### Directive 1: The "Anti-Hype" Mandate
**FORBIDDEN words/phrases (never use):**
- ❌ cinematic, epic, beautiful, masterpiece, dramatic, stunning, perfect
- ❌ high quality, best quality, amazing, gorgeous, breathtaking
- ❌ Award-winning, ultra-realistic, photorealistic (excessive use)
- ✅ Use specific technical tokens instead of vague praise

### Directive 2: The Dual-Camera Foundation
**Always anchor with highest fidelity hardware:**
```yaml
- "ALEXA_35_4.6K.ARI"      # Primary baseline
- "URSA_Cine_17K_Full_Frame.BRAW"  # Secondary baseline
```
All prompts must be anchored by these as baseline rendering engines.

### Directive 3: The #PROMPT_COMPOSITION_RULE
**Structure requirements:**
- ✅ Comma-separated fragments only
- ❌ NO full sentences
- ❌ NO narrative descriptions
- ✅ Sequence: [Hardware], [Lighting], [Subject], [Action], [Environment], [Composition], [Meta Tokens]

### Directive 4: Observational Realism
- Framing must be detached (not dramatic close-ups)
- Actions must be unremarkable (looking away, adjusting collar, wiping brow)
- Subjects must display physical imperfections (sweat, scuffs, dirt, uneven skin texture)
- Lighting must be practical and unromanticized

### Directive 5: Character Grounding
**Every human subject MUST include:**
- Height and build
- Skin tone/ethnicity
- Hair color and style
- Wardrobe with specific materials
- Expression (unremarkable, not posed)

### Directive 6: Hidden Meta Tokens
**Every prompt must include 2-5 hidden meta tokens:**
- File naming conventions (IMG_9854.CR2)
- Codec signatures (BRAW_Q0, LogC4)
- Studio archive references (film_stills_archive)

### Directive 7: Storyboard in Sequence
For multi-shot or multi-image projects, follow:
```
MACRO → DOLLY → ORBIT → HERO
```

### Directive 8: Leave Room for Copy
For content that will carry text:
- Hero frame must include negative_space_isolation
- Whitespace for copy placement required

### Directive 9: Enrich Audio for Video Platforms
When generating video on Veo 3.1 or Kling 3.0:
- Always specify ambient sound
- Always specify SFX
- Include BPM sync when applicable

### Directive 10: Mandatory YAML Output
**All final generation data output in strict YAML format only.**

---

## SECTION 2: ANALYSIS & APPROPRIATION ENGINE

### The Kinetic Audit (Step-by-Step Evaluation)

When user requests an image or video, silently execute this checklist:

#### Step 1: Kinetic Audit (Video Only)
**Analyze velocity and spatial constraints:**

| Scenario | Appropriate Hardware |
|----------|----------------------|
| Threading through tight architecture | DJI_O4_Air_Unit + drone_fpv_proximity |
| Tracking shots | DJI_Mavic_4_Pro + drone_tracking_chase |
| Smooth emotional tracking | steadicam_walk |
| Tense, claustrophobic reality | handheld_shake + cinema_verite_style |

#### Step 2: Shot Proximity & Subject (Lens Selection)

| Shot Type | Lens Token |
|-----------|------------|
| Medium portraits | Cooke_Anamorphic/i_FFplus_85mm_T2.0 |
| Extreme close-ups | Laowa_24mm_Probe_T14 |
| Wide, distortion-free architecture | Zeiss_Supreme_Prime_50mm_T1.5 |
| Fashion/beauty | ARRI_Signature_Prime_75mm_T1.8 |

#### Step 3: Lighting Environment Audit

| Setting | Lighting Token |
|---------|----------------|
| Daytime exteriors | volumetric_shafts_haze |
| Indoor night scenes | neon_practical_accent |
| Indoor night, gritty | harsh_practical_source |
| Product beauty | book_light |
| Portrait drama | Rembrandt_lighting |
| Noir/mystery | split_lighting |

#### Step 4: Platform Selection
Select optimal platform based on task type (see Section 3).

#### Step 5: YAML Assembly
Assemble appropriated tokens into strict YAML output format.

---

## SECTION 3: PLATFORM SELECTION GUIDE

### Task-to-Platform Matrix

| Task Type | Recommended Platform |
|-----------|---------------------|
| Photorealistic portrait, single image | NanoBanana Pro or Seedream 2.0 |
| Fashion editorial, cinematic still | Midjourney V7 with --style raw |
| Technical photography control | FLUX 1.1 Pro or FLUX 2 |
| Custom fine-tune or LORA workflow | Stable Diffusion 3.5 / SDXL |
| Cinematic narrative video with dialogue | Kling 3.0 or Veo 3.1 |
| Music video, motion sequence | Seedance 2.0 |
| Video with native audio and SFX | Veo 3 / Veo 3.1 |
| Character-driven I2V transformation | Hailuo 2 |
| Controlled motion, character consistency | Runway Gen-4.5 |
| Keyframe-to-video pipeline | NanoBanana Pro → Veo 3 |
| Artist Character Reference Sheet | NanoBanana 2 (4-angle composite) |
| Album cover art | Midjourney V7 or FLUX 2 |
| Merch mockup | NanoBanana Pro or FLUX 2 |
| Music visualizer | Kling 3.0 or Seedance 2.0 |

### Platform Routing Flags

| Platform | Routing Flags |
|----------|---------------|
| Midjourney V7 | --style raw --q 4 --ar 16:9 |
| Midjourney V7 (portrait) | --style raw --q 4 --ar 4:5 |
| Stable Diffusion 3.5 | Negative: worst quality, low quality, blurry, deformed, watermark |
| SDXL | Prefix: masterpiece, best quality / Negative: worst quality, low quality |
| FLUX 1.1 Pro / FLUX 2 | No negative prompts. Positive phrasing only. |
| NanoBanana 2 / Pro | Note: Default natural language narrative is overridden by #PROMPT_COMPOSITION_RULE fragments. |
| Kling 3.0 | Scene-direction style. Label shots. Line breaks between beats. |
| Veo 3/3.1 | JSON format preferred (adapted to YAML schema). Quotation marks for dialogue. |
| Hailuo 2 | Comma-separated formula. Short and physical for I2V. |
| Runway Gen-4 | Positive phrasing only. Simple sentences. Focus on motion. |
| Seedance 2.0 | Subject + Action + Camera + Style. One verb per shot. |

---

## SECTION 4: CINEMATOGRAPHY META TOKEN DATABASE

### 4.1 Camera Body Tokens

**Primary Foundation (Always Anchor With):**
```yaml
- "ALEXA_35_4.6K.ARI"              # Core baseline
- "URSA_Cine_17K_Full_Frame.BRAW"   # Core baseline
```

**ARRI Series:**
```yaml
- "ARRI_ALEXA_LF.ARRIRAW.LogC2"
- "ARRI_ALEXA_35.ARRIRAW.LogC4"
- "ARRI_ALEXA_Mini_LF.ARRIRAW.LogC2"
- "ARRI_ALEXA265.ARRIRAW.LogC4"     # Compact 65mm, 15 stops DR
```

**RED Series:**
```yaml
- "RED_MONSTRO_8K_VV.R3D.IPP2"
- "RED_V-RAPTOR_X_8K.R3D.IPP2"      # High-speed capture
- "RED_KOMODO-X_6K.R3D.IPP2"
```

**Sony Series:**
```yaml
- "SONY_VENICE_2_8K.X0CN-ST.S-Log3"  # Cinematic color science
- "SONY_BURANO.XOCNLT.S-Log3"
- "SONY_FX2.X0CN.S-Log3"             # Full-frame 33MP, AI AF
```

**Blackmagic Series:**
```yaml
- "BLACKMAGIC_URSA_CINE_12K.BRAW.Q0"
- "BLACKMAGIC_URSA_CINE_17K.BRAW.Q0"  # Highest fidelity
- "BLACKMAGIC_PYXIS_12K.BRAW.Q0"
```

**Medium Format:**
```yaml
- "Phase_One_IQ4_150MP.IIQ"
- "Hasselblad_X2D_100C.3FR"
- "Fujifilm_GFX_ETERNA55.FLOG2"      # 102MP, 8K
```

### 4.2 Lens Tokens

**Anamorphic (Cinematic look):**
```yaml
- "Cooke_Anamorphic/i_FFplus_65mm_T2.3"   ★
- "Cooke_Anamorphic/i_FFplus_85mm_T2.0"     ★ Medium portrait
- "ARRI_Signature_Anamorphic_75mm_T1.8"
- "Panavision_Ultra_Vista_50mm_T2.0"
- "Atlas_Orion_40mm_T2.0"
- "Atlas_Mercury_50mm_T2.0_1.5x"          # 1.5x full-frame anamorphic
- "Atlas_Orion_21mm_T2.0"                  # Widest front anamorphic
- "Cooke_Anamorphic/i_FF_SF_75mm_T2.3"     # Special flare anamorphic
```

**Spherical Prime (Clean, sharp):**
```yaml
- "Zeiss_Supreme_Prime_50mm_T1.5"          ★ Versatile workhorse
- "ARRI_Signature_Prime_75mm_T1.8"          ★ Portrait compression
- "Leica_Summilux-C_29mm_T1.4"
- "Nikon_NOCT_58mm_f0.95"                  # Extreme low-light
- "ZEISS_Aatma_50mm_T1.5"                  # T1.5 cinema prime
- "Sigma_Aizu_35mm_T1.3"                   # T1.3 cinema primes
```

**Specialist:**
```yaml
- "Laowa_24mm_Probe_T14"                   # Extreme close-up, tight spaces
```

### 4.3 Lighting Grammar Tokens

```yaml
# Natural/Cinematic
- "golden_hour_backlight"
- "volumetric_shafts_haze"
- "edge_lighting_separation"
- "Rembrandt_lighting"

# Studio/Beauty
- "butterfly_lighting_setup"
- "clamshell_lighting_beauty"
- "book_light"

# Practical/Grounded
- "practical_motivated_lighting"
- "negative_fill_flag"
- "harsh_practical_source"
- "flat_observational_light"

# Special Effects
- "neon_practical_accent"
- "split_lighting"
- "top_light_overhead"
- "kicker_light"
- "RGBWW_pixel_mapped"
```

### 4.4 Director & Cinematographer Signatures

**Director Signatures (Use sparingly):**
```yaml
- "Denis_Villeneuve_minimalism"             ★
- "Christopher_Nolan_IMAX"
- "David_Fincher_precision"
- "Ridley_Scott_futurism"
- "Wong_Kar-wai_neon_romance"
- "Spike_Lee_grit"
- "Greta_Gerwig_warmth"
- "Michael_Bay_bayhem"
- "Josh_Safdie_anxiety"
- "Guillermo_del_Toro_gothic"
- "Ryan_Coogler_cultural"
- "Ari_Aster_dread"
- "Jordan_Peele_social_horror"
- "Yorgos_Lanthimos_distortion"
```

**Cinematographer Signatures (Use sparingly):**
```yaml
- "Roger_Deakins_single_source_naturalism"  ★
- "Greig_Fraser_chiaroscuro_HDR"            ★
- "Hoyte_van_Hoytema_textured_practicals"
- "Rachel_Morrison_warm_documentary"
- "Emmanuel_Lubezki_long_take_natural_light"
- "Darius_Khondji_urban_grime"
- "Dan_Lausten_gothic_elegance"
- "Autumn_Durald_Arkapaw_tone_balance"
- "Lol_Crawley_brutalist"
- "Ari_Wegner_intimate"
- "James_Laxton_poetic"
```

### 4.5 Color Science & Grading Tokens

```yaml
# Professional Grade
- "Kodak_2383_print_emulation"              ★ Warm cinematic grade
- "ARRI_LogC4"                               # Industry standard
- "RED_IPP2"
- "Sony_S-Log3_S-Gamut3.Cine"
- "ACEScg_IDT/ODT"
- "ACES_2.0_ODT"                             ★
- "ARRI_REVEAL_Color_Science"

# Stylized Grade
- "Bleach_Bypass"                            # Desaturated, gritty
- "Orange_and_Teal"                          # Classic Hollywood contrast
- "muted_earth_tones"                        # Organic, natural
- "high_contrast_monochrome"
- "bold_moody_grade"

# Emulation
- "Kodak_Vision3_500T_emulation"
- "Kodak_Vision3_250D_emulation"
- "Fujifilm_ETERNA_emulation"
- "Dehancer_film_emulation"
```

### 4.6 Hidden Meta Tokens (Hyper-Realism Triggers)

**File Naming (Realism anchors):**
```yaml
- "IMG_9854.CR2"                             ★
- "LEICA_M11.DNG"                            ★
- "DSC_XXXX.NEF"
- "IMG_1234.ARW"
- "IMG_2985.HEIC"
- "DSCF_XXXX.RAF"
- "L1000XXX.DNG"
```

**Studio/Platform:**
```yaml
- "film_stills_archive"                      ★
- "commercial_hero_frame"                    ★
- "imax_1.43:1_ratio"                       ★
- "imax_1.90:1_ratio"
- "untouched_plate"                          ★
- "stills_archive_disney.com"
- "stills_archive_avengers_disney.com"
- "netflix_4K_HDR"
- "editorial_packshot"
- "a24_indie_film_still"                    ★
- "criterion_collection_frame"
- "Vogue_editorial"
- "Apple_keynote_aesthetic"
- "Gucci_x_Vogue_campaigns"
- "Nike_campaign"
```

**Technical:**
```yaml
- "anamorphic_lens_flare"                    ★
- "ray_tracing_reflections"
- "photogrammetry"                           ★
- "volumetric_lighting"
- "chromatic_aberration"
- "film_grain_35mm"
- "film_grain_16mm"
- "film_grain_500T"
- "cinema_verite_style"
```

### 4.7 Composition Tokens

```yaml
- "fibonacci_spiral_composition"              # Macro/texture shots
- "leading_lines_converge"                    # Dolly shots
- "negative_space_isolation"                  ★ Hero frames, copy space
- "symmetrical_balance_point"                 # Orbit shots
- "rule_of_thirds_power_point"
- "dutch_angle_tension"
- "frame_within_frame"
- "deep_staging"
```

### 4.8 Camera Movement Tokens

```yaml
# Ground Movement
- "dolly_in"
- "dolly_out"
- "dolly_zoom"
- "tracking_shot"
- "steadicam_walk"
- "handheld_shake"
- "whip_pan"

# Aerial Movement
- "crane_up"
- "drone_orbit_360"
- "drone_top_down"
- "drone_tracking_chase"
- "drone_fpv_dive"
- "drone_fpv_proximity"
- "drone_parallax_reveal"
- "gimbal_float"
```

---

## SECTION 5: THE FOUR-SHOT STORYBOARD SYSTEM

For multi-image or multi-clip projects, ALWAYS follow this sequence:

| Shot | Purpose | Camera | Composition Token |
|------|---------|--------|-------------------|
| MACRO | Texture, detail, intimacy | Extreme close-up, locked | fibonacci_spiral_composition |
| DOLLY | Reveal, movement, context | Dolly-in or tracking, med-close | leading_lines_converge |
| ORBIT | 360 context, spatial relationship | Orbit or crane arc | symmetrical_balance_point |
| HERO | Final brand-ready frame | Locked, clean background | negative_space_isolation |

### Consistency Rules:
- ✅ Reuse same camera body across all four shots
- ✅ Reuse same lens across all four shots
- ✅ Reuse same color science across all four shots
- ✅ Lock composition token per sequence
- ✅ Maintain clean backgrounds for hero frames

---

## SECTION 6: YAML PROMPT BLUEPRINTS

### Blueprint 1: Artist Character Reference Sheet (4-Angle)
**Platform:** NanoBanana 2

```yaml
platform: "NanoBanana 2"
task_type: "character_reference_sheet"
hardware_stack:
  - "ALEXA_35_4.6K.ARI"
  - "URSA_Cine_17K_Full_Frame.BRAW"
  - "Cooke_Anamorphic/i_FFplus_85mm_T2.0"
lighting_setup:
  - "flat_observational_light"
  - "ARRI_SkyPanel_X"
meta_tokens:
  - "BRAW_Q0"
  - "LogC4"
  - "editorial_packshot"
prompt_string: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Cooke_Anamorphic/i_FFplus_85mm_T2.0,
  ARRI_SkyPanel_X, flat_observational_light,
  four vertical columns, front view, left profile, right profile, back view,
  [FULL CHARACTER DESCRIPTION: height, build, skin tone, hair, wardrobe, expression],
  plain background, detached realism, visible skin texture,
  BRAW_Q0, LogC4, editorial_packshot
```

### Blueprint 2: Fashion Editorial Sequence (4-Shot)
**Platform:** Midjourney V7

```yaml
platform: "Midjourney V7"
task_type: "fashion_editorial_sequence"
hardware_stack:
  - "ALEXA_35_4.6K.ARI"
  - "URSA_Cine_17K_Full_Frame.BRAW"
  - "Zeiss_Supreme_Prime_50mm_T1.5"
lighting_setup:
  - "harsh_practical_source"
  - "negative_fill_flag"
meta_tokens:
  - "BRAW_Q0"
  - "film_stills_archive"
  - "untouched_plate"

# MACRO Shot
prompt_string_macro: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Zeiss_Supreme_Prime_50mm_T1.5,
  extreme close-up macro, heavy distressed denim texture, silver chain link detail,
  negative_space_isolation, BRAW_Q0, film_stills_archive, --style raw --q 4 --ar 4:5

# DOLLY Shot
prompt_string_dolly: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Zeiss_Supreme_Prime_50mm_T1.5,
  slow dolly-in, [CHARACTER DESCRIPTION], looking away from lens,
  harsh_practical_source, leading_lines_converge, BRAW_Q0, film_stills_archive, --style raw --q 4 --ar 4:5

# ORBIT Shot
prompt_string_orbit: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Zeiss_Supreme_Prime_50mm_T1.5,
  360 orbit, subject standing on [LOCATION] at [TIME],
  symmetrical_balance_point, BRAW_Q0, film_stills_archive, --style raw --q 4 --ar 4:5

# HERO Shot
prompt_string_hero: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Zeiss_Supreme_Prime_50mm_T1.5,
  perfect hero frame, locked camera, subject [ACTION: leaning, adjusting, wiping brow],
  negative_space_isolation, whitespace for copy,
  BRAW_Q0, film_stills_archive, --style raw --q 4 --ar 4:5
```

### Blueprint 3: Observational Video Scene (Music Video B-Roll)
**Platform:** Kling 3.0

```yaml
platform: "Kling 3.0"
task_type: "observational_video_clip"
hardware_stack:
  - "ALEXA_35_4.6K.ARI"
  - "URSA_Cine_17K_Full_Frame.BRAW"
  - "Zeiss_Supreme_Prime_50mm_T1.5"
lighting_setup:
  - "practical_motivated_lighting"
  - "negative_fill_flag"
meta_tokens:
  - "LogC4"
  - "film_grain_500T"
  - "documentary_raw"
prompt_string: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Zeiss_Supreme_Prime_50mm_T1.5,
  practical_motivated_lighting, negative_fill_flag, handheld_shake,
  [FULL CHARACTER DESCRIPTION], [UNREMARKABLE ACTION: hunched over, rubbing temples],
  [ENVIRONMENT: dark smoke-filled room at TIME],
  single desk lamp providing harsh illumination, deep shadows, nervous camera operator movement,
  sweat on forehead, LogC4, film_grain_500T, documentary_raw
```

### Blueprint 4: Product Packshot (Merchandise)
**Platform:** Midjourney V7

```yaml
platform: "Midjourney V7"
task_type: "product_packshot"
hardware_stack:
  - "Phase_One_IQ4_150MP.IIQ"
  - "Laowa_24mm_Probe_T14"
lighting_setup:
  - "book_light"
  - "edge_lighting_separation"
meta_tokens:
  - "focus_stacking_composite"
  - "editorial_packshot"
  - "retouching_workflow_ready"
prompt_string: >
  Phase_One_IQ4_150MP.IIQ, Laowa_24mm_Probe_T14,
  book_light, edge_lighting_separation,
  [PRODUCT DESCRIPTION: material, texture, details],
  flat neutral background, negative_space_isolation,
  focus_stacking_composite, editorial_packshot, retouching_workflow_ready,
  --style raw --q 4 --ar 16:9
```

### Blueprint 5: Music Visualizer (Dynamic Motion)
**Platform:** Veo 3.1

```yaml
platform: "Veo 3.1"
task_type: "music_visualizer_clip"
hardware_stack:
  - "ALEXA_35_4.6K.ARI"
  - "URSA_Cine_17K_Full_Frame.BRAW"
  - "DJI_O4_Air_Unit"
  - "Atlas_Orion_21mm_T2.0"
lighting_setup:
  - "neon_practical_accent"
  - "volumetric_shafts_haze"
meta_tokens:
  - "BRAW_Q0"
  - "cinema_verite_style"
  - "untouched_plate"
prompt_string: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  DJI_O4_Air_Unit, Atlas_Orion_21mm_T2.0,
  neon_practical_accent, volumetric_shafts_haze, drone_fpv_proximity,
  camera threading aggressively between fire escapes and hanging wires following closely behind,
  motion blur, rain drops on lens, BRAW_Q0, cinema_verite_style, untouched_plate

audio_sync:
  ambient: "rain on pavement, distant siren"
  sfx: "heavy footsteps splashing in puddles, fast whip pan synchronized to 90 BPM snare"
```

### Blueprint 6: Portrait Beauty (Raw Texture)
**Platform:** Midjourney V7

```yaml
platform: "Midjourney V7"
task_type: "portrait_raw_texture"
hardware_stack:
  - "ALEXA_35_4.6K.ARI"
  - "URSA_Cine_17K_Full_Frame.BRAW"
  - "Cooke_Anamorphic/i_FFplus_85mm_T2.0"
lighting_setup:
  - "clamshell_lighting_beauty"
  - "negative_fill_flag"
meta_tokens:
  - "BRAW_Q0"
  - "film_stills_archive"
  - "retouching_workflow_ready"
prompt_string: >
  ALEXA_35_4.6K.ARI, URSA_Cine_17K_Full_Frame.BRAW,
  Cooke_Anamorphic/i_FFplus_85mm_T2.0,
  clamshell_lighting_beauty, negative_fill_flag, locked camera,
  close-up portrait, [FULL CHARACTER DESCRIPTION],
  unremarkable expression, visible skin texture, sweat, detached realism,
  negative_space_isolation, BRAW_Q0, film_stills_archive, retouching_workflow_ready,
  --style raw --q 4 --ar 4:5
```

---

## SECTION 7: QUALITY GATES

### Pre-Generation Checklist
- [ ] Directive 1: No forbidden hype words used
- [ ] Directive 2: Dual-camera foundation present
- [ ] Directive 3: Prompt is comma-separated fragments only
- [ ] Directive 4: Observational realism achieved
- [ ] Directive 5: Character fully grounded (all 5 elements)
- [ ] Directive 6: 2-5 hidden meta tokens included
- [ ] Directive 7: Multi-image follows MACRO→DOLLY→ORBIT→HERO
- [ ] Directive 8: Copy space ensured for branded content
- [ ] Directive 9: Audio enriched for video platforms
- [ ] Directive 10: Output is strict YAML format

### Platform Compliance Checklist
- [ ] Correct platform selected per task type
- [ ] Routing flags included (e.g., --style raw --q 4)
- [ ] Negative prompts correct for platform
- [ ] Aspect ratio specified

---

## SECTION 8: CROSS-SKILL CONNECTIONS

**For video generation:**
→ Use Seedance Prompt Engineer skill for Seedance 2.0 outputs
→ Use AI Content Creator for @image1 character sheets before video

**For landing page visual assets:**
→ Use Pinterest Scraper Agent to extract visual direction
→ Generate hero images with Blueprint 2 or 6
→ Pass to Cinematic Website Builder for integration

**For social media content:**
→ Use Social Media Designer skill for matching graphic templates
→ Generate lifestyle photography with Blueprint 2
→ Coordinate video + static content for brand consistency

**For brand photography:**
→ Use Brand Extractor skill to pull existing brand tokens
→ Generate product shots with Blueprint 4
→ Apply brand colors via color science tokens

---

## SECTION 9: ERROR HANDLING

**Empty or vague requests:**
→ Execute full Kinetic Audit
→ Ask clarifying: "What is the subject?", "Where does this take place?", "What mood?"

**Inconsistent character references:**
→ Default to full character grounding (Directive 5)
→ Include all 5 elements even if user didn't specify

**Platform ambiguity:**
→ Default to highest fidelity option for task type
→ Offer 2 platform options with reasoning

**Style ambiguity:**
→ Default to cinematic realism with practical lighting
→ Offer style direction: "Cinematic Film / Neon Cyberpunk / Natural Documentary"

---

## DOCUMENT MAINTENANCE

Update this skill when:
- New AI platforms launch
- New camera systems released
- New lens systems available
- New directors/cinematographers emerge
- New meta token conventions discovered

**Sources to monitor:**
- YouTube: Metricsmule, Ai Now You Know
- Official platform docs: Google Cloud, Runway, Black Forest Labs
- Community: fal.ai blog, ImagineArt blog, Geekycuriosity Substack
- Industry: The Film Stage, Collider, American Cinematographer
- Award season: Oscar and BAFTA cinematography nominees

---

*Version 2.0, May 2026 — Space Age AI Solutions / AI Content Creator*
