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

## Flagship production skills

| Skill | What it is |
|-------|-----------|
| [`cinematic-website-builder`](./cinematic-website-builder/CINEMATIC_WEBSITE_BUILDER.md) | v3.4.0 (restored from single-file export; supersedes v3.2): v3 forensic rebuild — runtime kernel + 36 isolated modules, asset pipeline, `assemble.mjs` single-file builder and `verify.mjs` 5-pass Playwright QA gate. Stage 3–4 of the SA site pipeline. |

## Pipeline skills

| Skill | Forked from | What was added |
|-------|-------------|----------------|
| [`replica-skill-sa`](./replica-skill-sa/SKILL.md) | Jakeschincariol/replica-skill (MIT) | 11 skills merged into one router + per-stage references (-88% always-loaded tokens), deploy parity gate (`--gate`), 4 config/input bug fixes with regression tests, uniform verify-and-status close-out. See [`IMPROVEMENTS.md`](./replica-skill-sa/IMPROVEMENTS.md) |
| [`rea-sa`](./rea-sa/SKILL.md) | morluto/rea (MIT) | Lean entry point for the REA reverse-engineering MCP: 23.5k-char skill body cut to 6.9k (-70%) with verbatim on-demand references, an authorization gate, a clean-room build handoff, a finding-ledger template, and fidelity tests. See [`IMPROVEMENTS.md`](./rea-sa/IMPROVEMENTS.md) |
| [`animation-studio-director`](./animation-studio-director/SKILL.md) | Movez (@0xMovez) Picsart course PDF | 13-step AI animated-series studio distilled into one skill: render-last rules, 7-subagent crew, studio folder + two laws, bible/passport/shot-card templates, fresh-reviewer gate, 480p-draft/1080p-final, 16-frame QA, breakdown-reel prompt. Unverified claims kept as VERIFY |
| [`addy-osmani-skills`](./addy-osmani-skills/SKILL.md) | addyosmani/agent-skills (MIT) | Replaced earlier stub with the full vendored set: 25 lifecycle skills, 4 reviewer agents, 7 checklists, 9 command definitions, plus a router table |
| [`egm`](./egm/SKILL.md) | google/elephant-goldfish-model (Apache-2.0) | Full plugin layout vendored (7 skills, 10 reviewer agents, document standards) behind a router: elephant drafts, fresh-context goldfish reviewers critique |
| [`videohub`](./videohub/SKILL.md) | VideoHub (MIT) | Agent skill + review rule for the VideoHub local review studio/render queue; app not vendored, see `UPSTREAM.md` |
| [`open-seo`](./open-seo/SKILL.md) | every-app/open-seo (MIT) | OpenSEO plugin vendored verbatim (12 SEO workflow skills + hosted MCP manifest) behind a router; app not vendored, see `UPSTREAM.md` |
| [`open-higgsfield`](./open-higgsfield/SKILL.md) | OpenHiggsfield AI (no license file) | Self-hosted Next.js studio for 38 image/video models, source vendored in `app/`; see `UPSTREAM.md` for the licence caveat |
| [`desktop-commander-remote`](./desktop-commander-remote/SKILL.md) | wonderwhy-er/DesktopCommanderMCP | Windows `.cmd` launcher + skill for attaching the user's PC to a cloud session |
| [`astonishing-touch-motion-prompts`](./astonishing-touch-motion-prompts/SKILL.md) | Client brief | Hero + 11 service-film image-to-video prompts with casting and QA rules |
| [`kling-skill`](./kling-skill/SKILL.md) | Space Age | Kling 4.0 video-prompt skill |
| [`living-site`](./living-site/SKILL.md) | Space Age | Three-level living website: Spline 3D, Higgsfield scroll film, code-drawn motion graphics |
| [`seo-aeo-optimizer`](./seo-aeo-optimizer/SKILL.md) | Space Age | SEO + AEO/GEO two-pillar skill: competitor teardown, audit, schema, AI-citation checks |
| [`be-ambitious`](./be-ambitious/SKILL.md) | be-ambitious (MIT) | Makes a prompt or task more ambitious (altitude, depth) |
| [`autocli-skill`](./autocli-skill/SKILL.md) | autocli skill | CLI for 55+ social/content sites; needs session/credential review |
| [`website-builder-setup`](./website-builder-setup/website-builder-setup/SKILL.md) | tenfoldmarc | Installer skill for the animated-website toolchain |
| [`ai-design-skills`](./ai-design-skills/README.md) | ai-design-skills (see LICENSE) | `landing-page-design` and `figma-designer` skills |
| [`social-media-research-skills`](./social-media-research-skills/README.md) | ScrapeCreators skills (see LICENSE) | 13 social research workflows |
| [`youtube-agent-skill`](./youtube-agent-skill/README.md) | youtube-agent-skill (see LICENSE) | 11 YouTube channel skills (yt-script, yt-seo, yt-shorts, ...) |
| [`earshot`](./earshot/README.md) | Leonxlnx/earshot (see LICENSE) | Audio-evidence skills for coding agents; Python package not vendored |
| [`fast-jev-compaction`](./fast-jev-compaction/README.md) / [`jev-compaction-plus`](./jev-compaction-plus/README.md) | tamaratran (see LICENSE) | Claude Code compaction plugins using Jev scoring |
| [`token-saving-mods`](./token-saving-mods/INSTALL.md) | Token-saving plugin pack | 8 Claude Code plugins (model-router, cache-clock, input-router, ...); Windows, untested |
| [`awesome-design-md`](./awesome-design-md/SKILL.md) | VoltAgent/awesome-design-md + ant-design/ant-design DESIGN.md (MIT) | 85 brand DESIGN.md design-system files vendored verbatim (READMEs dropped) behind a router with usage, guardrails and an index |

## Reference repos used as inspiration

- `multica-ai/andrej-karpathy-skills` — behavioral guidelines for LLM coding (think-before-coding, simplicity, surgical changes, goal-driven execution)
- `kepano/obsidian-skills` — linked-note / knowledge-graph patterns
- `JuliusBrussee/caveman` — intensity levels, compression, token-efficiency patterns
- `obsidianmd/obsidian-releases` — release/changelog conventions referenced for the lessons-vault design

## Install

Each folder is a self-contained Claude Code skill — copy the directory into
`~/.claude/skills/` (or your project's `.claude/skills/`) to use it.
