const CACHE_NAME = "cockpitcanari-cache-v1";

const ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// Installation : mise en cache des fichiers statiques essentiels
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Interception des requêtes : sert les fichiers statiques en cache, ignore Supabase
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Ne pas intercepter les appels vers Supabase
  if (url.origin.includes("supabase.co")) return;

  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
