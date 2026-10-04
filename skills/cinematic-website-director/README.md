# Cinematic Website Director

Master design-engineering OS for building non-generic, high-conversion websites.
Art direction → typography → scroll choreography → frontend production → adversarial QA.

## What this is

A **router**, not a monolith. It decides what to load based on the project's commercial
tier, then routes to process modules (what to decide) and craft references (what the
numbers actually are).

```
SKILL.md ──┬── modules/    process: what to decide, in what order, with what gates
           ├── references/ craft: real values — type scales, easings, contrast, budgets
           ├── templates/  the five locked artifacts
           ├── qa/         anchored rubrics, benchmark suite, audit history
           └── scripts/    deterministic gates (package linter + build auditor)
```

## Tier routing

The pipeline scales to the project's value. A $500 lead-gen site does not get three
competing directions and eight judges; a flagship build does.

| Tier | Value | Directions | Judges | Motion |
|---|---|---|---|---|
| T0 Rapid | $300–750 lead-gen | 1 | 3 | 0–1 |
| T1 Standard | $1.5k–5k SMB | 2 | 5 | 1–2 |
| T2 Premium | $5k–25k brand | 3 | 8 | 2–3 |
| T3 Flagship | award-submission | 3 + hybrid | 8 + perf veto | 3–4 |

**Conversion, responsive and accessibility thresholds do not drop as the tier drops.**
Cheap sites get less art direction, never less usability.

## What changed in 7.1

7.0 was a well-structured governance document with no craft in it — 1,211 lines telling a
model *that* it must lock a typography system, without a single scale ratio, easing curve,
contrast target, or line of code. Process without craft produces confident mediocrity,
which is the exact failure the skill exists to prevent.

7.1 keeps the governance skeleton and adds the muscle:

- **8 craft references** with real numbers — `clamp()` scales, cubic-beziers, duration
  ladders, contrast ratios, spacing tokens, GSAP patterns, performance budgets
- **Tier router** so pipeline cost matches project value
- **Anchored scoring rubric** with forced-fail conditions — replacing "≥9.5" gates that
  an LLM self-scores at 9.4 every time
- **`scripts/audit_build.py`** — a deterministic anti-slop, accessibility and performance
  gate that does not rely on model opinion
- **`scripts/audit_skill.py`** — a real linter (reference integrity, craft coverage,
  contradiction sweep) replacing a substring check
- **Effect library** indexing the 30 tested `cinematic-website-builder` modules rather
  than discarding them
- **Ecosystem handoff contracts** for the rest of the Space Age stack

Full defect list: `qa/AUDIT_LOG.md`.

## Usage

```bash
# Lint the skill package itself
python3 scripts/audit_skill.py --verbose

# Gate a produced build before delivery
python3 scripts/audit_build.py path/to/site.html --tier T1
python3 scripts/audit_build.py ./dist --tier T2 --json
```

## Artifacts produced

`DESIGN_DNA.md` · `TYPOGRAPHY_SYSTEM.md` · `MOTION_MAP.md` · `BUILD_CONTRACT.md` ·
`QA_LEDGER.md` — templates in `templates/`.

## Install

Copy the whole directory into the platform's skill folder. Keep relative paths intact —
the router depends on them, and `audit_skill.py` verifies them.

For non-Claude runtimes (Codex, Gemini/Antigravity, Hermes, Grok, Cursor): expose
`SKILL.md` as the master instruction and preserve `modules/`, `references/`, `templates/`,
`qa/`. **Do not flatten everything into one prompt** — the whole design is routing the
smallest sufficient module set.

## Honest limitation

This package can prove it is internally consistent, executable, economically routed and
deterministically gated. It cannot prove a given run wins an award. Run
`qa/BENCHMARK_SUITE.md`'s 15 briefs against your target runtime and record the results
before claiming more.
