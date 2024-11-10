'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Symptom {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface MoodData {
  anxiety_level: number;
  energy_level: number;
  mental_clarity: number;
  digestive_comfort: number;
  overall_mood: number;
  notes: string;
  time_of_day: string;
  selectedSymptoms: string[]; 
}

const TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Morning' },
  { value: 'afternoon', label: '☀️ Afternoon' },
  { value: 'evening', label: '🌆 Evening' },
  { value: 'night', label: '🌙 Night' }
];

const MOOD_METRICS = [
  { id: 'anxiety_level', label: 'Anxiety Level', icon: '😰', description: 'Rate your current anxiety level' },
  { id: 'energy_level', label: 'Energy Level', icon: '⚡', description: 'How energetic do you feel?' },
  { id: 'mental_clarity', label: 'Mental Clarity', icon: '🧠', description: 'How clear is your thinking?' },
  { id: 'digestive_comfort', label: 'Digestive Comfort', icon: '🫃', description: 'Rate your digestive comfort' },
  { id: 'overall_mood', label: 'Overall Mood', icon: '😊', description: 'Your overall mood right now' }
];

export default function EnhancedMoodInput() {
  const [moodData, setMoodData] = useState<MoodData>({
    anxiety_level: 5,
    energy_level: 5,
    mental_clarity: 5,
    digestive_comfort: 5,
    overall_mood: 5,
    notes: '',
    time_of_day: getCurrentTimeOfDay(),
    selectedSymptoms: []
  });

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  function getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  async function fetchSymptoms() {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .order('name');

      if (error) throw error;
      setSymptoms(data || []);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
      setError('Failed to load symptoms');
    }
  }

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, insert the mood assessment without the symptoms
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('enhanced_mood_assessments')
        .insert([{
          anxiety_level: moodData.anxiety_level,
          energy_level: moodData.energy_level,
          mental_clarity: moodData.mental_clarity,
          digestive_comfort: moodData.digestive_comfort,
          overall_mood: moodData.overall_mood,
          notes: moodData.notes,
          time_of_day: moodData.time_of_day,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (assessmentError) {
        console.error('Error saving mood assessment:', assessmentError);
        throw assessmentError;
      }

      // If we have symptoms and the mood assessment was saved successfully,
      // save the symptoms in the junction table
      if (moodData.selectedSymptoms.length > 0 && assessmentData?.id) {
        const symptomInserts = moodData.selectedSymptoms.map(symptomId => ({
          mood_assessment_id: assessmentData.id,
          symptom_id: symptomId,
          intensity: 3 // Default intensity
        }));

        const { error: symptomsError } = await supabase
          .from('mood_symptoms')
          .insert(symptomInserts);

        if (symptomsError) {
          console.error('Error saving symptoms:', symptomsError);
          throw symptomsError;
        }
      }

      setSuccess(true);
      // Reset form
      setMoodData({
        anxiety_level: 5,
        energy_level: 5,
        mental_clarity: 5,
        digestive_comfort: 5,
        overall_mood: 5,
        notes: '',
        time_of_day: getCurrentTimeOfDay(),
        selectedSymptoms: []
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving mood assessment:', err);
      setError('Failed to save mood assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the symptom toggle handler
  const toggleSymptom = (symptomId: string) => {
    setMoodData(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptomId)
        ? prev.selectedSymptoms.filter(id => id !== symptomId)
        : [...prev.selectedSymptoms, symptomId]
    }));
  };


 return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {/* Time of Day Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Time of Day</label>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMoodData(prev => ({ ...prev, time_of_day: value }))}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                moodData.time_of_day === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Metrics */}
      {/* Mood Metrics */}
      {MOOD_METRICS.map(({ id, label, icon, description }) => (
        <div key={id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {icon} {label}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={moodData[id as keyof MoodData] as number}
              onChange={(e) => setMoodData(prev => ({
                ...prev,
                [id]: parseInt(e.target.value)
              }))}
              className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium w-16 text-center">
              {moodData[id as keyof MoodData]}/10
            </span>
          </div>
        </div>
      ))}

      {/* Symptoms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Symptoms</label>
        <div className="flex flex-wrap gap-2">
          {symptoms.map(symptom => (
            <button
              key={symptom.id}
              type="button"
              onClick={() => toggleSymptom(symptom.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                moodData.selectedSymptoms.includes(symptom.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {symptom.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          value={moodData.notes}
          onChange={(e) => setMoodData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes about how you're feeling..."
          className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Mood assessment saved successfully!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Saving...' : 'Save Assessment'}
      </button>
    </form>
  );
}