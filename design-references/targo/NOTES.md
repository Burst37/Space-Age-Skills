# Design reference — Targo (motionsites.ai style)

Saved as a reference for the aesthetic direction the user likes. Single-file, no build step.

## What defines this look (reusable patterns)
- **Full-bleed background video, uncropped** (`object-fit:contain`, `height:auto`, pushed off-canvas
  `right:-20%` / mobile `left:-12%`) so the motion reads as an ambient element, not a hero banner.
- **Directional scrim** — a horizontal `linear-gradient` fading solid page-color → transparent across
  the left ~70%, keeping text legible over the video without a hard mask. Desktop only.
- **Staircase headlines** — uppercase, tight tracking (`letter-spacing:0.01em`), near-solid leading
  (`line-height:0.98`), last lines indented (`margin-left:min(238px,28vw)`), final word in accent.
- **Chamfered / clipped buttons** via `clip-path: polygon(...)` (cut top-right + bottom-left corners) —
  the signature "tech" corner. Accent fill `#15BCDF`, thin accent border, dark label, subtle glow
  `box-shadow`, plus a small trailing `::after` tick line.
- **Viewport-capped type** — `font-size:min(clamp(...vw...), 9.2vh)` so the hero never overflows short
  monitors. Worth reusing on any 100vh hero.
- **Blend-mode video tint** — an accent rectangle with `mix-blend-mode:hue` over a second video recolors
  it to brand cyan without touching the source.
- **Restrained palette** — warm off-white `#F2F1F0` ground, one electric accent, grayscale text ramp
  (`#2b3033` heads / `#3a3a3a` nav / `#6b6f72` body). No gradients-as-decoration, no drop-shadow soup.

## Palette
`--accent:#15BCDF` (hover `#3fd0ef`, border `#0fa3c2`) · bg `#F2F1F0` · about handoff `#F7F6F8`
Type: **Quantico** 400/700, fallback `'Arial Narrow', sans-serif`.

## Note
Videos are hosted on `d8j0ntlcm91z4.cloudfront.net`. They will NOT play inside a sandboxed
Artifact/preview (CSP blocks non-allowlisted media hosts) — this is a self-hosted page, serve it
from a normal web host to see the motion.
