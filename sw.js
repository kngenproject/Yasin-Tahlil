// sw.js — Hadhroh Yasin Tahlil Do'a
// Ganti CACHE_NAME setiap deploy konten baru
const CACHE_NAME = 'yasin-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// stale-while-revalidate untuk HTML, cache-first untuk aset
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = url.pathname.endsWith('/') || url.pathname.endsWith('.html');

  if (isHTML) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(e.request);
        const networkFetch = fetch(e.request).then(async res => {
          if (res && res.status === 200) {
            const newClone = res.clone();
            const oldRes = await cache.match(e.request);
            const newText = await newClone.text();
            const oldText = oldRes ? await oldRes.text() : null;
            if (oldText !== null && oldText !== newText) {
              await cache.put(e.request, new Response(newText, {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers,
              }));
              const clients = await self.clients.matchAll({ type: 'window' });
              clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
            } else if (oldText === null) {
              await cache.put(e.request, new Response(newText, {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers,
              }));
            }
            return new Response(newText, {
              status: res.status,
              statusText: res.statusText,
              headers: res.headers,
            });
          }
          return res;
        }).catch(() => null);

        if (cached) {
          e.waitUntil(networkFetch);
          return cached;
        }
        return networkFetch.then(r => r || Promise.reject('offline'));
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});