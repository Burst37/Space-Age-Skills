"""config.get_optional_int: the TX_LIMIT knobs from #234 must fail with the
variable named, not an int() traceback, when someone writes `480k`."""

from __future__ import annotations

import os

import pytest

os.environ.setdefault("OBSIDIAN_VAULT_PATH", "/nonexistent/vault-for-tests")

from scripts.research.lib import config  # noqa: E402


def test_default_when_unset(monkeypatch):
    monkeypatch.delenv("YOUTUBE_TX_LIMIT", raising=False)
    assert config.get_optional_int("YOUTUBE_TX_LIMIT", 480000) == 480000


def test_integer_value_is_read(monkeypatch):
    monkeypatch.setenv("PODCAST_TX_LIMIT", " 24000 ")
    assert config.get_optional_int("PODCAST_TX_LIMIT", 480000) == 24000


@pytest.mark.parametrize("bad", ["480k", "1e6", "24,000", "lots"])
def test_non_integer_exits_naming_the_variable(monkeypatch, bad):
    monkeypatch.setenv("PODCAST_TX_LIMIT", bad)
    with pytest.raises(SystemExit) as exc:
        config.get_optional_int("PODCAST_TX_LIMIT", 480000)
    assert "PODCAST_TX_LIMIT" in str(exc.value)
    assert bad in str(exc.value)
