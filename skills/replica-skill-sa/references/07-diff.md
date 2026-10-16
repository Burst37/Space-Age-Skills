# 07 Diff: how close is the clone
Reads `features.csv`, `replica/screens/`, `replica/clone-screens/`. Writes `replica/parity.md`, `replica/diffs/`.

**Parity = does the same job, not looks the same.** Feature score is the number that matters. Layout score checks structure only and ignores colour (stage 9 changes every colour on purpose). Never chase pixel parity: their exact look is trade dress.

## 1. Feature parity
Every `clone` cell = `yes`, `partial` (+note), `no`, or `skip` (+reason). Then:
```bash
python3 $S/scripts/parity.py replica/features.csv --gate
```
Weights must 3 / should 2 / could 1; partial = half; `skip` and `original=no` rows (your extras) not scored. Prints score, must-haves done/total, areas weakest first, missing list in build order. `--gate` exits 1 while any must-have is not done. Exit 2 = matrix broken (fix columns).

## 2. Layout diff
Same viewport (1440x900 desktop, 390x844 mobile), same state (same data shape, tab, login) for both.
```bash
python3 $S/scripts/imgdiff.py replica/screens/S07.png replica/clone-screens/S07.png --out replica/diffs/S07.png
python3 $S/scripts/imgdiff.py replica/screens/S07.png replica/clone-screens/S07.png --json > replica/diffs/S07.json
python3 $S/scripts/parity.py replica/features.csv --visual replica/diffs/*.json --markdown > replica/parity.md
```
Layout mode: edge maps on a grid, only non-empty cells scored. Verdict: 90+ matches, 75+ close, 50+ partly, else different. Reports differing regions (original's pixel coords) + height delta. Retina vs non-retina fine. Interlaced PNG -> re-save non-interlaced. `--mode pixel` = own regressions only (clone vs clone), never vs original. Overall = 80% features + 20% layout.

## 3. Behaviour diff
Walk each flow in both: clicks to finish core flow, error handling, what's remembered between visits, emails sent. Fewer clicks = win. Row: `flow | original does | clone does | fix or keep`.

## 4. Verdict (`parity.md`)
- **not shippable**: any must-have missing or any open S1
- **shippable**: all musts done, feature score 80+, no open S1/S2
- **better than original**: shippable + stage-8 fixes. This is the goal; a straight copy has no reason to exist.

Honest numbers. Output: `parity.md`, diff images, top 5 to build next. Next: `04-build` for gaps, or `08-entrepreneur`.
