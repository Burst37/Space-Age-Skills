---
name: screenshot-to-code
description: Use when converting a screenshot, mockup, Figma export, or screen-recording video into a working single-file HTML page (Tailwind, plain CSS, React, Vue, Bootstrap, or Ionic). Ports abi/screenshot-to-code's actual system prompt, user-turn templates, and tool contract verbatim, and includes a real, tested screenshot_preview implementation (Playwright) so the self-verification loop the original app relies on actually runs here instead of being described in prose.
---

# Screenshot-to-Code

## What this is

A verbatim port of [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code)'s prompt layer, not a paraphrase of it:

- `reference/system_prompt.md` — the exact `SYSTEM_PROMPT` string from `backend/prompts/system_prompt.py`, unedited.
- `reference/prompt_templates.md` — the exact user-turn templates from `backend/prompts/create/{image,text,video}.py`, plus the exact substitution rules from `backend/prompts/policies.py` and `backend/prompts/design_system.py`.
- `reference/tool_schemas.json` — the exact tool names, descriptions, and JSON schemas from `backend/agent/tools/definitions.py` (`canonical_tool_definitions`), including which tools are conditionally available.
- `scripts/screenshot_preview.py` — a **working** reimplementation of the `screenshot_preview` tool (see below), not a description of one.

Use this when the task is "make code that looks like this image/video." Load `reference/system_prompt.md` as your operating instructions for the task, and `reference/prompt_templates.md` to build the actual user turn for the input type you have (image / video / text), substituting the selected stack, image policy, and design system exactly as documented there.

## The honesty problem this version fixes

The original app's system prompt and tool descriptions refer to tools by name — `create_file`, `edit_file`, `generate_images`, `edit_images`, `remove_backgrounds`, `extract_assets`, `screenshot_preview`, `retrieve_option` — that only exist inside its own FastAPI backend. Loading the verbatim prompt text alone (as a previous version of this skill did) makes an agent narrate calling tools that don't exist in whatever harness is actually running it. Below is the real mapping. Use it every time you follow `reference/system_prompt.md`'s tooling instructions.

| Prompt's tool name | What actually happens here |
|---|---|
| `create_file` | Write tool — write the full HTML to `index.html`, once. |
| `edit_file` | Edit tool — exact old_text/new_text replacement, never a full rewrite. |
| `screenshot_preview` | **Real**: run `python3 scripts/screenshot_preview.py <html_file> <out_dir>` (see Setup below), then use Read on the two resulting PNGs to actually look at them. This is a genuine implementation, tested against this environment's pre-staged Chromium — not aspirational. |
| `generate_images` / `edit_images` / `remove_backgrounds` | Only real if an image-generation MCP tool is attached this session (e.g. Adobe Firefly, Higgsfield). Check what's available before claiming to use these; if none is attached, follow the prompt's own fallback (`image_policy` in `reference/prompt_templates.md`): use `https://placehold.co` placeholder URLs or CSS, and say so. |
| `extract_assets` | No equivalent unless a vision-crop/segmentation tool is attached this session. If not, this step is honestly unavailable — fall back to `generate_images`'s path per the prompt, or ask the user for the real asset. Do not claim to have extracted anything you didn't. |
| `retrieve_option` | Not applicable — that's the original app's multi-variant UI feature. Skip it; there's nothing to port. |
| `save_assets` | Out of scope — its schema lives outside `definitions.py` (`backend/uploaded_assets/tools.py`) and wasn't ported. See `reference/tool_schemas.json`'s note. |

## Setup for `screenshot_preview.py`

```bash
pip install playwright   # the Python driver; browser binary is not re-downloaded
python3 scripts/screenshot_preview.py <path-to-html-file> <output-dir>
# writes <output-dir>/preview_desktop.png (1280x832) and preview_mobile.png (342x684)
```

In an environment that pre-stages Chromium via `PLAYWRIGHT_BROWSERS_PATH` with a `chromium` symlink at its root (true of this one — verified against `/opt/pw-browsers/chromium`), the script finds it directly and skips `playwright install`, which avoids the revision mismatch between whatever `playwright` pip version you get and the browser revision actually staged (`Executable doesn't exist at .../chrome-headless-shell` — hit and fixed while building this). If no pre-staged browser is found, unset `executable_path` and run `playwright install chromium` once.

## Core loop

```
1. Build the prompt: reference/system_prompt.md (system) + the matching
   reference/prompt_templates.md template (user), substituted per its rules.
2. Write the HTML (index.html), following the stack-specific include-tag
   instructions in reference/system_prompt.md exactly — do not improvise CDN
   URLs or versions, they're pinned there for documented reasons (see the
   Babel 7.25.6 note).
3. Run screenshot_preview.py, Read both PNGs.
4. If layout is broken, spacing/colors are wrong, or content doesn't match
   the source: Edit with an exact-match replacement, then re-run step 3.
   Repeat until the render matches.
5. One or two sentence summary of what was built. No code in chat, per the
   system prompt's tone rules.
```

## Common Mistakes

- **Treating the tool-name mapping table as optional.** Without it, "call screenshot_preview" becomes a sentence you type instead of a script you run — that gap is the whole reason this version exists.
- **Regenerating the whole file for a one-line fix.** The system prompt is explicit: edit_file only, never re-emit the full HTML for a small change.
- **Improvising CDN script versions.** `reference/system_prompt.md` pins Babel and Bootstrap for stated reasons (Babel 8's unversioned URL breaks in-browser JSX transforms) — copy them verbatim.
- **Claiming asset extraction or image generation happened when no tool for it was attached.** Say so and fall back per the prompt's own `image_policy`, don't fabricate a result.
- **Skipping the screenshot step because "it's probably fine."** That's the exact failure mode the original app's design argues against — an LLM judging its own markup without rendering it is unreliable; that's why the real script exists now.
