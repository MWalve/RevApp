'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function MoodInput() {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('moods')
        .insert([
          {
            mood: mood,
            note: note,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      alert('Mood logged successfully!');
      setMood(5);
      setNote('');
    } catch (error) {
      console.error('Error inserting mood:', error);
      alert('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rate your mood (1-10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
        />
        <div className="text-center mt-2">
          <span className="text-2xl">
            {mood >= 8 ? '🤩' : mood >= 6 ? '😊' : mood >= 4 ? '😐' : mood >= 2 ? '😔' : '😢'}
          </span>
          <span className="ml-2 font-medium">{mood}/10</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Add a note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="How are you feeling today?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Mood'}
      </button>
    </form>
  );
}