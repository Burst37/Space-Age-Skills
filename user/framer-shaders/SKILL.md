---
name: framer-shaders
version: 1.0.0
updated: 2026-05-18
description: >
  Framer-style WebGL shader effects for Space Age AI Solutions sites. Covers aurora
  backgrounds, mesh gradients, liquid noise, grain overlays, cursor-reactive glows,
  and CSS-only fallbacks. Provides production-ready React/Three.js + Framer Motion
  components and raw GLSL. Triggers on "shader", "aurora background", "mesh gradient",
  "framer shader", "WebGL background", "grain overlay", "liquid noise", or any
  request for animated background effects.
---

# FRAMER-SHADERS — WebGL Shader Effects Skill
**Version:** 1.0.0 | **Prefix:** SA- | **Stack:** Three.js · React Three Fiber · Framer Motion · GLSL

---

## TRIGGER CONDITIONS

Load this skill when any of the following occur:

- User says "shader", "framer shader", "aurora background", "mesh gradient", "WebGL background"
- User says "grain overlay", "film grain", "noise texture", "liquid noise"
- User says "animated background", "interactive background", "cursor glow effect"
- User asks for a hero section with a "premium" or "cinematic" animated background
- Any cinematic-website-builder session needs a hero background effect
- User references Framer.com visual effects

---

## WHAT THIS SKILL DOES

Provides production-ready shader components in three tiers:

| Tier | Technology | Use Case |
|------|-----------|----------|
| **Full WebGL** | Three.js / React Three Fiber + custom GLSL | Premium hero, max impact |
| **CSS-Advanced** | `@keyframes`, `filter`, SVG `feTurbulence` | Fast load, broad support |
| **CSS-Only** | Radial gradients + `mix-blend-mode` | Zero-dependency fallback |

Always prefer Full WebGL for hero sections. Use CSS-Advanced for secondary sections. Use CSS-Only for mobile fallback or when performance budget is critical.

---

## SHADER CATALOG

### 01 — Aurora / Atmospheric Background

The signature Framer-style background. Three animated color orbs using simplex noise
movement, blended through a custom fragment shader.

**React Three Fiber component:**

```tsx
// components/AuroraBackground.tsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.15;

    float n1 = snoise(vec3(uv * 1.8, t));
    float n2 = snoise(vec3(uv * 2.4 + 1.5, t * 1.3));
    float n3 = snoise(vec3(uv * 1.2 - 2.0, t * 0.8));

    vec3 col = mix(uColor1, uColor2, smoothstep(-0.4, 0.8, n1));
    col = mix(col, uColor3, smoothstep(-0.3, 0.7, n2) * 0.6);
    col += smoothstep(0.4, 0.9, n3) * uColor2 * 0.3;

    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - 0.5) * 1.6);
    col *= vignette * 0.85 + 0.15;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function AuroraPlane({
  color1 = [0.161, 0.047, 0.996],  // electric violet
  color2 = [0.0, 0.69, 1.0],       // cyan
  color3 = [0.047, 0.482, 0.0],    // emerald
}: {
  color1?: [number, number, number];
  color2?: [number, number, number];
  color3?: [number, number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uColor1: { value: new THREE.Color(...color1) },
          uColor2: { value: new THREE.Color(...color2) },
          uColor3: { value: new THREE.Color(...color3) },
        }}
      />
    </mesh>
  );
}

export function AuroraBackground({
  color1,
  color2,
  color3,
  className = "",
}: {
  color1?: [number, number, number];
  color2?: [number, number, number];
  color3?: [number, number, number];
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`} aria-hidden>
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false, alpha: false }}>
        <AuroraPlane color1={color1} color2={color2} color3={color3} />
      </Canvas>
    </div>
  );
}
```

**VL-01 color presets for AuroraBackground:**
```tsx
// Electric Blue / Violet (default SA)
<AuroraBackground color1={[0.1, 0.05, 0.3]} color2={[0.16, 0.05, 1.0]} color3={[0.0, 0.5, 1.0]} />

// Emerald / Cyan (tech/AI)
<AuroraBackground color1={[0.0, 0.15, 0.1]} color2={[0.0, 0.87, 0.47]} color3={[0.0, 0.69, 1.0]} />

// Crimson / Violet (luxury)
<AuroraBackground color1={[0.2, 0.0, 0.1]} color2={[0.8, 0.04, 0.3]} color3={[0.4, 0.0, 0.8]} />
```

---

### 02 — Mesh Gradient (Animated CSS Orbs — Fast Load)

CSS-advanced tier. Zero JS dependency. Matches Framer's "gradient blur" backgrounds.

```tsx
// components/MeshGradient.tsx
export function MeshGradient({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <div className="mesh-orb mesh-orb-3" />
    </div>
  );
}
```

```css
/* globals.css — add to Space Age base styles */
.mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: orbFloat 12s ease-in-out infinite;
}
.mesh-orb-1 {
  width: 60vw; height: 60vw;
  background: radial-gradient(circle, #2979FF 0%, transparent 70%);
  top: -10%; left: -10%;
  animation-delay: 0s;
}
.mesh-orb-2 {
  width: 50vw; height: 50vw;
  background: radial-gradient(circle, #7C4DFF 0%, transparent 70%);
  top: 20%; right: -15%;
  animation-delay: -4s;
  animation-duration: 14s;
}
.mesh-orb-3 {
  width: 40vw; height: 40vw;
  background: radial-gradient(circle, #00E5FF 0%, transparent 70%);
  bottom: -5%; left: 30%;
  animation-delay: -8s;
  animation-duration: 10s;
}
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(4%, -6%) scale(1.05); }
  66%       { transform: translate(-3%, 4%) scale(0.97); }
}
```

---

### 03 — Grain / Film Noise Overlay

Adds tactile texture over any background. Classic Framer "grainy gradient" look.

```tsx
// components/GrainOverlay.tsx
export function GrainOverlay({ intensity = 0.06 }: { intensity?: number }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
      style={{ opacity: intensity }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
```

**Usage rules:**
- Default `intensity`: `0.04`–`0.08` (subtle)
- Dark backgrounds: up to `0.10`
- Never exceed `0.15` — kills readability
- Combine with `mix-blend-mode: overlay` on the wrapping div for richer effect

---

### 04 — Liquid Noise / Distortion Hero

Three.js shader with mouse-reactive UV distortion. Premium interactive hero.

```tsx
// components/LiquidNoise.tsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform sampler2D uTexture;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.4;
    vec2 mouse = uMouse * 0.04;

    float nx = noise(uv * 3.0 + t);
    float ny = noise(uv * 3.0 - t + 1.5);
    vec2 distort = vec2(nx, ny) * 0.04 + mouse;

    vec2 distorted = uv + distort;

    // VL-01 colors — override per project
    vec3 c1 = vec3(0.04, 0.04, 0.08);
    vec3 c2 = vec3(0.16, 0.05, 1.0);
    vec3 c3 = vec3(0.0, 0.5, 1.0);

    float n = noise(distorted * 2.5 + t * 0.5);
    vec3 col = mix(c1, c2, smoothstep(0.2, 0.8, n));
    col = mix(col, c3, smoothstep(0.5, 1.0, noise(distorted * 4.0 - t)) * 0.4);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

function LiquidPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    }, { passive: true });
  }

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uMouse.value.lerp(mouse.current, 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  );
}

export function LiquidNoise({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`} aria-hidden>
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false, alpha: false }}>
        <LiquidPlane />
      </Canvas>
    </div>
  );
}
```

---

### 05 — Cursor Glow (CSS — Zero JS)

Follows cursor with a radial glow. Pairs with any of the above.

```tsx
// components/CursorGlow.tsx
"use client";
import { useEffect, useRef } from "react";

export function CursorGlow({
  size = 600,
  color = "rgba(41,121,255,0.12)",
}: {
  size?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [size]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-0 rounded-full transition-transform duration-75"
      aria-hidden
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        filter: "blur(40px)",
        willChange: "transform",
      }}
    />
  );
}
```

---

## DESIGN TOKENS — SHADER LAYER

Add to DESIGN.md `components:` block for any SA site using shaders:

```yaml
components:
  shader-aurora:
    color1: "{colors.primary}"
    color2: "#00E5FF"
    color3: "#7C4DFF"
    speed: 0.15
    blend: "screen"
  shader-mesh:
    orb1-color: "{colors.primary-glow}"
    orb2-color: "rgba(124,77,255,0.35)"
    orb3-color: "rgba(0,229,255,0.25)"
    blur: 80px
    opacity: 0.35
  shader-grain:
    intensity: 0.06
    base-frequency: "0.65"
    octaves: 3
  shader-cursor-glow:
    size: 600px
    color: "{colors.primary-glow}"
```

---

## USAGE PATTERNS — HERO SECTION

### Full Premium Hero (WebGL Aurora + Grain)
```tsx
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050508]">
      <AuroraBackground />
      <GrainOverlay intensity={0.06} />
      <CursorGlow color="rgba(41,121,255,0.10)" />
      {/* content */}
    </section>
  );
}
```

### Mid-Budget Hero (CSS Mesh + Grain)
```tsx
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050508]">
      <MeshGradient />
      <GrainOverlay intensity={0.05} />
      {/* content */}
    </section>
  );
}
```

### Mobile Fallback (CSS only)
Use `MeshGradient` (CSS) unconditionally — it's 60fps on mobile.
Disable `AuroraBackground` on mobile via:
```tsx
const isMobile = /Mobi/i.test(navigator.userAgent);
// or use Next.js dynamic import with SSR:false
```

---

## PERFORMANCE RULES

| Effect | GPU Impact | Notes |
|--------|-----------|-------|
| Aurora (GLSL) | Medium | Use `antialias: false` on Canvas — halves cost |
| Mesh Orbs (CSS) | Low | `filter: blur()` triggers GPU compositing — fine |
| Grain (SVG) | Negligible | Static filter, re-rendered by compositor only |
| Cursor Glow | Negligible | Pure transform — GPU-composited, no repaint |
| Liquid Noise | High | Hero-only, never repeat in scroll sections |

**Always:**
- Set `gl={{ antialias: false, alpha: false }}` on every Canvas
- Lazy-load the Canvas component: `dynamic(() => import(...), { ssr: false })`
- Use `will-change: transform` on CSS-animated layers
- Pause shader `uTime` when tab is hidden (`document.addEventListener('visibilitychange')`)
- Supply a `prefers-reduced-motion` fallback that disables animation

```tsx
// Reduced motion wrapper
const prefersReduced = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

{!prefersReduced && <AuroraBackground />}
```

---

## DEV STACK REQUIREMENTS

```bash
npm install three @react-three/fiber
# Framer Motion (already required for SA sites)
npm install framer-motion
```

```json
// tsconfig.json — ensure GLSL imports work with raw-loader or vite
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Vite GLSL plugin (optional — allows `.glsl` file imports):
```bash
npm install vite-plugin-glsl
```

---

## INTEGRATION WITH SA-DESIGN-MD

When sa-design-md generates a DESIGN.md, it will now include shader tokens.
Pass these tokens to the shader components as props to maintain brand consistency.

```
brand-extractor → sa-design-md → framer-shaders component config
```

Color-to-shader mapping:
- `colors.primary` → `color1` (dominant aurora tint)
- `colors.primary-glow` → cursor glow color
- `colors.surface-base` → Canvas background clear color
- `accent` → `color2` / `color3` based on brand

---

## SKILL METADATA

```yaml
skill_id: FRAMER-SHADERS
version: 1.0.0
category: visual-effects
stack: [three, react-three-fiber, framer-motion, glsl]
dependencies:
  - sa-design-md (upstream — provides color tokens)
  - cinematic-website-builder (downstream consumer)
  - page-upgrade (optional — shader upgrade tier)
outputs:
  - AuroraBackground component
  - MeshGradient component
  - GrainOverlay component
  - LiquidNoise component
  - CursorGlow component
performance_tier: gpu_medium_to_low
mobile_safe: true (use CSS tier on mobile)
reduced_motion: supported
```
