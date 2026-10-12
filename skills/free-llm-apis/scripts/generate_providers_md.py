#!/usr/bin/env python3
"""Regenerate references/providers.md from data/data.json.

Refresh flow: replace data/data.json with the latest from github.com/mnfst/awesome-free-llm-apis,
then run:  python3 -I scripts/generate_providers_md.py
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import ENV_VARS, KEYLESS, load, openai_base  # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent.parent / "references" / "providers.md"


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def main():
    d = load()
    notes = {n["id"]: n["text"] for n in d["footnotes"]}
    L = [
        "# Free LLM API providers — generated reference",
        "",
        f"Snapshot of `data/data.json` (`lastUpdated: {d['lastUpdated']}`) from `mnfst/awesome-free-llm-apis` (CC0). "
        "**Free tiers change weekly — treat every limit as a hint and re-check the provider page before depending on it.** "
        "Regenerate with `python3 -I scripts/generate_providers_md.py`.",
        "",
        "Key variable names below are the Space Age convention (names only; values never enter chat, repos or memory notes).",
        "",
        "| Provider | Type | Key needed? | Env var | OpenAI-compatible base URL |",
        "|---|---|---|---|---|",
    ]
    for p in d["providers"]:
        kind = "Provider API" if p["category"] == "provider_api" else "Inference provider"
        key = "No (anonymous tier)" if p["name"] in KEYLESS else "Yes (free)"
        L.append(f"| [{cell(p['name'])}]({p['url']}) {p['flag']} | {kind} | {key} | `{ENV_VARS.get(p['name'], '—')}` | `{openai_base(p)}` |")
    L += ["", "---", ""]
    for p in d["providers"]:
        L += [f"## {p['name']} {p['flag']}", "", p["description"], "",
              f"- Get a key / sign up: {p['url']}",
              f"- Catalog base URL (data.json): `{p['baseUrl']}`",
              f"- OpenAI-style chat base URL: `{openai_base(p)}`",
              f"- Env var: `{ENV_VARS.get(p['name'], '—')}`", ""]
        L += ["| Model id | Context | Max out | Modality | Limit |", "|---|---|---|---|---|"]
        for m in p["models"]:
            L.append(f"| `{cell(m['id'])}` | {cell(m['context'])} | {cell(m['maxOutput'])} | {cell(m['modality'])} | {cell(m['rateLimit'])} |")
        ref = p.get("footnoteRef")
        if ref:
            L += ["", f"> **Note {ref}:** {notes.get(ref, '')}"]
        L.append("")
    L += ["## Glossary", ""] + [f"- **{g['abbreviation']}** — {g['meaning']}" for g in d["glossary"]] + [""]
    OUT.write_text("\n".join(L), encoding="utf-8")
    print(f"wrote {OUT} ({len(d['providers'])} providers)")


if __name__ == "__main__":
    main()
