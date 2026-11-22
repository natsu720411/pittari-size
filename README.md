# ぴったりサイズ

本番サイト：https://pittari-size.vercel.app/

用紙18種・封筒7種・写真プリント3種、はがき・名刺の解説と無料の計算ツール15種類を提供する静的サイト。

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

## 2026-11-22 — 画像の印刷PPI確認

- `tools/image-print-check/`：画像を選択し、端末内で縦横ピクセル数を読み取って各用紙サイズでのPPIを試算（画像データのサーバー送信はしない）。
- `guides/image-ppi-print/`：PPIとDPIの違い、300PPIの目安。
- `guides/image-a4-print/`：A4印刷に必要な画素数を計算。

画像の選択はブラウザ内で行い、JPEG/PNG/WebPなどの画像形式に対応。HEIC/HEIFの読取可否はブラウザに依存する。50MBより大きいファイルは拒否。
PPI判定は画質や印刷業者の入稿可否の保証ではない。
参考：https://canon.jp/biz/product/printer/imageprograf/graphic-photo/essentials2018/print-tips

## 2026-11-22 — 全ページ検索と一覧

- `/all-pages/`：カテゴリ別の静的HTML一覧。JavaScript無効でもリンクをたどれる。
- 全ページのヘッダーに検索ボタンを追加。Ctrl/⌘+Kまたは入力欄以外で「/」で検索。検索候補のキーボード操作に対応。
- 主要カテゴリページの静的ナビゲーション・フッターを統一。
- サイトマップ70 URL、検索対象70ページ。Googleへのインデックス登録とは異なる。

## 2026-11-22 — モバイル表示と関連計算の導線

- 600px以下の画面で下部に6項目のナビゲーション（ホーム・用紙・封筒・写真・ツール・検索）を表示。
- 30種類のサイズ詳細に「このサイズでできること」リンクを表示。主要9ページはHTMLにリンクを直接記述、残り21ページはJSで表示。
- `/tools/compare/?paper=a4` 等で比較ツールの初期用紙を選択できるように変更。
- フォームのタップ領域、本文の下余白、キーボード用スキップリンクを調整。サイトマップURL数は70のまま。

## 2026-11-22 — 印刷機能とユーザー向け機能の拡充

- `/tools/print-pdf/`: 名刺・写真・はがきをA4/A3/B5に配置する裁断補助付きPDF（300PPI、ブラウザ内で生成）。各ページに同じ枠を繰り返す。元画像は送信しない。
- `/tools/actual-size/`: A4の100mm線・50mm正方形を印刷して縮小を検証するPDF。
- `/tools/overlay/`: 最大3種類の用紙を同じ縮尺で重ねた図（SVG）。
- `/tools/bleed/`: 仕上がり、塗り足し、安全余白、PPIからmm・pxを求める計算。
- `/favorites/`: 最近見たページとお気に入りを端末のlocalStorageにURL・名称のみ保存。写真や入力値は保存しない。
- 印刷トラブルの解説3記事：`/guides/print-edges-cut/`、`/guides/pdf-scaled-down/`、`/guides/print-blurry/`。
- `node scripts/site-audit.cjs`: 78 HTMLページのメタタグ・canonical・リンク、JS構文、アセットの大きさを点検。GitHub Actionsがmainへのpush時とPR時に実行。

**印刷PDFの制限:** 配置は同方向の2パターンから選び、画像と裁断補助線を300PPIのJPEG画像として埋め込む。商業印刷用の塗り足し・トンボ、断裁精度、プリンターの印字可能領域は保証しない。実寸印刷はPDFビューアーで倍率100%を指定すること。

**SEO/速度:** PageSpeed Insights のLCP・INP・CLSは実測していない。静的検査と遅延スクリプト読込のみ実施。インデックス登録数や検索クリックはSearch Consoleで確認する。
