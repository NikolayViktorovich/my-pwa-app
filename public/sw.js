const CACHE_NAME = 'reddpwa-cache-v5';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker установлен');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Активирован');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Удаление старого кэша', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Активация завершена');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseToCache = response.clone();
        
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            
            return new Response('Офлайн режим', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

self.addEventListener('push', (event) => {
  console.log('Push сообщение получено', event);
  
  if (!event.data) {
    console.log('Push событие без данных');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.log('Push данные не в JSON формате, используем текст');
    data = {
      title: 'REDDPWA',
      body: event.data.text() || 'Новое уведомление',
      icon: '/logo192.png',
      badge: '/logo192.png'
    };
  }

  const options = {
    body: data.body || 'У вас новое уведомление!',
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    image: data.image,
    vibrate: data.vibrate || [100, 50, 100],
    data: data.data || {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: data.actions || [
      {
        action: 'open',
        title: 'Открыть',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Закрыть', 
        icon: '/logo192.png'
      }
    ],
    requireInteraction: data.requireInteraction !== undefined ? data.requireInteraction : true,
    tag: data.tag || 'reddpwa-notification'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'REDDPWA', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Уведомление было кликнуто', event);
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  if (action === 'close') {
    console.log('Уведомление закрыто');
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === notificationData.url && 'focus' in client) {
          client.focus();
          return;
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(notificationData.url || '/');
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Уведомление было закрыто', event);
});

self.addEventListener('message', (event) => {
  console.log('Сообщение от главного потока:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});