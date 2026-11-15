# EGM — Elephant-Goldfish Model (vendored for Space Age)

**Upstream:** https://github.com/google/elephant-goldfish-model · commit `e4747323aab66157812cd3a71755f6447b2803a2` (14 Nov 2026) ·
plugin 0.1.1 · **Apache-2.0** (`LICENSE`, Copyright 2026 Google LLC). Not an officially supported Google product.
Vendored 15 Nov 2026 (America/Chicago). Upstream files are unmodified; upstream test suites, website, CI and installer adapters were left out.

> Design with an elephant. Review with a goldfish. The elephant (your main agent) holds the context and drafts; goldfish
> reviewers start with no chat history and read only the doc and its sources; you approve.

## What's here
| Path | What |
|---|---|
| `skills/egm-*/SKILL.md` | The 7 upstream skills: brainstorm, draft, review, review-loop, resolve, bootstrap, drift-report |
| `agents/*.md` | The 10 upstream reviewer personas (read-only, history-free) |
| `resources/` | Document standards (rubrics) and execution rules |
| `docs/` | Host notes: Claude, Codex, Cursor (experimental), harness table, getting started |
| `space-age/ANALYSIS.md` | Plain-English analysis: what it does, each skill, limits, what fits our web work |
| `space-age/goldfish-review.md` + `goldfish-lenses.yaml` | The website version used in **cinematic-website-builder v3.4** (GR1 brief, GR2 design-spec, GR3 drift; 9 website lenses) |
| `space-age/EVAL-astonishing.md` | Test on the Astonishing Touch docs: baseline 3.3 gates vs goldfish review, with the verdict |
| `SKILL.md` | Space Age entry point: when to use which part |

## Install upstream as a plugin instead
`claude plugin marketplace add google/elephant-goldfish-model && claude plugin install egm@egm` (Claude Code) ·
`codex plugin marketplace add google/elephant-goldfish-model && codex plugin add egm@egm` (Codex CLI). Goldfish reviews need a host
that can start fresh subagents.
