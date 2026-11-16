# Worked example — Wireframes + grey-box automation

Section order reverse-extracted from the Astonishing Touch preview, 15 Nov 2026, America/Chicago. This is what the Wireframe stage should have locked *after* the brief and *before* photography, motion or production code. Grey boxes only: labels, real headings from `page-text.md` (or temporary labels if copy is still drafting), no images, no film, no color.

**Approval gate:** Chuma (or the client) signs off on section order and layout from the grey-box screenshots. No asset generation and no site code until that is true.

## Sitemap (15 URLs)

Home, Services, nine service pages, About, Care Questions, Contact, Privacy.

Shared chrome (every page except Privacy today — that exception is a defect; the no-design-pages rule should have reused this chrome):

1. Skip link → `#main`
2. Fixed header: logo, primary nav, phone chip (home) or section nav (inner pages: Our services, Our story, Care questions, Contact & directions)
3. Footer: legal name, NAP, hours, Privacy, back-to-top
4. Optional floating “Ask Brittany” launcher (home; disclose it is an AI receptionist)

---

## Home `/`

Beat: Hook → Story → Offer (nine services) → Proof/people → Path → Questions → NAP/CTA.

| # | Section id | Layout (grey-box) | Content in the live build |
|---|---|---|---|
| 1 | `#home` hero | Full-viewport stage. Left: eyebrow, H1, 2-line lede, primary CTA. Bottom-left scroll cue. Bottom-right motion control. Right margin: vertical caption. | Eyebrow “Nonmedical home care · Creve Coeur, MO”. H1 “Care that feels like home.” CTA “Find care for your loved one.” |
| 2 | `#about` intro + promise | Asymmetric 30/70: label/mission column, large promise heading + film box. Two-column origin copy under. | H2 “About Astonishing Touch.” Mission + 2018 founder story. |
| 3 | `#services` | Index heading (“Small moments. Real support.”) then **nine stacked full-bleed chapters**, each: number + service name, H3, short lede, “Explore {service}” + “Talk to us…” | 01 Respite … 09 Errands. Directory jump nav can sit with the index. |
| 4 | Team | Film/photo box + copy. H2 “Good people. A personal touch.” Link to About. | Brittany Wadley / 2018. |
| 5 | `#gallery` | Large heading + horizontal/orbit cards (grey rectangles). Caption: illustrative moments. | “Life happens. Let’s be part of it.” |
| 6 | Next step | Three numbered steps (Tell us / Explore / Make it personal) + CTA. | “It starts with a conversation.” |
| 7 | `#questions` | H2 + accordion of 5 questions. Button “Ask Brittany.” | Answers also in FAQ JSON-LD. |
| 8 | `#contact` | Large H2, CTA, phone, email, address + directions, hours, after-hours. | “Let’s make home feel like home.” |

Mobile: recompose, do not shrink. Hero CTA stays inside the first 390×844 viewport (this build does). No pinned scenes. Hamburger replaces pill nav.

## Services index `/services`

Eyebrow, H1 “Home-care services in Creve Coeur,” lede, nine blocks (name as H2 + one-sentence definition + link to the service page), closer “Start with the routines that matter.”

## Service template `/services/{slug}` (nine pages)

The live template is consistent — good — but the H2s are not question-shaped and the first answers run 18–26 words, short of the 40–60 word capsule. The approved wireframe should have reserved those slots.

| Block | Live heading | What the blueprint should have locked |
|---|---|---|
| Kicker + breadcrumb | “Care at home · Creve Coeur office” | Keep |
| H1 | “{Service} in Creve Coeur” | Keep, one H1 |
| Lede | One sentence definition | Keep |
| Media | Poster / optional loop | Grey rectangle in the wireframe |
| H2 + capsule | “What support can look like” (~20 words) | Question H2, e.g. “What does respite care include?” + 40–60 word answer |
| H2 + planning | “Planning support around you” | Keep as a short how-it-works block |
| H2 “Your questions” + 2× H3 FAQ | Present, answers often < 40 words | Two question headings with 40–60 word answers |
| Compare + other services | Present | Keep, internal links |

## About `/about`

Eyebrow “A heart to serve.” H1 “About Astonishing Touch.” Origin paragraphs. H2 Mission. H2 “Your routines. Your choices.” H2 “Talk with the people behind your care” (including the Ask Brittany disclosure). Footer NAP.

## Care Questions `/care-questions`

This is the strongest AEO page and should be the template for service copy. H1 “Home-care questions, answered.” Index nav, then question H2s with direct answer paragraphs (several already 44–56 words), plus “Questions to bring” and a further-reading note.

## Contact `/contact`

H1 “Contact our Creve Coeur office.” Phone, email, hours, after-hours. H2 “Before arranging care” (cautions). No map iframe required if a directions link is present.

## Privacy `/privacy`

In the live build this page has **no header, no footer, no skip link** — a no-design-pages miss. Wireframe it on the same resource-page chrome: H1, short sections on the inquiry form, the AI receptionist, voice providers, and how to request deletion.

---

## How the skill should auto-generate grey-boxes

### Inputs

- `brief.md` (approved sitemap + “the website will…” + bans)
- `design-spec.md` (type scale, spacing, grid, max measure — use typography and spacing only; color is grey)
- `wireframe.yaml` (machine form of the tables above)
- Optional first-pass headings from `page-text.md`

### `wireframe.yaml` shape

```yaml
pages:
  - path: /
    title: Home
    sections:
      - id: home
        kind: hero
        eyebrow: Nonmedical home care · Creve Coeur, MO
        h1: Care that feels like home.
        lede: Companion care. Personal care. Everyday support.
        cta: Find care for your loved one
        media: film-stage
      - id: about
        kind: split-30-70
        h2: About Astonishing Touch
        media: film-stage
      - id: services
        kind: stacked-chapters
        h2: Small moments. Real support.
        items: [respite-care, companionship, personal-care, hygiene-assistance, meal-preparation, housekeeping, laundry, medication-reminders, errands]
      # …
```

### Agent / tool

1. A small `scripts/greybox.mjs` in the builder (new in v3.3) reads the YAML and writes `handoff/greybox/{slug}.html`.
2. Layout is literal boxes: 8% grey surfaces, 20% grey media rectangles, 40% grey text bars if copy is missing, or the real heading/lede if present. Shared chrome included. No photos, no video, no JS motion.
3. Playwright shots at 1440×900 and 390×844, one PNG per page plus a contact sheet, into `handoff/greybox/`.
4. Optional: a mid-fidelity variant that applies the locked type scale and spacing from `design-spec.md` still in greyscale, so the client can judge hierarchy without approving color or photography.

### Outputs

- `handoff/wireframe.md` (this document, generated from the YAML)
- `handoff/greybox/*.html` and `*.png`
- A one-screen “section order” list for approval

### Approval point (hard stop)

Show the contact sheet and the section list. The person approves or marks moves (“swap gallery and team,” “service pages need a 40–60 word answer block,” “Privacy uses the same header”). Record `wireframe_approved: true` in the brief/manifest. Only then: finish `page-text.md`, generate assets, write hi-fi section PNGs, and build.

### Downstream

Numbered prompt chain builds one section (or one page) per commit from this folder. QA screenshot-diff compares the build to the approved hi-fi PNGs (and, for structure-only checks, to the grey-box). Inner pages with no unique hi-fi still have a grey-box, so the no-design-pages rule has something to follow.

## What this live build would have changed at the wireframe gate

- Service pages would have been given a question-H2 + 40–60 word capsule slot before anyone wrote code (nine pages shipped thin).
- Privacy would have been drawn on the resource-page chrome.
- The nine homepage chapter films would have been called out as a media-budget risk (“poster in the grey-box, one hero loop, lazy loops”) instead of being discovered at verify (9.8 MB).
- Care Questions’ structure would have been reused as the service-page pattern rather than invented twice.
