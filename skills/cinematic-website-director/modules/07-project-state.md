# Module 07 — Persistent Project State

## Mission
Make long, multi-agent, multi-session builds resumable and verifiable. Load at T3, or any
build crossing a session or agent boundary.

Maintain `PROJECT_STATE.md` alongside `QA_LEDGER.md`.

## State schema
```yaml
project:
revision:
tier:
design_dna_version:
typography_version:
motion_map_version:
build_status: direction|locked|building|review|shipped
completed: []
in_progress: []
blocked: []          # each with the specific unblocking action
qa_open: []
qa_closed: []
next_actions: []     # ordered, each executable without re-reading the conversation
regression_risks: []
```

## Rules
- Never rely on conversation memory as the only source of truth for a multi-session build.
- `next_actions` must be executable by a cold agent with only the artifacts in hand. If an
  entry needs conversational context to make sense, rewrite it.
- Bump the relevant `*_version` on every artifact amendment; stale versions downstream are
  a `high` defect.
- On session end, write state before anything else. Per Space Age protocol, also log the
  session to Drive `SESSION_MEMORY/YYYY-MM-DD.md`.
