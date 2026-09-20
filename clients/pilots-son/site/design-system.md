# DESIGN SYSTEM — THE PILOT'S SON
Objective rules. The System Critic checks these by looking. No interpretation.

## 1. Colour — 5 values total, no others
--void   #070707   page ground, 90%+ of pixels
--bone   #F2EDE4   primary text on void, warm not pure white
--steel  #8A8F98   secondary text ONLY (labels, meta, captions)
--flare  #FF4A16   THE accent. Afterburner orange.
--sky    #2B4A6F   deep instrument blue, structural only (rules, panels, glows)

RULES
- --flare appears AT MOST TWICE per viewport height. Never as a large fill.
- Never pure #000 and never pure #FFF anywhere.
- No gradient that uses more than two of the five values.
- No purple, no teal, no generic AI-gradient.

## 2. Type — 3 families, 4 sizes, no exceptions
Display : "Anton" / fallback Impact, Haettenschweiler, sans-serif — CONDENSED, ALL CAPS
Body    : "Inter Tight" / fallback system-ui
Mono    : "JetBrains Mono" / fallback ui-monospace — labels, specs, prices, counters ONLY

SCALE (only these four)
--t-mega  clamp(76px, 12.5vw, 260px)  display, tracking -0.045em, line-height 0.84
--t-lead  clamp(34px, 4.6vw,  76px)   display, tracking -0.03em,  line-height 0.94
--t-body  clamp(16px, 1.15vw, 20px)   body,    line-height 1.55, max 62ch
--t-micro 12px                        mono, UPPERCASE, tracking 0.22em

RULES
- Max 3 distinct type sizes rendered in any single viewport.
- Every section has exactly one --t-mega or --t-lead. Never two.
- Body copy never exceeds 62 characters per line.
- Prices, sizes, counts, coordinates: always mono.

## 3. Space
8px base. Only these: 8 / 16 / 24 / 40 / 64 / 104 / 168 / 272.
- Section vertical padding: 168px desktop, 104px mobile. Nothing less.
- Page gutter: clamp(24px, 5vw, 104px).
- Whitespace above the fold ≥ 35% of frame.

## 4. Motion
--ease-out   cubic-bezier(0.16, 1, 0.30, 1)
--ease-inout cubic-bezier(0.65, 0, 0.35, 1)
- Nothing animates faster than 420ms. Nothing slower than 1400ms.
- No linear easing, ever, except infinite marquees.
- Motion resolves in ONE direction per section — never pieces flying in from opposite sides.
- Stagger between sibling elements: 60-90ms. Never 0, never over 140ms.
- Lenis smooth scroll, lerp 0.085.
- @media (prefers-reduced-motion: reduce) → all transforms off, opacity only, 200ms.

## 5. Surface
- Border radius: 0 everywhere, EXCEPT pills/buttons which are 999px. No 8px/12px corners.
- Borders: 1px solid rgba(242,237,228,0.12) only. No other border.
- Box-shadow: forbidden. Depth comes from scale, blur, and whitespace.
- Images: no rounded corners, no drop shadow, full-bleed or gutter-aligned.

## 6. Layout
12-column grid, gutter 24px, aligned to the page gutter.
- Asymmetry required: no section may be a centered single column except the manifesto.
- Never three equal cards in a row.
- Every product image is portrait 4:5 or full-bleed. Never square.

## 7. Commerce (non-negotiable, this is a store)
Every product surface shows: name, price (mono), material spec, size selector, add-to-cart.
- One primary CTA per viewport. It is --flare or bone-filled, never ghost.
- Cart count is always visible in the nav.

## 8. Accessibility
- Body text contrast ≥ 7:1 against --void. --steel is for ≥16px non-essential text only.
- Every interactive element has a visible :focus-visible ring in --flare.
- Video hero: muted, playsinline, loop, poster fallback.
