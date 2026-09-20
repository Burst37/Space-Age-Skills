"""One resolver for "where is the config, and what does it say".

The answer used to be copied into four Python files and two bash ones. The
copies drifted (scripts/eval/behavior_eval.py stopped honouring
OBSIDIAN_ENV_FILE) and, worse, went missing: a caller that reads only
os.environ finds nothing when the install wrote the file and never exported it,
then does nothing and says nothing. That is #124, #160, #269 and #285 - one
bug, four releases, four places to fix it.

These tests cover the resolver's behaviour, that both halves of the toolkit
agree on the file, and that a fifth spelling fails CI instead of shipping.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "scripts"))
import osb_env  # noqa: E402  (depends on the sys.path insert above)

BASH = shutil.which("bash") or "/bin/bash"


@pytest.fixture(autouse=True)
def _clean_env(monkeypatch):
    """Each test states the environment it needs; nothing leaks in from the
    machine running the suite, which has a real config."""
    monkeypatch.delenv("OBSIDIAN_ENV_FILE", raising=False)
    monkeypatch.delenv("OBSIDIAN_VAULT_PATH", raising=False)


def _write_env(tmp_path: Path, body: str) -> Path:
    env = tmp_path / ".env"
    env.write_text(body, encoding="utf-8")
    return env


# ── where the file is ────────────────────────────────────────────────────────

def test_default_location_is_the_documented_one():
    assert osb_env.env_file() == Path.home() / ".config" / "obsidian-second-brain" / ".env"
    assert osb_env.config_dir() == Path.home() / ".config" / "obsidian-second-brain"


def test_obsidian_env_file_overrides_the_default(tmp_path, monkeypatch):
    env = _write_env(tmp_path, "OBSIDIAN_VAULT_PATH=/tmp/v\n")
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(env))
    assert osb_env.env_file() == env
    assert osb_env.vault_path() == "/tmp/v"


def test_a_tilde_in_obsidian_env_file_is_expanded(monkeypatch):
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", "~/somewhere/.env")
    assert osb_env.env_file() == Path.home() / "somewhere" / ".env"


# ── what it says ─────────────────────────────────────────────────────────────

def test_reads_the_vault_path_when_the_variable_is_not_exported(tmp_path, monkeypatch):
    """The bug itself: a marketplace install writes the file and never exports
    it, so an env-only caller sees nothing (#285)."""
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(_write_env(tmp_path, 'OBSIDIAN_VAULT_PATH="/tmp/my vault"\n')))
    assert osb_env.vault_path() == "/tmp/my vault"


def test_a_real_environment_variable_wins_over_the_file(tmp_path, monkeypatch):
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(_write_env(tmp_path, "OBSIDIAN_VAULT_PATH=/from/file\n")))
    monkeypatch.setenv("OBSIDIAN_VAULT_PATH", "/from/env")
    assert osb_env.vault_path() == "/from/env"


def test_an_empty_environment_variable_does_not_shadow_the_file(tmp_path, monkeypatch):
    """A half-finished shell profile leaves OBSIDIAN_VAULT_PATH= behind. Treating
    that as "configured, to nothing" is how the hook goes quiet again."""
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(_write_env(tmp_path, "OBSIDIAN_VAULT_PATH=/from/file\n")))
    monkeypatch.setenv("OBSIDIAN_VAULT_PATH", "")
    assert osb_env.vault_path() == "/from/file"


def test_missing_file_is_silent_not_an_exception(tmp_path, monkeypatch):
    """A hook must not raise because no config exists yet."""
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(tmp_path / "nope" / ".env"))
    assert osb_env.vault_path() == ""
    assert osb_env.env_value("ANYTHING", "fallback") == "fallback"


def test_a_directory_where_the_file_should_be_is_silent(tmp_path, monkeypatch):
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(tmp_path))
    assert osb_env.vault_path() == ""


@pytest.mark.parametrize("body,expected", [
    ("OBSIDIAN_VAULT_PATH=/plain\n", "/plain"),
    ('OBSIDIAN_VAULT_PATH="/double"\n', "/double"),
    ("OBSIDIAN_VAULT_PATH='/single'\n", "/single"),
    ("  OBSIDIAN_VAULT_PATH = /spaced \n", "/spaced"),
    ("export OBSIDIAN_VAULT_PATH=/exported\n", "/exported"),
    ("OBSIDIAN_VAULT_PATH=/crlf\r\n", "/crlf"),
    ("# OBSIDIAN_VAULT_PATH=/commented\nOBSIDIAN_VAULT_PATH=/real\n", "/real"),
    ("OBSIDIAN_VAULT_PATH=/first\nOBSIDIAN_VAULT_PATH=/last\n", "/last"),
    ("OTHER=x\n", ""),
    ("no equals sign here\n", ""),
    ("OBSIDIAN_VAULT_PATH=/c/Users/me/vault\n", "/c/Users/me/vault"),
    ("OBSIDIAN_VAULT_PATH=C:/Users/me/vault\n", "C:/Users/me/vault"),
])
def test_parses_what_the_bash_half_and_hand_edits_write(tmp_path, monkeypatch, body, expected):
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(_write_env(tmp_path, body)))
    assert osb_env.vault_path() == expected


def test_the_config_file_is_parsed_not_executed(tmp_path, monkeypatch):
    """A .env is data. Sourcing it would make an edited config a way to run code
    at the start of every session, since the SessionStart hook reads it."""
    marker = tmp_path / "executed"
    body = f'OBSIDIAN_VAULT_PATH=/ok\n$(touch "{marker}")\n`touch "{marker}"`\n'
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(_write_env(tmp_path, body)))
    assert osb_env.vault_path() == "/ok"
    assert not marker.exists()


def test_a_binary_config_does_not_raise(tmp_path, monkeypatch):
    env = tmp_path / ".env"
    env.write_bytes(b"\xff\xfe\x00OBSIDIAN_VAULT_PATH=/x\n")
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", str(env))
    assert isinstance(osb_env.vault_path(), str)


# ── the two halves agree ─────────────────────────────────────────────────────

def _bash_env_file(env: dict) -> str:
    script = (
        f'. "{REPO_ROOT}/scripts/platform-home.sh"\n'
        "osb_platform_home\n"
        "osb_env_file\n"
        'printf "%s" "$OSB_ENV_FILE"\n'
    )
    r = subprocess.run([BASH, "-c", script], capture_output=True, text=True,
                       env={**os.environ, **env})
    assert r.returncode == 0, r.stderr
    return r.stdout


def test_bash_and_python_resolve_the_same_default_file(monkeypatch):
    """An install writes the vault path with bash; every command reads it back
    with Python. A disagreement is a config that exists and is never found."""
    env = dict(os.environ)
    env.pop("OBSIDIAN_ENV_FILE", None)
    r = subprocess.run(
        [BASH, "-c",
         f'. "{REPO_ROOT}/scripts/platform-home.sh"; osb_platform_home; osb_env_file; printf "%s" "$OSB_ENV_FILE"'],
        capture_output=True, text=True, env=env,
    )
    assert r.returncode == 0, r.stderr
    assert Path(r.stdout) == osb_env.env_file()


def test_osb_env_file_resolves_home_itself_when_called_first():
    """Called before osb_platform_home, $OSB_HOME is empty and the default would
    be a relative path: a config found or not found depending on the caller's
    cwd. The helper resolves home itself rather than trusting call order."""
    env = dict(os.environ)
    env.pop("OBSIDIAN_ENV_FILE", None)
    r = subprocess.run(
        [BASH, "-c",
         f'. "{REPO_ROOT}/scripts/platform-home.sh"; osb_env_file; printf "%s" "$OSB_ENV_FILE"'],
        capture_output=True, text=True, env=env, cwd="/",
    )
    assert r.returncode == 0, r.stderr
    assert Path(r.stdout).is_absolute(), r.stdout
    assert Path(r.stdout) == osb_env.env_file()


def test_bash_and_python_honour_obsidian_env_file_the_same_way(tmp_path, monkeypatch):
    target = str(tmp_path / "elsewhere.env")
    monkeypatch.setenv("OBSIDIAN_ENV_FILE", target)
    assert Path(_bash_env_file({"OBSIDIAN_ENV_FILE": target})) == osb_env.env_file()


# ── the fence ────────────────────────────────────────────────────────────────

# Two shapes. The first is unambiguously code: nobody writes `".config" /
# "obsidian-second-brain"` in a sentence. The second appears in prose too (a
# message telling the user where to put an API key), so it only counts when the
# line is also building or overriding the path.
_PATH_PIECES = re.compile(r'"\.config"\s*/\s*"obsidian-second-brain"')
_PATH_LITERAL = re.compile(r"\.config/obsidian-second-brain/\.env")
_RESOLVING = ("OBSIDIAN_ENV_FILE", "OSB_HOME", "Path(", "Path.home()")

# Allowed to spell it out, each for a stated reason.
_EXEMPT = {
    # The resolvers themselves. This is the one place.
    "scripts/osb_env.py",
    "scripts/platform-home.sh",
    # Standalone by design, for the reason tests/test_platform_home.py documents:
    # it is copied into other harnesses' hook systems by hand, so it cannot
    # source anything. Its copy is fenced there. scripts/quick-install.sh is the
    # other standalone script but resolves no config path, so it is not exempted
    # here - an exemption nothing needs is where the next real copy hides.
    "hooks/validate-ai-first.sh",
}

_SEARCHED = ("hooks", "scripts", "integrations")


def _offending_lines(text: str) -> list[tuple[int, str]]:
    """Lines that build the config path themselves instead of asking for it."""
    out = []
    for lineno, line in enumerate(text.splitlines(), 1):
        if _PATH_PIECES.search(line):
            out.append((lineno, line.strip()))
        elif _PATH_LITERAL.search(line) and any(m in line for m in _RESOLVING):
            out.append((lineno, line.strip()))
    return out


# The three spellings that were in the tree before this module existed. A fence
# is only worth having if it catches the copies that actually shipped - an
# earlier cut of this one missed the behavior_eval line, which is the single
# copy that had already drifted off OBSIDIAN_ENV_FILE.
HISTORICAL = [
    '    load_dotenv(Path.home() / ".config" / "obsidian-second-brain" / ".env")',
    '    _ENV_PATH = Path(os.environ.get("OBSIDIAN_ENV_FILE")'
    ' or (Path.home() / ".config" / "obsidian-second-brain" / ".env")).expanduser()',
    'ENV_FILE="${OBSIDIAN_ENV_FILE:-$OSB_HOME/.config/obsidian-second-brain/.env}"',
]

# Prose that names the file so a user can find it. Not a resolution, must pass.
PROSE = [
    '_ENV_HINT = ("set GEMINI_SUMMARY_MODEL in ~/.config/obsidian-second-brain/.env "',
    '    # Load the shared ~/.config/obsidian-second-brain/.env before deciding',
    '"""Loads credentials from ~/.config/obsidian-second-brain/.env"""',
]


@pytest.mark.parametrize("line", HISTORICAL)
def test_the_fence_catches_every_copy_that_shipped(line):
    assert _offending_lines(line), f"fence does not catch: {line.strip()}"


@pytest.mark.parametrize("line", PROSE)
def test_the_fence_leaves_prose_alone(line):
    assert not _offending_lines(line), f"fence wrongly flags prose: {line.strip()}"


def _tracked_sources() -> list[Path]:
    out = []
    for folder in _SEARCHED:
        for path in sorted((REPO_ROOT / folder).rglob("*")):
            if path.suffix in (".py", ".sh") and path.is_file():
                out.append(path)
    return out


def test_no_new_inline_copy_of_the_config_path():
    """Every caller asks the resolver. A file that spells the path out itself is
    the fifth copy, and the fifth copy is the next silent no-op."""
    offenders = []
    for path in _tracked_sources():
        rel = path.relative_to(REPO_ROOT).as_posix()
        if rel in _EXEMPT:
            continue
        for lineno, line in _offending_lines(path.read_text(encoding="utf-8", errors="replace")):
            offenders.append(f"{rel}:{lineno}: {line}")
    assert not offenders, (
        "these build the config path themselves instead of asking the resolver "
        "(scripts/osb_env.py for Python, osb_env_file in scripts/platform-home.sh "
        "for bash):\n" + "\n".join(offenders)
    )


def test_the_resolver_needs_no_third_party_packages():
    """The SessionStart hook imports this and must run on a machine with nothing
    installed. A `dotenv` import here would make the hook fail exactly where it
    is meant to stop failing."""
    source = (REPO_ROOT / "scripts" / "osb_env.py").read_text(encoding="utf-8")
    imports = re.findall(r"^\s*(?:from|import)\s+([\w.]+)", source, re.M)
    assert set(imports) <= {"os", "pathlib", "__future__"}, imports
