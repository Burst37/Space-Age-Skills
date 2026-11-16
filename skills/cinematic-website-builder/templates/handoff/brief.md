---
# CWB v3.3 hand-off: brief. Gates are flipped ONLY by Chuma's approval (or full-auto mode for the pickers).
client: "{{Business name}}"
sector: "{{home-healthcare | law | saas | medical | restaurant | fashion | …}}"
city: "{{City, ST}}"
tier: "{{factory | enhanced | cinematic | flagship}}"
mode: review                  # review = Chuma approves each picker screen · auto = pickers decide and log why
profile: "{{gentle | bold}}"  # gentle = subtle-cinematic (regulated sectors), set automatically from sector
signature_style: video-per-section   # from taste-profile.yaml; set none to opt out
custom_type: behind-subject          # style id from custom-typography.md (regulated: behind-subject | mixed)
confirmed: false              # G0
moodboard_approved: false     # G2 hard stop
motion_approved: false        # G3
type_approved: false          # G3
wireframe_approved: false     # G4 hard stop
review_gr1: pending           # v3.4 goldfish review of this brief + blueprint (before G2) — references/goldfish-review.md
review_gr2: pending           # goldfish review of design-spec + page-text (before G6)
review_gr3: pending           # drift check, built preview vs design-spec (before G9)
domain: "{{https://www.example.com}}"
preview_url: ""
---
# Brief: {{Business name}}

## The website will…
<!-- Written automatically after intake (Fadel's brief highlight). 5–8 lines. Each one starts "The website will…". -->
- The website will {{turn a worried family member into a booked call within one visit}}.
- The website will {{show real caregivers and real homes, not stock smiles}}.
- The website will {{answer the six questions families ask before calling, in plain words}}.
- The website will {{make the phone number and the "Find care" button reachable from every screen}}.
- The website will {{feel calm, warm and local}}.

## Business facts (NAP exactly as on the Google Business Profile)
Name · address · phone · hours · service area · licences/registrations · founded · owner.

## Audience and promise
Who arrives, what they fear, what they need to believe, and the outcome promised in one sentence.

## Proof available (real only)
Reviews (source and count), certifications, years, photos we own. No invented stats.

## References (from intake)
| # | Link / upload | What they like | Avoid |
|---|---|---|---|

## Constraints
Budget tier, launch date, platform (single file · Astro · Next.js), host (Vercel · Cloudflare Workers), content owner.
