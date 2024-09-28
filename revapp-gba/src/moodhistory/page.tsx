'use client';

import { useEffect, useState } from 'react';
import MoodList from '../components/MoodList';

export default function MoodHistoryPage() {
  const [moodEntries, setMoodEntries] = useState([]);

  useEffect(() => {
    fetch('/api/moods')
      .then(response => response.json())
      .then(data => setMoodEntries(data))
      .catch(error => console.error('Error fetching mood entries:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mood History</h1>
      <MoodList moodEntries={moodEntries} />
    </div>
  );
}