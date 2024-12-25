# src/lib/rag_model.py
from langchain_community.document_loaders import PyPDFLoader  # Fixed import
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
import logging
import os

# Set up logging and paths
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PDF_PATH = os.path.join(BASE_DIR, "foodAndMoodPaper.pdf")
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")

class RAGSystem:
    def __init__(self):
        logger.info("Initializing RAG System...")
        # Initialize embeddings first
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-distilroberta-v1",
            model_kwargs={'device': 'cpu'}
        )
        logger.info("Embeddings loaded successfully")
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        # Initialize vectorstore
        self.load_or_create_vectorstore()

    def load_or_create_vectorstore(self):
        try:
            if os.path.exists(CHROMA_DIR):
                # Use existing vectorstore
                self.vectorstore = Chroma(
                    persist_directory=CHROMA_DIR,
                    embedding_function=self.embeddings
                )
                collection = self.vectorstore._collection
                doc_count = collection.count()
                logger.info(f"Using existing vectorstore with {doc_count} documents")
                
                # If no documents, create new vectorstore
                if doc_count == 0:
                    logger.info("Empty vectorstore found, creating new one")
                    self.load_documents()
            else:
                # Create new vectorstore
                logger.info("Creating new vectorstore")
                self.load_documents()
        except Exception as e:
            logger.error(f"Error loading/creating vectorstore: {e}")
            raise

    def load_documents(self):
        try:
            logger.info(f"Loading PDF from: {PDF_PATH}")
            loader = PyPDFLoader(PDF_PATH)
            pages = loader.load()
            logger.info(f"Loaded {len(pages)} pages from PDF")

            texts = self.text_splitter.split_documents(pages)
            logger.info(f"Split into {len(texts)} chunks")

            # Create vectorstore without persist method
            self.vectorstore = Chroma.from_documents(
                texts,
                self.embeddings,
                persist_directory=CHROMA_DIR
            )
            # No need to call persist() as it's handled automatically
            logger.info("Created new vectorstore")
        except Exception as e:
            logger.error(f"Error loading documents: {e}")
            raise

    def get_insights(self, query):
        logger.info(f"Processing query: {query}")
        try:
            relevant_docs = self.vectorstore.similarity_search(query, k=2)
            logger.info(f"Found {len(relevant_docs)} relevant documents")
            
            if not relevant_docs:
                return "I don't have enough information to answer that query."

            context = ' '.join([doc.page_content for doc in relevant_docs])
            response = f"Based on the research:\n{context[:500]}..."
            
            logger.info("Successfully generated response")
            return response
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return f"Sorry, I encountered an error processing your query: {str(e)}"