import React from 'react';

const AdminDashboard = ({ liveData, QUESTIONS_LENGTH, onRefresh, onClearUsers, onResetDatabase }) => {
  return (
    <div className="container admin-page">
      <h1>Live Admin Dashboard</h1>
      <p className="subtitle">Real-time participant tracking</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{liveData.totalActive}</h3>
          <p>Active Participants</p>
        </div>
        <div className="stat-card">
          <h3>{QUESTIONS_LENGTH}</h3>
          <p>Total Questions</p>
        </div>
      </div>

      <div className="live-sessions">
        <h2>Progress Breakdown</h2>
        <div className="progress-list">
          {[...liveData.sessions]
            .sort((a, b) => {
              if (a.submitted && !b.submitted) return 1;
              if (!a.submitted && b.submitted) return -1;
              return b.progress - a.progress; // Sort active by progress desc
            })
            .map((session, sIdx) => {
              const currentProgress = (session.progress / QUESTIONS_LENGTH) * 100;
              return (
                <div key={session.id} className={`session-row ${session.submitted ? 'is-submitted' : ''}`}>
                  <span className="session-id">{session.name}</span>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                  <span className="progress-text">{session.progress}/{QUESTIONS_LENGTH}</span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="nav-group center" style={{ flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        <button className="leaderboard-btn" onClick={onRefresh}>
          Refresh Live View
        </button>

        <button className="back-btn" onClick={onClearUsers}>
          Clear Tracking View
        </button>
        
        <button 
          className="back-btn" 
          onClick={onResetDatabase} 
          style={{ borderColor: 'var(--error, #ff4e4e)', color: 'var(--error, #ff4e4e)', flex: '1 1 100%' }}
        >
          Factory Reset Database
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
