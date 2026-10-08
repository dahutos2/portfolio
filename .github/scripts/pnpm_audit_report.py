#!/usr/bin/env python3
"""Capture one pnpm audit result with dependency-input provenance."""
from __future__ import annotations

from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys


DEPENDENCY_INPUTS = (
    "package.json",
    "pnpm-workspace.yaml",
    "pnpm-lock.yaml",
)
AUDIT_COMMAND = ("pnpm", "audit", "--audit-level", "high", "--json")
SEVERITIES = ("info", "low", "moderate", "high", "critical")
NETWORK_ERROR_CODES = (
    "EAI_AGAIN",
    "ENOTFOUND",
    "ECONNRESET",
    "ECONNREFUSED",
    "ECONNABORTED",
    "ENETUNREACH",
    "EHOSTUNREACH",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "ERR_PNPM_FETCH",
    "ERR_PNPM_META_FETCH_FAIL",
    "ERR_PNPM_AUDIT_BAD_RESPONSE",
    "ERR_SOCKET_TIMEOUT",
)


def file_digest(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_audit_output(stdout: str) -> dict | None:
    try:
        report = json.loads(stdout)
    except (json.JSONDecodeError, TypeError):
        return None
    return report if isinstance(report, dict) else None


def communication_error(stderr: str, stdout: str, report: dict | None = None) -> str | None:
    error_parts = [stderr]
    if report is None:
        error_parts.append(stdout)
    else:
        for key in ("code", "errorCode", "errno", "message"):
            value = report.get(key)
            if isinstance(value, str):
                error_parts.append(value)
        error = report.get("error")
        if isinstance(error, str):
            error_parts.append(error)
        elif isinstance(error, dict):
            error_parts.extend(
                value
                for key in ("code", "errorCode", "errno", "name", "message")
                if isinstance((value := error.get(key)), str)
            )
    error_text = "\n".join(error_parts)
    match = re.search(
        r"(?<![A-Z0-9_])(" + "|".join(NETWORK_ERROR_CODES) + r")(?![A-Z0-9])",
        error_text,
        re.IGNORECASE,
    )
    if match:
        return match.group(1).upper()
    match = re.search(
        r"\b(?:HTTP(?:/\d(?:\.\d)?)?\s+|status(?:\s+code)?\s*[:=]?\s*)(401|403|404|408|429|500|502|503|504)\b",
        error_text,
        re.IGNORECASE,
    )
    return f"HTTP_{match.group(1)}" if match else None


def summarize(
    report: dict | None,
    exit_code: int,
    stderr: str,
    stdout: str = "",
) -> tuple[str, dict | None, str | None]:
    error_code = communication_error(stderr, stdout, report)
    vulnerability_counts = None
    if report is not None:
        metadata = report.get("metadata")
        vulnerabilities = metadata.get("vulnerabilities") if isinstance(metadata, dict) else None
        if isinstance(vulnerabilities, dict):
            vulnerability_counts = {
                severity: int(vulnerabilities.get(severity, 0) or 0)
                for severity in SEVERITIES
            }
            if vulnerability_counts["high"] or vulnerability_counts["critical"]:
                return "vulnerabilities_found", vulnerability_counts, error_code
            if error_code:
                return "registry_access_error", vulnerability_counts, error_code
            if exit_code == 0:
                return "completed", vulnerability_counts, None
            return "audit_command_failed", vulnerability_counts, None

    if error_code:
        return "registry_access_error", vulnerability_counts, error_code
    if report is None:
        return "audit_output_unavailable", vulnerability_counts, None
    return "audit_json_missing_counts", vulnerability_counts, None


def capture_audit(
    project_root: Path,
    output_path: Path,
    *,
    environ: dict[str, str] | None = None,
    runner=subprocess.run,
) -> int:
    project_root = project_root.resolve()
    environ = os.environ if environ is None else environ
    input_hashes = {
        name: file_digest(project_root / name)
        for name in DEPENDENCY_INPUTS
    }

    try:
        result = runner(
            AUDIT_COMMAND,
            cwd=project_root,
            capture_output=True,
            text=True,
            check=False,
        )
        exit_code = result.returncode
        stdout = result.stdout or ""
        stderr = result.stderr or ""
    except OSError as error:
        exit_code = 127
        stdout = ""
        stderr = str(error)

    report = parse_audit_output(stdout)
    classification, severity_counts, error_code = summarize(report, exit_code, stderr, stdout)
    artifact = {
        "schema_version": 1,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "commit_sha": environ.get("GITHUB_SHA"),
        "workflow_run": {
            "id": environ.get("GITHUB_RUN_ID"),
            "attempt": environ.get("GITHUB_RUN_ATTEMPT"),
            "event": environ.get("GITHUB_EVENT_NAME"),
            "ref": environ.get("GITHUB_REF"),
        },
        "command": list(AUDIT_COMMAND),
        "dependency_inputs": input_hashes,
        "exit_code": exit_code,
        "classification": classification,
        "error_code": error_code,
        "severity_counts": severity_counts,
        "audit": report,
    }
    output_path = output_path if output_path.is_absolute() else project_root / output_path
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(artifact, ensure_ascii=False, sort_keys=True, indent=2) + "\n",
        encoding="utf-8",
    )
    return exit_code


def main() -> int:
    project_root = Path(__file__).resolve().parents[2]
    output_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("pnpm-audit-report.json")
    return capture_audit(project_root, output_path)


if __name__ == "__main__":
    raise SystemExit(main())
