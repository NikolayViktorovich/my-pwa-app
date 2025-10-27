import React, { useState, useEffect } from 'react';

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const initializeGame = () => {
    let gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        solved: false
      }));

  useEffect(() => {
    const savedBestScore = localStorage.getItem('memory_best_score');
    if (savedBestScore) setBestScore(parseInt(savedBestScore));
    
    initializeGame();
}, [initializeGame]);
    
    setCards(gameCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        setSolved([...solved, firstId, secondId]);
        setFlipped([]);
        if (solved.length + 2 === cards.length) {
          setGameComplete(true);

          if (!bestScore || moves + 1 < bestScore) {
            const newBestScore = moves + 1;
            setBestScore(newBestScore);
            localStorage.setItem('memory_best_score', newBestScore.toString());
          }
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const renderCard = (card) => {
    const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
    
    return (
      <div
        key={card.id}
        className={`memory-card ${isFlipped ? 'flipped' : ''} ${solved.includes(card.id) ? 'solved' : ''}`}
        onClick={() => handleCardClick(card.id)}
      >
        <div className="card-inner">
          <div className="card-front">?</div>
          <div className="card-back">{card.symbol}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="memory-game">
      <div className="game-header">
        <div className="game-stats">
          <div>Ходы: {moves}</div>
          <div>Лучший: {bestScore || 'N/A'}</div>
          <div>Найдено: {solved.length / 2} / {symbols.length}</div>
        </div>
        
        <button onClick={initializeGame} className="btn btn-primary">
          Новая игра
        </button>
      </div>

      <div className="memory-grid">
        {cards.map(renderCard)}
      </div>

      {gameComplete && (
        <div className="game-complete">
          <h2>🎉 Поздравляем!</h2>
          <p>Вы завершили игру за {moves} ходов</p>
          {bestScore && moves === bestScore && (
            <p>🏆 Новый рекорд!</p>
          )}
        </div>
      )}

      <div className="game-instructions">
        <h3>Правила игры:</h3>
        <p>Найдите все пары одинаковых символов</p>
        <p>Старайтесь сделать как можно меньше ходов</p>
      </div>
    </div>
  );
}

export default MemoryGame;