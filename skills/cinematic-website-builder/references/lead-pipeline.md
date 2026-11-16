# Lead mode — Google Maps row to pitched spec site (v3.5)

For businesses with no website or a weak one. Nobody has asked for the site yet, so there is no client to interview
or approve: decisions come from the listing, the sector and `taste-profile.yaml`, and every gate still has an exit
condition a script checks. One human stop remains: Chuma approves the batch before anything is sent.

```
L0 SCRAPE     spaceage-geofusion-x (maps) · or any Maps export (GoSom, scraper kit, sheet)      → leads.csv/json
L1 SCORE      lead-jobs.mjs score [--audit]        no site / social-only / free builder / weak   → leads.scored.json
L2 QUEUE      lead-jobs.mjs init --top N           one job folder per HIGH lead                  → jobs/<slug>/JOB.md
L3 BUILD      one harness per job (multi-harness.md): facts → auto pickers → greybox lint → spec + words
              → assets (live roster, JSON shots) → build → verify exit 0                         → site/ + qa/REPORT.md
L4 PREVIEW    sa-deploy-operator → preview URL (noindex, preview notice)  → lead-jobs.mjs done   → status: done
L5 BATCH REVIEW   Chuma looks at the contact sheet of previews (the one human stop)              → approved list
L6 PITCH      outreach-copywriter (email/SMS), with the preview URL and the L1 evidence
L7 CONVERT    business says yes → switch the job to client mode: real intake (G0), remove noindex + notice,
              launch gate (G9), their domain. Voice agent if sold (sa-voice-agent-builder).
L8 LOG        Drive SESSION_MEMORY: leads scored, jobs done/failed, previews, pitches sent
```

## L1 — what "no website or not up to par" means here

`scripts/lead-jobs.mjs score` normalises rows (column aliases for GeoFusion, GoSom, the scraper kit and
`lead-to-brief` sheets), drops duplicates (place id → phone → name+city) and sets:

| Site status | Rule | Gap |
|---|---|---|
| `none` | no website on the listing | 100 |
| `social-only` | the "website" is Facebook, Instagram, Yelp, Linktree, a booking or directory page | 90 |
| `free-builder` | free builder subdomain (wixsite, weebly, godaddysites, square.site…) | 75 |
| `dead` (`--audit`) | own domain returns an HTTP error | 85 |
| `weak` / `decent` (`--audit`) | static audit of the home page: no HTTPS 15 · no viewport 30 · no title 10 · no H1 10 · no schema 10 · almost no text 15 · legacy markup 15 · copyright ≥ 3 years old 10 · phone not tappable 5 | sum; weak ≥ 40 |
| `unaudited` | own domain, `--audit` not run | — (priority `AUDIT`, never pitched) |

Priority: **HIGH** = gap ≥ 75 and a phone and ≥ 10 reviews at ≥ 4.0 (a real, liked business that can pay). **MED** =
gap ≥ 40. **SKIP** = no phone, no name, or a decent site. Every lead carries `why[]`: the evidence lines the
pitch may quote. The static audit is a shortcut: for a MED/`weak` lead worth real money, confirm with a
screenshot at 390 px before pitching "your site is not mobile-friendly".

## L3 — the build, per job

`JOB.md` in the job folder is the whole instruction set for the worker (any harness). Differences from client mode:

| Gate | Client mode | Lead mode |
|---|---|---|
| G0 intake | two-round questionnaire | `handoff/brief.md` prefilled from the row; worker reads the listing + old site and adds only what is there |
| G1 teardown + SEO/AEO blueprint | `seo-aeo-optimizer` | sector keyword + city, real schema.org type from `lead.json`, one question H2 + capsule per service; no competitor teardown |
| G2 moodboard | hard stop | auto: `taste-profile.yaml` + sector profile (gentle for regulated sectors) |
| G3 pickers | review screen | `--mode auto`; the plan records why |
| G4 greybox | hard stop | lint must exit 0; no stop |
| G5 spec + page-text | same | same, plus the beat sheet (Hook → Problem → Proof → Offer → CTA) |
| GR1/GR2/GR3 | 3 reviews | GR2 only, 2 lenses (conversion, accessibility) |
| G6 assets | ask when the model pick changed | auto pick from the live roster, logged; JSON shot specs linted |
| G8 QA | verify exit 0 + visual loop | verify exit 0 (same blocking checks) |
| G9 launch | launch-check on the live domain | skipped until L7 |

## Spec-demo rules (enforced by `lead-jobs.mjs done` where marked ✔)

- ✔ `<meta name="robots" content="noindex">` and a visible preview notice (`data-cwb-spec`: "Concept site prepared
  for {Business} by Space Age AI Solutions. Not yet published by the business.") until they buy.
- ✔ No `{{placeholder}}` and no `UNKNOWN` fact in the page.
- ✔ A passing `qa/report.json`.
- Facts only from the listing or the business's own pages. No invented reviews, testimonials, licences, years,
  prices, team or service area. Rating and review count appear only with their source link.
- Imagery is generated and sector-appropriate; it is never presented as their work, staff or premises. Their
  logo and photos are used only if taken from their own listing/site and only inside the demo sent to them.
- Preview host only (a Space Age project URL). Never a domain that could pass as the business's own.
- Outreach is a separate step after L5. Follow the opt-out and sender-identity rules in `outreach-copywriter`;
  one pitch per business per channel unless they reply.

## Commands

```bash
SKILL=<path to this skill>
node $SKILL/scripts/lead-jobs.mjs score leads.csv --audit            # → leads.scored.json + a ranked list
node $SKILL/scripts/lead-jobs.mjs init leads.scored.json --out jobs --top 10
node $SKILL/scripts/lead-jobs.mjs claim jobs --by claude-1           # prints one job dir (exit 3 = queue empty)
#   … worker follows <job>/JOB.md …
node $SKILL/scripts/lead-jobs.mjs done jobs/<slug> --preview https://…
node $SKILL/scripts/lead-jobs.mjs status jobs
```

`lead-to-brief` (older) writes a YAML brief with fixed fonts, colours and schema names; some of those fonts are
on the banned list and several schema types are not real schema.org types. In lead mode its **business facts and
outreach fields** are still useful; design, type, schema and deploy fields come from this skill.
