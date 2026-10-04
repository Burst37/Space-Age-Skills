# SPACE AGE GAUNTLET X V4 — MASTER HANDOFF

V4 collapses the previously planned V3.3–V3.6 roadmap into one architecture.

## V4 capability set

### Multimodal reference ingestion
- screenshots
- short videos
- Gemini direct video understanding
- FFmpeg keyframe fallback
- Reference DNA

### Reference-aware post-build judging
Candidate site evidence is scored on:
- technique fidelity
- motion fidelity
- originality
- visual quality
- responsive quality

A candidate can fail for:
- copying too literally
- not reproducing the intended interaction grammar
- breaking responsive/accessibility quality

### Parallel candidates
`parallelCandidates` can be >1.
High-leverage rounds may generate multiple independent candidate solutions and use a blind judge to select a winner.

### Benchmark Scout
Optional `liveBenchmarkScout` creates a benchmark manifest before the first round.

### Git safety workflow
- pre-run checkpoint
- dedicated gauntlet branch
- optional round commits
- no automatic production push

### Provider health / failover
Providers can be probed independently.
Runner falls back across configured provider families when credentials exist.

### Cost ledger
Every provider call can be recorded with:
- role
- provider
- model
- usage
- estimated cost
- round

Pricing registry is intentionally overrideable because live pricing changes.

### Accessibility / browser audit
Playwright inspection can include:
- viewport screenshots
- console errors
- axe accessibility violations

### Resumable state
Runner supports `--resume` when `resumeStatePath` is configured.

### Plateau logic
Low-delta score rounds force a strategy change.

### Regression memory
PASS ledger remains cumulative and can remove regressed capabilities.

### Safety boundaries preserved
- no arbitrary model shell commands
- no writes outside workspace
- protected paths remain protected
- human-authored checks only
- builder != critic != judge

## Reference-driven website target loop

```text
UPLOAD SCREENSHOTS / SHORT VIDEO
        ↓
GEMINI MOTION FORENSICS
        ↓
REFERENCE DNA
        ↓
BENCHMARK SCOUT
        ↓
3 PARALLEL BUILD CANDIDATES
        ↓
BLIND WINNER SELECTION
        ↓
REAL BUILD/TEST
        ↓
PLAYWRIGHT SCREENSHOTS + AXE
        ↓
REFERENCE-AWARE VISUAL JUDGE
        ↓
FRESH CRITIC
        ↓
INDEPENDENT JUDGE
        ↓
REGRESSION + COST + PLATEAU CHECK
        ↓
ROUND COMMIT
        ↓
REPEAT / SHIP
```

## Remaining edge, not missing architecture
V4 intentionally leaves these as optional integrations rather than core blockers:
- cloud container provisioning
- automatic production deployment
- automatic PR push
- real-time websocket dashboard
- exact live provider pricing registry
- true video recording of the candidate scroll path (screenshots are currently the default post-build evidence)
- direct screenshot binary attachments to every provider adapter

Those can be added without changing the architecture.
