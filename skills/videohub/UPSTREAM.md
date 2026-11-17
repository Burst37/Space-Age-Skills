# VideoHub upstream
- Source: VideoHub repo (MIT, (c) 2026 VideoHub contributors), uploaded as `Videohub-main.zip`.
- Vendored here: the agent skill (`SKILL.md`, verbatim) and `global-rule.md` (optional review rule).
- NOT vendored: the app (server, UI, installer). The skill's `{{VIDEOHUB_DIR}}` placeholder is filled by its installer.
- Needs: Node 22+, ffmpeg, Chrome/Chromium/Edge, Claude Code or OpenCode, a desktop session.
- Install: unpack the repo, run `SETUP.cmd` (Windows) or `./setup.sh` (Linux/macOS; add `--dry-run` first). Setup registers the `videohub` MCP server (`hub_*` tools) and installs this skill. Restart the agent.
- Not usable in headless cloud sessions (no UI); use on the user's own machine.
- Fits `animation-studio-director`: review code-built films/animatics/breakdown reels in the live preview before rendering.
