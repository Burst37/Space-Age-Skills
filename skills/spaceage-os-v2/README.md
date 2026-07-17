# Space Age OS v2 — Distributed Operating System

**Version:** 2.0  
**Updated:** 2026-05-30  
**Compatibility:** Claude Code, Codex CLI, Cursor, Antigravity, OpenCode, Gemini CLI

## What Changed from v1 (SAVO)

v1 was a single 12-module monolithic SKILL.md (the SAVO Creative Director OS).

v2 is a distributed system with 9 specialized OS modules + an orchestrator that routes between them.

## Modules

| Module | Trigger |
|--------|---------|
| master-orchestrator | Every multi-step project, all intent routing |
| research-knowledge-os | URLs, competitor analysis, brand extraction, lead intel |
| design-taste-os | Landing pages, redesigns, UI critique, premium frontend |
| motion-interaction-os | Animation, hover, scroll, cursor, micro-interaction |
| engineering-os | Coding, refactoring, debugging, architecture |
| automation-leadgen-os | Lead gen, Vapi, CRM, outreach pipelines |
| cinematic-video-os | Image/video prompts, music videos, ads |
| obsidian-vault-os | Knowledge base, notes, client memory, SOPs |
| skill-factory-os | Upgrading any repo/skill/framework to Space Age standard |

## Configs

- `configs/master-claude.md` — Claude Code CLAUDE.md config
- `configs/codex-agents.md` — Codex AGENTS.md rules
- `configs/cursor-rules.md` — Cursor .cursorrules
- `configs/antigravity-rules.md` — Antigravity rules

## Playbooks

5 end-to-end workflow playbooks covering client URL → site, design ref → code, lead gen → close, artist campaign, and repo → skill.

## Stack Position

Load after SA Pre-Planning Intelligence v1 and SAVO Creative Director OS v1. v2 modules replace individual SAVO modules as they're activated.
