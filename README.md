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

### 依存インストール

```bash
npm install
```

### 開発サーバ起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

→ `dist/` に成果物が生成されます。

## デプロイ

デプロイは全自動で行われます：

- **fetch-data.yml** → 毎日 JST 11:00にデータを収集し、デプロイ先の`public/data/` のみ上書きする
- **deploy-pages.yml** → コードを変更すると自動でサイトをビルド・デプロイする
