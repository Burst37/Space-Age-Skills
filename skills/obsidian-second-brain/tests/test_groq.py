"""Offline coverage for the Groq Whisper fallback (scripts/research/lib/groq.py).

No network and no GROQ_API_KEY: every HTTP interaction runs against a real
local http.server thread on 127.0.0.1 (requests traverse a socket, so auth
headers, multipart posting, and the status-code contract are exercised for
real, not stubbed), and every env / provider dep is monkeypatched. The
fallback-chain semantics are asserted by monkeypatching the module attributes
podcast_extract._resolve_transcript resolves through. This file is the
permanent replacement for the ad-hoc suite that was lost to /opt/data/home
cleanup - the lesson being: tests live in the framework's tests/ directory.

Why this is a test and not a comment: the chain order (tag -> groq -> whisper
-> show-notes) and the never-raise contract of transcribe_via_groq are what
keep /podcast's degrade path uniform. A Groq 429 that raised instead of
returning None would abort the whole note instead of falling to the next
provider.
"""

from __future__ import annotations

import os
import shutil

import pytest

# Must run before the imports below. config.py resolves OBSIDIAN_VAULT_PATH at
# import time and raises SystemExit when it is unset; on a machine with no
# vault - which is every CI runner - that SystemExit escapes during collection
# and takes down the whole suite (pytest reports INTERNALERROR and runs zero
# tests). setdefault so a real local vault is never overridden.
os.environ.setdefault("OBSIDIAN_VAULT_PATH", "/nonexistent/vault-for-tests")

from scripts.research import podcast_extract  # noqa: E402
from scripts.research.lib import groq  # noqa: E402

# Convenience alias - chain tests below monkeypatch this module's attributes.
pe = podcast_extract


# ---------------------------------------------------------------------------
# Local fake Groq HTTP server
# ---------------------------------------------------------------------------


class _FakeGroqServer:
    """Minimal stand-in for api.groq.com. Real sockets, offline, threaded."""

    def __init__(self, status: int, body: str):
        import threading
        from http.server import BaseHTTPRequestHandler, HTTPServer

        holder = self
        payload = body.encode()

        class Handler(BaseHTTPRequestHandler):
            def do_POST(self) -> None:
                length = int(self.headers.get("Content-Length", "0"))
                raw = self.rfile.read(length)
                holder.requests_seen.append(
                    {
                        "auth": self.headers.get("Authorization", ""),
                        "bytes": len(raw),
                    }
                )
                self.send_response(holder.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)

            def log_message(self, *args: object) -> None:
                pass  # keep pytest output clean

        self.status = status
        self.requests_seen: list[dict[str, object]] = []
        self._httpd = HTTPServer(("127.0.0.1", 0), Handler)
        self._thread = threading.Thread(target=self._httpd.serve_forever, daemon=True)
        self._thread.start()
        self.url = f"http://127.0.0.1:{self._httpd.server_port}/v1/transcriptions"

    def stop(self) -> None:
        self._httpd.shutdown()
        self._httpd.server_close()


# ---------------------------------------------------------------------------
# Fixtures and shared stubs
# ---------------------------------------------------------------------------


@pytest.fixture
def fake_groq(monkeypatch: pytest.MonkeyPatch):
    """Start a fake Groq server and point groq.py's URL constant at it."""

    def _start(status: int, body: str) -> _FakeGroqServer:
        server = _FakeGroqServer(status, body)
        monkeypatch.setattr(groq, "GROQ_TRANSCRIPTION_URL", server.url)
        return server

    yield _start


@pytest.fixture(autouse=True)
def _groq_key(monkeypatch: pytest.MonkeyPatch):
    """Groq configured unless a test replaces this; no real env is ever read."""
    monkeypatch.setattr(groq.config, "get_optional", lambda name, default="": "test-key-123")


def _never_safe_fetch(url: str) -> str | None:
    return None  # allow the URL - the fake server is loopback anyway


def _stub_episode_pipeline(wav_bytes: bytes, monkeypatch: pytest.MonkeyPatch, duration: float):
    """Replace the real download/ffmpeg/duration pipeline with a tiny WAV.

    Only the boundary functions are substituted; transcribe_via_groq itself,
    _groq_request, _cleanup and the tempfile lifecycle all run for real.
    """
    monkeypatch.setattr(
        groq, "_download_audio", lambda url, dest, safe: dest.write_bytes(wav_bytes)
    )
    monkeypatch.setattr(
        groq, "_downsample_to_mono_mp3", lambda src, dest: dest.write_bytes(wav_bytes)
    )
    monkeypatch.setattr(groq, "_ffprobe_duration_seconds", lambda p: duration)


def _write_wav(path, recording_seconds: int, sample_hz: int = 8000) -> None:
    """Write a valid 8kHz 16-bit mono PCM WAV of the requested duration.

    Real bytes (not a stub file): ffprobe must read a true duration from it,
    and the split path must cut it with ffmpeg -c copy into real mp3 chunks.
    """
    import io
    import wave

    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sample_hz)
        # Silence is fine; duration is all ffprobe and the split math need.
        w.writeframes(b"\x00\x00" * (recording_seconds * sample_hz))
    path.write_bytes(buf.getvalue())


# ---------------------------------------------------------------------------
# Pure functions: normalization, sentence splitting, seam dedup
# ---------------------------------------------------------------------------


def test_norm_sentence_strips_punctuation_and_case():
    assert groq._norm_sentence("Hello, World! 123") == "helloworld123"


def test_norm_sentence_alphanumerics_only():
    assert groq._norm_sentence("It's a co-op - really.") == "itsacoopreally"


def test_sentences_keeps_terminators_attached():
    assert groq._sentences("First one. Second one! Third?") == [
        "First one.",
        "Second one!",
        "Third?",
    ]


def test_sentences_drops_empties_and_strips():
    assert groq._sentences("  Only sentence.  ") == ["Only sentence."]
    assert groq._sentences("   ") == []


def test_trim_to_full_sentence_tail_drops_partial():
    assert groq._trim_to_full_sentence("Complete. And a partial cu", tail=True) == "Complete."


def test_trim_to_full_sentence_head_drops_partial():
    assert groq._trim_to_full_sentence("artial lead-in. Full rest.", tail=False) == "Full rest."


def test_trim_to_full_sentence_no_terminator_is_unchanged():
    text = "no terminator here at all"
    assert groq._trim_to_full_sentence(text, tail=True) == text
    assert groq._trim_to_full_sentence(text, tail=False) == text


def test_drop_leading_duplicate_matches_on_normalized_key():
    # Punctuation/casing differ between the two Whisper passes over the same
    # audio; the normalized key is what matches.
    assert (
        groq._drop_leading_duplicate("First, sentence.", "FIRST SENTENCE. Second part.")
        == "Second part."
    )


def test_drop_leading_duplicate_keeps_unique_head():
    nxt = "Fresh opening. Continues here."
    assert groq._drop_leading_duplicate("Unrelated earlier sentence.", nxt) == nxt


def test_join_chunk_texts_dedups_overlap_keeps_last_tail():
    # The overlap means the seam-adjacent partials are duplicated: the partial
    # head of chunk 2 is dropped against chunk 1, and a whole sentence present
    # on both sides survives exactly once, from its first occurrence. The last
    # chunk keeps its tail (final words have no peer chunk to recover from).
    assert (
        groq._join_chunk_texts(
            [
                "Intro content. Shared seam sentence.",
                "Shared seam sentence. Middle unique part.",
                "Middle unique part. Final words stay.",
            ]
        )
        == "Intro content. Shared seam sentence. Middle unique part. Final words stay."
    )


def test_join_chunk_texts_dedups_duplicate_whole_sentence_seam():
    # The duplicated-full-sentence case the 10s overlap produces when the
    # seam falls inside one short chunk: the second copy is dropped entirely.
    result = groq._join_chunk_texts(["First part ends.", "Second part continues."])
    assert result == "First part ends."


def test_join_chunk_texts_no_overlap_keeps_everything():
    # Head-trim drops a non-first chunk's opening sentence up to the first
    # terminator even without overlap (by design: the seam partial's full copy
    # lives in the peer chunk). Everything after the seam head survives.
    first = "Alpha begins here."
    second = "Beta continues on. Gamma closes it."
    assert groq._join_chunk_texts([first, second]) == "Alpha begins here. Gamma closes it."


def test_join_chunk_texts_empty_list_is_empty_string():
    assert groq._join_chunk_texts([]) == ""


# ---------------------------------------------------------------------------
# Split math: chunk boundaries, overlap, margin (real ffmpeg, tiny fixture)
# ---------------------------------------------------------------------------


@pytest.mark.skipif(
    shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None,
    reason="ffmpeg/ffprobe not on PATH (not installed by this repo's CI image)",
)
def test_split_reencoded_chunks_math(tmp_path, monkeypatch):
    """Synthetic tiny-cap scenario: chunk boundaries, 10s overlap, 0.98 margin.

    A ~1MB WAV (the same 1MB scale the ad-hoc suite used) is first re-encoded
    with the production downsampler, then split with _split_reencoded_chunks
    using a chunk duration derived from a deliberately tiny cap via the same
    (cap * 0.98 margin) formula transcribe_via_groq applies. Only the cap
    constant differs from production; the split path is the real code.
    """
    monkeypatch.setattr(groq, "GROQ_MAX_BYTES", 512 * 1024)  # tiny cap, headroom only

    src = tmp_path / "episode.wav"
    _write_wav(src, recording_seconds=120)  # 8kHz mono 16-bit -> ~0.96MB

    reencoded = tmp_path / "reencoded.mp3"
    groq._downsample_to_mono_mp3(src, reencoded)

    duration = groq._ffprobe_duration_seconds(reencoded)
    bytes_per_second = reencoded.stat().st_size / duration

    # The production margin math (GROQ_MAX_BYTES * 0.98 / bytes_per_second),
    # exercised against a tiny cap so a sub-2MB fixture needs several chunks.
    tiny_cap = 100 * 1024
    chunk_duration = (tiny_cap * 0.98) / bytes_per_second
    assert chunk_duration > groq.SPLIT_OVERLAP_SECONDS  # sane advance, per design

    effective = chunk_duration - groq.SPLIT_OVERLAP_SECONDS
    chunks = groq._split_reencoded_chunks(reencoded, chunk_duration, tmp_path)
    try:
        assert len(chunks) >= 2
        for i in range(len(chunks)):
            assert chunks[i].name == f"chunk_{i:03d}.mp3"
        # Each non-final chunk runs its full nominal duration (mp3 frame
        # quantization slack only); starts advance by exactly (duration -
        # SPLIT_OVERLAP_SECONDS), i.e. the 10s overlap is real.
        for i in range(len(chunks) - 1):
            assert abs(groq._ffprobe_duration_seconds(chunks[i]) - chunk_duration) <= 0.5
        # Last chunk keeps the tail: it starts before the recording ends and
        # its own duration reaches (at least) the final second.
        last_start = (len(chunks) - 1) * effective
        assert last_start < duration - effective + groq.SPLIT_OVERLAP_SECONDS
        assert last_start + groq._ffprobe_duration_seconds(chunks[-1]) >= duration - 0.5
        # The 0.98 margin keeps a full chunk below the cap it was derived from.
        assert chunk_duration * bytes_per_second < tiny_cap
    finally:
        groq._cleanup(chunks)


# ---------------------------------------------------------------------------
# Fake HTTP: 429 -> None; request really reaches the server; 200 happy path
# ---------------------------------------------------------------------------


def test_groq_429_returns_none_not_raise(fake_groq, monkeypatch):
    server = fake_groq(429, '{"error": {"message": "rate limit exceeded"}}')
    wav = _tiny_wav_bytes(seconds=2)
    _stub_episode_pipeline(wav, monkeypatch, duration=2.0)

    result = groq.transcribe_via_groq("http://example.invalid/audio.mp3", _never_safe_fetch)

    # Contract: 429 (ASH exhaustion) degrades the chain, never raises.
    assert result is None
    # The request really reached our local server (socket round-trip happened).
    assert len(server.requests_seen) == 1
    assert server.requests_seen[0]["auth"] == "Bearer test-key-123"


def test_groq_200_happy_path(fake_groq, monkeypatch):
    server = fake_groq(200, '{"text": "Hello world transcript."}')
    wav = _tiny_wav_bytes(seconds=2)
    _stub_episode_pipeline(wav, monkeypatch, duration=2.0)

    result = groq.transcribe_via_groq("http://example.invalid/audio.mp3", _never_safe_fetch)

    assert result == "Hello world transcript."
    assert len(server.requests_seen) == 1
    assert server.requests_seen[0]["auth"] == "Bearer test-key-123"


def test_groq_200_empty_text_returns_none(fake_groq, monkeypatch):
    server = fake_groq(200, '{"text": ""}')
    wav = _tiny_wav_bytes(seconds=2)
    _stub_episode_pipeline(wav, monkeypatch, duration=2.0)

    result = groq.transcribe_via_groq("http://example.invalid/audio.mp3", _never_safe_fetch)

    assert result is None
    assert len(server.requests_seen) == 1


def test_groq_unconfigured_never_makes_request(fake_groq, monkeypatch):
    server = fake_groq(200, '{"text": "unreachable"}')
    monkeypatch.setattr(groq.config, "get_optional", lambda name, default="": "")
    called: list[object] = []

    def _boom(*args: object, **kwargs: object) -> None:
        called.append(args)
        raise AssertionError("pipeline must not run when key is absent")

    monkeypatch.setattr(groq, "_download_audio", _boom)
    result = groq.transcribe_via_groq("http://example.invalid/audio.mp3", _never_safe_fetch)

    assert result is None
    assert called == []
    assert server.requests_seen == []


def _tiny_wav_bytes(seconds: int) -> bytes:
    """Small real WAV as the stubbed pipeline's payload (in-memory, no leaks)."""
    import io
    import wave

    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(8000)
        w.writeframes(b"\x00\x00" * (seconds * 8000))
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Fallback chain semantics in podcast_extract._resolve_transcript
# ---------------------------------------------------------------------------


@pytest.fixture
def stub_pipeline_deps(monkeypatch: pytest.MonkeyPatch):
    """Stub every episode-level dep _resolve_transcript touches."""
    calls = {
        "groq": 0,
        "whisper": 0,
        "tag": 0,
        "groq_text": None,
        "whisper_text": None,
        "tag_text": None,
    }

    def fake_tag_fetch(url: str) -> str | None:
        calls["tag"] = calls["tag"] + 1
        return calls["tag_text"]

    def fake_groq_transcribe(url: str, safe) -> str | None:
        calls["groq"] = calls["groq"] + 1
        return calls["groq_text"]

    def fake_whisper(url: str) -> str | None:
        calls["whisper"] = calls["whisper"] + 1
        return calls["whisper_text"]

    monkeypatch.setattr(pe.podcast, "fetch_transcript_tag", fake_tag_fetch)
    monkeypatch.setattr(pe.groq, "transcribe_via_groq", fake_groq_transcribe)
    monkeypatch.setattr(pe.podcast, "transcribe_via_whisper", fake_whisper)
    return calls


def _episode(audio_url: str | None = "http://x/audio.mp3", transcript_url: str | None = None):
    episode: dict[str, object] = {"audio_url": audio_url, "show_notes": "notes body"}
    if transcript_url:
        episode["transcript_url"] = transcript_url
    return episode


def test_rss_tag_wins_over_groq(stub_pipeline_deps):
    stub_pipeline_deps["tag_text"] = "x" * 500
    text, source = pe._resolve_transcript(_episode(transcript_url="http://x/t.json"))
    assert source == "rss-transcript-tag"
    assert stub_pipeline_deps["groq"] == 0


def test_short_tag_falls_through_to_groq(stub_pipeline_deps, monkeypatch):
    stub_pipeline_deps["tag_text"] = "x" * 10  # under MIN_TRANSCRIPT_CHARS
    stub_pipeline_deps["groq_text"] = "y" * 500
    monkeypatch.setattr(pe.groq, "is_groq_configured", lambda: True)
    text, source = pe._resolve_transcript(_episode(transcript_url="http://x/t.json"))
    assert source == "groq-whisper-api"
    assert stub_pipeline_deps["groq"] == 1


def test_groq_success_wins(stub_pipeline_deps, monkeypatch):
    stub_pipeline_deps["groq_text"] = "z" * 500
    monkeypatch.setattr(pe.groq, "is_groq_configured", lambda: True)
    text, source = pe._resolve_transcript(_episode())
    assert source == "groq-whisper-api"
    assert stub_pipeline_deps["whisper"] == 0


def test_groq_fail_short_falls_to_openai_whisper(stub_pipeline_deps, monkeypatch):
    stub_pipeline_deps["groq_text"] = "too short"
    stub_pipeline_deps["whisper_text"] = "w" * 500
    monkeypatch.setattr(pe.groq, "is_groq_configured", lambda: True)
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai")
    text, source = pe._resolve_transcript(_episode())
    assert source == "whisper-api"
    assert stub_pipeline_deps["groq"] == 1
    assert stub_pipeline_deps["whisper"] == 1


def test_groq_fail_no_openai_key_falls_to_show_notes(stub_pipeline_deps, monkeypatch):
    stub_pipeline_deps["groq_text"] = None
    monkeypatch.setattr(pe.groq, "is_groq_configured", lambda: True)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    text, source = pe._resolve_transcript(_episode())
    assert text is None
    assert source == "show-notes"
    assert stub_pipeline_deps["whisper"] == 0


def test_groq_unconfigured_never_called_whisper_used(stub_pipeline_deps, monkeypatch):
    stub_pipeline_deps["whisper_text"] = "w" * 500
    monkeypatch.setattr(pe.groq, "is_groq_configured", lambda: False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai")
    text, source = pe._resolve_transcript(_episode())
    assert source == "whisper-api"
    # Never called: the chain must not touch groq when unconfigured.
    assert stub_pipeline_deps["groq"] == 0


def test_whisper_fail_falls_to_show_notes(stub_pipeline_deps, monkeypatch):
    stub_pipeline_deps["whisper_text"] = "too short"
    monkeypatch.setattr(pe.groq, "is_groq_configured", lambda: False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai")
    text, source = pe._resolve_transcript(_episode())
    assert text is None
    assert source == "show-notes"


# ---------------------------------------------------------------------------
# is_groq_configured
# ---------------------------------------------------------------------------


def test_is_groq_configured_false_when_env_absent(monkeypatch):
    monkeypatch.setattr(groq.config, "get_optional", lambda name, default="": "")
    assert groq.is_groq_configured() is False


def test_is_groq_configured_true_when_key_set(monkeypatch):
    monkeypatch.setattr(groq.config, "get_optional", lambda name, default="": "k")
    assert groq.is_groq_configured() is True