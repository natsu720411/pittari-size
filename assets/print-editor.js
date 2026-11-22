(()=>{"use strict";
const core=window.PittariPrintCore;if(!core)return;
const $=id=>document.getElementById(id),images=core.getImages(),edits=[];
const KEY="pittari:print-config:v1",status=$("pdfPresetStatus"),form=$("printPdfForm"),preview=core.getPreview();
const safe=(v,min,max)=>Math.max(min,Math.min(max,v)),active=()=>safe(Number($("pdfPhotoIndex").value)||0,0,Math.max(0,images.length-1));

const DRAFT_KEY="pittari:photo-draft:v2",undoStack=[],redoStack=[];
let lastCommitted=[];
const snapshot=()=>edits.map(e=>({...e}));
const fingerprint=()=>[...$("pdfImage").files||[]].map(f=>[f.name,f.size,f.lastModified].join(":")).join("|");
function draftSave(){
 try{sessionStorage.setItem(DRAFT_KEY,JSON.stringify({fingerprint:fingerprint(),edits:snapshot()}))}catch{}
}
function draftDiscard(){try{sessionStorage.removeItem(DRAFT_KEY)}catch{}}
function commitEdit(){
 const now=snapshot();if(JSON.stringify(now)===JSON.stringify(lastCommitted))return;
 undoStack.push(lastCommitted);if(undoStack.length>30)undoStack.shift();
 lastCommitted=now;redoStack.length=0;draftSave();refreshUndo();
}
function replaceEdits(next){
 edits.splice(0,edits.length,...next.map(e=>({zoom:safe(Number(e.zoom)||1,1,3),panX:safe(Number(e.panX)||0,-1,1),panY:safe(Number(e.panY)||0,-1,1)})));
 lastCommitted=snapshot();sync();core.renderPreview();draftSave();refreshUndo();
}
function refreshUndo(){
 $("pdfUndoPhoto").disabled=!undoStack.length;
 $("pdfRedoPhoto").disabled=!redoStack.length;
}

function getEdit(index){return edits[index]||{zoom:1,panX:0,panY:0}}
function sync(){
 const i=active(),e=getEdit(i),has=images.length>0;
 $("pdfPhotoAdjust").disabled=!has;
 $("pdfZoom").value=String(Math.round(e.zoom*100));$("pdfZoomOutput").textContent=$("pdfZoom").value+"%";
 $("pdfPanX").value=String(Math.round(e.panX*100));$("pdfPanY").value=String(Math.round(e.panY*100));
 const out=$("pdfPpiStatus");
 if(!has){out.textContent="写真を選ぶと画質の目安を確認できます。";return}
 try{
  const s=core.layout(),im=images[i],mmPerPx=Math.max(s.w/im.naturalWidth,s.h/im.naturalHeight)*e.zoom,ppi=25.4/mmPerPx;
  const coverage=s.w*s.h/(mmPerPx*mmPerPx*im.naturalWidth*im.naturalHeight),cut=100*(1-safe(coverage,0,1));
  out.textContent="写真"+(i+1)+"：約"+Math.round(ppi)+"PPI。"+(ppi>=300?"300PPIの目安を満たします":ppi>=150?"解像度がやや低くなる可能性":"印刷が粗くなる可能性があります")+"。切り落とされる面積は約"+cut.toFixed(1)+"%。ピント・圧縮などは判定できません。";
 }catch(err){out.textContent=err.message}
}
function editFromInputs(){
 const e=edits[active()];if(!e)return;
 e.zoom=safe(Number($("pdfZoom").value)/100,1,3);e.panX=safe(Number($("pdfPanX").value)/100,-1,1);
 e.panY=safe(Number($("pdfPanY").value)/100,-1,1);sync();core.renderPreview();
}
function onImages(next){
 let restored=null;
 try{
  const draft=JSON.parse(sessionStorage.getItem(DRAFT_KEY)||"null");
  if(draft?.fingerprint===fingerprint()&&Array.isArray(draft.edits)&&draft.edits.length===next.length)restored=draft.edits;
 }catch{}
 edits.splice(0,edits.length,...next.map((_,i)=>{
  const old=restored?.[i]||{};
  return {zoom:safe(Number(old.zoom)||1,1,3),panX:safe(Number(old.panX)||0,-1,1),panY:safe(Number(old.panY)||0,-1,1)};
 }));
 undoStack.length=0;redoStack.length=0;lastCommitted=snapshot();
 $("pdfDraftStatus").textContent=restored?"前回の一時編集設定を復元しました。":"写真を読み込みました。編集内容はこのタブ内で一時保存します。";
 refreshUndo();
 const select=$("pdfPhotoIndex");select.replaceChildren();
 next.forEach((img,i)=>{const op=document.createElement("option");op.value=String(i);op.textContent="写真"+(i+1)+"（"+img.naturalWidth+"×"+img.naturalHeight+"px）";select.append(op)});
 select.value="0";sync();
}
window.PittariPrintEditor={getEdit,onImages};
$("pdfPhotoIndex").addEventListener("change",()=>{sync();core.renderPreview()});
for(const id of ["pdfZoom","pdfPanX","pdfPanY"])$(id).addEventListener("input",editFromInputs);
for(const id of ["pdfZoom","pdfPanX","pdfPanY"])$(id).addEventListener("change",commitEdit);
$("pdfResetPhoto").addEventListener("click",()=>{if(!edits[active()])return;edits[active()]={zoom:1,panX:0,panY:0};sync();core.renderPreview();commitEdit()});
let dragging=null;
preview.style.touchAction="none";
preview.addEventListener("pointerdown",event=>{
 if(!images.length)return;
 try{
  const s=core.layout(),rect=preview.getBoundingClientRect(),
  x=(event.clientX-rect.left)/rect.width*s.pw,y=(event.clientY-rect.top)/rect.height*s.ph;
  const slot=core.slots(s,core.activePage()).find(a=>x>=a.x&&x<=a.x+s.w&&y>=a.y&&y<=a.y+s.h);
  if(!slot)return;
  $("pdfPhotoIndex").value=String(slot.index%images.length);sync();
  dragging={x:event.clientX,y:event.clientY,w:rect.width,h:rect.height,i:active()};
  preview.setPointerCapture?.(event.pointerId);event.preventDefault();
 }catch{}
});
preview.addEventListener("pointermove",event=>{
 if(!dragging)return;
 const e=edits[dragging.i];if(!e)return;
 e.panX=safe(e.panX-2*(event.clientX-dragging.x)/dragging.w,-1,1);
 e.panY=safe(e.panY-2*(event.clientY-dragging.y)/dragging.h,-1,1);
 dragging.x=event.clientX;dragging.y=event.clientY;sync();core.renderPreview();
});
for(const name of ["pointerup","pointercancel","lostpointercapture"])preview.addEventListener(name,()=>{if(dragging)commitEdit();dragging=null});
$("pdfUndoPhoto").addEventListener("click",()=>{
 if(!undoStack.length)return;
 const last=undoStack.pop();redoStack.push(snapshot());replaceEdits(last);
});
$("pdfRedoPhoto").addEventListener("click",()=>{
 if(!redoStack.length)return;
 const redo=redoStack.pop();undoStack.push(snapshot());replaceEdits(redo);
});
$("pdfClearDraft").addEventListener("click",()=>{
 edits.forEach(e=>{e.zoom=1;e.panX=0;e.panY=0});undoStack.length=0;redoStack.length=0;lastCommitted=snapshot();
 draftDiscard();sync();core.renderPreview();refreshUndo();$("pdfDraftStatus").textContent="一時編集データを削除しました。";
});
const current=()=>({paper:$("pdfPaper").value,item:$("pdfItem").value,margin:$("pdfMargin").value,gap:$("pdfGap").value,count:$("pdfCount").value});
function apply(x){
 if(!x||!["a4","a3","b5"].includes(x.paper)||!["card","l","postcard"].includes(x.item))throw Error("用紙か印刷物の選択が不正です");
 const m=Number(x.margin),g=Number(x.gap),c=Number(x.count);
 if(!Number.isFinite(m)||!Number.isFinite(g)||!Number.isInteger(c)||m<0||m>100||g<0||g>100||c<1||c>300)throw Error("保存した設定の数値が不正です");
 $("pdfPaper").value=x.paper;$("pdfItem").value=x.item;$("pdfMargin").value=String(m);
 $("pdfGap").value=String(g);$("pdfCount").value=String(c);core.renderPreview();sync();
}
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v.slice(0,20):[]}catch{return []}}
function write(list){try{localStorage.setItem(KEY,JSON.stringify(list.slice(0,20)));return true}catch{return false}}
function choices(){
 const sel=$("pdfSavedPreset"),selected=sel.value;sel.replaceChildren();
 const first=document.createElement("option");first.value="";first.textContent="設定を選択";sel.append(first);
 for(const p of read()){const o=document.createElement("option");o.value=p.id;o.textContent=p.name;sel.append(o)}
 sel.value=selected;
}
$("pdfSavePreset").addEventListener("click",()=>{
 try{
  const label=$("pdfSaveName").value.trim().slice(0,40)||"保存した配置",
  entry={id:String(Date.now())+"-"+Math.random().toString(36).slice(2,6),name:label,settings:current()};
  if(!write([entry,...read()]))throw Error("ブラウザに保存できませんでした");
  choices();$("pdfSavedPreset").value=entry.id;status.textContent="設定「"+label+"」を保存しました。写真データ・写真の位置調整は保存されません。";
 }catch(err){status.textContent=err.message}
});
$("pdfLoadPreset").addEventListener("click",()=>{
 try{const item=read().find(x=>x.id===$("pdfSavedPreset").value);if(!item)throw Error("設定を選択してください");apply(item.settings);status.textContent="設定を読み込みました。"}
 catch(err){status.textContent=err.message}
});
$("pdfDeletePreset").addEventListener("click",()=>{
 if(!$("pdfSavedPreset").value){status.textContent="削除する設定を選択してください。";return}
 if(!write(read().filter(x=>x.id!==$("pdfSavedPreset").value))){status.textContent="削除できませんでした。";return}
 choices();status.textContent="設定を削除しました。";
});
$("pdfShareUrl").addEventListener("click",async()=>{
 const url=new URL(location.href),s=current();
 for(const [k,v]of Object.entries(s))url.searchParams.set(k,v);
 try{await navigator.clipboard.writeText(url.href);status.textContent="設定URLをコピーしました。"}
 catch{status.textContent="共有URL："+url.href}
});
$("pdfPreviewPng").addEventListener("click",()=>{
 preview.toBlob(blob=>{
  if(!blob){status.textContent="画像を作成できませんでした。";return}
  const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="pittari-preview.png";document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),30000);status.textContent="プレビューPNGを保存しました。";
 },"image/png");
});
const query=new URLSearchParams(location.search);
if(query.has("paper")||query.has("item")){
 try{apply({paper:query.get("paper"),item:query.get("item"),margin:query.get("margin"),gap:query.get("gap"),count:query.get("count")})}catch{}
}
choices();sync();refreshUndo();
})();