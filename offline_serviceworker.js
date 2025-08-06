// Basic service worker example
self.addEventListener('install', function(event) {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating');
});

self.addEventListener('fetch', function(event) {
  // Handle fetch events here
});
