#!/usr/bin/env bash
# Idempotent setup for the video-edit skill.
# Installs Python deps (WhisperX) and Node deps (Remotion).
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTION_DIR="$SKILL_DIR/remotion"

echo "==> video-edit setup ($SKILL_DIR)"

# 1. ffmpeg
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install via: brew install ffmpeg"
  exit 1
fi
echo "    ffmpeg: $(ffmpeg -version | head -n1)"

# 2. Python deps
if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 not found"; exit 1
fi

VENV_DIR="$SKILL_DIR/.venv"
if [ ! -d "$VENV_DIR" ]; then
  echo "==> Creating venv at $VENV_DIR"
  python3 -m venv "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

python3 -m pip install --quiet --upgrade pip
if ! python3 -c "import whisperx" >/dev/null 2>&1; then
  echo "==> Installing whisperx (this can take a few minutes)"
  python3 -m pip install --quiet "whisperx>=3.1.5"
fi
echo "    whisperx: $(python3 -c 'import whisperx, importlib.metadata as m; print(m.version("whisperx"))')"

# 3. Node deps
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node 18+."; exit 1
fi
if [ ! -d "$REMOTION_DIR/node_modules" ]; then
  echo "==> npm install in $REMOTION_DIR"
  (cd "$REMOTION_DIR" && npm install --silent)
fi
echo "    Remotion: $(cd "$REMOTION_DIR" && node -e 'console.log(require("./node_modules/remotion/package.json").version)')"

mkdir -p "$REMOTION_DIR/public"

echo "==> setup OK"
