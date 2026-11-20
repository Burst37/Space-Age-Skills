---
name: photocraft
description: Drive PhotoCraft, the open-source Rust Photoshop-style image editor (layers, masks, adjustment layers, layer styles, type, vectors, brushes, 500+ commands, real PSD open/save), headless through `photocraft-cli` (run, batch, mcp) or MCP. Use when the user wants scripted or agent-driven image editing, batch grading/resizing/export of a folder, PSD edits, filters, adjustment-layer stacks, layer styles or mockup compositing without opening Photoshop; mentions PhotoCraft, `photocraft-cli`, or ArtCraft; or wants an agent to edit a layered document and preview it.
license: MIT OR Apache-2.0
---

# photocraft — headless Photoshop-style editing over CLI / MCP

Space Age skill for `github.com/storytold/photocraft` (MIT OR Apache-2.0, see `LICENSE.upstream`). Upstream is an 80 MB Rust workspace, so it is **not vendored**. Source of truth: upstream `AGENTS.md`, `docs/mcp.md`, `docs/control-protocol.md`, `book/src/automation/`. Sister app of `effectcraft` (same engine conventions, same ArtCraft family).

**Status (upstream docs/target-app-parity.md, 2026-10): a Photoshop 2026 clone, alpha-to-early-beta.** Feature breadth ~76%, ready for real pro work ~45%, essentials user ~61%. PSD open/save works but fidelity vs Photoshop is only partly measured; plug-in/scripting ecosystem and the AI tier are missing. Fine for scripted grading, filters, text/shape/mockup compositing and batch export; do not promise Photoshop-identical output or round-tripping a complex client PSD without checking it.

Every menu item, tool and dialog is a command in one registry (500+ ids). UI, CLI, control channel and MCP call the same commands.

## Setup (once)

1. Get the CLI: Linux deb/rpm install `/usr/bin/photocraft-cli`; or from source `cargo install --path apps/photocraft-cli --locked` (puts it in `~/.cargo/bin`; make sure the MCP client's PATH has it, or use the absolute path).
2. Register MCP with **explicit roots** (no root = no filesystem access):
   `claude mcp add photocraft -- photocraft-cli mcp --automation-read-root /abs/work --automation-write-root /abs/work`
   - Roots must be absolute. Paths in commands are relative to the root or absolute beneath it; `..` and escaping symlinks are refused.
   - `--bridge 7878 --control-token-file /private/tok` drives a running `photocraft --control 7878 ...` window (adds `ui_inspect` / `ui_screenshot`). In bridge mode set the roots on the desktop app, not on `mcp --bridge` (rejected).
3. `photocraft-cli --help`, `photocraft-cli <sub> --help` explain themselves.

## One-shot CLI (no MCP needed)

```
photocraft-cli run wave.psd \
  --cmd filter.sharpen.smartSharpen     --params '{"amount":80}' \
  --cmd layer.newAdjustmentLayer.curves --params '{"points":[[0,0],[64,48],[192,212],[255,255]]}' \
  --out wave-final.png

photocraft-cli batch --actions grade.json --in ./raw --out ./graded
```
Use `batch` for folders: one action list, many images.

## MCP loop

`doc_inspect` (layer tree, history, selection; `document:null` if empty) → `command_list {"filter":"curves"}` (ids, param docs, enabled state) → `command_run {id, params}` → `render_preview {index?, max_side?}` (PNG, default 1024, max 2048) → `doc_save`.

- `doc_new` makes a document; `command_batch {steps, stop_on_error?}` runs steps in order. **Not atomic**: earlier steps stay applied on failure.
- Undo: `command_run {"id":"edit.undo","params":{}}` once per history entry added (commands don't always add exactly one). Undo does not delete files already written.
- **Experiment on a copy**: `image.duplicate` or `history.newDocument` first, then edit the duplicate.
- Long commands: pass `"wait": false` and poll `jobs.list`; progress via `_meta.progressToken`, cancel with `notifications/cancelled`. `file.export.renderVideo` needs `doc_new` + `timeline.create` first and refuses existing filenames.
- Smart objects: `layer.smartObjects.editContents` / `saveContents` (save nested contents inside-out, then `doc_save` the parent). External linked sources that need a file read are refused.
- Unknown tool or param keys error with the accepted list; read it, don't guess ids (use `command_list`).

## Space Age rules

- Never edit the client's original: write to a new path under the write root (`--out`), keep the source untouched.
- Look at it: `render_preview` before and after each major step; check at least one export at 100%.
- Resources: `photocraft://document`, `photocraft://commands`.
- For raw-to-final photo retouch on a real client job, still verify in a reference app; for generated mockups, social assets and batch grading this is a good headless lane (pairs with `effectcraft` for motion, `logo-design-skill` / `brand-extractor` for assets).
