"""Ranking quality: volume is not relevance (stress-test fix 13/24).

Lexical: term-dense logs took #1 on 7 of 12 audit queries, burying canonical
notes - notes typed log/daily now fade to 0.5 (a moderator, not a mute) and
person/entity dossiers boost 1.5x. Semantic: mean-pooling a long note into one
averaged vector made a person dossier unfindable despite containing the
answer verbatim - the index now stores per-chunk vectors with an identity
header, and a note scores by its best chunk.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "integrations" / "obsidian-mcp-server"))
sys.path.insert(0, str(REPO_ROOT / "scripts" / "eval"))

import semantic_search as ss  # noqa: E402
import vault_ops  # noqa: E402


@pytest.fixture()
def vault(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    v.mkdir()
    monkeypatch.setenv(vault_ops._VAULT_ENV, str(v))
    return v


def test_canonical_note_outranks_shouting_log(vault):
    (vault / "wiki" / "concepts").mkdir(parents=True)
    (vault / "wiki" / "logs").mkdir()
    (vault / "wiki" / "concepts" / "gateway-pattern.md").write_text(
        "---\ntype: concept\n---\n\nThe gateway pattern explained: gateway gateway.\n",
        encoding="utf-8",
    )
    # The log mentions the term far more often - volume, not relevance.
    (vault / "wiki" / "logs" / "2026-07-01-worklog.md").write_text(
        "---\ntype: log\n---\n\n" + ("gateway deploy gateway retry gateway " * 40),
        encoding="utf-8",
    )

    hits = vault_ops.search("gateway", limit=2, semantic=False)
    assert hits[0]["path"] == "wiki/concepts/gateway-pattern.md", hits


def test_untyped_note_in_logs_folder_also_fades(vault):
    assert vault_ops._type_weight("wiki/logs/x.md", "no frontmatter") == vault_ops._SEARCH_LOG_WEIGHT
    assert vault_ops._type_weight("Daily/2026-07-11.md", "") == vault_ops._SEARCH_LOG_WEIGHT
    assert vault_ops._type_weight("wiki/concepts/x.md", "") == 1.0


def test_entity_boost_applies(vault):
    w = vault_ops._type_weight("wiki/entities/ken.md", "---\ntype: person\n---")
    assert w == vault_ops._SEARCH_ENTITY_BOOST > 1.0


def test_best_chunk_beats_average(vault, monkeypatch):
    """A dossier with one relevant section must score by that section."""
    index = {
        "model": "fake", "format": 2,
        "notes": {
            # dossier: 9 unrelated chunks + 1 perfect chunk
            "dossier.md": {"title": "dossier",
                           "vecs": [[0.0, 1.0]] * 9 + [[1.0, 0.0]]},
            # short note: one mediocre chunk
            "meh.md": {"title": "meh", "vecs": [[0.7, 0.7]]},
            # legacy single-vec entry must still score (backwards compat)
            "old.md": {"title": "old", "vec": [0.5, 0.85]},
        },
    }
    monkeypatch.setattr(ss, "embed", lambda q, **kw: [1.0, 0.0])
    hits = ss.semantic_search("q", index, limit=3)
    assert hits[0]["path"] == "dossier.md"
    assert {h["path"] for h in hits} == {"dossier.md", "meh.md", "old.md"}


def test_fuse_scores_by_best_chunk_too(vault, monkeypatch):
    index = {
        "model": "fake", "format": 2,
        "notes": {
            "dossier.md": {"title": "dossier", "vecs": [[0.0, 1.0], [1.0, 0.0]]},
            "shallow.md": {"title": "shallow", "vecs": [[0.8, 0.6]]},
        },
    }
    (vault / vault_ops._SEMANTIC_INDEX_FILE).write_text(json.dumps(index), encoding="utf-8")
    monkeypatch.setattr(vault_ops, "_embed_query", lambda q, **kw: [1.0, 0.0])
    fused = vault_ops._semantic_fuse("some multi word query", [], vault, 5, enabled=True)
    assert fused is not None
    assert fused[0]["path"] == "dossier.md"


def test_prepare_note_text_header_and_scaffolding():
    header, body = ss.prepare_note_text(
        "Atlas",
        "---\ntype: project\naliases: [Ada agent]\nrelated-people: [Ada Lovelace]\n---\n\n"
        "## For future agent\n\nPersonal agent gateway for Ada.\n\n"
        "## Empty scaffold\n\n## Also empty\n\n"
        "## Filled\n\ncontent here\n",
    )
    assert header.startswith("Atlas | project | Ada agent | Ada Lovelace")
    assert "Personal agent gateway" in body
    assert "content here" in body
    assert "Empty scaffold" not in body
    assert "Also empty" not in body


def test_all_scaffold_note_still_embeds_identity():
    header, body = ss.prepare_note_text(
        "Ghost Town", "---\ntype: daily\n---\n\n## A\n\n## B\n\n## C\n"
    )
    assert body == ""
    assert "Ghost Town" in header


# --- the lexical fusion depth (#262) -----------------------------------------

def _fuse_with_lex_depth(vault, monkeypatch, depth, lexical):
    """Run one fusion at a given OBSIDIAN_RRF_LEX_DEPTH, module reloaded."""
    import importlib
    monkeypatch.setenv("OBSIDIAN_RRF_LEX_DEPTH", str(depth))
    mod = importlib.reload(vault_ops)
    monkeypatch.setenv(mod._VAULT_ENV, str(vault))
    # Only the semantic answer is indexed: a lexical hit's rank in the fusion is
    # then its lexical vote and nothing else, which is the thing being measured.
    index = {
        "model": "fake", "format": 2,
        "notes": {"semantic-only.md": {"title": "semantic only", "vecs": [[1.0, 0.0]]}},
    }
    (vault / mod._SEMANTIC_INDEX_FILE).write_text(json.dumps(index), encoding="utf-8")
    monkeypatch.setattr(mod, "_embed_query", lambda q, **kw: [1.0, 0.0])
    fused = mod._semantic_fuse("some multi word query", lexical, vault, 30, enabled=True)
    return mod, fused


def test_the_lexical_fusion_depth_ships_uncapped_and_the_knob_is_the_lever(vault, monkeypatch):
    """#262: the comment on _FUSE_LEX_DEPTH said lexical votes are "capped to
    its strongest few", and the default is _FUSE_DEPTH - so nothing is capped
    until someone sets OBSIDIAN_RRF_LEX_DEPTH. A reader who believed the comment
    would look elsewhere for the lexical tail that displaced their exact match.

    This pins the two halves of that: the shipped default caps nothing, and the
    knob really does cut the tail out of the vote.
    """
    import importlib
    lexical = [{"path": f"lex{i}.md", "title": f"lex {i}", "score": 10.0 - i, "snippet": ""}
               for i in range(20)]

    monkeypatch.delenv("OBSIDIAN_RRF_LEX_DEPTH", raising=False)
    default_mod = importlib.reload(vault_ops)
    assert default_mod._FUSE_LEX_DEPTH == default_mod._FUSE_DEPTH, (
        "the default is no longer the uncapped one the comment now documents"
    )

    _, wide = _fuse_with_lex_depth(vault, monkeypatch, 25, lexical)
    _, narrow = _fuse_with_lex_depth(vault, monkeypatch, 2, lexical)
    try:
        wide_paths = {h["path"] for h in wide}
        narrow_paths = {h["path"] for h in narrow}
        assert "lex15.md" in wide_paths, (
            "a lexical result 16 deep did not vote even at depth 25; the fixture "
            "is not exercising the tail"
        )
        assert "lex15.md" not in narrow_paths, (
            "OBSIDIAN_RRF_LEX_DEPTH=2 still let the lexical tail vote, so the knob "
            "the comment points at does not do what it says"
        )
        assert len(narrow) < len(wide), (
            "the knob did not shrink the candidate pool the lexical arm contributes"
        )
        assert narrow[0]["path"] == "semantic-only.md"
    finally:
        monkeypatch.delenv("OBSIDIAN_RRF_LEX_DEPTH", raising=False)
        importlib.reload(vault_ops)
