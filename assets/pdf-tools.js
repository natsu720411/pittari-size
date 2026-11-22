(()=>{"use strict";
const $=id=>document.getElementById(id),MM_TO_PT=72/25.4,ENC=new TextEncoder();
function buildPdf(canvas,widthMm,heightMm,pages){
 const jpegB64=canvas.toDataURL("image/jpeg",0.92).split(",")[1];
 if(!jpegB64)throw Error("PDF用の画像を作成できませんでした");
 const binary=atob(jpegB64),jpeg=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)jpeg[i]=binary.charCodeAt(i);
 const pageW=(widthMm*MM_TO_PT).toFixed(5),pageH=(heightMm*MM_TO_PT).toFixed(5);
 const pageIds=Array.from({length:pages},(_,i)=>i+3),imageId=pages+3,contentId=imageId+1;
 const objects=[null,{text:"<< /Type /Catalog /Pages 2 0 R >>"},
  {text:"<< /Type /Pages /Kids ["+pageIds.map(n=>n+" 0 R").join(" ")+"] /Count "+pages+" >>"}];
 for(const id of pageIds)objects[id]={text:"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+pageW+" "+pageH+"] /Resources << /XObject << /Im0 "+imageId+" 0 R >> >> /Contents "+contentId+" 0 R >>"};
 objects[imageId]={dictionary:"<< /Type /XObject /Subtype /Image /Width "+canvas.width+" /Height "+canvas.height+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpeg.length+" >>",bytes:jpeg};
 const drawing=ENC.encode("q "+pageW+" 0 0 "+pageH+" 0 0 cm /Im0 Do Q\n");
 objects[contentId]={dictionary:"<< /Length "+drawing.length+" >>",bytes:drawing};
 const chunks=[],offsets=[0];let pos=0;
 function append(value){const bytes=typeof value==="string"?ENC.encode(value):value;chunks.push(bytes);pos+=bytes.length}
 append("%PDF-1.4\n");
 for(let i=1;i<objects.length;i++){
  const o=objects[i];offsets[i]=pos;append(i+" 0 obj\n");
  if(o.bytes){append(o.dictionary+"\nstream\n");append(o.bytes);append("\nendstream\n")}else append(o.text+"\n");
  append("endobj\n");
 }
 const xref=pos;
 append("xref\n0 "+objects.length+"\n0000000000 65535 f \n");
 for(let i=1;i<objects.length;i++)append(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
 append("trailer\n<< /Root 1 0 R /Size "+objects.length+" >>\nstartxref\n"+xref+"\n%%EOF\n");
 return new Blob(chunks,{type:"application/pdf"});
}
function drawCanvas(w,h){
 const pxW=Math.ceil(w*300/25.4),pxH=Math.ceil(h*300/25.4);
 if(pxW>8000||pxH>8000||pxW*pxH>40000000)throw Error("指定用紙が大きすぎます");
 const canvas=document.createElement("canvas");canvas.width=pxW;canvas.height=pxH;
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("Canvas非対応のブラウザです");
 ctx.setTransform(pxW/w,0,0,pxH/h,0,0);ctx.fillStyle="#ffffff";ctx.fillRect(0,0,w,h);
 return {canvas,ctx};
}
function download(blob,name){
 const u=URL.createObjectURL(blob),link=document.createElement("a");link.href=u;link.download=name;
 document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);
}
function trimMarks(ctx,x,y,w,h){
 ctx.strokeStyle="#49524c";ctx.lineWidth=.2;ctx.beginPath();
 const line=(x1,y1,x2,y2)=>{ctx.moveTo(x1,y1);ctx.lineTo(x2,y2)};
 for(const [cx,sx] of [[x,-1],[x+w,1]])for(const [cy,sy] of [[y,-1],[y+h,1]]){
  line(cx+sx*.5,cy,cx+sx*2.4,cy);line(cx,cy+sy*.5,cx,cy+sy*2.4);
 }
 ctx.stroke();
}
async function decodePicture(file){
 if(!file)return null;
 if(!/^image\/(jpeg|png|webp|avif)$/i.test(file.type))throw Error("JPEG・PNG・WebP・AVIF画像を選んでください");
 if(file.size>30*1024*1024)throw Error("30MB以下の画像を選んでください");
 const u=URL.createObjectURL(file);
 return await new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>{URL.revokeObjectURL(u);resolve(img)};
  img.onerror=()=>{URL.revokeObjectURL(u);reject(new Error("画像の読み込みに失敗しました"))};
  img.src=u;
 });
}
const form=$("printPdfForm");
if(form){
 const papers={a4:[210,297],a3:[297,420],b5:[182,257]},items={card:[91,55],l:[127,89],postcard:[148,100]};
 const status=$("pdfStatus"),summary=$("pdfSummary"),button=$("pdfCreate");
 function read(){
  const paper=papers[$("pdfPaper").value],item=items[$("pdfItem").value],margin=Number($("pdfMargin").value),gap=Number($("pdfGap").value),count=Number($("pdfCount").value);
  if(!paper||!item||![margin,gap,count].every(Number.isFinite)||margin<0||margin>100||gap<0||gap>100||!Number.isInteger(count)||count<1||count>1000)throw Error("余白・間隔・枚数を確認してください");
  const [pw,ph]=paper;
  const countFor=(w,h)=>{
   const cols=Math.max(0,Math.floor((pw-2*margin+gap+1e-8)/(w+gap)));
   const rows=Math.max(0,Math.floor((ph-2*margin+gap+1e-8)/(h+gap)));
   return {w,h,cols,rows,capacity:cols*rows};
  };
  const a=countFor(...item),b=countFor(item[1],item[0]);
  const layout=b.capacity>a.capacity?b:a;
  if(layout.capacity<=0)throw Error("この用紙には配置できません。");
  const pages=Math.ceil(count/layout.capacity);
  if(pages>100)throw Error("100ページを超えます。仕上がり枚数を減らしてください");
  return {...layout,pw,ph,margin,gap,count,pages};
 }
 function preview(){
  try{const a=read();summary.innerHTML="<h3>配置の結果</h3><b>1枚の用紙に "+a.capacity+"個</b><p>"+a.cols+"列 × "+a.rows+"行 ／ PDF "+a.pages+"ページ</p><small>同じ向きで並べる2通りを比較します。</small>"}
  catch(e){summary.textContent=e.message}
 }
 async function create(e){
  e.preventDefault();if(button.disabled)return;button.disabled=true;status.textContent="PDFを作成しています…";
  let canvas;
  try{
   const a=read(),img=await decodePicture($("pdfImage").files?.[0]);
   const draw=drawCanvas(a.pw,a.ph);canvas=draw.canvas;const ctx=draw.ctx;
   const startX=(a.pw-a.cols*a.w-(a.cols-1)*a.gap)/2,startY=(a.ph-a.rows*a.h-(a.rows-1)*a.gap)/2;
   for(let r=0;r<a.rows;r++)for(let col=0;col<a.cols;col++){
    const x=startX+col*(a.w+a.gap),y=startY+r*(a.h+a.gap);
    if(img){
     const scale=Math.max(a.w/img.naturalWidth,a.h/img.naturalHeight),sourceW=a.w/scale,sourceH=a.h/scale;
     ctx.drawImage(img,(img.naturalWidth-sourceW)/2,(img.naturalHeight-sourceH)/2,sourceW,sourceH,x,y,a.w,a.h);
    }else{
     ctx.fillStyle="#f5faf6";ctx.fillRect(x,y,a.w,a.h);
     ctx.font="bold 6px sans-serif";ctx.textAlign="center";ctx.fillStyle="#526f62";
     ctx.fillText(String(r*a.cols+col+1),x+a.w/2,y+a.h/2);
    }
    ctx.strokeStyle="#b3d0c2";ctx.lineWidth=.16;ctx.strokeRect(x,y,a.w,a.h);trimMarks(ctx,x,y,a.w,a.h);
   }
   const pdf=buildPdf(canvas,a.pw,a.ph,a.pages);download(pdf,"pittari-print.pdf");
   status.textContent="PDFを保存しました（"+a.pages+"ページ、約"+(pdf.size/1024/1024).toFixed(2)+"MB）。倍率100%で印刷してください。";
  }catch(err){status.textContent="PDF作成エラー："+err.message}finally{if(canvas){canvas.width=1;canvas.height=1}button.disabled=false}
 }
 form.addEventListener("submit",create);
 for(const id of ["pdfPaper","pdfItem","pdfMargin","pdfGap","pdfCount"])$(id).addEventListener("input",preview);
 preview();
}
const calibrate=$("calibrationPdf");
if(calibrate)calibrate.addEventListener("click",()=>{
 calibrate.disabled=true;const status=$("calibrationStatus");let canvas;
 try{
  const draw=drawCanvas(210,297);canvas=draw.canvas;const ctx=draw.ctx;
  ctx.strokeStyle="#263a31";ctx.fillStyle="#263a31";ctx.lineWidth=.25;ctx.font="5px sans-serif";
  ctx.fillText("A4 - PRINT ACTUAL SIZE 100%",20,24);
  ctx.beginPath();ctx.moveTo(20,45);ctx.lineTo(120,45);ctx.moveTo(20,49);ctx.lineTo(20,149);ctx.stroke();
  ctx.fillText("100 mm",48,41);ctx.fillText("100 mm",24,94);
  ctx.lineWidth=.22;ctx.strokeRect(20,165,50,50);ctx.fillText("50 x 50 mm",20,222);
  for(let x=20;x<=120;x+=10){ctx.beginPath();ctx.moveTo(x,44);ctx.lineTo(x,x===20||x===120?48:46);ctx.stroke()}
  const pdf=buildPdf(canvas,210,297,1);download(pdf,"pittari-test-100mm.pdf");
  status.textContent="PDFを保存しました。A4・倍率100%で印刷し、定規で寸法を確認してください。";
 }catch(e){status.textContent="PDF作成エラー："+e.message}finally{if(canvas){canvas.width=1;canvas.height=1}calibrate.disabled=false}
});
})();