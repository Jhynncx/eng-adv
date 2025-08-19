import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-container">
      <h1>🌈 Welcome to ABC Adventure World! 🌈</h1>
      <p>게임을 선택하고 신나는 영어 모험을 시작해보세요!</p>
      
      <div className="game-menu">
    <Link to="/word-card-game" className="game-card">
      <h2>단어 카드 뒤집기</h2>
      <p>그림을 보고 단어를 맞춰봐요!</p>
    </Link>
    
    {/* '알파벳 따라 쓰기' 카드를 Link로 변경 (CHANGED) */}
    <Link to="/alphabet-pad" className="game-card">
      <h2>알파벳 따라 쓰기</h2>
      <p>글자를 따라 쓰며 익혀봐요!</p>
    </Link>

    <div className="game-card disabled">
      <h2>그림 찾기 게임</h2>
      <p>(준비 중이에요!)</p>
    </div>
      </div>
    </div>
  );
}

export default MainPage;