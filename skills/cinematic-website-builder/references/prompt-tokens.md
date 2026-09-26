# Prompt Tokens — meta + cinematography library (asset phase)

Source: Mr. Black's *AI Image & Video Generation Meta Tokens Professional Guide* (Aug 2025),
mapped onto the current Space Age model roster (`asset-pipeline.md` §3). **Every image and video
prompt this skill writes pulls its camera, lens, lighting, grade, movement and style tokens from
this file.** It fills the slots of the prompt contract (`asset-pipeline.md` §3, ≥ 150 words); it
does not replace the subject, environment or text-safe-zone detail.

## 1. How to use it

1. Pick the **shot recipe** (§4) for the slot in `assets.yaml` — it names the model and a token set.
2. Fill every contract slot, taking tokens from §2 in this order: camera body → lens → lighting
   fixtures (+ modifier and placement) → grade/color pipeline → movement (video) → style influence →
   meta tokens → platform extras (§3).
3. **One body, one lens, one grade per shot.** Stacking three cameras or two lenses confuses the model.
4. Keep the token set **identical across every shot of one site** (same body, lens family, grade) —
   that's what makes stills, loops and scroll-film shots read as one production.
5. Tokens are phrased as the guide phrases them (e.g. `shot on RED Komodo 6K`) — don't paraphrase.

## 2. Token library

### Cinema camera bodies — video and cinematic stills
| Token | Character |
|---|---|
| `shot on ARRI ALEXA Mini LF` | large format, the industry-standard look — default for people and interiors |
| `ARRI ALEXA Mini` | industry-standard cinema camera |
| `ARRI ALEXA 65 IMAX` | large-format IMAX scale — flagship heroes, landscapes |
| `shot on RED Komodo 6K` | compact cinema camera, crisp, modern |
| `RED Monstro 8K` · `RED Helium 8K` · `RED V-Raptor 8K` | ultra-high resolution, sharp detail — product, tech, AI-services |
| `Sony VENICE 2 8.6K` · `Sony Venice 6K` | full-frame, clean skin tones — people, hospitality |
| `Sony FX9` · `Sony FX6` | full-frame / compact documentary realism — authentic SMB, team, process |
| `Blackmagic URSA Mini Pro 12K` · `Blackmagic URSA Cine 17K` | ultra-high resolution |
| `Phantom Flex4K` | ultra-high-speed — slow-motion liquids, particles, product splashes |

### Stills bodies — product, studio, editorial
| Token | Character |
|---|---|
| `shot on Phase One XF IQ4 150MP` | ultra-high-res medium format — default for product and packshots |
| `Sinar P3 view camera` + `Schneider PC-TS Super-Angulon 28mm` | large format, perspective-corrected — architecture, interiors |
| `Schneider Kreuznach 110mm LS f/2.8` | medium-format portrait/product lens |
| `Arca-Swiss C1 Cube` | precision geared head — locked-off studio geometry |

### Lenses
| Token | Use |
|---|---|
| `Zeiss Master Prime 85mm T1.3` | portraits, hero subject, shallow depth |
| `Zeiss Master Prime 50mm T1.3` | natural perspective, lifestyle |
| `Zeiss Master Prime 24mm T1.3` | wide establishing, aerial, interiors |
| `Zeiss Supreme Prime 85mm T1.5` | modern, clean portrait rendering |
| `Cooke S4/i 75mm T2.0` | warm "Cooke look", flattering skin — hospitality, fashion |
| `Panavision Primo 75mm` | classic Hollywood rendering |
| `Angenieux Optimo 24-290mm T2.8` | cinema zoom — push-ins, long-lens compression |

### Lighting fixtures
| Token | Use |
|---|---|
| `ARRI SkyPanel S60-C` · `ARRI SkyPanel S120-C` | soft LED key/fill, color-tunable to brand palette |
| `ARRI M18 HMI` | daylight punch, window/sun simulation |
| `Aputure 300d Mark II` | practical LED key |
| `Kino Flo Diva-Lite 401` · `Kino Flo Celeb 450 DMX` | soft, wraparound, flattering on faces |
| `Dedolight DLED12 focusing system` | precise pools of light, product accents, rim |
| `Profoto D2 1000 Air TTL` · `Broncolor Siros 800S` | studio strobe — product, packshot, editorial |
| `Matthews C-Stand with grip head` | grip realism cue (optional) |
Always add modifier + placement (e.g. `through 216 diffusion, camera left 45°, key at eye height`)
and color temperature (`golden hour 3200K`, `5600K daylight`).

### Color and finishing pipeline
`DaVinci Resolve color grading` · `ACES workflow` · `DaVinci Resolve ACES workflow` ·
`ARRI ALEXA color science` · `Rec.709 color space` · `DCI-P3 color gamut` · `Capture One Pro processing` ·
`1080p ProRes 422 HQ` · `ProRes 422 HQ recording` · `8K clarity` · `Phase One IQ4 resolution`
Name the grade against the brand palette: *"DaVinci Resolve color grading, deep teal shadows, bone highlights"*.

### Camera movement (video)
| Token | Use on the web |
|---|---|
| `Technocrane Super 30 movement` · `Technocrane movement` | sweeping reveals, rising establishing shots — hero openers |
| `Chapman PeeWee III dolly track` | slow push-in / lateral track — **best for seamless hero loops** |
| `Steadicam Volt stabilization` | walk-through, follow shots — hospitality, real estate, scroll film |
| `DJI Inspire 3 X9-8K gimbal` · `DJI Mavic 3 Cine` · `DJI Air 3S` | aerial establishing — locations, venues, service areas |

### Film stock / vintage looks
`shot on Kodak Portra 400` · `Leica M6` · `Hasselblad 503CW` — warm, analog, editorial. Use for
fashion, music, hospitality, artisan brands; never for tech/AI-services.

### Style influences
Cinema: `Roger Deakins cinematography` · `Emmanuel Lubezki natural lighting` (+ director reference, e.g. Denis Villeneuve).
Photography: `Annie Leibovitz editorial style` · `Peter Lindbergh fashion photography` · `Mario Testino Vogue editorial style`.

### Text / typography in images
`Adobe InDesign typography` · `Helvetica Neue typography` · `Pantone color-matched signage` —
only when text must render inside the image (signage, packaging, OG cards). Web copy is never baked into media.

### Audio (only if a clip ships with sound — hero loops are always silent)
`Sennheiser MKH 416 shotgun mic` · `Sound Devices 833 recorder` · `Pro Tools HDX mixing` · `no subtitles`.

### Meta tokens (Space Age standing rule: 3–5 per prompt)
File/format realism: `IMG_9854.CR2` · `DSC_0421.ARW` · `A001_C003_0912.ari` · `R3D_RAW_frame`
Intent: `commercial_hero_frame` · `studio_shot` · `editorial_spread` · `campaign_keyframe` · `website_hero_plate`
Quality: `RED Helium 8K sensor` · `ARRI ALEXA color science` · `Zeiss Master Prime optics` · `Phase One IQ4 resolution`

### Negatives (where the model accepts them)
`doll, anime, animation, cartoon, render, artwork, semi-realistic, CGI, 3d, sketch, drawing` —
drop `3d`/`render`/`CGI` when the brief actually wants a 3D or stylized look.

## 3. Platform extras (guide → current roster)

| Guide platform | Carries over to | Rule |
|---|---|---|
| Freepik / Leonardo (stills, text) | **ChatGPT Images 2.5**, Nano Banana Pro | Phase One + Profoto/Broncolor for product; Typography tokens only for in-image text. Plain-language direction, no `--` parameters. |
| Midjourney (`--style raw`, `--stylize`, `--v 7`, `--ar`) | none on our roster | Don't paste `--` flags into ChatGPT Images, Nano Banana, Grok or any video model. Set aspect with the tool's `aspect_ratio`. |
| Stable Diffusion (negatives) | Grok Imagine 1.5 on OpenArt (if the UI exposes negatives) | Use the §2 negative set. |
| **Hailuo 2** (MiniMax's model family) | **MiniMax H3** | *Emphasize camera movement and cinematic direction.* Lead with the movement token, then body/lens/light. |
| **Veo 3** (audio, dialogue) | Seedance 2.0 / 2.5 when a clip needs sound | Include visual **and** audio description; specify dialogue verbatim; `no subtitles`. |
| Aerial combos | MiniMax H3, Seedance 2.5 | DJI body + wide Zeiss + light temperature + ProRes. |

## 4. Shot recipes for web slots

Each is a token skeleton — wrap it in the full ≥ 150-word contract (subject, environment, atmosphere,
grade named to palette, text-safe zone).

| Slot | Model | Token skeleton |
|---|---|---|
| **Hero anchor still** (people / place) | ChatGPT Images 2.5 | `shot on ARRI ALEXA Mini LF, Zeiss Master Prime 85mm T1.3, ARRI SkyPanel S60-C through 216 diffusion camera left, DaVinci Resolve ACES workflow, Roger Deakins cinematography, commercial_hero_frame, website_hero_plate, A001_C003_0912.ari` |
| **Hero loop** (animate the anchor) | MiniMax H3, start = end frame | `Chapman PeeWee III dolly track slow 20 cm push-in and return, seamlessly loopable, subtle ambient motion only, no faces, shot on ARRI ALEXA Mini LF, Zeiss Master Prime 50mm T1.3, 1080p ProRes 422 HQ` |
| **Product / packshot** | ChatGPT Images 2.5 | `shot on Phase One XF IQ4 150MP, Schneider Kreuznach 110mm LS f/2.8, Profoto D2 1000 Air TTL with strip softboxes, Dedolight DLED12 rim, Capture One Pro processing, studio_shot, IMG_9854.CR2, 8K clarity` |
| **Product slow-mo** (splash, pour, particles) | Seedance 2.0 | `Phantom Flex4K 1000fps, Zeiss Master Prime 85mm T1.3, Broncolor Siros 800S backlight, black void, DaVinci Resolve color grading, campaign_keyframe` |
| **Establishing / location** | Seedance 2.5 or MiniMax H3 | `Aerial establishing shot, DJI Inspire 3 X9-8K gimbal, Zeiss Master Prime 24mm T1.3, golden hour 3200K lighting, ProRes 422 HQ recording` |
| **Interior / architecture** (dental, law, real estate) | ChatGPT Images 2.5 → MiniMax H3 | `Sinar P3 view camera, Schneider PC-TS Super-Angulon 28mm, ARRI M18 HMI through window, Kino Flo Diva-Lite 401 fill, DCI-P3 color gamut, editorial_spread` → video: `Steadicam Volt stabilization slow walk-in` |
| **Team / founder portrait** | ChatGPT Images 2.5 (→ Seedance 2.0 for motion) | `Sony VENICE 2 8.6K, Cooke S4/i 75mm T2.0, Kino Flo Celeb 450 DMX soft key, Annie Leibovitz editorial style, DSC_0421.ARW, editorial_spread` |
| **Scroll-film shots** (T3) | Seedance 2.5, last frame → next start frame | `Technocrane Super 30 movement continuous rise, shot on RED V-Raptor 8K, Cooke S4/i 75mm T2.0, ARRI SkyPanel S120-C, DaVinci Resolve ACES workflow, Emmanuel Lubezki natural lighting` (same tokens every shot) |
| **Bold brand / AI-services art** | Grok Imagine 1.5 (OpenArt) | `RED Monstro 8K, Angenieux Optimo 24-290mm T2.8 long-lens compression, Dedolight DLED12 hard accents, DaVinci Resolve color grading high-contrast, campaign_keyframe, R3D_RAW_frame` |
| **Fashion / music / hospitality editorial** | ChatGPT Images 2.5 | `shot on Kodak Portra 400, Hasselblad 503CW, ARRI M18 HMI bounce, Peter Lindbergh fashion photography, editorial_spread` |
| **OG / social card with text** | ChatGPT Images 2.5 | `Helvetica Neue typography, Pantone color-matched signage, Adobe InDesign typography, Phase One IQ4 resolution` (1200×630) |

Multi-shot films: put these tokens in the storyboard's STYLE PACKET and the Seedance VISUAL STYLE
line (`storyboard-to-video.md` §3–4).

## 5. Guardrails

- Tokens steer look, not facts: never imply a real person's likeness, a trademark or a location that
  isn't the client's.
- Hero loops stay silent and face-free; drop audio tokens entirely.
- A token that fights the brief loses (e.g. `Kodak Portra 400` on a neon AI-services site).
- Record the chosen skeleton in `assets.yaml` (`tokens:`) per slot so reshoots match.
