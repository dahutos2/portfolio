# ポートフォリオサイト

Vite + Vue 3 + TypeScript + Tailwind CSSによるGitHub Pagesサイト。

## データと公開

- GitHub / WakaTime APIからプロフィール・リポジトリ・活動指標を収集する。
- `portfolio.config.yml` からサービス・経歴・推薦文を生成する。
- `content/legal/` のMarkdownから規約HTML・PDFを生成する。
- `public/data/` と `public/legal/` はビルド生成物。Git管理・手編集しない。

[Portfolioワークフロー](.github/workflows/deploy-pages.yml) がPR検証と公開を担当する。
毎日JST 11:00、mainへのpush、mainでの手動実行では、依存監査・テスト・実データ収集・規約生成・ビルド・ブラウザ検証がすべて成功した同一実行の成果物を公開する。収集や検証に失敗した場合は既存の公開サイトを維持する。
PRでは秘密情報を使わず固定サンプルで検証し、公開しない。`build.json` で公開commit・実行ID・生成時刻を確認できる。

Codexによる提案・承認・PR・マージの運用は [日次改善](docs/maintenance.md) を参照。

## ローカル開発

Nodeとpnpmのバージョンは `.tool-versions` と `package.json` に固定し、CIで整合を検証する。Pythonは3.11を使用する。

```sh
pnpm install --frozen-lockfile
uv venv --python 3.11 .venv
uv pip sync --python .venv/bin/python --require-hashes requirements.txt
.venv/bin/python tests/preview_data.py
pnpm dev
```

実データを使う場合は `OWNER`、`GH_TOKEN`、`WAKATIME_API_KEY` を環境に設定し、`.venv/bin/python .github/scripts/build_data.py` を実行する。秘密値をファイルにcommitしない。CIのmain専用 `production` Environmentに設定する `GH_PAT` は集計対象のprivate repository Metadata read-onlyを必要最小限に許可する。

## 検証

```sh
pnpm audit --audit-level high
.venv/bin/python -m pip_audit --require-hashes -r requirements.txt --disable-pip
.venv/bin/python -m unittest discover -s tests -v
.venv/bin/python tests/preview_data.py
pnpm exec puppeteer browsers install chrome
pnpm run build:all
pnpm run test:site
```

規約PDFには日本語フォントが必要。CIはNoto CJKを導入する。

依存変更時は対応するmanifestを編集してlockfileを再生成し、監査・検証する。
Pythonは `requirements.in` を正本として以下を実行する。通常更新では `--exclude-newer` に実行日の7日前のUTC日時を指定する。

```sh
uv pip compile requirements.in --generate-hashes --output-file requirements.txt --python-version 3.11 --exclude-newer <UTC日時>
```
