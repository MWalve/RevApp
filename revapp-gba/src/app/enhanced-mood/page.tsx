'use client';

import Navigation from '../../components/Navigation';
import EnhancedMoodInput from '../../components/EnhancedMoodInput';

export default function EnhancedMoodPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Enhanced Mood Assessment</h1>
        <div className="max-w-2xl mx-auto">
          <EnhancedMoodInput />
        </div>
      </main>
    </div>
  );
}