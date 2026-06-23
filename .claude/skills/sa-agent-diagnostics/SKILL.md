---
name: sa-agent-diagnostics
display_name: "SPACE AGE — Agent Diagnostics & Loop Remediation"
version: "1.0.0"
last_updated: "2026-05-30"
origin: paperclip/diagnose-why-work-stopped + paperclip/terminal-bench-loop (SA-wrapped)
description: >
  Forensic diagnosis for stalled, looping, or silently stopped agent work.
  Three invariants: (1) productive work continues, (2) only real blockers stop work,
  (3) no infinite loops. SA extensions: Hermes Agent stall diagnosis, 5-agent swarm
  loop detection, lead gen pipeline deadlock resolution.
  OUTPUT: diagnosis + plan only — no code changes from this skill.
triggers: [agent stopped, work stopped, why did it stop, pipeline stalled, hermes not responding, agent loop, stuck issue, swarm deadlock]
skill_connections:
  upstream: [sa-paperclip-operator]
  downstream: [sa-para-memory, karpathy-guidelines]
never_do:
  - Ship code changes from this skill — output is diagnosis + plan only
  - Mark diagnostic issue done before board/CTO approves fix
  - Propose rules that violate any of the three invariants
---

# SPACE AGE — Agent Diagnostics & Loop Remediation

Forensic diagnosis for stalled agent work. OUTPUT: diagnosis + plan. NO code changes.

## Three Invariants (Non-Negotiable)

1. Productive work continues — agents with next action keep working
2. Only real blockers stop work — pseudo-stops must be detected and routed
3. No infinite loops — recovery must be bounded

## Diagnosis Procedure

### Step 1 — Get Issue Tree
```bash
GET /api/issues/{stalled-id}
GET /api/issues/{stalled-id}/heartbeat-context
GET /api/issues/{stalled-id}/comments?order=asc
GET /api/companies/{companyId}/issues?parentId={stalled-id}
```

### Step 2 — Classify Stop Type

| Stop Type | Pattern | Invariant Violated |
|-----------|---------|-------------------|
| Pseudo-stop: silent in_review | in_review with no participant/approval | #1 |
| Pseudo-stop: cancelled leaf | Cancelled child, parent waiting | #2 |
| Real blocker | blockedByIssueIds → unresolved issue | None |
| Pseudo-blocker | Free-text "blocked by X", no blockedByIssueIds | #2 |
| Infinite loop | Same action repeated N times, no progress | #3 |
| Budget exhausted | Agent at 100% budget | None — real limit |

### Step 3 — Root Cause Write-Up

```markdown
## Root Cause

**Issue:** [ID] — [title]
**Stop point:** Step X — [what happened last]
**Stop type:** Pseudo-stop / Real blocker / Loop
**Invariant violated:** #[1/2/3]

**Evidence:**
- Comment [date]: agent said "..."
- Status: in_review since [date], no participant set

**Impact:** Work stopped for [X] hours with no recovery path.
```

### Step 4 — Fix Plan

```markdown
## Fix Plan

**Rule change:** [description]

**Invariant check:**
- ✅ #1 (productive work continues): [how]
- ✅ #2 (only real blockers): [how]
- ✅ #3 (no infinite loops): [how — explicit bound]

**Does doc/execution-semantics.md need updating?** [Yes/No]
```

### Step 5 — Gate on Approval

```bash
POST /api/companies/{companyId}/approvals
{
  "type": "request_board_approval",
  "requestedByAgentId": "...",
  "issueIds": ["..."],
  "payload": {
    "title": "Approve: [fix]",
    "summary": "Root cause: [brief]. Fix: [brief].",
    "recommendedAction": "Approve and create implementation child issue.",
    "risks": ["[risk]"]
  }
}
```

Set source issue to in_review. Do NOT create implementation subtasks until approved.

## SA-Specific Patterns

### Hermes Agent Stall
```bash
ssh root@146.190.78.120
journalctl -u hermes-agent --since "2 hours ago" | tail -50
```
Common causes: Node.js OOM (Pentium Silver N6000), DigitalOcean network timeout,
Telegram 429 rate limit, missing .env key.

### 5-Agent Swarm Deadlock
```bash
GET /api/companies/{companyId}/issues?parentId={swarm-parent-id}
# All children terminal but parent still in_progress → wake event missed
# Fix: PATCH parent to done with audit comment
```

### Lead Gen Pipeline Loop
- Check logs/completed-sites.txt for duplicates
- Check Playwright dedup logic (business name + address hash)
- Check n8n webhook for duplicate trigger events

## Bounded Loop Protocol

```markdown
## Loop Bounds
- Iteration budget: [N] max
- Wall-clock cap: [X] minutes/iteration
- Stop conditions: smoke passes, board rejects, budget exhausted, real blocker
- Progress signal: each iteration must produce a new artifact (log, site, render)
  Zero artifact = pseudo-iteration, counts against budget
```
