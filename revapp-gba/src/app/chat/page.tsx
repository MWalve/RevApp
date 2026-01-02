// app/chat/page.tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import GutBrainChat from '@/components/GutBrainChat';

export default function ChatPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gut-Brain AI Assistant</h1>
      <ErrorBoundary>
        <GutBrainChat />
      </ErrorBoundary>
    </main>
  );
}