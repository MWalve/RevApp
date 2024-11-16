'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-slate-900">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            gutSync
          </h1>
          <p className="text-lg text-slate-300">
            Connect your mind and body through mindful tracking
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track Entry Card */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-semibold mb-4 text-white">Track Your Day</h2>
            <div className="space-y-4">
              <Link 
                href="/enhanced-mood"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center hover:bg-indigo-700 transition-colors"
              >
                🧠 Log Mood & Symptoms
              </Link>
              <Link 
                href="/food-log"
                className="block w-full bg-emerald-600 text-white py-3 px-4 rounded-lg text-center hover:bg-emerald-700 transition-colors"
              >
                🍽️ Log Meal or Snack
              </Link>
            </div>
          </div>

          {/* View History Card */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-semibold mb-4 text-white">View Insights</h2>
            <div className="space-y-4">
              <Link 
                href="/mood-history"
                className="block w-full bg-violet-600 text-white py-3 px-4 rounded-lg text-center hover:bg-violet-700 transition-colors"
              >
                📊 Mood History
              </Link>
              <Link 
                href="/food-history"
                className="block w-full bg-amber-600 text-white py-3 px-4 rounded-lg text-center hover:bg-amber-700 transition-colors"
              >
                📝 Food Journal
              </Link>
              <Link 
                href="/dashboard"
                className="block w-full bg-cyan-600 text-white py-3 px-4 rounded-lg text-center hover:bg-cyan-700 transition-colors"
              >
                🔍 Analysis Dashboard
              </Link>
            </div>
          </div>

          {/* Quick Stats Preview */}
          <div className="md:col-span-2 bg-slate-800/50 backdrop-blur-lg rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-semibold mb-4 text-white">Today's Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="text-sm text-slate-400">Last Mood</div>
                <div className="text-2xl font-semibold text-white">😊</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="text-sm text-slate-400">Last Meal</div>
                <div className="text-2xl font-semibold text-white">🍽️</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="text-sm text-slate-400">Gut Health</div>
                <div className="text-2xl font-semibold text-white">💚</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="text-sm text-slate-400">Entries Today</div>
                <div className="text-2xl font-semibold text-white">3</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}