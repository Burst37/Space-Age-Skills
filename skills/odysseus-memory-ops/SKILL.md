---
name: odysseus-memory-ops
description: Use when an agent has access to a persistent memory/skills API (vector + keyword store) and needs to decide whether to write a new memory, update an existing one, or skip — to avoid duplicate or contradictory long-term memories accumulating across sessions.
---

# Odysseus Memory Ops

## Overview

Adapted from [pewdiepie-archdaemon/odysseus](https://github.com/pewdiepie-archdaemon/odysseus), whose `Memory / Skills` module gives agents a ChromaDB-backed vector + keyword memory store via a scoped `/api/codex/memory` API. The original skill documents how to call the API but not *when* to write — agents tend to write a new memory every time something memorable comes up, producing duplicates and stale facts. This skill adds a write-discipline layer on top of any persistent-memory API.

## When to Use

- The harness exposes `memory.list/search`, `memory.write`, `memory.delete` (or equivalent) tools.
- The user shares a fact, preference, or correction ("actually I prefer X", "remember that...").
- You're about to call a memory-write tool.
- NOT for ephemeral session context — only for facts that should outlive the session.

## Core Pattern

**Before → After**

Before (naive): user mentions a preference → immediately `memory.write({text: "..."})`.

After (10x): search first, then write/update/skip based on what's found.

```
1. memory.search(query=<topic keywords>)
2. Classify result:
   - No match           -> memory.write (category: fact|preference)
   - Match, same value  -> skip (already known)
   - Match, contradicts -> memory.delete(old_id) then memory.write(new)
   - Match, refines     -> memory.delete(old_id) then memory.write(merged text)
3. Tag category explicitly: "fact" (about the world/project) vs "preference" (about the user)
```

## Quick Reference

| Situation | Action |
|---|---|
| New durable fact, no existing memory | `write` |
| User restates known fact, same content | skip — do not write |
| User corrects a prior fact | `delete` old + `write` new |
| User gives a one-off instruction for this task only | don't persist |
| Memory store > ~50 entries on a topic | periodically consolidate: search topic, summarize into one entry, delete redundant ones |

## Implementation

```bash
# 1. search before writing
python3 odysseus_api.py GET "/api/codex/memory?q=editor+preference"

# 2a. no match -> write
python3 odysseus_api.py POST /api/codex/memory \
  '{"text":"User prefers tabs over spaces in Python","category":"preference"}'

# 2b. contradiction -> delete then write
python3 odysseus_api.py DELETE /api/codex/memory/<old_id>
python3 odysseus_api.py POST /api/codex/memory \
  '{"text":"User now prefers spaces (4) in Python, changed from tabs","category":"preference"}'
```

## Common Mistakes

- **Writing on every mention** → memory store fills with near-duplicates that drown out signal in vector search.
- **Never deleting** → contradictions accumulate; future retrieval surfaces stale preferences alongside current ones, confusing the agent.
- **No category tagging** → "facts about the project" and "facts about the user" become unsearchable as a group later.
- **Persisting task-scoped instructions** → pollutes long-term memory with one-off context that's irrelevant next session.
