"""Lost updates between two writers against one vault (#217).

A multi-adapter vault is the project's own shipped shape: seven platform builds,
a background agent on a schedule, and interactive sessions, all pointed at one
directory - often a LiveSync-replicated one, so a third device's edit lands as a
local file change too.

Every write path reads a note, transforms the text, and writes it back, and the
gap between the read and the write is where a second writer's change was lost:
both writes succeeded, the second one won, and nothing said so. The issue
proposed a lock around the write. The write was never the race - write_exact has
been atomic since it was introduced - and a lock could not cover a sync client's
write at all, because that write holds no lock this process could take.

What is pinned here: the guarded write refuses instead of overwriting, every
read-modify-write caller uses it, and the MCP server's copy of the rule does not
drift from the scripts' one.
"""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "scripts"))
sys.path.insert(0, str(REPO_ROOT / "integrations" / "obsidian-mcp-server"))

import note_io  # noqa: E402

NOTE = "---\ntype: note\ndate: 2026-09-13\ntags: [a]\nai-first: true\n---\n\n## For future agent\nbody\n"


# --- the guarded write -------------------------------------------------------

def test_an_untouched_note_is_rewritten(tmp_path):
    note = tmp_path / "n.md"
    note.write_text(NOTE, encoding="utf-8")
    note_io.write_exact_if_unchanged(note, NOTE + "mine\n", NOTE)
    assert note.read_text(encoding="utf-8").endswith("mine\n")


def test_a_note_edited_since_the_read_is_refused(tmp_path):
    """The whole bug in four lines: read, someone else writes, we write."""
    note = tmp_path / "n.md"
    note.write_text(NOTE, encoding="utf-8")
    original = note_io.read_exact(note)

    note.write_text(NOTE + "theirs\n", encoding="utf-8")  # the other writer

    with pytest.raises(note_io.NoteChangedError) as err:
        note_io.write_exact_if_unchanged(note, original + "mine\n", original)
    assert err.value.path == note
    assert note.read_text(encoding="utf-8").endswith("theirs\n"), (
        "the other writer's change was overwritten anyway"
    )


def test_expected_none_means_the_note_must_not_exist_yet(tmp_path):
    note = tmp_path / "new.md"
    note_io.write_exact_if_unchanged(note, NOTE, None)
    assert note.read_text(encoding="utf-8") == NOTE
    with pytest.raises(note_io.NoteChangedError):
        note_io.write_exact_if_unchanged(note, "second\n", None)


def test_a_non_utf8_file_is_never_mistaken_for_an_absent_one(tmp_path):
    """read_exact returns None for undecodable bytes as well as for nothing at
    all. Conflating the two would let the guarded write clobber the one class of
    file this module exists to refuse to rewrite."""
    note = tmp_path / "cp1252.md"
    note.write_bytes(b"\xff\xfe not utf-8 at all\n")
    with pytest.raises(note_io.NoteChangedError):
        note_io.write_exact_if_unchanged(note, "replacement\n", None)
    assert note.read_bytes() == b"\xff\xfe not utf-8 at all\n"


def test_a_second_process_that_edits_during_the_gap_is_not_overwritten(tmp_path):
    """End to end, in a real second process, over the gap that actually loses data.

    The worker reads the note and then waits, standing in for the seconds or
    minutes an agent spends between reading a note and writing it back. This
    process completes a whole edit inside that window. The worker must then
    refuse, leaving the edit it would have discarded on disk.

    The microsecond window between the guard's own check and its rename is not
    closed by this design and is not tested as if it were; see
    note_io.write_exact_if_unchanged.
    """
    note = tmp_path / "contested.md"
    note.write_text(NOTE, encoding="utf-8")
    read_done = tmp_path / "read-done"
    go = tmp_path / "go"

    worker = tmp_path / "worker.py"
    worker.write_text(
        "import sys, time\n"
        f"sys.path.insert(0, {str(REPO_ROOT / 'scripts')!r})\n"
        "from pathlib import Path\n"
        "import note_io\n"
        "note, read_done, go = (Path(a) for a in sys.argv[1:4])\n"
        "original = note_io.read_exact(note)\n"
        "read_done.write_text('ok')\n"
        "while not go.exists():\n"
        "    time.sleep(0.01)\n"
        "try:\n"
        "    note_io.write_exact_if_unchanged(note, original + 'worker' + chr(10), original)\n"
        "    print('WROTE')\n"
        "except note_io.NoteChangedError:\n"
        "    print('REFUSED')\n",
        encoding="utf-8",
    )

    proc = subprocess.Popen(
        [sys.executable, str(worker), str(note), str(read_done), str(go)],
        stdout=subprocess.PIPE, text=True,
    )
    try:
        deadline = time.time() + 30
        while not read_done.exists():
            assert time.time() < deadline, "the worker never got as far as reading the note"
            time.sleep(0.01)

        # The other writer, complete: read, transform, write, all while the
        # worker holds a copy of the old bytes.
        theirs = note_io.read_exact(note)
        note_io.write_exact_if_unchanged(note, theirs + "theirs\n", theirs)

        go.write_text("ok")
        out = proc.communicate(timeout=30)[0].strip()
    finally:
        proc.kill()

    assert out == "REFUSED", f"the worker overwrote an edit made while it was thinking: {out!r}"
    body = note.read_text(encoding="utf-8")
    assert body.endswith("theirs\n") and "worker" not in body


# --- every read-modify-write caller goes through it --------------------------

@pytest.mark.parametrize("rel", [
    "scripts/heal_links.py",
    "scripts/triage_links.py",
    "scripts/merge_notes.py",
])
def test_the_rewriting_scripts_do_not_call_the_unguarded_writer(rel):
    """These three read a note, transform it, and write it back, which is the
    shape that loses an edit. A bare write_exact call in one of them is that
    bug reintroduced."""
    src = (REPO_ROOT / rel).read_text(encoding="utf-8")
    assert "write_exact_if_unchanged" in src, f"{rel} does not use the guarded write"
    bare = [
        ln.strip() for ln in src.splitlines()
        if "write_exact(" in ln and "write_exact_if_unchanged" not in ln and not ln.strip().startswith("#")
    ]
    assert not bare, f"{rel} still writes without the guard: {bare}"


def test_the_mcp_editing_tools_check_before_they_write():
    """update_note and replace_text read, build a new note, and write. Two
    overlapping calls both read the old text and both writes used to succeed."""
    src = (REPO_ROOT / "integrations" / "obsidian-mcp-server" / "vault_ops.py").read_text(
        encoding="utf-8"
    )
    for fn in ("def update_note", "def replace_text"):
        start = src.index(fn)
        body = src[start:src.index("\n\ndef ", start + 1)]
        assert "_unchanged_since" in body, f"{fn[4:]} writes without checking for a concurrent edit"
        assert "_NOTE_CHANGED_HINT" in body, f"{fn[4:]} reports a conflict without saying what to do"


def test_the_servers_copy_of_the_rule_matches_the_scripts_one():
    """vault_ops ships standalone and must not import from scripts/, so the
    refusal exists twice. Both must say the same thing to the user, the way
    _SKIP_DIRS is pinned against vault_scan."""
    import note_io as scripts_side
    import vault_ops as server_side

    hint = server_side._NOTE_CHANGED_HINT
    message = str(scripts_side.NoteChangedError(Path("x.md")))
    for phrase in ("changed on disk", "refusing to overwrite", "scheduled agent",
                   "second session", "sync client"):
        assert phrase in hint, f"the server's message dropped {phrase!r}"
        assert phrase in message, f"the scripts' message dropped {phrase!r}"
