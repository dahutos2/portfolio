# ADR 0001: `braces` の再帰深度を制限する

- 状態: 採択（一時緩和策）
- 決定日: 2026-10-07

## 背景

`braces@3.0.3` はTailwind CSS、`globby`、`unplugin-vue-components`などの開発・ビルド依存から間接的に入る。`braces`自体は直接依存ではない。GitHub Advisory Databaseは、深くネストしたパターンで再帰処理のスタックを枯渇させる問題について `<=3.0.3` を影響対象とし、修正版を掲載していない。npmが示す公開版も `3.0.3`。これらは2026-10-07に確認した。

問題箇所は再帰的なパーサーとAST走査処理にある。このリポジトリでは、法務ページ生成時に`globby`でチェックイン済みMarkdownを列挙しており、globはスクリプト内で固定されている。確認した依存経路は開発・ビルド用で、アプリケーションの直接依存ではない。

## 決定

既存のビルドツールを維持し、`pnpm.patchedDependencies`で`braces@3.0.3`に一時パッチを適用する。パッチは[上流PR #72](https://github.com/micromatch/braces/pull/72)のcommit `28d440b5dd449dbf1fe6f3506cf94ecca4d02660`にある深度ガードを参考にし、パーサーとAST走査の深度を100に制限する。CIでは上限と通常パターンの挙動を回帰テストする。

確認時点でPR #72はcloseされ、mergeされていない。したがって、このパッチはコミュニティ提案を元にした独自バックポートであり、メンテナーが公開・採用した修正版ではない。

このAdvisoryを監査設定で無視しない。`pnpm audit`は公開されたパッケージ版を識別するため、ローカルパッチを適用してもlockfileに`3.0.3`が残る間はこのfindingを報告する。監査結果は未解決として報告し、Advisoryが解消したとは扱わない。

## 検討した選択肢

- **緩和せず公式リリースを待つ:** 即時対応としては採用しない。Advisoryに修正版がなく、再帰処理の問題が残るため。
- **`braces`へ至る依存経路をすべて削除する:** 現時点では採用しない。Tailwind CSSやコンポーネント検出などのビルドツールを置き換える大きな変更になる。直接依存の`globby`だけを外しても、ほかの経路は残る。
- **監査設定でfindingを無視する:** 採用しない。パッケージの脆弱性検出を隠し、コードやlockfile上の版を変えないままCIを成功表示させるため。

## 影響と見直し

- ローカルパッチの由来コメント、patchファイル、回帰テストを一緒に保守する。
- 上流PRがmergeされていないため、上流メンテナーの承認は得られていない。このリポジトリの回帰テストと検証結果を根拠にし、上流から異なる修正が出た場合も見直す。
- パッケージまたはAdvisoryの公式情報に修正版が載るか、影響する依存経路を除去するまで、依存監査はこのfindingにより成功しない。
- 上流の修正版が公開されたら、配布物とAdvisoryの影響範囲を照合してからlockfileを更新する。修正版を確認できた場合に限り、ローカルパッチと不要になったテストを除去し、監査でfindingが消えたことを確認する。
- ビルド処理が未信頼ユーザーにbraceパターンを渡させるようになった場合は、早めにリスクを再評価する。現状の法務Markdown列挙に対するglobは固定されている。

## 決定時の根拠

- [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): 影響版 `<=3.0.3`、修正版なし。2026-10-07確認。
- [npm `braces`](https://www.npmjs.com/package/braces): 公開版 `3.0.3`。2026-10-07確認。
- [micromatch/braces PR #72](https://github.com/micromatch/braces/pull/72): close済み、`merged_at`なし。2026-10-07確認。
- `node --test tests/braces-security.test.mjs`: 4件成功。
- パッチ適用時の`pnpm install --frozen-lockfile`、`pnpm run build:all`、`pnpm run test:site`、`git diff --check`は成功。`pnpm audit --audit-level high --json`は`braces@3.0.3`のhigh findingを報告。
