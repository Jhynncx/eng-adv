import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HangulWizard.css';

// --- 👇 여기가 핵심 수정 부분입니다! ---
// 1. 유니코드 표준에 따른 자음, 모음 전체 목록을 정의합니다.
const INITIAL_CONSONANTS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const MEDIAL_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const HANGUL_START_CODE = 44032; // '가'의 유니코드 코드 포인트

// 2. 유니코드 공식에 기반한, 가장 정확한 한글 조합 함수입니다.
const combineHangul = (initial, medial) => {
  const initialIndex = INITIAL_CONSONANTS.indexOf(initial);
  const medialIndex = MEDIAL_VOWELS.indexOf(medial);
  
  // 공식: 시작코드 + (초성 인덱스 * 21 * 28) + (중성 인덱스 * 28)
  const hangulCode = HANGUL_START_CODE + (initialIndex * 21 * 28) + (medialIndex * 28);
  return String.fromCharCode(hangulCode);
};

// 3. 게임에서 사용할 기본 자음, 모음 목록 (UI 표시용)
const GAME_CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const GAME_VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];
// ------------------------------------

function HangulWizard() {
  const [targetLetter, setTargetLetter] = useState('');
  const [problemConsonant, setProblemConsonant] = useState('');
  const [problemVowel, setProblemVowel] = useState('');
  const [droppedConsonant, setDroppedConsonant] = useState(null);
  const [droppedVowel, setDroppedVowel] = useState(null);
  const [feedback, setFeedback] = useState('');

  const generateProblem = useCallback(() => {
    const randomConsonant = GAME_CONSONANTS[Math.floor(Math.random() * GAME_CONSONANTS.length)];
    const randomVowel = GAME_VOWELS[Math.floor(Math.random() * GAME_VOWELS.length)];
    
    setProblemConsonant(randomConsonant);
    setProblemVowel(randomVowel);
    setTargetLetter(combineHangul(randomConsonant, randomVowel));

    setDroppedConsonant(null);
    setDroppedVowel(null);
    setFeedback('');
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (droppedConsonant && droppedVowel) {
      if (droppedConsonant === problemConsonant && droppedVowel === problemVowel) {
        setFeedback('correct');
        setTimeout(generateProblem, 1500);
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setDroppedConsonant(null);
          setDroppedVowel(null);
          setFeedback('');
        }, 1500);
      }
    }
  }, [droppedConsonant, droppedVowel, problemConsonant, problemVowel, generateProblem]);

  const handleDragStart = (e, letter, type) => {
    e.dataTransfer.setData('letter', letter);
    e.dataTransfer.setData('type', type);
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e, dropZoneType) => {
    e.preventDefault();
    if (feedback) return;
    const letter = e.dataTransfer.getData('letter');
    const type = e.dataTransfer.getData('type');
    if (type === dropZoneType) {
      if (type === 'consonant') setDroppedConsonant(letter);
      if (type === 'vowel') setDroppedVowel(letter);
    }
  };

  if (!targetLetter) return <div>Loading...</div>;

  return (
    <div className="hangul-game-container">
      <div className="hangul-game-header">
        <Link to="/" className="home-button">🏠 홈으로</Link>
        <h1>글자 조합 마법사</h1>
      </div>
      <p className="instruction">아래 카드에서 알맞은 자음과 모음을 골라 마법진에 올려놓으세요!</p>
      
      <div className="target-letter-display">
        목표 글자: <span>{targetLetter}</span>
      </div>

      <div className="combination-area">
        {feedback === 'correct' ? (
          <div className="result-zone animate-success">{targetLetter}</div>
        ) : (
          <>
            <div 
              className={`drop-zone consonant-zone ${droppedConsonant ? 'filled' : ''} ${feedback === 'incorrect' ? 'animate-incorrect' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'consonant')}
            >
              {droppedConsonant || '자음'}
            </div>
            <div className="plus-sign">+</div>
            <div 
              className={`drop-zone vowel-zone ${droppedVowel ? 'filled' : ''} ${feedback === 'incorrect' ? 'animate-incorrect' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'vowel')}
            >
              {droppedVowel || '모음'}
            </div>
          </>
        )}
      </div>
      
      {feedback && (
        <div className={`feedback-cauldron ${feedback}`}>
          {feedback === 'correct' ? `펑! ✨ 완성! ✨` : '앗, 잘못된 조합이에요!'}
        </div>
      )}

      <div className="letter-cards-container">
        <div className="card-shelf">
          <h3>자음 카드</h3>
          <div className="card-list">
            {GAME_CONSONANTS.map(c => (
              <div key={c} className="letter-card consonant" draggable onDragStart={(e) => handleDragStart(e, c, 'consonant')}>{c}</div>
            ))}
          </div>
        </div>
        <div className="card-shelf">
          <h3>모음 카드</h3>
          <div className="card-list">
            {GAME_VOWELS.map(v => (
              <div key={v} className="letter-card vowel" draggable onDragStart={(e) => handleDragStart(e, v, 'vowel')}>{v}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HangulWizard;