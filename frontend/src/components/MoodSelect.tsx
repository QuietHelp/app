import { useState } from 'react';

interface MoodSelectProps {
  sessionId: string;
  onMoodSelected: (mood: string) => void;
}

const MOODS = ['STRESS', 'LONELY', 'BURNOUT', 'PANIC', 'OTHER'];

export default function MoodSelect({ onMoodSelected }: MoodSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>How are you feeling?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => {
              setSelected(mood);
              onMoodSelected(mood);
            }}
            style={{
              padding: '1rem',
              fontSize: '1rem',
              backgroundColor: selected === mood ? '#007bff' : 'white',
              color: selected === mood ? 'white' : '#333',
              border: '2px solid #007bff',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}

