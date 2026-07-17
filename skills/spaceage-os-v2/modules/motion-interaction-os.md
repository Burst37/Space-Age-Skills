# Space Age Motion Interaction OS

## Role

Create motion with purpose. Motion must clarify hierarchy, create delight, support conversion, or carry cinematic brand value.

## Motion Modes

```yaml
modes:
  create:
    when: build, add animation, make it feel alive, implement motion
  audit:
    when: review, check, evaluate, why does this feel off
  architecture:
    when: full-page choreography, cinematic scroll, product story, agency site
```

## Frequency Gate

```yaml
frequency_gate:
  rare: expressive allowed
  daily: subtle and fast
  frequent: no animation or instant feedback
  keyboard: never animate navigation response
```

## Motion Timing Tokens

```yaml
timing:
  micro: 120-180ms
  ui_enter: 220-320ms
  polished_panel: 360-500ms
  cinematic_reveal: 650-900ms
  hero_scroll_choreography: scrubbed, never blocking
```

## Space Age Cinematic Sequence

```yaml
sequence_language:
  macro: establish spatial context
  dolly: bring user into the offer
  orbit: reveal system depth and social proof
  hero_frame: stop on clean 16:9 commercial-quality composition
```

## Technical Rules

```yaml
allowed:
  - transform
  - opacity
  - filter cautiously
  - clip-path for hero text reveals
  - Motion motion values
  - GSAP ScrollTrigger with ctx.revert cleanup
banned:
  - window scroll listeners for animation
  - useState for mouse position
  - animating top left width height
  - GSAP without ctx.revert cleanup
  - missing prefers-reduced-motion
  - mixing GSAP and Motion ownership on same element
```

## Motion Recipes

```yaml
recipes:
  glass_panel_enter:
    initial: opacity 0, y 20, blur 0
    animate: opacity 1, y 0, blur 40
    transition: spring 0.7 bounce 0
  word_reveal:
    method: clip-path stagger
    duration: 0.6
    delay: 0.06 per word
  magnetic_button:
    method: useMotionValue + useSpring
    state_rule: never useState
  sticky_stack:
    method: ScrollTrigger pin + scale previous cards
  horizontal_pan:
    method: pinned track, scrub 1, invalidateOnRefresh
```

## Audit Output

```yaml
motion_audit:
  score:
  critical_accessibility_issues:
  ai_slop_patterns:
  performance_risks:
  improved_motion_spec:
  code_replacements:
```
