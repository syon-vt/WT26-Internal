import { useState } from 'react'
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
  { id: 10, name: "J", ans: [3, 5, 3, 1, 5] }
]

const QUESTIONS = [
  "How much do you enjoy working in a team?",
  "How often do you prefer remote work over office work?",
  "How much do you value technical excellence over delivery speed?",
  "How interested are you in learning new technologies?",
  "How much do you prioritize career growth over work-life balance?"
]

function App() {
  const [responses, setResponses] = useState([3, 3, 3, 3, 3])
  const [topMatch, setTopMatch] = useState(null)
  const [view, setView] = useState('form') // 'form' or 'result'

  const calculateSimilarity = (resp) => {
    const scores = MAIN_DATA.map(item => {
      const distance = Math.sqrt(
        item.ans.reduce((sum, val, idx) => sum + Math.pow(resp[idx] - val, 2), 0)
      )
      return { ...item, distance }
    })
    // Sort and get the one with the least distance
    const sorted = scores.sort((a, b) => a.distance - b.distance)
    return sorted[0]
  }

  const handleInputChange = (index, value) => {
    const newResponses = [...responses]
    newResponses[index] = parseInt(value)
    setResponses(newResponses)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const bestMatch = calculateSimilarity(responses)
    setTopMatch(bestMatch)
    setView('result')
  }

  if (view === 'result' && topMatch) {
    return (
      <div className="container result-page">
        <h1>Your Top Match</h1>
        <div className="result-card">
          <h2>{topMatch.name}</h2>
          <p className="distance-label">Distance: <strong>{topMatch.distance.toFixed(2)}</strong></p>
          <div className="match-details">
            <p>This personality segment most closely aligns with your responses.</p>
          </div>
        </div>
        <button className="back-btn" onClick={() => setView('form')}>
          Back to Form
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Similarity Form</h1>
      <p className="subtitle">Answer the boilerplate questions to find your closest match.</p>
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
    </div>
  )
}

export default App
