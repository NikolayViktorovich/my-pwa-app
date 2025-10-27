import { render, screen } from '@testing-library/react';
import App from './App';

test('renders REDDPWA app', () => {
  render(<App />);
  
  const appTitle = screen.getByText(/REDDPWA/i);
  expect(appTitle).toBeInTheDocument();

  const homeButton = screen.getByRole('button', { name: /Главная/i });
  expect(homeButton).toBeInTheDocument();
  
  const gamesButton = screen.getByRole('button', { name: /Игры/i });
  expect(gamesButton).toBeInTheDocument();
  
  const weatherButton = screen.getByRole('button', { name: /Погода/i });
  expect(weatherButton).toBeInTheDocument();
  
  const filesButton = screen.getByRole('button', { name: /Файлы/i });
  expect(filesButton).toBeInTheDocument();
  
  const debugButton = screen.getByRole('button', { name: /Debug/i });
  expect(debugButton).toBeInTheDocument();
});

test('renders network status', () => {
  render(<App />);
  const networkStatus = screen.getByText(/Статус сети/i);
  expect(networkStatus).toBeInTheDocument();
});

test('renders PWA features', () => {
  render(<App />);
  
  const featuresTitle = screen.getByText(/Функции PWA/i);
  expect(featuresTitle).toBeInTheDocument();

  const gamesFeature = screen.getByText(/Офлайн Игры/i);
  expect(gamesFeature).toBeInTheDocument();
  
  const weatherFeature = screen.getByRole('heading', { name: /Погода/i, level: 3 });
  expect(weatherFeature).toBeInTheDocument();

  const filesFeature = screen.getByRole('heading', { name: /Файлы/i, level: 3 });
  expect(filesFeature).toBeInTheDocument();
  
  const debugFeature = screen.getByText(/Debug Панель/i);
  expect(debugFeature).toBeInTheDocument();
});