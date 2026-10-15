# 21st MCP — setup matrix

Source: `21st-dev/magic-mcp` README, `llms-install.md`, plugin manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`, `.agents/plugins`). Package version at clone time: plugin `1.0.1`.

## 1. Recommended — 21st CLI

```bash
npx @21st-dev/cli@latest init --client cursor   # or: claude | vscode | windsurf | codex
```

## 2. Manual HTTP MCP (preferred for clients with `${VAR}` expansion)

```json
{
  "mcpServers": {
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": { "x-api-key": "${API_KEY_21ST}" }
    }
  }
}
```

Export the key in the environment instead of writing it into the file:

```bash
export API_KEY_21ST="…"   # get a free key at https://21st.dev/mcp
```

## 3. Stdio-only clients — compatibility proxy

```json
{
  "mcpServers": {
    "21st": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": { "API_KEY_21ST": "${API_KEY_21ST}" }
    }
  }
}
```

Since `@21st-dev/magic` v0.2.0 the package is a thin stdio proxy that forwards every MCP message to the 21st MCP. The key is accepted as positional `API_KEY="..."`, `--API_KEY=...`, `/API_KEY:...`, `-API_KEY ...`, or env `TWENTY_FIRST_API_KEY` / `API_KEY_21ST`. Prefer the env form: command-line forms leak into process lists and shell history.

## 4. As an agent plugin (MCP server + the `21st-ui` skill)

```bash
# Claude Code
claude plugin marketplace add 21st-dev/magic-mcp   # then: /plugin install 21st
# Grok Build
grok plugin marketplace add 21st-dev/magic-mcp && grok plugin install 21st --trust
# Codex CLI
codex plugin marketplace add 21st-dev/magic-mcp    # then install "21st" from /plugins
```

The plugin config expects the key in `API_KEY_21ST` in every client. Cursor / Grok Bot: install "21st" from the Cursor Marketplace, then set `API_KEY_21ST` under **Plugins → Configure**.

## 5. Verify

1. Reload the client's tool list; `tools/list` should include `search`, `get_component`, `get_inspiration`, `search_logo`, `get_usage` (and `generate` / `iterate_generation` **only if AI access is enabled**).
2. Call `get_usage` and read `aiGenerationEnabled`. It reports access, not remaining credit.
3. Run one `search` ("pricing table") and confirm results come back.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| 401 / auth error | Missing, wrong, or **old Magic** key (all reset) | New free key at 21st.dev/mcp → `API_KEY_21ST` |
| `ai_subscription_required` | Cached/legacy generation call with AI off | Stop; use `search` + `get_component`; after enabling AI, refresh tools or reconnect |
| `generate` not in tool list | AI access off (component access ≠ AI access) | Hand-build from catalog components |
| Install quota hit | Free tier = 2 component installs/day | Wait, unlock paid, or read code via `get_component` only |
