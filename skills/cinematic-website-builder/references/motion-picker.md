# Motion picker (G3)

Chuma picks effects by **seeing** them, not by name. The picker turns the wireframe, the sector, the moodboard
and his taste profile into a motion plan, then shows one review screen with live demos.

```bash
node scripts/motion-pick.mjs handoff/wireframe.yaml --moodboard handoff/moodboard.yaml --taste taste-profile.yaml \
  [--sector law] [--tier enhanced] [--mode auto|review] [--out handoff]
# review: open handoff/motion-review.html → approve (--accept) or swap:
node scripts/motion-pick.mjs handoff/wireframe.yaml --swap "home/gallery=expanding-video-panels" --accept
```

## Data: `references/motion-catalog.yaml` (34 effects)
Each effect has a **plain** name (what he'd say), a **technical** name, the exact **technique**
(GSAP/ScrollTrigger/SplitText/Lenis/CSS view-timeline), a **module**, **libs**, **cost**, **profile**
(gentle / bold / both), gentle and bold notes, section kinds it **fits**, whether it can be the **signature**,
and **says** (moodboard phrases from `animation-vocabulary` / `site-reverse-engineer` that map to it).
Demos: `tests/gallery.dist.html?focus=<module>` scrolls the module gallery to the live demo.

## How auto mode decides
1. Taste profile: `motion.always` (+40, e.g. `video-chapters`), signature style (+25), liked (+15), disliked (excluded).
   Jumbo-type signature lifts `depth-parallax` (type behind subject: +22 outside regulated sectors), `jumbo-line-reveal`, `jumbo-scrub`.
2. Moodboard: phrases mapped through `says` (+20 per match, with the reference URL as the reason).
3. Sector: regulated (home care, law, medical, dental, SaaS, finance) → **gentle profile**: bold-only effects
   are removed, gentle variants used, CSS first, GSAP only for the signature moment.
4. Budget: tier budget (factory 30 · enhanced 45 · cinematic 70 · flagship 100); **one signature per page**;
   video-per-section is a page style (one module on `<main>`, cost charged once).
5. Film effects only where the wireframe plans `media: film`; stills elsewhere.
6. Hero layers: a type layer (depth-parallax, non-regulated) and a headline layer (jumbo-line-reveal / masked reveal).

Output `motion-plan.yaml`: `style`, `libraries`, `min_scrolltriggers`, `smooth_scroll`, and per section
`effect`, `technique`, `module`, `variant`, `why`, `alternates`, `markup` hints. `verify.mjs --motion-plan`
fails the build if a planned library, module (`data-cwb-live`) or CSS timeline is missing.

Picks feed back: `--accept` adds the chosen effects to `motion.liked`; swaps add the replaced effect to `motion.disliked`.
