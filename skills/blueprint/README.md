<h1 align="center">blueprint</h1>

<p align="center"><b>A pen sketch, a floor plan or 3 reference images in. A 3D house that builds itself out.</b><br>
A Claude Code skill. Every board, every tatami mat, every shoji strip and every frame is code, rendered in Blender.</p>

<p align="center"><img src="https://raw.githubusercontent.com/Nyxera0x/blueprint/main/docs/hero.gif" alt="A pen sketch on a desk, the courtyard house assembling on top of it from 2,444 parts, then coming alive" width="100%"></p>

<p align="center">
<b>3 houses inside</b> &nbsp;·&nbsp; <b>2,444 parts in the courtyard house alone</b> &nbsp;·&nbsp; <b>no 3D files of the houses</b> &nbsp;·&nbsp; <b>CC0 materials</b>
</p>

---

## What it makes

You hand Claude what you have: a sketch on paper, a plan from a sales brochure, or a few images of the look you
want. Claude reads it into numbers (walls, rooms, openings, the scale), writes the whole house as one Blender script
with every part a separate object, renders stills next to your references and fixes what differs. Then it films the
house building itself on top of the input, brings it to life and walks inside, with a sound on every part that lands.

<table>
<tr>
<td width="33%"><img src="https://raw.githubusercontent.com/Nyxera0x/blueprint/main/docs/courtyard.gif" alt="The courtyard house assembling on the sketch"><br><b>Courtyard house</b> · from a pen sketch<br><sub>14 x 14 m, a red maple in a 7 x 7 m court. The frame, the floors, the walls, the shoji and the roof land on the paper in white clay, each system in its own colour, with a counter.</sub></td>
<td width="33%"><img src="https://raw.githubusercontent.com/Nyxera0x/blueprint/main/docs/villa.gif" alt="The cliff villa building itself at sunset"><br><b>Cliff villa</b> · from 4 references<br><sub>A travertine pavilion on a headland, an infinity pool over the cliff. Tiles and blocks fly in, the pool fills, the lights come on, a dive in through the glass.</sub></td>
<td width="33%"><img src="https://raw.githubusercontent.com/Nyxera0x/blueprint/main/docs/apartment.gif" alt="The apartment building itself from the floor plan"><br><b>Apartment</b> · from a brochure plan<br><sub>Walls traced from the plan at its scale bar, doors and furniture read on a metre grid. A dollhouse, then a walk through the rooms.</sub></td>
</tr>
</table>

## How it works

| | |
|---|---|
| **Numbers first** | The input becomes rooms, walls, openings and furniture in metres before any geometry. A sketch's dimension labels beat its pixels. |
| **Built like a carpenter** | Footings, sills, posts, beams, rafters, roof panels, cladding, boards, tatami, kumiko: each its own object, tagged with its stage. |
| **Stills against references** | Render low, put the reference beside it, list the differences, fix, render again. |
| **The film opens on the input** | The sketch is the first frame. The camera spirals down out of it while the parts land on the paper. |
| **Fits an 8 GB card** | Bevels baked before motion blur, scanned conifers decimated 8x. |

## Install

```
npx skills add Nyxera0x/blueprint -g -a claude-code
```

You also need [Blender](https://www.blender.org/download/) 4.2+, Python 3 with `pillow` (plus `opencv-python` and
`numpy` to read a plan image), and ffmpeg. Fetch the CC0 materials once per house:

```
python ~/.claude/skills/blueprint/houses/courtyard/fetch_assets.py
```

Then open Claude Code and type `/blueprint` with your sketch, your plan or your references.

## Run an example yourself

```
blender -b --factory-startup -P houses/courtyard/build.py -- tatami engawa --samples 192 --res 1920x1080
blender -b --factory-startup -P houses/courtyard/film.py -- --res 1920x1080 --samples 64
```

Stills and frames land in `blueprint-out/`. See [SKILL.md](SKILL.md) for the film's sound, the counter overlay and
the method for a new house.

## Credits

Materials, plants and rocks: [Poly Haven](https://polyhaven.com), CC0. The sound kit renders everything in code; its
few recorded samples are listed with their CC0 sources in `sfx/samples/SOURCES.md`. Code: MIT.
