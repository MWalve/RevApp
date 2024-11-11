'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface BasicMood {
  id: number;
  mood: number;
  note: string;
  created_at: string;
}

interface EnhancedMood {
  id: string;
  anxiety_level: number;
  energy_level: number;
  mental_clarity: number;
  digestive_comfort: number;
  overall_mood: number;
  notes: string;
  time_of_day: string;
  created_at: string;
  symptoms?: Array<{
    name: string;
    intensity: number;
  }>;
}

interface CombinedMoodEntry {
  id: string | number;
  type: 'basic' | 'enhanced';
  mood?: number;
  overall_mood?: number;
  note?: string;
  notes?: string;
  created_at: string;
  time_of_day?: string;
  anxiety_level?: number;
  energy_level?: number;
  mental_clarity?: number;
  digestive_comfort?: number;
  symptoms?: Array<{
    name: string;
    intensity: number;
  }>;
}

export default function MoodList() {
  const [moodEntries, setMoodEntries] = useState<CombinedMoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoods();

    // Set up real-time subscriptions for both tables
    const basicMoodsChannel = supabase
      .channel('basic-mood-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'moods' }, 
        () => fetchMoods()
      )
      .subscribe();

    const enhancedMoodsChannel = supabase
      .channel('enhanced-mood-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'enhanced_mood_assessments' }, 
        () => fetchMoods()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(basicMoodsChannel);
      supabase.removeChannel(enhancedMoodsChannel);
    };
  }, []);

  const fetchMoods = async () => {
    try {
      // Fetch basic moods
      const { data: basicMoods, error: basicError } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) throw basicError;

      // Fetch enhanced moods with symptoms
      const { data: enhancedMoods, error: enhancedError } = await supabase
        .from('enhanced_mood_assessments')
        .select(`
          *,
          mood_symptoms (
            symptoms (
              name
            ),
            intensity
          )
        `)
        .order('created_at', { ascending: false });

      if (enhancedError) throw enhancedError;

      // Combine and sort all mood entries
      const combinedEntries: CombinedMoodEntry[] = [
        ...(basicMoods || []).map((entry: BasicMood) => ({
          ...entry,
          type: 'basic' as const,
        })),
        ...(enhancedMoods || []).map((entry: EnhancedMood) => ({
          ...entry,
          type: 'enhanced' as const,
        }))
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setMoodEntries(combinedEntries);
    } catch (error) {
      console.error('Error fetching moods:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading mood history...</div>;
  }

  const getEmojiForMood = (mood: number) => {
    if (mood >= 8) return '🤩';
    if (mood >= 6) return '😊';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  return (
    <div className="space-y-4">
      {moodEntries.length === 0 ? (
        <p className="text-gray-500 text-center">No mood entries yet.</p>
      ) : (
        moodEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getEmojiForMood(entry.type === 'basic' ? entry.mood! : entry.overall_mood!)}
                  </span>
                  {entry.type === 'basic' ? (
                    <span className="font-medium">Mood: {entry.mood}/10</span>
                  ) : (
                    <div className="space-y-1">
                      <span className="font-medium">Overall Mood: {entry.overall_mood}/10</span>
                      <div className="text-sm text-gray-600">
                        <div>Anxiety: {entry.anxiety_level}/10</div>
                        <div>Energy: {entry.energy_level}/10</div>
                        <div>Mental Clarity: {entry.mental_clarity}/10</div>
                        <div>Digestive Comfort: {entry.digestive_comfort}/10</div>
                      </div>
                    </div>
                  )}
                </div>
                {entry.symptoms && entry.symptoms.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Symptoms: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.symptoms.map((symptom, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs"
                        >
                          {symptom.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <time className="text-sm text-gray-500">
                  {new Date(entry.created_at).toLocaleString()}
                </time>
                {entry.time_of_day && (
                  <div className="text-sm text-gray-500 mt-1">
                    {entry.time_of_day}
                  </div>
                )}
              </div>
            </div>
            {(entry.note || entry.notes) && (
              <p className="text-gray-600 mt-2">{entry.note || entry.notes}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}