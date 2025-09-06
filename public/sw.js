// This is a simple service worker that caches the app shell
const CACHE_NAME = 'shelley-books-v18';

// Assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png'
];

// Install service worker and cache the app shell
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Failed to cache initial resources:', err);
        });
      })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // Only handle http/https requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Skip requests with unsupported schemes
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
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
            // Don't cache if response is not ok or not from same origin
            if (!networkResponse || 
                networkResponse.status !== 200 || 
                networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            // Cache the response
            caches.open(CACHE_NAME)
              .then(cache => {
                try {
                  // Double check the URL scheme before caching
                  const requestUrl = new URL(event.request.url);
                  if (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') {
                    cache.put(event.request, responseToCache);
                  }
                } catch (err) {
                  console.log('Failed to cache request:', event.request.url, err);
                }
              })
              .catch(err => {
                console.log('Failed to open cache:', err);
              });
              
            return networkResponse;
          })
          .catch(err => {
            console.log('Fetch failed for:', event.request.url, err);
            throw err;
          });
      })
      .catch(err => {
        console.log('Cache match failed for:', event.request.url, err);
        // Fallback to network
        return fetch(event.request);
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