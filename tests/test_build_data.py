import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

from preview_data import ROOT, builder, generate


class PortfolioDataTests(unittest.TestCase):
    def test_preview_uses_current_editorial_source(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            generate(output)
            self.assertEqual({p.name for p in output.iterdir()}, {
                "user.json", "repos.json", "metrics.json", "coding.json",
                "services.json", "career.json", "testimonials.json",
            })
            config = builder.yaml.safe_load((ROOT / "portfolio.config.yml").read_text())
            for name in ("services", "career", "testimonials"):
                self.assertEqual(json.loads((output / f"{name}.json").read_text()), config[name])

    def test_metrics_preserve_filters_across_pages(self):
        def api(url, headers):
            query = parse_qs(urlparse(url).query)
            self.assertEqual(query["affiliation"], ["owner"])
            self.assertEqual(query["visibility"], ["all"])
            self.assertEqual(query["per_page"], ["100"])
            page = int(query["page"][0])
            return [{"private": page == 2, "language": "Python", "stargazers_count": page}] if page < 3 else []

        with tempfile.TemporaryDirectory() as directory, patch.object(builder, "github_api", side_effect=api):
            output = Path(directory)
            builder.build_metrics_json({}, output)
            self.assertEqual(json.loads((output / "metrics.json").read_text()), {
                "total_repos": 2, "private_repos": 1, "public_repos": 1,
                "languages": [{"lang": "Python", "count": 2, "stars": 3}], "total_stars": 3,
            })

    def test_missing_coding_credentials_fail_instead_of_publishing_stale_data(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(RuntimeError, "WAKATIME_API_KEY"):
                builder.build_coding_json("example", Path(directory))

    def test_deleted_editorial_sections_become_empty(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            builder.build_extra_sections({"services": [{"title": "old"}]}, output)
            builder.build_extra_sections({}, output)
            for name in ("services", "career", "testimonials"):
                self.assertEqual(json.loads((output / f"{name}.json").read_text()), [])


if __name__ == "__main__":
    unittest.main()
