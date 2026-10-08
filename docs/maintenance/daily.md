# 日次点検

日次実行だけで読む。開始時の共通ルールは[入口](../maintenance.md)を参照済みとして重複読込みしない。

1. 最初に `portfolio.config.yml` の経歴の最終時点・担当範囲・成果、サービスとの対応、掲載実績を確認し、未掲載の可能性と事実未確認を分ける。中央 `managed-project-context` のportfolio入口からローカル履歴の手順を読み、不足項目に関係する会話を優先し、新着と未処理の過去分から掲載候補を確認する。抽出情報は指定のGit外領域に保持し、このリポジトリ・PR・ログへ会話を転載しない。未処理件数を残し、履歴処理が未完了でもCI確認を行う。
2. staged・unstaged・untracked、リモートmain、未完了PR、専用DBの候補・判断状況を確認する。無関係な変更を保護し、ローカル変更を公開済みと扱わない。
3. `bash scripts/maintenance-check.sh` で最新mainのCIと公開 `build.json` を取得する。スクリプトが通信制限などで失敗したら再実行せず、GitHubコネクタで最新mainのCI runと公開状態を確認し、取得不能なら環境ブロックとして記録する。依存監査は11:00 JSTのmain Portfolio workflowを優先する。mainの当日runから入力hashまで一致するartifact/logが得られない場合は、同じrepositoryの当日Portfolio workflow run（PR含む）も調べ、監査commandが期待値と一致し、run metadata/attemptを記録でき、依存入力のSHA256が現在のcheckoutと一致する結果だけ代用する。GitHubコネクタでartifact `pnpm-audit-<run_id>-<attempt>` を取得し、JSONのcommit・run・入力SHA256を検証する。artifactを読めない場合は `Audit dependencies` のjob logにある `PNPM_AUDIT_REPORT_JSON=` 行から同一の要約を解析する。入力hash不一致、古いrun、複数結果間の矛盾は使わず、該当する当日artifact/logがない場合だけ現在のlockfileへ `pnpm audit --audit-level high --json` を一度実行する。通信失敗は再実行せず、未確認として記録する。
4. CI artifactまたはjob logでは `classification`、`exit_code`、全severity件数、high/criticalのadvisory・影響版・修正版・全依存経路を解析する。GitHub Advisory・upstream/npmの照合対象を各highまたはcritical findingから取り出し、依存経路を完全に確認する。監査run URL・JST日時・commit SHA・artifact名を示す。古い成功、別repositoryのrun、main優先後の同日PR fallback条件を満たさないbranch、異なる入力SHAの結果を使わず、監査成功とCI全体の成功も混同しない。公開状態のSHA・生成時刻は別に照合する。
5. Node・pnpm・Python・Actionsのサポート状況、依存の公式リリース・勧告、経歴・実績・サービス・掲載リポジトリ・説明文・リンクの変化を確認する。変化なしも確認範囲を短く残す。日曜だけ全リンク、表示、アクセシビリティ、生成経路へ広げる。表示の主張は実ブラウザで確認する。
6. 既存PRのhead・CI・レビュー・マージ・公開状態に変化があれば[承認後の作業](delivery.md)の該当段階へ進む。掲載不足または候補があれば[更新提案](proposals.md)へ進み、会話からの推定を明示した掲載案を先に準備する。新規提案・重要な変化・失敗・利用者判断が必要な場合のみ通知する。同じ保留・承認待ち・却下済みを根拠変化なしに再通知しない。

## 読む量と引継ぎ

対象ファイルとログの該当ステップ・時刻だけ読む。全ログは一時ファイルに保存し、node_modules・生成物・全セッション・全バージョン履歴を列挙しない。監査成功の要約と根拠を区別する。

履歴の処理位置・候補・判断・通知済み状態は中央のportfolio専用手順が指定するGit外DBだけに保持する。PR・CI・公開状態は毎回実際の情報源で確認し、DBや古いスレッドの状態で代用しない。標準automation memoryは読取り・更新・移行元に使わない。通知の照合・記録は同じ中央手順に従い、別台帳を作らない。承認原文は参照先のスレッドで必要時だけ確認し、参照不能ならそのスレッドでの回答を案内する。

PC・アプリ・リポジトリ・認証が利用可能であることが実行条件。実スケジュールでの証拠取得は、対話実行やCI成功とは別に確認する。
