import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ClockGame.css';

const getRandomHour = () => Math.floor(Math.random() * 12) + 1;
const getRandomMinute = () => (Math.random() < 0.5 ? 0 : 30);

function ClockGame() {
  const [targetHour, setTargetHour] = useState(getRandomHour());
  const [targetMinute, setTargetMinute] = useState(getRandomMinute());
  const [hourHandAngle, setHourHandAngle] = useState(0);
  const [minuteHandAngle, setMinuteHandAngle] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const clockRef = useRef(null);
  const draggingHandRef = useRef(null);

  const generateNewProblem = useCallback(() => {
    setTargetHour(getRandomHour());
    setTargetMinute(getRandomMinute());
    setHourHandAngle(0);
    setMinuteHandAngle(0);
    setFeedback('');
  }, []);

  const handleMouseMove = useCallback((e) => {
    const clock = clockRef.current;
    if (!clock || !draggingHandRef.current) return;

    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;

    if (draggingHandRef.current === 'hour') {
      const snappedAngle = Math.round(angle / 30) * 30;
      setHourHandAngle(snappedAngle);
    } else if (draggingHandRef.current === 'minute') {
      const snappedAngle = Math.round(angle / 180) * 180;
      setMinuteHandAngle(snappedAngle);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    draggingHandRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e, hand) => {
    e.preventDefault();
    draggingHandRef.current = hand;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 👇 여기가 최종 수정된 핵심 부분입니다!
  const checkAnswer = () => {
    // 목표 시간의 정확한 각도를 계산
    const correctHourAngle = (targetHour % 12) * 30;
    const correctMinuteAngle = targetMinute * 6;
    
    // 현재 바늘의 각도를 0~359 사이의 양수로 변환 (음수 각도 문제 해결)
    const normalizedHourAngle = (Math.round(hourHandAngle) % 360 + 360) % 360;
    const normalizedMinuteAngle = (Math.round(minuteHandAngle) % 360 + 360) % 360;
    
    // 시침과 분침의 각도가 모두 일치하는지 확인
    const isHourCorrect = normalizedHourAngle === correctHourAngle;
    const isMinuteCorrect = normalizedMinuteAngle === correctMinuteAngle;

    if (isHourCorrect && isMinuteCorrect) {
      setFeedback('correct');
      setTimeout(generateNewProblem, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  const getMissionText = () => {
    if (targetMinute === 0) {
      return `${targetHour}시 정각`;
    }
    return `${targetHour}시 30분`;
  };

  return (
    <div className="clock-game-container">
      <div className="clock-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>시계바늘을 돌려봐!</h1>
      </div>
      <div className="mission-box">
        <p>시계를 <span className="target-time">{getMissionText()}</span>으로 맞춰보세요!</p>
      </div>
      <div className="clock-face" ref={clockRef}>
        <div className="clock-center"></div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`clock-number number-${i + 1}`}>{i + 1}</div>
        ))}
        <div 
          className="hand hour-hand" 
          style={{ transform: `rotate(${hourHandAngle}deg)` }}
          onMouseDown={(e) => handleMouseDown(e, 'hour')}
        ></div>
        <div 
          className="hand minute-hand" 
          style={{ transform: `rotate(${minuteHandAngle}deg)` }}
          onMouseDown={(e) => handleMouseDown(e, 'minute')}
        ></div>
      </div>
      <button onClick={checkAnswer} className="check-answer-button">정답 확인!</button>
      {feedback && (
        <div className={`feedback-popup ${feedback}`}>
          {feedback === 'correct' ? '딩동댕! 정답이에요! 🕰️' : '아쉬워요! 다시 해봐요!'}
        </div>
      )}
    </div>
  );
}

export default ClockGame;