from fastapi import APIRouter, HTTPException
from app.schemas.ai import RagEmbedRequest, RagEmbedResponse, RagAskRequest, RagAskResponse
from app.services.embedding_service import embedding_service

router = APIRouter()

@router.post("/embed", response_model=RagEmbedResponse, summary="Generate vector embedding for Supabase pgvector")
async def embed_text(request: RagEmbedRequest):
    """
    Generates 768-dimensional dense vector embeddings for Supabase pgvector storage.
    Powered by Google Gemini (gemini-embedding-001) with automatic zero-config offline fallback.
    """
    try:
        embedding, model, provider = embedding_service.generate_embedding(
            text=request.text,
            dimension=request.dimension or 768
        )
        return RagEmbedResponse(
            success=True,
            embedding=embedding,
            dimension=len(embedding),
            model=model,
            provider=provider
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")

@router.post("/ask", response_model=RagAskResponse, summary="Synthesize RAG response with retrieved context")
async def rag_ask(request: RagAskRequest):
    """
    Generates a factually grounded answer using retrieved document chunks from Supabase pgvector.
    """
    try:
        answer, model, provider, latency_ms = await embedding_service.generate_rag_answer(
            query=request.query,
            contexts=request.contexts,
            system_prompt=request.system_prompt or ""
        )
        return RagAskResponse(
            success=True,
            answer=answer,
            contexts_used=len(request.contexts),
            model=model,
            provider=provider,
            latency_ms=latency_ms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG synthesis failed: {str(e)}")
