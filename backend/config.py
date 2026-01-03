"""
Configuration management for the backend
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # LLM settings
    LLM_PROVIDER: str = "ollama"  # Options: "ollama", "groq", "huggingface"
    OLLAMA_MODEL: str = "llama3.2"  # or "mistral", "phi3"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # Optional API keys (for cloud providers)
    GROQ_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    
    # RAG settings
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    SIMILARITY_TOP_K: int = 3
    
    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-distilroberta-v1"
    EMBEDDING_DEVICE: str = "cpu"
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    PDF_PATH: str = os.path.join(BASE_DIR, "revapp-gba", "foodAndMoodPaper.pdf")
    CHROMA_DIR: str = os.path.join(BASE_DIR, "revapp-gba", "chroma_db")
    
    # Supabase (for future user data integration)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()


