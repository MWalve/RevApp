'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navigation from '../../components/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CorrelationData {
  food_category: string;
  avg_mood: number;
  avg_digestive_comfort: number;
  avg_mental_clarity: number;
  correlation_strength: number;
}

interface MoodTrend {
  date: string;
  overall_mood: number;
  mental_clarity: number;
  digestive_comfort: number;
}

export default function DashboardPage() {
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // 'week' | 'month' | 'year'

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  async function fetchData() {
    setLoading(true);
    try {
      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      // Fetch correlations
      const { data: corrData, error: corrError } = await supabase
        .rpc('get_mood_correlations', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        });

      if (corrError) throw corrError;
      setCorrelations(corrData || []);

      // Fetch mood trends
      const { data: moodData, error: moodError } = await supabase
        .from('enhanced_mood_assessments')
        .select('created_at, overall_mood, mental_clarity, digestive_comfort')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (moodError) throw moodError;
      
      // Process mood data for the chart
      const trends = moodData?.map(entry => ({
        date: new Date(entry.created_at).toLocaleDateString(),
        overall_mood: entry.overall_mood,
        mental_clarity: entry.mental_clarity,
        digestive_comfort: entry.digestive_comfort
      })) || [];

      setMoodTrends(trends);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded ${
                  dateRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading dashboard data...</div>
        ) : (
          <div className="space-y-8">
            {/* Mood Trends Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="overall_mood" stroke="#8884d8" name="Overall Mood" />
                    <Line type="monotone" dataKey="mental_clarity" stroke="#82ca9d" name="Mental Clarity" />
                    <Line type="monotone" dataKey="digestive_comfort" stroke="#ffc658" name="Digestive Comfort" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Food-Mood Correlations */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Food-Mood Correlations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {correlations.map((corr) => (
                  <div
                    key={corr.food_category}
                    className="p-4 border rounded-lg"
                  >
                    <h3 className="font-semibold">{corr.food_category}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Average Mood: {corr.avg_mood.toFixed(1)}/10</p>
                      <p>Digestive Comfort: {corr.avg_digestive_comfort.toFixed(1)}/10</p>
                      <p>Mental Clarity: {corr.avg_mental_clarity.toFixed(1)}/10</p>
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">Correlation Strength</div>
                        <div className="h-2 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${Math.abs(corr.correlation_strength) * 100}%`,
                              backgroundColor: corr.correlation_strength > 0 ? '#4CAF50' : '#f44336'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}