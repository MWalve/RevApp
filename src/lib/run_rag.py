# src/lib/run_rag.py
import sys
import logging
from rag_model import RAGSystem

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    if len(sys.argv) < 2:
        print("Please provide a query")
        sys.exit(1)

    query = sys.argv[1]
    logger.info(f"Received query: {query}")
    
    try:
        rag = RAGSystem()
        response = rag.get_insights(query)
        print(response)
    except Exception as e:
        logger.error(f"Error in main: {e}")
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()