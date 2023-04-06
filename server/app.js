const webPush = require('web-push');
require('dotenv').config();

// 鍵作成
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys);

const ctx = {};

webPush.setVapidDetails(
  'mailto:aaaa@aaaa.org',
  process.env.PUB_KEY,
  process.env.PRI_KEY
);

(async () => {
  try {
    // setTimeout(async () => {
    //   await webPush.sendNotification(
    //     ctx3,
    //     JSON.stringify({
    //       title: '',
    //       body: 'body55\nあああ',
    //       data: {
    //         act: '/aaab.html',
    //       },
    //     })
    //   );
    // }, 2000);
    await webPush.sendNotification(
      ctx,
      JSON.stringify({
        title: '',
        body: 'body',
        data: {
          act: '/aaa.html',
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
})();
