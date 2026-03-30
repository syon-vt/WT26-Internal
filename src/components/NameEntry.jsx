import React from 'react';

const NameEntry = ({ userName, setUserName, error, setError, onStart }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Name is required to begin.');
      return;
    }
    setError('');
    onStart(userName.trim());
  };

  return (
    <div className="container name-entry-page">
      <h1>Welcome!</h1>
      <p className="subtitle">Please enter your name to start the similarity form.</p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
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
  );
};

export default NameEntry;
