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
| **Obsidian Skills** | https://github.com/kepano/obsidian-skills.git | Obsidian plugin — skill management reference for Hermes self-improvement loop |
| **Obsidian Releases** | https://github.com/obsidianmd/obsidian-releases.git | Official Obsidian release registry — plugin/theme directory reference |
| **Space Age Skills** | https://github.com/Burst37/Space-Age-Skills.git | This repo — all operational skills loaded by Hermes |

---

## QUICK CLONE

```bash
# Hermes Web UI
git clone https://github.com/EKKOLearnAI/hermes-web-ui.git

# Obsidian Skills (skill management reference)
git clone https://github.com/kepano/obsidian-skills.git

# Obsidian Releases (plugin/theme registry)
git clone https://github.com/obsidianmd/obsidian-releases.git

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
Use `obsidianmd/obsidian-releases` to cross-reference the official plugin/theme directory when building or validating Obsidian integrations.

```bash
# After extracting a new skill, push it to Space Age Skills
cd /mnt/skills
git add user/<new-skill>/
git commit -m "feat: auto-extracted skill from [source]"
git push
```
