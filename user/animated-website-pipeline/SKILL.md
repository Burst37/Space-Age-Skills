---
name: animated-website-pipeline
display_name: "SPACE AGE — Animated Website Pipeline (Claude Code + Higgsfield + Next.js)"
version: "2.0"
last_updated: "2026-04"
superpowers_version: "5.0.7"
description: >
  Full end-to-end pipeline for building cinematic animated marketing websites using
  Claude Code + Playwright browser automation + Higgsfield AI asset generation + Next.js.
  Generates ALL visual assets AND the animated website in a single automated workflow.
  TRIGGER: any mention of "animated website", "website with AI assets", "Next.js cinematic
  site", "scroll scrub animation", "product 360 hover", "build a full website with videos",
  or "Claude Code website pipeline". Prerequisite skills: asset-automation + playwright-
  browser-automation must be loaded alongside this one.
---

# ANIMATED WEBSITE PIPELINE
## Space Age AI Solutions — Full-Stack Cinematic Web Production
**Superpowers:** V5.0.7 | **Stack:** Next.js 14 + GSAP + Tailwind CSS + Higgsfield AI
**Brand tokens:** Orbitron/DM Sans · #FF6B00 · OLED black · 8pt grid · glassmorphism

---

## PIPELINE OVERVIEW

```
PHASE 0: PROJECT SETUP
  Client brief → CLAUDE.md → directory scaffold → asset spec

PHASE 1: ASSET AUTOMATION
  asset-automation skill → Higgsfield batch → download + rename + organize

PHASE 2: FRAME EXTRACTION
  FFmpeg → video → frames → public/assets/frames/

PHASE 3: WEBSITE GENERATION
  CLAUDE.md → Claude Code → Next.js 14 → GSAP animations

PHASE 4: QA + DELIVERY
  Playwright QA → multi-device → audit report → client handoff
```

Total human input required: project brief + Higgsfield login (once). Everything else is automated.

---

## PHASE 0 — PROJECT SETUP

### 1. Directory Structure
```
[project-name]/
├── CLAUDE.md                     ← master config (highest authority)
├── session-resume.md             ← batch state tracker
├── assets-to-generate.md        ← asset spec
├── asset-automation/
│   ├── CLAUDE.md
│   ├── images/
│   ├── videos/
│   └── reference/
├── public/
│   └── assets/
│       ├── images/
│       ├── videos/
│       └── frames/
├── src/
│   ├── app/                      ← Next.js App Router
│   ├── components/
│   │   ├── sections/             ← page sections (Hero, Product, Feature, etc.)
│   │   └── ui/                   ← reusable UI components
│   └── styles/
│       └── globals.css
├── qa/
│   └── screenshots/
└── package.json
```

### 2. Project CLAUDE.md Template
```markdown
# [Project Name] — CLAUDE.md
**Authority:** This file overrides all defaults. Read on every session start.

## Project Overview
[Brief description — what the brand is, who it's for, what the site must do]

## Tech Stack
Framework: Next.js 14 (App Router)
Styling: Tailwind CSS (Tailwind v3 — compatible with Next.js 14)
Animation: GSAP + ScrollTrigger (CDN or npm — use npm for Next.js)
3D (if needed): Spline (embed via @splinetool/react-spline)
Font: [Primary] via next/font
Icons: Lucide React

## Design System
Primary color: [hex]
Secondary color: [hex]
Accent: [hex]
Background: [hex] (OLED black preferred for cinematic aesthetic)
Body font: [font name]
Display font: [font name]
Border radius: 8px (8pt grid)
Spacing: 8pt grid throughout

## Sections (Build in this order)
1. Page loader — animated intro, hides on load complete
2. Hero — scroll scrub (frame sequence) + headline
3. Brand statement — single punchy copy block, fade-in
4. Product showcase — card grid, hover triggers 360 video
5. Feature section — sticky scroll, assets swap per panel
6. Use case / experience — full-width cinematic images
7. Technical specs — data grid or structured list
8. Social proof — auto-scroll testimonials
9. Newsletter signup + Footer

## Global Components
- Dark/light mode toggle (reverses entire site)
- Custom cursor (branded, changes on hover states)

## Asset Reference
Images: /public/assets/images/
Videos: /public/assets/videos/
Frames: /public/assets/frames/ (hero-frame-0001.jpg → hero-frame-XXXX.jpg)

## Animation Principles
- Scroll scrub: hero frames tied to scroll position via ScrollTrigger
- Hover 360: product cards play 360 video on mouseenter, pause on mouseleave
- Sticky panels: feature section — parent sticky, children swap on scroll
- Page transitions: framer-motion or GSAP for route changes
- Custom cursor: follows mouse with lag, scale on hover, color on link

## Rules
- No placeholder images — real Higgsfield assets only
- No Lorem ipsum — real copy or [PLACEHOLDER] clearly marked
- All animations must respect prefers-reduced-motion
- Mobile-first responsive — test iPhone 15, iPad Pro, Desktop 1440px
- Performance target: LCP under 2.5s (lazy-load videos, optimize frames)
```

---

## PHASE 1 — ASSET AUTOMATION

Refer to `asset-automation` skill in full. Quick reference:

### assets-to-generate.md — Minimum Asset Set for Full Marketing Site
```markdown
# [Project] Asset Generation Job

## hero-video-01
Type: video | Model: Seedance 2.0 | Ratio: 16:9
Output: /public/assets/videos/[project]-hero-ambient.mp4
Note: Cinematic slow push through [brand environment]. Used as scroll-scrub source.

## product-img-01 through product-img-04
Type: image | Model: NanoBanana 2 | Ratio: 1:1
Output: /public/assets/images/[project]-product-[angle].png
Note: Studio product photography. Four angles: front, side, top, 3/4.

## product-360-01 through product-360-04
Type: video | Model: Kling 3.0 | Ratio: 1:1
Output: /public/assets/videos/[project]-360-product-[n].mp4
Reference: corresponding product-img (for consistency)
Note: 360 orbit of product. 3-5 seconds. Loop-ready.

## feature-img-01 through feature-img-03
Type: image | Model: NanoBanana 2 | Ratio: 16:9
Output: /public/assets/images/[project]-feature-[descriptor].png
Note: In-use lifestyle shots per feature panel.

## background-img-01 through background-img-02
Type: image | Model: NanoBanana 2 | Ratio: 16:9
Output: /public/assets/images/[project]-bg-[descriptor].png
Note: Abstract atmospheric backgrounds for use-case section.
```

---

## PHASE 2 — FRAME EXTRACTION

**Required for scroll-scrub hero.** Run after hero video is downloaded.

```bash
# Extract 24fps frames from hero video
ffmpeg -i public/assets/videos/[project]-hero-ambient.mp4 \
  -vf "fps=24,scale=1920:1080" \
  -q:v 2 \
  public/assets/frames/hero-frame-%04d.jpg

# Result: hero-frame-0001.jpg through hero-frame-XXXX.jpg
# Typical: 72–120 frames for a 3–5 second video
```

**Why:** Video playback during scroll is janky across browsers. Frame sequence controlled by ScrollTrigger gives frame-perfect control tied to scroll position — the premium UX referenced in the pipeline video.

---

## PHASE 3 — WEBSITE GENERATION

### Initialize Project
```bash
npx create-next-app@latest [project-name] \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd [project-name]
npm install gsap @gsap/react framer-motion lucide-react
npm install @splinetool/react-spline  # if using Spline 3D
```

### Section Build Order + Module Assignments

| Order | Section | Key Animation | Assets |
|---|---|---|---|
| 1 | Page Loader | GSAP timeline → fade out on load | Brand logo / wordmark |
| 2 | Hero | Scroll scrub (frame sequence) + headline pin | hero-frame-####.jpg |
| 3 | Brand Statement | Staggered word reveal on scroll | — |
| 4 | Product Showcase | Card grid / hover → 360 video plays | product-img + 360 vids |
| 5 | Feature (Sticky) | Parent sticky / children swap per scroll segment | feature-img-01–03 |
| 6 | Use Case | Parallax full-width images + copy fade | background-img-01–02 |
| 7 | Technical Specs | Counter animation + data grid reveal | — |
| 8 | Social Proof | Auto-scroll horizontal marquee | — |
| 9 | CTA / Newsletter | Scale-in form + submit confirmation | — |
| 10 | Footer | — | Brand logo |

### Hero Scroll Scrub — Code Pattern
```tsx
// src/components/sections/HeroSection.tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 96  // match your extracted frame count

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const images: HTMLImageElement[] = []
    const obj = { frame: 0 }
    
    // Preload all frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/assets/frames/hero-frame-${String(i).padStart(4, '0')}.jpg`
      images.push(img)
    }
    
    // Render first frame immediately
    images[0].onload = () => ctx.drawImage(images[0], 0, 0)
    
    // ScrollTrigger drives frame selection
    gsap.to(obj, {
      frame: TOTAL_FRAMES - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',  // scroll distance controls playback speed
        scrub: 0.5,
        pin: true,
      },
      onUpdate: () => {
        const img = images[Math.round(obj.frame)]
        if (img?.complete) ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    })
    
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
  
  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '400vh' }}>
      <canvas ref={canvasRef} className="sticky top-0 w-full h-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h1 className="font-display text-6xl text-white">[HEADLINE]</h1>
      </div>
    </div>
  )
}
```

### Product 360 Hover — Code Pattern
```tsx
// src/components/sections/ProductShowcase.tsx
'use client'

interface ProductCardProps {
  image: string
  video: string
  title: string
}

function ProductCard({ image, video, title }: ProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  return (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden cursor-none"
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => { 
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
    >
      <img src={image} className="w-full h-full object-cover" alt={title} />
      <video
        ref={videoRef}
        src={video}
        className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity"
        muted loop playsInline
      />
    </div>
  )
}
```

### Custom Cursor — Code Pattern
```tsx
// src/components/ui/CustomCursor.tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return
    
    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 })
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.15 })
    }
    
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  
  return (
    <>
      <div ref={cursorRef} className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2" />
      <div ref={followerRef} className="fixed w-8 h-8 border border-orange-500/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2" />
    </>
  )
}
```

### Dark/Light Mode Toggle
```tsx
// src/components/ui/ThemeToggle.tsx
'use client'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  
  return (
    <button
      onClick={() => setDark(d => !d)}
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full glass text-sm font-mono"
    >
      {dark ? '◐ LIGHT' : '● DARK'}
    </button>
  )
}
```

---

## PHASE 4 — QA + DELIVERY

Run via `playwright-browser-automation` skill. Reference Template 3 (Pre-Delivery QA).

```
Devices: Desktop 1440px | iPad Pro 11" landscape | iPhone 15
Checks:
  ✅ Scroll scrub plays smoothly (no frame drops)
  ✅ Product 360 hover activates on every card
  ✅ Sticky feature section locks correctly
  ✅ Dark/light mode reverses full site
  ✅ Custom cursor visible on desktop, hidden on mobile
  ✅ Zero 404s on all assets (browser_network_requests)
  ✅ Zero JS console errors (browser_console)
  ✅ Page loads under 2.5s on Desktop (LCP)
  ✅ All fonts loaded (no FOUT)
  ✅ CTA form submits → confirmation shown

Output: ./qa/[project]-qa-report.md + screenshots grid
```

---

## SUPERPOWERS V5.0.7 — PIPELINE BEHAVIOR RULES

```
Phase 0: Effort HIGH — first-run setup, project brief interpretation
Phase 1: Effort LOW + /focus ON — repetitive batch generation
Phase 2: Effort LOW — scripted FFmpeg, no reasoning needed
Phase 3: Effort MEDIUM → HIGH for complex animations
Phase 4: Effort MEDIUM + /focus OFF — need to see QA results clearly
/go after each phase: verify outputs exist, screenshot confirmation, update session-resume.md
```

**Permission allowlist** — add to `.claude/settings.json`:
```json
{
  "allowedTools": [
    "Bash(npm *)", "Bash(npx *)", "Bash(ffmpeg *)",
    "Bash(node *)", "Write(*)", "Read(*)",
    "mcp__playwright__browser_*"
  ]
}
```

---

## DESIGN SYSTEM DEFAULTS (Space Age Brand)

```css
/* globals.css — Space Age tokens */
:root {
  --color-accent: #FF6B00;
  --color-bg: #000000;
  --color-surface: rgba(255, 255, 255, 0.04);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.6);
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --grid: 8px;
  --radius: 8px;
  --glass: backdrop-filter: blur(12px) saturate(180%);
}

.glass {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(12px) saturate(180%);
}
```

---

## NEVER DO

```
❌ Start Phase 3 (website build) before Phase 1 (assets) is complete
❌ Use placeholder or stock images in final deliverable
❌ Skip frame extraction for scroll-scrub hero — use frames not video
❌ Use video autoplay for hero (blocked by browsers) — use scroll-scrub instead
❌ Load all frames synchronously — always preload async
❌ Hard-code TOTAL_FRAMES — count actual extracted files
❌ Skip mobile QA — responsive is non-negotiable for client delivery
❌ Ignore prefers-reduced-motion — always add media query check
❌ Use Lorem ipsum in final build — mark placeholders as [PLACEHOLDER: description]
```
