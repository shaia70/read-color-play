
// This is a simple service worker that caches the app shell
const CACHE_NAME = 'shelley-books-v16';

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
  // Skip non-HTTP requests and chrome-extension requests
  if (!event.request.url.startsWith('http') || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.startsWith('moz-extension://') ||
      event.request.url.startsWith('ms-browser-extension://')) {
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
            // Don't cache if response is not ok or if it's an extension request
            if (!networkResponse || 
                networkResponse.status !== 200 || 
                networkResponse.type !== 'basic' ||
                event.request.url.includes('chrome-extension')) {
              return networkResponse;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            // Cache only valid HTTP requests
            if (event.request.url.startsWith('http')) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  try {
                    cache.put(event.request, responseToCache);
                  } catch (error) {
                    console.warn('Failed to cache request:', event.request.url, error);
                  }
                })
                .catch(error => {
                  console.warn('Cache operation failed:', error);
                });
            }
              
            return networkResponse;
          })
          .catch(error => {
            console.warn('Fetch failed:', error);
            // Return a basic response if fetch fails
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable'
            });
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
