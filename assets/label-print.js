(()=>{"use strict";
const $=id=>document.getElementById(id),form=$("labelForm");if(!form)return;
const px=300/25.4,pt=72/25.4,encoder=new TextEncoder();
function config(){
 const n=id=>Number($(id).value),shape=$("labelShape").value,w=n("labelWidth"),h=shape==="circle"?w:n("labelHeight"),m=n("labelMargin"),gap=n("labelGap"),count=n("labelCount"),font=n("labelFont");
 if(![w,h,m,gap,count,font].every(Number.isFinite)||w<10||w>190||h<10||h>277||m<0||m>50||gap<0||gap>50||!Number.isInteger(count)||count<1||count>300||font<1||font>18)throw Error("寸法・枚数・文字サイズを正しく入力してください");
 const cols=Math.max(0,Math.floor((210-2*m+gap+.00001)/(w+gap))),rows=Math.max(0,Math.floor((297-2*m+gap+.00001)/(h+gap))),capacity=cols*rows;
 if(!capacity)throw Error("A4用紙に配置できません。寸法を小さくしてください");
 const pages=Math.ceil(count/capacity);if(pages>25)throw Error("25ページ以内になるよう枚数を調整してください");
 return {shape,w,h,m,gap,count,font,cols,rows,capacity,pages,text:$("labelText").value.slice(0,100),x:(210-cols*w-(cols-1)*gap)/2,y:(297-rows*h-(rows-1)*gap)/2};
}
function context(canvas){
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("Canvasに対応していません");
 ctx.setTransform(canvas.width/210,0,0,canvas.height/297,0,0);
 ctx.fillStyle="#fff";ctx.fillRect(0,0,210,297);return ctx;
}
function draw(ctx,s,page){
 const lines=s.text.split(/\n/).slice(0,3),first=page*s.capacity,amount=Math.min(s.capacity,s.count-first);
 for(let i=0;i<amount;i++){
  const col=i%s.cols,row=Math.floor(i/s.cols),x=s.x+col*(s.w+s.gap),y=s.y+row*(s.h+s.gap);
  ctx.beginPath();if(s.shape==="circle")ctx.ellipse(x+s.w/2,y+s.h/2,s.w/2,s.h/2,0,0,Math.PI*2);else ctx.rect(x,y,s.w,s.h);
  ctx.strokeStyle="#7d8b84";ctx.lineWidth=.15;ctx.stroke();ctx.save();ctx.clip();
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#263d35";
  const fs=Math.min(s.font,s.h/(lines.length+1));ctx.font=fs+"px sans-serif";
  const lh=fs*1.5;
  lines.forEach((original,j)=>{
   let text=original;
   while(text&&ctx.measureText(text).width>s.w-4)text=text.slice(0,-1);
   ctx.fillText(text,x+s.w/2,y+s.h/2+(j-(lines.length-1)/2)*lh);
  });ctx.restore();
 }
}
function encodePDF(canvases){
 const W=(210*pt).toFixed(5),H=(297*pt).toFixed(5),n=canvases.length;
 const objects=[null,{text:"<< /Type /Catalog /Pages 2 0 R >>"},
 {text:"<< /Type /Pages /Count "+n+" /Kids ["+Array.from({length:n},(_,i)=>(i+3)+" 0 R").join(" ")+"] >>"}];
 for(let i=0;i<n;i++){
  const imageId=n+3+i,contentId=2*n+3+i;
  objects[i+3]={text:"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /XObject << /Im0 "+imageId+" 0 R >> >> /Contents "+contentId+" 0 R >>"};
  const binary=atob(canvases[i].split(",")[1]),jpg=new Uint8Array(binary.length);
  for(let j=0;j<binary.length;j++)jpg[j]=binary.charCodeAt(j);
  objects[imageId]={dict:"<< /Type /XObject /Subtype /Image /Width "+Math.ceil(210*px)+" /Height "+Math.ceil(297*px)+" /BitsPerComponent 8 /ColorSpace /DeviceRGB /Filter /DCTDecode /Length "+jpg.length+" >>",bytes:jpg};
  const code=encoder.encode("q "+W+" 0 0 "+H+" 0 0 cm /Im0 Do Q\n");
  objects[contentId]={dict:"<< /Length "+code.length+" >>",bytes:code};
 }
 let position=0;const parts=[],offsets=[0];
 const append=value=>{const bytes=typeof value==="string"?encoder.encode(value):value;parts.push(bytes);position+=bytes.length};
 append("%PDF-1.4\n");
 for(let i=1;i<objects.length;i++){
  const obj=objects[i];offsets[i]=position;append(i+" 0 obj\n");
  if(obj.bytes){append(obj.dict+"\nstream\n");append(obj.bytes);append("\nendstream\n")}else append(obj.text+"\n");
  append("endobj\n");
 }
 const xref=position;append("xref\n0 "+objects.length+"\n0000000000 65535 f \n");
 for(let i=1;i<objects.length;i++)append(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
 append("trailer\n<< /Root 1 0 R /Size "+objects.length+" >>\nstartxref\n"+xref+"\n%%EOF\n");
 return new Blob(parts,{type:"application/pdf"});
}
function render(){
 try{
  const s=config(),canvas=$("labelPreview");canvas.width=420;canvas.height=594;draw(context(canvas),s,0);
  $("labelSummary").innerHTML="<h3>A4のラベル配置</h3><b>1ページ "+s.capacity+"枚</b><p>"+s.cols+"列 × "+s.rows+"行・PDF "+s.pages+"ページ</p><p>最後のページは"+(s.count-(s.pages-1)*s.capacity)+"枚です。</p><small>市販シール台紙のカット位置と一致する保証はありません。</small>";
 }catch(e){$("labelSummary").textContent=e.message}
}
form.addEventListener("submit",async e=>{
 e.preventDefault();const btn=$("labelDownload");btn.disabled=true;$("labelStatus").textContent="PDF生成中…";
 let canvas;
 try{
  const s=config(),images=[];canvas=document.createElement("canvas");canvas.width=Math.ceil(210*px);canvas.height=Math.ceil(297*px);
  for(let i=0;i<s.pages;i++){
   draw(context(canvas),s,i);images.push(canvas.toDataURL("image/jpeg",.92));
   if(i%3===2)await new Promise(resolve=>setTimeout(resolve,0));
  }
  const pdf=encodePDF(images),url=URL.createObjectURL(pdf),a=document.createElement("a");a.href=url;a.download="pittari-labels.pdf";
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  $("labelStatus").textContent="PDFを保存しました（"+s.pages+"ページ・"+(pdf.size/1048576).toFixed(2)+"MB）。倍率100%で印刷してください。";
 }catch(err){$("labelStatus").textContent=err.message}finally{if(canvas){canvas.width=1;canvas.height=1}btn.disabled=false}
});
const presets={
rect24:{shape:"rect",w:60,h:30,m:10,gap:5,count:24,font:4},
circle35:{shape:"circle",w:30,h:30,m:10,gap:8,count:35,font:3},
rect12:{shape:"rect",w:90,h:40,m:10,gap:5,count:12,font:5}
};
document.querySelectorAll("[data-label-preset]").forEach(b=>b.addEventListener("click",()=>{
 const v=presets[b.dataset.labelPreset];if(!v)return;
 for(const [k,id]of [["shape","labelShape"],["w","labelWidth"],["h","labelHeight"],["m","labelMargin"],["gap","labelGap"],["count","labelCount"],["font","labelFont"]])$(id).value=v[k];
 render();
}));
for(const id of ["labelShape","labelWidth","labelHeight","labelMargin","labelGap","labelCount","labelText","labelFont"])$(id).addEventListener("input",render);
render();
})();