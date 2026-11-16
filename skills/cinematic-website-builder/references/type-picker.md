# Type picker (G3)

```bash
node scripts/type-specimens.mjs handoff/type-inputs.yaml --taste taste-profile.yaml --spec handoff/design-spec.md [--mode auto] [--choose <id>]
```

**Inputs** (`type-inputs.yaml`): `brand_fonts` (a brand guide **overrides** the library), `reference_fonts`
(detected on moodboard references), `sector`, personality dials `warmth` (warm↔technical), `classic`
(classic↔modern), `loud` (calm↔loud), `custom_type_refs` (style numbers from `type-refs/INDEX.png`), and the
**real copy** (eyebrow, jumbo word, headline, H2, body, button).

**Library** `references/type-pairings.yaml`: 37 pairings (Fontshare ITF-FFL or Bunny OFL, every one verified to
resolve). Tagged by mood, sectors, weights, licence, variable, dials, gentle/bold, and `jumbo {ok, advance}`.
Banned: Inter, Poppins, Lato, Fraunces, Instrument Serif. Overused (−8): Montserrat, Roboto, Open Sans,
Playfair Display, Space Grotesk, DM Sans. The trust-sector style ban (no liquid-glass / 3D goo / distorted display)
is enforced. Chuma's UI8 font library (Drive "UI8 Extracted Assets - Batch 2", `/workspace/ui8-inventory.csv`) is
an optional source for display only, after reading each licence. Never redistribute the files.

**Scoring**: dial fit ×40 · sector +25 · trust: bold −15 / gentle +5 · on references +10 · liked family +6 ·
overused −8 · liked pairing +15 · rejected −30 · > 4 files or > 2 families −10 · jumbo signature: jumbo-capable +8.

**Output** (`handoff/type/`): 3 specimen cards (jumbo word, eyebrow, headline, H2, body, button) as PNG at
1440 and 390, `type-review.png`, `type-pick.yaml` (`declared_families`, `declared_weights`, shortlist with
fallback metrics, `custom_type` top-3 styles), `type-tokens.css` (fallback `@font-face` with measured
size-adjust / ascent / descent overrides + `:root` tokens `--t-hero … --t-small`, `--t-jumbo`,
`--track-jumbo`, `--lh-jumbo`, `--jumbo-advance`, tracking, leading, measure). With `--spec`, the type block in
`design-spec.md` is replaced. Auto mode picks the top score and records why.

**verify --type**: only declared families/weights may load; h1–h3 must render in a declared, loaded family
(no stray system fonts); body text contrast ≥ 4.5:1 on its resolved background.

Picks feed the taste profile (`type.liked_pairings`, `liked_families`, `passed_over`, `custom_type_liked`).
Custom-type styles: `references/custom-typography.md`.
