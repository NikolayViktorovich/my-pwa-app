import React, { useState, useEffect } from 'react';
import { registerServiceWorker } from './registerServiceWorker';
import './App.css';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    registerServiceWorker();

    const handleOnline = () => {
      setIsOnline(true);
      showNotification('Соединение восстановлено', 'Вы снова онлайн!');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      showNotification('Нет соединения', 'Приложение работает в офлайн-режиме');
    };

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
    setTimeout(() => {
      setShowModal(false);
    }, 5000);
  };

  const handleTestNotification = () => {
    showNotification(
      'Тестовое уведомление', 
      'Тестовое уведомление'
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFeatureClick = (feature) => {
    showNotification(
      `Функция: ${feature}`,
      `Вы выбрали функцию "${feature}". Это демонстрация работы модалок`
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>REDDPWA</h1>
        
        <div className="status-info">
          <p>Статус сети: 
            <span className={isOnline ? 'online' : 'offline'}>
              {isOnline ? ' Онлайн' : ' Офлайн'}
            </span>
          </p>
        </div>

        <div className="actions">
          <button 
            onClick={handleTestNotification}
            className="btn btn-primary"
          >
            Тестовое уведомление
          </button>
        </div>

        <div className="features">
          <h2>Функции PWA:</h2>
          <div className="feature-grid">
            <div 
              className="feature-card"
              onClick={() => handleFeatureClick('Офлайн-режим')}
            >
              <div className="feature-icon">📶</div>
              <h3>Офлайн-работа</h3>
              <p>Работает без интернета</p>
            </div>
            
            <div 
              className="feature-card"
              onClick={() => handleFeatureClick('Быстрая загрузка')}
            >
              <div className="feature-icon">⚡</div>
              <h3>Быстрая загрузка</h3>
              <p>Кэширование ресурсов</p>
            </div>
            
            <div 
              className="feature-card"
              onClick={() => handleFeatureClick('Уведомления')}
            >
              <div className="feature-icon">🔔</div>
              <h3>Уведомления</h3>
              <p>Всплывающие окна</p>
            </div>
            
            <div 
              className="feature-card"
              onClick={() => handleFeatureClick('Установка')}
            >
              <div className="feature-icon">📱</div>
              <h3>Установка</h3>
              <p>На домашний экран</p>
            </div>
          </div>
        </div>

        {/* Модалка для уведомлений */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalTitle}</h3>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast-уведомление */}
        {showModal && (
          <div className="toast-notification">
            <div className="toast-icon">🔔</div>
            <div className="toast-content">
              <div className="toast-title">{modalTitle}</div>
              <div className="toast-message">{modalMessage}</div>
            </div>
            <button className="toast-close" onClick={handleCloseModal}>
              ×
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;