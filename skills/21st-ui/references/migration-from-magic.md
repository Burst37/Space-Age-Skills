# Migrating from Magic MCP

| Legacy Magic tool | 21st MCP tool | Notes |
|---|---|---|
| `21st_magic_component_builder` | `generate` | Only listed when AI access is enabled; check `get_usage.aiGenerationEnabled` first. Prefer `search` + `get_component` when a catalog match exists |
| `21st_magic_component_inspiration` | `get_inspiration` | |
| `21st_magic_component_refiner` | `generate` | A *new* generation from the refinement prompt, not an in-place edit |
| `logo_search` | `search_logo` | **One brand per call** |

The server still accepts the legacy names and translates them, so old agents keep working — but new prompts, skills and docs should use the new names.

## Checklist

- [ ] Replace `@21st-dev/magic` + `API_KEY="…"` args with the HTTP MCP entry (or keep the proxy but move the key to `API_KEY_21ST`).
- [ ] Old keys from the Magic console are dead — issue a fresh key at https://21st.dev/mcp.
- [ ] Remove `/ui` and `/21` trigger-phrase assumptions: those were conventions of the old tool descriptions, not the protocol. Use natural language ("search 21st for a pricing table").
- [ ] Handle `ai_subscription_required` (stop, don't retry) and the AI-off path.
- [ ] Backend `magic.21st.dev` is superseded; remove any hard-coded references.
