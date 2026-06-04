#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -eq 0 ]] && id hermeswebui >/dev/null 2>&1 \
        && command -v sudo >/dev/null 2>&1 \
        && sudo -n -u hermeswebui true 2>/dev/null; then
  exec sudo -n -u hermeswebui "$0" "$@"
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "${REPO_ROOT}/.env" ]]; then
  _hermes_env_filtered="$(mktemp "${TMPDIR:-/tmp}/hermes-webui-env.XXXXXX")"
  grep -vE '^[[:space:]]*(export[[:space:]]+)?(UID|GID|EUID|EGID|PPID)=' "${REPO_ROOT}/.env" > "${_hermes_env_filtered}" || true
  set -a
  source "${_hermes_env_filtered}"
  set +a
  rm -f "${_hermes_env_filtered}"
  unset _hermes_env_filtered
fi

PYTHON="${HERMES_WEBUI_PYTHON:-}"
if [[ -z "${PYTHON}" ]]; then
  if command -v python3 >/dev/null 2>&1; then
    PYTHON="$(command -v python3)"
  elif command -v python >/dev/null 2>&1; then
    PYTHON="$(command -v python)"
  else
    echo "[XX] Python 3 is required to run bootstrap.py" >&2
    exit 1
  fi
fi

exec "${PYTHON}" "${REPO_ROOT}/bootstrap.py" --no-browser "$@"
