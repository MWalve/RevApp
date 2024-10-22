'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const MoodInput: React.FC = () => {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('moods')
        .insert([
          { mood, note }
        ])
        .select();

      if (error) throw error;

      alert('Mood saved successfully!');
      setMood(5);
      setNote('');
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Failed to save mood. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="mood" className="block text-sm font-medium">
          Rate your mood (1-10):
        </label>
        <input
          type="range"
          id="mood"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full"
        />
        <span className="block text-lg font-bold">{mood}</span>
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium">
          Add a note (optional):
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border p-2"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Log Mood
      </button>
    </form>
  );
};

export default MoodInput;