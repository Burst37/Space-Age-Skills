# IMPROVEMENTS: REA reverse-engineer-anything -> rea-sa

**Original:** [morluto/rea](https://github.com/morluto/rea) by **morluto**. MIT. Snapshot: package `rea-agents` v6.5.0, agent skill `reverse-engineer-anything` metadata v42, commit `0c7b6d834`. `LICENSE` and `DISCLAIMER.md` kept verbatim. The REA tools, the evidence model and every reference guide are morluto's work. This file lists exactly what Space Age changed. Space Age changes are also MIT.

Applied: `sa-caveman` (full), `karpathy-guidelines`, `ponytail` (v5.3.2, full), Cursor skill-authoring guide.

Relationship to `skills/reverse-engineer-anything` (vendored REA skill v41, 2026-10-15): left untouched, along with its MCP registration and `/rea` command. `rea-sa` is the lean Space Age entry point for the same MCP server (v42 text).

## What REA is
An MCP server + CLI (`npx rea-agents`) giving agents evidence-backed reverse engineering across native binaries (Ghidra/Hopper/IDA/Kuna bridges), JS/Electron/ASAR, Android, .NET, firmware, WASM, EVM, Go/Rust metadata, SQLite, captures (HAR/SAZ/qlog/PCAP/signals) and browser/Electron runtime. About 474k lines of TypeScript, 1,267 test files, around 30 CI workflows. The agent skill (SKILL.md + 6 references) tells the agent how to route a target, work summary-first, page large Evidence, and report observations vs inferences vs unknowns.

## Analysis of the upstream skill
Strengths
- Rigorous evidence model: Evidence IDs, observed / inferred / unknown, preserved limitations, no "static analysis observed execution".
- Token-aware tool use: summary-first, retained views, never repeat identical calls, handles truncation.
- Safe setup: read-only doctor, `--dry-run` plan, approval before config writes, never installs unrelated software.
- Already split into 6 domain references; a huge, well-tested tool behind it.

Weaknesses
| # | area | problem |
|---|---|---|
| W1 | token bloat | SKILL.md body is 23,510 chars (~5.9k tokens), read in full on every trigger; about 70% is a per-target routing catalogue, and a run needs one row of it |
| W2 | safety in the skill | Responsible-use limits (DRM, cheats, auth bypass, copying code) exist only in `DISCLAIMER.md`, which the agent never loads. The skill itself says REA "does not require permission grants" and has no authorization gate |
| W3 | clean-room gap | "Finish the task" says only to use normal coding tools when building; nothing stops pasting decompiled or recovered code, assets or strings into the user's product, though DISCLAIMER says the output grants no rights |
| W4 | triggering | the description lists capabilities but no user phrasing ("how does this app do X", "decompile", "inspect this APK") |
| W5 | duplication | the connect section repeats itself ("setup never installs ... Node.js, npm, Homebrew ..." twice) and overlaps `connection-and-recovery.md` |
| W6 | ledger with no template | step 7 asks for a finding ledger but gives no format |
| W7 | scanability | dense long-sentence prose, no tables |

## Every change
1. **Lean SKILL.md (6,942 chars, -70%).** The always-read body keeps the decision logic: when to use REA, connect, a one-line route table, summary-first, investigate, report, build. Fixes W1 and W7.
2. **Full detail moved verbatim, loaded on demand:** `references/connect-and-cli.md`, `references/target-routing.md`, `references/summary-first.md`. These are the exact upstream sections. The only edit is that relative links drop the `references/` prefix so they resolve from inside `references/`. The 6 upstream references are copied unchanged.
3. **Route table:** 16 target types mapped to the first tool, replacing 165 lines of prose in the always-read body (prose kept in `target-routing.md`).
4. **Authorization gate (section 0)**, built from upstream `DISCLAIMER.md`: authorized uses, explicit refusals, "authorization to inspect != authorization to execute or intercept", ask-which-app, legally obtained engines. Fixes W2.
5. **Clean-room build handoff (section 6)**, ported from `replica-skill-sa`: behaviour spec in your own words, never paste recovered code, assets or strings, observed separated from design choices, whole-product rebuilds handed to `replica-skill-sa`. Fixes W3.
6. **Description rewritten** with "Use when" user phrases and a "Not for" clause (source repos, DRM, cheats, copying). Fixes W4.
7. **Connect section deduplicated** to 4 lines that keep every safety point (read-only doctor, dry-run, approval, no unrelated installs, CLI fallback). Fixes W5.
8. **`templates/finding-ledger.md`**: question checklist, a findings table (type, Evidence IDs, confidence, boundary, unknowns) and a behaviour-spec block. Fixes W6.
9. **SA close-out:** status line `✅ rea — n/m answered — next` / `❌ rea — blocker — fix`, plus the checklist revisit.
10. **Tests** (`tests/test_skill.py`, 7, standard library only): frontmatter; SKILL.md stays under 8,000 chars; every path and relative link resolves; **no backticked identifier from upstream SKILL.md is lost** (49 tool, parameter and client names); **the moved sections are byte-verbatim** against `tests/fixtures/upstream-SKILL.md`; the authorization gate and clean-room rules are present; LICENSE and DISCLAIMER are kept. Mutation-checked: corrupting a moved section or a link makes the tests fail.

## Ported into replica-skill-sa (v1.1.1)
- REA's **observed / inferred / unknown** tagging, added to recon (`references/01-recon.md`, `templates/recon-map.md`), plus a scope-checklist revisit in recon's "Done when". Test: `test_recon_tags_evidence_type`.
- One rule linking the two skills: competitor apps stay no-decompile; software the user owns or is authorized to examine may use `rea-sa` for behaviour evidence, which enters as recon rows and never as code.

## Token footprint (chars / 4 ~ tokens)
| what | upstream | rea-sa | change |
|---|---|---|---|
| always-loaded description | 300 chars (~75 tok) | 559 chars (~140 tok) | +259 chars (+65 tok): user trigger phrases + "Not for" clause |
| per trigger, SKILL.md only | 23,510 (~5.9k tok) | 6,942 (~1.7k tok) | **-70%** |
| JS task (SKILL.md + JS guide) | 35,472 | 18,904 | **-47%** |
| JS task + full routing detail | 35,472 | 31,259 | -12% |
| native task (SKILL.md + native guide) | 41,433 | 24,865 | **-40%** |

## Skipped on purpose (ponytail)
- Domain references not rewritten. They are precise tool contracts (parameters, versions, env vars), so compressing them risks wrong calls; they are loaded on demand anyway.
- No new scripts: REA's own CLI and MCP are the tooling.
- `skills/reverse-engineer-anything` not edited or removed (delete nothing). The user can retire it later.
