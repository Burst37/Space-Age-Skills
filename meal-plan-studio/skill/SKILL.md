---
name: dietitian-meal-plan-builder
description: Builds a personalized 30-day, phone-friendly meal plan for a dietitian's client, with every day's meals with full macros, Nutrition Facts, month calendar, weekly shopping lists, carb cycling and like-for-like food swaps, as a shareable web page plus a printable PDF. Ready profiles for gout and high uric acid (low-purine, capped chicken, fish, tofu, eggs and oats), for vegan-with-eggs hypothyroid clients (no cruciferous vegetables, soy timing, 3 meals), for a soy-free ketogenic hypothyroid plan with intermittent fasting (16:8 on workout days, 19:5 on rest days), and for a halal (no pork) omnivore plan that cycles carbs to training days with keto and low-carb rest days and optional 16:8 fasting. Use when the user asks for a client meal plan, 30-day or weekly menu with macros, carb-cycling plan, gout or thyroid diet plan, or macro-matched food swaps, even if they never say skill or web page.
---

# Dietitian meal plan builder

Produces a client-ready 30-day plan as one self-contained HTML page that opens on a phone from a link. The plan engine does the macro math, so the numbers on screen are computed from ingredient quantities and not typed in by hand.

Most of the client's viewing happens on a phone, so the page is the main deliverable. A PDF is the fallback for printing and archiving.

## Workflow

### 1. Intake (ask only what is missing)
Collect, in one short message:
- Client first name, start date (must be a **Monday**), eating window (default 8 AM to 8 PM, four feedings).
- Calorie and protein goal, and the carb-cycle pattern. Defaults are in `references/carb-cycling.md`: keto under 25 g, low about 40 g, medium about 60 g, high 80 to 100 g, repeating Mon to Sun as Med, Low, Keto, High, Low, Med, Keto.
- Medical flags (gout and high uric acid is the built-in profile; see `references/gout-rules.md`), allergies, foods they refuse, and any hard no (this client: no beef or pork).
- Whether photos and an intro video are wanted. Both are optional.

If the dietitian gives a food list or a "chart", treat it as the source of truth. Every ingredient in the plan must be on it or be clearly low-purine. When they widen the rule ("anything that does not spike uric acid"), say what you added.

### 2. Choose a profile and generate the plan
A profile is a pair: an engine script (ingredients, recipes, caps, meals per day) and a JSON file of page text and rules in `assets/profiles/`.

| Client | Engine | Profile JSON |
|---|---|---|
| Gout or high uric acid, 4 meals, keto/low/medium/high carb cycle | `scripts/plan_engine.py` | `assets/profiles/gout.json` |
| Vegan plus eggs, hypothyroid, 3 meals, low/medium/higher carb cycle (70 to 90 g band) | `scripts/plan_engine_vegan.py` | `assets/profiles/vegan_hypothyroid.json` |
| Vegan plus eggs, hypothyroid, **no soy, no cruciferous**, ketogenic (net carbs 30 g or less) with one weekly refeed, fasting by day type (workout 16:8 with 3 meals, rest 19:5 with 2 meals) | `scripts/plan_engine_vegan_keto.py` | `assets/profiles/vegan_hypothyroid_keto_if.json` (foods: `assets/foods/vegan_hypothyroid_keto_foods.json`) |

```
python scripts/plan_engine.py --config client.json --out plan_out          # or plan_engine_vegan.py
```
`client.json` is optional (see CFG at the top of each engine): `cycle` (tier and carb target for Mon to Sun), `kcal` (target per tier), `min_protein`. The engine assembles each day from its recipe library, applies the caps, adds carb sides to reach the day's carb target, tops up protein with powder or whites, and tops up calories with fats. It writes `plan.json` and `db.json`.

For a client that fits neither profile, copy the closest engine and profile, then change the `DB` ingredients, recipes, caps and the profile text. Keep the output shape (plan.json and db.json) so the build scripts keep working.

Read the printout and check before building anything:
- Every day's carbs sit in its tier band, protein meets the minimum, calories land near the tier target.
- The caps in the profile hold (for example eggs per day and week, soy meals per day, or the chicken and fish limits).
- Nothing from the client's avoid list appears (grep the ingredient keys in plan.json).

If a day misses, edit recipe quantities, `TOPUPS` or the caps in the engine and rerun. Recipe keys (B1, L1, D1 ... or MF1, MN1, S1 ...) name the photo files.

**Keto / fasting profile notes** (`plan_engine_vegan_keto.py`):
- Ask for the client's workout days (default Mon strength, Tue HIIT, Thu strength, Fri HIIT, Sat strength; Wed and Sun rest), medication and dose, and any hard no. Hard nos are enforced by leaving the ingredient out of the `DB` table, so check the table, not just the printout.
- Carb tiers use **net carbs** (total minus fiber): KETO 30 g or less, MED (the weekly refeed) about 55 g. The refeed day is a clinical choice, not decoration: very low carbs can lower T3 conversion in some people. Tell the dietitian it can be removed or doubled.
- Day types come from `CFG['week']`: workout days get 3 meals (12:00, 3:30, 7:30 PM, window 16:8), rest days get 2 meals (3:00 and 7:00 PM, window 19:5). Plan JSON carries `dtype`, `kind`, `fast`, `window` and `net` per day; the web app and PDF show them.
- Caps live in `CFG`: whole eggs per day and week, seitan oz per day, pea protein scoops per day and per meal. Egg whites are not capped.
- Profile JSON sets `netCarbs: true` and `ketoLimit` so the web app swap sheet warns on net carbs. Swapna's own copy of the profile names her dose; the skill copy stays generic.

Weight-loss rate: compare the plan's average calories with the client's estimated maintenance (Mifflin-St Jeor times an activity factor) and state the projected loss. Tell the dietitian when a goal is faster than about 1 percent of body weight a week, or faster than is wise for the condition (hypothyroid, gout), and let them decide.

### 3. Photos and video (optional)
One 4:3 overhead photo per recipe key, saved as `KEY.jpg`. Prompt style and the "no off-list garnish" rule are in `references/photo-prompts.md`. Meals without a photo render fine. Optional hero image, poster image and a short intro video (MP4, 1080p) can be passed in step 4. The intro animation template and render steps are in `assets/intro/README.md`.

### 4. Build the page
```
python scripts/build_webapp.py --plan plan_out/plan.json --db plan_out/db.json \
  --profile assets/profiles/<profile>.json --client "Name" --start YYYY-MM-DD --out plan.html \
  [--images photos/ --hero hero.jpg --poster poster.jpg --video intro.mp4]
```
Then publish `plan.html` as an Artifact (load the artifact-design skill first; the file already has its own title, tokens and light/dark themes). Keep the same file path when updating so the link stays the same.

Features already in the template: week and day selector with swipe, macro ring, FatSecret-style Nutrition Facts, meal cards with ingredient lists, month calendar coloured by carb tier, weekly shopping lists that update with swaps, a Foods tab (allowed foods with equal-macro amounts and caps) and a Rules tab. Swap logic is described in `references/swap-rules.md`.

### 4b. Food swap guide (when the dietitian wants alternative selections)
`python scripts/build_swap_guide.py --foods assets/foods/<profile>_foods.json --client Name --out swap_guide.html --pdf swap_guide.pdf --intro "..." --footer "..."` builds a visual page and a 4-page PDF with about 15 foods each for protein, carbs, vegetables and healthy fats. Every card is FatSecret-style (calories, a protein/carb/fat calorie bar, total fat with saturated, total carbs with fiber, sugars and net carbs, protein) plus the amount that equals one swap (25 g protein, 20 g carbs, 10 g fat, or 1 cup of vegetables), limit tags and a per-100 g toggle. A swap finder converts any food and amount into every alternative in the same category. Edit the foods JSON for a new profile: keep the 15-per-category target, only foods that fit the client's rules, and USDA-based values. Say that the values are USDA-based estimates (the reference data FatSecret uses for generic foods) and that brand items vary.

### 5. Deliver in the formats the client can actually open
- A web page cannot offer a download button (the viewer blocks downloads). Say so, and send files separately.
- Send a **PDF** for saving and printing: `python scripts/build_pdf.py --plan plan_out/plan.json --db plan_out/db.json --profile assets/profiles/<profile>.json --client Name --start YYYY-MM-DD --images photos/ --hero hero.jpg --out plan.pdf` (US Letter, cover, rules, month calendar, two weeks of shopping per page, then **3 days per page**, each day a band with its meals side by side and small photos: about 17 pages for 30 days). It needs Node with Playwright.
- **PDF page budget (client rule):** never one page per day. Keep 3 days per page and 2 shopping weeks per page; a 30-day plan should land near 17 pages, not 39. Check one day page and one shopping page for clipped text before sending.
- Also send the page itself as an HTML file (`Name_Plan_Offline_App.html`) so the client can save it and open it offline in Chrome or Safari.
- If a PowerPoint is requested, remember phone PowerPoint struggles with large files: keep it under about 10 MB, avoid heavy animation, and give the file a unique name ending in `.pptx` (a duplicate download that becomes `name.pptx (2)` no longer ends in `.pptx` and will not open).
- Mention that the page link is private until the owner shares it from the Share menu.

## Profile: halal omnivore, carb-cycled to training, keto + 16:8 options (v6)
Engine `scripts/plan_engine_halal_carbcycle.py`. Three day tiers: **HIGH** (training days, total carbs hard-capped under 100 g, about 95 g), **LOW** (about 45 g), **KETO** (net carbs 20 g or less, fat-forward recipes, meals timed for a 16:8 window 12 to 8 PM). The week pattern, kcal per tier and protein floors are in `CFG`. No pork, pork gelatin or alcohol anywhere; whey is halal-certified; shrimp is flagged as swappable. Protein tops up with whey only when a day is short. Keto days use their own recipe pool (`KB`, `KL`, `KD`) so they are real keto meals, not low-carb meals with the carb side removed.

## Themes and the studio project (v6)
Each client gets a different look: `themes/themes.json` holds 8 themes (palette, font pair, title-slide layout left/right/center, corner radius). `studio.py build <client>` runs engine, photos, themed intro poster, deck, PDF and QA in one command; `studio.py qa` checks carb caps, protein floors, forbidden foods, missing photos and PDF page count from the client's `client.json`. See the project README.

## Clinical guardrails
- Thyroid clients: medication on waking with water only, food and coffee 30 to 60 minutes later, iron, calcium, magnesium and fiber supplements 4 hours after the dose. Biotin interferes with thyroid labs: pause 3 to 5 days before a draw. The physician changes the dose, never the client; weight loss can change the dose needed.
- Keto and fasting with hypothyroidism: re-check TSH, free T4 and free T3 at 8 to 12 weeks with lipids (LDL can rise), keep calories near the plan (about 1,300 and up on a slow thyroid), use the 19:5 window on rest days only, add salt (iodized) and electrolytes for the first two weeks, and tell the client to stop a fast and eat if dizzy, shaky or with a racing heart.
- Soy and cruciferous vegetables: when a client must avoid them, they must not appear anywhere (menus, swap guide, notes, app text except as exclusions). Run a text scan of every output file before sending.
- Macros are estimates (about 5 to 10 percent). Say so, and tell the dietitian to confirm labs, medications and kidney function with the treating physician.
- Rapid weight loss can raise urate for a while. Keep projected loss near 2 lb a week or less for gout clients.
- Never include foods from the client's Avoid list, even as a swap option. The swap sheet warns about cap breaches but never offers other-category foods.

## Files
- `scripts/plan_engine.py` (gout), `scripts/plan_engine_vegan.py` (vegan plus eggs, hypothyroid) and `scripts/plan_engine_vegan_keto.py` (soy-free keto with fasting windows): plan generators and ingredient databases.
- `scripts/build_pdf.py` and `scripts/print_pdf.js`: printable PDF.
- `scripts/build_swap_guide.py`, `assets/swap_guide_template.html`, `assets/foods/*.json`: visual food swap guide.
- `assets/profiles/*.json`: page text, rules, caps and limits for each profile.
- `assets/intro/`: optional intro animation.
- `scripts/build_webapp.py`: assembles the HTML page (needs Pillow).
- `assets/webapp_template.html`: the page template, with placeholders the build script fills.
- `references/gout-rules.md`, `references/carb-cycling.md`, `references/swap-rules.md`, `references/photo-prompts.md`.
