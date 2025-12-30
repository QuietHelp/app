import { useState, useEffect } from 'react';
import Home from './components/Home';
import MoodSelect from './components/MoodSelect';
import Matching from './components/Matching';
import ChatRoom from './components/ChatRoom';

type AppState = 'home' | 'mood-select' | 'matching' | 'chat';
type MatchData = { roomId: string; peerSessionId: string } | null;

function App() {
  const [state, setState] = useState<AppState>('home');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<MatchData>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  const handleStart = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      localStorage.setItem('sessionId', data.sessionId);
      setState('mood-select');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleMoodSelected = (mood: string) => {
    setSelectedMood(mood);
    setState('matching');
  };

  const handleMatchFound = (data: MatchData) => {
    setMatchData(data);
    setState('chat');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {state === 'home' && <Home onStart={handleStart} />}
      {state === 'mood-select' && sessionId && (
        <MoodSelect sessionId={sessionId} onMoodSelected={handleMoodSelected} />
      )}
      {state === 'matching' && sessionId && selectedMood && (
        <Matching
          sessionId={sessionId}
          mood={selectedMood}
          onMatchFound={handleMatchFound}
        />
      )}
      {state === 'chat' && sessionId && matchData && (
        <ChatRoom sessionId={sessionId} matchData={matchData} />
      )}
    </div>
  );
}

export default App;

