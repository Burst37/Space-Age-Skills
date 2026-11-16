# Multi-harness production (v3.5) — several sites a day, several agents at once

One job folder = one site = one worker. Workers never share a context, never read each other's folders, and can be
any harness that can read files and run Node: Claude Code (local or cloud sessions), Codex, the Grok bot, Gemini
CLI, Cursor, the DeepSeek harness for the bulk lane.

## The contract (what makes a harness interchangeable)

| File | Written by | Meaning |
|---|---|---|
| `jobs/<slug>/JOB.md` | `lead-jobs.mjs init` | the whole brief for the worker: read order, steps, exit conditions, hard rules, report format |
| `jobs/<slug>/lead.json` · `handoff/` | init, then the worker | facts and the hand-off folder (single source of truth) |
| `jobs/<slug>/status.json` | `lead-jobs.mjs` only | `queued → claimed (by, when) → done (preview) | failed (reason)` |
| `jobs/<slug>/.claim/` | `claim` | atomic lock (mkdir): two workers can never take the same job |
| `jobs/<slug>/site/` + `site/qa/` | the worker | the build and its verify report |

Start a worker with one line, whatever the harness:
`Read <absolute path>/JOB.md and follow it.`

## Two ways to run the queue

- **Shared filesystem** (one machine or the VPS): each worker runs `lead-jobs.mjs claim jobs --by <id>` and gets a
  different job. A crashed worker's job goes back with `lead-jobs.mjs release jobs/<slug>`.
- **Isolated sessions** (cloud sessions do not share a disk, so `claim` cannot coordinate them): the orchestrator
  assigns exactly one job folder per session, each session works on its own branch `job/<slug>` and pushes it; the
  orchestrator collects `status.json` from the branches. Do not point two sessions at one folder.

## Lanes (model routing per step)

| Step | Lane | Why |
|---|---|---|
| Reading the listing / old site, first-draft page text, alt text, FAQ candidates | bulk lane allowed (e.g. the DeepSeek harness) | cheap, high volume, checked downstream by `stop-slop-pro` and the fact rule |
| Design-spec, motion and type decisions, JSON shot specs, the build, fixing verify failures | frontier lane (the main-pipeline model) | taste and correctness decide the result |
| Goldfish review (GR2) | a **fresh** context of the frontier lane | a reviewer that saw the build conversation is not a review |
| Scoring, queueing, linting, assembling, verifying | scripts, no model | deterministic |

A bulk-lane draft never ships unreviewed: the frontier worker owns the job and its report.

## Keeping parallel runs clean

- Workers do not write to the skill folder. `taste-profile.yaml` is only updated from approved client builds
  (`--accept`), never from lead-mode auto runs.
- One preview project per job (`<slug>` as the project name). No shared `site/` directory.
- Media generation is the shared bottleneck (credits and queue). Read the roster once per batch, write the picks
  into each job's `assets.yaml`, and use the platform's batch tools rather than N workers polling at once.
- Each worker ends with the one-line report from `JOB.md`. The orchestrator's batch summary is `lead-jobs.mjs status`.
- Stop conditions for a worker: a fact it needs is UNKNOWN and cannot be left off the page; verify cannot reach
  exit 0 after three fix rounds; no generation tool and the brief requires real media. Then `fail --reason`, not a
  half-built preview.

## Batch review (the one human stop)

After the queue drains: `status` → open each preview (or one contact sheet of the 1440/390 screenshots from
`site/qa/`). Approve, drop or send back per job. Only approved jobs go to outreach.
