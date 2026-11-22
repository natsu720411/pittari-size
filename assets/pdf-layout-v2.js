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
   const sw=settings.w/scale,sh=settings.h/scale;
   ctx.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,x,y,settings.w,settings.h);
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
function renderPreview(){
 try{
  const s=layout(),scale=Math.min(440/s.pw,560/s.ph),cw=Math.max(1,Math.round(s.pw*scale)),ch=Math.max(1,Math.round(s.ph*scale));
  preview.width=cw;preview.height=ch;draw(canvasContext(preview,s.pw,s.ph),s,0,true);
  summary.innerHTML="<h3>印刷配置</h3><b>1ページ最大 "+s.capacity+"枚</b><p>"+s.cols+"列 × "+s.rows+"行 ／ PDF "+s.pages+"ページ</p><p>最後のページ："+(s.count-(s.pages-1)*s.capacity)+"枚だけ配置</p><small>画像："+imageList.length+"件。画像が複数の場合は順番に1枠ずつ使用します。混在回転による最適化は行いません。</small>";
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
  if(images.length)$("pdfCount").value=images.length;
  filesStatus.textContent=images.length?images.length+"件の画像を読み込みました。画像は送信していません。":"画像未選択：番号付きのガイドを生成します。";
 }catch(e){if(current!==imageVersion)return;filesStatus.textContent=e.message}
 renderPreview();
});
function blobPdf(images,w,h){
 const pages=images.length,W=(w*mmPt).toFixed(5),H=(h*mmPt).toFixed(5),objects=[null,{text:"<< /Type /Catalog /Pages 2 0 R >>"},{text:"<< /Type /Pages /Count "+pages+" /Kids ["+Array.from({length:pages},(_,i)=>(i+3)+" 0 R").join(" ")+"] >>"}];
 const encImage=bytes=>{const binary=atob(bytes),arr=new Uint8Array(binary.length);for(let i=0;i<arr.length;i++)arr[i]=binary.charCodeAt(i);return arr};
 const imageIds=[],contentIds=[];
 for(let i=0;i<pages;i++){
  imageIds.push(3+pages+i);contentIds.push(3+2*pages+i);
  objects[3+i]={text:"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /XObject << /Im0 "+imageIds[i]+" 0 R >> >> /Contents "+contentIds[i]+" 0 R >>"};
 }
 for(let i=0;i<pages;i++){
  const jpg=encImage(images[i].data);
  objects[imageIds[i]]={dict:"<< /Type /XObject /Subtype /Image /Width "+images[i].width+" /Height "+images[i].height+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpg.length+" >>",bytes:jpg};
  const stream=enc.encode("q "+W+" 0 0 "+H+" 0 0 cm /Im0 Do Q\n");
  objects[contentIds[i]]={dict:"<< /Length "+stream.length+" >>",bytes:stream};
 }
 const chunks=[],offsets=[0];let pos=0;
 const append=v=>{const u=typeof v==="string"?enc.encode(v):v;chunks.push(u);pos+=u.length};
 append("%PDF-1.4\n");
 for(let id=1;id<objects.length;id++){
  const o=objects[id];offsets[id]=pos;append(id+" 0 obj\n");
  if(o.bytes){append(o.dict+"\nstream\n");append(o.bytes);append("\nendstream\n")}else append(o.text+"\n");
  append("endobj\n");
 }
 const xref=pos;append("xref\n0 "+objects.length+"\n0000000000 65535 f \n");
 for(let i=1;i<objects.length;i++)append(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
 append("trailer\n<< /Root 1 0 R /Size "+objects.length+" >>\nstartxref\n"+xref+"\n%%EOF\n");
 return new Blob(chunks,{type:"application/pdf"});
}
function download(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
form.addEventListener("submit",async e=>{
 e.preventDefault();const button=$("pdfCreate");if(button.disabled)return;button.disabled=true;status.textContent="PDFを生成中…";
 let canvas;
 try{
  const s=layout(),images=[];
  canvas=document.createElement("canvas");canvas.width=Math.ceil(s.pw*mmPx);canvas.height=Math.ceil(s.ph*mmPx);
  if(canvas.width*canvas.height>36000000)throw Error("用紙が大きすぎて出力できません");
  for(let i=0;i<s.pages;i++){
   const ctx=canvasContext(canvas,s.pw,s.ph);draw(ctx,s,i,false);
   images.push({data:canvas.toDataURL("image/jpeg",.9).split(",")[1],width:canvas.width,height:canvas.height});
   status.textContent="PDF作成中："+(i+1)+"/"+s.pages+"ページ";
   if(i%3===2)await new Promise(resolve=>setTimeout(resolve,0));
  }
  const pdf=blobPdf(images,s.pw,s.ph);download(pdf,"pittari-print.pdf");
  status.textContent="PDFを保存しました（"+s.pages+"ページ、"+(pdf.size/1048576).toFixed(2)+"MB）。最後のページは"+slots(s,s.pages-1).length+"枚だけです。";
 }catch(err){status.textContent="PDF作成エラー："+err.message}finally{if(canvas){canvas.width=1;canvas.height=1}button.disabled=false}
});
for(const id of ["pdfPaper","pdfItem","pdfMargin","pdfGap","pdfCount"])$(id).addEventListener("input",renderPreview);
for(const btn of document.querySelectorAll("[data-print-preset]"))btn.addEventListener("click",()=>{
 const id=btn.dataset.printPreset;$("pdfPaper").value="a4";$("pdfItem").value=id;$("pdfMargin").value=5;
 $("pdfGap").value=id==="card"?2:id==="l"?3:0;$("pdfCount").value=id==="card"?10:id==="l"?4:2;
 renderPreview();
});
renderPreview();
})();