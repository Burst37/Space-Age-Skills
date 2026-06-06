---
name: framer-web-design
display_name: SPACE AGE — Ultimate Framer Web Design Skill
version: 2.0.0
last_updated: 2026-06
authority: Space Age AI Solutions — PROPRIETARY
description: >
  Production-grade Framer development guide covering Code Components, Code Overrides,
  Property Controls, animation, state, routing, SEO injection, voice agent integration,
  video hero backgrounds, Core Web Vitals optimization, and SA pipeline handoff.
  Extends Framer University with SA-specific patterns for cinematic client sites.
trigger_phrases:
  - framer
  - framer site
  - framer component
  - framer override
  - framer code
  - build in framer
  - framer design
  - framer motion
  - framer animation
  - framer property controls
  - framer routing
  - deploy framer
---

# SA FRAMER WEB DESIGN SKILL
## Space Age AI Solutions — Ultimate Framer Production Guide

Framer is the primary front-end delivery platform for SA client sites. Every site
built here is cinematic, AI+SEO optimized, mobile-first, and voice-agent ready.
This skill covers the full development lifecycle from Stitch handoff through Vercel deploy.

---

## SA PIPELINE POSITION

```
Phase 4 (Stitch UI/UX) → Phase 4.5 (AI+SEO assets) → Phase 5 (Framer build) → Vercel deploy
```

Framer receives:
- Stitch-generated wireframe + UI/UX as the design reference
- MP4 video hero (FFmpeg-processed, 15fps, 5-10s, H.264 faststart) from Phase 3.5
- Poster frame JPG (extracted via `ffmpeg -vframes 1 -q:v 2 poster.jpg`)
- Brand assets: logo, palette, typography from Phase 1 brand kit
- AI+SEO assets: schema.org JSON-LD, llms.txt, Open Graph meta, FAQ pairs from Phase 4.5
- Character reference images from Phase 2 (if character is featured)

DeepSeek V4 writes the component code on the VS Code + DigitalOcean VPS. Claude Code
orchestrates only — never writes site code.

---

## CORE ARCHITECTURE

### Code Components vs Code Overrides

| Type | When to use | Lives in |
|------|-------------|----------|
| **Code Component** | Custom UI element that doesn't exist in Framer's built-ins | Components panel |
| **Code Override** | Modify behavior/props of existing Framer elements | Overrides panel |

**Rule**: If you're adding new visual structure → Code Component. If you're changing how existing structure behaves → Code Override.

---

## CODE COMPONENTS

### Minimal boilerplate

```tsx
import { addPropertyControls, ControlType } from "framer"

interface Props {
  text: string
  color: string
}

export default function MyComponent({ text, color }: Props) {
  return (
    <div style={{ color, padding: 20 }}>
      {text}
    </div>
  )
}

MyComponent.defaultProps = {
  text: "Hello",
  color: "#000000",
}

addPropertyControls(MyComponent, {
  text: { type: ControlType.String, title: "Text" },
  color: { type: ControlType.Color, title: "Color" },
})
```

### Auto-sizing (critical for responsive layouts)

```tsx
import { useMeasuredSize } from "framer"

export default function AutoSized() {
  const size = useMeasuredSize()

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <p>Width: {size?.width}px</p>
    </div>
  )
}
```

Set component to **"Fill"** or **"Auto"** sizing in Framer canvas — never hardcode pixel dimensions for responsive components.

### Layout fundamentals

```tsx
// Flex column with gap
<div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>

// Absolute overlay (for video hero overlays, modals)
<div style={{ position: "absolute", inset: 0 }}>

// CSS Grid (for card grids)
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
```

---

## CODE OVERRIDES

### Structure

```tsx
import type { ComponentType } from "react"

export function withMyBehavior(Component: ComponentType): ComponentType {
  return function WrappedComponent(props) {
    return <Component {...props} style={{ ...props.style, opacity: 0.8 }} />
  }
}
```

### Animation override (entrance on scroll)

```tsx
import { motion } from "framer-motion"
import type { ComponentType } from "react"

export function withFadeUp(Component: ComponentType): ComponentType {
  return function (props) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}
```

### Hover scale override

```tsx
export function withHoverScale(Component: ComponentType): ComponentType {
  return function (props) {
    return (
      <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
        <Component {...props} />
      </motion.div>
    )
  }
}
```

### Click ripple override

```tsx
import { useState } from "react"

export function withRipple(Component: ComponentType): ComponentType {
  return function (props) {
    const [ripple, setRipple] = useState(false)
    return (
      <motion.div
        animate={ripple ? { scale: [1, 0.97, 1] } : {}}
        transition={{ duration: 0.15 }}
        onClick={() => { setRipple(true); setTimeout(() => setRipple(false), 200) }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}
```

---

## PROPERTY CONTROLS — COMPLETE REFERENCE

```tsx
addPropertyControls(MyComponent, {
  // Text
  title: { type: ControlType.String, title: "Title", placeholder: "Enter text" },

  // Number (with range slider)
  opacity: { type: ControlType.Number, title: "Opacity", min: 0, max: 1, step: 0.01, defaultValue: 1 },

  // Boolean toggle
  showBadge: { type: ControlType.Boolean, title: "Show Badge", defaultValue: true },

  // Color picker
  accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#FF5C00" },

  // Enum dropdown
  variant: {
    type: ControlType.Enum,
    title: "Variant",
    options: ["primary", "secondary", "ghost"],
    optionTitles: ["Primary", "Secondary", "Ghost"],
    defaultValue: "primary",
  },

  // Image upload
  heroImage: { type: ControlType.Image, title: "Hero Image" },

  // Framer component slot (accepts any Framer layer)
  icon: { type: ControlType.ComponentInstance, title: "Icon" },

  // Array (repeating items, e.g. nav links)
  links: {
    type: ControlType.Array,
    title: "Links",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type: ControlType.String, title: "Label" },
        href: { type: ControlType.String, title: "URL" },
      },
    },
    defaultValue: [{ label: "Home", href: "/" }],
  },

  // Conditional visibility
  badgeText: {
    type: ControlType.String,
    title: "Badge Text",
    hidden(props) { return !props.showBadge },
  },
})
```

---

## STATE MANAGEMENT

### Local component state

```tsx
import { useState, useEffect } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Shared state across components (Framer Variables)

Use Framer's **Variables** panel for simple cross-component state (cart count, modal open, selected tab). Access in code:

```tsx
// Reading a Framer Variable
import { useVariableValue } from "framer"
const isMenuOpen = useVariableValue("isMenuOpen")

// Writing a Framer Variable
import { setVariable } from "framer"
setVariable("isMenuOpen", true)
```

### Complex state (React context in Code Component)

```tsx
import { createContext, useContext, useState } from "react"

const CartContext = createContext({ items: [], addItem: (_: any) => {} })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState([])
  return (
    <CartContext.Provider value={{ items, addItem: (item) => setItems(i => [...i, item]) }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

Wrap the page root component with `CartProvider` as a Code Component in Framer.

---

## ROUTING

### Framer-native routing (page links)

Use Framer's built-in **Link** component for all internal page navigation. Avoid custom routers unless building an SPA.

### Programmatic navigation

```tsx
import { useRouter } from "framer"

export function withNavigation(Component: ComponentType): ComponentType {
  return function (props) {
    const router = useRouter()
    return (
      <Component
        {...props}
        onClick={() => router.navigate("/contact")}
      />
    )
  }
}
```

### URL parameters

```tsx
import { useQueryParams } from "framer"

export default function SearchResults() {
  const [params] = useQueryParams()
  const query = params.get("q") ?? ""
  return <div>Results for: {query}</div>
}
```

### Canvas detection (disable animations in Framer editor)

```tsx
import { RenderTarget } from "framer"

export default function AnimatedHero() {
  const isCanvas = RenderTarget.current() === RenderTarget.canvas

  return (
    <motion.div
      animate={isCanvas ? {} : { opacity: [0, 1] }}
      transition={{ duration: 1 }}
    >
      Hero content
    </motion.div>
  )
}
```

**Always wrap autoplay video, heavy animations, and data fetches in canvas detection.**

---

## SA VIDEO HERO COMPONENT

Standard hero background for every SA client site. Takes the Phase 3.5 MP4.

```tsx
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useRef, useEffect } from "react"

interface Props {
  videoSrc: string
  posterSrc: string
  overlayOpacity: number
  overlayColor: string
  children?: React.ReactNode
}

export default function VideoHero({ videoSrc, posterSrc, overlayOpacity, overlayColor, children }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isCanvas = RenderTarget.current() === RenderTarget.canvas

  useEffect(() => {
    if (!isCanvas && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isCanvas])

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {!isCanvas && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {isCanvas && posterSrc && (
        <img
          src={posterSrc}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlayColor,
          opacity: overlayOpacity,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  )
}

VideoHero.defaultProps = {
  videoSrc: "",
  posterSrc: "",
  overlayOpacity: 0.4,
  overlayColor: "#000000",
}

addPropertyControls(VideoHero, {
  videoSrc: { type: ControlType.String, title: "Video URL" },
  posterSrc: { type: ControlType.Image, title: "Poster Frame" },
  overlayOpacity: { type: ControlType.Number, title: "Overlay Opacity", min: 0, max: 1, step: 0.05, defaultValue: 0.4 },
  overlayColor: { type: ControlType.Color, title: "Overlay Color", defaultValue: "#000000" },
})
```

**Performance note**: Video must be H.264, `+faststart` flag, ≤10MB for LCP compliance.

---

## SA VOICE AGENT WIDGET

Floating voice agent button — powered by Google AI Studio / Gemini 3.1 Flash + TTS.
Appears on every SA client site, bottom-right corner.

```tsx
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RenderTarget } from "framer"

interface Props {
  agentEndpoint: string
  businessName: string
  accentColor: string
  agentName: string
}

export default function VoiceAgentWidget({ agentEndpoint, businessName, accentColor, agentName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const isCanvas = RenderTarget.current() === RenderTarget.canvas

  const toggleAgent = () => {
    if (isCanvas) return
    setIsOpen(o => !o)
  }

  if (isCanvas) {
    return (
      <div style={{
        position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
        borderRadius: "50%", background: accentColor, display: "flex",
        alignItems: "center", justifyContent: "center", cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}>
        <span style={{ fontSize: 24 }}>🎙️</span>
      </div>
    )
  }

  return (
    <>
      <motion.button
        onClick={toggleAgent}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: "50%", background: accentColor, border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)", zIndex: 9999,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Talk to ${agentName}`}
      >
        <span style={{ fontSize: 24 }}>{isOpen ? "✕" : "🎙️"}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed", bottom: 96, right: 24, width: 320,
              background: "#fff", borderRadius: 16, padding: 24,
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)", zIndex: 9998,
            }}
          >
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>
              {agentName} — {businessName}
            </p>
            <p style={{ margin: "8px 0 16px", fontSize: 14, color: "#666" }}>
              How can I help you today?
            </p>
            {transcript && <p style={{ fontSize: 13, color: "#333", background: "#f5f5f5", padding: 10, borderRadius: 8 }}>{transcript}</p>}
            {response && <p style={{ fontSize: 13, color: accentColor, marginTop: 8 }}>{response}</p>}
            <button
              onClick={() => setIsListening(l => !l)}
              style={{
                marginTop: 16, width: "100%", padding: "12px 0", borderRadius: 10,
                background: isListening ? "#ef4444" : accentColor, color: "#fff",
                border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer",
              }}
            >
              {isListening ? "Stop" : "Start talking"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

VoiceAgentWidget.defaultProps = {
  agentEndpoint: "",
  businessName: "Our Business",
  accentColor: "#FF5C00",
  agentName: "Alex",
}

addPropertyControls(VoiceAgentWidget, {
  agentEndpoint: { type: ControlType.String, title: "Agent Endpoint URL" },
  businessName: { type: ControlType.String, title: "Business Name" },
  accentColor: { type: ControlType.Color, title: "Accent Color" },
  agentName: { type: ControlType.String, title: "Agent Name" },
})
```

**Wire-up note**: `agentEndpoint` points to the Google AI Studio proxy endpoint deployed in Phase 5. The endpoint accepts `{ message: string }` POST requests and streams back Gemini 3.1 Flash TTS audio.

---

## AI + SEO INJECTION PATTERNS

### Schema.org JSON-LD (inject into page head)

Framer allows custom `<head>` injection via **Project Settings → Custom Code → Head tag**.

```html
<!-- LocalBusiness schema — auto-generated from Phase 4.5 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{{BUSINESS_NAME}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{ADDRESS}}",
    "addressLocality": "{{CITY}}",
    "addressRegion": "{{STATE}}",
    "postalCode": "{{ZIP}}"
  },
  "telephone": "{{PHONE}}",
  "url": "{{SITE_URL}}",
  "image": "{{OG_IMAGE_URL}}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{GOOGLE_RATING}}",
    "reviewCount": "{{REVIEW_COUNT}}"
  },
  "openingHours": "{{HOURS}}"
}
</script>

<!-- FAQ schema — minimum 5 pairs from Phase 4.5 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{FAQ_Q1}}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_A1}}" }
    }
  ]
}
</script>
```

### Open Graph meta

```html
<meta property="og:title" content="{{PAGE_TITLE}}" />
<meta property="og:description" content="{{META_DESC}}" />
<meta property="og:image" content="{{OG_IMAGE_URL}}" />
<meta property="og:url" content="{{CANONICAL_URL}}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

### llms.txt (in Project Settings → Custom Routes or served as a static file)

```
# {{BUSINESS_NAME}}
> {{ONE_LINE_DESCRIPTION}}

## About
{{BUSINESS_DESCRIPTION}}

## Services
{{SERVICE_LIST}}

## Location
{{ADDRESS}}

## Contact
Phone: {{PHONE}}
Email: {{EMAIL}}
```

### llms-full.txt
Extended version with full FAQ content, full service descriptions, team bios, and pricing tiers. Same location as llms.txt.

---

## CINEMATIC ANIMATION PATTERNS

### SA signature entrance (hero text)

```tsx
const heroVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

// Usage
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.h1 variants={heroVariants}>Headline</motion.h1>
  <motion.p variants={heroVariants}>Subhead</motion.p>
  <motion.div variants={heroVariants}><CTAButton /></motion.div>
</motion.div>
```

### Scroll-triggered section reveals

```tsx
const sectionReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

<motion.section
  variants={sectionReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
>
```

### Parallax background

```tsx
import { useScroll, useTransform } from "framer-motion"

export default function ParallaxImage({ src }: { src: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -80])

  return (
    <div style={{ overflow: "hidden", height: 500 }}>
      <motion.img
        src={src}
        style={{ y, width: "100%", height: "130%", objectFit: "cover" }}
      />
    </div>
  )
}
```

### Magnetic button (premium interaction)

```tsx
import { useState } from "react"
import { motion } from "framer-motion"

export default function MagneticButton({ label }: { label: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.3, y: y * 0.3 })
  }

  return (
    <motion.button
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ padding: "14px 32px", borderRadius: 100, cursor: "pointer" }}
    >
      {label}
    </motion.button>
  )
}
```

### Cursor trailer (cinematic sites)

```tsx
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CursorTrailer() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <motion.div
      animate={{ x: pos.x - 16, y: pos.y - 16 }}
      transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.5 }}
      style={{
        position: "fixed", top: 0, left: 0, width: 32, height: 32,
        borderRadius: "50%", border: "2px solid var(--accent)", pointerEvents: "none",
        zIndex: 99999, mixBlendMode: "difference",
      }}
    />
  )
}
```

---

## GESTURE HANDLING

### Drag to dismiss (mobile-first)

```tsx
import { motion, useAnimation } from "framer-motion"

export default function DismissableCard() {
  const controls = useAnimation()

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      controls.start({ x: info.offset.x > 0 ? 400 : -400, opacity: 0 })
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -50, right: 50 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ cursor: "grab", padding: 20, background: "#fff", borderRadius: 12 }}
    >
      Swipe to dismiss
    </motion.div>
  )
}
```

### Pinch-to-zoom (image galleries)

```tsx
import { useMotionValue, useTransform } from "framer-motion"

// Use with react-use-gesture or @use-gesture/react for pinch detection
// Attach to image container with touch-action: none
```

---

## PERFORMANCE — CORE WEB VITALS

### LCP (Largest Contentful Paint) — target < 2.5s

```tsx
// Hero image: always preload
// In Framer head custom code:
// <link rel="preload" as="image" href="/hero-poster.jpg" />

// Video: poster frame shows instantly, video loads async
// Phase 3.5 requirement: H.264, faststart, ≤10MB

// Code splitting: lazy-load below-fold components
import { lazy, Suspense } from "react"
const BelowFold = lazy(() => import("./BelowFold"))

export default function Page() {
  return (
    <>
      <HeroSection /> {/* Loads immediately */}
      <Suspense fallback={<div style={{ height: 400 }} />}>
        <BelowFold />
      </Suspense>
    </>
  )
}
```

### CLS (Cumulative Layout Shift) — target < 0.1

```tsx
// Always set explicit aspect ratios on images and videos
<div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
  <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
</div>

// Reserve space for dynamic content
<div style={{ minHeight: 64 }}>
  {isLoaded ? <Content /> : null}
</div>
```

### INP (Interaction to Next Paint) — target < 200ms

```tsx
// Debounce expensive handlers
import { useCallback, useRef } from "react"

function useDebounced<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

// Avoid layout thrash in animations — use transform and opacity only
// ❌ Avoid: width, height, top, left (triggers layout)
// ✅ Use: transform: translate, scale, rotate + opacity
```

---

## MOBILE-FIRST RULES

**All SA sites are coded mobile-first. Desktop is the enhancement.**

```tsx
// Touch targets: minimum 44×44px (Apple HIG / WCAG 2.5.5)
const touchTarget = {
  minWidth: 44,
  minHeight: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

// Tap feedback (instant visual response, no hover states needed)
<motion.button
  style={touchTarget}
  whileTap={{ scale: 0.96, opacity: 0.8 }}
  transition={{ duration: 0.1 }}
>

// Font sizes: minimum 16px body (prevents iOS zoom on focus)
const typography = {
  body: { fontSize: 16, lineHeight: 1.6 },
  caption: { fontSize: 14 },      // Never below 14px
  button: { fontSize: 15, fontWeight: 600 },
}

// Safe area insets (for iPhone notch / Dynamic Island)
const safeArea = {
  paddingBottom: "env(safe-area-inset-bottom)",
  paddingTop: "env(safe-area-inset-top)",
}
```

---

## DATA FETCHING

### REST API in component

```tsx
import { useState, useEffect } from "react"

export default function LiveData({ apiUrl }: { apiUrl: string }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiUrl) return
    fetch(apiUrl)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [apiUrl])

  if (loading) return <div>Loading…</div>
  if (error) return <div>Error: {error}</div>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

### Supabase integration (Phase 6 — CRM/Forms)

```tsx
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Form submission → Supabase table
async function submitLead(formData: { name: string; email: string; phone: string }) {
  const { error } = await supabase.from("leads").insert([formData])
  if (error) throw error
}
```

In Framer: add Supabase credentials via **Project Settings → Environment Variables**.

---

## ERROR BOUNDARIES

```tsx
import { Component, ReactNode } from "react"

interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, State> {
  state: State = { hasError: false, message: "" }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: 20, color: "red" }}>
          Component error: {this.state.message}
        </div>
      )
    }
    return this.props.children
  }
}

// Wrap any unstable or data-dependent component
<ErrorBoundary fallback={<div>Failed to load section</div>}>
  <DynamicSection />
</ErrorBoundary>
```

---

## LOCALIZATION

```tsx
import { useLocaleInfo, useLocaleCode, RenderTarget } from "framer"

export default function LocalizedGreeting() {
  const locale = useLocaleCode()
  const { isDefault } = useLocaleInfo()

  const greetings: Record<string, string> = {
    "en-US": "Welcome",
    "es-MX": "Bienvenido",
    "fr-FR": "Bienvenue",
  }

  return <h2>{greetings[locale] ?? greetings["en-US"]}</h2>
}
```

Set up locales in **Framer → Site Settings → Localization** before writing locale-aware components.

---

## FRAMER + GSAP (for complex timeline animations)

```tsx
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { RenderTarget } from "framer"

gsap.registerPlugin(ScrollTrigger)

export default function GSAPSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isCanvas = RenderTarget.current() === RenderTarget.canvas

  useEffect(() => {
    if (isCanvas || !ref.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    tl.from(ref.current.querySelectorAll(".animate"), {
      y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
    })

    return () => tl.kill()
  }, [isCanvas])

  return (
    <div ref={ref}>
      <h2 className="animate">Headline</h2>
      <p className="animate">Body text</p>
    </div>
  )
}
```

Install via: `npm install gsap` in Framer's package manager (Project Settings → Packages).

---

## TESTING CHECKLIST

Before handing off any Framer build, verify all:

**Functional**
- [ ] All links navigate correctly (no broken routes)
- [ ] Form submissions reach the endpoint (Supabase / webhook)
- [ ] Voice agent widget opens and closes
- [ ] Video autoplay works on mobile (muted, playsInline)
- [ ] Video falls back to poster on low-bandwidth

**Visual**
- [ ] Mobile (375px) — no horizontal scroll, no overflow
- [ ] Tablet (768px) — layout adapts cleanly
- [ ] Desktop (1440px) — generous whitespace, SA aesthetic
- [ ] Dark mode (if implemented) — no invisible text

**Performance (run in Chrome DevTools → Lighthouse)**
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Total page weight < 2MB (without video)
- [ ] Video H.264, faststart, ≤10MB

**SEO**
- [ ] Schema.org JSON-LD present in head
- [ ] Open Graph meta populated
- [ ] Title + meta description unique per page
- [ ] Alt text on all images (including character reference images)
- [ ] llms.txt accessible at /llms.txt
- [ ] sitemap.xml accessible at /sitemap.xml
- [ ] FAQ section visible on page (minimum 5 pairs)
- [ ] NAP (Name, Address, Phone) consistent with schema

**Accessibility**
- [ ] All touch targets ≥ 44×44px
- [ ] Color contrast ratio ≥ 4.5:1 (body text)
- [ ] Font size ≥ 16px on all body text
- [ ] Focus states visible
- [ ] Voice agent button has aria-label

**SA Brand**
- [ ] Voice agent widget present, bottom-right
- [ ] Brand colors match Phase 1 brief
- [ ] Typography matches brand kit
- [ ] Video hero present on landing page

---

## DEPLOYMENT

### Framer → Vercel (standard SA deploy)

1. **Connect domain** in Framer Site Settings → Custom Domain
2. **Set env vars** in Framer Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `VOICE_AGENT_ENDPOINT`
3. **Publish** — Framer deploys to Vercel automatically
4. Demo URL format: `[business-name-slug]-[city]-demo.vercel.app`

### Custom domain handoff to client

Once client approves demo:
1. Register domain or point existing domain DNS to Framer's Vercel
2. SSL auto-provisions via Let's Encrypt
3. Update all schema.org `url` fields with production domain
4. Re-submit sitemap.xml to Google Search Console

---

## NEVER DO

- Never hardcode pixel dimensions for mobile-facing components — use `%`, `vw`, `vh`, or auto
- Never autoplay video with sound — always `muted` + `playsInline`
- Never skip canvas detection on heavy animations — editor will lag
- Never put actual API keys in component code — use env vars
- Never use `position: fixed` inside a Framer scroll container — breaks on iOS
- Never deploy without running the full testing checklist
- Never skip Phase 4.5 AI+SEO injection — it must be in every site
- Never forget the voice agent widget — it is standard on every SA site
- Never use font sizes below 16px on body text (iOS auto-zoom)
- Never use hover-only interactions for primary CTAs — tap must work identically
