Load and follow the using-superpowers master skill from `.claude/skills/obra-superpowers/using-superpowers/SKILL.md`.

Invoke skills BEFORE any action. Priority order: User instructions > Superpowers skills > Default Claude behavior. When in doubt which skill to use, this file is the index.

Available obra/superpowers slash commands:
- /brainstorm — pre-plan before any implementation
- /writing-plans — write concrete executable plans
- /tdd — test-driven development cycle
- /debug — systematic root-cause debugging
- /subagents — dispatch parallel subagents
- /verify — verify before claiming completion
- /execute-plan — run a written plan step by step
- /finish-branch — wrap up a dev branch correctly
- /request-review — request code review
- /receive-review — process review comments
- /parallel-agents — dispatch independent agents in parallel
- /worktree — git worktree isolation
- /write-skill — create a new skill with TDD

Arguments: $ARGUMENTS