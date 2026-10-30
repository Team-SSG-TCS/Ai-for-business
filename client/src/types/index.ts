export interface ServiceHealth {
  status: 'online' | 'offline' | 'checking' | 'error';
  service: string;
  url: string;
  latency?: number;
  message?: string;
  details?: Record<string, unknown>;
}

export interface DbStatus {
  connected: boolean;
  timestamp?: string;
  version?: string;
  error?: string;
}

export interface GuardrailViolation {
  category: string;
  message: string;
  risk_level: string;
}

export interface GuardrailReport {
  is_safe: boolean;
  risk_score: number;
  violations: GuardrailViolation[];
  sanitized_input: string;
  sanitized_output?: string;
}

export interface AiChatRequest {
  prompt: string;
  system_prompt?: string;
  provider?: 'auto' | 'gemini' | 'groq' | 'deepseek' | 'mock';
  model?: string;
  temperature?: number;
  enable_guardrails?: boolean;
  preset?: 'business_assistant' | 'pitch_deck' | 'data_analyst' | 'code_expert';
}

export interface AiChatResponse {
  success: boolean;
  response: string;
  model: string;
  provider: string;
  latency_ms: number;
  fallback_triggered?: boolean;
  fallback_reason?: string;
  guardrails?: GuardrailReport;
  tokens_used?: number;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
