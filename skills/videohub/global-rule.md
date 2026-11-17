## Videos made as code: review in VideoHub before rendering
- Whatever folder you work in, when you build a video, animation or film as code, follow the `videohub` skill and the project contract in `{{VIDEOHUB_DIR}}/docs/PROJECT-CONTRACT.md` (start from `{{VIDEOHUB_DIR}}/templates/new-film`).
- A new film gets its own folder in the workspace's films folder (`hub_workspace` names it), not in whatever folder this chat happens to run in.
- As soon as a new film (or a big change) plays, call `hub_live({project: "<film folder>"})` (MCP server `videohub`; without it: `node "{{VIDEOHUB_DIR}}/server/cli.js" hub_live "{\"project\":\"<film folder>\"}"`). It opens the film in VideoHub's live preview straight from its code, with no render.
- Then stop and tell the user, in their own language, to watch it in VideoHub, leave notes on the frames and press "Send to your agent".
- Fix notes by editing the code only (the open preview reloads itself) and mark each with `hub_note_update`. Do not render to check a fix.
- Render only when the user asks for a render, one render at a time, through `hub_render` (never run several renders in parallel).
