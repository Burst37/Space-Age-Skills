"""Offline coverage for the podcast resolution and summarizer-provider layers.

Companion to test_groq.py (transcription fallback). This file covers:

- podcast.resolve_apple_to_rss: the 3-tuple contract, episode-title resolution
  via the entity=podcastEpisode iTunes lookup, and best-effort degradation
  when that lookup fails (must never raise).
- podcast._pick_entry: title-based matching used when Apple's ?i= trackId
  (which never appears in RSS guids) cannot match by id.
- podcast_extract.main's summarizer selection: Gemini-first when GEMINI_API_KEY
  is set, transparent Grok fallback on any Gemini failure, Grok-only when no
  Gemini key - mirroring youtube_extract.py's pattern.

No network: every iTunes lookup runs against a real local http.server thread
(consistent with test_groq.py's real-socket approach), providers are
monkeypatched at the module attributes the code actually resolves through.
"""

from __future__ import annotations

import os

import pytest

# Must run before the imports below (same CI-collection rationale as
# test_groq.py: config.py raises SystemExit at import when the vault path is
# unset, which would kill the whole suite during collection).
os.environ.setdefault("OBSIDIAN_VAULT_PATH", "/nonexistent/vault-for-tests")

from scripts.research import podcast_extract  # noqa: E402
from scripts.research.lib import podcast as podcast_lib  # noqa: E402

pe = podcast_extract


# ---------------------------------------------------------------------------
# Local fake iTunes lookup server
# ---------------------------------------------------------------------------


class _FakeiTunesServer:
    """Stand-in for itunes.apple.com/lookup. Real sockets, offline, threaded.

    Serves per-entity JSON bodies (show vs podcastEpisode lookups), records
    query params per request so tests can assert which entity= was queried.
    """

    def __init__(self, show_body: str, episode_body: str | None = None):
        import threading
        from http.server import BaseHTTPRequestHandler, HTTPServer
        from urllib.parse import parse_qs, urlparse

        holder = self
        self.requests_seen: list[dict[str, str]] = []
        self.show_payload = show_body.encode()
        self.episode_payload = (episode_body or show_body).encode()

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self) -> None:
                qs = parse_qs(urlparse(self.path).query)
                holder.requests_seen.append(
                    {k: v[0] for k, v in qs.items() if v}
                )
                entity = qs.get("entity", [""])[0]
                payload = (
                    holder.episode_payload if entity == "podcastEpisode" else holder.show_payload
                )
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)

            def log_message(self, *args) -> None:  # silence test noise
                pass

        self._server = HTTPServer(("127.0.0.1", 0), Handler)
        self.url = f"http://127.0.0.1:{self._server.server_address[1]}/lookup"
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._server.shutdown()
        self._server.server_close()


@pytest.fixture
def fake_itunes(monkeypatch: pytest.MonkeyPatch):
    """Patch ITUNES_LOOKUP to a local fake server. Usage: fake_itunes(show_body, episode_body)."""
    holder: dict[str, object] = {}

    def _install(show_body: str, episode_body: str | None = None) -> _FakeiTunesServer:
        server = _FakeiTunesServer(show_body, episode_body)
        holder["server"] = server
        monkeypatch.setattr(podcast_lib, "ITUNES_LOOKUP", server.url)
        return server

    yield _install
    server = holder.get("server")
    if isinstance(server, _FakeiTunesServer):
        server.stop()


_SHOW_LOOKUP = (
    '{"results": [{"wrapperType": "track", "kind": "podcast", '
    '"collectionName": "Darknet Diaries", "feedUrl": "https://feed.example/rss"}]}'
)
_EPISODE_LOOKUP = (
    '{"results": ['
    '{"wrapperType": "podcastEpisode", "trackId": 1000779118458, "trackName": "178: Ubiquiti", "episodeUrl": "https://x/ep1"},'
    '{"wrapperType": "podcastEpisode", "trackId": 999, "trackName": "177: National Public Data"}'
    "]}"
)


# ---------------------------------------------------------------------------
# resolve_apple_to_rss: 3-tuple contract
# ---------------------------------------------------------------------------


def test_resolve_apple_no_episode_id_returns_none_title(fake_itunes):
    fake_itunes(_SHOW_LOOKUP)
    feed, ep_id, title = podcast_lib.resolve_apple_to_rss(
        "https://podcasts.apple.com/us/podcast/darknet-diaries/id1296350485"
    )
    assert feed == "https://feed.example/rss"
    assert ep_id is None
    assert title is None


def test_resolve_apple_with_episode_id_resolves_title(fake_itunes):
    server = fake_itunes(_SHOW_LOOKUP, _EPISODE_LOOKUP)
    feed, ep_id, title = podcast_lib.resolve_apple_to_rss(
        "https://podcasts.apple.com/us/podcast/ubiquiti/id1296350485?i=1000779118458"
    )
    assert feed == "https://feed.example/rss"
    assert ep_id == "1000779118458"
    assert title == "178: Ubiquiti"
    # The episode lookup must use entity=podcastEpisode (that is the whole fix).
    entities = {r.get("entity") for r in server.requests_seen}
    assert "podcastEpisode" in entities


def test_resolve_apple_unknown_track_id_gives_title_none(fake_itunes):
    fake_itunes(_SHOW_LOOKUP, _EPISODE_LOOKUP)
    _, ep_id, title = podcast_lib.resolve_apple_to_rss(
        "https://podcasts.apple.com/us/podcast/x/id1296350485?i=424242"
    )
    assert ep_id == "424242"
    assert title is None


def test_resolve_apple_episode_lookup_failure_never_raises(fake_itunes, monkeypatch):
    fake_itunes(_SHOW_LOOKUP)

    def boom(*a, **k):
        raise OSError("connection reset")

    import requests

    monkeypatch.setattr(requests, "get", _wrap_first_call(requests.get, boom))
    feed, ep_id, title = podcast_lib.resolve_apple_to_rss(
        "https://podcasts.apple.com/us/podcast/x/id1296350485?i=1000779118458"
    )
    # Show-level resolution succeeded; title is best-effort None.
    assert feed == "https://feed.example/rss"
    assert ep_id == "1000779118458"
    assert title is None


def _wrap_first_call(real_get, boom):
    """Make only the SECOND requests.get call fail (first = show lookup)."""

    def wrapped(*args, **kwargs):
        if not wrapped.called:  # type: ignore[attr-defined]
            wrapped.called = True  # type: ignore[attr-defined]
            return real_get(*args, **kwargs)
        return boom(*args, **kwargs)

    wrapped.called = False  # type: ignore[attr-defined]
    return wrapped


def test_resolve_apple_unrecognizable_url_raises():
    with pytest.raises(ValueError, match="Not a recognizable Apple Podcasts URL"):
        podcast_lib.resolve_apple_to_rss("https://example.com/not-a-show")


# ---------------------------------------------------------------------------
# _pick_entry: title matching after failed id match
# ---------------------------------------------------------------------------


class _Entry:
    def __init__(self, guid: str, title: str):
        self._d = {"id": guid, "title": title}

    def get(self, key, default=None):
        return self._d.get(key, default)


def _entries() -> list[_Entry]:
    return [
        _Entry("prx_1_aaa", "180: Latest Episode"),
        _Entry("prx_7057_e5c784a5", "178: Ubiquiti"),
        _Entry("prx_2_bbb", "179: National Public Data"),
    ]


def _no_id_found_msg(capsys):
    captured = capsys.readouterr()
    return "not found in feed" in captured.err


def test_pick_entry_by_id_endswith():
    entry = podcast_lib._pick_entry(_entries(), "e5c784a5")
    assert entry.get("title") == "178: Ubiquiti"


def test_pick_entry_falls_to_title_when_id_missing(capsys):
    # Apple's trackId matches nothing in RSS guids -> title path must rescue.
    entry = podcast_lib._pick_entry(_entries(), "1000779118458", "Ubiquiti")
    assert entry is not None
    assert entry.get("title") == "178: Ubiquiti"
    assert _no_id_found_msg(capsys)  # the misleading-but-expected warning


def test_pick_entry_title_exact_norm_match():
    entry = podcast_lib._pick_entry(_entries(), None, "178: UBIQUITI!")
    assert entry.get("title") == "178: Ubiquiti"


def test_pick_entry_no_match_returns_most_recent():
    entry = podcast_lib._pick_entry(_entries(), "gone", "nonexistent episode")
    assert entry.get("title") == "180: Latest Episode"


# ---------------------------------------------------------------------------
# podcast_extract summarizer selection: Gemini-first, Grok fallback
# ---------------------------------------------------------------------------


def _patch_summarizer_paths(monkeypatch, calls):
    """Drive main() to the summarizer choice without any real I/O."""
    episode = {
        "show_title": "Darknet Diaries",
        "show_author": "Jack Rhysider",
        "episode_title": "178: Ubiquiti",
        "published": "Tue, 04 Aug 2026",
        "duration": "36:07",
        "episode_url": "https://darknetdiaries.com/episode/178/",
        "source_url": "https://feed.example/?episode=x",
        "audio_url": "http://x/audio.mp3",
        "show_notes": "notes body text",
        "transcript_url": None,
    }
    monkeypatch.setattr(pe.podcast, "resolve_input", lambda s: episode)

    def fake_transcript(ep):
        return "T" * 500, "groq-whisper-api"

    monkeypatch.setattr(pe, "_resolve_transcript", fake_transcript)

    def fake_gemini_call(prompt, *, command, model=None, max_output_tokens=4000):
        calls["gemini"] += 1
        if calls.get("gemini_raise"):
            raise RuntimeError("gemini boom")
        return {"text": "GEMINI SUMMARY", "cost_usd": 0.0}

    def fake_grok_call(prompt, *, command, model=None, tools=None, max_output_tokens=4000):
        calls["grok"] += 1
        return {"text": "GROK SUMMARY", "cost_usd": 0.0}

    monkeypatch.setattr(pe.grok, "call", fake_grok_call)

    import scripts.research.lib.gemini as gemini_mod

    monkeypatch.setattr(gemini_mod, "call", fake_gemini_call)

    def fake_write_note(kind, title, fm, body):
        from pathlib import Path

        return Path(f"/fake/vault/{kind}/{title}.md")

    monkeypatch.setattr(pe.vault, "write_note", fake_write_note)
    monkeypatch.setattr(pe.vault, "print_save_links", lambda path: None)
    monkeypatch.setattr(pe.vault, "append_to_log", lambda line: None)


def test_summary_gemini_used_when_key_set(monkeypatch):
    calls = {"gemini": 0, "gemini_raise": False, "grok": 0}
    _patch_summarizer_paths(monkeypatch, calls)
    monkeypatch.setenv("GEMINI_API_KEY", "fake-key")
    rc = pe.main(["prog", "https://feed.example/?episode=x"])
    assert rc == 0
    assert calls["gemini"] == 1
    assert calls["grok"] == 0


def test_summary_falls_to_grok_when_gemini_raises(monkeypatch):
    calls = {"gemini": 0, "gemini_raise": True, "grok": 0}
    _patch_summarizer_paths(monkeypatch, calls)
    monkeypatch.setenv("GEMINI_API_KEY", "fake-key")
    rc = pe.main(["prog", "https://feed.example/?episode=x"])
    assert rc == 0
    assert calls["gemini"] == 1
    assert calls["grok"] == 1


def test_summary_grok_only_without_gemini_key(monkeypatch):
    calls = {"gemini": 0, "gemini_raise": False, "grok": 0}
    _patch_summarizer_paths(monkeypatch, calls)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    rc = pe.main(["prog", "https://feed.example/?episode=x"])
    assert rc == 0
    assert calls["gemini"] == 0
    assert calls["grok"] == 1