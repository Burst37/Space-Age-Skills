---
name: space-age-typography
description: Senior-developer typography and spacing system for Space Age Agent OS. Covers universal design science (modular type scales, 8pt grid, optical corrections, visual hierarchy theory) and how those principles map to the four-font hierarchy (Orbitron/Rajdhani/DM Sans/JetBrains Mono). Use this before touching any UI component — it teaches the WHY behind every number so you can make correct decisions in novel situations, not just copy-paste values from existing code.
license: MIT
---

# Space Age Typography — Senior Developer Edition

## How to Use This Skill

Most typography skills hand you a table of sizes and say "use these." That works until you hit a new component the table doesn't cover, and you guess wrong.

This skill works differently. **It teaches you the science first, then shows how it maps to this project.** Once you internalize the science, every new component has a correct answer — you derive it, you don't guess.

Read the principles once. Refer to the reference tables when you need to move fast.

---

## PART 1 — THE SCIENCE: Why Design Systems Have Rules

### 1.1 Modular Type Scales: The Mathematics of Harmony

Every good type system uses a single ratio to derive all sizes from a base. This is borrowed from music theory — "Major Third," "Perfect Fourth" are interval names because proportional ratios create the same harmony in visual space that they do in sound.

**The ratio controls how dramatic your hierarchy feels:**

```
Ratio           Name              Use Case
──────────────────────────────────────────────────────────────────────
1.067           Minor Second      Dense documents, legal UI, maximum text
1.125           Major Second      Content-heavy apps, minimal hierarchy needed
1.200           Minor Third       Standard SaaS dashboard, moderate contrast
1.250           Major Third       High-density developer tools, strong hierarchy ✓
1.333           Perfect Fourth    Content sites, marketing pages, editorial
1.414           Augmented Fourth  Promotional, landing pages
1.500           Perfect Fifth     Posters, large format, max drama
1.618           Golden Ratio      Luxury/portfolio, generous whitespace only
```

**Space Age Agent OS uses an ~1.25 scale (Major Third)** — appropriate for a high-density developer OS with many UI elements in view simultaneously.

Starting from a 9px base (Orbitron micro label), the scale runs:
```
Step    Size    Usage
 0       9px    Micro labels (Orbitron/Rajdhani pill text)
 1      11px    Secondary metadata (JetBrains Mono, small Rajdhani)
 2      13px    Standard labels, card subtitles (DM Sans, Rajdhani)
 3      16px    Body/UI text (DM Sans default)
 4      20px    Small headings
 5      25px    Section titles
 6      32px    KPI numbers (JetBrains Mono large)
 7      40px    Hero KPIs
 8      48px+   Page hero titles (Orbitron clamp)
```

**The key rule:** Never use a size between steps. `12.5px` is not a step. If 11px is too small and 13px is too big, your layout has a problem — fix the layout, not the type size.

---

### 1.2 The 8pt Grid: Spacing as Structure

In dark glass UIs, **spacing IS the structure**. Shadows don't work on dark backgrounds (they blend in). The only thing separating elements is space and surface lightness.

The 8pt grid is the industry standard established by Apple (HIG) and Google (Material Design). Every spacing value in a well-built UI is a multiple of 8px.

**The full spacing atom sequence:**

```
Token    Value    Physics
──────────────────────────────────────────────────────────────────────────
atom      2px     Absolute minimum — used for border-width only
micro     4px     Icon-to-label, tag internal padding, LED-to-text
tight     8px     Component internal gaps (items inside a card header)
base     12px     Standard card internal padding variant, grid gap
standard 16px     Default component padding (buttons, inputs, standard cards)
relaxed  24px     Large card padding, KPI cards, section-within-section
section  32px     Between major page sections
page     48px     Page top/bottom padding
hero     64px+    Marketing/hero sections (not common in agent OS)
```

**Why multiples of 8?**
- Retina (2x) screens: even numbers always render on-pixel
- Base math: 8 divides evenly by 2 and 4 for intermediate values
- Gestalt proximity: consistent multiples make "grouped" vs "separate" visually obvious

**The Internal ≤ External Rule:**
Padding inside an element must be ≤ margin/gap around it. If a card has `padding: 16px` (standard), the gap between cards must be `≥ 16px`. Violating this makes items look like they belong to adjacent elements instead of to themselves.

---

### 1.3 Visual Hierarchy in Dark Glass UIs

Visual hierarchy answers one question: **"What should the user look at first?"**

In light UIs, hierarchy uses size + weight + shadow (elevation). In dark glass UIs, **shadows are invisible** — a box-shadow on `rgba(0,0,0,0.55)` against `#03030a` is imperceptible. The hierarchy tools available are:

1. **Size** — bigger = more important (always works)
2. **Weight** — heavier = more important (works well)
3. **Color temperature** — warm/bright accent = CTA/alert; muted = secondary
4. **Surface lightness** — `rgba(255,255,255,0.07)` vs `rgba(255,255,255,0.03)` creates depth
5. **Opacity of text** — `var(--fg)` = primary, `var(--fg-dim)` = secondary, `var(--fg-muted)` = tertiary
6. **Letter-spacing** — tight = intimate/close reading; loose = labeled/systemic
7. **Font family** — a display font (Orbitron) visually dominates body text (DM Sans) at the same size

**The Silhouette Test:** Squint until the screen blurs. If two adjacent text elements look the same weight/size in blur, they don't have enough contrast. Add a half-step of size difference, a weight shift, or a color tier change. Never fix hierarchy with arbitrary sizes.

**The "One Job" Rule:** Every text element has exactly one job — title, label, value, description, status. Once you know the job, the font, size, weight, and color follow mechanically from the system. If you're unsure what job text does, the component has an architecture problem.

---

### 1.4 Letter-Spacing: The Optical Correction

Letter-spacing compensates for a biological limitation: human vision is less sharp at small sizes and perceives shapes differently at large sizes.

**The universal rule:**
```
Size Range      Tracking        Why
──────────────────────────────────────────────────────────────────────────
48px+           -0.02 to -0.04em   Large glyphs feel too loose; tighten
24–47px         -0.01 to 0em        Near-neutral; let the typeface decide
14–23px         0 to +0.05em        Body range; depends on font design
10–13px         +0.05 to +0.15em    Getting small; add air for legibility
8–9px           +0.15 to +0.25em    Very small; heavy tracking saves readability
```

**Exception for monospaced data (JetBrains Mono at large sizes):**
Digits in monospaced fonts already have fixed-width metrics. At 28px+, apply `letter-spacing: -0.02em` to make numbers read as a block rather than individual cells. This is why KPI numbers feel "tight" in high-quality dashboards — it's intentional compression.

**Exception for uppercase labels (Rajdhani):**
Uppercase glyphs are designed for mixed-case text. In all-caps context they crowd each other. Always add `+0.15em` minimum for uppercase labels at any size.

---

### 1.5 Line Height: Controlling Reading Rhythm

Line height is directly proportional to line length and font design. The rules are derived from typographic research, not aesthetic preference.

```
Context                         Line Height    Why
──────────────────────────────────────────────────────────────────────────
Display/hero (Orbitron 24px+)   1.0–1.05       Display fonts need no leading
Short headings (2–4 words)      1.1–1.2        No multiline wrap expected
UI labels (uppercase, short)    1.0–1.2        Labels don't wrap
Body text (DM Sans, 13–16px)    1.5–1.6        WCAG 2.2 min: 1.5
Long descriptions (12px)        1.6–1.7        Small text at longer lines needs more air
Monospace data values           1.0–1.1        Data doesn't wrap; vertical grid
```

**The WCAG rule:** Any text in a conversational or readable context (not a label) must support `line-height: 1.5` minimum per WCAG 2.2 SC 1.4.12. Agent chat, descriptions, and role text all qualify.

---

### 1.6 Font Weight as Semantic Signal

Font weight is not decoration — it's a signal that says "this matters more." In a dark glass UI with limited color range, weight is one of the most powerful hierarchy tools.

```
Weight    Semantic Meaning          Rule
──────────────────────────────────────────────────────────────────────────
900       Maximum brand identity    Page titles only (Orbitron hero)
800       Named entity / proper     Agent names (never for generic text)
700       System label / chrome     All Rajdhani labels, Orbitron card headers
600       Active state              Active nav items, prominent data values
500       Medium emphasis           Rare; only when 400 and 600 are both needed
400       Default readable          All body text, inactive UI
300       Intentionally quiet       Not used in this system (insufficient contrast)
```

**Never use `fontWeight: 700` on DM Sans body text** — it converts readable content into a heading and breaks hierarchy. The only Rajdhani weight is 700. The only DM Sans weights are 400 (body) and 600 (active nav).

---

## PART 2 — THE SYSTEM: Space Age Agent OS

### 2.1 The Four-Font Architecture

This project uses four fonts, each with exactly one job. They are not interchangeable.

| Font | Category | Job | Selection Reason |
|------|----------|-----|-----------------|
| **Orbitron** | Geometric display | Brand identity, named things | Geometric cuts read as "space tech" — designed for this type of interface |
| **Rajdhani** | Condensed label sans | UI chrome, all-caps labels | Condensed proportions = horizontal efficiency; designed for labeling systems |
| **DM Sans** | Humanist geometric | Human-authored readable text | Best legibility for mixed-case reading; warm but not informal |
| **JetBrains Mono** | Monospaced | Machine-generated values, data | Fixed-width = numbers align perfectly in columns; renders code faithfully |

**The decision test (in order):**
1. Is it a number, IP, version string, model name, cost, code, or any machine-produced value? → **JetBrains Mono**
2. Is it ALL CAPS, a label naming a section/state/status, or button text? → **Rajdhani**
3. Is it a proper name — an agent, product, or brand? → **Orbitron**
4. Is it human-written sentence, description, or readable content? → **DM Sans**

If you're unsure, ask: "Could a machine have written this?" Data → Mono. "Is this labeling something?" → Rajdhani. "Is this a name?" → Orbitron. "Is this prose?" → DM Sans.

---

### 2.2 Orbitron — Complete Reference

```
Context                     Size              Weight   Tracking   Color
──────────────────────────────────────────────────────────────────────────────
Page H1 hero               clamp(26px,3.5vw,48px)  900  0.04–0.05em  var(--fg)
Page H1 standard           16–18px               900  0.05–0.1em   var(--fg)
Agent name (large tile)    17px                  800  0.04em       var(--agent-{id})
Agent name (standard tile) 13px                  800  0.08em       var(--agent-{id})
Card/column header         9px                   700  0.15em       var(--fg-muted)
Section sub-label          9px                   700  0.1em        agent color
Logo wordmark              10px                  700  0.12em       var(--fg)
Micro label (in pill/tag)  8–9px                 700  0.15em       agent color
```

**Orbitron rules derived from first principles:**
- Weight never below 700 — Orbitron at `400` has no backbone; it looks broken
- Tracking increases as size decreases (optical correction: small display text needs air)
- `lineHeight: 1` or `1.05` always — Orbitron is pure display, not reading text
- Color is either `var(--fg)` (titles) or `var(--agent-{id})` (named things) — never inline hex
- Never on body paragraphs — Orbitron has zero readability above ~3 consecutive words

---

### 2.3 Rajdhani — Complete Reference

```
Context                     Size    Weight   Tracking   Transform  Color
──────────────────────────────────────────────────────────────────────────────
.section-label CSS class    10px    700      0.25em     uppercase  var(--orange)
Section label (inline)       9px    700      0.25em     uppercase  rgba(255,255,255,0.25)
KPI inner label              8–9px  700      0.22em     uppercase  var(--fg-muted) or --orange
Status badge                 9px    700      0.22em     uppercase  var(--green) or --fg-muted
.btn-primary                11px    700      0.15em     uppercase  #fff (on orange bg)
.btn-ghost                  10px    700      0.12em     uppercase  var(--fg-dim)
Nav label (active)          12px    600      —          mixed-case var(--fg)
Nav label (inactive)        12px    400      —          mixed-case var(--fg-dim)
```

**Rajdhani rules derived from first principles:**
- `textTransform: 'uppercase'` is mandatory for all labels (nav items excepted) — the condensed letterforms read as labels in all-caps context, as noise in mixed-case
- `fontWeight: 700` always for labels — condensed sans at lighter weights becomes illegible at 8–10px
- Letter-spacing 0.22–0.25em for labels (optical correction: uppercase needs air) — 0.12–0.15em for buttons (slightly larger size, less correction needed)
- Nav items use mixed-case because they are navigational text, not system labels — the same font is allowed at lower weight for this role
- `var(--orange)` is the primary section-label color because it is the brand CTA accent — not decoration
- `fontSize: 14px` on a Rajdhani label is always wrong — at that size DM Sans is the correct font

---

### 2.4 DM Sans — Complete Reference

```
Context                     Size    Weight   Line Height  Color
──────────────────────────────────────────────────────────────────────────────
Body default                14px    400      1.6          var(--fg)
Chat messages               14px    400      1.6–1.7      var(--fg)
Goal/task items             13px    400      1.5          var(--fg)
Card role/subtitle (large)  13px    400      1.4          rgba(255,255,255,0.45)
Card role/subtitle (std)    11px    400      1.4          rgba(255,255,255,0.45)
Pipeline description        12px    400      1.5          var(--fg-muted)
Nav labels (active)         12px    600      —            var(--fg)
Nav labels (inactive)       12px    400      —            var(--fg-dim)
Inputs / forms              12px    400      —            var(--fg)
Kanban card title           11px    400      1.4          var(--fg)
Swarm agent role            10px    400      1.4          var(--fg-muted)
```

**DM Sans rules derived from first principles:**
- DM Sans is optimized for screen reading — use it anywhere a human wrote the text
- `lineHeight: 1.6` for anything paragraph-like (WCAG compliance; readable rhythm)
- `lineHeight: 1.4` for tight card descriptions (shorter strings, controlled layout)
- Never use `letterSpacing` > `0.05em` on DM Sans — it's not a label font; tracking looks wrong
- Never `textTransform: 'uppercase'` — DM Sans is mixed-case reading text, not a label
- Color hierarchy: `var(--fg)` = primary → `var(--fg-dim)` = secondary → `var(--fg-muted)` = supporting
- Minimum 10px. Below 10px, switch to JetBrains Mono or Rajdhani (DM Sans becomes a blur)

---

### 2.5 JetBrains Mono — Complete Reference

```
Context                     Size    Weight   Tracking    Color
──────────────────────────────────────────────────────────────────────────────
KPI big numbers (28px+)     28px    600      -0.02em     agent/accent color
Live readouts (time, count) 18px    600      +0.04em     var(--orange)
Cost/model values           14px    600      —           accent color
Tag/badge text              10px    400      —           var(--fg-muted)
Card data badges            10px    400      —           rgba(255,255,255,0.3)
Data counters/labels        10px    400      —           var(--fg-muted)
Small metadata labels       9px     400      +0.2em      var(--fg-muted) or --orange
Micro (IP, version, tag)    8–9px   400      —           var(--fg-muted)
```

**JetBrains Mono rules derived from first principles:**
- Negative tracking (`-0.02em`) at 28px+ is intentional — monospaced digits already have padding built in; tightening makes them read as a block, not a string of cells
- Positive tracking at 8–9px (`+0.2em`) — same optical correction as all small text
- `lineHeight: 1` for standalone data values — they're not prose, they don't need leading
- `fontWeight: 600` for values you want read; `400` for tags and metadata
- Never use JetBrains Mono for agent names, section titles, or button text — it reads as terminal output
- The `.data-value` CSS class covers the standard big-number case (28px, weight 600, -0.02em)

---

### 2.6 Color Hierarchy — Three Tiers + Accents

Text color is not aesthetic — it conveys information priority. Every text element belongs to exactly one tier.

```
Token                    Value              Meaning                    When to Use
────────────────────────────────────────────────────────────────────────────────────────
var(--fg)               #f0f4ff            Primary — this matters       Titles, body, active items
var(--fg-dim)           #9ba3c4            Secondary — supporting       Inactive nav, secondary labels
var(--fg-muted)         #5a618a            Tertiary — background info   Metadata, decorative headers, roles
var(--orange)           #ff6b00            Brand accent — action        Section labels, CTAs, live readouts
var(--agent-{id})       per-agent          Identity — named entity      Agent names and their accent usages
rgba(255,255,255,0.45)  ~half-white        Card body text               Inline descriptions in glass cards
rgba(255,255,255,0.3)   ~translucent       Data tags                    JetBrains Mono badge text
rgba(255,255,255,0.25)  ~ghost             Decorative labels            Rajdhani visual-divider headers
```

**The non-negotiable rule:** No pure `#ffffff` outside button text. Pure white breaks the dark glass aesthetic — use `var(--fg)` which is `#f0f4ff` (slightly blue-tinted warm white that sits in the context).

**The accent rule:** One accent color at a time per viewport region. Do not mix `--orange`, `--cyan`, `--purple`, and `--green` as decorative choices within the same card. Accent colors are semantic signals: orange = action, green = online/success, cyan = Codex agent, etc.

---

## PART 3 — THE ARCHITECTURE: Proven Patterns

### 3.1 The Three-Tier Section Header

Every section in the app uses this exact sequence. Skipping a tier breaks the visual grammar.

```
Tier 1 — Rajdhani section label     ← "What system am I looking at?"
         marginBottom: 6px

Tier 2 — Orbitron title             ← "What is the specific thing?"
         marginBottom: 4px (if subtitle follows), else 0

Tier 3 — DM Sans description        ← "What does it do?" (optional)
         fontSize: 12px, color: var(--fg-muted)

Then: marginBottom: 20–28px before content begins
```

**Why this works:** Rajdhani in orange primes the reader for a category. Orbitron amplifies the name as identity. DM Sans provides context without stealing weight. This sequence fires three different cognitive recognition channels sequentially — label → name → description.

```tsx
<div style={{ marginBottom: 28 }}>
  <div className="section-label" style={{ marginBottom: 6 }}>Space Age AI Solutions</div>
  <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 900, letterSpacing: '0.1em', marginBottom: 4 }}>LEAD GEN PIPELINE</h1>
  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
    Google Maps → Scraper → Cinematic HTML → Outreach
  </div>
</div>
```

---

### 3.2 The Five-Level Padding Scale

```
Level       Padding         Context                           8pt alignment
──────────────────────────────────────────────────────────────────────────────
Page        28px 32px       Outer wrapper (all routes)        8×3.5 / 8×4
Large card  22px 24px       Hero tiles, primary feature cards 8×2.75 / 8×3
Standard    16px 18–20px    Regular glass cards               8×2 / 8×2.25
Compact     12px 14–16px    Dense grids (5+ items)            8×1.5 / 8×1.75
Tight       8px 10–12px     Sub-elements inside cards         8×1
Micro       4–5px 6–8px     Inline badges, status chips       8×0.5
```

**How to choose:**
Start at Standard (16px 18px). Scale up to Large if the card contains a KPI or hero number. Scale down to Compact if you have 5+ items in the grid. Scale down to Tight for the *contents* of a card, not the card itself. Micro is reserved for inline chips only.

**The diagnostic:** If a card looks cramped, the padding is wrong (too tight) OR the content is too dense (needs splitting into two cards). Never add extra padding as a band-aid for content overflow.

---

### 3.3 Internal Card Rhythm

Inside a card, these gaps control how elements relate to each other:

```
Between major sections (card top/bottom zones):  14px
Between rows (standard card elements):           10px
Between tight inline items (LED + name + badge):  8px
Between sub-items (role → model/context):         5–6px
Between label and its value:                      4px
Between micro items:                              2–3px
```

These are derived from the 8pt grid at smaller steps (4pt granularity for internal sub-elements).

---

### 3.4 Grid and Stack Gaps

```
Between page-level sections:    28px   (distinct topics: different context)
Between sections (tight pages): 24px   (same page, related sections)
Grid gap (standard):            12px   (agent grid, model stack)
Grid gap (dense):               8–10px (swarm agents, quick access)
List gap (standard):             8px   (goals list)
List gap (tight):                6px   (kanban cards within column)
Inline flex gap:                 8px   (LED + text in a row)
```

**The rule underlying these numbers:** Gap encodes relatedness. `28px` = "different topic." `12px` = "same topic, different items." `6–8px` = "same item, different properties." If users can't tell where one group ends and another begins, the gaps are wrong.

---

### 3.5 Border Radius Scale

```
Radius   Context                                      Why
─────────────────────────────────────────────────────────────────────────
14px     Hero/large glass cards (MissionControl)      Large card → generous rounding
10px     Standard glass cards (model stack, pipeline) Standard panel
8px      Standard panels (KPI, progress bar, kanban)  Compact panel
6px      Compact cards (swarm agents, goals)          Dense item
5px      Form inputs, standard buttons                Interactive chrome
4px      Small cards (kanban cards), micro buttons    Small interactive
3px      Tags, small badges                           Inline element
2px      Tiny chips (inside badges)                   Sub-element
```

**The optical rule:** Larger containers get larger radii. A `14px` radius on a `32px` badge looks like a stadium — visually absurd. A `3px` radius on a full-width card looks like a credit card — too corporate. Match the radius to the perceived "size" of the element in context, not its absolute pixel dimensions.

---

### 3.6 Dark Glass Depth — Elevation Without Shadows

On dark backgrounds, drop shadows are invisible (black shadow on near-black surface = nothing). The canonical replacement from Material Design 2 is **white surface overlay at increasing opacity** as elevation increases.

```
Elevation Level   White Overlay Opacity   Perceived as
────────────────────────────────────────────────────────────────
0dp (base/page)   0%                      App background
1dp               5% white                Drawer, card at rest
2dp               7% white                Card hover state
3dp               8% white                Refreshed card
4dp               9% white                App bar
6dp               11% white               FAB
8dp               12% white               Standard card (raised)
12dp              14% white               Active card / focused
16dp              15% white               Modal backdrop
24dp (top layer)  16% white               Dialog, dropdown

In practice:
--base:           rgba(3,3,10,1)          ← 0dp
--glass:          rgba(255,255,255,0.04)  ← ~1dp (4% overlay)
cards:            rgba(255,255,255,0.035) ← slightly below 1dp
active/hover:     rgba(255,255,255,0.07)  ← ~2dp
modals:           rgba(255,255,255,0.09)  ← ~4dp
```

**The rule:** Every clickable surface should have a hover state that increases the overlay by ~2–3% white. Transitions should use the `--expo` easing at 150–200ms. Don't animate background-color directly — use `opacity` on a pseudo-element overlay for GPU-composited performance.

---

### 3.7 Accessibility — WCAG Contrast Targets

Visual hierarchy in dark mode must still pass contrast checks. Use intentionally lower contrast for secondary content — it signals "less important," not "broken."

```
Text Tier       WCAG Level   Min Ratio   Target Ratio   Notes
────────────────────────────────────────────────────────────────────────
Primary text    AA           4.5:1       7:1+           Body, headings, active
Large text 24px+ AA          3:1         4.5:1          Orbitron hero titles
UI components   AA           3:1         3:1+           Borders, icons, controls
Secondary text  —            3:1         3.5:1          var(--fg-dim): intentionally reduced
Tertiary text   —            Not tested  ~2.5:1         var(--fg-muted): decorative only
```

**Space Age specific values:**
- `var(--fg)` = `#f0f4ff` on `#03030a` → contrast ratio ~15:1 ✓
- `var(--fg-dim)` = `#9ba3c4` on `#03030a` → contrast ratio ~6.5:1 ✓
- `var(--fg-muted)` = `#5a618a` on `#03030a` → contrast ratio ~3.2:1 (intentionally tertiary)
- `var(--orange)` = `#ff6b00` on `#03030a` → contrast ratio ~5.8:1 ✓

Never put readable body text at `var(--fg-muted)` contrast levels. That tier is for decorative labels, metadata, and role subtitles only.

---

## PART 4 — THE MINDSET: Senior Developer Thinking

### 4.1 How a Senior Developer Reads a Component

A junior developer sees a design mock and thinks: "What size is that text?"
A senior developer sees a design mock and thinks: "What is that text doing?"

Once you know what text is doing, every property follows from the system:

```
"This text is naming a section"
  → job = label
  → font = Rajdhani (label font)
  → transform = uppercase (labels are always uppercase)
  → weight = 700 (labels are always bold)
  → tracking = 0.22em+ (uppercase needs air)
  → color = var(--orange) or var(--fg-muted) depending on prominence
  → done.

"This text shows the agent's task count"
  → job = data value
  → font = JetBrains Mono (machine-produced number)
  → weight = 600 if prominent, 400 if metadata
  → tracking = -0.02em if 28px+, else 0
  → lineHeight = 1 (data doesn't wrap)
  → color = agent accent color or var(--fg-muted)
  → done.
```

The moment you find yourself thinking "maybe I'll just use 13px here," stop. Ask what job the text does. The system gives you the answer.

---

### 4.2 The Five Hierarchy Questions

Before writing a single style property, answer these:

1. **What level of importance?** Primary / Secondary / Tertiary / Supporting
2. **What type of content?** Brand name / System label / Human text / Machine data
3. **What size context?** Hero / Standard card / Dense grid / Sub-element
4. **What is adjacent?** What will the eye jump to from here? Is the contrast sufficient?
5. **What is the reading mode?** Scanning (needs more contrast) vs Reading (needs more rhythm)

The answers determine the font, size, weight, color, and spacing. Not intuition, not what looks nice at the moment.

---

### 4.3 Diagnosing Typography Failures

When something looks wrong, diagnose the cause before fixing:

```
Symptom                     Root Cause                  Fix
──────────────────────────────────────────────────────────────────────────────────
"Looks cramped"             Padding is too tight         Upgrade one level on padding scale
                            OR text is too large         Scale down text by one step
"Looks too loose/spacey"    Padding is too generous      Downgrade one level
                            OR content is too sparse     Add secondary text element
"Hierarchy not clear"       Two things are too similar   Add weight difference or size step
"Looks amateur"             Mixing fonts wrong           Check the four-font job assignment
"Labels look weird"         Missing uppercase            Add textTransform: uppercase to Rajdhani
"Numbers look like text"    Wrong font                   Switch to JetBrains Mono
"Text is illegible"         Size too small               Step up one scale level
"Too many things competing" Too many accent colors       Reduce to one accent per zone
"Feels generic/corporate"   Missing Orbitron for names   Add agent name with Orbitron+color
```

---

### 4.4 The Quick Build Checklist

When building any new component:

```
□ 1. Page wrapper       — padding: '28px 32px'
□ 2. Section header     — .section-label (6px mb) + Orbitron title + optional DM Sans
                          Then 20–28px margin before content
□ 3. Card padding       — which level? (Page/Large/Standard/Compact/Tight/Micro)
□ 4. Card radius        — 14 hero / 10 standard / 8 panel / 6 compact / 4 small / 3 tag
□ 5. Grid gap           — 12px standard / 8px dense / 28px between page sections
□ 6. Text in card       — role/description: DM Sans 11–13px var(--fg-muted)
                          Data: JetBrains Mono + appropriate tracking
                          Name: Orbitron + agent color
□ 7. Labels             — Rajdhani 9–10px, weight 700, tracking 0.22em, uppercase
□ 8. CSS vars           — never hardcode hex when a var exists
□ 9. No pure white      — replace color: '#fff' with var(--fg) (except button text on colored bg)
□ 10. Line heights      — 1.0–1.05 on Orbitron, 1.5–1.6 on DM Sans body, 1.0 on JetBrains data
```

---

### 4.5 The Non-Negotiables

These are never-break rules. Every single one has caused a real-world UI failure when broken.

```
NEVER DO                                          DO INSTEAD
────────────────────────────────────────────────────────────────────────────────────
DM Sans for an agent name                         Orbitron + var(--agent-{id})
Orbitron at fontWeight < 700                      Minimum 700, always
Rajdhani without uppercase (for labels)           Add textTransform: 'uppercase'
letterSpacing: 0 on small text                    Minimum 0.1em for 8–11px
color: '#ffffff'                                  var(--fg) which is #f0f4ff
color: '#ff6b00'                                  var(--orange)
Hardcoded agent hex colors                        var(--agent-{id})
padding: 20px on a kanban card                    8px 10px (tight level)
padding: 8px on a primary glass card              16px 18px minimum (standard level)
lineHeight: 1.6 on JetBrains Mono big number     lineHeight: 1
gap: 24px inside a card                           Max 14px inside card (page-level gap)
fontSize: 14px on a Rajdhani section label        9–10px for labels, 14px = DM Sans territory
fontWeight: 700 on DM Sans body text              400 only (body); 600 only for active nav
Mixing 4 accent colors in one card                One accent per viewport zone
New arbitrary font size (11.5px, 12.5px, 13.5px) Use a scale step
```

---

## Appendix: The CSS Custom Properties

Every token that exists in globals.css — never duplicate with inline hex.

```css
/* Backgrounds */
--base: #03030a         /* Deepest background */
--base-2: #07071a       /* Mid background */
--base-3: #0d0d24       /* Lifted background */
--glass: rgba(255,255,255,0.04)
--glass-border: rgba(255,255,255,0.08)

/* Brand colors */
--orange: #ff6b00       /* Primary accent */
--cyan: #00e5ff
--purple: #9c40ff
--green: #00e676

/* Agent colors */
--agent-claude: #ff6b00
--agent-codex: #00e5ff
--agent-gemini: #4285f4
--agent-openclaw: #9c40ff
--agent-hermes: #f5a623
--agent-deepseek: #38bdf8

/* Text tiers */
--fg: #f0f4ff           /* Primary text */
--fg-dim: #9ba3c4       /* Secondary text */
--fg-muted: #5a618a     /* Tertiary text */

/* Easing */
--spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--expo: cubic-bezier(0.16, 1, 0.3, 1)
```

Use these. Never hardcode values that have a token. If you're typing a hex color that isn't in this list, either use `rgba()` for a semantic variant (like `rgba(255,255,255,0.45)` for card body text) or you're introducing an inconsistency.
