import React from 'react';

export default function RankingBoard({ playerName, onNameChange, rankings }) {
  return (
    <div className="ranking-card">
      <h3 className="ranking-title">🏆 실시간 검색 기록</h3>
      <div className="name-box">
        <label className="name-label" htmlFor="playerNameInput">
          플레이어 이름:
        </label>
        <input
          id="playerNameInput"
          type="text"
          className="name-input"
          value={playerName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <ol className="ranking-list">
        {rankings.length === 0 ? (
          <li className="ranking-empty">아직 기록이 없어요!</li>
        ) : (
          rankings.map((item, index) => (
            <li key={index}>
              <b>{item.name}</b> : {item.score}점
            </li>
          ))
        )}
      </ol>
      <p className="guide-text">
        * Java 서버(GameController.java)의 숫자를 수정하고 재실행한 뒤 새로고침(F5) 해보세요!
      </p>
    </div>
  );
}
