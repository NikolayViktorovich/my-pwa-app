import React, { useState, useEffect } from 'react';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const savedScores = localStorage.getItem('tictactoe_scores');
    const savedHistory = localStorage.getItem('tictactoe_history');
    
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedHistory) setGameHistory(JSON.parse(savedHistory));
  }, []);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const winner = calculateWinner(newBoard);
    if (winner) {
      const newScores = { ...scores, [winner.toLowerCase()]: scores[winner.toLowerCase()] + 1 };
      setScores(newScores);
      
      const newHistory = [...gameHistory, {
        winner,
        moves: newBoard.filter(cell => cell !== null).length,
        date: new Date().toISOString()
      }].slice(-10);
      
      setGameHistory(newHistory);

      localStorage.setItem('tictactoe_scores', JSON.stringify(newScores));
      localStorage.setItem('tictactoe_history', JSON.stringify(newHistory));
    } else if (!newBoard.includes(null)) {
      const newScores = { ...scores, draws: scores.draws + 1 };
      setScores(newScores);
      localStorage.setItem('tictactoe_scores', JSON.stringify(newScores));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const resetStats = () => {
    setScores({ x: 0, o: 0, draws: 0 });
    setGameHistory([]);
    localStorage.removeItem('tictactoe_scores');
    localStorage.removeItem('tictactoe_history');
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && !board.includes(null);

  const renderSquare = (index) => (
    <button 
      className={`square ${board[index] === 'X' ? 'x' : board[index] === 'O' ? 'o' : ''}`}
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  return (
    <div className="tic-tac-toe">
      <div className="game-container">
        <div className="game-board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>

        <div className="game-info">
          <div className="game-status">
            {winner ? `Победитель: ${winner}` : 
             isDraw ? 'Ничья!' : 
             `Следующий ход: ${isXNext ? 'X' : 'O'}`}
          </div>
          
          <button onClick={resetGame} className="btn btn-primary">
            Новая игра
          </button>
        </div>
      </div>

      <div className="game-stats">
        <h3>📊 Статистика</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span>❌ Победы X:</span>
            <span>{scores.x}</span>
          </div>
          <div className="stat-item">
            <span>⭕ Победы O:</span>
            <span>{scores.o}</span>
          </div>
          <div className="stat-item">
            <span>Ничьи:</span>
            <span>{scores.draws}</span>
          </div>
        </div>
        
        <button onClick={resetStats} className="btn btn-secondary">
          Сбросить статистику
        </button>

        {gameHistory.length > 0 && (
          <div className="game-history">
            <h4>История игр</h4>
            {gameHistory.slice().reverse().map((game, index) => (
              <div key={index} className="history-item">
                <span>{game.winner ? `Победил ${game.winner}` : 'Ничья'}</span>
                <span>{game.moves} ходов</span>
                <span>{new Date(game.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicTacToe;