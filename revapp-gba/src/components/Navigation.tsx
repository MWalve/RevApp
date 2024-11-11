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
            Mood & Gut Tracker
          </Link>
          
          {/* Main Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex space-x-2">
              {/* Mood Section */}
              <div className="space-x-1">
                <Link 
                  href="/mood-input"
                  className={`text-white px-3 py-2 rounded transition-colors ${isActive('/mood-input')}`}
                >
                  Quick Log
                </Link>
                <Link 
                  href="/enhanced-mood"
                  className={`text-white px-3 py-2 rounded transition-colors ${isActive('/enhanced-mood')}`}
                >
                  Detailed Log
                </Link>
              </div>

              {/* Food Section */}
              <div className="space-x-1">
                <Link 
                  href="/food-log"
                  className={`text-white px-3 py-2 rounded transition-colors ${isActive('/food-log')}`}
                >
                  Food Log
                </Link>
                <Link 
                  href="/food-history"
                  className={`text-white px-3 py-2 rounded transition-colors ${isActive('/food-history')}`}
                >
                  Food History
                </Link>
              </div>

              {/* History Section */}
              <Link 
                href="/mood-history"
                className={`text-white px-3 py-2 rounded transition-colors ${isActive('/mood-history')}`}
              >
                History
              </Link>
            </div>

            {/* Analysis/Dashboard Button */}
            <Link 
              href="/dashboard"
              className={`bg-green-500 text-white px-3 py-2 rounded transition-colors hover:bg-green-600 ${
                isActive('/dashboard') ? 'bg-green-600' : ''
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;