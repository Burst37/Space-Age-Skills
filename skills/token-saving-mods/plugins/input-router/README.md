# Input Router

Big files and big connector results are read by Haiku first. Claude gets short notes and a path to the full thing. A side pane shows each hand-off to Haiku while it happens.

It merges two older mods into one: Read Router (files) and Connector Reader (connector results).

## What it does

| Part | Tool it watches | When it acts | What Claude gets |
|---|---|---|---|
| file | Read | Any Read of a text file over about 2,000 tokens: a whole file, or a range (any start line) whose text is over the limit, however few lines it has. Also a PDF over 5 pages. See the four guards below | `[Input Router] Notes on <path>`: notes with line numbers, written for the task in the person's last message |
| file | Bash | A shell read (cat, head, tail, sed, awk, nl, grep, rg and the like) whose output is over about 2,000 tokens (8,000 characters) | `cat` of one file: the same notes as a Read of that file. Anything else: `[Input Router] Notes on the output of <command>`, and the full output is saved to a file |
| connector | any connector tool (`mcp__*`) | A result over about 4,000 tokens | `[Input Router] <tool>`: code trims unused fields first. If it is still over about 2,000 tokens, Haiku keeps what the task needs. The full result is saved to a file and the path is given |
| connector | Bash | A shell read (curl of an API, jq, cat of a .json) whose output is JSON over about 2,000 tokens (8,000 characters) | The same trim and note as a connector result |

Everything under the limits passes through untouched. The connector limit stays at 16,000 characters (about 4,000 tokens) on purpose; the log line for a smaller connector result says so.

### The four guards (v0.3)

- **A, edit escape:** a ranged Read of under 100 lines that is also under 2,000 tokens passes as exact text, so Edit still works. It still counts for guard D. A short range of long lines over 2,000 tokens gets the notes (v0.3.1); for exact text there, Claude reads a smaller limit.
- **B, instruction files:** `SKILL.md` and any file under a `skills/` folder, `CLAUDE.md`, `AGENTS.md`, memory files (`~/.claude/projects/*/memory/`), `settings.json`, `settings.local.json` and `switches.json` pass word for word, by Read or by Bash.
- **C, find-style grep:** `grep -l`, `-L`, `-c`, `--files`, `--files-with-matches`, `--count`, `rg --files`, `find`, `ls` and the like pass, however big. The log says `pass: find-style grep`. A grep with `-A`, `-B` or `-C` context is a read.
- **D, piece counter:** per chat and per subagent, the mod counts the lines of each big file Claude has pulled in raw. Once that passes 50% of the file, the next piece of 100 lines or more gets the file's notes, with a line on how to ask for an exact range. This covers saved `tool-results` files that subagents page through with Read ranges or `sed -n`. A Read of under 100 lines past 50% still passes (guard A), with one line that says so. The edit escape is for Read only: a Bash print past 50% gets the notes at any size.

### Which Bash commands it touches

Only commands that read files or APIs. Every program in the command must be on one of these two lists, and at least one must be a reader:

- Readers: `cat`, `head`, `tail`, `sed`, `awk`, `less`, `more`, `nl`, `tac`, `jq`, `yq`, `curl`, `wget`, `grep`, `egrep`, `fgrep`, `rg`, `ag`, `zcat` and the other zip readers, `strings`, `pdftotext`, `textutil`, `xmllint`, `bat`.
- Helpers (they print nothing, or only small facts): `cd`, `sort`, `uniq`, `cut`, `tr`, `column`, `fold`, `expand`, `iconv`, `wc`, `echo`, `printf`, `true`, `false`, `ls`, `find`, `du`, `stat`, `file`, `realpath`, `readlink`, `basename`, `dirname`, `pwd`, `date`, `sleep`, `seq`, `test`, `[`, `set`, `unset`, `which`, `type`, `.`, `source`, `mkdir`, `cp`, `mv`, `rm`, `touch`, `ln`, `chmod`, `read`.
- Shell shapes count: `for` and `while` loops, `$( )`, `xargs cat`, lines that only set a variable, and `#` comments. Quoted text and heredoc bodies do not split the command.

Everything else passes through untouched, however big: builds, test runners, `git`, `npm`, `npx`, `python`, `node`, `diff`, and any pipe into them. `ls` or `find` alone has no reader, so it passes too. So do a failing command, an interrupted one, a background run, and output with an image. A build or test command's output reaches Claude exactly as it ran. A later Read of core's saved copy (under `tool-results/`) is a file read like any other (v0.3).

Checked on 30,633 real Bash commands from past chats: 11,882 read commands are caught. The rest of the commands that contain a reader also run code (`python3`, `node`, `npx`, `gws`, `git`), so they pass by design.

The command always runs first, and only once. The mod reads the full output (from the file core saved, when core saved one) and hands Claude the notes in its place.

There is no Grep tool in Claude Code 2.1.309. Claude greps through Bash, so the Bash part covers grep and rg.

- The real tool always runs first. The one exception is a big PDF, which is read with `pdftotext` before core, and only when the permission check says the Read would run without asking.
- Each Haiku request stays under 100k tokens, so Haiku stays at its cheap rate. Big inputs are split.
- Paging and count fields (`page`, `per_page`, `count`, `has_next_page` and so on) are copied into the reply by code, word for word. Haiku is told never to write "page X of Y".
- Haiku gets the person's last real request (short replies like "yes" or "go" are skipped, up to 12,000 characters, cut from the middle) and Claude's own words just before the read, as the reason. In a subagent, the subagent's prompt is the request.
- Notes are kept on disk, keyed by path, change time, size and a short hash of the request. The same file for the same request reuses the notes, in this chat or a reopened one. A new request gets new notes.
- If Haiku fails or is slow, Claude gets the normal result (for connectors, the trimmed result).
- Images belong to Efficient Browser Use. Image files and results with image blocks pass through.
- Browser, app and other mods' connector tools are never touched.

## What the notes tell Claude

Before v0.2, Claude often read the whole file again in pieces to check the notes, or ran `jq` on the saved connector result. That spent the tokens the notes saved. Now:

- File notes say they cover the whole file and were written for this task, and that Claude does not need to read the file again to check them. Claude reads exact lines (offset and limit) only to quote exact text, or right before an Edit or Write.
- Connector notes say the note is the answer to use. The saved file is for a field the note does not list, not for re-checking the note.
- Re-reads get the kept notes: any read over the limit of a file that has notes for this request returns those notes, with no Haiku call. This holds for a Read with offset and limit and for a Bash print (`sed -n`, `head`, `tail`, `awk`, `nl`, `cat`). For a Bash print of one file, the mod reads the range from the command. If the file changed since the notes, it gets fresh notes.
- The notes footer says that reading the file again, or 100 lines or more of it, returns the same notes, and that `/input-router full` (typed by the person) lets the exact text through.
- Re-read reminder: a read under the limit of 150 lines or more of a noted file passes through with one line after it. The file counts as named when the command has its full path, its path from a folder the command `cd`s into, or its path from the working folder. Quoted paths with spaces count.

**Tradeoff:** if Haiku's notes are wrong, Claude is now less likely to catch it, because it no longer checks the notes against the file. The paging-field copy and the other accuracy fixes stay. For work where every value must be exact, type `/input-router full` before the read, or `/input-router off file`.

## The pane

The pane is called "Haiku hand-offs". It opens by itself when a file or connector result goes to Haiku.

- One card per hand-off, newest first, for this chat only. Each card shows:
  - the tool it came from (Read, Bash or Connector) and the file name, command or tool name
  - the full path, full command or full tool name
  - tokens before and after, the number of Haiku requests and their list price, and the time
  - a live state: "Haiku is reading 3 parts: 1 of 3 done", then "Done" or "Haiku failed, so Claude got the plain file"
- "Show the notes Claude got" opens the exact text Claude got. Only one card is open at a time.
- "Open detail file" and "Open full result" open the files on disk.
- The mascot is a round teal reader with glasses holding a page. It moves only while Haiku is reading. With reduced motion on, it stays still.
- Notes reused from earlier get a card too ("No Haiku call"), but they do not open the pane.

To hide it:

- The Hide button hides the pane in this chat. Closing it with its X (or Esc) does the same, with a toast that says how to get it back. Without that, the next hand-off would pop it back.
- `/input-router pane` shows it again after Hide or the X, with every card from this chat. It works at any window width.
- The `/mods` Open button writes `~/.claude/mods/.open-input-router-<session id>`. The mod checks for that file every 3 seconds, opens the pane in that chat and removes the file. The engine counts this open as the mod's own, so on a window under 144 columns the pane waits and a toast names `/input-router pane`.
- `"input-router:hidden": true` in `~/.claude/mods/switches.json` hides it in every chat (the `/mods` Shown and Hidden button sets it). The mod still works. The mod never writes that file.
- The `/mods` switch (`"input-router": false`) turns the whole mod off, pane too.

## Commands

- `/input-router`: what it did in this chat, per part, with tokens before and after.
- `/input-router full`: the next big input in this chat comes through whole, once.
- `/input-router off file` (or `connector`): turn one part off in this chat. `/input-router on file` turns it back on.
- `/input-router pane`: show the pane again after Hide or the X, with every card from this chat.

To turn one part off in every chat, add `"input-router:file": false` (or `:connector`) to `~/.claude/mods/switches.json` by hand. The mod reads that file every 3 seconds and never writes it.

## Files it writes

- `~/.claude/mods-logs/savings.jsonl`: one line per action, with `mod: "input-router"`, `part: "file" | "connector"` and `tool: "Read" | "Bash" | "connector"`. Savings Proof reads it. Old `part: "web"` lines stay and still show.
- `~/.claude/mods-logs/input-router/`: one detail file per action.
- `~/.claude/mods-logs/input-router/results/`: full connector results, and full Bash output (`*-bash-<program>-<id>.txt` or `.json`).
- `~/.claude/mods-logs/input-router/notes/`: kept file notes (format v2; older notes are skipped and made again once).
- `~/.claude/mods-logs/input-router/text/`: text pulled out of PDFs.
- `~/.claude/mods-logs/input-router.log`: what passed through and why. Every big input the mod leaves alone (about 1,000 tokens or more) gets a `pass` line with the reason: under the limit, edit escape, instruction file, find-style grep, unrouted script read (for example `python3`), a connector result under its 16,000-character limit, or output written to disk with `-o`, `>` or `tee` (logged at any size, with the target). Routed reads get a `route` line.

## Setup

- Needs `pdftotext` and `pdfinfo` (Poppler for Windows, with its `bin` folder on PATH) for PDFs. Without them, PDFs pass through.
- No options.

## Limits

- Notes are a summary. See the tradeoff above.
- Pasted files and pictures are not touched.
- `cat x.json` goes to the connector trim (`part: connector`, `tool: Bash`), not to file notes. `off connector` stops it; `off file` does not.
- Lines over 2,000 characters are cut before Haiku reads them, as core's Read cuts them.
- The pane draws on the desktop app. In the terminal it shows text cards and a text face.
- A Read of 100 lines or more of a big file right before an Edit gets notes, not text. Core still records the Read, so the Edit is allowed, but Claude must read a range under 100 lines and under 2,000 tokens (or the person types `/input-router full`) to get the exact lines.
- Known gap: a reader that pages in chunks of 99 lines or fewer still gets raw text past 50%. It gets one line each time that says the notes are there.
- `python3`, `node` and other programs are never routed, even when they print a file. The log calls them `unrouted script read`, so they can be counted.
- Pane cards are kept per chat: the newest 30 of each chat, 150 in all.

## History

- v0.3.1, 2026-11-03: the edit escape checks tokens too. In the files demo, Claude read five long-line transcripts in two 76-line halves (about 7,500 tokens each) and all ten reads passed, so the demo saved 0 tokens. Now a range under 100 lines that is over 2,000 tokens gets the notes.
- v0.3.0, 2026-11-03: the file limit dropped from 8,000 to 2,000 tokens (Bash: 8,000 characters). Every read over the limit is routed, including ranges that start past line 1. Four guards: edit escape under 100 lines, instruction files word for word, find-style grep passes, and a 50% piece counter per chat and subagent. Haiku gets the last real request (up to 12,000 characters) and Claude's reason. Notes are keyed by the request too. The ledger "before" for an over-cap connector result is the saved file, not core's preview.
- v0.2.0, 2026-11-03 after the live test: a range that covers the whole file is a whole read. A re-read of 80% or more of a noted file (Read or Bash) gets the kept notes, not a reminder. Big inputs left alone get a `pass` log line with the reason. The X close hides the pane in that chat, `/input-router pane` brings it back with every card, and the `/mods` Open file opens it.
- v0.2.0, 2026-11-03 later the same day: the file part fires for Bash reads too (cat, sed, grep, curl and the like), with the safe list above. Bash JSON goes to the connector trim. The re-read reminder covers Bash. Pane cards and ledger lines name the tool. The line cut moved from 1,000 to 2,000 characters.
- v0.2.0 (2026-11-03): the web part (repeat WebFetch cache) was removed. It never saved tokens in the desktop app, because each WebFetch runs in a new helper agent. Its code is archived in `~/.claude/mods-archive/input-router-web-part-2026-11-03/`, with its LICENSE. All code left here is Ben AI's own.
