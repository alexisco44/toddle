// offline_serviceworker.js

const CACHE_NAME = "nordcraft-cache-v1";
const PRECACHE_URLS = [
  "./",                  // la racine
  "./index.html",        // la page principale
  "./assets/app.js",     // le script principal généré par Nordcraft
  "./assets/style.css",  // le CSS principal
  "./manifest.json",     // si tu veux le mettre aussi en cache
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Installation : mise en cache initiale
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// Activation : nettoyage des anciens caches si nécessaire
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
