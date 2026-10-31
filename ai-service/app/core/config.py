import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise AI & LLM Assistant Service"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # 1. Google Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    GEMINI_FALLBACK_MODEL: str = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.5-flash-lite")
    
    # 2. Groq Cloud
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    GROQ_BASE_URL: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    
    # 3. DeepSeek
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    DEEPSEEK_BASE_URL: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
    
    # Provider Orchestration
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "auto")
    AI_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "auto")
    AI_MODEL_NAME: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    
    # Indian AML & FIU-IND Regulatory Thresholds (PMLA 2002)
    AML_JURISDICTION: str = os.getenv("AML_JURISDICTION", "INDIA")
    CTR_THRESHOLD_INR: float = float(os.getenv("CTR_THRESHOLD_INR", "1000000.0"))  # ₹10,00,000 (10 Lakhs INR)
    CTR_LOWER_BOUND_INR: float = float(os.getenv("CTR_LOWER_BOUND_INR", "900000.0"))  # ₹9,00,000 (9 Lakhs INR)
    PAN_MANDATORY_THRESHOLD_INR: float = float(os.getenv("PAN_MANDATORY_THRESHOLD_INR", "50000.0"))  # ₹50,000 (Cash deposit Rule 114B)
    REGULATORY_BODY: str = os.getenv("REGULATORY_BODY", "FIU-IND")
    AML_STATUTE: str = os.getenv("AML_STATUTE", "PMLA 2002 (Prevention of Money Laundering Act, Sec 3 & 12)")
    CURRENCY_SYMBOL: str = os.getenv("CURRENCY_SYMBOL", "₹")

    # Guardrails & Production Limits
    ENABLE_INJECTION_GUARDRAIL: bool = os.getenv("ENABLE_INJECTION_GUARDRAIL", "True").lower() == "true"
    ENABLE_PII_REDACTION: bool = os.getenv("ENABLE_PII_REDACTION", "True").lower() == "true"
    MAX_INPUT_CHARS: int = int(os.getenv("MAX_INPUT_CHARS", "8000"))
    MAX_OUTPUT_TOKENS: int = int(os.getenv("MAX_OUTPUT_TOKENS", "2048"))
    REQUEST_TIMEOUT_SECONDS: float = 30.0
    
    # CORS Origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000",
        "*",
    ]

settings = Settings()
