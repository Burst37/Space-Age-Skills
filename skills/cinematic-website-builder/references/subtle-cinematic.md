# Subtle-cinematic profile (regulated sectors)

Applies automatically when `sector` is home care / senior care, law, medical, dental, SaaS, finance or insurance
(`profile: gentle` in the brief; both pickers switch to their gentle catalogues).

## Motion
- **CSS first**: `data-nreveal="gentle"`, `data-nzoom`, `data-jumbo="scrub-gentle"`, `data-parallax="gentle"`.
- **GSAP only for the one signature moment** (e.g. the hero headline line-reveal, or gentle `expand-panels`).
- **Soft Lenis optional** (`data-cwb-smooth="soft"`): desktop fine pointer only, never on touch or reduced motion.
- **One autoplay loop at a time**, calm footage (hands, homes, faces at rest), posters on reduced motion and Save-Data.
- No pins on mobile, no cursor effects, no scramble or glitch, no flashing.

## Type
- Jumbo is allowed and encouraged, as a **calm** serif or sans (`jumbo-calm-serif`, `care-modern-serif`…), with no distortion.
- Custom type: **style 1** (type behind subject, gentle parallax) and **style 5** (mixed pairing: heavy over light, echo rows) only.
- **Banned**: liquid glass, 3D goo, fur, candy, grunge, neon, chrome, glass refraction, sticker or graffiti, AI material letters.

## Home-care compliance (nonmedical home care)
- Say "nonmedical" where it applies; never imply skilled nursing, diagnosis or treatment unless licensed.
- State licensing or registration exactly as issued (state agency and number) in the footer and on About.
- No outcome guarantees, no invented testimonials; reviews quoted with source and date.
- Accessibility first: body ≥ 17px, contrast ≥ 4.5:1 (≥ 7:1 for long body copy is better), tap targets ≥ 44px, the phone number as a `tel:` link on every page.
- Privacy page that covers form data; no health details requested in web forms (ask for a call-back instead).
- **AI disclosure**: when imagery or video is AI-generated, say so plainly near the media or in the footer
  ("Some images on this site are AI-generated illustrations; our caregivers are real people, pictured on About.").
  Never present AI people as staff or clients.

## Schema
Nonmedical home care uses **`LocalBusiness`** with a stable `@id`, **not** `MedicalBusiness` (it isn't medical care). Required: `name`, `url`, `telephone`, `address`, **`geo`**,
**`areaServed`** (cities or a `GeoCircle`), **`sameAs`** (GBP, Facebook, Yelp…), `openingHoursSpecification`,
`priceRange` if known. Services as `Service` with `provider` → the LocalBusiness `@id`. Template:
`templates/localbusiness.jsonld`.

## llms.txt (home care)
Plain facts only: services (nonmedical), service area, licence line, phone, hours, links to service pages and the
care-questions page. No medical claims, no pricing promises. Template notes: `templates/llms.txt`.
