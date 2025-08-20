import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './MathMonster.css';

// ... (게임 로직 전체는 이전 답변과 동일) ...

function MathMonster() {
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const generateProblem = useCallback(() => {
    setFeedback('');
    const operator = Math.random() < 0.5 ? '+' : '-';
    let num1, num2, answer;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 99) + 1;
      num2 = Math.floor(Math.random() * (100 - num1)) + 1;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 99) + 2;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
    }

    const wrongOptions = new Set();
    while (wrongOptions.size < 3) {
      const wrongAnswer = Math.floor(Math.random() * 19) - 9 + answer;
      if (wrongAnswer > 0 && wrongAnswer !== answer) {
        wrongOptions.add(wrongAnswer);
      }
    }

    setProblem({ num1, num2, operator, answer });
    setOptions([...wrongOptions, answer].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const handleAnswerClick = (selectedAnswer) => {
    if (feedback) return;

    if (selectedAnswer === problem.answer) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(() => generateProblem(), 1500);
    } else {
      setFeedback('incorrect');
      if (score > 0) setScore(s => s - 5);
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="math-game-container">
      <div className="math-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>몬스터 덧셈/뺄셈</h1>
        <div className="score-display">점수: {score}</div>
      </div>
      <div className="monster-area">
        <div className="monster-emoji">👾</div>
        <div className={`problem-box ${feedback}`}>
          {problem.num1} {problem.operator} {problem.num2} = ?
        </div>
      </div>
      <div className="answer-options">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div className={`feedback-text ${feedback}`}>
          {feedback === 'correct' ? '몬스터를 물리쳤다! ✨' : '으악, 공격 실패! 😵'}
        </div>
      )}
    </div>
  );
}

// 👇 이 부분이 가장 중요합니다!
export default MathMonster;