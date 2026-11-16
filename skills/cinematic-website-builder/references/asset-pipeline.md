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
    tokens: hero-loop        # shot recipe from prompt-tokens.md §4
    storyboard: none         # none | path to board (storyboard-to-video.md) for multi-shot clips
    alt: "…specific description…"
    status: pending          # pending → generated → qc_pass → encoded → hosted
```

## 3. Generate — live roster, role-based (v3.5)

Model names age in weeks. **This file names no default model.** Before the first generation of every build, run
`references/model-roster.md`: read the live roster, pick per role, and in client mode ask when the pick changed.
Record `model`, `model_id`, `platform` and `roster_checked` per slot in `assets.yaml` so a rebuild regenerates with
the same model, and so `shot-lint.mjs` can reject a clip planned against a stale roster.

Roles this pipeline needs (the roster doc maps each to today's candidates):

| Role | Needs | Used for |
|---|---|---|
| **Anchor still** | best instruction-following, reference images, 2K–4K, 21:9 | hero anchor frame, section stills, OG image, edits of the client's real photos |
| **Photoreal alternate** | different model family from the anchor | second opinion on a hero, fast variant batches |
| **Graphic / vector** | SVG or flat output, exact text | icons, marks, diagrams |
| **Hero loop** | image-to-video with **start + end frame** | the house hero loop: anchor still as both frames → seamless loop |
| **Section clip** | image-to-video, 5–8 s, good physics | video-per-section chapters |
| **Narrative / multi-shot** | reference images, extension or ordered keyframes | hero films, scroll films, storyboard hand-offs |
| **Identity-consistent** | image references held across shots | recurring person or product |
| **Finish** | upscale, reframe, outpaint, deflicker | masters, mobile crops |

Routing rules (unchanged, model-independent):
- **Image → video, never text → video for a hero.** Anchor still → approve (client mode) → animate.
- **Continuity across shots:** previous shot's last frame is the next start frame.
- **Many variants:** batch tools (`generate_image_batch` / `generate_video_batch` → `jobs_wait` → `show_generation_by_ids`).
- Every output is downloaded and re-hosted under `/assets/` (§7). No presigned URLs ship.
- A model named in an old `assets.yaml` that is gone from the roster: stop and ask (client mode) or pick the same
  role's current candidate and log it (lead mode). Never swap silently.

**Storyboard generator (on deck):** when a video slot needs several shots or a story, pull in
`references/storyboard-to-video.md`. Single-shot loops skip it.

### Prompt contract (v3.5: direction first, tokens second)

Cinematography comes from **`space-age-cinematic-director`** (v4.1, in this repo as
`skills/space-age-cinematic-director-v3/`; the single-file edition is `references/consolidated-v4.1.md` there).
Load it at G6. Its rules win over anything older in this skill, in particular:

- **Intent before gear** (its §2). Pick the camera move, lens and light because of what the viewer must feel and
  read, not because it sounds cinematic.
- **One body, one lens family, one grade per site**; **one primary camera move per shot**.
- **Meta tokens are tiered** (its §13): tier A (real camera, lens, colour pipeline names) and tier B (stylistic
  shorthand) support a complete physical description; tier C filename-style anchors are optional flavour, never the
  default. At most 5 tokens. The vocabulary lists in `references/prompt-tokens.md` are the menu, not a quota.
- **Stills** follow its master order: subject → action → location → shot size/angle → composition → camera/format →
  lens/DOF → lighting geometry → material → atmosphere → colour → constraints. Complete, in natural sentences for
  the current image models; no comma-token dumps. Web additions: the text-safe zone from the manifest, crop-safe
  subject placement.
- **Video is written as a JSON shot spec first** (`references/video-json-prompting.md`), linted with
  `scripts/shot-lint.mjs`, then sent as JSON or compiled to prose for the chosen model. For image-to-video the
  prompt describes **what changes over time**, not the frame the model can already see.
- **Model syntax is never guessed** (its model-version rule): read the model's parameters from the live roster;
  unsupported flags are left out, not invented.

The old "every prompt ≥ 150 words with 3–5 meta tokens" rule is retired: it produced token soup on stills and
wasted the prompt budget on image-to-video.

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
