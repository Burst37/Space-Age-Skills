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

## Liquid Glass Libraries

Three battle-tested libraries for advanced liquid glass / glassmorphic effects. Choose based on your platform target.

---

### 1. `liquid-glass-react` — Web / React (CSS SVG filter approach)

**Best for:** React web apps; requires only CSS + SVG filters; works in Chrome (best), partial in Safari/Firefox.

**Install:**
```bash
npm install liquid-glass-react
```

**Primary component:** `LiquidGlass` (default export)

**Props reference:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | Content inside the glass |
| `displacementScale` | `number` | `70` | Displacement/refraction intensity |
| `blurAmount` | `number` | `0.0625` | Frosting level |
| `saturation` | `number` | `140` | Color saturation |
| `aberrationIntensity` | `number` | `2` | Chromatic aberration intensity |
| `elasticity` | `number` | `0.15` | Liquid elastic feel (0 = rigid) |
| `cornerRadius` | `number` | `999` | Border radius in px |
| `mode` | `"standard" \| "polar" \| "prominent" \| "shader"` | `"standard"` | Refraction mode |
| `overLight` | `boolean` | `false` | Light background mode |
| `padding` | `string` | — | CSS padding value |
| `className` | `string` | `""` | Extra CSS classes |
| `style` | `React.CSSProperties` | — | Inline styles |
| `onClick` | `() => void` | — | Click handler |
| `mouseContainer` | `React.RefObject<HTMLElement \| null> \| null` | `null` | Ref for mouse tracking area |
| `globalMousePos` | `{ x: number; y: number }` | — | Manual mouse position override |
| `mouseOffset` | `{ x: number; y: number }` | — | Position offset fine-tuning |

**Usage examples:**

```tsx
// Basic wrapper
import LiquidGlass from 'liquid-glass-react'

<LiquidGlass>
  <div className="p-6">
    <h2>Glass content</h2>
  </div>
</LiquidGlass>

// Button with tuned params
<LiquidGlass
  displacementScale={64}
  blurAmount={0.1}
  saturation={130}
  aberrationIntensity={2}
  elasticity={0.35}
  cornerRadius={100}
  padding="8px 16px"
  onClick={() => console.log('clicked')}
>
  <span className="text-white font-medium">Click Me</span>
</LiquidGlass>

// Mouse tracks across a full-screen container
const containerRef = useRef<HTMLDivElement>(null)
<div ref={containerRef} className="w-full h-screen">
  <LiquidGlass mouseContainer={containerRef} elasticity={0.3}>
    <div className="p-6">Content</div>
  </LiquidGlass>
</div>
```

**Browser notes:** Full displacement only in Chrome. Safari/Firefox render blur/saturation but not displacement.

---

### 2. `@liquid-dom/*` — Web / React / Three.js (WebGPU approach)

**Best for:** High-fidelity GPU-accelerated effects; Three.js/R3F scenes; Chrome with WebGPU enabled.

**Packages:**

| Package | Use case |
|---------|----------|
| `@liquid-dom/react` | React 19 declarative glass UI |
| `@liquid-dom/core` | Imperative scene graph + WebGPU renderer |
| `@liquid-dom/three` | Overlay glass on Three.js WebGPU scenes |
| `@liquid-dom/r3f` | React Three Fiber integration |
| `@liquid-dom/layout` | Renderer-agnostic SwiftUI-style layout engine |

**Install:**
```bash
# React-only
pnpm add @liquid-dom/react react react-dom

# Three.js overlay
pnpm add @liquid-dom/three @liquid-dom/core three

# React Three Fiber
pnpm add @liquid-dom/r3f @liquid-dom/react @react-three/fiber
```

**Browser requirements:**
- WebGPU (`navigator.gpu`) — Chrome 113+ or Edge 113+
- DOM content in glass: requires Chrome flag `chrome://flags/#canvas-draw-element`
- Three.js integration: must use WebGPU renderer, not WebGLRenderer

**Source:** https://github.com/AndrewPrifer/liquid-dom

---

### 3. `io.github.kyant0:backdrop` — Android / Compose Multiplatform

**Best for:** Android and iOS apps built with Jetpack Compose / Compose Multiplatform.

**Gradle setup (Kotlin DSL):**
```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.kyant0:backdrop:<version>")
}
```

**Available via Maven Central.** Full docs at the project GitBook.

**Provided example components (in the repo's sample app):**
- `LiquidButton` — button with liquid glass styling
- `LiquidToggle` — toggle switch
- `LiquidSlider` — slider
- `LiquidBottomTabs` — bottom navigation tabs

The library ships **low-level primitives** — build custom composables using the foundation it provides.

**Source:** https://github.com/Kyant0/AndroidLiquidGlass  
**License:** Apache 2.0

---

## Decision Guide: Which Library to Use

| Scenario | Library |
|----------|---------|
| React web UI, broad browser support | `liquid-glass-react` |
| React web UI, Chrome-only, premium quality | `@liquid-dom/react` |
| Three.js / R3F scene with glass overlay | `@liquid-dom/three` or `@liquid-dom/r3f` |
| Android / iOS Compose app | `io.github.kyant0:backdrop` |

---

## VL-01 Glass Tokens (this project)

Already defined in `globals.css` and usable anywhere:

```css
backdrop-filter: var(--blur);        /* blur(48px) saturate(200%) */
backdrop-filter: var(--blur-sm);     /* blur(20px) saturate(160%) */
background: var(--glass);            /* rgba(255,255,255,0.04) */
background: var(--glass-hover);      /* rgba(255,255,255,0.08) */
border: 1px solid var(--glass-border);
box-shadow: var(--shadow-md);
```

To add `liquid-glass-react` on top of the VL-01 system, pass `overLight={false}` and tune `saturation` down to ~120 to match the dark base palette.

---

## Liquid Glass Integration Pattern (this project)

When adding a liquid glass wrapper to an existing VL-01 component:

1. Install: `npm install liquid-glass-react`
2. Wrap the component with `<LiquidGlass>` — keep existing CSS classes on inner element
3. Remove `backdrop-filter` from the inner element (the library adds its own)
4. Set `cornerRadius` to match the component's `border-radius`
5. Use `mode="prominent"` for hero/featured elements, `mode="standard"` for cards/buttons

```tsx
// Before
<div className="glass-card rounded-2xl p-6">...</div>

// After
import LiquidGlass from 'liquid-glass-react'
<LiquidGlass cornerRadius={16} mode="standard" padding="24px">
  <div className="rounded-2xl">...</div>
</LiquidGlass>
```
