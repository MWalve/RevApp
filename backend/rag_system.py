"""
Enhanced RAG System with Ollama LLM Integration

This module provides a complete RAG (Retrieval-Augmented Generation) system
that uses local embeddings and Ollama for LLM inference.
"""

from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import logging
import os
from typing import Optional, Dict, Any

from config import settings

logger = logging.getLogger(__name__)


class RAGSystem:
    """
    Complete RAG system with:
    - Document loading and chunking
    - Vector embeddings with HuggingFace
    - ChromaDB vector store
    - Ollama LLM for generation
    """
    
    def __init__(self):
        """Initialize the RAG system with all components"""
        logger.info("Initializing RAG System...")
        
        # Initialize embeddings
        self._init_embeddings()
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        
        # Load or create vectorstore
        self._init_vectorstore()
        
        # Initialize LLM
        self._init_llm()
        
        # Create RAG chain
        self._init_qa_chain()
        
        logger.info("✅ RAG System fully initialized")
    
    def _init_embeddings(self):
        """Initialize the embedding model"""
        logger.info(f"Loading embeddings: {settings.EMBEDDING_MODEL}")
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={'device': settings.EMBEDDING_DEVICE}
        )
        
        logger.info("✅ Embeddings loaded")
    
    def _init_vectorstore(self):
        """Load existing vectorstore or create new one"""
        try:
            if os.path.exists(settings.CHROMA_DIR):
                # Load existing vectorstore
                self.vectorstore = Chroma(
                    persist_directory=settings.CHROMA_DIR,
                    embedding_function=self.embeddings
                )
                
                doc_count = self.vectorstore._collection.count()
                logger.info(f"✅ Loaded existing vectorstore with {doc_count} documents")
                
                # If empty, reload documents
                if doc_count == 0:
                    logger.warning("Vectorstore is empty, loading documents...")
                    self._load_documents()
            else:
                # Create new vectorstore
                logger.info("Creating new vectorstore...")
                self._load_documents()
                
        except Exception as e:
            logger.error(f"Error initializing vectorstore: {e}")
            raise
    
    def _load_documents(self):
        """Load and process documents into vectorstore"""
        try:
            logger.info(f"Loading PDF from: {settings.PDF_PATH}")
            
            if not os.path.exists(settings.PDF_PATH):
                raise FileNotFoundError(f"PDF not found at {settings.PDF_PATH}")
            
            # Load PDF
            loader = PyPDFLoader(settings.PDF_PATH)
            pages = loader.load()
            logger.info(f"Loaded {len(pages)} pages from PDF")
            
            # Split into chunks
            texts = self.text_splitter.split_documents(pages)
            logger.info(f"Split into {len(texts)} chunks")
            
            # Create vectorstore
            self.vectorstore = Chroma.from_documents(
                texts,
                self.embeddings,
                persist_directory=settings.CHROMA_DIR
            )
            
            logger.info("✅ Documents loaded and vectorstore created")
            
        except Exception as e:
            logger.error(f"Error loading documents: {e}")
            raise
    
    def _init_llm(self):
        """Initialize the LLM based on configuration"""
        logger.info(f"Initializing LLM: {settings.LLM_PROVIDER}")
        
        if settings.LLM_PROVIDER == "ollama":
            try:
                self.llm = Ollama(
                    model=settings.OLLAMA_MODEL,
                    base_url=settings.OLLAMA_BASE_URL,
                    temperature=0.7,
                    num_ctx=4096,  # Context window size
                )
                logger.info(f"✅ Ollama LLM initialized with model: {settings.OLLAMA_MODEL}")
                
            except Exception as e:
                logger.error(f"Failed to initialize Ollama: {e}")
                logger.error("Make sure Ollama is running: ollama serve")
                logger.error(f"And model is pulled: ollama pull {settings.OLLAMA_MODEL}")
                raise
        
        elif settings.LLM_PROVIDER == "groq":
            from langchain_groq import ChatGroq
            
            if not settings.GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY not set in environment")
            
            self.llm = ChatGroq(
                model="llama-3.2-3b-preview",
                temperature=0.7,
                api_key=settings.GROQ_API_KEY
            )
            logger.info("✅ Groq LLM initialized")
        
        else:
            raise ValueError(f"Unsupported LLM provider: {settings.LLM_PROVIDER}")
    
    def _init_qa_chain(self):
        """Create the QA chain with custom prompt"""
        
        # Custom prompt template for gut-brain health
        prompt_template = """You are a knowledgeable gut-brain health assistant. Use the following research context to answer the user's question. Provide helpful, evidence-based insights that are easy to understand.

Context from research:
{context}

Question: {question}

Answer (be concise, helpful, and cite research insights):"""

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        # Create retrieval QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": settings.SIMILARITY_TOP_K}
            ),
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )
        
        logger.info("✅ QA chain initialized")
    
    def get_insights(self, query: str, user_data: Optional[Dict[str, Any]] = None) -> str:
        """
        Get AI-generated insights for a user query.
        
        Args:
            query: User's question
            user_data: Optional dictionary with user's mood/food data
            
        Returns:
            AI-generated response string
        """
        logger.info(f"Processing query: {query[:50]}...")
        
        try:
            # Enhance query with user context if provided
            enhanced_query = self._build_enhanced_query(query, user_data)
            
            # Get response from QA chain
            result = self.qa_chain.invoke({"query": enhanced_query})
            
            # Extract the answer
            response = result['result']
            
            logger.info("✅ Query processed successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error processing query: {e}", exc_info=True)
            return f"I apologize, but I encountered an error processing your question. Please try again."
    
    def _build_enhanced_query(self, query: str, user_data: Optional[Dict[str, Any]]) -> str:
        """
        Build an enhanced query with user context.
        
        Args:
            query: Original user query
            user_data: Optional user context data
            
        Returns:
            Enhanced query string
        """
        if not user_data:
            return query
        
        context_parts = []
        
        # Add mood context
        if user_data.get('moods'):
            moods = user_data['moods']
            if isinstance(moods, list) and len(moods) > 0:
                context_parts.append(f"Recent moods: {self._format_mood_data(moods)}")
        
        # Add food context
        if user_data.get('foods'):
            foods = user_data['foods']
            if isinstance(foods, list) and len(foods) > 0:
                context_parts.append(f"Recent foods: {self._format_food_data(foods)}")
        
        # Build enhanced query
        if context_parts:
            user_context = "\n".join(context_parts)
            enhanced_query = f"""User's personal context:
{user_context}

User's question: {query}"""
            return enhanced_query
        
        return query
    
    def _format_mood_data(self, moods: list) -> str:
        """Format mood data for context"""
        try:
            mood_strs = []
            for mood in moods[:5]:  # Limit to 5 most recent
                if isinstance(mood, dict):
                    mood_val = mood.get('mood') or mood.get('overall_mood', 'N/A')
                    mood_strs.append(f"{mood_val}/10")
            return ", ".join(mood_strs) if mood_strs else "No data"
        except Exception:
            return "N/A"
    
    def _format_food_data(self, foods: list) -> str:
        """Format food data for context"""
        try:
            food_strs = []
            for food in foods[:5]:  # Limit to 5 most recent
                if isinstance(food, dict):
                    name = food.get('name') or food.get('food_name', 'Unknown')
                    food_strs.append(name)
            return ", ".join(food_strs) if food_strs else "No data"
        except Exception:
            return "N/A"
    
    def get_document_count(self) -> int:
        """Get the number of documents in the vectorstore"""
        try:
            return self.vectorstore._collection.count()
        except Exception:
            return 0


