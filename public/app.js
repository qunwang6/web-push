const vapidPublicKey =
  'BJL8vEGuq4T9H0iiHF48zGH3xngz1C4s96xztApvEtUGN71uBSFNG3SNQ4Wv5d01qRduqC1Lxgr8waLc5nAf5sI';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

window.addEventListener('blur', () => {
  document.getElementById('display').textContent = 'blur';
});

window.addEventListener('focus', () => {
  document.getElementById('display').textContent = 'focus';
});

(async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('./sw.js', {
      updateViaCache: 'none',
    });

    await registration.update();

    let subscription = {};
    document.querySelector('button').onclick = async () => {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // (変換した)パブリックキーをapplicationServerKeyに設定してsubscribe
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        console.log(JSON.stringify(subscription));
      }
    };

    document.getElementById('b').onclick = () =>
      navigator.clipboard
        .writeText(JSON.stringify(subscription))
        .then(function () {
          alert('copy finish');
        });

    const channel = new MessageChannel();
    channel.port1.onmessage = e => {
      console.log('broser', e.data);
      document.querySelector('h2').textContent = String(e.data) + new Date();
    };

    if (registration.installing == null) {
      registration.active.postMessage('init', [channel.port2]);
    } else {
      registration.installing.onstatechange = e => {
        if (e.target.state === 'activated') {
          try {
            navigator.serviceWorker.controller.postMessage('init', [
              channel.port2,
            ]);
          } catch (error) {
            registration.active.postMessage('init', [channel.port2]);
          }
        }
      };
    }

    const window_timer = () => {
      try {
        const _channel = new MessageChannel();
        registration.active.postMessage(
          document.getElementById('display').textContent === 'focus'
            ? true
            : false,
          [_channel.port2]
        );
      } catch (error) {
      } finally {
        setTimeout(() => {
          window_timer();
        }, 250);
      }
    };

    window_timer();
  }
})();
