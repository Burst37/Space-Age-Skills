# Research Router

Research Router keeps web research out of the main chat. A cheap worker model (claude-haiku-5-5) or a few subagents do the reading. Claude gets a short brief with numbered sources.

It works in two ways: auto mode on Claude's own searches, and the `/research-router` command for a full research run.

## Auto mode

Auto mode works on every WebSearch that Claude itself runs in the main chat.

1. The real search runs first, as normal.
2. If the search engine's commentary is 800 tokens or less, the result goes to Claude as it is. No Haiku call runs. The link list does not count: Haiku never shortens it.
3. If the commentary is bigger, Haiku shortens the search engine's commentary to the findings for that query. Every link entry stays as it is. A URL that only the commentary named is added back at the end.
4. If Haiku fails or gives no answer in 25 seconds, Claude gets the original result. A search is never blocked and never runs twice.
5. If Haiku's answer is not shorter, Claude gets the original result ("no saving").

The Haiku call asks for `effort: "low"`. The engine has no switch to turn thinking off, so low effort is the closest setting.

What auto mode does not touch:

- The mod's own searches (the hook sees they come from this plugin).
- Any subagent's search, deep-mode subagents included (the call has an `agentId`).
- WebFetch. Another mod (Web Fetch Cache) hooks that tool.

Every Haiku call writes one line to the savings ledger, with `action: "auto: <query>"` and a `result` of `shortened`, `no saving` or `failed`. A call that saved nothing still has its cost in `helper`. The pane lists each search under "Searches Claude ran", with the Haiku cost on each row that had a call.

## The command

- `/research-router <question>`: the Haiku planner picks quick or deep.
- `/research-router deep <question>`: always deep.
- `/research-router pane`: opens the pane again, even after you closed it or hid it.

The name is not `/research`, because another plugin's `/content:research` answers to that name first.

### Dates and time windows

The planner and the writer get today's date. If the question names a window ("last 7 days", "this month", "yesterday"), the mod works out its start date. The writer must leave out anything dated before it.

### Quick

1. Haiku writes up to 2 search queries. For a question about one product, it also names up to 2 official pages (for Claude Code: the docs changelog and the GitHub releases page).
2. The built-in WebSearch finds the links. The mod tries it even when the tool list leaves it out, because a deferred tool is not on that list.
3. The mod reads up to 4 pages for real. For each page it tries, in order:
   1. WebFetch, if this session has it. After one failure in a run, the run stops asking. After "no tool named WebFetch", later runs skip it too.
   2. A plain GET of the page, with no key. The mod strips the HTML (scripts, styles, menus, footers) and keeps the text. It skips a page that is not HTML or text (a PDF, for example), an error page, or a page with less than 200 characters of text.
   3. The `firecrawl scrape` CLI, if it is installed.
   The official pages are read first. A page whose newest date is before the window start is skipped, and the log says so.
4. A relevance check: Haiku sees a short part of each page and drops the pages that do not answer the question. If the check fails, all pages stay.
5. Haiku writes a brief of 180 words or fewer, with [n] after each claim.

If WebSearch is missing, fails, or gives no answer in 90 seconds, the run uses `firecrawl search`. If that gives nothing too, it tries a connected web-research connector, found by its description.

### Deep

1. Haiku splits the question into 2 to 4 parts.
2. The mod starts one general-purpose subagent per part, at most 4, with `$.agent.spawn`. It sets no model.
3. Each subagent writes a report of 250 words or fewer, with a numbered list of the pages it used. No raw pages.
4. The mod waits for each report (its `turn.complete`), up to 5 minutes for each.
5. Haiku joins the reports into one brief of 200 words or fewer. The sources get one shared numbering.
6. Only the brief goes to the main chat. The mod drops each subagent's own "task finished" notice from the main chat, so its report does not arrive twice.

If a subagent fails or runs out of time, the brief names the part that is not covered.

Models:

- With Model Router on, its `agent.spawn` hook picks each subagent's model. The pane shows the model each subagent ran on.
- With Model Router off, the subagents use the chat's own model. The pane says so.
- Effort cannot be set for each subagent: the spawn takes no effort setting. The mod does not try to set it.

Cost and counts:

- "Before" is the text the subagents' tools returned plus their reports. Cache reads are not counted: they are the same prompt read again on each step.
- The run cost is the mod's Haiku calls plus the subagents. Each subagent request is priced by its own model and token counts (Haiku has a higher price for a prompt over 100,000 tokens). The ledger line has `subagents: { models, cost_usd }`.

## Sources

Every source is a real page that the mod read, numbered by its page URL, with its title. A link the search found but nobody could read is not a source. The notes file lists it under "Links listed but not read". So the source count equals the pages read. A search query is never a source. The search engine's commentary is used only as background. The same numbered list is in the brief, the notes file and the pane.

The writer keeps each source's caveats. A vendor testing its own product is "the vendor's own test", never "controlled" or "independent" unless the source says so.

## The pane

The "Research Router" pane shows for each run:

- The live step: Planning, Searching 1 of 2, Reading page 2 of 4, Subagent 2 of 3 on its model, Writing.
- The sources as links.
- A line with the tokens kept out of the chat, the cost, the time and the subagent models. Deep runs show "Cost: $T (Haiku $h, subagents $a)".
- An "Open notes" button that opens the notes file.
- A "Brief" button that opens the card to the brief Claude got. In deep mode it also shows each subagent report.

Below the runs, one row for each search auto mode saw, with its tokens before and after.

The pane opens by itself when a run starts and when auto mode shortens a search. If you close it, auto mode stops opening it until you type `/research-router` or `/research-router pane`.

- `"research-router:hidden": true` in `~/.claude/mods/switches.json` keeps the pane shut. The mod still works. Turning it on closes an open pane.
- An empty file `~/.claude/mods/.open-research-router-<sessionId>` opens the pane in that session. The mod removes the file.

The footer says if Model Router is on. The mod finds it by its folder or by its `.claude-plugin/plugin.json`. A deep run whose subagent got a model from a hook also counts as on. The footer also names the last deep run's models, for example "Haiku x3, Sonnet x1".

The mascot is a pixel Claude explorer with a helmet and a magnifying glass. It moves only while a run works or Haiku shortens a search. The `/mods` switch closes the pane, and the pane says "Turned off".

## Files

- Full notes for each run: `~/.claude/mods-logs/research-router/<time>-<question>.md`. They hold the brief, the notes or subagent reports, the sources with the path that read each page, and the page text as read.
- The savings ledger: `~/.claude/mods-logs/savings.jsonl`. Append only. One line per run and one per shortened search. Each line says how its numbers were counted (characters divided by 4, an estimate) and holds the Haiku usage in `helper`.
- Log, one line per step, so a stalled run shows where it stopped: `~/.claude/mods-logs/research-router.log`

## Permissions

Outside bypass mode, WebSearch and WebFetch can ask for permission. Approve the dialog. If nobody answers in 90 seconds: for WebSearch, the run moves on to firecrawl; for WebFetch, the run reads the page with a plain GET.

It needs no API key of its own. Firecrawl uses its own login.

## Turn it off

Set `"research-router": false` in `~/.claude/mods/switches.json`, or use `/mods`. Off, the command says so and auto mode passes every search through untouched.
