---
name: claudex-cross-model-loop
version: 1.0.0
description: Portable cross-model planning, adversarial review, implementation, and independent inspection loop adapted from the uploaded Claudex repository for Codex-led development.
---
# Claudex Cross-Model Loop — Codex Skill

## Prime directive
Do not let the same model be the sole planner, builder, and final grader on high-impact work.

## Loop
1. RECON: inspect repo, conventions, dependencies, tests, constraints.
2. PLAN: freeze requirements and acceptance criteria.
3. ADVERSARIAL REVIEW: rival model attacks architecture, assumptions, security, edge cases, and testability in read-only mode.
4. BUILD: assigned builder implements the smallest coherent change.
5. CROSS-INSPECT: independent reviewer examines diff + test evidence.
6. FIX: bounded correction rounds.
7. ACCEPT: only when objective criteria pass or remaining risk is explicitly accepted.

## Space Age routing
Codex may manage while Claude/DeepSeek/GLM/Kimi/Gemini/Grok act as rival builder or reviewer depending on availability and task fit.

## Artifacts
PLAN.md, assumptions, review log, build report, test evidence, final cross-inspection.
