'use client';

import Navigation from '../../components/Navigation';
import FoodHistory from '../../components/FoodHistory';

export default function FoodHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Food History</h1>
        <div className="max-w-4xl mx-auto">
          <FoodHistory />
        </div>
      </main>
    </div>
  );
}