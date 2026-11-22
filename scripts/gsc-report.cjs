#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const file=process.argv[2];
if(!file||!fs.existsSync(file)){console.error("使い方: node scripts/gsc-report.cjs <Search ConsoleのCSVファイル>");process.exit(1)}
function csv(text){
 let rows=[],row=[],field="",quoted=false;
 for(let i=0;i<text.length;i++){
  const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else quoted=!quoted}
  else if(ch===","&&!quoted){row.push(field);field=""}
  else if((ch==="\r"||ch==="\n")&&!quoted){if(ch==="\r"&&text[i+1]==="\n")i++;row.push(field);field="";if(row.some(x=>x.trim()))rows.push(row);row=[]}
  else field+=ch;
 }
 row.push(field);if(row.some(x=>x.trim()))rows.push(row);return rows;
}
const rows=csv(fs.readFileSync(file,"utf8").replace(/^\uFEFF/,"")),head=(rows.shift()||[]).map(s=>s.trim().toLowerCase());
const find=(...names)=>head.findIndex(h=>names.includes(h));
const q=find("クエリ","上位のクエリ","query","search query");
const p=find("ページ","上位のページ","page");
const c=find("クリック数","クリック","clicks","click"),v=find("表示回数","impressions","impression");
const position=find("掲載順位","平均掲載順位","position","average position");
if(c<0||v<0||q<0&&p<0){console.error("クエリ/ページ・クリック数・表示回数の列がありません。GSCの検索結果パフォーマンスからCSVを出力してください。");process.exit(2)}
const num=x=>{const n=Number(String(x||"").replace(/,/g,"").replace("%",""));return Number.isFinite(n)?n:0};
const data=rows.map(x=>({name:(x[q>=0?q:p]||"").trim(),clicks:num(x[c]),impressions:num(x[v]),position:position<0?null:num(x[position])})).filter(x=>x.name&&x.impressions>=0&&x.clicks>=0);
const totalClicks=data.reduce((n,r)=>n+r.clicks,0),totalImpressions=data.reduce((n,r)=>n+r.impressions,0);
const byImpressions=[...data].sort((a,b)=>b.impressions-a.impressions);
const opportunities=data.filter(x=>x.position!==null&&x.position>=4&&x.position<=25&&x.impressions>=20)
 .map(x=>({...x,ctr:100*x.clicks/x.impressions,score:x.impressions/(1+x.clicks)*Math.max(.1,(26-x.position)/26)}))
 .sort((a,b)=>b.score-a.score).slice(0,15);
const report={source:"User-exported Google Search Console CSV",type:q>=0?"query":"page",rows:data.length,
 total:{clicks:totalClicks,impressions:totalImpressions,ctr:totalImpressions?Number((100*totalClicks/totalImpressions).toFixed(2)):0},
 top:byImpressions.slice(0,10),opportunities:opportunities.map(x=>({name:x.name,clicks:x.clicks,impressions:x.impressions,ctr:Number(x.ctr.toFixed(2)),position:x.position}))};
console.log(JSON.stringify(report,null,2));
console.error("注意：CSVに収録された行だけの合計です。匿名化・絞り込み等によりSearch Consoleの画面合計とは異なる場合があります。順位上昇を保証するものではありません。");
