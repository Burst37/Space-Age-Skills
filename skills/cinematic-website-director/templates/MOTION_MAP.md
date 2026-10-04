# MOTION MAP — <project>

> Version: 1.0 · Motion score: _ /4 · Ref: `references/MOTION_CRAFT.md`, `references/EFFECT_LIBRARY.md`

## Signature Moment
<!-- One sentence. One per page (max 3). This is the thing people remember. -->
-

## Section Score
| Section | Purpose | Effect (# ) | Trigger | Start/End | Timing or Scrub | Easing | Desktop | Mobile | Reduced Motion | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Hero | | | | | | | | keep/simplify/replace/remove | | low/med/high | |

<!-- A row with any blank cell is NOT approved. Mobile and reduced-motion are never blank. -->

## Global Interaction Grammar
- Hover:                      <!-- duration, easing, property -->
- Buttons:
- Nav:
- Links:
- Media:
- Page transitions:
- Focus states:               <!-- visible, ≥3:1, never outline:none alone -->

## Do Not Animate
-

## Verification
- [ ] Static state authored in CSS — nothing invisible if JS fails
- [ ] Every scrub uses `ease: "none"`
- [ ] Slow / fast / reverse scroll tested
- [ ] Resize mid-animation tested (`invalidateOnRefresh`)
- [ ] `prefers-reduced-motion` verified in browser
- [ ] 60fps sustained at 4× CPU throttle
- [ ] No CLS caused by animation
- [ ] Pinned sections re-tested after fonts + media load
- [ ] ≤3 signature moments, 1 per viewport
