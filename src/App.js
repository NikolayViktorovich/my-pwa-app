import React, { useState, useEffect } from 'react';
import { registerServiceWorker } from './registerServiceWorker';
import './App.css';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import WeatherPage from './pages/WeatherPage';
import FilesPage from './pages/FilesPage';
import DebugPage from './pages/DebugPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme] = useState('dark');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    registerServiceWorker();
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'games':
        return <GamesPage />;
      case 'weather':
        return <WeatherPage />;
      case 'files':
        return <FilesPage />;
      case 'debug':
        return <DebugPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={`App ${theme}`}>
      {showInstallPrompt && (
        <div className="install-banner">
          <div className="install-content">
            <span>Установите REDDPWA для лучшего опыта</span>
            <div className="install-buttons">
              <button className="btn btn-primary" onClick={handleInstallClick}>
                Установить
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowInstallPrompt(false)}
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="App-header">
        <nav className="main-nav">
          <div className="nav-brand">
            <h1 className="glitch-title">REDDPWA</h1>
          </div>
        </nav>

        <nav className="page-nav">
          <button 
            className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Главная
          </button>
          <button 
            className={`nav-btn ${currentPage === 'games' ? 'active' : ''}`}
            onClick={() => setCurrentPage('games')}
          >
            Игры
          </button>
          <button 
            className={`nav-btn ${currentPage === 'weather' ? 'active' : ''}`}
            onClick={() => setCurrentPage('weather')}
          >
            Погода
          </button>
          <button 
            className={`nav-btn ${currentPage === 'files' ? 'active' : ''}`}
            onClick={() => setCurrentPage('files')}
          >
            Файлы
          </button>
          <button 
            className={`nav-btn ${currentPage === 'debug' ? 'active' : ''}`}
            onClick={() => setCurrentPage('debug')}
          >
            Debug
          </button>
        </nav>

        <div className="page-content">
          {renderPage()}
        </div>
      </header>
    </div>
  );
}

export default App;