# Goldfish review GR1 — brief.md (Astonishing Touch worked example)

Round 1 of max 2, 15 Nov 2026. Target: `brief.md` as it stood in v3.3.0 (70 lines). Reviewer inputs only: the brief, the CWB rule files
in each packet, and the live preview `https://astonishing-touch-healthcare-lx888d8ej.vercel.app/`. No conversation, no FINDINGS.md.
Decisions were filled in afterwards by the elephant (the agent that holds the project context).

## Reviewer status
| Lens | Status |
|---|---|
| naive-client | completed |
| search-and-answers | completed |
| trust-and-tone | completed |
| zoom-out | completed |

## Paraphrase
**What this site will do:** a multi-page site for a nonmedical home-care agency in Creve Coeur, MO that moves families toward a call
or inquiry, gives each of nine services its own page, tells the founder's story and answers family questions.
**Who it is for:** not stated. The reader has to infer "adult children arranging care for a parent" from the CTA copy.

## Findings
| ID | Sev | Lens | Scope | Finding | Evidence | Decision |
|---|---|---|---|---|---|---|
| GR1-1 | blocker | trust-and-tone | Facts; WW#2 | No licence/registration fact and no open question about it, while the live About copy says "licensed … in-home health care agency" and "Our Staff is licensed, certified, insured and bonded". Unsourced licensure plus "health care agency" contradicts the nonmedical positioning. | subtle-cinematic.md: "State licensing or registration exactly as issued … footer and About"; live `/` and `/about` About paragraph | ask: licence/registration (agency + number) or drop the claim · fix: Facts slot + hard ban added |
| GR1-2 | should | search-and-answers | Facts; Schema plan | No service area anywhere. Schema defers `geo`/`areaServed`/`sameAs` "once confirmed" but nobody is asked for them. | subtle-cinematic.md §Schema (geo, areaServed, sameAs required); seo-aeo-gate.md §2 Entity/NAP | ask: service area + GBP/profile URLs · fix: open question added |
| GR1-3 | should | naive-client | whole doc | No "Audience and promise" or "Proof available" section; downstream copy and CTA choices have nothing to test against. | templates/handoff/brief.md has both sections | fix |
| GR1-4 | should | zoom-out | front matter | No front matter: sector, tier, profile, signature_style, custom_type and the gate flags are missing, so the pickers and greybox cannot read the brief and gates cannot be recorded. | CWB §1 "The gates live in handoff/brief.md front matter"; template front matter | fix |
| GR1-5 | nit | zoom-out | The website will… | 12 lines; G0 asks for 5–8. Lines 10–12 are build mechanics, not client commitments. | CWB §2 G0 "5–8 lines" | fix: 8 lines + "Build commitments" list |
| GR1-6 | should | naive-client | WW#4 | Three equal primary actions (call, email, inquiry). Name one primary. | CWB §7 "CTA is a verb; proof sits next to the ask" | contest: wireframe Home #1 already sets one primary ("Find care for your loved one"); WW#4 reworded to say so |
| GR1-7 | nit | naive-client | Facts | What the after-hours number is for (existing clients? new families?) is not stated. | Facts lines 16–18 | ask |
| GR1-8 | should | search-and-answers | whole doc | G1 needs the top-3 teardown and money keywords before the blueprint; the brief has a sitemap and schema plan but no competitors, keywords or AI-citation map. | seo-aeo-gate.md §1–§2; CWB §2 G1 | fix: "G1 evidence" section, teardown marked pending (required on a live build) |
| GR1-9 | nit | naive-client | Facts | Payment/insurance stance not stated. | Hard bans "no implied insurance acceptance" | contest: WW#4 already says prices are discussed with staff; live Care Questions handles rates that way |
| GR1-10 | nit | trust-and-tone | WW#9 | An AI receptionist named after the real founder invites the confusion the disclosure has to undo. judgment | subtle-cinematic.md AI disclosure | accept-risk: client's naming; disclosure already in WW#9 and on About |
