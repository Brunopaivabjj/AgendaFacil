// sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
});

self.addEventListener('fetch', (event) => {
  // Apenas log para teste
  console.log('Fetch:', event.request.url);
});
