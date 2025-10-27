export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker успешно зарегистрирован: ', registration);
        return registration;
      })
      .catch((registrationError) => {
        console.log('Ошибка регистрации Service Worker: ', registrationError);
      });
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Браузер не поддерживает уведомления');
    return false;
  }

  if (Notification.permission === 'granted') {
    console.log('Разрешение на уведомления уже получено');
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Разрешение на уведомления отклонено');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Разрешение на уведомления получено');
      return true;
    } else {
      console.log('Разрешение на уведомления отклонено');
      return false;
    }
  } catch (error) {
    console.error('Ошибка при запросе разрешения:', error);
    return false;
  }
};

export const sendTestNotification = async (title = 'Тестовое уведомление', options = {}) => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker не поддерживается');
    return false;
  }

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log('Нет разрешения на уведомления');
      return false;
    }
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const notificationOptions = {
      body: options.body || 'Это тестовое push-уведомление от вашего PWA!',
      icon: options.icon || '/logo192.png',
      badge: options.badge || '/logo192.png',
      image: options.image,
      tag: options.tag || 'test-notification',
      requireInteraction: options.requireInteraction || true,
      actions: options.actions || [
        {
          action: 'open',
          title: 'Открыть приложение'
        },
        {
          action: 'close', 
          title: 'Закрыть'
        }
      ],
      data: options.data || {
        url: window.location.origin,
        timestamp: Date.now()
      },
      ...options
    };

    await registration.showNotification(title, notificationOptions);
    console.log('Push-уведомление отправлено');
    return true;
  } catch (error) {
    console.error('Ошибка отправки уведомления:', error);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: options.body || 'Это тестовое уведомление',
        icon: options.icon || '/logo192.png'
      });
      return true;
    }
    
    return false;
  }
};

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker не поддерживается');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
    
    console.log('Подписка на push получена:', subscription);
    return subscription;
  } catch (error) {
    console.error('Ошибка подписки на push:', error);
    return null;
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}