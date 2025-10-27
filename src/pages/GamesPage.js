import React, { useState } from 'react';
import TicTacToe from '../games/TicTacToe';
import SnakeGame from '../games/SnakeGame';
import MemoryGame from '../games/MemoryGame';

function GamesPage() {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    { id: 'tictactoe', name: 'Крестики-Нолики', component: TicTacToe },
    { id: 'snake', name: 'Змейка', component: SnakeGame },
    { id: 'memory', name: 'Память', component: MemoryGame }
  ];

  if (currentGame) {
    const GameComponent = currentGame.component;
    return (
      <div className="games-page">
        <div className="game-header">
          <button className="btn btn-secondary" onClick={() => setCurrentGame(null)}>
            ← Назад
          </button>
          <h2>{currentGame.name}</h2>
        </div>
        <GameComponent />
      </div>
    );
  }

  return (
    <div className="games-page">
      <h2>Офлайн Игры</h2>
      <p className="page-description">Играйте без подключения к интернету</p>
      
      <div className="games-grid">
        {games.map(game => (
          <div 
            key={game.id}
            className="game-card"
            onClick={() => setCurrentGame(game)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3>{game.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;