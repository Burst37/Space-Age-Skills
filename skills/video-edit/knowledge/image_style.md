# Locked image style — soft 3D matte / claymation

User-locked on round 7. All AI-generated subjects in this skill MUST use this style. No improvising, no flat-geometric, no line-illustration mixing in.

## The exact prompt template

When generating an AI image with `gpt_image_2`:

1. Pass the brand grid background as `medias[0]` with role `"image"` (init image). See [SKILL.md §4k](../SKILL.md) and [scripts/gen_brand_image.sh](../scripts/gen_brand_image.sh) (helper).
2. Use this prompt structure verbatim — only the SUBJECT line changes:

```
Add a single <SUBJECT> at the center of the frame, rendered as a chunky matte plastic / claymation form with soft shadows. Match the existing background's deep raisin black color and grid pattern exactly — the subject should look like it lives ON the grid, not pasted over it. Neon lime (#CFFF05) rim light along one edge of the subject. Clear silhouette, premium magazine aesthetic, vertical 9:16. No text.
```

3. `aspect_ratio: "9:16"` always (matches our portrait sources).

## Why this style won

User compared 5 candidate styles on the same subject (database server cylinder, /tmp/style_tests). Picks:
- ❌ **A** Editorial line illustration — too cold, fragile, reads as "wireframe diagram" not "object."
- ✅ **B** Soft 3D matte / claymation — chunky form, rim light, sits on the grid like a real object.
- ❌ **C** Bold flat geometric — recognizable but flat; doesn't feel premium.
- ❌ **D** Dark studio product photo — too photorealistic; competes with the speaker's face.
- ❌ **E** Risograph two-tone — too indie, doesn't match the editorial register.

## Subject selection rules

These compose with [SKILL.md §4j (recognizable concrete subjects)](../SKILL.md):

- **Pick something the AI model can actually draw.** Database cylinder, padlock, key, server rack, shield, gear, magnifying glass, terminal — universal, the model nails them.
- **Avoid "guardrail," "funnel," "machine," "system" as literal subjects.** The model gets confused and produces ambiguous output. Substitute with the cleanest universal symbol: "guard rails" → padlock or shield. "Funnel" → hourglass. "Machine" → gear. "System" → connected boxes.
- **One subject per frame.** Never "X next to Y" — the AI splits attention and you lose silhouette.

## Reusing the brand grid backdrop

Render once via Remotion `still`:

```bash
cd ~/.claude/skills/video-edit/remotion
npx --no-install remotion still src/index.ts DarkGridFrame /tmp/dark_grid_bg.png --frame=0
npx --no-install remotion still src/index.ts LightGridFrame /tmp/light_grid_bg.png --frame=0
```

Upload to Higgsfield and reuse the `media_id` across all gens for a video. The bg should be IDENTICAL across all AI beats in a single video for visual unity.

## Don't deviate

If a generation comes back not-clay (model drifted to flat / 2D / line-art), regenerate with the prompt verbatim. Don't accept off-style results because "it looks fine" — visual consistency is the point.
