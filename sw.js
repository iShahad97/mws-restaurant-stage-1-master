"use strict";

const static_cache = 'my-site-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  'css/styles.css',
  'data/restaurants.json',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'js/serviceWorker_reg.js',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(static_cache)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        return caches.open(static_cache).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function(err) {
        throw err;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('restaurant-') && cacheName != static_cache;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
})
