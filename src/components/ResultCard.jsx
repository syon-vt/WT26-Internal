import React from 'react';

const ResultCard = ({ topMatch, onStartOver, onViewLeaderboard }) => {
  return (
    <div className="container result-page">
      <h1>Your Top Match</h1>
      <div className="result-card">
        <h2>{topMatch.name}</h2>
        <div className="match-details">
          <p>This personality segment most closely aligns with your responses.</p>
        </div>
      </div>
      <div className="nav-group">
        <button className="back-btn" onClick={onStartOver}>
          Start Over
        </button>

        <button className="leaderboard-btn" onClick={onViewLeaderboard}>
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
