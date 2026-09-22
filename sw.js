const CACHE_VERSION = 'v1';
const CACHE_NAME = 'roma-alps-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './firebase-config.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './photos/alberobello.jpg',
  './photos/alps.jpg',
  './photos/brera.jpg',
  './photos/burrata.jpg',
  './photos/cacio-e-pepe.jpg',
  './photos/cham.jpg',
  './photos/colosseum.jpg',
  './photos/duomo.jpg',
  './photos/grindelwald.jpg',
  './photos/hazelnut-gelato.jpg',
  './photos/interlaken.jpg',
  './photos/lindt.jpg',
  './photos/lucerne.jpg',
  './photos/margherita.jpg',
  './photos/maritozzo.jpg',
  './photos/matera.jpg',
  './photos/milan.jpg',
  './photos/murren.jpg',
  './photos/navigli.jpg',
  './photos/octopus.jpg',
  './photos/orecchiette.jpg',
  './photos/ostuni.jpg',
  './photos/pistachio-gelato.jpg',
  './photos/polignano-town.jpg',
  './photos/polignano.jpg',
  './photos/risotto.jpg',
  './photos/rome.jpg',
  './photos/tiramisu.jpg',
  './photos/trevi.jpg',
  './photos/vatican.jpg',
  './photos/wengen.jpg',
  './photos/zurich.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('Precache failed for', url, err);
          });
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isNavigationRequest(request) {
  if (request.mode === 'navigate') return true;
  var accept = request.headers.get('accept');
  return request.method === 'GET' && accept && accept.indexOf('text/html') !== -1;
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  // The app shell itself: try the network first (fresh content when online),
  // fall back to the cached copy so it still opens with no signal.
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put('./index.html', copy); });
        return response;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Same-origin static assets (photos, icons, manifest): cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
          return response;
        });
      })
    );
    return;
  }

  // Google Fonts + the Firebase SDK files: stale-while-revalidate, so the
  // page still loads (and Firestore's own offline cache can kick in) even
  // with no connection after the first successful visit.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'www.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (cached) {
          var fetchPromise = fetch(request).then(function (response) {
            cache.put(request, response.clone());
            return response;
          }).catch(function () { return cached; });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Everything else (OpenStreetMap embeds, Firestore/Storage API calls,
  // Google Maps links) goes straight to the network as normal.
});
