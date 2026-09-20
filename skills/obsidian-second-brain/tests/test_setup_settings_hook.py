"""The skill installer must register the SessionStart context hook idempotently, so a
skill-installed command can locate the skill root the same way a plugin-installed one
does. Guards scripts/setup_settings_hook.py's pure register() (no real settings.json is
touched here)."""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "scripts"))
import setup_settings_hook as sh  # noqa: E402

# Resolved by path: on Windows a bare "bash" can resolve to WSL's launcher in System32.
BASH = shutil.which("bash") or "/bin/bash"


def _commands(settings: dict) -> list[str]:
    return [
        h.get("command", "")
        for group in settings.get("hooks", {}).get("SessionStart", [])
        for h in group.get("hooks", [])
    ]


def test_adds_hook_to_empty_settings():
    settings, action = sh.register({})
    assert action == "added"
    assert sh.HOOK_CMD in _commands(settings)


def test_is_idempotent():
    settings, _ = sh.register({})
    settings, action = sh.register(settings)
    assert action == "unchanged"
    # Registered exactly once, never duplicated.
    assert _commands(settings).count(sh.HOOK_CMD) == 1


def test_refreshes_a_stale_path_without_duplicating():
    settings = {
        "hooks": {
            "SessionStart": [
                {"matcher": "", "hooks": [
                    {"type": "command", "command": "python3 /old/path/hooks/load_vault_context.py"}
                ]}
            ]
        }
    }
    settings, action = sh.register(settings)
    assert action == "refreshed"
    assert _commands(settings) == [sh.HOOK_CMD]


def test_preserves_unrelated_settings_and_hooks():
    settings = {
        "model": "claude-fable-5",
        "hooks": {
            "SessionStart": [
                {"matcher": "", "hooks": [{"type": "command", "command": "/other/peon.sh"}]}
            ],
            "Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "/other/peon.sh"}]}],
        },
    }
    settings, action = sh.register(settings)
    assert action == "added"
    assert settings["model"] == "claude-fable-5"
    assert "Stop" in settings["hooks"]
    # The pre-existing SessionStart hook survives alongside ours.
    assert "/other/peon.sh" in _commands(settings)
    assert sh.HOOK_CMD in _commands(settings)


def test_the_registered_command_runs_in_the_shell_that_executes_it(tmp_path):
    """Claude Code hands a hook command to a shell, Git Bash on Windows. The command
    was str(HOOK_PATH): on Windows that is C:\\Users\\... unquoted, and Git Bash reads
    every backslash as an escape, so the hook failed with "No such file or directory"
    at every session start (#281); on any platform a home with a space in it split the
    path in two. The command is run here exactly as it would be registered."""
    hooks = tmp_path / "home with a space" / "hooks"
    hooks.mkdir(parents=True)
    marker = tmp_path / "ran"
    script = hooks / "load_vault_context.sh"
    script.write_text(f'#!/usr/bin/env bash\necho ran > "{marker.as_posix()}"\n', encoding="utf-8")
    script.chmod(0o755)

    r = subprocess.run([BASH, "-c", sh.hook_command(script)], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    assert marker.is_file(), "the registered command did not run the hook"
    assert "\\" not in sh.HOOK_CMD
    assert sh.HOOK_CMD == sh.hook_command(sh.HOOK_PATH)
