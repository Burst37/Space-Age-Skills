# Efficient Browser Use

Makes browser tasks cheaper. When Claude drives a browser, it takes a screenshot after almost every click. Each screenshot costs about width x height / 750 tokens, so a 20-step task can spend most of its tokens on pictures. This mod shrinks every screenshot before Claude reads it. Half of each side is about a quarter of the tokens.

It was called Image Offload. It does the same job under a name that says where the saving is.

## What it watches

- Browser pane screenshots (the built-in browser in the desktop app).
- Claude in Chrome screenshots.
- Any other tool result with a picture in it: Read on a picture file, or a connector that returns one.

## How it works

- A `tool.call` hook waits for the tool's result, finds each picture, and shrinks it with PowerShell and System.Drawing, built into Windows (scale 0.5, never under 512 px on the long side). Small pictures pass as they are.
- Browser pane screenshots keep their coordinate frame. The mod rewrites the tool's own line to `Screenshot size: 800x500 0.5-scale view; coordinate frame: 1600x1000`, so clicks still land in the right place.
- Other pictures get a note that says how to map a point back to the original size.
- A zoom, or a screenshot where Claude set its own `scale`, is left as Claude asked. When Claude needs small text, it zooms or reads the page as text.
- Each shrink appends one line to `~/.claude/mods-logs/savings.jsonl` (with `mod: "efficient-browser-use"`) and one to `~/.claude/mods-logs/efficient-browser-use.log`, and shows a toast.

## The pane

The "Efficient Browser Use" pane opens by itself when the mod shrinks a picture.

- Reopen it with every card from this chat: type `/efficient-browser pane` (or `/efficient-browser` with nothing after it), or press Open in `/mods`.
- If you close it, it stays closed until you ask for it again.
- `"efficient-browser-use:hidden": true` in switches.json (the Shown/Hidden button in `/mods`) stops it opening by itself. The mod still shrinks pictures.

What it shows:

- Tiles on top: Pictures seen, Shrunk, Tokens saved, for this chat.
- One card for each picture it shrank: the tool, the original size, the new size, and the tokens before and after.
- One small card for each tool call with pictures it left alone, and why. For example "1 picture left alone: already small (Claude set scale 0.45)". The log says the reason for each picture.
- A picture Claude sized itself is always left alone: a zoom, or a screenshot with its own `scale`. In a `browser_batch` the scale is on each action, so the mod matches each picture to its screenshot or zoom action in order.
- The 3 newest shrunk pictures show a small copy (a 160 px JPEG). The terminal shows no pictures.
- "Details" opens a card: the full tool name and the note Claude got with the picture.
- When you reopen the pane, any shrink the ledger has and the pane lost comes back as a card.
- The mascot is a pixel Claude camera with a flash and a photo. It moves while a picture is shrunk, and for 2 seconds after.
- The `/mods` switch closes the pane, and the pane says "Turned off".

## Commands

- `/efficient-browser`: status and tokens saved in this chat. It opens the pane too.
- `/efficient-browser pane`: open the pane with every card from this chat.
- `/efficient-browser full`: the next screenshot comes through at full size, then shrinking starts again.
- `/efficient-browser describe`: a Haiku subagent writes each screenshot out in words, so Claude gets no picture. `/efficient-browser shrink` goes back.
- `/efficient-browser scale 0.5`, `/efficient-browser min 512`: change the shrink.

The `/mods` switchboard turns it off with `"efficient-browser-use": false` in `~/.claude/mods/switches.json`.

## Limits

- Needs Windows PowerShell 5.1 (built into Windows 10 and 11). WebP pictures cannot be shrunk on Windows and pass as they are.
- Describe mode loses exact positions. To click, Claude uses `read_page` or `find`, or you type `/efficient-browser full` and it takes the screenshot again.
- Pasted pictures in the prompt cannot be shrunk. A mod sees that they exist, but only a managed-settings install can read their bytes, and no hook can change the attachment list. The mod logs that they went by.
- Do not load this mod and Image Offload at the same time. Both would shrink the same screenshot.
