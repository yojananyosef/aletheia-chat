/* Aletheia Chat — service worker (vanilla, sin dependencias).
 *
 * Estrategias:
 * - `/data/**` (corpus de capítulos, inmutable): cache-first.
 * - Navegaciones: network-first con fallback a caché (página visitada) y
 *   último recurso a `/offline` (pre-cacheada en install).
 * - `/_next/static/**`, iconos, sonidos, fuentes: stale-while-revalidate.
 * - Resto mismo-origen: network con fallback a caché.
 *
 * Versionar CACHE_PREFIX ante cambios de estrategia para invalidar todo.
 */
const CACHE_PREFIX = 'aletheia-v2';
const STATIC_CACHE = `${CACHE_PREFIX}-static`;
const DATA_CACHE = `${CACHE_PREFIX}-data`;
const PAGES_CACHE = `${CACHE_PREFIX}-pages`;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PAGES_CACHE)
            .then((cache) => cache.addAll(['/', '/offline']))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k.startsWith('aletheia-') && !k.startsWith(CACHE_PREFIX))
                        .map((k) => caches.delete(k)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

function isSameOrigin(url) {
    return url.origin === self.location.origin;
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(request);
    if (hit) return hit;
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
}

async function networkFirst(request, cacheName, fallbackResponse) {
    const cache = await caches.open(cacheName);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        const hit = await cache.match(request);
        if (hit) return hit;
        if (fallbackResponse) return fallbackResponse();
        throw new Error('offline sin caché');
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(request);
    const network = fetch(request).then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
    });
    return hit ?? network;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (!isSameOrigin(url)) return;

    if (url.pathname.startsWith('/data/')) {
        event.respondWith(cacheFirst(request, DATA_CACHE));
        return;
    }
    if (request.mode === 'navigate') {
        event.respondWith(
            networkFirst(request, PAGES_CACHE, () =>
                caches.open(PAGES_CACHE).then((cache) => cache.match('/offline')),
            ),
        );
        return;
    }
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/sounds/') ||
        url.pathname.startsWith('/icon') ||
        url.pathname === '/favicon.ico' ||
        url.pathname === '/apple-icon.png'
    ) {
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
        return;
    }
    event.respondWith(networkFirst(request, STATIC_CACHE, null));
});
