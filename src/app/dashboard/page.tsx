'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navigation from '../../components/Navigation';
import GutBrainChat from '@/components/GutBrainChat';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

    // Fetch correlations and mood trends independently so one failing
    // (e.g. get_mood_correlations not set up yet) doesn't block the other.
    try {
      const { data: corrData, error: corrError } = await supabase
        .rpc('get_mood_correlations', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        });

      if (corrError) throw corrError;
      setCorrelations(corrData || []);
    } catch (err) {
      console.error('Error fetching correlations:', err);
      setCorrelations([]);
    }

    try {
      const { data: moodData, error: moodError } = await supabase
        .from('enhanced_mood_assessments')
        .select('created_at, overall_mood, mental_clarity, digestive_comfort')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (moodError) throw moodError;

      const trends = moodData?.map(entry => ({
        date: new Date(entry.created_at).toLocaleDateString(),
        overall_mood: entry.overall_mood,
        mental_clarity: entry.mental_clarity,
        digestive_comfort: entry.digestive_comfort
      })) || [];

      setMoodTrends(trends);
    } catch (err) {
      console.error('Error fetching mood trends:', err);
      setMoodTrends([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'secondary'}
                onClick={() => setDateRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Chat Dialog */}
        <div className="mb-8">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Ask AI Assistant
            </DialogTrigger>
            <DialogContent className="max-w-[800px] h-[600px]">
              <div className="h-full">
                <GutBrainChat />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading dashboard data...</div>
        ) : (
          <div className="space-y-8">
            {/* Mood Trends Chart */}
            <div className="bg-card p-6 rounded-lg ring-1 ring-foreground/10">
              <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis domain={[0, 10]} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        borderColor: 'var(--border)',
                        color: 'var(--popover-foreground)',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="overall_mood" stroke="var(--chart-1)" name="Overall Mood" />
                    <Line type="monotone" dataKey="mental_clarity" stroke="var(--chart-2)" name="Mental Clarity" />
                    <Line type="monotone" dataKey="digestive_comfort" stroke="var(--chart-3)" name="Digestive Comfort" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Food-Mood Correlations */}
            <div className="bg-card p-6 rounded-lg ring-1 ring-foreground/10">
              <h2 className="text-xl font-semibold mb-4">Food-Mood Correlations</h2>
              {correlations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No correlation data yet — log a few more meals and moods to see patterns here.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {correlations.map((corr) => (
                    <div
                      key={corr.food_category}
                      className="p-4 border border-border rounded-lg"
                    >
                      <h3 className="font-semibold">{corr.food_category}</h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>Average Mood: {corr.avg_mood.toFixed(1)}/10</p>
                        <p>Digestive Comfort: {corr.avg_digestive_comfort.toFixed(1)}/10</p>
                        <p>Mental Clarity: {corr.avg_mental_clarity.toFixed(1)}/10</p>
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground">Correlation Strength</div>
                          <div className="h-2 bg-muted rounded overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${Math.abs(corr.correlation_strength) * 100}%`,
                                backgroundColor: corr.correlation_strength > 0 ? 'var(--chart-2)' : 'var(--destructive)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}