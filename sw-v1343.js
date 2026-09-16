const CACHE='cosmic-explorer-v1343';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('cosmic-explorer-')&&n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(req,{cache:'no-cache'});if(r.ok)event.waitUntil(c.put('/index.html',r.clone()));return r}catch(_){return(await c.match('/index.html'))||Response.error()}})());return;
  }
  event.respondWith((async()=>{const c=await caches.open(CACHE),hit=await c.match(req);if(hit)return hit;try{const r=await fetch(req);if(r.ok)event.waitUntil(c.put(req,r.clone()));return r}catch(_){return Response.error()}})());
});