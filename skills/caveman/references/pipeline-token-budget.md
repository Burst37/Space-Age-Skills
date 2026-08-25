# Caveman — Machine-Side Token Budget

Chat compression saves the tokens *Claude* writes. This file saves the tokens the
*pipeline* spends — which in any multi-round builder/critic/judge loop is 50–200×
larger. Load this when auditing or building a runner, not during ordinary chat.

## The 8 rules

### 1. Never re-send an unchanged file
A round-N prompt that re-sends the whole workspace pays full price for files nobody
touched. Send full bodies once; after that send changed bodies plus a one-line
manifest (`path (Nc, unchanged)`) for the rest. The model already reviewed them and
the manifest keeps it from hallucinating a missing file.
**Typical saving: 75–85% of the snapshot after round 1.**

### 2. Never pretty-print JSON into a prompt
`JSON.stringify(x, null, 2)` bills you for every space. Use `JSON.stringify(x)`.
**Typical saving: 10–20% of every JSON payload.**

### 3. A passing check has no stdout worth sending
Success is one bit. Collapse `ok:true` to `{cmd, ok:true}` and drop both streams.
For failures keep the error-matching lines plus a ~1.5k-char tail, not 20k chars
of webpack noise.
**Measured: 5,028 tok → 9 tok (pass), 9,783 tok → 397 tok (fail).**

### 4. Send evidence once, to one reader
Duplicating a judge's JSON into both the critic prompt and the judge prompt doubles
its cost and invites the two to disagree with themselves. Pick the one role that
needs it. Give downstream roles the verdict, not the raw evidence.

### 5. Put stable text first, volatile text last
Providers cache on an exact prefix. `ROUND 3` at the top of a prompt invalidates the
cache for everything under it. Order: system → mission → constraints → *then*
round number, snapshot delta, checks, critique.
**Cached input is typically 10% of the input price — this is the single largest
lever after rule 1.**

### 6. Strip non-judgeable fields from tool output
Screenshot file paths, axe node counts, minor a11y impacts, full console dumps.
Keep serious/critical only, cap arrays. The judge cannot see a PNG path anyway.

### 7. Budget before you spend
Assert a per-role token ceiling and throw *before* the HTTP call. An over-budget
prompt is a bug in the compressor, and finding it after a $12 round is too late.

### 8. Price the ledger or the ledger is decoration
A cost table of zeros reports `cost≈$0` forever and nobody notices the burn.
Real per-1M rates, plus input/output token totals per role per round.

## Where the money actually goes

Measured against a ~130k-char workspace, 6 rounds, 3 parallel candidates:

| Item | Per round | Notes |
|---|---|---|
| Builder prompt | ~55k tok | ×N candidates — snapshot dominates |
| Critic prompt | ~58k tok | full snapshot again, same round |
| Judge prompt | ~24k tok | re-sends checks the critic already read |
| **Run total (3 candidates × 6 rounds)** | **~1.48M tok** | |
| **Same run, rules 1–6 applied** | **~380k tok** | ~74% reduction |

Parallel candidates multiply the *builder* prompt only, so rule 1 pays N times over.

## Drop-in

`assets/token-budget.mjs` implements all of it:
`deltaSnapshot`, `compressChecks`, `compressWebInspection`, `assemblePrompt`,
`assertBudget`, `estimateCost` + `PRICE_TABLE`.
See `gauntlet-x-v4.md` for the exact wiring in Space Age Gauntlet X V4.
