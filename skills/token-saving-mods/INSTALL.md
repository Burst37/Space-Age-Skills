# Install the token-saving mods on Windows

Built for Windows but not tested on a Windows computer yet.

## What you need

- Windows 10 or Windows 11.
- Claude Code 2.1.287 or newer in the terminal, or 2.1.286 or newer in the desktop app.
- Windows PowerShell 5.1. It is already part of Windows 10 and 11. You do not need to install it.

Some mods can use more tools. They work without them.

- input-router reads PDFs only when Poppler for Windows is installed and its `bin` folder is on your PATH.
- research-router uses Firecrawl only when you install the Firecrawl command-line tool with npm, so that `firecrawl` works in a new terminal.

## Steps

1. Unzip the pack. Put the `token-saving-mods` folder in your Downloads folder.

2. Open Claude Code.

3. Add the pack. Type this, with your own user name in place of `<you>`:

   ```
   /plugin marketplace add C:\Users\<you>\Downloads\token-saving-mods
   ```

4. Install the mods. Type each line:

   ```
   /plugin install input-router@token-saving-mods
   /plugin install effort-optimizer@token-saving-mods
   /plugin install model-router@token-saving-mods
   /plugin install cache-clock@token-saving-mods
   /plugin install handoff@token-saving-mods
   /plugin install research-router@token-saving-mods
   /plugin install efficient-browser-use@token-saving-mods
   /plugin install mods@token-saving-mods
   /plugin install savings-proof@token-saving-mods
   ```

5. Load them. Type:

   ```
   /reload-plugins
   ```

6. Check them. Type `/mods`. The Mods pane opens and shows each mod.

7. See the savings. Type `/savings`. The Savings Proof pane (savings-proof v0.2.0) opens and shows the tokens the mods saved.

## If something goes wrong

- If `/plugin marketplace add` says it cannot find the folder, check the path. The folder you give must hold the `.claude-plugin` folder.
- If a mod does not work, turn it off in the `/mods` pane. The other mods keep working.
- On Windows, WebP pictures are not made smaller. PNG and JPEG pictures are.
