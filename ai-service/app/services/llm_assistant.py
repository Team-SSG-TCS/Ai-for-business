import time
import httpx
from typing import Dict, Any, Optional
from google import genai
from app.core.config import settings
from app.services.guardrails import guardrails
from app.schemas.ai import ChatRequest, ChatResponse, GuardrailReport

PRESET_SYSTEM_PROMPTS = {
    "business_assistant": "You are an executive AI Business Strategy Assistant. Focus on ROI, operational optimization, and growth metrics.",
    "pitch_deck": "You are a Silicon Valley startup mentor and venture pitch expert. Create compelling problem-solution frameworks and investor hooks.",
    "data_analyst": "You are a senior data analyst. Synthesize business data into crisp, actionable KPIs and structural patterns.",
    "code_expert": "You are a principal fullstack AI software engineer. Provide secure, clean, production-ready code with minimal boilerplate.",
}

class LLMAssistantService:
    def __init__(self):
        # Initialize Google GenAI client if key exists
        self.gemini_client = None
        if settings.GEMINI_API_KEY:
            try:
                self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                print(f"⚠️ Could not initialize Google GenAI Client: {e}")

    def _resolve_system_prompt(self, request: ChatRequest) -> str:
        if request.preset and request.preset in PRESET_SYSTEM_PROMPTS:
            return PRESET_SYSTEM_PROMPTS[request.preset]
        return request.system_prompt or PRESET_SYSTEM_PROMPTS["business_assistant"]

    async def execute_chat(self, request: ChatRequest) -> ChatResponse:
        start_time = time.perf_counter()
        
        # 1. Apply Input Guardrails
        effective_prompt = request.prompt
        guardrail_violations = []
        risk_score = 0.0
        is_safe = True

        if request.enable_guardrails:
            is_safe, effective_prompt, guardrail_violations, risk_score = guardrails.inspect_input(
                request.prompt,
                redact_pii=settings.ENABLE_PII_REDACTION
            )

            # If extreme risk injection detected, reject gracefully
            if not is_safe:
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return ChatResponse(
                    success=False,
                    response="🛡️ [Guardrail Intervention]: Request was blocked due to high-risk prompt injection or policy violations.",
                    model="guardrail-shield-v1",
                    provider="guardrails",
                    latency_ms=elapsed_ms,
                    guardrails=GuardrailReport(
                        is_safe=False,
                        risk_score=risk_score,
                        violations=guardrail_violations,
                        sanitized_input=effective_prompt
                    )
                )

        system_prompt = self._resolve_system_prompt(request)
        provider = (request.provider or settings.DEFAULT_PROVIDER).lower()

        # 2. Provider Routing with Fallback
        response_text = ""
        model_used = ""
        provider_used = ""
        tokens_used = 0
        fallback_triggered = False
        fallback_reason = None

        try:
            if provider == "groq":
                response_text, model_used, tokens_used = await self._call_groq(effective_prompt, system_prompt, request)
                provider_used = "groq"
            elif provider == "gemini":
                response_text, model_used, tokens_used = await self._call_gemini(effective_prompt, system_prompt, request)
                provider_used = "gemini"
            elif provider == "deepseek":
                response_text, model_used, tokens_used = await self._call_deepseek(effective_prompt, system_prompt, request)
                provider_used = "deepseek"
            elif provider == "mock":
                response_text, model_used, tokens_used = self._call_mock(effective_prompt, system_prompt)
                provider_used = "mock"
            else:
                # "auto" Mode: Resilient multi-provider failover
                # Priority 1: Groq (ultra-fast < 1s) or Gemini
                try:
                    response_text, model_used, tokens_used = await self._call_groq(effective_prompt, system_prompt, request)
                    provider_used = "groq"
                except Exception as e_groq:
                    fallback_triggered = True
                    fallback_reason = f"Groq unavailable ({str(e_groq)[:60]}). Falling back to Gemini."
                    print(f"⚠️ Auto-failover: {fallback_reason}")
                    try:
                        response_text, model_used, tokens_used = await self._call_gemini(effective_prompt, system_prompt, request)
                        provider_used = "gemini"
                    except Exception as e_gemini:
                        fallback_reason += f" | Gemini unavailable ({str(e_gemini)[:60]}). Falling back to DeepSeek/Mock."
                        print(f"⚠️ Auto-failover: {fallback_reason}")
                        try:
                            response_text, model_used, tokens_used = await self._call_deepseek(effective_prompt, system_prompt, request)
                            provider_used = "deepseek"
                        except Exception:
                            # Final fallback: Mock
                            response_text, model_used, tokens_used = self._call_mock(effective_prompt, system_prompt)
                            provider_used = "mock (resilient fallback)"

        except Exception as main_err:
            fallback_triggered = True
            fallback_reason = f"Provider error: {str(main_err)[:100]}. Served via resilient mock engine."
            response_text, model_used, tokens_used = self._call_mock(effective_prompt, system_prompt)
            provider_used = "mock (safety net)"

        # 3. Apply Output Guardrails
        if request.enable_guardrails:
            _, response_text, output_violations = guardrails.inspect_output(response_text, system_prompt)
            guardrail_violations.extend(output_violations)

        elapsed_ms = int((time.perf_counter() - start_time) * 1000)

        return ChatResponse(
            success=True,
            response=response_text,
            model=model_used,
            provider=provider_used,
            latency_ms=elapsed_ms,
            fallback_triggered=fallback_triggered,
            fallback_reason=fallback_reason,
            tokens_used=tokens_used,
            guardrails=GuardrailReport(
                is_safe=is_safe,
                risk_score=risk_score,
                violations=guardrail_violations,
                sanitized_input=effective_prompt,
                sanitized_output=response_text[:100] + "..." if len(response_text) > 100 else response_text
            )
        )

    async def _call_groq(self, prompt: str, system_prompt: str, request: ChatRequest):
        """Call Groq Cloud with high-throughput Llama / GPT-OSS models"""
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not configured in ai-service/.env")

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        model_name = request.model or settings.GROQ_MODEL
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": request.temperature or 0.7,
            "max_tokens": request.max_tokens or 1024
        }

        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = await client.post(
                f"{settings.GROQ_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            if resp.status_code != 200:
                raise RuntimeError(f"Groq API Error ({resp.status_code}): {resp.text}")
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {}).get("total_tokens", 0)
            return content, model_name, usage

    async def _call_gemini(self, prompt: str, system_prompt: str, request: ChatRequest):
        """Call Google Gemini with version auto-fallback"""
        if not self.gemini_client:
            raise ValueError("GEMINI_API_KEY not configured or client failed to init")

        # Models to try: requested model, then fallback models
        models_to_try = [
            request.model or settings.GEMINI_MODEL,
            settings.GEMINI_FALLBACK_MODEL,
            "gemini-3.8-flash",
            "gemini-flash-latest"
        ]

        full_prompt = f"{system_prompt}\n\nUser Task:\n{prompt}"
        last_error = None

        for model_variant in models_to_try:
            try:
                resp = self.gemini_client.models.generate_content(
                    model=model_variant,
                    contents=full_prompt
                )
                if resp and resp.text:
                    estimated_tokens = len(resp.text.split()) * 2
                    return resp.text, model_variant, estimated_tokens
            except Exception as e:
                last_error = e
                # If deprecated or 503 high demand, try next variant in chain
                continue

        raise RuntimeError(f"All Gemini model variants failed: {last_error}")

    async def _call_deepseek(self, prompt: str, system_prompt: str, request: ChatRequest):
        """Call DeepSeek API"""
        if not settings.DEEPSEEK_API_KEY:
            raise ValueError("DEEPSEEK_API_KEY not configured in ai-service/.env")

        headers = {
            "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        model_name = request.model or settings.DEEPSEEK_MODEL
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": request.temperature or 0.7,
            "max_tokens": request.max_tokens or 1024
        }

        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = await client.post(
                f"{settings.DEEPSEEK_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            if resp.status_code != 200:
                raise RuntimeError(f"DeepSeek API Error ({resp.status_code}): {resp.text}")
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {}).get("total_tokens", 0)
            return content, model_name, usage

    def _call_mock(self, prompt: str, system_prompt: str):
        """Safety net mock simulation"""
        content = (
            f"🚀 [AI Assistant - Executive Summary]\n\n"
            f"Task: {prompt[:80]}...\n\n"
            f"1. Strategic Recommendation: Deploy autonomous AI pipeline connecting your Supabase database directly to client notifications.\n"
            f"2. Competitive Edge: Real-time decision velocity increases engagement by 40%.\n"
            f"3. Next Step: Integrate user input into the Express backend route `/api/items`."
        )
        return content, "mock-simulator-v2", 64

assistant_service = LLMAssistantService()
