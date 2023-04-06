let display = false;
let port;

self.addEventListener('push', evt => {
  const data = evt.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    // icon: 'icon.jpg',
    data: {
      act: data.data.act,
    },
  };

  // console.log(port, 1);
  port.postMessage(display);

  // self.registration.showNotification(title, options);
  evt.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('message', e => {
  if (e.data == 'init') {
    port = e.ports[0];
    return;
  }

  display = e.data;
});

self.addEventListener('notificationclick', evt => {
  evt.notification.close();
  clients.openWindow(evt.notification.data.act);
});

self.addEventListener('install', function (event) {
  // インストール時の処理
  console.log('インストールされました。');
  event.waitUntil(self.skipWaiting());
  // self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // 有効化時の処理
  console.log('有効化されました。');
});

// self.addEventListener('fetch', function (event) {
//   console.log('fetch2');
// });

// self.addEventListener('push', function (event) {
//   console.log('push28');
//   // event.waitUntil(
//   //   self.registration.showNotification('Push通知タイトル', {
//   //     body: 'Push通知本文',
//   //   })
//   // );
// });
