---
name: superpowers
description: Complete software development methodology for coding agents. Before writing any code, agents clarify intent, draft a spec, get approval, then execute via subagent-driven TDD. Emphasizes YAGNI, DRY, red/green TDD, and autonomous multi-hour execution. Load this skill for any non-trivial feature build or when the user wants structured, spec-first development.
source: https://github.com/obra/superpowers
---

## Overview

Superpowers is a composable skill system that transforms how coding agents work. Instead of jumping straight to code, the agent:

1. Asks what you're really trying to do
2. Drafts a spec in readable chunks for your approval
3. Creates a step-by-step implementation plan
4. Executes via subagent-driven TDD autonomously

## Core Methodology

- **Spec first** — never write code without an approved spec
- **TDD** — true red/green test-driven development
- **YAGNI** — You Aren't Gonna Need It
- **DRY** — Don't Repeat Yourself
- **Subagent delegation** — complex tasks spawn focused subagents

## Skills Included

See `skills/` directory in this folder for all composable skills. The orchestrator wires them together automatically.

## Attribution

obra/superpowers (Prime Radiant) — MIT License
