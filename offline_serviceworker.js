if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('offline_serviceworker.js')
      .then((registration) => {
        console.log("✅ Service Worker enregistré avec succès :", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de l'enregistrement du Service Worker :", error);
      });
  });
}
