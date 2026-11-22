(()=>{"use strict";
const $=id=>document.getElementById(id),share=$("resultShare"),download=$("resultImage"),status=$("resultShareStatus");
if(!share||!download)return;
const overlay=!!$("overlayGraphic"),fold=!!$("foldDiagram");
const keys=overlay?["ov1","ov2","ov3"]:fold?["foldPaper","foldMethod","foldClearance"]:[];
if(!keys.length)return;
const q=new URLSearchParams(location.search);
if(overlay){
 let updated=false;
 for(const id of keys){
  const select=$(id),value=q.get(id);
  if(value&&[...select.options].some(x=>x.value===value)){select.value=value;updated=true}
 }
 if(updated)$("ov1").dispatchEvent(new Event("change",{bubbles:true}));
}
function link(){
 const url=new URL(location.href);
 for(const id of keys){
  const v=$(id).value;
  if(v)url.searchParams.set(id,v);
 }
 return url.href;
}
share.addEventListener("click",async()=>{
 const value=link();
 try{if(!navigator.clipboard?.writeText)throw Error("unsupported");await navigator.clipboard.writeText(value);status.textContent="設定URLをコピーしました。"}
 catch{status.textContent="URLをコピーできません。こちらを選択して共有してください："+value}
});
download.addEventListener("click",async()=>{
 const svg=overlay?$("overlayGraphic"):$("foldDiagram").querySelector("svg");
 if(!svg){status.textContent="比較図がまだ表示されていません";return}
 download.disabled=true;
 try{
  const clone=svg.cloneNode(true),vb=clone.getAttribute("viewBox")||"0 0 650 450",parts=vb.trim().split(/\s+/).map(Number);
  if(parts.length!==4||!parts.every(Number.isFinite)||parts[2]<=0||parts[3]<=0)throw Error("図の大きさが不正です");
  clone.setAttribute("width",String(parts[2]));clone.setAttribute("height",String(parts[3]));
  clone.setAttribute("xmlns","http://www.w3.org/2000/svg");
  const data=new XMLSerializer().serializeToString(clone);
  const svgBlob=new Blob([data],{type:"image/svg+xml;charset=utf-8"}),url=URL.createObjectURL(svgBlob);
  let image;
  try{
   image=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error("図を画像に変換できません"));i.src=url});
  }finally{URL.revokeObjectURL(url)}
  const canvas=document.createElement("canvas");canvas.width=Math.ceil(parts[2]*2);canvas.height=Math.ceil(parts[3]*2);
  const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvasに対応していません");
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
  const png=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));if(!png)throw Error("PNG画像を作成できません");
  const asset=URL.createObjectURL(png),a=document.createElement("a");
  a.href=asset;a.download=overlay?"pittari-paper-comparison.png":"pittari-envelope-fold.png";
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(asset),30000);
  status.textContent="比較図のPNG画像を保存しました。";
 }catch(error){status.textContent=error.message}
 finally{download.disabled=false}
});
})();