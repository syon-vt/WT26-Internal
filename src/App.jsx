import QuizForm from './components/QuizForm'
import F1 from './components/f1'
import { useState, useCallback } from 'react'
import './App.css'
import { useVercelDatabase } from './hooks/useVercelDatabase'
import AdminDashboard from './components/AdminDashboard'
import Leaderboard from './components/Leaderboard1'
import { MAIN_DATA, QUESTIONS } from './constants'
import ResultCard from './components/ResultCard'
import CreepySlide from './components/CreepySlide'
import WandCursor from './components/WandCursor'
import SlideTransition from './components/SlideTransition'

function App() {
  const [responses, setResponses] = useState(new Array(20).fill(null))
  const [userName, setUserName] = useState('')
  const [topMatch, setTopMatch] = useState(null)
  const [view, setView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'f1'
  })
  const [error, setError] = useState('')
  const [expandedMemberId, setExpandedMemberId] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [pendingView, setPendingView] = useState(null)
  const [pendingExtra, setPendingExtra] = useState(null)

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

  const goTo = useCallback((nextView, extra) => {
    setPendingView(nextView)
    setPendingExtra(extra || null)
    setTransitioning(true)
  }, [])

  const handleTransitionDone = useCallback(() => {
    if (pendingExtra) {
      if (pendingExtra.userName) setUserName(pendingExtra.userName)
      if (pendingExtra.responses) setResponses(pendingExtra.responses)
      if (pendingExtra.topMatch) setTopMatch(pendingExtra.topMatch)
    }
    setView(pendingView)
    setTransitioning(false)
    setPendingView(null)
    setPendingExtra(null)
  }, [pendingView, pendingExtra])

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
    updateLiveProgress(QUESTIONS.length, userName, true)
    await updateMatchCount(bestMatch.id)
    goTo('result', { topMatch: bestMatch })
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

  return (
    <>
      <WandCursor />

      {transitioning && (
        <SlideTransition onDone={handleTransitionDone} />
      )}

      {view === 'f1' && (
        <F1 onFinish={() => goTo('creepy')} />
      )}

      {view === 'creepy' && (
        <CreepySlide
          onFinish={(name) => {
            updateLiveProgress(0, name)
            goTo('form', { userName: name })
          }}
        />
      )}

      {view === 'form' && (
        <QuizForm
          QUESTIONS={QUESTIONS}
          responses={responses}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmit}
          error={error}
          onViewLeaderboard={() => goTo('leaderboard')}
        />
      )}

      {view === 'result' && topMatch && (
        <ResultCard
          topMatch={topMatch}
          onStartOver={() => {
            goTo('f1', {
              responses: new Array(20).fill(null),
              userName: '',
            })
          }}
          onViewLeaderboard={() => goTo('leaderboard')}
        />
      )}

      {view === 'leaderboard' && (
        <Leaderboard
          MAIN_DATA={MAIN_DATA}
          leaderboard={leaderboard || {}}
          isLoading={isLoading}
          expandedMemberId={expandedMemberId}
          setExpandedMemberId={setExpandedMemberId}
          onBack={() => goTo('form')}
        />
      )}
    </>
  )
}

export default App
