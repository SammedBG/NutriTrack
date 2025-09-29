/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'nutritrack-cache-v1';
const urlsToCache = [
  '/',               // main entry
  '/manifest.json',  // PWA manifest
  '/favicon.ico'     // favicon
];

// Install event: cache minimal files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // activate immediately after install
});

// Fetch event: network-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and store in cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback to cache if offline
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim(); // take control of open pages immediately
});
