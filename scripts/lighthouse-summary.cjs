#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),paths=process.argv.slice(2);
if(!paths.length)throw Error("Pass report files");
const reports=paths.map(path=>{
 const j=JSON.parse(fs.readFileSync(path,"utf8"));
 if(!j.categories?.performance||!j.categories?.seo)throw Error("Invalid Lighthouse report "+path);
 const score=k=>Math.round(100*(j.categories[k]?.score||0));
 const metric=k=>j.audits?.[k]?.numericValue??null;
 const fails=(j.categories?.accessibility?.auditRefs||[]).filter(ref=>ref.weight>0&&j.audits?.[ref.id]?.score!==null&&j.audits?.[ref.id]?.score<1)
  .map(ref=>({id:ref.id,title:j.audits[ref.id].title,score:j.audits[ref.id].score,
    sample:(j.audits[ref.id].details?.items||[]).slice(0,3).map(item=>item.node?.selector||item.node?.snippet||"").filter(Boolean)}));
 return {path,url:j.finalDisplayedUrl||j.requestedUrl,performance:score("performance"),seo:score("seo"),accessibility:score("accessibility"),
  lcpMs:metric("largest-contentful-paint"),cls:metric("cumulative-layout-shift"),tbtMs:metric("total-blocking-time"),speedIndexMs:metric("speed-index"),failedAccessibilityChecks:fails};
});
const result={environment:"Lighthouse simulated mobile on a local GitHub Actions web server; not real-user Web Vitals",reports};
fs.mkdirSync("reports",{recursive:true});fs.writeFileSync("reports/summary.json",JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
