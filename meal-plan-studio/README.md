# meal-plan-studio

Client meal-plan pipeline for a dietitian practice. One folder per client under `clients/`.

Outputs per client: 30-day plan PDF (17 pages: 3 days per page, 2 shopping weeks per page), mobile web app,
food swap guide (PDF + HTML), animated PowerPoint (full, phone, no-animation), slide PDF, 9.5 s intro video.

## Layout
- `skill/` the `dietitian-meal-plan-builder` skill: plan engines, profiles, food lists, PDF/app/swap-guide builders.
- `clients/<name>/` that client's profile, `plan.json`/`db.json`, deck builder (`build.js`, `post.js`, `repack.py`, `prep.py`), intro.
- `scan.sh` text scan of finished files for forbidden foods (soy, cruciferous...). Run before sending anything.

## New client
1. Copy the closest `skill/scripts/plan_engine_*.py` and profile; edit `DB`, recipes, caps, workout schedule.
2. Generate photos (4:3, one per recipe key) and a 16:9 hero.
3. `python engine.py --out out`, then `prep.py`, `node build.js`, `post.js`, `repack.py`.
4. `skill/scripts/build_pdf.py`, `build_webapp.py`, `build_swap_guide.py`.
5. `./scan.sh <files>`; check one day page and one shopping page for clipped text.

## Rules
Never one PDF page per day. Hard nos (soy, crucifers...) live in the engine `DB`, not just the profile text.
