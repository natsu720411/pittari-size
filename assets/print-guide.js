(()=>{"use strict";
 const guide=document.querySelector("[data-print-guide]");if(!guide)return;
 const kind=guide.dataset.printGuide,$=id=>document.getElementById(id),output=$("printGuideStatus");
 const field=(id)=>{const el=$(id);if(!el)return;el.scrollIntoView({block:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});if(!el.disabled&&typeof el.focus==="function")el.focus({preventScroll:true})};
 const form=$(kind==="label"?"labelForm":"printPdfForm");
 guide.addEventListener("click",event=>{
  const button=event.target.closest("button");if(!button||!guide.contains(button))return;
  if(button.dataset.guideFocus){field(button.dataset.guideFocus);return}
  if(button.dataset.guideAction==="label-csv"){
   const check=$("labelCsvEnabled");check.checked=true;check.dispatchEvent(new Event("input",{bubbles:true}));
   output.textContent="CSVを貼り付けてください。1行が1枚のラベルになります。";field("labelCsvText");return
  }
  if(button.dataset.guideAction==="label-sheet"){
   const select=$("labelSheetMode");select.value="custom";select.dispatchEvent(new Event("change",{bubbles:true}));
   output.textContent="市販台紙のラベル寸法・ピッチを製品の仕様表に合わせてください。";field("labelCols");return
  }
  if(button.dataset.guideAction==="pdf-photo"){
   field("pdfImage");output.textContent="写真は任意です。選ばない場合は番号付きの配置ガイドを作成できます。";return
  }
  if(button.dataset.guideAction!=="check")return;
  try{
   if(form&&!form.checkValidity()){
    const invalid=form.querySelector(":invalid");output.textContent="入力欄を確認してください。数値の範囲や必須項目に不足があります。";
    invalid?.focus();return
   }
   if(kind==="pdf"){
    const info=window.PittariPrintCore?.layout();if(!info)throw Error("プレビューを読み込めませんでした");
    const names={a4:"A4",a3:"A3",b5:"B5"},paper=names[$("pdfPaper").value]||"用紙";
    const count=$("pdfImage").files?.length||0;
    const ppi=$("pdfPpiStatus")?.textContent||"";
    output.textContent="確認OK："+paper+"・"+info.count+"枚・PDF "+info.pages+"ページ。"+(count?count+"画像を利用します。"+(ppi.includes("低くなる")||ppi.includes("粗くなる")?"解像度の警告も確認してください。":""):"写真なしなので番号付きガイドを作成します。")+"保存後は100%倍率で印刷してください。";
   }else{
    const summary=$("labelSummary")?.textContent||"";
    if(!summary.includes("1ページ最大"))throw Error(summary||"ラベル配置を確認してください");
    const csv=$("labelCsvEnabled").checked;
    const text=$("labelText").value.trim();
    output.textContent="確認OK："+summary.replace(/\s+/g," ").trim().slice(0,140)+"。"+(csv?"CSVを差し込みます。":text?"共通文字を印刷します。":"文字が空欄です。")+"PDF保存後、普通紙で試し刷りし100%倍率で印刷してください。";
   }
  }catch(err){output.textContent="設定を確認してください："+err.message}
 });
 form?.addEventListener("input",()=>{if(!output.textContent.includes("CSVを貼り付け"))output.textContent="設定を変更しました。保存前にもう一度「印刷前チェック」を押してください。"});
})();