import React, { useEffect, useState } from 'react';
import './ResultCard.css';

const SOULS = [
  "A kindred spirit of aesthetic chaos and pure vibes.",
  "A chaotic mastermind with unmatched energy.",
  "A gentle soul hiding elite survival instincts.",
  "A multitasking legend with secret chaos powers.",
  "A philosophical gremlin in disguise.",
  "A wildcard who keeps everyone on their toes.",
];

const CrownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 70"
    width="80"
    height="80"
    style={{ display: 'block', margin: '0 auto 20px', filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.7))' }}
  >
    <rect x="10" y="52" width="80" height="12" rx="4" fill="#b8860b" />
    <rect x="10" y="52" width="80" height="4" rx="2" fill="#d4af37" />
    <polygon
      points="10,54 10,20 28,38 50,5 72,38 90,20 90,54"
      fill="url(#crownGrad)"
      stroke="#c8a050"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="10" r="5" fill="#ff4466" style={{ filter: 'drop-shadow(0 0 4px #ff0044)' }} />
    <circle cx="28" cy="40" r="4" fill="#4488ff" style={{ filter: 'drop-shadow(0 0 4px #0044ff)' }} />
    <circle cx="72" cy="40" r="4" fill="#44ff88" style={{ filter: 'drop-shadow(0 0 4px #00ff44)' }} />
    <circle cx="50" cy="57" r="3.5" fill="#d4af37" />
    <defs>
      <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#c8a050" />
        <stop offset="100%" stopColor="#8b5a2b" />
      </linearGradient>
    </defs>
  </svg>
);

const ResultCard = ({ topMatch, onStartOver, onViewLeaderboard }) => {
  const [revealed, setRevealed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 600);
    const t2 = setTimeout(() => setShowButtons(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const soul = SOULS[(topMatch.id - 1) % SOULS.length];

  return (
    <div className="rc-screen">
      <div className="rc-fog rc-fog-1" />
      <div className="rc-fog rc-fog-2" />
      <div className="rc-fog rc-fog-3" />
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`rc-particle rc-particle-${i + 1}`} />
      ))}
      <div className="rc-rays" />
      <div className={`rc-card ${revealed ? 'rc-card--revealed' : ''}`}>
        <div className="rc-halo" />
        <div className="rc-hat">
          <CrownIcon />
        </div>
        <p className="rc-eyebrow">✦ THE HAT HATH SPOKEN ✦</p>
        {topMatch.photo && (
          <div className={`rc-photo-frame ${revealed ? 'rc-photo-frame--revealed' : ''}`}>
            <img src={topMatch.photo} alt={topMatch.name} className="rc-photo" />
          </div>
        )}
        <h1 className="rc-name">{topMatch.name}</h1>
        <div className="rc-divider">
          <span className="rc-divider-rune">ᚠ</span>
          <span className="rc-divider-line" />
          <span className="rc-divider-rune">ᚹ</span>
        </div>
        <p className="rc-soul">{soul}</p>
        <div className={`rc-buttons ${showButtons ? 'rc-buttons--visible' : ''}`}>
          <button className="rc-btn rc-btn--ghost" onClick={onStartOver}>
            ↩ Try again, mortal
          </button>
          <button className="rc-btn rc-btn--gold" onClick={onViewLeaderboard}>
            View the Sacred Board ✦
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
