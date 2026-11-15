# Does the goldfish review help? Astonishing Touch test (v3.4, 15 Nov 2026, America/Chicago)

**Question:** run against the same hand-off docs, does an EGM-style goldfish review find real problems that the 3.3.0 doc gates miss?

**Docs under test:** the v3.3.0 worked example `brief.md` (70 lines) and `design-spec.md` (106 lines), written by an earlier agent
from the live preview. **Source of truth:** the live preview `https://astonishing-touch-healthcare-lx888d8ej.vercel.app/` (Playwright,
computed styles, JSON-LD, page text), the skill's own scripts and rule files.

## Method and its limits (read this first)
- **Baseline (3.3.0):** every automated check that runs at the doc gates: `greybox.mjs` lint on `wireframe.yaml`, `type-specimens.mjs
  --mode auto` on `type-inputs.yaml`, and the G5 exit test "design-spec and page-text have no TODOs". Plus the docs' own conflict logs
  (the elephant's self-check).
- **Goldfish:** the 8 website lenses in `goldfish-lenses.yaml`, 4 per gate. Reviewer inputs were only the target doc, the lens's rule files
  and the live URL. The reviewer had not read `FINDINGS.md` (the earlier forensic audit) or the conversation before reviewing.
- **Not a true multi-agent run.** This harness (a Grok Bot executor) had no tool to spawn fresh subagents, so all 8 lenses were run
  by one reviewer instance, one lens at a time, a different agent from the docs' author but not isolated per lens. A real run
  launches one fresh subagent per packet (`goldfish.mjs pack`), which should be at least as independent.
- Every finding was then checked against the live site / code. Counts below are from that check. Sample size: one project, two docs.

## Results
| | Baseline 3.3.0 doc gates | Goldfish GR1 + GR2 |
|---|---|---|
| Issues raised | 1 (greybox warn: 2 film sections in the first two sections) | 20 (3 blocker · 9 should · 8 nit) |
| Confirmed real | 1 | **14** (3 blocker · 7 should · 4 nit) + 1 partly right |
| Wrong (false positive) | 0 | 3 (GR1-6, GR1-9, GR2-8: elephant contested with evidence) |
| Judgment only | 0 | 2 (GR1-7, GR1-10) |
| Confirmed and not already known (doc log, FINDINGS.md, baseline) | — | **13** |
| Would have failed a later gate (G8 verify) | — | 1 (GR2-1: Georgia headings → `verify --type` blocks system-font headings) |
| Silent disagreement the baseline produced | type picker auto-chose `care-modern-serif` while the spec locked Georgia/Arial/Satoshi; nothing flagged it | flagged as GR2-1 |

### Confirmed findings no other check raised
- **GR1-1 (blocker):** live About copy says "licensed … in-home health care agency" and "Our Staff is licensed, certified, insured and bonded";
  the brief locks "nonmedical" and has no licence fact. Compliance risk the 3.3 audit called "honest home-care compliance".
- **GR2-2 (blocker):** the design-spec has no SEO/AEO plan section, which G5 requires; "no TODOs" let it through.
- **GR2-1 (blocker):** the spec's own ruling (Georgia allowed) contradicts `verify.mjs` L403–404 and the 2-family rule.
- **GR2-3:** body text floor 16px vs the home-care 17px rule; live paragraphs measured at 14–16.8px.
- **GR2-7:** 12.8px teal step numbers on mint = 4.29:1 (axe did not flag them in the 3.3 audit).
- GR1-3/4/5/8 (missing audience/proof, no machine-readable gates, 12 vs 5–8 commitments, no teardown/keywords), GR2-4/5/9/10 (raw px
  spacing, silent jumbo decision, 5 radii, no AI-disclosure placement).

### What changed in the revised docs
`brief.md`: front matter with gates and review flags; 8 commitments + build list; audience/promise and proof sections; licence, service
area and after-hours purpose turned into **ask** items (not invented); a ban on "licensed/health care agency" wording until the licence
is confirmed; G1 evidence section (teardown pending). `design-spec.md`: type = picker pick (Erode 500 + Satoshi 400/700, 2 families);
body 17–19px, small-text floor 13px; spacing tokens + `--section-y-gentle`; 3 radii; locked media numbers; AI-disclosure placement;
new SEO/AEO plan section; conflict log reversed on Georgia. Round 2 (re-running the two lenses that raised blockers) found no new
blocker; one nit left (spec does not use the template's §1–§11 numbering).

### GR3 drift (limited)
Built preview vs the original spec: 2 drifts confirmed by computed styles (body runs at 14–15.2px outside the spec's type scale;
teal small text on mint not described in the spec). Weak evidence either way, because this spec was extracted from this same site.

## Verdict: **modest-to-significant positive at the doc gates, not "huge" for the whole pipeline**
- Real gain: ~13 confirmed, previously unknown doc problems on one project, at the cheapest moment to fix them (before assets
  and code), including one compliance issue no tool in the skill checks and one guaranteed G8 failure.
- Cost: 8 reviewer runs + one resolve pass; 3 of 20 findings were wrong and 2 were opinion, so the elephant's contest step matters.
- It does not replace verify/axe/launch-check, which already catch most build-level defects (weight, crawl blocks, favicon).
  The overlap with the forensic audit was small (2 of 15 confirmed or partial findings).
- Unproven: the effect with truly isolated subagents, on a doc written *before* a build (this one was reconstructed after), and on more
  than one client. Re-measure on the next two real builds: count findings, confirmed rate, and how many would have reached code.
