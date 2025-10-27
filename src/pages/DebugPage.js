import React, { useState, useEffect } from 'react';
import { sendTestNotification, requestNotificationPermission } from '../registerServiceWorker';

const CACHE_NAME = 'reddpwa-cache-v5';

function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({});
  const [cacheSize, setCacheSize] = useState(0);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState('unknown');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationStatus, setNotificationStatus] = useState('');
  const updateDebugInfo = async () => {
    const screenInfo = window.screen || {};

  useEffect(() => {
    updateDebugInfo();
    
    const interval = setInterval(updateDebugInfo, 12000);
    return () => clearInterval(interval);
  }, [updateDebugInfo]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
    
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      storage: {
        localStorage: formatBytes(JSON.stringify(localStorage).length),
        sessionStorage: formatBytes(JSON.stringify(sessionStorage).length)
      },
      screen: {
        width: screenInfo.width,
        height: screenInfo.height,
        colorDepth: screenInfo.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toLocaleString()
    };

    setDebugInfo(info);

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        setServiceWorkerStatus('activated');
        
        if (registration.active) {
          const cache = await caches.open(CACHE_NAME);
          const keys = await cache.keys();
          let totalSize = 0;
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
          
          setCacheSize(totalSize);
        }
      } catch (error) {
        setServiceWorkerStatus('error');
      }
    } else {
      setServiceWorkerStatus('not_supported');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCacheSize(0);
      updateDebugInfo();
    }
  };

  const testNotification = async () => {
    setNotificationStatus('Отправка...');
    
    try {
      const success = await sendTestNotification('REDDPWA Тест', {
        body: 'push-уведомление',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Открыть приложение'
          },
          {
            action: 'close',
            title: 'Закрыть'
          }
        ],
        data: {
          url: window.location.href,
          source: 'debug-panel'
        }
      });

      if (success) {
        setNotificationStatus('Уведомление отправлено');
      } else {
        setNotificationStatus('Не удалось отправить уведомление');
      }
    } catch (error) {
      console.error('Ошибка теста уведомлений:', error);
      setNotificationStatus('Ошибка: ' + error.message);
    }

    setTimeout(() => setNotificationStatus(''), 3000);
  };

  const requestPermission = async () => {
    setNotificationStatus('Запрос разрешения...');
    
    const granted = await requestNotificationPermission();
    setNotificationPermission(Notification.permission);
    
    if (granted) {
      setNotificationStatus('Разрешение получено');
    } else {
      setNotificationStatus('Разрешение отклонено');
    }
    
    setTimeout(() => setNotificationStatus(''), 3000);
  };

  const getServiceWorkerStatusText = () => {
    switch (serviceWorkerStatus) {
      case 'activated': return 'Активен';
      case 'error': return 'Ошибка';
      case 'not_supported': return 'Не поддерживается';
      default: return 'Загрузка...';
    }
  };

  const getNotificationStatusText = () => {
    switch (notificationPermission) {
      case 'granted': return 'Разрешено';
      case 'denied': return 'Заблокировано';
      case 'default': return 'Не запрошено';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="debug-page">
      <h2>PWA Debug Панель</h2>
      
      <div className="debug-controls">
        <button onClick={clearCache} className="btn btn-warning">
          Очистить кэш
        </button>
        
        {notificationPermission !== 'granted' ? (
          <button onClick={requestPermission} className="btn btn-primary">
            Запросить разрешение
          </button>
        ) : (
          <button onClick={testNotification} className="btn btn-primary">
            Тест уведомления
          </button>
        )}
        
        <button onClick={updateDebugInfo} className="btn btn-secondary">
          Обновить
        </button>
      </div>

      {notificationStatus && (
        <div className={`notification-status ${
          notificationStatus.includes ? 'success' : 
          notificationStatus.includes ? 'error' : 'info'
        }`}>
          {notificationStatus}
        </div>
      )}

      <div className="debug-sections">
        <div className="debug-section">
          <h3>PWA Статус</h3>
          <div className="info-grid">
            <div className="info-item">
              <span>Service Worker:</span>
              <span>{getServiceWorkerStatusText()}</span>
            </div>
            <div className="info-item">
              <span>Размер кэша:</span>
              <span>{formatBytes(cacheSize)}</span>
            </div>
            <div className="info-item">
              <span>Push уведомления:</span>
              <span>{getNotificationStatusText()}</span>
            </div>
            <div className="info-item">
              <span>Онлайн:</span>
              <span className={debugInfo.online ? 'status-success' : 'status-error'}>
                {debugInfo.online ? 'Да' : 'Нет'}
              </span>
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h3>Сеть</h3>
          <div className="info-grid">
            <div className="info-item">
              <span>Тип соединения:</span>
              <span>{debugInfo.connection?.effectiveType || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span>Скорость:</span>
              <span>{debugInfo.connection?.downlink || 'N/A'} Mbps</span>
            </div>
            <div className="info-item">
              <span>Задержка:</span>
              <span>{debugInfo.connection?.rtt || 'N/A'} ms</span>
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h3>Хранилище</h3>
          <div className="info-grid">
            <div className="info-item">
              <span>LocalStorage:</span>
              <span>{debugInfo.storage?.localStorage}</span>
            </div>
            <div className="info-item">
              <span>SessionStorage:</span>
              <span>{debugInfo.storage?.sessionStorage}</span>
            </div>
            <div className="info-item">
              <span>Память устройства:</span>
              <span>{debugInfo.deviceMemory || 'N/A'} GB</span>
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h3>📱 Устройство</h3>
          <div className="info-grid">
            <div className="info-item">
              <span>Экран:</span>
              <span>{debugInfo.screen?.width}x{debugInfo.screen?.height}</span>
            </div>
            <div className="info-item">
              <span>Вьюпорт:</span>
              <span>{debugInfo.viewport?.width}x{debugInfo.viewport?.height}</span>
            </div>
            <div className="info-item">
              <span>Процессоры:</span>
              <span>{debugInfo.hardwareConcurrency}</span>
            </div>
            <div className="info-item">
              <span>Платформа:</span>
              <span>{debugInfo.platform}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="raw-data">
        <h3>Техническая информация</h3>
        <pre className="debug-pre">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DebugPage;