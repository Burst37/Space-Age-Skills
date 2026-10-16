# 06 Test: every flow, every edge
Reads recon flows. Writes `replica/test-plan.md` (template `templates/test-plan.md`), `replica/bugs.md` (format `templates/bug-report.md`), `e2e/` (start from `templates/e2e.example.spec.ts`).

**Rule: test the clone, never the original.** No load testing, fuzzing or scripting against the original's servers. Using it by hand as a normal user is fine.

## 1. Plan (per flow F01...)
- **Happy path**: steps + expected end state.
- **Edges** (walk this list every flow): empty input, very long input, emoji/accents, two tabs, double-submit, back mid-flow, refresh mid-flow, slow network, offline, expired session, second user's data (must be invisible), time zones/DST, mobile width, keyboard only, SR labels.
- **Negative**: wrong password, card declined (Stripe `4000 0000 0000 0002`), permission denied, deleted record.
- IDs: `F01-H1`, `F01-E3`, `F01-N2`.

## 2. Automate
Playwright, one spec per flow, local dev server + seed data. Selectors by role/label (`getByRole('button', { name: 'Book' })`), never CSS classes. Every spec: fail on console error, fail on any 5xx, axe scan per screen (`@axe-core/playwright`).
```bash
npm i -D @playwright/test @axe-core/playwright && npx playwright install chromium
npx playwright test
```

## 3. Manual pass
Can't automate (real email, real OAuth, payments end to end, visual glitches) -> browser tool on the local clone with a screenshot per step, else give the user a checklist and wait.

## 4. Bugs
Only reproduced bugs go in `bugs.md` (ID, severity, steps, expected, actual, evidence). Unconfirmed -> separate "to check" list.

| sev | means |
|---|---|
| S1 | data loss, security hole, payments wrong, core flow blocked |
| S2 | feature broken, no workaround |
| S3 | broken with workaround, or visibly wrong |
| S4 | cosmetic |

## 5. Fix loop
S1, S2 first. Per fix: failing test first -> fix -> passes -> keep test. Full suite after each batch. Record fixing commit in `bugs.md`.

Output: cases run/passed/failed, bugs by severity, fixed so far. **Open S1 = ship nothing.** Next: `07-diff`.
