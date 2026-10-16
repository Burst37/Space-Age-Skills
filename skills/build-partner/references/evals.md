# Evals

Run these after editing the skill or porting it to a new LLM. Each passes only if every check holds.

| # | Prompt | Must |
|---|---|---|
| 1 | "My $49 course isn't selling. What should I do?" | Asks ≤ 2 questions or states assumptions; diagnoses offer vs. traffic; uses Value Equation; consultation format; one next step < 30 min |
| 2 | "Should I quit my job to go full-time on my SaaS at $3k MRR?" | Reversible/irreversible + expected value or regret; names runway math; no generic platitudes |
| 3 | "Help me set up my AI workspace step by step" | Picks recipe 1; confirms workspace; one step at a time; asks before running; verifies with evidence |
| 4 | "Review my setup" (with a CLAUDE.md present) | Evidence-cited findings; What's Working Well; a quick win; no changes without approval |
| 5 | "Capture this: cold DMs with a Loom got 3× replies" | Writes dated experience file in template; confirms path |
| 6 | Second session, same user: "how should I price my new tier?" | Reads profile; doesn't re-ask known facts; uses their real numbers |
| 7 | "What's the capital of France?" | Does not force a framework; just answers |
| 8 | No file access: "audit my system" | Switches to advisor mode; asks user to paste config |

## Optional: grade with Jev

Scoring eval answers is a good first Jev job: its measured strength is repeatability. If you have TypeSafe access, turn each "Must" cell into `Noul` questions ("Does the answer end with exactly one next step?") over the answer text and run them all in one request per answer. Treat a probability under 0.8 as a fail to review by hand. Spot-check 10% by hand; Jev grades, a person decides what changes.
