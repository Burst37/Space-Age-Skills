#!/usr/bin/env python3
"""Setup / preflight for /watch.

Modes:
  setup.py --check      Silent preflight. Exit 0 if ready, 2/3/4 on failure.
  setup.py --json       Machine-readable status.
  setup.py              Installer. Auto-installs deps, scaffolds .env.
"""
from __future__ import annotations

import json
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path


REQUIRED_BINARIES = ["ffmpeg", "ffprobe", "yt-dlp"]
CONFIG_DIR = Path.home() / ".config" / "watch"
CONFIG_FILE = CONFIG_DIR / ".env"
ENV_TEMPLATE = """# /watch API configuration
#
# Whisper transcription fallback (used when captions unavailable).
# Groq is preferred: cheaper, faster. OpenAI is the fallback.
#
# Get a Groq key:   https://console.groq.com/keys
# Get an OpenAI key: https://platform.openai.com/api-keys

GROQ_API_KEY=
OPENAI_API_KEY=
"""


def _which(name: str) -> str | None:
    return shutil.which(name)


def _check_binaries() -> list[str]:
    return [b for b in REQUIRED_BINARIES if not _which(b)]


def _read_env_key(name: str) -> str | None:
    value = os.environ.get(name)
    if value and value.strip():
        return value.strip()
    if not CONFIG_FILE.exists():
        return None
    try:
        for line in CONFIG_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, raw = line.partition("=")
            if key.strip() != name:
                continue
            raw = raw.strip()
            if len(raw) >= 2 and raw[0] in ('"', "'") and raw[-1] == raw[0]:
                raw = raw[1:-1]
            return raw or None
    except OSError:
        return None
    return None


def _have_api_key() -> tuple[bool, str | None]:
    if _read_env_key("GROQ_API_KEY"):
        return True, "groq"
    if _read_env_key("OPENAI_API_KEY"):
        return True, "openai"
    return False, None


def is_first_run() -> bool:
    return _read_env_key("SETUP_COMPLETE") != "true"


def _scaffold_env() -> bool:
    if CONFIG_FILE.exists():
        return False
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_FILE.write_text(ENV_TEMPLATE, encoding="utf-8")
    try:
        CONFIG_FILE.chmod(0o600)
    except OSError:
        pass
    return True


def _write_setup_complete() -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    existing = ""
    if CONFIG_FILE.exists():
        existing = CONFIG_FILE.read_text(encoding="utf-8")
        for line in existing.splitlines():
            if line.strip().startswith("SETUP_COMPLETE="):
                return
        if existing and not existing.endswith("\n"):
            existing += "\n"
        CONFIG_FILE.write_text(existing + "SETUP_COMPLETE=true\n", encoding="utf-8")
    else:
        CONFIG_FILE.write_text(ENV_TEMPLATE + "\nSETUP_COMPLETE=true\n", encoding="utf-8")
    try:
        CONFIG_FILE.chmod(0o600)
    except OSError:
        pass


def _brew_pkg(missing: list[str]) -> list[str]:
    pkgs: list[str] = []
    for b in missing:
        if b in ("ffmpeg", "ffprobe"):
            if "ffmpeg" not in pkgs:
                pkgs.append("ffmpeg")
        elif b == "yt-dlp":
            if "yt-dlp" not in pkgs:
                pkgs.append("yt-dlp")
        else:
            pkgs.append(b)
    return pkgs


def _install_macos(missing: list[str]) -> tuple[bool, str]:
    if _which("brew") is None:
        return False, "Homebrew not installed — see https://brew.sh"
    pkgs = _brew_pkg(missing)
    cmd = ["brew", "install", *pkgs]
    print(f"[setup] running: {' '.join(cmd)}", file=sys.stderr)
    result = subprocess.run(cmd)
    if result.returncode != 0:
        return False, f"brew install failed with exit {result.returncode}"
    return True, f"installed via brew: {', '.join(pkgs)}"


def _status() -> dict:
    missing = _check_binaries()
    has_key, backend = _have_api_key()
    if not missing and has_key:
        status = "ready"
    elif missing and not has_key:
        status = "needs_install_and_key"
    elif missing:
        status = "needs_install"
    else:
        status = "needs_key"
    return {
        "status": status,
        "first_run": is_first_run(),
        "missing_binaries": missing,
        "whisper_backend": backend,
        "has_api_key": has_key,
        "config_file": str(CONFIG_FILE),
        "platform": platform.system(),
    }


def cmd_check() -> int:
    s = _status()
    if s["status"] == "ready":
        return 0
    parts = []
    if s["missing_binaries"]:
        parts.append(f"missing binaries: {', '.join(s['missing_binaries'])}")
    if not s["has_api_key"]:
        parts.append("no Whisper API key (GROQ_API_KEY or OPENAI_API_KEY)")
    installer = Path(__file__).resolve()
    sys.stderr.write(
        f"[watch] setup incomplete ({'; '.join(parts)}). "
        f"Run: python3 {installer}\n"
    )
    sys.stderr.flush()
    if s["missing_binaries"] and not s["has_api_key"]:
        return 4
    if s["missing_binaries"]:
        return 2
    return 3


def cmd_json() -> int:
    json.dump(_status(), sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


def cmd_install() -> int:
    missing = _check_binaries()
    if missing:
        system = platform.system()
        if system == "Darwin":
            ok, msg = _install_macos(missing)
            print(f"[setup] {msg}", file=sys.stderr)
            if not ok:
                return 2
            if _check_binaries():
                return 2
        elif system == "Linux":
            print("[setup] Install on Linux:", file=sys.stderr)
            print("  apt: sudo apt install ffmpeg && pipx install yt-dlp", file=sys.stderr)
            return 2
        elif system == "Windows":
            print("[setup] Install on Windows:", file=sys.stderr)
            print("  winget install Gyan.FFmpeg yt-dlp.yt-dlp", file=sys.stderr)
            return 2
        else:
            print(f"[setup] Unsupported platform: {system}", file=sys.stderr)
            return 2

    created = _scaffold_env()
    print(f"[setup] {'created' if created else 'exists'}: {CONFIG_FILE}")

    has_key, backend = _have_api_key()
    if has_key:
        _write_setup_complete()
        print(f"[setup] ready. whisper backend: {backend}")
        return 0

    print("\n[setup] Add a Whisper API key to enable transcription:")
    print(f"  Edit {CONFIG_FILE}")
    print("  GROQ_API_KEY=...   (preferred — console.groq.com/keys)")
    print("  OPENAI_API_KEY=... (fallback  — platform.openai.com/api-keys)")
    return 3


def main() -> int:
    if len(sys.argv) > 1:
        if sys.argv[1] == "--check":
            return cmd_check()
        if sys.argv[1] == "--json":
            return cmd_json()
    return cmd_install()


if __name__ == "__main__":
    raise SystemExit(main())
