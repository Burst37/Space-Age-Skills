# SAVO Motion Engine — Streamlined Reference

Version: 2.0 | Stack: Next.js + framer-motion v12 + Tailwind CSS v4

---

## What This Is

A typed decision function: `getSAVOConfig(brand: BrandDNA) → MotionConfig`

Every output field maps 1:1 to a real component prop. No approximations.

```ts
import { getSAVOConfig, BRAND_PRESETS } from '@/lib/savo';
const config = getSAVOConfig(BRAND_PRESETS.space_age_ai);
// Then:
<VideoHero overlayOpacity={config.videoHero.overlayOpacity} />
<TiltCard intensity={config.tiltCard.intensity} glare={config.tiltCard.glare} />
<KineticText splitBy={config.kineticText.splitBy} />
<ParallaxLayer strength={config.parallax.strength} />
<ScrollReveal intensity={config.scrollReveal.intensity} />
<ClipTransition shape={config.clipTransition.shapes[0]} />
{config.pinnedSection.enabled && <PinnedSection steps={steps} />}
```

---

## Brand DNA — 8 Input Scores (0–10)

| Score | What It Controls |
|-------|------------------|
| `clarity` | Layout legibility; high = minimal interference |
| `authority` | Institutional credibility; high = restrained motion |
| `innovation` | Appetite for novel interactions; gates KineticText + Clip |
| `luxury` | Premium positioning; gates TiltCard + glare |
| `trust` | Trust-signal weight; high authority + trust = minimal motion |
| `emotion` | Emotional vs rational; gates VideoHero |
| `visualRisk` | Tolerance for visual complexity; gates Parallax + Clip |
| `motionTolerance` | How much motion audience expects; primary intensity driver |

---

## Component Decision Map

| Component | Enable When | Kill When |
|-----------|-------------|----------|
| VideoHero | emotion ≥ 5 AND visualRisk ≥ 4 AND industry allows | credit_finance, corporate_law |
| ScrollReveal | Always on | Never — intensity degrades gracefully |
| ClipTransition | visualRisk ≥ 6 AND innovation ≥ 5 AND industry allows | healthcare, fitness, restaurant, saas_b2b, corporate_law, credit_finance, nonprofit |
| TiltCard | luxury ≥ 5 AND innovation ≥ 4 AND industry allows | healthcare, corporate_law, credit_finance, nonprofit |
| KineticText | motionTolerance ≥ 6 AND innovation ≥ 6 AND industry allows | healthcare, restaurant, corporate_law, credit_finance, saas_b2b, nonprofit |
| ParallaxLayer | visualRisk ≥ 5 AND motionTolerance ≥ 5 AND industry allows | healthcare, corporate_law, credit_finance, saas_b2b, nonprofit |
| PinnedSection | innovation ≥ 6 AND clarity ≥ 5 AND industry allows | healthcare, corporate_law, credit_finance, restaurant, fitness, nightclub_event, nonprofit |

---

## Industry Lock Tiers

### TIER 1 — Cinematic (all techniques unlocked)
- `ai_agency`, `music_artist`, `nightclub_event`, `portfolio_agency`

### TIER 2 — High (most techniques, no clip or no pinned)
- `ecommerce_fashion` — full except capped at 'high'
- `fitness` — no ClipTransition, no PinnedSection
- `restaurant` — no Clip, no Kinetic, no Pinned

### TIER 3 — Restrained (product-first, no visual flourish)
- `saas_b2b` — VideoHero + TiltCard + PinnedSection only
- `nonprofit` — VideoHero only, subtle intensity

### TIER 4 — Minimal (trust/authority above everything)
- `healthcare` — VideoHero only, subtle intensity, no other effects
- `credit_finance` — no VideoHero, static hero, minimal only
- `corporate_law` — no VideoHero, typography hero, minimal only

---

## Motion Intensity Levels

| Level | Duration Range | Use Case |
|-------|---------------|----------|
| minimal | 0.15–0.2s | corporate, finance, law |
| subtle | 0.2–0.4s | healthcare, nonprofit |
| standard | 0.4–0.6s | SaaS, restaurant |
| high | 0.6–0.9s | fashion, fitness |
| cinematic | 0.8–1.2s | AI, music, nightclub, portfolio |

Intensity is computed from: `(motionTolerance + visualRisk + innovation) / 3`
then capped at the industry's `maxMotionIntensity`.

---

## Reduced-Motion Law

Every component respects `prefers-reduced-motion`. Per-component fallbacks:

| Component | Reduced-Motion Behavior |
|-----------|------------------------|
| VideoHero | Shows poster image, video paused |
| ScrollReveal | Opacity fade only (no translate), 0.2s |
| ClipTransition | Opacity fade only (no clip-path), 0.2s |
| TiltCard | No tilt, no glare — static card |
| KineticText | Renders plain `<Tag>` — no split animation |
| ParallaxLayer | Renders static `<div>` — no y movement |
| PinnedSection | Renders stacked cards — no sticky scroll |

---

## Mobile Degradation Rules

`mobileConversionPriority: 'critical'` → force all intensities to 'subtle'

| Signal | Effect |
|--------|--------|
| `(hover: none)` media query | TiltCard disabled |
| `mobileConversionPriority: high` | Overlay opacity increases; no stagger |
| `mobileConversionPriority: critical` | All motion → subtle; VideoHero → poster |

---

## Full Usage Pattern

```tsx
import { getSAVOConfig, BRAND_PRESETS, type BrandDNA } from '@/lib/savo';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import KineticText from '@/components/KineticText';
import ParallaxLayer from '@/components/ParallaxLayer';
import PinnedSection from '@/components/PinnedSection';
import VideoHero from '@/components/VideoHero';
import ClipTransition from '@/components/ClipTransition';

// 1. Define your brand
const myBrand: BrandDNA = BRAND_PRESETS.space_age_ai;
// or build custom:
// const myBrand: BrandDNA = { industry: 'ai_agency', clarity:7, ... };

// 2. Get config
const config = getSAVOConfig(myBrand);

// 3. Deploy components — the config decides, not you
export default function HeroSection() {
  return (
    <VideoHero
      src="/hero.mp4"
      poster="/hero-poster.jpg"
      overlayOpacity={config.videoHero.overlayOpacity}
      className="h-screen"
    >
      <KineticText
        text="Space Age AI Solutions"
        splitBy={config.kineticText.splitBy}
        className="text-6xl font-black"
      />
    </VideoHero>
  );
}

// 4. Check rejected[] to understand what was disabled and why
console.log(config.rejected);
// e.g. ["clipTransition: locked off for healthcare"]
```

---

## QA Checklist Before Ship

- [ ] `config.rejected[]` reviewed — no surprises
- [ ] Tested at `prefers-reduced-motion: reduce` — no missing poster
- [ ] TiltCard tested on touch device — static, not broken
- [ ] VideoHero has `poster` prop set — no flash of black
- [ ] PinnedSection height = `steps.length * 100vh` — no scroll lock
- [ ] KineticText has `aria-label` on parent — screen readers unaffected
- [ ] All ScrollReveal `delay` values sum < 1.2s per viewport — no waiting

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Hardcode `intensity="dramatic"` | Pass `config.scrollReveal.intensity` |
| Add ClipTransition to healthcare page | Check `config.clipTransition.enabled` |
| Use TiltCard on mobile without guard | TiltCard handles it internally via `(hover: none)` |
| Skip `poster` on VideoHero | Always set — used for reduced-motion + slow connections |
| Animate every element in | Stagger max 5–6 items; beyond that, no stagger |
| Call `getSAVOConfig` on every render | Call once at layout level, pass config down |

---

## Available Presets

| Preset | Industry | Intensity | Hero |
|--------|----------|-----------|------|
| `space_age_ai` | ai_agency | cinematic | video |
| `music_artist` | music_artist | cinematic | video |
| `nightclub` | nightclub_event | cinematic | video |
| `ecommerce_luxury` | ecommerce_fashion | high | video |
| `restaurant` | restaurant | high | video |
| `saas_b2b` | saas_b2b | standard | video |
| `healthcare` | healthcare | subtle | video |
| `corporate_law` | corporate_law | minimal | typography |
