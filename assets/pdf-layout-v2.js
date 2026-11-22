(()=>{"use strict";
const $=id=>document.getElementById(id),form=$("printPdfForm");if(!form)return;
const enc=new TextEncoder(),mmPt=72/25.4,mmPx=300/25.4;
const papers={a4:[210,297],a3:[297,420],b5:[182,257]},items={card:[91,55],l:[127,89],postcard:[148,100]};
const imageList=[];let imageVersion=0;
const status=$("pdfStatus"),summary=$("pdfSummary"),filesStatus=$("pdfFileStatus"),preview=$("pdfPreview");
const number=id=>Number($(id).value);
const layout=()=>{
 const dims=papers[$("pdfPaper").value],size=items[$("pdfItem").value],m=number("pdfMargin"),gap=number("pdfGap"),count=number("pdfCount");
 if(!dims||!size||![m,gap,count].every(Number.isFinite)||m<0||m>100||gap<0||gap>100||!Number.isInteger(count)||count<1||count>300)throw Error("余白・間隔・枚数を確認してください");
 const [pw,ph]=dims;
 const calculate=(w,h)=>{
  const cols=Math.max(0,Math.floor((pw-2*m+gap+1e-8)/(w+gap)));
  const rows=Math.max(0,Math.floor((ph-2*m+gap+1e-8)/(h+gap)));
  return {w,h,cols,rows,capacity:cols*rows};
 };
 const normal=calculate(...size),rotated=calculate(size[1],size[0]);
 const chosen=rotated.capacity>normal.capacity?rotated:normal;
 if(!chosen.capacity)throw Error("この条件では印刷物を配置できません");
 const pages=Math.ceil(count/chosen.capacity);
 if(pages>30)throw Error("PDFのページ数は最大30ページです。枚数や配置条件を変更してください");
 const x=(pw-(chosen.cols*chosen.w+(chosen.cols-1)*gap))/2;
 const y=(ph-(chosen.rows*chosen.h+(chosen.rows-1)*gap))/2;
 return {...chosen,pw,ph,count,m,gap,pages,x,y};
};
const slots=(settings,page)=>{
 const start=page*settings.capacity,amount=Math.min(settings.capacity,settings.count-start),r=[];
 for(let i=0;i<amount;i++){
  const row=Math.floor(i/settings.cols),col=i%settings.cols;
  r.push({x:settings.x+col*(settings.w+settings.gap),y:settings.y+row*(settings.h+settings.gap),index:start+i});
 }
 return r;
};
function canvasContext(canvas,pw,ph){
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("お使いのブラウザは画像処理に対応していません");
 ctx.setTransform(canvas.width/pw,0,0,canvas.height/ph,0,0);ctx.fillStyle="#fff";ctx.fillRect(0,0,pw,ph);
 return ctx;
}
function guide(ctx,x,y,w,h){
 ctx.strokeStyle="#65756c";ctx.lineWidth=.17;ctx.beginPath();
 for(const cx of [x,x+w])for(const cy of [y,y+h]){
  const dx=cx===x?-1:1,dy=cy===y?-1:1;
  ctx.moveTo(cx+dx*.5,cy);ctx.lineTo(cx+dx*2.5,cy);
  ctx.moveTo(cx,cy+dy*.5);ctx.lineTo(cx,cy+dy*2.5);
 }
 ctx.stroke();
}
function draw(ctx,settings,page,illustrate){
 for(const {x,y,index} of slots(settings,page)){
  const img=imageList.length?imageList[index%imageList.length]:null;
  if(img){
   const scale=Math.max(settings.w/img.naturalWidth,settings.h/img.naturalHeight);
   const edit=window.PittariPrintEditor?.getEdit(index%imageList.length)||{zoom:1,panX:0,panY:0};
   const zoom=Math.max(1,Math.min(3,edit.zoom)),sw=settings.w/scale/zoom,sh=settings.h/scale/zoom;
   const sx=Math.max(0,img.naturalWidth-sw)*(.5+.5*edit.panX),sy=Math.max(0,img.naturalHeight-sh)*(.5+.5*edit.panY);
   ctx.drawImage(img,sx,sy,sw,sh,x,y,settings.w,settings.h);
  }else{
   ctx.fillStyle="#eff7f2";ctx.fillRect(x,y,settings.w,settings.h);
   ctx.fillStyle="#477365";ctx.textAlign="center";
   ctx.font="bold "+Math.min(6,settings.h/4)+"px sans-serif";
   ctx.fillText(String(index+1),x+settings.w/2,y+settings.h/2);
  }
  ctx.strokeStyle="#9bbcae";ctx.lineWidth=.14;ctx.strokeRect(x,y,settings.w,settings.h);
  if(!illustrate)guide(ctx,x,y,settings.w,settings.h);
 }
}
function activePage(){const s=layout();return Math.max(0,Math.min(s.pages-1,Number($("pdfPreviewPage")?.value)||0))}
function renderPreview(){
 try{
  const s=layout(),scale=Math.min(440/s.pw,560/s.ph),cw=Math.max(1,Math.round(s.pw*scale)),ch=Math.max(1,Math.round(s.ph*scale));
  const selector=$("pdfPreviewPage"),current=Math.min(s.pages-1,Math.max(0,Number(selector.value)||0));
  if(selector.options.length!==s.pages){
   selector.replaceChildren();
   for(let i=0;i<s.pages;i++){const option=document.createElement("option");option.value=String(i);option.textContent=(i+1)+" / "+s.pages+"ページ";selector.append(option)}
  }
  selector.value=String(current);
  $("pdfPrevPage").disabled=current===0;$("pdfNextPage").disabled=current===s.pages-1;
  preview.width=cw;preview.height=ch;draw(canvasContext(preview,s.pw,s.ph),s,current,true);
  summary.innerHTML="<h2>印刷配置</h2><b>1ページ最大 "+s.capacity+"枚</b><p>"+s.cols+"列 × "+s.rows+"行 ／ PDF "+s.pages+"ページ</p><p>最後のページ："+(s.count-(s.pages-1)*s.capacity)+"枚だけ配置</p><small>画像："+imageList.length+"件。画像が複数の場合は順番に1枠ずつ使用します。混在回転による最適化は行いません。</small>";
 }catch(e){summary.textContent=e.message;const ctx=preview.getContext("2d");ctx?.clearRect(0,0,preview.width,preview.height)}
}
function decodeImage(file){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("画像を読み込めません："+file.name))};
  img.src=url;
 });
}
$("pdfImage").addEventListener("change",async()=>{
 const current=++imageVersion,selected=[...$("pdfImage").files||[]];imageList.length=0;
 if(selected.length>30){filesStatus.textContent="画像は最大30件まで選べます。";renderPreview();return}
 if(selected.some(f=>!/^image\/(jpeg|png|webp|avif)$/i.test(f.type)||f.size>20*1024*1024)){
  filesStatus.textContent="JPEG・PNG・WebP・AVIFの20MB以下の画像を選んでください。";renderPreview();return
 }
 filesStatus.textContent="画像の読み込み中…";
 try{
  const images=await Promise.all(selected.map(decodeImage));
  if(current!==imageVersion)return;
  imageList.push(...images);
  window.PittariPrintEditor?.onImages(images);
  if(images.length)$("pdfCount").value=images.length;
  filesStatus.textContent=images.length?images.length+"件の画像を読み込みました。画像は送信していません。":"画像未選択：番号付きのガイドを生成します。";
 }catch(e){if(current!==imageVersion)return;filesStatus.textContent=e.message}
 renderPreview();
});
function imageCrop(img,s,index){
 const scale=Math.max(s.w/img.naturalWidth,s.h/img.naturalHeight);
 const edit=window.PittariPrintEditor?.getEdit(index%imageList.length)||{zoom:1,panX:0,panY:0};
 const zoom=Math.max(1,Math.min(3,edit.zoom)),sw=s.w/scale/zoom,sh=s.h/scale/zoom;
 const sx=Math.max(0,img.naturalWidth-sw)*(.5+.5*edit.panX),sy=Math.max(0,img.naturalHeight-sh)*(.5+.5*edit.panY);
 const canvas=document.createElement("canvas");
 canvas.width=Math.ceil(s.w*mmPx);canvas.height=Math.ceil(s.h*mmPx);
 if(canvas.width*canvas.height>12000000)throw Error("画像サイズが大きすぎます");
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("画像の描画に対応していません");
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
 ctx.drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
 return canvas
}
function vectorPDF(s){
 if(!window.PittariVectorPDF?.PDF)throw Error("PDFライブラリを読み込めませんでした");
 const pdf=new window.PittariVectorPDF.PDF(),cached=new Map();
 for(let number=0;number<s.pages;number++){
  const page=pdf.addPage(s.pw,s.ph);
  for(const {x,y,index} of slots(s,number)){
   const source=imageList.length?index%imageList.length:-1;
   if(source>=0){
    const img=imageList[source],ed=window.PittariPrintEditor?.getEdit(source)||{zoom:1,panX:0,panY:0};
    const key=source+":"+s.w+":"+s.h+":"+ed.zoom+":"+ed.panX+":"+ed.panY;
    if(!cached.has(key))cached.set(key,imageCrop(img,s,index));
    page.jpeg(cached.get(key),x,y,s.w,s.h,{cacheKey:key});
   }else page.ascii(String(index+1),x+s.w/2,y+s.h/2,Math.min(6,s.h/4),"#47695d");
   page.rect(x,y,s.w,s.h,"#6f8e81",.14);
   for(const cx of [x,x+s.w])for(const cy of [y,y+s.h]){
    const dx=cx===x?-1:1,dy=cy===y?-1:1;
    page.line(cx+dx*.5,cy,cx+dx*2.5,cy,"#526e62",.17);
    page.line(cx,cy+dy*.5,cx,cy+dy*2.5,"#526e62",.17);
   }
  }
 }
 return pdf.blob();
}
function download(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
form.addEventListener("submit",async e=>{
 e.preventDefault();const button=$("pdfCreate");if(button.disabled)return;button.disabled=true;status.textContent="PDFを生成中…";
 try{
  const s=layout();
  await new Promise(resolve=>setTimeout(resolve,0));
  const pdf=vectorPDF(s);
  download(pdf,"pittari-print.pdf");
  status.textContent="PDFを保存しました（"+s.pages+"ページ・"+(pdf.size/1048576).toFixed(2)+"MB）。最後のページは"+slots(s,s.pages-1).length+"枚です。裁断線はベクター形式です。";
 }catch(err){status.textContent="PDF作成エラー："+err.message}
 finally{button.disabled=false}
});
$("pdfPreviewPage").addEventListener("change",renderPreview);
$("pdfPrevPage").addEventListener("click",()=>{$("pdfPreviewPage").value=String(Math.max(0,activePage()-1));renderPreview()});
$("pdfNextPage").addEventListener("click",()=>{$("pdfPreviewPage").value=String(Math.min(layout().pages-1,activePage()+1));renderPreview()});
for(const id of ["pdfPaper","pdfItem","pdfMargin","pdfGap","pdfCount"])$(id).addEventListener("input",renderPreview);
for(const btn of document.querySelectorAll("[data-print-preset]"))btn.addEventListener("click",()=>{
 const id=btn.dataset.printPreset;$("pdfPaper").value="a4";$("pdfItem").value=id;$("pdfMargin").value=5;
 $("pdfGap").value=id==="card"?2:id==="l"?3:0;$("pdfCount").value=id==="card"?10:id==="l"?4:2;
 renderPreview();
});
window.PittariPrintCore={layout,slots,renderPreview,getImages:()=>imageList,getPreview:()=>preview,activePage};
renderPreview();
})();