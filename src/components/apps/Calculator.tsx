import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
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
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="calculator-app">
      {/* Display */}
      <div className="calculator-display">
        <div className="display-text">{display}</div>
      </div>

      {/* Buttons */}
      <div className="calculator-buttons">
        {/* Row 1 */}
        <button className="calc-btn clear" onClick={clearDisplay}>C</button>
        <button className="calc-btn operation" onClick={() => inputOperation('/')}>÷</button>
        <button className="calc-btn operation" onClick={() => inputOperation('*')}>×</button>
        <button className="calc-btn operation" onClick={() => inputOperation('-')}>-</button>

        {/* Row 2 */}
        <button className="calc-btn number" onClick={() => inputNumber('7')}>7</button>
        <button className="calc-btn number" onClick={() => inputNumber('8')}>8</button>
        <button className="calc-btn number" onClick={() => inputNumber('9')}>9</button>
        <button className="calc-btn operation plus" onClick={() => inputOperation('+')}>+</button>

        {/* Row 3 */}
        <button className="calc-btn number" onClick={() => inputNumber('4')}>4</button>
        <button className="calc-btn number" onClick={() => inputNumber('5')}>5</button>
        <button className="calc-btn number" onClick={() => inputNumber('6')}>6</button>

        {/* Row 4 */}
        <button className="calc-btn number" onClick={() => inputNumber('1')}>1</button>
        <button className="calc-btn number" onClick={() => inputNumber('2')}>2</button>
        <button className="calc-btn number" onClick={() => inputNumber('3')}>3</button>
        <button className="calc-btn equals" onClick={performCalculation}>=</button>

        {/* Row 5 */}
        <button className="calc-btn number zero" onClick={() => inputNumber('0')}>0</button>
        <button className="calc-btn decimal" onClick={inputDecimal}>.</button>
      </div>
    </div>
  );
}
