---
name: agent-ops-pro
description: Operate long-lived agent workloads with observability, security boundaries, instinct-based continuous learning, and token-efficient incident response. Combines ECC's enterprise-agent-ops and continuous-learning skills into one, gated by Karpathy-style verification and caveman-style compression for high-volume logs.
metadata:
  origin: Forked and 10x'd from affaan-m/ECC (249 skills, two of which — enterprise-agent-ops and continuous-learning-v2 — are merged and extended here). Adds a verification gate on every operational action (Karpathy guidelines #4), token-efficient incident logging (caveman-compress pattern), and an explicit instinct→skill promotion checklist that the original left implicit.
  license: MIT
---

# Agent Ops Pro

ECC ships 249 narrow skills. Two of the strongest — `enterprise-agent-ops` (runtime,
observability, safety) and `continuous-learning-v2` (instinct-based learning) — solve
halves of the same problem: keeping a long-lived agent workload *correct* and *improving*.
This merges them into one skill and closes three gaps the originals left open.

## 1. Operational Domains (kept, from enterprise-agent-ops)

1. **Runtime lifecycle** — start, pause, stop, restart
2. **Observability** — logs, metrics, traces
3. **Safety controls** — scopes, permissions, kill switches
4. **Change management** — rollout, rollback, audit

## 2. Baseline Controls (kept)

Immutable deployment artifacts · least-privilege credentials · environment-level secret
injection · hard timeout and retry budgets · audit log for high-risk actions.

## 3. Metrics That Actually Matter (kept)

Success rate · mean retries per task · time to recovery · cost per successful task ·
failure-class distribution.

## 4. Verification Gate on Every Operational Action (new — Karpathy guidelines §4)

The original's incident pattern was a 6-step list with no built-in check that each
step actually worked. Add a verify clause to every step — "do X" becomes "do X → verify Y":

```
1. Freeze new rollout        → verify: no new deployments land for the freeze window
2. Capture representative
   traces                    → verify: traces cover both the failing route AND a healthy
                                one (you need the contrast to diagnose, not just the failure)
3. Isolate failing route     → verify: failure rate on other routes is unaffected by isolation
4. Patch with smallest
   safe change               → verify: the patch traces to a single root cause — if you can't
                                name the one-line "why this fixes it," the patch is too broad
5. Run regression + security
   checks                    → verify: both pass clean, not just the specific failing test
6. Resume gradually          → verify: success-rate metric (§3) returns to baseline at each
                                rollout increment before proceeding to the next
```

If any verify clause fails, you go back to the step it depends on — you don't push forward
on hope. This turns a checklist into a loop with exit criteria, which is the entire
difference between "we did the incident steps" and "we know the incident is over."

## 5. Instinct-Based Continuous Learning (kept, from continuous-learning-v2)

An **instinct** is a small learned behavior with a confidence score:

```yaml
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.7
domain: "code-style"
scope: project   # or global, once promoted
```

Observed via PreToolUse/PostToolUse hooks (not end-of-session — that misses things),
analyzed in the background, scoped per-project by default to avoid cross-project
contamination, and promotable to global once the same instinct appears in 2+ projects.

## 6. The Promotion Checklist (new — the original left "evolves into skills" implicit)

Don't let instincts pile up unused. Before promoting an instinct → skill/command/agent,
check all four:

- [ ] **Repetition**: seen in 2+ independent sessions/projects (not just repeated within one)
- [ ] **Confidence**: ≥ 0.7, with the evidence trail (what was observed, when, how often) attached
- [ ] **Generality**: the trigger condition is specific enough to fire correctly, general
      enough to be worth promoting (an instinct that only fires in one exact file path
      isn't a skill — it's a one-off note)
- [ ] **Non-overlap**: doesn't duplicate an existing skill — if it does, that's a signal
      to *strengthen* the existing skill instead of forking a near-twin

If all four check out, promote. If one doesn't, the instinct stays an instinct — that's
not a failure state, it's the system correctly not over-generalizing from thin evidence.

## 7. Token-Efficient Incident Logging (new — borrowed from caveman-compress)

Long-lived agent workloads generate huge log volumes, and re-reading them in full burns
tokens fast. Apply caveman-style compression to **archived** incident logs (never to
live diagnostic output, where full fidelity matters):

- Drop articles, filler, hedging — keep every error string, stack trace, ID, timestamp,
  and metric value byte-for-byte exact.
- Pattern: `[component] [event] [cause]. [resolution].` e.g.
  `"auth-svc 503 spike 14:02-14:09. pool exhaustion, max=20 hit. raised to 50, redeployed 14:11."`
- Keep a human-readable original alongside the compressed version — compression is for
  re-reading efficiency during future incident triage, not for destroying the record.

## Attribution

Operational domains, baseline controls, metrics, the incident pattern, and the
instinct-based learning model are from **affaan-m/ECC**
(`skills/enterprise-agent-ops` and `skills/continuous-learning-v2`,
https://github.com/affaan-m/ECC). This fork merges the two, adds the verification-gate
loop (from Andrej Karpathy's LLM-coding guidelines), the promotion checklist, and
token-efficient log compression (pattern from JuliusBrussee/caveman's `caveman-compress`).
Redistributed under the original's MIT terms.

## License

MIT
