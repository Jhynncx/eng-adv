import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ClockGame.css';

const getRandomHour = () => Math.floor(Math.random() * 12) + 1;

function ClockGame() {
  const [targetHour, setTargetHour] = useState(getRandomHour());
  const [hourHandAngle, setHourHandAngle] = useState(0);
  const [minuteHandAngle, setMinuteHandAngle] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const clockRef = useRef(null);

  const generateNewProblem = useCallback(() => {
    setTargetHour(getRandomHour());
    setHourHandAngle(0);
    setMinuteHandAngle(0);
    setFeedback('');
  }, []);

  const handleMouseMove = useCallback((e) => {
    const clock = clockRef.current;
    if (!clock) return;

    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 마우스 포인터와 시계 중심 사이의 각도 계산
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
    const snappedAngle = Math.round(angle / 30) * 30; // 12시간 눈금에 맞게 각도 조정

    setHourHandAngle(snappedAngle);
  }, []);

  const handleMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const checkAnswer = () => {
    // 목표 시간의 각도 계산 (1시간 = 30도)
    const correctAngle = (targetHour % 12) * 30;
    
    if (hourHandAngle % 360 === correctAngle) {
      setFeedback('correct');
      setTimeout(generateNewProblem, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  return (
    <div className="clock-game-container">
      <div className="clock-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>시계바늘을 돌려봐!</h1>
      </div>

      <div className="mission-box">
        <p>시계를 <span className="target-time">{targetHour}시 정각</span>으로 맞춰보세요!</p>
      </div>

      <div className="clock-face" ref={clockRef}>
        <div className="clock-center"></div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`clock-number number-${i + 1}`}>{i + 1}</div>
        ))}
        <div 
          className="hand hour-hand" 
          style={{ transform: `rotate(${hourHandAngle}deg)` }}
          onMouseDown={handleMouseDown}
        ></div>
        <div 
          className="hand minute-hand" 
          style={{ transform: `rotate(${minuteHandAngle}deg)` }}
        ></div>
      </div>

      <button onClick={checkAnswer} className="check-answer-button">
        정답 확인!
      </button>

      {feedback && (
        <div className={`feedback-popup ${feedback}`}>
          {feedback === 'correct' ? '딩동댕! 정답이에요! 🕰️' : '아쉬워요! 다시 해봐요!'}
        </div>
      )}
    </div>
  );
}

export default ClockGame;