import React, { useCallback } from 'react';
import './Leaderboard1.css';

const Leaderboard = ({ MAIN_DATA, leaderboard, isLoading, expandedMemberId, setExpandedMemberId, onBack }) => {

  if (!MAIN_DATA || !leaderboard) {
    return (
      <div className="lb-screen">
        <p className="lb-loading">Consulting the ancient records...</p>
      </div>
    )
  }

  const members = MAIN_DATA.map(member => {
    let names = leaderboard[member.id] || [];
    if (typeof names === 'number') {
      names = Array(names).fill('Anonymous');
    }
    const count = names.length;
    return { ...member, names, count };
  }).sort((a, b) => b.count - a.count);

  const handleCardClick = useCallback((e, memberId, isExpanded) => {
    // Ripple effect
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'lb-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    setExpandedMemberId(isExpanded ? null : memberId);
  }, [setExpandedMemberId]);

  return (
    <div className="lb-screen">

      <div className="lb-header">
        <p className="lb-pretitle">THE SACRED REGISTRY</p>
       <h2 className="lb-title">Hall of Matches</h2>
        <p className="lb-subtitle">Those whose souls have been weighed and measured.</p>
      </div>

      <div className="lb-ornament">
        <div className="lb-ornament-line" />
        <div className="lb-ornament-dot" />
        <div className="lb-ornament-diamond" />
        <div className="lb-ornament-dot" />
        <div className="lb-ornament-line" />
      </div>

      {isLoading ? (
        <p className="lb-loading">Consulting the ancient records...</p>
      ) : (
        <div className="lb-cards">
          {members.map((member, idx) => {
            const rank = idx + 1;
            const isExpanded = expandedMemberId === member.id;

            return (
              <div
                key={member.id}
                className={`lb-card lb-card--rank-${rank <= 3 ? rank : 'other'} ${isExpanded ? 'lb-card--expanded' : ''}`}
                onClick={(e) => handleCardClick(e, member.id, isExpanded)}
              >
                <div className="lb-card-header">
                  <span className={`lb-rank lb-rank--${rank <= 3 ? rank : 'other'}`}>
                    {rank <= 3 ? ['I', 'II', 'III'][rank - 1] : `${rank}`}
                  </span>
                  <div className="lb-vr" />
                  {member.photo && (
                    <div className="lb-avatar-wrap">
                      <img src={member.photo} alt={member.name} className="lb-avatar" />
                    </div>
                  )}
                  <span className="lb-member-name">{member.name}</span>
                  <div className="lb-match-info">
                    <span className="lb-match-count">
                      {member.count} {member.count === 1 ? 'soul' : 'souls'}
                    </span>
                    <div className="lb-chevron" />
                  </div>
                </div>

                {isExpanded && (
                  <div className="lb-card-details">
                    <p className="lb-details-label">MATCHED SOULS</p>
                    {member.count > 0 ? (
                      <div className="lb-names-grid">
                        {member.names.map((n, i) => {
                          const displayName = typeof n === 'string' && n.includes('::')
                            ? n.split('::')[0]
                            : n;
                          return (
                            <span key={i} className="lb-name-tag">
                              {displayName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="lb-empty">No souls have been matched yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="lb-footer">
        <button className="lb-back-btn" onClick={onBack}>
          RETURN TO THE SCROLL
        </button>
      </div>

    </div>
  );
};

export default Leaderboard;