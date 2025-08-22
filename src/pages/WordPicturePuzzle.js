import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './WordPicturePuzzle.css';

// 단어 목록은 이전과 동일하게 유지됩니다.
const WORDS = [
  // ... (이전 답변의 단어 목록 40여 개) ...
  { word: '사자', emoji: '🦁' }, { word: '나무', emoji: '🌳' }, { word: '기차', emoji: '🚂' }, { word: '아기', emoji: '👶' }, { word: '포도', emoji: '🍇' }, { word: '오리', emoji: '🦆' }, { word: '우유', emoji: '🥛' }, { word: '피자', emoji: '🍕' }, { word: '커피', emoji: '☕' }, { word: '돼지', emoji: '🐷' }, { word: '하마', emoji: '🦛' }, { word: '치마', emoji: '👗' }, { word: '바지', emoji: '👖' }, { word: '모자', emoji: '👒' }, { word: '고기', emoji: '🥩' }, { word: '새우', emoji: '🍤' }, { word: '야구', emoji: '⚾' }, { word: '축구', emoji: '⚽' }, { word: '지도', emoji: '🗺️' }, { word: '과자', emoji: '🍪' }, { word: '노트', emoji: '📓' }, { word: '주스', emoji: '🧃' }, { word: '해골', emoji: '💀' },
  { word: '바나나', emoji: '🍌' }, { word: '비행기', emoji: '✈️' }, { word: '코끼리', emoji: '🐘' }, { word: '호랑이', emoji: '🐯' }, { word: '선풍기', emoji: '🌬️' }, { word: '카메라', emoji: '📷' }, { word: '소방차', emoji: '🚒' }, { word: '구급차', emoji: '🚑' }, { word: '경찰차', emoji: '🚓' }, { word: '신호등', emoji: '🚦' }, { word: '우주선', emoji: '🚀' }, { word: '소파', emoji: '🛋️' }, { word: '피아노', emoji: '🎹' }, { word: '햄버거', emoji: '🍔' }, { word: '아이스크림', emoji: '🍦' }, { word: '바이올린', emoji: '🎻' }, { word: '도서관', emoji: '📚' }, { word: '선생님', emoji: '🧑‍🏫' },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function WordPicturePuzzle() {
  const [problem, setProblem] = useState(null);
  const [answerSlots, setAnswerSlots] = useState([]);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(''); // 'correct' 또는 'incorrect' 상태 추가

  const generateProblem = useCallback(() => {
    const newProblem = WORDS[Math.floor(Math.random() * WORDS.length)];
    setProblem(newProblem);
    setAnswerSlots(Array(newProblem.word.length).fill(null));
    setOptions(shuffleArray(newProblem.word.split('')));
    setFeedback('');
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const handleOptionClick = (letter, index) => {
    if (feedback) return; // 피드백 중에는 클릭 비활성화

    const firstEmptyIndex = answerSlots.findIndex(slot => slot === null);
    if (firstEmptyIndex !== -1) {
      const newAnswerSlots = [...answerSlots];
      newAnswerSlots[firstEmptyIndex] = letter;
      setAnswerSlots(newAnswerSlots);

      const newOptions = [...options];
      newOptions[index] = null;
      setOptions(newOptions);
    }
  };

  const handleSlotClick = (index) => {
    if (feedback) return;

    const letterInSlot = answerSlots[index];
    if (letterInSlot) {
      const firstEmptyOptionIndex = options.findIndex(opt => opt === null);
      const newOptions = [...options];
      newOptions[firstEmptyOptionIndex] = letterInSlot;
      setOptions(newOptions);

      const newAnswerSlots = [...answerSlots];
      newAnswerSlots[index] = null;
      setAnswerSlots(newAnswerSlots);
    }
  };

  // 👇 정답/오답 확인 로직 수정
  useEffect(() => {
    if (problem && answerSlots.every(slot => slot !== null)) {
      if (answerSlots.join('') === problem.word) {
        setFeedback('correct');
        setTimeout(generateProblem, 2000);
      } else {
        // 틀렸을 경우
        setFeedback('incorrect');
        setTimeout(() => {
          // 1.5초 후, 틀린 글자들을 다시 보기로 되돌림
          setAnswerSlots(Array(problem.word.length).fill(null));
          setOptions(shuffleArray(problem.word.split('')));
          setFeedback('');
        }, 1500);
      }
    }
  }, [answerSlots, problem, generateProblem]);

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="puzzle-game-container">
      <div className="puzzle-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>낱말 그림 퍼즐</h1>
      </div>
      <p className="instruction">그림을 보고 낱말을 완성해보세요!</p>

      {/* 👇 feedback 상태에 따라 클래스 추가 */}
      <div className={`puzzle-board ${feedback}`}>
        <div className="picture-box">{problem.emoji}</div>
        <div className="answer-slots">
          {answerSlots.map((letter, index) => (
            <div 
              key={index} 
              className="slot"
              onClick={() => handleSlotClick(index)}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      
      {/* 👇 오답 피드백 메시지 추가 */}
      {feedback === 'incorrect' && (
        <div className="incorrect-feedback">
          앗, 틀렸어요! 다시 해봐요 🤔
        </div>
      )}

      <div className="options-container">
        {options.map((letter, index) => (
          <div
            key={index}
            className={`option-block ${!letter ? 'hidden' : ''}`}
            onClick={() => letter && handleOptionClick(letter, index)}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordPicturePuzzle;