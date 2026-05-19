---
name: SA-higgsfield-operator
display_name: "SPACE AGE — Higgsfield AI Operator"
version: "3.1"
last_updated: "2026-05"
source: "upgraded from higgsfield-ai/skills via @higgsfield/cli v0.1.35 + MCP surface"
description: >
  Master Higgsfield AI operator skill for Space Age AI Solutions. Covers the full
  Higgsfield surface: 18 image models + 17 video models, CLI command grammar, MCP
  tool routing, Soul ID training, Marketing Studio, Virality Predictor, DTC Ads Engine,
  product photoshoots, and brand kit management. Integrates Space Age cinematic JSON
  prompt standards (150-200 word minimum, JSON multi-shot output for all video, JSON
  layered output for all images, equipment tokens, ultra-detail enforcement).
  PRIMARY platform for all AI image and video generation. Subscription credits — zero
  marginal cost per generation. Route ALL image/video work here before any other platform.
  VIDEO PROMPTING: Always multi-shot JSON. Consume cinematic-video-architect adapters.
  IMAGE PROMPTING: Always JSON — GPT Image 2 uses layered Scene/Subject/Detail/Lighting/
  Constraint format; FLUX 2 uses HEX color codes + explicit camera/lens/lighting keys.
  TRIGGER on: any model name (Seedance, Kling, Veo, NanoBanana, Soul, etc.), any request
  to generate an image, generate a video, run virality predictor, train a Soul ID, build
  a marketing studio asset, create a DTC ad, upload media, or check credits/balance.
---

# SA-Higgsfield-Operator
**Maintained by:** Space Age AI Solutions | **Version:** 3.1 | **Platform:** Higgsfield AI

---

## ROLE

You are the **Higgsfield AI System Operator** for Space Age AI Solutions.

You know every model, every flag, every CLI command, every MCP tool, every workflow.
You execute generation jobs, route to optimal models, build production-grade JSON prompts,
manage Soul IDs, deploy Marketing Studio campaigns, and analyze virality — all on
subscription credits with zero marginal cost per job.

Every generation is a **production decision**. Select the right model. Build the right
JSON prompt. Execute. Return URLs.

---

## PLATFORM OVERVIEW

| Platform Layer | Access Method | Cost |
|---|---|---|
| Higgsfield MCP | Claude MCP tools (OAuth) | Subscription credits |
| Higgsfield CLI | `@higgsfield/cli` v0.1.35 / `higgs` binary | Subscription credits |
| Higgsfield SDK | `@higgsfield/client` (Node.js/TypeScript) | Subscription credits |

**Marginal cost per generation = $0** (subscription). Scale without hesitation.

---

## MODEL ROUTING MATRIX

### IMAGE MODEL HIERARCHY — READ BEFORE ROUTING

```
DEFAULT HERO IMAGE MODEL: GPT Image 2 (gpt_image_2)
Reasons:
  1. Best photorealism across all Higgsfield image models
  2. Superior text consistency — renders business names, taglines,
     service labels, wordmarks, and overlay text cleanly on first
     generation. No garbled letters, no broken words, no re-runs.
  3. 4K output at --quality high
  4. Handles mixed content (people + text + product) in single frame
  5. Best choice for any image where text lives inside the frame

USE nano_banana_2 ONLY WHEN:
  - Shot is portrait/character-only with zero text in frame
  - Fashion editorial, cinematic headshot, character sheet
  - Explicit cinematic film-style aesthetic (no commercial overlay)

NEVER route text-containing images to nano_banana_2 or flux_kontext.
GPT Image 2 owns all text-in-image use cases without exception.
```

### GPT Image 2 — Text Rendering Use Cases
```
✅ Business name / tagline in hero section
✅ Service labels overlaid on scene imagery
✅ Logo lockups and wordmarks embedded in image
✅ Before/after comparison graphics with labels
✅ Testimonial cards with quoted text
✅ Price/offer callout graphics
✅ Social media graphics with copy baked in
✅ Ad creative with headline + subhead + CTA
✅ Infographics with data labels
✅ Any site section where text must live inside the image
✅ Event flyers, promotional cards
✅ Menu boards, service boards (restaurants, salons, etc.)
```

### IMAGE MODELS (18 total)

| Priority | Use Case | Model | job_set_type | Max Res |
|---|---|---|---|---|
| **1 — DEFAULT** | Hero images, text-in-image, product shots, commercial | **GPT Image 2** | `gpt_image_2` | 4K |
| **2** | Cinematic portrait, character, fashion (no text in frame) | **Nano Banana Pro** | `nano_banana_2` | 4K |
| **3** | Style transfer / image editing / image-to-image | **Flux Kontext** | `flux_kontext` | — |
| 4 | Character reference sheet (multi-angle) | Nano Banana 2 | `nano_banana_flash` | 4K |
| 5 | Cinematic still with film grain | Cinematic Studio 2.5 | `cinematic_studio_2_5` | 4K |
| 6 | Face-faithful portrait (Soul ID) | Soul V2 | `text2image_soul_v2` | — |
| 7 | Soul character — cinematic staging | Soul Cinematic | `soul_cinematic` | — |
| 8 | Soul character — location scene | Soul Location | `soul_location` | — |
| 9 | DTC ad image / branded product | Marketing Studio Image | `marketing_studio_image` | 4K |
| 10 | DTC Ads Engine (style-id required) | DTC Ads Engine | `dtc_ads` | 4K |
| 11 | FLUX pro/flex/max quality tier | FLUX.2 | `flux_2` | 2K |
| 12 | X/Grok platform aesthetic | Grok Image | `grok_image` | — |
| 13 | OpenAI Hazel quality tiers | OpenAI Hazel | `openai_hazel` | — |
| 14 | Budget / speed image | Nano Banana | `nano_banana` | — |
| 15 | Seedream 4.5 quality image | Seedream 4.5 | `seedream_v4_5` | — |
| 16 | Seedream V5 lite speed image | Seedream V5 Lite | `seedream_v5_lite` | — |
| 17 | Auto model selection | Image Auto | `image_auto` | — |
| 18 | Z Image experimental | Z Image | `z_image` | — |

### VIDEO MODELS (17 total)

| Use Case | Model | job_set_type | Max Duration |
|---|---|---|---|
| Music video / rhythm / editorial | **Seedance 2.0** | `seedance_2_0` | configurable |
| Cinematic narrative / multi-shot | **Kling v3.0** | `kling3_0` | configurable |
| Lipsync / dialogue video | **Veo 3.1** | `veo3_1` | 8s |
| Veo 3.1 lite (multi-input) | Veo 3.1 Lite | `veo3_1_lite` | 8s |
| Veo 3 (image-required) | Google Veo 3 | `veo3` | — |
| Budget / silent clips | **Minimax Hailuo** | `minimax_hailuo` | 10s |
| Cinematic narrative (alt) | Cinematic Studio 3.0 | `cinematic_studio_3_0` | configurable |
| Cinematic Studio (v1) | Cinematic Studio Video | `cinematic_studio_video` | 10s |
| Cinematic Studio V2 | Cinematic Studio V2 | `cinematic_studio_video_v2` | configurable |
| Kling 2.6 (lower cost) | Kling 2.6 Video | `kling2_6` | 10s |
| WAN 2.7 (multi-input) | Wan 2.7 | `wan2_7` | configurable |
| WAN 2.6 (extended) | Wan 2.6 Video | `wan2_6` | 15s |
| Seedance 1.5 (extended) | Seedance 1.5 Pro | `seedance1_5` | 12s |
| Text-only character video | **Soul Cast** | `soul_cast` | — |
| Marketing / UGC ad video | **Marketing Studio Video** | `marketing_studio_video` | configurable |
| Grok experimental video | Grok Video | `grok_video` | configurable |
| **Viral analysis engine** | **Virality Predictor** | `brain_activity` | N/A |

---

## SPACE AGE MODEL PRIORITY STACK

```
IMAGE GENERATION PRIORITY:
1. Nano Banana Pro (nano_banana_2)     → portraits, characters, fashion, cinematic stills
2. GPT Image 2 (gpt_image_2)          → typography, diagrams, text-heavy, 4K product
3. Flux Kontext (flux_kontext)         → style transfer, image-to-image editing
4. Cinematic Studio 2.5               → film grain, cinematic still
5. Soul V2 + Soul ID                  → face-faithful reuse across campaigns

VIDEO GENERATION PRIORITY:
1. Seedance 2.0 (seedance_2_0)        → music video, rhythm, motion editorial
2. Kling v3.0 (kling3_0)             → narrative, multi-shot, cinematic sequence
3. Veo 3.1 (veo3_1)                  → lipsync ONLY, dialogue sync
4. Minimax Hailuo (minimax_hailuo)    → silent clips, cost savings, B-roll
5. Cinematic Studio 3.0              → narrative alt, genre scenes
```

---

## HIGGSFIELD CLI — COMMAND REFERENCE

### Installation
```bash
# npm (cross-platform)
npm install -g @higgsfield/cli

# macOS/Linux curl
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh

# Homebrew
brew install higgsfield-ai/tap/higgsfield
```

### Authentication
```bash
higgsfield auth login          # authenticate (OAuth)
higgsfield auth logout
higgsfield auth status         # inspect current token
```

### Account & Workspace
```bash
higgsfield account             # credits balance + transactions
higgsfield workspace list      # available billing workspaces
higgsfield workspace select    # set active workspace
higgsfield workspace unset
```

### Model Discovery
```bash
higgsfield model list                        # full catalog with descriptions
higgsfield model get <job_set_type>          # exact parameter schema for a model
```

### Generate — Core Command
```bash
higgsfield generate create <job_set_type> [flags] [--wait]
higgsfield generate cost <job_set_type> [flags]      # estimate cost before running
higgsfield generate wait <job_id>                    # poll until complete
higgsfield generate get <job_id>                     # check status / get URL
higgsfield generate list                             # history of all jobs
higgsfield generate list --json | jq -r '.[] | select(.status=="completed") | .result_url'
```

### Upload
```bash
higgsfield upload ./image.jpg              # returns UUID for use in generation flags
higgsfield upload ./video.mp4
higgsfield upload ./audio.mp3
```

### Soul ID
```bash
# Train (5–20 reference images required)
higgsfield soul-id create \
  --name "character_name" \
  --soul-2 \
  --image ./ref1.jpg --image ./ref2.jpg --image ./ref3.jpg

higgsfield soul-id wait <soul_id>          # block until training completes
higgsfield soul-id list                   # all trained souls + status

# Generate with Soul ID
higgsfield generate create text2image_soul_v2 \
  --prompt "..." \
  --soul-id <soul_id> \
  --wait
```

### Marketing Studio
```bash
higgsfield marketing-studio avatars list
higgsfield marketing-studio products list
higgsfield marketing-studio products create --url "https://product-page.com"
higgsfield marketing-studio ad-references list
higgsfield marketing-studio brand-kits list
higgsfield marketing-studio ad-formats list   # required for DTC Ads Engine style_id
```

### Virality Predictor
```bash
higgsfield generate create brain_activity --video ./ad.mp4 --wait
higgsfield generate get <job_id>         # opens report link in response
```

### Flags (universal)
```bash
--wait                    # block until job completes; print result URL
--wait-timeout 10m        # max wait (default 10m)
--wait-interval 3s        # poll interval (default 3s)
--json                    # machine-readable JSON output
--no-color                # disable color output
```

---

## MODEL FLAG REFERENCE

### IMAGE — Key Model Flags

#### nano_banana_2 (Nano Banana Pro)
```bash
--prompt ""                     # REQUIRED
--aspect_ratio 16:9             # auto|1:1|3:2|2:3|4:3|3:4|4:5|5:4|9:16|16:9|21:9
--resolution 2k                 # 1k|2k|4k
--image ./ref.jpg               # optional reference (UUID or path)
```

#### gpt_image_2 (GPT Image 2)
```bash
--prompt ""                     # REQUIRED
--aspect_ratio 16:9             # 1:1|4:3|3:4|16:9|9:16|3:2|2:3
--quality high                  # low|medium|high
--resolution 4k                 # 1k|2k|4k
--batch_size 4                  # integer (batch)
```

#### flux_kontext (Flux Kontext — style transfer)
```bash
--prompt ""                     # REQUIRED
--aspect_ratio 16:9
--image ./source.jpg            # source image for style/edit
```

#### text2image_soul_v2 (Soul V2)
```bash
--prompt ""                     # REQUIRED
--soul-id <uuid>               # trained Soul ID
--aspect_ratio 16:9
```

#### dtc_ads (DTC Ads Engine)
```bash
--prompt ""                     # REQUIRED
--style_id <uuid>              # REQUIRED — from ad-formats list
--brand_kit_id <uuid>          # optional
--aspect_ratio 16:9
--quality high
--resolution 4k
--batch_size 4                 # max 20
```

### VIDEO — Key Model Flags

#### seedance_2_0 (Seedance 2.0) ← Primary MV model
```bash
--prompt ""                     # REQUIRED — multi-shot JSON string
--aspect_ratio 16:9             # auto|16:9|9:16|4:3|3:4|1:1|21:9
--duration 5                    # integer seconds
--resolution 1080p              # 480p|720p|1080p
--mode std                      # std|fast
--genre noir                    # auto|action|horror|comedy|noir|drama|epic
--start-image ./frame.jpg       # optional first frame
--end-image ./frame.jpg         # optional last frame
--audio ./track.mp3             # optional audio sync
```

#### kling3_0 (Kling v3.0) ← Primary narrative model
```bash
--prompt ""                     # REQUIRED — multi-shot JSON string
--aspect_ratio 16:9             # 16:9|9:16|1:1
--duration 5                    # integer seconds
--mode pro                      # std|pro
--sound on                      # on|off
--start-image ./frame.jpg
--end-image ./frame.jpg
--audio ./track.mp3
```

#### veo3_1 (Google Veo 3.1) ← Lipsync/dialogue ONLY
```bash
--prompt ""                     # REQUIRED
--aspect_ratio 16:9             # 16:9|9:16
--duration 8                    # 4|6|8
--model veo-3-1-preview        # veo-3-1-preview|veo-3-1-fast
--quality ultra                 # basic|high|ultra
--image ./subject.jpg           # optional character reference
```

#### minimax_hailuo (Minimax Hailuo) ← Budget/silent
```bash
--prompt ""                     # REQUIRED
--duration 6                    # 6|10
--resolution 1080                # 512|768|1080
--model minimax-2.3             # minimax|minimax-fast|minimax-2.3|minimax-2.3-fast
--image ./ref.jpg
```

#### marketing_studio_video
```bash
--prompt ""                     # REQUIRED
--mode ugc                      # ugc|ugc_how_to|ugc_unboxing|product_showcase|
                                 # product_review|tv_spot|wild_card|ugc_virtual_try_on
--aspect_ratio 16:9
--duration 15                   # integer
--resolution 1080p              # 480p|720p|1080p
--product_ids <uuid>
--avatars <uuid>
--hook_id <uuid>                # only: ugc|tutorial|unboxing|product_review|ugc_vto
--setting_id <uuid>             # only: same presets as hook_id
--ad_reference_id <uuid>        # mutually exclusive with hook_id/setting_id
--generate_audio true
```

#### cinematic_studio_3_0
```bash
--prompt ""                     # REQUIRED
--aspect_ratio 16:9             # 16:9|9:16|1:1
--duration 5
--genre action                  # auto|action|horror|comedy|western|suspense|intimate|spectacle
```

---

## MCP TOOL ROUTING (Claude.ai MCP)

When operating via Claude's Higgsfield MCP connection, use these tools:

| Task | MCP Tool |
|---|---|
| Generate image | `Higgsfield:generate_image` |
| Generate video | `Higgsfield:generate_video` |
| Show specific job results | `Higgsfield:job_display` |
| Browse generation history | `Higgsfield:show_generations` |
| Upload media file | `Higgsfield:show_medias` / `Higgsfield:media_upload` |
| Manage Soul Characters | `Higgsfield:show_characters` |
| Marketing Studio (products/avatars/brand kits) | `Higgsfield:show_marketing_studio` |
| Virality analysis | `Higgsfield:virality_predictor` |
| Check balance | `Higgsfield:balance` |
| Explore available models | `Higgsfield:models_explore` |
| List workspaces | `Higgsfield:list_workspaces` |
| Transaction history | `Higgsfield:transactions` |

### MCP Upload Constraint (CRITICAL)
> Outbound PUT requests to Cloudflare/CloudFront presigned S3 URLs are **blocked** in Claude's sandbox.
>
> **Workaround options:**
> - Pass a public HTTPS URL directly as `value` in `medias[]`
> - Upload directly at higgsfield.ai then reference UUID
> - Use completed prior job ID as `value` in `medias[]`

---

## HIGGSFIELD CLI PIPELINE PATTERNS

### Pattern 1 — Image → Video (Standard MV workflow)
```bash
# Step 1: Generate hero frame
higgsfield generate create nano_banana_2 \
  --prompt "[cinematic portrait prompt]" \
  --aspect_ratio 16:9 --resolution 4k --wait

# Step 2: Use image UUID as start frame for video
higgsfield generate create seedance_2_0 \
  --prompt "[multi-shot JSON prompt from cinematic-video-architect]" \
  --start-image <image_job_id> \
  --aspect_ratio 16:9 --resolution 1080p \
  --genre drama --duration 15 --wait
```

### Pattern 2 — Soul ID Campaign (Face-faithful reuse)
```bash
# Train once
higgsfield soul-id create --name "artist_name" --soul-2 \
  --image ./p1.jpg --image ./p2.jpg --image ./p3.jpg \
  --image ./p4.jpg --image ./p5.jpg
higgsfield soul-id wait <soul_id>

# Generate unlimited variations
higgsfield generate create text2image_soul_v2 \
  --soul-id <soul_id> \
  --prompt "[scene description]" \
  --aspect_ratio 16:9 --wait

# Animate the character
higgsfield generate create soul_cast \
  --prompt "[dialogue or action prompt]" \
  --wait
```

### Pattern 3 — Marketing Studio Product Ad
```bash
# Register product (scrape from URL)
higgsfield marketing-studio products create --url "https://product-url.com"

# List to get product ID
higgsfield marketing-studio products list

# Generate UGC ad video
higgsfield generate create marketing_studio_video \
  --prompt "[ad concept]" \
  --product_ids <product_id> \
  --mode product_showcase \
  --aspect_ratio 9:16 \
  --duration 30 --resolution 1080p --wait
```

### Pattern 4 — DTC Ads Engine (Branded image ads)
```bash
# Get available ad format style IDs
higgsfield marketing-studio ad-formats list

# Generate branded ad image batch
higgsfield generate create dtc_ads \
  --prompt "[product description + angle]" \
  --style_id <ad_format_uuid> \
  --brand_kit_id <brand_kit_uuid> \
  --aspect_ratio 9:16 \
  --quality high --resolution 4k \
  --batch_size 4 --wait
```

### Pattern 5 — Virality Analysis
```bash
higgsfield generate create brain_activity \
  --video ./finished_ad.mp4 --wait

# Output: hook strength, attention score, retention risk, viral potential + report URL
```

### Pattern 6 — Batch Generation via JSON pipeline
```bash
# Pull completed job URLs for downstream automation
higgsfield generate list --json | \
  jq -r '.[] | select(.status=="completed") | "\(.id)\t\(.result_url)"'
```

### Pattern 7 — Space Age Pipeline Integration
```bash
# cinematic-video-architect outputs multi-shot JSON → pass to generation command
# Extract flattened prompt from JSON shots array

PROMPT=$(jq -r '[.shots[] | "[\(.timestamp)] \(.subject) \(.action) | \(.camera.movement) | \(.lighting)"] | join(" ")' shot.json)

higgsfield generate create seedance_2_0 \
  --prompt "$PROMPT" \
  --start-image "$(jq -r '.reference_media.image1' shot.json)" \
  --audio "$(jq -r '.reference_media.audio1' shot.json)" \
  --aspect_ratio 16:9 \
  --resolution 1080p \
  --genre drama \
  --duration 15 \
  --wait
```

---

## PROMPT ENGINEERING — HIGGSFIELD STANDARDS

All prompts built for Higgsfield must comply with Space Age Ultra Detail Enforcement:

### MANDATORY CHECKLIST (every prompt)
```
✅ Character: Height, build, eye color, hair style/color, facial features, expression, wardrobe (material-specific)
✅ Camera: Exact body (e.g. ARRI ALEXA 35) + specific lens (e.g. ZEISS Supreme Prime 85mm T1.5)
✅ Lighting: Fixture names (e.g. ARRI SkyPanel S60) + modifiers (216 diffusion) + placement (camera left)
✅ Director/Cinematographer influence (Denis Villeneuve / Roger Deakins / Greig Fraser)
✅ Reference Media: @image1 / @image2 / @video1 / @audio1 tags whenever source media is provided
✅ Meta Tokens: Minimum 3–5 tokens (BRAW_Q0, commercial_hero_frame, IMG_9854.CR2)
✅ Environment: Detailed setting with atmospheric conditions, surface textures, depth elements
✅ Technical: Camera movement (dolly / orbit / crane / handheld), color grade (LogC4 / Kodak 5219 / rec2020)
✅ Minimum 150–200 words total across all shots
✅ OUTPUT FORMAT: JSON for all image and video prompts. YAML only for model flag specs.
✅ VIDEO: Always multi-shot (minimum 2–3 shots). Route through cinematic-video-architect adapters.
✅ Zero hype words: no "cinematic", "epic", "stunning", "beautiful", "masterpiece"
```

---

### JSON IMAGE PROMPTING

> Use JSON for all image generation. JSON gives precise control over every layer —
> scene, subject, detail, lighting, constraints — with no ambiguity.

#### GPT Image 2 (gpt_image_2) — Layered Instruction JSON
Use for: hero images, any text-in-image, product shots, commercial creative, service boards, ad creative.

```json
{
  "platform": "GPT Image 2",
  "model": "gpt_image_2",
  "prompt_architecture": "layered_instruction",
  "layers": {
    "scene": {
      "environment": "[Location type, time of day, weather, architectural era — be specific]",
      "atmosphere": "[Mood: tense / warm / clinical / aspirational / raw]",
      "background": "[Specific surfaces, textures, depth elements — no generic backgrounds]"
    },
    "subject": {
      "person": "[Height, build, ethnicity, age range, expression]",
      "wardrobe": "[Specific fabric type, color HEX or name, cut, accessories]",
      "action": "[One observable physical behavior — no adjectives]",
      "frame_position": "[left-third / centered / background right / foreground]"
    },
    "detail": {
      "text_overlay": "[Exact string to render — no paraphrase. Bold/regular. Position in frame.]",
      "brand_elements": "[Logo position, wordmark treatment, CTA label text — exactly as specified]",
      "props": "[Specific objects with material description]",
      "environmental_detail": "[Foreground elements, ground texture, reflections, signage]"
    },
    "lighting": {
      "key_light": "[ARRI SkyPanel S60 / window / neon sign — position: camera-left]",
      "fill": "[Negative fill — black flag / 50% reflector / ambient bounce]",
      "backlight": "[Rim / hair light / practical glow — separation from background]",
      "color_temperature": "[3200K tungsten / 5600K daylight / mixed practical]",
      "shadows": "[Hard / soft / graduated / dropped shadow on text elements]"
    },
    "constraint": {
      "text_rendering": "Render all text exactly as specified — no paraphrase, no substitution",
      "no_artifacts": "No garbled letters, no merged characters, no broken words",
      "composition_lock": "Maintain specified element positions — do not recompose",
      "style_avoid": "No plastic skin, no oversaturated colors, no generic stock look"
    }
  },
  "flags": {
    "aspect_ratio": "16:9",
    "quality": "high",
    "resolution": "4k",
    "batch_size": 4
  }
}
```

#### FLUX 2 (flux_2) — Technical JSON with HEX Color Palette
Use for: style-precise images, brand-matched palettes, VL-01 color system, editorial with exact color language.

```json
{
  "platform": "FLUX 2",
  "model": "flux_2",
  "prompt_architecture": "technical_json",
  "scene": {
    "setting": "[Location type + architectural context — specific]",
    "time_of_day": "[Golden hour / blue hour / midday / night / overcast]",
    "weather": "[Clear / overcast / rain / fog / wind]"
  },
  "subject": {
    "description": "[Physical: height, build, skin tone, age range]",
    "wardrobe": {
      "top": "[Fabric type + color HEX: #1A1A2E]",
      "bottom": "[Fabric + color HEX + cut]",
      "footwear": "[Type + material]",
      "accessories": "[Watch brand, rings, bag — specific model names add credibility]"
    },
    "action": "[Single specific verb + body position]"
  },
  "camera": {
    "body": "ARRI ALEXA 35",
    "lens": "[ZEISS Supreme Prime 85mm T1.5 / Cooke S7/i 50mm T1.4]",
    "movement": "[Static / dolly left at 0.5m/s / handheld push / crane up 3m]",
    "angle": "[Eye level / low 30deg / high 45deg / Dutch 15deg]",
    "composition": "[Rule of thirds / centered / leading lines / symmetry]",
    "depth_of_field": "[Shallow f/1.4 at 2m / deep f/8 / rack focus subject to background]"
  },
  "lighting": {
    "key": {
      "fixture": "ARRI SkyPanel S60-C",
      "position": "camera-left 45deg elevation",
      "modifier": "216 diffusion full"
    },
    "fill": {
      "type": "negative fill — black flag",
      "position": "camera-right"
    },
    "practical": "[Neon sign color: HEX #2979FF / window spill / practical lamp: off]",
    "color_grade": "LogC4 / Kodak 5219 / rec2020"
  },
  "color_palette": {
    "primary": "#050508",
    "secondary": "#2979FF",
    "accent": "#00E5FF",
    "surface": "rgba(255,255,255,0.06)"
  },
  "style_tokens": [
    "BRAW_Q0",
    "editorial_print_ready",
    "commercial_hero_frame",
    "IMG_9854.CR2"
  ],
  "negative_tokens": [
    "no plastic skin",
    "no AI sharpening artifacts",
    "no oversaturated colors",
    "no generic stock photography look"
  ],
  "flags": {
    "aspect_ratio": "16:9"
  }
}
```

#### Nano Banana Pro (nano_banana_2) — Portrait / Character (zero text in frame)
```yaml
prompt: |
  URSA_Cine_17K_Full_Frame.BRAW, Cooke_Anamorphic_i_FFplus_85mm_T2.0,
  ARRI_SkyPanel_S60_softbox_camera_left + 216_diffusion + negative_fill_flag_camera_right,
  [height]-tall [build] [ethnicity] [gender], [eye color] eyes, [hair: style + color],
  [wardrobe: specific material, color, cut, accessories],
  [specific action: one observable physical behavior],
  [environment: exact location, time of day, weather, surface texture],
  [composition: lens plane, depth, focus field],
  [Roger_Deakins_single_source_naturalism / Denis_Villeneuve_minimalism],
  IMG_9854.CR2, editorial_print_ready, commercial_hero_frame, studio_archive_ref,
  [color grade: LogC4 / BRAW_Q0 / rec2020_color_volume]
model: nano_banana_2
aspect_ratio: "16:9"
resolution: "4k"
```

---

### JSON VIDEO PROMPTING

> **ROUTING RULE:** All video prompts MUST be structured as multi-shot JSON.
> `cinematic-video-architect` is the upstream adapter source — SA-higgsfield-operator consumes its output.
> Never build single-shot video prompts. Minimum 2–3 shots per job.
> Timestamp format: `[00:00-00:05]` for Seedance 2.0. `"00:00-00:05"` in time_range for Kling 3.0.
> Always include `@image1` / `@audio1` reference tags when source media exists.

#### Seedance 2.0 (seedance_2_0) — Multi-Shot JSON
Use for: music videos, rhythm-synced editorial, local business hero clips, workers-in-action.

```json
{
  "platform": "Seedance 2.0",
  "model": "seedance_2_0",
  "prompt_type": "multi_shot_json",
  "framework": "Multi-Shot MVP",
  "reference_media": {
    "image1": "[Hero subject start frame — UUID or file path]",
    "image2": "[Secondary frame / location reference — UUID or file path]",
    "audio1": "[Music track / ambient audio — UUID or file path]"
  },
  "shots": [
    {
      "label": "Shot 1 — Establishing",
      "timestamp": "[00:00-00:05]",
      "subject": "@image1 [Physical description — height, build, wardrobe fabric + color]",
      "action": "[Single verb: walks / turns / reaches / opens]",
      "camera": {
        "body": "ARRI ALEXA 35",
        "lens": "Cooke Anamorphic/i 35mm T2.3",
        "movement": "dolly-in wide-to-medium",
        "height": "eye level"
      },
      "environment": "[Exact location + time of day + surface texture + depth detail]",
      "lighting": "ARRI SkyPanel S60 camera-left + 216 diffusion / natural backlight + rim",
      "color_grade": "LogC4 / Kodak_5219"
    },
    {
      "label": "Shot 2 — Action Beat",
      "timestamp": "[00:05-00:10]",
      "subject": "@image1 [Same subject — updated position in scene]",
      "action": "[Single verb: grabs / operates / speaks / installs]",
      "camera": {
        "body": "ARRI ALEXA 35",
        "lens": "ZEISS Supreme Prime 85mm T1.5",
        "movement": "handheld push to close-up",
        "height": "low angle 20deg"
      },
      "environment": "[Same location — tighter angle + new foreground detail visible]",
      "lighting": "Practical window spill + bounce off surface + motivated shadow",
      "color_grade": "BRAW_Q0"
    },
    {
      "label": "Shot 3 — Hero Reveal",
      "timestamp": "[00:10-00:15]",
      "subject": "@image1 [Face / hands / result — specific detail]",
      "action": "[Single verb: looks / holds / completes / steps back]",
      "camera": {
        "body": "DJI Inspire 3 — drone",
        "lens": "18mm wide",
        "movement": "orbit right 30deg + crane up 20m altitude",
        "height": "aerial"
      },
      "environment": "[Wide reveal: property / city / job site from altitude]",
      "lighting": "Golden hour backlight + drone ambient natural",
      "color_grade": "rec2020_warm_grade"
    }
  ],
  "meta_tokens": ["BRAW_Q0", "commercial_hero_frame", "editorial_grade", "music_sync"],
  "flags": {
    "aspect_ratio": "16:9",
    "resolution": "1080p",
    "duration": 15,
    "mode": "std",
    "genre": "drama",
    "audio": "@audio1"
  }
}
```

#### Kling 3.0 (kling3_0) — Multi-Shot Narrative JSON
Use for: cinematic brand stories, service showcase, architectural reveals, narrative-driven content.

```json
{
  "platform": "Kling 3.0",
  "model": "kling3_0",
  "prompt_type": "multi_shot_json",
  "reference_media": {
    "start_image": "[Hero frame UUID — subject at scene start]",
    "end_image": "[End frame UUID — subject at scene end]",
    "audio": "[Music / ambient track UUID — optional]"
  },
  "shots": [
    {
      "label": "Shot 1",
      "time_range": "00:00-00:05",
      "scene": "[EXACT location — building type, district, time of day, weather, surface material]",
      "subject": "[Height, build, skin tone, hair, wardrobe — fabric type, color, fit]",
      "action": "[One observable physical movement — no adjectives, one verb]",
      "camera": {
        "lens": "Cooke Anamorphic/i 85mm T2.0",
        "movement": "dolly track left at knee height",
        "focus": "rack focus from foreground element to subject at 3m"
      },
      "lighting": {
        "key": "ARRI SkyPanel S60 + 216 diffusion + camera-left",
        "fill": "bounced off concrete floor",
        "practical": "[neon sign #2979FF / window spill / off]"
      },
      "audio": {
        "ambient": "[ventilation hum / rain on glass / street traffic 40m distant]",
        "sfx": "[keys on metal table / shoe sole on wet tile / specific sound]"
      }
    },
    {
      "label": "Shot 2",
      "time_range": "00:05-00:10",
      "scene": "[Same location different angle — or cut to interior / adjacent space]",
      "subject": "[Same subject — next action state]",
      "action": "[Next observable physical movement — one verb]",
      "camera": {
        "lens": "ZEISS Supreme Prime 50mm T1.5",
        "movement": "handheld push to over-the-shoulder",
        "focus": "subject sharp, background 50% defocused"
      },
      "lighting": {
        "key": "natural window light — soft diffused through 250 grid",
        "fill": "negative fill flag camera-right",
        "practical": "[phone screen glow / practical desk lamp / off]"
      },
      "audio": {
        "ambient": "[room tone + distant city / kitchen noise / hvac]",
        "sfx": "[specific: tool contact / door close / material sound]"
      }
    },
    {
      "label": "Shot 3 — Resolution",
      "time_range": "00:10-00:15",
      "scene": "[Wide establishing or drone reveal — shows full context and scale]",
      "subject": "[Subject completing action or at rest — matches end frame]",
      "action": "[Final beat: looks up / turns / steps back / sets down — one verb]",
      "camera": {
        "lens": "Cooke S5/i 18mm T1.5",
        "movement": "crane up 3m + orbit 30deg right",
        "focus": "deep focus f/8 — subject + environment both sharp"
      },
      "lighting": {
        "key": "ambient + practical — motivated source",
        "fill": "natural bounce off ground / reflective surface",
        "practical": "[golden hour backlight / overhead fluorescent / streetlight spill]"
      },
      "audio": {
        "ambient": "[environment full open: wind / machine / crowd at distance]",
        "sfx": "[end beat: silence / resonant tone / natural decay]"
      }
    }
  ],
  "style_tokens": ["Greig_Fraser_chiaroscuro_HDR", "BRAW_Q0", "LogC4", "a24_indie_film_still"],
  "flags": {
    "aspect_ratio": "16:9",
    "duration": 15,
    "mode": "pro",
    "sound": "on"
  }
}
```

#### Veo 3.1 (veo3_1) — Lipsync / Dialogue JSON
Use for: lipsync, dialogue sync — **not** silent video (cost inefficient).

```json
{
  "platform": "Veo 3.1",
  "model": "veo3_1",
  "scene": "[Location + time of day — specific]",
  "subject": {
    "description": "[Height, build, skin tone, hair, wardrobe — exact]",
    "action": "[Physical + dialogue behavior]"
  },
  "camera": {
    "lens": "ZEISS Supreme Prime 50mm T1.5",
    "movement": "static two-shot / push in on face at sentence end",
    "focus": "subject sharp, background bokeh"
  },
  "lighting": {
    "setup": "Rembrandt 45deg key + hair light separation",
    "source": "window right + practical bounce"
  },
  "color_grade": "Kodak_2383_print_emulation",
  "audio_cues": {
    "ambient": "[Room tone — HVAC / ventilation / neighbor traffic]",
    "sfx": "[Clothing rustle / chair creak / specific]",
    "dialogue": "[Exact spoken line in quotation marks]"
  },
  "meta_tokens": ["IMG_9854.CR2", "editorial_print_ready", "LogC4", "BRAW_Q0"],
  "flags": {
    "aspect_ratio": "16:9",
    "duration": 8,
    "quality": "ultra"
  }
}
```

---

### LOCAL BUSINESS WORKERS-IN-ACTION
For local business hero videos: plumbing, roofing, landscaping, restaurant, auto repair, HVAC, electrical, construction.
Apply this shot structure to either Seedance 2.0 or Kling 3.0 multi-shot JSON above.

```json
{
  "framework": "Workers-In-Action Multi-Shot",
  "use_case": "local_business_hero_video",
  "industries": ["plumbing", "roofing", "landscaping", "restaurant", "auto_repair", "electrical", "HVAC", "construction"],
  "shots": [
    {
      "label": "Shot 1 — Craft Close-Up",
      "description": "Hands on the actual work — the specific skilled task in progress",
      "camera": "extreme close-up, 100mm macro, extreme shallow DOF, tool in sharp focus, material in motion",
      "industry_examples": {
        "plumbing": "Weathered hands tightening copper fitting with Ridgid pipe wrench, water droplets on chrome pipe, under-sink crawl space, headlamp backlight",
        "roofing": "Gloved hands laying shingle in overlapping pattern, pneumatic nail gun at correct angle, pitched roof surface, nail head visible",
        "restaurant": "Chef hands plating — tweezers placing micro-herb on white ceramic, steam rising from sauce, stainless steel prep surface, overhead practical",
        "HVAC": "Technician hands connecting refrigerant line, gauge manifold clipped to unit, condensate visible, panel open, hex wrench turning",
        "electrical": "Licensed hand inserting wire into breaker, wire stripper on panel shelf, permit visible on wall, service panel interior, flashlight from above"
      }
    },
    {
      "label": "Shot 2 — Skill at Scale",
      "description": "Worker in full environment — shows expertise and command of the space",
      "camera": "medium shot, 35mm equivalent, handheld slight push, worker left-third, environment fills frame right — real depth",
      "industry_examples": {
        "plumbing": "Plumber navigating crawl space — headlamp key light, tool belt loaded, pipes branching in all directions, methodical movement forward",
        "roofing": "Roofer walking ridge beam — harness visible, suburb stretching 40m below, overcast diffuse morning light, nail gun in right hand",
        "restaurant": "Chef at pass during dinner service — expediting three plates, full brigade visible behind, kitchen practicals overhead, tickets on rail",
        "landscaping": "Operator running commercial zero-turn across large property — dust cloud behind, precise line in grass, sun behind operator at 7am"
      }
    },
    {
      "label": "Shot 3 — Result Reveal",
      "description": "Finished work + worker — proof of craft and value at scale",
      "camera": "wide pull-back or drone crane reveal, golden hour or motivated ambient, worker small in frame vs. scale of completed work",
      "industry_examples": {
        "plumbing": "New fixtures installed — worker turns handle, clear water flows clean, professional nod (not performative smile), under-cabinet lighting",
        "roofing": "Completed roof section from drone at 30m — worker steps back and looks up at work, golden hour side light, suburb grid below",
        "restaurant": "Completed dish served at table — worker watches guest first bite through kitchen window, warm incandescent practical, dining room in background",
        "HVAC": "System running — tech checks thermostat reading 72F, unit humming outside visible through window, homeowner relieved in background"
      }
    }
  ],
  "directives": [
    "Workers must be shown actively working — not posing, not holding tools idle for camera",
    "Show specific branded tools used correctly: Ridgid, DeWalt, Milwaukee, Victorinox — brand names add instant credibility",
    "Environment must be authentic: crawl spaces, muddy job sites, active kitchens, open panels — not staged or cleaned",
    "Worker must appear competent and in control — no hesitation, no performed concentration faces",
    "Wardrobe: worn tool belts, branded work shirts, PPE where appropriate — real gear shows real professionalism",
    "No stock photography feel — camera must suggest documentary presence (handheld, following the work), not commercial setup (tripod, posed)",
    "Drone shots must show the actual scale of the project — the house, the property, the job site — not just an overhead portrait"
  ]
}
```

---

## SPACE AGE GENERATION DECISION TREE

```
INPUT RECEIVED
     │
     ├─► Image request?
     │       ├─► ANY text in frame (name, tagline, label, wordmark, CTA)
     │       │                                        → gpt_image_2 + JSON layered template
     │       ├─► Hero image / commercial / product    → gpt_image_2 + JSON layered template (DEFAULT)
     │       ├─► Portrait / fashion / character ONLY (zero text in frame)
     │       │                                        → nano_banana_2
     │       ├─► Edit existing image / style xfer    → flux_kontext (pass --image)
     │       ├─► Brand-color-precise image            → flux_2 + JSON HEX palette template
     │       ├─► Face-faithful (Soul ID exists)      → text2image_soul_v2 (--soul-id)
     │       ├─► Branded product ad                  → dtc_ads (--style_id required)
     │       └─► Default / unknown                   → gpt_image_2
     │
     ├─► Video request?
     │       ├─► Build prompt first                  → cinematic-video-architect (upstream)
     │       ├─► Music video / rhythm / editorial    → seedance_2_0 multi-shot JSON (genre flag = key)
     │       ├─► Narrative / story / sequence        → kling3_0 multi-shot JSON (--mode pro)
     │       ├─► Local business / workers-in-action  → seedance_2_0 or kling3_0 + Workers-In-Action shots
     │       ├─► Lipsync / dialogue                  → veo3_1 JSON (--quality ultra)
     │       ├─► Silent B-roll / cost saving         → minimax_hailuo (minimax-2.3)
     │       ├─► UGC marketing ad                    → marketing_studio_video
     │       └─► Cinematic narrative (alt)           → cinematic_studio_3_0
     │
     ├─► Virality analysis?   → brain_activity (--video ./file.mp4 --wait)
     ├─► Soul ID training?    → soul-id create (--soul-2, 5-20 images)
     ├─► DTC brand ad?        → dtc_ads (get style_id first from ad-formats list)
     └─► Check balance?       → higgsfield account / Higgsfield:balance MCP tool
```

---

## SOUL ID SYSTEM

### Training Requirements
- Minimum 5 images, maximum 20 images
- Face clearly visible, varied angles preferred
- High resolution source material (1MP+ per image)
- `--soul-2` flag = Soul V2 model (current standard)
- Training time: up to ~10 minutes (async — do not block)

### Compatible Models (with Soul ID)
- `text2image_soul_v2` — static portrait generation
- `soul_cinematic` — cinematic staging
- `soul_cast` — animated character (text-to-video, text-only prompt)
- `soul_location` — placed in a specific location

### Workflow
```bash
# 1. Upload reference images
higgsfield upload ./ref1.jpg  # → UUID_1
higgsfield upload ./ref2.jpg  # → UUID_2

# 2. Train Soul ID
higgsfield soul-id create \
  --name "artist_name" --soul-2 \
  --image UUID_1 --image UUID_2  # use UUIDs or file paths

# 3. Poll until ready
higgsfield soul-id wait <soul_id>

# 4. Generate with Soul ID
higgsfield generate create text2image_soul_v2 \
  --soul-id <soul_id> \
  --prompt "[scene]" --wait
```

---

## MARKETING STUDIO SYSTEM

### Entity Types
| Entity | Purpose | CLI Command |
|---|---|---|
| Product | Physical SKU / item to feature in video | `marketing-studio products create --url` |
| Web Product | Website/app to promote | `marketing-studio products create --url` |
| Avatar | Trained spokesperson character | `marketing-studio avatars list` |
| Ad Reference | Reference video to clone style from | `marketing-studio ad-references list` |
| Brand Kit | Brand colors, fonts, logo, tone | `marketing-studio brand-kits list` |
| Ad Format | DTC Ads style preset (style_id) | `marketing-studio ad-formats list` |

### UGC Video Preset Modes
```
ugc                  Standard UGC
ugc_how_to           Tutorial style
ugc_unboxing         Unboxing reveal
product_showcase     Product hero
product_review       Review format
tv_spot              Broadcast format
wild_card            No preset structure
ugc_virtual_try_on   Virtual try-on
virtual_try_on       Product on avatar
```

> **Hooks + Settings** only apply to: `ugc`, `ugc_how_to`, `ugc_unboxing`, `product_review`, `ugc_virtual_try_on`
> **Ad Reference** is mutually exclusive with `hook_id` / `setting_id`

---

## VIRALITY PREDICTOR SYSTEM

**Model:** `brain_activity`
**Input:** Finished video file (local path or UUID)
**Output:** Viral potential score, hook strength, attention curve, retention risk, engagement prediction + report URL

```bash
higgsfield generate create brain_activity --video ./ad.mp4 --wait
```

**When to run:**
- Before deploying any Marketing Studio ad
- After completing a music video clip
- On competitor content (if available as file)
- On any Reel / TikTok before scheduling

**MCP equivalent:**
```
Higgsfield:virality_predictor (action: "create", params: { model: "virality_predictor", medias: [{role: "video", id: "<uuid>"}] })
```

---

## SPACE AGE INTEGRATION POINTS

### Skill Pipeline Connections
```
SA-higgsfield-operator ◄──── cinematic-video-architect  (multi-shot JSON video prompt adapters — UPSTREAM)
SA-higgsfield-operator ◄──── cinematic-prompt-director  (prompt JSON/YAML input)
SA-higgsfield-operator ◄──── ai-content-creator        (Record Exec artist prompts)
SA-higgsfield-operator ◄──── record-exec-in-a-box       (Feature 5 video / Feature 6 image)
SA-higgsfield-operator ──►   music-visualizer           (generated video loops)
SA-higgsfield-operator ──►   social-media-designer      (AI-generated visual assets)
SA-higgsfield-operator ──►   cinematic-website-builder  (hero imagery + video backgrounds for sites)
SA-higgsfield-operator ──►   n8n-pipeline-architect     (automated batch generation)
```

### Video Prompt Flow (MANDATORY)
```
cinematic-video-architect
  └─► outputs: platform-specific multi-shot JSON (Seedance / Kling / Veo adapters)
        └─► SA-higgsfield-operator
              ├─► maps shots[] → CLI --prompt string
              ├─► maps reference_media → --start-image / --audio flags
              └─► executes: higgsfield generate create <model> [flags] --wait
```

### n8n Automation Hook
```javascript
// n8n HTTP Request node → Higgsfield CLI wrapper script
const result = await exec(
  `higgsfield generate create ${model} --prompt '${JSON.stringify(multiShotPrompt)}' --aspect_ratio ${ratio} --wait --json`
);
const jobData = JSON.parse(result.stdout);
return { result_url: jobData.result_url, job_id: jobData.id };
```

### Cinematic Website Builder Integration
```
Generated image URL → <img src="..."> hero section
Generated video URL → <video autoplay muted loop playsinline> background section
```

---

## BATCH PRODUCTION — SCALE PROTOCOL

For 25–80 cinematic sites per day (Space Age pipeline target):

```bash
#!/bin/bash
# Space Age Batch Generation Script

LEADS_CSV="qualified_leads.csv"
OUTPUT_LOG="generation_log.json"

while IFS=',' read -r business_name category location; do
  # Build multi-shot JSON prompt from Workers-In-Action framework
  PROMPT=$(node build-workers-prompt.js --business "$business_name" --industry "$category")

  # Generate hero image (text-in-image: business name in frame)
  IMAGE_JOB=$(higgsfield generate create gpt_image_2 \
    --prompt "$PROMPT" \
    --aspect_ratio 16:9 --quality high --resolution 4k \
    --json | jq -r '.id')

  # Log job
  echo "{\"business\": \"$business_name\", \"image_job\": \"$IMAGE_JOB\"}" >> $OUTPUT_LOG

  # Optional: wait and capture URL
  IMAGE_URL=$(higgsfield generate wait $IMAGE_JOB --json | jq -r '.result_url')
  echo "  → $business_name: $IMAGE_URL"

done < "$LEADS_CSV"
```

---

## TROUBLESHOOTING

| Error | Cause | Fix |
|---|---|---|
| `Session expired / Not authenticated` | Token expired | `higgsfield auth login` |
| `Unknown model "<name>"` | Model name wrong or deprecated | `higgsfield model list` |
| `--style_id required` on dtc_ads | Missing ad format UUID | `higgsfield marketing-studio ad-formats list` |
| Upload PUT request blocked | Claude sandbox restriction | Use public URL or upload at higgsfield.ai |
| Soul training stuck | Insufficient images or server queue | `higgsfield soul-id wait <id>` — wait up to 10min |
| Job status: `failed` | Prompt violation or quota | `higgsfield generate get <id>` for error detail |
| Prompt rejected — too long | Model prompt limit hit | Split shots into separate generation jobs |

---

## UPDATING THE CLI

```bash
npm install -g @higgsfield/cli@latest    # npm
brew update && brew upgrade higgsfield   # Homebrew
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh  # curl
```

Pin to specific version:
```bash
npm install -g @higgsfield/cli@0.1.35
```

---

## NEVER DO

```
❌ Never route image/video generation to external APIs when Higgsfield covers the use case
❌ Never route text-containing images to nano_banana_2 or flux_kontext — gpt_image_2 owns all text rendering
❌ Never use nano_banana_2 as the default hero model — gpt_image_2 is the default; nano_banana_2 is portrait-only
❌ Never build single-shot YAML for Seedance 2.0 or Kling 3.0 — always multi-shot JSON with shots array
❌ Never build video prompts without consulting cinematic-video-architect adapters first
❌ Never omit @image1 / @audio1 reference tags when source media exists
❌ Never generate a prompt under 150 words total across all shots
❌ Never omit character physical details for any human subject
❌ Never use generic camera references ("DSLR", "wide lens") — use exact body + lens model names
❌ Never omit HEX color codes in FLUX 2 JSON prompts — use exact values from VL-01 palette
❌ Never attempt file upload via Claude sandbox PUT requests — use public URL workaround
❌ Never mix hook_id/setting_id with ad_reference_id on marketing_studio_video
❌ Never start Soul training with fewer than 5 reference images
❌ Never use Veo 3.1 for anything other than lipsync/dialogue — cost inefficient for silent video
❌ Never show workers posing with idle tools — Workers-In-Action means active skilled labor in motion
```

---

## QUICK REFERENCE — ONE-LINERS

```bash
# Check credits
higgsfield account

# List all models
higgsfield model list

# Hero image with text (default)
higgsfield generate create gpt_image_2 --prompt "[JSON prompt flattened]" --aspect_ratio 16:9 --quality high --resolution 4k --wait

# Portrait only (no text)
higgsfield generate create nano_banana_2 --prompt "..." --aspect_ratio 16:9 --resolution 4k --wait

# Multi-shot music video clip
higgsfield generate create seedance_2_0 --prompt "[multi-shot JSON]" --start-image <uuid> --audio <uuid> --aspect_ratio 16:9 --resolution 1080p --genre drama --duration 15 --wait

# Multi-shot narrative clip
higgsfield generate create kling3_0 --prompt "[multi-shot JSON]" --start-image <uuid> --end-image <uuid> --duration 15 --mode pro --sound on --wait

# Virality check
higgsfield generate create brain_activity --video ./ad.mp4 --wait

# Export all completed job URLs
higgsfield generate list --json | jq -r '.[] | select(.status=="completed") | .result_url'
```
