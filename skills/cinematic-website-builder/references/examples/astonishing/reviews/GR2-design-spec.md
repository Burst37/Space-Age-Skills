# Goldfish review GR2 — design-spec.md (Astonishing Touch worked example)

Round 1 of max 2, 15 Nov 2026. Target: `design-spec.md` as it stood in v3.3.0 (106 lines). Reviewer inputs only: the spec, the CWB rule
files in each packet (type-picker, spacing-system, video-per-section, subtle-cinematic, taste-profile, playbook §4–§7), and the live
preview. No conversation, no FINDINGS.md.

## Reviewer status
| Lens | Status |
|---|---|
| brand-and-type | completed |
| accessibility | completed |
| motion-and-performance | completed |
| conversion | completed |

## Findings
| ID | Sev | Lens | Scope | Finding | Evidence | Decision |
|---|---|---|---|---|---|---|
| GR2-1 | blocker | brand-and-type | Typography; Conflicts row 1 | Rules Georgia headings "allowed". In 3.3 that fails G8: verify --type blocks headings in a system font or undeclared family, and §7 caps type at 2 families (spec has Georgia + Arial + Satoshi). The type picker on the same inputs picks care-modern-serif, so spec and picker disagree with no ruling. | scripts/verify.mjs L403–404; CWB §7 "max 2 families"; `type-specimens.mjs … --mode auto` → care-modern-serif (Erode 500 + Satoshi 400/700) | fix: type block = picker pick; Chuma confirms at the G3 type screen |
| GR2-2 | blocker | brand-and-type | whole doc | No SEO/AEO plan section. G5 requires it in the spec (build chain P15 and verify read it there). The 3.3 G5 exit test ("no TODOs") passes this doc anyway. | CWB §2 G5; seo-aeo-gate.md §1 "Output lands in handoff/design-spec.md §8" | fix: §SEO/AEO plan added |
| GR2-3 | should | accessibility | Typography; fluid scale "Body 1–1.13rem" | Body floor 16px is under the home-care minimum of 17px. Live paragraphs render at 14–16.8px in places (16px, 15.2px, 14.4px, 14px runs on `/`). | subtle-cinematic.md "body ≥ 17px"; live `/` computed font sizes | fix: body clamp(1.0625rem…1.1875rem), small-text floor 0.8125rem |
| GR2-4 | should | brand-and-type | Spacing, radius, grid | Raw px spacing (110/80/65px, 4px unit) instead of 3.3 tokens; no --section-y level. The greybox renders tokens, so the approved wireframe and this spec would disagree. | spacing-system.md "Tokens only", "Pick one per site (--section-y)" | fix: tokens + --section-y-gentle |
| GR2-5 | should | brand-and-type | Personality; Typography | No decision on the jumbo signature or a custom-type style; taste profile defaults both, subtle-cinematic allows calm jumbo. Silent = undefined. | taste-profile.yaml type.signature: jumbo; subtle-cinematic.md §Type | fix: calm jumbo on the promise word only, custom type off (no real clients cut out); confirmed at G3 |
| GR2-6 | should | motion-and-performance | Media | States the problem but locks no numbers: no tier budget, poster/clip caps or the video-chapters one-at-a-time rule. | video-per-section.md rules 1, 2, 7; CWB §10.6 | fix: numbers added |
| GR2-7 | nit | accessibility | Color | Teal #007f88 on mint #edf4f4 = 4.29:1, under 4.5 for small text; the live step numbers "01/02/03" are 12.8px teal on mint. | computed WCAG ratio; live `/` next-step numbers | fix: small text on mint uses navy |
| GR2-8 | nit | accessibility | A11y | Teal focus ring on navy buttons = 2.99:1, just under 3:1. | computed ratio | contest: no navy-filled focusable control found on the live pages (primary CTA is a light chip); axe at G8 re-checks |
| GR2-9 | nit | brand-and-type | Spacing, radius | Five radius values; pick 2–3. | CWB §7 tokens only | fix: 3 radii |
| GR2-10 | nit | motion-and-performance | Media | No placement for the AI-imagery disclosure line. | subtle-cinematic.md AI disclosure | fix: caption + footer line |
