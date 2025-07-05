#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Actions で実行され、ポートフォリオサイト用の JSON データを
public/data/ 以下に生成するスクリプト。

主な生成物
    user.json          : プロフィール情報
    repos.json         : フィーチャーしたいリポジトリ一覧
    services.json ...  : その他 YAML で指定された任意セクション
"""
from __future__ import annotations

from pathlib import Path
from urllib import request as ur, error as urlerror
import json, yaml, os, base64, markdown


def github_api(url: str, headers: dict) -> dict:
    try:
        req = ur.Request(url, headers=headers)
        with ur.urlopen(req) as res:
            return json.load(res)
    except urlerror.HTTPError as e:
        raise RuntimeError(f"GitHub API error {e.code} for {url}") from e


def build_user_json(owner: str, headers: dict, out_dir: Path) -> None:
    user = github_api(f"https://api.github.com/users/{owner}", headers)
    (out_dir / "user.json").write_text(
        json.dumps(
            {
                "name": user.get("name") or owner,
                "bio": user.get("bio"),
                "location": user.get("location"),
                "avatar": user.get("avatar_url"),
                "blog": user.get("blog"),
                "twitter": user.get("twitter_username"),
                "followers": user.get("followers"),
            },
            ensure_ascii=False,
        )
    )


def build_repos_json(
    owner: str, featured_repos: list[str], headers: dict, out_dir: Path
) -> None:
    featured = []
    for repo in featured_repos:
        # owner が省略されていれば補完
        full_name = repo if "/" in repo else f"{owner}/{repo}"

        # リポジトリ本体情報
        repo_data = github_api(f"https://api.github.com/repos/{full_name}", headers)

        # README (Base64) → Markdown HTML
        readme_data = github_api(
            f"https://api.github.com/repos/{full_name}/readme", headers
        )
        html = markdown.markdown(
            base64.b64decode(readme_data["content"]).decode(),
            extensions=["fenced_code", "tables"],
        )
        featured.append(
            {
                "full_name": full_name,
                "description": repo_data.get("description"),
                "stars": repo_data.get("stargazers_count"),
                "lang": repo_data.get("language"),
                "html": html,
            }
        )
    (out_dir / "repos.json").write_text(json.dumps(featured, ensure_ascii=False))


def build_extra_sections(cfg: dict, out_dir: Path) -> None:
    # services / timeline / testimonials / achievements をそのまま JSON にコピー
    for k in ["services", "timeline", "testimonials", "achievements"]:
        if k in cfg:
            (out_dir / f"{k}.json").write_text(json.dumps(cfg[k], ensure_ascii=False))


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
    build_extra_sections(cfg, data_dir)

    print("✅ Data build complete:", [p.name for p in data_dir.iterdir()])


if __name__ == "__main__":
    main()
