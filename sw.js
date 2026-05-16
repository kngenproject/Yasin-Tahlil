// sw.js — Service Worker untuk Hadhroh · Yasin · Tahlil · Do'a
// Ganti CACHE_NAME setiap deploy baru agar update terdeteksi
const CACHE_NAME = 'yasin-v1.1';

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

// ===== FETCH: cache-first, fallback ke network =====
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
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
});

// ===== MESSAGE: terima perintah SKIP_WAITING dari toast =====
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
