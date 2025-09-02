import { useState, useEffect, useCallback } from 'react';

interface MinesweeperProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

type GameState = 'playing' | 'won' | 'lost';

export default function Minesweeper({ onClose, onMinimize, onMaximize }: MinesweeperProps) {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [mineCount, setMineCount] = useState(10);
  const [flagCount, setFlagCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert' | 'kawaii'>('beginner');
  const [showSettings, setShowSettings] = useState(false);

  const difficulties = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 },
    kawaii: { rows: 12, cols: 12, mines: 20 }
  };

  const currentDifficulty = difficulties[difficulty];

  // Initialize board
  const initializeBoard = useCallback(() => {
    const { rows, cols, mines } = currentDifficulty;
    const newBoard: Cell[][] = [];

    // Create empty board
    for (let row = 0; row < rows; row++) {
      newBoard[row] = [];
      for (let col = 0; col < cols; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0
        };
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor counts
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }

    setBoard(newBoard);
    setGameState('playing');
    setFlagCount(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setMineCount(mines);
  }, [currentDifficulty]);

  // Initialize on mount and difficulty change
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameState]);

  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      setGameState('lost');
      newBoard.forEach(boardRow => {
        boardRow.forEach(cell => {
          if (cell.isMine) {
            cell.isRevealed = true;
          }
        });
      });
    } else {
      // Reveal cells using flood fill algorithm
      const reveal = (r: number, c: number) => {
        if (
          r < 0 || r >= currentDifficulty.rows ||
          c < 0 || c >= currentDifficulty.cols ||
          newBoard[r][c].isRevealed ||
          newBoard[r][c].isFlagged ||
          newBoard[r][c].isMine
        ) {
          return;
        }

        newBoard[r][c].isRevealed = true;

        // If no neighboring mines, reveal all neighbors
        if (newBoard[r][c].neighborCount === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr !== 0 || dc !== 0) { // Don't reveal the same cell
                reveal(r + dr, c + dc);
              }
            }
          }
        }
      };

      reveal(row, col);

      // Check for win condition - all non-mine cells revealed
      let unrevealedNonMines = 0;
      newBoard.forEach(boardRow => {
        boardRow.forEach(cell => {
          if (!cell.isMine && !cell.isRevealed) {
            unrevealedNonMines++;
          }
        });
      });

      if (unrevealedNonMines === 0) {
        setGameState('won');
        // Auto-flag remaining mines
        newBoard.forEach(boardRow => {
          boardRow.forEach(cell => {
            if (cell.isMine && !cell.isFlagged) {
              cell.isFlagged = true;
            }
          });
        });
        setFlagCount(mineCount);
      }
    }

    setBoard(newBoard);
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (gameState !== 'playing' || board[row][col].isRevealed) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagCount(prev => prev - 1);
    } else {
      if (flagCount < mineCount) { // Prevent over-flagging
        cell.isFlagged = true;
        setFlagCount(prev => prev + 1);
      }
    }

    setBoard(newBoard);
  };

  const getCellDisplay = (cell: Cell, row: number, col: number) => {
    if (cell.isFlagged) {
      return difficulty === 'kawaii' ? '💖' : '🚩';
    }
    
    if (!cell.isRevealed) {
      return '';
    }
    
    if (cell.isMine) {
      return difficulty === 'kawaii' ? '💥' : '💣';
    }
    
    if (cell.neighborCount === 0) {
      return '';
    }
    
    if (difficulty === 'kawaii') {
      const kawaiiNumbers = ['', '♥', '♥♥', '♥♥♥', '💔', '💔💔', '💔💔💔', '💀', '💀💀'];
      return kawaiiNumbers[cell.neighborCount] || cell.neighborCount;
    }
    
    return cell.neighborCount;
  };

  const getCellClass = (cell: Cell) => {
    let className = 'minesweeper-cell';
    
    if (cell.isRevealed) {
      className += ' revealed';
      if (cell.isMine) {
        className += ' mine';
      } else if (cell.neighborCount > 0) {
        className += ` number-${cell.neighborCount}`;
      }
    } else {
      className += ' hidden';
    }
    
    if (cell.isFlagged) {
      className += ' flagged';
    }
    
    return className;
  };

  const getGameStateMessage = () => {
    if (gameState === 'won') {
      return difficulty === 'kawaii' ? 
        'Sugoi! You won! (◕‿◕)♡' : 
        'Congratulations! You won!';
    }
    if (gameState === 'lost') {
      return difficulty === 'kawaii' ? 
        'Oops! Try again, senpai! (´･ω･`)' : 
        'Game Over! Try again!';
    }
    return difficulty === 'kawaii' ? 
      'Ganbatte! Find all the heart bombs! ♥' : 
      'Find all the mines!';
  };

  const getGameStateEmoji = () => {
    if (gameState === 'won') return difficulty === 'kawaii' ? '(◕‿◕)♡' : '😎';
    if (gameState === 'lost') return difficulty === 'kawaii' ? '(｡•́︿•̀｡)' : '😵';
    return difficulty === 'kawaii' ? '(◔‿◔)' : '🙂';
  };

  return (
    <div className={`minesweeper-app ${difficulty}`}>
      {/* Header */}
      <div className="minesweeper-header">
        <div className="game-info">
          <div className="info-display">
            <span className="info-label">
              {difficulty === 'kawaii' ? '💖' : '💣'}
            </span>
            <span className="info-value">
              {String(mineCount - flagCount).padStart(3, '0')}
            </span>
          </div>
          
          <button 
            className="reset-button"
            onClick={initializeBoard}
            title="New Game"
          >
            {getGameStateEmoji()}
          </button>
          
          <div className="info-display">
            <span className="info-label">⏱️</span>
            <span className="info-value">
              {String(timeElapsed).padStart(3, '0')}
            </span>
          </div>
        </div>
        
        <div className="game-controls">
          <button 
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <div className="difficulty-buttons">
            {Object.keys(difficulties).map((diff) => (
              <button
                key={diff}
                className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
                onClick={() => {
                  setDifficulty(diff as any);
                  setShowSettings(false);
                }}
              >
                {diff === 'kawaii' ? '可愛い ♥' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Status */}
      <div className="game-status">
        {getGameStateMessage()}
      </div>

      {/* Game Board */}
      <div className="minesweeper-board-container">
        <div 
          className="minesweeper-board"
          style={{
            gridTemplateColumns: `repeat(${currentDifficulty.cols}, 1fr)`,
            gridTemplateRows: `repeat(${currentDifficulty.rows}, 1fr)`
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell)}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                disabled={gameState !== 'playing'}
              >
                {getCellDisplay(cell, rowIndex, colIndex)}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <div className="instruction-line">
          Left click to reveal • Right click to flag
        </div>
        {difficulty === 'kawaii' && (
          <div className="kawaii-instruction">
            Find all the love bombs! Avoid the heart explosions! ♥(◕‿◕)♥
          </div>
        )}
      </div>
    </div>
  );
}
