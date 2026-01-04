# Development startup script for Windows
# This script starts both the backend and frontend in development mode

Write-Host "🚀 Starting gutSync Development Environment" -ForegroundColor Green
Write-Host ""

# Check if Ollama is running
Write-Host "Checking Ollama status..." -ForegroundColor Yellow
try {
    $ollamaStatus = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Ollama is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Ollama is not running. Starting Ollama..." -ForegroundColor Red
    Write-Host "Please start Ollama manually: ollama serve" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Start Backend
Write-Host "🐍 Starting FastAPI Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; python main.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "⚛️  Starting Next.js Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd revapp-gba; npm run dev"

Write-Host ""
Write-Host "✅ Development servers starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow


