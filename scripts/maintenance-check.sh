#!/usr/bin/env bash
# Read-only external checks; only the ignored Python environment and temp reports are written.
set -euo pipefail
cd "$(dirname "$0")/.."
reports=$(mktemp -d "${TMPDIR:-/tmp}/portfolio-maintenance.XXXXXX")
status=0

check() {
  local name=$1
  shift
  if "$@" >"$reports/$name.log" 2>&1; then
    echo "$name: OK"
  else
    echo "$name: FAILED (see $reports/$name.log)"
    tail -n 12 "$reports/$name.log"
    status=1
  fi
}

git status --short
check main gh api repos/dahutos2/portfolio/commits/main --jq .sha
check runs gh api 'repos/dahutos2/portfolio/actions/workflows/deploy-pages.yml/runs?per_page=3' --jq '.workflow_runs | map({id,event,status,conclusion,head_sha,created_at})'
check prs gh pr list --repo dahutos2/portfolio --state open --json number,title,url,headRefOid
check published curl --fail --silent --show-error --connect-timeout 10 --max-time 30 https://dahutos2.github.io/portfolio/build.json

# Use the same Python minor version and hash-locked dependencies as CI.
if [ ! -x .venv/bin/python ]; then
  check python-venv env UV_CACHE_DIR="$reports/uv-cache" uv venv --managed-python --python 3.11 .venv
fi
if [ -x .venv/bin/python ]; then
  check python-version .venv/bin/python -c 'import sys; assert sys.version_info[:2] == (3, 11), "Recreate .venv with python3.11"'
  check python-install env UV_CACHE_DIR="$PWD/.venv/.cache/uv" uv pip install --python .venv/bin/python --require-hashes -r requirements.txt
  check python-audit .venv/bin/python -m pip_audit --require-hashes -r requirements.txt --disable-pip --format json
else
  status=1
fi
check npm-audit pnpm audit --json

echo "Reports: $reports"
echo 'Compare main.log, runs.log and published.log before claiming deployment consistency.'
exit "$status"
