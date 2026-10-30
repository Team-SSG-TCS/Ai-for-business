from fastapi import APIRouter
from typing import List
from app.schemas.ai import ModelStatus
from app.core.config import settings

router = APIRouter()

@router.get("", response_model=List[ModelStatus])
async def list_available_models():
    """
    Returns configured LLM provider profiles and status.
    """
    return [
        ModelStatus(
            id="auto",
            name="Smart Auto-Failover (Recommended)",
            provider="Auto Routing",
            status="active",
            recommended_model="Groq -> Gemini -> DeepSeek",
            note="Zero-downtime resilient failover pipeline with guardrails"
        ),
        ModelStatus(
            id="gemini",
            name="Google Gemini 2.5/3.5 Flash",
            provider="Google AI",
            status="active" if bool(settings.GEMINI_API_KEY) else "unconfigured",
            recommended_model=settings.GEMINI_MODEL,
            note="Configured with automatic 3.5-flash-lite fallback on demand spikes"
        ),
        ModelStatus(
            id="groq",
            name="Groq Cloud LPU Engine",
            provider="Groq",
            status="active" if bool(settings.GROQ_API_KEY) else "unconfigured",
            recommended_model=settings.GROQ_MODEL,
            note="Ultra-low latency inference engine (<1s)"
        ),
        ModelStatus(
            id="deepseek",
            name="DeepSeek Chat",
            provider="DeepSeek",
            status="active" if bool(settings.DEEPSEEK_API_KEY) else "unconfigured",
            recommended_model=settings.DEEPSEEK_MODEL,
            note="DeepSeek reasoning & chat model"
        ),
        ModelStatus(
            id="mock",
            name="Offline Mock Simulator",
            provider="Local",
            status="active",
            recommended_model="mock-simulator-v2",
            note="Zero-cost, zero-latency local fallback"
        ),
    ]
