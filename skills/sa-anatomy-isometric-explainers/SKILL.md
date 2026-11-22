---
name: sa-anatomy-isometric-explainers
description: Builds crafted, interactive isometric SVG figures that explain a technical idea as a real physical object (lock, dial gauge, gantry, engine on a stand) with live readout and pointer/keyboard motion. Use when the user says anatomy, explain this concept as an object, interactive technical figure, isometric explainer, or a figure for a blog/landing section.
---

# SA Anatomy Isometric Explainers
The object IS the explanation: invent a well-made physical thing whose working is the concept; no boxes, arrows or label soup.

## Setup
`npx skills add wheresryan22/anatomy -g`, or clone and use `kit/` + `examples/`. Node only.

## Workflow
1. Map concept → object (table in Appendix B). Open the closest example first: dial-indicator (smallest), desk-computer, arcade-cabinet, raptor-engine, ripple-tank, test-rig (quality bar), spot-plate, turning-dial (3D).
2. Build from dozens of small shaded solids with `kit/` (lathe.mjs, tube.mjs, ...), in a framed card: title, hint, live readout.
3. Calm motion under pointer + keyboard; reduced-motion fallback.
4. `node examples/<name>/build.mjs [--light]` writes standalone HTML. Verify per `references/verify.md` (look at renders).
5. React/Next delivery: `references/react.md`; WebGL layers: `references/webgl.md`.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| anatomy | Build crafted, highly detailed, interactive isometric SVG figures that explain a technical idea as a real physical object (a test rig, a dial gauge, a cabinet of drawers, a plotter, a lock), with many small precise so... | `SKILL.md` |

## Appendix B — Core skill

### `SKILL.md`
_Build crafted, highly detailed, interactive isometric SVG figures that explain a technical idea as a real physical object (a test rig, a dial gauge, a cabinet of drawers, a plotter, a lock), with many small precise solid parts, four-tone shading, correct painter's order, a framed card with title, hint and live readout, and calm eased motion. Use this whenever someone wants an isometric illustration, an explanatory diagram or figure for docs, a blog post, a landing page or an article, a "Linear-style" or "premium" technical drawing, an interactive explainer, or an SVG that shows how a system, algorithm or component works, even if they never say "isometric". Works framework-free (TypeScript/JS that writes SVG and HTML) and in React/Next.js, and can add realistic WebGL shaders (fire, exhaust, water, caustics, lamp light) that live inside the drawing in the same isometric perspective. Also prints a figure as an A4 PDF (poster, drawing or handout) and publishes it to the Anatomy community gallery when asked._

#### Anatomy

This skill makes figures like a small instrument on a bench: a heavy base on feet, rails with tick rulers, a carriage on bushings, knurled knobs, coil springs, a dial gauge whose needle moves, screws as tiny dots. The reader understands the idea because they recognise the machine. Every number the figure shows comes from the same model that moves its parts.

Eight complete examples ship with the skill. Open the closest one before you start. Each framework-free example is built with `node examples/<name>/build.mjs`, which writes a standalone HTML page next to the script; add `--light` for the light theme.

- `examples/dial-indicator/` is the smallest: a dial gauge on a stand, about 300 lines in all.
- `examples/desk-computer/` is framework-free SVG: a desk computer with a keyboard you can type on. The typed line appears on a CRT screen drawn in the plane of the case front, and the picture collapses to a line and a dot when you switch it off. It has about 85 solids and 850 paths.
- `examples/arcade-cabinet/` is an upright arcade cabinet with its side panel off, a Hero of about 240 solids and 15 cables. A quarter flies into the slot, rolls down the coin chute at the speed a rolling disc reaches on a 30° slope, trips the coin-switch wire and drops into the cash box; the switch's pulse runs chunk by chunk along its cable to the board, and the CRT warms up, self-tests and runs an attract mode drawn in the plane of the tilted monitor. The stick tilts and closes a microswitch under the panel. It shows how to place a camera so a cutaway's mechanism stays in view, a concave board drawn as a prism along any axis, moving parts rebuilt in the page from the same module the build uses, and live coins and a wire drawn in reserved slots of the settled order. `node build.mjs --audit` proves the geometry.
- `examples/raptor-engine/` is a rocket engine hanging in a test stand. Its round parts come from `kit/lathe.mjs` and its pipes and harness from `kit/tube.mjs`. It comes apart into 11 assemblies with staggered springs and per-frame depth re-sorting. Every part records its true shape, and `node build.mjs --audit` (`kit/audit.mjs`) proves, at rest, apart and in every replayed frame of the explode, that nothing passes through anything, that every end sits on a real mount, that no bend pinches, folds or lands on another line, that no curved profile's slope wobbles, and that every overlap is drawn in depth order. A WebGL plume, shock, splash and steam render between the back and front SVG. It is the reference for dense pipework, smooth shading and fades.
- `examples/ripple-tank/` is a school ripple tank on tall legs over a paper screen, seen from 44° up. Two WebGL layers (lamp light, shadows and caustics on the paper, and the water's reflections and glass) are registered to the isometric planes and driven by a pure dispersion and optics model (`model.mjs`); a frequency change travels out from the dippers through a history texture.
- `examples/test-rig/` is a production figure from a real site (React/Next): a glass button on a spring-mounted carriage, a finger probe on a rail that presses and pulls, and a dial gauge reading the lean. It has 53 solids and about 470 paths.
- `examples/spot-plate/` is a second production figure from the same site: six pairs of glass drops on a spot plate, each pair drawn from one distance field, so a pair closer than `merge` runs together into one piece of glass. A fan of feeler blades sets `merge`, one blade per gap. It is the reference for shapes that morph into each other and for one control driving many parts.
- `examples/turning-dial/` is the optional 3D mode: a combination dial that turns in true 3D with a small robot hand on it. It has about 90 live parts in metal materials, a second turn group, a hinge, a three-hinge finger that lifts and a pod that breaks off as a free body. A WebGL LED, its light pool and sparks follow the moving parts. `stress.mjs` beside it is a dense hand of about 380 parts in a cluttered workshop, used to measure performance.

The test rig is the quality bar for the drawing itself. The Raptor is the bar for shader work: a WebGL effect has to reach its standard of world-space, no-pop, seamless rendering.

##### The one idea that matters

**The object is the explanation.** Don't draw boxes, arrows and labels. Invent a real, well-made physical thing whose working *is* the concept. Here is how earlier figures mapped:

| Concept | Object |
|---|---|
| One shared GPU context serving many canvases | A gantry plotter: one print head visiting 16 wells |
| A cache key that skips work when nothing changed | A pin-tumbler lock: when every pin matches, the plug turns and nothing is redrawn |
| Seven render targets with different bytes per texel | A chest of seven drawers, each as deep as its bytes |
| A separable blur (49 × 49 taps vs 49 + 49) | A bed-of-nails stamp beside two combs on rails |
| A spring that presses and leans | A test rig with springs, a probe and a dial gauge |
| A height profile | A profile (contour) gauge pressed against the edge |
| Light that depends on facing | A small photo studio: key and fill lamps around a turntable |

Two ways this fails, both seen in practice:

- **Too abstract.** Stacked plates, floating slabs or labelled boxes don't read as anything.
- **Too flat and bland.** One big slab with a few lines on it has no volume, no parts and nothing to discover.

The fix for both is the same: a recognisable machine, built from many small, precise, purposeful parts.

**Every creation is highly detailed.** This holds for every figure, however small the idea or the request: a quick explainer is still a dense, real machine, never a few slabs. What scales with the size (workflow step 1) is how far you push it: a Figure gets the 4× sweep over its subject and mechanism, a Hero or an Epic over the whole drawing.
- **Read the real thing.** Build it the way the real object is built: every screw, seam, bevel, bushing, label plate, cable with its connector, scale with its ticks, and the parts that hold the parts.
- **Two looks.** At 1× it reads as one clear machine. At 4× every region still has something true to find; a bare face or an empty corner is unfinished work, not calm.
- **Purposeful, never noise.** Detail comes from parts that belong to the mechanism. Each one sits on another part, ends on an edge, and fades rather than stops.
- **Check it last.** Before you finish, zoom to 4× (over the subject and mechanism for a Figure, the whole drawing for a Hero or an Epic) and add the real parts that are missing wherever a region is plain.

##### Workflow

Work in this order. Write the concept and the parts list before any geometry. Most of the quality is decided there.

1. **Size it before you start.** Name the size before any other work, and tell the user roughly how long it will take when the tier below calls for an estimate.
   - **Figure**: one mechanism, 40–80 parts, SVG with at most one WebGL layer. Name the size and build it without asking. Do not quote a time to the user, since a Figure often finishes in well under an hour. For the progress checks below, budget up to an hour.
   - **Hero**: a dense object, several WebGL layers or one 3D subject, 80–150 parts. About 2–4 hours. Say so, then build it unless the user asked for something quick.
   - **Epic**: a whole vehicle, building or plant with many moving systems, or the 3D mode on more than one subject. 6 hours or more. Do not start it. Give the estimate, propose a Hero version that keeps the core of the idea, and list what the full version would add. Build the Epic only when the user chooses it.
   - Whatever the size, have a working page that opens in the browser within the first hour, and deepen it from there. Run `date` at the start and at each step, and when a step runs past twice its share of the estimate, tell the user where it stands and what is left.
2. **Truth first.** Collect the real numbers and behaviour of the thing being explained: sizes, counts, thresholds, curves. The readout, motion and caption must all be true. If you can, write the model as a small pure module, like `rig.ts` in the test-rig example, and drive everything from it.
3. **Invent the object.** Pick a machine, tool, instrument or piece of furniture whose mechanism maps one-to-one onto the concept. Say in one sentence what moves and what that motion means. Never copy a reference image: take its finish, not its object.
4. **Parts list.** Write at least 40 parts (40–80 for a Figure, 80–150 for a Hero, more for an Epic), grouped: base (plate, feet, groove, corner screws, label plate, ruler strip), structure (posts, rails, frame bars, end stops), mechanism (carriage, bushings, springs, plunger, needle), controls (knurled knob, thumb screw, crown) and the subject itself, which is the one lit part. Each part sits on another part. `references/craft.md` has a vocabulary of parts with recipes.
5. **Plan the world.** Use world units of about 1 px of the real thing: x and y on the floor, z up. Lay out plans as rounded rectangles `{x, y, w, d, r}` and circles. Choose the camera: azimuth 45° by default, 35–60° to show the long side, elevation 30° (higher, like the ripple tank's 44°, to look into something open). Then fit with `fitProjection(points, width, height, { pad, azimuth })`.
6. **Build geometry once.** Precompute every static path in a geometry module with the kit: `slabOf`, `cylinder`, `extrude`, `planOutline`, `topTicks`, `knurl`, `coil`, `radialTicks` and so on. Round parts on any axis (bells, flanges, valves, actuators) come from `kit/lathe.mjs`, and pipes and cables from `kit/tube.mjs`. Moving parts are built once at a rest position and moved with `translateAlong`. Only parts whose shape changes are rebuilt per frame.
7. **Paint back to front, bottom to top.** Sort repeated parts with `depthOf`. Split anything that wraps another part into a back half and a front half: the springs around a rod, the bars of a frame around a carriage. A moving part is drawn in the slot where it physically sits. See "Painter's order" in `references/craft.md`. Once a figure has pipes, cables and round parts, stop tuning keys by eye: record each item's shape as you put it into `A.recorder(P, { order, spring })`, let `A.settle(R, P)` measure true depth wherever two items overlap and set the keys, and end the build with `A.auditOrExit(R, P)`. Route pipes before you draw them: real ports at both ends, legs along the structure, crossings on straights, collars gapping the pipe (`references/craft.md`, section 8). Record the true shape of what you draw: a stand-in shape that silences the audit is a bug, and the audit fails one. A rod that slides out of a gland is one rod from `G.rodOut`, recorded with `A.slide`.
8. **Frame it.** Put the figure in a card: `Fig n` at top left, a short title at top right, the interaction hint at bottom left and the live readout at bottom right. Legend keys and a true caption go under the card, and words stay out of the drawing apart from at most one tiny engraved label.
9. **Make it live.** Use calm time-based motion: exponential follow or real springs. An idle tour loops when nobody touches it. The figure responds to pointer and keyboard, stops when offscreen, and goes still under reduced motion. Write attributes on refs and don't re-render per frame. See `references/motion.md`.
10. **Verify like a critic.** The owner finds faults by zooming in, so you zoom in first. Read every PNG you make.
   - Capture desktop, phone (390 wide), hover and several moments of motion with `scripts/capture.mjs`; use `scripts/drive.mjs` for sequences, the apart pose and the `--no-webgl` fallback.
   - **Run the audit to zero.** With pipes, cables or round parts, `node build.mjs --audit` must end `audit passed`, every failing line at 0: clearance at rest, apart and in mid-flight, terminals, loose ends, folds, self-overlap, crowding (against slender solids too), stand-in shapes, support, wobble, saddles and depth order. Fix an interlock in the geometry, never with a key bias.
   - **Run the line check to zero.** The audit never sees line markup. `node scripts/lines.mjs page.html --out shots/lines.png` (and on the `-light` page, and in every resting pose with `drive.mjs`'s `["lines"]` action) must print `line ends: 0`: every seam, rule, rib, tick and pointer ends on a stroke, a dot or an outline. Read the ringed PNG.
   - **4× close-ups of every junction in both themes** (build `--light` too), assembled and apart: every flange, tee, elbow, clamp, valve, bellows, band, saddle, ball joint and crossing, every curved body (no tone staircase), every place a texture ends (on an edge or fading), flat box faces with their seams, every textured hose at a chunk joint, every sliding rod at rest and at full stroke, and every window with text or shader content in it.
   - **Shaders:** a contact sheet slowed with `["slow", 0.05]` across every transition; nothing pops, no colour switch, edges read 0. In light, also log ink per frame through each transition (it must follow the light monotonically) and crop where the ink meets strokes at 8–16× (`references/verify.md`, "Light-theme shaders").
   - Put your PNG next to the examples and ask: is it instantly a real object, rich in small parts with volume, with every line ending on something? Is it highly detailed at 1× and still rewarding at 4×, with no bare face or empty corner? Iterate until yes. Checklist: `references/verify.md`.

##### Setup

The kit is in `kit/`:

| File | Use it for |
|---|---|
| `kit/iso-kit.ts` | The whole core in one file: camera, solids, a parts library, an SVG string renderer, card and page builders, and the CSS (`ISO_CSS`). Copy it into a TypeScript project. |
| `kit/iso-kit.mjs` | The same core compiled to plain ESM, for Node scripts. Import it directly. |
| `kit/iso.css` | `ISO_CSS` written out. Import it once and put `class="iso"` (plus `data-theme="light"` for light) on a wrapper or `<body>`. |
| `kit/react/draw.tsx` | Server-safe React components: `Solid`, `Line`, `Wire`, `Dots`, `FaceText`, `IsoFigure`, `Plate`. |
| `kit/react/live.tsx` | `"use client"` hooks: `useReadout`, `useLoop`, `useEased`, `useInView`, `useStillness`, plus `spring` and `follow`. |
| `kit/lathe.mjs` | Round parts along any axis: `frameAlong`, `lathe` (smooth shading switches on by itself for any profile with a smooth knot), `solidOf`, `disc`, `ringBand`, `sphereOf`, `saddleOf`, `bandsOf` (one curved body cut into depth-sortable bands that share one surface, with one outline from `sidesOf`), visible arcs, ribs and bolt circles on round surfaces (`ribsOf` and `dotsOf` take `fade`, `ribsOf` takes `seams`), `rodOut` for a rod that slides out of a gland, and `fillet` for pipe routes. |
| `kit/tube.mjs` | `tubePieces` splits a 3D pipe or cable into depth-sortable chunks (with `breaks`, `gaps` under collars and clamps, elliptical end caps, and `rings` for a braid, corrugation or wrap that follows the cross-section through every joint), and `tubeSvg` draws one; `crossingsOf` finds where a route passes through a clamp, `runsOf` the drawn runs. Its `.tb-*` fills are in `ISO_CSS`. |
| `kit/audit.mjs` | Proves the geometry. `recorder(P, { order, spring })` collects items, shapes (turned bodies, slabs, prisms, boxes, balls, tubes, pads cut by their host) and routes as the helpers draw them; `settle(R, P)` ray-casts every overlapping pair for true depth, at rest, apart and in the replayed explode, and sets the painter's keys (`overlapsOf`, `orderKeys`); `auditOrExit(R, P)` is the `--audit` hook that runs every check (`clearances`, `solidClearances`, `terminals`, `looseEnds`, `supports`, `folds`, `selfOverlaps`, `crowding` with slender solids as lines, `coverage` for stand-in shapes, `wobble`, `seats`, `depthOrder`) and exits non-zero on any problem. `A.slide` records a rod that slides out of a gland. `references/kit.md`, section 12. |
| `kit/gl.mjs` | The WebGL layer for shaders inside the drawing: `GLSL_ISO` (the camera in GLSL, including `rayOf` and `pixelOf`), `glCamera(P)`, `glLayer(...)`, and the JS envelopes `smooth`, `burst` and `settle`. For 3D figures, `GLSL_TURN` and `glslPose(name)` bring world points into a moving group and mask a front canvas with `coverOf`. |
| `kit/turn.mjs`, `kit/turn-build.mjs`, `kit/turn-audit.mjs` | The optional 3D mode. `turn-build.mjs` has `turning(P, { recorder })`: groups (turn, slide, hinge, free), live layers, convex parts with materials, and `T.build`. `turn.mjs` is the runtime: `TURN.mount`, the controller, `TURN.cover`, `TURN.poseUniforms` and `TURN_CSS`. `turn-audit.mjs` has `orbitOrExit`, the orbit audit over every turn angle and motion clip. `references/3d.md`. |
| `scripts/capture.mjs` | Headless Chrome screenshots, close-ups and console checks, with WebGL on. Run with `node`. |
| `scripts/drive.mjs` | Scripted headless Chrome with WebGL: move, click, key, slow motion, wait-until, eval, shots and contact sheets that catch pops; `--no-webgl` and `--preload`. |
| `scripts/lines.mjs` | The line-end check on a built page, in headless Chrome: every texture line must end on a stroke, a dot or an outline. Rings the failures with `--out`; exits 1 on any. |
| `scripts/inline-kit.mjs` | `kitScript()`, `glScript()` and `turnScript()` return the kit, the WebGL layer and the 3D runtime as source to inline into a standalone page. |
| `scripts/turn-check.mjs`, `scripts/turn-bench.mjs` | 3D figures: fidelity against the kit builders, a z-buffer order check, pixel pops, line ends at 24 angles and frame timing in the browser; Node CPU time per part kind. |
| `scripts/print.mjs`, `scripts/print-sheet.mjs` | Printable sheets: freeze poses of a built page as vector stills and lay them out as an A4 or Letter PDF in three formats (poster, drawing, detailed). `references/print.md`. |

Pick the path that fits the project:

- **Standalone HTML, a static SVG, a blog post or any non-React site.** Write a Node build script like `examples/dial-indicator/build.mjs`. It imports `kit/iso-kit.mjs`, assembles strings with `solidSvg`, `lineSvg`, `dotsSvg`, `wireSvg` and `faceTextSvg`, wraps them with `figureSvg` and `plateHtml`, and writes the page with `pageHtml({ script: kitScript() + live })`, or `kitScript() + glScript() + live` when it has a shader. For a lone `.svg` file use `figureSvg({ standalone: "dark" | "light" })`, which embeds the styles.
- **React or Next.js.** Copy `kit/` into the project (for example `components/iso/`). Keep geometry in plain `.ts` modules, build the static art in a server component with the `draw.tsx` components, and pass it as element props to one `"use client"` live component that moves things. `references/react.md` explains the split and a trap with large pages.

##### Craft rules (short form)

These are the rules that separate a crafted figure from a diagram. `references/craft.md` gives the full reasoning and recipes.

- **Solids, not wireframes.** Every part is filled in paper colour and painted in order, so things in front hide things behind. No see-through edges and no dashed hidden lines.
- **Let the kit shade.** `extrude` returns four side tones by facing plus a lighter top. Keep it for anything with height, and use `flat` only for floors and inlays thinner than 1 unit.
- **Tone hierarchy.** Base and feet are `lo`, structure is `mid` and the subject is `hi`. Exactly one accent is `lit` (white in dark, black in light): the part the reader should watch. Grooves are `faint`, minor ticks `lo`, major ticks `mid` and the zero mark `hi`. Use colour only when colour is the subject, such as red, green and blue channels.
- **Small precise detail, never noise.** Use bevels of 0.4–1.6, grooves inset 3–5 from an edge, screws as 0.4–0.55 dots with a ring at the corners of plates, knurls on knobs, ruler ticks every 4–5 units with a major every 5th, and a label plate with three rule lines. Each detail belongs to a part.
- **Lines resolve.** Every line ends on something: a face, another line or a terminal dot. Connectors are `Wire`s whose terminal dots land on objects. There are no leader lines, balloons, dimension arrows or labels floating in the air.
- **No pipe or cable passes through anything.** Not through another pipe, cable or solid, at rest, apart or in any frame of the explode. Keep about 1.5 radii of clearance to everything but a line's own connection, run lines beside the structure rather than across the subject's face, and gap a pipe wherever a flange, band, bellows, clamp or valve wraps it. Parts meet flush, tangent or rim-on-surface, never sunk in: a flange's back face lands on its port (on a saddle pad, `G.saddleOf`, when the port is curved), a branch leaves from a ball tee, and every end, apart too, finishes on a flange, coupling, connector shell or terminal dot.
- **Every crossing is drawn in true depth order.** Where two items overlap on screen, the nearer is drawn on top, proved by `A.settle` and the audit, not tuned by eye. Lines cross on straights, well apart in depth: a bend, end or clamp that lands on another line's outline reads as a joint (a rod, tie rod, post or rail counts as a line: a pipe's last leg never runs along one on screen), a leg that points at the viewer and then turns pinches to a V (leave such a port through an elbow ball), and a route never doubles back on screen. A pair that can't be ordered interlocks, and the fix is a cut or a tangent contact, never a bias.
- **Curved surfaces shade smoothly, never in a staircase.** Mark curved knots smooth (`[s, r, 1]`) and `lathe` shades them from one monotone curve that also draws the outline; give any curved body larger than a fitting an analytic profile with `smooth: { slope }`, cut long bodies with `G.bandsOf`, and use `G.sphereOf` for balls. Tone bands taper to nothing instead of ending on a straight cut, and seams go under the outline (`inner`).
- **A texture ends on a real edge or fades.** Ribs, bolt circles, rule lines, seams and grooves never stop in the middle of a surface, flat or curved: `ribsOf` and `dotsOf` take `fade` (draw faded ribs with `fadedSvg`), a rib row ends on its seams (`ribsOf(…, { seams: true })`), a seam or weld on a box wraps its corners (`k.sideSeam`, as the slab's `inner`), a line on one face runs edge to edge, vents are closed slots, ticks hang from a ruler strip's edge, a single line that must stop ramps out with `fadeLineSvg`, and a row whose features face up (holes on top of a ring) is seen all round (`all: true`). A texture on a pipe (braid, corrugation, wrap) follows its cross-section and runs through every chunk joint: `tubePieces(…, { rings })`, never a dashed stroke down the centreline. A pipe's shine and shade run onto its end caps and through every chunk joint. Only rule lines that stand for printed text, a needle's tail and a pointer's tip may stop on a bare face, marked `free`.
- **Shaders never pop or cut off.** Every uniform rides an envelope with an attack and a decay, phase changes are crossfades driven by the physical quantity, every term reaches zero before any bound or canvas edge, and the effect lives in world space in the figure's own camera (see below).
- **Things on faces fit them.** Text a machine displays fits its window at its widest string and is clipped to it; content seen through an opening is clipped by the opening as well as by its own plane, with the recess walls drawn.
- **Volume.** Give things real thickness, make them stand on other things, and put a soft halo under the base and under anything lifted.
- **Composition.** Centre the figure and let it fill about 55–65% of the card. Keep a consistent scale across a set of figures, and make sure it still reads at 390 px wide.

##### WebGL inside the drawing

Use a shader only for what lines can't draw: fire and exhaust, water and caustics, real lamp light, glow, steam. The parts stay SVG. The core rules come from the first shader figure, whose colour change between phases looked cut rather than crossfaded:

- **Three layers.** A back SVG holds what the effect covers, the canvas holds the effect (`pointer-events: none`), and a front SVG holds what covers it. Split a part, or the effect, when it is on both sides.
- **World space, same camera.** Build every shader point from `onFloor`, `onWallX` and `onWallY`, or march the pixel's ray `rayOf(vb) + t·towardViewer()`. Size everything in world units times `uK`. Anything lying on a plane registers exactly with that plane's SVG lines.
- **Nothing pops.** Every uniform follows an envelope with an attack and a decay (the kit's `burst` for events, `settle` for levels). Phase changes are crossfades where colour shifts continuously with the physical quantity, and a fade-out only gets darker.
- **No hard cut-offs.** Every term reaches zero before any `if`, bound or canvas edge, and before any cell edge of a cell noise.
- **Seen through an opening, masked twice.** Content behind a window or a recess is masked in its own plane and by the opening in the face plane, multiplied (`references/webgl.md`, section 5).
- **Blending.** Use `tonemap()` and dither. In dark, a canvas that only adds light uses premultiplied output with `mix-blend-mode: screen`, and one that must also darken (the ripple tank's water) stays normal-blended.
- **Light theme ships, and its shaders are designed for paper.** Use normal premultiplied alpha, never screen. Write the colour the paper should show and solve for the ink. A glow is a saturated body with a pale core, a coloured rim and an alpha floor, never a darkened dark-theme colour: that gave the Raptor's "red ink smoke".
  - What the light falls on takes a tint, and the cavity that holds it gets a darker physical ground (soot, refractory, water depth).
  - Hot bodies follow one blackbody ink table shared with the fallback.
  - Ink only grows with light: fade the finished ink once, never one term at a time.
  - Ink ends at each stroke's inner edge.
  - Measure ink per frame. `references/webgl.md`, section 8, has the recipes and the faults reviewers found.
- **Restraint.** Cap the device ratio at 1.5 and render only while the effect is active and onscreen. Reduced motion gets one still frame, and the SVG must still read without WebGL.

Read `references/webgl.md` before writing any shader.

##### 3D: figures that turn (beta)

3D is an option like WebGL. Use it when a part moving in depth is the idea: a dial or turntable that turns, fingers that flex, a piece that breaks off and falls. The rest of the figure stays static kit art.

It is in beta: the engine is proved on its example and one test figure, not yet on a production figure. Turn one subject at a time and keep the clutter around it static. A small figure runs at 60 fps; a dense 380-part flexing hand measured about 20 fps at 1440 and 13–15 fps on a phone profile (390 px, 4× CPU throttle) on a heavily loaded machine.

- **Live parts are the kit's own picture.** Each frame, convex kit primitives (prisms, rounds, domes, balls with flats, lathes, tubes) are re-projected and re-shaded by the kit's rules. A turn by θ is the kit drawing at azimuth `a − θ`.
- **Order comes from separating planes.** Same-group pairs get a plane fixed in the group, pairs on different links get one fixed in their common frame, and the rest are solved each frame. The audit proves there are no cycles at any angle or in any clip frame.
- **Contacts are flush, tangent or rim-on-flat.** Joints are coaxial knuckle discs on the child group that touch the parent's link, or the audit calls the whole child group loose. No live line spans two moving groups: a cable crosses a joint through a clip on each side, or reaches the turntable through a slip ring at the hub.
- **Live tubes bend in near-horizontal planes or inside fittings, and never point along the view.** A bend needs R ≥ 2r / sin²(e − θmax), where θmax includes the pitch range of every hinge it rides: 8r is the bound when flat, and on a ±12° hinge it is 21r. Each route runs from mount surface to mount surface, with its ports in `gaps`. That holds at every angle and in every pose.
- **Materials remap the ramp.** Gold, chrome, steel, gunmetal, rubber, brass and copper each have a light and a dark set; tones still come from facing.
- **Free groups break off without a jump.** Coaxial parts are fixed pictures with turning textures.
- **Shaders follow the motion.** Anchor them to a group with `controller.anchor` or `toGroup`, occlude a front canvas with `coverOf`, and keep world effects (smoke, falling sparks, oil on the bench) out of group space.
- **Verify with `--audit`** (`turn audit passed`) and `scripts/turn-check.mjs` (`--fidelity`, `--order`, `--pops`, `--lines`, `--perf`). Iterate with `--quick --only=…`. Only a full run proves the figure, and it takes 15–20 minutes for 30 parts, so run it in the background.

Read `references/3d.md` first.

##### Printable sheets (A4)

When the user wants the figure on paper (a handout, a poster, a PDF, an A4 or Letter sheet), print it from the finished figure instead of drawing again. Write a `sheet.mjs` next to the build: the poses to capture as `drive.mjs` actions, the parts as CSS selectors over the live SVG, and the words, every one of them true to the model. Then run `node scripts/print.mjs sheet.mjs --format all --png` and read every page.

- **poster** (the default): one page, the name set large, the question, big numbers, the figure with numbered pins and every part with one line.
- **drawing**: one page, a technical drawing with a parts list, a specification, an inset and a strip of steps with the working parts lit.
- **detailed**: 2–4 pages, scaled to the machine: an overview with pins and round close-ups; "How it works" with each step as a large lit still (six per page, the why in the last slot); and for complex figures an "Assemblies" page with up to four large close-ups of part groups (`assemblies` in the spec). A simple figure stays at 2 pages; `maxPages` caps it.

Offer all three when the user hasn't picked one. When the page shows a figure that has a PDF, put a link to it on the card with `pdfButton(href)` from `kit/pdf-button.mjs` inside the plate body (see `examples/push-button/build.mjs`); print first, then rebuild the page. `examples/raptor-engine/sheet.mjs` and `examples/arcade-cabinet/sheet.mjs` are the references. Read `references/print.md` first.

##### References

Read these as you need them:

- `references/craft.md`: the look in depth, including the parts vocabulary with code, tone tables, painter's order patterns, round parts, pipes and harnesses, exploded views, screens on faces, and the anti-patterns that got figures rejected. Read it before designing.
- `references/kit.md`: the API, with signatures and examples.
- `references/motion.md`: live behaviour (loops, springs, tours, pointer, keyboard, accessibility, reduced motion), plus envelopes for one-shot events, exploded views, depth re-sorting and arming, in vanilla JS and React.
- `references/react.md`: the React/Next.js server/client split, element props and the large-payload key-warning trap.
- `references/verify.md`: the `capture.mjs` and `drive.mjs` commands, the review checklist (including shaders) and common faults.
- `references/webgl.md`: shaders inside the drawing: when one earns its place, the layer stack, the camera contract, ray-marching in the iso camera, the full API with a minimal page, the craft rules with the bugs that taught them, the light theme (inks on paper, per-phenomenon recipes, the reviewers' faults), and how to verify them.
- `references/walkthrough.md`: how the test rig was designed, step by step, from concept to code.
- `references/3d.md`: the optional 3D mode: groups and poses, live layers, convex parts and their rules, materials, free groups, hinge chains, painter's order, static clutter around a turntable, shaders that follow the turn, the orbit audit, browser checks, performance and limits.
- `references/print.md`: printable A4 or Letter sheets from a built figure: the three formats, the `sheet.mjs` spec (poses, parts as selectors, focus, hide, crops, rasters for WebGL) and how to check the PDF.
- `references/publish.md`: sharing a finished figure in the community gallery with `scripts/publish.mjs`, only when the user asks; nothing is pushed for them.

## Appendix C — References

### `references/craft.md`
#### Craft

How a figure comes to read as a crafted object rather than a diagram. Every rule here came from a figure that was rejected or approved by a demanding reviewer.

##### Contents
1. What "crafted" means
2. Anti-patterns
3. Parts vocabulary, with recipes
4. Tones
5. Painter's order
6. Camera and composition
7. Themes
8. Round parts and pipes
9. Exploded views
10. Screens and things on faces
11. Shaders

##### 1. What "crafted" means

The approved figures share five qualities.

1. **A real object you could build.** The reader names it at a glance: a test rig, a dial indicator, a chest of drawers, a gantry plotter, a lock. It is invented for the subject, never traced from a reference.
2. **Many small, precise parts.** A good inline figure has 30–60 solids and 300–500 paths. A hero subject that really has more parts can carry far more: the desk computer has about 85 solids, and the Raptor about 270 solids in 478 depth-sorted items. Every part rests on another part, aligns to its neighbours and has a job. Density comes from structure (feet, rails, stops, bushings, knobs), not from texture.
3. **Volume.** Parts have real thickness, sides shaded in four tones, lighter tops, bevels that catch light, and a soft halo underneath.
4. **Calm.** Thin 0.6 px lines and a restrained palette. One lit accent tells the eye where to look. Motion is eased and slow enough to follow.
5. **Truth.** The readout shows live, correct numbers, and the motion follows the real model: springs with real stiffness, true sizes and thresholds.

##### 2. Anti-patterns

Reviewers rejected each of these, so don't do them:

- **Abstract stacks.** Floating plates, slabs or tiles standing for "layers" are too abstract to read as anything. If you need layers, make them drawers, trays in a rack, plates on guide pillars, or cards in a holder.
- **One big plain slab.** A large surface with a few lines is too flat and bland. Break it into a base, a carriage and parts; add a groove, screws, a ruler and a label plate.
- **Blueprint furniture.** Leader lines, balloons with numbers, dimension arrows, hatching, dashed hidden edges and floating labels belong in the legend and caption, not the drawing.
- **Lines that stop in mid-air.** Guide fans, connectors that end short of a part, or a crease that stops before the silhouette corner. Every line must land on something.
- **Wireframes.** See-through boxes where the back edges show.
- **Colour everywhere.** Keep it monochrome unless colour is the subject: one lit accent plus true RGB only for colour channels. A fluid is not colour by default: oil in a sight glass, water in a tank and coolant in a pipe are tints of the figure's own inks, and the `--no-webgl` fallback draws the same tint the shader does. A blind-test bench painted its oil saturated orange in an otherwise grey figure, and its fallback oil was grey.
- **Text in the drawing.** Allow at most one tiny engraved label (`FaceText` on a face). Everything else goes in the card corners, legend or caption.
- **Copying a reference.** Take mood and finish from a reference, then invent the object.
- **Raw pointer jumps.** Parts that snap to the cursor. Ease everything.
- **Pipes through pipes.** On the first Raptor the owner zoomed in and found cables and lines passing through the main ducts and through each other, "which makes no sense". At 1× it looked fine. Every pipe and cable keeps clear of everything but its own connection, every crossing is drawn in true depth order, and `kit/audit.mjs` proves both (section 8, "Clearance and crossings").
- **Textures that stop.** On the same close-up, rows of bolt dots on the chamber stopped dead in the middle of the surface, and the bell and throat were shaded as a staircase of flat tone blocks. Both read as broken. The owner's words: if a texture has to end, "we'd rather fade them out at the end than an instant stop". Shade curved surfaces smoothly, and make a texture end on a real edge or fade out (section 8, "Shading and textures on curved surfaces").
- **Shaders that pop or are cut.** The first Raptor plume changed colour instantly between its phases, "as if cut out", and a glow ended in a straight line at the canvas edge. Every shader term rides an envelope and reaches zero before any bound (`webgl.md`, section 7).
- **Textures that stop, on flat faces too.** The same fault came back on a later figure's boxes, where no curved-surface rule reached it: a tank's weld seam inset 6 units from each rounded corner, a manifold face line inset 4, a row of faint ticks floating on a bare bedplate with no ruler under them, cooling ribs that stopped 2 units short of the seam arcs at both ends, and a hose braid drawn as a dashed stroke down the centreline that ended in two straight hard edges along the hose and broke at every chunk joint. A seam on a box runs edge to edge round the visible corners (`k.sideSeam`), ribs end on seams at the same `s` (`ribsOf(…, { seams: true })`), ticks hang from a ruler strip's edge, and a texture on a pipe comes from `tubePieces(…, { rings })`. `node scripts/lines.mjs page.html` fails every line end that touches nothing (`verify.md`, "Line ends").
- **Stand-in shapes.** To quiet the audit a builder recorded a 0.45-thick disc at the tip of each of five overlapping rod copies, and a sliver for a second rod that was drawn sunk into its cylinder head. The audit passed and said nothing about either rod, and the lit rod's outline was notched every 12 units while it moved. Record the true shape of what you draw; the audit's stand-in check fails an item whose recorded shapes cover less than 60% of its drawing. A rod that slides out of a gland is one rod (section 3, "Rod out of a gland").
- **Dark-theme glows pasted on white.** The owner made light the shipping theme for every site figure, and seven shader figures built on a dark plate had to be converted. Taking a dark glow and darkening it gave "red ink smoke" (the Raptor's light plume). It also gave flames drawn as outlines, sparks that looked like dirt, salmon-coloured cooling glass, grey fades and cavities that got heavier as the fire went out. On paper, light reads through saturation and a darker physical ground (section 7, and `webgl.md`, section 8).
- **Fixing one close-up by eye.** Tuning a painter's key or nudging a waypoint until one screenshot looks right breaks another frame or another theme. The Raptor's hand-set keys looked right at 1× and had 323 depth-order problems. Measure (section 8, "Clearance and crossings"), then look.

##### 3. Parts vocabulary, with recipes

`P` is the projection and `k` is the kit, as in `import * as k from "./iso-kit"`. Heights are in world units, with z up. Draw each recipe's solids in the order listed.

###### Base plate on feet
```js
const PLATE = { x: -128, y: -64, w: 262, d: 128, r: 8 };
halo:  `<path class="iso-halo" d="${k.haloOf(PLATE, -17, 12, P)}"/>`
feet:  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
         k.cylinder(x, y, 7, -17, 1.6, P, 28)            // flange, tone lo
         k.cylinder(x, y, 5.4, -15.4, 3.4, P, 28)        // foot, tone mid
       }
slab:  k.slabOf(PLATE, -12, 12, P, 8, 1.6)                // tone mid, bevel 1.6
groove: k.planOutline(k.insetPlan(PLATE, 5), 0, P)         // line lo
screws: k.corners(PLATE, 10) → k.ring(x, y, 2.2, 0, P, 16) (line lo) + dots size .5
```
Sort feet with `byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))`.

###### Ruler strip and label plate
```js
const strip = { x: -110, y: PLATE.y + PLATE.d - 15, w: 230, d: 7, r: 1 };
k.slabOf(strip, 0, 0.6, P, 3)                                   // tone lo, crease none
const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
t.minor → line lo, t.major → line mid
label plate: k.slabOf(plan, 0, 0.8, P, 4) + k.planOutline(k.insetPlan(plan, 1.6), 0.8, P) (faint)
             + three k.lineOnTop rule lines of different lengths (lo, { free: true }) + two screw dots
```
Ticks only live on a ruler strip or a dial face, rooted on its edge: `topTicks` grows each tick from `edge`, so put `edge` on (or within 1 unit of) the strip's edge, and `sideTicks` hangs them from `top`, so pass the face's top edge, not 2 units below it. A row of marks on a bare plate is a texture that floats at both ends. The label plate's rule lines stand for printed text, so they are the one place a line may stop on a bare face: pass `free: true` so the line check knows it was meant.

###### Seams, welds and trim lines on a box
```js
const seam = k.sideSeam(TANK, 14, P, 6);                         // visible near half of the plan at z = 14, round the corners
k.solidSvg(k.slabOf(TANK, 6, 98, P, 6, 1.2), { tone: "mid", inner: k.lineSvg(seam, { tone: "faint" }) })
```
A seam, weld bead, band or lid line on a box wraps the visible corners and ends exactly on the vertical silhouette edges, like `sideArc` on a cylinder. Pass the slab's own `steps` so the seam follows the same facets, and pass it as `inner` so its ends sit under the outline. A line that belongs to one face only (a stiffener, a panel joint) runs the full face, edge to edge: `segment([x, y, z0], [x, y, z1])` with `z0` and `z1` the face's bottom and top, never `z0 + 3`. Slots and vents are closed outlines (a `planOutline` of a thin rounded plan, or the same in a face plane), so they have no ends at all. Never inset a line by a few units from its corners: at 4× it reads as a texture that stops.

###### Rod out of a gland
A piston rod, a plunger or a slide whose visible length changes as it moves is one rod, built once at full length (visible plus stroke), with the part inside the gland clipped away:
```js
const ROD = G.rodOut(F, gland, tip, r, P, { stroke });           // F.a points out of the gland
svg = `<clipPath id="rod"><path data-hold d="${ROD.clip}"/></clipPath><g clip-path="url(#rod)">${k.solidSvg(ROD.paths, { lit: true })}</g>`
R.put({ ..., move: G.mul3(F.a, stroke), svg, shapes: [R.solid(A.slide(F, gland, tip, r, { name: "rod" }))] })
live: el.setAttribute("transform", `translate(${dx} ${dy})`); holdStill(el, [dx, dy])   // dx, dy: the item's screen offset this frame
```
`rodOut` returns the rod's paths from `gland − stroke` to `tip` and a clip that covers it from the gland face to `tip + stroke`. The clip path carries `data-hold`; whatever moves the item calls `holdStill(el, [dx, dy])` with the same screen offset, which moves the clip the other way, so the gland face stays put while the rod slides through it. The same helper retracts a rod into a gland (a load cylinder) when its item moves the other way. Draw a faint seal ring (`circleOf` at the gland face, radius `r + 0.4`) on the gland. Record it with `A.slide`, which the audit poses by stretching the rod from the gland face instead of translating it, so clearances, depth and solid checks see the true rod in every frame. Never fake the extension with overlapping copies: each copy's lit edge stops where the next one's fill starts, and the outline is notched every few units while it moves.

###### Rails, end stops and a carriage
```js
rails:  for y of [-20, 15]: k.slabOf({ x: 2, y, w: 122, d: 5, r: 1 }, 0, 3, P, 3, 0.4)   // mid
stops:  k.slabOf({ x, y: -23, w: 5, d: 46, r: 1.2 }, 0, 7, P, 3, 0.5) + 2 screw dots on top
carriage (built at x = 0, moved with translateAlong):
        k.slabOf({ x: -28, y: -24, w: 56, d: 48, r: 3 }, 3, 5, P, 5, 0.6)
        bushings: small slabs at the four corners, taller than the plate, with screw dots
        rivets: a row of 0.4 dots along the front edge
        handle: a small neck slab plus a knurled cylinder on the front face
```

###### Post, collar, clamp and thumb screw
```js
k.cylinder(px, py, 5, z0, 4, P, 28)              // collar
k.cylinder(px, py, 3.2, z0 + 4, h, P, 28)        // post, crease none
k.sideArc(px, py, 3.2, z, P, 16)                 // faint seam rings on the post
k.slabOf({ x: px - 7, y: py - 7, w: 14, d: 14, r: 2.5 }, zc, 12, P, 4, 0.6)   // clamp block
thumb screw: a 2.8 × 3 neck slab from the clamp face + k.cylinder(r 2.6, h 6) + k.knurl(..., 18)
```

###### Knurled knob with a pointer
```js
k.cylinder(cx, cy, 6, z, 4, P, 32)                          // mid
k.knurl(cx, cy, 6, z, z + 4, 36, P)                         // line lo
k.lineOnTop([cx - 3, cy], [cx + 4.6, cy], z + 4, P)         // pointer, line hi
```

###### Coil spring around a rod (split for painter's order)
```js
const c = k.coil(xFrom, xTo, [rodY, rodZ], 4.2, 6, "x", P);
c.back  → line lo, drawn BEFORE the rod
rod     → k.slabOf({ x, y: rodY - 2, w, d: 4, r: 1.8 }, rodZ - 2, 4, P, 3)
c.front → line mid, drawn AFTER the rod
```
Rebuild the coil each frame when it compresses, by changing `xFrom`/`xTo`. It is cheap.

###### Dial gauge (face up)
```js
k.cylinder(x, y, R, z, 10, P, 64, 0.8)                       // puck, tone hi, crease lo
k.knurl(x, y, R, top - 3.4, top, 84, P, 0.3)                 // knurled bezel band, lo
k.sideArc(x, y, R, top - 3.4, P, 40)                         // band seam, faint
k.ring(x, y, R - 2.2, top, P, 64)                            // bezel ring, lo
const t = k.radialTicks(x, y, R - 3, 50, 5, top, [1.3, 2.8], P)   // minor lo, major mid
crown: two small slabs on the +x side; lug: a slab joining the arm
needle: k.lineOnTop(tail, tip, top + 0.2, P), tone lit, stroke-width 1.1, rebuilt per frame
hub: k.ring(x, y, 1.6, top, P, 16)
```

###### Drawer with a pull and label holder
```js
case:   k.slabOf(casePlan, z, h, P, 4, 0.8)
front:  a thin slab on the near face; pull: two posts plus a bar (small slabs)
holder: an inset outline on the front with a card slab inside; rivets as 0.45 dots
open:   translate the drawer along its axis with translateAlong; its box (floor plus 3 walls)
        is drawn before the front, and its contents are engraved on the floor
```

###### Turntable with degree ticks
```js
k.cylinder(cx, cy, R, z, 4, P, 72, 0.8)
k.radialTicks(cx, cy, R - 1, 72, 6, z + 4, [1.2, 2.6], P)
rotate: rebuild only what turns (or the object on top) at the new angle each frame
```

###### Perforations, vents and a pulsing dot grid
```js
k.dotGrid(x, y, cols, rows, gap, zTop, P) → dotsSvg(points, { size: .45, tone: "lo" })
// add { pulse: true } for a slow pulsing grid on an "active" part
```

###### Lamp, probe and finger
These are stacks of cylinders: housing, cap ring, collar, stem, pad. Seam rings come from `sideArc`, and the lock screw is a small slab plus a cylinder head on the side.

##### 4. Tones

| Element | Tone |
|---|---|
| Base, feet, floors | `lo` |
| Structure: posts, rails, frame, carriage, case | `mid` |
| The subject: the thing being explained | `hi` |
| The part the reader should watch now | `lit` (one only) |
| Grooves, inset outlines, floor grid | `faint` |
| Minor ticks | `lo` |
| Major ticks | `mid` |
| Zero mark, pointer line | `hi` |
| Screws and rivets | dots `mid` at 0.4–0.55 |
| Crease (top/side join) | `faint` (default), `lo` on hi parts |

A `Solid` with `lit` gets a white edge and a lighter top. Use it for the moving subject, the plunger or a picked drawer.

##### 5. Painter's order

- Draw the base first, then everything resting on it.
- Within a level, sort by `depthOf(centre, P)`, ascending: far before near.
- **Split wrapping parts.** For a spring or a frame around a carriage, draw the back half, then the inner part, then the front half. In the test rig: back frame bars → rods with the back coil halves → carriage → glass → front coil halves → front bars → dial.
- **Moving parts** are drawn at their slot in the order, inside a `<g transform>` that moves them. If a moving part can pass in front of and behind the same neighbour, split the neighbour or bound the motion so the order never changes.
- **Things standing on a stepped surface.** Order the steps so the taller ones are further back. A probe resting on a lower step then can't be hidden by a taller one in front of it.
- Vertical parts that pass through a horizontal one (a post through a clamp) are drawn in two segments, below and above, around the horizontal part.
- **A clip cut is an edge.** Where a clip ends one part against another (a cable-chain run entering its loop, a rod at a gland), make the clip's section flush with the joint plane, and draw a stroked edge along the cut that moves with the clip (`data-clip`). On the plasma cutter, a run's clip section reached past the joint. The run's top face and slot bars were drawn 26 units into the loop's hollow and ended on a vertical cut with no stroke, which is a line stopping in mid-air. Re-ordering the painter's keys wouldn't have fixed it: the loop link's end face really is behind the run.
- **Dense figures settle their keys from geometry.** Past a few dozen overlapping parts, hand-set biases fight each other. Give every item its true shape and let `kit/audit.mjs` measure which surface is nearer wherever two items overlap, then `orderKeys` raises each key just enough to satisfy every pair (`kit.md`, section 12). What it can't satisfy is a pair that interlocks, which needs a split. The first Raptor's hand-set keys left 190 pairs drawn the wrong way round assembled and 133 apart; measured keys took both to zero.
- **Crossings sort per chunk.** A pipe or cable is drawn as `tubePieces` chunks, each its own item at its own depth, so one line can pass in front of one part and behind the next. Where two lines cross on screen, the chunk nearer the camera is drawn later; a crossing can only be ordered if neither chunk also runs behind the other somewhere else, so break long chunks at a crossing (`breaks`).

##### 6. Camera and composition

- Default camera: azimuth 45°, elevation 30°. Rotate the azimuth (35–60°) so the face that carries the mechanism points at the viewer. The test rig uses 57° to show the long side. Raise the elevation to look into something open: the ripple tank uses 44° so the water surface and the paper under the tank both read.
- Fit with `fitProjection(boxCorners(...) ∪ tallest points, width, height, { pad: 24–34, azimuth })`. Typical viewBoxes are 600 × 340–380.
- The object fills about 55–65% of the card. Leave air around it, don't let it touch the corner labels, and keep sizes consistent across a set of figures.
- On phones (390 px), check it still reads. If parts get too small, scale the SVG up to about 110–118% inside a card with `overflow: hidden` and a negative margin, as `stretch.css` does in the test-rig example.

##### 7. Themes

`ISO_CSS` defines tokens on `.iso`, with dark as the default and `.iso[data-theme="light"]` for light. Every fill and stroke reads a token, so a theme is just a token set. To tune one:

- **Paper** (`--anatomy-paper`) equals the card colour, so fills hide what is behind without showing as patches.
- **Shades.** Four steps from darkest (0, facing away from the light) to lightest (3). Keep them close: about 3% apart in luminance.
- **Lines.** In dark mode, `hi` is near-white and `faint` barely above the paper. Light mode inverts this.
- **Halo.** A blurred dark fill under the base: strong in dark mode, about 30% in light.

**Light ships.** Every figure on the isometrics site is light, and that includes its shaders. Design light first and keep dark working where that is cheap. What the seven shader conversions taught about the drawing:
- **Every colour is a token.** A colour typed into a figure's CSS or its shader is a theme bug waiting to happen. Give it a light value and a dark override (`.x { --x: … }`, then `.iso[data-theme="dark"] .x { --x: … }`). Where the shader needs the same colour, read it from the token (`webgl.md`, section 8.3).
- **Cavities get their own token set.** The inside of a furnace mouth, a ladle, a vessel seen through a cutaway, a water column or a duct window is darker for a reason: soot, refractory, depth, shadow. Give its group a class that redefines `--anatomy-paper`, `--anatomy-face`, `--anatomy-top`, the four shades and the line tones to darker, warmer or bluer greys. Keep all the tones so it still has form, mix it toward the light's hue by a variable the live code writes, and set the tokens to `inherit` in dark. Glows then have a ground, without a black box.
- **Mind nested themes.** A dark plate can sit on a light page. A rule written `.iso:not([data-theme="dark"]) .x` also matches through the page around it. Order the dark rule after the light one, or key on the plate's own theme.
- **Opacity fades a pale colour to grey.** Anything that fades by opacity in light (a fallback glow, a lit accent) gets a saturated token, and its tints are multiply-blended so the lines under them stay visible.

##### 8. Round parts and pipes

Engines, pumps, valves, lamps and instruments are mostly turned parts and pipes. `kit/lathe.mjs` and `kit/tube.mjs` build them along any axis (`references/kit.md`, sections 10 and 11). `examples/raptor-engine/build.mjs` has every recipe below in working form.

###### Turned parts: think in meridians
Write a part as its half-section: a list of `[s, r]` from one end to the other, and turn it with `G.solidOf(profile, F, P)`.
- **Steps and shoulders** are where the radius jumps at one `s`: `[6, 12], [6, 9]`. They make the crease lines that read as machining.
- **Curves** are many points marked smooth (`[s, r, 1]`), so no crease is drawn across them: a bell, a dome, a fillet into a flange. The kit shades any profile with a smooth vertex smoothly on its own (`smooth: "auto"`), so the shading follows the curve instead of stepping facet by facet; pass `smooth: false` only to opt out.
- **A waisted body is never hulled.** A profile that narrows in the middle (a throat, a spool) has a concave outline. `lathe` notices when its true silhouette lies more than half a pixel inside the hull of its rings and then fills and outlines it with the silhouette and the visible end arcs instead (`fill: "auto"`, or force `"surface"`). Drawn as a hull, the Raptor throat was a straight cone with a pale unshaded strip and a seam that stopped 8 px short of the outline.
- **Seams and weld lines** on a curved surface are `G.arcOf(F, s, r, P, { slope })`, with the profile's slope at that ring, drawn `faint` and passed as the solid's `inner` (`solidSvg(paths, { inner: lineSvg(arcOf(…), { tone: "faint" }) })`; the Raptor's `S` and `Ln` are one-line wrappers over these), so they sit under the outline. They end exactly at the limb, a little short of it. Concatenated after the solid, each seam's round cap lands on the edge stroke and the dark-theme outline of the Raptor's actuator barrels looked dashed at 4×.
- **A long body** (a nozzle, a barrel) is cut into bands with `G.bandsOf(profile, cuts, F, P, { radius, slope })`, so each band depth-sorts against the pipes that wrap it. The bands share one `steps`, one normal field and one surface, their own outlines come cleared, and `sidesOf` draws one continuous outline for the whole body (`kit.md`, section 10), so the tone curves run through every joint without a step and the sides don't kink. Without an analytic `radius` and `slope` it fits one curve through the whole profile, never one per band.
- **A ring around a band** (a stiffening ring on a chamber, a collar) splits the band: band, ring, band. Drawn as one long band with the ring on top, the ring's back half paints over the band (or the band hides the ring's front); split, each piece orders itself. The Raptor chamber jacket is three bands between its two rings.
- **An open end** is a `ringBand` lip, with a filled void (`circleOf`) for the dark inside and the inside arc from `arcOf(..., { inward: true, least: -1 })`. Bolt dots go around the lip.

###### Parts on a round body
- **Flange:** its back face sits on the route end, so the route ends exactly on the mount's surface and the disc runs from there back along the pipe (`centre = end − tangent · t/2`). `disc(-t/2, t/2, r, frameAlong(centre, axis), P)`, with a bolt circle `dotsOf(F, faceS, 0.74r, 8, P, { all: true })` on the face that points at the viewer. Skip the bolts when the face is edge-on (`|dot(a, V)| < 0.12`).
- **Boss or port** on a curved wall: a short `disc` along the outward normal, with a `faint` face ring (`circleOf`) when it faces you. This is where a sense line, igniter or plug lands. Make it at least as wide as the flange that lands on it; a flange that overhangs its boss floats at the rim.
- **Saddle pad.** A flat flange on a curved body leaves a gap at its rim (the sagitta, `R − √(R² − a²)`): an 11.6 flange on an 18.4 pump body stood 4 units off at the sides. Wherever that gap would be more than about 0.15, seat the flange on a pad: a short cylinder whose base follows the host surface (`G.saddleOf(F, a, start, h, P)` with `start(angle)` found from the host's shape, the Raptor's `padOn`/`boss(..., { host })`). Record it as a disc `cut` by its host and marked `seated`, so the audit sees its true shape. Keep the pad inside one band of the host (an overhang under a step is drawn in front of the band that hides it; a Raptor pad lowered until its rim touched the step below became an interlock in every frame) and off the host's silhouette: a pad that straddles the silhouette is half in front of and half behind its host, and no painter's order draws it. The Raptor's LOX duct moved from 130° to 150° for that reason. **A saddle belongs to its host's assembly.** Its base is cut to the host's curve, so if it flies out with the pipe the cut base is on show apart: the Raptor's hot-gas pad, cut to the methane pump's turbine and ring, became a jagged shard with a pointed tail. Give the pad to the host's piece (`boss("ftp", …, { host: FTP_TURBINE })`) and let the moving pipe's flange leave its flat top; the audit's `seats` lists every seated shape whose host moves with another assembly.
- **Igniter plug, one terminal.** A plug carries either the igniter line (leaving its outer face along its axis) or the exciter cable, never both. The cable lands on its own small boss beside it.
- **Valve on a pipe:** a bulged `lathe` profile on `frameAlong(point, tangent)` turned with `smooth: true`, with bolt dots on both end faces, a round neck and an actuator box with a lid outline and two screws. It sits on a straight leg (body length plus both fillet cuts), the pipe is gapped under its body, and the actuator stands perpendicular to the pipe: up on a level pipe, sideways (a round can) on a vertical one, never along the pipe.
- **Volute:** `spiral(F, s, r0, r1, a0, a1)` fed to `tubePieces` with a radius that grows along it. Keep its centreline at housing radius plus tube radius plus 0.3, so it wraps the housing tangentially; a volute sunk into the housing is a pipe through a solid.
- **Ball joints and tees** are spheres (`sphereOf`): a rod-end bearing on an actuator, a cast tee where a branch meets a manifold.
- **Knurls, ribs and fins on a tilted axis:** `ribsOf`. Vanes on a face: `spokesOf` with a `sweep`.

###### Pipes
- Lay out a route as a few straight legs between real ports, then `fillet` it with a bend of about 2.6 × the pipe radius. Pipes bend; they don't kink.
- End every pipe on a port with a flange, or on a block with a terminal dot. A pipe that stops in the air is a line that stops in the air.
- Add the parts a real line has: bands where it is clamped or welded (`bands: [0.5]`), a bellows where it must flex (a run of thin `disc`s, `bellows: [from, to, count]`), and a valve where flow is controlled. These are the Raptor `pipe()` helper's options (`kit.md`, section 11).
- Use few sizes, all big enough to tell apart: main ducts (r 5–8), feed lines (r 2–4), sense lines (r 0.9–1.5), cables (r 0.5–0.65).

###### Choosing waypoints
Route the big lines first (ducts, downcomers, manifolds), then feed lines, then sense lines, then cables, so each smaller line routes round what is already there. For each route:
- **Start on the port's normal.** The first leg leaves the port straight out along its surface normal, long enough for the flange, then the bend: `fillet` takes at most 0.48 of the shorter leg, so a leg shorter than about twice the bend radius gives a tight bend, and a turn right at a port facing the viewer pinches ("Clearance and crossings", step 5).
- **Follow structure.** Legs run parallel to the body they follow (along a chamber, up a downcomer) or round it on a ring at a fixed radius (`arcPoints`), offset from its skin by the body's own clearance: skin radius plus about 1.5 × the line's radius. The owner's close-up showed sense lines fanning across the chamber's face and over the main duct to reach their block; on the new build the long line from the nozzle manifold runs up the left side, the fuel-valve cable runs up beside the downcomer, and the harness comes down from the controller in parallel drops into clamped lanes.
- **Stay on your side of the subject.** A line that serves a port on the far side goes round the back or round the side at a ring, never diagonally across the front of the thing being explained.
- **Prefer legs across the screen.** A leg that runs straight toward or away from the viewer projects short and makes every turn at its ends a cusp or a V ("Clearance and crossings", steps 4 and 5).
- **Leave room for fittings.** A valve, bellows or clamp needs a straight leg at least its body plus both bend allowances (`r_bend · tan(turn / 2)` each). On a bend the straight body cuts into the pipe; the Raptor's downcomer was rerouted so its valve sits on a straight run, and the oxygen duct gained a vertical straight for its valve.
- **Don't land on a rod.** A pipe's last leg must not run along a rod, tie rod, post or rail on screen, and its end fitting must not sit on one's outline: the blind-test bench's hose ran its last leg parallel to a tie rod, 2 px above it, so the rod read as plugged into the hose fitting. Approach the port across the rods, or turn the elbow so the leg lies across the screen. The audit's `crowding` treats every slender solid (length over 4× its radius or half-width) as a line, so it fails these. Check every pose too: a ferrule that sits on a moving plate's edge at the end of the stroke reads as touching it.
- **Cross deliberately.** If two lines must cross on screen, they cross once, on straights, at a clear angle, and far enough apart in depth that the clearance check passes with room to spare. A crossing near a bend or an end reads as a joint ("Clearance and crossings", step 6).
- **Split, don't overlap.** Where something wraps a pipe (flange, band, bellows disc, clamp, valve body), the pipe is gapped there and a piece ends on each face (`tubePieces` `gaps`, `crossingsOf` for clamps). Run through it as one chunk, the pipe is both behind and in front of the collar and no key can order it. The Raptor chamber jacket was split at its two rings for the same reason.

###### Contacts and junctions
Every place two parts meet is either a flat face on a flat face, a tangent contact, or a rim landing on a round body. Nothing is sunk into anything: a sunk part is both in front of and behind its host, and no painter's order can draw it.
- **Flush.** A rod ends on the face of its clevis; a boss starts on the surface it stands on; a lug is a short pin from the housing to the ball.
- **Rim on a round body.** A cylinder of radius `a` meeting a sphere or tube of radius `R` ends where its rim lies on the surface, `sqrt(R² − a²)` from the centre. Its end face is then hidden inside the host and nothing shows through. This is how the Raptor's actuator rods meet their ball joints and how the manifold tube and the downcomer meet their tee.
- **Tees.** A branch into a pipe is a sphere fitting a little larger than both: the run is gapped where its rim meets the sphere and the branch ends on the sphere. Size the sphere so neither pipe's rim pokes into the other: for a branch of radius `b` into a run of radius `a`, `R ≥ sqrt(a² + b²)`.
- **Stand-offs.** A ring that would have to sink into a curved body to touch it (a manifold round a bell) stands clear by at least half its tube radius on small radial pads.
- **Valves and bellows on straights.** A straight lathe on a curved pipe cuts into it at both ends. Put them where the route is straight for their whole length.
- **Two flanges, one joint.** Where a duct bolts to a pump outlet flange, the duct's own flange meets the outlet flange face to face; two flanges in the same place interlock. Each part then keeps a flange when the figure comes apart.
- **Branches have fittings.** A branch leaves its run from a tee (a ball the run is gapped under, the branch starting where its rim meets the ball) or from a saddle pad on the run, never from a bare spot on the run's skin.
- **Struts end in ball joints.** A strut's eye disc laid along an oblique axis sinks into whatever it meets. Give each end a short stem along the host's normal, a ball on the stem, and the rod between the balls (rim on sphere at all four joints).
- **Balls with flats for joints that move.** In a 3D figure a rim landing on a sphere can't be ordered at every angle. Give the ball a flat (`T.ball({ flats: [{ n, d }] })`, recorded as `A.ball(c, r, { flats })`) and land the rim on the flat, or use coaxial knuckle discs. `references/3d.md`, section 5.
- **Everything is held.** Every solid is connected through contacts to the stand: brackets carry boxes, studs carry harness clamps, a gearbox plate joins a motor to its actuator. A clamp that touches only the cable it holds floats.

###### Clearance and crossings
A pipe keeps about 1.5 radii between its centreline and anything but its own connection, so a 0.6 cable passes 0.3 clear of a duct's skin and a duct keeps half its radius off its neighbours. Where two lines must cross on screen, they cross in depth, one well in front of the other, and the chunk keys order them; where a pipe passes through a collar, clamp or valve it is gapped there (`kit.md`, section 11). Prove it rather than eyeballing it:
1. Record a shape for every item and every tube as you build, into one `A.recorder(P, { order, spring })` (`kit.md`, section 12): `R.put` for drawn items with their `shapes`, `R.solid` for each shape, `R.route` for each pipe and cable. Make the helpers do it, so nothing escapes. There is a recorded shape for everything the kit draws: `A.slab`, `A.extruded` and `A.cylinder` for floor prisms, `A.solid`, `A.lathe` and `A.disc` for turned parts (traced along the same curve the drawing uses), `A.prism` for `prismOf`, `A.ball`, and tubes.
2. Settle the painter's keys with `A.settle(R, P)` on every build: it measures the overlaps in every state the figure rests in (assembled and apart) and in every frame of its real explode (`explodeStates` replays the live springs and stagger) and runs `orderKeys`.
3. End the build with `A.auditOrExit(R, P)` and run `node build.mjs --audit` until every failing line prints zero. An interlocked pair is a geometry bug (a split, a gap or a tangent contact fixes it); don't bias it away.
4. Lines don't double back on screen. A horizontal leg that runs away from the viewer reads as going up, so a pipe that runs away and then drops reads as a cusp, a pipe ending in mid-air. Route the leg sideways on screen first (the audit's `folds` finds every case: a screen turn over 140° within 4 radii while the real turn is under 110°).
5. No outline folds back on itself, and no bend pinches to a point on screen. A leg that points at the viewer and then turns (a sense line leaving a jacket boss radially and climbing to a block, a pigtail leaving a transducer tip and hooking back) projects its fillet edge-on, and the two legs meet in a V with no visible radius. `folds` measures the screen radius of every visible bend over 90° and fails it when it is under twice the tube's screen radius. Fixes, in order of preference: let the turn happen inside a fitting (a ball tee on the boss, the line leaving it toward its next point: the Raptor's `elbow`, used by sense0, sense2, sense5 and the fuel-rich igniter line); bend in a plane that faces the viewer (the Raptor's pigtails loop in the transducer's own radial plane, which faces the camera; its local helper `sideOn(d) = unit3(cross3(unit3(V − d·(V·d)), d))`, with `V = G.viewOf(P)`, gives the direction across the screen from a leg along `d`, so a bend in the plane of `d` and `sideOn(d)` faces the viewer); move the port to where its normal lies across the screen. A bend in a plane whose normal makes `f = |n·V|` with the view projects to a screen radius of about `R·f²`; once that is under the tube's screen half-width, the inner edge of a single chunk runs backwards and the outline crosses itself in a little knot (the audit's `selfOverlaps`). `fillet(…, { P, tube })` raises each corner's radius to clear that, but only as far as the legs allow, so give a turn next to a port at least `R + 3r` of straight leg. A port that faces the viewer squarely (the Raptor's speed pickup on the methane pump) makes every approach a hairpin: move it.
6. Crossings happen on straights, clearly. Where one line's bend or end lands on another's outline on screen (touching, or overlapping by any amount), the eye reads a joint or a line threaded through another, whatever the true depth: a pigtail hook that peeks out from behind a sense-line elbow, a flange that lands on another line's band in the apart pose, a cable that runs along a short duct on screen and over its end flange. A fitting counts too: a harness clamp whose outline lands on another line reads as that line growing out of the clamp, as the Raptor's clamp did on the oxygen-to-preburner line apart. The audit's `crowding` lists every visible case, assembled and apart; reroute one line so the meeting is a clear crossing of two straights or a visible gap of at least a pixel (two for a clamp). Excuse a pair only after you have looked at it at 8× (`CROWD_OK`).

The first Raptor had 54 clearance problems (39 pass-throughs) and 323 depth-order problems; the routes in this section took both to zero.

###### Shading and textures on curved surfaces
- **Smooth shading** (automatic on any profile with a smooth knot; `smooth: { slope }` or `{ slope, radius }` for an analytic curve; `bandsOf` for a body in bands; `sphereOf` for balls) on every curved surface: bells, throats, domes, cones, valve bulges, balls. A flat facet tone per row is only right on a cylinder. Each tone is one polygon over the whole body for as long as its region count holds, so no row seams show.
- **A texture ends on an edge or fades, along the axis too.** Each rib's `s0` and `s1` land exactly on a drawn step, crease or seam arc at the same `s`: pass `seams: true` and `ribsOf` returns the two seam arcs with the ribs, so they can't drift apart (the blind-test motor ran its ribs from 26 to 88 with seams at 24 and 90, and every rib stopped 2 units short at both ends). Where a rib row has no seam, let it run onto the face that ends the band (`s0`, `s1` equal to the band's ends) or fade it.
- **A texture on a pipe follows its cross-section.** Braid, corrugation, tape wrap and armour come from `tubePieces(route, r, P, { rings: { pitch, twist, cross, fade } })`: rings (or with `twist`, helices, and with `cross: true`, a braid of both hands) placed by 3D arc length along the whole route, each drawn as the visible front arc of its cross-section, fading toward both limbs and ending on the ferrule and gap faces. Never a `stroke-dasharray` along a chunk's centreline: it ends in straight hard edges along the hose, doesn't wrap the round section, piles up on the inside of bends, and restarts at every chunk joint.
- **Textures end on an edge or fade.** Ribs and bolt circles that are limited to the side facing you stop wherever the cut-off falls, in the middle of the surface: the bolt circles on the Raptor's chamber rings did, in the owner's close-up. Use `ribsOf(..., { fade })` with `fadedSvg`, and `dotsOf(..., { fade })`, so they fade out toward the turn (the Raptor uses `fade: [0.04, 0.42]` for bolt dots and `[0.1, 0.55]` for ribs). Seam arcs and band lines already end on the silhouette. A single texture line that has to stop in the middle of a face (a groove that runs out, a weld bead short of a corner) is drawn with `fadeLineSvg(points, { fade: [start, end] })`, which ramps it out over a few px with a gradient along the line; never let it end on a bare cut. Choose the cut-off from the way the feature faces, not from the ring it sits on: spray holes on top of a deluge ring face up and are seen all the way round, so they take `all: true`. Culled by the ring's outward normal (`least: -0.2`), the Raptor's row stopped at full strength just past the ring's sides while the ring ran on round the back, bare. Never cut a row on an up-facing feature with a radial `least`; if part of it really is hidden, `fade` toward the turn.
- **Smooth tones taper.** Where a tone band appears or disappears along a curved profile, it is born at zero width and grows (`smooth` refines rows by screen error until each boundary is within 0.35 px and every change of band count happens in a sliver). A band that ends on a straight cut across the surface, or a pale wedge of bare fill, is the bug the reviewer finds first.
- **Shape and shading describe one curve.** Smooth runs of a profile are interpolated with a monotone cubic Hermite curve (Fritsch–Carlson), and the kit uses that same curve for the normals, the tone sheets, the silhouette and the hull. A natural spline overshoots near a peak: on the Raptor's valves it put three sign changes of slope into a body that rises and falls once, and the tone bands zig-zagged across the bulge like wood grain while the outline stayed a polyline with a nub at every profile point. A monotone curve can only turn where the profile turns.
- **The monotone Hermite is only C1.** Its `dr/ds` is a piecewise quadratic: with hand-typed knots it plateaus at each knot and overshoots between them, and tone bands, which follow the slope, stall and then lurch, a staircase in scallops. The Raptor throat had extrema of slope at five places on a profile that bends one way; its deck cone wobbled more mildly. Any curved body larger than a fitting needs an analytic profile `r(s)` and its derivative passed as `smooth: { slope }`, sampled at 20–30 knots: the throat is `√(24.2² + (c·(s − 146))²)`, the cone `48·(1 − x)^0.8` closed to `r = 0` at its tip with a vertical tangent, so the outline rounds over the tip instead of peaking above a flat tip disc. The audit's `wobble` fails any profile smoothed without a `slope` whose `dr/ds` turns between its ends.
- **Outlines are ellipses, not facet polygons.** Facet counts are for tone fills only (about 3 px per facet on screen, `stepsFor(r, 32, 160, scale)`); every silhouette, rim and crease is sampled from the analytic circle at about 1.5 px, and creases and bevels end exactly where the faces turn away. A 20-sided flange outline next to a 96-sample torus reads as a notch at 4×.
- **Tube stripes.** Shine and shade bands run continuously through chunk joints and on to the very end: at every capped end they follow the outward half of the end ellipse, and at an end face turned toward you they stop on its inner rim, which is drawn. At a joint the stripes overhang the body by a further 0.5 (bodies overlap by 0.5, stripes by 1), and every frame is computed from the whole route, so the later chunk's stripe covers its own body's anti-aliased cut and ends on an identical stripe. With body and stripe cut on one line, a hairline crossed the volute's shade band at every joint, light in light theme and dark in dark. Check them at 4× at every bend, tee, bellows and flange, and on a strongly curved tapered tube. Anything you draw on a chunk yourself (a texture, flow marks) follows the same rule: compute it from the whole route, phase it by 3D arc length from the route's start, and extend it over the chunk's stripe overhang (1 unit past each joint), or the joint shows as a half-dash, a doubled mark or a notch. The `rings` option does this for you.

###### Harness routing
Cables are the easiest way to ruin a figure: a cable drawn across the subject's face reads as a scribble. Route them like a real harness:
- **Lanes.** Run cables in parallel lanes on a ring around the body (`arcPoints` at a fixed `s`, each lane offset 1.4 units out and 0.2 along for r 0.62 cables). They leave the lane only to branch to their plug.
- **Enter in order.** Cables come down from the connectors in parallel drops and join the ring where their drop meets their lane (at `acos(x / laneR)`), so the innermost lane is fed by the connector nearest the front and no drop crosses another.
- **Leave in order.** The outermost lane leaves the ring first; an inner cable that turns outward while outer lanes still run beside it has to cross them.
- **Follow structure.** A cable that has to climb runs up beside a pipe (the Raptor's valve cable runs up the downcomer) instead of crossing open space in front of the engine.
- **Short branches.** Go from the lane straight to the port. Don't run diagonally across the subject's face.
- **Clamps** (`disc(-0.9, 0.9, r, frameAlong(point, tangent))`, tone `mid`) hold the lanes to the body at regular angles. Gap each cable where it passes through a clamp (`crossingsOf`), or the clamp and the cable interlock.
- **Ends land.** Each cable starts at a connector on the controller or a junction box and ends on a plug, sensor tip, valve lid or bulkhead connector, never on a clamp or in the air beside the bundle. An end that stays with its own assembly gets a terminal dot; an end on another assembly gets a connector shell (`cable(..., { shells: [false, true] })`) that moves with the cable.
- **Count what you draw.** Push every route into a list (`CABLES`) and build the readout from its length. The first Raptor readout claimed 8 cables while 11 were drawn.

##### 9. Exploded views
An exploded view earns its place when the parts are the explanation (what feeds what, in what order):
- Choose the assemblies the real thing comes apart into (the Raptor has 11), not single solids.
- Move each assembly along its real disassembly direction, far enough that its silhouette clears its neighbours: down along the axis for stacked stages, out radially for side units.
- Every part keeps a home. Parts that bridge two assemblies (actuators, cables) go with the one they stay attached to, and when apart they still end on something of their own: a flange, a coupling nut at a quick-disconnect, a connector shell on a cable. Strut ends are ball studs on their hosts with the rod leaving with its assembly, and saddle pads stay on their hosts. Mark each end that comes off its mount when apart (`free: [true, false]`); the audit's `looseEnds` fails every other end that touches nothing of another owner in the apart state, and lists the free ones so each is a choice.
- Highlight and motion are separate. A sensor bolted to the chamber highlights with the plumbing but rides the chamber's spring (`ride`, emitted as `data-ride`). Moved with another assembly's vector on its own spring, it slides along its mount and sinks into it mid-flight.
- Choose explode vectors and the stagger so nothing passes through anything, in any frame: `references/motion.md` ("Order the stagger so nothing has to pass through") has the rules, and the audit replays every frame of the real springs, opening, closing and reversing halfway, and fails on any pass-through.
- List the assemblies in the legend as numbered buttons (`01 Gimbal and thrust puck`…) that select, the same as hovering does.
- Springs, staggering and per-frame depth re-sorting are in `references/motion.md`.

##### 10. Screens and things on faces
A screen, a dial face or a display is drawn in the plane of the face it sits on (`examples/desk-computer/`):
- **The face plane.** `sideMatrix([0, y], 0, P, "left")` maps a group's local `(x, −z)` coordinates onto the vertical face at `y`. Draw everything on the screen (the glow, scanlines, a mark, `<text>` and a cursor) in those flat coordinates inside that `<g transform>`.
- **A recess.** Clip the screen to its rounded outline with a `clipPath` in the same plane, and draw the recess's inner sides as quads between the face and the face moved `depth` back. Shade the sides by facing (tops `iso-top`, sides by shade). Draw the outline `lo` on the face and `faint` at the back.
- **Motion on the face** is a transform in face coordinates. The CRT power-off scales the picture about the screen centre to a line, then to a dot, with a beam line and a fading dot.
- **Text the machine displays** (a typed line, a counter's digits) is part of the object, not a label, so the one-label rule doesn't apply. Keep it in the screen's own type and size, and fit it: the cap height is about 0.55 of the window's height and the widest string you will ever show (`8.88`, the longest unit) must fit its width with a margin of about a tenth of the height. Clip it to the window like any screen. A blind-test flow meter set 5.6 px digits in a 12.8 × 8 window, so the leading digit crossed the window's left border and the digit tops ran into the unit label.
- **Content seen through an opening** (a sight glass, a gauge window, a recess) sits behind the face, so draw the opening's inner walls between the face and the back plane, shaded by facing, and clip the content to the opening in the face plane as well as its own. A strip of bare face inside the opening reads as a hole drawn on the surface. For a shader behind an opening, `webgl.md`, section 5.

##### 11. Shaders
Some subjects can't be drawn with lines: fire, exhaust, water, caustics, real lamp light, steam. These go in a WebGL layer *inside* the drawing, in world space and in the same camera, between a back SVG and a front SVG. `references/webgl.md` has the layer stack, the camera contract, the craft rules (nothing pops, no hard cut-offs, tonemap and dither, blending per theme) and how to verify them. Everything in this page still applies to the SVG around the effect. Its section 8 covers the light theme, which ships: inks solved from the colour the paper should show, ink that grows with the light, a dark physical ground for every glow, recipes for hot metal, glass, sparks, flame, steam, plasma and Cherenkov light, and a no-WebGL fallback that matches the shader.

### `references/walkthrough.md`
#### Walkthrough: the test rig (Fig 6)

How `examples/test-rig/` was designed. It is a figure for a "Stretch" section explaining how a glass button responds to touch: a press swells it, pulling makes it lean toward the finger (with less give the further you pull), and letting go springs it back past rest once.

##### 1. Truth
The behaviour was copied into a pure model, `rig.ts`, from the library source:
- The rest size is 120 × 32 (`HALF = [60, 16]`).
- A press swells it by 8%, at most 6 px a side.
- The lean is a rubber band: `give · (1 − 1/(1 + 0.55·d/give))`, with `give` = 14 px.
- There are three springs: press 700/32, hold 540/40 and release 320/16, as stiffness/drag.
- The capsule stretches along the lean by at most 8% and thins across.

`step(member, held, pull, dt)` advances it and `poseOf(member)` returns the shape. The readout, the aria text, the caption numbers and every moving part read from this one model.

##### 2. Object
"A test rig." A real lab would hold a button in a sprung fixture and measure it with a probe and a dial gauge. Each part carries meaning:
- **The glass capsule** is the subject. It is lit while held and its shape is rebuilt every frame from the pose.
- **A carriage on two guide rods with four coil springs** shows that the glass is springy and returns. The springs compress and extend as it leans.
- **A finger probe on a rail behind it** is the pointer. It comes down to press, then slides along the rail to pull. A ruler and a rider on the rail show how far it has pulled.
- **A dial gauge with a plunger touching the carriage** reads the lean. Its needle turns 20 px per revolution, with a mark at `give`.
- **A base plate on feet** carries a frame of four bars with a ruler and a zero mark, screws, a label plate, a floor grid and bores for the rods.

##### 3. Parts list (53 solids)
| Group | Parts |
|---|---|
| Base | plate, 4 feet (flange and foot), groove, 4 corner screws with rings, label plate with screws and rule |
| Rail | 2 posts on feet, the beam with a ruler (minor every 5, major every 25), 2 end stops, screws, a rider |
| Probe | block, thumb knob with knurl, pointer, index line, arm, housing with cap, collar, seams, lock screw, stem, collar, pad |
| Frame | back, left, right and front bars with screws, floor with grid, rod bores and ends, ticks with a zero mark |
| Mechanism | 2 rods, 4 coils (split back and front), the carriage plate with a seat outline, 4 bushings, rivets, a contact block, a plunger rod with a collar |
| Dial | stand with screws, sleeve, clamp, lug, puck, knurled band, bezel and face rings, ticks, give marks, crown, a "px" engraving, the needle |
| Subject | the glass capsule (fill, shades, top, crease, bevel, inner rim, shine, edge) and the dotted rest outline |

##### 4. Camera and layout (`view.ts`)
- **Camera.** Azimuth 57°, so the long front of the frame faces the viewer. The viewBox is 600 × 340, fitted to the base and the top of the rail with a pad of 34.
- **Layout.** The rig is laid out around the origin. The glass is centred at (0, 0) on the carriage top, the rods run along x at y = ±18, the dial stands at x = 131 and the rail sits behind at y = −66, z = 50.
- **Helpers.** `at(point)` projects a point and `shift(x, z)` moves things along x and z.

##### 5. Geometry (`geometry.ts`, `pose.ts`)
- `geometry.ts` computes every static part once: a `solid(plan, z, h, steps, bevel)` wrapper over `slabOf`, a `cylinder`, `knurl`, `sideArc`, `faceRing` and ruler helpers.
- `pose.ts` has `frameOf(pose, …)`, which rebuilds only what changes: the capsule's paths, the 4 coils, the carriage and probe transforms, the needle and the pull wire.

##### 6. Painter's order (`live.tsx`)
1. Base.
2. Rail, with the rider and the probe block.
3. Back frame bars.
4. Back coil halves.
5. Rods.
6. Left coils.
7. Carriage.
8. Glass.
9. Rest outline.
10. Pull wire.
11. Right-back coils.
12. Plunger.
13. Right-front coils.
14. Front frame bars.
15. Dial with needle.
16. Finger.
17. Arm.

The frame and the springs are split so the carriage sits *inside* them.

##### 7. Live behaviour (`live.tsx`)
- **One loop.** It reads the scripted tour or the user's hand, eases the finger (τ 0.09 s) and the lift, steps the spring model, then writes every changed attribute through refs and says the readout.
- **Idle tour.** It starts after 1.4 s in view and loops every 7.6 s: rest, press, pull 80, release, settle. It pauses on hover, focus or press and resumes 3.6 s after the last input.
- **Pointer.** Hover moves the finger along the rail; press-and-drag presses and pulls.
- **Keyboard.** Space presses or lets go, arrows move and pull (Shift for bigger steps), Home and End go to the ends, and Escape releases.
- **Accessibility.** `role="slider"`, and `aria-valuetext` such as "Pressed: 129.6 by 34.6 pixels, pulled 80.0 px, leaning 10.6 px".
- **Reduced motion.** The springs become critically damped: the glass still swells, but it never leans or bounces.

##### 8. Card
- **Corners.** "Fig 6" · "Press and pull" · hint "Press, then pull ← →" · readout "120.0 × 32.0 · lean 0.0 px".
- **Legend keys.** The glass while it is held (raised) · where it rests (dotted) · the pull, from where I pressed to the finger (edge).
- **Caption.** States the rig and the true numbers.

### `references/verify.md`
#### Verify

Look at the figure the way a demanding reviewer would, before anyone else does. Rendering it is cheap, and guessing is expensive.

##### Capture
`scripts/capture.mjs` starts its own headless Chrome (set `CHROME_PATH` if it can't find one), loads a file or URL, and clips to `.iso-plate` by default. It also prints the readout, any console errors or exceptions, and whether the page scrolls sideways.

```sh
node scripts/capture.mjs page.html --out shots/desk.png                         # desktop 1440, dpr 2
node scripts/capture.mjs page.html --out shots/phone.png --width 390            # phone
node scripts/capture.mjs page.html --out shots/hover.png --hover 0.7,0.5        # pointer at 70% across
node scripts/capture.mjs page.html --out shots/tour.png --times 1200,2400,3600  # motion: extra shots over time
node scripts/capture.mjs page.html --out shots/keys.png --key ArrowRight,ArrowRight
node scripts/capture.mjs page.html --out shots/joint.png --zoom 200,80,220,170  # close-up at 4x, in card px
node scripts/capture.mjs page.html --out shots/still.png --reduced              # reduced motion
node scripts/capture.mjs http://localhost:3000/docs --select "figure:nth-of-type(3) .iso-plate"   # one figure on a dev-server page
```
`--select` takes any CSS selector; by default it clips to the first `.iso-plate`. Each `--times` delay counts from the first shot, so `1200,2400,3600` shoots at about 1.2, 2.4 and 3.6 s after it (a capture takes 60–200 ms, so delays closer together than that run late), saved as `name-<ms>.png`. `--key` sends the same key codes as `drive.mjs` (`7` as `Digit7`, `.` as `Period`; write a comma as `Comma`, since the list is comma separated). The other options are `--height` (1000), `--scale` (2), `--wait` (2500 ms before the first shot), `--zoom-scale` (4) and `--theme dark|light`. Read every PNG you make: open it and look.

Both scripts start Chrome with WebGL on (`--enable-unsafe-swiftshader --ignore-gpu-blocklist`), so shaders show in `capture.mjs` stills too. Use `drive.mjs` for anything that has to be timed or slowed down.

##### Drive
`scripts/drive.mjs` runs a scripted session in headless Chrome with WebGL on. Use it for sequences: hover, then click, then type, then wait for a phase. Use it also for slowed-down contact sheets that catch pops, and for the no-WebGL fallback. It prints the readout after each shot, then any console errors and exceptions.

```sh
node scripts/drive.mjs page.html '[["wait",1500],["move",".rt-stage",0.7,0.4],["wait",600],["shot","shots/hover.png"]]'
node scripts/drive.mjs page.html --actions steps.json --height 1300
node scripts/drive.mjs page.html --actions steps.json --width 390
node scripts/drive.mjs page-light.html --actions steps.json --reduced
node scripts/drive.mjs page.html --actions steps.json --no-webgl
node scripts/drive.mjs page-light.html --actions steps.json --preload slow.js
```
Options are `--width` (1440), `--height` (1100), `--scale` (1), `--reduced`, `--theme dark|light`, `--no-webgl` (every `getContext("webgl")` or `"webgl2"` returns `null`, to check the SVG fallback), `--preload file.js` (a script that runs before the page's own scripts: counters, stubs, hooks, or `window.__driveSpeed=0.04` to run slowly from the first frame) and `--actions file.json`. Selectors default to the first `.iso-plate`, and fractions run 0..1 across the element.

`--theme` (in both scripts) only emulates `prefers-color-scheme`. Kit pages choose their theme when they are built (`data-theme` on `<body>`) and ignore that media query, so to check the light theme, build with `--light` and drive the `-light.html` file.

| Action | What it does |
|---|---|
| `["scroll", sel]` | Scrolls the element into the middle of the viewport. |
| `["wait", ms]` | Waits. |
| `["move", sel, fx, fy]` | Glides the mouse there in 10 steps, firing `pointermove`. |
| `["click", sel, fx?, fy?]` | Clicks, at the centre by default. |
| `["drag", sel, fx0, fy0, fx1, fy1, steps?]` | Presses at one point, glides to the other in `steps` (20) moves a frame apart, releases. These are real input events (pointer id 1), so a handler that calls `setPointerCapture` works. Test drag-to-turn with it: `PointerEvent`s dispatched from `eval` have no active pointer, and `setPointerCapture` throws `NotFoundError` and aborts the handler. |
| `["key", key, sel?, code?]` | Focuses `sel` (default `[tabindex="0"]`) and presses a key: `"i"`, `"Escape"`, `"ArrowRight"`, `" "`, `"7"`. Digits send `DigitN`, letters `KeyX` and punctuation its proper code (`Space`, `Minus`, `Comma`…). Pass `code` for keys that share a name: `["key", "Shift", null, "ShiftRight"]`, `["key", "Enter", null, "NumpadEnter"]`. |
| `["slow", factor]` | Runs the page's `requestAnimationFrame` timestamps and `performance.now` at `factor` × real time: `["slow", 0.05]` is 20× slow motion, so a sheet catches a 100 ms event in many frames. `["slow", 1]` restores real time. |
| `["until", js, timeoutMs?]` | Polls a JS expression every 25 ms until it is truthy (default 10 s), and prints a line if it times out. |
| `["eval", js]` | Runs JS in the page and prints the result. Promises are awaited. |
| `["shot", out, sel?, scale?, [x,y,w,h]?]` | Screenshots an element, or a region of it in CSS px. |
| `["sheet", out, every, count, sel?, scale?, [x,y,w,h]?, columns?]` | Takes `count` frames `every` ms apart and tiles them into one numbered PNG. |
| `["turn", value, group?]` | 3D figures: sets `window.__isoTurn` (a number sets the first turn group, `group` names another, an object sets several) and waits two frames. |
| `["orbit", out, from, to, step, sel?, scale?, [x,y,w,h]?, columns?]` | 3D figures: a contact sheet across angles of the first turn group, each frame labelled. `["orbit", "swap.png", 129.7, 130.2, 0.1, null, 6, [x, y, w, h]]` is a 6× close-up of one order change. |
| `["lines", out?, sel?, { tolerance }?]` | The line-end check below, in whatever pose the actions before it left the figure (apart, mid-stroke). `out` writes the card with every floating end ringed. A failure makes the run exit 1. |

Traps:
- **Shots are correct after `scroll`**, so you can scroll to a figure lower on a page. A viewport tall enough for the whole card (`--height 1300`) is still the simplest: the figure is visible at scroll 0, and its `IntersectionObserver` starts it.
- **Frame spacing in a sheet is `every` plus the capture time** (60–200 ms, more on heavy WebGL pages, where capture also stalls animation frames). For transitions faster than that, put `["slow", 0.05]` before the sheet and `["slow", 1]` after it. `wait`, `every` and the page's `setTimeout` timers stay in real time, so at 0.05 a sheet every 100 ms is 5 ms of page time apart, and an idle tour's resume timer still fires on the wall clock: a key press holds it off for only about 3.6 s of real time, so press a harmless key again before each slowed sheet. An event that starts on load needs the page slow from its first frame: `--preload` a file with `window.__driveSpeed=0.04`.
- **Slow mode doesn't slow timers.** `setTimeout` runs on the wall clock, so during a long slowed capture an idle tour's resume timer (the Raptor's 3.6 s `quietTour`) can restart the tour and close the engine mid-sheet. Before every slowed sheet stop the tour and wait for rest: preload a stub for that timer (`const st = window.setTimeout; window.setTimeout = (f, d, ...a) => (d === 3600 ? 0 : st(f, d, ...a));`), press `Escape`, `["until", "document.querySelector('[data-readout]').textContent.includes('cold')"]`, and only then the key that starts the transition. A sheet labelled "opening" that starts from a tour that has already opened films a close.
- **Wait for a phase, don't guess.** `["until", "document.querySelector('[data-readout]').textContent.includes('main stage')", 8000]` returns as soon as the readout reaches the phase.
- **A `null` selector is the default.** In every action a missing or `null` selector means the first `.iso-plate` (for `key`, the focusable `[tabindex="0"]`), so `["sheet", "s.png", 200, 16, null, 0.5]` films the card.
- **Long eval strings break inline JSON quoting.** Put anything with `eval` or `until` in `--actions steps.json`.
- **Pages inline their live code as `<script type="module">`,** so top-level variables aren't visible to `eval`. Read state through the DOM instead: readout text, `aria-valuetext`, `data-*` attributes. To count frames or read a value per frame, install a hook with `--preload` (it runs before the page, so it can wrap `requestAnimationFrame` or `HTMLCanvasElement.prototype.getContext`).

##### Line ends
The audit sees recorded shapes, never line markup, so it can't see a seam, rule, rib or tick that stops in the middle of a face. `scripts/lines.mjs` checks the drawing itself, in headless Chrome:

```sh
node scripts/lines.mjs page.html --out shots/lines.png
node scripts/lines.mjs page-light.html --out shots/lines-light.png --reduced
node scripts/drive.mjs page.html '[["key"," "],["wait",2000],["lines","shots/lines-apart.png"]]'
```
```
line ends: 3 of 1148 ends on 295 lines float
  iso-line faint in it k -0.080  end  7.25 px from anything   at card 507.4,407.2   length 75.7   d M392.1 381.7L507.4 407.2…
```
Every open subpath of every `.iso-line` in the card (seams, grooves, ribs from `fadedSvg`, rule lines, ticks, needles, pointers, wires) must end within 1 viewBox px of another stroke, a dot or an outline, or under a fill painted after it. A short straight mark (up to 7 px: a tick) needs one end rooted within 2 px; both ends floating fails. The kit's own outlines, creases, bevels and tube edges aren't checked, and neither are ends that a `fadeLineSvg` ramp fades out. `lineSvg(d, { free: true })` (or `"start"`, `"end"`) marks an end that is meant to stop: rule lines that stand for printed text, a needle's tail, a pointer's tip. Use it for nothing else. It prints each floating end in card px, ready for `capture.mjs --zoom`, with the start of its `d` so you can find it in the build; `--out` rings them on a 2× shot of the card. Run it on both themes and in every pose the figure rests in, and fix every line until it prints 0:

| You see | Fix |
|---|---|
| A seam or weld line on a box inset from the corners | `k.sideSeam(plan, z, P, steps)` as the slab's `inner`: it wraps the corners and ends on the silhouette (`craft.md`, section 3). |
| A stiffener or panel line on one face, inset at both ends | Run it edge to edge: from the face's bottom to its top, or from end to end. |
| Ribs that stop short of their seams | `ribsOf(…, { seams: true })`, or `s0`, `s1` on the band's ends. |
| Ticks floating on a bare plate or hanging below an edge | Put them on a ruler strip, rooted on its edge (`topTicks` `edge`, `sideTicks` `top` on the face's top edge). |
| Vent or grille lines | Closed slots: a thin rounded outline, not a line. |
| A line that runs under a part and stops just past it | Draw it before the part, full length, and let the part hide it. |
| Rule lines on a label plate | `free: true`. They stand for text. |

##### Audit
Screenshots catch what you think to look at. A figure with pipes, cables and round parts also needs the geometry checked, because a cable through a duct or a part drawn over the thing in front of it is invisible at 1× and obvious at 4×. Wire `kit/audit.mjs` into the build (`kit.md`, section 12): helpers put into one `A.recorder(P, { order, spring })`, the build calls `A.settle(R, P)` and ends with `A.auditOrExit(R, P)`, then run:

```sh
node examples/raptor-engine/build.mjs --audit
```
```
clearance: 0 problems
clearance apart: 0 problems
terminals: 0 ends not on a mount
loose ends: 0
screen folds: 0
support: 0 unsupported solids · 0 hanging tubes · 0 sunk pairs
depth order: 0 problems
through in mid-flight: 0 pairs
self-overlap: 0 chunks whose outline crosses itself on screen
wobble: 0 smoothed profiles whose slope turns between its ends
saddles off their host apart: 0
stand-in shapes: 0 items whose recorded shape covers too little of what it draws
crowding: 0 pairs where a bend or end touches another line on screen
free ends apart (marked free, not failing): 35
audit · 80 tubes · 267 solids · 478 items · 1119 depth states · 1707702 overlaps · 4292 order rules · 151.9 s
audit passed
```
It prints `audit passed` or `audit failed: n problems` and exits non-zero on any failure. Every line counts, including what happens in mid-flight and `items with no shape`, except two lists that are there to be read: `in passing` and `free ends apart`. Depth order and pass-through (tube against everything, and solid against solid) are both checked on the same replayed frames: every frame of the springs opening and closing until they settle, every frame of a reversal 8 ms either side of each stagger boundary (`reversalsOf`: 0.027, 0.043, 0.062, 0.078 … 0.393 s on the Raptor's 35 ms stagger), and the prefix states (`prefixStates`). Depth uses every fourth of those frames. How to read and fix each line:

| Line | Meaning | Fix |
|---|---|---|
| `through A × B  clearance -2.4` | Tube A intersects B over that arc-length span. | Reroute A round B with about 1.5 radii to spare, or move B. Only the shape A's end rim sits on is excused, and only within a radius or so of that end. |
| `close A × B  clearance 0.2 < 0.6` | A passes B with less than half its radius to spare. | Nudge the route; widen harness lane spacing. |
| `clearance apart: through share 1 …` | In the apart state a tube passes through something. | Change that assembly's explode vector. |
| `terminals: A end 1.40 from B (rim -1.1…1.3)` | A's end, or the rim of its end flange, doesn't sit on its mount: it floats, it is tilted, or the flange is wider than the boss under it. | End the route exactly on the surface, along the surface normal; make the boss at least as wide as the flange; on a curved body seat the flange on a saddle pad. A cable never ends on a clamp. |
| `loose ends: share 1 A end touches nothing that moves with it` | Apart, the end hangs in the air: nothing of another owner moves with it (its own flange or shell doesn't count). | Give it a mount that moves with it, or, if it is meant to come off (a flanged duct, a connector on another assembly), mark it `free` so it is listed under "free ends" as a choice. |
| `self-overlap: A:3 its outline folds back on screen` | One chunk's outline crosses itself: the line turns on a screen radius under its own half-width (a leg pointing at the viewer that turns near a port). | Leave the port through an elbow ball (the Raptor's `elbow`), give the turn more straight leg, or bend in a plane that faces the viewer (the Raptor's `sideOn`, `craft.md`, section 8). |
| `wobble: A dr/ds turns at s = …` | A profile smoothed from typed knots has a slope that plateaus and reverses, so its tone bands staircase. | Give it an analytic `r(s)` and pass `smooth: { slope }`. |
| `saddles off their host apart: A (piece) is cut to B (host piece)` | A saddle pad flies off with another assembly, showing its cut base. | Give the pad to the host's assembly; the moving pipe leaves its flat face. |
| `solid  state  A × B  sunk 1.81 deep` | Two solids of different assemblies pass through each other in that frame. | As for a tube: fix the order or the vectors, or open the gap under an overhang. |
| `screen folds: A turns 150° on screen for 78° in 3D` | The route doubles back on screen and reads as a cusp. | Route the leg before the turn sideways on screen. |
| `screen folds: A turns 110° on screen round a 0.4 px bend` | A visible bend pinches to a point: its fillet is seen edge-on, so the two legs meet in a V. | Turn inside a fitting (a ball tee, the line leaving at 45°), bend in a plane that faces the viewer, or move the port so its normal lies across the screen. |
| `through in mid-flight: apart 0.233 s A × B clearance -1.6` | In that replayed frame A passes through B. | Fix the order or the vectors (`motion.md`, "Order the stagger"): the part outside leaves first, a vector that points into another assembly's face needs that assembly to leave earlier, threaded parts share a spring. |
| `crowding: A bend × B outlines overlap 0.05 px` | A's bend or end lands on B's outline on screen and reads as a joint or a line threaded through B. | Reroute so the meeting is a clear crossing of two straights, or leave a visible gap. Excuse a pair (`allow`) only after looking at it at 8×. |
| `crowding: A end × B (rod)` | A's end or bend lands on the outline of a slender solid: a tie rod, piston rod, post, rail or handle (any solid longer than 4× its radius or half-width). It reads as the rod plugged into A's fitting. | Approach the port across the rod, or turn the elbow so the last leg lies across the screen. |
| `stand-in shapes: A its shapes cover 4% of its drawing` | The shapes recorded for A cover much less of the screen than A draws, so the audit checks a sliver and says nothing about the rest. | Record the true shape of what you draw (`A.slide` for a rod that slides out of a gland). Excuse an item (`cover: [name]`) only when its drawing really reaches past its body, and only after looking at it. |
| `crowding: C fitting × B` | A clamp lands within 2 px of another line and reads as that line growing out of it. | Change the explode vector or the clamp's angle. |
| `support: loose A` / `hanging A` / `sunk A × B 1.2 deep` | A solid, or a rigid tube, touches nothing that leads to the stand, or is buried in B. | Add the bracket, stud or plate that holds it; for a sunk part fix the contact (rim on surface, pad cut by its host marked `seated`; `seated` only excuses the host in its `cut`). |
| `order  A is in front of B but drawn first` | A's surface is nearer wherever they overlap, but B paints over it, at rest or in a mid-flight frame. | `orderKeys` normally fixes these; one left over means a rule was dropped from a loop, so look for the interlocked pair in that loop. |
| `cycle  A … (n the other way)` | A and B are each in front of the other somewhere: they interpenetrate on screen. | Change the geometry: gap the pipe at its collar, split the band at the ring, end the rod on the ball, make the volute tangent, put the valve on a straight, keep a pad off its host's silhouette. |
| `in passing` | Interlocks, or can't be ordered by any `k + lift · share`, in a uniform state only (all assemblies at one share, which the page never shows). | Not a failure. The same thing in a replayed frame is a `depth order` problem. |
| `items with no shape` | Something is drawn without a recorded shape, so nothing checks it. | Record it in the helper that draws it. |

A zero audit is necessary, not sufficient: it can't see a seam, a staircase or a texture that stops, and it only checks what you recorded. A stand-in shape that silences it is a bug, which is why it fails one. Run the line check, then look.

##### Orbit (3D figures)
A figure with turning groups (`references/3d.md`) adds the orbit audit and the browser checks. Run them on the light page and the dark page.
```sh
node build.mjs --light --audit > audit.txt 2>&1 &   # the full run, in the background: ends "turn audit passed"
node build.mjs --light --audit --quick    # ≈ 10× fewer states while iterating: ends "turn audit quick"
node build.mjs --light --audit --quick --only=order,continuity   # a subset: the rest print "skipped", ends "turn audit partial"
node build.mjs --light --verify           # a page with window.__isoVerify (recorded shapes) for --order
node ../../scripts/turn-check.mjs build.mjs --fidelity
node ../../scripts/turn-check.mjs page-verify-light.html --order --step 1
node ../../scripts/turn-check.mjs page-verify-light.html --order --states clip.json     # hinges and clips: --step turns the first turn group only
node ../../scripts/turn-check.mjs page-light.html --pops --no-webgl --states tilt-path.json   # one hinge as a continuous path at 0.02°
node ../../scripts/turn-check.mjs page-light.html --pops --no-webgl --step 1 --out shots/pops
node ../../scripts/turn-check.mjs page-light.html --lines
node ../../scripts/turn-check.mjs page-light.html --perf --width 1440
node ../../scripts/turn-check.mjs page-light.html --perf --width 390 --throttle 4
node ../../scripts/drive.mjs page-light.html '[["orbit", "shots/orbit.png", 0, 345, 15]]'
```
**Time.** A 28-part figure with one turn, one hinge and one clip took 85 s quick and 17 minutes full, past a 10-minute shell timeout: run the full audit in the background. Quick runs undersample (`continuity` checks 100 halving candidates instead of 800, and the order scan a tenth of the states), so they guide, and only the full run's `turn audit passed` counts. A run with `--only` ends `turn audit partial`, never `passed`.

**States.** The audit sweeps each turn group at 0.3° (order) and 0.05° (continuity), plus 2000 random states and every order-change event ± 0.001°. Motion clips (`clips: [{ name, at(t), from, to, frame }]`) are walked frame by frame: a gesture, a grasp, a break-apart. Free and hinge groups are proved only on the states you give, so give every clip, at several turn angles.

**Lines.** `separation`, `unseparated`, `cycles`, `forced`, `swaps`, `layers`, `rigid`, `swept`, `posed`, `folds`, `self`, `crowding`, `endon`, `coverage`, `depth`, `continuity`. `3d.md`, section 13, has each line's failure and fix. A planted fault fails each line: a sunk pad (`separation`), a pinwheel of three tilted sticks (`cycles`), a fibre bent in a vertical plane (`folds`), a tube at 30° (`endon`), a rib row that stops (`continuity`).

**Browser checks** (each runs its control first; a control that doesn't fail means the check is broken):
- `--order`: the recorded shapes in a WebGL z-buffer against the DOM's fills: 0 live pairs with 4+ interior pixels at every angle and clip state.
- `--pops`: first difference at every degree (θ → θ + 0.02°) and second difference at 0.1° over a full turn: 0 surviving regions, 0 cores of 6+ px. Read the 1–5 px cores it lists.
- `--lines`: 0 floating ends at 24 angles.
- `--perf`: the budgets in `3d.md`, section 15, at 1440 and at 390 with 4× CPU.

**Orbit sheets.** 0–345° at 15°, then 0.1° steps across the three largest order changes (the audit lists them under "order changes"), then every clip slowed (`["slow", 0.05]`). Read them for spider angles (a hand that reads as legs from some side), parts that vanish behind others, and lines that end on another part's outline.

###### Checklist for 3D figures
- [ ] `turn audit passed` with the full state set (not `--quick`, not `--only`), clips included.
- [ ] `--order` on `--states` for every hinge and clip, `--pops` on a 0.02° path for every hinge (`3d.md`, section 14).
- [ ] `turn-check` order, pops and lines at 0, fidelity passed, every control failing as designed.
- [ ] Orbit sheets read at 15°; 8× crops of every knuckle, crossing and texture end at 8 angles, light and dark.
- [ ] Materials read as metal on the light page: highlight bands move with the turn, nothing pops at a tone crossfade.
- [ ] Every shader anchored to its group follows it at 0.1° steps; world effects don't turn; ink stops at occluding strokes (8× crop where a cover mask meets a part).
- [ ] Budgets measured at 1440 and 390 × 4, with the half-rate lever if a dense figure needs it.

##### Close-ups
The owner found the Raptor's faults on a close-up of the light theme: cables over the main duct, a stepped bell, bolt rows that stopped dead. Shoot that close-up yourself, everywhere, before anyone else does.

1. **Build both themes** (`node build.mjs` and `node build.mjs --light`) and list the junctions: every flange, tee, elbow, ball joint, clamp, valve, bellows, band, saddle pad and crossing, every curved body (bells, throats, domes, cones, valve bulges, balls), every band joint of a body cut with `bandsOf`, and every place a texture ends. On flat parts too: every seam, weld, stiffener and trim line on a box face (does it reach both corners?), every row of ticks or marks on a plate (is it on a ruler strip?), every rib row's two ends along its axis, every textured hose at a chunk joint and at its ferrules, every rod that slides (at rest, mid-stroke and at full stroke), and every window or screen with text or shader content in it.
2. **Shoot each area at 4× in both themes, assembled.** `--zoom x,y,w,h` takes a region in card px and scales it by `--zoom-scale` (4):
   ```sh
   node scripts/capture.mjs page.html --out shots/joint-dark.png --zoom 200,80,220,170
   node scripts/capture.mjs page-light.html --out shots/joint-light.png --zoom 200,80,220,170
   ```
3. **And apart**, if the figure comes apart. Drive it there, wait for rest, then shoot a region at scale 4. The Raptor toggles apart on Space and its readout starts `apart ·` only once every spring has arrived, so `apart.json` is
   ```json
   [["key", " "], ["until", "document.querySelector('[data-readout]').textContent.startsWith('apart')"], ["wait", 400],
    ["shot", "shots/apart-joint.png", null, 4, [200, 80, 220, 170]]]
   ```
   run with `node scripts/drive.mjs page.html --actions apart.json`, then again on `page-light.html`.
4. **Look at each PNG for these faults, in this order:** a line that runs through or into something; a crossing whose nearer line is drawn behind; a bend, end or clamp sitting on another line's outline; a flange standing off its port or sunk into it; tone blocks stepping across a curved surface, scallops or a pale wedge; a band ending on a straight cut; a row of ribs, dots or rule lines stopping in the middle of a surface; a hairline across a tube's shine or shade at a chunk joint; a seam notching the outline; a seam, stiffener or rib that stops short of the edge it should reach; a short mark on a top that touches nothing; a hose texture with straight hard sides, or one that restarts or is cut at a chunk joint; a rod whose outline breaks while it moves; text that crosses its window; shader content that spills past an opening's rim. Compare with the previous round's shot of the same region.
5. **Shaders:** the same regions during the effect, plus contact sheets slowed with `["slow", 0.05]` (`webgl.md`, section 9).

**Detail pass.** Last, sweep at 4× in a grid of crops (the subject and mechanism for a Figure, the whole drawing for a Hero or an Epic; `SKILL.md`, workflow step 1) and look for any face, corner or stretch of base with nothing true on it. Every figure is highly detailed (`SKILL.md`, "Every creation is highly detailed"): add the real parts that belong there (screws, seams, bevels, label plates, scales, the brackets that hold things), never decoration that belongs to no part.

##### Light-theme shaders
Light is the shipping theme, and on paper a glow is ink. Every light conversion so far failed review first on something a picture of one frame doesn't show: ink that rose while the light fell, a pale flash before the glow, a salmon stage, a fringe beside a stroke. So measure the ink as well as looking at it (`webgl.md`, section 8).

**Ink per frame.** Save this as `ink.js` and pass it with `--preload`. For every frame the page draws, it logs the mean ink one canvas region lays on white, `255 − lum(rgb + 255 − a)`, read back in the same task as the draw:
```js
const get = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (kind, ...rest) {
  const gl = get.call(this, kind, ...rest);
  if (gl && String(kind).startsWith("webgl") && !this.__gl) {
    this.__gl = gl;
    for (const name of ["drawArrays", "clear"]) {
      const call = gl[name].bind(gl);
      gl[name] = (...args) => { gl.__drew = true; return call(...args); };
    }
  }
  return gl;
};
const raf = window.requestAnimationFrame.bind(window);
window.__ink = [];
window.requestAnimationFrame = (callback) => raf((now) => {
  callback(now);
  const canvas = document.querySelector(window.__inkCanvas || "canvas");
  const gl = canvas && canvas.__gl;
  if (!gl || !gl.__drew) return;
  gl.__drew = false;
  const [x, y, w, h] = window.__inkBox || [0, 0, canvas.width, canvas.height];
  const px = new Uint8Array(w * h * 4);
  gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  let ink = 0;
  for (let i = 0; i < px.length; i += 4) {
    const bare = 255 - px[i + 3];
    ink += 255 - (0.2126 * (px[i] + bare) + 0.7152 * (px[i + 1] + bare) + 0.0722 * (px[i + 2] + bare));
  }
  window.__ink.push(Math.round((ink / (w * h)) * 100) / 100);
});
```
- **Choose what to measure.** Before the transition, set `window.__inkCanvas` (a selector) and `window.__inkBox` (`[x, y, w, h]` in device px of the canvas, measured from its bottom-left; scale CSS px by `canvas.width / canvas.clientWidth`) with an `eval`. Read the rows afterwards with `["eval", "window.__ink.join(' ')"]`.
- **Do it once per region that matters:** a cavity, the core, an area only the fallback covers. Run it slowed, across first light (`--preload` a second file with `window.__driveSpeed=0.04`), every phase change and the fade-out.
- **What to look for.** Ink follows the physical quantity monotonically: up as the light comes in, down as it goes. There is no hump at a hand-off and no dip at first light.
- **What it caught.** The afterburner's cavity peaked at 3600 on the cut before its fix; afterwards it fell monotonically from 1894 to 155. Those rows are in that figure's own units, a sum over its window region rather than this hook's mean. On the ripple tank's light page the hook reads 14.2 at rest and falls as the lamp comes in, because that page's light brightens the paper.

**Colour along the ramp.** For anything that heats or cools, `eval` a pixel read at the centre and the rim at several temperatures (or several temperatures' worth of a slowed run) and write them down. The order must be dull red → orange → yellow → near-white, with the rim cooler than the centre and no salmon or grey stage on the way.

**Cross-sections.** Read one row of ink across a flame, a jet or a stream. It peaks on the axis and falls to translucent edges. An edge-heavy profile is a hollow, outlined flame.

**Strokes at 8–16×.** Crop every place where ink meets an SVG stroke (cut faces, rims, mouths, creases, a canvas edge with a body entering) at 8–16× in light. Look for a pale gap between the ink and the line, ink over the line, or a stroke the ink cleared.

**Both paths, and nested.** The dark build should match its baseline, because every light change is gated on `uLight`. Render a dark plate on a light page and a light plate on its own, each with and without WebGL: a `:not([data-theme="dark"])` rule can reach through the page into a dark plate.

##### The review checklist
**It is an object**
- [ ] At a glance it reads as one real, well-made thing, and you can name it.
- [ ] Its mechanism maps to the concept: what moves and what that means can be said in one sentence.
- [ ] It isn't a stack of abstract plates and isn't one plain slab.

**Parts and volume**
- [ ] 30–60 solids for an inline figure; a hero subject that really has more parts can go far past that (the Raptor has about 270). Every part rests on another and has a job.
- [ ] Sides shaded and tops lighter; bevels on the main slabs; a halo under the base and under lifted parts.
- [ ] Small details belong to parts: screws at the corners of plates, grooves, rulers, knurls, label plates.

**Lines**
- [ ] At 4×, every line ends on a face, another line or a terminal dot. Nothing stops in the air.
- [ ] No leader lines, balloons, dimension arrows or floating labels; at most one engraved label.
- [ ] Painter's order is right everywhere: nothing behind shows through, springs and frames are split.
- [ ] **Audit zero.** With pipes, cables or round parts in the figure, `node build.mjs --audit` ends `audit passed`: zero on every failing line, assembled, apart and in every frame of the replayed explode (opening, closing and reversing). No interlock was hidden with a key bias, and every excused pair (`allow`, `crowd`) has been looked at at 8×.
- [ ] No pipe or cable passes through another pipe, cable or solid, and every crossing is drawn in depth order: the nearer line on top, crossing on straights, well apart in depth.
- [ ] No line runs across the subject's face where it could run beside the structure; no bend pinches to a V on screen; no bend, end or clamp lands on another line's outline, assembled or apart.
- [ ] Every flange sits on its port (on a saddle pad if the port is curved); every collar, clamp, band, bellows and valve gaps the pipe it wraps; every valve and bellows sits on a straight; no route doubles back on screen; every end, apart too, ends on a flange, coupling, connector or terminal dot.
- [ ] **Junction close-ups.** Every junction area shot at 4× in both themes, assembled and apart (see "Close-ups"), and each PNG read.
- [ ] **No staircase.** Every curved surface is smooth-shaded at 4×: no stepped tone blocks, no scalloped terraces, no pale wedge, no band that ends on a straight cut, no kink at a band joint; waisted bodies follow their true outline; seams meet the outline without a nick.
- [ ] **Line ends zero.** `node scripts/lines.mjs` prints `line ends: 0` on both themes and in every resting pose; every `free` end is a rule line standing for text, a needle tail or a pointer tip.
- [ ] **Shapes are true.** No stand-in shapes: what is recorded is what is drawn, including rods that slide.
- [ ] **No abrupt texture ends.** Every row of ribs, bolt dots, rule lines or grooves ends on a real edge or fades out; none stops at full strength in the middle of a surface, flat faces included. Seams on boxes wrap their corners, rib rows end on their seams, ticks sit on a ruler strip, and a texture on a hose follows its cross-section and runs through every chunk joint. Pipe stripes run onto their end caps and show no hairline at any chunk joint, also on a strongly curved tapered tube (a volute).

**Tone and colour**
- [ ] Base `lo`, structure `mid`, subject `hi`, exactly one `lit` accent.
- [ ] Monochrome unless colour is the subject.

**Card and words**
- [ ] `Fig n` / title / hint / live readout are in the corners, with legend keys and a caption under the card.
- [ ] Every number is true and comes from the model. The readout changes as things move, and its words and numbers come from the same instant: a phase word from the model next to a number from a lagging gauge reads `relief 85 bar` before the valve has cracked.
- [ ] Text the machine displays fits its window at its widest string and is clipped to it.

**Motion and access**
- [ ] Eased, calm, no snapping; an idle tour; pauses on interaction.
- [ ] Stops offscreen; still under `--reduced`; no console errors (including React key warnings).
- [ ] Keyboard works, the focus ring shows, and `aria-valuetext` reads the state in words.

**Shaders (if the figure has one; `references/webgl.md`)**
- [ ] A contact sheet across every transition (start, each phase change, steady, stop), slowed with `["slow", 0.05]` (or `--preload` with `window.__driveSpeed=0.04` for an effect that starts on load) so every frame of each crossfade shows: no sudden colour switch, no one-frame flash, nothing cut out, and brightness never rises during a fade-out.
- [ ] 2× and 4× crops where the effect meets the SVG: no seams, hard edges, banding, dark collars or double lines; things on a plane register with that plane's lines.
- [ ] The canvas's outer rows and columns read alpha 0 in every phase.
- [ ] Without WebGL (`--no-webgl`) the SVG alone still reads; under reduced motion you get one still, representative frame; the loop stops when idle and offscreen.
- [ ] **Light theme** (`webgl.md`, section 8; "Light-theme shaders" above):
  - Glows read through saturation, with a saturated body, a pale core and a coloured rim, never as dark or brown ink.
  - What the light falls on is tinted, and the cavity that holds the light is a darker physical ground.
  - Hot bodies run in blackbody order with no salmon stage.
  - Smoke and steam are light grey.
  - There are no halos in empty air.
  - Ink per frame follows the light monotonically through first light, every hand-off and the fade-out.
  - Ink stops at each stroke's inner edge at 8–16×.
  - The fallback shows the same inks and ground, and hands over to the shader without a dip.
  - Dark is unchanged, and a dark plate on a light page still works.

**Composition**
- [ ] Centred, filling about 55–65% of the card; it doesn't touch the corner labels.
- [ ] Still readable at 390 px with no sideways scroll, with a part selected and during a burn, not only at rest: the longest readout must not run under the controls.

##### Common faults and fixes
| You see | Fix |
|---|---|
| A part shows through something in front of it | It is painted too late. Move it earlier, or split the front part. |
| An ellipse shows across a post where it meets a face | A full `ring` drawn over a cylinder that continues shows its back half. Use `sideArc` (front half only), or let the cylinder's own outline make the edge. |
| A post looks pasted onto the block it passes through | Draw it in two segments, below and above, with the block painted between them. |
| A crease or bevel stops short of a corner | Use `bevel` on `slabOf`/`cylinder`. It already ends on the silhouette. Don't hand-draw edge lines. |
| Flat, dead sides | You passed `flat`, or the solid has height 0. Give it thickness. |
| Too sparse | Add structure, not texture: feet, rails with rulers and end stops, a label plate, screws, a knob, a second stage. |
| Too busy | Drop texture-like repeats and tone grooves down to `faint`; keep one lit accent. |
| The figure is tiny in the card | Fit with a smaller `pad`, or tighten the points passed to `fitProjection`. |
| It jumps when a tab regains focus | Clamp `dt` to 1/30 s. |
| Key warnings only on the big page | See `react.md`: key the roots of element props. |
| A shader colour jumps at a phase change | Give colour its own slow envelope, and drive it from the physical quantity, not from a phase flag. See `webgl.md`, section 7. |
| A straight edge in the glow, often at the canvas border | A term isn't zero at a boundary. Window it to zero before every `if`, bound and canvas edge. |
| A glow runs through the floor or over a column | It is in screen space. Rebuild it in world space with the ray and the ground hit, and give simple parts to the shader as occluders. |
| A dark collar under a glowing rim | The rim is normal-blended over the shader. Move it to an overlay SVG with `mix-blend-mode: screen`. |
| Flat bands in soft glows | Add gated triangular dither after `tonemap`. |
| In light, a glow reads as dark red or brown smoke | It is the dark colour darkened, with alpha set to brightness. Solve the ink from a paper ramp with a saturated body, a pale core and an alpha floor (`webgl.md`, section 8.1). |
| In light, first light goes pale and then dark, or a fade-out greys or gets heavier | Per-term fades, an alpha-only fade, or a hue that reddens at fixed alpha. Fade the finished ink once, dim energy and alpha together, and take the hue at steady brightness (`webgl.md`, section 8.2). |
| In light, a pale fringe or white seam along an edge | The ink stops short of the stroke, or clears a crease nobody strokes. End it at the stroke's inner edge (0.3 vb) and draw the crease in ink (`webgl.md`, section 8.6). |
| A dark plate's fallback vanishes on a light page | A `.iso:not([data-theme="dark"])` rule matched through the page. Put the dark rule last, or key on the plate's own theme (`webgl.md`, section 8.5). |
| A pipe or cable looks pasted on or cuts through a part | Its pieces are in one layer. Depth-sort each `tubePieces` chunk by `mid`, and use shorter pieces where it weaves. If it really passes through the part, reroute it; `--audit` lists every case. |
| Cables or sense lines fan across the subject's face and over a main duct | They were routed point to point. Re-route along the structure: up beside a pipe, round the body in clamped lanes, round the side to a far port (`craft.md`, "Choosing waypoints"). |
| Fixing one crossing's order breaks another, or the apart pose | Keys tuned by hand. Record shapes, let `A.settle` set the keys, and fix whatever it reports as interlocked in the geometry. |
| A collar, band or clamp hides the pipe's near side, or the pipe paints over the collar's face | The pipe runs through it as one chunk. Gap the pipe at the collar (`gaps`), so a piece ends on each face. |
| A ring on a body shows its back half over the body | The body is one long band under the ring. Split it at the ring. |
| A valve or bellows cuts into its pipe at the ends | It sits on a bend. Move it to a straight at least its own length plus both fillet cuts. |
| Stepped tone blocks on a bell, dome or cone | Facet shading. Mark the curved knots smooth (`[s, r, 1]`, shaded smoothly by default) or pass `smooth: true`; cut a body into bands with `G.bandsOf`. |
| Tone bands on a throat, cone or puck stall and lurch in scallops | A smoothed profile of hand-typed knots: its slope plateaus at each knot. Write the profile as an analytic `r(s)` and pass its derivative as `smooth: { slope }` (`wobble` lists them). |
| Hairline seams inside a smooth-shaded part | The tone sheets abut. Use the kit's `solidSvg` with `seamless` paths (smooth lathes and `sphereOf` set it) and `ISO_CSS`. |
| A row of ribs or bolt dots stops in the middle of a surface | A hard `least` cut-off. Use `fade: [lo, hi]` on `ribsOf` or `dotsOf`. |
| A pale wedge with straight edges on a smooth-shaded cone or bell | Bare fill between tone pieces: pieces of one tone wound in opposite directions cancel under the nonzero rule, or a band ended without tapering. The kit orients every tone polygon and tapers bands; if you build tone paths yourself, orient them. |
| A narrowing body looks like a straight cone with a pale strip | It was hulled. Let `lathe` pick `fill: "auto"` (or pass `"surface"`). |
| A hairline crosses a tube's shine or shade band | Body and stripe cut on the same line at a chunk joint. `tubePieces` runs the stripes past the body; keep that if you change it. |
| The outline is dashed where seams meet it | Seams drawn after the solid. Pass them as `inner`. |
| A pipe's stripes stop short of its end | An end without a cap. `tubePieces` caps every end by default; don't pass `caps: false` for an end that shows. |
| Parts slide along their mount while the figure comes apart | They move with one assembly's vector on another's spring. Give the item that assembly's `ride`. |
| A long turned body has a kinked outline at band joints | Build it with `G.bandsOf` and draw the sides once with its `sidesOf` (`kit.md`, section 10). |
| A texture line stops in the middle of a face | End it on a real edge, or draw it with `fadeLineSvg(points, { fade })` so it ramps out. `scripts/lines.mjs` lists every one. |
| A seam on a box stops short of its corners | `k.sideSeam(plan, z, P, steps)` as `inner`. |
| A hose braid or corrugation with straight hard sides, or broken at chunk joints | `tubePieces(…, { rings: { pitch, twist, cross: true } })`. |
| A rod's outline notched while it slides | One rod from `G.rodOut`, clipped at the gland, recorded with `A.slide`; never overlapping copies. |
| LCD or counter digits cross the window | Fit the type to the window's height and widest string, and clip it. |
| Stray triangles of outline across a valve or bulge | An old kit joined a broken silhouette; the kit now falls back to the hull when a side's silhouette has gaps. Rebuild with the current `lathe.mjs`. |

### `references/3d.md`
#### 3D: parts that turn in the drawing

The optional 3D mode ("turning groups") lets some parts of a figure move as rigid bodies: a dial or turntable that spins, fingers that flex, a piece that breaks off and tumbles. Those parts are re-projected and re-shaded every frame by the kit's own rules and painted in an order solved from separating planes. Everything else stays ordinary static kit art. A figure that doesn't opt in is untouched.

**Status: beta.** The engine is proved on `examples/turning-dial` and one test figure (a desk fan built from this document alone), not yet on a production figure. Turn one subject at a time, keep clutter static, and measure your figure against section 15 before you add parts.

##### Contents
1. When a figure earns 3D
2. The model
3. A minimal page
4. The authoring API
5. Part kinds and the rules that keep them true
6. Materials
7. Free groups: parts that break off
8. Hinge chains: hands and fingers
9. Painter's order and why it is correct
10. Shading and fades
11. Static layers and a messy workshop around a turntable
12. Shaders that follow the turn and the groups
13. The orbit audit
14. Browser checks
15. Performance
16. Known limits

##### 1. When a figure earns 3D

Only when the motion is the explanation: a dial whose numbers are read as it turns, a turntable that shows an object from every side, a wheel pack, a hand that grips or breaks. Never as decoration. A figure that only needs a part to slide or a needle to swing stays 2D: `translateAlong` and a re-drawn needle are cheaper and exact.

##### 2. The model

- **Groups.** A group is a rigid frame with a pose. Kinds: `turn` (about a vertical axis through `pivot`, any angle), `slide` (along a direction, `0…travel`), `hinge` (about any axis through a point, within `range`, in degrees) and `free` (any rotation plus a translation, set by the figure every frame). Groups nest: a pose is relative to the parent.
- **Rest.** Every constructor takes **world coordinates at rest** (every group value 0, every free group `null`). The engine subtracts each group's origin, so the recorder (`A.recorder`), the kit and the engine share one world.
- **Live layers.** A live layer is one `<svg class="iso-svg iso-live" data-live="name">` in the stage. Live and static layers stack in the order of `T.stack([...])`: for example `back svg → [dial live] → back canvas → [hand live] → front canvas → front svg`.
- **The identity.** Turning a group by θ about a vertical axis is exactly the kit drawing at azimuth `a − θ`, because the kit's light is camera-locked. So every frame of a turn group is the kit's own picture at P′(θ), shifted; the kit builders at P′(θ) are the fidelity reference, and every kit screen-space audit runs unchanged at P′(θ). Hinges and free groups compose matrices instead (correct, slightly slower).

##### 3. A minimal page

`examples/turning-dial/` is the reference scene: a dial with a knurl, ticks and numerals, a second turn group (an index wheel under a window), a hinge (a pawl riding the knurl), a hand of about 80 parts with materials, a three-hinge finger that lifts, a hex pod that breaks off as a free group, and a WebGL LED, light pool and sparks. `examples/turning-dial/stress.mjs` is the performance scene (a dense hand on a turntable in a cluttered workshop); it is not audit-clean, so take patterns from `build.mjs`.

`build.mjs`, reduced to its skeleton:
```js
import * as k from "../../kit/iso-kit.mjs";
import * as A from "../../kit/audit.mjs";
import { turning } from "../../kit/turn-build.mjs";
import * as TA from "../../kit/turn-audit.mjs";
import { turnScript, glScript } from "../../scripts/inline-kit.mjs";

export const P = k.fitProjection(points, W, H, { pad: 22, azimuth: 40, elevation: 31 });
export const R = A.recorder(P);
export const T = turning(P, { recorder: R });
const dial = T.group("dial", { turn: { pivot: [0, 0] } });
const lift = T.group("f2.mcp", { parent: dial, hinge: { point: C1, axis: w, range: [-22, 0] } });
const hand = T.layer("hand");
T.stack(["back", "hand", "front"]);
export const follow = (values) => ({ ...values, "f2.mcp": -22 * (values.lift ?? 0) });
export const poses = () => Array.from({ length: 720 }, (_, i) => follow({ dial: i * 0.5, lift: (i % 90) / 90 }));

T.round({ name: "dial.body", group: dial, layer: hand, F: VERT(0, 0), s0: 10, s1: 14.4, r: 50, material: "steel", details: { ribs: { s0: 10.9, s1: 13.7, count: 150, seams: true, tone: "lo" } } });
T.prism({ name: "hand.palm", group: dial, layer: hand, plan: PALM, z: 19.4, h: 8, bevel: 0.9, material: "gold" });
T.tube({ name: "cable.red", group: dial, layer: hand, route, r: 0.7, hue: "red", material: "rubber", gaps });
// … static kit art: R.put({ name, layer: "back", svg, shapes }) as usual …

const out = T.build({ statics: R.items, poses, verify: argv.includes("--verify") });
A.settle(R, P);
if (argv.includes("--audit")) {
  A.auditOrExit(R, P);
  TA.orbitOrExit(T, R, P, { sweep: { at: (x) => follow({ dial: x }), from: 0, to: 360, frame: 0.3 }, clips: [{ name: "tap", at: (t) => follow({ dial: 40 + 12 * t, lift: tapAt(t) }), from: 0, to: 4, frame: 1 / 60 }] });
}
const stage = `<div class="iso-stage iso-turn" tabindex="0" role="slider" …>${backSvg}${out.layerSvg("hand", { width: W, height: H })}${frontSvg}</div>`;
const page = k.pageHtml({ title, theme, body: k.plateHtml({ …, body: `<style>${out.css}</style>${stage}` }), script: turnScript() + LIVE });
```
`live.js`:
```js
const controller = TURN.mount(stage, DATA.turn, { follow, onHold: () => (touring = false), onFrame: () => paint() });
function tick(now) {
  …
  controller.set({ dial: angle, lift });
  frame = visible && moving ? requestAnimationFrame(tick) : 0;
}
```
The figure owns the loop (`motion.md`); the controller never runs its own `requestAnimationFrame`. `out.css` is `TURN_CSS` (the face band rules, materials, hue tubes and the `.iso-turn` stacking): include it once.

**In React or Next.js** (`references/react.md`): copy `turn.mjs`, `turn-build.mjs` and `turn-audit.mjs` beside the kit with the imports rewritten (`./iso-kit.mjs` → `./kit`, and so on), and `TURN_CSS` as a `turn.css` imported once. The geometry module (server) runs `turning(…)` and `T.build(…)` and returns the stage markup (`out.layerSvg(name, { width, height })` for each live layer, in stack order between the static SVGs and canvases) plus `out.data` in the figure's data. The client mount calls `TURN.mount(stageElement, data.turn, { follow, onHold, onFrame })` and drives `controller.set(...)` from its own loop; return `controller.destroy` from the effect's cleanup. A verify build can put `out.verify` in the data and have the mount assign `window.__isoVerify` for `turn-check --order`.

##### 4. The authoring API

###### Scene
| Call | What it does |
|---|---|
| `turning(P, { recorder, scale = 1 })` | The builder `T`. Pass the kit recorder so every live shape is recorded for the kit audit too. |
| `T.group(name, { parent?, turn: { pivot: [x, y] } })` | Rotation about the vertical through `pivot`, value in degrees. |
| `T.group(name, { parent?, slide: { direction, travel } })` | Translation, value `0…travel` world units. |
| `T.group(name, { parent?, hinge: { point, axis, range: [lo, hi] } })` | Rotation about `axis` through `point`, value in degrees within `range`. |
| `T.group(name, { parent?, free: { origin } })` | A free rigid body (section 7). Value `{ R: [9] \| q: [x, y, z, w] \| axis, angle, t: [3], world? }` or `null` for rest. |
| `T.layer(name)`, `T.stack([…])` | Live layers and the full stack of live and static layer names, back to front. |
| `T.build({ statics, poses, verify = false, strict = true })` | Solves every pair, proves every static item's layer, packs the page data. `poses` is the figure's reachable states (a list or a function returning one): every motion clip, sampled. Throws a readable error on any pair with no separating plane, any static that can't be proved, any non-convex part. `strict: false` keeps interlocked pairs (so a planted fault reaches the audit). |

`T.build` returns `out = { svg, data, css, report, layerSvg(name, { width, height }), verify }`. `out.data` goes to the page (`DATA.turn`). `out.report` has `parts`, `layers` (per layer: `planar`, `framed`, `dynamic`, `skip` counts), `tight`, `margins`, `proofs`, `seconds`.

###### Constructors
Common options on every constructor: `{ name, group, layer, tone = "hi", crease = "faint", lit = false, material, owner, details = {} }`.

| Constructor | Part |
|---|---|
| `T.prism({ plan, z, h, steps, bevel })` | An upright kit slab (the kit `extrude` rule). |
| `T.prism({ F, polygon, s0, s1, round = 0, steps = 4, bevel = 0 })` | A convex polygon in frame `F = { o, a, u, v }` extruded along `F.a` from `s0` to `s1`, any axis (the `prismOf` rule). |
| `T.round({ F, s0, s1, r \| [r0, r1], ends = ["flat", "flat"], fixed })` | Cylinder or cone frustum; each end `"flat"`, `"dome"` (radius must equal the side's: a capsule) or `"open"`. One dome and one flat end is a half-capsule, and any length works, even one shorter than the radius (a nose cone on a motor can). A vertical round in an upright group becomes a `fixed` picture automatically (`fixed: false` stops it). |
| `T.lathe({ F, profile, slope, radius })` | A general convex smooth body (r(s) concave). Costly; prefer rounds. |
| `T.ball({ c, r, flats: [{ n, d }] })` | A sphere; each flat keeps n·(p − c) ≤ d and draws its rim as a cap, so `n` is the flat's outward normal. Without flats it is a `fixed` picture, and it takes no `details`. It is the costliest kind to draw (section 15). |
| `T.tube({ route, r, chunk = 6, turn = 20, gaps, breaks, caps, rings, hue, material, bundle, owner, touch })` | The kit `tubePieces` semantics, chunked; `hue` is `"red" \| "green" \| "blue"`; records `R.route`. The route runs from mount surface to mount surface. The port, gland or clamp at each end is a separate part with `owner` set to the tube's name, and its span along the route goes in `gaps`. A route that starts at a port's outer face fails `terminals` in the kit audit (below). |
| `T.fixed({ svg, anchor, shapes, hull, F })` | Any kit markup whose picture never changes under the group's motion, moved by `translate`. |
| `T.plane({ part, o, u, v, svg, fade = [0.04, 0.3], normal })` | Line or text markup in a plane of the part (ticks, numerals, label plates), placed by one matrix, faded by facing. |
| `T.billboard({ part, at, normal, svg, fade })` | Screen-aligned markup at a projected point (an SVG fallback for a shader glow), faded by facing. `svg` is in viewBox px centred on the projected point, not in world units: multiply world sizes by `G.scaleOf(P)` (`<circle r="${(1.1 * G.scaleOf(P)).toFixed(2)}"/>` fills a lens of radius 1.1). |
| `T.split(part, { n, d })` | Two parts cut by the plane (prism: any plane through it along or across the axis; round: across). The cut edges are not stroked. Use it to break a genuine cycle. |

###### Details (in the part's frame: `s` along the axis, `x` and `y` in `u` and `v`)
Each constructor has its own frame and takes its own detail kinds. Anything else is ignored without a warning.

| Constructor | Frame `[s, x, y]` | Takes |
|---|---|---|
| `T.round`, `T.lathe` | `F`: `s` along `F.a`, `x` along `F.u`, `y` along `F.v` | `seams`, `ribs`, `bolts`, `dots`, `rings`, `rules` |
| `T.prism({ F, polygon })` | `F` | `dots`, `seams`, `bevel` |
| `T.prism({ plan, z, h })` | The world: `s` is z, `x` and `y` are world x and y | `dots`, `seams` (z values), `bevel` |
| `T.ball` with flats | Origin `c`, `a` = the first flat's `n`, `u` and `v` from `G.frameAlong(c, n)`. The flat is at `s = d` and the far pole at `s = −r` | `bolts`, `dots`, `rings`, `rules` |
| `T.ball` without flats | None: a fixed picture | Nothing |
| `T.fixed({ F })` | `F` (no `F`: no details) | `bolts`, `dots`, `rings`, `rules` |

A centre dot on a domed spinner `T.ball({ c, r: 4.5, flats: [{ n: [-1, 0, 0], d: 0 }] })` (the flat faces −x, the dome +x) sits at `at: [-4.5, 0, 0], normal: [1, 0, 0]`: `s = −r` is the pole. `[4.5, 0, 0]` would land 4.5 behind the flat, inside whatever the spinner is mounted on. For a ring or a rule on a prism face, use `T.plane`.
```js
details: {
  seams: [s…],                                              // rings on rounds, ring seams on prisms
  ribs: { s0, s1, count, phase, twist, fade: [0.1, 0.55], seams: true, tone },   // knurl rows on rounds
  bolts: [{ s, r, count, phase, size: 0.5, tone: "mid", fade: [0.04, 0.42] }],   // bolt circles
  dots: [{ at: [s, x, y], normal, size, tone }],
  rings: [{ at: [s, x, y], normal, r, tone }],              // become planes
  rules: [{ points: [[s, x, y]…], tone, free }],            // become planes
  bevel: 0.4…1.6,                                           // prism cap bevel (faded slots)
}
```
Every detail fades with facing: dots and bolts by `smoothstep(0.04, 0.42, n·V)`, ribs per rib, bevel lines per edge, planes on the group's opacity. No texture stops at full strength.

###### Runtime (`kit/turn.mjs`, inlined with `turnScript()`)
| Call | What it does |
|---|---|
| `TURN.mount(stage, data, { onHold, onFrame, follow })` | Binds every live layer in `stage`, renders the rest pose, installs `window.__isoTurn`. `follow(values)` maps figure values to group values on every `set` (one input drives coupled groups). `onFrame(controller)` runs after each render (draw shaders here). `onHold()` runs when a tool calls the hook. |
| `controller.set(values \| θ, { detail })` | Sets group values (a number sets the first turn group), renders synchronously, returns stats. `detail` (0…1) scales faded lines, ribs and dots (section 15). |
| `controller.angleAt(clientX, clientY, z, group)` | The pointer as an unwrapped angle about the group's pivot on the plane at height `z` (drag a dial). |
| `controller.pose(name)` | The group's world pose `{ R, t }`. |
| `controller.detach(name)` | The `{ world: true, R, t }` value that continues a free group's current pose in the world frame (no jump). |
| `controller.anchor(group, restPoint, restDir?)` | Where a rest-world point (and direction) of a group is now: `{ world, screen, direction }`. Spark sources, flame roots, LED positions. |
| `controller.cover(names, options)`, `order(layer)`, `orderIndex(layer)`, `events()`, `stats()`, `frames()`, `cams()`, `scene()`, `values`, `destroy()` | Cover masks (section 12), paint order, order-change events, `{ ms, writes, moved, forced, refined, unseparated, emitted }`. |
| `TURN.cover(controller, names \| [names, names…], { polygons = 6, edges = 10, pad = 0.3, layers })` | `{ uCoverEdge, uCoverCount, dropped, parts }` for `coverOf`. |
| `TURN.poseUniforms(controller, group, prefix = "uGroup")` | `{ prefixX, prefixY, prefixZ, prefixT }` such that `toGroup(p)` gives the group's **rest-world** coordinates. |
| `TURN.materials`, `TURN.materialCss()` | The material names; the material CSS alone (it is already in `TURN_CSS`). |
| `TURN.exact(on)` | Write path coordinates unrounded (6 decimals) instead of to 0.01 px. The orbit audit turns it on for the continuity line; a page never needs it. |
| `TURN.rotation(axis, degrees)`, `TURN.quat(q)`, `TURN.compose(A, B)` | 3×3 rotations as arrays, for free poses. |
| `TURN.floorOf(scene, group, R)` | The lowest z of a group's parts under rotation `R` (relative to its origin): to set a piece down flush. |
| `window.__isoTurn` | `{ controller, set, get, order, events, stats, layers }`; every call holds the figure (`onHold`). `set` takes a number or a values object. |

##### 5. Part kinds and the rules that keep them true

These are binding; the build and the audit fail without them.
- **Convex parts only.** A stepped dial is tiers; a notched wheel is a hub disc plus rim sectors; a U-bracket is three prisms; a hand's shell is plates. `T.prism` checks its polygon, `T.lathe` its profile.
- **Contacts are flush, tangent or rim-on-flat.** A rim on a sphere is not separable: give the ball a flat (`T.ball({ flats })`) and land the rim on it. A pad sunk into its host is not allowed in a live layer (`separation` fails with `interlock A × B −0.6`).
- **Joints.** The two links stay at least 0.2 apart, and the joint is bridged by a knuckle disc on the child group: coaxial with the hinge axis, and touching the parent's link, flush or tangent. A disc coaxial with its hinge (or any flat face turning in its own plane) is invariant under the hinge, so it never collides, and it is the contact the kit audit needs. With nothing in the child group touching the parent, `rigid` reports every part of the child group as `support loose`. Links meeting at a joint share one radius; dome centres sit the same distance from the joint so the gap holds at any angle (two domes of radius r at distance c from the joint stay apart while cos(β/2) ≥ r/c). A trunnion on a yoke:
  ```js
  T.round({ name: "yaw.arm+", group: yaw, layer, F: VERT(0, 11.7), s0: 40, s1: 61, r: 1 });
  T.round({ name: "head.can", group: tilt, layer, F: frameOf([0, 0, 56], [1, 0, 0], [0, 0, 1]), s0: -12, s1: 8, r: 9 });
  T.round({ name: "head.trunnion+", group: tilt, layer, F: frameOf([0, 9, 56], [0, 1, 0], [0, 0, 1]), s0: 0, s1: 1.7, r: 4.5 });
  ```
  `tilt` hinges about y through `[0, 0, 56]`. The can reaches y = 9 and the arm starts at y = 10.7, so the links are 1.7 apart. The trunnion runs from 9 to 10.7: it sits on the can and its end face is tangent to the arm. Ending it at 10.5, with a 0.2 gap to the arm, fails `rigid` for the whole head.
- **No live line spans two moving groups.** A cable or hose crossing a flexing joint is two routes ending in a clip or port on each side of the joint, or crosses at the hinge axis through a rotary union (banjo). A cable that must reach a turning part from static ground goes up the axis through a slip ring at the hub (section 11).
- **Tubes bend nearly flat or inside fittings.** A bend of radius R in a plane tilted θ from horizontal, toward the viewer, is an ellipse on screen whose tightest radius is R·sin²(e − θ) (in world units; × `G.scaleOf(P)` for px). `folds` fails a bend that turns more than 90° on screen round less than 2r, and `self` one under r. So a bend needs **R ≥ 2r / sin²(e − θmax)**, where θmax is the plane's own tilt plus the pitch range of every hinge it rides on (a turn group sweeps the tilt through every azimuth, so the worst case always comes round). At e = 30°:

  | θmax | 0° | 5° | 8° | 10° | 12° | 15° | 20° |
  |---|---|---|---|---|---|---|---|
  | R ≥ | 8r | 11r | 14r | 17r | 21r | 30r | 66r |

  8r is the bound itself on a horizontal plane, not a margin: take 10r. Past about 15° no practical radius holds, so turn inside a fitting (clip block, banjo, elbow ball, a junction box) or run the line straight. Draw bends with `G.fillet(points, R)`, never the view-dependent fillet. The audit's `folds` and `self` run at every angle and pose.
- **Tubes never point along the view.** A tube's tangent elevation stays out of 15°–45° and −45°–−15° at e = 30° (`endon`), in every pose: on a hinge chain, check the link's pitch range too (a cable on a link that flexes 30° will fail).
- **Lathes are the one kind with small residual steps** (≤ 2.5 tone·px² where a band changes topology). Prefer rounds, domes and balls with flats for live parts.

##### 6. Materials

A part's material is one option on its constructor (`material: "gold"`). Tones still come from facing exactly as the kit's do; a material remaps the ramp (the four shades, the top, paper, outline and line tones, dots and the tube body, shine and shade), with a light and a dark set each.

| Material | Look |
|---|---|
| `gold` | Champagne-gold anodised aluminium: warm pale top, bronze shadows, dark bronze outline. |
| `chrome` | Bright polished steel: a light far band, a dark reflection band (n·L 0.2–0.42) next to a bright band and a white highlight. Non-monotonic on purpose: the bands move with facing, never jump. |
| `steel` | Satin steel, monotonic and cool. |
| `gunmetal` | Dark blue-grey metal with light dots. |
| `rubber` | Black rubber and cable sheath with a soft sheen. With `hue`, a tube becomes a coloured sheath (the hue mixed into the rubber ramp). |
| `brass`, `copper` | Warm metals for fittings, ports, valves. |

Static parts use the same families as plain classes: wrap kit markup in `<g data-mat="brass">…</g>` (the example's index wedge). The rules live in `TURN_CSS`; a page with static art only can include `TURN.materialCss()`. A dark plate inside a light page picks the dark set (`.iso[data-theme="dark"] [data-mat]` is ordered last).

On a light page a material figure is far stronger than kit greys: keep the ground (bench, base, plates) in kit tones and put materials on the subject, so it reads as the lit, finished object.

##### 7. Free groups: parts that break off

`T.group("pod", { parent: dial, free: { origin } })` makes a rigid body whose pose the figure sets every frame. At rest (`null`) it sits exactly where it was built, attached: the parent carries it. To break it off, start setting a pose relative to the parent: there is no single-frame change because the first value is the identity.
- **Falling onto the turntable**: keep the parent as the turntable group, so the piece lands and then turns with it. Compute the flight as a pure function of time (`breakAt(t)` in the example: a somersault about the centroid, a ballistic arc, a flush landing found with `TURN.floorOf`, a decaying slide and yaw). A pure function can be sampled by the build and the audit, and played backwards.
- **Falling off onto the bench**: switch to world space with `controller.detach(name)`, which returns `{ world: true, R, t }` continuing the current pose, then integrate from there.
- **Order**: a free group's parts are paired at runtime with every part of their layer (by screen box, then a GJK plane cached per relative pose); intra-group pairs are planar. Cycles among free parts are possible in principle; the audit samples the clips and reports them.
- **Proof**: give the build the clips in `poses()` (every frame of the break at several turn angles), and the audit the same clips (`clips`). The audit poses every shape in every clip frame and checks clearances against live and static parts (`posed`), order, cycles and continuity.

##### 8. Hinge chains: hands and fingers

Each link is a hinge group whose parent is the previous link (`T.group("f0.j1", { parent: f0j0, hinge: { point: J1, axis: w, range } })`). A wrist is a hinge carrying the palm; a thumb base is a hinge (vertical axis) carrying the thumb chain. Drive the chain from one figure value through `follow` (`lift` → three angles).
- Pairs on different links are solved at build where possible: a pair whose swept volumes over the build's `poses()` have a plane in their common ancestor's frame with margin ≥ 0.1 becomes a **framed** plane (no runtime GJK). Only near-joint pairs stay dynamic (GJK, warm-started, cached while the two groups keep their relative pose). So `poses()` must cover the motion: if a gesture leaves the sampled range, the audit's `unseparated` line names the pair ("framed plane: … add it to poses()").
- Keep ranges physical and small: a three-link finger at ±5° per joint already reads as a hand moving; 20° per joint needs every route and contact re-proved.
- **A route on a hinged link carries the link's pitch range.** Section 5's `endon` rule and its bend bound both use the tilt the line can reach, not the tilt at rest: a horizontal 90° bend at R = 8.6r (inside the 8r rule for a flat plane) on a ±12° hinge fails `folds` and `self`, because at 12° of pitch it needs 21r. Make the line straight into a junction box, or move the bend to the parent.

##### 9. Painter's order and why it is correct

Every pair of parts that can overlap on screen gets one relation: a plane fixed in their shared group (planar), a plane fixed in their common ancestor's frame (framed), a GJK plane each frame (dynamic, different groups that move relative to each other) or a skip (neighbouring chunks of one route). B is in front of A when n·V > 0 in that frame. Order is a stable Kahn sort keyed by the previous frame's order; on a stall, edges between parts whose exact screen hulls are apart (or touch within 0.1 px) are dropped; a remaining stall is a forced pick, counted and made fatal by the audit.

Correct because two disjoint convex solids whose projections overlap are both hit by some view ray, and a separating plane crosses that ray once. Flicker-free because a plane's relation flips only when the plane is edge-on, and then the two footprints lie on opposite sides of a line: swapping them changes no pixel. Edge-on relations (|n·V| < 1e-7) add no edge.

##### 10. Shading and fades

- Flat faces (prism sides, caps, ball flats) use the kit's thresholds (`EB` for upright prisms, `LB` otherwise) through a smoothed staircase: a face holds the kit tone except within ±0.035 of a threshold, where it crossfades in 64 steps per band (`data-q`, 0…256). That fine step keeps chrome's high-contrast bands smooth.
- **The continuity line measures the unrounded geometry.** The page writes path coordinates rounded to 0.01 px, which moves an edge by at most 0.005 px, far below a device pixel. Measured on those rounded paths, a long edge's rounding steps never shrink, so the halving test once read large flat faces (the example's palm, a desk fan's 21-tall prism arms) as jumps that were not there. `orbit` therefore switches the runtime to exact coordinates (`TURN.exact(true)`) for the continuity line and back afterwards; large flat faces are fine on turning groups.
- Curved surfaces always use analytic iso-light bands (`labelledArcs`), never facets. Capsule domes are nested hulls; balls with flats are clipped caps. Bands are born at zero width.
- Faded-line slots hold ribs and bevels: alphas quantised to 1/32, as many slots as the build's orbit sweep shows a set needs.
- `lit: true` uses the lit tokens; with a material, the material's lit set.

##### 11. Static layers and a messy workshop around a turntable

Every static item carries `layer` (`R.put({ …, layer: "back" })`) and the build proves a constant relation with every live layer over all reachable states, by the first rule that holds: a **horizontal plane** (the item is wholly under or over the layer's z range), the **cylinder rule** (the item lies wholly behind or in front of the turn group's swept cylinder along the view's floor direction), **never overlap** on screen, or a **swept-envelope plane**. Otherwise: `static S interleaves live layer Λ: split S at z = …, or move it`.

Authoring rules for a dense workshop (`examples/turning-dial/stress.mjs` proves 450 relations: bench, turntable base, power unit, tool rack, cable reel, tray, wrench, three bench cables):
- **Keep clutter outside the swept cylinder or under the turntable plane.** Tall things (power units, racks, lamps) go behind or in front of the cylinder of radius R (the live layer's reach from the axis) along the view's floor direction (cos a, sin a). Things beside it, neither behind nor in front, must be low.
- **Anything under the turntable's lowest live z is behind the live layer, even when it sits in front on the bench.** It belongs in a layer under the live one (`back`), not `front`: the build says so.
- **A cable that must reach the turning part** runs on the bench to the stationary base, climbs inside it and reaches the turning part through a slip ring or rotary joint at the hub. Draw the static run to a port on the base, and start the live cables from a terminal block on the turning platter. No route ever spans static ground and a turning group.
- Static cables lie flat on the bench (bends in the bench plane, R ≥ 8r) so they never fold, and end on a port, a reel or a free end marked `free`. A cable resting on the bench (centre at bench top + r) touches it, which the kit's `clearance` check fails (`close stand.feed × stand.bench clearance 0.00 < 0.40`) unless the route says so: `R.route(name, route, r, { owner: name, limp: true, touch: ["stand.bench"] })`.
- `stress.mjs` is a performance and layer-proof scene, not an audit-clean one: its bench cables have no `touch` and its hand has loose links, so the kit audit fails it. Copy authoring patterns from `build.mjs`.

##### 12. Shaders that follow the turn and the groups

`kit/gl.mjs` gains (both opt-in; old fragments see nothing new):
- `GLSL_TURN`: `uGroupX/Y/Z/T`, `toGroup(p)`, `toWorld(g)`, `dirToGroup(d)`, `dirToWorld(d)`, and the cover masks `uCoverEdge[60]`, `uCoverCount[6]`, `coverOf(vb, soft)`.
- `glslPose(Name, prefix = "uName")`: the same four functions for any group (`toDial`, `fromDial`, `dirToDial`, `dirFromDial`), so one shader can follow several groups.
- `glLayer` sends arrays longer than 4 to `vec2`/`vec3`/`vec4` uniform arrays by their declared type (float arrays unchanged).

How a shader follows the motion:
1. **Content on a moving part** (an LED on a fingertip, a flame from a ruptured line's end, oil jetting from a pipe end): take the anchor every frame with `controller.anchor(group, restPoint, restDir)` and pass `world`, `screen` and `direction` as uniforms. Draw it on the **front canvas** (over the live layer) and occlude it with the parts painted after it: `const c = TURN.cover(controller, [partName]); layer.draw({ ...c, … })` and `ink *= 1. - coverOf(vb, .7 * px)`. Every live part is convex, so its hull is its exact silhouette; the cover is pushed out 0.3 vb so ink stops at the occluder's stroke, never in it. Several targets share the six polygons: `TURN.cover(controller, [["hand.f2.p3"], ["hand.pod.socket"]])`.
2. **Content fixed to a turning surface** (oil pooling on the turntable, a texture revealed by light on a dial): pass `TURN.poseUniforms(controller, "dial", "uDial")` and evaluate in rest-world coordinates: `vec3 q = toDial(onFloor(vb, FACE_Z));` The pool turns with the dial.
3. **Content in world space** (smoke rising, sparks after they leave the source, oil pooling on the bench outside the turntable): never touch a group transform. Emit particles from an anchor's world position at birth and integrate them in world space (the example's sparks): the turn doesn't drag them along.
4. **Back canvas** (light falling on a surface under the parts that cover it): put the canvas between two live layers. The example splits its dial into its own live layer `dial` under `hand`, so the LED's pool lands on the dial face and the hand covers it with no masks at all.

Every rule of `webgl.md` still holds: envelopes, windows to 0 before any bound, light-theme inks (saturated bodies, pale cores, tinted ground, ink only grows with light), dither, canvas edges at 0, an SVG fallback (`T.billboard` inside the owning part, hidden under `[data-gl]`, handed over with `(1 − u)/(1 − u·α)`). The cover chunk uses 70 uniform vectors: read `MAX_FRAGMENT_UNIFORM_VECTORS` and keep the SVG fallback below 128. `GLSL_TURN` defines `toWorld`: don't prepend it to a fragment that declares its own.

##### 13. The orbit audit

`node build.mjs --audit` runs the kit audit, then `TA.orbitOrExit(T, R, P, options)`, which prints one line per check and ends `turn audit passed` or `turn audit failed: n problems` (exit 1). Only a full run ends `turn audit passed`: a run with `only` ends `turn audit partial: no problems in what ran (n lines skipped by only)`, and a quick one `turn audit quick: no problems in what ran (quick run, undersampled: the full run is the proof)`.

Options: `sweep: { at(x), from, to, frame }` (the turn), `clips: [{ name, at(t), from, to, frame }]` (gestures, the break-apart: every frame at 60 fps), `poses` (extra states), `crowd: [[route, part]…]` (pairs exempt from `crowding`, after you have looked), `cover`, `fittings: [[route, from, to]]` (stretches inside a fitting, exempt from `endon`), `quick` (≈ 10× fewer states, for iteration), `only: ["order", "rigid", "swept", "posed", "routes", "coverage", "continuity", "depth"]` (an unknown name throws), `log`. The example takes `--quick`, `--only=a,b` and `--verbose`. `only` runs these lines: `order` → `unseparated`, `cycles`, `forced`, `swaps`; `routes` → `folds`, `self`, `crowding`, `endon`; `depth` → `depth`, `layers`; the others their own line. `separation` always runs. A line that did not run prints `skipped`.

**Time and how to iterate.** The orbit audit is slow, and its time grows with parts × states. Measured on a 28-part desk fan (one turn, one hinge, one clip): `--quick` 85 s, full 17 minutes. The example scene takes several minutes; budget about 30–40 s per part for a full run. That is past a 10-minute shell timeout, so:
1. Iterate with `--quick --only=…` on the lines you are fixing.
2. `--quick` alone before the final run. It undersamples: it checked 100 halving candidates against 800 in the full run and missed 20 `continuity` failures the full run found.
3. The final full run in the background (`node build.mjs --audit > audit.txt 2>&1 &`), read when it ends. Only that run's `turn audit passed` counts.

| Line | Fails on | Fix |
|---|---|---|
| `separation` | A same-group pair with no plane (margin < −0.08) | Split, a flat, or a flush contact |
| `unseparated` | A cross-group pair interpenetrating while their hulls overlap; a framed plane that a state breaks | Fix the contact or the motion; add the motion to `poses()` |
| `cycles` | A cycle among overlapping parts in some state; prints the parts, the state range and the split plane (the cycle edge with the largest margin) | `T.split` that part on that plane |
| `forced` | The runtime had to force a pick | As cycles |
| `swaps` | Two overlapping parts swap order while overlapping more than 0.25 px² (0.5 px² for a pair built flush, margin under 0.05: at the instant their contact plane is edge-on, the true overlap is a line, and the drawn curves leave a sliver about 0.1 px wide) | Look first: `drive.mjs page.html '[["orbit", "swap.png", θ−0.3, θ+0.2, 0.1, null, 6, [x, y, w, h]]]'` (θ from the line; the region round the pair in CSS px of the plate, at scale 6). Something that appears or vanishes in one step is a drawing bug, not an order bug. Engines before 2026-10-06 drew a round with one `"dome"` end shorter than its radius with a wedge behind its flat end, which vanished when that end went edge-on: copy the current `turn.mjs`. A clean swap with sane order on both sides (`__isoTurn.order`) is a wrong plane: report it with the part pair and θ |
| `layers` | A static item on the wrong side of a live part (ray-cast) | Move it or split it (section 11) |
| `rigid` | Kit clearances, terminals, supports, solid clearances at rest | As in the kit audit. `support loose` on every part of a hinged group: nothing in it touches the parent (the knuckle disc, section 5). `terminal … from X`: the route starts at a port's face, not the mount (the `T.tube` row, section 4). `clearance … × stand.bench`: a bench cable without `touch` (section 11) |
| `swept` | A static shape inside a turn group's swept envelope | Move it out of the cylinder |
| `posed` | Shapes of different groups (and moving live × static) passing through each other in any sampled state | The motion or the geometry |
| `folds`, `self`, `endon` | Live routes at every angle and posed state | Section 5 (bend radius with the pitch range, section 8) |
| `crowding` | A live route's end or bend lands on the outline of a slender solid (a rod, post, stem) at some angle | A line parallel to a turning rod crosses the rod's outline at some angle whatever its offset, so you can't design it out. Look at the angles it names (`["turn", θ]` and a 4× shot), and if it reads as two separate parts, list the pair in `crowd: [["cable.a", "yaw.stem"]]`, or route the line inside the rod. A line that is not parallel: approach across the rod |
| `coverage` | A part's recorded shape covers < 60% of its drawing | Record the true shape |
| `depth` | The ray-cast oracle disagrees with the engine order | Report it |
| `continuity` | Per 0.05°: tone step > 1/16 band, a birth > 2 px², a dot α step > 0.01, a faded α step > 1/32 + 0.005, outline motion over 1.5·ω·Δθ + 0.05 px; and the halving test | A detail that stops: fade it. A part whose outline or face boundary jumps in one step: find the angle with an orbit sheet at 0.1°; on a plain kit primitive it is an engine bug, report it with the part and θ. `--quick` undersamples: only the full run counts |

The halving test re-emits each candidate step at ½, ¼ and ⅛ of itself with exact coordinates, rasterises the frames at 4× (jittered samples on 8 sub-scanlines) and measures the pixels that change owner, weighted by tone. A smooth change halves with the step; a jump doesn't. A step is a discontinuity when it stays above 60% at each halving and is still ≥ 2 tone·px² at ⅛, measured at 4× and again at 16×: a step that fails at 4× fails only if it also fails at 16×. Measured on the page's rounded paths instead, every long edge keeps a floor of about its length × 0.01 px that never shrinks; that floor is what flagged large flat faces before the switch to exact coordinates. Every line has a planted fault that fails it (`3d/engine/plants.mjs` in the build session: a sunk pad, a pinwheel of three tilted sticks, a vertical-plane fibre bend, a tube at 30°, a stopped rib row).

##### 14. Browser checks

```sh
node examples/turning-dial/build.mjs --light --verify           # writes turning-dial-verify-light.html
node scripts/turn-check.mjs examples/turning-dial/build.mjs --fidelity
node scripts/turn-check.mjs page-verify.html --order --step 1
node scripts/turn-check.mjs page-verify.html --order --states clip.json
node scripts/turn-check.mjs page.html --pops --no-webgl --step 1 --out shots/pops
node scripts/turn-check.mjs page.html --lines                    # and the dark page
node scripts/turn-check.mjs page.html --perf --width 1440
node scripts/turn-check.mjs page.html --perf --width 390 --throttle 4
node scripts/turn-bench.mjs examples/turning-dial/build.mjs
node scripts/drive.mjs page.html '[["turn", 37], ["shot", "a.png"], ["orbit", "orbit.png", 0, 345, 15]]'
```
- `--fidelity` (Node): prisms against `k.extrude`/`G.prismOf` (outline, top and faces each ≤ 0.06 px), rounds and lathes against `G.lathe(…, smooth)` (outline ≤ 0.05 px against the kit drawn at 10×, bands ≤ 0.5 px; the line also prints the outline against the kit's own paths, which round to 0.1 px, so 0.08–0.13 px there is expected and not judged), tubes against `tubePieces` (0.05 px), at P′(θ). Control: one prism drawn 2° off must fail.
- `--order`: the recorded shapes in a WebGL z-buffer against the DOM painter's fills, 2×; a live pair with 4+ interior pixels fails. Control: each live layer reversed must give ≥ 1000 px. Static × live mismatches are listed (static recorded shapes are often stand-ins, such as a slab for a plate with a window). `--part name` prints a part's footprint in both images. `--step` sweeps the **first turn group only**, with every other group at rest: a hinge, a slide or a clip needs `--states`.
- `--pops`: first difference (θ → θ + 0.02°, two erosions) and second difference (0.1°, |2b − a − c| > 56, or > 6 on flat pixels, one erosion; a core of 6 px fails). Control: the largest part hidden for one frame. `--out dir` saves the first core's frames. With `--states`, consecutive entries are treated as neighbouring frames and only the first difference runs, so the list must be **one continuous path in steps of about 0.02°**: 529 unrelated yaw × tilt poses gave 404 false failures; a tilt sweep of 1201 states at 0.02° gave 0.
- `--states file.json`: a list of value objects instead of angles. Write them from the build module, which exports `follow` and the clip functions:
  ```js
  import { writeFileSync } from "node:fs";
  import { follow, nodAt } from "./build.mjs";
  const at = (t) => follow({ yaw: 20 + 30 * t, tilt: nodAt(t) });
  writeFileSync("clip.json", JSON.stringify(Array.from({ length: 241 }, (_, i) => at(i / 60))));
  writeFileSync("tilt-path.json", JSON.stringify(Array.from({ length: 1201 }, (_, i) => follow({ yaw: 30, tilt: -12 + i * 0.02 }))));
  ```
  `clip.json` (every 60 fps frame of the clip) is for `--order`; `tilt-path.json` (one hinge swept at 0.02°) is for `--pops`. Run `--pops` on one path per hinge, at a turn angle where the hinge's parts overlap the most.

##### 15. Performance

Measured by `turn-bench` (Node CPU) and `turn-check --perf` (browser, 240 frames at 1.1°).

**What a part costs.** `turn-bench` prints the Node time per part by kind. In prism units (one live prism, about 0.03–0.04 ms per frame on the build machine):

| Kind | Cost | Kind | Cost |
|---|---|---|---|
| `fixed` (vertical rounds, plain balls) | 0.5 | `round` | 2.5–4 |
| `prism` | 1 | `ball` with flats | 8–10 |
| tube chunk | 2–3 | `lathe` | about 25 |

A figure's weight is the sum. A **small figure** weighs up to about 50 (a few dozen parts, mostly prisms and fixed pictures); a **dense** one up to about 230. The desk fan (28 parts: 6 prisms, 7 fixed, 5 tube chunks, 8 rounds, 2 balls with flats) weighs about 65, and measured 1.6–1.9 ms of Node CPU per frame and a 6.0 ms browser task at 1440, so it is over the small-figure line, mostly because of its two balls. The turning dial (88 parts, 42 rounds, one lathe) weighs about 225 and measures 6.4–7.2 ms. A ball with flats is the right part for a domed end with a rim landing on it (section 5), but it costs as much as nine prisms; a plain ball or a vertical round is a fixed picture and nearly free. Times vary by machine and load: compare kinds within one run, and measure your own figure.

| Measure | Budget for a small figure (weight ≤ 50) | Budget for a dense figure (weight ≤ 230) |
|---|---|---|
| Node CPU per frame | ≤ 2 ms | ≤ 7 ms |
| Browser main-thread task at 1440, DPR 2 | ≤ 6 ms | ≤ 13 ms (60 fps) |
| Main thread at 390, DPR 3, 4× CPU | ≤ 16 ms | ≤ 33 ms (30 fps) |
| `data.turn` JSON | | ≤ 250 KB |

Levers, in order:
1. `fixed` for every vertical-axis turned part and every plain sphere (automatic).
2. Planes for every set of lines or text on a face; upright prism tops are one matrix.
3. Small parts sample by device pixels: rings, caps and domes of a part under 30 px round take 12–16 samples, never the large-part minimums.
4. **Framed planes and the relative-pose cache** (automatic): cross-group pairs cost nothing while their groups keep their relative pose (a pure turntable turn), and pairs whose motion the build sampled are framed planes.
5. **Adaptive half rate** (the figure's loop): keep an exponential moving average of `controller.set(...)` time; above 14 ms render the live layers on alternate frames (time-based motion unchanged), below 9 ms every frame again (`stress.mjs`'s loop).
6. **Detail by speed** (opt-in): `controller.set(values, { detail })` with `detail = settle(1 − smoothstep(120, 240, |ω|°/s), 0.25 s)`: faded lines, ribs and dots scale and are skipped below 0.01. Outlines and tones are never reduced.

Authoring rules that keep a figure inside budget: about 150–250 live parts per moving group; small details as `details` (dots, rings, bolts) rather than parts; static clutter as static art; one live layer per independently moving region; tubes chunked at 6 with as few chunks as the bends allow. The measured numbers for the example and the stress scene are in the skill's build notes; a 380-part flexing hand on this machine is a 30 fps figure at 1440 with the half-rate lever, not a 60 fps one.

##### 16. Known limits

- Vertical turn axes take the azimuth shortcut; other rotations compose matrices.
- Only convex parts. Concave bodies are convex pieces; ball flats replace rim-on-sphere joints.
- Live tubes obey the fold and end-on rules: there are no swept-tube silhouettes, so turns happen flat or in fittings, and no route spans two moving groups.
- No automatic splitting: a cycle is an audit failure with a suggested plane.
- Flat faces crossfade over ±0.035 of score (about 8° of turn).
- Lathes keep small residual steps where a band changes topology.
- Free groups pair at runtime with their whole layer; dozens of debris pieces cost GJK while they move.
- Phones: the budget aims at 30 fps, not 60, and only a figure inside it gets there. The 380-part stress scene (`examples/turning-dial/stress.mjs`) measured about 20 fps at 1440 and 13–15 fps at 390 with 4× CPU throttle, with the half-rate lever, on a heavily loaded machine. There is no canvas painter.

## Appendix D — Not inlined (size budget), read from source when needed
- [`references/kit.md`](https://github.com/wheresryan22/anatomy/blob/1482e84/references/kit.md)
- [`references/motion.md`](https://github.com/wheresryan22/anatomy/blob/1482e84/references/motion.md)
- [`references/print.md`](https://github.com/wheresryan22/anatomy/blob/1482e84/references/print.md)
- [`references/publish.md`](https://github.com/wheresryan22/anatomy/blob/1482e84/references/publish.md)
- [`references/react.md`](https://github.com/wheresryan22/anatomy/blob/1482e84/references/react.md)
- [`references/webgl.md`](https://github.com/wheresryan22/anatomy/blob/1482e84/references/webgl.md)

---
**Source & credit:** [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) @ `1482e84` (cloned 2026-11-22). License: MIT. All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
