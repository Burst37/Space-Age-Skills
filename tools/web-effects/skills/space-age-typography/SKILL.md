---
name: space-age-typography
description: Typography, spacing, and visual rhythm system for Space Age Agent OS. Covers the four-font hierarchy (Orbitron/Rajdhani/DM Sans/JetBrains Mono), exact font sizes and letter-spacing for every context, the padding scale from page level down to micro tags, gap rules for grids and stacks, border-radius tiers, and the internal card rhythm. Use any time you are building, reviewing, or fixing UI in this project — the rules here are what makes components look like they belong together.
license: MIT
---

# Space Age Typography & Spacing System

## The Core Principle

Every element in this UI has exactly one correct font, size, weight, letter-spacing, and color. When something looks wrong — too cramped, too loose, too heavy, off-brand — it means one of these rules was broken. This skill documents every rule extracted from the actual codebase.

---

## The Four-Font Hierarchy

Each font has one job. Never swap them.

| Font | Job | When to use |
|------|-----|-------------|
| **Orbitron** | Identity / Brand voice | Page titles, agent names, column headers, logo, any text that needs to feel "space tech" |
| **Rajdhani** | UI chrome / Labels | Section labels, button text, status badges, nav items, any ALL CAPS label in the interface |
| **DM Sans** | Readable content | Body text, descriptions, card roles, chat messages, form inputs, nav item labels |
| **JetBrains Mono** | Data / Technical | Numbers, stats, costs, IP addresses, model names, version strings, code, any value a machine would produce |

**The test:** If it's a label naming a section → Rajdhani. If it's a number or technical value → JetBrains Mono. If it's a name or branded thing → Orbitron. If it's a sentence a human wrote → DM Sans.

---

## Orbitron — Size & Spacing Reference

```
Context                    fontSize   fontWeight   letterSpacing   color
─────────────────────────────────────────────────────────────────────────
Page H1 (hero)             clamp(26px,3.5vw,48px)  900   0.04–0.05em   var(--fg)
Page H1 (standard)         16–18px     900         0.05–0.1em    var(--fg)
Agent name (large tile)    17px        800         0.04em        agent color
Agent name (standard tile) 13px        800         0.04em        agent color
Card/column header         9px         700         0.15em        var(--fg-muted)
Section sub-label          9px         700         0.1em         agent color
Logo wordmark              10px        700         0.12em        var(--fg)
Micro label (in pill/tag)  8–9px       700         0.1–0.15em    agent color
```

**Rules:**
- Always `fontWeight: 900` for page titles, `800` for named things, `700` for labels
- Letter-spacing increases as size decreases — small Orbitron needs more tracking to breathe
- Color is always `var(--fg)` for titles, **agent-specific color** for agent names, `var(--fg-muted)` for decorative headers
- `lineHeight: 1` or `1.05` — Orbitron is a display font, never use `1.6` body line-height on it

---

## Rajdhani — Size & Spacing Reference

```
Context                    fontSize   fontWeight   letterSpacing   color
─────────────────────────────────────────────────────────────────────────
.section-label (CSS class)  10px       700          0.25em        var(--orange)
Section label (inline)       9px       700          0.25em        rgba(255,255,255,0.25)
KPI/card inner label         8–9px     700          0.2–0.22em    var(--fg-muted) or var(--orange)
Status badge                 9px       700          0.22em        var(--green) or var(--fg-muted)
.btn-primary                11px       700          0.15em        #fff (on orange bg)
.btn-ghost                  10px       700          0.12em        var(--fg-dim)
Nav item label              12px       600/400      —             var(--fg) / var(--fg-dim)
```

**Rules:**
- Always `fontWeight: 700` except nav items (600 active, 400 inactive)
- Always `textTransform: 'uppercase'`
- Letter-spacing 0.22–0.25em for labels, slightly less (0.12–0.15em) for button text
- The `.section-label` CSS class handles the standard case — use it, override `fontSize` inline if needed
- `var(--orange)` for primary section labels, `rgba(255,255,255,0.25)` for secondary/decorative

---

## DM Sans — Size & Spacing Reference

```
Context                    fontSize   fontWeight   lineHeight   color
──────────────────────────────────────────────────────────────────────
Body default (globals.css)   14px       400          1.6         var(--fg)
Chat messages                14px       400          1.6–1.7     var(--fg)
Goal/task items              13px       400          —           var(--fg)
Card role/subtitle           13px (large tile) / 11px (standard)  1.4   rgba(255,255,255,0.45)
Pipeline description         12px       400          —           var(--fg-muted)
Nav item labels              12px       600/400      —           var(--fg) / var(--fg-dim)
Inputs/forms                 12px       400          —           var(--fg)
Kanban card title            11px       400          —           var(--fg)
Swarm agent role             10px       400          —           var(--fg-muted)
```

**Rules:**
- Never use Orbitron tracking or uppercase on DM Sans — it's for reading, not labeling
- `lineHeight: 1.6` for anything paragraph-like, `lineHeight: 1.4` for tight card descriptions
- Color hierarchy: `var(--fg)` → `var(--fg-dim)` → `var(--fg-muted)` — use muted for supporting/secondary text
- Minimum size 10px. Below that, switch to JetBrains Mono or Rajdhani

---

## JetBrains Mono — Size & Spacing Reference

```
Context                    fontSize   fontWeight   letterSpacing   color
─────────────────────────────────────────────────────────────────────────
KPI big numbers (28px+)     28px        600         -0.02em       agent/accent color
Live readouts (time, count) 18px        600         0.04em        var(--orange)
Cost model values           14px        600         —             accent color
Tag/badge text              10px        400         —             var(--fg-muted)
Card data badges            10px        400         —             rgba(255,255,255,0.3)
Data counters/labels        10px        400         —             var(--fg-muted)
Small metadata              9px         400         0.2em         var(--fg-muted) / var(--orange)
Micro (IP, version, tag)    8–9px       400         —             var(--fg-muted) / var(--orange)
```

**Rules:**
- `letterSpacing: -0.02em` on large numbers (28px+) — negative tracking tightens digits together, looks purposeful
- `letterSpacing: 0.2em` on small mono labels (8–9px) — same rule as Orbitron: small = more tracking
- `lineHeight: 1` for standalone data values — they're not prose
- `fontWeight: 600` for prominent values, `400` for tags and metadata
- The `.data-value` CSS class covers the standard big-number case

---

## The Three-Tier Section Header Pattern

Every section in the app uses this exact sequence. Never skip a tier.

```
Tier 1 — Rajdhani section label     ← names the section
         marginBottom: 6px

Tier 2 — Orbitron title (h1 or div) ← what is it
         marginBottom: 4px (if subtitle follows) or 0px

Tier 3 — DM Sans description        ← supporting detail (optional)
         fontSize: 12px, color: var(--fg-muted)
```

Then `marginBottom: 20–28px` before the content begins.

**Correct:**
```tsx
<div style={{ marginBottom: 28 }}>
  <div className="section-label" style={{ marginBottom: 6 }}>Space Age AI Solutions</div>
  <h1 style={{ fontSize: 18, letterSpacing: '0.1em', marginBottom: 4 }}>LEAD GEN PIPELINE</h1>
  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--fg-muted)' }}>
    Google Maps → Scraper → Cinematic HTML → Outreach
  </div>
</div>
```

**Wrong** — missing tier 1, wrong font on tier 2:
```tsx
<h2 style={{ fontSize: 16, marginBottom: 20 }}>Pipeline</h2>  ← NO
```

---

## Padding Scale — Five Levels

Use the right level for the right context. These are not arbitrary — they're extracted from every component.

```
Level       Padding            Context
──────────────────────────────────────────────────────────────────────
Page        28px 32px          Outer wrapper of every page (all 14 routes)
Large card  22px 24px          Hero tiles, primary feature cards (Claude large tile)
Standard    16px 18–20px       Regular glass cards (agent tiles, pipeline cards, goal items)
Compact     12px 14–16px       Dense grids (swarm agents, cost model row items)
Tight       8px 10–12px        Sub-elements inside cards (kanban cards, tag pills)
Micro       5px 8px / 2px 6px  Inline badges, status chips, small tags
```

**How to choose:** Start with Standard. Go up to Large if the card contains a big number or needs breathing room. Go down to Compact if you have 5+ items in a grid. Go down to Tight for card contents (not the card itself). Micro is only for inline chips.

---

## Internal Card Rhythm (gap inside a card)

Inside a card, the spacing between internal elements follows this scale:

```
Between major sections inside a card:   14px  (Large card internal gap)
Between rows / elements:                10px  (Standard card internal gap)
Between tight inline items:              8px  (header row: LED + name + badge)
Between sub-items:                       5–6px (role → model/ctx)
Between label and its value:             4px
Between micro items:                     3px
```

**Example — the agent tile internal structure:**
```tsx
// Total card gap: 10 (standard)
// Header row elements gap: 8 (LED + name + status badge)
// Between header and role: implicit via flexColumn gap: 10
// Between role and model row: marginTop: 'auto' (pushes to bottom)
```

---

## Gap Scale for Grids and Stacks

```
Between page-level sections:    28px  (MissionControl section gap)
Between sections (tighter pages):24px  (Pipeline sections)
Between section and its content: 12–14px (section-label marginBottom)
Grid gap (standard):            12px   (agent grid, model stack)
Grid gap (dense):                8–10px (swarm agents, quick access)
List gap (standard):             8px   (goals list)
List gap (tight):                6px   (kanban cards within column)
Inline flex gap:                 8–10px (LED + text rows)
```

**Rule:** The gap between things tells the user how related they are. 28px = different topics. 12px = same topic, different items. 6–8px = same item, different properties.

---

## Border Radius Scale

```
Radius   Context
──────────────────────────────────────────────────────────
14px     Hero/large glass cards (MissionControl agent tiles)
10px     Standard glass cards (model stack, pipeline cost)
8px      Standard panels (pipeline KPI, progress bar, kanban columns)
6px      Compact cards (swarm agents, goals, hermes pill)
5px      Form inputs, buttons (standard)
4px      Small cards (kanban cards), micro buttons
3px      Tags, small badges
2px      Tiny chips (inside badges)
```

**Rule:** Larger cards → more radius. Smaller more compact things → less radius. Never use a large radius (14px) on a tiny tag.

---

## Color-to-Role Mapping (Typography)

```
Color              Semantic meaning          Where used
────────────────────────────────────────────────────────────────
var(--fg)          Primary readable text     Body text, titles, active nav items
var(--fg-dim)      Secondary text            Nav items (inactive), supporting labels
var(--fg-muted)    Tertiary/helper text      Section headers that aren't orange, metadata, roles
var(--orange)      Primary brand accent      .section-label, active nav border, live readouts, CTAs
agent-specific     Named entity color        Always on agent name + that agent's accent usage
rgba(255,255,255,0.45)  Card body text      Card descriptions (inline, not using CSS var)
rgba(255,255,255,0.3)   Data tags           JetBrains Mono badge text when not using --fg-muted
rgba(255,255,255,0.25)  Decorative labels   Rajdhani section headers that are visual dividers
```

**Rule:** Nothing should be pure white (`#ffffff` or `rgba(255,255,255,1)`) — use `var(--fg)` which is `#f0f4ff`. Pure white breaks the dark glass aesthetic.

---

## The Agent Name Rule

Agent names follow a locked pattern everywhere they appear:
```tsx
fontFamily: 'Orbitron, sans-serif'
fontWeight: 800 (tile) or 700 (compact)
color: var(--agent-{id})       // NEVER hardcode the hex
letterSpacing: '0.04–0.1em'    // more tracking when smaller
```

Always paired with a LED dome directly to the left. Never DM Sans for an agent name, ever.

---

## Letter-Spacing Mental Model

The rule across all four fonts:
- **Large text (24px+):** minimal tracking (0.04–0.05em) — it reads fine at size
- **Medium text (12–18px):** moderate tracking (0.08–0.15em)
- **Small text (8–11px):** heavy tracking (0.15–0.25em) — needs space to be legible
- **Data/numbers (JetBrains Mono, 14px+):** negative tracking (-0.02em) — digits look better tighter
- **Data labels (JetBrains Mono, 8–9px):** positive tracking (0.2em) — small mono needs to breathe

---

## Quick Checklist When Building a New Component

1. **Page wrapper** — `padding: '28px 32px'`
2. **Section header** — `.section-label` (marginBottom 6px) + Orbitron title + optional DM Sans subtitle. Then 20–28px margin before content.
3. **Card padding** — pick from the five-level scale. Default Standard: `16px 18px`.
4. **Card radius** — 14 (hero), 10 (standard), 8 (compact), 6 (tight), 4 (micro).
5. **Gap** — 12px for standard grids, 8px for dense, 28px between page sections.
6. **Text inside card** — role/description: DM Sans 11–13px, `var(--fg-muted)`. Data: JetBrains Mono. Named things: Orbitron.
7. **Any label** — Rajdhani 9–10px, `fontWeight: 700`, `letterSpacing: '0.22–0.25em'`, `textTransform: 'uppercase'`.
8. **Use CSS vars** — never hardcode `#ff6b00` when `var(--orange)` exists. Never hardcode agent hex when `var(--agent-{id})` exists.
9. **Check pure white** — replace any `color: '#fff'` outside of button text with `var(--fg)`.
10. **lineHeight** — `1` or `1.05` on Orbitron display, `1.6` on DM Sans body, `1` on JetBrains Mono data values.

---

## The Most Common Mistakes to Avoid

- ❌ Using DM Sans for an agent name — always Orbitron
- ❌ Using Orbitron at `fontWeight: 400` — minimum 700
- ❌ Missing `textTransform: 'uppercase'` on Rajdhani labels
- ❌ Setting `letterSpacing` to `0` on small text — it becomes illegible
- ❌ Using `color: '#ffffff'` instead of `var(--fg)`
- ❌ Hardcoding `color: '#ff6b00'` instead of `var(--orange)` or `var(--agent-claude)`
- ❌ Setting `padding: 20px` on a kanban card (should be `8px 10px`)
- ❌ Setting `padding: 8px` on a primary glass card (should be `16px 18px` minimum)
- ❌ Using `lineHeight: 1.6` on a JetBrains Mono big number — it creates too much vertical space
- ❌ Using `gap: 24px` inside a card (that's page-level gap, not card gap)
- ❌ Using `fontSize: 14px` on a Rajdhani section label — the system uses 9–10px for labels
- ❌ Inventing a new font size — use the sizes defined in this skill
