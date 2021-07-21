importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.NetworkFirst()
);
// const CACHE_NAME = 'version-1';
// const urlToCache = ['index.html','offline.html']


// self.addEventListener('install',(event) => {
//     event.waitUntill(
//         caches.open(CACHE_NAME)
//         .then((cache) => {
//             console.log("Opened Cache")
//         })
//     )
// })