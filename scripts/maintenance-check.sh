#!/usr/bin/env bash
# Read existing CI evidence; only temporary reports are written.
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
    return 1
  fi
}

git status --short
check main gh api repos/dahutos2/portfolio/commits/main --jq .sha || true
check runs gh api 'repos/dahutos2/portfolio/actions/workflows/deploy-pages.yml/runs?per_page=3' --jq '.workflow_runs | map({id,event,status,conclusion,head_sha,created_at})' || true
check prs gh pr list --repo dahutos2/portfolio --state open --json number,title,url,headRefOid || true
check published curl --fail --silent --show-error --connect-timeout 10 --max-time 30 https://dahutos2.github.io/portfolio/build.json || true

# The existing daily workflow owns dependency installation and audits.
# Read the latest main run, including failures; never substitute an older green run.
if check ci-run-id gh api 'repos/dahutos2/portfolio/actions/workflows/deploy-pages.yml/runs?branch=main&per_page=1' --jq '.workflow_runs[0].id // empty'; then
  run_id=$(cat "$reports/ci-run-id.log")
  if [[ "$run_id" =~ ^[0-9]+$ ]]; then
    check ci gh run view "$run_id" --repo dahutos2/portfolio --json databaseId,headSha,event,status,conclusion,createdAt,updatedAt,jobs,url || true
    check ci-log env XDG_CACHE_HOME="$reports/cache" gh run view "$run_id" --repo dahutos2/portfolio --log || true
  else
    echo 'ci: FAILED (no main workflow run found)'
    status=1
  fi
fi

echo "Reports: $reports"
echo 'Compare main.log, ci.log and published.log, including SHA, run ID, attempt and audit time.'
echo 'Read Audit dependencies in ci-log.log; CI success alone does not mean zero vulnerabilities.'
echo 'An old, failed, incomplete or mismatched CI run is not a current successful audit.'
exit "$status"
