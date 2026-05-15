---
name: tweak
version: 1.0
updated: 2026-05-15
description: Inject a live VL-01 Dark Glassmorphism controls panel into any Space Age HTML output — cinematic landing pages, dashboards, Shopify sections, visualizers. Auto-scans the page, gives 5 (light) or 10 (max) sliders for speed, type sizes, density, glow, roundness, saturation, and SA-specific CSS vars (--blur-strength, --accent-blue, --glass-opacity). Bakes values back into source CSS and removes itself. Triggers on "/tweak [file]", "/tweak max [file]", "tweak this", "add tweak panel", "bake tweak", "tweak strip".
---

# SA-Tweak: Live HTML Controls Panel
## Space Age AI Solutions Edition — VL-01 Dark Glassmorphism

## What This Does

Injects a live slider panel into any single-file HTML output. Dial in changes in the browser. Bake the values back into source CSS. Panel self-destructs after bake. Works on cinematic landing pages, dashboards, music visualizers, Shopify preview files — any SA HTML output.

**SA upgrade:** Panel uses VL-01 Dark Glassmorphism aesthetic (electric blue accent, `#050508` base, JetBrains Mono labels, DM Sans body). Adds 3 SA-specific sliders: blur strength, glass opacity, and accent blue intensity — mapped to your `--blur-strength`, `--glass-opacity`, and `--accent-blue` CSS vars.

---

## Triggers

| Command | Action |
|---|---|
| `/tweak [file]` | Default — light mode, 5 sliders |
| `/tweak light [file]` | Explicit light, 5 sliders |
| `/tweak max [file]` | Max mode, 10 sliders including SA vars |
| `tweak this` | Infer file from context |
| `bake tweak` / `tweak bake` | Apply dialed values to source + remove panel |
| `tweak strip` | Remove panel without baking (revert) |

---

## Two Levels

| Level | Sliders | Use When |
|---|---|---|
| **light** | 5 | Quick visual dial-in. Default. |
| **max** | 10 | Full granular control including SA glass/blur/accent vars |

### Light Tier (always 5)
1. **Speed** — multiplies `animation-duration` on all animated elements
2. **Title Size** — scales `h1` / `.display` / `.hero-title` font-size
3. **Body Size** — scales `body` / `p` / `.body` font-size
4. **Density** — multiplies `padding` / `gap` on layout containers
5. **Visual Scale** — `transform: scale()` on `svg`, `canvas`, `.visual`, `.hero-image`

### Max Tier (5 light + 5 more)
6. **Blur Strength** — `--blur-strength` var + `backdrop-filter: blur(Xpx)` on glass panels (SA VL-01 target: 40px default)
7. **Glass Opacity** — `--glass-opacity` var + background alpha on glass panels (SA VL-01: rgba(255,255,255,0.03–0.08))
8. **Accent Glow** — `filter: drop-shadow + brightness` on accent / hero areas
9. **Roundness** — scales `border-radius` everywhere > 0
10. **Saturation** — `filter: saturate()` on body

Panel auto-skips sliders whose targets don't exist. Reports "8 of 10 sliders active" if some are unavailable.

---

## Workflow

### Step 1 — Inject

1. Read `panel.html` from this skill folder
2. Read the target HTML file
3. Check for existing `<!-- TWEAK:START -->` marker — if found, do NOT inject again; (re)open file instead
4. Insert panel bundle immediately before last `</body>`, wrapped in `<!-- TWEAK:START -->` ... `<!-- TWEAK:END -->` markers
5. If max mode: set `data-tweak-level="max"` on `#tweak-panel`
6. Save file
7. Open in browser
8. Tell user: panel is live, hit **T** to toggle, dial in, say "bake" when done

### panel.html Missing — Fallback Procedure

If `panel.html` is not present in this skill folder:
1. **Do not inject a blank or partial panel.** Notify the user: "`panel.html` not found in `user/tweak/`. The tweak panel cannot be injected until this file is present."
2. Offer two options:
   - **A)** User provides `panel.html` — they paste or upload the file, then retry `/tweak`.
   - **B)** Rebuild the panel inline — generate a minimal VL-01-compliant panel bundle directly in the target file, clearly marked `<!-- TWEAK:INLINE-FALLBACK -->` instead of `<!-- TWEAK:START -->`. Treat all bake and strip operations identically.
3. Log which option was chosen so the fallback path is auditable.

### Step 2 — User Tweaks (in browser)

Panel behavior:
- Auto-scans DOM on load, picks sliders based on what exists
- Per-slide mode if `document.querySelectorAll('.slide').length >= 2` and scroll-snap is active
- Otherwise page mode
- **T** = toggle panel | **R** = reset active target | **B** = open bake modal

### Step 3 — Bake

User hits **B** or says "bake". Modal appears with patch JSON:

```
BAKE_TWEAK_v1
{
  "mode": "page" | "slide",
  "values": { "speed": 1.4, "blurStrength": 1.2, ... },
  "perSlide": { ... }
}
```

User copies, pastes back to Claude. Claude then:
1. Reads source HTML
2. For each non-default value: edits CSS rules in-place OR injects `<style id="tweak-baked">:root { ... }</style>` block (in-place preferred)
3. Strips panel block using safe procedure (see below)
4. Saves file
5. Verifies strip: `grep -c "TWEAK\|tweak-panel\|tweak-script\|bakedToCss\|renderRows" file.html` → must return 0
6. Confirms: "Baked X changes, panel removed. Reload."

### Bake Strategy
- **Prefer in-place edits** — multiply existing values directly
- **SA CSS vars priority:** if source uses `--blur-strength`, `--glass-opacity`, `--accent-blue` → edit the `:root` block directly
- **Fall back to override block** for dense/computed sources
- For animation Speed: rewrite each `animation-duration` directly (CSS vars don't compute reliably across browsers)

---

## Safe Strip Procedure (CRITICAL)

**The trap:** the panel's `<script>` contains the literal string `TWEAK:END` and `-->` inside a JS regex. Naive lazy regex will cut at the wrong spot, leaving orphaned JS rendered as visible text. This has happened. Don't repeat it.

**Use one of these:**

**A. Line-range delete (most robust):**
```bash
grep -n "<!-- TWEAK:START\|<!-- TWEAK:END" path/to/file.html
sed -i "${START},${END}d" path/to/file.html
```

**B. Node strip with anchored regex (cross-platform):**
```js
const fs = require('fs');
const p = 'path/to/file.html';
let s = fs.readFileSync(p, 'utf8');
s = s.replace(/\n?<!--\s*TWEAK:START[\s\S]*?<!--\s*TWEAK:END\s*-->\n?/, '\n');
fs.writeFileSync(p, s);
```
Note: `<!--\s*TWEAK:END\s*-->` is the anchor — the JS-internal occurrence does NOT have `<!--` immediately before it.

**Always verify:**
```bash
grep -c "TWEAK\|tweak-panel\|tweak-script\|bakedToCss\|renderRows" path/to/file.html
# Expected: 0
```

---

## Auto-Scan Priority Order

| Priority | Slider | Skip If |
|---|---|---|
| 1 | Speed | No animated elements |
| 2 | Title Size | No `h1` / `.display` / `.hero-title` |
| 3 | Body Size | Never skipped |
| 4 | Density | No `.slide-content`, `section`, `main`, `.container` |
| 5 | Visual Scale | No `svg`, `.visual`, `.hero-image`, `img.hero` |
| 6 | Blur Strength | No `--blur-strength` var or `backdrop-filter` elements |
| 7 | Glass Opacity | No `--glass-opacity` var or glass panel classes |
| 8 | Accent Glow | No `h1`, `.display`, `.accent`, `[data-accent]` |
| 9 | Roundness | Fewer than 3 elements with `border-radius > 0` |
| 10 | Saturation | Never skipped |

---

## SA-Specific Slider Details

### Blur Strength (Slider 6)
- Target: `--blur-strength` CSS var + any element with `backdrop-filter: blur()`
- Default: 1× (40px per VL-01)
- Range: 0.25×–2× (10px–80px)
- Bake: update `--blur-strength` in `:root` block; rewrite `backdrop-filter: blur(calc(var(--blur-strength, 40px)))` if var not present

### Glass Opacity (Slider 7)
- Target: `--glass-opacity` CSS var + `.glass`, `.card`, `.panel` background alpha
- Default: 1× (VL-01 baseline)
- Range: 0.2×–3×
- Bake: update `--glass-opacity` in `:root`; if not present, rewrite `rgba(255,255,255,X)` values in glass panel backgrounds

### Accent Glow
- SA override: glow color uses electric blue (`rgba(0, 120, 255, ...)`) NOT orange
- Applied to: `.hero-title`, `.accent`, `[data-accent]`, `.display`

---

## Panel Aesthetic (VL-01)

The injected `panel.html` uses Space Age standards:
- Background: `rgba(5, 5, 8, 0.92)` with `backdrop-filter: blur(40px) saturate(180%)`
- Border: `1px solid rgba(255,255,255,0.08)` + specular `inset 0 1px 0 rgba(255,255,255,0.12)`
- Accent color: electric blue (`#0078FF`) — NOT orange
- Slider fill: electric blue gradient
- Fonts: JetBrains Mono (labels/values), DM Sans (body text)
- Shadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`
- Border radius: 16px panel, 12px toggle button

---

## Files in This Skill

- **SKILL.md** — this file, the full workflow
- **panel.html** — the self-contained CSS + HTML + JS bundle. Injected into target files. Contains VL-01-styled panel with SA-specific slider support. **Required for injection — see fallback procedure above if missing.**

---

## Rules (Do Not Break)

1. Injected bundle MUST be wrapped in `<!-- TWEAK:START -->` ... `<!-- TWEAK:END -->` markers
2. Never inject twice — check for START marker first
3. Bake: prefer in-place CSS edits over override blocks; SA CSS vars get priority
4. After bake: ALWAYS remove panel using the safe strip procedure
5. ALWAYS verify strip with grep — expect 0 matches
6. Warn user before `tweak strip` that unbaked changes will be lost
7. Browser never modifies source — all mutations go through Claude (patch-back flow) or user download
8. Default level is **light** — never surprise with 10 sliders unless `max` is requested
9. Accent color is always electric blue on SA outputs — never orange
