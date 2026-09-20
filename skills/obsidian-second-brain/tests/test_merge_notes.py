"""Tests for merge_notes.py (#220).

The maintainer's one hard requirement for the PR to land first-time: a dry run
against two synthetic notes that writes nothing (see test_dry_run_writes_nothing).
The rest pins the mechanical contract from the issue - frontmatter union with
canonical winning conflicts, the retired title folded into aliases, the retired
note becoming a type: redirect stub rather than being deleted, and --from-health
resolving a pair from vault_health.check_duplicates() instead of a cached report
(there is no persisted health-report file anywhere in this repo).
"""

from __future__ import annotations

import codecs
import subprocess
import sys
from datetime import date
from pathlib import Path

import pytest
import yaml

REPO_ROOT = Path(__file__).resolve().parents[1]


def _run(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, "scripts/merge_notes.py", *args],
        cwd=REPO_ROOT,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


def _vault(tmp_path: Path) -> Path:
    vault = tmp_path / "vault"
    vault.mkdir()
    return vault


CANONICAL = """---
date: "2026-01-01"
type: idea
tags: [idea, ai]
status: exploring
aliases:
  - Canon
ai-first: true
---

## For future agent
Canonical idea note.
"""

RETIRED = """---
date: "2026-02-01"
type: idea
tags: [idea, ai]
status: captured
related-projects: ["[[Projects/Foo]]"]
ai-first: true
---

## For future agent
Retired idea note, near-duplicate of Canonical.
"""

MERGED_BODY = """## For future agent
Merged idea note combining Canonical and Retired. Both provenance trails kept below.

Canonical (2026-01-01) said status exploring; Retired (2026-02-01) said status
captured - contradiction, listed not resolved.
"""


def _write_pair(vault: Path, canonical=CANONICAL, retired=RETIRED):
    (vault / "Canonical.md").write_text(canonical, encoding="utf-8")
    (vault / "Retired.md").write_text(retired, encoding="utf-8")


def test_dry_run_writes_nothing(tmp_path):
    """The maintainer's explicit ask: dry run against two synthetic notes writes
    nothing until --apply."""
    vault = _vault(tmp_path)
    _write_pair(vault)
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")

    before_canonical = (vault / "Canonical.md").read_text(encoding="utf-8")
    before_retired = (vault / "Retired.md").read_text(encoding="utf-8")

    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
    )
    assert result.returncode == 0, result.stderr
    assert "DRY RUN: nothing changed." in result.stdout
    # Both proposed notes are shown in the preview, so the dry run is not a no-op.
    assert "proposed Canonical.md" in result.stdout
    assert "proposed Retired.md" in result.stdout
    assert "type: redirect" in result.stdout

    assert (vault / "Canonical.md").read_text(encoding="utf-8") == before_canonical
    assert (vault / "Retired.md").read_text(encoding="utf-8") == before_retired


def test_apply_writes_redirect_stub_and_merged_frontmatter_and_alias(tmp_path):
    vault = _vault(tmp_path)
    _write_pair(vault)
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")

    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr

    canonical_text = (vault / "Canonical.md").read_text(encoding="utf-8")
    retired_text = (vault / "Retired.md").read_text(encoding="utf-8")

    # Canonical: merged body landed, union field carried over, alias folded in.
    assert "Merged idea note combining Canonical and Retired" in canonical_text
    canonical_fm = yaml.safe_load(canonical_text.split("---")[1])
    assert canonical_fm["related-projects"] == ["[[Projects/Foo]]"]  # union: only Retired had it
    assert "Retired" in canonical_fm["aliases"]
    assert "Canon" in canonical_fm["aliases"]  # pre-existing alias preserved

    # Retired: became a redirect stub, not deleted (file still exists).
    retired_fm = yaml.safe_load(retired_text.split("---")[1])
    assert retired_fm["type"] == "redirect"
    assert retired_fm["redirects_to"] == "[[Canonical]]"
    assert retired_fm["ai-first"] is True
    assert retired_fm["date"] == date.today()
    assert "[[Canonical]]" in retired_text
    assert "## For future agent" not in retired_text  # documented exception: no preamble


def test_frontmatter_conflict_canonical_wins_loser_recorded(tmp_path):
    """date and status differ between the two notes: canonical's values must win
    in the merged note, and Retired's values must be recoverable under
    merged_from - never silently dropped."""
    vault = _vault(tmp_path)
    _write_pair(vault)
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")

    _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    fm = yaml.safe_load((vault / "Canonical.md").read_text(encoding="utf-8").split("---")[1])

    assert fm["status"] == "exploring"  # canonical's value wins
    assert fm["merged_from"]["status"] == "captured"  # retired's value recorded, not lost
    assert fm["merged_from"]["path"] == "Retired.md"
    assert str(fm["merged_from"]["date"]) == "2026-02-01"


def test_no_conflict_means_no_merged_from_block(tmp_path):
    """Equal values and union-only fields are not conflicts (#220: 'on conflict'),
    so a pair that agrees on everything gets no merged_from noise."""
    vault = _vault(tmp_path)
    same = """---
date: "2026-01-01"
type: idea
tags: [idea]
ai-first: true
---

## For future agent
Same on both sides.
"""
    _write_pair(vault, canonical=same, retired=same)
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")

    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
    )
    assert result.returncode == 0, result.stderr
    assert "Frontmatter conflicts: none" in result.stdout


def test_from_health_resolves_a_real_duplicate_pair(tmp_path):
    """--from-health must come from vault_health.check_duplicates() run live, not
    a cached report file (this repo has none) - a genuinely duplicate-titled
    pair in different folders should resolve without --retire."""
    vault = _vault(tmp_path)
    (vault / "Ideas").mkdir()
    (vault / "Archive").mkdir()
    shared_body = (
        "About project alpha, first version, with enough shared body text that "
        "the similarity check treats these as the same note."
    )
    (vault / "Ideas" / "Project Alpha.md").write_text(
        f"---\ndate: \"2026-01-01\"\ntype: idea\ntags: [idea]\nai-first: true\n---\n\n"
        f"## For future agent\n{shared_body}\n",
        encoding="utf-8",
    )
    (vault / "Archive" / "Project Alpha.md").write_text(
        f"---\ndate: \"2026-01-02\"\ntype: idea\ntags: [idea]\nstatus: captured\nai-first: true\n---\n\n"
        f"## For future agent\n{shared_body}\n",
        encoding="utf-8",
    )

    # No --canonical: list mode, must surface the pair without writing anything.
    listing = _run("--path", str(vault), "--from-health")
    assert listing.returncode == 0, listing.stderr
    assert "auto-pairable (exactly 2 files): 1" in listing.stdout
    assert "Project Alpha.md" in listing.stdout

    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")
    result = _run(
        "--path", str(vault),
        "--from-health",
        "--canonical", "Ideas/Project Alpha.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr
    retired_fm = yaml.safe_load(
        (vault / "Archive" / "Project Alpha.md").read_text(encoding="utf-8").split("---")[1]
    )
    assert retired_fm["type"] == "redirect"
    # Same stem on both sides, so a bare [[Project Alpha]] would be ambiguous
    # (it could resolve to this very stub); the link is path-qualified.
    assert retired_fm["redirects_to"] == "[[Ideas/Project Alpha]]"
    # Same stem on both sides: folding the retired title into aliases would be
    # a no-op alias identical to the canonical note's own filename.
    canonical_fm = yaml.safe_load(
        (vault / "Ideas" / "Project Alpha.md").read_text(encoding="utf-8").split("---")[1]
    )
    assert "aliases" not in canonical_fm


def test_from_health_group_of_three_requires_explicit_retire(tmp_path):
    """A duplicate group with more than 2 files must never be auto-paired -
    nothing in check_duplicates says which file should survive."""
    vault = _vault(tmp_path)
    for folder in ("A", "B", "C"):
        (vault / folder).mkdir()
        (vault / folder / "Widget.md").write_text(
            "---\ndate: \"2026-01-01\"\ntype: idea\ntags: [idea]\nai-first: true\n---\n\n"
            "## For future agent\nSame widget concept everywhere, long enough body text "
            "to trip the similarity threshold across all three copies consistently.\n",
            encoding="utf-8",
        )
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")

    result = _run(
        "--path", str(vault),
        "--from-health",
        "--canonical", "A/Widget.md",
        "--merged-body-file", str(body_file),
    )
    assert result.returncode != 0
    assert "3 notes" in result.stderr or "only 2-file groups" in result.stderr


def test_missing_merged_body_file_flag_errors_before_writing(tmp_path):
    vault = _vault(tmp_path)
    _write_pair(vault)
    result = _run("--path", str(vault), "--canonical", "Canonical.md", "--retire", "Retired.md")
    assert result.returncode != 0
    assert "--merged-body-file is required" in result.stderr
    assert (vault / "Retired.md").read_text(encoding="utf-8") == RETIRED


def test_list_fields_are_unioned_not_treated_as_conflicts(tmp_path):
    """Review finding on #231: tags/aliases that differ between the two notes
    must merge as a union. Canonical-wins would silently drop every tag only
    the retired note carried."""
    vault = _vault(tmp_path)
    canonical = CANONICAL.replace("tags: [idea, ai]", "tags: [idea, ai, canon-only]")
    retired = RETIRED.replace("tags: [idea, ai]", "tags: [idea, retired-only, AI]")
    _write_pair(vault, canonical=canonical, retired=retired)
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")
    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr
    fm = yaml.safe_load((vault / "Canonical.md").read_text(encoding="utf-8").split("---")[1])
    assert fm["tags"] == ["idea", "ai", "canon-only", "retired-only"]  # union, case-insensitive dedup
    assert "tags" not in fm.get("merged_from", {})  # a union is not a conflict


def test_same_stem_redirect_is_path_qualified(tmp_path):
    """Two notes named X.md in different folders: a bare [[X]] from the redirect
    stub is ambiguous and can resolve to the stub itself. The link must be
    path-qualified in that case, and stay a bare stem otherwise."""
    vault = _vault(tmp_path)
    (vault / "Ideas").mkdir()
    (vault / "Archive").mkdir()
    (vault / "Ideas" / "Project Alpha.md").write_text(CANONICAL, encoding="utf-8")
    (vault / "Archive" / "Project Alpha.md").write_text(RETIRED, encoding="utf-8")
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")
    result = _run(
        "--path", str(vault),
        "--canonical", "Ideas/Project Alpha.md",
        "--retire", "Archive/Project Alpha.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr
    stub = (vault / "Archive" / "Project Alpha.md").read_text(encoding="utf-8")
    assert 'redirects_to: "[[Ideas/Project Alpha]]"' in stub
    assert "merged into [[Ideas/Project Alpha]]" in stub

    # Different stems keep the bare link every existing wikilink already uses.
    _write_pair(vault)
    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
    )
    assert 'redirects_to: "[[Canonical]]"' in result.stdout


@pytest.mark.parametrize(
    "crlf_sides",
    [("canonical", "retired"), ("canonical",), ("retired",)],
    ids=["both", "canonical-only", "retired-only"],
)
def test_crlf_notes_keep_their_frontmatter_through_a_merge(tmp_path, crlf_sides):
    """A note saved with CRLF line endings (a Windows editor; note_io preserves
    them byte-exactly) parsed as having no frontmatter at all. With both notes
    CRLF, --apply rewrote the canonical note with all of its original frontmatter
    fields lost (only the alias the merge adds survived);
    with one, that note's fields were silently missing from the merge (the
    canonical note's own values replaced by the retired note's, or the retired
    note's fields never unioned) and no conflict was reported. The fixtures
    above hit the both-CRLF case on Windows, where write_text() saves them
    with CRLF; this pins every case on every platform."""
    vault = _vault(tmp_path)
    for name, text in (("canonical", CANONICAL), ("retired", RETIRED)):
        if name in crlf_sides:
            text = text.replace("\n", "\r\n")
        (vault / f"{name.capitalize()}.md").write_bytes(text.encode("utf-8"))
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")
    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr
    fm = yaml.safe_load((vault / "Canonical.md").read_text(encoding="utf-8").split("---")[1])
    assert fm["type"] == "idea" and fm["ai-first"] is True
    assert fm["status"] == "exploring"  # the canonical note's own value
    assert str(fm["date"]) == "2026-01-01"
    assert fm["tags"] == ["idea", "ai"]
    assert fm["related-projects"] == ["[[Projects/Foo]]"]  # the retired note's field, unioned in
    assert fm["merged_from"]["status"] == "captured"  # the retired note's value, recorded
    assert "Retired" in fm["aliases"] and "Canon" in fm["aliases"]


def test_bom_notes_keep_their_frontmatter_through_a_merge(tmp_path):
    """A UTF-8 BOM ahead of the opening fence (editors, mostly on Windows,
    prepend one) hid the canonical note's whole frontmatter from parse_note:
    the merge then reported no conflicts and carried the retired note's date
    and status over as if they were the canonical note's own. note_io keeps
    the BOM byte-exact on read, so the parser has to skip it, as
    vault_scan.split_frontmatter already does; and the rewritten note keeps
    the BOM it carried, since a byte an editor put there stays there."""
    vault = _vault(tmp_path)
    (vault / "Canonical.md").write_bytes(("\ufeff" + CANONICAL).encode("utf-8"))
    (vault / "Retired.md").write_bytes(RETIRED.encode("utf-8"))
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")
    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr
    raw = (vault / "Canonical.md").read_bytes()
    assert raw.startswith(codecs.BOM_UTF8), "the BOM the editor put there is gone"
    fm = yaml.safe_load(raw.decode("utf-8-sig").split("---")[1])
    assert fm["status"] == "exploring"  # the canonical note's own value, not the retired note's
    assert str(fm["date"]) == "2026-01-01"
    assert fm["merged_from"]["status"] == "captured"
    assert "Canon" in fm["aliases"] and "Retired" in fm["aliases"]
    assert not (vault / "Retired.md").read_bytes().startswith(codecs.BOM_UTF8)  # it had none


def test_a_bom_on_the_retired_note_stays_on_its_redirect_stub(tmp_path):
    """The complementary case: the retired note carried the BOM and the canonical
    note did not. The redirect stub that replaces the retired note keeps that
    BOM, the retired note's frontmatter is still read through it (its status
    lands in merged_from), and the canonical note does not acquire one."""
    vault = _vault(tmp_path)
    (vault / "Canonical.md").write_bytes(CANONICAL.encode("utf-8"))
    (vault / "Retired.md").write_bytes(("\ufeff" + RETIRED).encode("utf-8"))
    body_file = tmp_path / "body.md"
    body_file.write_text(MERGED_BODY, encoding="utf-8")
    result = _run(
        "--path", str(vault),
        "--canonical", "Canonical.md",
        "--retire", "Retired.md",
        "--merged-body-file", str(body_file),
        "--apply",
    )
    assert result.returncode == 0, result.stderr
    stub = (vault / "Retired.md").read_bytes()
    assert stub.startswith(codecs.BOM_UTF8), "the BOM the retired note carried is gone from its stub"
    assert yaml.safe_load(stub.decode("utf-8-sig").split("---")[1])["type"] == "redirect"
    canonical = (vault / "Canonical.md").read_bytes()
    assert not canonical.startswith(codecs.BOM_UTF8)  # it had none
    fm = yaml.safe_load(canonical.decode("utf-8").split("---")[1])
    assert fm["merged_from"]["status"] == "captured"  # read through the retired note's BOM
