(()=>{"use strict";const form=document.getElementById("foldForm");if(!form)return;
const $=id=>document.getElementById(id),papers={a4:[210,297],b5:[182,257],a5:[148,210],a3:[297,420],b4:[257,364]};
const env=[["角形2号（角2）",240,332,"kaku2"],["角形3号（角3）",216,277,"kaku3"],["角形4号（角4）",197,267,"kaku4"],["長形3号（長3）",120,235,"chou3"],["長形4号（長4）",90,205,"chou4"],["長形40号（長40）",90,225,"chou40"],["洋形2号（洋2）",114,162,"you2"]];
const fmt=n=>String(Math.round(n*100)/100);
const fold=(w,h,method)=>method==="half"?[w,h/2]:method==="third"?[w,h/3]:method==="long4"?[w,h/4]:method==="quarter"?[w/2,h/2]:[w,h];
const ns="http://www.w3.org/2000/svg";
function svgNode(tag,props,value){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(props))el.setAttribute(k,String(v));if(value!==undefined)el.textContent=value;return el}
function visualize(p,dims,method){
 const [w,h]=p,[fw,fh]=dims,svg=svgNode("svg",{viewBox:"0 0 630 260",role:"img","aria-label":"折る前の紙と折った後の紙の比較"});
 const scale=Math.min(155/w,180/h),x=60,y=35;
 svg.appendChild(svgNode("text",{x,y:22,fill:"#146758","font-size":16},"折る前"));
 svg.appendChild(svgNode("rect",{x,y,width:w*scale,height:h*scale,fill:"#eff8f3",stroke:"#128675","stroke-width":2}));
 const lines=method==="third"?[1/3,2/3]:method==="long4"?[.25,.5,.75]:method==="half"||method==="quarter"?[.5]:[];
 for(const f of lines)svg.appendChild(svgNode("line",{x1:x,y1:y+f*h*scale,x2:x+w*scale,y2:y+f*h*scale,stroke:"#c87b36","stroke-width":1.5,"stroke-dasharray":"5 4"}));
 if(method==="quarter")svg.appendChild(svgNode("line",{x1:x+w*scale/2,y1:y,x2:x+w*scale/2,y2:y+h*scale,stroke:"#c87b36","stroke-width":1.5,"stroke-dasharray":"5 4"}));
 svg.appendChild(svgNode("text",{x:257,y:125,fill:"#128675","font-size":25},"→"));
 const small=Math.min(fw,fh),large=Math.max(fw,fh),s=Math.min(150/small,180/large);
 svg.appendChild(svgNode("text",{x:348,y:22,fill:"#146758","font-size":16},"折った後"));
 svg.appendChild(svgNode("rect",{x:348,y:35,width:small*s,height:large*s,fill:"#d7f4e7",stroke:"#128675","stroke-width":2}));
 svg.appendChild(svgNode("text",{x:348,y:233,fill:"#146758","font-size":15},fmt(small)+" × "+fmt(large)+"mm"));
 $("foldDiagram").replaceChildren(svg);
}
function update(){
 const paper=papers[$("foldPaper").value],method=$("foldMethod").value,clear=Number($("foldClearance").value),result=$("foldResult"),list=$("foldMatches");
 if(!paper||!Number.isFinite(clear)||clear<0||clear>15){result.textContent="条件を確認してください。";list.textContent="";return}
 const dims=fold(...paper,method),w=Math.min(...dims),h=Math.max(...dims);
 result.innerHTML="<h3>折った後の寸法（理論値）</h3><b>"+fmt(w)+" × "+fmt(h)+"mm</b><p>元の紙："+paper.join(" × ")+"mm</p><small>紙厚や折り目の誤差は含みません。</small>";
 visualize(paper,dims,method);list.replaceChildren();
 const candidates=env.map(([name,ew,eh,id])=>({name,ew,eh,id,fit:ew-2*clear>=w&&eh-2*clear>=h})).sort((a,b)=>Number(b.fit)-Number(a.fit)||(a.ew*a.eh-b.ew*b.eh));
 for(const candidate of candidates){
  const card=document.createElement("div");card.className="fold-match";
  const a=document.createElement("a");a.href="/envelope/"+candidate.id+"/";a.textContent=candidate.name;
  const p=document.createElement("p");p.textContent=candidate.ew+"×"+candidate.eh+"mm（公称外寸）／余裕の差 "+fmt(candidate.ew-w)+"×"+fmt(candidate.eh-h)+"mm";
  const status=document.createElement("strong");status.className=candidate.fit?"fit-yes":"fit-no";status.textContent=candidate.fit?"外寸上の候補":"外寸上では余裕不足";
  card.append(a,status,p);list.append(card);
 }
}
form.addEventListener("submit",e=>{e.preventDefault();update()});
["foldPaper","foldMethod","foldClearance"].forEach(id=>$(id).addEventListener("input",update));
const query=new URLSearchParams(location.search),p=query.get("paper"),m=query.get("method");
if(papers[p])$("foldPaper").value=p;if(["none","half","third","long4","quarter"].includes(m))$("foldMethod").value=m;
update();
})();