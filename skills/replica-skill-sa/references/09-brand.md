# 09 Brand: make it the user's own
Line between "a clone" and "your app". Writes `replica/brand.md`, `replica/brand.json` (`{"avoid": [...], "domains": [...], "colors": [...]}`, lists; used by `sweep.py`, `listing.py`, stage 11).

## 1. Name
Read angle in `fixes.md`. 20 candidates across styles: descriptive (Booklink), compound (Slotwise), invented (Calvo), metaphor (Harbor), verb (Book). Cut to 5:
- not confusingly similar to the original or any same-category app in sound, look or meaning (trademark-office test). No puns on their name, no "-ly" twin.
- short, spellable on first hearing, no bad meaning in big languages; supports the angle.

## 2. Checks: run, never assume
Per name, per check: `to run` or result + date run. Never "available" for an unrun check.
US TM (tmsearch.uspto.gov, classes 9/42), EU (euipo eSearch / TMview), Canada (ised-isde trademarks DB), WIPO Global Brand DB, domain (`whois` / registrar), App Store + Play exact name, handles (X, Instagram, TikTok, GitHub), web "name + category". Screening only, not clearance: lawyer before spending on the name.

## 3. Palette
New values in the same token roles. Primary hue from a different family than the original's. Original's brand colours -> `brand.json` `colors`.
```bash
python3 $S/scripts/contrast.py replica/design/tokens.json   # zero AA fails
```

## 4. Logo brief (not a logo)
Idea in one line tied to name + angle; mark type (wordmark / symbol+wordmark / monogram); works at 16px and 1024px; deliverables: SVG, 1024x1024 iOS icon (no transparency), favicon set, 1200x630 social image. **Must not resemble the original's mark** (shape, colour pair, letterform trick): compare side by side.

## 5. Voice
3 words, each with what it does not mean ("direct, not blunt"). 5 do/don't pairs. Rewrite the 10 most-seen strings (sign-up, empty states, main button, confirmation, error) fresh.

## 6. Sweep
Replace every placeholder name/colour/string, then:
```bash
python3 $S/scripts/sweep.py . --config replica/brand.json
```
Searches contents + file/folder names for names (also inside identifiers like `CalendlyEmbed`), domains, colours (any case, short hex). Skips `node_modules`, build output, lock files, binaries, root `replica/`. Exit 1 = leftovers. Names of 3 chars or fewer print a warning (substring false positives, e.g. "Box" in "checkbox"): check those hits by eye. **By eye too**: favicon, page titles, email templates, OG image, app icon (binary images are not scanned).

Output: `brand.md` (name + checks, palette, logo brief, voice), `brand.json`, updated tokens, rewritten strings, clean sweep. Next: `10-launch`.
