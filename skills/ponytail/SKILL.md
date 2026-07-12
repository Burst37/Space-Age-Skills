---
name: ponytail
description: Ponytail, a Claude Code plugin that enforces the simplest working solution (YAGNI, stdlib-first, no unrequested abstractions) via lifecycle hooks. Use when deciding whether to install stricter minimal-code discipline into Claude Code, or to understand what it enforces if it's already installed.
source: https://github.com/DietrichGebert/ponytail
---

## Overview

Ponytail is a Claude Code (and Cursor/Codex/Copilot/16 agents total) plugin, not a library you import — it installs two lifecycle hooks that push the agent to stop at the first "rung" that solves the task, in this order (from the repo's own README): (1) does this need to exist at all — if not, skip it (YAGNI), (2) is it already in the codebase — reuse, don't rewrite, (3) does stdlib do it, (4) does a native platform feature do it, (5) is there an installed dependency that does it. It explicitly does **not** cut corners on trust-boundary validation, data-loss handling, security, or accessibility — "lazy, not negligent," per the README. MIT license.

This overlaps directly with the "no unrequested abstractions... three similar lines is better than a premature abstraction" guidance already in this environment's own system instructions — Ponytail operationalizes the same philosophy as an enforced hook rather than a prompt-level guideline.

## Install (Claude Code)

```
/plugin marketplace add DietrichGebert/ponytail
```
```
/plugin install ponytail@ponytail
```

Per the repo's README, these must be sent as **two separate prompts** — combining them in one message doesn't work. Requires `node` on PATH for the two lifecycle hooks (Claude Code Node.js hooks); if node isn't found, the skill content still loads, the always-on hook enforcement just goes quiet instead of erroring on every prompt.

To uninstall: reverse of install, `/plugin uninstall ponytail@ponytail` then remove the marketplace if desired.

## Enhancement: decide before installing globally

Ponytail changes agent behavior on **every** prompt once installed (it's "always-on activation," per its own docs) — for a company running multiple project types (websites, automation pipelines, LoyaltyBot, credit repair), this is a good fit for coding-heavy sessions but could fight against sessions where verbose, well-documented, defensive code is actually wanted (e.g. code being handed off to another team, where Ponytail's terse-by-design output may need more comments/explanation added back in afterward). Consider installing it as a per-project plugin rather than a global one if that tension matters — check `docs/` in the repo for scoping options before treating it as an every-session default.

## Gotchas (from source inspection)

- The `benchmarks/` folder ships a `promptfooconfig.yaml` — the README's "80-94% less code" claim is reproducible via `npx promptfoo eval -c benchmarks/promptfooconfig.yaml` if you want to verify the effect on your own model/version rather than trusting the README's numbers as-is.
- It only runs two Node.js lifecycle hooks — no daemon, no background process, low overhead to try and remove if it doesn't fit a given workflow.
