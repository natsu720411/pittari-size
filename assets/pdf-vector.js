(()=>{"use strict";
/* PDF writer: each stroke/trim border is a vector path; pictures are embedded as per-cell JPEGs.
   Standard PDF Helvetica is used for ASCII. Japanese text is drawn separately into a high-resolution image.
   No font downloads or external PDF APIs are needed. */
const PT=72/25.4,encoder=new TextEncoder(),fmt=x=>Number(x).toFixed(5);
function rgb(hex){
 const s=String(hex||"#263d35").replace("#","");
 if(!/^[0-9a-fA-F]{6}$/.test(s))throw Error("Invalid PDF color");
 return [0,2,4].map(i=>fmt(parseInt(s.slice(i,i+2),16)/255)).join(" ");
}
function binary(b64){
 const raw=atob(b64),out=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
 return out;
}
function textLiteral(s){return "("+String(s).replace(/[\\()]/g,"\\$&")+")"}
class Page{
 constructor(doc,w,h){this.doc=doc;this.w=w;this.h=h;this.code=[];this.resources=new Set()}
 stroke(color="#64756d",lineMm=.18){return rgb(color)+" RG "+fmt(Math.max(.03,lineMm)*PT)+" w "}
 line(x1,y1,x2,y2,color="#64756d",lineMm=.18){
  this.code.push("q "+this.stroke(color,lineMm)+fmt(x1*PT)+" "+fmt((this.h-y1)*PT)+" m "+fmt(x2*PT)+" "+fmt((this.h-y2)*PT)+" l S Q\n");return this
 }
 rect(x,y,w,h,color="#64756d",lineMm=.18){
  this.code.push("q "+this.stroke(color,lineMm)+fmt(x*PT)+" "+fmt((this.h-y-h)*PT)+" "+fmt(w*PT)+" "+fmt(h*PT)+" re S Q\n");return this
 }
 ellipse(cx,cy,rx,ry,color="#64756d",lineMm=.18){
  const k=.5522847498307936,cx0=cx*PT,cy0=(this.h-cy)*PT,ax=rx*PT,ay=ry*PT;
  const pos=(x,y)=>fmt(x)+" "+fmt(y);
  let path=pos(cx0+ax,cy0)+" m ";
  path+=pos(cx0+ax,cy0+k*ay)+" "+pos(cx0+k*ax,cy0+ay)+" "+pos(cx0,cy0+ay)+" c ";
  path+=pos(cx0-k*ax,cy0+ay)+" "+pos(cx0-ax,cy0+k*ay)+" "+pos(cx0-ax,cy0)+" c ";
  path+=pos(cx0-ax,cy0-k*ay)+" "+pos(cx0-k*ax,cy0-ay)+" "+pos(cx0,cy0-ay)+" c ";
  path+=pos(cx0+k*ax,cy0-ay)+" "+pos(cx0+ax,cy0-k*ay)+" "+pos(cx0+ax,cy0)+" c ";
  this.code.push("q "+this.stroke(color,lineMm)+path+"S Q\n");return this
 }
 ascii(value,cx,cy,fontMm=4,color="#263d35",maxWidthMm=0){
  const str=String(value);
  if(!/^[\x20-\x7E]*$/.test(str))throw Error("ASCII PDF font cannot encode this text");
  if(!str)return this;
  const size=fontMm*PT,approxWidth=str.length*fontMm*.52;
  const scale=maxWidthMm>0?Math.min(1,maxWidthMm/Math.max(approxWidth,.01)):1;
  const safe=str.length>500?str.slice(0,500):str;
  const x=(cx-approxWidth*scale/2)*PT,y=(this.h-cy-fontMm*.33)*PT;
  this.code.push("q "+rgb(color)+" rg BT /F1 "+fmt(size)+" Tf "+fmt(scale)+" 0 0 1 "+fmt(x)+" "+fmt(y)+" Tm "+textLiteral(safe)+" Tj ET Q\n");
  return this
 }
 jpeg(canvas,x,y,w,h,{cacheKey=null,quality=.94}={}){
  if(!(canvas?.width>0&&canvas?.height>0))throw Error("Missing picture canvas");
  const image=this.doc.image(canvas,cacheKey,quality);this.resources.add(image.name);
  this.code.push("q "+fmt(w*PT)+" 0 0 "+fmt(h*PT)+" "+fmt(x*PT)+" "+fmt((this.h-y-h)*PT)+" cm /"+image.name+" Do Q\n");
  return this
 }
}
class PDF{
 constructor(){this.pages=[];this.images=[];this.map=new Map()}
 addPage(w,h){
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0||w>2000||h>2000)throw Error("Invalid page size");
  const page=new Page(this,w,h);this.pages.push(page);return page
 }
 image(canvas,key,quality){
  if(key!==null&&this.map.has(key))return this.images[this.map.get(key)];
  const data=canvas.toDataURL("image/jpeg",quality).split(",")[1];
  if(!data)throw Error("Unable to encode picture");
  const img={name:"Im"+this.images.length,data,w:canvas.width,h:canvas.height};
  if(key!==null)this.map.set(key,this.images.length);
  this.images.push(img);return img
 }
 blob(){
  const n=this.pages.length;if(n<1||n>100)throw Error("PDF page count out of range");
  const pages=this.pages,images=this.images;
  const fontId=3+n*2+images.length,objects=Array(fontId+1).fill(null);
  objects[1]={text:"<< /Type /Catalog /Pages 2 0 R >>"};
  objects[2]={text:"<< /Type /Pages /Kids ["+pages.map((_,i)=>(3+i)+" 0 R").join(" ")+"] /Count "+n+" >>"};
  for(let i=0;i<n;i++){
   const p=pages[i],resources=[...p.resources].map(name=>{
    const idx=Number(name.slice(2));return "/"+name+" "+(3+2*n+idx)+" 0 R"
   }).join(" ");
   objects[3+i]={text:"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+fmt(p.w*PT)+" "+fmt(p.h*PT)+"] /Resources << /Font << /F1 "+fontId+" 0 R >> /XObject << "+resources+" >> >> /Contents "+(3+n+i)+" 0 R >>"};
   const bytes=encoder.encode(p.code.join(""));
   objects[3+n+i]={dict:"<< /Length "+bytes.length+" >>",bytes};
  }
  for(let i=0;i<images.length;i++){
   const img=images[i],bytes=binary(img.data);
   objects[3+2*n+i]={dict:"<< /Type /XObject /Subtype /Image /Width "+img.w+" /Height "+img.h+" /BitsPerComponent 8 /ColorSpace /DeviceRGB /Filter /DCTDecode /Length "+bytes.length+" >>",bytes};
  }
  objects[fontId]={text:"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"};
  const chunks=[],offsets=[0];let size=0;
  const append=value=>{const bytes=typeof value==="string"?encoder.encode(value):value;chunks.push(bytes);size+=bytes.length};
  append("%PDF-1.4\n");
  for(let id=1;id<objects.length;id++){
   offsets[id]=size;append(id+" 0 obj\n");
   const object=objects[id];
   if(object.bytes){append(object.dict+"\nstream\n");append(object.bytes);append("\nendstream\n")}
   else append(object.text+"\n");
   append("endobj\n");
  }
  const pos=size;
  append("xref\n0 "+objects.length+"\n0000000000 65535 f \n");
  for(let i=1;i<objects.length;i++)append(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
  append("trailer\n<< /Root 1 0 R /Size "+objects.length+" >>\nstartxref\n"+pos+"\n%%EOF\n");
  return new Blob(chunks,{type:"application/pdf"})
 }
}
window.PittariVectorPDF={PDF,PT};
})();