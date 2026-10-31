from fastapi import APIRouter
from app.schemas.ai import GuardrailCheckRequest, GuardrailCheckResponse
from app.services.guardrails import guardrails

router = APIRouter()

@router.post("/check", response_model=GuardrailCheckResponse)
async def check_guardrails(request: GuardrailCheckRequest):
    """
    Evaluates input text against safety guardrails:
    - Detects prompt injection / jailbreak attempts
    - Detects & redacts PII (emails, phone numbers, credit cards, SSNs, IPs)
    - Calculates risk score (0.0 to 1.0)
    """
    is_safe, sanitized_text, violations, risk_score = guardrails.inspect_input(
        request.text,
        redact_pii=request.redact_pii if request.redact_pii is not None else True
    )

    return GuardrailCheckResponse(
        is_safe=is_safe,
        risk_score=risk_score,
        violations=violations,
        sanitized_text=sanitized_text
    )
