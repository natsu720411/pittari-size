
(()=>{"use strict";const pp=[{"id":"a0","name":"A0","w":841,"h":1189},{"id":"a1","name":"A1","w":594,"h":841},{"id":"a2","name":"A2","w":420,"h":594},{"id":"a3","name":"A3","w":297,"h":420},{"id":"a4","name":"A4","w":210,"h":297},{"id":"a5","name":"A5","w":148,"h":210},{"id":"a6","name":"A6","w":105,"h":148},{"id":"a7","name":"A7","w":74,"h":105},{"id":"a8","name":"A8","w":52,"h":74},{"id":"b0","name":"B0","w":1030,"h":1456},{"id":"b1","name":"B1","w":728,"h":1030},{"id":"b2","name":"B2","w":515,"h":728},{"id":"b3","name":"B3","w":364,"h":515},{"id":"b4","name":"B4","w":257,"h":364},{"id":"b5","name":"B5","w":182,"h":257},{"id":"b6","name":"B6","w":128,"h":182},{"id":"b7","name":"B7","w":91,"h":128},{"id":"b8","name":"B8","w":64,"h":91}],ee=[{"id":"kaku2","name":"角形2号（角2）","w":240,"h":332},{"id":"kaku3","name":"角形3号（角3）","w":216,"h":277},{"id":"kaku4","name":"角形4号（角4）","w":197,"h":267},{"id":"chou3","name":"長形3号（長3）","w":120,"h":235},{"id":"chou4","name":"長形4号（長4）","w":90,"h":205},{"id":"chou40","name":"長形40号（長40）","w":90,"h":225},{"id":"you2","name":"洋形2号（洋2）","w":114,"h":162}],search=[{"name":"A2サイズ","url":"/paper/a2/","hint":"420×594mm"},{"name":"A3サイズ","url":"/paper/a3/","hint":"297×420mm"},{"name":"A4サイズ","url":"/paper/a4/","hint":"210×297mm"},{"name":"A5サイズ","url":"/paper/a5/","hint":"148×210mm"},{"name":"A6サイズ","url":"/paper/a6/","hint":"105×148mm"},{"name":"B4サイズ","url":"/paper/b4/","hint":"257×364mm"},{"name":"B5サイズ","url":"/paper/b5/","hint":"182×257mm"},{"name":"B6サイズ","url":"/paper/b6/","hint":"128×182mm"},{"name":"角形2号（角2）","url":"/envelope/kaku2/","hint":"A4を折らずに封入"},{"name":"角形3号（角3）","url":"/envelope/kaku3/","hint":"B5を折らずに封入"},{"name":"角形4号（角4）","url":"/envelope/kaku4/","hint":"B5を折らずに封入"},{"name":"長形3号（長3）","url":"/envelope/chou3/","hint":"A4を三つ折り"},{"name":"長形4号（長4）","url":"/envelope/chou4/","hint":"B5を細長く四つ折り"},{"name":"長形40号（長40）","url":"/envelope/chou40/","hint":"A4を細長く四つ折り"},{"name":"洋形2号（洋2）","url":"/envelope/you2/","hint":"招待状・カード"},{"name":"封筒ぴったり検索","url":"/tools/envelope-finder/","hint":"用紙サイズと折り方から、入りそうな封筒を探す"},{"name":"mm・cm・インチ換算","url":"/tools/units/","hint":"入力した長さをまとめて単位変換する"},{"name":"ピクセル・DPI換算","url":"/tools/dpi/","hint":"画像を印刷したときの寸法を計算する"},{"name":"用紙サイズ比較","url":"/tools/compare/","hint":"2つの用紙の面積と縦横寸法を比較する"},{"name":"A4が入る封筒は？折らない場合と三つ折りの場合","url":"/guides/a4-envelope/","hint":"ガイド"},{"name":"B5が入る封筒は？角3・角4の寸法を比較","url":"/guides/b5-envelope/","hint":"ガイド"},{"name":"A4とB5の違いは？サイズ・面積・使い道","url":"/guides/a4-vs-b5/","hint":"ガイド"},{"name":"DPIとピクセルの違い・印刷サイズの計算方法","url":"/guides/print-dpi/","hint":"ガイド"},{"name":"L判写真","url":"/photo/l/","hint":"アルバムや家庭写真に使いやすい標準的な写真プリント。日常のスナップ写真を整理したり、小さな写真立てに入れたりする場合によく利用されます。","keywords":"L判 サイズ"},{"name":"2L判写真","url":"/photo/2l/","hint":"L判より大きな写真プリント。記念写真やフォトフレームに飾る写真などに向き、写真の細部を見やすくしたいときに使われます。","keywords":"2L判 サイズ"},{"name":"KG判写真","url":"/photo/kg/","hint":"はがきに近い大きさの写真プリント。L判より少し大きめで、カード風に写真を残す用途にも使われます。","keywords":"KG判 サイズ"},{"name":"郵便はがき","url":"/print/postcard/","hint":"一般的な郵便はがきの大きさ。年賀状や案内状、私製はがきのデザインを作るときの目安になります。","keywords":"郵便はがき 印刷"},{"name":"一般的な日本の名刺","url":"/print/business-card/","hint":"日本で使われる名刺の定番の仕上がり寸法。ビジネス名刺やショップカードを作る際の基本となる大きさです。","keywords":"一般的な日本の名刺 印刷"},{"name":"L判と2L判の違い｜寸法・面積・選び方","url":"/guides/l-vs-2l/","hint":"写真・印刷ガイド"},{"name":"KG判と郵便はがきの違い｜寸法は同じ？","url":"/guides/kg-vs-postcard/","hint":"写真・印刷ガイド"},{"name":"スマホ写真をL判に印刷すると端が切れる理由","url":"/guides/photo-trimming/","hint":"写真・印刷ガイド"},{"name":"名刺の一般的なサイズと印刷データの作り方","url":"/guides/business-card-design/","hint":"写真・印刷ガイド"},{"name":"必要ピクセル数計算","url":"/tools/print-pixels/","hint":"L判 2L判 KG はがき 名刺 A4 DPI"},{"name":"拡大縮小倍率","url":"/tools/scale/","hint":"A4 A5 印刷 倍率"},{"name":"A0サイズ","url":"/paper/a0/","hint":"841×1189mm","keywords":"A0 何cm 大きさ JIS 規格"},{"name":"A1サイズ","url":"/paper/a1/","hint":"594×841mm","keywords":"A1 何cm 大きさ JIS 規格"},{"name":"A7サイズ","url":"/paper/a7/","hint":"74×105mm","keywords":"A7 何cm 大きさ JIS 規格"},{"name":"A8サイズ","url":"/paper/a8/","hint":"52×74mm","keywords":"A8 何cm 大きさ JIS 規格"},{"name":"B0サイズ","url":"/paper/b0/","hint":"1030×1456mm","keywords":"B0 何cm 大きさ JIS 規格"},{"name":"B1サイズ","url":"/paper/b1/","hint":"728×1030mm","keywords":"B1 何cm 大きさ JIS 規格"},{"name":"B2サイズ","url":"/paper/b2/","hint":"515×728mm","keywords":"B2 何cm 大きさ JIS 規格"},{"name":"B3サイズ","url":"/paper/b3/","hint":"364×515mm","keywords":"B3 何cm 大きさ JIS 規格"},{"name":"B7サイズ","url":"/paper/b7/","hint":"91×128mm","keywords":"B7 何cm 大きさ JIS 規格"},{"name":"B8サイズ","url":"/paper/b8/","hint":"64×91mm","keywords":"B8 何cm 大きさ JIS 規格"},{"name":"A判とB判の違い｜JIS用紙サイズを比較","url":"/guides/paper-a-b-standard/","hint":"A4・B5など日本で使われる用紙寸法の違いと、ISO B判との注意点を整理します。"},{"name":"A4をA3・A5・B5へ拡大縮小する倍率は？","url":"/guides/a4-enlargement/","hint":"A4からA3への拡大は約141％、A5への縮小は約70％。B5へ印刷する場合の倍率と注意も紹介します。"},{"name":"用紙サイズを寸法から逆引き","url":"/tools/paper-finder/","hint":"何判 用紙 サイズ 不明 縦 横 mm","keywords":"A B サイズ検索"},{"name":"画像の縦横比計算","url":"/tools/aspect-ratio/","hint":"アスペクト比 4:3 16:9 3:2 画像幅 高さ"},{"name":"写真トリミング計算","url":"/tools/photo-crop/","hint":"L判 2L判 KG判 フチなし 写真 端 切れる"},{"name":"4:3 16:9 3:2の違い","url":"/guides/photo-aspect-ratios/","hint":"縦横比 アスペクト比 スマホ 写真"},{"name":"L判のトリミング比較","url":"/guides/l-print-crop/","hint":"画像 4:3 16:9 印刷 切れる 割合"},{"name":"印刷の面付け・枚数計算","url":"/tools/imposition/","hint":"A4 名刺 10面 L判 はがき 配置 何枚"},{"name":"A4に名刺は何枚？91×55mmの10面付けと余白","url":"/guides/a4-business-card-layout/","hint":"A4用紙に標準名刺を2列×5行の10面配置する条件や、塗り足し・カット時の注意を解説。"},{"name":"A4にL判写真は何枚入る？4枚配置と印刷時の注意","url":"/guides/a4-photo-layout/","hint":"89×127mmのL判写真をA4へ4枚並べる例と、余白・トリミング・画像の解像度を解説。"},{"name":"A4にはがきは何枚入る？2枚・4枚になる条件","url":"/guides/a4-postcard-layout/","hint":"100×148mmの郵便はがきをA4に面付けする場合、余白ゼロでは4枚、余白5mmでは2枚になる条件を解説。"},{"name":"画像の印刷画質チェック","url":"/tools/image-print-check/","hint":"写真 ファイル 画素数 PPI 解像度 印刷できる 大きさ JPEG PNG A4 L判","keywords":"画像 アップロードしない 画質 300ppi"},{"name":"PPIとDPIの違い｜写真を300PPIで印刷するには？","url":"/guides/image-ppi-print/","hint":"画像データのPPIとプリンターのDPIの違い、300PPIの計算方法、トリミング時の注意点を解説。"},{"name":"画像をA4で印刷するときの画素数｜1920×1080・1200万画素なら？","url":"/guides/image-a4-print/","hint":"A4印刷に必要な画素数の目安を300PPIで計算。フルHD写真や4032×3024px画像で違いを確認。"},{"name":"ぴったりサイズ・トップページ","url":"/","hint":"用紙・封筒・写真・印刷の大きさを調べる"},{"name":"サイトについて","url":"/about/","hint":"ぴったりサイズの目的"},{"name":"お問い合わせ・修正提案","url":"/contact/","hint":"誤記や改善提案の連絡先"},{"name":"封筒サイズ一覧","url":"/envelope/","hint":"角2・長3など封筒の外寸"},{"name":"お役立ちガイド一覧","url":"/guides/","hint":"用紙・封筒・写真印刷の説明"},{"name":"用紙サイズ一覧","url":"/paper/","hint":"A0〜A8・JIS B0〜B8"},{"name":"写真プリントサイズ一覧","url":"/photo/","hint":"L判・2L判・KG判"},{"name":"情報の根拠・編集方針","url":"/policy/","hint":"サイズの出典と計算方法"},{"name":"はがき・名刺サイズ一覧","url":"/print/","hint":"郵便はがき・名刺の寸法"},{"name":"プライバシーポリシー","url":"/privacy/","hint":"データの取り扱い"},{"name":"無料計算ツール一覧","url":"/tools/","hint":"サイズ・画像・印刷の便利ツール"},{"name":"すべてのページ一覧","url":"/all-pages/","hint":"用紙 封筒 写真 サイズ 計算 ツール ガイド 全ページから探す"},{"url":"/tools/print-pdf/","name":"印刷用PDF作成","hint":"名刺・写真・はがきの裁断ガイド付きPDF"},{"url":"/tools/actual-size/","name":"実寸印刷チェック","hint":"100mmテストPDFで倍率を確認"},{"url":"/tools/overlay/","name":"用紙の重ね合わせ比較","hint":"A4・B5・A5を同じ縮尺で表示"},{"url":"/tools/bleed/","name":"塗り足し・裁断サイズ計算","hint":"入稿画像のmm・pxと安全余白"},{"url":"/guides/print-edges-cut/","name":"A4印刷で端が切れる原因","hint":"余白・倍率・フチなし設定"},{"url":"/guides/pdf-scaled-down/","name":"PDFが小さく印刷される原因","hint":"実際のサイズ100%の確認"},{"url":"/guides/print-blurry/","name":"写真印刷がぼやける原因","hint":"PPI・画素数・画質設定"},{"url":"/favorites/","name":"お気に入り・最近見たページ","hint":"保存済みの用紙・写真・計算ツールを開く"}];const g=id=>document.getElementById(id),format=(v,d=2)=>Number(v.toFixed(d)).toLocaleString("ja-JP"),row=(a,b)=>'<div class="result-row"><strong>'+a+'</strong><br><small>'+b+'</small></div>';
const q=g("siteSearch"),sg=g("suggest");const match=()=>{const v=(q?.value||"").trim().normalize("NFKC").toLowerCase();if(!v)return[];const terms=v.split(/[\s　]+/);return search.filter(x=>terms.every(term=>(x.name+" "+x.hint+" "+(x.keywords||"")).normalize("NFKC").toLowerCase().includes(term))).slice(0,9)};if(q){q.addEventListener("input",()=>{const m=q.value.trim()?match():[];sg.hidden=!m.length;sg.innerHTML=m.map(x=>'<a href="'+x.url+'"><span>'+x.name+'</span><small>'+x.hint+'</small></a>').join("")});const go=()=>{const m=match();if(m.length&&q.value.trim())location.href=m[0].url};g("searchButton").addEventListener("click",go);q.addEventListener("keydown",e=>{if(e.key==="Enter")go()});document.addEventListener("click",e=>{if(!e.target.closest(".search"))sg.hidden=true})}

const topBar=document.querySelector("header .header");
if(topBar&&typeof HTMLDialogElement!=="undefined"){
 const launch=document.createElement("button");launch.type="button";launch.className="global-search-trigger";launch.textContent="⌕ 検索";
 launch.setAttribute("aria-label","サイト内検索を開く");launch.setAttribute("aria-haspopup","dialog");launch.setAttribute("aria-keyshortcuts","Control+K Meta+K /");
 topBar.appendChild(launch);
 const dialog=document.createElement("dialog");dialog.className="global-search-dialog";dialog.setAttribute("aria-label","サイト内検索");
 dialog.innerHTML='<div class="global-search-box"><div class="global-search-top"><label for="globalSearchInput">サイト内検索</label><button type="button" class="global-search-close" aria-label="検索を閉じる">×</button></div><input id="globalSearchInput" type="search" autocomplete="off" placeholder="A4、名刺、画像の画質、DPI…" aria-controls="globalSearchResults"><p class="global-search-note">ページ名・用途・サイズで検索できます。</p><div id="globalSearchResults" class="global-search-results" aria-live="polite"></div></div>';
 document.body.appendChild(dialog);
 const field=dialog.querySelector("#globalSearchInput"),results=dialog.querySelector("#globalSearchResults");
 const normalize=s=>String(s).normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();
 const popular=["/paper/a4/","/tools/image-print-check/","/tools/imposition/","/tools/envelope-finder/","/photo/l/","/all-pages/"];
 function hits(q){
  const terms=normalize(q).split(" ").filter(Boolean);
  if(!terms.length)return popular.map(url=>search.find(item=>item.url===url)).filter(Boolean);
  return search.filter(item=>{
   const val=normalize(item.name+" "+item.hint+" "+(item.keywords||""));
   return terms.every(t=>val.includes(t));
  }).sort((a,b)=>{
   const score=x=>{const name=normalize(x.name),term=terms.join(" ");
   return (name===term?100:0)+(name.startsWith(term)?30:0)+terms.filter(t=>name.includes(t)).length*10};
   return score(b)-score(a);
  }).slice(0,18);
 }
 function render(){
  const match=hits(field.value);results.replaceChildren();
  if(!match.length){const p=document.createElement("p");p.className="global-search-empty";p.textContent="該当するページがありません。別の言葉で検索してください。";results.appendChild(p);return}
  for(const item of match){
   const a=document.createElement("a");a.href=item.url;a.className="global-search-item";
   const name=document.createElement("strong");name.textContent=item.name;
   const hint=document.createElement("small");hint.textContent=item.hint;
   a.append(name,hint);results.appendChild(a);
  }
 }
 function openSearch(){if(dialog.open)return;field.value="";render();dialog.showModal();field.focus()}
 launch.addEventListener("click",openSearch);
 dialog.querySelector(".global-search-close").addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 field.addEventListener("input",render);
 field.addEventListener("keydown",e=>{
  if(e.key==="Enter"){const a=results.querySelector("a");if(a){e.preventDefault();location.assign(a.href)}}
  if(e.key==="ArrowDown"){const a=results.querySelector("a");if(a){e.preventDefault();a.focus()}}
 });
 results.addEventListener("keydown",e=>{
  if(e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;
  const a=[...results.querySelectorAll("a")],idx=a.indexOf(document.activeElement);
  if(idx<0)return;
  e.preventDefault();
  if(e.key==="ArrowUp"&&idx===0)field.focus();else a[Math.max(0,Math.min(a.length-1,idx+(e.key==="ArrowDown"?1:-1)))].focus();
 });
 document.addEventListener("keydown",e=>{
  const editable=e.target?.matches?.("input,textarea,select,[contenteditable='true']");
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch();return}
  if(e.key==="/"&&!editable&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!dialog.open){e.preventDefault();openSearch()}
 });
 dialog.addEventListener("close",()=>launch.focus());
}


/* モバイルナビと各サイズからの関連ツール */
(()=>{
 const linksByPath={"/paper/a0/":[{"url":"/tools/compare/?paper=a0","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/a1/":[{"url":"/tools/compare/?paper=a1","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/a2/":[{"url":"/tools/compare/?paper=a2","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/a3/":[{"url":"/tools/envelope-finder/?paper=a3","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=a3","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/a4/":[{"url":"/tools/envelope-finder/?paper=a4","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=a4","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/a5/":[{"url":"/tools/envelope-finder/?paper=a5","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=a5","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/a6/":[{"url":"/tools/envelope-finder/?paper=a6","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=a6","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/a7/":[{"url":"/tools/envelope-finder/?paper=a7","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=a7","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/a8/":[{"url":"/tools/envelope-finder/?paper=a8","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=a8","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/b0/":[{"url":"/tools/compare/?paper=b0","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/b1/":[{"url":"/tools/compare/?paper=b1","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/b2/":[{"url":"/tools/compare/?paper=b2","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/b3/":[{"url":"/tools/compare/?paper=b3","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"},{"url":"/tools/image-print-check/","title":"画像の印刷画質を確認","detail":"PPIと印刷サイズを調べる"}],"/paper/b4/":[{"url":"/tools/envelope-finder/?paper=b4","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=b4","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/b5/":[{"url":"/tools/envelope-finder/?paper=b5","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=b5","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/b6/":[{"url":"/tools/envelope-finder/?paper=b6","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=b6","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/b7/":[{"url":"/tools/envelope-finder/?paper=b7","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=b7","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/paper/b8/":[{"url":"/tools/envelope-finder/?paper=b8","title":"入る封筒を探す","detail":"折り方を選んで候補を検索"},{"url":"/tools/compare/?paper=b8","title":"用紙の大きさを比較","detail":"寸法・面積を比べる"},{"url":"/tools/scale/","title":"印刷倍率を計算","detail":"拡大・縮小率を調べる"}],"/envelope/kaku2/":[{"url":"/tools/envelope-finder/?paper=a4","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/paper/a4/","title":"A4の寸法を見る","detail":"用紙の大きさを確認"},{"url":"/guides/a4-envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/envelope/kaku3/":[{"url":"/tools/envelope-finder/?paper=b5","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/paper/b5/","title":"B5の寸法を見る","detail":"用紙の大きさを確認"},{"url":"/guides/b5-envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/envelope/kaku4/":[{"url":"/tools/envelope-finder/?paper=b5","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/paper/b5/","title":"B5の寸法を見る","detail":"用紙の大きさを確認"},{"url":"/guides/b5-envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/envelope/chou3/":[{"url":"/tools/envelope-finder/?paper=a4","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/paper/a4/","title":"A4の寸法を見る","detail":"用紙の大きさを確認"},{"url":"/guides/a4-envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/envelope/chou4/":[{"url":"/tools/envelope-finder/?paper=b5","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/paper/b5/","title":"B5の寸法を見る","detail":"用紙の大きさを確認"},{"url":"/guides/b5-envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/envelope/chou40/":[{"url":"/tools/envelope-finder/?paper=a4","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/paper/a4/","title":"A4の寸法を見る","detail":"用紙の大きさを確認"},{"url":"/guides/a4-envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/envelope/you2/":[{"url":"/tools/envelope-finder/","title":"用紙から封筒を探す","detail":"折り方から候補を比較"},{"url":"/envelope/","title":"封筒の選び方","detail":"寸法と使い方を確認"}],"/photo/l/":[{"url":"/tools/image-print-check/?size=l","title":"印刷画質を確認","detail":"手持ちの画像のPPIを計算"},{"url":"/tools/photo-crop/?size=l","title":"トリミング量を確認","detail":"端が切れる範囲を計算"},{"url":"/tools/print-pixels/?size=l","title":"必要な画素数を計算","detail":"このサイズの印刷に必要なpx"}],"/photo/2l/":[{"url":"/tools/image-print-check/?size=2l","title":"印刷画質を確認","detail":"手持ちの画像のPPIを計算"},{"url":"/tools/photo-crop/?size=2l","title":"トリミング量を確認","detail":"端が切れる範囲を計算"},{"url":"/tools/print-pixels/?size=2l","title":"必要な画素数を計算","detail":"このサイズの印刷に必要なpx"}],"/photo/kg/":[{"url":"/tools/image-print-check/?size=kg","title":"印刷画質を確認","detail":"手持ちの画像のPPIを計算"},{"url":"/tools/photo-crop/?size=kg","title":"トリミング量を確認","detail":"端が切れる範囲を計算"},{"url":"/tools/print-pixels/?size=kg","title":"必要な画素数を計算","detail":"このサイズの印刷に必要なpx"}],"/print/postcard/":[{"url":"/tools/imposition/?item=postcard","title":"A4に何枚並べられる？","detail":"余白・配置数を計算"},{"url":"/tools/print-pixels/?size=postcard","title":"必要な画素数","detail":"印刷用画像のpxを計算"},{"url":"/guides/kg-vs-postcard/","title":"KG判との違い","detail":"写真サイズとの違いを解説"}],"/print/business-card/":[{"url":"/tools/imposition/?item=card","title":"A4に名刺を何枚？","detail":"面付け枚数・配置を計算"},{"url":"/tools/print-pixels/?size=business-card","title":"必要な画素数","detail":"名刺サイズに必要なpxを計算"},{"url":"/guides/business-card-design/","title":"名刺データの作り方","detail":"塗り足しや安全余白を確認"}]};
 const pathname=location.pathname.replace(/\/?$/,"/");
 const detail=document.querySelector("main .detail"),links=linksByPath[pathname];
 if(detail&&links&&!document.querySelector(".quick-tools")){
  const section=document.createElement("section");section.className="quick-tools";section.setAttribute("aria-label","このサイズの関連ツール");
  const h=document.createElement("h2");h.textContent="このサイズでできること";
  const sub=document.createElement("p");sub.textContent="寸法をそのまま比較や計算に使えます。";
  const grid=document.createElement("div");grid.className="quick-tools-grid";
  for(const item of links){
   const a=document.createElement("a");a.href=item.url;a.className="quick-tool-link";
   const strong=document.createElement("strong");strong.textContent=item.title+" →";
   const small=document.createElement("small");small.textContent=item.detail;
   a.append(strong,small);grid.appendChild(a);
  }
  section.append(h,sub,grid);detail.insertAdjacentElement("afterend",section);
 }
 const main=document.querySelector("main");if(main&&!main.id)main.id="mainContent";
 if(main&&!document.querySelector(".skip-to-content")){
  const link=document.createElement("a");link.className="skip-to-content";link.href="#mainContent";link.textContent="本文へ移動";document.body.prepend(link);
 }
 if(document.querySelector(".mobile-tab-nav"))return;
 const nav=document.createElement("nav");nav.className="mobile-tab-nav";nav.setAttribute("aria-label","スマホ用ナビゲーション");
 const tabs=[["/","⌂","ホーム"],["/paper/","▤","用紙"],["/envelope/","✉","封筒"],["/photo/","▧","写真"],["/tools/","▦","ツール"]];
 for(const [url,symbol,label] of tabs){
  const link=document.createElement("a");link.href=url;link.className="mobile-tab";
  if((url==="/"&&pathname==="/")||(url!=="/"&&pathname.startsWith(url)))link.setAttribute("aria-current",pathname===url?"page":"location");
  const icon=document.createElement("span");icon.className="mobile-tab-icon";icon.setAttribute("aria-hidden","true");icon.textContent=symbol;
  const name=document.createElement("span");name.textContent=label;link.append(icon,name);nav.append(link);
 }
 const search=document.createElement("button");search.type="button";search.className="mobile-tab";search.setAttribute("aria-label","サイト内を検索");
 const symbol=document.createElement("span");symbol.className="mobile-tab-icon";symbol.setAttribute("aria-hidden","true");symbol.textContent="⌕";
 const label=document.createElement("span");label.textContent="検索";search.append(symbol,label);
 search.addEventListener("click",()=>{const trigger=document.querySelector(".global-search-trigger");if(trigger)trigger.click();else location.assign("/all-pages/")});
 nav.append(search);document.body.append(nav);
})();

function envelope(){const p=pp.find(x=>x.id===g("paperSize").value);let a=p.w,b=p.h;const f=g("fold").value;if(f==="half")b/=2;else if(f==="third")b/=3;else if(f==="fourth")b/=4;const w=Math.min(a,b),h=Math.max(a,b),matches=ee.filter(x=>Math.min(x.w,x.h)>=w+6&&Math.max(x.w,x.h)>=h+6).sort((x,y)=>x.w*x.h-y.w*y.h);g("envelopeResult").innerHTML='<h3>折った後の概算サイズ</h3><b>'+format(w,1)+'×'+format(h,1)+'mm</b><h3>封筒候補：'+matches.length+'件</h3>'+(matches.length?matches.map(x=>row('<a href="/envelope/'+x.id+'/">'+x.name+' →</a>',x.w+'×'+x.h+'mm（外寸）')).join(""):'<p>候補がありません。折り方を変えてみてください。</p>')+'<small>※外寸に基づく簡易判定です。実際の内寸を確認してください。</small>'}
if(g("envelopeForm")){const p=new URLSearchParams(location.search).get("paper");if(pp.some(x=>x.id===p))g("paperSize").value=p;["paperSize","fold"].forEach(id=>g(id).addEventListener("change",envelope));g("envelopeForm").addEventListener("submit",e=>{e.preventDefault();envelope()});envelope()}
function units(){const n=Number(g("unitNum").value),u=g("unitType").value;if(n<0||!Number.isFinite(n)){g("unitResult").textContent="0以上の数値を入力してください";return}const mm=n*(u==="cm"?10:u==="inch"?25.4:1);g("unitResult").innerHTML='<h3>換算結果</h3>'+row(format(mm,4)+" mm","ミリメートル")+row(format(mm/10,4)+" cm","センチメートル")+row(format(mm/25.4,4)+" inch","インチ")}
if(g("unitForm")){["unitNum","unitType"].forEach(id=>g(id).addEventListener("input",units));g("unitForm").addEventListener("submit",e=>e.preventDefault());units()}
function dpi(){const w=Number(g("pxW").value),h=Number(g("pxH").value),d=Number(g("dpiNum").value);if(!(w>0&&h>0&&d>0)){g("dpiResult").textContent="すべて正の数値を入力してください";return}const a=w/d*25.4,b=h/d*25.4;g("dpiResult").innerHTML='<h3>印刷サイズの目安</h3><b>'+format(a,1)+' × '+format(b,1)+' mm</b><p>'+format(a/10,2)+'×'+format(b/10,2)+' cm</p><small>px ÷ DPI × 25.4</small>'}
if(g("dpiForm")){["pxW","pxH","dpiNum"].forEach(id=>g(id).addEventListener("input",dpi));g("dpiForm").addEventListener("submit",e=>e.preventDefault());dpi()}
function compare(){const a=pp.find(x=>x.id===g("compA").value),b=pp.find(x=>x.id===g("compB").value),ar=a.w*a.h,br=b.w*b.h;g("compareResult").innerHTML='<h3>比較結果</h3>'+row(a.name+" "+a.w+"×"+a.h+"mm",format(ar)+"mm²")+row(b.name+" "+b.w+"×"+b.h+"mm",format(br)+"mm²")+'<p><b>'+(ar===br?"同じ面積":(ar>br?a.name:b.name)+"が約"+format(Math.max(ar,br)/Math.min(ar,br))+"倍")+'</b></p>'}
if(g("compareForm")){const startPaper=new URLSearchParams(location.search).get("paper");if(pp.some(x=>x.id===startPaper))g("compA").value=startPaper;["compA","compB"].forEach(id=>g(id).addEventListener("change",compare));g("compareForm").addEventListener("submit",e=>e.preventDefault());compare()}
})();
;(()=>{"use strict";
const P=[["l","L判",89,127],["2l","2L判",127,178],["kg","KG判",102,152],["postcard","郵便はがき",100,148],["business-card","名刺",55,91],["a4","A4",210,297],["a5","A5",148,210],["custom","自由入力",0,0]],$=id=>document.getElementById(id),n=(v,d=1)=>Number(v.toFixed(d)).toLocaleString("ja-JP");
function calcPixels(){
const id=$("pxPreset").value,p=P.find(x=>x[0]===id),w=id==="custom"?Number($("customW").value):p[2],h=id==="custom"?Number($("customH").value):p[3],dpi=Number($("printDpi").value),out=$("pixelsResult");
if(!(w>0&&h>0&&w<=10000&&h<=10000&&dpi>0)){out.textContent="正しい寸法（1〜10000mm）を入力してください。";return}
out.innerHTML='<h3>必要画素数の目安</h3><b>'+Math.ceil(w*dpi/25.4).toLocaleString("ja-JP")+' × '+Math.ceil(h*dpi/25.4).toLocaleString("ja-JP")+' px</b><p>'+n(w)+'×'+n(h)+'mm / '+dpi+'DPI</p><small>小数点以下切り上げ。塗り足し分は含みません。</small>';
}
if($("pixelsForm")){
const query=new URLSearchParams(location.search).get("size");if(P.some(x=>x[0]===query))$("pxPreset").value=query;
const update=()=>{$("customPrint").hidden=$("pxPreset").value!=="custom";calcPixels()};
$("pxPreset").addEventListener("change",update);["customW","customH","printDpi"].forEach(x=>$(x).addEventListener("input",calcPixels));
$("pixelsForm").addEventListener("submit",e=>{e.preventDefault();calcPixels()});update();
}
function calcScale(){
const w=Number($("scaleW").value),h=Number($("scaleH").value),target=Number($("scaleTarget").value),out=$("scaleResult");
if(!(w>0&&h>0&&target>0&&w<=100000&&h<=100000&&target<=100000)){out.textContent="0より大きい寸法を入力してください。";return}
const ratio=target/w;out.innerHTML='<h3>拡大・縮小倍率</h3><b>'+n(ratio*100,2)+' %</b><p>仕上がり '+n(target)+' × '+n(h*ratio)+'mm</p><small>縦横比を維持して計算しています。</small>';
}
if($("scaleForm")){["scaleW","scaleH","scaleTarget"].forEach(x=>$(x).addEventListener("input",calcScale));$("scaleForm").addEventListener("submit",e=>{e.preventDefault();calcScale()});calcScale()}
document.querySelectorAll('.result').forEach(out=>{
 const b=document.createElement("button");b.type="button";b.className="copy-action";b.textContent="計算結果をコピー";
 const status=document.createElement("span");status.className="copy-status";status.setAttribute("aria-live","polite");out.insertAdjacentElement("afterend",b);b.insertAdjacentElement("afterend",status);
 b.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(out.innerText);status.textContent="コピーしました"}catch(e){status.textContent="コピーできませんでした。結果を選択してコピーしてください"}})
});
})();
;(()=>{"use strict";
 const f=document.getElementById("paperFinderForm");if(!f)return;
 const out=document.getElementById("paperFinderResult"),items=[{"id":"a0","name":"A0","w":841,"h":1189},{"id":"a1","name":"A1","w":594,"h":841},{"id":"a2","name":"A2","w":420,"h":594},{"id":"a3","name":"A3","w":297,"h":420},{"id":"a4","name":"A4","w":210,"h":297},{"id":"a5","name":"A5","w":148,"h":210},{"id":"a6","name":"A6","w":105,"h":148},{"id":"a7","name":"A7","w":74,"h":105},{"id":"a8","name":"A8","w":52,"h":74},{"id":"b0","name":"B0","w":1030,"h":1456},{"id":"b1","name":"B1","w":728,"h":1030},{"id":"b2","name":"B2","w":515,"h":728},{"id":"b3","name":"B3","w":364,"h":515},{"id":"b4","name":"B4","w":257,"h":364},{"id":"b5","name":"B5","w":182,"h":257},{"id":"b6","name":"B6","w":128,"h":182},{"id":"b7","name":"B7","w":91,"h":128},{"id":"b8","name":"B8","w":64,"h":91}];
 const fmt=v=>Number(v.toFixed(1)).toLocaleString("ja-JP");
 function run(){
 const w=Number(document.getElementById("findW").value),h=Number(document.getElementById("findH").value);
 if(!(Number.isFinite(w)&&Number.isFinite(h)&&w>0&&h>0&&w<=5000&&h<=5000)){out.textContent="1〜5000mmの正しい寸法を入力してください。";return;}
 const lo=Math.min(w,h),hi=Math.max(w,h);
 const matches=items.map(p=>{
 const dl=Math.abs(lo-p.w),dh=Math.abs(hi-p.h);
 const score=dl/Math.max(lo,p.w)+dh/Math.max(hi,p.h);
 return {...p,dl,dh,score};
 }).sort((a,b)=>a.score-b.score).slice(0,5);
 const top=matches[0],near=top.dl<=2&&top.dh<=2;
 const r=matches.map((p,i)=>'<div class="result-row"><strong>'+(i+1)+'. <a href="/paper/'+p.id+'/">'+p.name+' →</a></strong><br><small>規格 '+p.w+'×'+p.h+'mm / ずれ '+fmt(p.dl)+'mm・'+fmt(p.dh)+'mm</small></div>').join("");
 out.innerHTML='<h3>'+(near?"寸法が近い規格があります":"近いサイズ順の候補")+'</h3><p>'+fmt(lo)+' × '+fmt(hi)+'mm（短辺×長辺）</p>'+r+'<p><small>※ 2mm以内の一致でも規格の確定ではありません。定規の誤差、裁断差、JIS B判とISO B判の違いに注意してください。</small></p>';
 }
 for(const id of ["findW","findH"])document.getElementById(id).addEventListener("input",run);
 f.addEventListener("submit",e=>{e.preventDefault();run()});run();
})();
;(()=>{"use strict";
const $=id=>document.getElementById(id),outNumber=(x,d=1)=>Number(x.toFixed(d)).toLocaleString("ja-JP");
const rForm=$("ratioForm");
if(rForm){
 function gcd(a,b){while(b){const t=a%b;a=b;b=t}return a}
 function calculate(){
 const w=Number($("ratioWidth").value),h=Number($("ratioHeight").value),output=$("ratioResult");
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>100000||h>100000){output.textContent="1〜100000の整数を入力してください。";return}
 const g=gcd(w,h),a=w/g,b=h/g,r=w/h;
 const basics=[["16:9",16/9],["4:3",4/3],["3:2",3/2],["1:1",1],["9:16",9/16],["3:4",3/4],["2:3",2/3]];
 let match=basics.map(([name,value])=>({name,difference:Math.abs(r/value-1)})).sort((x,y)=>x.difference-y.difference)[0];
 const desc=match.difference<0.005?"よく使われる比率と一致します："+match.name:match.difference<0.03?"近い一般的な比率："+match.name:"一般的な比率への近似判定は行いません";
 output.innerHTML='<h3>画像の縦横比</h3><b>'+a+' : '+b+'</b><p>幅 ÷ 高さ = '+outNumber(r,4)+'</p><small>'+desc+'</small>';
 }
 for(const id of ["ratioWidth","ratioHeight"])$(id).addEventListener("input",calculate);
 rForm.addEventListener("submit",event=>{event.preventDefault();calculate()});
 document.querySelectorAll("[data-ratio-width]").forEach(button=>button.addEventListener("click",()=>{
  $("ratioWidth").value=button.dataset.ratioWidth;$("ratioHeight").value=button.dataset.ratioHeight;calculate();
 }));
 calculate();
}
const cForm=$("cropForm");
if(cForm){
 const sizes=[{id:"l",w:89,h:127},{id:"2l",w:127,h:178},{id:"kg",w:102,h:152},{id:"postcard",w:100,h:148},{id:"a4",w:210,h:297}];
 const valid=x=>Number.isFinite(x)&&x>0;
 function calculate(){
  const iw=Number($("cropImageWidth").value),ih=Number($("cropImageHeight").value),id=$("cropPaper").value;
  const item=sizes.find(x=>x.id===id);
  let pw=id==="custom"?Number($("cropPaperWidth").value):item.w;
  let ph=id==="custom"?Number($("cropPaperHeight").value):item.h;
  const o=$("cropResult");
  if(!valid(iw)||!valid(ih)||iw>100000||ih>100000||!Number.isInteger(iw)||!Number.isInteger(ih)||!valid(pw)||!valid(ph)||pw>5000||ph>5000){
   o.textContent="画像は1〜100000pxの整数、用紙は1〜5000mmで入力してください。";return;
  }
  if((iw>ih&&pw<ph)||(iw<ih&&pw>ph)){const n=pw;pw=ph;ph=n}
  const mode=$("cropMode").value,scale=mode==="cover"?Math.max(pw/iw,ph/ih):Math.min(pw/iw,ph/ih);
  const targetW=iw*scale,targetH=ih*scale;
  const minW=Math.min(pw,targetW),minH=Math.min(ph,targetH);
  const lostFraction=Math.max(0,Math.min(100,100*(1-(minW*minH)/(targetW*targetH))));
  const cutW=(Math.max(0,targetW-pw)/scale)/2,cutH=(Math.max(0,targetH-ph)/scale)/2;
  const blankW=Math.max(0,(pw-targetW)/2),blankH=Math.max(0,(ph-targetH)/2);
  if(mode==="cover"){
   const where=cutW>0.01?"左右":cutH>0.01?"上下":"なし";
   o.innerHTML='<h3>フチなし・中央配置の概算</h3><b>切れる面積：約'+outNumber(lostFraction,1)+'%</b><p>切れる方向：'+where+'</p><p>左右各 '+outNumber(cutW,0)+' px / 上下各 '+outNumber(cutH,0)+' px</p><small>用紙：'+outNumber(pw,1)+'×'+outNumber(ph,1)+'mm。仕上がり倍率や裁断時の余分な切れは含みません。</small>';
  } else {
   const where=blankW>0.01?"左右":blankH>0.01?"上下":"なし";
   o.innerHTML='<h3>フチあり・画像全体を収める概算</h3><b>画像の欠け：0%</b><p>余白が出る方向：'+where+'</p><p>左右各 '+outNumber(blankW,2)+' mm / 上下各 '+outNumber(blankH,2)+' mm</p><small>この余白は画像と用紙の比率差の理論値です。プリンター固有の余白や裁断分は含みません。</small>';
  }
 }
 const query=new URLSearchParams(location.search).get("size");
 if(sizes.some(x=>x.id===query))$("cropPaper").value=query;
 const sync=()=>{$("cropCustomSize").hidden=$("cropPaper").value!=="custom";calculate()};
 $("cropPaper").addEventListener("change",sync);
 ["cropImageWidth","cropImageHeight","cropPaperWidth","cropPaperHeight","cropMode"].forEach(id=>$(id).addEventListener("input",calculate));
 cForm.addEventListener("submit",event=>{event.preventDefault();calculate()});
 document.querySelectorAll("[data-crop-width]").forEach(button=>button.addEventListener("click",()=>{
  $("cropImageWidth").value=button.dataset.cropWidth;$("cropImageHeight").value=button.dataset.cropHeight;calculate();
 }));
 sync();
}
})();
;(()=>{"use strict";
 const form=document.getElementById("imposeForm");if(!form)return;
 const $=id=>document.getElementById(id);
 const sheets={a4:[210,297],a3:[297,420],b5:[182,257],b4:[257,364]};
 const items={card:[91,55],"photo-l":[127,89],"photo-2l":[178,127],"photo-kg":[152,102],postcard:[148,100],a6:[148,105]};
 const fmt=(v,d=1)=>Number(v.toFixed(d)).toLocaleString("ja-JP");
 const count=(W,H,w,h,m,g)=>{
  const usableW=W-2*m,usableH=H-2*m;
  if(usableW<=0||usableH<=0||w<=0||h<=0)return {cols:0,rows:0,n:0,w,h};
  const cols=Math.max(0,Math.floor((usableW+g+1e-8)/(w+g)));
  const rows=Math.max(0,Math.floor((usableH+g+1e-8)/(h+g)));
  return {cols,rows,n:cols*rows,w,h};
 };
 function calculate(){
  const s=$("imposeSheet").value,it=$("imposeItem").value;
  const W0=s==="custom"?Number($("imposePaperW").value):sheets[s][0],H0=s==="custom"?Number($("imposePaperH").value):sheets[s][1];
  const w=it==="custom"?Number($("imposeItemW").value):items[it][0],h=it==="custom"?Number($("imposeItemH").value):items[it][1];
  const margin=Number($("imposeMargin").value),gap=Number($("imposeGap").value),total=Number($("imposeTotal").value);
  const output=$("imposeResult"),preview=$("imposePreview");
  if(![W0,H0,w,h,margin,gap,total].every(Number.isFinite)||W0<10||H0<10||w<1||h<1||W0>3000||H0>3000||w>3000||h>3000||margin<0||margin>200||gap<0||gap>100||!Number.isInteger(total)||total<1||total>1000000){
   output.textContent="用紙・仕上がり寸法・余白・間隔・必要枚数を指定された範囲で入力してください。";preview.textContent="";return;
  }
  const orientation=$("imposePaperOrientation").value;
  const sheetW=orientation==="landscape"?Math.max(W0,H0):Math.min(W0,H0);
  const sheetH=orientation==="landscape"?Math.min(W0,H0):Math.max(W0,H0);
  const normal=count(sheetW,sheetH,w,h,margin,gap);
  const rotated=count(sheetW,sheetH,h,w,margin,gap);
  const best=rotated.n>normal.n?{...rotated,rotated:true}:{...normal,rotated:false};
  const sheetNeed=best.n>0?Math.ceil(total/best.n):null;
  if(!best.n){output.innerHTML='<h3>この条件では配置できません</h3><p>用紙を大きくする、余白・間隔を小さくする、印刷物のサイズを変更するなどを試してください。</p>';preview.innerHTML="";return}
  const placedW=best.cols*best.w+(best.cols-1)*gap;
  const placedH=best.rows*best.h+(best.rows-1)*gap;
  const left=(sheetW-placedW)/2,top=(sheetH-placedH)/2;
  const enough=best.n<=120;
  output.innerHTML='<h3>同じ向きで並べる場合</h3><b>1枚に '+best.n.toLocaleString("ja-JP")+' 個</b>'+
   '<p>'+best.cols+' 列 × '+best.rows+' 行 / '+(best.rotated?"印刷物を90°回転":"印刷物はそのまま")+'</p>'+
   '<p>必要な用紙：<strong>'+sheetNeed.toLocaleString("ja-JP")+' 枚</strong>（必要数 '+total.toLocaleString("ja-JP")+' 個）</p>'+
   '<small>用紙 '+fmt(sheetW)+'×'+fmt(sheetH)+'mm、仕上がり '+fmt(best.w)+'×'+fmt(best.h)+'mm。配置範囲 '+fmt(placedW)+'×'+fmt(placedH)+'mm。端の余白は左右約'+fmt(left)+'mm、上下約'+fmt(top)+'mm（配置を中央寄せしたとき）。</small>'+
   '<p><small>※縦横を混在させる配置・塗り足し・断裁条件は含みません。製品によって必要な余白が変わります。</small></p>';
  if(!enough){preview.textContent="配置数が120個を超えるため、プレビューは省略しています。枚数の計算結果をご利用ください。";return}
  const rects=[];
  for(let row=0;row<best.rows;row++){
   for(let col=0;col<best.cols;col++){
    const x=left+col*(best.w+gap),y=top+row*(best.h+gap);
    rects.push('<rect x="'+x+'" y="'+y+'" width="'+best.w+'" height="'+best.h+'" rx="0.6" fill="#d7f4e7" stroke="#168775" stroke-width="0.7"/>');
    if(best.w>=30&&best.h>=18)rects.push('<text x="'+(x+best.w/2)+'" y="'+(y+best.h/2)+'" text-anchor="middle" dominant-baseline="middle" font-size="'+Math.min(best.w,best.h)/4+'" fill="#145f54">'+(row*best.cols+col+1)+'</text>');
   }
  }
  preview.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="用紙に同じ寸法の印刷物を'+best.cols+'列'+best.rows+'行で配置した図" viewBox="0 0 '+sheetW+' '+sheetH+'" style="width:100%;height:auto;max-height:420px;display:block">'+
  '<rect width="'+sheetW+'" height="'+sheetH+'" fill="#fff" stroke="#a7c7bb" stroke-width="1"/>'+rects.join("")+'</svg>';
 }
 function refresh(){
  $("imposeSheetCustom").hidden=$("imposeSheet").value!=="custom";
  $("imposeItemCustom").hidden=$("imposeItem").value!=="custom";
  calculate();
 }
 for(const id of ["imposePaperW","imposePaperH","imposeItemW","imposeItemH","imposeMargin","imposeGap","imposeTotal","imposePaperOrientation"]){
  $(id).addEventListener("input",calculate);
 }
 $("imposeSheet").addEventListener("change",refresh);
 $("imposeItem").addEventListener("change",refresh);
 form.addEventListener("submit",event=>{event.preventDefault();calculate()});
 const query=new URLSearchParams(location.search).get("item");
 if(query&&items[query])$("imposeItem").value=query;
 document.querySelectorAll("[data-impose-preset]").forEach(button=>button.addEventListener("click",()=>{
  const id=button.dataset.imposePreset;
  $("imposeSheet").value="a4";$("imposePaperOrientation").value="portrait";$("imposeItem").value=id;
  $("imposeMargin").value="5";$("imposeGap").value=id==="photo-l"?"3":id==="postcard"?"0":"2";
  refresh();
 }));
 refresh();
})();
;(()=>{"use strict";
 const path=location.pathname,enabled=/^\/(?:paper|envelope|photo|print|tools|guides)\/[^/]+\/$/.test(path);
 const KEY_F="pittari:favorites:v1",KEY_R="pittari:recent:v1";
 function read(key){try{const d=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(d)?d.filter(x=>typeof x?.path==="string"&&x.path.startsWith("/")&&!x.path.startsWith("//")&&typeof x?.name==="string").slice(0,25):[]}catch{return []}}
 function write(key,d){try{localStorage.setItem(key,JSON.stringify(d));return true}catch{return false}}
 const title=(document.querySelector("main h1")?.textContent||document.title).trim().slice(0,100),item={path,name:title};
 if(enabled)write(KEY_R,[item,...read(KEY_R).filter(x=>x.path!==path)].slice(0,15));
 function show(){
  for(const [key,id] of [[KEY_F,"favList"],[KEY_R,"recentList"]]){
   const box=document.getElementById(id);if(!box)continue;
   box.replaceChildren();const list=read(key);
   if(!list.length){const p=document.createElement("p");p.textContent=id==="favList"?"お気に入りはありません。":"最近見たページはありません。";box.appendChild(p)}
   for(const x of list){const a=document.createElement("a");a.className="personal-saved-link";a.href=x.path;a.textContent=x.name+" →";box.append(a)}
  }
 }
 if(enabled){
  const anchor=document.querySelector("main .detail > div:first-child,main .intro");
  if(anchor){
   const box=document.createElement("div");box.className="favorite-actions";
   const button=document.createElement("button");button.type="button";button.className="favorite-toggle";
   const link=document.createElement("a");link.href="/favorites/";link.textContent="お気に入り・履歴を見る →";
   function label(){const has=read(KEY_F).some(x=>x.path===path);button.textContent=has?"★ 登録を解除":"☆ お気に入りに追加";button.setAttribute("aria-pressed",String(has))}
   button.addEventListener("click",()=>{const list=read(KEY_F),has=list.some(x=>x.path===path),next=has?list.filter(x=>x.path!==path):[item,...list].slice(0,25);if(write(KEY_F,next))label();else button.textContent="このブラウザでは保存できません"});
   box.append(button,link);anchor.append(box);label();
  }
 }
 const status=document.getElementById("personalStatus");
 for(const [id,key,msg] of [["clearFavorites",KEY_F,"お気に入りを解除しました。"],["clearRecent",KEY_R,"最近見たページを削除しました。"]]){
  const b=document.getElementById(id);
  if(b)b.addEventListener("click",()=>{if(write(key,[])){show();status.textContent=msg}else status.textContent="このブラウザでは削除できませんでした。"});
 }
 show();
})();