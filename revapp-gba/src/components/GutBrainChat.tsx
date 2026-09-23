// components/GutBrainChat.tsx
'use client';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function GutBrainChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userMessage })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Received response:", data); // Debug log

        if (data.error) {
            throw new Error(data.error);
        }

        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.response || "Sorry, I couldn't process that query."
        }]);
        } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Sorry, there was an error processing your request.' 
        }]);
        } finally {
        setIsLoading(false);
        }
    }

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg ring-1 ring-foreground/10">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`${
              message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted'
            } p-3 rounded-lg max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto bg-muted p-3 rounded-lg">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your gut-brain connection..."
            className="flex-1 p-2 border border-input bg-background rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}