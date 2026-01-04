"""
FastAPI Backend for gutSync RAG System

This server provides a persistent Python backend for the RAG system,
eliminating the need to spawn new processes on every request.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from typing import Optional

from models import QueryRequest, QueryResponse, HealthResponse
from rag_system import RAGSystem
from config import settings

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global RAG system instance
rag_system: Optional[RAGSystem] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI.
    Loads the RAG system once at startup and keeps it in memory.
    """
    global rag_system
    
    logger.info("🚀 Starting gutSync Backend Server...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Using LLM: {settings.LLM_PROVIDER}")
    
    try:
        # Initialize RAG system ONCE at startup
        rag_system = RAGSystem()
        logger.info("✅ RAG System initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize RAG system: {e}")
        raise
    
    yield  # Server runs here
    
    # Cleanup on shutdown
    logger.info("🛑 Shutting down gutSync Backend Server...")


# Create FastAPI app
app = FastAPI(
    title="gutSync RAG API",
    description="Persistent backend for gut-brain health RAG system",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "gutSync RAG API",
        "version": "1.0.0"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    return {
        "status": "healthy",
        "rag_initialized": True,
        "vectorstore_documents": rag_system.get_document_count()
    }


@app.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    Main RAG query endpoint.
    
    Accepts a user query and optional user context data,
    returns a personalized AI-generated insight.
    """
    if rag_system is None:
        raise HTTPException(
            status_code=503,
            detail="RAG system not initialized"
        )
    
    try:
        logger.info(f"Processing query: {request.query[:50]}...")
        
        # Get insights from RAG system
        response = rag_system.get_insights(
            query=request.query,
            user_data=request.user_data
        )
        
        return {
            "response": response,
            "status": "success"
        }
    
    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process query: {str(e)}"
        )


@app.post("/query/stream")
async def query_rag_stream(request: QueryRequest):
    """
    Streaming version of the query endpoint.
    Returns Server-Sent Events for real-time streaming responses.
    """
    # TODO: Implement streaming in future iteration
    raise HTTPException(
        status_code=501,
        detail="Streaming not yet implemented"
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )


