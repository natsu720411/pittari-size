const CACHE="pittari-shell-20261122-4";
const CORE=["/","/paper/","/envelope/","/tools/","/tools/units/","/tools/dpi/","/tools/fold-simulator/","/assets/app.js","/assets/fold-simulator.js","/assets/style.css","/favicon.svg","/offline/"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(Promise.all([
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("pittari-shell-")&&k!==CACHE).map(k=>caches.delete(k)))),
 self.clients.claim()
])));
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"){
  event.respondWith(fetch(req).then(res=>{
   if(res.ok){const clone=res.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,clone)))}
   return res;
  }).catch(async()=>await caches.match(req)||await caches.match("/offline/")));
  return;
 }
 if(req.destination==="script"||req.destination==="style"||req.destination==="image"||url.pathname==="/manifest.webmanifest"){
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
   if(res.ok){const clone=res.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,clone)))}
   return res;
  })));
 }
});