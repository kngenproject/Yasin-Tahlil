// sw.js — Service Worker untuk Hadhroh · Yasin · Tahlil · Do'a
// Ganti CACHE_NAME setiap deploy baru agar update terdeteksi
const CACHE_NAME = 'yasin-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
];

// ===== INSTALL: cache file utama =====
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  // Jangan skipWaiting di sini — biarkan user yang memilih via toast
});

// ===== ACTIVATE: hapus cache lama =====
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH: stale-while-revalidate untuk index.html, cache-first untuk aset =====
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isHTML = url.pathname.endsWith('/') || url.pathname.endsWith('.html');

  if (isHTML) {
    // Stale-while-revalidate:
    // 1. Langsung sajikan dari cache (offline aman & cepat)
    // 2. Di background fetch versi baru, simpan ke cache
    // 3. Kalau ada perubahan, beritahu halaman via postMessage
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(e.request).then(cached => {
          const networkFetch = fetch(e.request).then(async res => {
            if (res && res.status === 200) {
              // Cek apakah konten berubah
              const newClone = res.clone();
              const oldRes = await cache.match(e.request);
              const newText = await newClone.text();
              const oldText = oldRes ? await oldRes.text() : null;

              if (oldText !== null && oldText !== newText) {
                // Ada versi baru — simpan & beritahu semua client
                await cache.put(e.request, new Response(newText, {
                  status: res.status,
                  statusText: res.statusText,
                  headers: res.headers,
                }));
                const clients = await self.clients.matchAll({ type: 'window' });
                clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
              } else if (oldText === null) {
                // Belum ada cache sama sekali, simpan
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

          // Sajikan cache dulu, revalidate di background
          if (cached) {
            e.waitUntil(networkFetch);
            return cached;
          }
          // Belum ada cache, tunggu network
          return networkFetch.then(r => r || Promise.reject('offline'));
        })
      )
    );
  } else {
    // Cache-first untuk aset (font, gambar, dll)
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

// ===== MESSAGE: terima perintah SKIP_WAITING dari toast =====
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
