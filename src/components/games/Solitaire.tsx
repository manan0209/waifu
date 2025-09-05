import React, { useState, useEffect } from 'react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  color: 'red' | 'black';
  value: number;
  faceUp: boolean;
  id: string;
}

// Game state type
interface GameState {
  tableau: Card[][];
  foundation: Card[][];
  stock: Card[];
  waste: Card[];
  selectedCard: Card | null;
  selectedPile: { type: string; index: number } | null;
  moves: number;
  score: number;
  gameWon: boolean;
  startTime: Date;
}

export default function Solitaire() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize a new game
  const initializeGame = () => {
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    
    // Deal cards to tableau
    const tableau: Card[][] = Array(7).fill(null).map(() => []);
    let deckIndex = 0;
    
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = shuffledDeck[deckIndex++];
        if (row === col) {
          card.faceUp = true; // Top card is face up
        }
        tableau[col].push(card);
      }
    }
    
    // Remaining cards go to stock
    const stock = shuffledDeck.slice(deckIndex).map(card => ({
      ...card,
      faceUp: false
    }));
    
    const newGameState: GameState = {
      tableau,
      foundation: Array(4).fill(null).map(() => []),
      stock,
      waste: [],
      selectedCard: null,
      selectedPile: null,
      moves: 0,
      score: 0,
      gameWon: false,
      startTime: new Date()
    };
    
    setGameState(newGameState);
    setGameStarted(true);
  };

  // Create a standard deck of cards
  const createDeck = (): Card[] => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: Card[] = [];
    
    suits.forEach(suit => {
      ranks.forEach((rank, index) => {
        deck.push({
          suit,
          rank,
          color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
          value: index + 1,
          faceUp: false,
          id: `${suit}-${rank}`
        });
      });
    });
    
    return deck;
  };

  // Shuffle deck
  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get card symbol
  const getCardSymbol = (suit: Suit): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };

  // Handle stock click (draw cards)
  const handleStockClick = () => {
    if (!gameState) return;
    
    setGameState(prev => {
      if (!prev) return prev;
      
      if (prev.stock.length === 0) {
        // Reset stock from waste
        return {
          ...prev,
          stock: [...prev.waste].reverse().map(card => ({ ...card, faceUp: false })),
          waste: [],
          moves: prev.moves + 1
        };
      } else {
        // Draw card(s) from stock
        const newCard = { ...prev.stock[0], faceUp: true };
        return {
          ...prev,
          stock: prev.stock.slice(1),
          waste: [newCard, ...prev.waste],
          moves: prev.moves + 1
        };
      }
    });
  };

  // Handle card click
  const handleCardClick = (card: Card, pileType: string, pileIndex: number, cardIndex: number) => {
    if (!gameState || !card.faceUp) return;
    
    if (gameState.selectedCard && gameState.selectedPile) {
      // Try to move selected card
      attemptMove(card, pileType, pileIndex, cardIndex);
    } else {
      // Select card
      setGameState(prev => prev ? {
        ...prev,
        selectedCard: card,
        selectedPile: { type: pileType, index: pileIndex }
      } : prev);
    }
  };

  // Attempt to move a card
  const attemptMove = (targetCard: Card, targetType: string, targetIndex: number, targetCardIndex: number) => {
    if (!gameState || !gameState.selectedCard || !gameState.selectedPile) return;
    
    // Implementation would go here for move validation and execution
    // For now, just clear selection
    setGameState(prev => prev ? {
      ...prev,
      selectedCard: null,
      selectedPile: null
    } : prev);
  };

  // Check for game win
  useEffect(() => {
    if (gameState && gameState.foundation.every(pile => pile.length === 13)) {
      setGameState(prev => prev ? { ...prev, gameWon: true } : prev);
    }
  }, [gameState?.foundation]);

  if (!gameStarted) {
    return (
      <div className="solitaire-menu">
        <div className="solitaire-header">
          <h2>🂡 Solitaire</h2>
          <p>Classic Klondike Solitaire</p>
        </div>
        
        <div className="menu-options">
          <button className="new-game-btn" onClick={initializeGame}>
            New Game
          </button>
          
          <div className="game-rules">
            <h3>How to Play:</h3>
            <ul>
              <li>Move all cards to the foundation piles</li>
              <li>Foundation piles: Ace to King, same suit</li>
              <li>Tableau: King to Ace, alternating colors</li>
              <li>Click stock pile to draw new cards</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className="solitaire-game">
      {/* Header */}
      <div className="game-header">
        <div className="game-info">
          <span>Score: {gameState.score}</span>
          <span>Moves: {gameState.moves}</span>
        </div>
        <div className="game-controls">
          <button onClick={initializeGame}>New Game</button>
          <button onClick={() => setGameStarted(false)}>Menu</button>
        </div>
      </div>

      {/* Game Board */}
      <div className="game-board">
        {/* Top Row: Stock, Waste, and Foundation */}
        <div className="top-row">
          <div className="stock-waste">
            {/* Stock Pile */}
            <div className="stock-pile" onClick={handleStockClick}>
              {gameState.stock.length > 0 ? (
                <div className="card back">🂠</div>
              ) : (
                <div className="empty-pile">↻</div>
              )}
            </div>
            
            {/* Waste Pile */}
            <div className="waste-pile">
              {gameState.waste.length > 0 ? (
                <div 
                  className={`card ${gameState.selectedCard?.id === gameState.waste[0].id ? 'selected' : ''}`}
                  onClick={() => handleCardClick(gameState.waste[0], 'waste', 0, 0)}
                >
                  <span className={`card-rank ${gameState.waste[0].color}`}>
                    {gameState.waste[0].rank}
                  </span>
                  <span className={`card-suit ${gameState.waste[0].color}`}>
                    {getCardSymbol(gameState.waste[0].suit)}
                  </span>
                </div>
              ) : (
                <div className="empty-pile"></div>
              )}
            </div>
          </div>

          {/* Foundation Piles */}
          <div className="foundation-piles">
            {gameState.foundation.map((pile, index) => (
              <div key={index} className="foundation-pile">
                {pile.length > 0 ? (
                  <div className="card">
                    <span className={`card-rank ${pile[pile.length - 1].color}`}>
                      {pile[pile.length - 1].rank}
                    </span>
                    <span className={`card-suit ${pile[pile.length - 1].color}`}>
                      {getCardSymbol(pile[pile.length - 1].suit)}
                    </span>
                  </div>
                ) : (
                  <div className="empty-pile foundation-empty">
                    {index === 0 && '♠'}
                    {index === 1 && '♥'}
                    {index === 2 && '♦'}
                    {index === 3 && '♣'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="tableau">
          {gameState.tableau.map((column, colIndex) => (
            <div key={colIndex} className="tableau-column">
              {column.length === 0 ? (
                <div className="empty-pile tableau-empty">K</div>
              ) : (
                column.map((card, cardIndex) => (
                  <div 
                    key={card.id}
                    className={`card ${card.faceUp ? '' : 'back'} ${
                      gameState.selectedCard?.id === card.id ? 'selected' : ''
                    }`}
                    style={{ 
                      position: 'absolute',
                      top: `${cardIndex * 20}px`,
                      zIndex: cardIndex
                    }}
                    onClick={() => handleCardClick(card, 'tableau', colIndex, cardIndex)}
                  >
                    {card.faceUp ? (
                      <>
                        <span className={`card-rank ${card.color}`}>
                          {card.rank}
                        </span>
                        <span className={`card-suit ${card.color}`}>
                          {getCardSymbol(card.suit)}
                        </span>
                      </>
                    ) : (
                      <span>🂠</span>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Win Dialog */}
      {gameState.gameWon && (
        <div className="win-dialog">
          <div className="win-content">
            <h2>🎉 You Won!</h2>
            <p>Congratulations! You completed the game!</p>
            <p>Score: {gameState.score} | Moves: {gameState.moves}</p>
            <button onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
