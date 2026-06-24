---
name: dispatching-parallel-agents
description: >
  Use when you have multiple independent failures or tasks across different domains.
  Dispatch one agent per independent problem. Let them work concurrently.
---

# DISPATCHING PARALLEL AGENTS

Source: https://github.com/obra/superpowers

## Core Concept

"Dispatch one agent per independent problem domain. Let them work concurrently."

## When to Apply

- 3+ failures across different domains that don't affect each other
- Problems that can be fully understood in isolation
- No shared state between investigations

## When NOT to Apply

- Failures are related or share a root cause
- Full system context is needed for each
- Agents would write to the same files or shared state
- Exploratory debugging (use systematic-debugging instead)

## Process

1. **Identify independent domains** — Group failures by what's broken
2. **Create focused tasks** — Each agent gets specific scope, clear goals, explicit constraints
3. **Dispatch in parallel** — Issue ALL subagent calls in ONE response
4. **Review and integrate** — Verify fixes don't conflict, run full test suite

## Task Brief Requirements

Each agent brief must be:
- **Focused** — one domain only
- **Self-contained** — no dependency on other agents' work
- **Explicit** — stated output expectations, not implied

## Critical Rule

All dispatches go in a single response. Sequential dispatch defeats the purpose.
