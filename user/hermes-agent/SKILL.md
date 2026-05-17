---
name: hermes-agent
description: >
  Resources, repos, and routing rules for the Hermes 24/7 VPS orchestrator
  — lane routing, self-improvement, and web UI references.
---

# Hermes Agent — Orchestrator Resource Hub
**Purpose:** Central reference for the Hermes VPS orchestrator: source repos, UI, and skill integrations  
**Maintained by:** Space Age AI Solutions

---

## KEY REPOSITORIES

| Repo | URL | Purpose |
|---|---|---|
| **Hermes Web UI** | https://github.com/EKKOLearnAI/hermes-web-ui.git | Dashboard / UI for the Hermes orchestrator |
| **Hermes Desktop** | https://github.com/fathah/hermes-desktop.git | Desktop app for Hermes — native client interface for the orchestrator |
| **Obsidian Skills** | https://github.com/kepano/obsidian-skills.git | Obsidian plugin — skill management reference for Hermes self-improvement loop |
| **Obsidian Releases** | https://github.com/obsidianmd/obsidian-releases.git | Official Obsidian release registry — plugin/theme directory reference |
| **Obsidian CLI Skill** | https://github.com/pablo-mano/Obsidian-CLI-skill.git | CLI skill for Obsidian — terminal-driven vault operations and skill authoring |
| **Everything Claude Code** | https://github.com/affaan-m/everything-claude-code.git | Curated Claude Code tips, hooks, MCP configs, and patterns — reference for Hermes/Claude Code integration |
| **Ruflo** | https://github.com/ruvnet/ruflo.git | Agentic workflow framework by ruvnet — reference for Hermes orchestration patterns and agent loop design |
| **Open Design** | https://github.com/nexu-io/open-design.git | Open design system by nexu-io — reference for UI/UX components and design token architecture |
| **Andrej Karpathy Skills** | https://github.com/multica-ai/andrej-karpathy-skills.git | Karpathy-style ML/AI teaching skills — deep learning fundamentals reference for Hermes self-improvement and model reasoning |
| **Space Age Skills** | https://github.com/Burst37/Space-Age-Skills.git | This repo — all operational skills loaded by Hermes |

---

## QUICK CLONE

```bash
# Hermes Web UI
git clone https://github.com/EKKOLearnAI/hermes-web-ui.git

# Hermes Desktop (native client)
git clone https://github.com/fathah/hermes-desktop.git

# Obsidian Skills (skill management reference)
git clone https://github.com/kepano/obsidian-skills.git

# Obsidian Releases (plugin/theme registry)
git clone https://github.com/obsidianmd/obsidian-releases.git

# Obsidian CLI Skill (terminal vault operations)
git clone https://github.com/pablo-mano/Obsidian-CLI-skill.git

# Everything Claude Code (Claude Code patterns + MCP configs)
git clone https://github.com/affaan-m/everything-claude-code.git

# Ruflo (agentic workflow / orchestration reference)
git clone https://github.com/ruvnet/ruflo.git

# Open Design (UI/UX components + design tokens)
git clone https://github.com/nexu-io/open-design.git

# Andrej Karpathy Skills (ML/AI fundamentals)
git clone https://github.com/multica-ai/andrej-karpathy-skills.git

# Space Age Skills (operational skills)
git clone https://github.com/Burst37/Space-Age-Skills.git /mnt/skills
```

---

## HERMES ROLE IN THE PIPELINE

```
Hermes reads the Build Brief
  → scores complexity + budget tier
  → routes to Lane A / B / C / D
  → monitors execution
  → self-improves via skill extraction (sa-video-skill-extractor)
```

### Lane Routing Rules
```
IF business_quality_score >= 5 AND market_size = large  → Lane C (Claude + Codex)
ELIF volume_mode = true AND cost_priority = max         → Lane A (Gemini CLI)
ELIF lanes_saturated = true OR budget_tier = low        → Lane D (Minimax)
ELSE                                                    → Lane B (DeepSeek)
```

---

## SELF-IMPROVEMENT LOOP

Hermes uses `sa-video-skill-extractor` to watch operator recordings and extract new SKILL.md files.  
Use `kepano/obsidian-skills` as a reference architecture for how skills can be stored, tagged, and retrieved in a knowledge base.  
Use `pablo-mano/Obsidian-CLI-skill` for terminal-driven vault operations and skill authoring patterns directly from the CLI.  
Use `obsidianmd/obsidian-releases` to cross-reference the official plugin/theme directory when building or validating Obsidian integrations.  
Use `affaan-m/everything-claude-code` for best-practice Claude Code hooks, MCP server configs, and prompt patterns applicable to Lane C and Hermes orchestration.  
Use `ruvnet/ruflo` as an agentic workflow reference — study its agent loop design and orchestration patterns when extending Hermes capabilities.  
Use `nexu-io/open-design` as a UI component and design token reference when Hermes routes to Lane A/C for front-end deliverables.  
Use `multica-ai/andrej-karpathy-skills` for deep learning fundamentals and Karpathy-style teaching patterns — reference when Hermes needs to reason about model behavior or build ML-adjacent skills.  
Use `fathah/hermes-desktop` as the native desktop client reference when building or extending the Hermes local interface.

```bash
# After extracting a new skill, push it to Space Age Skills
cd /mnt/skills
git add user/<new-skill>/
git commit -m "feat: auto-extracted skill from [source]"
git push
```
