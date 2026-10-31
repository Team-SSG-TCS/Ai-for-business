import math
import hashlib
import time
from typing import List, Tuple
from google import genai
from google.genai import types
from app.core.config import settings
from app.services.llm_assistant import assistant_service
from app.schemas.ai import ChatRequest

class EmbeddingService:
    def __init__(self):
        self.client = None
        if settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                print(f"⚠️ Could not initialize Gemini Client for embeddings: {e}")

    def generate_embedding(self, text: str, dimension: int = 768) -> Tuple[List[float], str, str]:
        """
        Generates dense vector embeddings.
        Uses Gemini gemini-embedding-001 with output_dimensionality=768.
        Falls back to deterministic normalized pseudo-vector if API is unreachable.
        """
        if self.client and settings.GEMINI_API_KEY:
            try:
                config = types.EmbedContentConfig(output_dimensionality=dimension)
                response = self.client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=text,
                    config=config
                )
                if response and response.embeddings and len(response.embeddings) > 0:
                    vec = response.embeddings[0].values
                    if len(vec) == dimension:
                        return list(vec), "gemini-embedding-001", "gemini"
            except Exception as e:
                print(f"⚠️ Gemini live embedding failed ({e}). Using deterministic mock fallback.")

        # Fallback: Deterministic normalized mock vector of requested dimension
        return self._generate_deterministic_vector(text, dimension), "mock-hash-embed-v1", "mock"

    def _generate_deterministic_vector(self, text: str, dimension: int = 768) -> List[float]:
        """
        Creates a reproducible, normalized pseudo-random vector based on text hash
        so offline development and hackathons work reliably without failures.
        """
        hasher = hashlib.sha256()
        hasher.update(text.encode("utf-8"))
        seed = int(hasher.hexdigest()[:8], 16)
        
        raw = []
        for i in range(dimension):
            # Trigonometric pseudo-random generation
            val = math.sin(seed * (i + 1) * 0.123456) * math.cos((seed + i) * 0.654321)
            raw.append(val)
        
        # Normalize to unit length (L2 norm)
        norm = math.sqrt(sum(x * x for x in raw)) or 1.0
        return [round(x / norm, 6) for x in raw]

    async def generate_rag_answer(self, query: str, contexts: List[str], system_prompt: str = "") -> Tuple[str, str, str, int]:
        """
        Answers user query using provided retrieved documents as grounded context.
        """
        start = time.perf_counter()
        context_block = "\n---\n".join([f"Document Chunk [{i+1}]: {c}" for i, c in enumerate(contexts)])
        
        prompt = (
            f"You are a helpful RAG AI Assistant. Answer the user question based on the retrieved context below.\n\n"
            f"=== RETRIEVED CONTEXT FROM SUPABASE PGVECTOR ===\n"
            f"{context_block if contexts else 'No direct documents found.'}\n"
            f"================================================\n\n"
            f"User Question: {query}\n\n"
            f"Instructions: Give a direct, accurate answer using the context. If context doesn't contain the answer, say so clearly."
        )

        chat_req = ChatRequest(
            prompt=prompt,
            system_prompt=system_prompt or "You are an accurate RAG assistant grounded in provided database context.",
            provider=settings.DEFAULT_PROVIDER,
            temperature=0.3
        )
        chat_resp = await assistant_service.execute_chat(chat_req)
        elapsed_ms = int((time.perf_counter() - start) * 1000)

        return chat_resp.response, chat_resp.model, chat_resp.provider, elapsed_ms

embedding_service = EmbeddingService()
