(()=>{"use strict";
const $=id=>document.getElementById(id),form=$("labelForm");if(!form)return;
const pt=72/25.4,quality=600/25.4,PDF=()=>new window.PittariVectorPDF.PDF();
let dataRows=[],csvError="",lastCsv="";
function number(id){return Number($(id).value)}
function parseCSV(text){
 if(text.length>100000)throw Error("CSVは100KB以下にしてください");
 const rows=[];let row=[],field="",quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else if(!field||quoted)quoted=!quoted;else throw Error("CSVの引用符の位置が不正です")}
  else if(c===","&&!quoted){row.push(field);field=""}
  else if((c==="\n"||c==="\r")&&!quoted){
   if(c==="\r"&&text[i+1]==="\n")i++;
   row.push(field);field="";if(row.some(x=>x.trim()))rows.push(row);row=[];
  }else field+=c;
 }
 if(quoted)throw Error("CSVの引用符が閉じていません");
 row.push(field);if(row.some(x=>x.trim()))rows.push(row);
 return rows
}
function csvItems(){
 if(!$("labelCsvEnabled").checked)return null;
 const text=$("labelCsvText").value.replace(/^\uFEFF/,"");
 if(!text.trim())throw Error("CSVの内容を貼り付けるかファイルを選んでください");
 const records=parseCSV(text),content=$("labelCsvHeader").checked?records.slice(1):records;
 if(!content.length)throw Error("CSVのデータ行がありません");
 if(content.length>300)throw Error("CSVは最大300行まで印刷できます");
 const result=content.map((cols,i)=>{
  if(cols.length>3)throw Error((i+1)+"行目：列は最大3列までです");
  if(cols.some(x=>x.length>100))throw Error((i+1)+"行目：1列は100文字までです");
  return cols.map(x=>x.trim()).join("\n")
 });
 return result
}
function config(){
 const shape=$("labelShape").value,w=number("labelWidth"),h=shape==="circle"?w:number("labelHeight");
 const margin=number("labelMargin"),gap=number("labelGap"),font=number("labelFont");
 const csv=csvItems(),count=csv?csv.length:number("labelCount"),custom=$("labelSheetMode").value==="custom";
 if(![w,h,margin,gap,font,count].every(Number.isFinite)||w<10||w>190||h<10||h>277||margin<0||margin>50||gap<0||gap>50||font<1||font>18||!Number.isInteger(count)||count<1||count>300)throw Error("寸法・枚数・文字サイズを確認してください");
 let cols,rows,x,y,pitchX,pitchY,offsetX=0,offsetY=0;
 if(custom){
  cols=number("labelCols");rows=number("labelRows");
  x=number("labelStartX");y=number("labelStartY");
  pitchX=number("labelPitchX");pitchY=number("labelPitchY");
  offsetX=number("labelOffsetX");offsetY=number("labelOffsetY");
  if(![cols,rows,x,y,pitchX,pitchY,offsetX,offsetY].every(Number.isFinite)||!Number.isInteger(cols)||!Number.isInteger(rows)||cols<1||cols>15||rows<1||rows>30||x<0||y<0||pitchX<w||pitchY<h||Math.abs(offsetX)>10||Math.abs(offsetY)>10)throw Error("台紙の列数・行数・ピッチ・位置補正を確認してください");
  x+=offsetX;y+=offsetY;
  if(x<0||y<0||x+(cols-1)*pitchX+w>210+.001||y+(rows-1)*pitchY+h>297+.001)throw Error("ラベルの端がA4の外側です。台紙の開始位置、ピッチ、補正量を見直してください");
 }else{
  cols=Math.floor((210-2*margin+gap+.00001)/(w+gap));
  rows=Math.floor((297-2*margin+gap+.00001)/(h+gap));
  pitchX=w+gap;pitchY=h+gap;
  x=(210-cols*w-(cols-1)*gap)/2;
  y=(297-rows*h-(rows-1)*gap)/2;
 }
 const capacity=cols*rows;
 if(!capacity||capacity>500)throw Error("A4に配置できません");
 const pages=Math.ceil(count/capacity);if(pages>25)throw Error("25ページ以内に収まるよう枚数や寸法を変更してください");
 return {shape,w,h,font,count,cols,rows,capacity,pages,x,y,pitchX,pitchY,custom,text:$("labelText").value.slice(0,100),csv}
}
function items(s,page){
 const begin=page*s.capacity;
 return Array.from({length:Math.min(s.capacity,s.count-begin)},(_,i)=>{
  const col=i%s.cols,row=Math.floor(i/s.cols);
  return {index:begin+i,x:s.x+col*s.pitchX,y:s.y+row*s.pitchY,text:s.csv?s.csv[begin+i]:s.text}
 })
}
function linesOf(text){return String(text).split(/\n/).slice(0,3)}
function textRegion(s){
 const inset=s.shape==="circle"?s.w*.16:Math.min(2,s.w*.05);
 return {inset,w:s.w-2*inset,h:s.h-2*inset}
}
function fontSize(s,line){
 const region=textRegion(s);
 let size=Math.min(s.font,region.h/(Math.max(1,linesOf(line).length)+.5));
 for(const t of linesOf(line))if(t.length){
  const estimate=t.length*(/^[\x20-\x7E]+$/.test(t)?.55:1);
  size=Math.min(size,(region.w-1)/Math.max(.5,estimate));
 }
 return Math.max(.7,size)
}
function context(canvas){
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("Canvasに対応していません");
 ctx.setTransform(canvas.width/210,0,0,canvas.height/297,0,0);
 ctx.fillStyle="#fff";ctx.fillRect(0,0,210,297);return ctx
}
function drawPreview(ctx,s,page){
 for(const item of items(s,page)){
  const {x,y,text}=item;
  ctx.beginPath();
  if(s.shape==="circle")ctx.ellipse(x+s.w/2,y+s.h/2,s.w/2,s.w/2,0,0,Math.PI*2);else ctx.rect(x,y,s.w,s.h);
  ctx.lineWidth=.16;ctx.strokeStyle="#667a6f";ctx.stroke();ctx.save();ctx.clip();
  const f=fontSize(s,text),lines=linesOf(text);
  ctx.font=f+"px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#203b2f";
  lines.forEach((line,i)=>ctx.fillText(line,x+s.w/2,y+s.h/2+(i-(lines.length-1)/2)*f*1.45));
  ctx.restore()
 }
}
function makeJapaneseText(text,s){
 const region=textRegion(s),canvas=document.createElement("canvas");
 canvas.width=Math.ceil(region.w*quality);canvas.height=Math.ceil(region.h*quality);
 if(canvas.width*canvas.height>5000000)throw Error("文字の出力領域が大きすぎます");
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("文字を画像化できません");
 ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.setTransform(canvas.width/region.w,0,0,canvas.height/region.h,0,0);
 const f=fontSize(s,text),lines=linesOf(text);
 ctx.fillStyle="#1d322c";ctx.font=f+"px sans-serif";ctx.textBaseline="middle";ctx.textAlign="center";
 lines.forEach((line,i)=>ctx.fillText(line,region.w/2,region.h/2+(i-(lines.length-1)/2)*f*1.45));
 return {canvas,region}
}
function buildPdf(s){
 if(!window.PittariVectorPDF?.PDF)throw Error("PDFライブラリが利用できません");
 const doc=PDF(),rasterCache=new Map();
 for(let p=0;p<s.pages;p++){
  const page=doc.addPage(210,297);
  for(const item of items(s,p)){
   const {x,y,text}=item,lines=linesOf(text),f=fontSize(s,text);
   if(text.trim()){
    if(lines.every(l=>/^[\x20-\x7E]*$/.test(l))){
     lines.forEach((line,i)=>page.ascii(line,x+s.w/2,y+s.h/2+(i-(lines.length-1)/2)*f*1.45,f,"#1d322c",s.w-4));
    }else{
     const key="jp:"+s.shape+":"+s.w+":"+s.h+":"+s.font+":"+text;
     if(!rasterCache.has(key))rasterCache.set(key,makeJapaneseText(text,s));
     const {canvas,region}=rasterCache.get(key);
     page.jpeg(canvas,x+region.inset,y+region.inset,region.w,region.h,{cacheKey:key,quality:.98});
    }
   }
   if(s.shape==="circle")page.ellipse(x+s.w/2,y+s.h/2,s.w/2,s.w/2,"#667a6f",.16);
   else page.rect(x,y,s.w,s.h,"#667a6f",.16)
  }
 }
 return doc.blob()
}
function render(){
 try{
  const s=config(),select=$("labelPreviewPage"),current=Math.min(s.pages-1,Math.max(0,Number(select.value)||0));
  if(select.options.length!==s.pages){
   select.replaceChildren();
   for(let i=0;i<s.pages;i++){const op=document.createElement("option");op.value=String(i);op.textContent=(i+1)+" / "+s.pages+"ページ";select.append(op)}
  }
  select.value=String(current);
  $("labelPrevPage").disabled=current===0;$("labelNextPage").disabled=current===s.pages-1;
  const canvas=$("labelPreview");canvas.width=420;canvas.height=594;
  drawPreview(context(canvas),s,current);
  const clipped=items(s,current).some(x=>linesOf(x.text).some(t=>t.length*fontSize(s,x.text)>(s.w-2)*1.2));
  $("labelSummary").innerHTML="<h3>A4のラベル配置</h3><b>1ページ "+s.capacity+"枚</b><p>"+s.cols+"列 × "+s.rows+"行・PDF "+s.pages+"ページ</p><p>最終ページ："+(s.count-(s.pages-1)*s.capacity)+"枚</p><small>"+(s.custom?"台紙の指定ピッチと印刷位置補正を使用。":"自動配置。")+"枠線・英数字はベクター、日本語は高解像度画像。"+(clipped?"文字が枠からはみ出す可能性があるため、短くしてください。":"")+"</small>";
  $("labelCsvStatus").textContent=s.csv?("CSVから"+s.csv.length+"件読み込み。例："+s.csv.slice(0,2).map(t=>t.replace(/\n/g," / ")).join("、")):"CSVは未使用です。";
 }catch(e){$("labelSummary").textContent=e.message;$("labelCsvStatus").textContent=e.message}
}
form.addEventListener("submit",async e=>{
 e.preventDefault();const button=$("labelDownload");button.disabled=true;$("labelStatus").textContent="PDFを生成中…";
 try{
  const s=config();await new Promise(r=>setTimeout(r,0));
  const pdf=buildPdf(s),url=URL.createObjectURL(pdf),a=document.createElement("a");a.href=url;a.download="pittari-labels.pdf";
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  $("labelStatus").textContent="PDFを保存しました（"+s.pages+"ページ、"+(pdf.size/1048576).toFixed(2)+"MB）。倍率100%で印刷し、普通紙で位置を確認してください。";
 }catch(err){$("labelStatus").textContent="PDF作成エラー："+err.message}finally{button.disabled=false}
});
const presets={
 rect24:{shape:"rect",w:60,h:30,m:10,gap:5,count:24,font:4},
 circle35:{shape:"circle",w:30,h:30,m:10,gap:8,count:35,font:3},
 rect12:{shape:"rect",w:90,h:40,m:10,gap:5,count:12,font:5}
};
for(const btn of document.querySelectorAll("[data-label-preset]"))btn.addEventListener("click",()=>{
 const s=presets[btn.dataset.labelPreset];if(!s)return;
 for(const [k,id]of [["shape","labelShape"],["w","labelWidth"],["h","labelHeight"],["m","labelMargin"],["gap","labelGap"],["count","labelCount"],["font","labelFont"]])$(id).value=s[k];
 $("labelSheetMode").value="auto";$("labelGridFields").disabled=true;render();
});
$("labelSheetMode").addEventListener("change",()=>{
 $("labelGridFields").disabled=$("labelSheetMode").value!=="custom";render();
});
$("labelCsvFile").addEventListener("change",async()=>{
 const file=$("labelCsvFile").files?.[0];if(!file)return;
 if(file.size>1024*1024){$("labelCsvStatus").textContent="CSVは1MB以下にしてください";return}
 try{$("labelCsvText").value=await file.text();$("labelCsvEnabled").checked=true;render()}
 catch(e){$("labelCsvStatus").textContent="CSVを読み込めません："+e.message}
});
$("labelPreviewPage").addEventListener("change",render);
$("labelPrevPage").addEventListener("click",()=>{$("labelPreviewPage").value=String(Math.max(0,Number($("labelPreviewPage").value)-1));render()});
$("labelNextPage").addEventListener("click",()=>{$("labelPreviewPage").value=String(Number($("labelPreviewPage").value)+1);render()});
for(const id of ["labelShape","labelWidth","labelHeight","labelMargin","labelGap","labelCount","labelFont","labelText","labelCols","labelRows","labelStartX","labelStartY","labelPitchX","labelPitchY","labelOffsetX","labelOffsetY","labelCsvEnabled","labelCsvHeader","labelCsvText"])
 $(id).addEventListener("input",render);
render();
})();