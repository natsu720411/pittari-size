(()=>{"use strict";
 const $=id=>document.getElementById(id);
 const form=$("printQualityForm");if(!form)return;
 const presets=[{"id":"l","n":"L判写真","w":89,"h":127,"url":"/photo/l/"},{"id":"2l","n":"2L判写真","w":127,"h":178,"url":"/photo/2l/"},{"id":"kg","n":"KG判写真","w":102,"h":152,"url":"/photo/kg/"},{"id":"postcard","n":"郵便はがき","w":100,"h":148,"url":"/print/postcard/"},{"id":"a4","n":"A4","w":210,"h":297,"url":"/paper/a4/"},{"id":"b5","n":"JIS B5","w":182,"h":257,"url":"/paper/b5/"},{"id":"a3","n":"A3","w":297,"h":420,"url":"/paper/a3/"}];
 const sizeById=id=>presets.find(x=>x.id===id);
 const fmt=(n,d=1)=>Number(n.toFixed(d)).toLocaleString("ja-JP");
 let previewUrl=null,loadSerial=0;
 const input=$("qualityFile"),status=$("qualityFileStatus"),previewWrap=$("qualityPreviewWrap"),preview=$("qualityPreview"),result=$("qualityResult"),table=$("qualityTable");
 function clearPreview(){
  if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}
  preview.removeAttribute("src");previewWrap.hidden=true;
 }
 function effective(w,h,pw,ph,mode){
  const imageW=Math.max(w,h),imageH=Math.min(w,h);
  const printW=Math.max(pw,ph),printH=Math.min(pw,ph);
  const scale=mode==="cover"?Math.max(printW/imageW,printH/imageH):Math.min(printW/imageW,printH/imageH);
  if(!Number.isFinite(scale)||scale<=0)return null;
  const actualW=imageW*scale,actualH=imageH*scale;
  const crop=mode==="cover"?Math.max(0,100*(1-(printW*printH)/(actualW*actualH))):0;
  const gap=mode==="contain"?Math.max(0,100*(1-(actualW*actualH)/(printW*printH))):0;
  return {ppi:25.4/scale,crop:Math.min(100,crop),blank:Math.min(100,gap),imageW,imageH,printW,printH};
 }
 function readValues(){
  const w=Number($("qualityWidth").value),h=Number($("qualityHeight").value),target=$("qualityPaper").value,preset=sizeById(target);
  const pw=target==="custom"?Number($("qualityPaperW").value):preset?.w,ph=target==="custom"?Number($("qualityPaperH").value):preset?.h;
  const threshold=Number($("qualityPpi").value),mode=$("qualityMode").value;
  if(!Number.isInteger(w)||!Number.isInteger(h)||w<=0||h<=0||w>100000||h>100000||
     !Number.isFinite(pw)||!Number.isFinite(ph)||pw<=0||ph<=0||pw>5000||ph>5000){return null}
  return {w,h,pw,ph,threshold,mode};
 }
 function label(ppi,threshold){return ppi>=threshold?"指定したPPIの目安を満たします":"指定したPPIの目安より低い数値です"}
 function recalc(){
  const values=readValues();
  if(!values){result.textContent="画像は1〜100000pxの整数、用紙の寸法は1〜5000mmの正しい数値を入力してください。";table.textContent="";return}
  const {w,h,pw,ph,threshold,mode}=values;
  const r=effective(w,h,pw,ph,mode);
  if(!r){result.textContent="計算できませんでした。";table.textContent="";return}
  const paperName=$("qualityPaper").selectedOptions[0]?.textContent||"用紙";
  const maxW=Math.max(w,h)/threshold*25.4,maxH=Math.min(w,h)/threshold*25.4;
  const below=mode==="cover"?"中央配置で切れる画像の面積："+fmt(r.crop,1)+"%":"余白となる用紙の面積："+fmt(r.blank,1)+"%";
  result.innerHTML='<h3>'+paperName+'に印刷したとき</h3><b>約 '+fmt(r.ppi,0)+' PPI</b><p><strong>'+label(r.ppi,threshold)+'</strong></p>'+
   '<p>画像：'+fmt(w,0)+'×'+fmt(h,0)+'px（'+fmt(w*h/1000000,2)+'MP）</p>'+
   '<p>用紙：'+fmt(r.printW,1)+'×'+fmt(r.printH,1)+'mm（向きを合わせた値）</p>'+
   '<p>'+below+'</p>'+
   '<p>'+fmt(threshold,0)+'PPIでの画像全体の大きさは '+fmt(maxW,1)+'×'+fmt(maxH,1)+'mm です（余白・裁断は含みません）。</p>'+
   '<small>画像の細部や写真店の入稿条件を保証する判定ではありません。実際の印刷結果はトリミングや印刷設定によって変わります。</small>';
  const tr=presets.map(p=>{
   const e=effective(w,h,p.w,p.h,mode);
   return '<tr><th scope="row"><a href="'+p.url+'">'+p.n+'</a></th><td>'+fmt(p.w)+'×'+fmt(p.h)+'mm</td><td>'+fmt(e.ppi,0)+'PPI</td><td>'+(e.ppi>=threshold?'目安クリア':'目安未満')+'</td></tr>';
  }).join("");
  table.innerHTML='<table><thead><tr><th>用紙</th><th>大きさ</th><th>実効PPI</th><th>設定目安</th></tr></thead><tbody>'+tr+'</tbody></table>';
 }
 async function onSelect(){
  const file=input.files&&input.files[0];const serial=++loadSerial;clearPreview();
  if(!file){status.textContent="画像を選ぶか、下の幅・高さに手入力してください。";recalc();return}
  const permitted=/^image\/(jpeg|png|webp|gif|avif|heic|heif)$/i.test(file.type)||(!file.type&&/\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name));
  if(!permitted){status.textContent="この画像形式には対応していません。JPEG・PNG・WebPなどを選んでください。";input.value="";return}
  if(file.size>50*1024*1024){status.textContent="画像は50MB以下を選択してください。";input.value="";return}
  status.textContent="画像のピクセル数を読み取っています…";
  const url=URL.createObjectURL(file);
  const img=new Image();
  img.onload=()=>{
   if(serial!==loadSerial){URL.revokeObjectURL(url);return}
   const w=img.naturalWidth,h=img.naturalHeight;
   if(!(w>0&&h>0)){URL.revokeObjectURL(url);status.textContent="画像サイズを読み取れませんでした。";return}
   previewUrl=url;preview.src=url;previewWrap.hidden=false;
   $("qualityWidth").value=w;$("qualityHeight").value=h;
   status.textContent="読み取り完了："+w.toLocaleString("ja-JP")+"×"+h.toLocaleString("ja-JP")+"px（"+(file.size/1024/1024).toFixed(2)+"MB）。画像は送信されていません。";
   recalc();
  };
  img.onerror=()=>{
   URL.revokeObjectURL(url);
   if(serial!==loadSerial)return;
   status.textContent="このブラウザでは画像を読み込めませんでした。幅と高さを手入力してください。";
   input.value="";
  };
  img.src=url;
 }
 input.addEventListener("change",onSelect);
 for(const id of ["qualityWidth","qualityHeight","qualityPaperW","qualityPaperH","qualityMode","qualityPpi"])$(id).addEventListener("input",recalc);
 $("qualityPaper").addEventListener("change",()=>{$("qualityCustomSize").hidden=$("qualityPaper").value!=="custom";recalc()});
 form.addEventListener("submit",e=>{e.preventDefault();recalc()});
 document.querySelectorAll("[data-quality-width]").forEach(btn=>btn.addEventListener("click",()=>{
  loadSerial++;clearPreview();input.value="";
  $("qualityWidth").value=btn.dataset.qualityWidth;$("qualityHeight").value=btn.dataset.qualityHeight;
  status.textContent="例のピクセル数を使っています。画像ファイルは選択されていません。";recalc();
 }));
 window.addEventListener("pagehide",()=>{loadSerial++;clearPreview()});
 const q=new URLSearchParams(location.search).get("size");
 if(presets.some(p=>p.id===q))$("qualityPaper").value=q;
 $("qualityCustomSize").hidden=$("qualityPaper").value!=="custom";
 recalc();
})();