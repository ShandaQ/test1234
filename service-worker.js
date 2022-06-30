const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
  ];

const APP_PREFIX = 'FoodFest-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
    // wait until the work is complete before terminating the service worker. 
    e.waitUntil(
        // find the specific cache by name, 
        // then add every file in the FILES_TO_CACHE array to the cache.
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
        })
      )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        // returns an array of all cache names,
        // keyList is a parameter that contains all cache names under <username>.github.io
      caches.keys().then(function (keyList) {
        let cacheKeeplist = keyList.filter(function (key) {
            //  capture the ones that have that prefix, stored in APP_PREFIX
            // filter out the app/rep that belongs to this project
          return key.indexOf(APP_PREFIX);
        })

        // add the current cache to the keeplist in the activate event listener,
        cacheKeeplist.push(CACHE_NAME);
     
        // resolves once all old versions of the cache have been deleted.
        return Promise.all(
            keyList.map(function(key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
                console.log('deleting cache : ' + keyList[i]);
                return caches.delete(keyList[i]);
              }
            })
          );
        })
      );
    });


    // intercept the fetch request
    self.addEventListener('fetch', function (e) {
        console.log('fetch request : ' + e.request.url)
        e.respondWith(
            caches.match(e.request).then(function (request) {
            // check to see if the request is stored in the cache or not
                if (request) {
                  console.log('responding with cache : ' + e.request.url)
                  return request
                } 
                // if the resource is not in caches,
                // we allow the resource to be retrieved from the online network as usual
                else {
                    console.log('file is not cached, fetching : ' + e.request.url)
                    return fetch(e.request)
                }
                // You can omit if/else for console.log & put one line below like this too.
                // return request || fetch(e.request)

              })
        )
      })