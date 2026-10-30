from fastapi import APIRouter, HTTPException
from app.schemas.ai import ChatRequest, ChatResponse
from app.services.llm_assistant import assistant_service

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def generate_chat(request: ChatRequest):
    """
    Generate response with LLM Assistant.
    Applies security guardrails, PII redaction, and multi-provider auto-failover (Gemini, Groq, DeepSeek).
    """
    try:
        return await assistant_service.execute_chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

