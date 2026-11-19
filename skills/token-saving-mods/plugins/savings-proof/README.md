# Savings Proof

A side pane that shows what the token-saving mods saved. Type `/savings` to open it.

It reads `~/.claude/mods-logs/savings.jsonl`, the ledger every other mod appends to. It never writes that file.

- Top: tokens saved today and in this chat, before and after, and the net in dollars after helper costs.
- "Real now": this chat's context size and cost, straight from Claude Code. Compactions show apart, with real before and after counts. They are not in the totals.
- One row per action: mod, what it did, tokens before and after, the helper model and its cost, net saving, and REAL or ESTIMATED. "Detail" shows the row's detail file. "Open file" opens it.
- Each `tool_use_id` counts once. A later "real" line replaces an "estimated" one.
- `/savings sample` shows the 5 test lines in `test/sample-savings.jsonl`, with a SAMPLE DATA banner. `/savings` goes back to the real ledger.
- Switch: `"savings-proof": false` in `~/.claude/mods/switches.json` turns it off. `/mods` has the toggle.
- Dollars use list prices from the claude-api skill (2026-11-02, cache prices 2026-11-03). A model with no known price says "price unknown".
- A line with `cost_usd.saved` (Model Router, once Jev Model Router) saves dollars, not tokens. The pane shows that figure on the row and as "Model choice saved $X" in the totals. It can be below 0 ("cost $X more").
- A line with a `stably` object counts output tokens, priced at the output price. Its effort, baseline and time show under the row.
- "Before to after" on the cards leaves out dollar rows and lines that changed nothing. The action count still counts them.
- Renamed mods: `jev-model-router` and `model-router` both show as "Model Router". `jev-compaction` and `haiku-compaction` both show as "Haiku Compaction". Old lines keep their old name.
- `image-offload` and `efficient-browser-use` both show as "Efficient Browser Use".
- Mods with parts: an Input Router line has `part` (`file`, `connector` or `web`). Its row shows "Input Router · file", and one line just above the filter buttons adds up tokens saved per part. Old `read-router`, `connector-reader` and `web-fetch-cache` lines still show, under their own names, so old and new numbers stay apart.
- Haiku 5.5 has two price tiers: up to 100k prompt tokens, and above. `helper.calls: [{in, out}, ...]` lists each request, and each one is priced on its own tier.
- With no list, `helper.in` is a total. A total at or under 100k is exact, because every request was on the short tier. A total over 100k gets the short rate and the row says "(estimated)". The REAL or ESTIMATED badge does not change.
- A saved input token is priced as the prompt cache would bill it (v0.2.0): 1 cache write at the 1-hour price (2x input, $8 per million on Opus 5.5), plus 1 cache read ($0.20 per million on Opus 5.5) for each later request in that chat, until the next compaction. The row says "Cache: 1 write + N reads (M later requests, model)".
- To count the later requests, the pane finds the chat's file in `~/.claude/projects/` and reads it with a short PowerShell script (main-chat requests and compactions only). It does this only while the pane is drawn, at most once a minute per changed file. `/savings` never waits for it: the 3 s poll reads up to 8 files (or 2 s of files) per run, newest chats first, and until then a row says "Cache: 1 write for now (reading the chat)". A chat with no file, and `/savings sample`, get 1 write.
- A saved output token (Stably) is still the output price, once. Later cache reads of those tokens are not counted.
- A token line with "before" over 500,000, or over 100,000 with a cut of more than 1,000x (and "after" above 0), is not believable. It shows LEFT OUT with the reason, and no total counts it. Dollar lines are never left out.
- The TODAY card adds up every chat on this computer and says how many ("TODAY · ALL 26 CHATS"). The filter button says "Today (all chats)".
- Errors go to `~/.claude/mods-logs/savings-proof.log`.
