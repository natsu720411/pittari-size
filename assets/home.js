(()=>{"use strict";
const SEARCH_INDEX=[{"name":"A2サイズ","url":"/paper/a2/","hint":"420×594mm"},{"name":"A3サイズ","url":"/paper/a3/","hint":"297×420mm"},{"name":"A4サイズ","url":"/paper/a4/","hint":"210×297mm"},{"name":"A5サイズ","url":"/paper/a5/","hint":"148×210mm"},{"name":"A6サイズ","url":"/paper/a6/","hint":"105×148mm"},{"name":"B4サイズ","url":"/paper/b4/","hint":"257×364mm"},{"name":"B5サイズ","url":"/paper/b5/","hint":"182×257mm"},{"name":"B6サイズ","url":"/paper/b6/","hint":"128×182mm"},{"name":"角形2号（角2）","url":"/envelope/kaku2/","hint":"A4を折らずに封入"},{"name":"角形3号（角3）","url":"/envelope/kaku3/","hint":"B5を折らずに封入"},{"name":"角形4号（角4）","url":"/envelope/kaku4/","hint":"B5を折らずに封入"},{"name":"長形3号（長3）","url":"/envelope/chou3/","hint":"A4を三つ折り"},{"name":"長形4号（長4）","url":"/envelope/chou4/","hint":"B5を細長く四つ折り"},{"name":"長形40号（長40）","url":"/envelope/chou40/","hint":"A4を細長く四つ折り"},{"name":"洋形2号（洋2）","url":"/envelope/you2/","hint":"招待状・カード"},{"name":"封筒ぴったり検索","url":"/tools/envelope-finder/","hint":"用紙サイズと折り方から、入りそうな封筒を探す"},{"name":"mm・cm・インチ換算","url":"/tools/units/","hint":"入力した長さをまとめて単位変換する"},{"name":"ピクセル・DPI換算","url":"/tools/dpi/","hint":"画像を印刷したときの寸法を計算する"},{"name":"用紙サイズ比較","url":"/tools/compare/","hint":"2つの用紙の面積と縦横寸法を比較する"},{"name":"A4が入る封筒は？折らない場合と三つ折りの場合","url":"/guides/a4-envelope/","hint":"ガイド"},{"name":"B5が入る封筒は？角3・角4の寸法を比較","url":"/guides/b5-envelope/","hint":"ガイド"},{"name":"A4とB5の違いは？サイズ・面積・使い道","url":"/guides/a4-vs-b5/","hint":"ガイド"},{"name":"DPIとピクセルの違い・印刷サイズの計算方法","url":"/guides/print-dpi/","hint":"ガイド"},{"name":"L判写真","url":"/photo/l/","hint":"アルバムや家庭写真に使いやすい標準的な写真プリント。日常のスナップ写真を整理したり、小さな写真立てに入れたりする場合によく利用されます。","keywords":"L判 サイズ"},{"name":"2L判写真","url":"/photo/2l/","hint":"L判より大きな写真プリント。記念写真やフォトフレームに飾る写真などに向き、写真の細部を見やすくしたいときに使われます。","keywords":"2L判 サイズ"},{"name":"KG判写真","url":"/photo/kg/","hint":"はがきに近い大きさの写真プリント。L判より少し大きめで、カード風に写真を残す用途にも使われます。","keywords":"KG判 サイズ"},{"name":"郵便はがき","url":"/print/postcard/","hint":"一般的な郵便はがきの大きさ。年賀状や案内状、私製はがきのデザインを作るときの目安になります。","keywords":"郵便はがき 印刷"},{"name":"一般的な日本の名刺","url":"/print/business-card/","hint":"日本で使われる名刺の定番の仕上がり寸法。ビジネス名刺やショップカードを作る際の基本となる大きさです。","keywords":"一般的な日本の名刺 印刷"},{"name":"L判と2L判の違い｜寸法・面積・選び方","url":"/guides/l-vs-2l/","hint":"写真・印刷ガイド"},{"name":"KG判と郵便はがきの違い｜寸法は同じ？","url":"/guides/kg-vs-postcard/","hint":"写真・印刷ガイド"},{"name":"スマホ写真をL判に印刷すると端が切れる理由","url":"/guides/photo-trimming/","hint":"写真・印刷ガイド"},{"name":"名刺の一般的なサイズと印刷データの作り方","url":"/guides/business-card-design/","hint":"写真・印刷ガイド"},{"name":"必要ピクセル数計算","url":"/tools/print-pixels/","hint":"L判 2L判 KG はがき 名刺 A4 DPI"},{"name":"拡大縮小倍率","url":"/tools/scale/","hint":"A4 A5 印刷 倍率"},{"name":"A0サイズ","url":"/paper/a0/","hint":"841×1189mm","keywords":"A0 何cm 大きさ JIS 規格"},{"name":"A1サイズ","url":"/paper/a1/","hint":"594×841mm","keywords":"A1 何cm 大きさ JIS 規格"},{"name":"A7サイズ","url":"/paper/a7/","hint":"74×105mm","keywords":"A7 何cm 大きさ JIS 規格"},{"name":"A8サイズ","url":"/paper/a8/","hint":"52×74mm","keywords":"A8 何cm 大きさ JIS 規格"},{"name":"B0サイズ","url":"/paper/b0/","hint":"1030×1456mm","keywords":"B0 何cm 大きさ JIS 規格"},{"name":"B1サイズ","url":"/paper/b1/","hint":"728×1030mm","keywords":"B1 何cm 大きさ JIS 規格"},{"name":"B2サイズ","url":"/paper/b2/","hint":"515×728mm","keywords":"B2 何cm 大きさ JIS 規格"},{"name":"B3サイズ","url":"/paper/b3/","hint":"364×515mm","keywords":"B3 何cm 大きさ JIS 規格"},{"name":"B7サイズ","url":"/paper/b7/","hint":"91×128mm","keywords":"B7 何cm 大きさ JIS 規格"},{"name":"B8サイズ","url":"/paper/b8/","hint":"64×91mm","keywords":"B8 何cm 大きさ JIS 規格"},{"name":"A判とB判の違い｜JIS用紙サイズを比較","url":"/guides/paper-a-b-standard/","hint":"A4・B5など日本で使われる用紙寸法の違いと、ISO B判との注意点を整理します。"},{"name":"A4をA3・A5・B5へ拡大縮小する倍率は？","url":"/guides/a4-enlargement/","hint":"A4からA3への拡大は約141％、A5への縮小は約70％。B5へ印刷する場合の倍率と注意も紹介します。"},{"name":"用紙サイズを寸法から逆引き","url":"/tools/paper-finder/","hint":"何判 用紙 サイズ 不明 縦 横 mm","keywords":"A B サイズ検索"},{"name":"画像の縦横比計算","url":"/tools/aspect-ratio/","hint":"アスペクト比 4:3 16:9 3:2 画像幅 高さ"},{"name":"写真トリミング計算","url":"/tools/photo-crop/","hint":"L判 2L判 KG判 フチなし 写真 端 切れる"},{"name":"4:3 16:9 3:2の違い","url":"/guides/photo-aspect-ratios/","hint":"縦横比 アスペクト比 スマホ 写真"},{"name":"L判のトリミング比較","url":"/guides/l-print-crop/","hint":"画像 4:3 16:9 印刷 切れる 割合"},{"name":"印刷の面付け・枚数計算","url":"/tools/imposition/","hint":"A4 名刺 10面 L判 はがき 配置 何枚"},{"name":"A4に名刺は何枚？91×55mmの10面付けと余白","url":"/guides/a4-business-card-layout/","hint":"A4用紙に標準名刺を2列×5行の10面配置する条件や、塗り足し・カット時の注意を解説。"},{"name":"A4にL判写真は何枚入る？4枚配置と印刷時の注意","url":"/guides/a4-photo-layout/","hint":"89×127mmのL判写真をA4へ4枚並べる例と、余白・トリミング・画像の解像度を解説。"},{"name":"A4にはがきは何枚入る？2枚・4枚になる条件","url":"/guides/a4-postcard-layout/","hint":"100×148mmの郵便はがきをA4に面付けする場合、余白ゼロでは4枚、余白5mmでは2枚になる条件を解説。"},{"name":"画像の印刷画質チェック","url":"/tools/image-print-check/","hint":"写真 ファイル 画素数 PPI 解像度 印刷できる 大きさ JPEG PNG A4 L判","keywords":"画像 アップロードしない 画質 300ppi"},{"name":"PPIとDPIの違い｜写真を300PPIで印刷するには？","url":"/guides/image-ppi-print/","hint":"画像データのPPIとプリンターのDPIの違い、300PPIの計算方法、トリミング時の注意点を解説。"},{"name":"画像をA4で印刷するときの画素数｜1920×1080・1200万画素なら？","url":"/guides/image-a4-print/","hint":"A4印刷に必要な画素数の目安を300PPIで計算。フルHD写真や4032×3024px画像で違いを確認。"},{"name":"ぴったりサイズ・トップページ","url":"/","hint":"用紙・封筒・写真・印刷の大きさを調べる"},{"name":"サイトについて","url":"/about/","hint":"ぴったりサイズの目的"},{"name":"お問い合わせ・修正提案","url":"/contact/","hint":"誤記や改善提案の連絡先"},{"name":"封筒サイズ一覧","url":"/envelope/","hint":"角2・長3など封筒の外寸"},{"name":"お役立ちガイド一覧","url":"/guides/","hint":"用紙・封筒・写真印刷の説明"},{"name":"用紙サイズ一覧","url":"/paper/","hint":"A0〜A8・JIS B0〜B8"},{"name":"写真プリントサイズ一覧","url":"/photo/","hint":"L判・2L判・KG判"},{"name":"情報の根拠・編集方針","url":"/policy/","hint":"サイズの出典と計算方法"},{"name":"はがき・名刺サイズ一覧","url":"/print/","hint":"郵便はがき・名刺の寸法"},{"name":"プライバシーポリシー","url":"/privacy/","hint":"データの取り扱い"},{"name":"無料計算ツール一覧","url":"/tools/","hint":"サイズ・画像・印刷の便利ツール"},{"name":"すべてのページ一覧","url":"/all-pages/","hint":"用紙 封筒 写真 サイズ 計算 ツール ガイド 全ページから探す"},{"url":"/tools/print-pdf/","name":"印刷用PDF作成","hint":"名刺・写真・はがきの裁断ガイド付きPDF"},{"url":"/tools/actual-size/","name":"実寸印刷チェック","hint":"100mmテストPDFで倍率を確認"},{"url":"/tools/overlay/","name":"用紙の重ね合わせ比較","hint":"A4・B5・A5を同じ縮尺で表示"},{"url":"/tools/bleed/","name":"塗り足し・裁断サイズ計算","hint":"入稿画像のmm・pxと安全余白"},{"url":"/guides/print-edges-cut/","name":"A4印刷で端が切れる原因","hint":"余白・倍率・フチなし設定"},{"url":"/guides/pdf-scaled-down/","name":"PDFが小さく印刷される原因","hint":"実際のサイズ100%の確認"},{"url":"/guides/print-blurry/","name":"写真印刷がぼやける原因","hint":"PPI・画素数・画質設定"},{"url":"/favorites/","name":"お気に入り・最近見たページ","hint":"保存済みの用紙・写真・計算ツールを開く"},{"name":"用紙の折り方・封筒シミュレーター","url":"/tools/fold-simulator/","hint":"A4 B5 三つ折り 四つ折り 長3 封筒"},{"name":"A4三つ折りの寸法と長3封筒","url":"/guides/a4-trifold-envelope/","hint":"A4 三つ折り99×210mm 封筒 長形3号"},{"name":"A4ラベル・丸シール印刷PDF作成","url":"/tools/label-print/","hint":"宛名 収納 商品 シール A4 丸 文字 ラベル作成"},{"name":"コンビニでPDF・写真を印刷する方法","url":"/guides/convenience-print/","hint":"セブン ファミマ ローソン PDF 写真"},{"name":"セブン‐イレブンでPDF・写真を印刷","url":"/guides/seven-print-pdf/","hint":"ネットプリント A4 倍率 写真"},{"name":"ファミリーマートでPDF・写真を印刷","url":"/guides/familymart-print-pdf/","hint":"ネットワークプリント マルチコピー"},{"name":"ローソンでPDF・写真を印刷","url":"/guides/lawson-print-pdf/","hint":"PrintSmash PDF マルチコピー"},{"url":"/guides/label-sheet-alignment/","name":"ラベルの印刷位置がずれるとき","hint":"開始位置・ピッチ・補正量を実例で解説 印刷ずれ ラベルシール Excel CSV"},{"url":"/guides/csv-label-print/","name":"CSVで宛名ラベルを一括印刷","hint":"ExcelやCSVから文字の異なるラベルを作成 印刷ずれ ラベルシール Excel CSV"}];
const normalize=s=>String(s).normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();
const items=SEARCH_INDEX.map((item,i)=>({...item,normalName:normalize(item.name),haystack:normalize(item.name+" "+item.hint+" "+(item.keywords||"")),order:i}));
function hits(query,limit=18){
 const terms=normalize(query).split(" ").filter(Boolean);
 if(!terms.length){
  const popular=["/paper/a4/","/tools/image-print-check/","/tools/label-print/","/tools/envelope-finder/","/photo/l/","/all-pages/"];
  return popular.map(path=>items.find(x=>x.url===path)).filter(Boolean).slice(0,limit);
 }
 const phrase=terms.join(" ");
 return items.filter(item=>terms.every(term=>item.haystack.includes(term))).map(item=>({
  item,score:(item.normalName===phrase?100:0)+(item.normalName.startsWith(phrase)?30:0)+terms.filter(term=>item.normalName.includes(term)).length*10
 })).sort((a,b)=>b.score-a.score||a.item.order-b.item.order).slice(0,limit).map(x=>x.item)
}
function link(item,className){
 const a=document.createElement("a");a.href=item.url;if(className)a.className=className;
 const title=document.createElement("strong");title.textContent=item.name;
 const hint=document.createElement("small");hint.textContent=item.hint;
 a.append(title,hint);return a
}
const input=document.getElementById("siteSearch"),suggest=document.getElementById("suggest");
if(input&&suggest){
 input.setAttribute("autocomplete","off");
 input.setAttribute("aria-controls","suggest");
 
 suggest.setAttribute("aria-live","polite");
 function showSuggestions(){
  const query=input.value.trim(),results=query?hits(query,9):[];
  suggest.replaceChildren();
  results.forEach(item=>{
   const a=document.createElement("a");a.href=item.url;a.className="home-suggest-item";
   const span=document.createElement("span");span.textContent=item.name;
   const small=document.createElement("small");small.textContent=item.hint;
   a.append(span,small);suggest.append(a)
  });
  suggest.hidden=!results.length;
  
 }
 function firstMatch(){const found=hits(input.value,1);if(input.value.trim()&&found.length)location.assign(found[0].url)}
 input.addEventListener("input",showSuggestions);
 input.addEventListener("keydown",event=>{
  if(event.key==="Enter"){event.preventDefault();firstMatch()}
  if(event.key==="Escape"){suggest.hidden=true;}
  if(event.key==="ArrowDown"){const first=suggest.querySelector("a");if(first){event.preventDefault();first.focus()}}
 });
 suggest.addEventListener("keydown",event=>{
  if(event.key==="Escape"){event.preventDefault();suggest.hidden=true;input.focus()}
  if(event.key==="ArrowUp"||event.key==="ArrowDown"){
   const links=[...suggest.querySelectorAll("a")],idx=links.indexOf(document.activeElement);
   if(idx<0)return;
   event.preventDefault();
   if(event.key==="ArrowUp"&&idx===0)input.focus();
   else links[Math.max(0,Math.min(links.length-1,idx+(event.key==="ArrowDown"?1:-1)))].focus()
  }
 });
 document.getElementById("searchButton")?.addEventListener("click",firstMatch);
 document.addEventListener("click",event=>{if(!event.target.closest(".search")){suggest.hidden=true;}});
}
const header=document.querySelector("header .header");
if(header&&typeof HTMLDialogElement!=="undefined"){
 const launch=document.createElement("button");launch.type="button";launch.className="global-search-trigger";launch.textContent="⌕ 検索";
 launch.setAttribute("aria-label","サイト内検索を開く");launch.setAttribute("aria-haspopup","dialog");
 launch.setAttribute("aria-keyshortcuts","Control+K Meta+K /");header.append(launch);
 const dialog=document.createElement("dialog");dialog.className="global-search-dialog";dialog.setAttribute("aria-label","サイト内検索");
 dialog.innerHTML='<div class="global-search-box"><div class="global-search-top"><label for="globalSearchInput">サイト内検索</label><button type="button" class="global-search-close" aria-label="検索を閉じる">×</button></div><input id="globalSearchInput" type="search" autocomplete="off" placeholder="A4、名刺、画像の画質、DPI…" aria-controls="globalSearchResults"><p class="global-search-note">ページ名・用途・サイズで検索できます。</p><div id="globalSearchResults" class="global-search-results" aria-live="polite"></div></div>';
 document.body.append(dialog);
 const field=dialog.querySelector("input"),results=dialog.querySelector("#globalSearchResults");
 function render(){
  const found=hits(field.value);
  results.replaceChildren();
  if(!found.length){const p=document.createElement("p");p.className="global-search-empty";p.textContent="該当するページがありません。別の言葉で検索してください。";results.append(p);return}
  for(const item of found)results.append(link(item,"global-search-item"))
 }
 function openSearch(){if(dialog.open)return;field.value="";render();dialog.showModal();field.focus()}
 launch.addEventListener("click",openSearch);
 dialog.querySelector(".global-search-close").addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
 field.addEventListener("input",render);
 field.addEventListener("keydown",event=>{
  if(event.key==="Enter"){const first=results.querySelector("a");if(first){event.preventDefault();location.assign(first.href)}}
  if(event.key==="ArrowDown"){const first=results.querySelector("a");if(first){event.preventDefault();first.focus()}}
 });
 results.addEventListener("keydown",event=>{
  if(event.key!=="ArrowDown"&&event.key!=="ArrowUp")return;
  const a=[...results.querySelectorAll("a")],idx=a.indexOf(document.activeElement);if(idx<0)return;
  event.preventDefault();
  if(event.key==="ArrowUp"&&idx===0)field.focus();else a[Math.max(0,Math.min(a.length-1,idx+(event.key==="ArrowDown"?1:-1)))].focus()
 });
 document.addEventListener("keydown",event=>{
  const editable=event.target?.matches?.("input,textarea,select,[contenteditable='true']");
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();openSearch();return}
  if(event.key==="/"&&!editable&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!dialog.open){event.preventDefault();openSearch()}
 });
 dialog.addEventListener("close",()=>launch.focus());
}
const main=document.querySelector("main");
if(main&&!main.id)main.id="mainContent";
if(!document.querySelector(".skip-to-content")){
 const a=document.createElement("a");a.className="skip-to-content";a.href="#mainContent";a.textContent="本文へ移動";document.body.prepend(a)
}
if(!document.querySelector(".mobile-tab-nav")){
 const nav=document.createElement("nav");nav.className="mobile-tab-nav";nav.setAttribute("aria-label","スマホ用ナビゲーション");
 for(const [url,symbol,label]of [["/","⌂","ホーム"],["/paper/","▤","用紙"],["/envelope/","✉","封筒"],["/photo/","▧","写真"],["/tools/","▦","ツール"]]){
  const a=document.createElement("a");a.href=url;a.className="mobile-tab";
  if(url==="/")a.setAttribute("aria-current","page");
  const mark=document.createElement("span");mark.className="mobile-tab-icon";mark.setAttribute("aria-hidden","true");mark.textContent=symbol;
  const text=document.createElement("span");text.textContent=label;a.append(mark,text);nav.append(a)
 }
 const searchButton=document.createElement("button");searchButton.type="button";searchButton.className="mobile-tab";searchButton.setAttribute("aria-label","サイト内を検索");
 const mark=document.createElement("span");mark.className="mobile-tab-icon";mark.setAttribute("aria-hidden","true");mark.textContent="⌕";
 const text=document.createElement("span");text.textContent="検索";searchButton.append(mark,text);
 searchButton.addEventListener("click",()=>{const trigger=document.querySelector(".global-search-trigger");if(trigger)trigger.click();else location.assign("/all-pages/")});
 nav.append(searchButton);document.body.append(nav)
}
// Recent pages are drawn only from browser-local data; no analytics or remote requests.
const recent=document.getElementById("homeRecent"),recentList=document.getElementById("homeRecentList");
if(recent&&recentList){
 try{
  const rows=JSON.parse(localStorage.getItem("pittari:recent:v1")||"[]");
  const valid=Array.isArray(rows)?rows.filter(x=>x&&typeof x.path==="string"&&/^\/(paper|envelope|photo|print|tools|guides)\/[a-z0-9-]+\/$/.test(x.path)&&typeof x.name==="string").slice(0,4):[];
  for(const item of valid){
   const a=document.createElement("a");a.href=item.path;a.className="card";
   const name=document.createElement("strong");name.textContent=item.name.slice(0,80);
   const hint=document.createElement("small");hint.textContent="最近見たページ";
   a.append(name,hint);recentList.append(a)
  }
  if(valid.length)recent.hidden=false
 }catch{}
}
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1")){
 window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}),{once:true});
}
})();