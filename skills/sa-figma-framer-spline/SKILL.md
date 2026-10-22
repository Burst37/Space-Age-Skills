---
name: sa-figma-framer-spline
display_name: "SPACE AGE — Figma + Framer + Spline Design-to-Production"
version: "1.0"
last_updated: "2026-05"
description: >
  Supercharged Figma + Framer Motion + Spline design-to-production skill for Space Age AI Solutions.
  Inserts between ui-ux-designer and cinematic-website-builder. Extracts exact design tokens from
  Figma via Tokens Studio and Builder.io Visual Copilot, adds physics-based interactions via Framer
  Motion, and injects real GPU-rendered 3D scenes via Spline. Eliminates flat-shaded CSS approximations.
  Delivers the exact visual quality of Awwwards SOTY, Apple, Linear, Vercel-level output.
  TRIGGER on: any mention of Figma, Framer, Spline, Rive, design tokens, "make it look premium",
  "the effects look flat", "not matching the reference", or any request to elevate site output quality
  beyond what GSAP + CSS alone can deliver.
pipeline_position: "Phase 1.5 — between ui-ux-designer and cinematic-website-builder"
---

# SA-FIGMA-FRAMER-SPLINE SKILL
## Space Age AI Solutions — Design-to-Production Excellence Layer
### v1.0 | May 2026

> This skill exists because CSS approximates. Claude Code guesses. The gap between
> "what DESIGN.md says it should look like" and "what actually ships" is where client
> confidence and pipeline quality dies. This skill closes that gap permanently.

---

## THE CORE PROBLEM THIS SKILL SOLVES

```
WITHOUT THIS SKILL:
  DESIGN.md says "liquid glass panel with chromatic aberration"
  Claude Code writes: backdrop-filter: blur(40px)
  Result: flat gray frosted rectangle
  Client: "this doesn't look like what we discussed"

WITH THIS SKILL:
  Figma tokens → exact values locked
  Framer Motion → physics-based spring animations
  Spline → real GPU-rendered 3D / material simulation
  Rive → state-driven micro-interactions
  Result: ships matching the reference exactly
```

---

## PIPELINE POSITION

```
Phase 0.5  brand-extractor (Firecrawl)
Phase 1    ui-ux-designer → Handoff Package
           ↓
Phase 1.5  [SA-FIGMA-FRAMER-SPLINE] ← YOU ARE HERE
           ↓ Figma Token Package
           ↓ Framer Motion component spec
           ↓ Spline embed codes
           ↓ Rive animation assets
           ↓
Phase 2    google-stitch (layout)
Phase 3    cinematic-website-builder (production) — NOW RECEIVES EXACT SPECS
Phase 4    local-business-seo
Phase 5    Vercel deploy
```

---

## THE FIVE-TOOL STACK

### TOOL 1 — Tokens Studio (Figma Plugin)
**What it does:** Single source of truth for every design value. Colors, spacing,
typography, shadows, blur values, border radius — all defined as tokens that sync
to GitHub and export as CSS custom properties, JSON, or SCSS.

**Why it matters for your pipeline:**
Claude Code no longer approximates `--blur-glass: blur(40px)` — it reads the
exact value you defined in Figma: `--blur-glass: blur(48px) saturate(200%)`.
Every site ships with values derived from the actual design, not a guess.

**Install:** Figma Community → search "Tokens Studio for Figma"
**Cost:** Free tier covers all pipeline needs. Pro ($24/mo) for GitHub sync.

**Workflow:**
```
1. Open Figma design file
2. Tokens Studio plugin → define or import tokens
3. Sync → GitHub repo (tokens.json)
4. Style Dictionary transforms → CSS custom properties
5. Paste :root{} block into cinematic-website-builder output
```

**Output format:**
```css
/* Auto-generated from Figma via Tokens Studio */
:root {
  /* Colors */
  --color-bg-primary: #050508;
  --color-accent-blue: #00CFFF;
  --color-accent-orange: #FF6B00;
  --color-glass-bg: rgba(255,255,255,0.06);
  --color-glass-border: rgba(255,255,255,0.12);

  /* Glass System */
  --glass-blur: blur(48px);
  --glass-saturate: saturate(200%);
  --glass-brightness: brightness(1.1);
  --glass-bg: rgba(255,255,255,0.06);
  --glass-border-top: rgba(255,255,255,0.24);
  --glass-inset: inset 0 1px 0 rgba(255,255,255,0.20);

  /* Typography */
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing (8pt grid) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-12: 96px;
  --space-16: 128px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.4);
  --shadow-lg: 0 24px 80px rgba(0,0,0,0.5);

  /* Animation */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 800ms;
}
```

---

### TOOL 2 — Builder.io Visual Copilot (Figma Plugin)
**What it does:** AI-powered Figma-to-code. Converts any Figma frame into
production-ready React/Next.js/HTML in one click. Trained on 2M+ data points.
Understands your component library, maps to existing code, generates responsive layouts.

**Why it matters for your pipeline:**
Eliminates the translation layer between design intent and code output.
Visual Copilot reads the Figma frame spec and produces the structural HTML/JSX —
cinematic-website-builder then layers effects and animations on top.
Reduces flat-shaded output because structure is derived from design, not approximated.

**Install:** Figma Community → "Builder.io — AI Design to Code"
**Cost:** Free tier (limited exports). Growth $19/mo for pipeline volume.

**CLI Integration (for automation):**
```bash
# Install Visual Copilot CLI
npm install -g @builder.io/cli

# Authenticate
builder login

# Export Figma frame to code
builder figma export \
  --file-id YOUR_FIGMA_FILE_ID \
  --frame-id YOUR_FRAME_ID \
  --output ./components \
  --framework react \
  --styling tailwind
```

**Pipeline trigger:**
When Handoff Package arrives from ui-ux-designer:
→ Open the corresponding Figma frame
→ Run Visual Copilot export
→ Use generated structure as scaffold
→ cinematic-website-builder adds animation, effects, modules on top

---

### TOOL 3 — Framer Motion (React Animation Library)
**What it does:** Physics-based animation library for React. Spring physics,
gesture recognition, layout animations, shared element transitions, scroll-driven
sequences. This is what Linear, Vercel, Stripe, and every premium SaaS uses.

**Why it matters for your pipeline:**
GSAP is scroll choreography. Framer Motion is interaction physics.
Hover states that feel alive. Cards that spring back. Page transitions
that have weight and momentum. The difference between a site that
looks good and a site that *feels* like a $10M product.

**Requires:** Next.js output format (not single-file HTML).
This is the trigger for upgrading the pipeline to React output.

**Install:**
```bash
npm install framer-motion
```

**Core patterns for cinematic pipeline:**

```jsx
// 1. Spring Card (replaces flat CSS hover)
import { motion } from "framer-motion"

<motion.div
  whileHover={{
    scale: 1.02,
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }}
  whileTap={{ scale: 0.98 }}
  className="glass-panel"
>
  {children}
</motion.div>

// 2. Stagger reveal on scroll
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } }
}

<motion.ul variants={container} initial="hidden" whileInView="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.content}</motion.li>
  ))}
</motion.ul>

// 3. Page transition (between routes)
<motion.main
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ type: "spring", stiffness: 260, damping: 30 }}
>
  {children}
</motion.main>

// 4. Magnetic button (replaces JS mouse tracking)
const [position, setPosition] = useState({ x: 0, y: 0 })
const ref = useRef(null)

const handleMouseMove = (e) => {
  const rect = ref.current.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  setPosition({ x: x * 0.3, y: y * 0.3 })
}

<motion.button
  ref={ref}
  animate={{ x: position.x, y: position.y }}
  transition={{ type: "spring", stiffness: 150, damping: 15 }}
  onMouseMove={handleMouseMove}
  onMouseLeave={() => setPosition({ x: 0, y: 0 })}
>
  {label}
</motion.button>

// 5. Scroll-driven progress bar
const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

<motion.div style={{ scaleX }} className="progress-bar" />
```

**When to use Framer Motion vs GSAP:**
```
FRAMER MOTION                    GSAP
─────────────────────────────────────────────────────
Hover / tap physics              Complex scroll choreography
Page transitions                 Text split animations
Drag interactions                Timeline sequences
Layout animations (list reorder) SVG path drawing
Gesture recognition              Parallax multi-layer
Spring-based entrances           ScrollTrigger scrub
Shared element transitions       Kinetic marquees
```

---

### TOOL 4 — Spline (3D Interactive Web Scenes)
**What it does:** Browser-based 3D design tool. Build real 3D objects with
materials, lighting, physics, and interactions. Export as web embed (one script tag).
Used by: Apple, Framer, Linear, Vercel, Lottie.

**Why it matters for your pipeline:**
CSS cannot do real 3D. Claude Code cannot render light refraction.
Spline eliminates the "flat shaded attempt" problem entirely for 3D sections.
Build the scene in Spline → embed as one line → GPU renders it on the client.

**Figma Integration:** Spline → Anima plugin → embed in Figma prototype
**Web embed:**
```html
<!-- Drop into any HTML or React page -->
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.0/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"></spline-viewer>
```

**React embed:**
```bash
npm install @splinetool/react-spline
```
```jsx
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <Spline
      scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"
      onLoad={(app) => {
        // Access Spline API — trigger animations, track interactions
        const obj = app.findObjectByName('HeroObject')
        obj.emitEvent('mouseHover')
      }}
    />
  )
}
```

**Pipeline triggers — when to build in Spline:**
```
✅ 3D hero product showcase
✅ Interactive logo/brand mark
✅ Floating glass panels with real refraction
✅ Particle systems beyond CSS capability
✅ Material simulation (metal, leather, liquid)
✅ Physics-based hero elements
✅ Anything referencing Apple Vision Pro aesthetic
✅ When DESIGN.md references WebGL T-04 or T-11
```

**Performance rules:**
```
- Keep scene file under 5MB
- Use compressed textures (WebP)
- Lazy-load: only init Spline when element enters viewport
- Fallback: static image for prefers-reduced-motion
- Test on mobile before shipping
```

---

### TOOL 5 — Rive (State-Machine Animations)
**What it does:** Lightweight interactive animation runtime. State machines
for UI — hover states, click states, load states, error states — all in
one animation file. Plays at up to 120fps. File sizes under 100KB.
Used by: Duolingo, Google, GitHub, Discord.

**Why it matters for your pipeline:**
Lottie plays and stops. Rive responds. Button press → animation state change.
Loading → success → error. Logo that reacts to scroll. CTA that pulses on hover.
These are the micro-interactions that make a site feel alive.

**Figma Integration:** Design states in Figma → export to Rive → add state machine
**Web embed:**
```html
<script src="https://unpkg.com/@rive-app/canvas@latest/rive.js"></script>
<canvas id="rive-canvas" width="500" height="500"></canvas>
<script>
  const r = new rive.Rive({
    src: './hero-animation.riv',
    canvas: document.getElementById('rive-canvas'),
    autoplay: true,
    stateMachines: 'State Machine 1',
    onLoad: () => {
      const inputs = r.stateMachineInputs('State Machine 1')
      const hoverInput = inputs.find(i => i.name === 'Hover')
      canvas.addEventListener('mouseenter', () => hoverInput.value = true)
      canvas.addEventListener('mouseleave', () => hoverInput.value = false)
    }
  })
</script>
```

**When to use Rive:**
```
✅ CTA button hover/press state
✅ Loading → success animation
✅ Logo animation on page load
✅ Icon animations in nav/cards
✅ Onboarding illustrations
✅ Error state animations
✅ Progress indicators
```

---

## FIGMA PLUGIN MASTER LIST — RANKED BY PIPELINE VALUE

### TIER 1 — MUST INSTALL (Core Pipeline)

| Plugin | Purpose | Cost |
|--------|---------|------|
| **Tokens Studio** | Design token extraction → CSS/JSON | Free / $24/mo |
| **Builder.io Visual Copilot** | Figma frame → production code | Free / $19/mo |
| **Anima** | Figma → React/HTML + Spline embed host | Free / $39/mo |
| **Figma Token Exporter** | Quick CSS/SASS variable export | Free |
| **EightShapes Specs** | Auto-generate spacing/typography annotations | Free / Pro |

### TIER 2 — HIGH VALUE (Design Quality)

| Plugin | Purpose | Cost |
|--------|---------|------|
| **MotionKit** | Timeline animations directly in Figma | Free |
| **Rive for Figma** | Preview Rive animations in prototypes | Free |
| **html.to.design** | Import any live site → editable Figma | Free / $15/mo |
| **MiroMiro** | Extract design tokens from any URL | Free |
| **LottieFiles** | AE animation preview + export | Free |

### TIER 3 — WORKFLOW EFFICIENCY

| Plugin | Purpose | Cost |
|--------|---------|------|
| **Locofy.ai** | Clean React/Next.js code from frames | Free / $15/mo |
| **Batch Styler** | Update color/text styles at scale | Free |
| **Iconify** | 200K+ icons in Figma | Free |
| **Rename It** | Batch rename layers with patterns | Free |
| **Contrast** | WCAG accessibility color checker | Free |

### TIER 4 — REFERENCE & INSPIRATION

| Plugin | Purpose | Cost |
|--------|---------|------|
| **Mobbin** | 100K+ real app UI screenshots | Free / $15/mo |
| **Unsplash** | Hi-res photos directly in Figma | Free |
| **Spline** | 3D scenes in Figma via Anima | Free |

---

## DECISION MATRIX — WHICH TOOL FOR WHICH EFFECT

```
EFFECT REQUESTED              TOOL                 HOW
──────────────────────────────────────────────────────────────────────
Liquid glass panel            CSS + tokens         Tokens Studio exact values
Real 3D glass refraction      Spline               GPU ray trace in scene
Hover spring physics          Framer Motion        whileHover spring config
Page transition               Framer Motion        AnimatePresence + variants
Logo animation                Rive                 State machine + Figma export
Loading state                 Rive                 Idle → Loading → Success SM
3D product hero               Spline               PBR material scene + embed
Scroll-driven parallax        GSAP ScrollTrigger   Stays in cinematic-builder
Text split reveal             GSAP                 Stays in cinematic-builder
Kinetic marquee               GSAP                 Stays in cinematic-builder
Bento grid layout             Framer Motion        Layout animation
Card hover (stagger)          Framer Motion        variants + staggerChildren
Particle field                Spline               Physics simulation
CSS neumorphism               CSS + tokens         Tokens define shadow values
WebGL plasma shader           Three.js             Separate Three.js setup
Icon animations               Rive                 State machine per icon
Color token sync              Tokens Studio        Single source of truth
Responsive layout code        Builder.io           Visual Copilot export
```

---

## INTEGRATION INTO CLAUDE CODE WORKFLOW

### Phase 1.5 Activation Checklist

When `ui-ux-designer` outputs a Handoff Package, run this before cinematic-website-builder:

```
□ 1. Open Figma file for this project
□ 2. Tokens Studio → export all tokens → tokens.json → CSS :root{} block
□ 3. Identify which sections need:
      → 3D elements? → Spline scene required
      → Physics hover/transitions? → Framer Motion components required
      → State-driven micro-interactions? → Rive animation required
□ 4. Builder.io Visual Copilot → export structural code from key Figma frames
□ 5. Build/source Spline scenes for 3D sections
□ 6. Create Rive files for button/icon states if needed
□ 7. Hand off to cinematic-website-builder with:
      - CSS token block (locked values)
      - Structural code from Visual Copilot
      - Spline embed URLs
      - Rive .riv file URLs
      - Framer Motion patterns to apply
```

### Output Package to cinematic-website-builder

```yaml
figma_framer_package:
  tokens_css: |
    /* Paste full :root{} block here */
  spline_embeds:
    hero: "https://prod.spline.design/SCENE_ID/scene.splinecode"
    cta_bg: null
  rive_assets:
    cta_button: "./animations/cta-button.riv"
    logo: "./animations/logo-intro.riv"
  framer_motion_patterns:
    - spring_card_hover
    - stagger_section_reveal
    - page_transition
    - magnetic_cta
  visual_copilot_output: "./components/hero-section.jsx"
  output_format: "nextjs"   # OR "html" if staying single-file
```

---

## OUTPUT FORMAT DECISION

```
Staying single-file HTML?
  ├── Tokens Studio CSS → inject :root{} block ✅
  ├── Spline → script + <spline-viewer> tag ✅
  ├── Rive → canvas + JS runtime ✅
  └── Framer Motion → ❌ (React only)
      → Replace with: GSAP spring plugin OR CSS spring transitions

Moving to Next.js/React?
  ├── Tokens Studio CSS → inject :root{} block ✅
  ├── Spline → @splinetool/react-spline ✅
  ├── Rive → @rive-app/react-canvas ✅
  └── Framer Motion → full library ✅
      → Unlocks the full quality ceiling

RECOMMENDATION:
  Lead gen pipeline sites (fast turnaround) → stay HTML + Spline + Rive
  Premium client builds ($750+ tier) → Next.js + full stack
  Record Exec / WYSIWYG brand sites → Next.js + full stack
```

---

## SETUP INSTRUCTIONS (ONE-TIME)

### Tokens Studio Setup
```
1. Figma → Plugins → Tokens Studio
2. Create token sets: global, semantic, component
3. Add GitHub sync:
   Settings → Sync → GitHub
   Repo: your-github/space-age-tokens
   Branch: main
   File: tokens/tokens.json
4. Install Style Dictionary on VPS:
   npm install -g style-dictionary
5. Run transform:
   style-dictionary build --config sd.config.json
   # Outputs: build/css/variables.css
```

### Builder.io Visual Copilot Setup
```
1. Figma → Plugins → Builder.io
2. Sign in at builder.io
3. Install CLI: npm install -g @builder.io/cli
4. Add to pipeline: builder figma export [args]
```

### Spline Setup
```
1. Create account: spline.design
2. Build scene OR use Spline Community template
3. Export → Web embed → copy URL
4. Paste into site build
```

### Rive Setup
```
1. Create account: rive.app
2. Import Figma assets OR build from scratch
3. Add state machine with input triggers
4. Export → Web runtime → copy .riv URL
5. Add @rive-app/canvas to project
```

---

## QUALITY GATE

Before handing off to cinematic-website-builder, verify:

```
✅ CSS :root{} block contains ALL custom properties used in design
✅ No color, blur, shadow, or spacing value is hardcoded — all reference tokens
✅ Every 3D section has a Spline scene OR a confirmed Three.js spec
✅ Every interactive button/icon has a Rive state OR Framer Motion spec
✅ Spline scenes tested on mobile (< 5MB, fallback image ready)
✅ Rive files tested for state machine triggers
✅ Output format decision locked (HTML vs Next.js)
✅ Visual Copilot structural code reviewed for accuracy
```

---

## NEVER DO

```
❌ NEVER let Claude Code approximate a design token value
❌ NEVER use Spline for text-heavy content (load performance)
❌ NEVER skip the token export step — this is the entire point
❌ NEVER use Framer Motion in a single-file HTML build
❌ NEVER build a 3D scene in CSS when Spline exists
❌ NEVER use Lottie for interactive state-driven animation (use Rive)
❌ NEVER export from Visual Copilot without reviewing the structure
❌ NEVER use Google Fonts in token exports — Fontsource CDN only
```

---

## SKILL CONNECTIONS

```
UPSTREAM:
  ui-ux-designer → sends Handoff Package
  brand-extractor → sends Brand Token Package

DOWNSTREAM:
  cinematic-website-builder → receives full Figma Framer Package
  shopify-cinematic-builder → same package, Liquid/OS2.0 output

PARALLEL:
  google-stitch → layout ideation runs in parallel
  local-business-seo → fires after production build
  sa-higgsfield-operator → image/video assets for Figma frames
```

---

*SA-Figma-Framer-Spline Skill v1.0 — Space Age AI Solutions*
*Sources: Tokens Studio Docs, Builder.io Visual Copilot 2.0, Framer Motion API,*
*Spline Documentation, Rive Docs, illustration.app 2026 Tool Comparison,*
*themeselection.com Web Animation Tools 2026, story.to.design Design Systems 2026*
*Built: May 2026*
