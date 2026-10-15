# Skill analysis — Ponytail + Agent Reach (2026-10-15)

## Ponytail — DietrichGebert/ponytail (MIT, v5.2.0, commit 84740e3)

**What it is.** A "lazy senior dev" ruleset: the smallest change that fully solves the task, reuse
before new code, no unrequested abstractions or dependencies, a short reply that names what was
skipped. Levels lite / full (default) / ultra. Ships 6 skills (`ponytail`, `-review`, `-audit`,
`-debt`, `-gain`, `-help`), adapters for Claude Code, Codex, Cursor, Copilot and about 15 other
agents, and Node lifecycle hooks that re-inject the rules on session start, on every subagent and
on prompt submit, plus a statusline badge.

**Claimed effect.** Upstream benchmark: about −53% code, −41% time, −26% cost on agentic tasks.
Directional only; it is the author's own benchmark.

**Safety review.** Hooks are local Node scripts: write a mode flag in `~/.claude`, read
`settings.json` to suggest a statusline, run `ponytail-map.js` (a fast local file map) with a 1 s
timeout. No network calls, no telemetry, no install scripts. Maintainer-only publish scripts under
`scripts/` are never run by the plugin. **Verdict: safe to adopt.**

**How it fits Space Age.** Complements `caveman` rather than duplicating it: ponytail cuts the code
Claude writes (and the tokens spent writing and reviewing it); caveman cuts the prose around it.
Both are now Tier 0 and always on (root `CLAUDE.md` RULE #2). Overlaps `karpathy-guidelines` on
simplicity with no conflict; ponytail is the more operational version.

**Full auto-activation in Claude Code:** `/plugin marketplace add DietrichGebert/ponytail`, then
`/plugin install ponytail@ponytail` (two separate prompts). The rules also work without the plugin
because RULE #2 carries them.

## Agent Reach — Panniantong/Agent-Reach (MIT, v1.5.0, commit 94f06c1)

**What it is.** A Python CLI + skill that routes an agent to 16 platforms (web, Exa search,
GitHub, YouTube, X/Twitter, Reddit, Facebook, Instagram, LinkedIn, RSS, V2EX, Bilibili,
XiaoHongShu, Xiaoyuzhou, Xueqiu, Boss) through per-platform CLIs, OpenCLI and APIs.
`agent-reach doctor --json` reports which backend serves each platform. Read-only by design.

**Change vs our old copy.** The repo had a stale 13-platform summary with commands that no longer
match upstream. Synced to upstream; the root `SKILL.md` is now the upstream English skill with
Space Age overrides.

**Safety review.**
- Cookie handling is least-privilege (`cookie_extract.py` reads only named cookies, writes private
  files with tight permissions, and is tested). Still sensitive: prefer manual Cookie-Editor exports.
- Upstream rule 5 tells the agent to paste a raw-GitHub "update me" doc. **Overridden**: updates
  only by re-syncing this repo after review.
- `agent-reach install --system --channels=all` installs many third-party CLIs system-wide; run it
  only on machines you control. Several channels need your own logins.
- **Verdict: safe to adopt as a read layer, with the overrides above.**

**How it fits Space Age.** Added to the Cinematic Website Builder (v3.2.0) as the P0 Direction
Intake research layer: reads pasted reference links (sites via Jina, YouTube transcripts, X /
Reddit / Instagram via the doctor-selected backend) and runs a capped competitor and
voice-of-customer scan into the Direction Brief (`references/web-research-agent-reach.md`). Bulk
crawling stays with `firecrawl-mcp` / `scrapegraph-ai`; logged-in browsing stays with
`stealth-browser-automation` / `browserbase-scraper`.
