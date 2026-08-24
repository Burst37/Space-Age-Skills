# Module 04 — Scroll & Motion Director

> Decision process. For easing values, duration ladders, stagger math and GSAP patterns,
> load `references/MOTION_CRAFT.md`. For the catalog of proven effects, load
> `references/EFFECT_LIBRARY.md`.

## Mission
Design the site's kinetic grammar before implementation.

## Motion score
| Score | Character | Typical |
|---|---|---|
| 0 | Static / editorial | print-like brands, regulated, ultra-fast utility |
| 1 | Subtle micro-interaction | local service, medical, legal, most T0 |
| 2 | Premium | SMB brand sites, considered ecommerce |
| 3 | Cinematic narrative | hospitality, fashion, automotive, entertainment |
| 4 | Flagship / experimental | award submissions, brand statements |

**The score is a ceiling, not a quota.** A score-3 page with two beautiful moments beats a
score-3 page that spends its whole budget.

## Motion opportunity test
Before adding any motion:
1. Does it clarify hierarchy?
2. Does it explain a spatial relationship?
3. Does it improve feedback?
4. Does it pace a story?
5. Does it create a memorable brand moment?
6. Is there a simpler effect with equal value?

Mostly *no* → do not animate. Question 6 answered *yes* → build the simpler one.

## Signature selection
Choose **1–3 signature moments per page**, and exactly **one per viewport**. Everything
else is supporting motion and must be measurably quieter — shorter, smaller amplitude,
lower contrast.

Name the signature moment in the DNA. If you cannot name it in one sentence, it is not a
signature, it is decoration.

## Scroll pattern library
Mask/clip reveals · image scale and reframe · bounded parallax · pinned storytelling ·
sticky stacks · horizontal chapters · section takeover · scroll-synced typography · video
scrubbing · canvas frame sequences · SVG path drawing · image-to-fullscreen transition ·
perspective and depth transitions · velocity-aware accents · kinetic marquees · object/3D
scroll sync · WebGL displacement · sticky split narrative · progressive product exhibition.

Implementations: `references/EFFECT_LIBRARY.md`.

## Motion map schema
Every entry, every field. A missing field means the motion is not approved.
```yaml
section:
  narrative_purpose:
  trigger:
  target:
  effect:
  properties:          # transform/opacity preferred; name anything else explicitly
  start:
  end:
  duration_or_scrub:
  easing:
  sequence:
  desktop:
  tablet:
  mobile:              # keep | simplify | replace | remove — never blank
  reduced_motion:      # what the user sees instead; "nothing" is a valid answer
  performance_risk: low|medium|high
  fallback:            # if JS fails, the video 404s, or the device is weak
```

## Easing discipline
- Entering: decelerate (ease-out)
- Exiting: accelerate (ease-in) where appropriate
- User-controlled scrub: linear (`none`) — anything else fights the finger
- Spring/bounce: only when product personality genuinely supports it
- Luxury: restrained, longer, smooth, wide temporal spacing
- Utility/service: faster, clearer, lower amplitude

Actual cubic-bezier values: `references/MOTION_CRAFT.md`.

## Do-not-animate list
Every paragraph fading up · scroll hijack without narrative need · cursor effects on
touch-first audiences · large blur/filter animation on weak devices · simultaneous
unrelated motion in one viewport · autoplay motion fighting the scroll · continuous
transforms on large media without a perf check · anything animating `width`, `height`,
`top`, `left`, `margin`, or `box-shadow` on a per-frame basis · text that animates in so
slowly the user reads it before it arrives.

## Motion QA
Test all of: slow scroll · fast scroll · reverse scroll · resize mid-animation · mobile
touch and momentum · `prefers-reduced-motion: reduce` · pinned entry and exit · cumulative
layout shift · sustained frame rate under scroll · video load failure · JS disabled ·
back-navigation into a pinned section.
