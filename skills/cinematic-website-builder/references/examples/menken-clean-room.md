# Clean-room example: expanding video panels (behind `expand-panels` #39 and `view-switch` #40)

Source: Chuma's clean-room re-teardown (`/workspace/site-reverse/menken/behaviour-spec.md` + `finding-ledger.md`),
**public rendered behaviour only**. No code, strings, assets, copy or bundle-derived facts from the reference
site are used or cited anywhere in this skill. The earlier `motion-spec.md` has been withdrawn.

## Observed (measured on the public page at 1440×900)
- Ten equal panels, 12vh wide, **20px gutters**, staggered on three rows: **+0 / +3.33vh / +7.22vh**.
- Fine-pointer enter: the panel's inner grows **2×** and shifts left by half a bar so it grows both ways;
  neighbours keep their width and shift ± half a bar. Settles in **~0.6s** with a strong ease-out; the video fades in over ~0.3s.
- Leave: **~0.1s hold**, then collapse over **~0.4s**.
- A second "explore" view exists (tall slices of one work); its transition timing was not observable.
- Unknown: keyboard, touch, reduced motion, first/last-panel edges.

## Our design choices (not observed)
- Easing **`power3.out`** is OUR choice to match the measured settle curve.
- **One video at a time**: only the active panel gets a `src`; the others show posters.
- Muted always, a pause control, reduced motion = instant layout + posters.
- Mobile ≤ 699.98px: panels stack, tap toggles. Keyboard: panels are buttons, arrows move, Escape collapses.
- Gentle variant (regulated sectors): 1.4×, no neighbour shift, 0.45s/0.35s `power2.out`, posters only.
- Real HTML titles; our art, words, type and colours (the demo used a travel theme).

## Process rule
Rebuild effects from **observed behaviour** (`replica-skill-sa` behaviour spec + `reanimate` frame compare).
`rea-sa` (code-level analysis) is only for software Chuma owns. See `references/clean-room.md`.
