from fastapi import APIRouter, HTTPException
from app.schemas.ai import AnalysisRequest, AnalysisResponse
from app.services.ai_engine import ai_engine

router = APIRouter()

@router.post("", response_model=AnalysisResponse)
async def analyze_content(request: AnalysisRequest):
    """
    Perform text analysis, keyword extraction, and sentiment.
    """
    try:
        return await ai_engine.analyze_text(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
