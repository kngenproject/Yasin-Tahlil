const CACHE = 'yasin-tahlil-v4';
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap';

// ---- INSTALL: cache font CSS + discover & cache all font woff2 files ----
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      const cssResp = await fetch(FONT_CSS, { mode: 'cors', credentials: 'omit' });
      const cssText = await cssResp.clone().text();
      await cache.put(new Request(FONT_CSS), cssResp);
      const woff2Urls = [...cssText.matchAll(/url\(([^)]+\.woff2[^)]*?)\)/g)].map(m => m[1].replace(/['"]/g,''));
      await Promise.all(woff2Urls.map(async url => {
        try {
          const r = await fetch(url, { mode: 'cors', credentials: 'omit' });
          await cache.put(new Request(url), r);
        } catch(_) {}
      }));
    } catch(_) {}
    await self.skipWaiting();
  })());
});

// ---- ACTIVATE: delete old caches ----
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ---- FETCH: Cache-First for fonts, Network-First + cache for page/navigation ----
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.startsWith('chrome-extension://') || url.startsWith('blob:') || url.startsWith('data:')) return;

  // Fonts: Cache-First
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request, { mode: 'cors', credentials: 'omit' }).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        });
      })
    );
    return;
  }

  // Navigation (HTML page): Network-First, fallback to cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('/')))
    );
    return;
  }

  // Everything else: Cache-First
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return resp;
    }))
  );
});
