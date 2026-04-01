import React, { useState } from 'react';

const AdminDashboard = ({ liveData, QUESTIONS_LENGTH, onRefresh, onClearUsers, onResetDatabase }) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === '7410') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode.');
      setPasscode('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container admin-page" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem' }}>Admin Access</h1>
        <form onSubmit={handleLogin} className="question-group" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <input 
            type="password" 
            placeholder="Enter passcode..."
            value={passcode} 
            onChange={(e) => { setPasscode(e.target.value); setError(''); }}
            style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              border: `1px solid ${error ? '#ff4e4e' : 'var(--border)'}`, 
              fontSize: '1.5rem', 
              textAlign: 'center',
              letterSpacing: '0.5rem',
              background: 'var(--bg-soft)', 
              color: 'var(--text)' 
            }}
            autoFocus
          />
          {error && <p style={{ color: '#ff4e4e', margin: '-0.5rem 0 0 0', fontWeight: '500' }}>{error}</p>}
          <button type="submit" className="submit-btn">Unlock Dashboard</button>
        </form>
      </div>
    );
  }

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
          style={{ borderColor: '#ff4e4e', color: '#ff4e4e', flex: '1 1 100%' }}
        >
          Factory Reset Database
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
