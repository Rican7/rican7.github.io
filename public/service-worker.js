/*
 * Service worker for trevorsuarez.com
 *
 * IMPORTANT: Never delete or rename this file. Browsers that installed a
 * service worker from this URL keep running it until they successfully
 * fetch a *different* script here; a 404 leaves the installed one in
 * charge indefinitely. (The pre-Astro site's sw-precache worker kept
 * serving years-old pages from its cache that way.) To retire this
 * worker, replace its contents with one that unregisters itself.
 *
 * Strategy: network-first, so anyone with a working connection always
 * gets the live site. The cache is only a fallback for when the network
 * fails, or is too slow while a cached copy exists. Astro's hashed build
 * assets (/_astro/*) never change once published, so they're cache-first.
 */

const CACHE_NAME = 'trevorsuarez-v1';
const LEGACY_CACHE_PREFIX = 'sw-precache-';
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const staleKeys = (await caches.keys()).filter((key) => key !== CACHE_NAME);
      await Promise.all(staleKeys.map((key) => caches.delete(key)));
      await self.clients.claim();

      // Pages open from the legacy worker's cache are showing stale
      // content, so reload them now that it's gone. (Deliberately not
      // awaited: the reloads' fetches wait for this activation to finish,
      // so waiting on them here would deadlock.)
      if (staleKeys.some((key) => key.startsWith(LEGACY_CACHE_PREFIX))) {
        const windows = await self.clients.matchAll({ type: 'window' });
        windows.forEach((client) => client.navigate(client.url).catch(() => {}));
      }
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Leave everything else to the browser: cross-origin requests
  // (analytics), non-GETs, and partial (range) requests, which the
  // Cache API can't store
  if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('range')) {
    return;
  }

  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirst(event));
    return;
  }

  // Key pages by path alone, so query strings (like UTM tags) don't each
  // get their own cached copy, or miss the cache when offline
  const cacheKey = request.mode === 'navigate' ? url.origin + url.pathname : request;
  event.respondWith(networkFirst(event, cacheKey));
});

async function networkFirst(event, cacheKey) {
  const network = fetch(event.request);
  event.waitUntil(network.then((response) => updateCache(cacheKey, response)).catch(() => {}));

  const cached = await caches.match(cacheKey);
  if (!cached) {
    return network;
  }

  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS, cached));
  return Promise.race([network.catch(() => cached), timeout]);
}

async function cacheFirst(event) {
  const cached = await caches.match(event.request);
  if (cached) {
    return cached;
  }

  const response = await fetch(event.request);
  event.waitUntil(updateCache(event.request, response));
  return response;
}

function updateCache(key, response) {
  if (!response.ok || response.type !== 'basic') {
    return;
  }

  // Clone synchronously, before the original's body can be consumed
  const copy = response.clone();
  return caches.open(CACHE_NAME).then((cache) => cache.put(key, copy));
}
