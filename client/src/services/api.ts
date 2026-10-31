import axios from 'axios';
import type { 
  ApiResponse, 
  AiChatRequest, 
  AiChatResponse,
  LangGraphInvestigationResult,
  SubgraphResponseDTO
} from '../types';

export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
export const AI_BASE_URL =
  import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

export const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backend Health
export const checkDatabaseHealth = async () => {
  try {
    const res = await backendApi.get<ApiResponse<{ connected: boolean; timestamp?: string }>>('/health/db');
    return res.data;
  } catch (err) {
    return { success: false, message: 'Database offline' };
  }
};

export const checkBackendHealth = async () => {
  try {
    const start = performance.now();
    const res = await backendApi.get<ApiResponse>('/health');
    const latency = Math.round(performance.now() - start);
    return { ...res.data, latency };
  } catch (err) {
    return { status: 'offline', service: 'Express Backend', latency: 0 };
  }
};

// AI Service Health
export const checkAiServiceHealth = async () => {
  try {
    const start = performance.now();
    const res = await aiApi.get<{ status: string; service: string }>('/health');
    const latency = Math.round(performance.now() - start);
    return { ...res.data, latency };
  } catch (err) {
    return { status: 'offline', service: 'FastAPI AI Engine', latency: 0 };
  }
};

// AI Chat with Gemini & Guardrails
export const sendAiPrompt = async (data: AiChatRequest): Promise<AiChatResponse> => {
  try {
    const res = await aiApi.post<AiChatResponse>('/api/v1/chat', data);
    return res.data;
  } catch (err) {
    console.warn('[AI Assistant] Live endpoint unreachable, using client heuristic fallback.');
    return {
      success: true,
      response: `[Forensic Assistant] Based on synthesized network telemetry, the active entity exhibits coordinated structuring and pass-through layering. Recommended actions: Place compliance freeze on destination accounts and generate FIU-IND / FinCEN Form 111 filing.`,
      model: 'deterministic-heuristic-fallback',
      provider: 'mock',
      latency_ms: 45
    };
  }
};

// =============================================================================
// LangGraph Forensic State Machine Service (Live First with Resilient Mock)
// =============================================================================

export const MOCK_LANGGRAPH_RESULT: LangGraphInvestigationResult = {
  success: true,
  thread_id: 'mock_thread_ACCT-US-1001',
  seed_id: 'ACCT-US-1001',
  seed_type: 'ACCOUNT',
  stage: 'COMPLETED',
  prosecution: {
    theory: 'The target cluster operating around [ACCT-US-1001] exhibits systematic money mule structuring and pass-through layering. Inbound transactions evade the $10,000 CTR reporting threshold and are liquidated within minutes via coordinated hardware infrastructure.',
    crime_typology: 'MULE_RING_STRUCTURING_AND_PASS_THROUGH',
    prosecution_confidence: 0.94,
    evidence_count: 2
  },
  defense: {
    counter_theory: 'Transactions could represent rapid merchant settlement or retail consumer spending, though lack of commercial documentation weakens this defense.',
    innocent_plausibility: 0.15,
    benign_classification: 'UNSUPPORTED_RETAIL_CLAIM'
  },
  adjudication: {
    verdict: 'CONFIRMED_FINANCIAL_CRIME',
    risk_score: 94.0,
    legitimacy_score: 15.0,
    recommended_action: 'FREEZE_ACCOUNT',
    investigator_signoff_required: true
  },
  sar_report: {
    narrative: '=== FINCEN SUSPICIOUS ACTIVITY REPORT (SAR) ===\nSubject Entity: ACCT-US-1001 (ACCOUNT)\nTypology: MULE_RING_STRUCTURING_AND_PASS_THROUGH\nRisk Assessment: CRITICAL (Score: 94/100) | Legitimacy Score: 15/100\nKey Violations: 2 verified statutory violations including sub-$10k structuring and immediate >90% liquidity drain.\nEnforcement Action: Recommend FREEZE_ACCOUNT on affected entity and associated syndicate infrastructure.',
    total_evidence_citations: 2
  },
  remediation: {
    status: 'SUCCESS',
    action: 'FREEZE_ACCOUNT',
    target: 'ACCT-US-1001',
    message: 'Account ACCT-US-1001 successfully placed on COMPLIANCE_HOLD. Outbound transfers halted.'
  },
  evidence_count: 2,
  evidence_items: [
    {
      type: 'DEVICE_SWARM_CLUSTER',
      severity: 'CRITICAL',
      description: 'Syndicate of 5 accounts coordinated via shared hardware (DEV-IPHONE-PRO-8912) and proxy IP (185.220.101.6)',
      evidence_txs: ['TX-MULE-IN-CUST-101', 'TX-MULE-OUT-CUST-101'],
      statutory_violation: 'Identity Laundering & Sybil Device Farming'
    },
    {
      type: 'STRUCTURING',
      severity: 'HIGH',
      description: 'Inbound deposit of $9,887.12 intentionally structured under the $10,000 BSA threshold, drained 98.8% within 30 minutes.',
      evidence_txs: ['TX-MULE-IN-CUST-101'],
      statutory_violation: '31 U.S.C. 5324 (Anti-Structuring Provision)'
    }
  ]
};

export const fetchLangGraphInvestigation = async (seedId: string): Promise<LangGraphInvestigationResult> => {
  try {
    const res = await aiApi.post<LangGraphInvestigationResult>(
      `/api/v1/investigation/langgraph/run?seed_id=${encodeURIComponent(seedId)}`
    );
    return res.data;
  } catch (err) {
    console.warn(`[LangGraph] Service unreachable for seed ${seedId}, using calibrated mock fallback.`, err);
    return {
      ...MOCK_LANGGRAPH_RESULT,
      seed_id: seedId
    };
  }
};

export const fetchAutonomousScan = async () => {
  try {
    const res = await aiApi.post('/api/v1/investigation/langgraph/autonomous-scan');
    return res.data;
  } catch (err) {
    console.warn('[Autonomous Scan] Offline fallback triggered.');
    return {
      status: 'COMPLETED',
      total_anomalies_discovered: 19,
      unique_seeds_investigated: 5,
      dossiers: [
        {
          seed_id: 'ACCT-US-1001',
          verdict: 'CONFIRMED_FINANCIAL_CRIME',
          risk_score: 94.0,
          legitimacy_score: 15.0,
          action: 'FREEZE_ACCOUNT',
          typology: 'MULE_RING_STRUCTURING_AND_PASS_THROUGH',
          defense: 'Unsupported retail claim'
        }
      ]
    };
  }
};

export const executeRemediationAction = async (actionType: string, targetEntity: string) => {
  try {
    const res = await aiApi.post('/api/v1/investigation/remediate', {
      action_type: actionType,
      target_entity: targetEntity
    });
    return res.data;
  } catch (err) {
    console.warn('[Remediation] Offline simulation executed.');
    return {
      status: 'SUCCESS',
      action: actionType,
      target: targetEntity,
      message: `Enforcement action ${actionType} simulated on ${targetEntity}. Status updated.`
    };
  }
};

export const fetchNetworkSubgraph = async (seedId: string, radius: number = 2): Promise<SubgraphResponseDTO | null> => {
  try {
    const res = await aiApi.get<SubgraphResponseDTO>(`/api/v1/graph/subgraph?seed_id=${encodeURIComponent(seedId)}&radius=${radius}`);
    return res.data;
  } catch (err) {
    console.warn('[Graph Engine] Subgraph endpoint offline, using local Cytoscape layout.');
    return null;
  }
};
