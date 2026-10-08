import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from subprocess import CompletedProcess

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / ".github"))
from scripts.pnpm_audit_report import capture_audit


class PnpmAuditReportTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ("package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml"):
            (self.root / name).write_text(name, encoding="utf-8")
        self.output = self.root / "artifact" / "pnpm-audit-report.json"

    def run_capture(self, result):
        def runner(command, **kwargs):
            self.assertEqual(
                command,
                ("pnpm", "audit", "--audit-level", "high", "--json"),
            )
            self.assertEqual(kwargs["cwd"], self.root.resolve())
            return result

        return capture_audit(
            self.root,
            self.output,
            environ={
                "GITHUB_SHA": "a" * 40,
                "GITHUB_RUN_ID": "12345",
                "GITHUB_RUN_ATTEMPT": "2",
                "GITHUB_EVENT_NAME": "schedule",
                "GITHUB_REF": "refs/heads/main",
            },
            runner=runner,
        )

    def read_artifact(self):
        return json.loads(self.output.read_text(encoding="utf-8"))

    def test_nonzero_vulnerability_result_is_preserved_with_full_json(self):
        audit = {
            "metadata": {
                "vulnerabilities": {
                    "info": 0,
                    "low": 1,
                    "moderate": 2,
                    "high": 1,
                    "critical": 0,
                }
            },
            "advisories": [
                {
                    "module_name": "example",
                    "findings": [{"paths": [".>parent>example"]}],
                }
            ],
        }
        exit_code = self.run_capture(
            CompletedProcess([], 1, json.dumps(audit), "")
        )

        artifact = self.read_artifact()
        self.assertEqual(exit_code, 1)
        self.assertEqual(artifact["classification"], "vulnerabilities_found")
        self.assertEqual(artifact["severity_counts"]["high"], 1)
        self.assertEqual(
            artifact["audit"]["advisories"][0]["findings"][0]["paths"],
            [".>parent>example"],
        )
        self.assertEqual(artifact["commit_sha"], "a" * 40)
        self.assertEqual(artifact["workflow_run"]["attempt"], "2")
        self.assertEqual(
            artifact["dependency_inputs"]["pnpm-lock.yaml"],
            hashlib.sha256(b"pnpm-lock.yaml").hexdigest(),
        )

    def test_registry_failure_is_not_reported_as_zero_vulnerabilities(self):
        exit_code = self.run_capture(
            CompletedProcess([], 1, "", "ERR_PNPM_FETCH_503 registry unavailable")
        )

        artifact = self.read_artifact()
        self.assertEqual(exit_code, 1)
        self.assertEqual(artifact["classification"], "registry_access_error")
        self.assertEqual(artifact["error_code"], "ERR_PNPM_FETCH")
        self.assertIsNone(artifact["severity_counts"])
        self.assertIsNone(artifact["audit"])

    def test_high_severity_counts_remain_findings_even_with_zero_exit(self):
        audit = {"metadata": {"vulnerabilities": {"info": 0, "low": 0, "moderate": 0, "high": 1, "critical": 0}}}
        exit_code = self.run_capture(CompletedProcess([], 0, json.dumps(audit), ""))
        artifact = self.read_artifact()
        self.assertEqual(exit_code, 0)
        self.assertEqual(artifact["classification"], "vulnerabilities_found")
        self.assertEqual(artifact["severity_counts"]["high"], 1)

    def test_advisory_text_does_not_trigger_registry_error_detection(self):
        audit = {
            "metadata": {"vulnerabilities": {"info": 0, "low": 0, "moderate": 0, "high": 1, "critical": 0}},
            "advisories": [{"title": "HTTP 403 and ECONNRESET in an example request"}],
        }
        exit_code = self.run_capture(CompletedProcess([], 1, json.dumps(audit), ""))
        artifact = self.read_artifact()
        self.assertEqual(exit_code, 1)
        self.assertEqual(artifact["classification"], "vulnerabilities_found")
        self.assertIsNone(artifact["error_code"])

    def test_structured_registry_error_is_detected_without_scanning_advisories(self):
        report = {"error": {"code": "ERR_PNPM_FETCH", "message": "registry unavailable"}}
        exit_code = self.run_capture(CompletedProcess([], 1, json.dumps(report), ""))
        artifact = self.read_artifact()
        self.assertEqual(exit_code, 1)
        self.assertEqual(artifact["classification"], "registry_access_error")
        self.assertEqual(artifact["error_code"], "ERR_PNPM_FETCH")

    def test_registry_http_error_is_classified_from_non_json_stdout(self):
        exit_code = self.run_capture(
            CompletedProcess([], 1, "ERR_PNPM_AUDIT_BAD_RESPONSE HTTP 403", "")
        )
        artifact = self.read_artifact()
        self.assertEqual(exit_code, 1)
        self.assertEqual(artifact["classification"], "registry_access_error")
        self.assertEqual(artifact["error_code"], "ERR_PNPM_AUDIT_BAD_RESPONSE")
        self.assertIsNone(artifact["severity_counts"])

    def test_clean_json_is_reported_with_all_severity_counts(self):
        audit = {
            "metadata": {
                "vulnerabilities": {
                    "info": 0,
                    "low": 0,
                    "moderate": 0,
                    "high": 0,
                    "critical": 0,
                }
            }
        }
        exit_code = self.run_capture(
            CompletedProcess([], 0, json.dumps(audit), "")
        )

        artifact = self.read_artifact()
        self.assertEqual(exit_code, 0)
        self.assertEqual(artifact["classification"], "completed")
        self.assertEqual(artifact["severity_counts"]["critical"], 0)
        self.assertEqual(artifact["audit"], audit)


if __name__ == "__main__":
    unittest.main()
