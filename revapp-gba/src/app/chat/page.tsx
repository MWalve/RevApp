import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import GutBrainChat from '@/components/GutBrainChat';

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gut-Brain AI Assistant</h1>
        <div className="max-w-2xl mx-auto">
          <ErrorBoundary>
            <GutBrainChat />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}