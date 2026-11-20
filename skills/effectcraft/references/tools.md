# EffectCraft MCP tools (from upstream docs/agents.md, docs/mcp.md)

| Tool | Use |
|---|---|
| `list_commands` / `describe_command` | find command ids, params, JSON Schema, enabled state |
| `execute_command {command, params}` | run any engine command (undoable) |
| `batch {steps, atomic?}` | many commands, one undo step, `$N.key` refs |
| `command_list` / `command_run` / `command_batch` | FilmCraft-style aliases (per-step undo) |
| `get_state` / `get_project` / `get_comp` / `doc_inspect` | orient |
| `get_layer {layer, depth?, flat?}` / `get_property` | property tree and values (every node has a `path`) |
| `set_property {layer, path, value?, time?, timeBase?, expression?}` | static value, keyframe, or expression |
| `add_keyframe {layer, path, keys, interpolation?}` | linear / bezier / hold / easyEase |
| `list_effects` / `add_effect {layer, effect, values?}` | one undo step, returns param paths |
| `list_fonts {query?, variable?}` | usable font families |
| `run_script {code}` | AE-style JS object model |
| `render_frame` / `render_preview` | PNG of a frame (`transparent:true` keeps alpha) |
| `open_project` / `save_project` / `undo` / `redo` / `history` | files and history |
| bridge only: `screenshot`, `ui_inspect`, `ui_click`, `ui_type`, `control` | operate the live window |

Resources: `effectcraft://document`, `effectcraft://commands`. Progress: pass `_meta.progressToken` on `renderQueue.render`; cancel with `notifications/cancelled`.
