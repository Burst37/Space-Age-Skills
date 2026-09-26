# AI Font Packs — Space Age proprietary display type

Use when `handoff_package.design_system.display_font_type` is `ai-png-letters`, `ai-otf`, or `ai-svg`.
A pack is a **display asset, not a type system**: one moment per page, hero or wordmark, 1–4 words.
Everything else uses the locked web fonts.

## Decision

| Text | Use |
|---|---|
| Hero word/phrase, static | PNG letter row (best material fidelity) |
| Hero/section title that animates (line-reveal, scramble, typewriter) | OTF via `@font-face` — PNG rows can't be split or scrambled |
| Logo / wordmark | SVG letters |
| Subheads, body, nav, buttons, forms | **Never** a pack — web fonts |

## A. PNG letter row (accessible)

```html
<h1 class="ai-word">
  <span class="sr-only">Glow Up</span>
  <span class="ai-word__glyphs" aria-hidden="true">
    <img src="/assets/fonts/PackName/Uppercase/upper_G.png" alt="" width="120" height="160" fetchpriority="high"> …
  </span>
</h1>
```
```css
.ai-word__glyphs { display: inline-flex; align-items: flex-end; gap: clamp(2px, .6vw, 10px); }
.ai-word__glyphs img { height: clamp(48px, 10vw, 160px); width: auto; }
@media (prefers-reduced-motion: no-preference) { .cwb-js .ai-word__glyphs img { opacity: 0; transform: translateY(-30px) rotate(-5deg); } }
```
```js
CWB.define('ai-word', { init(el, api) {
  if (api.cond.reduce) return;
  gsap.to(el.querySelectorAll('img'), { opacity: 1, y: 0, rotation: 0, duration: .7, ease: 'back.out(1.7)', stagger: .06 });
}});
```
Fixes v2: per-letter `alt="A"` + `aria-label` double-announced the word; the hidden state lived
in plain CSS (invisible for reduced motion / no JS). Always set `width`/`height` on each glyph (no CLS)
and preload only the above-fold letters.

## B. OTF @font-face

```css
@font-face {
  font-family: "PackName"; src: url("/assets/fonts/PackName/PackName-Regular.woff2") format("woff2");
  font-display: swap; size-adjust: 100%; /* tune so the fallback's box matches → no CLS on swap */
}
.ai-headline { font-family: "PackName", var(--f-display); font-size: var(--t-hero); line-height: .9; }
```
Convert OTF → WOFF2 (`fonttools ttLib.woff2 compress PackName.otf`). The runtime already
refreshes ScrollTrigger after `document.fonts.ready`; module 31 re-splits automatically.

## C. SVG wordmark
Inline the SVG (one request fewer, stylable with `currentColor`) with `role="img"` and `aria-label="Brand"`.

## Folder
```
assets/fonts/PackName/{Uppercase,Lowercase,Numbers,SVG_Vectors}/ + PackName-Regular.woff2
```

## Companion web fonts (banned-list compliant)

| Pack style | Body + UI | Moodboard |
|---|---|---|
| Slime / foam / bubble | DM Sans, Nunito Sans | C, F |
| Holographic / iridescent | Space Grotesk, Plus Jakarta Sans | D, K |
| Fur / plush | Satoshi, Manrope | G, H |
| Dark bubble / oil slick | Space Grotesk, JetBrains Mono (labels) | A, K |
| Gummy / candy | Nunito Sans, Outfit | C |
| Chrome / metallic | Barlow Condensed, Rajdhani | B, N |

(v2 recommended Inter, Poppins and Lato here — all banned by `design-taste-frontend`.)
