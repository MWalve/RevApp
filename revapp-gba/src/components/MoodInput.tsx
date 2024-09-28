import React, { useState } from 'react';

const MoodInput: React.FC = () => {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, note }),
      });
      if (response.ok) {
        setMood(5);
        setNote('');
        alert('Mood logged successfully!');
      } else {
        throw new Error('Failed to log mood');
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      alert('Failed to log mood. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
          Rate your mood (1-10):
        </label>
        <input
          type="range"
          id="mood"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="mt-1 block w-full"
        />
        <span className="text-lg font-bold">{mood}</span>
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
          Add a note (optional):
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={3}
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Log Mood
      </button>
    </form>
  );
};

export default MoodInput;