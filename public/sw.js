const CACHE_NAME = 'skillpass-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    // Only cache GET requests. POST/PUT/DELETE are not supported by Cache API and shouldn't be cached anyway.
    if (event.request.method !== 'GET') {
        return;
    }

    // Ignore unsupported schemes (like chrome-extension://)
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // Ignore Supabase API requests (let them go to network directly)
    if (event.request.url.includes('supabase.co') || event.request.url.includes('/rest/v1/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => null);

            return response || fetchPromise;
        })
    );
});
