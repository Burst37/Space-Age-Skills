---
# CWB v3.5 hand-off brief, LEAD MODE. Written by scripts/lead-jobs.mjs from one Google Maps row.
# This is an unsolicited spec demo: nobody has been interviewed. Every fact below is from the listing; anything
# marked UNKNOWN stays off the page. Gates are auto-flipped by lead mode and logged in design-spec §11.
client: {{name_q}}
sector: "{{sector}}"
city: {{loc_q}}
tier: "{{tier}}"
mode: auto                    # pickers decide from taste-profile.yaml + sector and record why
lead_mode: true               # spec demo: noindex + preview notice until the business buys it
profile: "{{profile}}"
signature_style: video-per-section
custom_type: {{custom_type}}
confirmed: true               # G0: facts are the listing's; there is no client to confirm with yet
moodboard_approved: auto      # G2: taste-profile.yaml + sector preset stand in for a moodboard
motion_approved: auto         # G3
type_approved: auto           # G3
wireframe_approved: auto      # G4: greybox lint must still exit 0
review_gr1: skipped — lead mode (facts come from one listing, nothing to cross-check)
review_gr2: pending           # 2 lenses (conversion, accessibility) on design-spec + page-text
review_gr3: skipped — factory tier
domain: ""
preview_url: ""
---
# Brief: {{name}}

## The website will…
- The website will get a {{loc}} resident from "who do I call for this?" to a phone call in one screen.
- The website will show what {{name}} does and where, in plain words, before any scrolling.
- The website will answer the questions people ask before they call a {{category}} business.
- The website will keep the phone number and "{{cta}}" reachable from every screen.
- The website will look like a business that is established and cared for.

## Business facts (from the Google listing, verbatim)
- Name: {{name}}
- Category: {{category}} → schema.org `{{schema_type}}`
- Address: {{address}}
- Phone: {{phone}}
- Hours: {{hours}}
- Reviews: {{reviews_line}}
- Listing: {{maps_url}}

## Why this lead (evidence for the pitch)
Current site: {{old_site}} ({{site_status}})
{{gap_reasons}}

## Proof available (real only)
Only the rating and review count above, linked to the listing. No testimonials, licences, years in business, team
names, prices or service-area claims unless they are on the listing or the business's own pages: read
`{{maps_url}}` and the old site (if any) with `agent-reach` / `defuddle` first and add what is actually there.

## Constraints
Single self-contained HTML file. Generated imagery only, sector-appropriate, never presented as this business's own
work, staff or premises. Preview host only (no domain that could pass as the business's).
