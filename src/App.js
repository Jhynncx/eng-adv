import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. 페이지 컴포넌트들을 모두 import 합니다.
import MainPage from './pages/MainPage';
import WordCardGame from './pages/WordCardGame';
import AlphabetPad from './pages/AlphabetPad'; 
import FindThePicture from './pages/FindThePicture';

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
           {/* '/find-the-picture' 경로 추가 (NEW) */}
          <Route path="/find-the-picture" element={<FindThePicture />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;