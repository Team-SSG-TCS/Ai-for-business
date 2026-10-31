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


// =============================================================================
// Financial Crime & LangGraph Investigation Types
// =============================================================================

export interface EvidenceItemDTO {
  type?: string;
  evidence_type?: string;
  severity: string;
  description: string;
  tx_id?: string;
  amount?: number;
  timestamp?: string;
  evidence_txs?: string[];
  statutory_violation?: string;
}

export interface ProsecutionHypothesisDTO {
  theory: string;
  crime_typology: string;
  prosecution_confidence: number;
  evidence_count: number;
  primary_statute?: string;
  supporting_evidence?: string[];
}

export interface DefenseHypothesisDTO {
  counter_theory: string;
  innocent_plausibility: number;
  benign_classification?: string;
  alternative_hypotheses?: Array<{ name: string; probability: number; status: string; notes?: string }>;
}

export interface AdjudicationDTO {
  verdict: string;
  risk_score: number;
  legitimacy_score: number;
  recommended_action: string;
  investigator_signoff_required: boolean;
}

export interface SarReportDTO {
  narrative: string;
  total_evidence_citations: number;
}

export interface RemediationStatusDTO {
  status: string;
  action: string;
  target: string;
  message: string;
}

export interface LangGraphInvestigationResult {
  success: boolean;
  thread_id?: string;
  seed_id: string;
  seed_type: string;
  stage: string;
  profile?: Record<string, any>;
  network_summary?: {
    node_count?: number;
    edge_count?: number;
    total_subgraph_flow_volume?: number;
    most_central_hub?: string;
    centrality_score?: number;
    nodes?: Array<{ id: string; label: string; type: string; risk?: string }>;
    links?: Array<{ source: string; target: string; relation: string; amount?: number; timestamp?: string }>;
  };
  structuring_velocity?: {
    account_id?: string;
    structuring_detected?: boolean;
    structuring_findings?: Array<any>;
    rapid_drain_detected?: boolean;
    rapid_drain_findings?: Array<any>;
  };
  swarm_telemetry?: {
    cluster_id?: string;
    cluster_size?: number;
    linked_accounts?: string[];
    shared_devices?: string[];
    proxy_ips?: string[];
    risk_factors?: string[];
  };
  benign_context?: {
    is_benign_cluster?: boolean;
    infrastructure_type?: string;
    public_nat_detected?: boolean;
    confidence?: number;
  };
  prosecution: ProsecutionHypothesisDTO;
  defense: DefenseHypothesisDTO;
  adjudication: AdjudicationDTO;
  sar_report: SarReportDTO;
  remediation: RemediationStatusDTO;
  evidence_count: number;
  evidence_items: EvidenceItemDTO[];
}

export interface GraphNodeDTO {
  id: string;
  label: string;
  type: string;
  risk_level: string;
  properties?: Record<string, unknown>;
}

export interface GraphLinkDTO {
  source: string;
  target: string;
  relation: string;
  amount?: number;
  timestamp?: string;
  tx_id?: string;
}

export interface SubgraphResponseDTO {
  case_id: string;
  nodes: GraphNodeDTO[];
  links: GraphLinkDTO[];
  metrics: {
    subgraph_nodes: number;
    subgraph_edges: number;
    seed_node: string;
    subgraph_volume_usd: number;
    most_central_hub: string;
    centrality_score: number;
  };
}
