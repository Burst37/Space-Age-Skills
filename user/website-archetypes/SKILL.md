# Website Design Archetypes — Visual Language Library v2

> Built from direct analysis of uploaded reference images. Each archetype is a complete design system: layout DNA, typography treatment, color strategy, motion signature, component patterns, and production CSS/JS code.

**When to load**: Any request to build a website, landing page, hero section, or UI that should "look like" a specific aesthetic. Run ARCHETYPE MATCH first, then execute the full system for that archetype.

---

## ARCHETYPE INDEX

| # | Name | Visual Signature | Key References |
|---|---|---|---|
| W1 | **Editorial 3D Hero** | Giant bleed type + floating 3D object | SAPFORCE (Image 1) |
| W2 | **Dark Cinematic Atmospheric** | Black bg + subject + radial neon glow | ORION (Image 2) |
| W3 | **Kinetic Split Brand** | Oversized floor text + motion blur subject | Kinetic Studio (Image 7) |
| W4 | **Spatial VR Interface** | Glassmorphic panels in 3D environments | P58 (Image 9) |
| W5 | **3D Soft World UI** | Clay sculpted env + glowing frosted panel | Wellness (Image 8) |
| W6 | **Product Poster Editorial** | Blurred BG type + hero product + vivid color | Koenigsegg (Image 5) |
| T1 | **Inflated Glass Bubble Type** | Prismatic jelly 3D letters | TU PUEDES (Image 3) |
| T2 | **Embroidery / Textile Type** | Raised puffy stitching typography | PATCH (Image 4) |
| T3 | **Inflatable Botanical Letter** | Clear balloon letter with flowers inside | Balloon B (Image 6) |
| T4 | **Creature / Organic Script** | Script text formed from animal/natural material | Octopus (Image 10) |

---

## W1 — EDITORIAL 3D HERO

**Source**: SAPFORCE  
**Identity**: Light, clean, ultra-confident. Giant display type as architecture. 3D object as the hero — not decoration.

### Layout DNA
```
┌─────────────────────────────────────────────────────┐
│  NAV: logo left  |  links center  |  CTA right      │ 56px
├─────────────────────────────────────────────────────┤
│                                                     │
│  DISPLAY TYPE ─────────────────────────────── bleed  │ 25vh
│  (ultra-bold, fills 90% of viewport width)          │
│                                                     │
│   [avatar stack + 2M+]          [/01 /02 /03 list]  │ flex row
│                                                     │
│           [ 3D OBJECT CENTER ]                      │ 45vh centered
│                                                     │
│  body copy — left col           [ ► CTA pill ]      │
│  •••••••••••••••••••             accent color        │
└─────────────────────────────────────────────────────┘
```

### Typography System
```css
/* W1 — Editorial 3D Hero type system */
:root {
  --w1-font-display: 'Bebas Neue', 'Anton', 'Barlow Condensed', sans-serif;
  --w1-font-body: 'Inter', 'DM Sans', system-ui, sans-serif;

  /* CRITICAL: Display fills viewport width */
  --w1-display-size: clamp(4rem, 18vw, 16rem);
  --w1-display-weight: 900;
  --w1-display-tracking: -0.02em;
  --w1-display-leading: 0.85;

  /* Color */
  --w1-bg: #f0eeeb;          /* Warm off-white, not pure white */
  --w1-text: #0f0f0f;        /* Near-black */
  --w1-accent: #b8f000;      /* Lime green — or brand accent */
  --w1-meta: #888;
}

.w1-headline {
  font-family: var(--w1-font-display);
  font-size: var(--w1-display-size);
  font-weight: var(--w1-display-weight);
  letter-spacing: var(--w1-display-tracking);
  line-height: var(--w1-display-leading);
  color: var(--w1-text);
  text-transform: uppercase;

  /* Bleeds past container */
  margin-left: -2vw;
  margin-right: -2vw;
  width: calc(100% + 4vw);
}
```

### 3D Object Specs
```css
.w1-3d-object {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -30%);
  width: clamp(280px, 45vw, 600px);
  z-index: 2; /* Sits above the type */

  /* Float animation */
  animation: w1-float 6s ease-in-out infinite;
}

@keyframes w1-float {
  0%, 100% { transform: translate(-50%, -30%) rotateY(0deg); }
  25%       { transform: translate(-50%, -33%) rotateY(4deg); }
  75%       { transform: translate(-50%, -27%) rotateY(-4deg); }
}
```

### Sidebar Numbered List
```css
.w1-sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: right;
}
.w1-sidebar-item {
  font-family: var(--w1-font-body);
  font-size: 0.75rem;
  color: var(--w1-meta);
  letter-spacing: 0.04em;
}
.w1-sidebar-item::after {
  content: ' /' attr(data-num);
  color: var(--w1-meta);
  font-variant-numeric: tabular-nums;
}
```

### CTA Pill
```css
.w1-cta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--w1-accent);
  color: #000;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms;
}
.w1-cta-pill:hover {
  transform: scale(1.04) translateY(-2px);
  box-shadow: 0 8px 24px oklch(from var(--w1-accent) l c h / 0.4);
}
.w1-cta-pill::before { content: '►'; font-size: 0.7rem; }
```

### AI Prompt for 3D Object
```
Hyper-realistic 3D render of [ORGANIC CHROME OBJECT DESCRIPTION],
liquid chrome metallic surface merging with [SECONDARY MATERIAL: lime green liquid / translucent glass],
Saturn-like orbital rings encircling the object at an angle,
floating against warm off-white background #f0eeeb,
soft diffuse studio lighting, high-key fill,
Cinema 4D + Octane render, 8K, no shadows on background,
product photography quality, transparent PNG output
```

---

## W2 — DARK CINEMATIC ATMOSPHERIC

**Source**: ORION  
**Identity**: Premium dark brand. Subject in shadows. Atmospheric glow. Zero clutter. Confidence through restraint.

### Layout DNA
```
┌─────────────────────────────────────────────────────┐
│  [△ logo]  Home  About  Services  Contact  [CTA→]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SUBJECT photograph fills entire frame              │
│  (dark-processed, low-key, face partially lit)      │
│                                                     │
│  ████████████████  ← radial neon glow behind head  │
│                                                     │
│  O R I O N                         [subject image] │
│  Where Innovation Knows No Bounds                   │
│                                                     │
│  [Discover →]  |  [△ Connect]                      │
│                                                     │
│  f  ig  X               ○ (scroll indicator)        │
└─────────────────────────────────────────────────────┘
```

### Typography System
```css
:root {
  --w2-font-display: 'Orbitron', 'Exo 2', 'Rajdhani', sans-serif;
  --w2-font-body: 'Inter', 'Barlow', sans-serif;

  --w2-bg: #050f08;
  --w2-glow: #00c65a;    /* Deep green */
  --w2-text: #ffffff;
  --w2-sub: rgba(255,255,255,0.6);
}

.w2-headline {
  font-family: var(--w2-font-display);
  font-size: clamp(2.5rem, 8vw, 7rem);
  font-weight: 700;
  letter-spacing: 0.35em;   /* CRITICAL — wide tracking is the W2 signature */
  text-transform: uppercase;
  color: var(--w2-text);
  line-height: 1;
}

.w2-sub {
  font-family: var(--w2-font-body);
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.06em;
  color: var(--w2-sub);
  margin-top: 0.75rem;
}
```

### Atmospheric Glow System
```css
/* Radial glow behind subject — the W2 signature effect */
.w2-atmosphere {
  position: absolute;
  width: 60vw; height: 60vw;
  max-width: 600px; max-height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    oklch(60% 0.2 150 / 0.35) 0%,    /* Bright neon center */
    oklch(40% 0.15 150 / 0.15) 40%,
    transparent 70%
  );
  top: 50%; right: 10%;
  transform: translate(20%, -50%);
  pointer-events: none;
  animation: w2-pulse 4s ease-in-out infinite;
}

@keyframes w2-pulse {
  0%, 100% { opacity: 0.8; transform: translate(20%, -50%) scale(1); }
  50%       { opacity: 1; transform: translate(20%, -50%) scale(1.08); }
}
```

### Scroll Indicator
```css
.w2-scroll-indicator {
  width: 28px; height: 44px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 14px;
  position: relative;
}
.w2-scroll-indicator::after {
  content: '';
  position: absolute;
  width: 4px; height: 8px;
  background: rgba(255,255,255,0.6);
  border-radius: 2px;
  left: 50%; transform: translateX(-50%);
  top: 6px;
  animation: w2-scroll-dot 1.5s ease-in-out infinite;
}
@keyframes w2-scroll-dot {
  0% { top: 6px; opacity: 1; }
  100% { top: 22px; opacity: 0; }
}
```

---

## W3 — KINETIC SPLIT BRAND

**Source**: Kinetic Studio  
**Identity**: Agency power. Motion-blurred subject with energy. Oversized floor-level type. High-contrast light/dark split.

### Floor Type System
```css
/* The W3 signature: massive word as floor element */
.w3-floor-type {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: clamp(8rem, 20vw, 20rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.85;
  text-transform: lowercase;
  color: rgba(255,255,255,0.95);

  position: absolute;
  bottom: -0.08em;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;
  width: 100vw;
  text-align: center;
}

.w3-floor-type--dark {
  color: rgba(15,15,15,0.08);
}
```

### Accent Color — Orange/Fire
```css
:root {
  --w3-accent: #ff4500;
  --w3-accent-glow: oklch(60% 0.25 40);
}
.w3-accent-btn {
  background: var(--w3-accent);
  color: white;
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  font-weight: 700;
  border: none;
}
```

---

## W4 — SPATIAL VR INTERFACE

**Source**: P58  
**Identity**: Spatial computing aesthetic. UI exists in 3D physical space. Dark rounded windows floating in environment.

### Glassmorphic Panel System
```css
.w4-panel {
  background: rgba(12, 10, 8, 0.78);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.4),
    0 24px 48px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.08);
  overflow: hidden;
}

.w4-cell {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1rem;
}

.w4-cell--light {
  background: rgba(255,255,255,0.92);
  border-color: rgba(0,0,0,0.06);
  color: #111;
  border-radius: 14px;
  padding: 1.25rem;
}
```

### Environment Background
```css
.w4-environment {
  position: fixed; inset: 0;
  background: url('environment.jpg') center/cover;
  filter: brightness(0.8) saturate(1.1);
}

.w4-interface {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: auto;
  transform: perspective(2000px) rotateX(2deg);
  transform-origin: center bottom;
}
```

---

## W5 — 3D SOFT WORLD UI

**Source**: Wellness UI  
**Identity**: Apple visionOS meets ambient nature. UI as object. Soft clay environment surrounds a glowing frosted panel.

### CSS Frosted Panel
```css
.w5-panel {
  background: rgba(255, 248, 240, 0.6);
  backdrop-filter: blur(32px) brightness(1.1);
  -webkit-backdrop-filter: blur(32px) brightness(1.1);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 24px;
  padding: 2rem;

  box-shadow:
    inset 0 0 60px rgba(255, 220, 160, 0.3),
    0 0 0 1px rgba(255,255,255,0.6),
    0 40px 80px rgba(180, 130, 90, 0.25);
}
```

### AI Prompt for 3D Environment
```
Hyper-realistic 3D render of soft clay landscape,
undulating smooth terrain in warm sandy tones (#d4b8a0),
scattered small ceramic animal figurines (bird, mushroom shapes),
small red berries/strawberries on surface,
centered frosted glass UI panel with warm internal glow,
Pixar / visionOS aesthetic, soft overhead lighting,
Clay render, pastel color palette, high-key ambient light,
Cinema 4D + Redshift, 8K, photorealistic --ar 1:1
```

---

## W6 — PRODUCT POSTER EDITORIAL

**Source**: Koenigsegg  
**Identity**: Oversized background type as texture. Hero product in sharp focus. Vivid brand color.

### Background Type System
```css
.w6-bg-type {
  position: absolute;
  font-family: 'Bebas Neue', 'Anton', sans-serif;
  font-size: clamp(8rem, 25vw, 22rem);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.9);
  line-height: 0.85;
  filter: blur(2px);
  top: 15%;
  left: -2vw;
  pointer-events: none;
  user-select: none;
}
.w6-bg-type-reflected {
  transform: scaleX(-1);
  opacity: 0.6;
  filter: blur(4px);
}
```

### Multi-Column Editorial Header
```css
.w6-editorial-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.w6-col-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}
```

---

## T1 — INFLATED GLASS BUBBLE TYPE

**Source**: TU PUEDES HACERLO  
**Visual**: 3D inflated glass/jelly letterforms. Prismatic multi-color.

### AI Prompt Formula
```
3D typographic letters "[TEXT]", inflated bubble letterforms,
each letter made of transparent colored glass/acrylic,
jelly-like texture with subsurface light scattering,
prismatic color spectrum — each letter different:
[blue, purple, pink, orange, cyan, violet],
highly polished smooth surface with specular highlights,
caustic light reflections on white satin drape background,
dramatic soft studio lighting, white and light grey tones,
Cinema 4D + Octane render, 8K, photorealistic quality,
each letter slightly overlapping, centered composition --ar 2:3
```

### CSS Approximation
```css
.bubble-letter {
  font-family: 'Nunito', 'Fredoka One', 'Paytone One', sans-serif;
  font-weight: 900;
  font-size: clamp(5rem, 18vw, 14rem);
  display: inline-block;

  background: radial-gradient(
    ellipse at 30% 30%,
    rgba(255,255,255,0.9) 0%,
    var(--bubble-color) 30%,
    oklch(from var(--bubble-color) calc(l - 0.15) c h) 70%,
    oklch(from var(--bubble-color) calc(l - 0.25) c h) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  filter:
    drop-shadow(0 8px 16px oklch(from var(--bubble-color) l c h / 0.4))
    drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.bubble-letter:nth-child(1) { --bubble-color: oklch(65% 0.25 250); }
.bubble-letter:nth-child(2) { --bubble-color: oklch(55% 0.3 300); }
.bubble-letter:nth-child(3) { --bubble-color: oklch(65% 0.3 330); }
.bubble-letter:nth-child(4) { --bubble-color: oklch(65% 0.25 50); }
.bubble-letter:nth-child(5) { --bubble-color: oklch(65% 0.25 200); }
```

---

## T2 — EMBROIDERY / TEXTILE TYPE

**Source**: PATCH  
**Visual**: Puffy 3D embroidered patch. Visible stitching texture. Candy pastel palette.

### AI Prompt Formula
```
Shoelace patch typography "[YOUR TEXT]", puffy embroidered badge,
raised soft 3D stitching visible on each letterform,
candy pop color palette: bubblegum pink, mint green, lavender purple,
highly detailed fabric texture, visible woven fibers and thread details,
kawaii streetwear style, isolated typography,
subtle drop shadow on white surface, product photography style,
isolated on pure white background,
Ultra detailed, 8K, photorealistic render
```

---

## T3 — INFLATABLE BOTANICAL LETTER

**Source**: Balloon B  
**Visual**: Clear inflatable plastic letter. Flowers and leaves visible inside/on surface.

### AI Prompt Formula
```
3D letter "[LETTER]" shaped as inflatable transparent plastic balloon,
pink peonies and green leaves distributed across the surface,
vines hanging down from letter bottom,
crystal clear inflatable material with visible light refraction,
floating against blue sky with white clouds,
bright daylight, photorealistic render,
anti-gravity floating sensation, wide angle from below,
Cinema 4D + Redshift, 8K --ar 9:16 --v 7
```

---

## T4 — CREATURE / ORGANIC SCRIPT

**Source**: Octopus Text  
**Visual**: Script calligraphy text formed from hyperrealistic creature/animal material.

### AI Prompt Formula
```
The text "[YOUR TEXT]", fluid organic calligraphy typography,
letters formed and wrapped by octopus tentacles,
suckers clearly visible on each letterform,
tentacles following the curves and strokes of the letters,
wet glossy surface with light reflections,
deep sea lighting, dark blue gradient background,
ultra detailed, centered composition, 4K --ar 3:4
```

### Material Variations
```
CREATURE MATERIALS:
- Octopus tentacles — deep sea, dark blue BG
- Snake scales — desert, sandy tones
- Dragon scales — fantasy, fire/dark BG
- Coral reef — ocean teal, underwater
- Tree roots — forest floor, earth tones
- Lava/magma — black rock + glowing red
- Crystal/quartz — white cave, prismatic light
- Ice/glacier — polar white/blue, frost
- Feathers — soft and light, various colors
```

---

## ARCHETYPE MATCH PROTOCOL

When given a reference image or description:

```
STEP 1 — IDENTIFY
  → Which archetype matches? (W1–W6, T1–T4)
  → Hybrid? (W1 + W4 = editorial with glassmorphic overlay)
  → Output: "ARCHETYPE: [code + name] — [confidence]"

STEP 2 — EXTRACT SYSTEM
  → Load the archetype's layout DNA, typography, color, components
  → Identify which specific elements are present
  → Note any brand-specific variations

STEP 3 — EXECUTE
  → For WEBSITES: full HTML structure + CSS system + JS interactions
  → For TYPE ART: AI prompt formula + platform selection + CSS approximation
  → For COMPONENTS: isolated component CSS + states + JS

STEP 4 — BRAND LAYER
  → Inject client's colors into CSS custom properties
  → Swap font family with identified or brand font
  → Adjust accent color throughout
```

---

## PRODUCTION QUICKSTART

### Starting a W1 (Editorial 3D Hero) site
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Brand]</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  /* W1 SYSTEM — paste from archetype above */
</style>
</head>
<body>
  <nav class="w1-nav">...</nav>
  <section class="w1-hero">
    <h1 class="w1-headline">[BRAND].</h1>
    <div class="w1-3d-object">
      <img src="3d-object.png" alt="">
    </div>
  </section>
</body>
</html>
```

### Starting a W2 (Dark Cinematic) site
```html
<section class="w2-hero" style="background: var(--w2-bg); position:relative; overflow:hidden; min-height:100vh;">
  <div class="w2-atmosphere"></div>
  <nav class="w2-nav">...</nav>
  <div class="w2-content">
    <h1 class="w2-headline">O R I O N</h1>
    <p class="w2-sub">Where Innovation Knows No Bounds</p>
    <div class="w2-cta-group">
      <button class="w2-cta-circle">Discover</button>
      <button class="w2-cta-circle">Connect</button>
    </div>
  </div>
  <img class="w2-subject" src="subject.jpg" alt="">
</section>
```
