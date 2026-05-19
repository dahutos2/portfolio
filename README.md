# ポートフォリオサイト

このプロジェクトは **Vite + Vue 3 + TypeScript + Tailwind CSS** によるモダンなポートフォリオサイトです。  
**2 種類のデータソース** から動的データを生成し、GitHub Actions により自動デプロイされます。

## 特徴

- **GitHub Actions CI/CD**
  - データ収集・ビルド・デプロイを自動化
- データは以下 2 種類から構成
  - GitHub / WakaTime など外部 API から収集する動的データ
  - `portfolio.config.yml` に記述された手動管理データ（サービス・タイムライン・実績など）

## データの流れ

1. **GitHub Actions の fetch-data ワークフロー**
   - Python スクリプトが以下を取得
     - GitHub API → リポジトリ情報、スター数、言語比率など
     - WakaTime API → コーディング時間
   - `portfolio.config.yml` の内容（サービス・タイムライン・実績・推薦文）を JSON に変換
   - これらを `public/data/` に JSON として出力  
     → 例：`public/data/metrics.json`, `public/data/services.json`, `public/data/user.json`

2. **GitHub Actions の deploy-pages ワークフロー**
   - Vite でサイトをビルド（`dist/`）
   - GitHub Pages に自動デプロイ

## 開発方法

本プロジェクトは Node.js `24.15.0` と pnpm `10.33.0` を前提にしています。
バージョンは `.tool-versions`、`package.json` の `engines` / `packageManager`、CI で揃えています。

### 依存インストール

```bash
pnpm install --frozen-lockfile
```

依存関係を変更した場合だけ、lockfile を更新します。

```bash
pnpm install
pnpm audit --audit-level high
```

Python 依存を変更する場合は `requirements.in` を編集し、ハッシュ付きの `requirements.txt` を再生成します。

```bash
uv pip compile requirements.in --generate-hashes --output-file requirements.txt --python-version 3.11
```

### 開発サーバ起動

```bash
pnpm dev
```

### ビルド

```bash
pnpm run build
```

→ `dist/` に成果物が生成されます。

## デプロイ

デプロイは全自動で行われます：

- **fetch-data.yml** → 毎日 JST 11:00にデータを収集し、デプロイ先の`public/data/` のみ上書きする
- **deploy-pages.yml** → コードを変更すると自動でサイトをビルド・デプロイする

`fetch-data.yml` の `GH_PAT` は、`/user/repos?visibility=all` で private リポジトリも集計するために使います。fine-grained PAT を使う場合は対象リポジトリを絞り、Metadata read-only を最小権限として設定します。
