const CACHE_NAME = 'teleport-maps-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/map.html',
    '/style.css',
    '/js.js' // Добавили новый файл в кэш!
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((res) => res || fetch(event.request)));
});
