'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MoodEntry {
  id: number;
  mood: number;
  note: string;
  created_at: string;
}

export default function MoodList() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoods();

    // Set up real-time subscription
    const channel = supabase
      .channel('mood-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'moods' }, 
        () => {
          fetchMoods();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMoods = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading mood history...</div>;
  }

  return (
    <div className="space-y-4">
      {moodEntries.length === 0 ? (
        <p className="text-gray-500 text-center">No mood entries yet.</p>
      ) : (
        moodEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {entry.mood >= 8 ? '🤩' : 
                   entry.mood >= 6 ? '😊' : 
                   entry.mood >= 4 ? '😐' : 
                   entry.mood >= 2 ? '😔' : '😢'}
                </span>
                <span className="font-medium">Mood: {entry.mood}/10</span>
              </div>
              <time className="text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleString()}
              </time>
            </div>
            {entry.note && (
              <p className="text-gray-600 mt-2">{entry.note}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}