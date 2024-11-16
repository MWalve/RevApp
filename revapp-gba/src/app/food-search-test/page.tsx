'use client';

import Navigation from '../../components/Navigation';
import FoodSearch from '../../components/FoodSearch';

export default function FoodSearchTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Food Search Test</h1>
        <FoodSearch />
      </main>
    </div>
  );
}