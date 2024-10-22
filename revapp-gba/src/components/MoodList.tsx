'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Mood } from '../lib/supabase';

const MoodList: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<Mood[]>([]);

  useEffect(() => {
    const fetchMoods = async () => {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching moods:', error);
        return;
      }

      setMoodEntries(data || []);
    };

    fetchMoods();

    // Set up real-time subscription
    const subscription = supabase
      .channel('moods_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'moods' }, 
        () => {
          fetchMoods();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Mood History</h2>
      <div className="space-y-4">
        {moodEntries.map((entry) => (
          <div key={entry.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Mood: {entry.mood}/10</span>
              <span className="text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleString()}
              </span>
            </div>
            {entry.note && (
              <p className="mt-2 text-gray-600">{entry.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodList;