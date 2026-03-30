import React from 'react';

const Leaderboard = ({ MAIN_DATA, leaderboard, isLoading, expandedMemberId, setExpandedMemberId, onBack }) => {
  return (
    <div className="container leaderboard-page">
      <h1>Global Leaderboard</h1>
      <p className="subtitle">See exactly who matched with each board member.</p>

      {isLoading ? (
        <p>Loading counts...</p>
      ) : (
        <div className="leaderboard-cards">
          {MAIN_DATA.map(member => {
            let names = leaderboard[member.id] || [];
            if (typeof names === 'number') {
              names = Array(names).fill('Anonymous'); // Local fallback migration
            }
            const count = names.length;
            return { ...member, names, count };
          })
          .sort((a, b) => b.count - a.count)
          .map((member, idx) => (
            <div 
              key={member.id} 
              className={`leaderboard-card ${expandedMemberId === member.id ? 'expanded' : ''}`}
              onClick={() => setExpandedMemberId(expandedMemberId === member.id ? null : member.id)}
            >
              <div className="leaderboard-card-header">
                <div className="leaderboard-card-info">
                  <span className="rank">#{idx + 1}</span>
                  <span className="name">{member.name}</span>
                </div>
                <span className="count">{member.count} matches <span className="chevron">{expandedMemberId === member.id ? '▲' : '▼'}</span></span>
              </div>
              {expandedMemberId === member.id && (
                <div className="leaderboard-card-details">
                  {member.count > 0 ? (
                    <div className="matched-names-list">
                      {member.names.map((n, i) => {
                        const displayName = typeof n === 'string' && n.includes('::') ? n.split('::')[0] : n;
                        return <div key={i} className="matched-name-tag">{displayName}</div>;
                      })}
                    </div>
                  ) : (
                    <p className="empty-state">No matches yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="nav-group center" style={{ marginTop: '2rem' }}>
        <button className="back-btn" onClick={onBack}>
          Back to Form
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
