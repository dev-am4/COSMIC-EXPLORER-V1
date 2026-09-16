const CACHE='cosmic-explorer-v123';
const PRECACHE=[
  '/','/index.html','/operator.html','/asset-check.html',
  '/styles-v9.css','/styles-v11.css','/styles-v11-phase3.css','/styles-v12.css','/styles-v121.css','/styles-v122.css','/styles-v123.css',
  '/app-v9-01.js','/app-v9-02.js','/app-v9-03.js','/app-v9-04.js','/app-v9-05.js','/app-v9-06.js','/app-v9-07.js','/app-v9.js',
  '/phase2-v11.js','/phase3-v11.js','/v12-patch.js','/v121-patch.js','/v122-patch.js','/v123-patch.js','/v11-ui.js','/phase3-ui.js','/v12-ui.js','/v121-ui.js','/v122-ui.js','/v123-ui.js','/asset-bootstrap-v122.js',
  '/assets/v9/player1.webp','/assets/v9/player2.webp','/assets/v9/player3.webp','/assets/v9/player4.webp',
  '/assets/v9/enemy1.js','/assets/v9/enemy2.js','/assets/v9/enemy3.js','/assets/v9/enemy4.js',
  '/assets/v9/boss1.js','/assets/v9/boss2.js','/assets/v9/boss3.js','/assets/v9/boss4.js',
  '/assets/v9/planet-earth.js','/assets/v9/planet-moon.js','/assets/v9/planet-mars.js','/assets/v9/planet-hole.js',
  '/assets/v9/pickup-energy.js','/assets/v9/pickup-repair.js','/assets/v9/pickup-shield.js','/assets/v9/pickup-weapon.js','/assets/v9/pickup-rocket.js','/assets/v9/pickup-bomb.js'
];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(PRECACHE.map(async path=>{try{const r=await fetch(new Request(path,{cache:'reload'}));if(r.ok)await cache.put(path,r.clone());}catch(_){}}));await self.skipWaiting();})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('cosmic-explorer-')&&n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim();})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;const path=url.pathname;if(req.mode==='navigate'){event.respondWith((async()=>{try{const r=await fetch(req);const c=await caches.open(CACHE);if(r.ok)c.put(path,r.clone());return r}catch(_){const c=await caches.open(CACHE);return(await c.match(path))||(await c.match('/index.html'))}})());return}event.respondWith((async()=>{const c=await caches.open(CACHE),hit=(await c.match(req))||(await c.match(path));if(hit)return hit;try{const r=await fetch(req);if(r.ok){c.put(req,r.clone());c.put(path,r.clone())}return r}catch(_){return hit||Response.error()}})())});