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
  const [topMatch, setTopMatch] = useState(null)
  const [view, setView] = useState('form') // 'form', 'result', 'leaderboard'
  const [error, setError] = useState('')
  const [leaderboard, setLeaderboard] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [liveData, setLiveData] = useState({ totalActive: 0, sessions: [] })

  // Live progress tracking
  const updateLiveProgress = async (prog) => {
    try {
      await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: SESSION_ID, progress: prog })
      });
    } catch (err) {
      console.warn('Live tracking failed, silent error');
    }
  }

  const fetchLiveData = async () => {
    try {
      const res = await fetch('/api/live');
      if (res.ok) {
        const data = await res.json();
        setLiveData(data);
      }
    } catch (err) {
      console.error('Failed to fetch live data');
    }
  }

  useEffect(() => {
    // Report initial progress (0)
    updateLiveProgress(0);
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/leaderboard')
      if (!res.ok) throw new Error('API not available')
      const data = await res.json()
      setLeaderboard(data)
    } catch (err) {
      console.warn('Backend API not found, falling back to LocalStorage')
      const localData = JSON.parse(localStorage.getItem('local_leaderboard') || '{}')
      setLeaderboard(localData)
    } finally {
      setIsLoading(false)
    }
  }

  const updateMatchCount = async (id) => {
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('API not available')
    } catch (err) {
      console.warn('Backend API not found, updating LocalStorage')
      const localData = JSON.parse(localStorage.getItem('local_leaderboard') || '{}')
      localData[id] = (localData[id] || 0) + 1
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
    await updateMatchCount(bestMatch.id)
  }

  if (view === 'leaderboard') {
    return (
      <div className="container leaderboard-page">
        <h1>Global Leaderboard</h1>
        <p className="subtitle">See how many people match with each board member.</p>

        {isLoading ? (
          <p>Loading counts...</p>
        ) : (
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Board Member</th>
                  <th>Matches</th>
                </tr>
              </thead>
              <tbody>
                {MAIN_DATA.map(member => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{leaderboard[member.id] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="nav-group">
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
            {liveData.sessions.map((session, sIdx) => {
              const currentProgress = (session.progress / QUESTIONS.length) * 100;
              return (
                <div key={session.id} className="session-row">
                  <span className="session-id">User {session.id.substring(0, 4)}</span>
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

        <div className="nav-group center">
          <button className="back-btn" onClick={() => setView('form')}>
            Back to Form
          </button>
          <button className="leaderboard-btn" onClick={() => {
            fetchLiveData();
          }}>
            Refresh Live View
          </button>
        </div>
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
            setView('form')
            setResponses([null, null, null, null, null])
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
          fetchLeaderboard()
        }}>
          View Global Leaderboard
        </button>
        <button className="link-btn small" onClick={() => {
          setView('admin')
          fetchLiveData()
        }}>
          Admin Login
        </button>
      </div>
    </div>
  )
}

export default App