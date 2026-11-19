# Page laws

Every law here came from a real review of a real build.

## Copy the reference faithfully
- Pick a real site that is already gorgeous and copy its structure: section order, spacing, type scale, buttons,
  cards, the way sections end. Only the brand, words and media change.
- Write the reference's system into `design.md` first: hexes, font and weights, sizes, radius, shadows.
- Mercury worked best: one calm full-bleed hero image with centred type and an email capture, a quiet logo strip,
  generous dark space, graphite cards with 12 px corners, pill buttons, one cobalt accent.

## Structure
1. Hero: the Level 1 showpiece, big. Headline and one line, plus one or two buttons. Nothing else.
2. A proof strip: real or clearly fictional logos in a slow marquee that moves one full set per loop.
3. The statement: one sentence, full screen, lighting up word by word as you scroll.
4. The Level 2 film, framed, captions beside it.
5. Three cards with Level 2 stills (or living stills) and a hover that lifts and zooms.
6. The Level 3 motion graphic, split with a short heading.
7. The close: dark, calm, one line, one button.
8. Footer: credits for 3D authors, "made with Higgsfield", and the fictional-brand line if it applies.

## Layout
- **One page, one thought.** If a section needs a paragraph, it is two sections or a worse idea.
- **Split, do not overlay.** Copy left, visual right. Heading text over footage or over a busy 3D scene fails.
- **Lift text off images.** If the text and an image touch, give the text its own column or space above.
- **No hard edges** between sections. Fade colours with tall gradients; mask media edges.
- Readable type: one display face with character at -0.03 to -0.035em, body 17 px, contrast you can read on a phone.
- Real logos only, from Simple Icons (cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/<name>.svg) or the brand.
  Simple Icons are black: invert them on dark.
- Hover states must work and feel physical: lift 4 to 6 px, image zoom 1.06, a coloured edge glow.

## The motion switch
Keep `runtime/motion-switch.js` on every site: Off (a calm still site), On, and X-ray (labels every moving part with
what it is and how it was made). Tag each moving element: `data-xray="what · how" data-xray-tool="higgsfield|code"`.
It is the best way to show a client, or a viewer, which level did what.

## Dev contract
- `window.__ready = true` once the page is truly ready.
- `?motion=on|off|xray` for screenshots.
- Serve with a background `python3 -m http.server --bind 127.0.0.1`. Never run a server in the foreground.
