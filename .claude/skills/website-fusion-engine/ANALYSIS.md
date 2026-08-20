# Website Fusion Skill — Forensic Analysis & 10x Rebuild Plan

Analyzed three artifacts:
1. `space_age_website_fusion_skill_v3.2.0.zip` (folder inside: `v3.1.0`) — 13-platform distribution
2. `WEBSITE_FUSION_MASTER_SKILL_v41.md` — newer v4.0.0 master ("website-fusion-engine")
3. `WEBSITE_FUSION_ONBOARDING_SHEET.md` — 86-question client intake sheet

Analysis run through three lenses: **caveman** (strip jargon, state the raw truth), **karpathy** (first-principles + eval-driven: what actually moves the needle), **superpowers** (disciplined workflow: design → plan → TDD → verify).

---

## 1. What this thing actually is

A skill that turns one or more reference websites into a new, authorized website — clone, rebrand, remix, migrate, or "inspired-by." Distributed across 13 agent platforms (Claude, Cursor, Codex, Gemini, Windsurf, Cline, Roo, Continue, Augment, OpenCode, Amazon Q, GitHub Copilot, generic agents).

The genuinely good ideas inside it:
- **Evidence over claims** — never report a crawl/test/deploy as done unless the artifact exists. (Best idea in the whole package.)
- **Keep / Adapt / Replace / Drop** decision model per technique.
- **Source routing / remix matrix** — every section traces to a source.
- **Motion is structural** — clones fail when they screenshot-match and ignore motion.
- **Mode selection** — faithful / rebrand / remix / inspired-by / migration.
- **Truthful completion contract** + status template.

These are worth keeping. Everything below is what's broken or missing.

---

## 2. Caveman truth: it is a 1,200-line rulebook about being careful, with almost no web-dev craft

Count it. v4.0.0 is **1,219 lines**. How many teach you *how to rebuild* a pinned scroll section, a fullscreen menu, a route transition, a horizontal gallery? **Roughly zero.**

It defines a *schema* for motion ("record trigger, target, initial, final, duration, easing…") but never shows the GSAP / Lenis / Framer / CSS that produces it. It is project-management paperwork cosplaying as a web-development skill. A senior front-end dev reading it would say: "This is procurement. Where is the engineering?"

**This is the single biggest gap, and closing it is where 90% of the 10x lives.**

---

## 3. The tooling is vapor (v3) / the dependencies are assumed (v4)

**v3.1.0** commands the agent to run:
```
node tools/fusion-cli.mjs doctor --json
node tools/fusion-cli.mjs validate <manifest>
node tools/secret-scan.mjs --root <project>
node tools/fusion-cli.mjs gate <project>
```
**None of those files ship in the zip.** There is no `tools/` directory. There is no `references/` directory either — yet SKILL.md ends by pointing at **19 reference files** (`references/workflow.md`, `references/motion-reconstruction.md`, …) that do not exist. The entire start gate, implementation gate, and progressive-disclosure layer is dead links.

**v4.0.0** quietly drops the fake CLI commands (good — stops lying about tools) but replaces the problem with a **31-module "Required Skill Registry"** that assumes external skills are installed (`using-superpowers`, `brainstorming`, `writing-plans`, `using-git-worktrees`, …). Same disease, new host: the skill depends on machinery it does not ship and cannot verify.

**Rule for the rebuild: if the skill says "run this," the file ships and runs. If it says "use this skill," it degrades gracefully when that skill is absent.**

---

## 4. Karpathy: what's the eval? The process is too heavy to ever actually run

First-principles question: hand this to a real agent with a real job ("rebuild this Awwwards site on Next.js"). Does the **86-question questionnaire + 7 gates + 32 modules + ~30 JSON artifacts** make the output site *better*, or does the agent drown?

Honest answer: the agent will either (a) skip most of it and pretend it complied, or (b) emit 30 JSON files nobody downstream reads. **There is no forcing function tying the paperwork to output quality.** A `motion-map.json` that no builder consumes is pure waste.

Two consequences:
- **One-size-fits-maximum.** A 5-section landing-page rebrand is forced through the same 7 gates as a 40-page motion-led flagship. The process must *scale to the job*.
- **Artifacts without consumers.** Every artifact needs a named downstream reader, or it gets faked.

The empty `evals/fixtures/good.md` (0 bytes) and one-line `bad.md` prove the point: there is no real eval. A skill about faithful reproduction ships with no way to measure faithfulness.

---

## 5. Hygiene / trust defects

| Defect | Evidence |
|---|---|
| Version chaos | zip = `v3.2.0`, folder = `v3.1.0`, secret-scan = `v3.1.0`, new master = `v4.0.0`. |
| Name churn | `cloning-and-remixing-websites` (v3) → `website-fusion-engine` (v4). Breaks invocation + trigger matching. |
| Leaked build path | `docs/qa/secret-scan.json` → `"root": "/mnt/data/website_fusion_fix/..."` ships the author's machine path. |
| Phantom scan | secret-scan claims `"scanned_files": 99` but the zip contains **16** files. The QA artifact is itself fabricated — ironic for an evidence-first skill. |
| Empty evals | `good.md` 0 bytes; `bad.md` one line. |
| Duplication | Onboarding sheet duplicates §6 of the master verbatim (86 Qs in two files = drift risk). |
| Monolith | Everything in one always-loaded file; the references model is described but never delivered. |

---

## 6. The 10x rebuild (senior UI/UX + web-dev synthesis)

10x is **not more rules**. It is the opposite: make the resulting websites better *and* make the process actually runnable. Six moves:

1. **Ship the missing 90% — real web craft.** On-demand reference docs with copy-paste-ready recipes: Lenis smooth-scroll, GSAP ScrollTrigger pin/scrub, FLIP route transitions, clip-path fullscreen menu, responsive + `prefers-reduced-motion`, framework/library detection from network+DOM evidence, design-token extraction from computed styles.

2. **Make it runnable — ship the tools it references.** A real `fusion.mjs` CLI (`doctor`, `validate`, `gate`, `scan`, `init`) and a real Playwright `forensics.mjs` capture script. No dead commands.

3. **Cut ceremony with progressive disclosure.** SKILL.md drops to a ~180-line decision spine + pointers. The 86-question intake moves to a reference loaded only at onboarding. 32 modules collapse into ~6 phase docs.

4. **Tier the process to the job.** `quick` (1 page / inspired-by) → `standard` → `flagship` (motion-led / multi-source / exact). Gates that fire scale with tier. Biggest usability fix.

5. **Tie every artifact to a consumer + a real eval.** Each artifact names the build step that reads it. Real fixtures + a scored visual/motion audit replace the empty placeholders.

6. **Fix distribution.** One canonical SKILL.md → thin auto-generated adapters via a shipped build script. Keep the `AUTO-GENERATED` header idea from v3.

Result: from a "compliance document the agent fakes" to "a runnable senior-engineer toolkit that produces measurably faithful sites and scales from a landing page to a flagship build."
