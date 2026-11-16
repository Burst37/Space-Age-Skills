# Design spec: {{Business name}}
<!-- CWB v3.3: the single source of truth. Replaces direction-brief synthesis + build-manifest. Every build
     prompt reads THIS file. A conflict between documents is resolved here and logged in §11. -->

## 1. Direction
Design Read (audience · promise · VARIANCE/MOTION/DENSITY dials · moodboard letter) and the approved
moodboard link. Profile: {{gentle | bold}}. Tier: {{tier}}. Signature moment per page: see §6.

## 2. Colour tokens (~8, primitives → roles)
| Primitive | OKLCH | Role token | Use |
|---|---|---|---|
| ink-950 | oklch(…) | `--c-fg` | body text (≥ 4.5:1 on `--c-bg`) |
| paper-50 | oklch(…) | `--c-bg` | page background |
| paper-100 | oklch(…) | `--c-bg-2` | alt sections |
| ink-600 | oklch(…) | `--c-fg-muted` | secondary text (≥ 4.5:1) |
| line | oklch(… / 0.12) | `--c-line` | rules, borders |
| brand-500 | oklch(…) | `--c-accent` | CTA, focus |
| brand-200 | oklch(…) | `--c-accent-2` | highlights |
| on-brand | oklch(…) | `--c-on-accent` | text on CTA |
Optional dark theme: the same role tokens under `@media (prefers-color-scheme: dark)` / `[data-theme=dark]`.
Purge every starter token the design does not use (`cwb-base.css` defaults are placeholders).

## 3. Type (written by scripts/type-specimens.mjs)
<!-- cwb:type:start -->
Run the type picker. This block is replaced with: pairing, provider, licence, why, fallback @font-face
with size-adjust/ascent-override, and :root tokens (--t-hero … --t-small, --t-jumbo, tracking, leading, measure).
<!-- cwb:type:end -->
Max 2 families and ≤ 4 files; one provider per page. Jumbo word(s): {{Home}}. Custom-type style: {{1 behind-subject}}.

## 4. Spacing (references/spacing-system.md)
Scale `--space-3xs … --space-4xl` (Utopia-style, 320→1440) as in `cwb-base.css`.
Section rhythm: `--section-y: var(--section-y-{{gentle|standard|cinematic}})`. Inside a group `--stack: var(--space-m)`.
Container: `--gutter` (≥ 16px), `--max-content: {{1520px}}`, `--max-page: 2400px`, `--measure: 66ch`.
Rules: gaps between sections > gaps within; proximity groups; one dominant element per viewport; tap targets ≥ 44px.

## 5. Radius, grid, breakpoints
Radius `--radius` {{18px}} / `--radius-sm` {{10px}}. Grid 4 / 8 / 12 columns. Breakpoints **744** (tablet) and
**1200** (desktop); nothing grows past **2400** (wide passes at 1920 and 2560 must look composed).

## 6. Motion score (from handoff/motion-plan.yaml)
Beat sheet first (one line per section): Hook → Problem → Proof → Offer → CTA. Narrative recipe: {{LOCAL_BUSINESS | PRODUCT_REVEAL | STUDIO_AGENCY | …}} (`references/modules.md` composition recipes). A section with no beat is cut.
| Page | Section | Effect (plain) | Technique / module | Variant | Trigger | Mobile | Reduced motion |
|---|---|---|---|---|---|---|---|
Signature moment per page: {{/ hero: depth-parallax}}. Smooth scroll: {{soft | native}}. Libraries: {{gsap, scrolltrigger, splittext}}.

## 7. Media plan
Per section: still or film; clip subject / camera move / pacing (all distinct); poster; size budget. Logo ≤ 100KB (SVG preferred).

## 8. SEO/AEO plan (from the G1 blueprint)
Sitemap · page types · schema per page (LocalBusiness subtype + Service + FAQPage where real) · question H2s +
40–60 word capsules · entity/NAP · robots.txt / llms.txt / sitemap / IndexNow · canonical domain {{https://…}}.

## 9. Performance budgets
First load (desktop) ≤ {{900KB | 1.5MB | 3MB}} · max lazy step ≤ {{1.2MB}} · LCP < 2.5s · INP < 200ms · CLS < 0.1 ·
videos playing at once: 1 · fonts ≤ 4 files.

## 10. Pages (no-design pages)
Pages without their own design (privacy, terms, 404, thank-you, location/service clones) are built from the
patterns above. They get no new tokens and no new components.

## 11. Decisions on conflicts
| Date | Conflict | Decision | Why |
|---|---|---|---|
