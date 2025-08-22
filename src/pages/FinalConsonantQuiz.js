import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './FinalConsonantQuiz.css';

// 1. 게임 데이터: 단어, 그림, 정답 받침, 오답 받침 보기
const PROBLEMS = [
  { word: '책', emoji: '📚', base: '채', answer: 'ㄱ', options: ['ㄴ', 'ㅁ'] },
  { word: '밤', emoji: '🌰', base: '바', answer: 'ㅁ', options: ['ㄱ', 'ㅂ'] },
  { word: '눈', emoji: '❄️', base: '누', answer: 'ㄴ', options: ['ㅇ', 'ㄹ'] },
  { word: '곰', emoji: '🐻', base: '고', answer: 'ㅁ', options: ['ㄴ', 'ㅇ'] },
  { word: '발', emoji: '🦶', base: '바', answer: 'ㄹ', options: ['ㄴ', 'ㄱ'] },
  { word: '돈', emoji: '💵', base: '도', answer: 'ㄴ', options: ['ㅁ', 'ㅇ'] },
  { word: '별', emoji: '⭐', base: '벼', answer: 'ㄹ', options: ['ㄱ', 'ㅇ'] },
  { word: '빵', emoji: '🍞', base: '빠', answer: 'ㅇ', options: ['ㄴ', 'ㅁ'] },
  { word: '옷', emoji: '👕', base: '오', answer: 'ㅅ', options: ['ㅈ', 'ㅊ'] },
  { word: '꽃', emoji: '🌸', base: '꼬', answer: 'ㅊ', options: ['ㅅ', 'ㅈ'] },
  { word: '닭', emoji: '🐔', base: '다', answer: 'ᆰ', options: ['ㄱ', 'ㄺ'] },
  { word: '흙', emoji: '흙', base: '흐', answer: 'ᆰ', options: ['ㄱ', 'ㄺ'] },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function FinalConsonantQuiz() {
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const generateProblem = useCallback(() => {
    const newProblem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    setProblem(newProblem);
    setOptions(shuffleArray([newProblem.answer, ...newProblem.options]));
    setFeedback('');
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const handleAnswerClick = (selectedAnswer) => {
    if (feedback) return;

    if (selectedAnswer === problem.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(generateProblem, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="fc-game-container">
      <div className="fc-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>받침을 찾아라!</h1>
        <div className="fc-score">점수: {score}</div>
      </div>
      <p className="instruction">그림을 보고 빈칸에 들어갈 알맞은 받침을 골라보세요.</p>

      <div className="quiz-area">
        <div className="picture-display">{problem.emoji}</div>
        <div className="word-display">
          <div className="base-letter">{problem.base}</div>
          <div className={`answer-box ${feedback}`}>?</div>
        </div>
      </div>

      <div className="options-area">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-button-fc"
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-message-fc ${feedback}`}>
          {feedback === 'correct' ? `정답! "${problem.word}" 맞아요! 👍` : '아니에요, 다시 한번!'}
        </div>
      )}
    </div>
  );
}

export default FinalConsonantQuiz;