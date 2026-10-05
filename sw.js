const MEDIA_CACHE = '1nort-advoga-media-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const send = (client, payload) => {
  if (client && typeof client.postMessage === 'function') client.postMessage(payload);
};

const cacheKey = (url) => new Request(new URL(url, self.location.href).href, {
  method: 'GET',
  credentials: 'same-origin',
});

const prepareMedia = async (urls, client) => {
  const cache = await caches.open(MEDIA_CACHE);
  let done = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      const request = cacheKey(url);
      const cached = await cache.match(request);
      if (!cached) {
        const response = await fetch(request, { cache: 'reload' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await cache.put(request, response.clone());
      }
    } catch (error) {
      failed += 1;
    }

    done += 1;
    send(client, { type: 'MEDIA_PREP_PROGRESS', done, total: urls.length });
  }

  send(client, { type: 'MEDIA_PREPARED', total: urls.length, failed });
};

const checkMedia = async (urls, client) => {
  const cache = await caches.open(MEDIA_CACHE);
  let cached = 0;
  for (const url of urls) {
    if (await cache.match(cacheKey(url))) cached += 1;
  }
  send(client, { type: 'MEDIA_STATUS', total: urls.length, cached });
};

self.addEventListener('message', (event) => {
  const data = event.data || {};
  const urls = Array.isArray(data.urls) ? Array.from(new Set(data.urls.filter(Boolean))) : [];

  if (data.type === 'PREPARE_MEDIA') {
    event.waitUntil(prepareMedia(urls, event.source));
  }

  if (data.type === 'CHECK_MEDIA') {
    event.waitUntil(checkMedia(urls, event.source));
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.toLowerCase().endsWith('.mp4')) return;

  event.respondWith((async () => {
    const cache = await caches.open(MEDIA_CACHE);
    const cached = await cache.match(event.request);
    return cached || fetch(event.request);
  })());
});
