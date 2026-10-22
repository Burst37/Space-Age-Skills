Load and follow the dispatching-parallel-agents skill from `.claude/skills/obra-superpowers/dispatching-parallel-agents/SKILL.md`.

One agent per independent domain. All agents dispatched in a single response. No agent waits on another unless there is a true dependency. Aggregate results before presenting to user.

Arguments: $ARGUMENTS (optional — the task to parallelize)