# Custom typography: jumbo type and custom-type moments (v3.3)

Jumbo custom type is Chuma's signature (`taste-profile.yaml → type.signature: jumbo`). This file lists the
style options the **type picker** offers next to font pairings, how each one is built, which motion-picker
effect and runtime module it maps to, and the prompt templates for AI-rendered letters.
Reference images: `references/type-refs/`, Chuma's library of about 74 references. `scripts/type-refs-index.mjs` copies them in
and builds `INDEX.png` (contact sheet) plus `INDEX.md` (each reference labelled by style number, from `labels.yaml`).
The picker shows INDEX.png and Chuma picks visually, by number.

## Hard rules (every style)

1. **Real text, always.** Each custom-type moment keeps the word as selectable HTML text: the jumbo word is
   the `<h1>`/`<p>` itself, or (for image letters) a visually hidden `.sr-only` span inside the heading,
   with the images `alt=""` and `aria-hidden="true"`. Never ship a word that exists only as pixels.
   `verify.mjs` blocks a `.t-jumbo`, `[data-jumbo]` or `[data-ctype]` element that has no real DOM text.
2. **Fits at 320 → 2560px.** No horizontal overflow at 320, 390, 1440 or 2560. Size with container units
   (`.jumbo-box` + `cqi`); the `jumbo-fit` module (#42) fine-tunes after fonts load. verify adds a
   `narrow-320` pass and a `wide-2560` pass for every page with jumbo or custom type.
3. **No CLS on font swap.** Fallback `@font-face` with `size-adjust` / `ascent-override` from
   `scripts/type-specimens.mjs` (it writes `type-tokens.css`). Image letters carry `width`/`height`.
4. **AI words are spell-checked before they ship.** One to four words per render. For anything longer,
   generate the letters separately and assemble them. Run `scripts/letter-check.mjs`
   (OCR on white and on black; if OCR is unsure, compare the crop with the target word letter by letter, then `--confirm`).
   Mark each image with `data-ai-word="HOPE"`. `verify.mjs --letters handoff/type/ai-letters.yaml` rejects any
   AI word that hasn't passed or been confirmed, or whose word doesn't match.
5. **One custom-type moment per viewport.** It is the signature. Everything around it stays quiet.
6. **Regulated sectors** (home care, law, medical, dental, SaaS, finance): use **only style 1
   (type behind subject) and style 5 (mixed pairing)**, in calm form: a serif or sans jumbo, no distortion,
   gentle parallax at most, and no fur, candy, grunge, neon, chrome, liquid glass or goo. The type picker and
   motion picker enforce this. Liquid-glass and 3D goo type is banned there everywhere.
7. Commercial display fonts may be used only when Chuma owns the licence (UI8 library:
   `/workspace/ui8-inventory.md`, where display families include rowsky, rantaro, boldet, roena bold,
   wister bold, monigue, evolnix, nevanta, qirvalen, fenoura and velorina). Read the licence inside the ZIP
   first; web embedding is often a separate licence. Look for free Fontshare or Bunny equivalents first.

## Jumbo display system (base for every style)

Tokens are in `runtime/cwb-base.css` and are written into `design-spec.md`:

| Token | Value | Notes |
|---|---|---|
| `--t-jumbo` | `clamp(4rem, 1rem + 14vw, 18rem)` | headline jumbo |
| `--t-jumbo-bleed` | `19vw` (capped by `19cqi` in `.jumbo-box`) | edge-to-edge single word |
| `--track-jumbo` | `-0.05em` (range −0.04 to −0.06em) | tight tracking |
| `--lh-jumbo` | `0.9` (range 0.85–0.95) | tight leading |

```html
<div class="jumbo-box">
  <h1 class="t-jumbo t-jumbo--bleed" data-cwb="jumbo-fit">Signature</h1>
</div>
```
Options: `text-wrap: balance` (default), `.t-jumbo--outline` (decorative echo rows only), mixed weights and
italics (`<em>` inside `.t-jumbo` renders light italic), variable fonts with an animated `wght` axis
(`data-jumbo="axis"`), and SVG or lettering wordmarks (`references/ai-font-packs.md`, SVG route).

Motion-picker options for jumbo: `jumbo-line-reveal` (masked line reveal, via the `line-reveal` module),
`jumbo-scrub` (scroll-scrubbed scale and letter-spacing, CSS `data-jumbo="scrub"` or `"scrub-gentle"`),
`variable-axis` (CSS `data-jumbo="axis"`), and `depth-parallax` (style 1).

## Style catalogue

The `id` is what `type-specimens.mjs` (`custom_type` in type-pick.yaml) and `brief.md → custom_type` use. "Sectors" lists where the style fits.
**R** means it is allowed in regulated sectors (calm form only).

| # | id | Style | Build | Module / motion | Sectors |
|---|---|---|---|---|---|
| 1 | `behind-subject` | **Type behind subject (depth).** A jumbo word sits behind a cut-out person or product that overlaps the letters (CODE, ROAD, TRANSCEND, CLOUD, CORES, METAVERSE, WATCHING). **Chuma's favourite, and the auto-pick default for non-regulated sectors.** | Real HTML word plus a transparent WebP/PNG cutout on top (`data-ctype="behind"`), or a video with alpha (WebM VP9 alpha plus a HEVC-alpha MP4 for Safari) or a matte layer | custom-type CSS · `depth-parallax` (`data-parallax`, or `="gentle"`) · `line-reveal` on the word | all · **R** |
| 2 | `material` | **3D material letters** (fur, tennis-ball felt, cowhide, inflated bubble), 1–4 characters: monogram, number or wordmark | AI PNG/WebP glyphs, `.sr-only` word | custom-type CSS · optional Seedance/Kling loop | beauty, kids, events, sport |
| 3 | `alt-display` | **Futuristic or sci-fi display** with alternate glyphs (OSIRIS, GLUF, FONTS, NELYXA, NICOLAI) | `data-ctype="alt"`; `--ctype-features: "ss01" 1, "ss02" 1` | `line-reveal` / `scramble` | tech, gaming, music, events |
| 4 | `fill` | **Textured, grunge or video fill** (MODERN, METAVERSE) | `background-clip:text` with `--ctype-texture` (`data-ctype="fill"`); video-in-type via `data-ctype="fill-video"` (blend trick) inside a `video-chapters` chapter; SVG `<mask>` for complex art | custom-type CSS · `video-chapters` | fashion, music, streetwear, agency |
| 5 | `mixed` | **Mixed pairing**: a script word over a condensed jumbo word (Paleta de CORES), heavy over light (MODERN / RENAISSANCE), an echo stack with outlined or faded repeats (NELYXA, BECOMING BECOMING THE GREAT) | `data-ctype="mixed"` with `.ctype__script`, `.ctype__heavy`, `.ctype__light`, `.ctype__echo` (repeats `aria-hidden`, one solid real line) | `line-reveal` stagger | all · **R** (no script-over-jumbo for law; serif and sans weights only) |
| 6 | `ring` | **Curved or wrapped text**: a ring or band around the subject (GRAPHIC DESIGN) | SVG `<textPath>` (`data-ctype="ring"`); repeat the phrase as real text nearby, since the ring is `aria-hidden` | CSS `data-spin` (spins with scroll; off under reduced motion) | studio, agency, events |
| 7 | `inflated` | **Inflated, bubble or balloon**: glossy puffy candy (HOPE, the pastel "What belongs to me"), clear inflatable balloons with flowers inside (Letter B) | AI glyphs | `material` + loop: inflate / bob | kids, events, beauty, party |
| 8 | `glass` | **Glass, liquid or water**: clear jelly with droplets (pink F, AHMED), iridescent glass tubes (TU PUEDES HACERLO), molten green glass E, refractive blobs over flat jumbo type (BENZINE) | AI glyphs; *flat type under glass objects*: real HTML text plus a live refraction layer (SVG `feDisplacementMap` or WebGL) or a pre-rendered alpha video or PNG layer over it | `glass-refraction` (bold only) | spa, beverage, tech. **Banned R** |
| 9 | `tube-script` | **Tube or neon script**: one continuous 3D tube (Good Vibes Only, marbled swirl), chrome extruded script (Dope Type), white matte sculptural tube (#20) | AI wordmark (SVG trace optional) | loop: light sweep / slow turn | music, nightlife, streetwear, cafe |
| 10 | `sticker` | **Sticker, graffiti and food**: dripping juice with ice (ORANGE CRUSH), bubble graffiti with outline and pattern fill (GOD AIN'T HERE) | AI glyphs or wordmark | loop: drip | streetwear, youth, beverage |
| 11 | `object-composed` | **Object-composed letters**: many small objects (hearts D), sculpted twisted clay or candy (pastel B), mixed-colour fur (HAPPY VALENTINE DAY, LASH with a matching fur environment) | AI glyphs; background in the same material | loop: fur blowing | lash, salon, gifts, events |
| 12 | `jumbo-character` | **Jumbo plus 3D character** (DIGI GEN): a condensed jumbo word with a 3D character in front and a diagonal colour band. AURORAS: thin, wide-extended type over a 3D chrome/silk background with bubbles | Style 1 variant; band = CSS `linear-gradient` strip rotated −8° | `depth-parallax` | gaming, tech, youth, events |
| 13 | `food` | **Food and candy**: honey and honeycomb dripping (E), translucent marmalade or gummy with inner glow (X), ice-cream popsicle numbers with sprinkles (0–9 set), gradient gummy stacked words (SO HOT RIGHT NOW), strawberry-cream bubble letters (JIALI) | AI glyphs, number set | loop: drip / wobble | bakery, ice cream, candy, cafe, kids |
| 14 | `gem` | **Gem and crystal**: faceted diamond "2026" | AI glyphs (white background → cut out) | loop: sparkle sweep | jewelry, luxury, events |
| 15 | `textile` | **Textile and pillow**: plush pillow plus fur mixed letters, stacked and overlapping, with an elegant italic serif script (DREAMS, Mellow Morning); knit or terry-loop LOVE in the sky; blue fur letters on a yellow fur rug (LVIN) | AI glyphs plus a matching-material background; script line = real web font (style 5) | loop: soft sway | bedding, home goods, spa, salon |
| 16 | `giant-object` | **Giant object in a scene**: letters as real props in a photo environment (pink fur NOE hanging from a helicopter over a snowy night city) | AI still → Seedance 2.5/2.0 (Dreamina), Kling 4.0 or MiniMax H3 clip; the section's real H2 is the word | `video-chapters` (a natural video-per-section chapter) | any hero video |
| 17 | `chrome-iridescent` | **Chrome and iridescent bubbles** on a dreamy sky (GROOVY TIMES); liquid-glass drip script (Pitcha) | AI wordmark | loop: shimmer | music, nightlife, fashion. **Banned R** |
| 18 | `glass-ui` | **Glass UI pill or blobs over text** (Liquid Glass pill, Animated Bubble) | Live: SVG `feDisplacementMap` (Chromium) with a `backdrop-filter: blur()` fallback, or WebGL; text underneath is real | `glass-refraction` | tech, product, creative. **Banned R** |
| 19 | `depth-layouts` | **More jumbo depth layouts**: echo stack plus solid final line (BECOMING… THE GREAT); jumbo word behind a floating product with glass UI cards (BEYOND REALITY drone, the e-commerce pattern); jumbo behind subject with a play button (WATCHING); ROAD | Styles 1 + 5 combined; UI cards are real HTML (no glass in R) | `depth-parallax` · `line-reveal` · `video-chapters` for the play button | e-commerce, product, creator |
| 20 | `tube-matte` | **White matte 3D tube script** (monochrome Good Vibes Only) | AI wordmark | loop: slow turn | interiors, architecture, premium cafe |
| 21 | `glyph-kit` | **Full AI alphabet sets** as OTF + PNG (BubbleLuxe iridescent soap-bubble A–Z, 0–9, punctuation and matching icons such as heart, hand, arrows and cursor; NatureForm forest/river letters). **Brand glyph kit**: generate the whole set once per brand (letters, numbers, arrows, UI icons in one material) so CTAs, arrows and cursors match the hero type | PNG set, plus optional OTF (`ai-font-packs.md`, OTF route; animatable). Icons are `aria-hidden` next to real button text; commercial packs (handmadefont.com etc.) only if Chuma owns them | custom-type CSS · `magnetic-button` / `custom-cursor` (cursor PNG) | any non-regulated brand with a material identity |
| 22 | `element` | **Element and nature materials**: crumbling sand/stone with particles blowing away (SAND), moon crater rock (MOON, a Space Age brand fit), ivy and leaves (IVY), forest landscape letters (NatureForm), clouds (SKY, cloud 6), splashing water (S, Water) | AI glyphs; motion = a clip or a scroll-scrubbed frame sequence | `frame-scrub` (sand dissolve, ivy growing) · `video-chapters` loop (cloud drift, water splash) | landscaping, garden, eco, pools, plumbing, construction, space, travel |
| 23 | `dreamy-chrome` | **Dreamy chrome and glow on clouds** (FIERY SOUL, LOST IN SPACE) | AI wordmark over a sky scene | loop: cloud drift / glow pulse | music, events, fashion. **Banned R** |
| 24 | `extruded` | **3D extruded gradient or holographic letters** with offset echo shadows (FOR MORE) | AI glyphs, or live CSS: stacked `text-shadow` offsets in token colours over real text (cheap, no images) | `line-reveal` · `jumbo-scrub` | youth, events, retail promos |
| 25 | `flat-fill` | **Flat texture-filled type**: BLUES with water drops (live `background-clip:text` over an image or video, style 4), glossy black bevel (Black, AI), neon outline futuristic (NEUROCK, live CSS `-webkit-text-stroke` plus a `text-shadow` glow; a font candidate for style 3) | live CSS where possible; AI for the bevel | custom-type CSS (`data-ctype="fill"` / `.t-jumbo--outline`) | music, nightlife, gaming, pools (water fill) |
| 26 | `texture-ref` | **Texture libraries** (Cosmic and Crochet Procreate textures): not a style but the **material reference (image 2)** in the two-reference prompt method | material slot only; check each pack's licence | — | any |

**Auto-pick ranking** (`type-specimens.mjs` → `custom_type`): non-regulated sectors get `behind-subject`
first. The next choices come from the sector table below and from the moodboard (references tagged in
`type-refs/INDEX.md`). Regulated sectors get `behind-subject` (gentle) or `mixed` (calm), nothing else.

### Material → sector fit

| Material | Fits | Avoid |
|---|---|---|
| Fur, candy, balloon, inflated | beauty, kids, events, lash, salon, party | regulated |
| Food and candy (honey, gummy, popsicle, cream) | bakery, ice cream, candy, cafe, kids | regulated, luxury |
| Glass and water (jelly, droplets, refraction) | spa, beverage, tech, skincare | regulated |
| Chrome, neon tube, iridescent | music, nightlife, streetwear, fashion | regulated, home goods |
| Graffiti, sticker | streetwear, youth brands, beverage | regulated, luxury |
| Gem and crystal | jewelry, luxury, events, anniversaries | regulated |
| Textile and pillow (plush, knit, terry) | bedding, home goods, spa, salon | regulated |
| Giant object in scene | any hero video (one per site) | regulated, unless calm and literal |
| Nature, ivy, leaves, forest | landscaping, garden, eco, outdoor | regulated |
| Water, splash, drops | pools, plumbing, spa, beverage | regulated |
| Stone, sand, moon rock | construction, space (Space Age), tech, outdoor | regulated |
| Clouds, sky | travel, dreamy brands, events, airlines | regulated |
| Iridescent bubble glyph kit | beauty, kids, events, creator brands | regulated |
| Flat jumbo serif or sans (styles 1 and 5) | **everything, including regulated** | — |

## Building the depth effect (style 1)

```html
<section class="section--cinematic" data-ctype="behind" data-parallax>
  <h1 class="ctype__word t-jumbo t-jumbo--bleed" style="font-size:min(var(--t-jumbo-bleed),19cqi)">ROAD</h1>
  <img class="ctype__subject" src="/assets/hero-rider.webp" alt="" width="1200" height="1400" fetchpriority="high">
</section>
```
- The cutout comes from an image subscription (Higgsfield, OpenArt or Nano Banana background removal), or
  from a photo plus background removal. Export WebP with alpha and keep it under 180KB at 1600px.
- Video subject: WebM VP9 with alpha plus an HEVC-with-alpha MP4 for Safari, or a matte pass. Poster is the
  still cutout; under reduced motion use the still only.
- Parallax: `data-parallax` moves the word ±12% and the subject ±4% on a CSS view timeline, so the two
  layers move at different speeds. `data-parallax="gentle"` moves the word ±4% only (regulated).
  A GSAP version is used only when the page already ships ScrollTrigger.
- Regulated example (Astonishing Touch): "Care that feels like home" in the display serif, with a caregiver
  cutout overlapping the descenders, gentle parallax, and no other effects.

## Building image letters (styles 2, 7–17, 20)

```html
<h2 class="ctype-word" data-ctype="material">
  <span class="sr-only">Hope</span>
  <img class="ctype__glyph" src="/assets/type/hope.webp" alt="" aria-hidden="true" width="1600" height="560" data-ai-word="HOPE">
</h2>
```
Per-letter assembly (longer words): one `<img data-ai-word="H">` per glyph, with the `.sr-only` word beside them.

**Number set.** Generate a full 0–9 set once per brand in the brand material (popsicle, gem, balloon…) at the
same camera angle and light. Use it for stats, prices and step numbers:
`<p class="stat"><span class="sr-only">250</span><span aria-hidden="true"><img src="/assets/num/2.webp" alt="">…</span> families served</p>`.
The real number is always in the HTML (structured data and AEO read it). Store it in `assets/num/0-9.webp`
plus `ai-letters.yaml` entries (word = the digit). Each digit must pass letter-check.

**Animation loops (optional, one autoplay at a time).** Image letters → 4–6s seamless loop in Seedance 2.5/2.0
(Dreamina), Kling 4.0 or MiniMax H3 (no Grok video): inflate, wobble, droplets falling, fur blowing, drip,
sparkle sweep, slow turn. Ship it as a `video-chapters` chapter (lazy, poster = the still, pause control);
under reduced motion, show the still.

### Prompt templates (Higgsfield, OpenArt or Nano Banana; Seedream 4 / 4.5 where noted)

**Two-reference method** (shape plus material): reference 1 is the letter shape (the word set in the chosen
display font, black on white, from `type-specimens.mjs`), reference 2 is the surface material (a photo).
Each template ends with the **shared tail**:
> transparent background, studio lighting, soft contact shadow, straight-on view, keep the letters clearly readable, exactly the letters "{WORD}", no extra letters, no other text, high detail, advertisement-quality product photography

| Style | Prompt (before the shared tail) |
|---|---|
| Material (2), cowhide-M method | "Use image 1 for the exact letter shape and proportions and image 2 for the surface material only. 3D letter '{WORD}' made of {material: cowhide / tennis-ball felt / long fur}, realistic texture wrapping the edges, rounded bevels" |
| Inflated (7) | "3D glossy inflated puffy letters '{WORD}', candy pastel {colours}, soft highlights, balloon-like volume" / balloon: "3D rendering of inflatable letter '{L}', transparent balloon with {small flowers} inside, anti-gravity, floating, bright light" |
| Glass/water (8) | "3D letter '{L}' made of clear {pink} jelly glass with water droplets on the surface, refraction, caustics" / "iridescent glass tube lettering '{WORD}', thin hollow tubes, rainbow reflections" / "molten {green} glass letter '{L}', dripping, glowing edges" |
| Tube script (9, 20) | "one continuous 3D tube script '{WORD}', {marbled pastel swirl / polished chrome with extrusion / white matte clay}, single unbroken stroke, sculptural" |
| Sticker/food (10) | "3D letters '{WORD}' made of {orange juice} dripping with ice cubes, fresh, splashes" / "bubble graffiti letters '{WORD}', thick outline, {pattern} fill, sticker style" |
| Object-composed (11) | "letter '{L}' composed of many small {red hearts / pastel candies}, densely packed, holding a clear letter silhouette" / "{mixed-colour} fur letters '{WORD}' on a matching fur background" |
| Food (13) | Honey: "letter '{L}' made of honeycomb with golden honey dripping". Marmalade (Seedream 4.5): "letter '{L}' made of translucent fruit marmalade, complex shape, coloured layers, inner glow, studio light, bright candy background, playful 3D typography". Popsicle numbers: "ice-cream popsicle shaped as the number '{N}', {flavour} colours, sprinkles, small drips, wooden stick". Gummy: "stacked gradient gummy letters '{WORD}'". Cream: "strawberry-cream bubble letters '{WORD}'" |
| Gem (14) | Seedream 4: "hyper-realistic 3D '{WORD}' made of faceted diamonds, shimmer and sparkle with colourful reflections, solid white background, advertisement-quality photography, studio lighting, soft shadows, straight-on view" (then remove the background) |
| Textile (15) | "plush pillow letters '{WORD}' mixed with {fur} letters, stacked and overlapping, soft fabric seams" / "knitted terry-loop letters '{WORD}' floating in a {soft blue sky}" / "{blue} fur letters on a {yellow} fur rug, matching material scene" (scene background, no transparency) |
| Giant object (16) | "giant {pink fur} letters '{WORD}' hanging from a helicopter over a snowy city at night, cinematic wide shot, real-world scale, volumetric light" (scene) → video: "slow push-in, letters sway gently in the wind, snow falling, 5s, seamless" |
| Chrome/iridescent (17) | "chrome iridescent bubble letters '{WORD}' on a dreamy pastel sky, reflections of clouds" / "liquid glass drip script '{WORD}'" |

Loop prompts (Seedance, Kling or MiniMax, image-to-video from the approved still): "the letters {inflate slightly
and settle / wobble like jelly / shed slow droplets / fur moves softly in a breeze / honey drips slowly},
locked camera, seamless loop, 5 seconds, no new text appears, letters stay exactly '{WORD}'". Run letter-check
on the first, middle and last frames (`ffmpeg -vf select`).

## Element motion (style 22 and any material loop)

| Motion option (catalog id) | What Chuma sees | Build |
|---|---|---|
| `sand-dissolve` | the word crumbles into particles that blow away as you scroll | 60–90 frame sequence (AI still → Seedance/Kling clip → `ffmpeg -vf fps=30` → WebP frames) driven by `frame-scrub`; the real H2 fades in underneath |
| `cloud-drift` | cloud letters drift slowly and keep their shape | 5s seamless loop as a `video-chapters` chapter |
| `water-splash` | the letter splashes once when it enters view | short clip, played once (not looped), poster = still |
| `ivy-grow` | ivy grows over the letters as you scroll | `frame-scrub` frame sequence (grow pass rendered from the final still backwards) |
| `bubble-wobble` | bubble or jelly letters wobble gently | loop clip, or CSS `scale` keyframes on the PNG (cheap) |

Each option has two routes: a **clip** (Seedance 2.5/2.0 in Dreamina, Kling 4.0, MiniMax H3) or a **scroll-scrubbed frame
sequence**. Sequences cost more (frames are weight), so use one per page at most, ≤ 1.2MB total, and load the
frames lazily after first load. Under reduced motion, show the final still. Run letter-check on the first,
middle and last frames.

## Brand glyph kit (style 21)

Generate once per brand in one session, with the same material reference, camera and light:
A–Z, 0–9, `& ? ! . , ' -`, and icons (→ ← ↗, heart, hand/pointer cursor, play, plus, check).
Store it in `assets/glyphs/{char}.webp`, with `assets/glyphs/kit.yaml` listing each file's char and size.
Use it for the hero word (style 2), stat numbers (number set), CTA arrows (`<span aria-hidden>` next to real
button text), and the cursor (`cursor: url(/assets/glyphs/cursor.png) 4 4, auto` on desktop fine pointer only).
Every letter and digit goes into `ai-letters.yaml` and must pass letter-check.

## Live refraction (styles 8 and 18, non-regulated only)

Real HTML text sits underneath; the glass is decoration on top (`aria-hidden`):
```html
<svg width="0" height="0" aria-hidden="true"><filter id="cwb-refract"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="28" xChannelSelector="R" yChannelSelector="G"/></filter></svg>
<div class="glass-pill" aria-hidden="true"></div>  <!-- backdrop-filter: url(#cwb-refract) blur(2px) in Chromium; blur-only elsewhere -->
```
`backdrop-filter: url()` works in Chromium only, so feature-detect it and fall back to `blur()` plus a highlight
gradient. For blobs that move, use WebGL (an OGL or three.js fragment shader sampling a texture of the text)
at flagship tier only, or a pre-rendered alpha video over the real text. The reduced-motion pass must show
static text with no blobs.

## Picker integration

- `type-specimens.mjs` now outputs `custom_type:` (top 3 styles with why, filtered by sector and moodboard).
  The specimen sheet shows the jumbo headline at 1440/390 in the chosen pairing (`--t-jumbo`, tracking and leading).
- `motion-catalog.yaml` gains `depth-parallax`, `jumbo-scrub`, `variable-axis`, `ring-spin` and `glass-refraction`
  (bold only). Image letters add an optional `video-chapters` loop.
- Picks feed the taste profile (`type.custom_type_liked`).
