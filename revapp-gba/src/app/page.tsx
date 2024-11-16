'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mind-Gut Wellness Tracker
          </h1>
          <p className="text-xl text-blue-100">
            Track your mood, diet, and discover their connections
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track Entry Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Track Your Day</h2>
            <div className="space-y-4">
              <Link 
                href="/enhanced-mood"
                className="block w-full bg-blue-500 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
              >
                🧠 Log Mood & Symptoms
              </Link>
              <Link 
                href="/food-log"
                className="block w-full bg-green-500 text-white py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors"
              >
                🍽️ Log Meal or Snack
              </Link>
            </div>
          </div>

          {/* View History Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">View Insights</h2>
            <div className="space-y-4">
              <Link 
                href="/mood-history"
                className="block w-full bg-purple-500 text-white py-3 px-4 rounded-lg text-center hover:bg-purple-600 transition-colors"
              >
                📊 Mood History
              </Link>
              <Link 
                href="/food-history"
                className="block w-full bg-yellow-500 text-white py-3 px-4 rounded-lg text-center hover:bg-yellow-600 transition-colors"
              >
                📝 Food Journal
              </Link>
              <Link 
                href="/dashboard"
                className="block w-full bg-indigo-500 text-white py-3 px-4 rounded-lg text-center hover:bg-indigo-600 transition-colors"
              >
                🔍 Analysis Dashboard
              </Link>
            </div>
          </div>

          {/* Quick Stats Preview (optional) */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Today's Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Last Mood</div>
                <div className="text-2xl font-semibold text-blue-600">😊</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Last Meal</div>
                <div className="text-2xl font-semibold">🍽️</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Gut Health</div>
                <div className="text-2xl font-semibold">💚</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Entries Today</div>
                <div className="text-2xl font-semibold text-blue-600">3</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}