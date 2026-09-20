"""Codex/MCP parity regressions found against a real-world vault. Fixture
names and facts here are synthetic.

These tests cover capabilities direct-filesystem Claude already had but MCP-only
clients lacked: non-duplicating AI preambles, canonical paths, complete reads,
safe exact edits, Inbox graduation, documented validation exceptions, and alias
resolution.
"""

from __future__ import annotations

import importlib
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "integrations" / "obsidian-mcp-server"))


@pytest.fixture()
def vault(tmp_path, monkeypatch):
    root = tmp_path / "vault"
    root.mkdir()
    monkeypatch.setenv("OBSIDIAN_VAULT_PATH", str(root))
    import vault_ops
    importlib.reload(vault_ops)
    return root, vault_ops


def test_save_collapses_repeated_legacy_preambles(vault):
    root, ops = vault
    result = ops.save_note(
        "Contact",
        "## For future Claude\n\n## For future Claude\n\n"
        "This contact may help with the launch plan. Verify availability.\n\n"
        "## Details\n\nBody.",
    )
    text = (root / result["saved"]).read_text(encoding="utf-8")
    assert text.count("## For future agent") == 1
    assert "For future Claude" not in text
    assert "Verify availability" in text


def test_save_supports_canonical_explicit_path(vault):
    root, ops = vault
    result = ops.save_note(
        "Alex Rivera",
        "Potential launch advisor. Availability is not confirmed.",
        note_type="person",
        path="wiki/entities/Alex Rivera.md",
    )
    assert result["saved"] == "wiki/entities/Alex Rivera.md"
    assert (root / result["saved"]).is_file()
    assert not (root / "Inbox").exists()


def test_save_explicit_path_guards(vault):
    _, ops = vault
    assert ops.save_note("x", "valid summary", path="../escape.md").get("error")
    assert ops.save_note("x", "valid summary", path="raw/escape.md").get("error")
    assert ops.save_note("x", "valid summary", path="wiki/no-extension").get("error")


def test_read_note_paginates_to_eof(vault):
    root, ops = vault
    payload = "a" * 20_000 + "TAIL"
    (root / "large.md").write_text(payload, encoding="utf-8")
    first = ops.read_note("large.md")
    assert first["truncated"] is True
    assert first["next_offset"] == 20_000
    second = ops.read_note("large.md", offset=first["next_offset"])
    assert second["content"] == "TAIL"
    assert second["truncated"] is False and second["next_offset"] is None


def _valid_note(preamble: str) -> str:
    return (
        "---\ntype: note\ndate: 2026-08-12\ntags: [note]\nai-first: true\n---\n\n"
        + preamble
    )


def test_validator_accepts_generic_and_legacy_but_rejects_empty_duplicates(vault):
    root, ops = vault
    (root / "generic.md").write_text(
        _valid_note("## For future agent\nUseful summary.\n"), encoding="utf-8"
    )
    (root / "legacy.md").write_text(
        _valid_note("## For future agent\nUseful legacy summary.\n"), encoding="utf-8"
    )
    (root / "broken.md").write_text(
        _valid_note("## For future agent\n\n## For future agent\n\n## Details\n"),
        encoding="utf-8",
    )
    assert ops.validate_note("generic.md")["ok"]
    assert ops.validate_note("legacy.md")["ok"]
    issues = " ".join(ops.validate_note("broken.md")["issues"])
    assert "duplicate" in issues and "empty" in issues


def test_validator_allows_embedded_source_preambles_in_a_bundle(vault):
    root, ops = vault
    (root / "bundle.md").write_text(
        _valid_note(
            "## For future agent\nOuter bundle summary.\n\n"
            "## Embedded note A\n\n## For future Claude\nEmbedded summary A.\n\n"
            "## Embedded note B\n\n## For future agent\nEmbedded summary B.\n"
        ),
        encoding="utf-8",
    )
    assert ops.validate_note("bundle.md")["ok"]


def test_validator_honours_board_exception(vault):
    root, ops = vault
    (root / "boards").mkdir()
    (root / "boards" / "Personal.md").write_text(
        "---\nkanban-plugin: board\n---\n\n## Waiting\n- [ ] reply\n",
        encoding="utf-8",
    )
    result = ops.validate_note("boards/Personal.md")
    assert result["ok"] and result["exempt"]


def test_validator_resolves_scalar_inline_and_block_aliases(vault):
    root, ops = vault
    (root / "people").mkdir()
    (root / "people" / "dated.md").write_text(
        _valid_note(
            "aliases:\n"  # body text does not count; frontmatter aliases below
        ), encoding="utf-8"
    )
    # Three actual entity notes exercise every supported YAML spelling.
    for name, alias_line in (
        ("one", "aliases: Alex Rivera"),
        ("two", "aliases: [Big Boss, El Jefe]"),
        ("three", "aliases:\n  - Deep Name"),
    ):
        (root / "people" / f"{name}.md").write_text(
            "---\ntype: person\ndate: 2026-08-12\ntags: [person]\n"
            f"{alias_line}\nai-first: true\n---\n\n"
            "## For future agent\nUseful summary.\n",
            encoding="utf-8",
        )
    (root / "links.md").write_text(
        _valid_note(
            "## For future agent\nLinks [[Alex Rivera]], [[Big Boss]], "
            "[[El Jefe]], and [[Deep Name]].\n"
        ), encoding="utf-8"
    )
    assert ops.validate_note("links.md")["ok"]


def test_replace_text_requires_one_exact_anchor(vault):
    root, ops = vault
    note = root / "note.md"
    note.write_text("before UNIQUE after\n", encoding="utf-8")
    assert ops.replace_text("note.md", "UNIQUE", "fixed")["replacements"] == 1
    assert note.read_text(encoding="utf-8") == "before fixed after\n"
    note.write_text("same same\n", encoding="utf-8")
    assert ops.replace_text("note.md", "same", "x").get("error")
    assert note.read_text(encoding="utf-8") == "same same\n"


def test_move_note_graduates_inbox_without_overwrite(vault):
    root, ops = vault
    (root / "Inbox").mkdir()
    src = root / "Inbox" / "capture.md"
    src.write_text("body\n", encoding="utf-8")
    result = ops.move_note("Inbox/capture.md", "wiki/entities/Contact.md")
    assert result["destination"] == "wiki/entities/Contact.md"
    assert not src.exists()
    assert (root / "wiki/entities/Contact.md").read_text(encoding="utf-8") == "body\n"
    (root / "Inbox" / "second.md").write_text("second\n", encoding="utf-8")
    assert ops.move_note("Inbox/second.md", "wiki/entities/Contact.md").get("error")


def test_move_note_does_not_overwrite_on_a_destination_race(vault, monkeypatch):
    root, ops = vault
    (root / "Inbox").mkdir()
    src = root / "Inbox" / "capture.md"
    src.write_text("precious source\n", encoding="utf-8")

    def raced_link(_source, destination):
        Path(destination).write_text("other writer\n", encoding="utf-8")
        raise FileExistsError

    monkeypatch.setattr(ops.os, "link", raced_link)
    result = ops.move_note("Inbox/capture.md", "wiki/entities/Contact.md")
    assert result.get("error")
    assert src.read_text(encoding="utf-8") == "precious source\n"
    assert (root / "wiki/entities/Contact.md").read_text(encoding="utf-8") == "other writer\n"
