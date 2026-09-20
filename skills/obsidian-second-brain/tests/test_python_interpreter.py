"""On a stock Windows install `python3` is the Microsoft Store App Execution
Alias: it exists, prints nothing, and exits non-zero. The SessionStart hook ran
that name directly and injected nothing, and validate-ai-first.sh gated checks 5,
6 and 7 behind `command -v python3`, which the stub passes - so the substitution,
secret and tag checks were skipped without a word while checks 1-4 kept firing
and made the hook look alive (#269).

These pin the resolution (run a candidate, do not look it up), the two inline
copies of it, and the entry points that used to hardcode the name.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
# Resolved now: the tests below hand bash a PATH with no interpreter on it,
# and an empty PATH would leave bash itself unfindable.
BASH = shutil.which("bash") or "/bin/bash"
HELPER = REPO_ROOT / "scripts" / "python-interpreter.sh"
INLINE_COPIES = ("hooks/load_vault_context.sh", "hooks/validate-ai-first.sh")

FRONTMATTER = (
    "---\ndate: 2026-09-14\ntype: note\ntags:\n  - t\nai-first: true\n---\n\n"
    "## For future agent\n\n"
)
SECRET_LINE = "key sk-test1234567890abcdefghijklmnop here\n"


def _osb_python_block(text: str) -> list[str]:
    """The osb_python function with its explanatory comment, whitespace-normalized."""
    lines = text.splitlines()
    start = next(i for i, line in enumerate(lines) if line.strip().startswith("# ── osb_python"))
    end = next(i for i in range(start, len(lines)) if lines[i].rstrip() == "}")
    return [line.strip() for line in lines[start:end + 1]]


def test_the_inline_copies_match_the_helper():
    """Same fence as scripts/platform-home.sh: the hooks are handed to other
    harnesses by hand and cannot source a repo file, so they carry copies."""
    canonical = _osb_python_block(HELPER.read_text(encoding="utf-8"))
    joined = "\n".join(canonical)
    assert "py -3" in joined and "uv run --no-project" in joined, "the helper lost a candidate"
    for rel in INLINE_COPIES:
        copy = _osb_python_block((REPO_ROOT / rel).read_text(encoding="utf-8"))
        assert copy == canonical, f"{rel} drifted from scripts/python-interpreter.sh"


@pytest.fixture()
def stub_dir(tmp_path):
    """A directory shadowing python3 with something that exists and does nothing,
    which is what the Store alias is."""
    d = tmp_path / "bin"
    d.mkdir()
    stub = d / "python3"
    stub.write_text("#!/bin/sh\nexit 9009\n", encoding="utf-8")
    stub.chmod(0o755)
    return d


def resolve(path_value: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [BASH, "-c", f'. "{HELPER}"; osb_python'],
        env=dict(os.environ, PATH=path_value), capture_output=True, text=True,
    )


def test_a_name_that_exists_but_does_not_run_is_passed_over(stub_dir):
    """The whole bug in one assertion: `command -v` would have stopped here."""
    exists = subprocess.run([BASH, "-c", "command -v python3"],
                            env=dict(os.environ, PATH=f"{stub_dir}:{os.environ['PATH']}"),
                            capture_output=True, text=True)
    assert exists.returncode == 0 and str(stub_dir) in exists.stdout, "the stub must be found first"

    r = resolve(f"{stub_dir}:{os.environ['PATH']}")
    assert r.returncode == 0, r.stderr
    assert r.stdout and "python3" != r.stdout.strip(), f"resolved to the stub: {r.stdout!r}"


def test_it_reports_failure_when_nothing_runs(tmp_path):
    """No interpreter is a real state (the reporter's machine had one that was a
    lie, but an empty PATH is the same shape). It must be a status, not a hang."""
    empty = tmp_path / "empty"
    empty.mkdir()
    r = resolve(str(empty))
    assert r.returncode != 0
    assert r.stdout == ""


def test_the_session_hook_is_registered_as_the_wrapper():
    """hooks.json ran `python3 <...>.py`, the exact command that does nothing on
    Windows. The plugin manifest is the only wiring a marketplace install gets."""
    hooks = json.loads((REPO_ROOT / "hooks/hooks.json").read_text(encoding="utf-8"))
    command = hooks["hooks"]["SessionStart"][0]["hooks"][0]["command"]
    assert "load_vault_context.sh" in command
    assert not command.strip().startswith("python3"), command


def test_the_wrapper_injects_context_even_when_python3_is_a_stub(stub_dir, tmp_path):
    """End to end: the session gets its skill root on a machine whose `python3`
    is the alias. Before, it got an empty payload and a transcript footnote."""
    vault = tmp_path / "vault"
    vault.mkdir()
    (vault / "_CLAUDE.md").write_text("# Manual\n\nrule one\n", encoding="utf-8")

    r = subprocess.run(
        [BASH, str(REPO_ROOT / "hooks/load_vault_context.sh")],
        input=json.dumps({"cwd": str(vault)}),
        env=dict(os.environ, PATH=f"{stub_dir}:{os.environ['PATH']}",
                 OBSIDIAN_VAULT_PATH=str(vault)),
        capture_output=True, text=True,
    )
    assert r.returncode == 0, r.stderr
    context = json.loads(r.stdout)["hookSpecificOutput"]["additionalContext"]
    assert "**Skill root**" in context
    assert "rule one" in context


def test_the_wrapper_says_so_when_there_is_no_python(tmp_path):
    """A silent skip is the failure mode being fixed; it must not come back as a
    silent exit."""
    empty = tmp_path / "empty"
    empty.mkdir()
    r = subprocess.run(
        [BASH, str(REPO_ROOT / "hooks/load_vault_context.sh")],
        input=json.dumps({"cwd": str(tmp_path)}),
        env=dict(os.environ, PATH=str(empty)), capture_output=True, text=True,
    )
    assert r.returncode != 0
    assert "no working Python" in r.stderr
    assert "NOT injected" in r.stderr


def test_the_validator_runs_its_python_checks_through_the_resolved_interpreter(stub_dir, tmp_path):
    """Check 6 is the one with teeth: on Windows an sk- key in a note passed
    silently, because the guard only asked whether the name existed."""
    vault = tmp_path / "vault"
    vault.mkdir()
    note = vault / "leak.md"
    note.write_text(FRONTMATTER + SECRET_LINE, encoding="utf-8")

    r = subprocess.run(
        [BASH, str(REPO_ROOT / "hooks/validate-ai-first.sh")],
        input=json.dumps({"tool_name": "Write", "tool_input": {"file_path": str(note)}}),
        env=dict(os.environ, PATH=f"{stub_dir}:{os.environ['PATH']}",
                 OBSIDIAN_VAULT_PATH=str(vault)),
        capture_output=True, text=True,
    )
    assert r.returncode == 0, r.stderr
    assert "secret material" in json.loads(r.stdout)["systemMessage"]


def test_the_validator_announces_the_checks_it_could_not_run(tmp_path):
    """Checks 1-4 are pure bash and keep firing, which is what made the hook look
    alive while a third of it was dead. When no interpreter runs, the three that
    did not run are named on stderr instead of vanishing."""
    vault = tmp_path / "vault"
    vault.mkdir()
    note = vault / "leak.md"
    note.write_text(FRONTMATTER + SECRET_LINE, encoding="utf-8")

    # Shadow every candidate with something that exists and fails, and leave the
    # rest of PATH alone so jq and the coreutils the hook shells out to still work.
    shadow = tmp_path / "shadow"
    shadow.mkdir()
    for name in ("python3", "python", "py", "uv"):
        stub = shadow / name
        stub.write_text("#!/bin/sh\nexit 9009\n", encoding="utf-8")
        stub.chmod(0o755)

    r = subprocess.run(
        [BASH, str(REPO_ROOT / "hooks/validate-ai-first.sh")],
        input=json.dumps({"tool_name": "Write", "tool_input": {"file_path": str(note)}}),
        env=dict(os.environ, OBSIDIAN_VAULT_PATH=str(vault),
                 PATH=f"{shadow}:{os.environ['PATH']}"),
        capture_output=True, text=True,
    )
    assert "did NOT run" in r.stderr, r.stderr
    assert "checks 5-7" in r.stderr
    assert "leak.md" in r.stderr, "the message must name the file that went unchecked"
    # And the bash-only checks still pass this note, so nothing else changed.
    assert "secret material" not in r.stdout


def test_the_skill_installer_registers_the_wrapper():
    """setup_settings_hook.py wires the hook for a non-plugin install and hard-
    coded the same name."""
    text = (REPO_ROOT / "scripts/setup_settings_hook.py").read_text(encoding="utf-8")
    assert "load_vault_context.sh" in text
    assert 'f"python3 {HOOK_PATH}"' not in text

    # And it recognises the entry a pre-#269 install left behind, so re-running
    # the installer upgrades that entry instead of appending a second one.
    sys.path.insert(0, str(REPO_ROOT / "scripts"))
    import setup_settings_hook as sh

    stale = {"hooks": {"SessionStart": [{"matcher": "", "hooks": [
        {"type": "command", "command": "python3 /old/hooks/load_vault_context.py"}
    ]}]}}
    settings, action = sh.register(stale)
    assert action == "refreshed", action
    entries = settings["hooks"]["SessionStart"]
    assert len(entries) == 1 and len(entries[0]["hooks"]) == 1
    assert entries[0]["hooks"][0]["command"] == sh.HOOK_CMD


def test_setup_sh_upgrades_a_hook_registered_before_the_fix(tmp_path):
    """An existing install carries `python3 <...>.py` in settings.json. Finding it
    has to mean replacing it: skipping leaves the dead command, and appending
    leaves two entries where one does nothing."""
    text = (REPO_ROOT / "scripts/setup.sh").read_text(encoding="utf-8")
    assert "load_vault_context.sh" in text
    assert 'SESSION_HOOK_CMD="python3 $SESSION_HOOK"' not in text
    assert "SessionStart hook updated" in text, "no upgrade path for an existing install"

    settings = tmp_path / "settings.json"
    settings.write_text(json.dumps({"hooks": {"SessionStart": [
        {"matcher": "", "hooks": [
            {"type": "command", "command": "python3 /old/path/hooks/load_vault_context.py"}
        ]}
    ]}}), encoding="utf-8")
    # The jq program setup.sh uses, applied on its own: rewriting the command in
    # place must keep the entry and touch nothing else.
    program = (
        '.hooks.SessionStart = [ .hooks.SessionStart[]? | .hooks = [ .hooks[]? | '
        'if ((.command // "") | contains("load_vault_context")) then .command = $cmd else . end ] ]'
    )
    out = subprocess.run(
        ["jq", "--arg", "cmd", "/new/path/hooks/load_vault_context.sh", program, str(settings)],
        capture_output=True, text=True,
    )
    assert out.returncode == 0, out.stderr
    rewritten = json.loads(out.stdout)["hooks"]["SessionStart"]
    assert len(rewritten) == 1 and len(rewritten[0]["hooks"]) == 1
    assert rewritten[0]["hooks"][0]["command"] == "/new/path/hooks/load_vault_context.sh"


def _run_install_sh(tmp_path: Path, bin_dir: Path) -> tuple[subprocess.CompletedProcess, Path]:
    """install.sh against a throwaway home, with bin_dir first on PATH. The one
    prompt it asks (set up the research toolkit?) is answered no."""
    home = tmp_path / "home"
    home.mkdir()
    env = dict(os.environ, HOME=str(home), USERPROFILE=str(home),
               PATH=f"{bin_dir}{os.pathsep}{os.environ['PATH']}")
    env.pop("OBSIDIAN_ENV_FILE", None)
    r = subprocess.run([BASH, str(REPO_ROOT / "install.sh")], input="N\n", env=env,
                       capture_output=True, text=True, timeout=300)
    return r, home


def test_install_sh_resolves_the_interpreter_instead_of_running_python3():
    """install.sh kept the shape #280 removed from both hooks: a `command -v
    python3` guard in front of `python3 setup_settings_hook.py` (#281)."""
    text = (REPO_ROOT / "install.sh").read_text(encoding="utf-8")
    assert "python-interpreter.sh" in text and "osb_python" in text
    assert 'python3 "$SKILL_DIR/scripts/setup_settings_hook.py"' not in text


def test_install_sh_registers_the_hook_when_python3_is_the_store_alias(tmp_path):
    """On a stock Windows install `python3` passes `command -v` and exits 9009 (49
    once Git Bash truncates it), and install.sh runs under `set -e`: the installer
    ended at "Registering session context hook...", registered nothing, and never
    reached the research toolkit step or its closing instructions."""
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    alias = bin_dir / "python3"
    alias.write_text("#!/bin/sh\nexit 9009\n", encoding="utf-8")
    alias.chmod(0o755)
    # A working interpreter under the next name the resolver tries.
    working = bin_dir / "python"
    working.write_text(f'#!/bin/sh\nexec "{Path(sys.executable).as_posix()}" "$@"\n',
                       encoding="utf-8")
    working.chmod(0o755)

    r, home = _run_install_sh(tmp_path, bin_dir)
    assert r.returncode == 0, r.stdout[-1500:] + r.stderr[-1500:]
    assert "Done." in r.stdout, "the installer stopped before its last step"
    settings = json.loads((home / ".claude" / "settings.json").read_text(encoding="utf-8"))
    commands = [h["command"] for group in settings["hooks"]["SessionStart"] for h in group["hooks"]]
    registered = [c for c in commands if "load_vault_context.sh" in c]
    assert registered, commands
    # A backslash path is one Git Bash cannot run (see test_setup_settings_hook.py).
    assert "\\" not in registered[0], registered[0]


def test_install_sh_finishes_and_names_the_hook_when_no_python_runs(tmp_path):
    """No interpreter at all must not end the installer either: it finishes and
    prints the hook to add by hand, which the old fallback already promised."""
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    for name in ("python3", "python", "py", "uv"):
        stub = bin_dir / name
        stub.write_text("#!/bin/sh\nexit 9009\n", encoding="utf-8")
        stub.chmod(0o755)

    r, home = _run_install_sh(tmp_path, bin_dir)
    assert r.returncode == 0, r.stdout[-1500:] + r.stderr[-1500:]
    assert "Done." in r.stdout
    assert "load_vault_context.sh" in r.stdout, "the manual instruction must name the hook"
    assert not (home / ".claude" / "settings.json").exists()


def test_the_wrapper_is_executable():
    """Claude Code runs the command as given; a non-executable hook is a silent
    failure of the kind this whole issue is about."""
    assert os.access(REPO_ROOT / "hooks/load_vault_context.sh", os.X_OK)


def test_every_touched_script_still_parses():
    for rel in ("hooks/load_vault_context.sh", "hooks/validate-ai-first.sh",
                "scripts/python-interpreter.sh", "scripts/setup.sh", "install.sh"):
        r = subprocess.run([BASH, "-n", str(REPO_ROOT / rel)], capture_output=True, text=True)
        assert r.returncode == 0, f"{rel}: {r.stderr}"
    r = subprocess.run([sys.executable, "-m", "py_compile",
                        str(REPO_ROOT / "scripts/setup_settings_hook.py")],
                       capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
