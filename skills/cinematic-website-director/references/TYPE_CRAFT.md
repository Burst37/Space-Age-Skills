# Type Craft — Numbers, Pairings, Code

> The typography module says *what to decide*. This says *what the values are*.
> Load on every build.

## 1. Typography archetypes

| Class | Reads as | Display candidates | Body candidates |
|---|---|---|---|
| **Editorial / Luxury** | considered, expensive, slow | Canela, PP Editorial New, Bodoni Moda*, Cormorant*, Instrument Serif*, Playfair Display* | Söhne, Suisse Int'l, Lyon Text, Source Serif 4* |
| **Modern Premium** | clean, confident, current | Neue Haas Grotesk, Suisse Int'l, Neue Montreal, PP Neue Montreal, General Sans*, Geist* | Inter*, Söhne, Satoshi*, Geist* |
| **Fashion / Art** | sharp, expressive, brave | Didot, PP Right Didone, Migra, Editorial New, Anton*, Archivo Black*, Syne* | Neue Haas, Suisse, Manrope*, Archivo* |
| **Technical / Futuristic** | precise, engineered | Space Grotesk*, Chakra Petch*, PP Supply Mono, Departure Mono*, Unica77 | IBM Plex Sans*, JetBrains Mono*, Space Mono* |
| **Human / Service** | warm, trustworthy, plain | Fraunces*, Gambetta*, Recoleta, Bricolage Grotesque* | Public Sans*, Karla*, Work Sans*, Figtree* |
| **Brutal / Statement** | loud, unignorable | Druk, Monument Extended, Bebas Neue*, Oswald*, Anton* | Roboto Mono*, Archivo Narrow* |

`*` = free / open license (Google Fonts, Fontshare, SIL OFL). Everything else is
commercial — confirm licensing before specifying.

## 2. Commercial → open substitution table

| Commercial | Open substitute | Class preserved? |
|---|---|---|
| Canela | Instrument Serif, Newsreader | yes, slightly less refined at large sizes |
| Söhne / Neue Haas | Inter Tight, Geist, Public Sans | yes |
| Suisse Int'l | Archivo, Geist | yes |
| Neue Montreal | General Sans, Satoshi (Fontshare) | yes |
| GT America | Archivo, Figtree | close |
| Druk / Monument Extended | Anton, Archivo Expanded, Bebas Neue | partly — less refined, still loud |
| Didot / Bodoni | Bodoni Moda, Playfair Display | yes |
| Recoleta | Fraunces (opsz axis), Gambetta | yes |
| PP Supply Mono | Space Mono, DM Mono, Departure Mono | yes |

Always name the substitution in `TYPOGRAPHY_SYSTEM.md`. Never silently downgrade a class.

## 3. Modular scale

Pick one ratio and hold it. Mixing ratios is the most common cause of "the type feels off
but I can't say why."

| Ratio | Name | Character | Use |
|---|---|---|---|
| 1.125 | Major second | tight, dense | dashboards, dense B2B, data UI |
| 1.200 | Minor third | calm, utilitarian | service sites, docs, content-heavy |
| 1.250 | Major third | balanced default | most SMB and SaaS work |
| 1.333 | Perfect fourth | confident, editorial | premium brand sites |
| 1.414 | Augmented fourth | dramatic | fashion, hospitality, portfolio |
| 1.500 | Perfect fifth | very dramatic | statement pages, few text levels |
| 1.618 | Golden | extreme | hero-dominant single-screen work |

**Rule:** higher ratio → fewer type levels. A 1.618 scale with seven levels produces
absurd jumps. Above 1.414, cap at five levels and stop.

## 4. Fluid scale — real `clamp()` values

Formula: `clamp(<min>, <intercept>rem + <slope>vw, <max>)` where the middle term is
computed for a 375px → 1440px viewport range.

Base body ramp (16px → 18px):
```css
:root {
  --step--1: clamp(0.833rem, 0.80rem + 0.15vw, 0.9rem);
  --step-0:  clamp(1rem,    0.96rem + 0.18vw, 1.125rem);
  --step-1:  clamp(1.25rem, 1.18rem + 0.31vw, 1.5rem);
  --step-2:  clamp(1.563rem, 1.44rem + 0.52vw, 2rem);
  --step-3:  clamp(1.953rem, 1.76rem + 0.83vw, 2.667rem);
  --step-4:  clamp(2.441rem, 2.14rem + 1.29vw, 3.556rem);
  --step-5:  clamp(3.052rem, 2.58rem + 2.00vw, 4.741rem);
  --step-6:  clamp(3.815rem, 3.11rem + 3.02vw, 6.32rem);
}
```
That is a 1.25 ratio at mobile widening to 1.333 at desktop — the scale itself gets more
dramatic as the canvas grows, which is what good editorial work does manually.

For a hero that must fill its measure regardless of viewport, prefer
`font-size: clamp(2.5rem, 12vw, 9rem)` with `text-wrap: balance` and an explicit
`max-width` in `ch`. Test it at 320px before shipping.

## 5. Line height by size band

| Size band | Line height | Why |
|---|---|---|
| Display 48px+ | 0.90 – 1.05 | large type needs *less* leading; 1.5 on a hero looks broken |
| Heading 28–48px | 1.10 – 1.25 | |
| Subhead 20–28px | 1.30 – 1.40 | |
| Body 16–19px | 1.50 – 1.70 | 1.6 is the safe default |
| Small 13–15px | 1.45 – 1.60 | |
| Label / caps 11–13px | 1.20 – 1.40 | |

Longer measure needs more leading. At 75ch use 1.7; at 50ch, 1.5 reads fine.

## 6. Tracking by size band

| Context | Tracking |
|---|---|
| Display 60px+ | `-0.03em` to `-0.045em` |
| Display 40–60px | `-0.02em` to `-0.03em` |
| Heading 24–40px | `-0.01em` to `-0.02em` |
| Body | `0` (trust the designer's metrics) |
| Small text < 14px | `0` to `+0.01em` |
| Uppercase labels | `+0.06em` to `+0.12em` |
| Uppercase display | `+0.02em` to `+0.05em` |

Never apply negative tracking below 24px. Optical sizing (`font-optical-sizing: auto`) on
a variable face with an `opsz` axis handles much of this — use it when available.

## 7. Measure

| Content | Measure |
|---|---|
| Sustained body copy | 60–75ch (**66ch** is the sweet spot) |
| Short body / cards | 45–60ch |
| Hero headline | 12–20ch — force the break you want |
| Subhead / deck | 30–45ch |
| Captions | 40–55ch |

Set with `max-width: 66ch` on the text element, not the container. A container width in
px that happens to land near 66ch will break the moment the font changes.

## 8. Hierarchy beyond size

Size alone is fake hierarchy. Real hierarchy uses at least **three** of:
size · weight · color/opacity · case · tracking · family · spacing above/below · rule or
divider · position in the grid.

Weight map convention:
```
300/400  body, long-form
500      UI labels, nav, emphasis in body
600/700  subheads, card titles
800/900  display only — and only if the face is designed for it
```
A face with only 400/700 available is not automatically wrong, but check the display
weight actually holds up at 100px before committing.

## 9. Loading strategy

```html
<!-- Preload ONLY the above-the-fold faces. Two files maximum. -->
<link rel="preload" href="/fonts/display-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/body-var.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: "Display";
  src: url("/fonts/display-var.woff2") format("woff2-variations");
  font-weight: 300 900;          /* variable range — one file, all weights */
  font-display: swap;
  font-style: normal;
  unicode-range: U+0000-00FF, U+2000-206F, U+2122, U+2190-21BB;
}

/* Metric-matched fallback kills the layout shift on swap. */
@font-face {
  font-family: "Display-fallback";
  src: local("Georgia");
  size-adjust: 105%;
  ascent-override: 92%;
  descent-override: 22%;
  line-gap-override: 0%;
}

:root {
  --font-display: "Display", "Display-fallback", Georgia, serif;
  --font-body: "Body", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
```

Rules: self-host wherever possible (faster and GDPR-safe) · subset to the ranges the site
actually uses · one variable file beats four static weights · `font-display: swap` unless
the brand genuinely cannot tolerate FOUT, then `optional` · never more than **4 font
files** total on a T0/T1 build.

Derive `size-adjust` / `ascent-override` values by measuring, not guessing — or use a
generator. Wrong overrides cause worse shift than none.

## 10. Details that separate good from excellent

```css
/* Hero headlines: balance the ragged edge. Body: avoid orphans. */
h1, h2 { text-wrap: balance; }
p { text-wrap: pretty; }

/* Numbers in tables, pricing, stats — stop the jitter. */
.tabular { font-variant-numeric: tabular-nums; }

/* Optical alignment: quotes and punctuation hang out of the measure. */
blockquote { text-indent: -0.4em; }

/* Real small caps, not scaled uppercase. */
.smallcaps { font-variant-caps: all-small-caps; letter-spacing: 0.04em; }

/* Kill the double-space after a period in generated copy. Design for single. */
```

- Uppercase always needs positive tracking. Always.
- Never letterspace lowercase body text.
- Two type sizes in a card is usually enough; three is usually one too many.
- Punctuation is typography: use real curly quotes, em dashes, and `&nbsp;` before the
  last word of a headline to prevent a one-word orphan.

## 11. Type QA checklist
- [ ] Every size in the scale traces to the chosen ratio
- [ ] Leading and tracking follow the size bands above
- [ ] Body measure between 60–75ch at every breakpoint
- [ ] Hero has no orphan or two-word widow at 375, 768, 1440
- [ ] Fallback is metric-matched — verified with fonts blocked
- [ ] ≤ 4 font files, ≤ 3 families
- [ ] Hierarchy uses ≥ 3 differentiators, not size alone
- [ ] No negative tracking under 24px, no letterspaced lowercase
- [ ] Tabular numerals wherever numbers align
- [ ] Tested at 320px with no clipping or overflow
