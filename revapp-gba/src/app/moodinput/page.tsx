'use client';

import Navigation from '../../components/Navigation';
import MoodInput from '../../components/MoodInput';

export default function MoodInputPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Log Your Mood</h1>
        <div className="max-w-md mx-auto">
          <MoodInput />
        </div>
      </main>
    </div>
  );
}