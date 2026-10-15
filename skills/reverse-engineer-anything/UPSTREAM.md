# Upstream: REA — Reverse Engineer Anything

- Source: https://github.com/morluto/rea (MIT, v6.4.0 snapshot from `rea-main.zip`)
- npm package / MCP server: `rea-agents` (`npx -y rea-agents mcp`)
- This folder vendors the agent skill (`SKILL.md`, `references/`) plus upstream README, LICENSE,
  AGENTS.md, SECURITY.md and `docs/` (no screenshots). The runtime (src, bridges, tests, website)
  is NOT vendored — it is pulled from npm on demand.

## Activate (on call)
1. Skill: `.claude/skills/reverse-engineer-anything` (symlink to this folder) — auto-loads on RE tasks.
2. MCP: project `.mcp.json` registers `rea` via `npx -y rea-agents mcp`. Approve it once in Claude Code.
3. Slash command: `/rea <target>`.
4. Analysis engines are bring-your-own (Ghidra / Hopper / IDA / JADX, etc.); JavaScript/Electron,
   .NET, APK-manifest and browser analysis need none. See `upstream/docs/installation.md`.

## Scope
Authorized analysis only (own software, CTF, defensive/interoperability research). See upstream/DISCLAIMER.md.
