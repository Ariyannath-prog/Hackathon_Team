const CACHE_NAME = 'ecotech-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/style2.css',
  '/script.js',
  '/frontend/favicon_io/favicon-32x32.png',
  '/frontend/favicon_io/favicon-16x16.png',
  '/frontend/favicon_io/apple-touch-icon.png',
  '/frontend/favicon_io/android-chrome-512x512.png',
  '/frontend/favicon_io/android-chrome-192x192.png',
  '/frontend/clg.jpg',
  '/frontend/e1.png',
  '/frontend/e2.jpeg',
  '/frontend/e3.png',
  '/frontend/e4.png',
  '/frontend/uni.png',
  '/frontend/ngo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
