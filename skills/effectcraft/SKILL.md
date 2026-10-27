---
name: effectcraft
description: Drive EffectCraft, the open-source Rust motion-graphics and VFX compositor (After Effects-style comps, layers, keyframes, 306 effects, expressions, 3D, render queue), through its MCP server or `effectcraft-cli`. Use when the user wants animated titles, lower thirds, motion graphics, compositing, keyframed layers, Lottie export or scripted renders without opening a GUI; mentions EffectCraft, `.ecproj`, `effectcraft-cli`, or ArtCraft; or wants an agent to build and preview a comp frame by frame.
license: MIT OR Apache-2.0
---

# effectcraft — headless motion graphics over MCP / CLI

Space Age skill for `github.com/storytold/effectcraft` (MIT OR Apache-2.0, see `LICENSE.upstream`). Upstream is a 47 MB Rust workspace, so it is **not vendored**. This skill is the operating guide; the source of truth is upstream `docs/agents.md`, `docs/mcp.md`, `docs/control-protocol.md`.

Every action is an engine command with a stable id and JSON params. Menus, CLI, MCP and the control channel all run the same commands, so anything a user can do an agent can do.

## Setup (once)

1. Get the CLI. Release packages ship `effectcraft-cli` (Linux deb/rpm: `/usr/bin/effectcraft-cli`; macOS: separate `effectcraft-cli-<ver>-macos-<arch>.zip`; Windows MSI: `C:\Program Files\EffectCraft\`). Or build: `cargo build --release -p effectcraft-cli` (Rust 1.95+).
2. Register MCP: `claude mcp add effectcraft -- effectcraft-cli mcp --autosave`
   - `--demo` or `--project file.ecproj` to start with content; `--gpu` for GPU render (exits if no adapter).
   - `--bridge 9877` instead drives a running `effectcraft --control 9877` window and adds `screenshot` / `ui_*` tools.
3. **Always pass `--autosave`** headless, or call `save_project` after each milestone; otherwise a restart loses unsaved work.
4. Untrusted briefs: confine file access with `--automation-read-root DIR` / `--automation-write-root DIR` (scripts and UI tools are refused while confined).

## Core loop

`get_state` → `get_project` → `get_comp` (orient) → build with `execute_command` / `batch` → `render_frame` (look at it) → `save_project`.

Example intro:
1. `execute_command {"command":"comp.new","params":{"name":"Intro","width":1920,"height":1080,"frameRate":30,"duration":4}}`
2. `execute_command {"command":"layer.newText","params":{"name":"Title","text":"Hello","size":160,"fill":"#ffffff"}}`
3. `add_keyframe {"layer":"Title","path":"transform/position","keys":[{"time":0,"value":[-300,540]},{"time":1.5,"value":[960,540]}],"interpolation":"easyEase"}`
4. `add_effect {"layer":"Title","effect":"Gaussian Blur","values":{"blurriness":8}}`
5. `render_frame {"time":1.0,"max_side":640}` then `save_project {"path":"intro.ecproj"}`

Discovery: `list_commands {"filter":"mask"}` then `describe_command` (params + JSON Schema); `list_effects {"filter":"glow"}`; `list_fonts`.

## Rules that prevent wasted turns

- **Name layers on creation** (`name` param), then refer to them by name. Layers: id, `"#n"` (1-based from top) or name. A reference matching nothing is an error.
- **Layer time vs comp time.** `add_keyframe` / `set_property` take layer time; `get_property`, `render_frame` take comp time. On offset/stretched layers pass `timeBase:"comp"`. `run_script` uses comp time.
- Use paths that replies return (`effects/#2`, `contents/group/contents/gfill`, `@uid`) with `set_property`.
- Unknown param keys are rejected with the accepted list. Read the error, don't guess.
- `batch` = one undo step, rolls back on failure, `"$N.key"` references step N's result. `command_batch` = per-step undo, stops at first error.
- Scripts: `run_script` takes After Effects-style JS (`app.project`, `comp.layers.addText`). Wrap loops in `app.beginUndoGroup()` / `app.endUndoGroup()`. `app.run(id, params)` calls any engine command.
- Only one render at a time. Edits during a render don't affect it; re-render after.
- Missing media after open: `footage.check {"wait":true}` then `file.findMissing {"what":"footage"}`.
- Undo: `undo {}` or `history {"goto": n}`.

## One-shot CLI (CI / scripts)

```
effectcraft-cli set Main '#1' transform/position '[100,360]' --time 0 main.ecproj --save
effectcraft-cli render --comp Main --out main.mp4
effectcraft-cli exec file.exportLottie '{"comp":"Main","path":"main.json"}' main.ecproj
```
Add `--json` for machine output.

## Space Age rules

- Verify visually: render a frame at the start, middle and end before declaring done.
- Client deliverables: keep the `.ecproj` plus the export; log the CLI version used.
- Prefer this over hand-rolled ffmpeg/After Effects JSX for titles and overlays. For footage editing use `capcut-video-director` / `davinci-resolve-director`.

See `references/tools.md` for the tool table.
