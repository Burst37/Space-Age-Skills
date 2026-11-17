---
name: videohub
description: How an agent makes and reviews videos with VideoHub, the user's local hub for videos written as code (project catalog, live preview that plays a film from its code with no render, review notes on frames, a protected one-at-a-time render queue with partial re-renders). Use whenever the user asks for a video, animation, explainer, short or film made in code; whenever a video project is previewed, rendered, re-rendered, reviewed or cleaned up; when the user mentions VideoHub, review notes, "Send to your agent", the render queue, or pastes a "VideoHub: N notes on …" or "VideoHub Thumbnail: …" message; and for thumbnails made from a VideoHub sketch (hub_thumb_*).
---

# VideoHub workflow

VideoHub (installed at `{{VIDEOHUB_DIR}}`, UI http://127.0.0.1:7788) is where the user watches a film, steps through
frames, draws on them and leaves notes, and where renders are queued one at a time with CPU/RAM protection.
**The user's rule: a film is reviewed in VideoHub's live preview first and rendered only when the user asks.**

## Tools (MCP server `videohub`)

| Tool | Use |
|---|---|
| `hub_live({project?, open?})` | Open the film in the live preview — it plays from its code, no render. Call it as soon as a new film plays, then stop and wait for the user's notes. |
| `hub_workspace()` | Where this PC keeps its video work: the workspace, the films folder for new films, the outputs folder. Call it before creating a new film. |
| `hub_project({project?, set?})` | Find the project (folder / name / id; default: the working folder): status, versions, open notes, render recipe. `set` saves `title`, `status`, `render` (`env.DUR`, `workers`, `mux`). |
| `hub_notes({project?})` | The user's open notes: time, frame, chunks, text, picture paths. Marks them "claude". |
| `hub_note_update({id, status:"fixed", reply})` | After fixing a note; reply = one sentence of what changed. |
| `hub_render({mode, notes?, seconds?, chunks?, wait:true})` | Queue a render — only when the user asked for one. `partial` re-renders only the chunks the notes touch. |
| `hub_job({id, wait:true})` | Wait for / check a render. |
| `hub_register_version({file, changedRanges?, note?})` | Register a video made outside the queue. |
| `hub_cleanup()` | What can be cleaned up (the user approves it in VideoHub; never delete yourself). |
| `hub_thumbs` / `hub_thumb_brief` / `hub_thumb_variant` | Thumbnails (see below). |

**Without the MCP tools** (the server is not loaded in this session) the same tools run from the command line:
`node "{{VIDEOHUB_DIR}}/server/cli.js" <tool> "<json>"`, e.g.
`node "{{VIDEOHUB_DIR}}/server/cli.js" hub_live "{\"project\":\"/home/me/film\"}"`. The tools start the hub
themselves when it is not running.

## 1. The user asks for a video → build it as code

1. Call `hub_workspace` and make the film's own folder in the films folder it names (`<workspace>/films/<name>`), even
   when this chat runs in another folder: every film lives in the workspace, one folder per film, and nothing of one
   film goes into another film's folder. Finished renders are collected in `<workspace>/outputs` by VideoHub itself
   (`hub_project` on any folder tells you whether VideoHub sees it). Start from the template:
   copy `{{VIDEOHUB_DIR}}/templates/new-film` (see its README) — or study `{{VIDEOHUB_DIR}}/examples/hello-film`.
2. Follow the project contract (`{{VIDEOHUB_DIR}}/docs/PROJECT-CONTRACT.md`). The essentials:
   - the page defines `window.renderOut(t)`: draws second `t` **synchronously** on **fixed-size** canvases
     (e.g. 1920×1080), as a pure function of `t` (no `Date.now()`, no state between frames, no unseeded random);
   - `window.READY = true` once every asset is loaded;
   - the sound is `audio/mix.wav`; the scenes are in `window.VH_SCENES = [{name, t0, t1}]`;
   - `render.js` renders 2-second chunks to `render/chunks/c_NNN.mp4` and honours `ONLY=` (the template's does).
     Keep the template's script as it is: it reads frames straight from a single full-size canvas (keep the picture on
     one `VW`×`VH` canvas, no HTML text over it, or it falls back to slower screenshots) and uses the graphics-card
     encoder chosen in VideoHub (`VIDEOHUB_ENCODER`).
3. Save the film's length once: `hub_project({project, set:{title, status:"in-progress", render:{workers:2, env:{DUR:"<seconds>"}}}})`.
   If the sound is mastered with its own ffmpeg command, save it as `render.mux` (array of ffmpeg args with `{video}`
   and `{out}`); otherwise the queue puts `audio/mix.wav` (first render) or the previous final's sound under the picture.
4. Check it yourself cheaply if you need to (a few stills: `node render.js snap 1 4.5 9`), never a full render.

## 2. It plays → open it in VideoHub and STOP

Call `hub_live({project: "<film folder>"})`. Do **not** render. Then tell the user, **in the user's own language**,
in one or two sentences: the film is open in VideoHub's live preview; watch it, click on any frame (or draw on it) to
leave a note, and press **Send to your agent** when done, then paste the message here.
If `hub_live` says the page cannot play live, fix the page (the reason says what is missing). Only if the user asked
for a finished video outright, or the film cannot have a live page, go straight to a render — and say so.
Do the same after any big change to an already rendered film.

## 3. Notes arrive → fix them in code

The pasted message starts `VideoHub: N notes on "…"` and names the project folder: pass it as `project` to every
`hub_*` call, whatever folder this chat runs in. If this chat does not know the project yet, read its
STATE.md / CLAUDE.md / README first.
1. `hub_notes({project})` → for each note open the `close-up` picture with Read (the full annotated frame only if the
   close-up is not enough). Do not render frames or contact sheets to find the moment: the note gives time, frame and chunk.
   A note marked `RANGE frames A–B` covers that whole range: look at its first/last-frame pictures and make the fix hold
   for every frame in it. `narration at that moment: «…»` is the sentence being spoken there — use it to find the shot.
2. Fix the cause **in the code**. Notes marked `LIVE PREVIEW` need no render at all: the user's open preview reloads by
   itself when a file changes.
3. `hub_note_update({project, id, status:"fixed", reply:"<one sentence>"})` for each note.
4. Tell the user in 1–2 sentences what changed and to check it in VideoHub. Do not re-review the whole film yourself.
A note with status `reopened` ("STILL THERE") means your last fix did not work: read the user's new text and your
previous reply before trying again.

## 4. The user says to render → one render, through the queue

Only now: `hub_render({project, mode:"full", wait:true})` for the first render; later, after fixing notes on a rendered
version, `hub_render({project, mode:"partial", notes:[ids], wait:true})` re-renders just those 2-second chunks, joins the
film again and saves `<name>_vN.mp4` with the changed ranges. One render at a time on the PC: never run `node render.js`
for a full film yourself and never start renders in parallel (the queue waits while another session renders, and the
render protection keeps the PC usable). `mode:"preview"` gives a quick half-size pass where the project supports it.
- If `hub_render` / `hub_job` print programs holding a lot of RAM (e.g. an Android emulator), tell the user in one
  sentence that closing it makes the render faster. Never close anything yourself.
- After the first full render set the status `review` (`hub_project({set:{status:"review"}})`); the user moves it to
  `approved` / `published`.
- When it is done, give the user the version and the path, and point them to **Watch only the changes** in VideoHub,
  which plays just the re-rendered ranges; the **Check fixes** tour walks the fixed notes (before/after) and the user
  either approves them or marks them "Still there" — those come back to you as `reopened`.

## What the user changes in VideoHub without you
A film's `tweaks.json` holds edits the user makes in VideoHub: `sound` (levels, "Remove music", ducking),
`audio.clips` (sounds added on the timeline, files in `vhaudio/`), and — on engines with VideoHub's hooks — `shots` /
`cuts` (scene editor), `items2d` / `actors2d` (2D layers, files in `vh2d/`). Never delete or overwrite these files or
keys when you edit the film; read them when a note mentions something the code does not draw. "Make permanent" = move
an entry into the film's code and remove it from `tweaks.json`.

## Thumbnails
The user lays a thumbnail out in VideoHub → Thumbnail and presses **Send to your agent**, which copies a message starting
`VideoHub Thumbnail: "…"`. Then: `hub_thumb_brief({id})` → Read `sketch.png` (annotated) and `layout.png` (the
composition guide; if missing, ask the user to press "Export" first) → generate with whatever image tool you have
(layout.png as the first reference image) → `hub_thumb_variant({id, file, prompt?, parent?, fixes?})`. Never draw the
title text into the image: the user adds it in VideoHub's Final step. New templates go into the user templates folder
(Settings) in the format of `{{VIDEOHUB_DIR}}/templates/thumbnail/SCHEMA.md`.

## Cleanup
Intermediate files (silent renders next to a voiced final, old chunks, browser profiles, old QA frames, old versions)
are listed by `hub_cleanup` and removed by the user from VideoHub → Disk (Recycle Bin; old versions to the archive).
Do not delete them yourself.
