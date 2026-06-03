---
name: triggerjs-core
description: Trigger.js skill — CSS-variable-driven scroll animations with zero JavaScript. Bind scroll progress to CSS custom properties via HTML attributes (tg-name, tg-from, tg-to, tg-steps, tg-map, tg-filter, tg-bezier). Use when scroll-driven animation should be expressed entirely in HTML/CSS without writing animation code. Ideal for parallax, color transitions, counter reveals, and layout morphing driven by scroll.
license: MIT
---

# Trigger.js Core

## When to Use This Skill

Apply when the user wants scroll-driven CSS animations **without writing JavaScript animation code**. Trigger.js maps scroll position to a CSS custom property — all animation logic lives in CSS using that variable. Use GSAP ScrollTrigger when complex timelines, callbacks, or JavaScript-driven branching is needed.

## How It Works

1. Add `tg-name="varName"` to an element. Trigger.js creates `--varName` on that element.
2. The variable's value transitions from `tg-from` to `tg-to` as the element scrolls through the viewport.
3. CSS reads `var(--varName)` and applies it (e.g. `transform: translateX(calc(var(--scrolled) * 1px))`).

## Installation

```html
<!-- CDN (defer required) -->
<script src="//unpkg.com/@triggerjs/trigger" defer></script>
```

```bash
npm install @triggerjs/trigger
```

## Core Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `tg-name` | **Yes** | — | CSS variable name (with or without `--` prefix) |
| `tg-from` | No | `0` | Starting value |
| `tg-to` | No | `1` | Ending value |
| `tg-steps` | No | `100` | Number of steps from `from` to `to` |
| `tg-step` | No | `0` | Exact increment per step; overrides `tg-steps` if non-zero |
| `tg-edge` | No | `cover` | `cover` = off-screen to off-screen; `inset` = in-view top-to-bottom |
| `tg-map` | No | — | Map numeric values to arbitrary values (colors, keywords, etc.) |
| `tg-filter` | No | — | Only fire for specific values; append `!` for exact mode |
| `tg-bezier` | No | — | Easing: `ease`, `easeIn`, `easeOut`, `easeInOut`, or `p1x,p1y,p2x,p2y` |
| `tg-follow` | No | — | Copy scroll progress from another element (referenced by `tg-ref`) |
| `tg-ref` | No | — | Named reference for other elements' `tg-follow` |

## Minimal Example

```html
<script src="//unpkg.com/@triggerjs/trigger" defer></script>

<style>
  body { padding: 100vh 0; }
  #box {
    width: 100px; height: 100px; background: coral;
    transform: translateX(calc(var(--moved) * 1px));
  }
</style>

<div id="box" tg-name="moved" tg-from="-300" tg-to="300">Scroll me</div>
```

## Common Patterns

### Parallax background

```html
<section id="hero" tg-name="py" tg-from="0" tg-to="-60" tg-edge="cover">
  <div class="bg"></div>
</section>

<style>
  #hero .bg {
    transform: translateY(calc(var(--py) * 1px));
    will-change: transform;
  }
</style>
```

### Fade element in as it enters viewport

```html
<article id="intro" tg-name="fade" tg-from="0" tg-to="1" tg-edge="inset">
</article>

<style>
  #intro { opacity: var(--fade); }
</style>
```

### Color transition on scroll

```html
<h1
  id="title"
  tg-name="hue"
  tg-from="0"
  tg-to="360"
  tg-steps="360"
>Color Shift</h1>

<style>
  #title { color: hsl(var(--hue), 70%, 50%); }
</style>
```

### Value mapping — text/color change at specific thresholds

```html
<p
  id="mood"
  tg-name="bg"
  tg-from="1"
  tg-to="5"
  tg-steps="4"
  tg-map="1:#fde68a; 2:#86efac; 3:#93c5fd; 4:#c4b5fd; 5:#f9a8d4"
>Watch the background shift</p>

<style>
  body { padding: 150vh 0; }
  #mood { background-color: var(--bg); padding: 2rem; }
</style>
```

### Rotate on scroll with easing

```html
<div id="spinner" tg-name="rot" tg-from="0" tg-to="360" tg-steps="360" tg-bezier="easeInOut"></div>

<style>
  #spinner { transform: rotate(calc(var(--rot) * 1deg)); }
</style>
```

### Counter — only fire at specific values

```html
<div
  id="counter"
  tg-name="count"
  tg-from="0"
  tg-to="100"
  tg-step="1"
  tg-filter="25,50,75,100"
  tg-map="25: Quarter; 50: Halfway; 75: Almost; 100: Done!"
></div>

<style>
  #counter::before { content: var(--count); }
</style>
```

### Scroll to hide/show navbar

```html
<nav id="nav" tg-name="nav-vis" tg-from="0" tg-to="1" tg-steps="1" tg-filter="1!" tg-map="1: visible">
</nav>
<style>
  #nav { visibility: var(--nav-vis, hidden); }
</style>
```

## tg-follow: Sharing Scroll State

Multiple elements can follow the same scroll calculation:

```html
<!-- Source element defines the scroll position -->
<div id="leader" tg-name="progress" tg-from="0" tg-to="100" tg-ref="main-prog"></div>

<!-- Followers reuse the same value without recalculating -->
<div class="progress-bar" tg-name="bar-w" tg-follow="main-prog"></div>
<div class="progress-text" tg-name="label" tg-follow="main-prog"></div>

<style>
  .progress-bar { width: calc(var(--bar-w) * 1%); }
  .progress-text::after { content: counter(var(--label)); }
</style>
```

## JavaScript Event Listener

Listen for value changes with the `tg` event:

```javascript
document.querySelector('#box').addEventListener('tg', (e) => {
  console.log(e.detail.value); // current computed value
});
```

## Custom Prefix (HTML5-valid)

Replace `tg-` with `data-tg-` for strict HTML5 compliance:

```html
<body data-trigger-prefix="data-tg">
  <div data-tg-name="scrolled" data-tg-from="0" data-tg-to="100">...</div>
</body>
```

## tg-edge: cover vs inset

- **cover** (default): animation starts when the element's **bottom edge** enters the viewport bottom; ends when the element's **top edge** exits the viewport top. Best for parallax and elements taller or shorter than the viewport.
- **inset**: animation starts when the element's **top edge** reaches the viewport top; ends when the element's **bottom edge** reaches the viewport bottom. The element **must be taller than the viewport** for this to make sense.

## Best Practices

- ✅ Always set `padding: 100vh 0` (or similar) on `body` so there is enough scroll room for the effect.
- ✅ Use `will-change: transform` on elements that animate `transform` for GPU compositing.
- ✅ Use `tg-edge="inset"` only on elements taller than the viewport.
- ✅ Use `tg-follow` when multiple elements share the same scroll progress — avoids duplicate scroll calculations.
- ✅ Combine with CSS `calc()` for unit conversion: `calc(var(--val) * 1px)`, `calc(var(--val) * 1deg)`.

## Do Not

- ❌ Animate layout properties (`width`, `height`, `top`, `left`) in the hot scroll path — use `transform` and `opacity` only.
- ❌ Use `tg-edge="inset"` on elements shorter than the viewport — the variable won't change.
- ❌ Set `tg-from` and `tg-to` to the same value — the variable will never change.
- ❌ Use Trigger.js for complex sequenced timelines; use GSAP for those cases.
