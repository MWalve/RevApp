# gutSync Backend - FastAPI RAG Server

Persistent Python backend for the gutSync RAG (Retrieval-Augmented Generation) system.

## Features

- 🚀 **Persistent Server**: No process spawning - models loaded once at startup
- 🤖 **Ollama Integration**: Local LLM inference with llama3.2, mistral, or phi3
- 📚 **RAG System**: Research-backed insights using vector similarity search
- ⚡ **Fast Response**: ~2-5 seconds (vs ~60 seconds with old approach)
- 🔒 **Type-Safe**: Pydantic models for request/response validation

## Prerequisites

1. **Python 3.11+**
2. **Ollama** (for local LLM inference)

### Install Ollama

**Windows:**

```bash
# Download from https://ollama.ai
# Or using winget:
winget install Ollama.Ollama
```

**macOS/Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Pull an LLM Model

```bash
# Recommended: Llama 3.2 (2GB)
ollama pull llama3.2

# Alternative: Mistral (4GB, better quality)
ollama pull mistral

# Alternative: Phi-3 (2.3GB, Microsoft)
ollama pull phi3
```

## Installation

1. **Create virtual environment:**

```bash
cd backend
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Configure environment:**

```bash
# Copy example env file
cp env.example .env

# Edit .env with your settings (optional)
```

## Running the Server

### Development Mode (with auto-reload)

```bash
# Make sure Ollama is running
ollama serve

# Start backend
python main.py
```

Server will start at: `http://localhost:8000`

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Using Docker

```bash
# Build image
docker build -t gutsync-backend .

# Run container
docker run -p 8000:8000 gutsync-backend
```

## API Endpoints

### Health Check

```bash
GET http://localhost:8000/health
```

**Response:**

```json
{
  "status": "healthy",
  "rag_initialized": true,
  "vectorstore_documents": 88
}
```

### Query RAG System

```bash
POST http://localhost:8000/query
Content-Type: application/json

{
  "query": "How does sugar affect my mood?",
  "user_data": {
    "moods": [{"mood": 6, "date": "2024-01-02"}],
    "foods": [{"name": "Dark Chocolate"}]
  }
}
```

**Response:**

```json
{
  "response": "Based on research, sugar can have significant effects on mood...",
  "status": "success"
}
```

## Configuration

Edit `.env` file to customize:

| Variable           | Default    | Description                        |
| ------------------ | ---------- | ---------------------------------- |
| `LLM_PROVIDER`     | `ollama`   | LLM provider (ollama, groq)        |
| `OLLAMA_MODEL`     | `llama3.2` | Ollama model name                  |
| `CHUNK_SIZE`       | `1000`     | Document chunk size                |
| `SIMILARITY_TOP_K` | `3`        | Number of similar docs to retrieve |

## Switching LLM Providers

### Option 1: Ollama (Default - Local, Free)

```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
```

### Option 2: Groq (Cloud, Free Tier)

```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_key_here
```

Get free API key at: https://console.groq.com

## Troubleshooting

### "Failed to connect to Ollama"

```bash
# Make sure Ollama is running
ollama serve

# Check Ollama status
curl http://localhost:11434/api/tags
```

### "Model not found"

```bash
# Pull the model
ollama pull llama3.2
```

### Slow first request

This is normal - the first request loads the LLM into memory (~5-10s). Subsequent requests are fast (~2-5s).

## Performance

| Metric        | Old (exec) | New (FastAPI)     |
| ------------- | ---------- | ----------------- |
| First request | ~60s       | ~10s (model load) |
| Subsequent    | ~60s each  | ~2-5s             |
| Memory        | 0MB idle   | ~2GB (persistent) |

## Development

### Run tests

```bash
pytest
```

### Code formatting

```bash
black .
```

### Type checking

```bash
mypy .
```

## Next Steps

- [ ] Add streaming responses
- [ ] Implement caching layer
- [ ] Add user authentication
- [ ] Add metrics/monitoring
- [ ] Deploy to cloud (Railway, Render, Fly.io)
