---
name: seedance-prompt-engineer
description: >
  Expert Seedance 2.0 video prompt engineering skill. Use IMMEDIATELY when users ask to
  create, generate, or produce videos using Seedance 2.0. TRIGGER PHRASES: "generate a video",
  "create a Seedance video", "make a video using Seedance", "produce video content",
  "create a cinematic video", "make a music video", "generate video with Seedance",
  "video prompt for [subject]", "create [topic] video", "make [action] video",
  "generate [style] video", "create a commercial", "make an advertisement video",
  "produce a product video", "create a promotional video", "make a social media video",
  "generate a TikTok video", "create Instagram Reels content", "make a YouTube short",
  "create a short film", "make a cinematic scene", "generate a music visualizer",
  "create video with multiple shots", "make a multi-shot video sequence",
  "create continuous one-take shot", "generate drone footage video", "make a 360 video",
  "create vehicle showcase video", "generate DJ/nightlife video", "make a club scene video".
  Combines cinematography meta tokens, multi-shot sequencing, and Seedance-specific prompt frameworks.
  Outputs production-ready YAML prompts with hardware stack, lighting, camera movement, and reference tags.
version: 1.0
updated: 2026-05-15
---

# SEEDANCE 2.0 PROMPT ENGINEER SKILL

## Space Age AI Solutions — Professional Video Generation

This skill transforms simple user ideas into high-fidelity, production-ready Seedance 2.0 video prompts. Follow the Multi-Shot MVP System or Director's Card Framework based on complexity.

---

## USAGE EXAMPLES

### Example 1: Simple Video Request
```
User: "Create a video of a woman DJ performing at a nightclub"
→ Framework: Director's Card (single subject + action)
→ Output: YAML prompt with @image1 reference and @audio1
```

### Example 2: Multi-Shot Production
```
User: "Generate a continuous one-take video flying through a club into a neon street"
→ Framework: Multi-Shot MVP (3+ shots with timestamps)
→ Output: Timestamped sequence [00:00] → [00:03] → [00:06]
```

### Example 3: Character-Driven Scene
```
User: "Make a video where a man in an Armani suit sings with a DJ woman at a club"
→ Framework: Director's Card with @image1, @image2, @image3 references
→ Output: Multi-reference prompt with audio sync
```

### Example 4: Video Transformation
```
User: "Apply the motion from this video to my character image"
→ Framework: Motion Transfer utility
→ Output: "apply the motion of @video1 to @image1"
```

---

## FRAMEWORK SELECTION

### When to Use Multi-Shot MVP:
- Multi-environment scenes (club → street → rooftop)
- Complex camera movements (drone → handheld hybrid)
- Sequential storytelling with timestamps
- 3+ distinct shot types

### When to Use Director's Card:
- Single subject with specific action
- Character consistency across clips
- Style/lens consistency requirements
- Simple scene with detailed technical specs

---

## FRAMEWORK 1: MULTI-SHOT MVP SYSTEM

### System Prompt Template

You are a world-class AI Cinematographer and Seedance 2.0 Prompt Engineer. Your goal is to transform simple user ideas into high-fidelity, multi-shot video prompts.

**Required for every request:**
1. Break the scene into a logical sequence (Shot 1, Shot 2, Shot 3...)
2. Assign specific timestamps in [MM:SS] format for every shot transition
3. Incorporate technical camera movements (Dolly, Crane, Handheld, 360-degree orbit)
4. Use reference tags (@image1, @video1, @audio1) to anchor characters and sounds
5. Emphasize "Optical Truth": prioritize realistic textures, lighting (Golden Hour, Cinematic Rim Light), and "Impossible Physics" for smooth transitions

**Output Format:** Single continuous paragraph that Seedance can read.

### Multi-Shot Template Structure

```yaml
platform: "Seedance 2.0"
framework: "Multi-Shot MVP"
shots:
  - timestamp: "[00:00]"
    description: "Shot 1 setup, camera movement, subject action"
  - timestamp: "[MM:SS]"
    description: "Shot 2 transition, new environment or angle"
  - timestamp: "[MM:SS]"
    description: "Shot 3 continuation or final beat"
style_requirements:
  - "ultra-smooth transitions"
  - "no cuts"
  - "impossible physics camera path"
audio_sync: "@audio1"
references:
  - "@image1"  # Primary character
  - "@image3"  # Secondary character (if applicable)
```

### Cinematic Camera Movements Reference

| Movement | Token | Use Case |
|----------|-------|----------|
| Dolly In | dolly_in | Intimate reveal, tension building |
| Dolly Out | dolly_out | Context reveal, pulling away |
| Tracking Shot | tracking_shot | Following subject through space |
| Crane Up | crane_up | Epic reveal from ground to sky |
| Steadicam Walk | steadicam_walk | Emotional, grounded movement |
| Handheld Shake | handheld_shake | Documentary, gritty realism |
| Drone Orbit 360 | drone_orbit_360 | Spinning reveal, spatial context |
| Drone FPV Dive | drone_fpv_dive | Aggressive entry, high energy |
| Drone Tracking Chase | drone_tracking_chase | Following fast movement |
| Gimbal Float | gimbal_float | Smooth, weightless movement |

### Lighting Styles for Video

| Style | Token | Effect |
|-------|-------|--------|
| Golden Hour Backlight | golden_hour_backlight | Warm, soft, romantic |
| Cinematic Rim Light | edge_lighting_separation | Subject pop, drama |
| Neon Practical Accent | neon practical accent | Nightlife, urban energy |
| Volumetric Shafts Haze | volumetric_shafts_haze | Cinematic dust, atmosphere |
| Harsh Practical Source | harsh practical source | Documentary, gritty |
| Book Light | book_light | Product beauty, even |

---

## FRAMEWORK 2: DIRECTOR'S CARD FRAMEWORK

### System Prompt Template

Act as a world-famous Film Director and Expert Scriptwriter. We are creating a "Director's Card" for a Seedance 2.0 production.

**Use this structure for all prompt outputs:**
```
[Subject/Character @image1] + [Specific Kinetic Action] + [Environment/Setting] + [Visual Style/Aesthetic] + [Camera Movement/Lens Cue] + [Lighting/Mood]
```

**Required specifications:**
- Focal length (e.g., 24mm wide or 85mm tight)
- Lighting contrast (e.g., High-key or Blade Runner-style Neon)

### Director's Card Template Structure

```yaml
platform: "Seedance 2.0"
framework: "Director's Card"
subject: "@image1"
action: "Specific kinetic action description"
environment: "Setting and atmosphere"
visual_style: "Aesthetic direction (e.g., Blade Runner neon, cinematic film)"
camera:
  movement: "Camera movement token"
  lens: "Lens token with focal length"
  focal_length: "24mm wide / 85mm tight"
lighting:
  style: "Primary lighting token"
  contrast: "High-key / Low-key / Neon"
  mood: "Emotional quality of light"
references:
  characters: ["@image1", "@image2", "@image3"]
  audio: "@audio1"
```

---

## REFERENCE-BASED UTILITY PROMPTS

### Motion Transfer
```
apply the motion of @video1 to @image1
```
**Use when:** User wants character/image to perform motions from a reference video.

### Character Swap
```
Replace the character in @video1 with the character from @image1
```
**Use when:** User wants to substitute a character while preserving background/motion.

### Audio/Lip-Sync
```
The character from @image1 speaks the dialogue from @audio1 with the same emotional delivery
```
**Use when:** User wants character to deliver specific dialogue with matching emotion.

### Natural Transition
```
Using @video1 as the beginning and @video2 as the end, generate a natural transition between the two references
```
**Use when:** User wants seamless blend between two video segments.

---

## CINEMATIC SCENE PROMPTS

### Scene Type 1: 360 Vehicle View
```
Camera performs a 360-degree orbit around a supercar on a luxury backdrop with dynamic rim lighting.
Drone orbit 360, edge_lighting_separation, cinematic rim light, HDR10+, ultra-slow motion at 120fps.
@image1 for vehicle reference, @video1 for motion reference.
```

### Scene Type 2: DJ Nightclub Sequence
```
Woman @image1 wearing trendy nightlife outfit, DJing at a popular club, singing lyrics.
Use colors similar to @image2 style reference.
Use audio @audio1 for rhythm synchronization.
Man @image3 wearing black Armani suit, gold chain, black sunglasses, enters and sings the same song.
Crowd excited and energetic.
```

### Scene Type 3: Hollywood One-Take
```
Create a continuous one-take shot moving through multiple environments seamlessly.
Drone plus handheld hybrid movement.
[00:00] Camera flying through a window into a popular crowded Las Vegas lively club.
[00:03] Shot 2 begins with transition into handheld perspective following woman character @image1.
She is with a man @image3.
[00:06] Shot 3: Exits club into rainy neon street.
Style: ultra-smooth transitions, no cuts, impossible physics camera path.
Use @audio1 for rhythm synchronization.
```

### Scene Type 4: Candy Land Style Transformation
```
Character @image1 enters candy-colored fantasy environment @image2.
Use dreamy soft lighting, pastel color palette, magical atmosphere.
Camera performs gentle dolly-in as character explores the surreal landscape.
```

### Scene Type 5: Product Reveal
```
Cinematic product @image1 reveal on dramatic dark background.
Single dramatic spotlight from above, volumetric haze.
Camera slowly orbits 360 degrees around product.
Title text appears with chromatic aberration effect.
[00:00] Teaser: Product blurred/silhouette
[00:03] Reveal: Full dramatic product hero with edge_lighting_separation
[00:06] Features: Close-up shots of key details
```

### Scene Type 6: Fashion Runway
```
Model @image1 walking down illuminated runway.
Follow shot with steadicam_walk movement.
Dramatic side lighting creating high contrast shadows.
[00:00] Model enters frame from distance
[00:02] Close tracking alongside model
[00:04] Final hero shot at end of runway with flashbulb effects
```

---

## OPTICAL TRUTH PRINCIPLES

### What to Include for Realistic Textures:
- Visible skin texture, imperfections (sweat, scuffs, dirt)
- Fabric texture and movement
- Environmental detail (dust particles, atmospheric haze)
- Practical lighting sources in frame

### Impossible Physics (for smooth transitions):
- Camera threading through tight spaces
- Seamless environment transitions (interior to exterior)
- Gravity-defying movements
- Speed ramp transitions

### Lighting Authenticity:
- Always specify practical light sources
- Use volumetric effects for atmosphere
- Match lighting to time of day/night setting
- Include light interactions (reflections, rim light separation)

---

## CINEMATOGRAPHY META TOKENS FOR SEEDANCE

### Hardware Stack (Dual-Camera Foundation)

**Primary Cinema Cameras:**
```yaml
- "ALEXA_35_4.6K.ARI"
- "URSA_Cine_17K_Full_Frame.BRAW"
```

**For specific looks:**
- `ARRI_ALEXA265.ARRIRAW.LogC4` — Compact 65mm, 15 stops DR
- `RED_V-RAPTOR_X_8K.R3D.IPP2` — High-speed capture
- `SONY_VENICE_2_8K.X0CN-ST.S-Log3` — Cinematic color science

### Lens Tokens for Video

**Anamorphic (Cinematic look):**
- `Cooke_Anamorphic/i_FFplus_85mm_T2.0` ★ — Medium portrait
- `Cooke_Anamorphic/i_FFplus_65mm_T2.3` ★ — Wider coverage
- `Panavision_Ultra_Vista_50mm_T2.0` — Ultra-wide without distortion

**Spherical Prime (Clean, sharp):**
- `Zeiss_Supreme_Prime_50mm_T1.5` ★ — Versatile workhorse
- `ARRI_Signature_Prime_75mm_T1.8` ★ — Portrait compression
- `Nikon_NOCT_58mm_f0.95` — Extreme low-light

**Specialist:**
- `Laowa_24mm_Probe_T14` — Extreme close-up, tight spaces

### Lighting Tokens

| Token | Use Case |
|-------|----------|
| `golden_hour_backlight` | Warm romantic scenes |
| `volumetric_shafts_haze` | Cinematic atmosphere |
| `neon_practical_accent` | Nightlife, urban, club |
| `edge_lighting_separation` | Subject pop, drama |
| `harsh_practical_source` | Documentary, gritty realism |
| `butterfly_lighting_setup` | Fashion, beauty |
| `Rembrandt_lighting` | Classic portrait drama |
| `split_lighting` | Noir, mystery |

### Hidden Meta Tokens (Hyper-Realism Triggers)

**File Naming (Realism anchors):**
- `IMG_9854.CR2` ★
- `LEICA_M11.DNG` ★
- `DSC_XXXX.ARW`

**Studio/Platform:**
- `film_stills_archive` ★
- `commercial_hero_frame` ★
- `imax_1.43:1_ratio` ★
- `untouched_plate` ★
- `a24_indie_film_still`

**Technical:**
- `anamorphic_lens_flare` ★
- `volumetric_lighting`
- `film_grain_35mm`
- `cinema_verite_style`

### Color Science Tokens

| Token | Effect |
|-------|--------|
| `Kodak_2383_print_emulation` ★ | Warm cinematic grade |
| `ARRI_LogC4` | Industry standard color science |
| `ACES_2.0_ODT` ★ | Professional color pipeline |
| `Bleach_Bypass` | Desaturated, gritty look |
| `Orange_and_Teal` | Classic Hollywood contrast |
| `muted_earth_tones` | Organic, natural palette |

---

## DIRECTOR/CINEMATOGRAPHER SIGNATURE TOKENS

Use sparingly — appropriate only when specific grading or framing is required.

### Director Signatures:
- `Denis_Villeneuve_minimalism` ★
- `Christopher_Nolan_IMAX`
- `David_Fincher_precision`
- `Ridley_Scott_futurism`
- `Wong_Kar-wai_neon_romance`
- `Spike_Lee_grit`
- `Greta_Gerwig_warmth`
- `Michael_Bay_bayhem`

### Cinematographer Signatures:
- `Roger_Deakins_single_source_naturalism` ★
- `Greig_Fraser_chiaroscuro_HDR` ★
- `Hoyte_van_Hoytema_textured_practicals`
- `Rachel_Morrison_warm_documentary`
- `Emmanuel_Lubezki_long_take_natural_light`

---

## OUTPUT FORMAT: YAML ASSEMBLY

All Seedance prompts must be output in strict YAML format:

```yaml
platform: "Seedance 2.0"
framework: "Multi-Shot MVP | Director's Card"
task_type: "music_video | commercial | social_content | cinematic_scene"

hardware_stack:
  - "ALEXA_35_4.6K.ARI"
  - "URSA_Cine_17K_Full_Frame.BRAW"
  - "[Lens Token]"

lighting_setup:
  - "[Primary Light Token]"
  - "[Secondary/Accent Token]"

meta_tokens:
  - "LogC4"
  - "film_stills_archive"
  - "untouched_plate"

prompt_string: >
  [Hardware], [Lighting], [Camera Movement], [Subject @image1],
  [Action], [Environment], [Composition], [Meta Tokens]

references:
  image1: "[Character reference URL]"
  image2: "[Style reference URL]"  # optional
  image3: "[Secondary character URL]"  # optional

audio_sync:
  ambient: "[Description]"
  sfx: "[Description with BPM sync if applicable]"
```

---

## PRODUCTION QUICK REFERENCE

### Common Video Types:

| Video Type | Framework | Key Elements |
|------------|-----------|---------------|
| Music Video | Multi-Shot MVP | @audio1 sync, multiple environments, character choreography |
| Commercial/Ad | Director's Card | @image1 product, @image2 style, 15-30s, CTA placement |
| Social Content | Director's Card | Single hook, @image1 character, vertical 9:16 |
| Cinematic Scene | Multi-Shot MVP | 3-4 shots, timestamped, cinematic lighting |
| Product Reveal | Director's Card | Product hero, dramatic lighting, 360 orbit |
| Fashion/Lifestyle | Director's Card | Model @image1, location @image2, movement |

### Recommended Shot Lengths:
- Social media (TikTok/Reels): 6-10 seconds per shot
- YouTube/Music Video: 10-20 seconds per shot
- Commercial: 5-15 seconds per shot

### Transition Timing:
- Quick cuts: 2-3 seconds between shots
- Cinematic flow: 3-5 seconds between shots
- One-take continuous: Seamless with no cuts, 10-60+ seconds

---

## CROSS-SKILL CONNECTIONS

**For image generation before video:**
→ Use AI Content Creator Skill (Record Exec in a Box) for @image1 character sheets
→ Use image_synthesize tool for reference images

**For landing page video integration:**
→ Use Pinterest Scraper Agent to extract visual direction
→ Pass aesthetic summary to cinematic-website-builder

**For social media campaigns:**
→ Use social-media-designer skill for matching graphic templates
→ Coordinate video + static content for brand consistency

---

## ERROR HANDLING

**Empty or vague requests:**
→ Ask clarifying questions: "What is the subject?", "Where does the scene take place?", "What mood/style?"

**Inconsistent character references:**
→ Default to single @image1 reference
→ Ask if additional character refs needed

**No audio specified:**
→ Include default: "ambient sound of environment + music bed"
→ Ask if specific audio sync required

**Style ambiguity:**
→ Default to cinematic realism with practical lighting
→ Offer 2-3 style options: "Cinematic Film / Neon Cyberpunk / Natural Documentary"
