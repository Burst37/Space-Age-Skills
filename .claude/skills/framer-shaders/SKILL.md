---
name: framer-shaders
version: 1.0.0
updated: 2026-05-18
description: >
  Framer-style WebGL shader effects for Space Age sites. Aurora backgrounds, mesh
  gradients, liquid noise, grain overlays, cursor-reactive glows, and CSS fallbacks.
  Production-ready React/Three.js + Framer Motion components and raw GLSL.
  Triggers on: "shader", "aurora background", "mesh gradient", "framer shader",
  "WebGL background", "grain overlay", "liquid noise".
---

# FRAMER-SHADERS — WebGL Shader Effects
**Version:** 1.0.0 | **Stack:** Three.js · React Three Fiber · Framer Motion · GLSL

## TRIGGER CONDITIONS

- User says "shader", "aurora background", "mesh gradient", "WebGL background"
- User says "grain overlay", "film grain", "liquid noise", "animated background"
- Hero section needs premium cinematic animated background
- Any cinematic-website-builder session needing hero background effect

## SHADER CATALOG

### 01 — Aurora / Atmospheric Background (Signature Framer-style)
Three animated color orbs using simplex noise movement, blended through custom fragment shader.
- Full React Three Fiber component: `AuroraBackground`
- Simplex noise GLSL included
- VL-01 color presets: Electric Blue/Violet, Emerald/Cyan, Crimson/Violet

### 02 — Mesh Gradient (CSS Orbs — Fast Load)
CSS-advanced tier, zero JS dependency. Three animated orbs with `filter: blur(80px)`.
- Component: `MeshGradient`
- @keyframes orbFloat animation
- 60fps on mobile

### 03 — Grain / Film Noise Overlay
SVG `feTurbulence` filter. Tactile texture over any background.
- Component: `GrainOverlay`
- Default intensity: 0.04–0.08
- Combine with `mix-blend-mode: overlay`

### 04 — Liquid Noise (Mouse-Reactive)
Three.js shader with UV distortion reactive to cursor movement.
- Component: `LiquidNoise`
- Uses hash-based 2D noise
- `uMouse` uniform with lerp smoothing

### 05 — Cursor Glow
CSS-only cursor-following radial glow.
- Component: `CursorGlow`
- Props: `size` (default 600), `color` (default rgba(41,121,255,0.12))
- Pure `transform` — GPU-composited, no repaint

## USAGE PATTERNS

```tsx
// Full Premium Hero (WebGL Aurora + Grain)
<section className="relative min-h-screen bg-[#050508]">
  <AuroraBackground />
  <GrainOverlay intensity={0.06} />
  <CursorGlow />
</section>

// Mid-Budget (CSS Mesh + Grain)
<section className="relative min-h-screen bg-[#050508]">
  <MeshGradient />
  <GrainOverlay intensity={0.05} />
</section>
```

## PERFORMANCE RULES

- Always `gl={{ antialias: false, alpha: false }}` on Canvas (halves GPU cost)
- Lazy-load Canvas: `dynamic(() => import(...), { ssr: false })`
- Use CSS tier on mobile (`MeshGradient` is 60fps on all devices)
- Pause `uTime` when tab hidden
- Always provide `prefers-reduced-motion` fallback

## DEV STACK

```bash
npm install three @react-three/fiber framer-motion
```

## SKILL METADATA

```yaml
skill_id: FRAMER-SHADERS
version: 1.0.0
category: visual-effects
stack: [three, react-three-fiber, framer-motion, glsl]
dependencies: [sa-design-md]
performance_tier: gpu_medium_to_low
mobile_safe: true (use CSS tier on mobile)
reduced_motion: supported
```
