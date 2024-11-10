'use client';

import Navigation from '../../components/Navigation';
import MoodList from '../../components/MoodList';

export default function MoodHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mood History</h1>
        <div className="max-w-2xl mx-auto">
          <MoodList />
        </div>
      </main>
    </div>
  );
}