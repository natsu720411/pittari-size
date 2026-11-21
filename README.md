# ぴったりサイズ

本番サイト：https://pittari-size.vercel.app/

用紙8種・封筒7種・写真プリント3種・はがき・名刺のサイズ解説と、無料の計算ツール6種を提供する静的HTML/CSS/JSサイト。

## Google Search Console

1. https://search.google.com/search-console/ にアクセス
2. URLプレフィックス `https://pittari-size.vercel.app/` を追加する
3. Googleが発行する固有のHTMLファイルまたはメタタグを使って所有権を確認する（確認コードの取得前に偽の値を入れない）
4. `https://pittari-size.vercel.app/sitemap.xml` を送信し、インデックス状況を確認する

## AdSense

現在は広告未導入。承認前に仮の広告タグやpublisher IDを設置しないこと。申請に必要な広告主側のアカウント・審査はサイト所有者が実施する。
編集方針は `/policy/`、お問い合わせは `/contact/`。

## ローカル確認

`python -m http.server 8000`

## 2026-11-22 — JIS用紙規格・逆引き拡充

- A0〜A8・JIS B0〜B8の規格寸法を一覧に掲載（18種類）
- 測った縦横から近い規格を調べる `/tools/paper-finder/`
- コピー倍率・A判とB判の違いのガイドを追加
- JIS規格寸法の参考: https://k-cr.jp/support/spec/paper/ および https://www.aik.co.jp/02support/03nyukou/06kamiwari.html
- Search Consoleの無料公式画面だけでも運用可能。Windsor.aiは必須ではない

## 写真の縦横比とトリミング（2026-11-22）

- `/tools/aspect-ratio/` 画像ピクセル数の最大公約数から縦横比を計算
- `/tools/photo-crop/` L判・2L判・KG判などの中央配置のトリミング率または余白を概算
- `/guides/photo-aspect-ratios/` 比率の考え方
- `/guides/l-print-crop/` L判へ4:3/3:2/16:9を印刷する場合の計算例

いずれもブラウザ内で計算し、画像ファイルをアップロードしない。
中央配置の幾何学的な見積もりのため、印刷サービス固有の仕上げと差が生じる。

## 2026-11-22 面付け・印刷配置計算

- `tools/imposition/` 同一の仕上がり寸法のものを縦横いずれかの一定方向に等間隔で配置する計算ツール。
- `guides/a4-business-card-layout/` A4名刺10面配置（91×55mm、余白5mm、間隔2mm）。
- `guides/a4-photo-layout/` A4にL判4枚（89×127mm、余白5mm、間隔3mm）。
- `guides/a4-postcard-layout/` はがき100×148mmをA4に配置し、余白が枚数に与える違い。

**重要な制限**：面付けは同じ方向にそろえる行列配置を2方向だけ比較。印刷物を混在回転させる最適化は行わない。実際の裁断・塗り足し・印字可能範囲の計算や、印刷テンプレート／PDFの作成は行わない。
