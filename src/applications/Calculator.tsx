import { useState } from 'react';

interface CalculatorProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function Calculator({ onClose, onMinimize, onMaximize }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isKawaiiMode, setIsKawaiiMode] = useState(false);

  const kawaiiNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const kawaiiOperations = {
    '+': '＋',
    '-': '－',
    '*': '×',
    '/': '÷',
    '=': '＝'
  };

  const handleNumberClick = (num: string) => {
    // Play button click sound
    try {
      const audio = new Audio('/sounds/system/beep.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {
      console.log('Sound playback failed:', e);
    }
    
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperationClick = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      
      const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [...prev.slice(-9), historyEntry]); 
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleEqualsClick = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const historyEntry = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      
      setHistory(prev => [...prev.slice(-9), historyEntry]);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleDecimalClick = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handlePercentClick = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const handleSquareRootClick = () => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
    setHistory(prev => [...prev.slice(-9), `√${display} = ${value}`]);
  };

  const toggleKawaiiMode = () => {
    setIsKawaiiMode(!isKawaiiMode);
  };

  const formatDisplay = (value: string) => {
    if (!isKawaiiMode) return value;
    
    return value.split('').map(char => {
      if (char >= '0' && char <= '9') {
        return kawaiiNumbers[parseInt(char)];
      }
      return char;
    }).join('');
  };

  const getKawaiiMessage = () => {
    const messages = [
      "Math is so kawaii! (◕‿◕)♡",
      "Numbers are my friends! ✨",
      "Calculating with love! ♥",
      "Senpai's math helper! (´∀｀)",
      "1 + 1 = ♥ for you!",
      "Computing cuteness levels... 💖"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="calculator-app">
      {/* Title Bar with Kawaii Toggle */}
      <div className="calculator-header">
        <div className="calculator-title">
          {isKawaiiMode ? '可愛い電卓 ♥' : 'Calculator'}
        </div>
        <div className="calculator-controls">
          <button 
            className="kawaii-toggle"
            onClick={toggleKawaiiMode}
            title="Toggle Kawaii Mode"
          >
            {isKawaiiMode ? '♥' : '🔢'}
          </button>
          <button 
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
            title="Show History"
          >
            📜
          </button>
        </div>
      </div>

      <div className="calculator-body">
        {/* History Panel */}
        {showHistory && (
          <div className="history-panel">
            <div className="history-title">History</div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">
                  {isKawaiiMode ? 'まだ計算してない... (´・ω・`)' : 'No calculations yet'}
                </div>
              ) : (
                history.map((entry, index) => (
                  <div key={index} className="history-entry">
                    {entry}
                  </div>
                ))
              )}
            </div>
            <button 
              className="clear-history"
              onClick={() => setHistory([])}
            >
              Clear History
            </button>
          </div>
        )}

        {/* Display */}
        <div className="calculator-display">
          <div className="display-main">
            {formatDisplay(display)}
          </div>
          {isKawaiiMode && (
            <div className="kawaii-message">
              {getKawaiiMessage()}
            </div>
          )}
        </div>

        {/* Button Grid */}
        <div className="calculator-buttons">
          {/* Row 1 */}
          <button className="btn-operation" onClick={handleClear}>
            {isKawaiiMode ? 'クリア' : 'C'}
          </button>
          <button className="btn-operation" onClick={() => handleOperationClick('+/-')}>
            ±
          </button>
          <button className="btn-operation" onClick={handlePercentClick}>
            %
          </button>
          <button className="btn-operation" onClick={() => handleOperationClick('/')}>
            {isKawaiiMode ? kawaiiOperations['/'] : '÷'}
          </button>

          {/* Row 2 */}
          <button className="btn-number" onClick={() => handleNumberClick('7')}>
            {formatDisplay('7')}
          </button>
          <button className="btn-number" onClick={() => handleNumberClick('8')}>
            {formatDisplay('8')}
          </button>
          <button className="btn-number" onClick={() => handleNumberClick('9')}>
            {formatDisplay('9')}
          </button>
          <button className="btn-operation" onClick={() => handleOperationClick('*')}>
            {isKawaiiMode ? kawaiiOperations['*'] : '×'}
          </button>

          {/* Row 3 */}
          <button className="btn-number" onClick={() => handleNumberClick('4')}>
            {formatDisplay('4')}
          </button>
          <button className="btn-number" onClick={() => handleNumberClick('5')}>
            {formatDisplay('5')}
          </button>
          <button className="btn-number" onClick={() => handleNumberClick('6')}>
            {formatDisplay('6')}
          </button>
          <button className="btn-operation" onClick={() => handleOperationClick('-')}>
            {isKawaiiMode ? kawaiiOperations['-'] : '−'}
          </button>

          {/* Row 4 */}
          <button className="btn-number" onClick={() => handleNumberClick('1')}>
            {formatDisplay('1')}
          </button>
          <button className="btn-number" onClick={() => handleNumberClick('2')}>
            {formatDisplay('2')}
          </button>
          <button className="btn-number" onClick={() => handleNumberClick('3')}>
            {formatDisplay('3')}
          </button>
          <button className="btn-operation" onClick={() => handleOperationClick('+')}>
            {isKawaiiMode ? kawaiiOperations['+'] : '+'}
          </button>

          {/* Row 5 */}
          <button className="btn-number btn-zero" onClick={() => handleNumberClick('0')}>
            {formatDisplay('0')}
          </button>
          <button className="btn-number" onClick={handleDecimalClick}>
            .
          </button>
          <button className="btn-equals" onClick={handleEqualsClick}>
            {isKawaiiMode ? kawaiiOperations['='] : '='}
          </button>
        </div>

        {/* Extra Functions Row */}
        <div className="calculator-extra">
          <button className="btn-function" onClick={handleSquareRootClick}>
            √
          </button>
          <button className="btn-function" onClick={() => {
            const value = Math.pow(parseFloat(display), 2);
            setDisplay(String(value));
            setHistory(prev => [...prev.slice(-9), `${display}² = ${value}`]);
          }}>
            x²
          </button>
          <button className="btn-function" onClick={() => {
            const value = 1 / parseFloat(display);
            setDisplay(String(value));
            setHistory(prev => [...prev.slice(-9), `1/${display} = ${value}`]);
          }}>
            1/x
          </button>
          {isKawaiiMode && (
            <button className="btn-kawaii" onClick={() => {
              // Play love sound
              try {
                const audio = new Audio('/senpai.mp3');
                audio.volume = 0.4;
                audio.play();
              } catch (e) {
                console.log('Sound playback failed:', e);
              }
              
              setDisplay('143');
              setHistory(prev => [...prev.slice(-9), 'Love calculation: I ♥ U']);
            }}>
              ♥
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
