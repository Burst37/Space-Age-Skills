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
