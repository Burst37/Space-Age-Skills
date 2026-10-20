# Start here (no need to reopen the old chat)

Two homes. Each new client gets its own short chat in the right one.

## 1. Claude Project "Meal Plan Studio" (claude.ai): intake, research, targets, plan design
Set up once, 5 minutes (details in `claude-project/README.md`): Projects > Create project > paste `claude-project/PROJECT_INSTRUCTIONS.md` into the project instructions > upload the 8 files in `claude-project/knowledge/` > upload `dietitian-meal-plan-builder_v6.skill` under Settings > Capabilities > Skills > turn on code execution, file creation and web search.
Every new client = a new chat inside the project. First message:
> New client: <name>, <age>, <height>, <weight>, goal <weight> in <months> months. Training: <days and type>. Steps: <steps>. Diet: <pattern, religion, refusals>. Conditions and medications: <with doses and units>. Open to keto / fasting / carb cycling: <details>. Start Monday <date>.

## 2. Claude Code in this repo (the factory): deck, web experience, QA
Open this repo in Claude Code (terminal: `cd Space-Age-Skills && claude`, or Claude Code on the web with the repo selected). `meal-plan-studio/CLAUDE.md` loads by itself. First message:
> Build the client from the intake file I paste: create the client folder with `python studio.py new <slug> --from aleena --theme <unused theme>`, then build the deck and the web experience and run both QA checks.

Commands: `python studio.py list | build <slug> | web <slug> | qa <slug> | qa-web <slug> | gallery <slug> | new <slug>`.
