#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Actions で実行され、ポートフォリオサイト用の JSON データを
public/data/ 以下に生成するスクリプト。

生成ファイル
  user.json      : プロフィール
  repos.json     : featured リポジトリ詳細
  metrics.json   : 全リポジトリ集計（件数・スター・言語）
  coding.json    : WakaTime all-time の言語別コーディング時間
  services / career / testimonials : YAML そのままコピー

環境変数
  GH_TOKEN            : repo スコープ PAT（private も集計するため必須）
  GITHUB_REPOSITORY_OWNER / OWNER : GitHub オーナー名
  WAKATIME_API_KEY    : WakaTime Read-only API key
  WAKATIME_USER       : WakaTime ユーザー
"""
from __future__ import annotations

from pathlib import Path
from urllib import request as ur, error as urlerror, parse as urlparse
import json, yaml, os
from collections import Counter
from datetime import datetime


def github_api(url: str, headers: dict) -> dict:
    try:
        req = ur.Request(url, headers=headers)
        with ur.urlopen(req) as res:
            return json.load(res)
    except urlerror.HTTPError as e:
        raise RuntimeError(f"GitHub API error {e.code} for {url}") from e


def paginated(url: str, headers: dict):
    page = 1
    while True:
        data = github_api(f"{url}?per_page=100&page={page}", headers)
        if not data:
            break
        yield from data
        page += 1


def wakatime_api(endpoint: str, api_key: str):
    url = f"https://wakatime.com/api/v1/{endpoint}?api_key={urlparse.quote(api_key)}"
    try:
        with ur.urlopen(url) as res:
            payload = json.load(res)
            if not payload.get("data"):
                raise RuntimeError(str(payload))
            return payload["data"]
    except urlerror.HTTPError as e:
        raise RuntimeError(f"[WakaTime {e.code}] {endpoint}") from e


def build_user_json(owner: str, headers: dict, out_dir: Path) -> None:
    user = github_api(f"https://api.github.com/users/{owner}", headers)
    (out_dir / "user.json").write_text(
        json.dumps(
            {
                "owner": owner,
                "name": user.get("name"),
                "bio": user.get("bio"),
                "location": user.get("location"),
                "avatar": user.get("avatar_url"),
                "blog": user.get("blog"),
                "twitter": user.get("twitter_username"),
                "followers": user.get("followers"),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def build_repos_json(owner: str, featured_cfg: list[str], hdr: dict, out: Path) -> None:
    featured = []
    for repo in featured_cfg:
        full = repo if "/" in repo else f"{owner}/{repo}"
        repo_data = github_api(f"https://api.github.com/repos/{full}", hdr)

        featured.append(
            {
                "full_name": full,
                "description": repo_data.get("description"),
                "stars": repo_data.get("stargazers_count"),
                "lang": repo_data.get("language"),
            }
        )
    (out / "repos.json").write_text(json.dumps(featured, ensure_ascii=False, indent=2))


def build_metrics_json(headers: dict, out_dir: Path):
    # 全リポジトリ（public+private）の言語別件数・スター数
    lang_counter = Counter()
    star_counter = Counter()
    total_repos = 0
    private_repos = 0

    # REST v3 `/user/repos` は visibility=all にすると private も取得
    for repo in paginated(
        "https://api.github.com/user/repos?affiliation=owner&visibility=all", headers
    ):
        total_repos += 1
        if repo["private"]:
            private_repos += 1

        lang = repo["language"] or "Unknown"
        lang_counter[lang] += 1
        star_counter[lang] += repo["stargazers_count"]

    metrics = {
        "total_repos": total_repos,
        "private_repos": private_repos,
        "public_repos": total_repos - private_repos,
        "languages": [
            {
                "lang": lang,
                "count": lang_counter[lang],
                "stars": star_counter[lang],
            }
            for lang in lang_counter
        ],
        "total_stars": sum(star_counter.values()),
    }

    (out_dir / "metrics.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2)
    )


def build_coding_json(owner: str, out_dir: Path) -> None:
    key = os.getenv("WAKATIME_API_KEY")
    if not key:
        print("⚠️  WAKATIME_API_KEY が未設定: coding.json をスキップ")
        return

    # 集計データ
    stats = wakatime_api(f"users/{owner}/stats/all_time", key)

    # 言語→色 の辞書を準備
    palette = {
        lang["name"]: lang["color"]
        for lang in wakatime_api("program_languages", key)
        if lang.get("color")
    }

    # 言語リストを整形（Other は除外）
    langs = [
        {
            "lang": l["name"],
            "seconds": int(l["total_seconds"]),
            "color": palette.get(l["name"]),  # 見つからなければ null
        }
        for l in stats["languages"]
        if l["name"].lower() != "other"
    ]

    # ISO 8601 形式の文字列に変換
    started_at = stats.get("start")
    started_at_iso = (
        datetime.fromisoformat(started_at).isoformat() if started_at else None
    )

    (out_dir / "coding.json").write_text(
        json.dumps(
            {
                "range": "all_time",
                "started_at": started_at_iso,
                "total_seconds": int(stats["total_seconds"]),
                "languages": langs,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def build_extra_sections(cfg: dict, out_dir: Path) -> None:
    # services / career / testimonials をそのまま JSON にコピー
    for k in ["services", "career", "testimonials"]:
        if k in cfg:
            (out_dir / f"{k}.json").write_text(
                json.dumps(cfg[k], ensure_ascii=False, indent=2)
            )


def main():
    # 環境変数取得
    owner = os.getenv("OWNER")
    token = os.getenv("GH_TOKEN")
    if not owner or not token:
        raise RuntimeError("ENV OWNER / GH_TOKEN が未設定です。")

    # YAML 読み込み
    cfg = yaml.safe_load(open("portfolio.config.yml"))

    # GitHub API 共通ヘッダ
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
    }

    # 出力先ディレクトリを確保
    data_dir = Path("public/data")
    data_dir.mkdir(parents=True, exist_ok=True)

    # 各 JSON 生成
    build_user_json(owner, headers, data_dir)
    build_repos_json(owner, cfg.get("featured_repos", []), headers, data_dir)
    build_metrics_json(headers, data_dir)
    build_coding_json(owner, data_dir)
    build_extra_sections(cfg, data_dir)

    print("✅ Data build complete:", [p.name for p in data_dir.iterdir()])


if __name__ == "__main__":
    main()
