import { useState, useEffect } from 'react'
import './App.css'

const MAIN_DATA = [
  { id: 1, name: "A", ans: [5, 1, 4, 2, 5] },
  { id: 2, name: "B", ans: [2, 5, 1, 3, 4] },
  { id: 3, name: "C", ans: [4, 2, 5, 1, 2] },
  { id: 4, name: "D", ans: [5, 4, 3, 5, 1] },
  { id: 5, name: "E", ans: [1, 3, 5, 4, 2] },
  { id: 6, name: "F", ans: [3, 2, 4, 5, 5] },
  { id: 7, name: "G", ans: [5, 5, 1, 2, 3] },
  { id: 8, name: "H", ans: [4, 4, 4, 4, 4] },
  { id: 9, name: "I", ans: [2, 1, 2, 5, 4] },
  { id: 0, name: "J", ans: [3, 5, 3, 1, 5] }
]

const QUESTIONS = [
  "How much do you enjoy working in a team?",
  "How often do you prefer remote work over office work?",
  "How much do you value technical excellence over delivery speed?",
  "How interested are you in learning new technologies?",
  "How much do you prioritize career growth over work-life balance?"
]

const SESSION_ID = Math.random().toString(36).substring(2, 10);

function App() {
  const [responses, setResponses] = useState([null, null, null, null, null])
  const [userName, setUserName] = useState('')
  const [topMatch, setTopMatch] = useState(null)
  const [view, setView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'nameEntry'
  })
  const [error, setError] = useState('')
  const [leaderboard, setLeaderboard] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [liveData, setLiveData] = useState({ totalActive: 0, sessions: [] })
  const [expandedMemberId, setExpandedMemberId] = useState(null)

  // Live progress tracking
  const updateLiveProgress = async (prog, currentName = userName, submitted = false) => {
    try {
      if (view === 'admin' || view === 'leaderboard') return; // Don't track stats if it's the admin
      if (!currentName) return; // Strictly require a name
      await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: SESSION_ID, userName: currentName, progress: prog, submitted })
      });
    } catch (err) {
      console.warn('Live tracking failed, silent error');
    }
  }

  const fetchLiveData = async () => {
    try {
      const res = await fetch(`/api/live?t=${Date.now()}`); // Cache-buster to bypass Safari/Chrome GET caching
      if (res.ok) {
        const data = await res.json();
        setLiveData(data);
      }
    } catch (err) {
      console.error('Failed to fetch live data');
    }
  }

  const clearAllUsers = async () => {
    try {
      await fetch('/api/live', { method: 'DELETE' });
      setLiveData({ totalActive: 0, sessions: [] });
    } catch (err) {
      console.error('Failed to clear users');
    }
  }

  const resetDatabase = async () => {
    if (!window.confirm("WARNING: This will completely wipe the ENTIRE Redis database, including all global leaderboards. Are you absolutely sure?")) return;
    try {
      await fetch('/api/live?wipe=all', { method: 'DELETE' });
      setLiveData({ totalActive: 0, sessions: [] });
      setLeaderboard({});
      alert("Database has been completely wiped.");
    } catch (err) {
      console.error('Failed to wipe database');
    }
  }

  useEffect(() => {
    let isActive = true;
    let timerId;

    const pollLive = async () => {
      if (!isActive) return;
      await fetchLiveData();
      if (isActive) timerId = setTimeout(pollLive, 800); // 800ms between completion and next fetch
    };

    const pollLeaderboard = async () => {
      if (!isActive) return;
      await fetchLeaderboard(true);
      if (isActive) timerId = setTimeout(pollLeaderboard, 1200);
    };

    if (view === 'admin') {
      pollLive();
    } else if (view === 'leaderboard') {
      fetchLeaderboard(false).then(() => {
        if (isActive) timerId = setTimeout(pollLeaderboard, 1200);
      });
    }

    return () => {
      isActive = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [view]);



  const fetchLeaderboard = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?t=${Date.now()}`) // Cache-buster
      if (!res.ok) throw new Error('API not available')
      const data = await res.json()
      setLeaderboard(data)
    } catch (err) {
      console.warn('Backend API not found, falling back to LocalStorage')
      const localData = JSON.parse(localStorage.getItem('local_leaderboard') || '{}')
      setLeaderboard(localData)
    } finally {
      if (!isBackground) setIsLoading(false)
    }
  }

  const updateMatchCount = async (id, name = userName) => {
    try {
      if (!name) return;
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userName: name, sessionId: SESSION_ID })
      })
      if (!res.ok) throw new Error('API not available')
    } catch (err) {
      console.warn('Backend API not found, updating LocalStorage')
      const localData = JSON.parse(localStorage.getItem('local_leaderboard') || '{}')
      if (!Array.isArray(localData[id])) localData[id] = [];
      const entry = `${name}::${SESSION_ID}`;
      if (!localData[id].includes(entry)) localData[id].push(entry);
      localStorage.setItem('local_leaderboard', JSON.stringify(localData))
    }
  }

  const calculateSimilarity = (resp) => {
    const scores = MAIN_DATA.map(item => {
      const distance = Math.sqrt(
        item.ans.reduce((sum, val, idx) => sum + Math.pow(resp[idx] - val, 2), 0)
      )
      return { ...item, distance }
    })
    const sorted = scores.sort((a, b) => a.distance - b.distance)
    return sorted[0]
  }

  const handleInputChange = (index, value) => {
    setError('')
    const newResponses = [...responses]
    newResponses[index] = parseInt(value)
    setResponses(newResponses)

    // Update live progress (total answered)
    const answeredCount = newResponses.filter(r => r !== null).length;
    updateLiveProgress(answeredCount);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (responses.includes(null)) {
      setError('Please answer all questions before submitting.')
      return
    }
    const bestMatch = calculateSimilarity(responses)
    setTopMatch(bestMatch)
    setView('result')
    updateLiveProgress(QUESTIONS.length, userName, true) // Mark as completed
    await updateMatchCount(bestMatch.id)
  }

  if (view === 'leaderboard') {
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
          <button className="back-btn" onClick={() => setView('form')}>
            Back to Form
          </button>
        </div>
      </div>
    )
  }

  if (view === 'admin') {
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
            <h3>{QUESTIONS.length}</h3>
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
                const currentProgress = (session.progress / QUESTIONS.length) * 100;
                return (
                  <div key={session.id} className={`session-row ${session.submitted ? 'is-submitted' : ''}`}>
                    <span className="session-id">{session.name}</span>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                    <span className="progress-text">{session.progress}/{QUESTIONS.length}</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="nav-group center" style={{ flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          <button className="leaderboard-btn" onClick={() => {
            fetchLiveData();
          }}>
            Refresh Live View
          </button>

          <button className="back-btn" onClick={clearAllUsers}>
            Clear Tracking View
          </button>
          
          <button className="back-btn" onClick={resetDatabase} style={{ borderColor: 'var(--error, #ff4e4e)', color: 'var(--error, #ff4e4e)', flex: '1 1 100%' }}>
            Factory Reset Database
          </button>
        </div>
      </div>
    )
  }

  if (view === 'nameEntry') {
    return (
      <div className="container name-entry-page">
        <h1>Welcome!</h1>
        <p className="subtitle">Please enter your name to start the similarity form.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={(e) => {
          e.preventDefault()
          if (!userName.trim()) {
            setError('Name is required to begin.')
            return
          }
          setError('')
          updateLiveProgress(0, userName.trim())
          setView('form')
        }}>
          <div className="question-group" style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              className="name-input"
              placeholder="Your Name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="submit-btn" style={{ width: '100%' }}>
            Start form
          </button>
        </form>
      </div>
    )
  }

  if (view === 'result' && topMatch) {
    return (
      <div className="container result-page">
        <h1>Your Top Match</h1>
        <div className="result-card">
          <h2>{topMatch.name}</h2>
          {/* <p className="distance-label">Distance: <strong>{topMatch.distance.toFixed(2)}</strong></p> */}
          <div className="match-details">
            <p>This personality segment most closely aligns with your responses.</p>
          </div>
        </div>
        <div className="nav-group">
          <button className="back-btn" onClick={() => {
            setView('nameEntry')
            setResponses([null, null, null, null, null])
            setUserName('')
          }}>
            Start Over
          </button>

          <button className="leaderboard-btn" onClick={() => {
            setView('leaderboard')
            fetchLeaderboard()
          }}>
            View Leaderboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Similarity Form</h1>
      <p className="subtitle">Answer the questions to find your closest match.</p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {QUESTIONS.map((q, idx) => (
          <div key={idx} className="question-group">
            <label>{q}</label>
            <div className="radio-group">
              {[1, 2, 3, 4, 5].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={val}
                    checked={responses[idx] === val}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="submit-btn">Find My Match</button>
      </form>

      <div className="nav-group center">
        <button className="link-btn" onClick={() => {
          setView('leaderboard')
        }}>
          View Global Leaderboard
        </button>
      </div>
    </div>
  )
}

export default App