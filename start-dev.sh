#!/bin/bash
# Development startup script for macOS/Linux
# This script starts both the backend and frontend in development mode

echo "🚀 Starting gutSync Development Environment"
echo ""

# Check if Ollama is running
echo "Checking Ollama status..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "❌ Ollama is not running. Starting Ollama..."
    echo "Please start Ollama manually: ollama serve"
    exit 1
fi

echo ""

# Start Backend
echo "🐍 Starting FastAPI Backend..."
osascript -e 'tell application "Terminal" to do script "cd '"$PWD"'/backend && source venv/bin/activate && python main.py"' &

# Wait for backend to start
sleep 5

# Start Frontend
echo "⚛️  Starting Next.js Frontend..."
osascript -e 'tell application "Terminal" to do script "cd '"$PWD"'/revapp-gba && npm run dev"' &

echo ""
echo "✅ Development servers starting..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C in each terminal to stop the servers"


