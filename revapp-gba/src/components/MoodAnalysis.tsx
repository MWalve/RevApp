// components/MoodAnalysis.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function MoodAnalysis() {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [moodData, setMoodData] = useState<any>(null);

  // Fetch user's mood and food data
  useEffect(() => {
    async function fetchData() {
      try {
        // Get mood assessments
        const { data: enhancedMoods, error: moodError } = await supabase
          .from('enhanced_mood_assessments')
          .select('*')
          .order('created_at', { ascending: false });

        // Get food logs
        const { data: foodLogs, error: foodError } = await supabase
          .from('food_logs')
          .select(`
            *,
            food_item (
              name,
              nutrition_data
            )
          `)
          .order('consumed_at', { ascending: false });

        if (moodError || foodError) throw moodError || foodError;

        setMoodData({
          moods: enhancedMoods,
          foods: foodLogs
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function getMoodInsights() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "How does my diet affect my mood?",
          user_data: moodData
        })
      });
      
      const data = await response.json();
      setAnalysis(data.insights);
    } catch (error) {
      console.error('Error getting insights:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mood & Diet Analysis</h2>
      
      <button 
        onClick={getMoodInsights}
        disabled={!moodData || isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Mood-Diet Connection'}
      </button>

      {analysis && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Analysis Results:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}