import React, { useState, useEffect, useCallback, useRef } from 'react';

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);
  
  const gridSize = 16;
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake_high_score');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      generateFood();
    } else {
      setFood(newFood);
    }
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
        default: break;
      }
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snake_high_score', newScore.toString());
        }
        
        generateFood();
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food, isPlaying, gameOver, score, highScore, generateFood]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, isPlaying, gameOver, speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);
  useEffect(() => {
    if (!gameContainerRef.current || !isPlaying) return;

    const container = gameContainerRef.current;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== 'LEFT') {
          setDirection('RIGHT');
        } else if (diffX < 0 && direction !== 'RIGHT') {
          setDirection('LEFT');
        }
      } else {
        if (diffY > 0 && direction !== 'UP') {
          setDirection('DOWN');
        } else if (diffY < 0 && direction !== 'DOWN') {
          setDirection('UP');
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [direction, isPlaying]);

  const startGame = () => {
    setSnake([{ x: 8, y: 8 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    generateFood();
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 8, y: 8 }]);
    setDirection('RIGHT');
  };

  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0].x === x && snake[0].y === y;
        
        let cellClass = 'grid-cell';
        if (isHead) cellClass += ' snake-head';
        else if (isSnake) cellClass += ' snake-body';
        else if (isFood) cellClass += ' food';
        
        grid.push(
          <div key={`${x}-${y}`} className={cellClass} />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="snake-game">
      <div className="game-header">
        <div className="score-board">
          <div>Очки: {score}</div>
          <div>Рекорд: {highScore}</div>
          <div>Скорость: {speed}ms</div>
        </div>
        
        <div className="game-controls">
          {!isPlaying && !gameOver && (
            <button onClick={startGame} className="btn btn-primary">
              Начать игру
            </button>
          )}
          {gameOver && (
            <button onClick={startGame} className="btn btn-primary">
              Играть снова
            </button>
          )}
          <button onClick={resetGame} className="btn btn-secondary">
            Сброс
          </button>
        </div>
      </div>

      <div 
        className="game-container"
        ref={gameContainerRef}
        style={{ touchAction: 'none' }}
      >
        <div 
          className="snake-grid"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 20px)`,
            gridTemplateRows: `repeat(${gridSize}, 20px)`
          }}
        >
          {renderGrid()}
        </div>
        
        {gameOver && (
          <div className="game-over">
            <h2>Игра окончена!</h2>
            <p>Ваш счет: {score}</p>
          </div>
        )}
        
        {!isPlaying && !gameOver && (
          <div className="game-instructions">
            <h3>Управление:</h3>
            <p>← ↑ → ↓ для движения</p>
            <p>На мобильных: свайпы</p>
            <p>Цель: съесть как можно больше еды</p>
          </div>
        )}
      </div>

      <div className="speed-controls">
        <label>Скорость игры:</label>
        <input
          type="range"
          min="50"
          max="300"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
          disabled={isPlaying}
        />
        <span>{speed}ms</span>
      </div>
    </div>
  );
}

export default SnakeGame;