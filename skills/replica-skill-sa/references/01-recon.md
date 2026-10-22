# 01 Recon: reverse-engineer the app into a map
Everything builds from this. Bad map -> bad clone. Hard rules in SKILL.md apply.

Writes: `replica/recon.md` (template `templates/recon-map.md`), `replica/features.csv` (template `templates/features.csv`), `replica/screens/` (reference only, never shipped).

## Steps
1. **Scope.** Ask, or propose + get a yes: (a) app + platform (web/iOS/Android/desktop); (b) slice: default = core loop, the one flow users pay for ("Notion pages, blocks, sharing", not "all of Notion"); (c) who it is for.
2. **Sources table**, URL on every row, by value: help center/docs (fullest feature list + settings) > pricing page (gated = important) > changelog > store listing (screenshots, ratings) > public walkthrough videos > marketing site > user's own account (user drives) > public API docs (data model).
3. **Screens.** One row each, stable IDs S01, S02...: `ID | screen | route | purpose | key components | states seen`. Record states: empty, loading, filled, error, permission denied, mobile. Unrecorded state = unbuilt state.
4. **Flows.** F01, F02... goal + screen path + edge cases. Count happy-path clicks = number to beat.
   ```
   F01 Guest books a meeting
       S07 booking page -> S08 pick time -> S09 details -> S10 confirmed
       clicks: 4   edge: no slots, time zone differs, slot taken mid-form
   ```
5. **Components.** Every repeated part: name, variants, states, screens used. Feeds stage 3.
6. **Data model.** Entities, fields, relations, each with evidence + confidence (high / medium / guess). Guesses marked as guesses.
   Tag every recon claim **observed** (seen on a screen, doc, or listing; cite source row / S-ID) / **inferred** / **unknown**. Unknowns go in the summary, never filled by guessing.
7. **Feature matrix** `features.csv`: `feature,area,priority,original,clone,notes`. priority must/should/could. `clone` starts `no` everywhere.
8. **Not cloneable** -> `skip` rows with reason: licensed content, the network/users, owned data, partner deals, hardware, regulated licences.
9. **Size.** Counts + hard parts (realtime, sync, payments, calendar/email integrations, offline). S weekend / M weeks / L quarter / XL rescope. No "perfect clone" promises.

**Internals.** Competitor's app: no decompiling or bundle reading, ever (hard rules). Software the user owns or is authorized to examine (own old app, interop target) -> `rea-sa` may supply behaviour evidence; its findings enter as recon rows, never as code.

## Done when
- [ ] scope checklist revisited: each question answered / partial / unresolved
- [ ] every source row has a URL
- [ ] every screen has states; every flow has edges + click count
- [ ] `features.csv` loads: `python3 $S/scripts/parity.py replica/features.csv` exits 0 or 1, never 2
- [ ] summary: core loop, screen/flow counts, 3 hardest parts, out of scope, next `02-architect`
