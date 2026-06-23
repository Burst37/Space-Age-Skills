---
name: 3d-animation-creator
description: >
  Takes a video file (e.g. a product deconstruction/assembly animation, before/after transformation)
  and builds a production-quality website with scroll-driven animation. The video plays forward and
  backward as the user scrolls, creating a mesmerizing Apple-style scroll-stopping effect. Uses
  frame extraction via FFmpeg, canvas-based rendering, and modern scroll-driven techniques. Includes:
  animated starscape background, annotation cards with snap-stop scroll, specs section with count-up
  animations, navbar with scroll-to-pill transform, loader, and full mobile responsiveness. Trigger
  when the user says "3D animation", "scroll-stop build", "scroll animation website", "scroll-driven
  video", "build the scroll-stop site", or provides a video file and asks to make it scroll-controlled.
  Also trigger for "Apple-style scroll animation" or "video on scroll".
---

# 3D Animation Creator — Scroll-Driven Video Websites

You take a video file and build a production-quality website where the video playback is
controlled by scroll position — creating a dramatic, Apple-style scroll-stopping effect.

The user gives you a video. You handle everything: frame extraction, website build, content
population, and serving it locally for preview.

---

## Step 0: The Interview (MANDATORY)

Before touching any code or extracting any frames, ask the user these questions.
Do not skip this step — the whole site is built from these answers.

### Required Questions

1. Brand name — "What's the brand or product name for this site?"
2. Logo — "Do you have a logo file I can use? (SVG or PNG preferred)"
3. Accent color — "What's your primary accent color? (hex code, or describe it)"
4. Background color — "What background color? (dark backgrounds work best)"
5. Overall vibe — "What feel are you going for? (premium tech, luxury, playful, minimal, bold)"

### Content Sourcing

- Option A: From an existing website — share the URL, pull real content via WebFetch
- Option B: Paste it in — product descriptions, feature lists, specs, testimonials

### Optional Sections (only include if explicitly opted in)

- Testimonials
- Confetti burst effect
- Card Scanner (Three.js 3D particle showcase)

---

## Prerequisites

- FFmpeg must be installed (brew install ffmpeg)
- User provides a video file (MP4, MOV, WebM, etc.)
- Video should be 3-10 seconds ideal
- FIRST FRAME MUST BE ON WHITE BACKGROUND — if not, ask for re-export

---

## Design System

- Fonts: Space Grotesk (headings), Archivo (body), JetBrains Mono (code/mono)
- Accent color: From user — buttons, glows, progress bars, highlights
- Background: From user — body, sections
- Cards: Glass-morphism — backdrop-filter: blur(20px), border-radius: 20px
- Buttons: Primary = accent bg + glow; Secondary = transparent + border
- Effects: Floating background orbs, subtle grid overlay, animated starscape

---

## The Build Process

### Step 1: Analyze the Video

```bash
ffprobe -v quiet -print_format json -show_streams -show_format "{VIDEO_PATH}"
```

Extract duration, fps, resolution, total frame count. Target 60-150 frames total.

### Step 2: Extract Frames

```bash
mkdir -p "{OUTPUT_DIR}/frames"
ffmpeg -i "{VIDEO_PATH}" -vf "fps={TARGET_FPS},scale=1920:-2" -q:v 2 "{OUTPUT_DIR}/frames/frame_%04d.jpg"
```

Use -q:v 2 for high quality JPEG. JPEG not PNG for smaller files.

### Step 3: Build the Website

Single HTML file. Sections top to bottom:
1. Starscape — Fixed canvas, ~180 twinkling animated stars
2. Loader — Full-screen, brand logo, accent-colored progress bar
3. Scroll Progress Bar — Fixed top, accent gradient, 3px tall
4. Navbar — Transforms from full-width to centered pill on scroll
5. Hero — Title, subtitle, CTA buttons, scroll hint, background orbs + grid
6. Scroll Animation — Sticky canvas with frame sequence, annotation cards with snap-stop
7. Specs — Four stat numbers with count-up animation on scroll
8. Features — Glass-morphism cards in a grid
9. CTA — Call to action section
10. Testimonials — (if opted in) Horizontal drag-to-scroll cards
11. Card Scanner — (if opted in) Three.js particle showcase
12. Footer — Brand name and links

### Step 4: Key Implementation Patterns

Canvas rendering with Retina support:
```javascript
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
```

Cover-fit drawing (desktop) — zoomed contain-fit (mobile):
On desktop, cover-fit so the frame fills edge-to-edge.
On mobile, slightly zoomed contain-fit so object stays centered and visible.

Annotation cards with snap-stop scroll:
Cards appear at specific scroll progress points. Scroll FREEZES briefly at each card.
Uses JS-based snap: detects snap zone entry, scrolls to exact position, locks body overflow
for ~600ms, then releases. Creates "boom, boom, boom" effect.

Navbar scroll-to-pill transform:
Starts full-width, shrinks to centered pill (max-width ~820px) with rounded corners +
glass-morphism background on scroll.

Count-up animation:
Numbers animate from 0 to target with easeOutExpo easing, staggered 200ms apart.
Accent-color glow pulse while counting. Triggered by IntersectionObserver.

Animated starscape:
~180 stars with random drift speed, twinkle speed/phase, and opacity. Subtle living background.

### Step 5: Content Population

All content from interview. Never use Lorem ipsum. If content came from URL, use actual text.
Populate: hero title/subtitle, annotation card labels/descriptions/stats, spec numbers/labels,
feature cards, CTA text, testimonials (if included).

### Step 6: Serve & Test

```bash
cd "{OUTPUT_DIR}" && python3 -m http.server 8080
```

---

## Mobile Responsiveness

- Annotation cards: Compact single-line, hide paragraph/stat/label, show card# + title only, position at bottom: 1.5vh
- Scroll animation height: 350vh desktop, 300vh tablet, 250vh phone
- Navbar: Hide links, show only logo + pill
- Feature cards: Stack to single column
- Specs: 2x2 grid

---

## Best Practices

1. requestAnimationFrame for drawing — never draw in scroll handler
2. { passive: true } on scroll listener
3. Canvas with devicePixelRatio — Retina crisp
4. Preload all frames before showing — no pop-in
5. Frame deduplication — only drawFrame when index changes
6. No scroll-behavior: smooth — interferes with frame-accurate mapping
7. No heavy JS libraries — pure vanilla except Three.js for card scanner
8. Sticky canvas — position: sticky keeps canvas viewport-fixed
9. White first frame — is mandatory

---

## Error Recovery

| Issue | Solution |
|---|---|
| FFmpeg not installed | brew install ffmpeg |
| Frames don't load | Check paths, ensure local server running (no file://) |
| Animation choppy | Reduce frame count, use JPEG, check <100KB each |
| Canvas blurry | Ensure devicePixelRatio scaling applied |
| Scroll too fast/slow | Adjust .scroll-animation height (200vh=fast, 800vh=cinematic) |
| Mobile cards overlap | Compact single-line, bottom: 1.5vh |
| Snap-stop jarring | Reduce HOLD_DURATION to 400ms or increase SNAP_ZONE |
| First frame not white | Ask user to re-export |
| Video too long | Trim to 3-6 seconds |
