import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './NumberTrain.css';

// 랜덤 숫자 생성 함수
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// 배열을 랜덤하게 섞는 함수
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function NumberTrain() {
  const [train, setTrain] = useState([]);
  const [options, setOptions] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // 👇 이 부분을 수정했습니다!
  const generateNewGame = useCallback(() => {
    setIsSuccess(false);
    const sequenceLength = 6; // 1. 기차 길이를 5칸에서 6칸으로 늘립니다.
    const startNumber = getRandomNumber(1, 100 - sequenceLength); // 2. 시작 숫자의 범위를 1~94 사이로 크게 늘립니다.
    const answerSequence = Array.from({ length: sequenceLength }, (_, i) => startNumber + i);

    setTrain([answerSequence[0]]);
    setOptions(shuffleArray(answerSequence.slice(1)));
  }, []);

  useEffect(() => {
    generateNewGame();
  }, [generateNewGame]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    if (!draggedItem) return;

    const nextNumber = train[train.length - 1] + 1;
    if (draggedItem === nextNumber) {
      const newTrain = [...train, draggedItem];
      setTrain(newTrain);
      setOptions(options.filter(opt => opt !== draggedItem));
      setDraggedItem(null);

      // 👇 기차 길이에 맞춰 성공 조건도 6으로 변경했습니다.
      if (newTrain.length === 6) {
        setIsSuccess(true);
      }
    } else {
      const trainCars = document.querySelectorAll('.train-car');
      const lastCar = trainCars[trainCars.length - 1];
      lastCar.classList.add('shake');
      setTimeout(() => lastCar.classList.remove('shake'), 500);
    }
  };

  return (
    <div className="train-game-container">
      <div className="train-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>숫자 기차 연결하기</h1>
      </div>
      <p className="instruction">숫자 순서에 맞게 객차를 기관차 뒤에 연결해주세요!</p>

      <div 
        className="train-track"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {train.map((num, index) => (
          <div key={num} className="train-car">
            {index === 0 ? '🚂' : '🚃'} {num}
          </div>
        ))}
      </div>

      <div className="options-depot">
        {options.map(num => (
          <div
            key={num}
            className="train-car option"
            draggable
            onDragStart={(e) => handleDragStart(e, num)}
          >
            🚃 {num}
          </div>
        ))}
      </div>

      {isSuccess && (
        <div className="success-popup">
          <h2>칙칙폭폭! 기차 완성! 🚂</h2>
          <button onClick={generateNewGame}>새로운 기차 만들기</button>
        </div>
      )}
    </div>
  );
}

export default NumberTrain;