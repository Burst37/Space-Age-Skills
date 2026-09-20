"""Another Obsidian plugin's SessionStart hook does not replace ours, it runs beside
it, and both manuals land in one context with nothing saying which schema governs a
write (#300). These pin the detection and the precedence note it feeds.

The scan reads other people's settings files, so the malformed and missing cases
matter as much as the happy one: a traceback here costs the session its skill root
and its vault manual, which is a worse outcome than the collision it reports.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "scripts"))
import vault_plugin_scan  # noqa: E402  (depends on the sys.path insert above)

HOOK = REPO_ROOT / "hooks/load_vault_context.py"

# The shape claude-obsidian ships: the interpreter in `command`, the script in `args`.
OTHER_PLUGIN_HOOKS = {
    "hooks": {
        "SessionStart": [
            {
                "matcher": "startup|resume|clear|compact",
                "hooks": [
                    {
                        "type": "command",
                        "command": "python3",
                        "args": ["${CLAUDE_PLUGIN_ROOT}/scripts/claude-obsidian.py", "hook"],
                        "timeout": 5,
                    }
                ],
            }
        ]
    }
}


def write_json(path: Path, data: dict) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data), encoding="utf-8")
    return path


def install_plugin(home: Path, name: str, hooks: dict) -> Path:
    """Register a plugin in installed_plugins.json and give it a hooks manifest."""
    install_path = home / ".claude" / "plugins" / "cache" / name / "1.0.0"
    write_json(install_path / "hooks" / "hooks.json", hooks)
    registry_path = home / ".claude" / "plugins" / "installed_plugins.json"
    registry = json.loads(registry_path.read_text()) if registry_path.is_file() else {
        "version": 2, "plugins": {}
    }
    registry["plugins"][name] = [{"scope": "user", "installPath": str(install_path)}]
    write_json(registry_path, registry)
    return install_path


@pytest.fixture()
def home(tmp_path):
    h = tmp_path / "home"
    h.mkdir()
    return h


@pytest.fixture()
def project(tmp_path):
    p = tmp_path / "project"
    p.mkdir()
    return p


# ── detection ────────────────────────────────────────────────────────────────

def test_another_plugin_s_session_start_hook_is_found(home, project):
    install_plugin(home, "claude-obsidian", OTHER_PLUGIN_HOOKS)
    detected = vault_plugin_scan.scan(home=home, project_dir=project)
    assert len(detected) == 1
    # The args half carries the only evidence this is vault tooling, so a scan that
    # read `command` alone would see a bare "python3" and report nothing.
    assert "claude-obsidian.py" in detected[0]["command"]
    assert "claude-obsidian" in detected[0]["source"]


def test_our_own_hook_is_never_reported(home, project):
    install_plugin(home, "obsidian-second-brain", {
        "hooks": {"SessionStart": [{"matcher": "", "hooks": [
            {"type": "command", "command": '"${CLAUDE_PLUGIN_ROOT}/hooks/load_vault_context.sh"'}
        ]}]}
    })
    assert vault_plugin_scan.scan(home=home, project_dir=project) == []


def test_a_hook_registered_in_settings_is_found(home, project):
    write_json(home / ".claude" / "settings.json", {
        "hooks": {"SessionStart": [{"matcher": "", "hooks": [
            {"type": "command", "command": "/opt/obsidian-tool/session.sh"}
        ]}]}
    })
    detected = vault_plugin_scan.scan(home=home, project_dir=project)
    assert [d["command"] for d in detected] == ["/opt/obsidian-tool/session.sh"]


def test_project_settings_are_scanned_too(home, project):
    write_json(project / ".claude" / "settings.local.json", {
        "hooks": {"SessionStart": [{"matcher": "", "hooks": [
            {"type": "command", "command": "python3 .bin/second-brain-hook.py"}
        ]}]}
    })
    detected = vault_plugin_scan.scan(home=home, project_dir=project)
    assert len(detected) == 1


def test_unrelated_session_start_hooks_are_left_alone(home, project):
    """A precedence note against rules that were never in competition is worse than
    no note, so anything without a vault marker is ignored - HashiCorp Vault
    included, which is why a bare "vault" is not one of the markers."""
    write_json(home / ".claude" / "settings.json", {
        "hooks": {"SessionStart": [{"matcher": "", "hooks": [
            {"type": "command", "command": "vault login -method=oidc"},
            {"type": "command", "command": "/usr/local/bin/notify-session-start"},
        ]}]}
    })
    assert vault_plugin_scan.scan(home=home, project_dir=project) == []


def test_hooks_on_other_events_are_not_precedence_problems(home, project):
    """Only SessionStart puts a second ruleset in context. A Stop or PostToolUse hook
    from the same plugin is its own business."""
    install_plugin(home, "claude-obsidian", {
        "hooks": {"Stop": [{"hooks": [
            {"type": "command", "command": "python3", "args": ["claude-obsidian.py", "stop"]}
        ]}]}
    })
    assert vault_plugin_scan.scan(home=home, project_dir=project) == []


def test_one_command_is_reported_once(home, project):
    """The same plugin registered in settings and shipped in a manifest is one piece
    of tooling. Saying so twice inflates the count in the note."""
    command = "/opt/obsidian-tool/session.sh"
    write_json(home / ".claude" / "settings.json", {
        "hooks": {"SessionStart": [{"matcher": "", "hooks": [
            {"type": "command", "command": command}
        ]}]}
    })
    install_plugin(home, "obsidian-tool", {
        "hooks": {"SessionStart": [{"matcher": "", "hooks": [
            {"type": "command", "command": command}
        ]}]}
    })
    assert len(vault_plugin_scan.scan(home=home, project_dir=project)) == 1


@pytest.mark.parametrize("body", [
    "{ not json at all",
    '{"hooks": "a string where the object goes"}',
    '{"hooks": {"SessionStart": {"matcher": ""}}}',
    '{"hooks": {"SessionStart": [{"hooks": [{"command": 42}]}]}}',
    "[]",
])
def test_a_malformed_settings_file_yields_nothing_and_does_not_raise(home, project, body):
    (home / ".claude").mkdir(parents=True, exist_ok=True)
    (home / ".claude" / "settings.json").write_text(body, encoding="utf-8")
    assert vault_plugin_scan.scan(home=home, project_dir=project) == []


def test_a_plugin_whose_install_path_is_gone_is_skipped(home, project):
    write_json(home / ".claude" / "plugins" / "installed_plugins.json", {
        "version": 2,
        "plugins": {"claude-obsidian": [{"installPath": str(home / "moved" / "away")}]},
    })
    assert vault_plugin_scan.scan(home=home, project_dir=project) == []


def test_nothing_installed_means_no_detections(home, project):
    assert vault_plugin_scan.scan(home=home, project_dir=project) == []


# ── the note ─────────────────────────────────────────────────────────────────

def test_the_note_names_the_other_hook_and_which_manual_wins(tmp_path):
    manual = tmp_path / "vault" / "_CLAUDE.md"
    block = vault_plugin_scan.precedence_block(
        [{"source": "plugin: claude-obsidian", "command": "python3 claude-obsidian.py hook"}],
        manual,
    )
    assert "claude-obsidian.py" in block
    assert str(manual) in block
    assert "governs every write" in block
    # A count that reads as plural for one hook is the kind of thing a reader uses
    # to decide the whole note was generated without looking.
    assert "1 other SessionStart hook" in block


def test_the_note_counts_more_than_one(tmp_path):
    block = vault_plugin_scan.precedence_block(
        [{"source": "a", "command": "obsidian-one.sh"},
         {"source": "b", "command": "obsidian-two.sh"}],
        tmp_path / "_CLAUDE.md",
    )
    assert "2 other SessionStart hooks" in block


# ── the hook end to end ──────────────────────────────────────────────────────

def run_hook(vault: Path, home: Path, cwd: Path) -> str:
    """The additionalContext string a session actually receives."""
    env = dict(
        os.environ,
        OBSIDIAN_VAULT_PATH=str(vault),
        HOME=str(home),
        USERPROFILE=str(home),  # Path.home() reads this one on Windows
    )
    result = subprocess.run(
        [sys.executable, str(HOOK)],
        input=json.dumps({"cwd": str(vault)}),
        env=env, cwd=str(cwd), capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)["hookSpecificOutput"]["additionalContext"]


@pytest.fixture()
def vault(tmp_path):
    v = tmp_path / "vault"
    v.mkdir()
    (v / "_CLAUDE.md").write_text("# Manual\n\nFolder map: wiki/\n", encoding="utf-8")
    return v


def test_a_session_beside_another_plugin_is_told_which_schema_governs(vault, home, project):
    install_plugin(home, "claude-obsidian", OTHER_PLUGIN_HOOKS)
    context = run_hook(vault, home, project)
    assert "Other vault tooling is active" in context
    assert "claude-obsidian.py" in context
    assert str(vault / "_CLAUDE.md") in context
    # Ahead of the manual: a session that reads the rules before the precedence
    # has already been given two schemas with equal authority.
    assert context.index("Other vault tooling is active") < context.index("Folder map: wiki/")


def test_a_session_on_its_own_gets_no_note(vault, home, project):
    context = run_hook(vault, home, project)
    assert "Other vault tooling" not in context
    assert "Folder map: wiki/" in context


def test_the_note_survives_a_manual_too_large_to_inject(tmp_path, home, project):
    """Over the cap the manual is replaced by a pointer. The precedence note is the
    smaller and the more urgent of the two, so it is the one that stays."""
    vault = tmp_path / "big-vault"
    vault.mkdir()
    (vault / "_CLAUDE.md").write_text("# Manual\n" + ("rule\n" * 5000), encoding="utf-8")
    install_plugin(home, "claude-obsidian", OTHER_PLUGIN_HOOKS)
    context = run_hook(vault, home, project)
    assert "Other vault tooling is active" in context
    assert "NOT loaded" in context
    assert len(context) <= 10_000


def test_a_broken_scan_never_costs_the_session_its_manual(vault, home, project, monkeypatch):
    """The detection reads files this skill does not own. No shape of those is worth
    the skill root and the manual, which is what a raise here would cost."""
    monkeypatch.setattr(
        vault_plugin_scan, "scan",
        lambda *a, **k: (_ for _ in ()).throw(RuntimeError("unreadable")),
    )
    sys.path.insert(0, str(REPO_ROOT / "hooks"))
    import load_vault_context

    monkeypatch.setattr(load_vault_context, "vault_plugin_scan", vault_plugin_scan)
    assert load_vault_context.precedence_section(vault / "_CLAUDE.md") == ""
