---
name: superpowers
description: >
  Space Age's enhanced fork of obra/superpowers — a set of process-discipline
  sub-skills for the full build lifecycle: gate creative work behind an
  approved design (brainstorming), turn an approved spec into a task-by-task
  plan (writing-plans), execute that plan with fresh subagents per task and
  two-stage review (subagent-driven-development), never claim work is done
  without running fresh verification (verification-before-completion), merge
  or ship once tests pass (finishing-dev-branch), and write new skills to the
  Space Age naming/frontmatter convention (writing-skills). Load the specific
  sub-skill file for the stage you're in, not this index.
license: MIT
source: https://github.com/obra/superpowers
---

# Superpowers — Space Age AI Solutions

**Source:** `obra/superpowers`, enhanced with Space Age product context
(LoyaltyBot, Cinematic Website Builder, Shopify, Record Exec, Credit Repair).

This is a pack, not a single skill. Six sub-skills cover one stage each of the
build lifecycle, in this order:

| Stage | File | Use when |
|---|---|---|
| 1. Design gate | [`brainstorming.md`](brainstorming.md) | Before any creative/build work — hard-gates implementation until a design is approved |
| 2. Plan | [`writing-plans.md`](writing-plans.md) | You have an approved spec, need a step-by-step implementation plan |
| 3. Execute | [`subagent-driven-development.md`](subagent-driven-development.md) | Executing a plan's independent tasks — fresh subagent per task, two-stage review |
| 4. Verify | [`verification-before-completion.md`](verification-before-completion.md) | Before claiming ANY work complete, fixed, or passing — no claims without fresh command output |
| 5. Ship | [`finishing-dev-branch.md`](finishing-dev-branch.md) | Tests pass, ready to merge/PR/deploy |
| Meta | [`writing-skills.md`](writing-skills.md) | Writing or editing a SKILL.md itself — naming convention, 1024-char description limit, required frontmatter |

## The one hard rule across all six

**Design before code, verification before claims.** `brainstorming.md`'s gate
and `verification-before-completion.md`'s Iron Law are both non-negotiable —
the other four sub-skills assume both are being followed.

## Typical flow

```
brainstorming (design approved)
  → writing-plans (plan written, committed)
  → subagent-driven-development (tasks executed, each verified + committed)
  → verification-before-completion (fresh check before any "done" claim)
  → finishing-dev-branch (merge/PR/deploy)
```

`writing-skills.md` is orthogonal — invoke it any time you're creating or
editing a skill file, in this repo or anywhere else.
