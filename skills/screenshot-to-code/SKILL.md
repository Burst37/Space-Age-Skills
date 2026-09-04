---
name: screenshot-to-code
description: Use when converting a screenshot, mockup, Figma export, or screen-recording video into a working single-file HTML page (Tailwind, plain CSS, React, Vue, Bootstrap, or Ionic) — an agentic create→verify loop that closes the gap with a self-taken screenshot of its own output instead of trusting the model's guess.
---

# Screenshot-to-Code Patterns

## Overview

[abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) turns a screenshot, Figma design, or a video of someone using an app into functional, close-to-pixel-perfect code. The part worth porting into any agent doing image-to-code work isn't the FastAPI/React app itself — it's three structural decisions in `backend/`:

1. **Tool-driven output, never raw code in chat.** `create_file` / `edit_file` tools are the only way code leaves the model (`backend/prompts/system_prompt.py`). No "paste the HTML in your response" — this is what makes edits diffable and stops the model from silently drifting the whole file on a small change.
2. **Self-verification via `screenshot_preview`.** After every `create_file`/`edit_file` call, the agent renders its own HTML in a headless browser (desktop + mobile viewport, `backend/preview_screenshot/playwright_backend.py`) and looks at the result before declaring done. This is the single highest-leverage idea here: an LLM guessing at "does this look right" from markup alone is far worse than one that can actually look.
3. **Asset realism over asset guessing.** `extract_assets` pulls real image regions out of the source screenshot instead of letting the model invent placeholder graphics; `generate_images`/`edit_images`/`remove_backgrounds` only fill gaps for assets that truly can't be extracted (occluded, background texture). Never used to re-embed the whole screenshot as one image — the goal is real, editable markup.

## When to Use

- Converting a screenshot/mockup/Figma export into HTML/CSS/JS (or React/Vue/Bootstrap/Ionic) code
- Recreating a UI from a screen-recording video, including its interactions
- Any task where an agent generates visual/UI code and you want it to check its own work instead of shipping on the first guess
- NOT for backend/API code generation, and not a substitute for `frontend-design`/`design-taste-frontend` when the ask is original design direction rather than replicating a given reference

## Core Pattern

```
1. Normalize input → one or more image data URLs, or a video data URL, plus a target stack
   (html_css | html_tailwind | react_tailwind | vue_tailwind | bootstrap | ionic_tailwind)
2. Build the prompt in two layers:
   - System prompt: tone/tool-usage rules + stack-specific include-script snippets
     (see Quick Reference below — copy the exact CDN tags, do not improvise versions)
   - User turn: "match this exactly" replication instructions (image case) or
     "recreate the interactions" instructions (video case)
3. Agent loop, tool-gated:
   a. create_file (single call, full HTML, path defaults to index.html)
   b. extract_assets → pull real image regions from the source screenshot
   c. generate_images / edit_images / remove_backgrounds → only for non-extractable assets
   d. screenshot_preview → render the current HTML, desktop + mobile
   e. If preview shows broken layout/overlap/wrong spacing/colors → edit_file with exact
      old_text/new_text replacement (never regenerate the whole file for a small fix)
   f. Repeat c–e until the preview matches the source
4. One or two sentence summary of what was built. No code in the chat response.
```

## Quick Reference — stack include tags (copy exactly, versions are pinned for a reason)

| Stack | Required tags |
|---|---|
| `html_tailwind` | `<script src="https://cdn.tailwindcss.com"></script>` |
| `html_css` | Plain HTML/CSS/JS only — do not add Tailwind |
| `bootstrap` | `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">` |
| `react_tailwind` | React 18 UMD + `https://unpkg.com/@babel/standalone@7.25.6/babel.min.js` (pin this exact version — the unversioned URL now resolves to Babel 8, which injects an `import` that breaks in-browser transforms) + Tailwind CDN tag |
| `ionic_tailwind` | Ionic core ESM/nomodule scripts + Ionic CSS bundle + Tailwind CDN tag + ionicons script near `</body>` |
| `vue_tailwind` | Vue 3 global build + Tailwind CDN tag |

## Implementation

```
1. Collect image(s) or video as data URLs; pick the target Stack.
2. Compose system prompt = tool-usage rules + the one matching stack block above.
3. Compose user turn:
   - Images: "generate code that looks exactly like the screenshot(s)" + replication
     rules (exact text, extract real assets first, generate only for non-extractable
     ones, upscale via edit_images rather than CSS-stretching a low-res asset) +
     multi-screenshot handling (distinct linked pages vs. one component's states).
   - Video: "recreate the app such that the same interactions produce the same
     results" — watch the whole video, match colors/spacing/typography exactly,
     mock any backend calls, make it actually functional with JS, not a static trace.
4. Run the tool loop: create_file once → extract_assets → fill gaps with
   generate_images/edit_images/remove_backgrounds → screenshot_preview → edit_file
   for any visual mismatch → re-screenshot until it matches.
5. Never let the model paste HTML directly into a chat response — if you can't wire
   real create_file/edit_file/screenshot_preview tools, at minimum replicate the loop
   structure: generate → render/inspect the output yourself → patch → re-check.
```

## Common Mistakes

- **Trusting the first generation without a look-back pass.** The screenshot_preview step exists specifically because models are unreliable at judging their own markup's visual correctness from code alone — always close the loop with an actual render.
- **Regenerating the whole file for a one-line fix.** Burns tokens and risks drifting parts that were already correct; use exact-match edits.
- **Embedding the entire source screenshot as one background image.** Defeats the purpose — assets should be extracted/generated individually so the result stays editable, real markup.
- **Improvising CDN script versions/URLs.** The Babel and Bootstrap pins above exist because unpinned URLs silently broke in production; copy them verbatim.
- **Skipping the extract-before-generate order.** Generating a fresh image for something that was extractable produces a worse, non-matching asset — always try `extract_assets` first.
