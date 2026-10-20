# Meal Plan Studio: Claude Project kit

A Claude Project is a workspace in claude.ai with standing instructions and a shelf of knowledge files that every chat in it can read. This kit is that workspace, ready to paste and upload. The dietitian types in a new client's details; the Project asks only for what is missing, runs the safety gates, works out what to research for that client's diet, religion, conditions and medications, sets the targets, structures the 30-day plan, picks a theme nobody else has, builds, and checks it.

Claude cannot create the Project inside your account for you, so setup is 5 minutes by hand:

1. claude.ai > **Projects** > **Create project** > name it **Meal Plan Studio**.
2. **Set project instructions**: paste the whole of `PROJECT_INSTRUCTIONS.md`.
3. **Add files** (project knowledge): upload everything in `knowledge/` (8 files, about 50 KB).
4. Settings > Capabilities: turn on **Code execution and file creation** and **Web search**, and upload `dietitian-meal-plan-builder_v6.skill` under **Skills**. Connect PubMed or Consensus if you have them: the research step uses them.
5. Start a chat inside the project: *"New client: Maria, 38, 5'6", 170 lb..."* or upload a filled `client_intake.template.json`.

What lives where:

| Piece | Job |
|---|---|
| `PROJECT_INSTRUCTIONS.md` | The 10-step workflow and standing rules |
| `knowledge/01` intake template (+ `.json`) | What to collect |
| `knowledge/02` research playbook | Safety gates, and what to verify per diet, religion, condition, medication |
| `knowledge/03` nutrition math | BMR, TDEE, safe loss rate, macros, worked example |
| `knowledge/04` plan structure | Day types, meals, caps, pages, slides, quality checks |
| `knowledge/05` themes and client log | 8 looks, which client has which |
| `knowledge/06`, `07` recipe library and food database | 60+ dishes and 67 foods with computed macros |
| Skill v6 | Engines and builders the Project can run |
| Repo `meal-plan-studio` | The factory for the polished themed deck: `python studio.py build <client>` |

Honest split: the Project is the brain (intake, research, targets, plan design, QA, handoff file). The themed 58-slide deck, the motion graphics and the web deck are built by the repo, in Claude Code, from the handoff file the Project produces.

## Gemini Gem or ChatGPT custom GPT
Paste `GEM_INSTRUCTIONS.md` and attach the same knowledge files (a Gem takes up to 10). They plan and write the research brief and the handoff file; they cannot run the deck build.
