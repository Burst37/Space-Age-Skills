# Split-Screen Portfolio Site — Build Prompts

By Ruben (from the Gumroad asset pack). Five prompts in order, each building on the last.
Paste them into Claude one at a time. Attach a rough Figma sketch alongside each prompt where noted.

---

## Before you start

- **Images:** Put your project photos in `./Visuals/project-01/`, `./Visuals/project-02/`, etc.
  Each project needs 5 images named `01.jpg` through `05.jpg`.
- **Sketches:** Each prompt mentions "the attached reference image" — attach a simple Figma sketch showing the layout idea. It doesn't need detail; just enough to show the structure.
- **Tip:** Tell Claude to ask any questions before it starts. That one step noticeably improves the output.

---

## Prompt 1 — Foundation + home page

> Sets the split-screen shell, header, design tokens, and the signature opposite-direction scroll animation.
> This is the most important prompt — get this right and the rest follows cleanly.

```
Start with the built foundation plus the home page of a portfolio website please. The reference
images attached show the exact look and feel I'm going for — please match their restraint,
spacing, and typographic calm closely.

Overall architecture:

The whole site is built on a fixed, full-viewport split-screen layout: the screen is divided
vertically into two equal halves, a left panel and a right panel, each exactly 50% of the
viewport width and 100% of the viewport height. There is no traditional page scrolling — the
document never grows taller than the viewport. Instead, scroll input (wheel, trackpad, touch)
drives the content transitions described below. This split is the backbone of every page, so
please build it as a reusable layout shell I can reuse on later pages.

A persistent header sits above both panels: the word KENDALL in the top-left corner acts as the
home button, and MENU sits in the top-right corner. Both are uppercase with generous
letter-spacing, set in Source Serif 4.

The signature scroll animation:

This is the most important part of the website and should feel polished and deliberate. Whenever
the user advances (scrolls down) or goes back (scrolls up), both panels transition at the same
moment but travel in opposite vertical directions: the right panel slides in from the top while
the left panel slides in from the bottom — and the reverse when scrolling the other way. The two
halves always move in opposite directions and stay perfectly in sync, so the left content always
corresponds to the right content. The motion should feel smooth and luxurious, using a gentle
ease-out curve so each transition glides to a calm stop rather than snapping. Keep it unhurried.

Scrolling should feel fluid and responsive: a single gentle scroll moves one project, but a
quicker or longer scroll can flow through several projects in succession, the panels gliding
continuously and always settling neatly on a whole project — it must never come to rest stuck
halfway between two. The project list is also endless: scrolling past the last project loops
seamlessly back to the first, and scrolling up from the first wraps around to the last, with no
visible seam or jump in either direction.

The home page (projects view).

The home page is the project browser. The left panel shows the active project's name as a large
display heading in Source Serif 4, in #151515, with a small category tag beneath it (for example
"PHOTOGRAPHY") in uppercase Inter with letter-spacing. Directly above and below the active name,
the adjacent project names appear smaller and in the inactive color #A2A2A2, each separated from
the active title by a thin hairline divider in #DEDEDE — exactly like the dividers in the
reference images. So the left panel reads as a vertical list of project names where the centered
one is active and dark, and its neighbors are dimmed. All of the project names — active and
inactive alike — and the hairline dividers must share the same left edge, so the list stays
cleanly left-aligned as it scrolls (the smaller inactive names should not drift inward).

The category tag belongs only to the active project: when the active project changes, the tag
should fade out quickly and early in the transition rather than lingering, and the new active
project's tag should fade in gently once it settles.

The right panel shows the matching project thumbnails as a vertical carousel. Three thumbnails
are always visible at once: one centered vertically as the main image at full size and full
opacity, and the two neighbors partially in frame, cropped by the top and bottom edges, smaller,
and at 50% opacity. The centered thumbnail always corresponds to the active project name on the
left.

As the user scrolls, the left list of names moves vertically in one direction while the right
carousel of thumbnails moves in the opposite direction, the two staying locked together so the
active name and the centered thumbnail are always the same project. This is the same
opposite-direction principle as the main slide animation, applied to the project list, and it
should carry the same smooth ease-out feel — including the same fluid, fast-but-snapping behavior
and the same seamless endless loop.

Images and data. The project images are in a folder named `Visuals` in the project root
(`./Visuals/`). Reference the images from there.

Design tokens:
- Display and headings: Source Serif 4
- Body text and UI labels: Inter
- Headings and subheadings: #151515
- Inactive project names: #A2A2A2
- Body text: #404040
- Hairline dividers: #DEDEDE (kept genuinely thin, 1px)

Keep everything generous in whitespace, calm, and minimal, matching the airy feel of the
reference images. The priority for this first build is a rock-solid, reusable split-screen
foundation and an accurate, smooth, opposite-direction scroll animation that the rest of the site
will build on.
```

**Post-prompt fixes Ruben made:** adjusted left-panel text alignment; loosened scroll so it glides
fluidly between projects rather than locking to one at a time.

---

## Prompt 2 — Home → project page transition

> Adds the hover state on the active thumbnail and the shared-element expand into the project page.
> Key: the same image node expands — no duplicate is loaded.

```
This is a follow-up to the previous prompt, building on the same split-screen foundation, home
page, and design tokens: Source Serif 4 for headings, Inter for body text, #151515 for headings,
#404040 for body text, #A2A2A2 for inactive text, and #DEDEDE for the hairline dividers. The
attached reference image shows the project page — please match its layout, spacing, and
typographic calm closely.

On the home page, give the active (centered) project thumbnail a clear hover state so the user
knows it's clickable: a small, smooth zoom on the image, plus a plus icon with a slight darkening
behind it that fades in centered over it. Keep both subtle and in the same ease-out feel as the
rest of the site. The active project's title on the left should be clickable too, as an optional
second way to open the same project — give it a subtle cue (a pointer cursor and a gentle fade on
hover); only the active, centered title is clickable, not the dimmed neighbours.

When the user clicks that centered thumbnail (or the active title), the site transitions to the
project page. The exact same image element expands to fill the entire right 50% of the viewport
as a full-height photograph — reuse the same image node so this is one continuous, shared-element
motion and no duplicate image is ever loaded. At the same moment, a white block slides down from
the top to cover the entire left half, as a scroll-down reveal of the white background. Once that
white area settles, the three text sections fade in one at a time — THE CONCEPT first, then ART
DIRECTION, then PHOTOGRAPHY — each a soft, gentle fade so the page assembles itself calmly for a
luxurious effect.

On the project page, the three sections sit together in the bottom-left corner of the left half,
so the block mirrors the KENDALL button in the opposite corner: left-aligned to the same left
edge as KENDALL, and with the same spacing beneath the block as KENDALL has above it, so it seats
cleanly into the corner. Each of the three sections has a small uppercase heading with generous
letter-spacing in #151515, followed by a short body paragraph in Inter at #404040, with a thin
1px hairline divider in #DEDEDE beneath it, exactly like the reference image. The KENDALL and
MENU header stays in place as before.

Use this placeholder copy for the three sections:

THE CONCEPT — This project began as a study in quiet light and restraint. The aim was to let the
subject breathe within the frame, with nothing competing for attention, so every choice served a
sense of calm and intention.

ART DIRECTION — The palette was kept warm and muted, built around natural materials and soft
neutral tones. Styling was stripped back to the essentials, leaving a result that feels
understated, considered, and unhurried.

PHOTOGRAPHY — Shot entirely in available daylight, the series favours soft shadows and gentle
contrast. The compositions stay simple and centred, giving each image room to settle and a tone
that feels intimate without ever appearing staged.
```

**Post-prompt fix:** small alignment tweak so project description lines up with the logo.

---

## Prompt 3 — Further project pages

> Adds two more pages inside each project using the same opposite-direction push.
> Page 2: full-bleed image left + small floated image right.
> Page 3: full-bleed image left + centred quote right.

```
This is a third follow-up, continuing within the project view from the previous prompt. After the
first project page, the user scrolls down to reach two further pages that belong to the same
project. Keep all the established design tokens and the KENDALL and MENU header. The two attached
reference images show these pages exactly — please match them closely. Pull the additional images
from the same project's set in ./Visuals/ (these are different photos from the same project, not
the hero image that expanded from the home page).

The second project page (first attached reference) is split 50/50 as always. The left half is a
full-height, full-bleed image running edge to edge. The right half is white, with a single
smaller image sitting inside it, vertically centred and surrounded by generous white space on all
sides. There are no hairline dividers on this page — keep it clean, just the two images and the
white space.

The last project page (second attached reference) is again split 50/50. The left half is a
full-height, full-bleed image. The right half is white and holds a centred text block: a small
uppercase placeholder name with generous letter-spacing on top (attributed to a placeholder name
"Jane Doe"), then a short quote beneath it set in Source Serif 4, centred, in #151515. Leave
plenty of white space around the whole block, and no hairline dividers here either.

Use this placeholder quote on the last page: "Some people think design means how it looks. But
if you dig deeper, it's really how it works." attributed to a placeholder name "Jane Doe".

For both pages, moving from one to the next uses the same signature push animation as the rest of
the site. As the user scrolls, the two halves push in opposite vertical directions — one half
enters from the top and travels down while the other enters from the bottom and travels up — so
each new page slides into place with the same smooth, ease-out, luxurious feel. The same applies
in reverse when scrolling back up. Here the paging should be deliberately less sensitive than the
home carousel: each scroll gesture advances exactly one page, and the push runs a little slower
and more drawn-out, so a small or quick scroll moves a single page and never skips ahead — it
should always settle fully on one page before another can begin.
```

---

## Prompt 4 — Dropdown menu

> White panel slides down over the right half only. Nav items and studio block stagger in.
> Nothing behind it moves.

```
This is a follow-up prompt describing what happens when the user clicks the MENU button in the
top-right corner. The attached reference image shows the result — note that the left half is just
whatever project page happened to be open when the menu was triggered, so it isn't part of this
design. Only the right half matters here, and the rest of the website stays exactly as it is
while the menu opens and closes; nothing behind it moves or changes.

When the user clicks MENU, a white menu panel slides in to cover only the right 50% of the
screen, coming down from the top with the same smooth, ease-out feel as the rest of the site. At
the same moment, the MENU label in the top-right becomes a CLOSE label in the same uppercase,
letter-spaced style. Clicking CLOSE reverses the animation, slides the panel away, and restores
the MENU label. The KENDALL home label in the top-left stays in place throughout.

For the menu panel itself, match the reference closely. Everything is left-aligned within the
right half, with a generous left margin and plenty of breathing room. In the upper portion sit the
navigation items — Home, About, Projects, Contact — stacked vertically in Source Serif 4 at a
large size, in #151515, with generous vertical spacing between each one so they feel open and
unhurried. Lower down, clearly separated from the navigation by a larger gap, sits a short studio
block: a small uppercase label with generous letter-spacing ("KENDALL STUDIOS"), then a brief
paragraph in Inter at #404040, and beneath the paragraph a thin 1px hairline divider in #DEDEDE,
exactly as in the reference. The spacing here is important — the navigation items and the studio
block should read as two clearly separated sections, both aligned to the same left edge. All
navigation items and the studio block should fade in, one at a time.

Use this placeholder paragraph for the studio block: "Kendall Studios is a photography practice
working across portraiture, editorial, and art direction, making quiet, considered images built on
nnatural light and a careful eye for detail."
```

---

## Prompt 5 — Loading animation

> Two images push in from opposite ends, brand word breathes outward via letter-spacing, then
> images slide back out revealing the home page. Two random projects picked on every load.

```
This is the final prompt, for the loading animation that plays before the home page appears on
first load. The attached reference image shows the key moment: two full-bleed images side by
side, each filling its half of the 50/50 split, with the word KENDALL displayed large and centred
across the middle, overlapping both halves.

On load, two images push into view using the same motion as the rest of the site: one fills the
left half and one fills the right half, and they enter from opposite vertical directions — the
right image from the top, the left image from the bottom — with the same smooth ease-out feel.
Use exactly two images, one on the left and one on the right. Using the project data set up
earlier, pick two different projects at random and take one image from each, re-randomised on
every page load so a different pairing appears each visit. The two images must never come from the
same project.

While the images are in place, the word KENDALL sits centred across the middle of the screen,
overlapping both halves, set large in Source Serif 4 in white so it reads clearly over the
photographs. Its letter-spacing is animated: it begins already somewhat widened and then slowly
expands to a much wider tracking over the course of the animation, with a gentle ease-out so the
word seems to breathe outward. As an example, something like 0.15em opening out to around 0.5em
— adjust to taste.

Before the loading sequence finishes, KENDALL fades away. Then the two images slide back out in
opposite vertical directions, revealing the home page beneath them. The whole sequence should feel
calm and luxurious, in keeping with the rest of the site, and it should only play on the initial
load.
```

---

## Workflow tips (from Ruben)

- Tell Claude to **ask any questions before it starts** — improves output significantly.
- After Prompt 1, check the scroll feel. If it locks to one project at a time, ask Claude to make it glide fluidly between projects.
- Each result comes very close; typical follow-ups are single-sentence alignment or timing tweaks.
- For images: generate a hero shot, then ask Claude to write Nano Banana prompts for a consistent photoshoot set. Run those through Higgsfield to get 5 coherent images per project.

## Adapting for a new client

1. Replace `KENDALL` / `Kendall Studios` with the client name throughout.
2. Update `projects.js` with their project names, categories, and folder paths.
3. Drop their images into `Visuals/` (5 images per project: `01.jpg`–`05.jpg`).
4. Swap the design tokens in `:root` (colors, fonts) to match their brand.
5. Update the three project section copy blocks in `index.html`.
6. Run the 5 prompts using the actual codebase as context — attach the existing files so Claude builds on top of them rather than from scratch.
