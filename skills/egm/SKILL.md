---
name: egm
description: >-
  Elephant-Goldfish Model (Google, Apache-2.0): design with full context (the
  elephant), then review with fresh-context reviewer subagents that never saw
  the conversation (goldfish). Seven skills: brainstorm, draft a software
  spec, review a document against live code, review loop with chosen
  reviewers, resolve findings, bootstrap docs for a codebase, drift report.
  Use for "review this design/PR plan/README with fresh eyes", "draft a spec",
  "does the code match the design". Reviews need isolated subagents.
source: https://github.com/google/elephant-goldfish-model (Apache-2.0, v0.1.1)
version: 1.0.0
---
# EGM router (vendored, full plugin layout)

Keep the folder intact: sub-skills read `agents/` reviewer prompts and `resources/` standards by relative path. Load the matching `skills/<name>/SKILL.md`; user makes the trade-offs and approves the spec before implementation.

| Sub-skill | Purpose |
|---|---|
| [`egm-bootstrap`](skills/egm-bootstrap/SKILL.md) | Bootstrap directory README.md files across a repository subtree. |
| [`egm-brainstorm`](skills/egm-brainstorm/SKILL.md) | Interactive ideation and brainstorming skill for the Elephant & Goldfish Model (EGM). Helps turn half-baked concepts into structured hypotheses via clarifying questions, review, and iterative refineme |
| [`egm-draft`](skills/egm-draft/SKILL.md) | Drafts a design document section-by-section using the concepts brief from egm-brainstorm (or user notes). This is the second step in the Elephant-Goldfish (EGM) feature flow. Use when you are ready to |
| [`egm-drift-report`](skills/egm-drift-report/SKILL.md) | Runs drift detection on all design documents to check for document and code consistency. Produces an actionable report with differences. Use when the user asks to detect drift or check for consistency |
| [`egm-resolve`](skills/egm-resolve/SKILL.md) | The Elephant resolution skill. Ingests flat deficiency reports from concurrent Goldfish reviewers, applies automated fixes for PROPOSE FIX items via UI multiple-choice gates, and presents interactive  |
| [`egm-review-loop`](skills/egm-review-loop/SKILL.md) | Executes the Antagonistic-Review process from the Elephant-Goldfish Model (EGM) via an automated multi-agent review loop to audit documents against qualitative standards and structural templates, and  |
| [`egm-review`](skills/egm-review/SKILL.md) | Orchestrates the EGM Goldfish Review Protocol. Used as part of the EGM process to perform design document reviews. Executes five review phases: Initial Zoom Out Review, Comprehension Review, Design Cr |

Pairs with this library's fresh-reviewer pattern in `animation-studio-director` (read-only reviewer, new session) and `design-loop`. Apache-2.0: LICENSE kept; modifications: none (verbatim), SKILL.md router added.
