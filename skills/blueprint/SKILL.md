---
name: blueprint
description: Turn a floor plan, a pen sketch or a few reference images into a photoreal 3D house in Blender, then a film of it building itself. Every footing, post, board, tatami mat, shoji strip and roof panel is its own object, stills are matched against references, and the film opens on the input itself, assembles the house part by part on top of it, brings it to life and walks inside. Use when someone wants a plan, a sketch, a brochure page or a description of a house, an apartment, a villa or a room turned into 3D, renders, a walk-through, a "build" video or an architecture visualisation.
---

# Blueprint

One input, one Blender scene in code, a set of stills, one film. Nothing is modelled by hand and no 3D file of the
house exists: the scene is a Python script that Claude writes, renders, looks at and fixes.

`SKILL_DIR` is the folder this file lives in. Renders go to `$BLUEPRINT_OUT` (default `./blueprint-out`).

## What you need

- **Blender 4.2 or newer** on PATH as `blender` (tested on 5.2 with Cycles on an NVIDIA GPU; any OptiX or CUDA card
  works, 8 GB is enough with the steps in "Fit the card").
- **Python 3** with `pillow` (the counter overlay) and, for reading a plan image, `opencv-python` and `numpy`.
- **ffmpeg** on PATH (or `FFMPEG=/path/to/ffmpeg`).
- **Optional:** `ELEVENLABS_API_KEY` for the music. Without it `tools/music.py` mixes the action sounds alone.

## First run

The materials and plants are CC0 from Poly Haven. Each house fetches its own into `$BLUEPRINT_ASSETS`
(default `~/.blueprint/polyhaven`) and skips what is already there:

```
python "$SKILL_DIR/houses/courtyard/fetch_assets.py"
```

## The three houses inside

| House | Input | Folder | What it shows |
|---|---|---|---|
| **Courtyard house** | a pen sketch on paper (`sketch.png`) | `houses/courtyard/` | 14 x 14 m, a 7 x 7 m court with a red maple, tatami room, engawa, standing-seam ring roof. The film opens on the sketch, builds 2,444 parts on the paper in white clay with each system flashing its colour and a counter, then a wave from the maple turns paper into hillside and clay into cedar, washi and stone. |
| **Cliff villa** | 4 reference images | `houses/villa/` | A travertine pavilion on a headland at sunset, an infinity pool cantilevered over the cliff. The film runs in over the sea, builds the villa from tiles and blocks, fills the pool, lights it up and dives in through the open glass. |
| **Apartment** | a floor plan from a sales brochure | `houses/apartment/` | A 3-bedroom flat, walls traced from the plan's fill at its scale bar, doors and furniture read on a metre grid. A dollhouse view, then a walk through. |

Each house has `build.py` (the scene, stills), `film.py` (the film), `score.py` (the action sounds on the film's
timeline) and `music_plan.json` (an ElevenLabs composition plan). Copy the closest one for a new house.

```
blender -b --factory-startup -P houses/courtyard/build.py -- tatami engawa corner --samples 192 --res 1920x1080
blender -b --factory-startup -P houses/courtyard/film.py -- --res 1920x1080 --samples 64
python houses/courtyard/hud.py --frames blueprint-out/courtyard/film --out blueprint-out/courtyard/silent.mp4
python tools/music.py --film blueprint-out/courtyard/silent.mp4 --score houses/courtyard/score.py --plan houses/courtyard/music_plan.json --out blueprint-out/courtyard/final.mp4
```

`film.py` resumes: frames already on disk are skipped, so a crashed render picks up where it stopped (delete any
empty placeholder first). `--stills 0,6,13` renders single moments for checks, `--step 3 --res 480x270 --samples 6`
a quick preview of the whole film.

## Building a new house

1. **Read the input into numbers, never into a mood.** A sketch: trust its dimension labels over its pixels (an image
   model draws a 14 m square 745 px wide and 670 px tall). A plan: find the scale bar, trace the wall fill, and read
   doors and windows by hand on a metre grid (`grid_view.py`); automatic opening detection puts doors across rooms.
   Write the rooms, walls, openings and furniture down as numbers before any geometry.
2. **Pin the look with 3-4 references.** Write image-model prompts for the views you will render (one high view, one
   room, one detail) and let the person generate them. They decide the materials, the light and the furniture.
3. **Build it the way a carpenter would.** Footings, sills, joists, posts, plates, tie beams, rafters, roof panels,
   cladding boards, floor boards, every tatami mat with its edging, every shoji with every kumiko strip, the glass,
   the furniture, the garden. Each one a separate object, tagged with its stage (`K.STAGE[0] = "frame"`): the film
   flies them in by stage and the counter counts them. Address repeated wings by a side and (u, v) coordinates so one
   function builds all four and the hips and valleys land on the diagonals.
4. **Render stills next to the references and fix what differs.** Low resolution first (960x540, 32 samples), the
   reference beside the render, one list of differences, then fix and render again. Look for things that poke
   through: a beam end through a roof reads as a dot from above, a rock through a pool floor as a stain.
5. **Pick the light last, and show both.** Blue hour reads moody and can read gloomy; a bright day after rain (a low
   sun, wet boards, a pale sky) reads open. `build.py --look day|dusk` switches the whole scene.
6. **Film it building itself.** Open on the input: the sketch as a textured plane mapped so its plan is the real
   size, a top-down camera with a long lens that spirals down while the lens shortens (the plan keeps its size while
   the perspective opens). Fly the parts in by stage in white clay with a colour flash per system. Then one event
   that makes it real (a wave of materials from the focal point, the lights coming on), a slow hold, and a move
   inside. End on the reference room's own framing.
7. **Fit the card.** Motion blur on thousands of animated parts runs an 8 GB card out of memory. Bake bevel modifiers
   into the meshes before keying (Cycles treats a modified mesh as deforming), and use decimated copies of heavy
   scanned plants (`make_tree_lod.py`: Poly Haven conifers are 2-7 million polygons each).
8. **Score it on the film's clock.** `film.py` writes `timeline.json` with every landing, the wave, the lights and the
   dive; `score.py` puts a sound on each in its own material (stone, hollow wood, paper, metal). Find the music
   track's swell and pass `--offset` so it lands on the reveal.
9. **Check frames, not code.** Contact sheets every second of the film at low resolution before the long render.

## Rules that cost a day each to learn

- **Tone mapping:** Khronos PBR Neutral. AgX turns a sunset orange into beige.
- **Glass:** thin, Transparent mixed with Glossy by Fresnel, no refraction. Smooth shading on an unbevelled box
  turns glazing into lenses; smooth only with a bevel and harden normals.
- **Poly Haven "set" files** (a row of shrubs, a heap of rocks) are split into single plants (`model_variants`).
- **A Mix node clamps its factor** by default: turn `clamp_factor` off for a sun disc or a halo added over a sky.
- **Painted tile joints double up** once a slab is cut into real tiles for the film: drop the painted joints there.
- **The camera never faces a blank wall at close range.** Coming in through an opening it turns round to the view
  in the opening, then pulls back into the room.
- **Films run a length that is not round** (18-25 s), and each house gets its own.
- **Images in the repo:** only what the person owns or CC0. A brochure plan stays with the person who brought it.
