---
name: open-seo
description: Router for the OpenSEO plugin (MIT) — keyword research, clustering, competitor and backlink analysis, site audits, local SEO, AI-visibility tracking, SEO reports. Use when the task needs real SEO data via the hosted OpenSEO MCP server instead of generic advice.
---

# open-seo

Vendored OpenSEO plugin: 12 workflow skills + hosted MCP server (`https://app.openseo.so/mcp`, OAuth on first tool use, no API key). Needs an OpenSEO account (hosted plans or self-host); see `UPSTREAM.md`.

## Route

| Task | Skill file |
|---|---|
| First-time project context | `plugin/skills/seo-project-setup/SKILL.md` |
| Explain workflows / next step | `plugin/skills/seo-coach/SKILL.md` |
| Find and rate keywords | `plugin/skills/keyword-research/SKILL.md` |
| Group keywords by intent → pages | `plugin/skills/keyword-clustering/SKILL.md` |
| One competitor's organic footprint | `plugin/skills/competitor-analysis/SKILL.md` |
| Market leaders, content gaps | `plugin/skills/competitive-landscape/SKILL.md` |
| Site audit + fix priority | `plugin/skills/seo-audit/SKILL.md` |
| Backlink prospects + contacts | `plugin/skills/link-prospecting/SKILL.md` |
| GBP audit, Maps rankings | `plugin/skills/local-seo/SKILL.md` |
| Prompts to track in AI answers | `plugin/skills/ai-prompt-research/SKILL.md` |
| Brand mentions/citations in AI answers | `plugin/skills/ai-visibility-audit/SKILL.md` |
| Shareable one-file report | `plugin/skills/seo-report/SKILL.md` |

Read only the matched file. Check connection first: "Use OpenSEO to check my connection and list my projects."

## Install as Claude plugin
`plugin/.claude-plugin/plugin.json` + `plugin/.mcp.json` are intact; point a plugin marketplace at `plugin/`, or copy `plugin/skills/*` into `~/.claude/skills/` and add the MCP server by hand.

## Notes
- Local-SEO output feeds the SA lead→site pipeline (Maps lead list → spec site); run `local-seo` before `cinematic-website-builder`.
- MCP calls spend OpenSEO credits; confirm before bulk rank tracking or AI-answer sweeps.
