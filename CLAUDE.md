# Space Age Skills — Claude Code Knowledge Base

## Project Overview

Mission Control dashboard for Space Age AI Solutions — Next.js 16 + React 19 + TypeScript.
Design system: **VL-01 Dark Glassmorphism Standard** (`#050508` base, `backdrop-filter: blur(48px) saturate(200%)`).

Key paths:
- `src/app/` — Next.js app router pages
- `src/components/` — shared UI components
- `src/lib/` — utilities, runners, config
- `src/app/globals.css` — global CSS vars and glassmorphism tokens

---

## Liquid Glass — How It Actually Works

Liquid glass is not `backdrop-filter: blur()`. That is frosted glass. Real liquid glass simulates
light physically bending through a curved transparent surface. There are two implementation paths:
**CSS/SVG filters** (broad-ish support) and **WebGL/WebGPU shaders** (highest fidelity, Chrome-only).

---

### The Physics Behind It

Real glass bends light according to **Snell's Law**: `n₁·sin(θ₁) = n₂·sin(θ₂)`

- `n₁` = refractive index of air (~1.0)
- `n₂` = refractive index of glass (~1.5)
- The bend is greatest at the edges (steep angle), zero at center (normal incidence)
- This is why liquid glass looks warped/magnified at rims but clear through the middle

The **glass surface profile** determines how aggressively light bends:

```
Convex circle:   y = √(1 − (1−x)²)   → sharp edge refraction
Convex squircle: y = ⁴√(1 − (1−x)⁴) → Apple's preferred soft transition
Concave:         y = 1 − Convex(x)    → diverging rays (inward warp)
Lip:             blend(convex, concave, smootherstep) → raised rim bevel
```

---

### Layer Stack of a Proper Liquid Glass Element

Build these layers in order — each is additive:

```
Layer 1: BACKGROUND CAPTURE
  The content behind the element is sampled as a texture/snapshot.
  Without this, you have no refraction — just blur.

Layer 2: DISPLACEMENT / REFRACTION
  The background texture is warped using a displacement map.
  The map encodes pixel shifts: R channel = X shift, G channel = Y shift.
  128 = neutral (no shift). 0 = shift −scale px. 255 = shift +scale px.
  The displacement is radially symmetric, strongest at the rim.

Layer 3: CHROMATIC ABERRATION
  Split the R/G/B channels and sample each at a slightly different offset.
  Red shifts one direction, blue the opposite. Intensity scales with edge proximity.
  Simulates wavelength-dependent refraction (shorter wavelengths bend more).

Layer 4: FROST / BLUR
  A Gaussian blur over the displaced sample. NOT the same as backdrop-filter blur.
  The blur intensity should VARY by position: stronger at center, weaker at edges.
  A 13×13 adaptive blur with circular masking is the standard approach.
  Too much uniform blur = frosted glass. Vary it = depth cue.

Layer 5: SATURATION BOOST
  The displaced region gets a saturation push (~130–160%) because refraction
  concentrates light wavelengths. Under-saturating makes it look like a smear.

Layer 6: SPECULAR HIGHLIGHT (RIM LIGHT)
  A bright edge glow that responds to a fixed light direction (usually top-left).
  Intensity: `dot(surfaceNormal, lightDir)` — bright where normal faces light.
  The normal is computed from the SDF gradient at each edge pixel.
  This is what makes it look like glass vs. a blurred cutout.

Layer 7: INNER SPECULAR / CAUSTIC
  A softer secondary highlight inside the glass body, often animated subtly.
  Implemented as a radial gradient overlay blended with screen or add mode.

Layer 8: TINT LAYER
  rgba(255,255,255,0.04–0.12) fill — slight milkiness. Higher = frosted pill,
  lower = clear glass. For dark UIs keep it 0.04–0.06.

Layer 9: BORDER
  1px stroke at ~rgba(255,255,255,0.15–0.25). Not a CSS border — it's drawn
  over the specular so it catches light too.
```

---

### CSS + SVG Filter Implementation (No Shader Required)

This is what `liquid-glass-react` uses under the hood. Chrome only for full effect.

**The displacement map is NOT feTurbulence noise.** It is a pre-computed radial gradient
that encodes the Snell's Law ray bends for each pixel. You either export it from Figma/code
or generate it procedurally.

**Generating a displacement map programmatically:**

```javascript
function buildDisplacementMap(width, height, glassIndex = 1.5, profile = 'squircle') {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)

  const cx = width / 2, cy = height / 2
  const rx = width / 2, ry = height / 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Normalize to [-1, 1]
      const nx = (x - cx) / rx
      const ny = (y - cy) / ry
      const dist = Math.sqrt(nx * nx + ny * ny)

      if (dist >= 1.0) {
        // Outside glass — neutral (no displacement)
        const i = (y * width + x) * 4
        img.data[i] = 128; img.data[i+1] = 128
        img.data[i+2] = 0;  img.data[i+3] = 255
        continue
      }

      // Surface height at this normalized distance from center
      let h
      if (profile === 'squircle') h = Math.pow(1 - Math.pow(1 - dist, 4), 0.25)
      else h = Math.sqrt(1 - Math.pow(1 - dist, 2)) // circle

      // Surface normal (gradient of height field)
      const angle = Math.atan2(ny, nx)
      // Snell's law: sin(theta_t) = sin(theta_i) / n
      const sinThetaI = h          // height ≈ sin of incidence angle at rim
      const sinThetaT = sinThetaI / glassIndex
      const displacement = (sinThetaT - sinThetaI) * Math.min(dist, 0.98)

      const dx = Math.cos(angle) * displacement
      const dy = Math.sin(angle) * displacement

      const i = (y * width + x) * 4
      img.data[i]   = Math.round(128 + dx * 127)  // R = X shift
      img.data[i+1] = Math.round(128 + dy * 127)  // G = Y shift
      img.data[i+2] = 0
      img.data[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}
```

**The SVG filter pipeline:**

```tsx
function LiquidGlassSVGFilter({ id, width, height, scale = 55, lightAngle = -45 }) {
  const displacementMapUrl = buildDisplacementMap(width, height)
  const lightX = Math.cos(lightAngle * Math.PI / 180)
  const lightY = Math.sin(lightAngle * Math.PI / 180)

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter
          id={id}
          x="-20%" y="-20%"
          width="140%" height="140%"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Displacement / refraction */}
          <feImage href={displacementMapUrl} result="dmap" />
          <feDisplacementMap
            in="SourceGraphic" in2="dmap"
            scale={scale}
            xChannelSelector="R" yChannelSelector="G"
            result="displaced"
          />

          {/* 2. Saturation boost to simulate concentrated light */}
          <feColorMatrix
            in="displaced" type="saturate" values="1.5"
            result="saturated"
          />

          {/* 3. Subtle blur (thickness simulation — NOT the main blur) */}
          <feGaussianBlur in="saturated" stdDeviation="0.8" result="refracted" />

          {/* 4. Specular rim — pre-computed specular map or generated gradient */}
          <feImage href={buildSpecularMap(width, height, lightAngle)} result="spec" />
          <feGaussianBlur in="spec" stdDeviation="1.2" result="spec_soft" />

          {/* 5. Mask specular to the rim only, then blend */}
          <feComposite in="spec_soft" in2="SourceGraphic" operator="in" result="spec_masked" />
          <feBlend in="refracted" in2="spec_masked" mode="screen" result="with_spec" />

          {/* 6. Tint layer */}
          <feFlood floodColor="rgba(255,255,255,0.05)" result="tint" />
          <feComposite in="tint" in2="SourceGraphic" operator="in" result="tint_masked" />
          <feBlend in="with_spec" in2="tint_masked" mode="normal" />
        </filter>
      </defs>
    </svg>
  )
}
```

**Building the specular rim map:**

```javascript
function buildSpecularMap(width, height, lightAngleDeg = -45) {
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  const ctx = canvas.getContext('2d')
  const lx = Math.cos(lightAngleDeg * Math.PI / 180)
  const ly = Math.sin(lightAngleDeg * Math.PI / 180)
  const cx = width / 2, cy = height / 2
  const img = ctx.createImageData(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / (width / 2)
      const ny = (y - cy) / (height / 2)
      const dist = Math.sqrt(nx * nx + ny * ny)
      // Only paint the rim (0.7–1.0 range)
      const rimT = Math.max(0, (dist - 0.7) / 0.3)
      // Normal points outward at rim — dot with light direction
      const specular = Math.max(0, nx * lx + ny * ly) * rimT
      const i = (y * width + x) * 4
      const v = Math.round(specular * 255 * 0.6)
      img.data[i] = img.data[i+1] = img.data[i+2] = v
      img.data[i+3] = Math.round(rimT * 180)
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}
```

**CSS application:**

```css
.liquid-glass {
  /* The SVG filter handles refraction + specular */
  backdrop-filter: url(#my-liquid-glass) brightness(1.1);
  /* Tint */
  background: rgba(255,255,255,0.04);
  /* Border catches specular too */
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 16px;
  /* Chromatic aberration via CSS (R/B channel split) */
  filter: drop-shadow(0 0 0.5px rgba(255,100,100,0.3))
          drop-shadow(0 0 0.5px rgba(100,100,255,0.3));
}
```

---

### WebGL Fragment Shader Implementation (Highest Fidelity)

For the GPU path. Captures a background snapshot via html2canvas or OffscreenCanvas,
then renders through a GLSL fragment shader.

**Core fragment shader (GLSL):**

```glsl
precision highp float;

uniform sampler2D u_background;  // page screenshot behind the element
uniform vec2 u_resolution;       // element size in px
uniform vec2 u_lightDir;         // normalized light direction (e.g. vec2(-0.7, -0.7))
uniform float u_refractStrength; // 0.0–1.0 (typically 0.15–0.35)
uniform float u_blurRadius;      // blur in px (typically 4.0–12.0)
uniform float u_aberration;      // chromatic split in px (typically 1.0–4.0)
uniform float u_specularIntensity;
uniform float u_cornerRadius;    // in px

varying vec2 v_uv;  // 0–1 across element

// Signed distance field for rounded rectangle
float sdRoundRect(vec2 p, vec2 halfSize, float r) {
  vec2 d = abs(p) - halfSize + vec2(r);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

// Squircle lens profile (Apple's preferred)
float lensHeight(float dist) {
  float d = clamp(dist, 0.0, 1.0);
  return pow(1.0 - pow(1.0 - d, 4.0), 0.25);
}

// Gaussian weight for blur kernel
float gaussWeight(float d, float sigma) {
  return exp(-0.5 * d * d / (sigma * sigma));
}

void main() {
  vec2 pixelPos = v_uv * u_resolution;
  vec2 center = u_resolution * 0.5;
  vec2 halfSize = center;

  // Distance from element center (normalized 0–1)
  vec2 fromCenter = (pixelPos - center) / halfSize;
  float dist = length(fromCenter);

  // SDF for clipping shape
  float sdf = sdRoundRect(pixelPos - center, halfSize - vec2(u_cornerRadius), u_cornerRadius);
  if (sdf > 0.0) discard;  // Outside glass

  // Surface normal from SDF gradient (points toward center at rim)
  vec2 normal = normalize(fromCenter) * clamp(dist, 0.0, 1.0);

  // Lens distortion: more at edges, zero at center (Snell's law approximation)
  float h = lensHeight(dist);
  float refractMag = h * u_refractStrength;
  vec2 refractOffset = normal * refractMag;

  // Sample background at displaced UV
  vec2 bgUV = v_uv + refractOffset;

  // Chromatic aberration: split R/G/B channels
  float aberr = u_aberration / u_resolution.x * (dist * dist);
  float r = texture2D(u_background, bgUV - normal * aberr).r;
  float g = texture2D(u_background, bgUV).g;
  float b = texture2D(u_background, bgUV + normal * aberr).b;
  vec3 refracted = vec3(r, g, b);

  // Adaptive Gaussian blur (13-tap, stronger at center)
  float blurSigma = u_blurRadius * (1.0 - dist * 0.5);  // half blur at edges
  vec3 blurred = vec3(0.0);
  float totalWeight = 0.0;
  vec2 texelSize = 1.0 / u_resolution;
  for (int i = -3; i <= 3; i++) {
    for (int j = -3; j <= 3; j++) {
      float w = gaussWeight(length(vec2(i, j)), blurSigma);
      blurred += texture2D(u_background, bgUV + vec2(float(i), float(j)) * texelSize).rgb * w;
      totalWeight += w;
    }
  }
  blurred /= totalWeight;

  // Mix refraction with blur based on distance from edge
  // Center: blurred. Edges: refracted (displacement visible)
  float edgeT = smoothstep(0.6, 1.0, dist);
  vec3 glassContent = mix(blurred, refracted, edgeT);

  // Saturation boost (refraction concentrates color)
  float luma = dot(glassContent, vec3(0.299, 0.587, 0.114));
  glassContent = mix(vec3(luma), glassContent, 1.4);

  // Specular highlight at rim
  // Surface normal at rim faces outward; dot with light = rim light
  float specular = pow(max(0.0, dot(normal, -u_lightDir)), 8.0);
  specular *= smoothstep(0.5, 1.0, dist);  // Only at rim
  specular *= u_specularIntensity;

  // Inner glow (subtle caustic at center)
  float innerGlow = (1.0 - dist) * 0.04;

  // Tint
  vec3 tint = vec3(1.0) * 0.04;

  // Composite
  vec3 color = glassContent + vec3(specular) + tint + vec3(innerGlow);

  // Edge alpha falloff (soft boundary)
  float alpha = 1.0 - smoothstep(-1.0, 0.0, sdf);

  gl_FragColor = vec4(color, alpha);
}
```

---

### Using the Libraries (API Reference)

#### `liquid-glass-react` (CSS/SVG path, easiest)

```bash
npm install liquid-glass-react
```

```tsx
import LiquidGlass from 'liquid-glass-react'

// What each prop actually controls physically:
<LiquidGlass
  displacementScale={70}      // feDisplacementMap scale — px shift at rim. 40=subtle, 100=dramatic
  blurAmount={0.0625}         // frost amount. 0=clear, 0.25=heavily frosted
  saturation={140}            // color boost from refraction. 120=natural, 180=vivid
  aberrationIntensity={2}     // R/B channel split at edges. 0=none, 5=visible rainbow
  elasticity={0.15}           // spring physics on mouse move. 0=rigid, 0.5=very liquid
  cornerRadius={999}          // pill=999, card=16, square=4
  mode="standard"             // standard=convex, polar=cylindrical, prominent=strong lens, shader=GPU
  overLight={false}           // false=dark bg (keep false for VL-01)
  mouseContainer={containerRef} // ref for mouse tracking parent — needed for full-screen panels
>
  {children}
</LiquidGlass>
```

**Mode breakdown:**
- `standard` — convex squircle profile, symmetric refraction, good default
- `polar` — cylindrical lens, stronger horizontal warp, good for pill/tab bars
- `prominent` — stronger lens effect, higher refraction index simulation, hero elements
- `shader` — falls back to a WebGL shader path for maximum quality

#### `@liquid-dom/react` (WebGPU path, Chrome only)

```bash
pnpm add @liquid-dom/react react react-dom
```

Requires WebGPU (`navigator.gpu`) and Chrome 113+.
DOM content in glass requires `chrome://flags/#canvas-draw-element`.

#### `io.github.kyant0:backdrop` (Compose Multiplatform)

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.kyant0:backdrop:<version>")
}
```

Ships composable primitives. Sample components in repo: `LiquidButton`, `LiquidToggle`,
`LiquidSlider`, `LiquidBottomTabs`.

---

### Key Numbers for Dark UI (VL-01 Tuning)

| Parameter | Light UI | Dark UI (VL-01) |
|-----------|----------|-----------------|
| `displacementScale` | 55–70 | 60–80 (go higher — dark BG needs more drama) |
| `blurAmount` | 0.06 | 0.04–0.08 (stay low — don't lose the dark) |
| `saturation` | 140–160 | 110–130 (dark colors saturate fast) |
| `aberrationIntensity` | 1–2 | 2–4 (more visible on dark) |
| tint opacity | 0.08–0.15 | 0.03–0.06 |
| specular brightness | 0.5–0.8 | 0.6–1.0 (rim needs to pop) |
| light direction | top-center | top-left (matches VL-01 orange glow) |

---

### Common Mistakes

- **Using only `backdrop-filter: blur()`** — that's frosted glass, not liquid glass. No refraction.
- **Uniform blur** — real glass blurs more at center, less at edges. Uniform blur = smear.
- **No specular** — without the rim highlight, the glass has no depth. It looks like a smudge.
- **Wrong displacement map** — using noise (feTurbulence) for a static panel gives a warped look,
  not a lens. Use a radial gradient-based map encoding Snell's Law displacements.
- **Overfrosting on dark** — `blurAmount > 0.15` on a dark bg turns the whole panel muddy grey.
- **Ignoring chromatic aberration** — even 1–2px of R/B split dramatically increases realism.
- **Static specular** — the highlight should move subtly with mouse position or breathe with animation.

---

### VL-01 Integration Pattern

```tsx
// Wrap an existing VL-01 card with real liquid glass
import LiquidGlass from 'liquid-glass-react'

// Before: just backdrop-filter
<div className="rounded-2xl p-6" style={{ backdropFilter: 'var(--blur)' }}>
  content
</div>

// After: actual liquid glass
<LiquidGlass
  cornerRadius={16}
  mode="standard"
  displacementScale={72}
  blurAmount={0.05}
  saturation={118}
  aberrationIntensity={3}
  elasticity={0.18}
  overLight={false}
  padding="24px"
>
  content
</LiquidGlass>
```

Remove `backdropFilter` from the inner element — the library adds its own.
Keep `border` and `box-shadow` on the inner element; they layer nicely on top.

---

---

# Motion, Scroll & Animation — Senior-Level Knowledge Base

A production-grade motion pipeline requires understanding the actual physics and architecture,
not just library APIs. This section encodes how senior creative developers at studios like
Active Theory, Jam3, and Instrument actually build scroll-driven motion sites.

---

## The Stack (What Pros Actually Use)

| Layer | Tool | Why |
|-------|------|-----|
| Smooth scroll engine | **Lenis** | ~3 kB, darkroomengineering/lenis, replaces Locomotive Scroll |
| Animation engine | **GSAP 3.12+** | ScrollTrigger, SplitText, Timeline, quickSetter |
| React binding | **@gsap/react** | useGSAP hook — auto cleanup, no memory leaks |
| Declarative scroll | **Motion (Framer)** | useScroll + useTransform for React component scroll values |
| Zero-JS scroll anim | **CSS Scroll-Driven Animations** | Native browser, 85% support, Chrome 113+ |
| 3D / WebGL | **Three.js + R3F** | For shader-based parallax and hero scenes |

**Install once per project:**
```bash
npm install gsap lenis @gsap/react
npm install motion  # or framer-motion (same API, rebranded late 2024)
```

---

## Foundation: Lenis + GSAP in Next.js App Router

This is the canonical setup. Every scroll-driven project starts here.

**`src/components/SmoothScrollProvider.tsx`**

```tsx
'use client'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<{ lenis?: { raf: (t: number) => void } }>()

  useEffect(() => {
    // Drive Lenis from GSAP's ticker — one RAF loop, perfectly synced
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000) // GSAP time is seconds, Lenis needs ms
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // Prevent frame skipping on tab switch
    ScrollTrigger.refresh()

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,        // Smoothing: 0.05 = very smooth, 0.2 = snappy
        duration: 1.5,    // Scroll duration in seconds
        syncTouch: true,  // Smooth scroll on iOS touch
        autoRaf: false,   // CRITICAL: disable Lenis RAF — GSAP owns the loop
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

**`src/app/layout.tsx`** — wrap at root:

```tsx
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
```

**Why `autoRaf: false` is non-negotiable:**
Two RAF loops = scroll jitter. Lenis must tick on exactly the same frame as GSAP's
ScrollTrigger or positions drift. `gsap.ticker.add()` fires ~60 times/sec and calls
`lenis.raf()` — one loop to rule them all.

---

## ScrollTrigger — The Full Configuration

Every property and what it physically does:

```javascript
gsap.to(element, {
  y: -100,
  scrollTrigger: {
    trigger: '.section',     // Element that fires the trigger
    start: 'top 80%',        // [trigger-edge] [viewport-edge]
    end: 'bottom 20%',       // Same syntax
    scrub: 1,                // false=snap, true=exact, number=lag-seconds
    pin: true,               // Lock trigger element during animation
    pinSpacing: true,        // Add spacer div to preserve document flow
    anticipatePin: 1,        // Seconds to pre-load pin (prevents jump)
    markers: false,          // Dev only — shows trigger lines
    once: false,             // true = fires once, removes itself
    invalidateOnRefresh: true, // Recalculate on window resize

    // Playback: "onEnter onLeave onEnterBack onLeaveBack"
    toggleActions: 'play pause resume reverse',

    // Callbacks — self.progress is 0–1
    onEnter: (self) => {},
    onLeave: (self) => {},
    onEnterBack: (self) => {},
    onLeaveBack: (self) => {},
    onUpdate: (self) => {
      console.log(self.progress)  // 0 at start, 1 at end
      console.log(self.velocity)  // Scroll speed
      console.log(self.direction) // 1 = down, -1 = up
    },

    // Snap to labels or progress values
    snap: {
      snapTo: 'labels',      // or [0, 0.5, 1] or a function
      duration: { min: 0.2, max: 0.5 },
      delay: 0.1,
      ease: 'power1.inOut',
    },
  }
})
```

**start/end string reference:**
- `"top top"` — trigger top hits viewport top
- `"top 80%"` — trigger top hits 80% down the viewport
- `"top center"` — trigger top hits viewport center
- `"center center"` — trigger center hits viewport center
- `"bottom top"` — trigger bottom hits viewport top
- `"+=500"` — 500px after start position (absolute offset)

---

## Hero Section: Pinned Scroll Storytelling

The most common senior pattern — pin the hero while a timeline plays as user scrolls.

```tsx
'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export function PinnedHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=200%',        // Pin for 2x the viewport height of scroll
        pin: true,
        pinSpacing: true,
        scrub: 1,             // 1-second playhead lag = physical feel
        anticipatePin: 1,
      },
    })

    // Chapter 1: Title rises in (0–30% of scroll)
    tl.from(titleRef.current, {
      yPercent: 30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, 0)

    // Chapter 2: Image scales up behind (0–60%)
    tl.from(imageRef.current, {
      scale: 1.15,
      duration: 0.6,
      ease: 'none',
    }, 0)

    // Chapter 3: Overlay fades away revealing image (20–80%)
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'none',
    }, 0.2)

    // Chapter 4: Title drifts up and out (70–100%)
    tl.to(titleRef.current, {
      yPercent: -40,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0.7)

    // Chapter 5: Subtitle appears from below (60–100%)
    tl.from(subtitleRef.current, {
      yPercent: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.6)

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
    >
      <div ref={overlayRef} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div ref={imageRef} style={{ position: 'absolute', inset: 0, backgroundSize: 'cover' }} />
      <h1 ref={titleRef}>Your Hero Headline</h1>
      <p ref={subtitleRef}>Supporting copy</p>
    </section>
  )
}
```

---

## Parallax — The Architecture

**Three tiers, choose based on quality target:**

### Tier 1: CSS Only (zero JS, best performance)

```css
/* Require: scroll-driven animations support (Chrome 115+) */
.parallax-layer {
  animation: parallax-slow linear;
  animation-timeline: scroll(root);
}

@keyframes parallax-slow {
  from { transform: translateY(0); }
  to   { transform: translateY(-15%); }
}

/* Multiple speeds = multiple layers */
.layer-bg    { --speed: -8%;  }
.layer-mid   { --speed: -20%; }
.layer-front { --speed: -35%; }

.parallax-layer {
  animation: parallax linear;
  animation-timeline: scroll(root);
}
@keyframes parallax {
  to { transform: translateY(var(--speed)); }
}
```

### Tier 2: GSAP + Lenis (broadest support, full control)

The production-ready Parallax component using `gsap.quickSetter` for zero-overhead transforms:

```tsx
'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: React.ReactNode
  speed?: number     // -3 to 3. Negative = opposite to scroll (recede), positive = forward
  className?: string
}

export function Parallax({ children, speed = 1, className = '' }: ParallaxProps) {
  const trigger = useRef<HTMLDivElement>(null)
  const target = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // quickSetter caches the transform pipeline — much faster than gsap.to() in a loop
    const setY = gsap.quickSetter(target.current, 'y', 'px')
    const offset = window.innerWidth * speed * 0.1  // Scale offset to viewport width

    gsap.timeline({
      scrollTrigger: {
        trigger: trigger.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,  // true = exact pixel sync, no lag
        onUpdate: (st) => {
          // st.progress = 0 (trigger top at viewport bottom) → 1 (trigger bottom at viewport top)
          setY(st.progress * offset)
        },
      },
    })
  }, { scope: trigger })

  return (
    <div ref={trigger} className={className}>
      <div ref={target}>{children}</div>
    </div>
  )
}
```

**Speed guide:**
- `speed = 0.5` — slow drift (far background, clouds)
- `speed = 1.0` — standard parallax (mid layer)
- `speed = 2.0` — strong (foreground element)
- `speed = -1.0` — scrolls opposite direction (creates lift effect)

### Tier 3: DOM-to-WebGL (maximum quality, complex scenes)

Architecture for when parallax needs to be done in a shader:

```
Project structure:
  /gallery
    ├── index.ts     — DOM version with getBoundingClientRect parallax
    ├── GL.ts        — Three.js scene, camera, renderer
    └── GLMedia.ts   — Per-image mesh, material, UV shader
  /scroll
    └── index.ts     — Shared scroll state (lerped current/target)
```

Core scroll state (shared by DOM and WebGL):

```javascript
const scroll = {
  current: 0,   // Lerped scroll position (what you render)
  target: 0,    // Raw scroll input
  ease: 0.07,   // 7% per frame → smooth deceleration
  limit: 0,     // document.body.scrollHeight - window.innerHeight
}

// RAF loop
function raf() {
  scroll.target = Math.max(0, Math.min(scroll.limit, scroll.target))
  scroll.current += (scroll.target - scroll.current) * scroll.ease
  // Apply to DOM: elements.forEach(el => el.update(scroll.current))
  // Apply to WebGL: scene.uniforms.uScroll.value = scroll.current
  requestAnimationFrame(raf)
}
```

DOM parallax using oversized image buffer:
```javascript
// CSS: img { width: 125%; left: -12.5%; object-fit: cover; }
// This creates a 12.5% buffer on each side for parallax movement

function updateParallax(el, scrollCurrent) {
  const rect = el.getBoundingClientRect()
  const elementCenter = rect.left + rect.width * 0.5
  const viewportCenter = window.innerWidth * 0.5
  // t: -1 (far left) through 0 (centered) to 1 (far right)
  const t = Math.max(-1, Math.min(1, (elementCenter - viewportCenter) / viewportCenter))
  const MAX_SHIFT = 10  // % of image width
  el.querySelector('img').style.transform = `translateX(${-t * MAX_SHIFT}%)`
}
```

WebGL camera for pixel-perfect DOM sync:
```javascript
// FOV so 1 unit = 1 pixel at z=100
camera.fov = 2 * Math.atan(window.innerHeight / 2 / 100) * (180 / Math.PI)
camera.position.z = 100

// Convert DOM rect to WebGL position
mesh.position.x = rect.left - scroll.current - window.innerWidth / 2 + rect.width / 2
mesh.position.y = -rect.top + window.innerHeight / 2 - rect.height / 2
mesh.scale.set(rect.width, rect.height, 1)
```

---

## Text Reveal Animations — The Full Toolkit

SplitText is **GSAP Club GreenSock** (paid). It must be imported from a local copy.

### Setup

```javascript
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

// CRITICAL: Split AFTER fonts load — wrong metrics without this
document.fonts.ready.then(() => {
  // Safe to split now
})
```

### Pattern 1 — Character Fall-In (hero headline)

```javascript
// Total duration for a 20-char title: 20 * 0.02 + 0.6 = 1.0s cascade
const split = SplitText.create(el, { type: 'chars' })

gsap.from(split.chars, {
  opacity: 0,
  y: 60,
  rotateX: -90,    // 3D flip on entry
  transformOrigin: '0% 50% -50px',
  duration: 0.6,
  stagger: 0.02,   // 20ms per char = fast wave
  ease: 'expo.out',
  force3D: true,   // Force GPU compositing
  scrollTrigger: {
    trigger: el,
    start: 'top 85%',
    once: true,
  },
})

// Always clean up
// return () => split.revert()
```

### Pattern 2 — Line Mask / Theater Curtain (body copy)

The line wraps in an `overflow: hidden` container. Text rises up like stage curtain.

```javascript
const split = SplitText.create(el, {
  type: 'lines',
  linesClass: 'line-wrap',    // Applied to each line wrapper
})

// Set overflow:hidden AFTER split — before, the line wrappers don't exist
gsap.set('.line-wrap', { overflow: 'hidden' })

gsap.from(split.lines, {
  yPercent: 110,             // Sits just below clip boundary
  duration: 1.0,
  stagger: 0.1,             // 100ms between lines = deliberate read
  ease: 'expo.out',
  force3D: true,
  scrollTrigger: {
    trigger: el,
    start: 'top 80%',
    once: true,
  },
})
```

### Pattern 3 — Word Blur Reveal (ambient / cinematic)

```javascript
const split = SplitText.create(el, { type: 'words' })

gsap.from(split.words, {
  opacity: 0,
  y: 20,
  filter: 'blur(8px)',       // Skip on mobile — expensive
  duration: 0.5,
  stagger: 0.04,
  ease: 'power3.out',
  force3D: true,
  scrollTrigger: {
    trigger: el,
    start: 'top 85%',
    once: true,
  },
})
```

### Pattern 4 — Scroll-Scrubbed Word Highlight (Medium-style reading)

```javascript
const split = SplitText.create(el, { type: 'words' })

gsap.from(split.words, {
  opacity: 0.12,             // Words start dim, not invisible
  color: 'rgba(255,255,255,0.3)',
  duration: 1,
  stagger: 0.1,
  ease: 'none',              // Linear — scrollbar IS the easing
  scrollTrigger: {
    trigger: el,
    start: 'top 70%',
    end: 'bottom 40%',
    scrub: 1,                // 1s lag = feels like reading
  },
})
```

### Pattern 5 — Scramble Reveal (hacker/tech aesthetic, VL-01 native)

```javascript
const split = SplitText.create(el, { type: 'chars' })
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'

split.chars.forEach((char, i) => {
  const original = char.textContent
  let iterations = 0
  const maxIterations = i * 3

  gsap.delayedCall(i * 0.04, () => {
    const interval = setInterval(() => {
      char.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
      if (iterations >= maxIterations) {
        char.textContent = original
        clearInterval(interval)
      }
      iterations++
    }, 50)
  })
})
```

### Resize Handling (production requirement)

```javascript
// GSAP 3.13+: auto re-split on container resize
const split = SplitText.create(el, {
  type: 'lines',
  observeChanges: true,      // Watches for DOM/size changes and re-splits
})

// Or manual with ResizeObserver
const ro = new ResizeObserver(() => {
  split.revert()
  split = SplitText.create(el, { type: 'lines' })
  // Re-create animations
})
ro.observe(el)
```

### Accessibility

```javascript
const el = headlineRef.current
el.setAttribute('aria-label', el.textContent ?? '')

const split = SplitText.create(el, { type: 'chars' })
split.chars.forEach(char => char.setAttribute('aria-hidden', 'true'))
```

---

## Scroll Batch — Reveal Many Elements Efficiently

`ScrollTrigger.batch()` is how pros animate lists, grids, cards without creating N triggers.

```javascript
// Reveals a grid of cards as they enter viewport — staggered per batch
ScrollTrigger.batch('.card', {
  start: 'top 90%',
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      force3D: true,
    })
  },
  onLeave: (elements) => {
    gsap.to(elements, { opacity: 0, y: -40, duration: 0.3 })
  },
  onEnterBack: (elements) => {
    gsap.to(elements, { opacity: 1, y: 0, duration: 0.3 })
  },
})

// Refresh after dynamic content loads
ScrollTrigger.refresh()
```

---

## Horizontal Scroll Section

```javascript
// Wrap horizontal panels in a container wider than viewport
// .h-scroll-container: display flex; width: 500vw (5 panels × 100vw)

gsap.to('.h-scroll-container', {
  xPercent: -80,             // Move 4 panels left (out of 5 total)
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-scroll-wrapper',
    pin: true,
    pinSpacing: true,
    scrub: 1,
    end: () => '+=' + document.querySelector('.h-scroll-container').offsetWidth,
    invalidateOnRefresh: true,
  },
})
```

---

## Motion (Framer) — React Declarative Scroll

For component-level scroll animations in React without imperative GSAP code.

```tsx
'use client'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import { useRef } from 'react'

export function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll progress through THIS element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],  // [when-element-enters, when-element-leaves]
  })

  // Smoothed version — spring physics on the raw scroll value
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Map progress (0→1) to CSS values
  const bgY        = useTransform(smoothProgress, [0, 1], ['0%', '30%'])    // bg drifts down
  const textY      = useTransform(smoothProgress, [0, 1], ['0%', '-20%'])   // text drifts up
  const opacity    = useTransform(smoothProgress, [0, 0.5, 1], [1, 1, 0])   // fade at end
  const scale      = useTransform(smoothProgress, [0, 1], [1, 1.1])         // subtle grow
  const blur       = useTransform(smoothProgress, [0, 1], [0, 8])           // progressive blur

  return (
    <div ref={ref} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Background layer — slowest */}
      <motion.div style={{ y: bgY, scale }} className="absolute inset-0">
        <img src="/hero-bg.jpg" className="w-full h-full object-cover" />
      </motion.div>

      {/* Text layer — faster, fades */}
      <motion.div
        style={{
          y: textY,
          opacity,
          filter: useTransform(blur, v => `blur(${v}px)`),
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <h1>Hero Headline</h1>
      </motion.div>
    </div>
  )
}
```

**useScroll offset syntax:**
- `"start start"` — element top hits viewport top
- `"end start"` — element bottom hits viewport top
- `"start end"` — element top hits viewport bottom
- `[0.5, 0.5]` — element center, viewport center (numbers = fraction)

---

## CSS Scroll-Driven Animations (Zero JS)

Native browser. No library. Chrome 115+, ~85% global support (2026).

```css
/* Reading progress bar */
.progress-bar {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: var(--orange);
  transform-origin: left;
  transform: scaleX(0);
  animation: grow-bar linear;
  animation-timeline: scroll(root);  /* root = html scroll container */
}
@keyframes grow-bar {
  to { transform: scaleX(1); }
}

/* Element fade + rise on scroll into view */
.reveal-card {
  opacity: 0;
  transform: translateY(30px);
  animation: reveal-up ease-out both;
  animation-timeline: view();           /* view() = element's own viewport progress */
  animation-range: entry 0% entry 60%; /* Only during entry phase */
}
@keyframes reveal-up {
  to { opacity: 1; transform: translateY(0); }
}

/* Parallax layers — pure CSS */
.layer-bg   { animation: parallax-bg   linear; animation-timeline: scroll(root); }
.layer-mid  { animation: parallax-mid  linear; animation-timeline: scroll(root); }
.layer-fore { animation: parallax-fore linear; animation-timeline: scroll(root); }

@keyframes parallax-bg   { to { transform: translateY(-8%); } }
@keyframes parallax-mid  { to { transform: translateY(-20%); } }
@keyframes parallax-fore { to { transform: translateY(-40%); } }

/* Combined enter + exit (stagger siblings with animation-delay) */
.card {
  animation: fade-in linear, fade-out linear;
  animation-timeline: view(), view();
  animation-range: entry, exit;
}
@keyframes fade-in  { from { opacity: 0; transform: translateY(20px); } }
@keyframes fade-out { to   { opacity: 0; transform: translateY(-20px); } }

/* Always gate behind prefers-reduced-motion */
@media (prefers-reduced-motion: no-preference) {
  .reveal-card { animation: reveal-up ease-out both; animation-timeline: view(); }
}
```

---

## Hover Effects — Senior Techniques

### 1. Magnetic Button

The button moves toward the cursor when nearby. Lerp makes it feel physical.

```tsx
'use client'
import { useRef, useEffect } from 'react'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>()
  const isHovered = useRef(false)

  useEffect(() => {
    const el = ref.current!
    const STRENGTH = 0.4    // 0–1: how far button moves toward cursor
    const LERP_FACTOR = 0.12 // Lower = more lag (more physical feel)

    function onMouseMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      // Distance from cursor to button center, normalized to button size
      pos.current.x = (e.clientX - centerX) * STRENGTH
      pos.current.y = (e.clientY - centerY) * STRENGTH
    }

    function onMouseEnter() { isHovered.current = true }

    function onMouseLeave() {
      isHovered.current = false
      pos.current = { x: 0, y: 0 } // Snap target back to origin
    }

    let currentX = 0, currentY = 0

    function animate() {
      // Lerp toward target (or origin if not hovered)
      currentX = lerp(currentX, isHovered.current ? pos.current.x : 0, LERP_FACTOR)
      currentY = lerp(currentY, isHovered.current ? pos.current.y : 0, LERP_FACTOR)
      el.style.transform = `translate(${currentX}px, ${currentY}px)`
      rafId.current = requestAnimationFrame(animate)
    }

    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mousemove', onMouseMove)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId.current!)
    }
  }, [])

  return <button ref={ref}>{children}</button>
}
```

### 2. Cursor Spotlight

Reveals content beneath a circular mask that follows the cursor:

```tsx
'use client'
import { useEffect } from 'react'

export function SpotlightSection({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function onMove(e: MouseEvent) {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px')
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px')
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="spotlight-section">
      {children}
      <div className="spotlight-overlay" />
    </div>
  )
}
```

```css
:root {
  --cursor-x: 50%;
  --cursor-y: 50%;
}

.spotlight-section {
  position: relative;
  overflow: hidden;
}

.spotlight-overlay {
  position: fixed;
  inset: 0;
  /* Reveal circle follows cursor, dark mask everywhere else */
  background: radial-gradient(
    circle 12rem at var(--cursor-x) var(--cursor-y),
    transparent 0%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  z-index: 10;
}
```

### 3. Border Gradient Hover (VL-01 compatible)

Border brightens and rotates gradient on hover:

```css
.card {
  position: relative;
  background: var(--glass);
  border-radius: 16px;
}

.card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle, 0deg),
    transparent 0deg,
    var(--orange) 60deg,
    var(--cyan) 120deg,
    transparent 180deg
  );
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: -1;
}

.card:hover::before {
  opacity: 1;
  animation: rotate-border 3s linear infinite;
}

@keyframes rotate-border {
  to { --angle: 360deg; }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```

### 4. Glow / Bloom on Hover

```css
.glow-button {
  transition:
    box-shadow 300ms ease,
    filter 300ms ease;
}

.glow-button:hover {
  box-shadow:
    0 0 20px rgba(255, 107, 0, 0.6),
    0 0 60px rgba(255, 107, 0, 0.3),
    0 0 100px rgba(255, 107, 0, 0.1);
  filter: brightness(1.15);
}
```

### 5. Scale + Reveal Text on Hover (card pattern)

```tsx
<motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileHover={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    Hidden label
  </motion.div>
</motion.div>
```

---

## Performance Rules (Non-Negotiable)

These are what separate production code from tutorial code:

```javascript
// 1. Only animate GPU-composited properties
//    FAST:  transform, opacity
//    SLOW:  top, left, width, height, padding, border, box-shadow (causes layout)
//    MEDIUM: filter, background, color (causes paint, not layout)

// 2. force3D promotes to a separate compositor layer
gsap.to(el, { y: 100, force3D: true })

// 3. quickSetter for values updated every frame (scroll handlers)
const setY = gsap.quickSetter(el, 'y', 'px')
function onScroll() { setY(scrollY * 0.3) }  // No GSAP overhead per call

// 4. Kill all ScrollTriggers on unmount (prevents memory leaks)
useGSAP(() => {
  // ... all gsap code
}, { scope: ref })  // useGSAP auto-cleans everything inside

// 5. Lazy-initialize expensive effects
ScrollTrigger.create({
  trigger: section,
  start: 'top 110%',  // Init slightly before viewport
  once: true,
  onEnter: () => {
    // Only create SplitText, canvas, WebGL when section is near
  }
})

// 6. Respect motion preferences (required for accessibility)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reducedMotion) {
  // All animation code
}

// 7. One RAF loop — never create multiple
// Bad:  multiple setInterval, multiple requestAnimationFrame roots
// Good: GSAP ticker drives everything (Lenis raf, custom logic, etc.)

// 8. will-change sparingly
// Add right before animation, remove right after
el.style.willChange = 'transform'
// ... animate ...
el.style.willChange = 'auto'
// GSAP does this automatically with force3D

// 9. contain: strict on scroll containers
.scroll-section { contain: strict; }
// Prevents the browser from recalculating layout outside the container
```

---

## Easing Reference (What Each Feels Like)

```javascript
// GSAP named eases → physical feel
'power1.out'    // Gentle decelerate — UI elements, subtle reveals
'power2.out'    // Standard decelerate — most scroll reveals
'power3.out'    // Fast then slow — snappy text reveals
'expo.out'      // Extremely fast then slow — dramatic reveals, hero titles
'back.out(1.7)' // Slight overshoot — playful, buttons
'elastic.out'   // Spring bounce — playful only, avoid in serious UI
'none'          // Linear — use for scrubbed timelines (scroll IS the ease)
'circ.out'      // Circular decelerate — feels natural, underused

// Motion spring config → physical feel
{ type: 'spring', stiffness: 100, damping: 10 }   // Bouncy
{ type: 'spring', stiffness: 300, damping: 30 }   // Snappy, no bounce
{ type: 'spring', stiffness: 60, damping: 20 }    // Slow, heavy
```

---

## Stagger Timing Reference

```javascript
// Total cascade time = stagger * count + duration
// For a headline: keep total under ~1s. For a grid: 1.5–2s is fine.

stagger: 0.01   // 10ms — feels like one object (chars in very short words)
stagger: 0.02   // 20ms — fast wave (standard for character reveals)
stagger: 0.04   // 40ms — clear cascade (words, short lists)
stagger: 0.08   // 80ms — deliberate sequence (cards, features)
stagger: 0.12   // 120ms — slow parade (large items, numbered sections)
stagger: 0.15   // 150ms — one by one (lines of copy, timeline items)

// Advanced stagger config
stagger: {
  each: 0.05,
  from: 'center',   // 'start' | 'end' | 'center' | 'edges' | 'random' | index
  ease: 'power2.in',
  grid: [4, 3],     // For grid layouts — wave propagates 2D
}
```

---

## VL-01 Motion Tokens

Consistent timing values to use across all animations in this project:

```css
:root {
  /* Already defined in globals.css — matches these physical meanings: */
  --fast:     200ms;   /* Micro-interactions: hover, focus, tooltip */
  --base-dur: 400ms;   /* Standard transitions: panel open, tab switch */
  --spring:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* Overshoot spring */
  --expo:     cubic-bezier(0.16, 1, 0.3, 1);       /* Expo out */
}
```

GSAP equivalents:
```javascript
const VL01 = {
  fast:    { duration: 0.2 },
  base:    { duration: 0.4 },
  spring:  { duration: 0.6, ease: 'back.out(1.7)' },
  expo:    { duration: 0.8, ease: 'expo.out' },
  scrub:   { scrub: 1 },         // For timeline + ScrollTrigger
  snap:    { scrub: true },      // For exact scroll sync
}
```
