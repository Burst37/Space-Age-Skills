# Vendoring notes

Upstream: [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) (Apache-2.0, see `LICENSE`).

## Path map

The vendored tree **mirrors upstream's layout** so the copied files work unmodified:
`skill_generator.py` resolves its default template relative to its own directory, and
the guides' relative links resolve to the protocol doc. Do not flatten these — doing so
silently breaks template resolution and sends the generator into its reduced fallback.

| Local path | Upstream path |
|---|---|
| `harness/` | `cli-anything-plugin/` |
| `harness/HARNESS.md` | `cli-anything-plugin/HARNESS.md` |
| `harness/guides/` | `cli-anything-plugin/guides/` |
| `harness/templates/` | `cli-anything-plugin/templates/` |
| `harness/skill_generator.py` | `cli-anything-plugin/skill_generator.py` |
| `harness/repl_skin.py` | `cli-anything-plugin/repl_skin.py` |
| `docs/PREVIEW_PROTOCOL.md` | `docs/PREVIEW_PROTOCOL.md` |

Vendored prose refers to upstream paths — most relevantly, `HARNESS.md` says to copy
`cli-anything-plugin/repl_skin.py`, which is `harness/repl_skin.py` here, and
`guides/skill-generation.md` invokes `skill_generator.py`, which is
`harness/skill_generator.py` here. Read those references through this table rather
than editing the vendored text.

`reference/cli-hub.md`, `reference/catalog.md`, `cli-anything.md`, `SKILL.md` and this
file are **ours**, not upstream — they have no upstream counterpart.

## Local patches

Three fixes applied on top of upstream. Each is an upstream bug, not a repackaging
artifact; **reapply them after refreshing from upstream** (or drop the ones upstream
has since fixed).

1. **`harness/skill_generator.py` — YAML-safe fallback frontmatter.**
   `generate_skill_md_simple()` interpolated the README-derived description straight
   into a double-quoted YAML scalar, so a description containing `"` or `\` emitted
   invalid frontmatter and made the generated skill undiscoverable. Now serialized
   with `json.dumps()` (a JSON string is a valid YAML double-quoted scalar; stdlib
   only, no PyYAML dependency added).

2. **`harness/skill_generator.py` — examples only for discovered commands.**
   `generate_examples()` unconditionally advertised `project new` and REPL
   `undo`/`redo`. Harnesses without a project model (stateless API clients, service
   wrappers) got generated skills pointing agents at commands that do not exist.
   Both are now gated on the parsed command groups, matching the conditional already
   used for `export`.

3. **`harness/repl_skin.py` — banner shows the resolved skill path.**
   `__init__` resolves `self.skill_path` (explicit argument → repo-root canonical copy
   → packaged copy) but the banner printed the hardcoded
   `~/.agents/skills/<id>/SKILL.md` regardless, a path that does not exist unless the
   global install was performed — and it ignored explicit `skill_path` arguments. The
   banner now prints the resolved path, falling back to the global path only when no
   real file was found.

Reported by Codex review on
[Space-Age-Skills#59](https://github.com/Burst37/Space-Age-Skills/pull/59).

## Refreshing

```bash
git clone --depth 1 https://github.com/HKUDS/CLI-Anything.git
# copy per the path map above, preserving the mirrored layout:
#   cli-anything-plugin/{HARNESS.md,guides,templates,skill_generator.py,repl_skin.py} -> harness/
#   docs/PREVIEW_PROTOCOL.md                                                          -> docs/
# then reapply the local patches listed above and re-verify:
python3 -c "from pathlib import Path; p=Path('harness/skill_generator.py').parent/'templates'/'SKILL.md.template'; assert p.exists(), p"
```

`reference/catalog.md` is a point-in-time registry snapshot; regenerate it from
upstream's `registry.json` / `public_registry.json`, or just trust `cli-hub list`.
