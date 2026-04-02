import React, { useState, useEffect, useRef } from 'react';
import './QuizForm.css';
import './QuizFloaters.css';

import stickerAcharya   from '../assets/stickers/WIZ ACHARYA 1.png';
import stickerBhavya    from '../assets/stickers/WIZ BHAVYA 1.png';
import stickerRadh      from '../assets/stickers/WIZ RADH 1.png';
import stickerReenu1    from '../assets/stickers/WIZ REENU 1.png';
import stickerReenu2    from '../assets/stickers/WIZ REENU 2.png';
import stickerSarah     from '../assets/stickers/WIZ SARAH 1.png';
import stickerShukla    from '../assets/stickers/WIZ SHUKLA 1.png';
import stickerVarshith1 from '../assets/stickers/WIZ VARSHITH 1.png';
import stickerVarshith2 from '../assets/stickers/WIZ VARSHITH 2.png';

const STICKERS = [
  stickerRadh, stickerShukla, stickerBhavya, stickerReenu1,
  stickerAcharya, stickerSarah, stickerVarshith1, stickerReenu2,
  stickerVarshith2,
];

// Static config — outside component so it never re-creates on render
const BASE = [
  { left:  2, dur: 20, rot: -10, size: 140, depth: 0.8 },
  { left: 88, dur: 24, rot:   7, size: 160, depth: 1.2 },
  { left:  4, dur: 18, rot:  -5, size: 130, depth: 0.6 },
  { left: 90, dur: 26, rot:  12, size: 150, depth: 1.5 },
  { left:  6, dur: 22, rot:  -2, size: 170, depth: 1.0 },
  { left: 83, dur: 28, rot:   9, size: 125, depth: 0.9 },
  { left:  3, dur: 19, rot:  -8, size: 155, depth: 1.3 },
  { left: 87, dur: 25, rot:   4, size: 145, depth: 0.7 },
  { left:  5, dur: 21, rot: -13, size: 135, depth: 1.1 },
];

// Jumbled Top/Left coordinates for a natural, non-overlapping distribution
// These are scattered across ~4500px of scroll height
const SCATTERED_COORDS = [
  // { top, left, size, depth, rot, dur }
  { t: 120,  l: 5,   s: 160, d: 0.9, r: -12, dr: 22 },
  { t: 380,  l: 95,  s: 185, d: 1.4, r: 15,  dr: 26 },
  { t: 650,  l: 6,   s: 150, d: 0.7, r: -8,  dr: 19 },
  { t: 920,  l: 94,  s: 175, d: 1.6, r: 12,  dr: 28 },
  { t: 1250, l: 4,   s: 190, d: 1.1, r: -5,  dr: 24 },
  { t: 1580, l: 96,  s: 145, d: 1.0, r: 10,  dr: 30 },
  { t: 1840, l: 7,   s: 170, d: 1.5, r: -14, dr: 21 },
  { t: 2160, l: 92,  s: 165, d: 0.8, r: 7,   dr: 27 },
  { t: 2420, l: 5,   s: 155, d: 1.2, r: -10, dr: 23 },
  { t: 2750, l: 95,  s: 180, d: 1.3, r: 18,  dr: 25 },
  { t: 3080, l: 8,   s: 165, d: 1.0, r: -6,  dr: 29 },
  { t: 3350, l: 93,  s: 195, d: 1.5, r: 9,   dr: 20 },
  { t: 3620, l: 4,   s: 150, d: 0.9, r: -15, dr: 24 },
  { t: 3950, l: 97,  s: 170, d: 1.2, r: 5,   dr: 28 },
  { t: 4280, l: 6,   s: 185, d: 1.1, r: -11, dr: 26 },
  { t: 4540, l: 92,  s: 160, d: 1.4, r: 13,  dr: 22 },
];

const ALL_FLOATERS = SCATTERED_COORDS.map((c, i) => ({
  src:   STICKERS[i % STICKERS.length], // Cycle through images
  key:   `f-${i}`,
  top:   c.t,
  left:  c.l,
  size:  c.s,
  depth: c.d,
  rot:   c.r,
  dur:   [12, 16, 14, 18, 15, 20, 13, 17, 14][i % 9], // Increased speed
  delay: i * 1.2, // Stagger starts
}));

const QuizForm = ({ QUESTIONS, responses, handleInputChange, onSubmit, error, onViewLeaderboard }) => {
  const [visibleQuestions, setVisibleQuestions] = useState(0);
  const errRef     = useRef(null);
  const floatersRef = useRef(null);

  // Questions stagger-in
  useEffect(() => {
    const timeout = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleQuestions(count);
        if (count >= QUESTIONS.length) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timeout);
  }, [QUESTIONS.length]);

  // Error scroll
  useEffect(() => {
    if (error && errRef.current) {
      errRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  // Mouse parallax — RAF lerp, direct DOM mutations, zero re-renders
  useEffect(() => {
    let rafId;
    let tx = 0, ty = 0;   // mouse target (normalized -0.5 to 0.5)
    let cx = 0, cy = 0;   // current interpolated value

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth  - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      if (floatersRef.current) {
        floatersRef.current.style.setProperty('--mx', cx.toFixed(4));
        floatersRef.current.style.setProperty('--my', cy.toFixed(4));
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const answered = responses.filter(r => r !== null).length;
  const total = QUESTIONS.length;
  const pct = Math.round((answered / total) * 100);

  return (
    <div className="qf-scroll-screen">
      <div className="qf-scroll-bg">
        {/* Sticker floaters — now correctly placed in the background layer ("the black part") */}
        <div className="qf-floaters" ref={floatersRef} aria-hidden="true">
          {ALL_FLOATERS.map((f) => (
            <div
              key={f.key}
              className="qf-fp-wrap"
              style={{
                top:       f.top,
                left:      `${f.left}%`,
                '--depth': f.depth,
              }}
            >
              <div
                className="qf-floater"
                style={{
                  '--dur':   `${f.dur}s`,
                  '--delay': `${f.delay}s`,
                  '--rot':   `${f.rot}deg`,
                  width:      f.size,
                }}
              >
                <img src={f.src} alt="" />
              </div>
            </div>
          ))}
        </div>

        <div className="qf-scroll-curtain">

          <div className="qf-rod qf-rod-top">
            <div className="qf-rod-cap" />
            <div className="qf-rod-bar" />
            <div className="qf-rod-cap" />
          </div>

          <div className="qf-parchment">
            <div className="qf-parchment-inner">

              <div className="qf-scroll-header">
                <span className="qf-lightning">⚡</span>
                <div className="qf-scroll-title">The Ancient Scroll</div>
                <div className="qf-scroll-sub">Answer truthfully. The Hat is watching.</div>
                <div className="qf-scroll-runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ</div>
              </div>

              <div className="qf-prog-wrap">
                <div className="qf-prog-label">
                  <span className="qf-prog-text">{answered} of {total} seals broken</span>
                  <span className="qf-prog-text">{pct}%</span>
                </div>
                <div className="qf-prog-track">
                  <div className="qf-prog-fill" style={{ width: `${pct}%` }} />
                  <div className="qf-prog-glow" style={{ left: `${pct}%` }} />
                </div>
              </div>

              {error && (
                <div className="qf-err-msg" ref={errRef} style={{ display: 'block' }}>
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={onSubmit}>
                {QUESTIONS.map((q, idx) => (
                  <div
                    key={idx}
                    className={`qf-question ${idx < visibleQuestions ? 'visible' : ''}`}
                  >
                    <div className="qf-q-header">
                      <span className="qf-q-num">{String(idx + 1).padStart(2, '0')}</span>
                      <p className="qf-q-text">{q.text}</p>
                      {responses[idx] !== null && <span className="qf-q-done">✓</span>}
                    </div>

                    <div className="qf-likert">
                      <div className="qf-options-row"><span className="qf-l-label qf-l-min">{q.minLabel}</span>
                      <div className="qf-options">
                        {[1, 2, 3, 4, 5].map(val => (
                          <div
                            key={val}
                            className={`qf-opt ${responses[idx] === val ? 'sel' : ''}`}
                            onClick={() => handleInputChange(idx, val)}
                          >
                            <div className="qf-dot" />
                            <span className="qf-opt-val">{val}</span>
                          </div>
                        ))}
                      </div>
                      <span className="qf-l-label qf-l-max">{q.maxLabel}</span></div>
                    </div>

                    <div className="qf-divider" />
                  </div>
                ))}

                <div className="qf-submit-area">
                  <button type="submit" className="qf-submit-btn">
                    <span>Reveal My Fate</span>
                    <span>✦</span>
                  </button>
                </div>
              </form>

            </div>
          </div>

          <div className="qf-rod">
            <div className="qf-rod-cap" />
            <div className="qf-rod-bar" />
            <div className="qf-rod-cap" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuizForm;