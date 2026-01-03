# gutSync - Gut-Brain Health Tracker

A comprehensive health tracking application that helps users understand the connection between their diet, gut health, and mental wellbeing using AI-powered insights.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Next.js 14 + React + TypeScript + Tailwind CSS             │
│  Port: 3000                                                  │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                           │
│  Python 3.11 + FastAPI + LangChain + Ollama                 │
│  Port: 8000                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RAG System (Loaded Once at Startup)                │   │
│  │  • HuggingFace Embeddings                           │   │
│  │  • ChromaDB Vector Store                            │   │
│  │  • Ollama LLM (llama3.2)                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase                                 │
│  PostgreSQL Database + Authentication                        │
│  • User Data • Mood Logs • Food Logs                        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.11+**
- **Ollama** (for local LLM)
- **Supabase** account (free tier)

### 1. Install Ollama

**Windows:**
```powershell
winget install Ollama.Ollama
```

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Then pull a model:
```bash
ollama pull llama3.2
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp env.example .env

# Start Ollama (in separate terminal)
ollama serve

# Run backend
python main.py
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

```bash
# Navigate to frontend
cd revapp-gba

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_USDA_API_KEY=your_usda_key
EOF

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## 🐳 Docker Deployment

Run both services with Docker Compose:

```bash
# Start Ollama on host first
ollama serve

# Build and run containers
docker-compose up --build

# Or run in background
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
RevApp/
├── backend/                 # FastAPI Backend
│   ├── main.py             # FastAPI app entry point
│   ├── rag_system.py       # RAG with Ollama integration
│   ├── models.py           # Pydantic request/response models
│   ├── config.py           # Configuration management
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend container
│   └── README.md           # Backend documentation
│
├── revapp-gba/             # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Next.js 14 App Router
│   │   │   ├── api/        # API routes
│   │   │   │   └── chat/   # RAG chat endpoint
│   │   │   ├── chat/       # Chat page
│   │   │   ├── dashboard/  # Analytics dashboard
│   │   │   └── ...
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities (Supabase client)
│   ├── chroma_db/          # Vector database (gitignored)
│   ├── foodAndMoodPaper.pdf # Research document
│   ├── Dockerfile          # Frontend container
│   └── package.json
│
├── docker-compose.yml      # Orchestrate both services
└── README.md               # This file
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# LLM Provider
LLM_PROVIDER=ollama          # or "groq" for cloud API
OLLAMA_MODEL=llama3.2        # or "mistral", "phi3"

# RAG Settings
CHUNK_SIZE=1000
SIMILARITY_TOP_K=3

# Optional: Cloud LLM APIs
GROQ_API_KEY=your_key        # Get from console.groq.com
```

### Frontend Configuration

Edit `revapp-gba/.env.local`:

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_USDA_API_KEY=your_key
```

## 🎯 Key Features

### Current Features
- ✅ **Mood Tracking**: Log mood with anxiety, energy, mental clarity, digestive comfort
- ✅ **Food Logging**: Search USDA food database and log meals
- ✅ **AI Chat**: Ask questions about gut-brain connection
- ✅ **History Views**: View past mood and food entries
- ✅ **Dashboard**: Visualize trends and correlations
- ✅ **RAG System**: Research-backed AI responses

### Performance Improvements
| Metric | Before (exec) | After (FastAPI) |
|--------|---------------|-----------------|
| First request | ~60s | ~10s (model load) |
| Subsequent requests | ~60s each | ~2-5s |
| Memory usage | 0MB (idle) | ~2GB (persistent) |

## 🔐 Security Fixes

The new architecture addresses critical security issues:

- ✅ **No Command Injection**: Replaced shell exec with HTTP API
- ✅ **Input Validation**: Pydantic models validate all inputs
- ✅ **API Key Protection**: Backend handles external API calls
- 🚧 **Authentication**: Supabase Auth (TODO)
- 🚧 **Rate Limiting**: Add in production

## 🧪 Development

### Run Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd revapp-gba
npm test
```

### Code Quality

```bash
# Backend
black .
mypy .

# Frontend
npm run lint
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Example API Call

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How does sugar affect my mood?",
    "user_data": {
      "moods": [{"mood": 6, "date": "2024-01-02"}]
    }
  }'
```

## 🚀 Deployment

### Railway (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../revapp-gba
railway up
```

### Render / Fly.io

Both services include Dockerfiles for easy deployment to any container platform.

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if not running
ollama serve
```

### "Model not found"
```bash
ollama pull llama3.2
```

### Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:8000/health

# Update BACKEND_URL in .env.local
```

## 📝 Migration from Old Architecture

The old system used `child_process.exec()` to spawn Python on every request. The new system:

1. ✅ Runs Python as a persistent FastAPI server
2. ✅ Loads models once at startup
3. ✅ Uses HTTP instead of shell commands
4. ✅ Adds proper error handling and validation
5. ✅ Implements actual LLM generation (not just raw chunks)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Update documentation
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Ollama Documentation](https://ollama.ai/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [Supabase Documentation](https://supabase.com/docs)

## 💡 Future Enhancements

- [ ] Streaming chat responses
- [ ] User authentication with Supabase Auth
- [ ] Push notifications for mood tracking
- [ ] Data export (CSV/PDF reports)
- [ ] Mobile app (React Native)
- [ ] Integration with wearables
- [ ] Advanced analytics and predictions
- [ ] Community features and insights sharing

---

**Built with ❤️ for better gut-brain health**
