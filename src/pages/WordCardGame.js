import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './WordCardGame.css';

const WORDS = [
  { id: 1, emoji: '🍎', name: 'Apple', sound: 'Apple.mp3' },
  { id: 2, emoji: '🍌', name: 'Banana', sound: 'Banana.mp3' },
  { id: 3, emoji: '🍇', name: 'Grapes', sound: 'Grapes.mp3' },
  { id: 4, emoji: '🐶', name: 'Dog', sound: 'Dog.mp3' },
  { id: 5, emoji: '🐱', name: 'Cat', sound: 'Cat.mp3' },
  { id: 6, emoji: '🦁', name: 'Lion', sound: 'Lion.mp3' },
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function WordCardGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);

  const resetGame = useCallback(() => {
    const gameCards = [...WORDS, ...WORDS];
    setCards(shuffleArray(gameCards));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setIsGameWon(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (matchedPairs.length === WORDS.length) {
      setTimeout(() => {
        setIsGameWon(true);
      }, 600);
    }
  }, [matchedPairs]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.id === secondCard.id) {
        setMatchedPairs((prev) => [...prev, firstCard.id]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  const handleCardClick = (index) => {
    if (isGameWon || flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].id)) {
      return;
    }

    const clickedCard = cards[index];
    const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${clickedCard.sound}`);
    audio.play();
    
    setFlippedIndices([...flippedIndices, index]);
  };
  
  return (
    <div className="game-board">
      {isGameWon && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>모든 단어 카드를 맞췄어요!</p>
            <button onClick={resetGame} className="restart-button modal-button">
              다시 도전!
            </button>
          </div>
        </div>
      )}

      <div className="header">
        <Link to="/" className="home-button">
          🏠 홈으로
        </Link>
        <h1>단어 카드 뒤집기</h1>
        <button onClick={resetGame} className="restart-button">
          다시 하기 🔁
        </button>
      </div>
      <div className="card-grid">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index);
          const isMatched = matchedPairs.includes(card.id);

          return (
            <div
              key={index}
              className={`card ${isFlipped || isMatched ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">
                  <div className="card-emoji">{card.emoji}</div>
                  <div className="card-name">{card.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WordCardGame;