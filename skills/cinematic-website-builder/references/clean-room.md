# Clean-room route: rebuilding an effect you saw

Use it when the moodboard shows a motion effect from another site that the catalog doesn't cover.

1. **Observe, don't extract.** `replica-skill-sa` writes a behaviour spec (inputs → states → outputs with
   measured timings, plus a list of unknowns) from the public rendered page: screen recordings, frame-by-frame
   captures, DOM geometry at rest and in motion. **Never** read, deminify, quote or reuse the site's JS/CSS
   bundles, and never cite library names or values that only a bundle could reveal.
2. **Write "our design choices"** for everything unknown or deliberately different (easing, mobile, keyboard,
   reduced motion, one video at a time). Label them as ours.
3. **Build it as a CWB module** (`CWB.define`, tokens only, fail-open, gentle/bold variants).
4. **Frame-compare with `reanimate`**: record ours and the reference at the same viewport and compare the
   key frames (rest, mid, settled, leave). Tune until the timing matches; the code stays ours.
5. **`rea-sa`** (code-level reverse engineering) is **only** for software Chuma owns or has written permission to analyse.
6. Borrow structure and behaviour, never assets, copy, wordmarks or type files.

Worked example: `references/examples/menken-clean-room.md` → modules `expand-panels` (#39) and `view-switch` (#40).
