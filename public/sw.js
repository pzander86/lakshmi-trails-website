/**
 * Service Worker for Lakshmi Trails
 * Optimized for mobile performance and offline experience
 */

const CACHE_NAME = 'lakshmi-trails-v1';
const CACHE_VERSION = '1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/assets/images/logo.svg',
  '/assets/images/hero-mobile-800.webp',
  '/assets/images/hero-desktop-1920.webp',
  '/fonts/Lato,Playfair_Display/Lato/Lato-Regular.ttf',
  '/fonts/Lato,Playfair_Display/Playfair_Display/static/PlayfairDisplay-Regular.ttf',
  '/js/performance-boost.js'
];

// Image resources for mobile optimization
const IMAGE_RESOURCES = [
  '/assets/tours/kerala-backwaters-houseboat.webp',
  '/assets/tours/kerala-theyyam-ritual.webp',
  '/assets/tours/karnataka-mysore-palace.webp'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network (for static assets)
  CACHE_FIRST: 'cache-first',
  // Network first, then cache (for dynamic content)
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate (for images)
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    // Clean up old caches
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker activation failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except fonts)
  if (url.origin !== location.origin && !url.hostname.includes('fonts')) {
    return;
  }
  
  // Skip API endpoints
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  event.respondWith(handleFetchRequest(request));
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Different strategies for different resource types
    if (isStaticAsset(url)) {
      return await cacheFirstStrategy(request);
    } else if (isImage(url)) {
      return await staleWhileRevalidateStrategy(request);
    } else if (isDocument(url)) {
      return await networkFirstStrategy(request);
    } else {
      // Default: try cache first, then network
      return await cacheFirstStrategy(request);
    }
  } catch (error) {
    console.error('Fetch handling failed:', error);
    return fetch(request);
  }
}

// Cache first strategy - for static assets (fonts, JS, CSS)
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    // Return cached version immediately
    return cached;
  }
  
  try {
    // Fetch from network and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('Network fetch failed for:', request.url);
    throw error;
  }
}

// Network first strategy - for HTML pages
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('Network failed, trying cache for:', request.url);
    
    // Fallback to cache
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // If no cache, return offline page or error
    if (isDocument(new URL(request.url))) {
      const offlinePage = await cache.match('/');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    throw error;
  }
}

// Stale while revalidate strategy - for images
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Always try to fetch fresh version in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.warn('Background fetch failed for:', request.url);
    });
  
  // Return cached version immediately if available
  if (cached) {
    // Don't await the fetch - it runs in background
    fetchPromise;
    return cached;
  }
  
  // If no cache, wait for network
  return fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|eot)$/i.test(url.pathname);
}

function isImage(url) {
  return /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(url.pathname);
}

function isDocument(url) {
  return url.pathname.endsWith('/') || 
         url.pathname.endsWith('.html') || 
         !url.pathname.includes('.');
}

// Background sync for offline actions (optional enhancement)
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Handle offline contact form submissions when back online
  // This would integrate with your contact form logic
  console.log('Syncing offline contact form submissions...');
}

// Handle push notifications (future enhancement)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/logo.svg',
      badge: '/assets/images/logo.svg',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View Journey',
          icon: '/assets/images/logo.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/images/logo.svg'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log(`Service Worker ${CACHE_VERSION} loaded`);