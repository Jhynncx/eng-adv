import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AlphabetPad.css';

const UPPERCASE_ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE_ALPHABETS = 'abcdefghijklmnopqrstuvwxyz'.split('');

function AlphabetPad() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAlphabet, setCurrentAlphabet] = useState('A');
  const [letterCase, setLetterCase] = useState('upper');

  const drawGuideAlphabet = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.fillStyle = '#e0e0e0';
    context.font = 'bold 350px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(currentAlphabet, canvas.width / 2, canvas.height / 2);
  }, [currentAlphabet]);
  
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideAlphabet();
  }, [drawGuideAlphabet]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = 500;
    canvas.height = 500;
    
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 15;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [currentAlphabet, clearCanvas]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  
  const handleCaseChange = (newCase) => {
    setLetterCase(newCase);
    const firstChar = newCase === 'upper' ? 'A' : 'a';
    // 1. 대/소문자 전환 시에도 첫 글자 음성 재생 (CHANGED)
    handleAlphabetClick(firstChar);
  };

  // 2. 알파벳 클릭과 음성 재생을 함께 처리하는 함수 (NEW)
  const handleAlphabetClick = (char) => {
    setCurrentAlphabet(char);
    // toUpperCase()를 사용해 대/소문자 모두 대문자 파일(A.mp3)을 사용하도록 함
    const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${char.toUpperCase()}.mp3`);
    audio.play();
  };

  return (
    <div className="pad-container">
      <div className="pad-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>알파벳 따라 쓰기</h1>
      </div>
      
      <div className="case-selector">
        <button 
          className={letterCase === 'upper' ? 'active' : ''}
          onClick={() => handleCaseChange('upper')}
        >
          대문자
        </button>
        <button 
          className={letterCase === 'lower' ? 'active' : ''}
          onClick={() => handleCaseChange('lower')}
        >
          소문자
        </button>
      </div>

      <div className="alphabet-selector">
        {(letterCase === 'upper' ? UPPERCASE_ALPHABETS : LOWERCASE_ALPHABETS).map(char => (
          <button 
            key={char} 
            className={currentAlphabet === char ? 'active' : ''}
            // 3. onClick 이벤트를 새로운 핸들러 함수로 변경 (CHANGED)
            onClick={() => handleAlphabetClick(char)}
          >
            {char}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        className="drawing-pad"
      />
      
      <button onClick={clearCanvas} className="clear-button">
        다시 쓰기 ✏️
      </button>
    </div>
  );
}

export default AlphabetPad;