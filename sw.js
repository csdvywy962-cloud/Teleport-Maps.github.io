const CACHE_NAME = 'teleport-v1';
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((res) => res || fetch(event.request)));
});
