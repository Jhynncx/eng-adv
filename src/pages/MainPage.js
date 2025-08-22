import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-container">
      {/* --- 영어 놀이터 섹션 --- */}
      <h1 className="section-title">🌈 영어 놀이터 🌈</h1>
      <p>게임을 선택하고 신나는 영어 모험을 시작해보세요!</p>
      <div className="game-menu">
        <Link to="/word-card-game" className="game-card">
          <h2>단어 카드 뒤집기</h2>
          <p>그림을 보고 단어를 맞춰봐요!</p>
        </Link>
        <Link to="/alphabet-pad" className="game-card">
          <h2>알파벳 따라 쓰기</h2>
          <p>글자를 따라 쓰며 익혀봐요!</p>
        </Link>
        <Link to="/find-the-picture" className="game-card">
          <h2>그림 찾기 게임</h2>
          <p>소리를 듣고 그림을 찾아봐요!</p>
        </Link>
      </div>

      {/* --- 수학 탐험 섹션 (NEW) --- */}
      <div className="section-divider"></div>
      <h1 className="section-title">🧮 신나는 수학 탐험 🧮</h1>
      <p>재미있는 게임으로 수학과 친해져요!</p>
      <div className="game-menu">
        <Link to="/math-monster" className="game-card math-card">
          <h2>몬스터 덧셈/뺄셈</h2>
          <p>몬스터를 물리치며 연산을 배워요!</p>
        </Link>
        <Link to="/number-train" className="game-card math-card">
          <h2>숫자 기차 연결하기</h2>
          <p>수의 순서를 맞춰 기차를 완성해요!</p>
        </Link>
        <Link to="/clock-game" className="game-card math-card">
          <h2>시계바늘을 돌려봐!</h2>
          <p>시침과 분침을 움직여 시간을 맞춰요!</p>
        </Link>
      </div>

      <div className="section-divider"></div>
      <h1 className="section-title">💡 똑똑 한글 탐험 💡</h1>
      <p>재미있는 게임으로 한글과 친해져요!</p>
      <div className="game-menu">
        <Link to="/hangul-wizard" className="game-card hangul-card">
          <h2>글자 조합 마법사</h2>
          <p>자음과 모음을 합쳐 글자를 만들어요!</p>
        </Link>
         {/* '낱말 그림 퍼즐' 카드를 Link로 변경 (CHANGED) */}
        <Link to="/word-puzzle" className="game-card hangul-card">
          <h2>낱말 그림 퍼즐</h2>
          <p>그림을 보고 낱말을 완성해요!</p>
        </Link>
         <Link to="/final-consonant-quiz" className="game-card hangul-card">
          <h2>받침을 찾아라!</h2>
          <p>그림을 보고 알맞은 받침을 찾아요!</p>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;