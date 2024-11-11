'use client';

import Navigation from '../../components/Navigation';
import FoodInput from '../../components/FoodInput';

export default function FoodLogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Food Log</h1>
        <div className="max-w-2xl mx-auto">
          <FoodInput />
        </div>
      </main>
    </div>
  );
}