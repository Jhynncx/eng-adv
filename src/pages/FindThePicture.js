import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './FindThePicture.css';

// 1. 게임 데이터: 단어 카드 게임에서 썼던 데이터를 재사용합니다.
const WORDS = [
  { id: 1, emoji: '🍎', name: 'Apple', sound: 'apple1.mp3' },
  { id: 2, emoji: '🍌', name: 'Banana', sound: 'banana1.mp3' },
  { id: 3, emoji: '🍇', name: 'Grapes', sound: 'grapes1.mp3' },
  { id: 4, emoji: '🐶', name: 'Dog', sound: 'dog1.mp3' },
  { id: 5, emoji: '🐱', name: 'Cat', sound: 'cat1.mp3' },
  { id: 6, emoji: '🦁', name: 'Lion', sound: 'lion1.mp3' },
];

// 배열을 랜덤하게 섞는 함수
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function FindThePicture() {
  const [question, setQuestion] = useState(null); // 현재 문제 (정답)
  const [options, setOptions] = useState([]); // 보기 목록 (정답 포함 4개)
  const [feedback, setFeedback] = useState(''); // 정답/오답 피드백 메시지
  const [score, setScore] = useState(0);

  // 2. 새 문제를 출제하는 함수
  const generateQuestion = useCallback(() => {
    setFeedback(''); // 이전 피드백 초기화
    const shuffledWords = shuffleArray(WORDS);
    const answer = shuffledWords[0]; // 섞은 후 첫 번째 단어를 정답으로 선택
    const wrongOptions = shuffledWords.slice(1, 4); // 나머지 단어 중 3개를 오답 보기로 선택
    
    setQuestion(answer);
    setOptions(shuffleArray([answer, ...wrongOptions])); // 정답과 오답을 섞어서 보기 목록 설정
  }, []);

  // 컴포넌트가 처음 로드될 때 첫 문제를 출제
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // 3. 소리 재생 함수
  const playSound = () => {
    if (question) {
      const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${question.sound}`);
      audio.play();
    }
  };

  // 4. 답안 확인 함수
  const handleAnswerClick = (selectedOption) => {
    if (feedback) return; // 피드백이 떠 있는 동안은 클릭 비활성화

    if (selectedOption.id === question.id) {
      setFeedback('correct');
      setScore(s => s + 1);
      // 1.5초 후 다음 문제로
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setFeedback('incorrect');
      // 1.5초 후 피드백 사라짐
      setTimeout(() => {
        setFeedback('');
      }, 1500);
    }
  };
  
  if (!question) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="find-game-container">
      <div className="find-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>소리를 듣고 그림 찾기</h1>
        <div className="score-display">점수: {score}</div>
      </div>

      <div className="question-area">
        <p>어떤 소리가 들리나요?</p>
        <button onClick={playSound} className="play-sound-button">
          소리 듣기 🔊
        </button>
      </div>

      <div className="options-grid">
        {options.map(option => (
          <div 
            key={option.id} 
            className="option-card"
            onClick={() => handleAnswerClick(option)}
          >
            {option.emoji}
          </div>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-message ${feedback}`}>
          {feedback === 'correct' ? '정답이에요! 🎉' : '다시 생각해봐요 🤔'}
        </div>
      )}
    </div>
  );
}

export default FindThePicture;