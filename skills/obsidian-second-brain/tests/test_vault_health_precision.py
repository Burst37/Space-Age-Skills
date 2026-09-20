"""vault_health precision: the smoke alarm must neither miss fires nor cry wolf.

Pins the stress test's referee-level findings (fix 8/24): the orphan check's
substring blind spot (short stems hiding inside other links) and self-link
loophole, duplicate warnings inflated by shared AI-first boilerplate, and the
inline-alias parsing gap discovered during fix 4.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]


def _health(vault: Path) -> dict:
    result = subprocess.run(
        [sys.executable, "scripts/vault_health.py", "--path", str(vault), "--json"],
        cwd=REPO_ROOT,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout[result.stdout.find("{"):])


def _issues(payload: dict, itype: str) -> list:
    return [i for i in payload["issues"] if i["type"] == itype]


def test_short_stem_orphan_is_flagged(tmp_path):
    """'ai' used to hide inside 'detail' via substring matching and never ring."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "ai.md").write_text("# about ai\n", encoding="utf-8")
    (vault / "other.md").write_text("see [[detail]]\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "ai.md" in orphans


def test_path_qualified_incoming_link_still_counts(tmp_path):
    """The legit case behind the old substring hack must keep working."""
    vault = tmp_path / "vault"
    (vault / "Projects").mkdir(parents=True)
    (vault / "Projects" / "target.md").write_text("# t\n", encoding="utf-8")
    (vault / "linker.md").write_text("see [[Projects/target]]\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "Projects/target.md" not in orphans


def test_self_link_does_not_prevent_orphanhood(tmp_path):
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "zephyr.md").write_text("me again: [[zephyr]]\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "zephyr.md" in orphans


def test_same_title_different_content_is_not_a_duplicate_warning(tmp_path):
    """Shared frontmatter + '## For future agent' boilerplate used to push two
    unrelated notes past the 0.6 similarity threshold."""
    vault = tmp_path / "vault"
    (vault / "Concepts").mkdir(parents=True)
    boiler = ("---\ntype: concept\ndate: 2026-07-11\ntags: [concept]\nai-first: true\n---\n\n"
              "## For future agent\n\n")
    (vault / "Concepts" / "Google Ads.md").write_text(
        boiler + "Concept A is entirely about the Google Ads auction platform and bidding.\n",
        encoding="utf-8",
    )
    (vault / "Concepts" / "google-ads.md").write_text(
        boiler + "Concept B covers something different: retention emails for tour operators.\n",
        encoding="utf-8",
    )

    dups = _issues(_health(vault), "duplicate")
    assert dups, "same-title notes should still be grouped"
    assert all(d["severity"] == "info" for d in dups), dups


def test_true_duplicates_still_warn(tmp_path):
    vault = tmp_path / "vault"
    (vault / "A").mkdir(parents=True)
    (vault / "B").mkdir()
    body = "---\ntype: concept\n---\n\n## For future agent\n\nIdentical body text here.\n"
    (vault / "A" / "Same Note.md").write_text(body, encoding="utf-8")
    (vault / "B" / "same-note.md").write_text(body, encoding="utf-8")

    dups = _issues(_health(vault), "duplicate")
    assert dups and dups[0]["severity"] == "warning", dups


def test_inline_aliases_resolve_links(tmp_path):
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "person.md").write_text(
        "---\ntype: person\naliases: [Big Boss, El Jefe]\n---\n\n# person\n",
        encoding="utf-8",
    )
    (vault / "linker.md").write_text("met [[Big Boss]] and [[El Jefe]]\n", encoding="utf-8")

    wanted = _issues(_health(vault), "wanted_note")
    assert wanted == [], wanted


def test_non_latin_titles_are_not_collapsed_to_their_latin_fragments(tmp_path):
    """[^a-z0-9 ] deleted every Cyrillic letter, so unrelated notes collided.

    Found on a 591-note Ukrainian/Russian vault: 'Огляд ринку та KPI' normalized to
    'kpi' and 'Зустріч команди 1' to '1', which grouped notes sharing
    nothing but a stray Latin fragment. 12 of 14 reported duplicates were noise.
    """
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "Огляд ринку та KPI.md").write_text("Про мотивацію.\n", encoding="utf-8")
    (vault / "Правила роботи та KPI.md").write_text("Про роад-мап.\n", encoding="utf-8")
    (vault / "Зустріч команди 1.md").write_text("Про навушники.\n", encoding="utf-8")
    (vault / "Огляд кварталу 1.md").write_text("Про продажі.\n", encoding="utf-8")

    dupes = _issues(_health(vault), "duplicate")
    assert dupes == [], f"unrelated non-Latin titles reported as duplicates: {dupes}"


def test_numbered_series_is_not_reported_as_a_truncated_title(tmp_path):
    """'X 1' / 'X 2' are parts of a series; neither is a truncation of the other.

    Measured: difflib rates them 0.95 and their bodies 1.00 (both are stubs), so
    neither a title ratio nor a content gate can separate them from a real
    truncation pair - only the strict-prefix rule can.
    """
    vault = tmp_path / "vault"
    vault.mkdir()
    for part in (1, 2):
        (vault / f"Довга назва серії матеріалів {part}.md").write_text(
            "Коротка заглушка.\n", encoding="utf-8")

    dupes = _issues(_health(vault), "duplicate")
    assert dupes == [], f"numbered series reported as duplicates: {dupes}"


def test_export_truncated_title_is_reported(tmp_path):
    """An exporter cutting one title at two lengths stores one item twice."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "Довга назва книги про управління компанією.md").write_text(
        "Перший запис.\n", encoding="utf-8")
    (vault / "Довга назва книги про управління компанією та.md").write_text(
        "Другий запис, інший текст.\n", encoding="utf-8")

    dupes = _issues(_health(vault), "duplicate")
    assert len(dupes) == 1, f"expected the truncation pair to be reported, got {dupes}"
    assert len(dupes[0]["files"]) == 2


def test_attachment_link_resolves_by_bare_filename(tmp_path):
    """[[Folder/file.png]] from a Notion export must not be reported as missing.

    The folder segment is relative to the note, not the vault root, so the
    full-path lookup never matched and every imported attachment link was
    reported as a wanted note - 43 of 43 on the vault where this was found,
    with all 43 files present on disk.
    """
    vault = tmp_path / "vault"
    (vault / "Проєкт" / "Вкладення").mkdir(parents=True)
    (vault / "Проєкт" / "Вкладення" / "Screenshot_11.png").write_bytes(b"\x89PNG\r\n")
    (vault / "Проєкт" / "Нотатка.md").write_text(
        "Дивись [[Вкладення/Screenshot_11.png]].\n", encoding="utf-8")

    payload = _health(vault)
    assert _issues(payload, "wanted_note") == []
    assert _issues(payload, "missing_attachment") == []


def test_absent_attachment_is_reported_separately_from_a_wanted_note(tmp_path):
    """A gap to write and an import to clean up are different work items."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "Нотатка.md").write_text(
        "Картинка [[diagram.png]] і нотатка [[Ще не написана нотатка]].\n",
        encoding="utf-8")

    payload = _health(vault)
    wanted = _issues(payload, "wanted_note")
    missing = _issues(payload, "missing_attachment")
    assert len(wanted) == 1 and "Ще не написана" in wanted[0]["message"]
    assert len(missing) == 1 and "diagram.png" in missing[0]["message"]


def test_invalid_tags_are_flagged_and_valid_ones_are_not(tmp_path):
    """#221: Obsidian silently strikes through digits-only, dotted and spaced tags.
    check_tag_syntax names each bad tag with its fix; Unicode, nested and
    letter-digit tags pass."""
    (tmp_path / "bad.md").write_text(
        "---\ntype: note\ndate: 2026-08-27\ntags: [project, 33, 2.0]\nai-first: true\n---\n\n"
        "## For future agent\n\nbody\n", encoding="utf-8")
    (tmp_path / "bad_block.md").write_text(
        "---\ntype: note\ndate: 2026-08-27\ntags:\n  - person\n  - q3 2026\nai-first: true\n---\n\n"
        "## For future agent\n\nbody\n", encoding="utf-8")
    (tmp_path / "good.md").write_text(
        "---\ntype: note\ndate: 2026-08-27\ntags: [store-33, area/sub, знания, 学习, v2_0]\n"
        "ai-first: true\n---\n\n## For future agent\n\nbody\n", encoding="utf-8")
    payload = _health(tmp_path)
    found = _issues(payload, "invalid_tag")
    tags = sorted(i["tag"] for i in found)
    assert tags == ["2.0", "33", "q3 2026"], tags
    assert all(i["severity"] == "warning" for i in found)
    assert not [i for i in found if "good.md" in i["files"]]
    assert payload["counts"]["Invalid tags"] == 3


def test_overlong_wikilink_is_a_wanted_note_not_a_crash(tmp_path):
    """#272: inline script in a captured page (`[[null,null,...]]`) reads as a link
    longer than the filesystem allows for a name. The folder check raised OSError
    on Python <3.14 and ended the scan for the whole vault."""
    target = ",".join(["null"] * 120)
    (tmp_path / "scraped.md").write_text(
        f"# scraped\n\nwindow.IJ_values = [[{target}]];\n", encoding="utf-8")
    wanted = _issues(_health(tmp_path), "wanted_note")
    assert any(target in i["message"] for i in wanted), wanted


# ── #290: one link must not vouch for every note that shares a filename ──────

def test_a_path_qualified_link_does_not_cover_a_same_named_note_elsewhere(tmp_path):
    """Every link used to register its bare filename as well as its path, and
    notes were only ever matched by stem. So one link covered every note sharing
    a stem anywhere in the vault (#290).

    Written against two dated notes in ordinary folders. The original report used
    `wiki/daily/` and `Logs/`, which is where the collision actually bites in a
    real vault, but both of those became exempt from the orphan check in #292,
    so they can no longer show it."""
    vault = tmp_path / "vault"
    (vault / "Meetings").mkdir(parents=True)
    (vault / "Archive").mkdir(parents=True)
    (vault / "Home.md").write_text("see [[Meetings/2026-01-05]]\n", encoding="utf-8")
    (vault / "Meetings" / "2026-01-05.md").write_text("back to [[Home]]\n", encoding="utf-8")
    (vault / "Archive" / "2026-01-05.md").write_text("nothing links here\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "Archive/2026-01-05.md" in orphans, "the unlinked note must still be reported"
    assert "Meetings/2026-01-05.md" not in orphans, "the linked note must not be"


def test_one_linked_readme_does_not_cover_the_others(tmp_path):
    """The same collision with a filename repeated per folder: linking one
    `README` marked every other `README` in the vault as reached."""
    vault = tmp_path / "vault"
    (vault / "projects" / "alpha").mkdir(parents=True)
    (vault / "projects" / "beta").mkdir(parents=True)
    (vault / "Home.md").write_text("see [[projects/alpha/README]]\n", encoding="utf-8")
    (vault / "projects" / "alpha" / "README.md").write_text("back to [[Home]]\n", encoding="utf-8")
    (vault / "projects" / "beta" / "README.md").write_text("nothing links here\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "projects/beta/README.md" in orphans
    assert "projects/alpha/README.md" not in orphans


def test_obsidian_shortest_unique_path_link_still_resolves(tmp_path):
    """Obsidian accepts the shortest path that is unique, so `[[alpha/README]]`
    reaches `projects/alpha/README.md`. The fix matches a path-qualified link as
    a suffix on a component boundary rather than as an exact path, so narrowing
    the match does not turn working links into false orphans."""
    vault = tmp_path / "vault"
    (vault / "projects" / "alpha").mkdir(parents=True)
    (vault / "Home.md").write_text("see [[alpha/README]]\n", encoding="utf-8")
    (vault / "projects" / "alpha" / "README.md").write_text("back to [[Home]]\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "projects/alpha/README.md" not in orphans


def test_a_partial_path_does_not_match_mid_component(tmp_path):
    """The suffix match is on a `/` boundary: `[[eta/README]]` must not reach
    `projects/beta/README.md` just because the string ends that way."""
    vault = tmp_path / "vault"
    (vault / "projects" / "beta").mkdir(parents=True)
    (vault / "Home.md").write_text("see [[eta/README]]\n", encoding="utf-8")
    (vault / "projects" / "beta" / "README.md").write_text("back to [[Home]]\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "projects/beta/README.md" in orphans


# ── #290: macOS AppleDouble companions are not notes ─────────────────────────

def test_apple_double_companions_are_not_scanned_as_notes(tmp_path):
    """On a volume with no native extended attributes (exFAT, FAT32, many SMB
    shares) macOS writes a binary `._<name>` beside every file it touches.
    `rglob("*.md")` matched them, so each was parsed as a note and reported
    three times over - orphan, missing frontmatter, and same-title duplicate of
    the real note. On an exFAT vault they outnumbered the real findings, and no
    `.vault-config.json` key could suppress them (#290)."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "Alpha.md").write_text(
        "---\ntitle: Alpha\ntags: [test]\n---\nSee [[Beta]].\n", encoding="utf-8")
    (vault / "Beta.md").write_text(
        "---\ntitle: Beta\ntags: [test]\n---\nSee [[Alpha]].\n", encoding="utf-8")
    # What macOS actually writes: an AppleDouble header, not text.
    for name in ("._Alpha.md", "._Beta.md"):
        (vault / name).write_bytes(b"\x00\x05\x16\x07\x00\x02\x00\x00Mac OS X" + b"\x00" * 40)

    payload = _health(vault)
    assert payload["total_notes"] == 2, "the companions must not count as notes"
    assert payload["total_issues"] == 0, payload["issues"]


def test_a_dot_prefixed_note_is_not_scanned(tmp_path):
    """Dot-prefixed generally, not `._` specifically, because that is the rule
    Obsidian applies: it indexes no dot-prefixed file. Reporting on a file the
    user's own editor will not show them is noise either way."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "Real.md").write_text("---\ntitle: Real\n---\ncontent\n", encoding="utf-8")
    (vault / ".hidden.md").write_text("no frontmatter here\n", encoding="utf-8")

    payload = _health(vault)
    assert payload["total_notes"] == 1
    assert not [i for i in payload["issues"] if ".hidden" in str(i.get("files"))]


# ── #292: the dated-folder exemption knew only one of the two layouts ────────

def test_wiki_style_daily_notes_are_exempt_like_obsidian_style_ones(tmp_path):
    """The exemption read the TOP folder against Obsidian-style names, so a
    wiki-style daily note at `wiki/daily/YYYY-MM-DD.md` (top folder `wiki`) rang
    every day while `Daily/YYYY-MM-DD.md` next door did not. The same note was
    noise or not depending only on which documented layout its owner picked."""
    vault = tmp_path / "vault"
    (vault / "Daily").mkdir(parents=True)
    (vault / "wiki" / "daily").mkdir(parents=True)
    (vault / "Home.md").write_text("dashboard\n", encoding="utf-8")
    (vault / "Daily" / "2026-01-06.md").write_text("obsidian-style\n", encoding="utf-8")
    (vault / "wiki" / "daily" / "2026-01-07.md").write_text("wiki-style\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "wiki/daily/2026-01-07.md" not in orphans
    assert "Daily/2026-01-06.md" not in orphans


def test_the_operations_log_is_exempt_in_both_layouts(tmp_path):
    """`/obsidian-init` writes `Logs/YYYY-MM-DD.md` and nothing is meant to link
    it, but `Logs` was in neither layout's list, so it rang once a day forever."""
    vault = tmp_path / "vault"
    (vault / "Logs").mkdir(parents=True)
    (vault / "wiki" / "logs").mkdir(parents=True)
    (vault / "Home.md").write_text("dashboard\n", encoding="utf-8")
    (vault / "Logs" / "2026-01-08.md").write_text("ops log\n", encoding="utf-8")
    (vault / "wiki" / "logs" / "2026-01-09.md").write_text("ops log\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "Logs/2026-01-08.md" not in orphans
    assert "wiki/logs/2026-01-09.md" not in orphans


def test_a_slugged_exempt_folder_is_recognised(tmp_path):
    """Bootstrap writes a preset folder with no explicit mapping as a slug under
    `wiki/` (#287), so `Life Chapters/` becomes `wiki/life-chapters/`. The
    exemption reads the slug as its spaced form rather than missing it."""
    vault = tmp_path / "vault"
    (vault / "wiki" / "life-chapters").mkdir(parents=True)
    (vault / "Home.md").write_text("dashboard\n", encoding="utf-8")
    (vault / "wiki" / "life-chapters" / "2019.md").write_text("a chapter\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "wiki/life-chapters/2019.md" not in orphans


def test_the_exemption_is_casefolded(tmp_path):
    """The old set was spelled with capitals and compared without folding, so a
    vault whose folder is `daily/` got the noise a vault with `Daily/` did not."""
    vault = tmp_path / "vault"
    (vault / "daily").mkdir(parents=True)
    (vault / "Home.md").write_text("dashboard\n", encoding="utf-8")
    (vault / "daily" / "2026-01-10.md").write_text("lowercase folder\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "daily/2026-01-10.md" not in orphans


def test_a_real_wiki_note_is_still_orphan_checked(tmp_path):
    """The exemption must not swallow the whole `wiki/` tree: only the dated and
    machine-written folders under it are exempt, not projects or concepts."""
    vault = tmp_path / "vault"
    (vault / "wiki" / "projects").mkdir(parents=True)
    (vault / "Home.md").write_text("dashboard\n", encoding="utf-8")
    (vault / "wiki" / "projects" / "Tide.md").write_text("nothing links here\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "wiki/projects/Tide.md" in orphans


def test_a_root_note_named_like_an_exempt_folder_is_still_checked(tmp_path):
    """`Logs.md` at the vault root is a note, not the operations-log folder."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "Home.md").write_text("dashboard\n", encoding="utf-8")
    (vault / "Logs.md").write_text("nothing links here\n", encoding="utf-8")

    orphans = {i["files"][0] for i in _issues(_health(vault), "orphan")}
    assert "Logs.md" in orphans
