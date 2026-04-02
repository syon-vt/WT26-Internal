import React, { useEffect, useState } from 'react';
import './ResultCard.css';



const ResultCard = ({ topMatch, onStartOver, onViewLeaderboard }) => {
  const [revealed, setRevealed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 600);
    const t2 = setTimeout(() => setShowButtons(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);


  return (
    <div className="rc-screen">

      {/* Ambient fog layers */}
      <div className="rc-fog rc-fog-1" />
      <div className="rc-fog rc-fog-2" />
      <div className="rc-fog rc-fog-3" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`rc-particle rc-particle-${i + 1}`} />
      ))}

      {/* Rays of light */}
      <div className="rc-rays" />

      {/* Main card */}
      <div className={`rc-card ${revealed ? 'rc-card--revealed' : ''}`}>

        {/* Glow ring behind hat */}
        <div className="rc-halo" />

        <div className="rc-hat">🎩</div>

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

        <p className="rc-soul">{topMatch.blurb}</p>

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