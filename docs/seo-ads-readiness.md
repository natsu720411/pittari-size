# SEO・Search Console・広告の準備

## 現在の状態
- Search Consoleはユーザーが所有権確認済み。クリック・表示回数などの実数値は現在取得できていないため、数値や改善結果を推測しない。
- サイトマップは https://pittari-size.vercel.app/sitemap.xml 。掲載URL数はGoogleのインデックス登録数ではない。
- ブラウザ内で計算・PDF生成を行い、写真をサイトのサーバーに送信しない。
- 広告タグ・トラッキングタグは追加しない。広告主IDやads.txtは正式に取得してから設定する。

## GSC の28日間チェック
1. https://search.google.com/search-console/ でサイトを選択し、検索結果のパフォーマンスを直近28日間にする。
2. 「クエリ」または「ページ」をCSVでエクスポートする。
3. リポジトリにCSVをコミットせず、自分のPC上で `node scripts/gsc-report.cjs <CSVファイル>` で集計する。
4. 表示回数が多く、掲載順位4〜25位、CTRの低いページを精査する。改善の効果は同じ期間・条件で比較する。
5. SEOではタイトルの重複や内部リンクと同時に、A4・B5・封筒の実寸、具体的な画像例など利用者の問題を解決する情報を優先する。

## 収益化までの確認
- /about/、/policy/、/privacy/、/contact/ の内容を確認する。
- 商業利用や画像・名称の権利、広告ポリシー、表示速度への影響を確認する。
- 広告の審査・アカウント連携・publisher ID取得はサイト所有者が公式手順で実施する。
- 必要な同意管理とプライバシー説明を整えた上で広告コードを導入する。承認前に空広告や架空IDは挿入しない。
- 読み込み速度はGitHub ActionsのLighthouseで計測する。LCPやCLSなど実ユーザーデータとは区別する。

参考：https://developers.google.com/search/docs/fundamentals/creating-helpful-content
