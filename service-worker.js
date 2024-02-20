/*
// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});
*/

// キャッシュしたいファイルの一覧を指定 --- (*1)
const cacheFiles = ['index.html', 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js'];
const cacheName = 'v1';
// インストール時に実行されるイベント --- (*2)
self.addEventListener('install', event => {
  // キャッシュしたいファイルを指定
  caches.open(cacheName).then(cache => cache.addAll(cacheFiles));
});
// インストール後に実行されるイベント
self.addEventListener('activate', event => {
  // 必要に応じて古いキャッシュの削除処理などを行う
});
// fetchイベント
self.addEventListener('fetch', event => {
  // キャッシュがあればそれを返す --- (*3)
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        let responseClone = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    }).catch(function() {
      return caches.match('logo.svg');
    }));
});
