---
name: brainstorming
description: Use before any implementation — transforms ideas into validated designs. Enforces design gate before any code is written.
source: https://github.com/obra/superpowers
license: MIT
---

# Brainstorming

Transform ideas into validated designs before implementation begins.

## Core Gate

**Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.**

This is not optional. "This is too simple to need a design" is an anti-pattern. Even trivial projects require design validation.

## Process (9 steps — follow in order)

### Step 1 — Explore context

Read existing files, docs, CLAUDE.md, README before asking anything. Understand the project.

### Step 2 — Offer visual companion (if applicable)

If the topic involves UI, mockups, layouts, or diagrams, offer a browser-based visual tool as a standalone message. Require user consent before proceeding.

### Step 3 — Ask clarifying questions

- One question per message
- Prefer multiple-choice over open-ended
- Keep asking until purpose, constraints, and scope are clear

### Step 4 — Propose 2-3 approaches

For each approach, state:
- What it is
- Trade-offs (speed, cost, complexity, risk)
- Your recommendation and why

### Step 5 — Present design in sections

Break the design into digestible chunks. Seek explicit approval after each chunk before continuing.

### Step 6 — Write design documentation

Save to `docs/superpowers/specs/<feature-name>.md`. Full spec, no placeholders.

### Step 7 — Self-review

Check the written spec for:
- Placeholder text ("TBD", "similar to above")
- Contradictions
- Ambiguity that a developer could interpret two ways

Fix all issues before handoff.

### Step 8 — User review

Present the written spec. Ask for explicit approval. Do not proceed until approved.

### Step 9 — Invoke writing-plans

The ONLY skill invoked after brainstorming is `superpowers:writing-plans`. No other implementation skills.

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|---|---|
| "This Is Too Simple To Need A Design" | Simple projects are where unexamined assumptions cause wasted work |
| Asking multiple questions at once | Overwhelms the user, produces shallow answers |
| Skipping self-review | Placeholders become bugs in the plan |
| Jumping to writing-plans before approval | Wrong design → wrong plan → wasted implementation |
