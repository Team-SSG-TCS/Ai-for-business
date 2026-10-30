import re
from typing import Dict, List, Tuple, Any
from app.core.config import settings

class GuardrailViolation:
    def __init__(self, category: str, message: str, risk_level: str = "medium"):
        self.category = category
        self.message = message
        self.risk_level = risk_level

    def to_dict(self) -> Dict[str, str]:
        return {
            "category": self.category,
            "message": self.message,
            "risk_level": self.risk_level,
        }

class GuardrailEngine:
    """
    Production-grade LLM Guardrail Engine:
    - Defends against prompt injection & jailbreak patterns
    - Redacts sensitive PII (emails, phones, credit cards, SSNs, IPs)
    - Validates input budget and detects system prompt leakage
    """

    # Common injection patterns
    INJECTION_PATTERNS = [
        (r"(?i)\bignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)\b", "Prompt Override Attempt"),
        (r"(?i)\bdisregard\s+(all\s+)?(previous|prior)\s+(instructions|directives)\b", "Directive Reset Attempt"),
        (r"(?i)\b(reveal|print|show|output|leak)\s+(your\s+)?(system\s+prompt|initial\s+prompt|hidden\s+instructions)\b", "System Prompt Extraction Attempt"),
        (r"(?i)\b(you\s+are\s+now|act\s+as)\s+(DAN|jailbroken|unrestricted|god\s+mode|root)\b", "Jailbreak Persona Attempt"),
        (r"(?i)\b(system\s+override|admin\s+mode|bypass\s+safety|disable\s+guardrails)\b", "Administrative Bypass Attempt"),
        (r"(?i)(###\s*system|\[INST\]|<<SYS>>|<\|im_start\|>system)", "Special Delimiter Injection"),
    ]

    # PII Regex Patterns
    PII_PATTERNS = {
        "CREDIT_CARD": (r"\b(?:\d{4}[-\s]?){3}\d{4}\b", "[REDACTED_CARD]"),
        "EMAIL": (r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b", "[REDACTED_EMAIL]"),
        "PHONE": (r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b", "[REDACTED_PHONE]"),
        "SSN": (r"\b\d{3}-\d{2}-\d{4}\b", "[REDACTED_SSN]"),
        "IPV4": (r"\b(?:\d{1,3}\.){3}\d{1,3}\b", "[REDACTED_IP]"),
    }

    def inspect_input(self, text: str, redact_pii: bool = True) -> Tuple[bool, str, List[Dict[str, str]], float]:
        """
        Inspects and sanitizes user input before passing to the LLM.
        Returns:
            - is_safe (bool)
            - sanitized_text (str)
            - violations (list of violation dicts)
            - risk_score (float 0.0 - 1.0)
        """
        violations: List[GuardrailViolation] = []
        sanitized_text = text
        risk_score = 0.0

        # 1. Input Length Check (DDoS / Token exhaustion safeguard)
        if len(text) > settings.MAX_INPUT_CHARS:
            violations.append(GuardrailViolation(
                category="input_length",
                message=f"Input exceeds maximum allowed characters ({len(text)} > {settings.MAX_INPUT_CHARS})",
                risk_level="high"
            ))
            risk_score += 0.4
            sanitized_text = sanitized_text[:settings.MAX_INPUT_CHARS]

        # 2. Prompt Injection Guardrail
        if settings.ENABLE_INJECTION_GUARDRAIL:
            for pattern, reason in self.INJECTION_PATTERNS:
                if re.search(pattern, text):
                    violations.append(GuardrailViolation(
                        category="prompt_injection",
                        message=reason,
                        risk_level="high"
                    ))
                    risk_score += 0.5
                    # Neutralize injection keyword in text
                    sanitized_text = re.sub(pattern, "[BLOCKED_INJECTION_PATTERN]", sanitized_text)

        # 3. PII Redaction
        redactions_applied = 0
        if redact_pii and settings.ENABLE_PII_REDACTION:
            for pii_type, (pattern, placeholder) in self.PII_PATTERNS.items():
                matches = re.findall(pattern, sanitized_text)
                if matches:
                    redactions_applied += len(matches)
                    sanitized_text = re.sub(pattern, placeholder, sanitized_text)
                    violations.append(GuardrailViolation(
                        category="pii_detected",
                        message=f"Detected and redacted {len(matches)} instance(s) of {pii_type}",
                        risk_level="low"
                    ))

        # Risk score calculation
        risk_score = min(1.0, risk_score + (0.05 * redactions_applied))
        is_safe = risk_score < 0.8

        return is_safe, sanitized_text, [v.to_dict() for v in violations], round(risk_score, 2)

    def inspect_output(self, output_text: str, system_prompt: str = "") -> Tuple[bool, str, List[Dict[str, str]]]:
        """
        Inspects LLM output to prevent system prompt leakage and enforce safety.
        """
        violations: List[GuardrailViolation] = []
        sanitized_output = output_text

        # Detect direct system prompt leakage
        if system_prompt and len(system_prompt) > 20:
            prompt_snippet = system_prompt[:50]
            if prompt_snippet in output_text:
                violations.append(GuardrailViolation(
                    category="system_prompt_leakage",
                    message="Model output contains fragments of internal system instructions",
                    risk_level="medium"
                ))
                sanitized_output = sanitized_output.replace(prompt_snippet, "[SYSTEM_INFO_REDACTED]")

        # PII filtering on output
        if settings.ENABLE_PII_REDACTION:
            for pii_type, (pattern, placeholder) in self.PII_PATTERNS.items():
                if pii_type in ["CREDIT_CARD", "SSN"]:
                    matches = re.findall(pattern, sanitized_output)
                    if matches:
                        sanitized_output = re.sub(pattern, placeholder, sanitized_output)
                        violations.append(GuardrailViolation(
                            category="output_pii",
                            message=f"Redacted sensitive {pii_type} in model response",
                            risk_level="medium"
                        ))

        return True, sanitized_output, [v.to_dict() for v in violations]

guardrails = GuardrailEngine()
