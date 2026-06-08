---
name: hermes-agent
description: Resources and routing rules for the Hermes VPS orchestrator. Defines how to route tasks between Claude Code, Hermes, and other agents in the Space Age AI Solutions infrastructure.
---

# HERMES AGENT
## Space Age AI Solutions — VPS Orchestrator

## What is Hermes?

Hermes is the Space Age AI Solutions VPS-based orchestration layer running on DigitalOcean. It handles:
- Long-running background tasks
- Scheduled automation
- Multi-agent coordination
- Always-on services (voice agents, scrapers, email sequences)

---

## ROUTING RULES

### Send to Hermes when:
- Task needs to run longer than a Claude Code session
- Scheduled/recurring automation (daily, hourly, triggered)
- Background scraping or monitoring
- VAPI voice agent deployment
- Multi-step pipeline that runs overnight
- Production pipeline orchestrator (MAX) execution

### Keep in Claude Code when:
- Interactive tasks requiring user feedback
- One-time code generation or analysis
- Tasks completing in <10 minutes
- Tasks requiring MCP tools only available in Claude Code

---

## HERMES INFRASTRUCTURE

```yaml
VPS: DigitalOcean Droplet
OS: Ubuntu 22.04
Primary agent: Claude Code (headless)
Secondary agents: DeepSeek V4, Codex, MiniMax 2.7
Orchestration: Task queue via Redis
Persistence: PostgreSQL + file system
```

---

## TASK HANDOFF FORMAT

When routing a task to Hermes:

```yaml
task_handoff:
  task_id: "[uuid]"
  task_type: "[scraping | pipeline | voice | email | monitoring]"
  priority: "[high | normal | low]"
  context: "[relevant state and data]"
  completion_criteria: "[what done looks like]"
  callback: "[how to notify when complete]"
  timeout: "[max duration]"
```

---

## PRODUCTION PIPELINE (MAX) ON HERMES

The `production-pipeline-orchestrator` (MAX) runs on Hermes for full autonomous operation:
1. Google Maps scraping (Phase 0)
2. Qualification scoring (Phase 1)
3. Demo site generation (Phases 2-6)
4. Outreach deployment (Phases 7-8)

Deploy MAX to Hermes when running full campaigns autonomously.

---

## WHAT TO AVOID

- Don't route interactive tasks to Hermes (no user input possible)
- Don't deploy to Hermes without confirming VPS is online
- Don't run sensitive credential operations through task queue
