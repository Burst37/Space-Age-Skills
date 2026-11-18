---
name: ao-kinetic-reveal-trailer
description: "Builds a 13-cut, 24fps, 16:9 motion-graphics character-reveal trailer prompt (80% kinetic typography and flat graphic design, 20% character action) for AI video models. Takes a character + name + palette and fills a locked cut-by-cut template with timecodes, then lints the timeline. Use whenever the user wants a character reveal trailer, title sequence, streetwear/campaign film, kinetic typography promo, split-screen or stroboscopic action edit, 'AAA motion graphics' intro, or a prompt that makes graphic design (giant type, shards, barcodes, halftone, speed lines) the star with a character moving through it. Also use when the user shares a viral motion-graphics reveal (e.g. the Nexoxh AO trailer) and wants it replicated for another character, brand, or product."
---

# Kinetic Type Character Trailer

Reusable recipe from the "AO" reveal trailer (Nexoxh): one prompt, 13 hard cuts, 15.00s. The look comes from **graphics doing the acting** — type, shapes and color fields carry 80% of every frame; the character is a 20% accent that interacts with them (slides across the baseline of a letter, vaults over a word). That inversion is why it feels premium instead of "AI character clip".

All 13 cuts, the editing block and the audio block are verbatim from the author's two-part prompt (see `references/cut-library.md`); you only swap nouns.

## Inputs to collect (ask only what's missing)
1. **Name/wordmark** — 2-4 letters works best (AO). Longer names: use initials for CUT 01/10, full name only in the finale.
2. **Character lock** — face, hair, eyes, headwear, outerwear + colors, bottoms, shoes, accessories. One dense sentence.
3. **Palette** — 4-5 flat colors incl. black and white (default: ice blue, cobalt, white, silver-grey, black).
4. **Power words** — 4 words for CUT 08 barrage + a slogan for CUT 05 ring + a verb for CUT 06/07 (JUMP/FLIP). Pick verbs the character can physically do.
5. **Target model** (default Seedance 2.x / Kling / Veo-class). If the model caps clip length, split into 3 chunks at cut boundaries 04|05 and 09|10 (repeat the header + closing blocks in each) and reuse the same header block.

## Workflow
1. Fill `references/prompt-template.md` (header + 13 cuts). Keep the template's sentence order: **header → identity lock → style line → cuts**.
2. Swap nouns, never structure. Every cut keeps: timecode, one graphic idea, one character action, one camera/transition snap.
3. Write timings into a file as `CUT NN | start-end` lines and run `python scripts/check_timeline.py <file>` — it verifies 13 cuts, no gaps/overlaps, ends at 15.00, and every boundary is within half a frame of the 24fps grid (author's own 3.10s-style timings round to the nearest frame).
4. Deliver: the prompt in one fenced block, plus a 3-line list of what you changed per cut.

## Rules that make it work (and why)
- **Lock identity once, early, and repeat "never redesign her/him."** Models drift outfit details across hard cuts; the repeat is cheap insurance.
- **Name the palette and forbid others.** Flat color fields only read as "design" if nothing else competes.
- **One graphic idea per cut.** Stacking effects (shards + halftone + split-screen) in one cut turns to mush at 1s.
- **Verbs of impact:** slam, punch, snap, shatter, stamp. Each cut should name its snap (shutter flash, whip-pan, RGB split, freeze).
- **Character interacts with type physically** (slides on the baseline, palm on the J) — that's the signature move; don't let her float in front of text.
- **Beat grid:** cuts land on ~1s; the 0.9s/1.1s variants keep it from feeling metronomic. Preserve that rhythm.
- Cut order is an arc: graphics only → eye (identity) → entrance → multiplicity → hero spin → compression/rebound → ghosting → typographic barrage → freeze/target-lock → release burst → poster montage → PEAK hero landing (CUT 12, overexposes to white) → quiet identity card. Audio peaks at CUT 12, then ends on a cold logo stinger.
- **Safety rails stay in the prompt:** no weapons, combat or fire; energy comes from motion design, wind, frost, glass and parkour. Keep it — it keeps outputs clean and platform-safe.
- **Typography readable before the character overlaps it** — a hard rule in the Editing block.

## Variants
- **Product instead of character:** swap the character for the product; "palm on the J" becomes product-on-letter contact; CUT 02 eye → macro detail in the O.
- **Shorter (~10s / 9 cuts):** drop cuts 06, 07, 08, 11 (keeps arc); change 'exactly 13 cuts' and re-time, and skip the timeline script (it is fixed to the 13-cut/15s original).
- **Vertical 9:16:** stack typography vertically; CUT 04 triptych becomes three horizontal bands.

Handoffs: camera/lens specifics → `multi-platform-cinematography-prompt-director`; Seedance syntax edge cases → `seedance-2-5-prompting`; face/outfit lock sheets → `banana-pro-director-30`; naming the motion effects → `animation-vocabulary`.
