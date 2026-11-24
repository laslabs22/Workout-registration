// Minimal service worker: gør appen installerbar. Ingen caching, så nye versioner slår altid igennem.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
