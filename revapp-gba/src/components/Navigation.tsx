'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : 'hover:bg-blue-600';
  };

  return (
    <nav className="bg-blue-500 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between">
          <Link 
            href="/" 
            className="text-white font-bold text-xl"
          >
            Mind-Gut Wellness
          </Link>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Track Section */}
            <div className="flex space-x-2">
              <Link 
                href="/enhanced-mood"
                className={`text-white px-3 py-2 rounded transition-colors ${isActive('/enhanced-mood')}`}
              >
                Track Mood
              </Link>
              <Link 
                href="/food-log"
                className={`text-white px-3 py-2 rounded transition-colors ${isActive('/food-log')}`}
              >
                Track Food
              </Link>
            </div>

            {/* History Section */}
            <div className="flex space-x-2">
              <Link 
                href="/food-history"
                className={`text-white px-3 py-2 rounded transition-colors ${isActive('/food-history')}`}
              >
                Food Journal
              </Link>
              <Link 
                href="/mood-history"
                className={`text-white px-3 py-2 rounded transition-colors ${isActive('/mood-history')}`}
              >
                Mood History
              </Link>
            </div>

            {/* Dashboard */}
            <Link 
              href="/dashboard"
              className={`bg-green-500 text-white px-3 py-2 rounded transition-colors hover:bg-green-600 ${
                isActive('/dashboard') ? 'bg-green-600' : ''
              }`}
            >
              Insights
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;