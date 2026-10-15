# Integration reference

> **Space Age fork note:** this document describes the upstream (Jack Roberts) kit. This fork's `scripts/jev_run.py` additionally implements `--provider typesafe` (see below), `--retries`/`--retry-base-delay` for bounded backoff, and `--resume` for interrupted batches — see the repo `README.md` for the full list. The endpoint and provider facts below are unchanged from upstream.

Jev accepts state and typed questions. The OpenRouter adapter uses `POST https://openrouter.ai/api/alpha/decisions` with model `typesafe/jev-1.13`. This is separate from chat/completions. The direct TypeSafe endpoint is `POST https://api.typesafe.ai/v1/systemone` with model `jev-latest`. The included runner implements both: pass `--provider openrouter` (default, reads `OPENROUTER_API_KEY`) or `--provider typesafe` (reads `TYPESAFE_API_KEY`).

The official TypeSafe skill is available through `npx skills add typesafe-ai/skills --skill typesafe-ai`. This kit is a separate batching and supervision workflow. It does not replace the provider's documentation.

For Codex, place this folder at `~/.codex/skills/jev-handoff/`. For Claude Code, use `~/.claude/skills/jev-handoff/` or a project `.claude/skills/jev-handoff/`. Restart or open a new task if discovery has not refreshed. Invoke `$jev-handoff` in Codex or `/jev-handoff` in Claude Code. The host agent needs filesystem and terminal access.

A good starting request: “Use jev-handoff to classify this JSONL queue. Preview 20 records first. Show the summary, errors and uncertain cases. Keep the full queue out of your context unless specific rows need review.”

The runner never takes a downstream business action. It writes a results file and a summary. It does not automatically invoke Astra or Claude; the supervising agent decides which exceptions to inspect under the user's task authorization.

A result marked successful means the provider returned a valid type. It does not mean the decision was correct. Missing cost fields remain unavailable. Provider billing can include failed or cancelled requests outside the successful usage records.

Use the supplied forms as starting examples. Ownership responsibilities, urgency policy, immediate buyer intent and sponsorship budget bands should match the business. The example sponsorship form uses USD and tier boundaries at $1,000, $5,000 and $15,000.

Sources checked 19 September 2026: [TypeSafe primitives](https://docs.typesafe.ai/primitives), [confidence](https://docs.typesafe.ai/confidence), [quickstart](https://docs.typesafe.ai/introduction/quickstart), [OpenRouter Jev listing](https://openrouter.ai/typesafe/jev-1.13).
