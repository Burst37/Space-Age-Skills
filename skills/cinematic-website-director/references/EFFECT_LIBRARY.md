# Effect Library — Selection Index

The Space Age **`cinematic-website-builder`** skill carries 30 production-tested effect
modules with working GSAP/CSS/JS implementations. This director does **not** duplicate
that code — it selects from it.

**Workflow:** pick effects here → record them in `MOTION_MAP.md` with full schema →
load `cinematic-website-builder` for the implementation → build per module 05.

## Selection index

| # | Effect | Motion score | Best for | Cost | Mobile default |
|---|---|---|---|---|---|
| 01 | Text mask reveal | 1+ | any headline, editorial | low | keep |
| 02 | Sticky stack narrative | 3 | story, process, brand | high | simplify |
| 03 | Layered zoom parallax | 2 | hero depth, hospitality | med | simplify |
| 04 | Horizontal scroll hijack | 3 | portfolio, chapters, timeline | high | replace w/ swipe |
| 05 | Sticky card stack | 2 | features, services, steps | med | keep |
| 06 | Scroll SVG draw | 2 | process, data, technical | low | keep |
| 07 | Curtain reveal | 2 | section transitions | low | keep |
| 08 | Split screen scroll | 3 | product vs story, comparison | med | replace |
| 09 | Scroll color shift | 1 | chapter signaling, mood arc | low | keep |
| 10 | Cursor reactive | 2 | agency, portfolio | med | **remove** |
| 11 | Accordion slider | 2 | galleries, collections | med | replace |
| 12 | Cursor image reveal / before-after | 2 | trades, renovation, results | low | replace w/ slider |
| 13 | Hover image trail | 3 | fashion, agency, art | med | **remove** |
| 14 | 3D flip cards | 2 | team, pricing, specs | low | simplify |
| 15 | Magnetic repel grid | 3 | experimental, brand play | med | **remove** |
| 16 | Spotlight border cards | 1 | SaaS, technical, dark UI | low | remove |
| 17 | Drag-to-pan grid | 3 | portfolio, archive | high | keep (native) |
| 18 | View transition morphing | 2 | multi-page, gallery→detail | low | keep |
| 19 | Particle explosion button | 3 | playful consumer, events | med | simplify |
| 20 | Odometer counter | 1 | proof, stats, credibility | low | keep |
| 21 | 3D coverflow carousel | 3 | products, artists, releases | high | replace |
| 22 | Dynamic island nav | 2 | modern product, app-like | low | keep |
| 23 | macOS dock nav | 3 | portfolio, playful | med | remove |
| 24 | Text scramble decode | 2 | technical, futuristic, crypto | low | keep |
| 25 | Kinetic marquee | 1 | brand voice, logos, culture | low | keep |
| 26 | Mesh gradient background | 1 | ambient, SaaS, music | med | simplify |
| 27 | Circular text path | 1 | badges, seals, scroll cues | low | keep |
| 28 | Glitch effect | 3 | music, gaming, streetwear | low | simplify |
| 29 | Typewriter | 1 | terminal, AI, technical | low | keep |
| 30 | Gradient stroke text | 1 | display headline accent | low | keep |

## Effects by archetype

- **Editorial / luxury** — 01, 07, 09, 25, 27. Restraint is the point.
- **Fashion / art** — 01, 04, 11, 13, 17, 28.
- **Hospitality / nightlife** — 02, 03, 08, 26, 28.
- **Local service / trades** — 01, 06, 12, 20. **Nothing above score 1** without a reason.
- **SaaS / developer** — 01, 05, 06, 16, 20, 22, 24, 29.
- **Ecommerce / DTC** — 05, 11, 14, 18, 21.
- **Portfolio / agency** — 01, 04, 10, 13, 17, 23.
- **Flagship / experimental** — 02, 04, 15, 17, 21 + WebGL.

## Selection law

1. **1–3 signature effects per page. One per viewport.** Everything else is supporting.
2. Every "high" cost effect must be the signature moment of its viewport, or it gets cut.
3. Every cursor-dependent effect (10, 13, 15, 23) needs a designed touch alternative — not
   a broken one. If you cannot design the alternative, do not use the effect.
4. Effects marked **remove** on mobile must have their *content purpose* preserved by
   other means. Removing an effect must never remove information.
5. An effect chosen because it is impressive rather than because the content needs it is
   the definition of slop, however well it is executed.

## Beyond the 30

Genuine spatial requirements (product configurators, architectural walkthroughs, physical
products where rotation aids comprehension) route to Three.js / R3F / Spline per module
05. Everything else does not need 3D. "Random 3D" is on the non-generic law list for a
reason.
