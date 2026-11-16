---
client: "Astonishing Touch"
sector: home-healthcare
city: "Creve Coeur, MO"
tier: enhanced
mode: review
profile: gentle
signature_style: video-per-section
custom_type: none                # GR2-5: calm jumbo only, no cut-out custom type of real clients
confirmed: false                 # reconstructed after ship; not client-approved
moodboard_approved: false
motion_approved: false
type_approved: false
wireframe_approved: false
review_gr1: done                 # v3.4 goldfish review — reviews/GR1-brief.md (asks open: GR1-1, GR1-2, GR1-7)
review_gr2: done                 # reviews/GR2-design-spec.md
review_gr3: pending              # drift check after G8
domain: "https://www.astonishingtouchhealthcare.org"
preview_url: "https://astonishing-touch-healthcare-lx888d8ej.vercel.app"
---
# Worked example — Direction Brief (revised after goldfish review GR1, v3.4)

Extracted from the live Astonishing Touch preview (https://astonishing-touch-healthcare-lx888d8ej.vercel.app/), 15 Nov 2026, America/Chicago. This is what an automated Brief stage should have produced *before* moodboard, wireframe or code. Lines under **The website will…** are the only commitments the rest of the pipeline is allowed to build against (Fadel highlight trick).

**Status:** reconstructed after the fact from the shipped site. Not client-approved in this form.
**Tier hint:** Enhanced / subtle-cinematic. Local home-healthcare. Liquid-glass and 3D goo typography are banned.

## Facts (intake)

- Legal name: Astonishing Touch Home Health & Senior Services L.L.C.
- Brand name: Astonishing Touch
- Founder / owner: Brittany Wadley (founded 2018). Claim in use: “over 10 years of healthcare experience.”
- Category: nonmedical in-home support (companionship, personal care, respite, everyday help). Not skilled nursing.
- Office: 10880 Baur Blvd., Suite 103, Creve Coeur, MO 63132
- Phone (office): (314) 479-5673
- Phone (after hours): (314) 276-4607
- Email: info@astonishingtouchhealthcare.org
- Hours: Monday–Friday, 9:00 a.m.–5:00 p.m.; closed Saturday and Sunday
- Licence / registration: **ASK (GR1-1)** — issuing agency and number exactly as issued. Until it is confirmed, the site may not say "licensed", "health care agency" or "certified" (the live About copy does).
- Service area: **ASK (GR1-2)** — cities/counties served, plus the GBP URL and real profiles for `sameAs`.
- After-hours line (314) 276-4607: **ASK (GR1-7)** — existing clients only, or new families too?
- NAP must stay identical on the site, JSON-LD, GBP and any `llms.txt`.
- Production domain (planned): https://www.astonishingtouchhealthcare.org/ — still serving the old Wix site as of this audit. Preview must stay `noindex` until DNS cutover.

## The website will…

1. The website will present Astonishing Touch as a locally owned Creve Coeur, Missouri home-care agency whose care “feels like home.”
2. The website will make clear that services are everyday, nonmedical support — not skilled nursing, therapy, prescribing, dose changes or medication administration.
3. The website will give each of the nine services its own page: respite care, friendly companionship, personal care, hygiene assistance, meal planning and preparation, light housekeeping, laundry assistance, medication reminders, and assistance running errands.
4. The website will lead every page to one primary action, “Find care for your loved one” (a care inquiry or call), with phone and email as secondary routes; it will say that an inquiry is not a confirmed appointment, that prices are discussed with staff, and that coverage at a home address must be confirmed.
5. The website will publish the Creve Coeur office NAP, weekday hours and the after-hours number, plus a directions link.
6. The website will tell the agency’s origin story (Brittany Wadley, 2018, mission) on Home and About, without inventing reviews, ratings, outcomes or clinical claims.
7. The website will answer common family questions on the homepage and on a Care Questions page, with question-shaped headings and short, honest answers.
8. The website will use calm photography and short loops of care at home, labeled as illustrative where generated, with a visible Pause/Play control and still images for reduced motion; an optional “Ask Brittany” AI receptionist is labeled as a virtual assistant, not the founder.

### Build commitments (not client copy)
- Multi-page: Home, Services index, nine service pages, About, Care Questions, Contact, Privacy.
- Indexable on the production domain only; previews stay noindex; retrieval AI bots allowed on production; `llms.txt` states the same facts and cautions as the visible pages.
- Restrained motion; no liquid-glass and no 3D goo typography.

## Audience and promise
- **Who arrives (assumption — confirm with the client):** adult children arranging help for a parent at home in the St. Louis area, and older adults planning for themselves. Usually on a phone, often worried and short on time.
- **What they need to believe:** this is a real local team, the help is nonmedical and everyday, and talking to them commits them to nothing.
- **Promise in one sentence:** everyday help at home from a local team, planned around the person’s routines.

## Proof available (real only)
- Founded 2018 by Brittany Wadley; Creve Coeur office (verifiable NAP).
- No reviews, ratings or counts are approved for use yet. “Over 10 years of healthcare experience” is unsourced (see log).
- Licensing/insurance claims: none usable until GR1-1 is answered.

## G1 evidence (SEO/AEO)
- Top-3 competitor teardown (`seo-aeo-optimizer` `teardown.py --aeo`): **pending — not run for this reconstruction; required before the moodboard on a live build.**
- Candidate money keywords (unverified guesses; the teardown confirms or replaces them): home care Creve Coeur, respite care St. Louis County, companion care Creve Coeur, personal care at home St. Louis.
- AI-citation map: pending with the teardown.

## Hard bans

- No liquid-glass or 3D goo typography (home-healthcare ban, no exceptions).
- No lorem, no invented testimonials, star ratings, “trusted by N families,” or guaranteed outcomes.
- No medical advice, no published prices, no implied insurance acceptance.
- No “licensed”, “certified” or “health care agency” wording until the licence line is confirmed (GR1-1).
- Do not collect diagnoses or medical records in the inquiry form.
- Do not ship `Disallow: /` or `noindex` to production.
- Do not canonical or sitemap to the old Wix site after cutover; do not cut over until preview QA passes.

## Sitemap (blueprint)

| URL | Type | Purpose |
|---|---|---|
| `/` | Home | Promise, story, nine service chapters, team, gallery, path to contact, FAQ, NAP |
| `/services` | Service index | All nine services as an answer-led list |
| `/services/{slug}` × 9 | Service | What it is, how it is planned, 2 FAQs, links to other services and Care Questions |
| `/about` | About | Origin, founder, mission, nonmedical scope |
| `/care-questions` | FAQ hub | Question H2s + 40–60 word answers |
| `/contact` | Contact | NAP, hours, after-hours, inquiry cautions |
| `/privacy` | Legal | Inquiry + AI receptionist data use |

## Schema plan

- `LocalBusiness` (not `MedicalBusiness` — the offer is explicitly nonmedical) with complete NAP, hours, founder, logo, `url`, `hasOfferCatalog` of the nine `Service`s.
- Add `sameAs` (GBP and any real profiles), `geo`, and `areaServed` — blocked on GR1-2 (asked).
- `Service` + `BreadcrumbList` + visible `FAQPage` on service pages and Care Questions.
- JSON-LD in the first HTML response; NAP identical to the visible footer.

## Conflicts / open questions (log)

- Client origin copy has grammar issues (“as it seen,” “a locally owned and operated”). Decision needed: light edit for clarity vs. keep founder wording verbatim.
- “Over 10 years of healthcare experience” needs a source or it should be dropped.
- Ask Brittany is an optional module; confirm it ships on v1.
- Media: eleven homepage loops is heavier than a subtle-cinematic budget. Confirm hero + in-view loading vs. a poster-only gallery.
