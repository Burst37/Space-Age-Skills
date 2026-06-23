# addy-osmani-skills

Addy Osmani's (Google Chrome) production-grade coding agent skills — web performance, modern JavaScript patterns, AI-assisted development, and frontend architecture.

## Source
`addyosmani/agent-skills` on GitHub — clone into `~/.claude/skills/`

## What This Skill Covers
- Core Web Vitals optimization (LCP, INP, CLS, TTFB)
- JavaScript bundle analysis and splitting
- Image optimization pipelines
- React/Next.js performance patterns
- AI-assisted code review and refactoring
- Accessibility auditing
- Modern CSS architecture

## Slash Commands

### `/perf-audit`
Audit a page or component for performance issues.

**Steps:**
1. Check render-blocking resources (scripts without `defer`/`async`, render-blocking CSS)
2. Identify heavy dependencies — find alternatives or lazy-load them
3. Check image formats: use WebP/AVIF, add `width`/`height`, use `loading="lazy"` below fold
4. Find unused CSS/JS — suggest code splitting points
5. Check for layout shift sources (unsized images, fonts, dynamic content)
6. Output: issue list ranked by impact, each with a fix

### `/bundle-split`
Design a code-splitting strategy for a web app.

**Steps:**
1. Map routes — each route is a split point
2. Identify heavy third-party libs (moment, lodash, chart libraries) — lazy import them
3. Find shared chunks — extract to `vendor` bundle
4. Use dynamic `import()` for below-fold features
5. Output: import map with size estimates and load sequence

### `/web-vitals`
Measure and fix Core Web Vitals for a given page.

**LCP (Largest Contentful Paint — target < 2.5s):**
- Preload hero image: `<link rel="preload" as="image">`
- Avoid lazy-loading above-fold images
- Use `fetchpriority="high"` on LCP element

**INP (Interaction to Next Paint — target < 200ms):**
- Break up long tasks with `scheduler.yield()`
- Defer non-critical work with `requestIdleCallback`
- Avoid synchronous layout reads in event handlers

**CLS (Cumulative Layout Shift — target < 0.1):**
- Reserve space for images, ads, embeds
- Avoid inserting content above existing content
- Use `font-display: optional` or preload fonts

### `/ai-refactor`
Refactor a code section using AI-assisted patterns.

**Process:**
1. Identify the code smell: duplication, long function, mixed concerns, magic numbers
2. State the refactoring goal in one sentence before touching code
3. Apply one refactoring at a time — don't compound changes
4. Run tests after each step
5. Document WHY, not what

### `/a11y-check`
Audit a component or page for accessibility issues.

**Checklist:**
- [ ] All images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] All interactive elements reachable and operable by keyboard
- [ ] Focus indicators visible
- [ ] Form inputs have associated labels
- [ ] ARIA roles used only when semantic HTML is insufficient
- [ ] Dynamic content changes announced via `aria-live`

### `/modern-css`
Apply modern CSS patterns — no preprocessor needed.

**Patterns:**
```css
/* Container queries over media queries for components */
@container (min-width: 400px) { ... }

/* Logical properties for i18n-ready layouts */
margin-inline: auto;
padding-block: 1rem;

/* CSS custom properties for theming */
:root { --color-primary: oklch(60% 0.2 250); }

/* Cascade layers to avoid specificity wars */
@layer base, components, utilities;
```

## Performance Budget Template

| Metric | Budget |
|--------|--------|
| JS (compressed) | < 150KB |
| CSS (compressed) | < 50KB |
| LCP image | < 200KB |
| Total page weight | < 500KB |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

## When to Use
- Optimizing website performance before launch
- Reviewing frontend code for quality and efficiency
- Setting up performance monitoring
- Auditing React/Next.js apps for production readiness
- Building accessible, standards-compliant web experiences
