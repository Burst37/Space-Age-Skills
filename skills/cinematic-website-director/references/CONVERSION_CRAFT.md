# Conversion Craft

> Beautiful and converting are not in tension. Every rule here is compatible with elite
> art direction — the failure mode is designers who treat conversion as someone else's job
> and marketers who treat design as decoration.

## 1. One primary action per page

Name it before designing. Everything else on the page is secondary or tertiary.

| Business type | Primary action | Secondary |
|---|---|---|
| Local service (HVAC, plumbing, legal) | **Call now** (tap-to-call) | Request a quote |
| Restaurant | Reserve / Order | View menu |
| Ecommerce | Add to cart / Shop | Browse collection |
| B2B SaaS | Start free / Book demo | See pricing |
| Portfolio / agency | Start a project | View work |
| Real estate | Book a viewing | Browse listings |
| Nonprofit | Donate | Read the story |

**Local-service rule:** phone number visible in the header on mobile, `tel:` linked, and a
sticky call bar. This one pattern moves conversion more than any visual decision on the
page. It is non-negotiable on the lead-gen pipeline.

## 2. CTA hierarchy

- **Primary** — solid fill, the most saturated color on the page, one per viewport.
- **Secondary** — outline or subtle surface, clearly lower contrast.
- **Tertiary** — text link with an affordance (underline or arrow).

Rules: never two primary CTAs side by side (that is zero primary CTAs) · button copy is
a verb phrase describing what the user gets, not what the system does — "Get my quote"
beats "Submit" · CTA repeats after each major proof section on long pages · the final
CTA section is the second-most-designed block on the page after the hero.

Minimum touch size 44×44px. Minimum visual button height 44px mobile / 40px desktop.

## 3. Proof architecture

Ranked by strength:

1. **Specific numbers with attribution** — "cut response time 4.2s → 0.8s, Acme Corp"
2. **Named testimonial with photo and role**
3. **Recognizable client logos**
4. **Case study with before/after**
5. **Certifications, licenses, insurance** (critical for trades and regulated)
6. **Review aggregate with source** — "4.9★, 312 Google reviews"
7. **Years in business / jobs completed**
8. Unattributed testimonial *(weak)*
9. Stock-photo "team" imagery *(negative value — actively erodes trust)*

Place at least one proof element **above the fold** on any commercial page. Trades and
local services: license number, insurance status, and service area go above the fold.

## 4. Friction

Every field removed raises completion. Ask only for what you need to make the next contact.

| Fields | Typical completion |
|---|---|
| 1–3 | highest |
| 4–6 | moderate drop |
| 7+ | severe drop — justify each field or cut it |

- Labels above fields, always. Placeholder-as-label fails accessibility and memory.
- Inline validation on blur, not on every keystroke.
- Correct `type` and `autocomplete` attributes — `type="tel"`, `inputmode="numeric"`,
  `autocomplete="email"`. This is free conversion on mobile.
- Errors: specific, adjacent to the field, and never color-only.
- Say what happens next: "We'll call you back within 2 hours."
- Never require account creation before value.

## 5. The above-fold contract

See `LAYOUT_AND_SPACE.md §6`. Restated commercially: within the first viewport the user
must be able to answer *what is this*, *is it for me*, *can I trust it*, and *what do I do
next*. A hero that is purely atmospheric fails three of four — which is acceptable for a
fashion or art brand and fatal for a service business. Match the hero archetype to the
trust requirement, not to the mood board.

## 6. Copy the design depends on

Do not build a beautiful frame around empty language.

- Headline: the outcome or the claim, not the category. "Your AC fixed today, or it's
  free" beats "Premium HVAC Solutions."
- Subhead: who it is for, and the differentiator, in one sentence.
- Never ship lorem ipsum at the wrong length. Write realistic placeholder copy at the
  real length so the layout is tested against reality.
- Local SEO: real service-area names in real sentences — load the `local-business-seo`
  skill for schema, NAP consistency, and GBP wiring on any local build.

## 7. Trust signals by industry

| Industry | Must show |
|---|---|
| Trades / home service | License #, insurance, service area, response time, real job photos |
| Legal | Bar admission, practice areas, case results with disclaimer, real photography |
| Medical | Credentials, board certification, privacy/HIPAA posture, accessibility |
| Financial | Registration/disclosure, security posture, plain-language fees |
| Ecommerce | Returns policy, shipping time, secure checkout, real product photography |
| B2B SaaS | Security/compliance badges, uptime, named customers, real pricing |

## 8. Conversion QA checklist
- [ ] One named primary action; one primary CTA per viewport
- [ ] Primary CTA is the most saturated element on the page
- [ ] CTA copy is a verb phrase stating the user's gain
- [ ] Proof element above the fold on commercial pages
- [ ] Phone is `tel:`-linked and visible on mobile (local service)
- [ ] Form has the minimum viable field count; labels above fields
- [ ] Correct `type` / `inputmode` / `autocomplete` on every input
- [ ] "What happens next" stated at the point of submission
- [ ] Above-fold contract satisfied on mobile with browser chrome visible
- [ ] No stock "team" photography standing in for real proof
