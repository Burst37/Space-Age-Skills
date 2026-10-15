# Performance Budgets

Measured on a **mid-tier mobile device over 4G** (Lighthouse mobile preset / 4× CPU
throttle), not on a laptop over office wifi.

## 1. Core Web Vitals by tier

| Metric | T0 Rapid | T1 Standard | T2 Premium | T3 Flagship |
|---|---|---|---|---|
| **LCP** | < 2.0s | < 2.2s | < 2.5s | < 2.5s |
| **INP** | < 200ms | < 200ms | < 200ms | < 200ms |
| **CLS** | < 0.05 | < 0.05 | < 0.1 | < 0.1 |
| **TBT** | < 200ms | < 250ms | < 350ms | < 400ms |
| Lighthouse Perf (mobile) | ≥ 90 | ≥ 85 | ≥ 75 | ≥ 70 |
| Lighthouse A11y | ≥ 95 | ≥ 95 | ≥ 95 | ≥ 95 |

**Accessibility does not scale with tier.** A flagship experience that fails a screen
reader is not a flagship, it is a liability.

CLS under 0.05 at every tier is deliberate: layout shift is never an artistic choice.

## 2. Asset budgets (initial page load)

| Asset | T0 | T1 | T2 | T3 |
|---|---|---|---|---|
| Total transfer | < 800KB | < 1.2MB | < 2.5MB | < 4MB |
| JS (compressed) | < 100KB | < 150KB | < 300KB | < 500KB |
| CSS (compressed) | < 40KB | < 60KB | < 100KB | < 150KB |
| Fonts | ≤ 2 files, < 120KB | ≤ 3, < 180KB | ≤ 4, < 250KB | ≤ 4, < 300KB |
| Hero image | < 200KB | < 250KB | < 400KB | < 500KB |
| Hero video | avoid | < 2MB, poster required | < 5MB | < 8MB |
| Third-party scripts | 0–1 | ≤ 2 | ≤ 3 | ≤ 3 |

Exceeding a budget requires a written justification in the build contract. "It's a
flagship" is not a justification; "the WebGL product viewer is the primary conversion
mechanism" is.

## 3. Media rules

**Images**
- AVIF first, WebP fallback, JPEG/PNG last resort
- `srcset` + `sizes` on everything above 400px wide
- Explicit `width`/`height` or `aspect-ratio` on every image — this is the CLS fix
- `loading="lazy"` + `decoding="async"` below the fold; `fetchpriority="high"` on the LCP image
- Never lazy-load the LCP image. This is the most common self-inflicted LCP regression.

**Video**
- `poster` always — the poster is the LCP element, optimize it as such
- `preload="none"` below fold, `preload="metadata"` at most above fold
- Autoplay requires `muted playsinline`; provide a pause control
- Serve a still image instead of video on `prefers-reduced-motion` and on save-data
- Cap background loops at 6–10s and re-encode; never ship a 30s ambient loop

**Fonts**
- Subset to actual glyph coverage
- One variable file beats four static weights
- Preload only above-fold faces, maximum two
- Metric-matched fallback (`size-adjust`, `ascent-override`) — see `TYPE_CRAFT.md §9`

## 4. JS discipline
- No framework for a static marketing page
- GSAP core + ScrollTrigger only; do not ship the full plugin bundle
- Defer everything non-critical; nothing render-blocking below the fold
- Code-split any below-fold module over ~15KB
- Audit every third-party script — analytics, chat widgets, and pixels are the usual
  cause of a good build scoring 60
- Chat widgets load on interaction or after idle, never on first paint

## 5. Verification protocol

Before delivery, run and record in the QA ledger:
1. Lighthouse mobile, 3 runs, median reported
2. 4× CPU throttle + Fast 3G — scroll the whole page, watch for jank
3. Real device check where possible (a mid-range Android, not a flagship iPhone)
4. Fonts blocked — confirm fallback does not shift layout
5. JS disabled — confirm content is readable and the CTA path works
6. `prefers-reduced-motion: reduce` — confirm content is fully visible
7. Keyboard-only pass through the primary conversion path

Unverified performance claims do not go in the delivery notes.
