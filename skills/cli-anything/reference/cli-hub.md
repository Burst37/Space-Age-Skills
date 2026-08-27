# cli-hub — the consumer surface

`cli-hub` is the package manager and discovery layer for CLI-Anything harnesses.
It is a thin wrapper around `pip` / `npm` / `brew`: `cli-hub install gimp` installs
the standalone `cli-anything-gimp` package, which exposes the `cli-anything-gimp`
entry point. Harnesses are PEP 420 namespace packages under `cli_anything/`, so
any number of them coexist in one environment.

```bash
pip install cli-anything-hub
```

## Discovery

```bash
cli-hub list                       # everything in the registry
cli-hub list -c video              # one category
cli-hub search "3d modeling"       # keyword search
cli-hub info gimp                  # details: install cmd, prerequisites, skill path
cli-hub can "transcribe audio"     # which capability, in which matrix, satisfies this
```

Add `--json` to any of these for machine-readable output.

## Install / update / remove

```bash
cli-hub install kdenlive
cli-hub update kdenlive
cli-hub uninstall kdenlive
cli-hub launch kdenlive -- --help  # run without remembering the entry point
```

After install, read the harness's own `SKILL.md` (path shown by `cli-hub info`,
and printed in the REPL banner) before driving it. Every harness supports
`--json` on every command, and the bare entry point drops into a REPL.

## Matrices — whole workflows, not single tools

A **matrix** is a workflow packaged as capabilities × providers. Shipped
matrices: `video-creation`, `image-design`, `3d-cad`, `game-development`,
`knowledge-research`. Each maps intents (`text.transcribe`, `visual.generate`)
onto harness CLIs, public CLIs, Python libraries, native binaries, and cloud APIs.

Preflight before you install:

```bash
cli-hub matrix list
cli-hub matrix search "video subtitle"
cli-hub matrix info video-creation --json
cli-hub matrix preflight video-creation --json            # exit 3 = gaps
cli-hub matrix preflight video-creation -c text.transcribe --fix-hints
cli-hub matrix install video-creation --capability text.transcribe
cli-hub matrix install video-creation --dry-run           # plan, zero side effects
cli-hub matrix install video-creation --resume            # retry failures
cli-hub matrix doctor video-creation                      # audit an install
cli-hub matrix recipes "montage"
```

**Scope every install.** Do not bulk-install a 14-CLI matrix for a
one-capability task — use `--capability`, `--recipe`, or `--only a,b`.
Exit codes: `0` ok · `3` partial/gaps · `1` failure · `2` usage error.
After install the matrix renders its own `SKILL.md` locally with
provider-selection rules — read it.

## Previews — read-only consumer of harness preview state

`cli-hub previews` **never renders**. Harnesses publish preview bundles with
`cli-anything-<software> preview ...`; `cli-hub` only inspects what exists.

```bash
cli-anything-blender preview capture --json   # producer: publish a bundle
cli-hub previews inspect <ref> --json         # consumer: read it
cli-hub previews html <ref> -o out.html
cli-hub previews watch <session-ref>
cli-hub previews open <ref>
```

Think in two steps: **publish with the software CLI, inspect with `cli-hub`.**

## Links

- Web hub: https://hkuds.github.io/CLI-Anything/ · https://clianything.cc
- Repository: https://github.com/HKUDS/CLI-Anything
- Live catalog: https://reeceyang.sgp1.cdn.digitaloceanspaces.com/SKILL.md
- Skills installable directly: `npx skills add HKUDS/CLI-Anything --skill cli-anything-<name> -g -y`
