# Claude Code hook

`fast-jev.ts` is the plugin's `session.compact` and `turn.complete` hook (the file keeps the
upstream name). It reads the plugin options, finds the Jev key, picks the endpoint from the key
(TypeSafe, or OpenRouter for `sk-or-` keys), resolves the drawer folder against the session's
directory, runs the library in `../src/` and writes the drawer files before handing the compacted
messages back. If anything fails, it falls back to Claude Code's built-in summary.

See the main [README](../README.md) for install, settings and limitations.
