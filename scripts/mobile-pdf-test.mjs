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
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".xml":"application/xml",".ico":"image/x-icon"};
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
  for(const route of ["/","/paper/a4/","/tools/bleed/","/tools/print-pdf/","/photo/l/"]){
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
 assert.ok(defaultCount.includes("10個"),"A4 10 business cards");
 await page.locator("#pdfCount").fill("13");
 const layout=await pdfFromDownload(page,"#pdfCreate","pittari-print.pdf");
 assert.equal(layout.pdf.getPageCount(),2,"13 cards need 2 pages");
 for(const pg of layout.pdf.getPages()){
  const pgSize=pg.getSize();
  near(pgSize.width,210*72/25.4,.02,"Print PDF width");
  near(pgSize.height,297*72/25.4,.02,"Print PDF height");
 }
 pass("multi-page print layout PDF 13 cards => 2 A4 sheets");
 await page.goto(origin+"/tools/bleed/",{waitUntil:"load"});
 assert.ok((await page.locator("#bleedResult").textContent()).includes("97.0×61.0mm"));
 pass("bleed card 3mm 97x61mm");
 await page.goto(origin+"/tools/overlay/",{waitUntil:"load"});
 assert.ok(await page.locator("#overlayGraphic rect").count()>=2);
 await page.locator("#ov1").selectOption("a3");
 const svg=await page.locator("#overlayGraphic").innerHTML();
 assert.ok(svg.includes("rect"));
 pass("overlay changes on selection");
 console.log("SUCCESS all "+passed+" browser/PDF tests passed");
}catch(error){
 console.error("FAIL browser PDF mobile verification: "+error.stack);
 process.exitCode=1;
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
