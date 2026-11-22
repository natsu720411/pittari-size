#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),origin="https://pittari-size.vercel.app";
const sitemap=fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const uniqueUrls=new Set(urls),errors=[],warnings=[],seenTitles=new Map(),seenDescs=new Map();
if(uniqueUrls.size!==urls.length)errors.push("Duplicate sitemap URL");
let pages=0,links=0;
function walk(dir){
 const result=[];for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  if(item.name===".git"||item.name==="node_modules")continue;
  const full=path.join(dir,item.name);
  if(item.isDirectory())result.push(...walk(full));
  else if(item.name==="index.html")result.push(full);
 }
 return result;
}
const allHtml=walk(root).filter(file=>!file.endsWith(path.join("offline","index.html")));
const offlineFile=path.join(root,"offline","index.html");
if(!fs.existsSync(offlineFile)||!fs.readFileSync(offlineFile,"utf8").includes("noindex,nofollow"))errors.push("Offline fallback must exist and be noindex");
for(const u of urls){
 if(!u.startsWith(origin+"/")){errors.push("Foreign sitemap URL "+u);continue}
 const route=u.slice(origin.length);
 const file=path.join(root,route,"index.html");
 if(!fs.existsSync(file)){errors.push("Missing page "+route);continue}
 const html=fs.readFileSync(file,"utf8");
 pages++;
 const title=(html.match(/<title>([\s\S]*?)<\/title>/)||[])[1];
 const desc=(html.match(/<meta name="description" content="([^"]*)"/)||[])[1];
 const canon=(html.match(/<link rel="canonical" href="([^"]*)"/)||[])[1];
 if(!title)errors.push("Missing title "+route);
 if(!desc)errors.push("Missing description "+route);
 if(canon!==u)errors.push("Canonical mismatch "+route);
 const h1=(html.match(/<h1(?:\s|>)/g)||[]).length;
 if(h1!==1)errors.push("H1 count "+h1+": "+route);
 if(title){
  if(seenTitles.has(title))warnings.push("Duplicate title "+route+" vs "+seenTitles.get(title));
  seenTitles.set(title,route);
 }
 if(desc){
  if(desc.length<30)warnings.push("Short description "+route);
  if(seenDescs.has(desc))warnings.push("Repeated description "+route+" vs "+seenDescs.get(desc));
  seenDescs.set(desc,route);
 }
 for(const m of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const dest=m[1];links++;
  if(dest==="/favicon.svg"||dest==="/robots.txt"||dest==="/sitemap.xml")continue;
  if(dest==="/manifest.webmanifest"){if(!fs.existsSync(path.join(root,"manifest.webmanifest")))errors.push("Missing manifest");continue}
  if(dest.startsWith("/assets/")){if(!fs.existsSync(path.join(root,dest)))errors.push("Missing asset "+dest);continue}
  if(!uniqueUrls.has(origin+dest))errors.push("Broken sitemap link "+route+" -> "+dest);
 }
 const scriptTags=[...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)];
 for(const m of scriptTags)if(!fs.existsSync(path.join(root,m[1])))errors.push("Missing script "+route+" "+m[1]);
}
if(pages!==allHtml.length)errors.push("HTML count mismatch "+pages+" vs "+allHtml.length);
// Keep homepage's lightweight search index in sync with the full-site index.
try{
 const full=fs.readFileSync(path.join(root,"assets/app.js"),"utf8");
 const home=fs.readFileSync(path.join(root,"assets/home.js"),"utf8");
 const a=full.indexOf(",search="),b=full.indexOf(";const g=id=>",a);
 const c=home.indexOf("const SEARCH_INDEX="),d=home.indexOf(";\nconst normalize=",c);
 if(a<0||b<0||c<0||d<0)throw Error("Search index format changed");
 const big=JSON.parse(full.slice(a+8,b)),small=JSON.parse(home.slice(c+"const SEARCH_INDEX=".length,d));
 if(JSON.stringify(big)!==JSON.stringify(small))errors.push("Homepage search index differs from all-page search index");
 if(big.length!==urls.length)errors.push("Search index entry count differs from sitemap");
 const seen=new Set(small.map(item=>item.url));
 if(seen.size!==small.length||urls.some(u=>!seen.has(u.slice(origin.length))))errors.push("Homepage search URLs differ from sitemap");
 if(!fs.readFileSync(path.join(root,"index.html"),"utf8").includes('src="/assets/home.js"'))errors.push("Homepage light script not active");
}catch(e){errors.push("Homepage search index audit: "+e.message)}
const jsfiles=fs.readdirSync(path.join(root,"assets")).filter(n=>n.endsWith(".js"));
for(const file of jsfiles){
 try{new vm.Script(fs.readFileSync(path.join(root,"assets",file),"utf8"),{filename:file})}
 catch(e){errors.push("JavaScript syntax "+file+" "+e.message)}
}
const appBytes=fs.statSync(path.join(root,"assets/app.js")).size,cssBytes=fs.statSync(path.join(root,"assets/style.css")).size;
if(appBytes>80000)warnings.push("App JS size over 80KB");
if(cssBytes>60000)warnings.push("CSS size over 60KB");
console.log(JSON.stringify({pages,htmlPages:allHtml.length,linksChecked:links,jsFilesChecked:jsfiles.length,mainJsKB:Math.round(appBytes/1024),cssKB:Math.round(cssBytes/1024),errors,warnings},null,2));
if(errors.length)process.exitCode=1;
