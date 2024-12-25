'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-indigo-800' : 'hover:bg-indigo-800/50';
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-white font-bold text-xl"
          >
            gutSync
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Track Section */}
            <div className="flex space-x-1">
              <Link 
                href="/enhanced-mood"
                className={`text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/enhanced-mood')}`}
              >
                Track Mood
              </Link>
              <Link 
                href="/food-log"
                className={`text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/food-log')}`}
              >
                Track Food
              </Link>
            </div>

            {/* History Section */}
            <div className="flex space-x-1">
              <Link 
                href="/food-history"
                className={`text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/food-history')}`}
              >
                Journal
              </Link>
              <Link 
                href="/mood-history"
                className={`text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/mood-history')}`}
              >
                History
              </Link>
            </div>

            <div>
            {/* Dashboard */}
            <Link 
              href="/dashboard"
              className={`bg-emerald-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-emerald-700 ${
                isActive('/dashboard') ? 'bg-emerald-700' : ''
              }`}
            >
              Insights
            </Link>
            </div>
            <Link 
              href="/chat"
              className={`text-white px-3 py-2 rounded transition-colors ${
                pathname === '/chat' ? 'bg-blue-700' : 'hover:bg-blue-600'
              }`}
            >
              AI Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;