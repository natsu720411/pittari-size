const CACHE="pittari-shell-20261122-v5";
const CORE=["/","/paper/","/envelope/","/tools/","/tools/units/","/tools/dpi/","/tools/fold-simulator/","/tools/label-print/","/tools/print-pdf/","/assets/app.js","/assets/label-print.js","/assets/pdf-vector.js","/assets/pdf-layout-v2.js","/assets/print-editor.js","/assets/fold-simulator.js","/assets/style.css","/favicon.svg","/offline/"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("pittari-shell-")&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
function networkFirst(req,event,fallback){
 return fetch(req).then(res=>{
  if(res.ok&&res.status===200){
   const copy=res.clone();
   event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{}));
  }
  return res;
 }).catch(async()=>await caches.match(req)||await caches.match(fallback)||Response.error());
}
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"){
  event.respondWith(networkFirst(req,event,"/offline/"));return;
 }
 if(req.destination==="script"||req.destination==="style"||url.pathname==="/manifest.webmanifest"){
  // Network first prevents an older JS/CSS file from remaining stuck in an offline-first cache.
  event.respondWith(networkFirst(req,event));return;
 }
 if(req.destination==="image"){
  event.respondWith(caches.match(req).then(cached=>cached||networkFirst(req,event)));
 }
});