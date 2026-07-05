# Seedance 2.0 / AI video generation — what to avoid

These rules are HARD RULES learned from real failures. Encoding them so future runs don't repeat the mistakes.

## NEVER ask Seedance (or any image-to-video model) to do these

### 1. Numbers counting up / down
Seedance can't reliably tween numeric digits. "0 → 800" produces flickering garbled glyphs. **If you need a number to appear, render it as the FINAL value in the input still and keep it static.** If you want the number to feel "alive", animate the surrounding container (slide-in, glow pulse) — never the digits themselves.

### 2. Readable text typing or morphing
Same problem. Never ask Seedance for "text types in", "letters appear one by one", "label morphs from X to Y". Text glyphs aren't stable across frames in diffusion video models.

### 3. Strict multi-element choreography with exact timing
"Six dots cascade in 0.15s apart" — Seedance interprets vibes, not stage directions. Counts often come out wrong (5 instead of 6, or all at once). For precise stagger choreography, use Remotion programmatic animation instead.

### 4. Hands or fingers doing precise things
Clicks, typing, pointing at specific UI elements — comes out warped.

### 5. Specific brand logos
Asking for "the Anthropic asterisk" or "the Hacker News Y" usually produces a deformed approximation. Better: include the correct logo *in the input still* and prompt only for "subtle pulse on the icon" or "fade in".

### 6. Lip sync / facial expressions on cue
Without audio reference, expressions drift. Don't ask for "she smiles when she says X".

### 7. Negative actions
"No people", "don't show text" — diffusion models often inject what you negate. Better to describe the positive composition fully so there's no slot for the unwanted element.

### 8. Reflections, mirrors, screens-within-screens
Two synchronized renderings of the same content rarely match.

### 9. Discrete state transitions (X→Y→Z)
"Icon turns from grey to green" — in practice you get a smooth color blend, not a flip. For state changes, use a static still per state and cut between them in Remotion.

### 10. Reading specific glyphs across frames
Even if the input still has readable "MONTH 1" text, Seedance may garble it as the camera moves. Either keep the camera locked, or accept the labels will become unreadable squiggles.

## What Seedance IS good at

- **Continuous organic motion** — particle drift, flowing lines, water, smoke
- **Subtle parallax / breathing zoom** on a fixed composition
- **Fade-ins for groups** of elements that don't need exact count
- **Camera moves** on a static scene (orbit, dolly) — not too fast
- **Diffuse/atmospheric effects** — light bloom, fog, glow, glitch
- **Style transfer** — keeping the input still's aesthetic while adding motion

## Decision tree: Seedance vs Remotion programmatic

| Visual element | Use |
|---|---|
| Final number/percentage shown statically | Generate as still, use Seedance for breathing zoom only |
| Animated number counter | **Remotion** (`interpolate(frame, …)` with `Math.round`) |
| Logo flash / reveal | **Remotion** static asset + spring scale-in |
| 6 elements cascading with precise stagger | **Remotion** (one Sequence per element with `from` offset) |
| Continuous breathing, parallax, glow | **Seedance** |
| Cinematic establishing shot for a beat | **Seedance** (full takeover, 3-5s) |
| Small icon sliding into corner of frame | **Remotion** (transparent-bg PNG via `mix-blend-mode: multiply`) |
| Camera pan over a static composition | **Seedance** |

## Prompting Seedance — the format that works

```
Clean editorial motion-graphics. [Composition assembles by elements fading-in / sliding-in
without specific counts]. Subtle continuous breathing zoom. Final frame matches the input still.
[Add: "no people, no faces, abstract diagram only" if the input is non-human].
```

Avoid:
- Specific numbers (counts, durations, percentages)
- Named brand logos
- "X then Y then Z" sequences
- Anything implying readable text changes

## When in doubt

**Generate the final composition as a still with gpt_image_2** (which is great at exact-pixel layouts), then ask Seedance only for "subtle parallax breathing zoom, no element changes, final frame matches input". Use Remotion for everything that needs precise timing or readable text.
