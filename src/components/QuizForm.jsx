import React, { useState, useEffect, useRef } from 'react';
import './QuizForm.css';

const QuizForm = ({ QUESTIONS, responses, handleInputChange, onSubmit, error, onViewLeaderboard }) => {
  const [visibleQuestions, setVisibleQuestions] = useState(0);
  const errRef = useRef(null);

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

  useEffect(() => {
    if (error && errRef.current) {
      errRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const answered = responses.filter(r => r !== null).length;
  const total = QUESTIONS.length;
  const pct = Math.round((answered / total) * 100);

  return (
    <div className="qf-scroll-screen">
      <div className="qf-scroll-bg">
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
                      <span className="qf-l-label">{q.minLabel}</span>
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
                      <span className="qf-l-label">{q.maxLabel}</span>
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