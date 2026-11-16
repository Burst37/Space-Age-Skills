# Spacing system

Spacing gets approved at the **greybox** (G4): `greybox.mjs` renders with these exact tokens.

## Tokens (`runtime/cwb-base.css`, copied into `design-spec.md` §4)
| Token | 320px → 1440px | Use |
|---|---|---|
| `--space-3xs` | 4 → 5px | icon gaps |
| `--space-2xs` | 8 → 9px | tight inline |
| `--space-xs` | 12 → 14px | label ↔ field |
| `--space-s` | 16 → 18px | paragraph gap (= body size) |
| `--space-m` | 24 → 27px | `--stack`: gap inside a group |
| `--space-l` | 32 → 36px | group ↔ group |
| `--space-xl` | 48 → 54px | heading block ↔ content |
| `--space-2xl` | 64 → 72px | sub-sections |
| `--space-3xl` | 96 → 108px | large breaks |
| `--space-4xl` | 128 → 144px | hero breathing room |
| `--space-s-l` · `--space-m-xl` · `--space-l-2xl` | one-up pairs | grow faster from phone to desktop (grid gaps, split gaps) |

Utopia-style: each step is a multiple of the body size, interpolated with `clamp()` between 320 and 1440px,
so spacing scales **with** the type scale.

**Section rhythm**: `--section-y-gentle` clamp(4rem, …, 9rem) · `--section-y-standard` clamp(5rem, …, 11rem) ·
`--section-y-cinematic` clamp(6rem, 12vw, 12rem). Pick one per site (`--section-y`); a section may step up or down
one level (`.section--gentle`, `.section--cinematic`) for emphasis, never more.

**Container**: `--gutter` clamp(1rem, …, 4rem) (never below 16px) · `--max-content` 1440–1600 (default 1520) ·
`--max-page` 2400 (full-bleed cap, wide passes check it) · `--measure` 66ch.

## Rhythm rules
1. **Between > within.** The gap between sections is always larger than any gap inside a section; inside a
   group, related items sit closer (proximity) than unrelated ones.
2. **One dominant element per viewport.** If two things compete, one gets smaller or moves to the next screen.
3. **Real negative space.** Empty space is designed; don't fill it with decoration.
4. **Tokens only.** Authored CSS uses `--space-*`, `--section-y`, `--gutter`, not raw px paddings.

## verify.mjs checks
- Hard-coded px paddings ≥ 20px in authored `<style>` (not the inlined runtime) → **warn**.
- Section top paddings on more than 3 distinct values → **warn** (off-rhythm).
- Readable text closer than **16px** to either viewport edge on mobile / 320 → **fail** (horizontal scrollers, tickers and jumbo bleed words are exempt).
- Buttons/CTAs/toggles under **44×44px** on mobile → **fail**.
