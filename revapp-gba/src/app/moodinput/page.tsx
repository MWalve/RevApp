'use client';

import MoodInput from '../../components/MoodInput';

export default function MoodInputPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Log Your Mood</h1>
      <MoodInput />
    </div>
  );
}