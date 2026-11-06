const C='fd-__BUILD__';
const FILES=__FILES__;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  // Vidéos (rangs animés) : jamais en cache hors ligne, lues en flux par le navigateur (requêtes Range).
  if(/\.mp4$/i.test(new URL(r.url).pathname))return;
  if(r.mode==='navigate'){const u=new URL(r.url);u.searchParams.set('_',Date.now());e.respondWith(fetch(u.href,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./',cp));return res}).catch(()=>caches.match('./')));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={title:'FIGHT DYNASTY',body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'FIGHT DYNASTY',{body:d.body||'',tag:d.tag||undefined,icon:'icons/icon-192.png',badge:'icons/icon-192.png',data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{for(const c of L){if('focus' in c)return c.focus()}return clients.openWindow((e.notification.data&&e.notification.data.url)||'./')}))});
