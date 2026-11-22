(()=>{"use strict";const $=id=>document.getElementById(id);
const overlay=$("overlayForm");
if(overlay){
 const data=[["a2","A2",420,594],["a3","A3",297,420],["a4","A4",210,297],["a5","A5",148,210],["a6","A6",105,148],["b3","JIS B3",364,515],["b4","JIS B4",257,364],["b5","JIS B5",182,257],["b6","JIS B6",128,182]],colors=["#167f71","#c97330","#5965b4"],svg=$("overlayGraphic");
 function update(){
  const names=[$("ov1").value,$("ov2").value,$("ov3").value].filter(x=>x!=="none");
  const list=names.map(name=>data.find(x=>x[0]===name)).filter(Boolean),mx=Math.max(...list.map(x=>x[2])),my=Math.max(...list.map(x=>x[3])),scale=Math.min(395/mx,540/my),NS="http://www.w3.org/2000/svg";
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  const result=$("overlaySummary");result.replaceChildren();
  const heading=document.createElement("h3");heading.textContent="選択した用紙";result.appendChild(heading);
  list.forEach((row,i)=>{
   const shape=document.createElementNS(NS,"rect");
   for(const [k,v] of Object.entries({x:15,y:15,width:row[2]*scale,height:row[3]*scale,fill:colors[i],"fill-opacity":0.17,stroke:colors[i],"stroke-width":2}))shape.setAttribute(k,String(v));
   svg.append(shape);
   const line=document.createElement("p");line.textContent=row[1]+"　"+row[2]+"×"+row[3]+"mm";line.style.color=colors[i];result.append(line);
  });
  if(list.length>1){const x=list[0],y=list[1],line=document.createElement("small");line.textContent=y[1]+"の面積は"+x[1]+"の約"+(100*y[2]*y[3]/(x[2]*x[3])).toFixed(1)+"%です。";result.append(line)}
 }
 ["ov1","ov2","ov3"].forEach(id=>$(id).addEventListener("change",update));
 overlay.addEventListener("submit",e=>{e.preventDefault();update()});update();
}
const bleed=$("bleedForm");
if(bleed){
 const preset={card:[91,55],postcard:[148,100],a4:[210,297]};
 function update(){
  const v=id=>Number($(id).value),w=v("bleedWidth"),h=v("bleedHeight"),b=v("bleedAmount"),s=v("bleedSafe"),ppi=v("bleedPpi"),result=$("bleedResult");
  if(![w,h,b,s,ppi].every(Number.isFinite)||w<1||h<1||w>3000||h>3000||b<0||b>50||s<0||s>100||w<=2*s||h<=2*s){result.textContent="寸法や安全余白を確認してください。";return}
  const outW=w+2*b,outH=h+2*b;
  result.innerHTML="<h3>塗り足し込みデータ</h3><b>"+outW.toFixed(1)+"×"+outH.toFixed(1)+"mm</b><p>仕上がり："+w.toFixed(1)+"×"+h.toFixed(1)+"mm</p><p>塗り足し：各辺"+b.toFixed(1)+"mm</p><p>文字の安全領域："+(w-2*s).toFixed(1)+"×"+(h-2*s).toFixed(1)+"mm</p><p>"+ppi+"PPIの画素数："+Math.ceil(outW*ppi/25.4)+"×"+Math.ceil(outH*ppi/25.4)+"px</p><small>入稿先の指定を優先してください。</small>";
 }
 $("bleedPreset").addEventListener("change",()=>{const d=preset[$("bleedPreset").value];if(d){$("bleedWidth").value=d[0];$("bleedHeight").value=d[1]}update()});
 for(const id of ["bleedWidth","bleedHeight","bleedAmount","bleedSafe","bleedPpi"])$(id).addEventListener("input",update);
 bleed.addEventListener("submit",e=>{e.preventDefault();update()});update();
}
})();