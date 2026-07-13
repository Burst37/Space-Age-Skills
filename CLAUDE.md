# CLAUDE.md — Space Age AI Solutions

## Prime Directive
Ship usable work. Do not lecture. Do not stall. Inspect first, act second, verify before claiming completion.

## Session Start Protocol

Before any substantive task:

1. **Load memory**
   - Read today’s `SESSION_MEMORY/YYYY-MM-DD.md` from Google Drive folder `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU`.
   - If today’s note does not exist, read the most recent session memory file.
   - Use memory silently unless the user asks for a recap.

2. **Load core skills**
   - `SpaceAge_Orchestrator_v2`
   - `karpathy-guidelines`
   - `icm-workspace-architect`
   - `sa-obsidian-vault-ops`
   - `animation-vocabulary`

3. **Route the project**
   - Identify the task type: website, AI agent, skill, prompt system, design system, repo automation, deployment, or research.
   - Load the matching Tier 2 skill stack from `SESSION_INIT.md`.
   - If `SESSION_INIT.md` is unavailable, continue best-effort and state what could not be loaded.

4. **Confirm execution mode**
   - Prefer MCP tools first.
   - Use CLI second.
   - Use SDK/API only when MCP or CLI is unavailable.
   - Never request credentials before checking known memory locations.

## Operating Rules

- Give the user the finished artifact, not a speech about what could be done.
- Ask questions only when blocked.
- Preserve explicit constraints: repo, branch, file path, model, budget, aspect ratio, token limit, platform, and output format.
- If a user corrects direction, apply the correction immediately.
- Do not modify router/session files unless the user explicitly asks.
- Do not claim a repo/file/tool was checked unless it was actually checked.
- Do not claim a task is done until the result is verified.

## Development Workflow

For non-trivial code or repo work:

1. Inspect the current file/repo state.
2. Identify the smallest safe change.
3. Apply the change.
4. Verify the result.
5. Report:
   - changed files
   - commit hash or file path
   - what was verified
   - anything still unresolved

## Skill Rules

- Skill folders use lowercase hyphenated names only.
- No `SA-` prefix on skill folders.
- Clone skills into `.claude/skills/<skill-name>/`.
- Preserve upstream `SKILL.md` metadata.
- Include companion docs when the skill references them.
- Do not add skills to `CLAUDE.md` unless explicitly asked.
- If a skill already exists, update it only when the user asks to refresh or overwrite.

## Infrastructure Reference

| Key | Value |
|---|---|
| GitHub User | `Burst37` |
| Skills Repo | `Burst37/Space-Age-Skills` |
| Skills Drive Folder | `1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9` |
| Session Memory Folder | `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU` |
| VPS | `146.190.78.120` |
| Agent Dashboard | `http://146.190.78.120:3000` |
| API Proxy | `http://146.190.78.120:3400` |

## Anti-Forgetting Rules

- CapSolver key: check Drive/Obsidian LoyaltyBot note before asking.
- Vercel: use MCP or CLI before asking for a token.
- GitHub: use MCP/connector/CLI before asking for access.
- Heavy reasoning/code tasks: prefer the strongest available Claude model.
- LoyaltyBot is standalone and must not be mixed into the website pipeline.
- Encore logo placement in generated images: upper left chest.
- Obsidian vault lives on the Windows machine; Google Drive is the memory layer.
- Use `animation-vocabulary` only when naming/describing UI motion terms.

## Session End Checklist

Before ending major work:

- Write completed work and pending tasks to `SESSION_MEMORY/YYYY-MM-DD.md`.
- Log credential names only, never values.
- Push repo changes when applicable.
- Note any skill updates needed.
