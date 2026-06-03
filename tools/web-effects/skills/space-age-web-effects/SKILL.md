---
name: space-age-web-effects
description: Implementation playbook for advanced web animations in the Space Age Agent OS (Next.js 16, React 19, VL-01 Dark Glassmorphism). Covers when to use Framer Motion vs GSAP vs ScrollReveal vs Trigger.js, exact code patterns matching the project's inline-style/CSS-var system, and ready-to-use recipes for every page in the app. Use whenever building, enhancing, or reviewing animations in this project.
license: MIT
---

# Space Age Web Effects — Implementation Playbook

## Project Context

**Stack:** Next.js 16 · React 19 · TypeScript · Framer Motion (already installed)
**Design system:** VL-01 Dark Glassmorphism — `#03030a` base, `backdrop-filter: blur(48px) saturate(200%)`, inline styles only (no Tailwind, no CSS modules)
**Fonts:** Orbitron (headers) · Rajdhani (labels/caps) · DM Sans (body) · JetBrains Mono (data/code)
**Animation already in use:** Framer Motion `stagger` + `fadeUp` spring variants on agent grid and quick-access tiles

---

## Decision Tree — Which Tool for Which Job

```
New animation needed?
│
├── Already exists in Framer Motion and just needs tweaking → extend FM variants
│
├── Entrance animation (element fades/slides in on load or route change)
│   ├── React component → Framer Motion variants (use existing stagger/fadeUp)
│   └── Content-heavy page with many sections → ScrollReveal (sr.reveal)
│
├── Scroll-triggered (fires when element enters viewport)
│   ├── Simple one-shot (fade in card, slide in stat) → ScrollReveal
│   ├── Scrubbed to scroll position (progress bar, parallax) → GSAP ScrollTrigger
│   ├── CSS-only, no JS animation code → Trigger.js (tg-name attribute)
│   └── React component API → React Reveal <Fade>, <Slide>
│
├── Cinematic / multi-step sequence (hero text, page storytelling)
│   └── GSAP timeline + SplitText → gsap-supercharged skill
│
├── Layout transition (cards reorder, view switch, Kanban drag)
│   └── GSAP Flip → gsap-supercharged skill section 3
│
├── Interactive hover effect (magnetic button, scale on hover)
│   └── Framer Motion whileHover (already used) → or GSAP for magnetic
│
└── Route/page transition wipe
    └── GSAP timeline → gsap-supercharged skill section 7
```

---

## Core VL-01 Animation Constants

Always use these values — never invent new durations or easings:

```typescript
// Match globals.css :root definitions
const VL01 = {
  spring:  [0.34, 1.56, 0.64, 1] as const,   // --spring: overshoot
  expo:    [0.16, 1,    0.3,  1] as const,   // --expo: fast decel
  fast:    0.2,                               // --fast: 200ms
  base:    0.4,                               // --base-dur: 400ms

  // Glass card base style (copy this for any new card)
  glass: {
    background:       'rgba(255,255,255,0.035)',
    border:           '1px solid rgba(255,255,255,0.07)',
    borderTop:        '1px solid rgba(255,255,255,0.13)',
    backdropFilter:   'blur(48px) saturate(200%)',
    WebkitBackdropFilter: 'blur(48px) saturate(200%)',
    borderRadius:     14,
    boxShadow:        '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09)',
  },
} as const;
```

---

## Framer Motion Patterns (Extend, Don't Replace)

The project uses two shared variants. Reuse them everywhere:

```typescript
// Reuse across all components — defined once, imported or inlined
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
}

// Faster variant for dense grids (pipeline stats, model stack)
const fadeUpFast = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 28 } }
}

// Slower, heavier variant for hero sections
const fadeUpHero = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0, filter: 'blur(0px)',
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
}
```

### Standard glass card with hover

```tsx
<motion.div
  variants={fadeUp}
  whileHover={{ scale: 1.015, y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
  style={{ ...VL01.glass, padding: '16px 18px', cursor: 'pointer' }}
>
  {children}
</motion.div>
```

### Section reveal (route-level)

```tsx
// Wrap any page's main content div
<motion.div
  initial="hidden"
  animate="show"
  variants={stagger}
  style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
>
  <motion.div variants={fadeUpHero}>{/* hero title */}</motion.div>
  <motion.div variants={fadeUp}>{/* body content */}</motion.div>
</motion.div>
```

---

## Per-Page Animation Recipes

### `/` Mission Control — already done
Current state: Framer Motion stagger on agent grid ✅
Enhancement opportunities:
- Add `AnimatePresence` for agent status badge transitions
- Add scroll-linked counter for "AGENTS ONLINE" stat

### `/pipeline` — Pipeline Monitor

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Scroll-linked progress bar (Trigger.js — zero JS animation)
// In the JSX, load TriggerJS via script and use CSS var:
// <div tg-name="prog" tg-from="0" tg-to="100" style={{ display: 'none' }} />
// <div style={{ width: 'calc(var(--prog) * 1%)', height: 2, background: 'var(--orange)' }} />

// Live stat counter — ticks up when enters viewport
function StatCounter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const duration = 1800
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        el.textContent = Math.round(value * eased).toLocaleString()
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.disconnect()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div>
      <div ref={ref} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: 'var(--orange)' }}>0</div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}
```

### `/claude`, `/codex`, `/gemini` — Chat Pages

```tsx
// Animate each message as it arrives
const messageVariants = {
  hidden: { opacity: 0, x: -12, filter: 'blur(4px)' },
  show:   { opacity: 1, x: 0,   filter: 'blur(0px)',
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
}

// User messages slide from right
const userMessageVariants = {
  hidden: { opacity: 0, x: 12 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
}

// Typing indicator pulse
const typingDot = {
  animate: { opacity: [0.3, 1, 0.3], y: [0, -4, 0] },
  transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
}
```

### `/kanban` — Kanban Board

Use GSAP Flip for column-to-column card transitions:

```tsx
'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useRef } from 'react'
gsap.registerPlugin(Flip)

function KanbanBoard() {
  const containerRef = useRef<HTMLDivElement>(null)

  function moveCard(cardEl: HTMLElement, targetColumn: HTMLElement) {
    const state = Flip.getState(cardEl)
    targetColumn.appendChild(cardEl)
    Flip.from(state, {
      duration: 0.55,
      ease: 'power2.inOut',
      absolute: true,
    })
  }

  return <div ref={containerRef}>{/* columns */}</div>
}
```

### `/studio` + `/video` — Media Generation Pages

```tsx
// Image/video result reveal with blur-to-sharp
const mediaReveal = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(12px)' },
  show:   { opacity: 1, scale: 1,    filter: 'blur(0px)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

// Generation progress shimmer (CSS)
// Add to globals.css:
// @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
// .generating {
//   background: linear-gradient(90deg, var(--glass) 25%, rgba(255,107,0,0.08) 50%, var(--glass) 75%);
//   background-size: 200% 100%;
//   animation: shimmer 1.5s infinite linear;
// }
```

### `/terminal` — SSH Terminal

```tsx
// Lines animate in as terminal output arrives
const terminalLine = {
  hidden: { opacity: 0, x: -8 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.15, ease: 'easeOut' } }
}

// Cursor blink
const cursor = {
  animate: { opacity: [1, 0] },
  transition: { duration: 0.6, repeat: Infinity, ease: 'steps(1)' }
}
```

### `/memory` + `/journal` — Data Pages

ScrollReveal for long scrollable content:

```tsx
'use client'
import { useEffect } from 'react'

export function useScrollReveal(selector: string, options = {}) {
  useEffect(() => {
    let sr: any
    import('scrollreveal').then(({ default: ScrollReveal }) => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return
      sr = ScrollReveal()
      sr.reveal(selector, {
        origin: 'bottom',
        distance: '20px',
        duration: 500,
        interval: 60,
        opacity: 0,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // matches --expo
        ...options,
      })
    })
    return () => sr?.destroy()
  }, [selector])
}

// Usage in any page:
// useScrollReveal('.memory-entry')
// useScrollReveal('.journal-card', { interval: 80, distance: '14px' })
```

---

## LED / Status Indicator Animations

The `LED` component already pulses. Extension patterns:

```tsx
// Color-transitioning LED for status changes
function AnimatedLED({ status }: { status: string }) {
  const colors = { online: '#00e676', idle: '#5a618a', busy: '#ff6b00', error: '#ff1744' }
  const c = colors[status as keyof typeof colors] ?? colors.idle

  return (
    <motion.span
      animate={{
        backgroundColor: c,
        boxShadow: status === 'online' || status === 'busy'
          ? [`0 0 6px ${c}, 0 0 12px ${c}55`, `0 0 3px ${c}, 0 0 6px ${c}33`]
          : 'none',
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%' }}
    />
  )
}
```

---

## Page Transition System (Route Changes)

Add to `src/components/PageTransition.tsx`:

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  initial:  { opacity: 0, y: 12, filter: 'blur(6px)' },
  animate:  { opacity: 1, y: 0,  filter: 'blur(0px)',
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:     { opacity: 0, y: -8, filter: 'blur(4px)',
              transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={path} {...variants} style={{ height: '100%' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

Wrap in `src/app/layout.tsx`:
```tsx
<PageTransition>{children}</PageTransition>
```

---

## Orange Accent Glow on Interaction

For buttons and primary CTAs:

```tsx
<motion.button
  whileHover={{
    boxShadow: '0 0 32px rgba(255,107,0,0.35), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,107,0,0.4)',
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.97 }}
  style={{
    ...VL01.glass,
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '10px 20px',
    cursor: 'pointer',
  }}
>
  {children}
</motion.button>
```

---

## AnimatePresence for Show/Hide

For modals, dropdowns, alerts — always use AnimatePresence:

```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      exit={{    opacity: 0, scale: 0.94, y: 4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...VL01.glass, padding: 24, borderRadius: 16 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Accessibility

Every animation must respect reduced motion:

```tsx
import { useReducedMotion } from 'framer-motion'

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24 }}
    >
      {children}
    </motion.div>
  )
}
```

For GSAP, use `gsap.matchMedia()`:

```typescript
const mm = gsap.matchMedia()
mm.add({ reduceMotion: '(prefers-reduced-motion: reduce)' }, (ctx) => {
  const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
  gsap.to('.hero-text', { y: 0, opacity: 1, duration: reduceMotion ? 0 : 1 })
})
```

---

## Installing Additional Libraries

When GSAP or ScrollReveal is needed, install first:

```bash
npm install gsap @gsap/react       # for GSAP + React hook
npm install scrollreveal           # for ScrollReveal
npm install react-reveal           # for React Reveal components
```

Trigger.js — CDN only (no npm install needed, add script to layout.tsx):

```tsx
// src/app/layout.tsx
<Script src="https://unpkg.com/@triggerjs/trigger" strategy="lazyOnload" />
```

---

## Sub-Skills Reference

For deeper API detail, reference these skills:

| What you need | Skill to load |
|---|---|
| GSAP tween API, easing, stagger | `gsap-core` |
| Timeline sequencing | `gsap-timeline` |
| ScrollTrigger (scrub, pin, snap) | `gsap-scrolltrigger` |
| SplitText, Flip, MorphSVG, Physics2D | `gsap-plugins` + `gsap-supercharged` |
| React cleanup / useGSAP hook | `gsap-react` |
| ScrollReveal reveal() API | `scrollreveal-core` |
| ScrollReveal Next.js sequences | `scrollreveal-advanced` |
| Trigger.js CSS variable binding | `triggerjs-core` |
| WOW.js + Animate.css | `wow-core` |
| React Reveal components | `react-reveal-core` |

---

## Rules for This Project

- ✅ Always inline styles — never add CSS classes for animation state
- ✅ Use CSS custom properties from `globals.css` (`var(--orange)`, `var(--glass-border)`, etc.) inside inline style strings
- ✅ All animation components must have `'use client'` directive
- ✅ Always wrap Framer Motion animations with `useReducedMotion()` check
- ✅ New glass cards copy the exact `backdropFilter + border + boxShadow` pattern from `MissionControl.tsx`
- ✅ Agent-specific colors come from `--agent-{name}` CSS variables, not hardcoded hex
- ❌ Never animate `width`, `height`, `top`, `left` — use `transform` equivalents
- ❌ Never import all of GSAP if only ScrollTrigger is needed — tree-shake with named imports
- ❌ Never run ScrollReveal, WOW.js, or Trigger.js during SSR — guard with `useEffect` or `'use client'`
