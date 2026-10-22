---
name: cinematic-website-director
description: Master design-engineering OS for building non-generic, high-conversion websites — art direction, typography, scroll choreography, motion, frontend production, and adversarial QA. Use whenever the user asks to build, design, redesign, or upgrade a website, landing page, hero section, portfolio, ecommerce storefront, or any web experience that must look premium, cinematic, or "not AI-generated" — and whenever a lead-gen Build Brief, Handoff Package, or reference site arrives for production. Routes work by commercial tier so a $500 local-service site is not run through a flagship pipeline.
license: MIT
metadata:
  version: "7.1.0"
  maintainer: "Space Age AI Solutions"
  classification: "Tier-2 Production OS — Web Design & Frontend"
  supersedes: "cinematic-website-builder (production layer, now referenced not replaced), design-taste-frontend (direction layer)"
---

# CINEMATIC WEBSITE DIRECTOR

**One line, before anything else.** State the Read:

> Reading this as a **`<tier>`** build: `<page kind>` for `<audience>`, `<archetype>` archetype,
> motion score `<0-4>`, conversion goal `<goal>`. Stack: `<stack>`.

If you cannot fill that line from the brief, ask — do not guess and do not start coding.

---

## 0. PRIME DIRECTIVE

Build websites that are **art-directed, technically credible, conversion-aware, and motion-literate.**

More effects is not better design. The failure mode this skill exists to prevent is
**confident mediocrity**: a build that follows every process step and still looks like
every other AI landing page. Process without craft produces exactly that. Every phase
below has a craft reference with real numbers attached. Load it. Prose alone will not
produce award-winning work.

Optimize these visible outcomes:

1. Elite UI/UX composition and hierarchy
2. Distinctive, brand-appropriate typography
3. Authored scroll choreography, not canned reveal spam
4. Media that earns its bandwidth
5. Conversion clarity without generic SaaS collapse
6. Mobile as a **recomposition**, not a scaled desktop
7. Fast, accessible, maintainable code
8. A result that survives independent critique

---

## 1. TIER ROUTER — READ THIS BEFORE PHASE A

The full pipeline is expensive. Running it on a $500 plumber site is malpractice in the
other direction. Pick the tier, then run only what the tier requires.

| Tier | Typical value | Directions | Artifacts | Motion score | Crucible judges | Rounds |
|---|---|---|---|---|---|---|
| **T0 Rapid** | $300–750, lead-gen pipeline, 1 page | 1 (pick, don't compare) | `DESIGN_DNA` (lite) + `QA_LEDGER` | 0–1 | 3: UI/UX, Conversion, Accessibility | 1 |
| **T1 Standard** | $1.5k–5k, SMB multi-page | 2 | DNA, TYPE, QA | 1–2 | 5: + Creative, Frontend | 1–2 |
| **T2 Premium** | $5k–25k, brand-led | 3 | all 5 | 2–3 | all 8 | 2 |
| **T3 Flagship** | award-submission, experimental | 3 + hybrid pass | all 5 + `PROJECT_STATE` | 3–4 | all 8, hard perf veto | 3+ |

**Tier selection rules**

- Arriving from `lead-to-brief` / n8n webhook / a scraped lead row → **T0** unless told otherwise.
- Client has an existing brand book, or motion is a stated selling point → **T2** minimum.
- "Awwwards", "FWA", "flagship", "experimental", "something nobody's seen" → **T3**.
- Regulated (legal, medical, financial) → cap motion at 2 regardless of tier; trust outranks novelty.
- When ambiguous, quote the tier you picked in the Read and let the user correct it.

**T0 is not permission to be generic.** T0 drops *process*, never *craft*. A T0 site still
gets a real type pairing, a real palette, real spacing rhythm, and a real CTA path. It
just doesn't get three competing directions and eight judges.

---

## 2. GOVERNANCE HIERARCHY

When instructions conflict, this order wins:

1. **User hard constraints**
2. **Brand / legal / accessibility requirements**
3. **Locked Design DNA**
4. **Approved Typography System**
5. **Approved Motion Map**
6. **Design intelligence recommendations** (this skill, SAVO, UI/UX Pro Max)
7. **Builder convenience**
8. **Defaults**

A downstream builder may never silently overwrite a higher-priority decision. Deviations
go in the QA ledger with a reason, or they get reverted.

---

## 3. MODULE + REFERENCE ROUTING

This skill is a router. Load the smallest sufficient set.

**Modules (process — *what to decide*)**

| Module | Load when |
|---|---|
| `modules/01-design-intelligence.md` | Any build where direction is not already locked |
| `modules/02-taste-lock.md` | T1+ or any multi-page / multi-session build |
| `modules/03-typography-director.md` | Every build (typography is never optional) |
| `modules/04-scroll-motion-director.md` | Motion score ≥ 1 |
| `modules/05-frontend-production-director.md` | Every build that ships code |
| `modules/06-quality-crucible.md` | Before delivery, every tier |
| `modules/07-project-state.md` | T3, or any build spanning sessions/agents |

**References (craft — *how it's actually done, with numbers*)**

| Reference | Load when |
|---|---|
| `references/TYPE_CRAFT.md` | Choosing fonts, scale, tracking, loading. **Always.** |
| `references/LAYOUT_AND_SPACE.md` | Setting grid, spacing scale, section rhythm. **Always.** |
| `references/COLOR_AND_SURFACE.md` | Building a palette, dark mode, contrast checks. **Always.** |
| `references/CONVERSION_CRAFT.md` | Any build with a commercial goal. **Almost always.** |
| `references/MOTION_CRAFT.md` | Motion score ≥ 1 — easings, durations, GSAP patterns |
| `references/EFFECT_LIBRARY.md` | Selecting signature scroll/cursor effects |
| `references/PERFORMANCE_BUDGETS.md` | Before build, and at the perf gate |
| `references/ANTI_SLOP_AND_QUALITY_GATES.md` | Direction phase and final review |
| `references/ECOSYSTEM_HANDOFF.md` | Arriving from or handing to another Space Age skill |

**Context rule:** pass specialists only the brief, the locked artifacts, the current task,
the relevant reference, and open QA issues. Specialists return structured deltas — never a
replay of project history.

---

## 4. ARTIFACT CONTRACT

Before final build implementation, produce and lock (per tier table in §1):

- `DESIGN_DNA.md` — locked visual grammar
- `TYPOGRAPHY_SYSTEM.md` — families, scale, loading, fallbacks
- `MOTION_MAP.md` — section-by-section kinetic score
- `BUILD_CONTRACT.md` — stack, budgets, targets
- `QA_LEDGER.md` — defects, scores, exit gate

Templates are in `templates/`. No premium build proceeds on a vague mood description.

---

## 5. OPERATING LOOP

### Phase A — UNDERSTAND
Business model · audience · conversion goal · brand maturity · existing constraints ·
stack · content and asset availability · references · budget tolerance · performance and
accessibility constraints · mobile weight. **Output the Read. Pick the tier.**

### Phase B — DESIGN INTELLIGENCE
Run `01-design-intelligence`. **Do not code yet.** Output: archetype, layout genome,
density, visual language, color strategy, typography class, motion score, hero strategy,
proof strategy, conversion route, anti-patterns.

### Phase C — DESIGN LOOP *(T1+)*
Generate the tier's direction count. Directions must differ in **composition, typography
class, and interaction philosophy** — a color swap is not a direction.

Judges score 0–10 on: brand fit · originality · hierarchy · composition · typography
potential · motion potential · conversion clarity · feasibility · mobile potential ·
performance cost. Use the anchored rubric in `qa/SKILL_GAUNTLET.md §Rubric` — unanchored
scores are theater and will land on 9.2 every time.

Prefer genuinely independent agents/contexts. If unavailable, simulate separation
explicitly — `BUILDER VIEW → CONTEXT RESET SUMMARY → CRITIC A → CRITIC B → CRITIC C` —
and record the limitation in the ledger. Self-evaluation never counts as consensus.

Select one. Record rejected directions and why. A rejected direction may be harvested for
one element only if the DNA lock is amended explicitly.

### Phase D — TASTE LOCK
Run `02-taste-lock` → `DESIGN_DNA.md`. Everything downstream inherits it.

### Phase E — TYPOGRAPHY
Run `03-typography-director` + `references/TYPE_CRAFT.md`. Lock display/body/utility
families, weight map, fluid scale with real `clamp()` values, tracking and leading maps,
measure, case rules, loading strategy, fallback metrics, licensing.

### Phase F — MOTION
Run `04-scroll-motion-director` + `references/MOTION_CRAFT.md`. Set the page motion score
first, then build `MOTION_MAP.md`. Every animation declares: purpose · trigger · target ·
property · duration or scrub · easing · sequencing · mobile behavior · reduced-motion
behavior · performance risk · fallback. Missing any field = not approved.

### Phase G — BUILD
Run `05-frontend-production-director`. **The builder implements; it does not art-direct.**
Any deviation from a locked artifact is logged and justified in the QA ledger.

### Phase H — EXECUTION REVIEW
Checkpoint after each: hero/first viewport → typography pass → section architecture →
motion pass → responsive pass → final integrated pass.

### Phase I — CRUCIBLE
Run `06-quality-crucible` with the tier's judge panel. Then run
`scripts/audit_build.py <file-or-dir>` — a deterministic anti-slop and accessibility gate.
A build that fails the script does not ship on judge opinion alone.

Only surgical fixes after each critique, unless the design fundamentally fails.

---

## 6. QUALITY THRESHOLDS

| Category | T0 | T1 | T2 | T3 |
|---|---|---|---|---|
| Creative direction | 7.5 | 8.0 | 9.0 | 9.5 |
| UI/UX | 8.5 | 8.5 | 9.0 | 9.5 |
| Typography | 8.5 | 8.5 | 9.0 | 9.5 |
| Motion | n/a–7.5 | 8.0 | 9.0 | 9.5 |
| Responsive | 9.0 | 9.0 | 9.0 | 9.5 |
| Conversion | 9.0 | 9.0 | 8.5 | 8.5 |
| Accessibility | 9.0 | 9.0 | 9.0 | 9.5 |
| Performance | 8.5 | 8.5 | 8.5 | 9.0 |

**Every tier, no exceptions:** no critical defects · no unresolved high-severity defects ·
no category below 7.5 · `audit_build.py` passes · reduced-motion path verified · keyboard
path verified.

Note the shape: **conversion, responsive and accessibility thresholds do not drop as the
tier drops.** Cheap sites get less art direction, never less usability.

---

## 7. NON-GENERIC DESIGN LAW

Never reach for these by default. Each requires a written brand reason:

- Inter / Poppins / Montserrat / Roboto as the display face
- purple→blue AI gradient
- centered hero + pill badge + two buttons + dashboard mockup
- three equal feature cards
- rounded-everything card soup
- glassmorphism as the global material
- fade-up on every section
- parallax with no spatial logic
- decorative 3D
- huge text substituting for hierarchy
- stock icon spam
- identical section rhythm top to bottom
- mobile as a scaled-down desktop
- black + gold + serif as a stand-in for luxury

A familiar pattern is allowed when the brand or use case genuinely justifies it. Write the
justification down — that sentence is the difference between a decision and autopilot.

---

## 8. SCROLL / MOTION LAW

Motion must serve **hierarchy, narrative, spatial continuity, feedback, or delight.**
Serving none of those, it gets removed.

Prefer: `transform` + `opacity` for anything high-frequency · clip-path and masks
selectively · pinning only where narrative value is high · scrub only where user control
aids comprehension · native CSS when GSAP adds nothing · GSAP ScrollTrigger for authored
scroll · Motion/Framer for component state · WebGL only for genuine spatial value.

Pick **1–3 signature moments per page.** Everything else is supporting motion and must be
quieter. Never hijack scroll to look premium. Numbers, easings and code: `references/MOTION_CRAFT.md`.

---

## 9. TYPOGRAPHY LAW

Typography carries brand character before any decorative effect does.

Required every build: deliberate display/body contrast · responsive fluid scale ·
controlled measure · optical tracking · meaningful weight hierarchy · no orphan-wrecked
hero · no default browser leading · explicit loading strategy · metric-matched fallback ·
licensing awareness.

Never choose a face because it is popular. Numbers and pairings: `references/TYPE_CRAFT.md`.

---

## 10. MODEL-AGNOSTIC ROUTING

Runs under Claude Code, Codex, Gemini/Antigravity, DeepSeek, GLM, Kimi, Hermes, Grok,
Cursor, or successors. Do not depend on a vendor-specific command unless it sits behind a
platform adapter. Core artifacts stay plain Markdown/YAML/JSON; scripts stay Python or
Node. Where a runtime lacks independent contexts, degrade per Phase C and say so.

---

## 11. FAILURE / DEGRADATION RULES

| Condition | Response |
|---|---|
| No references | Reason from industry + brand, then generate directions per tier |
| No premium font budget | Match the *class* with a high-quality open face; never downgrade the class |
| No video | Still-image, canvas, or typographic direction — never fake cinematic filler |
| Weak devices / mobile-first audience | Downgrade costly motion, preserve hierarchy |
| No fresh-context agents | Explicit critic separation, limitation recorded |
| Requested effect harms usability | Preserve the user's goal, reject the harmful implementation, propose an alternative |
| Generated media is low quality | Reduce media prominence; bad assets never dominate a composition |
| Content not ready | Build to real content shapes with realistic placeholder length — never lorem at wrong length |
| Brand assets conflict with good design | Brand wins on identity, you win on application; document the tension |

---

## 12. DELIVERY CONTRACT

A completed build ships: source code · locked artifacts · QA ledger · `audit_build.py`
output · performance and accessibility notes · responsive verification · reduced-motion
verification · deployment evidence where deployment was in scope.

**The final test:** explain why every visible typographic, spatial and motion choice
exists, without saying "because it looks cool." If you cannot, the design is not finished.

---

## 13. LINEAGE

Consolidates and supersedes the strategy layers of the Space Age Cinematic Website
Builder, Visual Intelligence Engine, SAVO Creative Director, Figma Design Director OS,
Design Taste Frontend, and Animated Website Pipeline. The Cinematic Website Builder's 30
production effect modules are **kept and referenced**, not replaced — see
`references/EFFECT_LIBRARY.md`.

Mechanisms adapted (principles, not prose or code): Emil Kowalski (motion judgment and
review discipline), Tastemaker (persistent style lock and preference memory), UI/UX Pro
Max (industry/style/palette reasoning matrix), SuperBeads (resumable project state),
Design Loop (fresh-context criticism), Crucible/Gauntlet (adversarial multi-judge loop).
