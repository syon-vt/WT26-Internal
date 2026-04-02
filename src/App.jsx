import QuizForm from './components/QuizForm'
import F1 from './components/f1'
import { useState } from 'react'
import './App.css'
import { useVercelDatabase } from './hooks/useVercelDatabase'
import AdminDashboard from './components/AdminDashboard'
import Leaderboard from './components/Leaderboard1'
import { MAIN_DATA, QUESTIONS } from './constants'
import ResultCard from './components/ResultCard'
import CreepySlide from './components/CreepySlide'

function App() {
  const [responses, setResponses] = useState(new Array(20).fill(null))
  const [userName, setUserName] = useState('')
  const [topMatch, setTopMatch] = useState(null)

  const [view, setView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'f1'
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
      const distance = item.ans.reduce((sum, val, idx) => {
        return sum + (QUESTIONS[idx].weight * Math.abs(resp[idx] - val));
      }, 0);
      return { ...item, distance };
    });
    const sorted = scores.sort((a, b) => a.distance - b.distance);
    return sorted[0];
  }

  const handleInputChange = (index, value) => {
    setError('')
    const newResponses = [...responses]
    newResponses[index] = parseInt(value)
    setResponses(newResponses)

    const answeredCount = newResponses.filter(r => r !== null).length
    updateLiveProgress(answeredCount)
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

    updateLiveProgress(QUESTIONS.length, userName, true)
    await updateMatchCount(bestMatch.id)
  }

  if (view === 'f1') {
    return <F1 onFinish={() => setView('creepy')} />
  }

  if (view === 'creepy') {
    return (
      <CreepySlide
        onFinish={(name) => {
          setUserName(name)
          updateLiveProgress(0, name)
          setView('form')
        }}
      />
    )
  }

  if (view === 'form') {
    return (
      <QuizForm
        QUESTIONS={QUESTIONS}
        responses={responses}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        onViewLeaderboard={() => setView('leaderboard')}
      />
    )
  }

  if (view === 'result' && topMatch) {
    return (
      <ResultCard
        topMatch={topMatch}
        onStartOver={() => {
          setResponses(new Array(20).fill(null))
          setUserName('')
          setView('f1')
        }}
        onViewLeaderboard={() => setView('leaderboard')}
      />
    )
  }

  if (view === 'leaderboard') {
    return (
      <Leaderboard
        MAIN_DATA={MAIN_DATA}
        leaderboard={leaderboard || {}}
        isLoading={isLoading}
        expandedMemberId={expandedMemberId}
        setExpandedMemberId={setExpandedMemberId}
        onBack={() => setView('form')}
      />
    )
  }

  if (view === 'admin') {
    return (
      <AdminDashboard
        liveData={liveData}
        QUESTIONS_LENGTH={QUESTIONS.length}
        onRefresh={fetchLiveData}
        onClearUsers={clearAllUsers}
        onResetDatabase={resetDatabase}
      />
    )
  }

  return null
}

export default App