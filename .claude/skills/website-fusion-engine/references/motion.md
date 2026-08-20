# Motion reconstruction

Rebuild the **interaction model**, not a screenshot, and not "install every lib detected." Pick the lightest stack that reproduces the behavior.

## Capture schema (one record per interaction → `motion-map.json`)

```json
{
  "id": "home-image-reveal-01",
  "route": "/", "trigger": "scroll", "target": ".project-image:nth-child(1)",
  "initial": { "opacity": 0, "transform": "translateY(80px) scale(1.08)", "clipPath": "inset(100% 0 0 0)" },
  "final":   { "opacity": 1, "transform": "translateY(0) scale(1)",       "clipPath": "inset(0 0 0 0)" },
  "durationMs": 900, "easing": "power3.out",
  "scroll": { "start": "top 85%", "end": "top 45%", "scrub": false, "pin": false },
  "desktop": "full", "tablet": "reduced-distance", "mobile": "fade-translate",
  "reducedMotion": "opacity-only",
  "evidence": "browser-capture", "confidence": 0.95
}
```

`initial/final/top` = `observed` (forensics.mjs). `easing/duration/scrub` = `inferred` unless source seen. Unknown stays unknown until user approves.

## Stack choice

| Need | Use |
|---|---|
| Smooth scroll | Lenis (modern, light) — recipe `recipes/smooth-scroll-lenis.md` |
| Scroll-linked transforms, pin, scrub | GSAP + ScrollTrigger — `recipes/scrolltrigger-pin.md` |
| Component enter/exit, layout, React | Framer Motion |
| Fullscreen menu, masks | CSS `clip-path` + transitions — `recipes/fullscreen-menu.md` |
| Route transition (SPA) | FLIP / View Transitions API / Framer — `recipes/route-transition.md` |
| 3D / particle hero | Three.js / R3F (only if source truly uses it) |

Rule: Lenis + GSAP covers ~80% of award-site motion. Don't add Locomotive *and* Lenis. Don't add Framer *and* GSAP for the same job.

## Non-negotiables

- `prefers-reduced-motion: reduce` → kill transforms/scrub, keep opacity ≤200ms. Required.
- No hydration flash: set initial hidden state in CSS, not just JS.
- Kill ScrollTrigger/Lenis on route unmount (cleanup) — memory + double-bind bugs.
- Mobile: usually downgrade distance/scrub; test on 390px.
- Pin/scrub must be tested at every breakpoint — pin heights break responsive.

## Completeness (motion-led source)

Map + rebuild selected: page-load choreography · menu open/close · route transitions · scroll transforms · pinned/scrubbed · image masks/reveals · hover/focus · custom cursor · kinetic type · media behavior · per-breakpoint differences · reduced-motion fallback.
