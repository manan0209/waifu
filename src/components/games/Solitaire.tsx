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
  const handleStockClick = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // Prevent bubbling to clearSelection
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
  const handleCardClick = (card: Card, pileType: string, pileIndex: number, cardIndex: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // Prevent bubbling to clearSelection
    if (!gameState) return;
    
    console.log('Card clicked:', { card: card.rank + card.suit, pileType, pileIndex, cardIndex, selected: gameState.selectedCard?.id });
    
    if (!card.faceUp) return;
    
    if (gameState.selectedCard && gameState.selectedPile) {
      console.log('Attempting to move', gameState.selectedCard.rank + gameState.selectedCard.suit, 'to', card.rank + card.suit);
      attemptMove(card, pileType, pileIndex, cardIndex);
    } else {
      let canSelect = false;
      
      if (pileType === 'waste' && cardIndex === 0) {
        canSelect = true;
      } else if (pileType === 'tableau') {
        const pile = gameState.tableau[pileIndex];
        if (cardIndex === pile.length - 1) {
          canSelect = true; 
        } else {
          const subsequentCards = pile.slice(cardIndex);
          canSelect = isValidSequence(subsequentCards);
        }
      } else if (pileType === 'foundation') {
        const pile = gameState.foundation[pileIndex];
        canSelect = pile.length > 0 && pile[pile.length - 1].id === card.id;
      }
      
      console.log('Can select card?', canSelect);
      
      if (canSelect) {
        setGameState(prev => prev ? {
          ...prev,
          selectedCard: card,
          selectedPile: { type: pileType, index: pileIndex }
        } : prev);
      }
    }
  };

  // Handle empty pile click
  const handleEmptyPileClick = (pileType: string, pileIndex: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // Prevent bubbling to clearSelection
    if (!gameState || !gameState.selectedCard || !gameState.selectedPile) return;
    
    
    const dummyCard: Card = {
      suit: 'hearts',
      rank: 'A',
      color: 'red',
      value: 1,
      faceUp: true,
      id: 'dummy'
    };
    
    attemptMove(dummyCard, pileType, pileIndex, 0);
  };

  // Handle double click for auto-move to foundation
  const handleDoubleClick = (card: Card, pileType: string, pileIndex: number) => {
    if (!gameState || !card.faceUp) return;
    
    // Try to move to foundation automatically
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, gameState.foundation[i])) {
        
        setGameState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            selectedCard: card,
            selectedPile: { type: pileType, index: pileIndex }
          };
        });
        
        setTimeout(() => {
          const dummyCard: Card = {
            suit: 'hearts',
            rank: 'A',
            color: 'red',
            value: 1,
            faceUp: true,
            id: 'dummy'
          };
          attemptMove(dummyCard, 'foundation', i, 0);
        }, 50);
        break;
      }
    }
  };

  // Clear selection when clicking on empty space
  const clearSelection = () => {
    if (gameState?.selectedCard) {
      setGameState(prev => prev ? {
        ...prev,
        selectedCard: null,
        selectedPile: null
      } : prev);
    }
  };

  
  const canPlaceOnFoundation = (card: Card, foundationPile: Card[]): boolean => {
    if (foundationPile.length === 0) {
      return card.rank === 'A'; 
    }
    
    const topCard = foundationPile[foundationPile.length - 1];
    return card.suit === topCard.suit && card.value === topCard.value + 1;
  };

  // Check if card can be placed on tableau
  const canPlaceOnTableau = (card: Card, tableauPile: Card[]): boolean => {
    if (tableauPile.length === 0) {
      return card.rank === 'K'; 
    }
    
    const topCard = tableauPile[tableauPile.length - 1];
    return card.color !== topCard.color && card.value === topCard.value - 1;
  };

  // Get moveable cards from tableau (card and all cards below it)
  const getMoveableCards = (pileIndex: number, cardIndex: number): Card[] => {
    if (!gameState) return [];
    const pile = gameState.tableau[pileIndex];
    return pile.slice(cardIndex);
  };

  // Check if sequence is valid for moving
  const isValidSequence = (cards: Card[]): boolean => {
    for (let i = 0; i < cards.length - 1; i++) {
      const current = cards[i];
      const next = cards[i + 1];
      if (current.color === next.color || current.value !== next.value + 1) {
        return false;
      }
    }
    return true;
  };

  // Attempt to move a card
  const attemptMove = (targetCard: Card, targetType: string, targetIndex: number, targetCardIndex: number) => {
    if (!gameState || !gameState.selectedCard || !gameState.selectedPile) return;
    
    const { selectedCard, selectedPile } = gameState;
    let moveValid = false;
    let newState = { ...gameState };
    let scoreChange = 0;

    console.log('Attempting move:', {
      selectedCard: selectedCard.rank + selectedCard.suit,
      selectedPile,
      targetType,
      targetIndex,
      targetCard: targetCard.rank + targetCard.suit
    });

    if (targetType === 'foundation') {
      
      if (selectedPile.type === 'waste' || 
          (selectedPile.type === 'tableau' && 
           gameState.tableau[selectedPile.index].length - 1 === 
           gameState.tableau[selectedPile.index].findIndex(c => c.id === selectedCard.id))) {
        
        if (canPlaceOnFoundation(selectedCard, newState.foundation[targetIndex])) {
          moveValid = true;
          scoreChange = 10;
          
          // Remove from source
          if (selectedPile.type === 'waste') {
            newState.waste = newState.waste.slice(1);
          } else {
            newState.tableau[selectedPile.index] = newState.tableau[selectedPile.index].slice(0, -1);
            // Flip next card if exists
            const tableau = newState.tableau[selectedPile.index];
            if (tableau.length > 0 && !tableau[tableau.length - 1].faceUp) {
              tableau[tableau.length - 1].faceUp = true;
              scoreChange += 5;
            }
          }
          
          
          newState.foundation[targetIndex].push(selectedCard);
        }
      }
    } else if (targetType === 'tableau') {
      // Move to tableau
      if (selectedPile.type === 'waste') {
        
        if (canPlaceOnTableau(selectedCard, newState.tableau[targetIndex])) {
          moveValid = true;
          scoreChange = 5;
          newState.waste = newState.waste.slice(1);
          newState.tableau[targetIndex].push(selectedCard);
        }
      } else if (selectedPile.type === 'tableau') {
        // Card(s) from tableau
        const sourceCardIndex = newState.tableau[selectedPile.index].findIndex(c => c.id === selectedCard.id);
        const moveableCards = getMoveableCards(selectedPile.index, sourceCardIndex);
        
        if (moveableCards.length > 0 && isValidSequence(moveableCards) && 
            canPlaceOnTableau(moveableCards[0], newState.tableau[targetIndex])) {
          moveValid = true;
          
          
          newState.tableau[selectedPile.index] = newState.tableau[selectedPile.index].slice(0, sourceCardIndex);
          
          // Flip next card if exists
          const sourcePile = newState.tableau[selectedPile.index];
          if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].faceUp) {
            sourcePile[sourcePile.length - 1].faceUp = true;
            scoreChange += 5;
          }
          
          
          newState.tableau[targetIndex].push(...moveableCards);
        }
      } else if (selectedPile.type === 'foundation') {
        
        if (canPlaceOnTableau(selectedCard, newState.tableau[targetIndex])) {
          moveValid = true;
          scoreChange = -15; 
          newState.foundation[selectedPile.index] = newState.foundation[selectedPile.index].slice(0, -1);
          newState.tableau[targetIndex].push(selectedCard);
        }
      }
    }

    if (moveValid) {
      newState.moves += 1;
      newState.score = Math.max(0, newState.score + scoreChange);
      console.log('Move successful!', scoreChange);
    } else {
      console.log('Move failed - invalid move');
    }

    // Clear selection regardless
    newState.selectedCard = null;
    newState.selectedPile = null;
    
    setGameState(newState);
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
              <li><strong>Goal:</strong> Move all cards to foundation piles (top right)</li>
              <li><strong>Foundation:</strong> Build Ace to King, same suit</li>
              <li><strong>Tableau:</strong> Build King to Ace, alternating colors</li>
              <li><strong>Controls:</strong></li>
              <li>• Click to select a card (yellow highlight)</li>
              <li>• Click another location to move selected card</li>
              <li>• Double-click to auto-move to foundation</li>
              <li>• Click stock pile (blue card) to draw new cards</li>
              <li>• Only Kings can go on empty tableau columns</li>
              <li>• Only Aces can start foundation piles</li>
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
      <div className="game-board" onClick={clearSelection}>
        {/* Top Row: Stock, Waste, and Foundation */}
        <div className="top-row">
          <div className="stock-waste">
            {/* Stock Pile */}
            <div className="stock-pile" onClick={(e) => handleStockClick(e)}>
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
                  onClick={(e) => handleCardClick(gameState.waste[0], 'waste', 0, 0, e)}
                  onDoubleClick={() => handleDoubleClick(gameState.waste[0], 'waste', 0)}
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
                  <div 
                    className={`card ${gameState.selectedCard?.id === pile[pile.length - 1].id ? 'selected' : ''}`}
                    onClick={(e) => handleCardClick(pile[pile.length - 1], 'foundation', index, pile.length - 1, e)}
                    onDoubleClick={() => handleDoubleClick(pile[pile.length - 1], 'foundation', index)}
                  >
                    <span className={`card-rank ${pile[pile.length - 1].color}`}>
                      {pile[pile.length - 1].rank}
                    </span>
                    <span className={`card-suit ${pile[pile.length - 1].color}`}>
                      {getCardSymbol(pile[pile.length - 1].suit)}
                    </span>
                  </div>
                ) : (
                  <div 
                    className="empty-pile foundation-empty"
                    onClick={(e) => handleEmptyPileClick('foundation', index, e)}
                  >
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
                <div 
                  className="empty-pile tableau-empty"
                  onClick={(e) => handleEmptyPileClick('tableau', colIndex, e)}
                >
                  K
                </div>
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
                    onClick={(e) => handleCardClick(card, 'tableau', colIndex, cardIndex, e)}
                    onDoubleClick={() => handleDoubleClick(card, 'tableau', colIndex)}
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
