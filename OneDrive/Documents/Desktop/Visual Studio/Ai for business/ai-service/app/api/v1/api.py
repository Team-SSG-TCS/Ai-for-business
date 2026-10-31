from fastapi import APIRouter
from app.api.v1.endpoints import chat, analyze, guardrails, models, rag

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat & Generation"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["AI Text Analysis"])
api_router.include_router(guardrails.router, prefix="/guardrails", tags=["LLM Guardrails & Safety"])
api_router.include_router(models.router, prefix="/models", tags=["LLM Models & Status"])
api_router.include_router(rag.router, prefix="/rag", tags=["RAG & pgvector Embeddings"])


