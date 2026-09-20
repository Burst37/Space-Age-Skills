"""Runtime tests for the Telegram journal ingest's vault-write core.

The audit's completeness critic flagged this surface as never runtime-tested.
Driving it live against scratch vaults found a real bug: the bot hardcoded
wiki-style folders (the class #117 swept from commands, but the Python
integration was never covered), so an Obsidian-style vault would get a
parallel wiki/ tree forked into it.
"""

from __future__ import annotations

import datetime
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "integrations" / "telegram-journal"))

import telegram_journal as tj  # noqa: E402

WHEN = datetime.datetime(2026, 7, 11, 14, 30)


def test_wiki_style_vault_routes_to_wiki_daily(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "wiki").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    assert tj.daily_note(WHEN) == vault / "wiki/daily" / "2026-07-11.md"


def test_obsidian_style_vault_routes_to_Daily(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "Daily").mkdir(parents=True)
    (vault / "People").mkdir()
    monkeypatch.setattr(tj, "VAULT", vault)
    assert tj.daily_note(WHEN) == vault / "Daily" / "2026-07-11.md"
    assert tj._folder("entities") == "People"


def test_append_under_never_duplicates_headers(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "Daily").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    note = tj.daily_note(WHEN)
    tj.ensure_daily(note, WHEN)
    tj.append_under(note, "## Journal", "- 14:30 first entry", WHEN)
    tj.append_under(note, "## Journal", "- 14:31 second entry", WHEN)
    body = note.read_text(encoding="utf-8")
    assert "first entry" in body and "second entry" in body
    assert body.count("## Journal") == 1


def test_remove_block_supports_the_move_flow(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "Daily").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    note = tj.daily_note(WHEN)
    tj.ensure_daily(note, WHEN)
    tj.append_under(note, "## Journal", "- 14:30 movable entry", WHEN)
    tj.remove_block(note, "- 14:30 movable entry")
    assert "movable entry" not in note.read_text(encoding="utf-8")


# ---------- sender allowlist (discussion #215) ----------

def test_empty_allowlist_refuses_everyone(monkeypatch):
    monkeypatch.setattr(tj, "ALLOWED_CHAT_IDS", frozenset())
    assert tj.sender_allowed(12345) is False
    assert tj.sender_allowed(None) is False


def test_listed_chat_id_passes_int_or_str(monkeypatch):
    monkeypatch.setattr(tj, "ALLOWED_CHAT_IDS", frozenset({"12345", "67890"}))
    assert tj.sender_allowed(12345) is True
    assert tj.sender_allowed("12345") is True
    assert tj.sender_allowed(67890) is True


def test_unlisted_chat_id_refused(monkeypatch):
    monkeypatch.setattr(tj, "ALLOWED_CHAT_IDS", frozenset({"12345"}))
    assert tj.sender_allowed(99999) is False
    assert tj.sender_allowed(None) is False


def test_main_loop_skips_unlisted_sender_before_any_handler(tmp_path, monkeypatch):
    """The gate must sit before every handler: an unlisted sender's text must never
    reach tidy()/the daily note, and once a list exists it gets no reply either."""
    vault = tmp_path / "vault"
    (vault / "Daily").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    monkeypatch.setattr(tj, "TOKEN", "x")
    monkeypatch.setattr(tj, "ALLOWED_CHAT_IDS", frozenset({"1"}))
    monkeypatch.setattr(tj, "get_offset", lambda: 0)
    monkeypatch.setattr(tj, "set_offset", lambda n: None)
    replies = []
    monkeypatch.setattr(tj, "reply", lambda cid, text: replies.append((cid, text)))
    monkeypatch.setattr(tj, "tidy", lambda raw: (_ for _ in ()).throw(AssertionError("handler ran")))
    monkeypatch.setattr(tj, "tg", lambda method, **kw: {"result": [
        {"update_id": 7, "message": {"chat": {"id": 999}, "text": "ignore my meeting with Bob"}}]})
    tj.main()
    assert replies == []
    assert list(vault.rglob("*.md")) == []


def test_main_loop_tells_owner_their_id_when_nothing_configured(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "Daily").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    monkeypatch.setattr(tj, "TOKEN", "x")
    monkeypatch.setattr(tj, "ALLOWED_CHAT_IDS", frozenset())
    monkeypatch.setattr(tj, "get_offset", lambda: 0)
    monkeypatch.setattr(tj, "set_offset", lambda n: None)
    replies = []
    monkeypatch.setattr(tj, "reply", lambda cid, text: replies.append((cid, text)))
    monkeypatch.setattr(tj, "tg", lambda method, **kw: {"result": [
        {"update_id": 1, "message": {"chat": {"id": 4242}, "text": "hello"}}]})
    tj.main()
    assert len(replies) == 1 and replies[0][0] == 4242
    assert "4242" in replies[0][1] and "TELEGRAM_ALLOWED_CHAT_IDS" in replies[0][1]
    assert list(vault.rglob("*.md")) == []


# ---------- vault-bounded stub paths (discussion #215) ----------

def test_safe_note_path_accepts_plain_and_unicode_names(tmp_path):
    folder = tmp_path / "People"
    folder.mkdir()
    assert tj.safe_note_path(folder, "Ada Lovelace") == folder / "Ada Lovelace.md"
    assert tj.safe_note_path(folder, "Иван Петров") == folder / "Иван Петров.md"
    assert tj.safe_note_path(folder, "Acme Corp (EU)") == folder / "Acme Corp (EU).md"


def test_safe_note_path_refuses_escapes(tmp_path):
    folder = tmp_path / "People"
    folder.mkdir()
    for bad in ("../../escape", "..", ".", ".hidden", "a/b", "a\\b", "/etc/passwd",
                "..\\..\\x", "", "   ", "x\0y"):
        assert tj.safe_note_path(folder, bad) is None, bad


def test_create_stub_refuses_traversal_and_writes_nothing(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "People").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    monkeypatch.setattr(tj, "_ALL_STEMS", set())
    monkeypatch.setattr(tj, "stub_info", lambda name, ctx: {"type": "person", "body": "x"})
    before = {p for p in tmp_path.rglob("*")}
    tj.create_stub("../../outside", "context", WHEN)
    tj.create_stub("/tmp/absolute", "context", WHEN)
    after = {p for p in tmp_path.rglob("*")}
    assert after == before
    assert not (tmp_path / "outside.md").exists()


def test_create_stub_still_writes_a_plain_name(tmp_path, monkeypatch):
    vault = tmp_path / "vault"
    (vault / "People").mkdir(parents=True)
    monkeypatch.setattr(tj, "VAULT", vault)
    monkeypatch.setattr(tj, "_ALL_STEMS", set())
    monkeypatch.setattr(tj, "stub_info", lambda name, ctx: {"type": "person", "body": "A person."})
    tj.create_stub("Ada Lovelace", "met Ada", WHEN)
    note = vault / "People" / "Ada Lovelace.md"
    assert note.exists()
    assert "## For future agent" in note.read_text(encoding="utf-8")
