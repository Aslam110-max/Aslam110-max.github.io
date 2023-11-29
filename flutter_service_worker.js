'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "55beaee7847c1d48483b8537248b00f1",
"assets/AssetManifest.json": "f721f021a71555ca8ba9b7f68789f077",
"assets/FontManifest.json": "340b803db57306800a5dabffc0456363",
"assets/fonts/Kanit-Medium.ttf": "2fedce7deb446c41cc5274c226b43c04",
"assets/fonts/KdamThmorPro-Regular.ttf": "93fe584b1e7ecefc8dd16eaf3a3fee7f",
"assets/fonts/MaterialIcons-Regular.otf": "ceac2624c176382c948469c8f9f6ee27",
"assets/fonts/PTSerif-Regular.ttf": "30e6f341123ce95115a85122d239f8a0",
"assets/fonts/SmoochSans-SemiBold.ttf": "bae7fb8e7e46910b5a316c1d8cdcdc8c",
"assets/images/Animation.json": "0c16f0af9bb3c5473cbdf74d3a31d243",
"assets/images/ArrowAnimation.json": "9e0a180896ac6ec43673f993f428fae7",
"assets/images/c++.png": "0b849c72f38362fe12072a4916660013",
"assets/images/dart.png": "a675cb93b75d5f1656c920dceecdcb38",
"assets/images/dataStructure.png": "1f3ea34afef9d95c2218df3664d815f3",
"assets/images/facebook.png": "a75127b07e697fdb6714770ef1e1f54b",
"assets/images/Figma.png": "fc112e58bcd30d3e158923591cb8ae79",
"assets/images/firebase.png": "45ec5c8523c42019e2aa9fe5436750af",
"assets/images/flutter.png": "e02a6c427d3f2f6128219c4916cc4c6f",
"assets/images/gitHub.png": "e45ebd5258d77392cb78ceb7b3133eeb",
"assets/images/java.png": "652fdb659a681116811612e0b9e25354",
"assets/images/linkedIn.png": "968ea62882943e88bbd318ae5fa67429",
"assets/images/logo.png": "1d1387f577e7ae964acce7f3aad64f4a",
"assets/images/menu.json": "cb57a2f3ce1025602c8f94b96888a73a",
"assets/images/profile.jpg": "061d4ee6ce2a46bb98aa32960430461b",
"assets/images/react.png": "28ad6305640283f7e86fcc76d2eb51e5",
"assets/images/whatsapp.png": "56c55d3cdc53e8361f52af57a0a4e759",
"assets/NOTICES": "f2148c48e6c641a9b4720434204e479a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "effe3b0c443dacbe5b7cb69d8604f3bb",
"canvaskit/canvaskit.wasm": "3343bfdc8efd5be600f8e153d27b4348",
"canvaskit/chromium/canvaskit.js": "b01d102efb807410c94c6623eaaa2888",
"canvaskit/chromium/canvaskit.wasm": "b63604f306c16d60d1ae3a2ec3c1ebbf",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "36f4a028c8b114534abc96dc6a8f7331",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.ico": "3f90842389348bc2947ded37728125e2",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "b9b22ab99caa56a9595f9e198aa26270",
"icons/Icon-512.png": "9fdf06d1e0ca09a073018c5e33deb770",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "522f6f8261231e2e61f12784279de9f6",
"/": "522f6f8261231e2e61f12784279de9f6",
"main.dart.js": "dc1cbd7700d99cfe1d040c84562afdde",
"manifest.json": "06fc84d777747466ced8f9d22fe55c0b",
"version.json": "009c9e65172e010890f7f65fde438006"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
