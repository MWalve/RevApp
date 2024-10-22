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
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link 
          href="/" 
          className="text-white font-bold text-xl"
        >
          Mood Tracker
        </Link>
        <div className="flex space-x-4">
          <Link 
            href="/mood-input"
            className={`text-white px-4 py-2 rounded transition-colors ${isActive('/mood-input')}`}
          >
            Log Mood
          </Link>
          <Link 
            href="/mood-history"
            className={`text-white px-4 py-2 rounded transition-colors ${isActive('/mood-history')}`}
          >
            View History
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;