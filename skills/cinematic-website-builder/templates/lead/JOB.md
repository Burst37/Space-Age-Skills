# JOB: spec-demo site for {{name}} ({{loc}})

You are one worker in a multi-harness queue. This folder is the whole job; do not read other job folders.
Skill root: `{{skill}}` · Job root: `{{job}}` · Tier: {{tier}} · Sector: {{sector}} ({{profile}} profile)

## Read, in this order (nothing else up front)
1. `{{skill}}/SKILL.md` (mode router; you are in **lead mode**)
2. `{{skill}}/references/lead-pipeline.md` (the steps below in full, and the spec-demo rules)
3. `handoff/brief.md` and `lead.json` in this folder (the only facts you have)
Load any other reference only when its step starts.

## Steps (each has an exit condition; stop and `fail` if one cannot be met)
1. **Facts.** Read the listing and the old site if there is one (`agent-reach` / `defuddle`). Add only what is there to
   `handoff/brief.md`. Exit: no UNKNOWN fact is used anywhere downstream.
2. **Pickers + greybox (auto).**
   `node {{skill}}/scripts/motion-pick.mjs handoff/wireframe.yaml --mode auto --tier {{tier}} --taste {{skill}}/taste-profile.yaml --out handoff`
   `node {{skill}}/scripts/type-specimens.mjs handoff/type-inputs.yaml --mode auto --taste {{skill}}/taste-profile.yaml --out handoff/type`
   `node {{skill}}/scripts/greybox.mjs handoff/wireframe.yaml --out handoff/greybox --no-shots`  → exit 0
3. **Spec + words.** Fill `handoff/design-spec.md` and `handoff/page-text.md` (every word; `stop-slop-pro`). Exit: no TODO.
4. **Assets.** `references/model-roster.md` (live roster, record the model per slot) → stills per `asset-pipeline.md`,
   clips as JSON shot specs per `references/video-json-prompting.md` → `node {{skill}}/scripts/shot-lint.mjs handoff/assets/shots`.
   No media budget or no generation tool on this harness: ship posters/gradients (media tier T0) and say so in the report.
5. **Build.** `cp {{skill}}/templates/starter.html site/index.src.html` → build → `node {{skill}}/scripts/assemble.mjs site/index.src.html -o site/index.html`.
   Add `<meta name="robots" content="noindex">` and a visible preview notice element with `data-cwb-spec` (wording in lead-pipeline.md).
6. **QA.** `node {{skill}}/scripts/verify.mjs site/index.html --motion-plan handoff/motion-plan.yaml --type handoff/type/type-pick.yaml` → exit 0.
7. **Close.** Deploy a preview if this harness can (`sa-deploy-operator`), then
   `node {{skill}}/scripts/lead-jobs.mjs done {{job}} --preview <url>`; otherwise `done` without `--preview`.
   Cannot finish: `node {{skill}}/scripts/lead-jobs.mjs fail {{job}} --reason "<one line>"`.

## Hard rules
- No invented facts: reviews, licences, years, prices, team, service area, testimonials, photos "of their work".
- No outreach from this job. Pitching is a separate, human-approved batch step.
- Do not touch `status.json` or `.claim` by hand, and do not edit files outside this folder.

## Report (last message, nothing else)
`done|failed · preview URL or none · verify PASS/FAIL · models used per slot · what was skipped and why`
