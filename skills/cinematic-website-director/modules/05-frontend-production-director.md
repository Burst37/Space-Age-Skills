# Module 05 — Frontend Production Director

## Mission
Translate locked artifacts into production code **without degrading the design**.

## Stack policy
Use the user's requested stack first. Otherwise choose the smallest stack that executes
the design reliably.

| Route | Right when |
|---|---|
| Semantic HTML/CSS/JS, single file | T0 lead-gen sites, one-page builds, fastest ship |
| Static HTML/CSS/JS, multi-file | T1 SMB multi-page, no app state |
| Next.js / React | routing, CMS, auth, commerce, or app architecture exists |
| Tailwind | team convention or rapid token-driven build |
| CSS modules / vanilla CSS with custom properties | design-token-heavy, art-directed work |
| GSAP + ScrollTrigger | authored scroll, pinning, scrub, timelines |
| Motion (Framer Motion) | React component and state choreography |
| Lenis | smooth scroll that genuinely improves the choreography — not by default |
| Three.js / R3F / Spline | real spatial requirement only |
| Rive / Lottie | authored vector motion, character animation, icon systems |

**Do not** force single-file HTML when the project needs app architecture.
**Do not** force React when static HTML is sufficient.

## Build contract
Create from `templates/BUILD_CONTRACT.md` before writing code.

## Implementation order
1. Semantic structure
2. Responsive layout
3. Typography
4. Core visual treatment
5. Interactions
6. Signature motion
7. Supporting motion
8. Performance and accessibility hardening

Motion is step 6, not step 2. A page that isn't beautiful static will not be rescued by animation.

## Responsive law
Mobile is a **recomposition**, not a scaled desktop. For every cinematic effect, decide
explicitly: **keep · simplify · replace · remove.** Write the decision in the motion map.

Verify at 320, 375, 414, 768, 1024, 1280, 1440, 1920. Also check 375 landscape and a
tall-narrow foldable width.

Mobile-specific obligations: tap targets ≥ 44×44 CSS px · no hover-only affordances ·
thumb-reachable primary CTA · no horizontal overflow at any width · fixed elements must
not eat more than ~15% of viewport height.

## Performance
Budgets by tier: `references/PERFORMANCE_BUDGETS.md`. Non-negotiable practices:
- Responsive images with explicit `width`/`height` or `aspect-ratio` — CLS is a defect
- AVIF/WebP with fallback; hero image preloaded, everything below fold lazy
- Video: `poster` always, `preload="none"` below fold, muted autoplay only where designed
- Fonts: subset, `font-display: swap`, preload only the above-fold faces
- Code-split anything below the fold that costs more than ~15KB
- Cap GPU-heavy effects to one per viewport
- Every third-party script justified in the build contract or removed

## Accessibility
Semantic landmarks · visible keyboard focus (never `outline: none` without a replacement)
· contrast per `COLOR_AND_SURFACE.md` · target size · `prefers-reduced-motion` honored ·
meaningful alt text (decorative images get `alt=""`) · no interaction available only on
hover · no focus trap created by a cinematic overlay · pinned sections must not strand
keyboard users · skip link on any page with substantial nav · form labels, never
placeholder-as-label.

## Deviation log
Any departure from Design DNA, Typography System, or Motion Map is written to the QA
ledger with reason and approval status — at the time it happens, not at the end.
