# IMPROVEMENTS: replica-skill -> replica-skill-sa

**Original:** [Jakeschincariol/replica-skill](https://github.com/Jakeschincariol/replica-skill) v1.0 (commit `77c9436`) by **Jake Schincariol** ([opusjake.ai](https://opusjake.ai)). MIT. Original copyright notice kept in `LICENSE`. The method, rules, templates and the six Python tools are his work; this file lists exactly what Space Age changed. Space Age changes are also MIT.

Applied guidelines: `sa-caveman` (level full), `karpathy-guidelines`, `ponytail` (DietrichGebert/ponytail v5.3.2, level full).

## What the original is
11 Claude skills (`/replica-recon` ... `/replica-deploy`) that clone an app's *features and flows* clean-room style, pass state through a `replica/` folder, and gate progress with 6 stdlib Python tools (`parity`, `imgdiff`, `reviews`, `contrast`, `sweep`, `listing`). 57 unit tests, all passing. Strong legal/ethical guard rails.

## Analysis of the original
Strengths
- Clear pipeline, stable IDs (S01/F01/F01-H1), concrete templates, honest scoring.
- Excellent guard rails: clean room, no scraping, no fabrication, user owns accounts, rebrand gate.
- Tools: stdlib only, no network, clear exit codes, well tested.

Weaknesses
| # | area | problem | concrete case |
|---|---|---|---|
| W1 | triggering / token bloat | 11 separate skills -> 11 descriptions (5,782 chars, ~1,445 tokens) in the always-loaded skill list, overlapping trigger phrases ("is it ready", "does it work") that compete with other skills | every session pays ~1.4k tokens before any clone work |
| W2 | duplication | clean-room / no-scrape / user-owns-keys rules restated in 6 skills | same paragraph read many times in one pipeline run |
| W3 | gate gap | `parity.py` exits 0 when must-haves are missing; deploy preflight says "any failure stops the deploy" but ran it with no flag | matrix with 1 must missing + 40 coulds done -> exit 0, deploy proceeds |
| W4 | config bug | `sweep.py --config` with `"avoid": "Calendly"` (string, not list) splits into letters | every file containing "a" or "l" reported as a leftover |
| W5 | config bug | `listing.py --avoid` *replaced* the listing's own `avoid` list instead of merging | listing.json avoids "Acme Corp", CLI passes "Other" -> "Acme Corp" in description passes |
| W6 | doc/code drift | brand skill says `brand.json` is used by `listing.py`, but `listing.py` had no way to read it | brand avoid list never reached the listing lint |
| W7 | config bug | `listing.json` `"avoid": "Calendly"` string split into letters | single-letter words flagged as the original's name |
| W8 | silent bad input | `reviews.py --today 10/16/2026` silently used the real date | "reproducible" runs not reproducible |
| W9 | false positives | `sweep.py` names match inside words by design; short names explode | `--avoid Box` flags every `checkbox`, `inbox` |
| W10 | dead code | `BINARY_ASSET_HINT` regex in `sweep.py` never used | - |
| W11 | fragile paths | deploy used `../replica-diff/parity.py` relative paths that depend on cwd | breaks when run from the project root |
| W12 | missing verification step | stages ended with "Output" prose, no uniform "run the gate, paste real output" | agent can summarise instead of proving |
| W13 | tests | `tests/test_repo.py` pins README marketing copy, not behaviour | - |

## Every change

### Structure (ponytail: least new code; skill-authoring: progressive disclosure)
1. **11 skills -> 1 skill + 11 stage references.** `SKILL.md` is a router (hard rules + stage table). Each stage lives in `references/NN-stage.md`, loaded only when that stage runs. Fixes W1.
2. **One trigger description** (489 chars) with explicit "Use when" phrases and a "Not for" clause, replacing 11 overlapping ones.
3. **Hard rules stated once** in `SKILL.md` (always loaded with the skill, never compressed). Stage files keep only stage-specific rules. Fixes W2.
4. **Folders by role:** `scripts/` (tools + `themes.json`), `templates/` (all 10 output templates), `references/`, `tests/`. Matches Space Age repo convention (`SKILL.md` + `references/`).
5. **`$S` path convention**: every command is `python3 $S/scripts/<tool>.py`, cwd-independent. Fixes W11.
6. **Uniform stage close-out** (karpathy goal-driven): run the gate, paste real output, SA status line `✅/❌ stage — number — next`, 5-line summary. Each stage file ends with a `Done when` checklist. Fixes W12.
7. Dropped the Claude plugin manifests (`.claude-plugin/`): not used by this repo's install method (copy folder into `.claude/skills/`).

### Writing (caveman full + ponytail)
8. Stage text rewritten caveman-full: fragments, arrows, tables over prose, no filler. **Kept complete:** every safety, legal, money and approval rule; every number (limits, thresholds, weights, Stripe test card, DMARC record); every command; all code blocks.
9. Removed narrative repeats ("Everything else in the pack builds from this...") where the table already says it.

### Tools (karpathy surgical + ponytail smallest diff; each fix has a regression test that fails on the original)
10. `parity.py`: new `--gate` flag, exit 1 if any must-have is not done. Default behaviour unchanged. Deploy preflight now runs `--gate --fail-under 80`. Fixes W3.
11. `sweep.py`: `--config` accepts a string or a list for `avoid` / `domains` / `colors`. Fixes W4.
12. `sweep.py`: stderr warning for names of 3 chars or fewer (substring false positives); still reports hits, never hides them. Fixes W9.
13. `sweep.py`: removed unused `BINARY_ASSET_HINT`. Fixes W10.
14. `listing.py`: `--avoid`, the listing's own `avoid`, and new `--config brand.json` are **merged** (deduped). String `avoid` no longer split into letters. Bad config -> exit 2. Fixes W5, W6, W7.
15. `reviews.py`: invalid `--today` -> exit 2 with a clear message. Fixes W8.
16. `imgdiff.py`, `contrast.py`: unchanged (no concrete defect found).

### Tests
17. Ported the original 52 behaviour tests unchanged except loader paths (`tests/_load.py` now loads from `scripts/`).
18. New `tests/test_sa_fixes.py` (7 tests). All 7 fail on the original scripts, pass on these.
19. New `tests/test_skill.py` (5 tests): frontmatter, every path mentioned in SKILL.md/references exists, 11 stage refs routed, every script runs `--help`, original license kept. Replaces `test_repo.py` (W13).

Run: `python3 -m unittest discover -s tests -v` -> 64 tests, OK.

## Token footprint (chars / 4 ~ tokens)
| what | original | SA | change |
|---|---|---|---|
| always-loaded (skill list descriptions) | 5,782 chars (~1,445 tok), 11 entries | 683 chars (~170 tok), 1 entry | **-88%** |
| stage instructions, avg per stage | 4,260 chars | 2,457 chars | **-42%** |
| full 11-stage run (all instruction text) | 46,855 chars (~11.7k tok) | 31,006 chars (~7.8k tok) | **-34%** |
| one stage, cold session (router + 1 ref) | 4,260 chars | 6,434 chars | +51% (router + global hard rules; the cost of stating rules once) |

## Skipped on purpose (ponytail: named, not built)
- No `preflight.py` runner wrapping the 5 deploy commands: 5 lines in `references/11-deploy.md` do the job.
- No colour/word-boundary option in `sweep.py`: the warning covers short names without a new mode.
- No changes to `imgdiff.py` PNG decoder (interlaced PNGs still refused with a message, as documented).

## v1.1.1 (2026-10-16): ideas ported from REA (via rea-sa)
- Recon claims tagged **observed / inferred / unknown** (`references/01-recon.md` step 6, `templates/recon-map.md`). Source: REA's evidence model (morluto/rea, MIT).
- Recon "Done when" now starts with a scope-checklist revisit (answered / partial / unresolved), REA's finish rule.
- Internals rule: competitor apps stay no-decompile (unchanged hard rule); for software the user owns or is authorized to examine, `rea-sa` may supply behaviour evidence as recon rows, never as code.
- Test: `tests/test_skill.py::test_recon_tags_evidence_type`. Suite: 65 tests OK.
