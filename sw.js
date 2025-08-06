const CACHE_NAME = 'nordcraft-cache-v1';
const PRECACHE_URLS = [
  '/',                // page d'accueil
  '/(index)',      // fichier principal
  '/manifest.json',   // manifest PWA
  '/_static/page.main.js',   // JS principal (à adapter selon Nordcraft)
  '/_static/reset.css' // CSS principal (à adapter aussi)
];

// 1. Installation : cache initial des ressources critiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // active le nouveau SW immédiatement
});

// 2. Activation : nettoyage des caches obsolètes
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // prend le contrôle des pages immédiatement
});

// 3. Interception des requêtes : stratégie cache-first puis réseau
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignorer les requêtes non-GET (POST, PUT, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // Stratégie cache d'abord
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Sinon, tenter une requête réseau puis mettre en cache dynamiquement
      return fetch(request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // On clone la réponse car fetch ne peut être utilisé qu'une fois
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Si réseau indisponible, retourne éventuellement une fallback si prévue
        if (request.destination === 'document') {
          return caches.match('/offline.html'); // à créer si besoin
        }
      });
    })
  );
});
