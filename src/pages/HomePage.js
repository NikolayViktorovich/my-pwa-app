import React, { useState, useEffect } from 'react';

function HomePage({ onNavigate }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showNotification = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 5000);
  };

  const handleFeatureClick = (feature, page) => {
    showNotification(`Функция: ${feature}`, `Переход к ${feature}`);
    if (page) onNavigate(page);
  };

  return (
    <div className="home-page">
      <div className="status-info">
        <p>Статус сети: 
          <span className={isOnline ? 'online' : 'offline'}>
            {isOnline ? ' Онлайн' : ' Офлайн'}
          </span>
        </p>
      </div>

      <div className="features-window">
        <div className="window-header">
          <h2>Функции PWA</h2>
        </div>
        
        <div className="features-horizontal">
          <div className="feature-item" onClick={() => handleFeatureClick('Игры', 'games')}>
            <div className="feature-content">
              <h3>Офлайн Игры</h3>
              <p>Играйте без интернета</p>
            </div>
          </div>
          
          <div className="feature-item" onClick={() => handleFeatureClick('Погода', 'weather')}>
            <div className="feature-content">
              <h3>Погода</h3>
              <p>Актуальные прогнозы</p>
            </div>
          </div>
          
          <div className="feature-item" onClick={() => handleFeatureClick('Карты', 'maps')}>
            <div className="feature-content">
              <h3>Офлайн Карты</h3>
              <p>Навигация офлайн</p>
            </div>
          </div>
          
          <div className="feature-item" onClick={() => handleFeatureClick('Файлы', 'files')}>
            <div className="feature-content">
              <h3>Файлы</h3>
              <p>Работа с файлами</p>
            </div>
          </div>
          
          <div className="feature-item" onClick={() => handleFeatureClick('Debug', 'debug')}>
            <div className="feature-content">
              <h3>Debug Панель</h3>
              <p>Мониторинг PWA</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalTitle}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;