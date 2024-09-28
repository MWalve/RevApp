import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gut-Brain Health Tracker</h1>
      <nav className="space-x-4">
        <Link href="/mood-input" className="text-blue-500 hover:underline">
          Log Mood
        </Link>
        <Link href="/mood-history" className="text-blue-500 hover:underline">
          View History
        </Link>
      </nav>
    </div>
  );
}