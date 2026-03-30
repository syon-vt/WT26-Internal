import React from 'react';

const QuizForm = ({ QUESTIONS, responses, handleInputChange, onSubmit, error, onViewLeaderboard }) => {
  return (
    <div className="container">
      <h1>Similarity Form</h1>
      <p className="subtitle">Answer the questions to find your closest match.</p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={onSubmit}>
        {QUESTIONS.map((q, idx) => (
          <div key={idx} className="question-group">
            <label>{q.text}</label>
            <div className="radio-group-wrapper">
              <span className="likert-label min">{q.minLabel}</span>
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
              <span className="likert-label max">{q.maxLabel}</span>
            </div>
          </div>
        ))}
        <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>Find My Match</button>
      </form>

      <div className="nav-group center">
        <button type="button" className="link-btn" onClick={onViewLeaderboard}>
          View Global Leaderboard
        </button>
      </div>
    </div>
  );
};

export default QuizForm;
