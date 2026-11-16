# Pipeline coverage — nothing from the earlier skills is skipped (audit 2026-11-16)

Three versions were compared step by step: the **original skill** (v2, "Stage 3 of the master pipeline", 30
modules; still in `Burst37/web-agent`), **v3.2.0** (seven phases P0–P6; `main` of this repo) and **v3.4.0** (the
box/Grok-bot rebuild: gates G0–G10, pickers, greybox, goldfish). v3.5 is the union.

| Step | Original (v2) | v3.2 | v3.4 | v3.5 |
|---|---|---|---|---|
| Lead scrape + scoring | upstream ("Stage 1 brief") | routing row | routing row | **L0–L2**, `lead-jobs.mjs` |
| Brief from a lead | `lead-to-brief` | pre-fills intake | routing row | `templates/lead/brief.md` (facts only) |
| Direction intake | 5 questions | P0 two rounds + uploads | G0 | G0 (client) / prefilled (lead) |
| Competitor teardown + SEO/AEO blueprint | — | — | G1 | G1 (+ built-in AEO check when the owner skill is absent) |
| Moodboard / direction lock | Stage 2 `ui-ux-designer` (letters A–N), three dials | P1 Design Read | G2 Muse moodboard | G2; **`ui-ux-designer` / `ui-ux-pro-max` restored as the owner when Muse is not installed** |
| Layout review | Stage 2.5 Google Stitch (Premium) | removed in 3.1 | grey-box wireframes G4 | G4 (Stitch stays removed, by your 3.1 decision) |
| Narrative recipe + **beat sheet** (Hook → Problem → Proof → Offer → CTA) | "scroll story" question | P2 Score | **dropped** (only the motion plan remained) | **restored** in G5, design-spec §6 |
| Motion score + signature moment + budget | 6–8 module cap | P2 | G3 motion picker | G3 |
| Type selection | from moodboard | P1 tokens | G3 type picker | G3 |
| Assets before build | yes | P3 | G6 | G6 + **live model roster** + **JSON shot specs** |
| Cinematography direction | prompt skill | prompt tokens | prompt tokens (≥150 words, token quota) | **`space-age-cinematic-director` v4.1** owns it; tokens tiered |
| Build | Stage 3 | P4 | G7 build chain | G7 |
| QA gate | Stage 4 (3 devices) | P5 verify (5 passes) | G8 verify (8 passes) + GR3 | G8 |
| Launch gate | — | — | G9 | G9 |
| Deploy | Stage 5 `sa-deploy-operator` | P6 | G10 | G10 |
| **Voice agent** | Stage 6 (`sa-voice-agent-builder`) | module only (WIP) | **no step** (module #38 exists) | **G11**, when sold: Gemini Live (`voice-gemini`) |
| **Outreach** | Stage 7 `outreach-copywriter` | — | **no step** | **G12** / lead L6, after batch review |
| Vault / memory log | Stage 8 | P6 | G10 | G12 close |
| Parallel production | — | — | — | `multi-harness.md` |

## Owners v3.4 routes to that are in neither repo (`Space-Age-Skills`, `web-agent`)

`seo-aeo-optimizer`, `design-reference-moodboard` (and Muse), `site-reverse-engineer`, `type-as-brand`,
`reanimate`. They live on the box that produced v3.4. Until they are committed, v3.5 uses these stand-ins and
says so in the report:

| Missing owner | Stand-in |
|---|---|
| `seo-aeo-optimizer` | `sa-local-seo-geo` / `local-business-seo` for the plan; `verify.mjs` built-in AEO blocking checks |
| Muse + `design-reference-moodboard` | `ui-ux-designer` + `ui-ux-pro-max` moodboard, `mobbin-operator` references |
| `site-reverse-engineer`, `reanimate` | `replica-skill-sa`, `reverse-engineer-anything` (observed behaviour only) |
| `type-as-brand` | the type picker's `brand_fonts` input |

To remove the stand-ins: commit those five skills from the box into `Space-Age-Skills/skills/`.
