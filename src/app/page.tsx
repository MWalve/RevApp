'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, Utensils, BarChart3, BookOpen, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodService, type EnhancedMoodEntry } from '@/services/moodService';
import { FoodService } from '@/services/foodService';

interface TodayOverview {
  lastMood: EnhancedMoodEntry | null;
  lastMealType: string | null;
  entriesToday: number;
}

const MOOD_EMOJI = ['😞', '😕', '😐', '🙂', '😊'];

function moodToEmoji(score?: number) {
  if (!score) return '—';
  const index = Math.min(4, Math.max(0, Math.round((score / 10) * 4)));
  return MOOD_EMOJI[index];
}

export default function Home() {
  const [overview, setOverview] = useState<TodayOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [lastMood, moodStats, foodSummary] = await Promise.all([
          MoodService.getLatestMood(),
          MoodService.getMoodStats(today, tomorrow),
          FoodService.getTodaySummary(),
        ]);

        setOverview({
          lastMood,
          lastMealType: foodSummary.logs[0]?.meal_type ?? null,
          entriesToday: moodStats.count + foodSummary.totalMeals,
        });
      } catch (err) {
        console.error('Failed to load today overview:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">gutSync</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect your mind and body
          </h1>
          <p className="text-lg text-muted-foreground">
            Track mood, food, and symptoms to understand your gut-brain connection.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Day</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/enhanced-mood"
                className="flex items-center gap-2 w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg justify-center hover:opacity-90 transition-opacity"
              >
                <Brain className="h-4 w-4" />
                Log Mood & Symptoms
              </Link>
              <Link
                href="/food-log"
                className="flex items-center gap-2 w-full bg-accent text-accent-foreground py-3 px-4 rounded-lg justify-center hover:opacity-90 transition-opacity"
              >
                <Utensils className="h-4 w-4" />
                Log Meal or Snack
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/mood-history"
                className="flex items-center gap-2 w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg justify-center hover:opacity-90 transition-opacity"
              >
                <BarChart3 className="h-4 w-4" />
                Mood History
              </Link>
              <Link
                href="/food-history"
                className="flex items-center gap-2 w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg justify-center hover:opacity-90 transition-opacity"
              >
                <BookOpen className="h-4 w-4" />
                Food Journal
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg justify-center hover:opacity-90 transition-opacity"
              >
                <Heart className="h-4 w-4" />
                Analysis Dashboard
              </Link>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground">Last Mood</div>
                  <div className="text-2xl font-semibold mt-1">
                    {loading ? '…' : moodToEmoji(overview?.lastMood?.overall_mood)}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground">Last Meal</div>
                  <div className="text-lg font-semibold mt-1 capitalize">
                    {loading ? '…' : overview?.lastMealType ?? 'None yet'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground">Digestive Comfort</div>
                  <div className="text-2xl font-semibold mt-1">
                    {loading
                      ? '…'
                      : overview?.lastMood?.digestive_comfort
                        ? `${overview.lastMood.digestive_comfort}/10`
                        : '—'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground">Entries Today</div>
                  <div className="text-2xl font-semibold mt-1">
                    {loading ? '…' : overview?.entriesToday ?? 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
