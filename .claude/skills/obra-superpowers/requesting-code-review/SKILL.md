---
name: requesting-code-review
description: >
  Use after each task in subagent-driven development, before merging, and after
  major feature completion. Dispatches a dedicated reviewer subagent.
---

# REQUESTING CODE REVIEW

Source: https://github.com/obra/superpowers

## Core Mandate

"Review early, review often."

Never skip review because "it's simple."

## When Reviews Are Required

- After each task in subagent-driven development
- Before merging any branch to main
- After major feature completion

Optional but beneficial:
- When stuck on a problem
- Before significant refactoring

## The Review Process

1. Get git commit hashes (base and head)
2. Dispatch a general-purpose subagent as reviewer
3. Provide: work description, requirements reference, commit range
4. Reviewer returns feedback by severity

## Severity Levels

- **Critical** — Fix immediately before any further work
- **Important** — Must resolve before proceeding
- **Minor** — Can be deferred

## Critical Rules

- Reviewer receives context about the work ONLY — not your full session history
- Technical pushback against feedback is acceptable when supported by code evidence
- Ignoring Critical or Important findings blocks forward progress
- Never accept "looks good" without seeing the reviewer's actual analysis
