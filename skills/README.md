# Supercharged Skills

Four Claude-Code skills, each a 10x rework of a flagship skill spotted in the
*GitHub Hot Repos · June 4, 2026* roundup, enriched with patterns pulled from
four reference repos (Karpathy's LLM-coding guidelines, Obsidian's linked-note
model, caveman's intensity-level/compression patterns, and the
compound-engineering loop itself).

| Skill | Forked from | What was added |
|-------|-------------|----------------|
| [`stop-slop-pro`](./stop-slop-pro/SKILL.md) | hardikpandya/stop-slop | Intensity levels (caveman pattern), genre presets, a *runnable* scoring procedure (not just a table to eyeball), and a verify-before-ship loop (Karpathy #4) |
| [`taste-pro`](./taste-pro/SKILL.md) | Leonxlnx/taste-skill | Confidence-checked Design Read, an accessibility/performance pre-flight gate (the original had none), and a closing verify-loop against the declared design read |
| [`compound-loop-pro`](./compound-loop-pro/SKILL.md) | EveryInc/compound-engineering-plugin | Condensed 37 skills' core loop into one; added surgical-change discipline and goal-driven verification (Karpathy #2–4) at every step, plus an Obsidian-style linked "lessons vault" replacing the flat changelog |
| [`agent-ops-pro`](./agent-ops-pro/SKILL.md) | affaan-m/ECC | Merged `enterprise-agent-ops` + `continuous-learning-v2` into one; added a verification gate on every operational step, an instinct-promotion checklist, and token-efficient incident-log compression (caveman pattern) |

Each `SKILL.md` carries a full attribution block crediting the original repo and
license (all four originals are MIT), and documents exactly which sections are
carried over vs. newly added — so it's auditable which parts are "supercharge"
and which are the original author's work.

## Reference repos used as inspiration

- `multica-ai/andrej-karpathy-skills` — behavioral guidelines for LLM coding (think-before-coding, simplicity, surgical changes, goal-driven execution)
- `kepano/obsidian-skills` — linked-note / knowledge-graph patterns
- `JuliusBrussee/caveman` — intensity levels, compression, token-efficiency patterns
- `obsidianmd/obsidian-releases` — release/changelog conventions referenced for the lessons-vault design

## Install

Each folder is a self-contained Claude Code skill — copy the directory into
`~/.claude/skills/` (or your project's `.claude/skills/`) to use it.
