# Asset Pipeline — generate, encode, host (Stage 3a)

**Order is law: assets before build.** Placeholder-first builds get re-cut when real media
arrives with different crops, focal points and weights.

```
Site DNA (locked) → media slots → assets.yaml manifest → anchor frame → generate → QC
→ encode + poster + variants → re-host /assets/ → build references real paths → verify
```

## 1. Media tier (pick one per page — from cinematic-website-director §9)

| Tier | Hero | Use | Budget (hero media, desktop / mobile) |
|---|---|---|---|
| T0 Static | optimized still (AVIF + WebP) | performance-first, media-poor | ≤ 200 KB / ≤ 120 KB |
| T1 Light motion | still + GSAP, or ≤ 6 s silent loop | typical SMB | ≤ 1.5 MB / poster only on save-data |
| T2 Cinematic video | ≤ 12 s loop, poster, mobile variant | enhanced/cinematic | ≤ 3 MB / ≤ 1.2 MB |
| T3 Scroll film | frame sequence or all-intra video scrub | premium narrative | ≤ 8 MB / ≤ 3 MB, progressive |
| T4 Interactive 3D | WebGL (route to `sa-scroll-cinematics` / `sa-figma-framer-spline`) | flagship only | device-gated, poster fallback |

Downgrade path when a budget or device class fails: **T4 → T3 → T2 → T1 → T0.** Downgrade the
technique before downgrading usability. No conversion path may depend on media playback.

## 2. Manifest (`assets.yaml`) — fill before generating

```yaml
brand_tokens: from ui-ux-designer handoff   # palette names the prompts must hit
slots:
  - id: hero
    module: 31+T2            # which module consumes it
    type: video_loop         # still | video_loop | frame_sequence | portrait | texture | og
    aspect: [16:9, 9:16]     # desktop + mobile crops
    focal_point: center-left # where the subject sits → keeps headline side clear
    safe_zone: left 45% text # negative space the copy needs
    duration_s: 8
    loopable: true
    faces: false             # background loops: no faces
    platform: higgsfield     # higgsfield | openart
    model: minimax_h3        # from the roster in §3
    alt: "…specific description…"
    status: pending          # pending → generated → qc_pass → encoded → hosted
```

## 3. Generate — the Space Age model roster

**Platforms:** Higgsfield (default — scripted through the Higgsfield MCP, fully automatable) and
OpenArt (web app — for models Higgsfield doesn't carry, or when the client's work already lives there).
Either way, every output is downloaded and re-hosted under `/assets/` (§7).

### Image models

| Model | Higgsfield id | Use it for | Why |
|---|---|---|---|
| **ChatGPT Images 2.5** (default — gold standard) | `gpt_image_2_5` | hero anchor stills, product, editorial, people, text-in-image, editing/compositing the client's real photos, OG images, UI mockups | best overall quality and instruction-following, strongest edits, reference images, 4K, odd aspects (21:9, 27:16, 16:27) |
| **Nano Banana Pro** | `nano_banana_pro` | second opinion on photoreal heroes, dense diagrams/infographics, fast variant batches | strong photoreal and text rendering, 4K, unlimited-plan eligible |
| **Grok Imagine 1.5** | OpenArt (not on Higgsfield; nearest there: `grok_image_2_0`) | bold, expressive, high-contrast art direction — brand, AI-services and creative sites | a looser, more graphic look than the other two |

### Video models

| Model | Higgsfield id | Use it for | Why |
|---|---|---|---|
| **MiniMax H3** (default) | `minimax_h3` (`minimax_h3_max` for fast drafts) | the house-standard **hero loop** | start + end keyframes: pass the anchor still as *both* → seamless loop; 2K; 21:9 |
| **Seedance 2.5** | `seedance_2_5` | narrative heroes, T3 scroll-film shots, extending a clip for a longer scrub, editing a generated clip | text-to-video + omni-reference, video extension and video edit, up to 1080p |
| **Seedance 2.0** | `seedance_2_0` | product and people who must stay identical across shots (multi-SKU, founders, artists), 4K masters | identity consistency, 4K, native audio if ever needed |

Routing rules:
- **Image → video, never text → video for a hero.** Anchor still (ChatGPT Images 2.5) → approve → animate (MiniMax H3).
- **Continuity across shots** (scroll film, sticky narrative): Seedance 2.5 with the previous shot's last frame as the next start frame.
- **Same product/person in several shots:** Seedance 2.0 with the approved stills as `image_references`.
- **Many variants:** `generate_image_batch` / `generate_video_batch` → `jobs_wait` → `show_generation_by_ids`.
- **Upscale / reframe / extend canvas:** `upscale_image`, `upscale_video`, `reframe`, `outpaint_image`.
- If a named model is ever missing, `mcp__Higgsfield__models_explore { action: "search", query: "<model name>" }` finds its current id — don't silently swap to a different model.

| Need | Model | Prompt skill (SA) |
|---|---|---|
| Hero still, product, editorial, client photo edits, graphics, OG | ChatGPT Images 2.5 | `cinematic-prompt-director` |
| Photoreal alternate / infographic / fast variants | Nano Banana Pro | `cinematic-prompt-director`, `banana-pro-director-30` |
| Bold brand/AI-services art direction | Grok Imagine 1.5 (OpenArt) | `cinematic-prompt-director` |
| Recurring person / artist / founder | character sheet → Seedance 2.0 | `character-builder` |
| Hero loop (every site) | MiniMax H3, start = end frame | `cinema-director-v3` |
| Narrative hero / scroll-film shots | Seedance 2.5 (start/end frames, extension) | `cinema-director-v3`, `seedance-2-5-prompting`, `scroll-world` |

Record the choice per slot in `assets.yaml` (`model:` and `platform:`) so a rebuild regenerates with the same model.

Always generate the **anchor still first**, approve it, then animate from it (image-to-video).
Text-to-video for a hero produces identity/geometry drift you can't fix in CSS.

### Prompt contract (Space Age standing rule — non-negotiable)

Every image/video prompt is **≥ 150 words** and contains all of:

- **Subject** — for people: height, build, eye color, hair, facial features, expression, wardrobe; for products: material, finish, scale cues
- **Camera** — exact body (e.g. ARRI Alexa 35, Sony Venice 2, Blackmagic URSA Cine 17K) + lens (e.g. ZEISS Supreme Prime 50mm T1.5) + aperture
- **Lighting** — named fixtures (ARRI SkyPanel S60, Aputure 600D), modifiers (216 diffusion, 4×4 floppy), placement (camera left, 45°, key height)
- **Style** — director + cinematographer reference (e.g. Denis Villeneuve / Roger Deakins)
- **Meta tokens** — 3–5 (e.g. `commercial_hero_frame`, `IMG_9854.CR2`, `studio_shot`)
- **Environment** — setting, atmosphere, time of day, weather/haze
- **Technical** — camera movement, color grade (named to the brand palette), aspect ratio, **the text-safe zone** from the manifest
- **Web additions** — "seamlessly loopable, slow subtle motion, no faces" for background loops; "subject framed right third, clean negative space left" when copy sits on top

Under 150 words or missing an item → rewrite with more detail, not less.

## 4. QC gate (before encoding)

Reject and regenerate if: identity/geometry drift between shots · artifacts in hands/text/logos ·
subject collides with the text-safe zone · loop has a visible seam · palette off-brand ·
any real person's likeness or trademark that isn't the client's.

## 5. Encode (ffmpeg — run locally, commit only outputs)

```bash
# Stills → AVIF + WebP at 3 widths (use sharp/squoosh/avifenc; ffmpeg shown for parity)
for w in 640 1280 1920; do
  ffmpeg -y -i hero.png -vf "scale=$w:-2" -c:v libaom-av1 -still-picture 1 -crf 32 hero-$w.avif
  ffmpeg -y -i hero.png -vf "scale=$w:-2" -c:v libwebp -quality 78 hero-$w.webp
done

# Background loop: strip audio, H.264 (universal) + AV1 (small), poster from first frame
ffmpeg -y -i loop.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart hero-1920.mp4
ffmpeg -y -i loop.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libsvtav1 -crf 38 hero-1920.av1.mp4
ffmpeg -y -i loop.mp4 -an -vf "scale=720:-2,fps=24"  -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart hero-720.mp4
ffmpeg -y -i loop.mp4 -vframes 1 -vf "scale=1920:-2" hero-poster.jpg

# Frame sequence for module 32 (desktop 1600w, mobile uses every 2nd frame via data-mobile-step)
mkdir -p seq && ffmpeg -y -i film.mp4 -an -vf "fps=24,scale=1600:-2" -c:v libwebp -quality 70 seq/hero_%03d.webp

# Alternative scrub source: all-intra MP4 (every frame a keyframe → instant seeks), set video.currentTime from progress
ffmpeg -y -i film.mp4 -an -vf "scale=1600:-2" -c:v libx264 -x264-params keyint=1:scenecut=0 -crf 26 -pix_fmt yuv420p scrub.mp4
```

Frame-sequence budget: ≤ 150 frames · ≤ 1600 px wide desktop / ≤ 900 px mobile · WebP/AVIF q≈70 ·
total ≤ 8 MB desktop, ≤ 3 MB mobile. Over budget → fewer frames (the scrub interpolates visually) before lower quality.

## 6. Video element contract

```html
<video class="hero-video" autoplay muted loop playsinline preload="metadata"
       poster="/assets/hero-poster.jpg" width="1920" height="1080" aria-hidden="true">
  <source src="/assets/hero-1920.av1.mp4" type="video/mp4; codecs=av01.0.08M.08" media="(min-width: 900px)">
  <source src="/assets/hero-1920.mp4" type="video/mp4" media="(min-width: 900px)">
  <source src="/assets/hero-720.mp4" type="video/mp4">
</video>
```
Decorative loops are `aria-hidden`; meaningful video needs captions and a visible pause control.
For reduced motion or save-data, swap to the poster (`matchMedia` → `video.pause(); video.removeAttribute('autoplay')`).

## 7. Host

Higgsfield and OpenArt output URLs are **presigned or session-bound and expire.** Download every asset, place under
`/assets/`, reference relative paths. `verify.mjs` blocks on any `X-Amz-Signature` /
`Expires=` / `token=` URL. OG image: 1200×630 JPG under `/assets/og.jpg`.

## 8. Module × asset matrix

| Module | Asset | Tier |
|---|---|---|
| hero (31 + still) | hero still 16:9 + 9:16, text-safe zone | T0/T1 |
| hero video | silent loop + poster + 720p variant | T2 |
| 02 sticky-narrative | 3–5 stills sharing one lighting setup | T1 |
| 03 parallax | 2–3 layers: background plate + cut-out foreground (transparent PNG/AVIF) | T1 |
| 04 horizontal-pan · 21 coverflow · 18 morph | project/product stills, consistent aspect | T1 |
| 11 accordion-gallery · 13 image-trail | 4–8 thumbnails ≤ 60 KB | T1 |
| 12 compare | before/after pair, identical framing | T1 |
| 26 mesh-gradient | none (CSS) | — |
| 32 frame-scrub | 90–150 frame sequence or all-intra MP4 + poster | T3 |
| X1–X3 | GLB/textures/shaders via routed skill | T4 |
