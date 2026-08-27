---
name: cli-anything
description: >
  Make any software agent-native via CLI. Two halves: (1) DISCOVER + INSTALL a
  ready-made agent harness from the CLI-Hub registry — 79 harnesses for Blender,
  GIMP, Inkscape, Krita, Kdenlive, Shotcut, OBS, Audacity, LibreOffice, Obsidian,
  n8n, ComfyUI, Ollama, Godot, QGIS, Zotero and more, plus 24 public CLIs —
  instead of hand-rolling Playwright/subprocess glue; (2) BUILD a new harness for
  software the registry does not cover, using the 7-phase HARNESS SOP. Use this
  skill BEFORE writing any automation wrapper around a desktop app, creative tool,
  or GUI-first product. Trigger on: "automate <GUI app>", "drive Blender/GIMP/
  Kdenlive/OBS headlessly", "no API for this app", "render/export programmatically",
  "build a CLI for", "agent harness", "cli-hub", "CLI-Anything", "make this
  agent-native", "headless <app>".
category: automation
source: https://github.com/HKUDS/CLI-Anything
license: Apache-2.0
---

# CLI-Anything — Making All Software Agent-Native

**The premise:** today's software serves humans. Tomorrow's users are agents.
Every GUI app already separates presentation from logic — the engine underneath
(MLT, ImageMagick, bpy, ODF, melt, sox) is scriptable. A harness is a stateful,
JSON-speaking CLI that drives that engine, so an agent can operate the software
with no display, no mouse, and no screen-scraping.

**The prime directive:** a harness *calls the real software*. It never
reimplements it. Build the data → call the real software → verify the output.

---

## Decide first: consume or build

```
Need to drive some software from an agent?
│
├─ Does a harness already exist?  →  cli-hub search <software>
│     └─ YES → INSTALL IT. Stop. Read its SKILL.md. Do not rebuild.
│
├─ Does a matrix cover the whole workflow (video, image, 3d, game, research)?
│     └─ YES → cli-hub matrix preflight <matrix> → install ONLY the capability you need.
│
└─ NO harness → BUILD ONE with the 7-phase SOP (reference/HARNESS.md).
```

Checking the registry first is not optional — 79 harnesses plus 24 public CLIs
already exist, and the catalog grows weekly. Rebuilding one by hand is the single
most expensive mistake available here.

---

## Half 1 — Consume: find and install a harness

```bash
pip install cli-anything-hub

cli-hub search video          # or: list, list -c <category>, can "<intent>"
cli-hub info kdenlive         # prerequisites, install cmd, SKILL.md path
cli-hub install kdenlive
cli-anything-kdenlive --json project info
```

Every harness: `--json` on every command, a REPL when invoked bare, a shipped
`SKILL.md`, and the real application as a **hard dependency** (it errors with
install instructions rather than degrading to a fake fallback).

- Full command surface, matrices, and the preview producer/consumer split →
  **`reference/cli-hub.md`**
- Snapshot of every harness by category, plus the public CLIs →
  **`reference/catalog.md`** (the live `cli-hub list` is authoritative)

### High-value picks for this stack

| Need | Harness |
|---|---|
| Video edit / render | `kdenlive`, `shotcut` (melt/ffmpeg), `openscreen`, `videocaptioner` |
| Image / vector / raster | `gimp`, `inkscape`, `krita`, `sketch` |
| 3D + CAD | `blender`, `freecad`, `cloudcompare` |
| Screen capture / streaming | `obs-studio`, `quietshrink` |
| Audio | `audacity` (sox), `musescore` |
| Docs / office | `libreoffice` (→ PDF/DOCX/XLSX/PPTX) |
| Knowledge | `obsidian`, `joplin`, `zotero`, `siyuan` |
| Automation / infra | `n8n`, `pm2`, `chromadb` |
| AI | `comfyui`, `ollama`, `minimax`, `novita` |
| Browser | `browser` (DOMShell MCP), `safari`, `clibrowser` |

---

## Half 2 — Build: the 7-phase harness SOP

Read **`reference/HARNESS.md`** in full before writing code. Condensed:

1. **Codebase analysis** — find the backend engine, map GUI actions → API calls,
   identify the native project format, find the engine's existing CLI, catalog the
   undo/command system.
2. **CLI architecture** — subcommand CLI *and* stateful REPL; command groups
   (project / core ops / import-export / config / session); state model; `--json`
   on everything.
3. **Implementation** — data layer first, then probe/`info` commands, then
   mutations, then a `utils/<software>_backend.py` that shells out to the real
   app, then export, then session persistence (locked JSON saves), then the REPL
   using `scripts/repl_skin.py`.
4. **Test plan** — write `TEST.md` *before* any test code: inventory, unit plan,
   E2E plan, realistic workflow scenarios.
5. **Test implementation** — unit (synthetic) → E2E intermediate-file → E2E
   **invoking the real software** → CLI subprocess tests via `_resolve_cli()`.
   No graceful degradation, no skips when the app is missing.
6. **Test documentation** — append real `pytest -v` output to `TEST.md`.
   **6.5 — SKILL.md generation** via `scripts/skill_generator.py` +
   `templates/SKILL.md.template`.
7. **PyPI publishing** — PEP 420 namespace package: `cli_anything/` has **no**
   `__init__.py`; `cli_anything/<software>/` does.

### The two pitfalls that kill harnesses

- **Reimplementing the software.** A Pillow compositor instead of GIMP, a bpy
  script never handed to Blender. Produces a toy that diverges from real behavior.
  The app is a required dependency.
- **The rendering gap.** You add effects to the project file, then render with a
  naive tool (ffmpeg concat) that reads raw media and silently drops every effect.
  Output looks identical to input. Priority order: **native engine → translated
  filtergraph → generated script**.

### Non-negotiables

Fail loudly with actionable errors · be idempotent · ship introspection
(`info`/`list`/`status`) · `--json` everywhere · REPL is the default
(`invoke_without_command=True`) · verify outputs programmatically (magic bytes,
ZIP structure, pixel/RMS probes) — "it exited 0" proves nothing · previews must
be honest backend output, never screen-scraped GUI windows · every
`cli_anything/<software>/` needs a `README.md`, every `tests/` a `TEST.md`.

---

## Bundled resources

| Path | Use |
|---|---|
| `reference/HARNESS.md` | The full 7-phase SOP, patterns, pitfalls, principles, preview protocol |
| `reference/cli-hub.md` | `cli-hub` command surface, matrices, previews |
| `reference/catalog.md` | Registry snapshot by category |
| `reference/guides/` | Deep dives loaded on demand — see table below |
| `scripts/skill_generator.py` | Generate a harness `SKILL.md` from CLI metadata |
| `scripts/repl_skin.py` | Drop-in unified REPL skin (banner, prompt, help, tables) |
| `templates/SKILL.md.template` | Jinja2 template behind the generator |

| Guide | Read when | Phase |
|---|---|---|
| `session-locking.md` | Implementing session save (all harnesses) | 3 |
| `preview-methodology.md` | Designing preview / live-preview flows | 3, 6.5 |
| `mcp-backend.md` | Software has an MCP server, no native CLI | 3 |
| `filter-translation.md` | Effects need render-time translation (MLT → ffmpeg) | 3 |
| `timecode-precision.md` | Non-integer frame rates (29.97fps) | 3, 5 |
| `auto-save-dry-run.md` | Auto-save and dry-run semantics | 3 |
| `skill-generation.md` | Generating the SKILL.md | 6.5 |
| `pypi-publishing.md` | Packaging under the `cli_anything` namespace | 7 |

---

## Attribution

Methodology, guides, generator, and REPL skin are vendored from
[HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) (Apache-2.0, see
`LICENSE`). Tech report: [arXiv:2606.03854](https://arxiv.org/abs/2606.03854).
Refresh with `git clone --depth 1 https://github.com/HKUDS/CLI-Anything` and
re-copy `cli-anything-plugin/{HARNESS.md,guides,skill_generator.py,repl_skin.py,templates}`.
