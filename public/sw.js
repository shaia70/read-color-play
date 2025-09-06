
// This is a simple service worker that caches the app shell
const CACHE_NAME = 'shelley-books-v15';

// Assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json?v=15',
  '/favicon.svg?v=15',
  '/favicon.png?v=15'
];

// Install service worker and cache the app shell
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // Skip non-http requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache if response is not ok
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache http/https requests
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache).catch(err => {
                    console.log('Failed to cache:', event.request.url, err);
                  });
                }
              });
              
            return networkResponse;
          })
          .catch(err => {
            console.log('Fetch failed:', event.request.url, err);
            // Return a fallback response or just let it fail
            throw err;
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Claim control immediately
  event.waitUntil(self.clients.claim());
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
