const CACHE_NAME = 'my-website-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/styles.css',
  '/offline.html',  // Add offline page to cache
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Logo_Unand_PTNBH.png/492px-Logo_Unand_PTNBH.png'
];

// Install Service Worker and cache the necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch resources and serve cached files if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached resource if found, otherwise fetch from the network
        return response || fetch(event.request).catch(() => caches.match('/offline.html'));  // Fallback to offline page
      })
  );
});

// Update Service Worker and clear old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


