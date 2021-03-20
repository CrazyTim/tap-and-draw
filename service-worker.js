const CACHE_NAME = 'static-cache';

const URLS_TO_CACHE = [
  '.',
  'manifest.json',
  'index.html',
  'https://fonts.googleapis.com/css?family=Open+Sans:300i,400,400i,700',
  'https://fonts.googleapis.com/css?family=Rubik&display=swap',
  'js/main.js',
  'js/randomColor.js',
  'css/main.css',
  'audio/timer-finish-01.ogg'
  'words/0.txt',
  'words/1.txt',
  'words/2.txt',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(CACHE_NAME)
    .then(function(cache) {
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed:', error);
    // You could return a custom offline 404 page here
  });
}
