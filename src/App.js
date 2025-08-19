import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. 페이지 컴포넌트들을 모두 import 합니다.
import MainPage from './pages/MainPage';
import WordCardGame from './pages/WordCardGame';
import AlphabetPad from './pages/AlphabetPad'; // <-- 이 줄이 누락되었을 가능성이 높습니다!

import './App.css';

function App() {
  return (
    <Router basename="/eng-adv">
      <div className="App">
        <Routes>
          {/* 기본 경로: 메인 페이지 */}
          <Route path="/" element={<MainPage />} />
          
          {/* 단어 카드 게임 페이지 경로 */}
          <Route path="/word-card-game" element={<WordCardGame />} />

          {/* 2. 알파벳 따라 쓰기 페이지 경로를 추가합니다. */}
          <Route path="/alphabet-pad" element={<AlphabetPad />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;