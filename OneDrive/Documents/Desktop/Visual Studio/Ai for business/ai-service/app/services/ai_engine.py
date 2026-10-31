import os
import json
import httpx
from typing import Dict, Any
from app.core.config import settings
from app.schemas.ai import ChatRequest, ChatResponse, AnalysisRequest, AnalysisResponse

class AIEngine:
    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self.model = settings.AI_MODEL_NAME

    async def generate_chat_response(self, request: ChatRequest) -> ChatResponse:
        """
        Executes AI completion. Supports 'openai', 'gemini', or 'mock'.
        """
        provider = self.provider.lower()

        # 1. Real OpenAI integration if key is provided and provider is openai
        if provider == "openai" and settings.OPENAI_API_KEY:
            return await self._call_openai(request)
        
        # 2. Real Google Gemini integration if key is provided and provider is gemini
        if provider == "gemini" and settings.GEMINI_API_KEY:
            return await self._call_gemini(request)

        # 3. Intelligent Hackathon Mock (Default zero-config offline mode)
        return self._generate_mock_chat(request)

    async def _call_openai(self, request: ChatRequest) -> ChatResponse:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": request.model or self.model,
            "messages": [
                {"role": "system", "content": request.system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            "temperature": request.temperature
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {}).get("total_tokens", 0)

            return ChatResponse(
                success=True,
                response=content,
                model=request.model or self.model,
                provider="openai",
                tokens_used=usage
            )

    async def _call_gemini(self, request: ChatRequest) -> ChatResponse:
        model_name = request.model or "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": f"{request.system_prompt}\n\n{request.prompt}"}]
            }]
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return ChatResponse(
                success=True,
                response=text,
                model=model_name,
                provider="gemini"
            )

    def _generate_mock_chat(self, request: ChatRequest) -> ChatResponse:
        """
        Provides intelligent instant mock output for rapid hackathon testing without incurring API costs.
        """
        prompt_snippet = request.prompt[:60] + ("..." if len(request.prompt) > 60 else "")
        mock_text = (
            f"🤖 [FastAPI AI Engine - Mock Simulation Mode]\n\n"
            f"Received Task: \"{prompt_snippet}\"\n\n"
            f"Here is your AI business intelligence output:\n"
            f"1. Key Insight: Automated data pipelines reduce manual friction by ~65%.\n"
            f"2. Recommended Action: Integrate Supabase PostgreSQL triggers with this FastAPI service for real-time alerting.\n"
            f"3. Architecture: The React client can display dynamic charts based on these generated insights.\n\n"
            f"💡 Note for Hackathon: Add your OPENAI_API_KEY or GEMINI_API_KEY in ai-service/.env to switch from mock to live LLM."
        )

        return ChatResponse(
            success=True,
            response=mock_text,
            model=f"mock-{self.model}",
            provider="mock-engine",
            tokens_used=42,
            metadata={"status": "zero-config ready"}
        )

    async def analyze_text(self, request: AnalysisRequest) -> AnalysisResponse:
        """
        Analyzes input text (summary, sentiment, keywords)
        """
        text = request.text
        words = text.split()
        
        result: Dict[str, Any] = {
            "word_count": len(words),
            "character_count": len(text),
            "sentiment": "positive" if any(w in text.lower() for w in ["good", "great", "innovative", "success"]) else "neutral",
            "summary": f"Analyzed {len(words)} words. Key focus detected: business automation.",
            "keywords": list(set([w.lower().strip(".,!?") for w in words if len(w) > 5]))[:6]
        }

        return AnalysisResponse(
            success=True,
            task_type=request.task_type,
            result=result,
            model=self.model
        )

ai_engine = AIEngine()
