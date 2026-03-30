import { useState, useEffect } from 'react';

const SESSION_ID = Math.random().toString(36).substring(2, 10);

export function useVercelDatabase(view, userName) {
  const [leaderboard, setLeaderboard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [liveData, setLiveData] = useState({ totalActive: 0, sessions: [] });

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

  const fetchLeaderboard = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?t=${Date.now()}`); // Cache-buster
      if (!res.ok) throw new Error('API not available');
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.warn('Backend API not found, falling back to LocalStorage');
      const localData = JSON.parse(localStorage.getItem('local_leaderboard') || '{}');
      setLeaderboard(localData);
    } finally {
      if (!isBackground) setIsLoading(false);
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

  const updateMatchCount = async (id, name = userName) => {
    try {
      if (!name) return;
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userName: name, sessionId: SESSION_ID })
      });
      if (!res.ok) throw new Error('API not available');
    } catch (err) {
      console.warn('Backend API not found, updating LocalStorage');
      const localData = JSON.parse(localStorage.getItem('local_leaderboard') || '{}');
      if (!Array.isArray(localData[id])) localData[id] = [];
      const entry = `${name}::${SESSION_ID}`;
      if (!localData[id].includes(entry)) localData[id].push(entry);
      localStorage.setItem('local_leaderboard', JSON.stringify(localData));
    }
  }

  return {
    leaderboard,
    isLoading,
    liveData,
    updateLiveProgress,
    fetchLiveData,
    clearAllUsers,
    resetDatabase,
    updateMatchCount
  };
}
