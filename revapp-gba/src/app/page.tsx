import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Mood Tracker
      </h1>
      <div className="flex gap-4">
        <Link 
          href="/mood-input"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log Mood
        </Link>
        <Link 
          href="/mood-history"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          View History
        </Link>
      </div>
    </main>
  );
}