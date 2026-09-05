# 日次改善の入口

最初はこの入口だけを読む。手順は該当する一つだけ開く。共通規則は再記載しない。

| 今行うこと | 読む手順 |
| --- | --- |
| 日次・日曜点検 | [日次点検](maintenance/daily.md) |
| 候補の選定・提案 | [更新提案](maintenance/proposals.md) |
| 承認後のPR・公開確認 | [承認後の作業](maintenance/delivery.md) |

## 常に守る境界

日次は調査・ローカルの差分準備まで。commit・push・PR作成はそのターンの明示承認が必要。最終マージは利用者が行い、Codexはmerge・auto-merge設定・手動公開を行わない。保存された状態は承認ではない。

通信は共通・実行環境の権限内。プロジェクト設定で広げない。未取得・未検証を成功と扱わない。秘密情報、他プロジェクトの非公開情報、推測の経歴・推薦文を公開しない。

## 正本

時刻・モデルはスケジュール、公開処理は `.github/workflows/deploy-pages.yml`。掲載文は `portfolio.config.yml`、規約は `content/legal/`、動的情報は外部API。生成物 `public/data/`・`public/legal/`・`dist/` は編集・commitしない。規約のURL・本文、掲載内容、同一commit再公開時のキャッシュ更新を保持する。
