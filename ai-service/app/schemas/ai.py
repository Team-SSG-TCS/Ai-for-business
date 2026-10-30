from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field

class GuardrailReport(BaseModel):
    is_safe: bool = True
    risk_score: float = 0.0
    violations: List[Dict[str, str]] = []
    sanitized_input: str = ""
    sanitized_output: Optional[str] = None

class ChatRequest(BaseModel):
    prompt: str = Field(..., description="User prompt or task for the AI Assistant")
    system_prompt: Optional[str] = Field(
        default="You are an enterprise AI Business Assistant. Provide actionable, concise, data-informed responses.",
        description="System instruction guiding AI behavior"
    )
    provider: Optional[str] = Field(
        default="auto",
        description="LLM Provider: 'auto' (smart resilient fallback), 'gemini', 'groq', 'deepseek', or 'mock'"
    )
    model: Optional[str] = Field(default=None, description="Model override (optional)")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1024, le=4096)
    enable_guardrails: Optional[bool] = Field(default=True, description="Enable prompt injection defense and PII masking")
    preset: Optional[str] = Field(
        default="business_assistant",
        description="Preset persona: 'business_assistant', 'pitch_deck', 'data_analyst', 'code_expert'"
    )

class ChatResponse(BaseModel):
    success: bool = True
    response: str
    model: str
    provider: str
    latency_ms: int
    fallback_triggered: bool = False
    fallback_reason: Optional[str] = None
    guardrails: Optional[GuardrailReport] = None
    tokens_used: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class GuardrailCheckRequest(BaseModel):
    text: str = Field(..., description="Text to analyze for prompt injection, PII, and safety")
    redact_pii: Optional[bool] = Field(default=True)

class GuardrailCheckResponse(BaseModel):
    is_safe: bool
    risk_score: float
    violations: List[Dict[str, str]]
    sanitized_text: str

class ModelStatus(BaseModel):
    id: str
    name: str
    provider: str
    status: str
    recommended_model: str
    note: str

class AnalysisRequest(BaseModel):
    text: str = Field(..., description="Text content to analyze")
    task_type: str = Field(default="summary", description="Type of analysis: summary, sentiment, keywords, entities")

class AnalysisResponse(BaseModel):
    success: bool = True
    task_type: str
    result: Dict[str, Any]
    model: str

