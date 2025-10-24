export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker успешно зарегистрирован: ', registration);
        })
        .catch((registrationError) => {
          console.log('Ошибка регистрации Service Worker: ', registrationError);
        });
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Разрешение на уведомления получено');
      return true;
    } else {
      console.log('Разрешение на уведомления отклонено');
      return false;
    }
  }
  return false;
};

export const sendTestNotification = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Тестовое уведомление', {
        body: 'тестовое push-уведомление',
        icon: '/logo192.png',
        vibrate: [200, 100, 200],
        tag: 'test-notification'
      });
    });
  }
};