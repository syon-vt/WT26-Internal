import { useVercelDatabase } from './hooks/useVercelDatabase'
import AdminDashboard from './components/AdminDashboard'
import Leaderboard from './components/Leaderboard'
import { MAIN_DATA, QUESTIONS } from './constants'
import ResultCard from './components/ResultCard'
import NameEntry from './components/NameEntry'
import QuizForm from './components/QuizForm'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [responses, setResponses] = useState([null, null, null, null, null])
  const [userName, setUserName] = useState('')
  const [topMatch, setTopMatch] = useState(null)
  const [view, setView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'nameEntry'
  })
  const [error, setError] = useState('')
  const [expandedMemberId, setExpandedMemberId] = useState(null)

  const {
    leaderboard,
    isLoading,
    liveData,
    updateLiveProgress,
    fetchLiveData,
    clearAllUsers,
    resetDatabase,
    updateMatchCount
  } = useVercelDatabase(view, userName)

  const calculateSimilarity = (resp) => {
    const scores = MAIN_DATA.map(item => {
      const distance = Math.sqrt(
        item.ans.reduce((sum, val, idx) => sum + (QUESTIONS[idx].weight * Math.pow(resp[idx] - val, 2)), 0)
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
      <Leaderboard
        MAIN_DATA={MAIN_DATA}
        leaderboard={leaderboard}
        isLoading={isLoading}
        expandedMemberId={expandedMemberId}
        setExpandedMemberId={setExpandedMemberId}
        onBack={() => setView('form')}
      />
    );
  }

  if (view === 'admin') {
    return (
      <AdminDashboard
        liveData={liveData}
        QUESTIONS_LENGTH={QUESTIONS.length}
        onRefresh={() => fetchLiveData()}
        onClearUsers={clearAllUsers}
        onResetDatabase={resetDatabase}
      />
    );
  }

  if (view === 'nameEntry') {
    return (
      <NameEntry
        userName={userName}
        setUserName={setUserName}
        error={error}
        setError={setError}
        onStart={(name) => {
          updateLiveProgress(0, name);
          setView('form');
        }}
      />
    );
  }

  if (view === 'result' && topMatch) {
    return (
      <ResultCard
        topMatch={topMatch}
        onStartOver={() => {
          setView('nameEntry');
          setResponses([null, null, null, null, null]);
          setUserName('');
        }}
        onViewLeaderboard={() => {
          setView('leaderboard');
        }}
      />
    );
  }

  return (
    <QuizForm
      QUESTIONS={QUESTIONS}
      responses={responses}
      handleInputChange={handleInputChange}
      onSubmit={handleSubmit}
      error={error}
      onViewLeaderboard={() => setView('leaderboard')}
    />
  );
}

export default App