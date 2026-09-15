---
name: cli-anything
version: 1.0.0
description: Codex-ready skill for turning GUI/application capabilities into agent-usable command-line interfaces, based on the uploaded CLI-Anything repository.
---
# CLI Anything — Codex Skill

## Purpose
Create deterministic CLI surfaces that agents can call, test, compose, and automate instead of relying on fragile GUI interaction.

## Workflow
1. Inspect target application's callable surface and data model.
2. Identify high-value operations and read-only discovery commands first.
3. Design stable commands, flags, exit codes, machine-readable output, and help text.
4. Separate read operations from mutations.
5. Add dry-run/confirmation gates for destructive operations.
6. Build thin adapters rather than duplicating application logic.
7. Add tests for command parsing, failures, output schema, and representative operations.
8. Document installation, auth, environment variables, examples, and agent usage.

## Agent contract
Prefer JSON output for machine consumption, deterministic exit codes, bounded output, explicit errors, and idempotent operations where possible.
