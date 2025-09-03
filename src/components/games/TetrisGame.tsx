import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TetrisProps {
  onClose?: () => void;
}

// Tetris piece shapes
const TETRIS_PIECES = {
  I: [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]]
  ],
  O: [
    [[1, 1], [1, 1]]
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]]
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]]
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]]
  ],
  J: [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]]
  ],
  L: [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]]
  ]
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const PIECE_COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

interface GameState {
  board: number[][];
  currentPiece: {
    shape: number[][];
    x: number;
    y: number;
    type: keyof typeof TETRIS_PIECES;
    rotation: number;
  } | null;
  nextPiece: keyof typeof TETRIS_PIECES;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
}

export default function TetrisGame({ onClose }: TetrisProps) {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null,
    nextPiece: 'T',
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDropTime = useRef(Date.now());

  // Generate random piece
  const getRandomPiece = useCallback((): keyof typeof TETRIS_PIECES => {
    const pieces = Object.keys(TETRIS_PIECES) as (keyof typeof TETRIS_PIECES)[];
    return pieces[Math.floor(Math.random() * pieces.length)];
  }, []);

  // Create new piece
  const createPiece = useCallback((type: keyof typeof TETRIS_PIECES) => {
    return {
      shape: TETRIS_PIECES[type][0],
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      type,
      rotation: 0
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((board: number[][], piece: any, x: number, y: number) => {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px] !== 0) {
          const newX = x + px;
          const newY = y + py;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Place piece on board
  const placePiece = useCallback((board: number[][], piece: any) => {
    const newBoard = board.map(row => [...row]);
    
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px] !== 0) {
          const x = piece.x + px;
          const y = piece.y + py;
          if (y >= 0) {
            newBoard[y][x] = piece.type.charCodeAt(0);
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  // Clear lines
  const clearLines = useCallback((board: number[][]) => {
    const newBoard = [];
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== 0)) {
        linesCleared++;
      } else {
        newBoard.unshift(board[y]);
      }
    }
    
    // Add empty lines at top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { board: newBoard, linesCleared };
  }, []);

  // Move piece
  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;
      
      const newX = prev.currentPiece.x + dx;
      const newY = prev.currentPiece.y + dy;
      
      if (!checkCollision(prev.board, prev.currentPiece, newX, newY)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, x: newX, y: newY }
        };
      }
      
      return prev;
    });
  }, [checkCollision]);

  // Rotate piece
  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;
      
      const piece = prev.currentPiece;
      const rotations = TETRIS_PIECES[piece.type];
      const nextRotation = (piece.rotation + 1) % rotations.length;
      const rotatedShape = rotations[nextRotation];
      
      const rotatedPiece = { ...piece, shape: rotatedShape, rotation: nextRotation };
      
      if (!checkCollision(prev.board, rotatedPiece, piece.x, piece.y)) {
        return {
          ...prev,
          currentPiece: rotatedPiece
        };
      }
      
      return prev;
    });
  }, [checkCollision]);

  // Drop piece
  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;
      
      const newY = prev.currentPiece.y + 1;
      
      if (!checkCollision(prev.board, prev.currentPiece, prev.currentPiece.x, newY)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, y: newY }
        };
      } else {
        // Place piece and spawn new one
        const newBoard = placePiece(prev.board, prev.currentPiece);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newPiece = createPiece(prev.nextPiece);
        const nextPieceType = getRandomPiece();
        
        // Check game over
        if (checkCollision(clearedBoard, newPiece, newPiece.x, newPiece.y)) {
          return {
            ...prev,
            board: clearedBoard,
            gameOver: true,
            currentPiece: null
          };
        }
        
        const newScore = prev.score + (linesCleared * 100 * prev.level);
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: newPiece,
          nextPiece: nextPieceType,
          score: newScore,
          lines: newLines,
          level: newLevel
        };
      }
    });
  }, [checkCollision, placePiece, clearLines, createPiece, getRandomPiece]);

  // Hard drop
  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;
      
      let dropDistance = 0;
      while (!checkCollision(prev.board, prev.currentPiece, prev.currentPiece.x, prev.currentPiece.y + dropDistance + 1)) {
        dropDistance++;
      }
      
      const newPiece = { ...prev.currentPiece, y: prev.currentPiece.y + dropDistance };
      const newBoard = placePiece(prev.board, newPiece);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const nextPiece = createPiece(prev.nextPiece);
      const nextPieceType = getRandomPiece();
      
      if (checkCollision(clearedBoard, nextPiece, nextPiece.x, nextPiece.y)) {
        return {
          ...prev,
          board: clearedBoard,
          gameOver: true,
          currentPiece: null
        };
      }
      
      const newScore = prev.score + (linesCleared * 100 * prev.level) + (dropDistance * 2);
      const newLines = prev.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      
      return {
        ...prev,
        board: clearedBoard,
        currentPiece: nextPiece,
        nextPiece: nextPieceType,
        score: newScore,
        lines: newLines,
        level: newLevel
      };
    });
  }, [checkCollision, placePiece, clearLines, createPiece, getRandomPiece]);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.paused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const dropTime = Math.max(50, 1000 - (gameState.level - 1) * 100);
    
    gameLoopRef.current = setInterval(() => {
      dropPiece();
    }, dropTime);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameOver, gameState.paused, gameState.level, dropPiece]);

  // Initialize game
  useEffect(() => {
    if (!gameState.currentPiece && !gameState.gameOver) {
      setGameState(prev => ({
        ...prev,
        currentPiece: createPiece(prev.nextPiece),
        nextPiece: getRandomPiece()
      }));
    }
  }, [gameState.currentPiece, gameState.gameOver, createPiece, getRandomPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setGameState(prev => ({ ...prev, paused: !prev.paused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePiece, hardDrop, gameState.gameOver]);

  // Restart game
  const restartGame = () => {
    setGameState({
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: null,
      nextPiece: getRandomPiece(),
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      paused: false
    });
  };

  
  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);
    
    // Add current piece to display
    if (gameState.currentPiece) {
      const piece = gameState.currentPiece;
      for (let py = 0; py < piece.shape.length; py++) {
        for (let px = 0; px < piece.shape[py].length; px++) {
          if (piece.shape[py][px] !== 0) {
            const x = piece.x + px;
            const y = piece.y + py;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = piece.type.charCodeAt(0);
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="tetris-row">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`tetris-cell ${cell !== 0 ? 'filled' : ''}`}
            style={{
              backgroundColor: cell !== 0 ? Object.values(PIECE_COLORS)[Object.keys(TETRIS_PIECES).findIndex(k => k.charCodeAt(0) === cell)] || '#888' : 'transparent'
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="tetris-game">
      <div className="tetris-header">
        <h2>🎮 Tetris</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="tetris-content">
        <div className="tetris-board-container">
          <div className="tetris-board">
            {renderBoard()}
          </div>
          
          {gameState.gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-message">
                <h3>Game Over!</h3>
                <p>Final Score: {gameState.score}</p>
                <button onClick={restartGame}>Play Again</button>
              </div>
            </div>
          )}
          
          {gameState.paused && (
            <div className="paused-overlay">
              <div className="paused-message">
                <h3>Paused</h3>
                <p>Press P to continue</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="tetris-sidebar">
          <div className="score-panel">
            <h3>Score</h3>
            <div className="score-value">{gameState.score.toLocaleString()}</div>
            
            <h3>Level</h3>
            <div className="level-value">{gameState.level}</div>
            
            <h3>Lines</h3>
            <div className="lines-value">{gameState.lines}</div>
          </div>
          
          <div className="controls-panel">
            <h3>Controls</h3>
            <div className="control-item">← → Move</div>
            <div className="control-item">↑ Rotate</div>
            <div className="control-item">↓ Soft Drop</div>
            <div className="control-item">Space Hard Drop</div>
            <div className="control-item">P Pause</div>
          </div>
          
          <div className="game-controls">
            <button onClick={() => setGameState(prev => ({ ...prev, paused: !prev.paused }))}>
              {gameState.paused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={restartGame}>Restart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
