self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('calculator-v1').then(cache => {
      return cache.addAll(['/', '/index.html', '/style.css', '/index.js']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});