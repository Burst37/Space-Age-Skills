---
name: page-upgrade
description: Client existing page audit and upgrade workflow. Analyzes a live URL or pasted HTML, scores current state, and produces upgraded version with VL-01 design system applied.
allowed-tools: WebFetch, Read, Write, Bash
---

# PAGE UPGRADE
## Space Age AI Solutions — Existing Page Audit & Upgrade

## When to load this skill

- User provides a URL and asks to improve/upgrade the page
- User pastes existing HTML and wants it redesigned
- Client site needs Space Age VL-01 design system applied
- "Make this look better", "upgrade this page", "redesign this"

---

## PHASE 1 — AUDIT

### 1.1 Fetch and Analyze

1. Fetch the URL (or read pasted HTML)
2. Score current state across 5 dimensions:

```
DESIGN SCORE (1-10):
- Visual hierarchy clarity
- Typography quality
- Color system coherence
- Spacing and layout
- Mobile responsiveness signals

CONVERSION SCORE (1-10):
- CTA clarity and placement
- Value proposition above fold
- Trust signals present
- Friction points identified
- Headline effectiveness

PERFORMANCE SCORE (1-10):
- Asset optimization signals
- JavaScript blocking signals
- Font loading approach
- Image optimization

SEO SCORE (1-10):
- Heading structure
- Meta description present
- Semantic HTML usage
- Content relevance

BRAND SCORE (1-10):
- Consistency with brand identity
- Professional presentation
- Trust and authority signals
```

### 1.2 Issue Prioritization

Rank issues by impact:
1. **Critical** — actively hurting conversions
2. **High** — significant improvement opportunity
3. **Medium** — polish and consistency
4. **Low** — minor improvements

---

## PHASE 2 — UPGRADE PLAN

Before writing code, present:
1. Audit scores with 1-sentence explanation each
2. Top 5 issues to fix (with expected impact)
3. Proposed upgrade approach
4. Confirm with user before executing

---

## PHASE 3 — EXECUTION

Apply upgrades in priority order:

1. **Apply VL-01 design system** (via `sa-design-md` tokens)
2. **Restructure conversion flow** (CTA placement, hierarchy)
3. **Typography upgrade** (Orbitron/DM Sans/JetBrains Mono)
4. **Animation layer** (via `SA-immersive-reveal` if applicable)
5. **Performance optimizations** (lazy load, font strategy)

---

## PHASE 4 — DELIVERY

Deliver:
1. Upgraded HTML file
2. Before/after score comparison
3. List of changes made
4. Recommended next steps (imagery via Higgsfield, Vercel deploy, etc.)

---

## WHAT TO AVOID

- Don't upgrade without the audit phase first
- Don't change brand identity without brand-extractor confirmation
- Don't add dependencies (npm packages) for single-file HTML upgrades
- Don't over-engineer — upgrade is improvement, not full rebuild
