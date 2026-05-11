self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through for now
    event.respondWith(fetch(event.request));
});
