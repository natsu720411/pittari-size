import assert from "node:assert/strict";
import {createServer} from "node:http";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";
import {PDFDocument} from "pdf-lib";
import jpeg from "jpeg-js";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const out=path.join(root,"test-artifacts");
fs.mkdirSync(out,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".xml":"application/xml",".ico":"image/x-icon",".webmanifest":"application/manifest+json"};
const server=createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const f=path.resolve(root,"."+pathname);
  if(!f.startsWith(root+path.sep)&&f!==root){res.writeHead(403);res.end("Forbidden");return}
  const target=fs.existsSync(f)&&fs.statSync(f).isDirectory()?path.join(f,"index.html"):f;
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end("Not found");return}
  res.setHeader("Content-Type",mime[path.extname(target)]||"application/octet-stream");
  res.end(fs.readFileSync(target));
 }catch(e){res.writeHead(500);res.end(e.message)}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin="http://127.0.0.1:"+server.address().port;
let browser,passed=0;
function pass(msg){passed++;console.log("PASS "+msg)}
function near(actual,expected,tolerance,label){assert.ok(Math.abs(actual-expected)<=tolerance,label+": "+actual+" vs "+expected)}
async function pdfFromDownload(page,button,filename){
 const [download]=await Promise.all([page.waitForEvent("download",{timeout:30000}),page.locator(button).click()]);
 assert.equal(download.suggestedFilename(),filename);
 const source=await download.path();const buffer=fs.readFileSync(source);
 fs.writeFileSync(path.join(out,filename),buffer);
 assert.equal(buffer.toString("ascii",0,8),"%PDF-1.4");
 const pdf=await PDFDocument.load(buffer);
 return {buffer,pdf};
}
function embeddedJpeg(buf){
 const marker=Buffer.from("/Filter /DCTDecode /Length ");
 const pos=buf.indexOf(marker);
 assert.ok(pos>0,"JPEG image stream present");
 const info=buf.subarray(pos,pos+130).toString("latin1");
 const length=Number(info.match(/\/Length (\d+)/)?.[1]);
 assert.ok(length>5000,"embedded image length");
 const dataStart=buf.indexOf(Buffer.from("stream\n"),pos);
 assert.ok(dataStart>0,"image stream start");
 const bytes=buf.subarray(dataStart+7,dataStart+7+length);
 assert.equal(bytes[0],255);assert.equal(bytes[1],216);
 return jpeg.decode(bytes,{useTArray:true,tolerantDecoding:true});
}
function darkLineWidth(image,mmY,fromX,toX){
 const mmPx=image.width/210,y=Math.round(mmY*image.height/297);
 const xs=[];
 for(let x=Math.floor(fromX*mmPx);x<=Math.ceil(toX*mmPx);x++){
  let dark=false;
  for(let dy=-1;dy<=1;dy++){
   const off=((y+dy)*image.width+x)*4,dat=image.data;
   if(dat[off]<110&&dat[off+1]<110&&dat[off+2]<110){dark=true;break}
  }
  if(dark)xs.push(x);
 }
 assert.ok(xs.length>500,"100mm line detected");
 return (xs.at(-1)-xs[0])/mmPx;
}
try{
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,acceptDownloads:true});
 const page=await context.newPage();
 page.on("pageerror",err=>{console.error("PAGE ERROR:",err.message)});
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  for(const route of ["/","/paper/a4/","/tools/bleed/","/tools/print-pdf/","/tools/label-print/","/guides/label-sheet-alignment/","/photo/l/"]){
   await page.goto(origin+route,{waitUntil:"load"});
   const nav=page.locator(".mobile-tab-nav");
   await nav.waitFor({state:"visible",timeout:8000});
   assert.equal(await nav.locator(".mobile-tab").count(),6);
   const metrics=await page.evaluate(()=>({screen:innerWidth,document:document.documentElement.scrollWidth,navVisible:getComputedStyle(document.querySelector(".mobile-tab-nav")).display,viewport:document.documentElement.clientWidth}));
   assert.ok(metrics.screen<=width+1&&metrics.document<=width+2,"Horizontal overflow "+width+" "+route+": "+JSON.stringify(metrics));
   const box=await nav.boundingBox();
   const vd=await page.evaluate(()=>({height:innerHeight,width:innerWidth,position:getComputedStyle(document.querySelector(".mobile-tab-nav")).position}));
   console.log("NAV "+width+" "+route+" "+JSON.stringify({box,vd}));
   assert.ok(box&&Math.abs(box.y+box.height-vd.height)<5&&box.height<160,"Mobile nav positioned at bottom: "+route+" "+JSON.stringify({box,vd}));
   pass("mobile "+width+"px "+route+" no overflow / six tabs");
  }
 }
 await page.goto(origin+"/paper/a4/",{waitUntil:"load"});
 const quick=page.locator(".quick-tools");
 await quick.waitFor({state:"visible"});
 assert.ok((await quick.textContent()).includes("用紙の大きさ"));
 await page.locator(".mobile-tab-nav .mobile-tab").last().click();
 await page.locator(".global-search-dialog[open]").waitFor({state:"visible"});
 await page.locator("#globalSearchInput").fill("A4");
 await page.locator(".global-search-item").first().waitFor({state:"visible"});
 pass("mobile search, A4 results, contextual tools");
 await page.goto(origin+"/tools/actual-size/",{waitUntil:"load"});
 const measured=await pdfFromDownload(page,"#calibrationPdf","pittari-test-100mm.pdf");
 assert.equal(measured.pdf.getPageCount(),1);
 const size=measured.pdf.getPage(0).getSize();
 near(size.width,210*72/25.4,.02,"A4 PDF width");
 near(size.height,297*72/25.4,.02,"A4 PDF height");
 const image=embeddedJpeg(measured.buffer);
 near(image.width,Math.ceil(210*300/25.4),1,"Calibration image pixel width");
 const lineMm=darkLineWidth(image,45,15,125);
 near(lineMm,100,.8,"100 mm calibration line");
 pass("100mm calibration PDF MediaBox, 300PPI raster, physical line "+lineMm.toFixed(2)+"mm");
 await page.goto(origin+"/tools/print-pdf/",{waitUntil:"load"});
 const defaultCount=await page.locator("#pdfSummary").textContent();
 assert.ok(defaultCount.includes("10枚"),"A4 10 business cards");
 await page.locator('[data-print-preset="l"]').click();
 assert.ok((await page.locator("#pdfSummary").textContent()).includes("4枚"),"A4 L photo preset 4 per sheet");
 await page.locator('[data-print-preset="card"]').click();
 assert.ok((await page.locator("#pdfSummary").textContent()).includes("10枚"),"A4 card preset restored");
 const makeJpg=(r,g,b)=>{
  const data=Buffer.alloc(20*20*4);
  for(let i=0;i<20*20;i++){data[i*4]=r;data[i*4+1]=g;data[i*4+2]=b;data[i*4+3]=255}
  return jpeg.encode({data,width:20,height:20},85).data;
 };
 await page.locator("#pdfImage").setInputFiles([
  {name:"red.jpg",mimeType:"image/jpeg",buffer:makeJpg(230,35,30)},
  {name:"blue.jpg",mimeType:"image/jpeg",buffer:makeJpg(30,40,225)}
 ]);
 await page.waitForFunction(()=>document.getElementById("pdfFileStatus").textContent.includes("2件"));
 pass("preset templates and multiple local image upload");
 await page.locator("#pdfCount").fill("13");
 const layout=await pdfFromDownload(page,"#pdfCreate","pittari-print.pdf");
 assert.equal(layout.pdf.getPageCount(),2,"13 cards need 2 pages");
 for(const pg of layout.pdf.getPages()){
  const pgSize=pg.getSize();
  near(pgSize.width,210*72/25.4,.02,"Print PDF width");
  near(pgSize.height,297*72/25.4,.02,"Print PDF height");
 }
 pass("multi-page print layout PDF 13 cards => 2 A4 sheets");
 await page.locator("#pdfPreviewPage").selectOption("1");
 assert.equal(await page.locator("#pdfPreviewPage").inputValue(),"1");
 await page.locator("#pdfPrevPage").click();
 assert.equal(await page.locator("#pdfPreviewPage").inputValue(),"0");
 pass("photo PDF all-pages preview navigation");
 function jpegStreams(buf){
  const marker=Buffer.from("/Filter /DCTDecode /Length "),chunks=[];let offset=0;
  while(true){
   const pos=buf.indexOf(marker,offset);if(pos<0)break;
   const len=Number(buf.subarray(pos,pos+140).toString("latin1").match(/\/Length (\d+)/)?.[1]);
   const first=buf.indexOf(Buffer.from("stream\n"),pos);
   assert.ok(first>0&&len>100,"Image stream has bytes");
   chunks.push(buf.subarray(first+7,first+7+len));offset=first+7+len;
  }
  return chunks;
 }
 const raster=jpegStreams(layout.buffer);
 assert.equal(raster.length,2,"two distinct source photos embedded as reusable per-cell image objects");
 const bitmaps=raster.map(data=>jpeg.decode(data,{useTArray:true,tolerantDecoding:true}));
 function center(img){const off=(Math.floor(img.height/2)*img.width+Math.floor(img.width/2))*4;return [img.data[off],img.data[off+1],img.data[off+2]]}
 const redSlot=center(bitmaps[0]),blueSlot=center(bitmaps[1]);
 assert.ok(redSlot[0]>150&&redSlot[1]<120&&blueSlot[2]>145&&blueSlot[0]<140,"different uploaded image colors preserved in embedded PDF XObjects");
 function vectorStreams(buf){
  const text=buf.toString("latin1");
  return [...text.matchAll(/\d+ 0 obj\n<< \/Length \d+ >>\nstream\n([\s\S]*?)\nendstream\nendobj/g)].map(m=>m[1]);
 }
 const contents=vectorStreams(layout.buffer);
 assert.equal(contents.length,2,"vector PDF has one content stream per page");
 assert.equal((contents[0].match(/\/Im\d+ Do/g)||[]).length,10,"first page holds 10 positioned images");
 assert.equal((contents[1].match(/\/Im\d+ Do/g)||[]).length,3,"last page holds exactly 3 positioned images");
 assert.ok(contents.every(x=>x.includes(" re S Q")),"trim borders use editable vector rectangles");
 assert.ok(contents.every(x=>x.includes(" l S Q")),"cut marks use vector lines");
 pass("multi-image output and partial last PDF page contains no extra image frames");
 await page.goto(origin+"/tools/fold-simulator/?paper=a4&method=third",{waitUntil:"load"});
 assert.ok((await page.locator("#foldResult").textContent()).includes("99 × 210mm"),"A4 folded into 99×210mm");
 assert.ok((await page.locator("#foldMatches").textContent()).includes("長形3号"),"長形3号 appears as candidate");
 await page.locator("#foldPaper").selectOption("b5");
 await page.locator("#foldMethod").selectOption("long4");
 assert.ok((await page.locator("#foldResult").textContent()).includes("64.25 × 182mm"),"B5 long fourfold size");
 pass("folding geometry and envelope candidates");
 await page.goto(origin+"/",{waitUntil:"load"});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,undefined,{timeout:15000});
 const manifest=await page.evaluate(async()=>await (await fetch("/manifest.webmanifest")).json());
 assert.equal(manifest.start_url,"/");
 assert.equal(manifest.display,"standalone");
 await context.setOffline(true);
 await page.goto(origin+"/tools/units/",{waitUntil:"domcontentloaded"});
 assert.ok((await page.locator("h1").textContent()).length>0,"offline basic conversion available");
 await context.setOffline(false);
 pass("PWA manifest, service worker and offline precached calculator");

 await page.goto(origin+"/tools/bleed/",{waitUntil:"load"});
 assert.ok((await page.locator("#bleedResult").textContent()).includes("97.0×61.0mm"));
 pass("bleed card 3mm 97x61mm");
 await page.goto(origin+"/tools/overlay/",{waitUntil:"load"});
 assert.ok(await page.locator("#overlayGraphic rect").count()>=2);
 await page.locator("#ov1").selectOption("a3");
 const svg=await page.locator("#overlayGraphic").innerHTML();
 assert.ok(svg.includes("rect"));
 pass("overlay changes on selection");
 
 // Extended smoke tests: local label PDF, photo cropping, saved presets, image sharing.
 await page.goto(origin+"/tools/label-print/",{waitUntil:"load"});
 assert.ok((await page.locator("#labelSummary").textContent()).includes("24枚"),"24-label default layout");
 await page.locator('[data-label-preset="circle35"]').click();
 assert.ok((await page.locator("#labelSummary").textContent()).includes("35枚"),"35 circular labels");
 await page.locator('[data-label-preset="rect24"]').click();
 await page.locator("#labelCount").fill("26");
 const labels=await pdfFromDownload(page,"#labelDownload","pittari-labels.pdf");
 assert.equal(labels.pdf.getPageCount(),2,"26 labels require two A4 pages");
 for(const p of labels.pdf.getPages()){
  const size=p.getSize();near(size.width,210*72/25.4,.02,"Label PDF A4 width");near(size.height,297*72/25.4,.02,"Label PDF A4 height");
 }
 const labelContent=vectorStreams(labels.buffer);
 assert.equal(labelContent.length,2);
 assert.ok(labelContent[0].includes(" re S Q"),"label rectangles are vector lines");
 pass("label presets 24/35 and two-page A4 label PDF");
 await page.locator("#labelPreviewPage").selectOption("1");
 assert.equal(await page.locator("#labelPreviewPage").inputValue(),"1");
 pass("label PDF all-pages preview");
 await page.goto(origin+"/tools/label-print/",{waitUntil:"load"});
 await page.locator("#labelSheetMode").selectOption("custom");
 await page.locator("#labelCols").fill("2");
 await page.locator("#labelRows").fill("3");
 await page.locator("#labelPitchX").fill("65");
 await page.locator("#labelPitchY").fill("35");
 await page.locator("#labelStartX").fill("10");
 await page.locator("#labelStartY").fill("10");
 await page.locator("#labelOffsetX").fill("-1");
 await page.locator("#labelCount").fill("6");
 assert.ok((await page.locator("#labelSummary").textContent()).includes("6枚"),"custom label sheet 2 cols × 3 rows");
 const custom=await pdfFromDownload(page,"#labelDownload","pittari-labels.pdf");
 assert.equal(custom.pdf.getPageCount(),1);
 assert.ok(vectorStreams(custom.buffer)[0].includes(" re S Q"));
 pass("commercial label sheet custom rows, cols, pitches and alignment offset");
 await page.locator("#labelCsvText").fill("名前,番号\n田中,001\n佐藤,002\n鈴木,003");
 await page.locator("#labelCsvEnabled").check();
 assert.ok((await page.locator("#labelSummary").textContent()).includes("最終ページ：3枚"),"3 CSV rows excluding header");
 const csvOut=await pdfFromDownload(page,"#labelDownload","pittari-labels.pdf");
 assert.equal(csvOut.pdf.getPageCount(),1);
 assert.equal(jpegStreams(csvOut.buffer).length,3,"Japanese row texts use individual high-resolution images");
 assert.ok(vectorStreams(csvOut.buffer)[0].includes(" re S Q"),"CSV label outlines remain vector");
 pass("UTF-8 CSV distinct label values and vector geometry");
 await page.locator("#labelCsvText").fill('名前,備考\n"佐藤,営業",003\n"田中",004');
 assert.ok((await page.locator("#labelSummary").textContent()).includes("最終ページ：2枚"),"quoted CSV comma parsed correctly");
 pass("quoted CSV fields parsed");
 await page.goto(origin+"/tools/print-pdf/",{waitUntil:"load"});
 const sample=(r,g,b)=>{
  const data=Buffer.alloc(50*50*4);
  for(let i=0;i<50*50;i++){data[i*4]=r;data[i*4+1]=g;data[i*4+2]=b;data[i*4+3]=255}
  return jpeg.encode({data,width:50,height:50},90).data;
 };
 await page.locator("#pdfImage").setInputFiles([{name:"red.jpg",mimeType:"image/jpeg",buffer:sample(220,20,30)}]);
 await page.waitForFunction(()=>!document.getElementById("pdfPhotoAdjust").disabled);
 const initialPpi=await page.locator("#pdfPpiStatus").textContent();
 assert.ok(initialPpi.includes("PPI"),"PPI warning appears for selected file");
 await page.locator("#pdfZoom").evaluate(el=>{el.value="150";el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}))});
 assert.equal(await page.locator("#pdfZoomOutput").textContent(),"150%");
 const scaledPpi=await page.locator("#pdfPpiStatus").textContent();
 assert.notEqual(scaledPpi,initialPpi,"zoom impacts printed pixel density");
 pass("photo crop zoom 150%, PPI adjusts, controls enabled");
 assert.equal(await page.locator("#pdfUndoPhoto").isDisabled(),false);
 await page.locator("#pdfUndoPhoto").click();
 assert.equal(await page.locator("#pdfZoom").inputValue(),"100");
 await page.locator("#pdfRedoPhoto").click();
 assert.equal(await page.locator("#pdfZoom").inputValue(),"150");
 const draft=await page.evaluate(()=>sessionStorage.getItem("pittari:photo-draft:v2"));
 assert.ok(draft?.includes("1.5"),"in-session photo edits saved without file data");
 pass("photo crop undo, redo, temporary draft metadata");
 await page.locator("#pdfSaveName").fill("自動テスト設定");
 await page.locator("#pdfSavePreset").click();
 assert.ok((await page.locator("#pdfPresetStatus").textContent()).includes("保存しました"));
 await page.locator("#pdfGap").fill("7");
 await page.locator("#pdfLoadPreset").click();
 assert.equal(await page.locator("#pdfGap").inputValue(),"2");
 await page.locator("#pdfDeletePreset").click();
 pass("print setup local save, reload and delete");
 const [previewPng]=await Promise.all([page.waitForEvent("download"),page.locator("#pdfPreviewPng").click()]);
 assert.equal(previewPng.suggestedFilename(),"pittari-preview.png");
 pass("print preview PNG file download");
 await page.locator("#pdfShareUrl").click();
 await page.waitForFunction(()=>document.getElementById("pdfPresetStatus")?.textContent.includes("URL"),undefined,{timeout:10000});
 assert.ok((await page.locator("#pdfPresetStatus").textContent()).includes("URL"),"share URL generated or copied");
 pass("print setup shareable URL");
 await page.goto(origin+"/tools/overlay/?ov1=a3&ov2=a5&ov3=none",{waitUntil:"load"});
 assert.equal(await page.locator("#ov1").inputValue(),"a3");
 assert.equal(await page.locator("#ov2").inputValue(),"a5");
 const [overlayPng]=await Promise.all([page.waitForEvent("download"),page.locator("#resultImage").click()]);
 assert.equal(overlayPng.suggestedFilename(),"pittari-paper-comparison.png");
 pass("overlay URL parameters and PNG export");
 await page.goto(origin+"/tools/fold-simulator/?paper=a4&method=third",{waitUntil:"load"});
 const [foldPng]=await Promise.all([page.waitForEvent("download"),page.locator("#resultImage").click()]);
 assert.equal(foldPng.suggestedFilename(),"pittari-envelope-fold.png");
 pass("folding SVG diagram PNG export");
 await page.goto(origin+"/tools/label-print/",{waitUntil:"load"});
 assert.equal(await page.locator("#labelPreview").getAttribute("aria-label"),"A4のラベル配置プレビュー");
 assert.equal(await page.locator("#labelText").getAttribute("maxlength"),"100");
 pass("label input accessible naming and length limit");

 console.log("SUCCESS all "+passed+" browser/PDF tests passed");
}catch(error){
 console.error("FAIL browser PDF mobile verification: "+error.stack);
 process.exitCode=1;
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
