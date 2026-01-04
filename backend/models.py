"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any


class QueryRequest(BaseModel):
    """Request model for RAG queries"""
    query: str = Field(
        ...,
        description="User's question or query",
        min_length=1,
        max_length=1000
    )
    user_data: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional user context data (moods, foods, etc.)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "How does sugar affect my mood?",
                "user_data": {
                    "recent_moods": [
                        {"mood": 6, "date": "2024-01-02"}
                    ],
                    "recent_foods": [
                        {"name": "Dark Chocolate", "time": "evening"}
                    ]
                }
            }
        }


class QueryResponse(BaseModel):
    """Response model for RAG queries"""
    response: str = Field(
        ...,
        description="AI-generated response"
    )
    status: str = Field(
        default="success",
        description="Response status"
    )
    sources: Optional[List[str]] = Field(
        None,
        description="Source documents used (optional)"
    )


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(
        default="healthy",
        description="Service health status"
    )
    service: Optional[str] = Field(
        None,
        description="Service name"
    )
    version: Optional[str] = Field(
        None,
        description="API version"
    )
    rag_initialized: Optional[bool] = Field(
        None,
        description="Whether RAG system is initialized"
    )
    vectorstore_documents: Optional[int] = Field(
        None,
        description="Number of documents in vectorstore"
    )


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(
        ...,
        description="Error message"
    )
    detail: Optional[str] = Field(
        None,
        description="Detailed error information"
    )


