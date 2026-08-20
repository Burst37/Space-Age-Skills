---
name: google-stitch
description: >
  Rapid UI layout ideation using Google Stitch (Google Labs AI UI prototyping tool at
  stitch.withgoogle.com). Use IMMEDIATELY when the user wants to see layout variations quickly,
  prototype a screen before coding, or generate UI mockups for review. Sits between UI/UX
  Designer (direction) and Cinematic Website Builder (production). Trigger when user says
  "show me what it could look like," "give me layout options," "prototype this fast," "stitch
  this up," or when a Handoff Package arrives from UI/UX Designer with next_step: google_stitch.
---

# GOOGLE STITCH SKILL
## Space Age AI Solutions — Rapid UI Prototyping Layer

Google Stitch (https://stitch.withgoogle.com) is a Google Labs AI tool that generates UI screens from natural language. It sits between the UI/UX Designer (direction) and Cinematic Website Builder (production). It is NOT the final deliverable — it is the layout proof that gets handed to production.

---

## PIPELINE POSITION

[UI/UX DESIGNER] → Sets direction, design system, moodboard choice, Handoff Package
[GOOGLE STITCH] → Rapid layout visualization, screen variations, export for handoff
[CINEMATIC WEBSITE BUILDER] → Production HTML/CSS/JS, 30 effect modules, animations, single-file delivery

---

## STITCH PROMPT FORMULA

[SCREEN TYPE] for [PRODUCT NAME], [MOODBOARD AESTHETIC],
[KEY SECTIONS in order], [COLOR PALETTE with hex codes],
[TYPOGRAPHY direction], [SPECIFIC COMPONENTS],
[DEVICE FORMAT], [TONE DESCRIPTOR]

---

## THE 5 STITCH PROMPT TYPES

### TYPE 1 — Full Page Layout
Full landing page for [PRODUCT]. [MOODBOARD] aesthetic.
Sections in order: [1], [2], [3], [4].
Color palette: bg=[hex], primary=[hex], accent=[hex].
Font direction: [display font] + [body font]. Desktop-first.

### TYPE 2 — Single Section / Component
[SECTION NAME] section for [PRODUCT] website.
Contains: [list elements]. Aesthetic: [moodboard].
Colors: [palette]. Show desktop + mobile version.

### TYPE 3 — Dashboard / Data UI (LoyaltyBot, analytics)
Dashboard screen for [PRODUCT]. Data: [metrics/widgets list].
Aesthetic: Hardware Console / Dark Data-Viz. Dark background, [accent] LEDs.
Layout: sidebar nav + main content + status bar.
Components: live counters, progress bars, status indicators, log feed. Desktop only.

### TYPE 4 — Mobile-First Screen
Mobile app screen for [PRODUCT]. Screen: [type].
[iOS/Android] style, [light/dark] mode. Contains: [components].
Aesthetic: [moodboard]. Show bottom tab navigation.

### TYPE 5 — Variation Set (pick a direction)
Generate 3 layout variations for the hero section of [PRODUCT].
Variation A: [layout description].
Variation B: [layout description].
Variation C: [layout description].
All use: [moodboard] aesthetic, [colors], [font direction].

---

## EXAMPLE PROMPTS (READY TO USE)

### LoyaltyBot Landing Page (Moodboard A):
Landing page for "LoyaltyBot" by Space Age AI Solutions. Dark tech aesthetic —
OLED black background (#000000), orange accent (#FF6B00), monospaced data elements.
Sections: hero with animated counter stat, 3-feature grid, testimonial strip, pricing CTA.
Typography: Orbitron headlines, DM Sans body. Components: mission-control dashboard preview,
orange LED-style stat badges, floating pill navigation. Desktop layout, dark mode.
Tone: premium automation tool, mission critical.

### Space Age Credit Landing (Moodboard M):
Landing page for "Space Age Credit" credit repair service. Maximalist luxury aesthetic —
deep black (#0d0007), gold (#c9a96e), jewel purple (#7b2d8b).
Sections: hero with bold stat (clients helped), process steps (3-step), results proof,
testimonials with photo, CTA. Typography: Cormorant Garamond display, Montserrat body.
Components: gold accent borders, numbered process cards, before/after score display.
Desktop-first. Tone: powerful, results-driven, premium.

### Record Exec in a Box (Moodboard F):
Landing page for "Record Exec in a Box" artist management toolkit. Urban street / hip-hop
aesthetic — near-black (#111111), gold (#FFD700), red punch (#FF2040).
Sections: hero with artist photo, 7 feature modules grid, pricing, CTA.
Typography: Black Han Sans display, Space Mono body.
Components: sticker-style badges, raw-energy typography, gold rule dividers.
Desktop layout. Tone: raw, powerful, street-smart meets professional.

---

## STITCH WORKFLOW

1. Receive Handoff Package from UI/UX Designer skill
2. Choose prompt TYPE (1-5) based on what's needed
3. Build the prompt from Handoff Package values
4. Go to https://stitch.withgoogle.com — paste prompt — generate
5. Evaluate output against checklist
6. Select variation and document WHY
7. Build Stitch-to-Code Bridge YAML for Cinematic Website Builder

### Evaluation Checklist
- Matches moodboard aesthetic?
- Hierarchy clear — user knows where to look first?
- Color system feels correct?
- Spacing is consistent and breathable?
- Solves the user flow needs?

---

## STITCH → WEBSITE BUILDER MODULE MAP

Stitch full-screen hero + overlay text → Module 07 Curtain Reveal
Stitch hero with layered depth background → Module 03 Layered Parallax
Stitch feature cards revealing on scroll → Module 16 Spotlight Cards
Stitch sticky product + scrolling features → Module 02 Sticky Stack
Stitch number / stat callouts → Module 20 Odometer
Stitch logo ticker strip → Module 25 Marquee
Stitch high-impact CTA button → Module 19 Particle Button
Stitch floating navigation bar → Module 22 Dynamic Island Nav
Stitch ambient background color wash → Module 26 Mesh Gradient
Stitch portfolio / product gallery → Module 04 Horizontal Scroll
Stitch section headline with impact → Module 01 Text Mask Reveal
Stitch typography scramble effect → Module 24 Scramble Text
Stitch liquid glass hero or card → Module LG-01 Liquid Glass Typography (see section below)

---

## LIQUID GLASS TYPOGRAPHY
### Stitch Prompts + Figma/Framer Implementation Spec

Liquid glass typography is a composited effect — Stitch describes the layout and visual intent,
but the real effect is assembled in Framer (or coded post-handoff). This section gives you:
1. Stitch prompts that correctly describe the effect so output is usable
2. The exact Figma layer stack and Framer code spec to implement it

---

### LIQUID GLASS STITCH PROMPTS

#### LG TYPE 1 — Hero with Liquid Glass Headline
Hero section for [PRODUCT]. [MOODBOARD] aesthetic.
Headline text sits on a frosted glass panel — semi-transparent surface with visible background
blur behind the letterforms. Glass panel has soft white inner glow on top edge, subtle drop
shadow below. Text color: near-white (#F5F5F7) or brand color at 90% opacity.
Background: rich gradient or photographic. Desktop-first.
Tone: [TONE]. Show the glass panel as a distinct layer above the background.

#### LG TYPE 2 — Glass Card with Typography Inside
Feature card for [PRODUCT]. Card surface is frosted glass —
blurred background visible through the card, white border at 15% opacity,
inner highlight streak (white gradient, top-left to center, 8% opacity).
Card contains: [ICON or LABEL], headline text, 1-line descriptor.
Card background: rgba(255,255,255,0.08) on dark bg OR rgba(0,0,0,0.06) on light bg.
Corner radius: 20px. Slight inset shadow. Text: white or near-white.

#### LG TYPE 3 — Floating Glass Navigation
Floating navigation bar for [PRODUCT] website. Nav pill style —
frosted glass surface, backdrop blur visible, white border at 12% opacity.
Contains: logo left, 4 nav links center, CTA button right.
Nav sits 24px from top, centered horizontally. Dark mode.
Glass treatment: semi-transparent dark fill (#1a1a1a at 60% opacity), blur behind.

#### LG TYPE 4 — Full Liquid Glass Screen (Apple-style)
Full landing page for [PRODUCT]. Apple Vision Pro / visionOS aesthetic.
Every major UI surface uses liquid glass treatment:
  — Hero panel: large frosted glass card, headline in white, subtext in rgba(255,255,255,0.7)
  — Feature cards: glass surfaces with inner highlight streaks
  — Navigation: glass pill floating at top
  — CTA section: glass button with shimmer highlight
Background: deep gradient (#0a0a0f to #1a1040). All glass layers show depth and refraction.
Typography: SF Pro Display style (use: Inter or Plus Jakarta Sans as substitute).
Desktop-first. Tone: premium, spatial, next-generation.

#### LG TYPE 5 — Glass Typography Variations
Generate 3 variations of a hero section for [PRODUCT] using liquid glass typography:
Variation A: Dark glass — near-black frosted surface, white headline, ultra-minimal.
Variation B: Colorized glass — glass tinted with brand accent color at 20% opacity, white text.
Variation C: Transparent text — headline text is transparent/cutout, background shows through letterforms.
All variations: backdrop blur effect visible, soft inner glow on glass edges, dark background.

---

### FIGMA LAYER STACK — Liquid Glass Panel

This is the exact layer order in Figma to build a liquid glass panel:

```
[Frame: Glass Panel]
  ├── Layer 1: Background Blur Source
  │     Effect: Background Blur → Blur: 24
  │     Fill: rgba(255, 255, 255, 0.08)  ← adjust for dark/light bg
  │
  ├── Layer 2: Specular Highlight (top edge)
  │     Shape: Rectangle, 100% width × 1px height, top of panel
  │     Fill: Linear gradient → rgba(255,255,255,0.6) to rgba(255,255,255,0)
  │
  ├── Layer 3: Inner Caustic Streak
  │     Shape: Rectangle, 40% width × 60% height, top-left aligned
  │     Fill: Linear gradient (135°) → rgba(255,255,255,0.12) to rgba(255,255,255,0)
  │     Blend mode: Screen
  │
  ├── Layer 4: Border
  │     Stroke: rgba(255, 255, 255, 0.15), 1px, Inside
  │
  ├── Layer 5: Drop Shadow
  │     Shadow: x=0, y=8, blur=32, spread=0, rgba(0,0,0,0.25)
  │     Inner Shadow: x=0, y=1, blur=0, spread=0, rgba(255,255,255,0.2)
  │
  └── Layer 6: Text Content
        Fill: #FFFFFF or rgba(255,255,255,0.9)
        Font: [display font] — weight 600–700
        Optional: mix-blend-mode Overlay for deeper integration
```

Tokens Studio export (use these exact custom property names):
```css
--glass-blur: 24px;
--glass-fill: rgba(255, 255, 255, 0.08);
--glass-border: rgba(255, 255, 255, 0.15);
--glass-highlight-opacity: 0.12;
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
--glass-inner-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
--glass-radius: 20px;
--glass-text: rgba(255, 255, 255, 0.95);
```

---

### FRAMER MOTION IMPLEMENTATION SPEC

#### Glass Panel Component (React + Framer)
```tsx
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"

// Spring config for glass hover — matches Apple's fluid feel
const springConfig = { stiffness: 300, damping: 30, mass: 0.8 }

export function GlassPanel({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Tilt on hover — Figma-spec range: -6deg to +6deg
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)

  // Caustic highlight moves with mouse
  const highlightX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)
  const highlightY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
    >
      {/* Glass surface */}
      <div style={{
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        background: "var(--glass-fill)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--glass-radius)",
        boxShadow: `var(--glass-shadow), var(--glass-inner-shadow)`,
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Caustic highlight layer — moves with mouse */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
            x: highlightX,
            y: highlightY,
            pointerEvents: "none",
          }}
        />

        {/* Specular top edge */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        }} />

        {children}
      </div>
    </motion.div>
  )
}
```

#### Glass Typography — Transparent Text Cutout (Variation C)
```tsx
// Text that shows background through letterforms
export function GlassText({ text, fontSize = 96 }: { text: string; fontSize?: number }) {
  return (
    <div style={{
      fontSize,
      fontWeight: 700,
      fontFamily: "var(--font-display)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
    }}>
      {text}
    </div>
  )
}
```

#### Entrance Animation (scroll-triggered glass reveal)
```tsx
import { useInView } from "framer-motion"
import { useRef } from "react"

export function GlassPanelReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, backdropFilter: "blur(0px)" }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        backdropFilter: "blur(24px)",
      } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
```

---

### SPLINE INTEGRATION — Real WebGL Refraction

For true light-bending liquid glass (not CSS approximation), use Spline:

1. In Spline: create a glass mesh object → Material → set `Transmission: 1.0`, `IOR: 1.5`, `Roughness: 0.05`
2. Add environment map (HDR) for reflections
3. Export as Spline scene → embed in Framer via `<Spline scene="[url]" />`
4. Layer Framer text components OVER the Spline embed using `z-index`
5. Use Framer scroll events to drive Spline camera position via `spline.emitEvent()`

When to use Spline vs CSS glass:
- Hero showcase moment, full-bleed glass object → Spline (real refraction)
- Cards, navbars, panels, UI components → CSS + Framer (performance, scalability)
- Mobile → CSS only (Spline is GPU-heavy)

---

### LIQUID GLASS → CINEMATIC WEBSITE BUILDER HANDOFF

Add to the special_effects array in the handoff YAML:

```yaml
special_effects:
  - type: liquid_glass_typography
    target_sections: [hero, features]  # which sections use glass
    glass_variant: dark  # dark | light | colorized | transparent-text
    implementation: framer  # framer | spline | css-only
    tokens:
      glass_blur: 24px
      glass_fill: "rgba(255, 255, 255, 0.08)"
      glass_border: "rgba(255, 255, 255, 0.15)"
      glass_radius: 20px
      glass_shadow: "0 8px 32px rgba(0,0,0,0.25)"
    animation:
      entrance: scroll_reveal  # scroll_reveal | fade | none
      hover: 3d_tilt  # 3d_tilt | highlight_shift | none
      spring: { stiffness: 300, damping: 30, mass: 0.8 }
```

---

### LIQUID GLASS DO / DO NOT

DO:
- Specify exact rgba values in Stitch prompts — Stitch uses them for fill reference
- Always describe the glass as a LAYER above the background, not as the background itself
- Mention "backdrop blur visible" in Stitch prompt so output shows translucency intent
- Use Tokens Studio token names when handing off to production
- Use Framer's `useSpring` for all hover physics — never CSS transitions for glass tilt
- Test on dark backgrounds first — glass reads poorly on white without tuning

DO NOT:
- Ask Stitch to generate the actual blur effect — it makes static mockups, describe the intent
- Use `filter: blur()` on the glass element itself — that blurs content, not background
- Skip the specular highlight layer — without it, glass looks flat and plasticky
- Use pure white (#FFFFFF) glass fill — always semi-transparent rgba
- Put glass on glass without increasing blur significantly (min 32px for nested glass)
- Use Spline for mobile glass components — use CSS fallback

---

## FINAL HANDOFF TO CINEMATIC WEBSITE BUILDER

website_build_brief:
  source: "google_stitch"
  stitch_variation_chosen: ""
  brand:
    moodboard: ""
    primary_color: ""
    bg_color: ""
    surface_color: ""
    accent_color: ""
    display_font: ""
    body_font: ""
  sections:
    - name: "hero"
      layout_notes: ""
      modules: []
      content: ""
    - name: "features"
      layout_notes: ""
      modules: []
      content: ""
    - name: "proof"
      layout_notes: ""
      modules: []
      content: ""
    - name: "cta"
      layout_notes: ""
      modules: []
      content: ""
  special_effects: []
  device_priority: "desktop"
  delivery_format: "single-file HTML"

---

## PROMPT WRITING RULES

DO:
- Name the actual product — Stitch uses it for context
- Specify exact hex codes from your design system
- List sections in page order
- Name specific UI components
- Specify desktop or mobile
- Specify dark/light mode explicitly

DO NOT:
- Be vague — generates garbage
- Ask for animations — Stitch makes static mockups
- Request more than 5-6 sections per prompt
- Skip font direction
- Forget the tone descriptor
