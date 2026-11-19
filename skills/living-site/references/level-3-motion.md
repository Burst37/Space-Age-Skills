# Level 3: living Claude motion graphics

Level 3 is drawn by Claude in code (SVG, canvas, CSS). It lives in the page and never stops breathing.
It is the cheapest level (no credits) and the one that makes a site feel made by a studio.

## The test
Write the story in one sentence before you draw anything:
- "You speak, a packet rides the wire into Glaido, the ums fall away, the clean prompt rides on to Claude Code,
  which ticks off a three-step plan, then the next app takes a turn."
- "A fruit ripens and is picked, rides the line into a splash, a blender, a bottle that fills and gets its cap."
- "A tiny robot face rides a day dial, each job card ticks as it passes, the clock reads the time."
If the sentence fits any company, it is decoration. If it is true only for this product, build it.

## The Claude motion language
- **Cards** with soft depth (a white card, a 1 px edge, a long soft shadow). Rounded 14 to 24 px.
- **Wires draw themselves** (`stroke-dasharray: 1; pathLength: 1`, animate the dash offset to 0).
- **A packet rides the wire** (`getPointAtLength`), with a faint larger dot as its trail.
- **The node pulses** when the packet lands: card scale 1 to 1.05 and back, a ring that grows and fades.
- **A tick draws itself** in a filled circle, with a little overshoot.
- **The next round** starts while the last one settles. Different parts act at different times.
- **The island:** a white panel with a 38 px dot grid (rgb 226 226 232), navy ink #14213D, one accent.
  Inside a dark page it reads like a product shot. Inside a light page, drop the island and keep the language.
- **The real Claude spark** in its clay colour, never redrawn or recoloured, and only where Claude is really in the
  story. On a juice brand it does not belong.

## Choreography
- Start empty. At about 30% visible (IntersectionObserver, never a raw scroll listener), build in once: things rise
  10 to 24 px and come into focus from a 4 to 6 px blur, 30 to 90 ms apart, in reading order. Lines and bars draw
  from zero; objects never scale up from zero (start at 0.85 to 0.9).
- Then loop forever. Something visibly changes every 1 to 2 seconds. A loop of 12 to 18 seconds feels calm.
- Pause the clock when the section leaves the screen; resume where it was.
- Reduced motion and the Off switch show the finished still: everything ticked, the best frame.
- Easing: entrances `cubic-bezier(.16,1,.3,1)` about 1 s; fades and blur `cubic-bezier(.33,1,.68,1)` about 0.75 s;
  travel `cubic-bezier(.65,0,.35,1)`. Linear only for constant motion (a marquee, a spin).
- Animate only transform, opacity, filter, clip-path and stroke-dashoffset. Blur 14 px at most.
- At most 6 words inside the graphic at once. Labels are one or two words. The content being typed may be longer.

## Pieces that tested well, and why
| Piece | Why it landed |
|---|---|
| Voice to Glaido to Claude Code pipeline on a white island | Shows the product's real job in one glance |
| The "ums disappear" editor: filler words light up and fall away, the rest snap into one sentence | One tactile moment the viewer can feel |
| Hub ring: six real app logos around the logo, a pulse visits each, a one-line result types in | "Works everywhere" proved, not claimed |
| Brief, Claude, 3D, Film, Live pipeline with a mini preview building at each card | It is the story of how the site itself was made |
| A fruit journey that ends in a bottle filling and capping | Progress is a picture, never a counter |
| A day dial with a tiny robot face riding the ring | Turns a feature list into a day in someone's life |
| LED-dot eyes that follow the cursor in the closing section | The brand looks back at you |
| Star to eclipse behind the closing line | A calm, cinematic end beat |
| Sliders that drive counting numbers and a bar that fills | Lets the visitor play with the value |

## Pieces that did not
- A pixel dissolve of a mascot into text: clever, but it did not explain anything, so it read as weak.
- Self-typing captions over a film: "AI sloppy".
- Floating small cards in a big empty panel: fill the panel.
- Sparkle stars, neon glow on everything, HUD rings, fake timecodes, 01/05 counters: banned.

## Make one fast
Start from `recipes/living-pipeline.js` (nodes, route, rounds, `onArrive` for each node's own beat). For a ring,
place nodes on a circle and route through the centre. For a dial, draw the ring with one arc that fills.
