// Service Worker for Lakshmi Trails - Performance Optimization
const CACHE_NAME = 'lakshmi-trails-v1';
const STATIC_CACHE = [
  '/',
  '/js/performance-boost.js',
  '/assets/images/hero-desktop-1920.webp',
  '/assets/images/hero-mobile-800.webp',
  '/assets/images/logo.svg',
  '/favicon.svg'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - implement stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          // Fetch updated version in background
          fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
          }).catch(() => {
            // Network failed, cached version is still valid
          });
          
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request).then((response) => {
          if (response.status === 200 && shouldCache(request)) {
            cache.put(request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

// Helper function to determine if resource should be cached
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Cache static assets
  if (url.pathname.includes('/assets/') ||
      url.pathname.includes('/_astro/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.woff2')) {
    return true;
  }
  
  // Cache API responses
  if (url.pathname.startsWith('/api/')) {
    return false; // Don't cache API responses
  }
  
  // Cache pages
  return true;
}