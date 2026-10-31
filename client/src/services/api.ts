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
  profile: {
    customer_name: 'Vikram Mehra / Primary Subject',
    bank: 'HDFC Bank',
    account_type: 'Checking',
    kyc_status: 'VERIFIED'
  },
  network_summary: {
    node_count: 10,
    edge_count: 13,
    total_subgraph_flow_volume: 48517.40,
    most_central_hub: 'ACCT-US-1001',
    centrality_score: 0.88,
    nodes: [
      { id: 'ACCT-US-1001', label: 'Vikram Mehra (ACC-9004)', type: 'account', risk: 'Critical' },
      { id: 'ACCT-US-1002', label: 'Priya Sharma (ACC-9019)', type: 'account', risk: 'High' },
      { id: 'ACCT-US-1003', label: 'Amit Verma (ACC-9042)', type: 'account', risk: 'High' },
      { id: 'ACCT-US-1004', label: 'Ramesh Chawla (ACC-9088)', type: 'account', risk: 'Medium' },
      { id: 'DEV-F8821', label: 'Android Emulator DEV-F8821', type: 'device', risk: 'Critical' },
      { id: 'IP-TOR-01', label: 'Tor Relay 185.220.101.45', type: 'ip', risk: 'High' },
      { id: 'MER-301', label: 'Zaveri Bullion Mumbai', type: 'merchant', risk: 'Medium' }
    ],
    links: [
      { source: 'EXTERNAL_WIRE', target: 'ACCT-US-1001', relation: 'INWARD_DEPOSIT', amount: 1000000, timestamp: '2026-10-28 04:12 IST' },
      { source: 'ACCT-US-1001', target: 'ACCT-US-1002', relation: 'FUND_SPLIT_IMPS', amount: 500000, timestamp: '2026-10-28 04:26 IST' },
      { source: 'ACCT-US-1001', target: 'ACCT-US-1003', relation: 'FUND_SPLIT_RTGS', amount: 500000, timestamp: '2026-10-28 04:28 IST' },
      { source: 'ACCT-US-1002', target: 'MER-301', relation: 'LIQUIDATION_BULLION', amount: 350000, timestamp: '2026-10-28 04:31 IST' },
      { source: 'ACCT-US-1003', target: 'ACCT-US-1004', relation: 'INTERMEDIARY_UPI', amount: 350000, timestamp: '2026-10-28 04:33 IST' },
      { source: 'ACCT-US-1004', target: 'ACCT-US-1001', relation: 'CIRCULAR_RETURN', amount: 150000, timestamp: '2026-10-28 04:37 IST' }
    ]
  },
  structuring_velocity: {
    account_id: 'ACCT-US-1001',
    structuring_detected: true,
    structuring_findings: [
      {
        type: 'FIU_IND_CTR_STRUCTURING',
        severity: 'CRITICAL',
        total_amount: 1000000,
        count: 2,
        description: 'Coordinated threshold evasion structuring inward wire funds into split accounts.'
      }
    ],
    rapid_drain_detected: true,
    rapid_drain_findings: [
      {
        type: 'RAPID_MULE_DRAIN',
        account_id: 'ACCT-US-1001',
        inbound_amount: 1000000,
        outbound_amount: 980000,
        drain_percentage: 98.0,
        time_to_drain_minutes: 18,
        description: 'Account ACCT-US-1001 evacuated 98.0% of funds within 18 minutes to downstream mules.'
      }
    ]
  },
  swarm_telemetry: {
    cluster_id: 'CLUSTER-001',
    cluster_size: 4,
    linked_accounts: ['ACCT-US-1001', 'ACCT-US-1002', 'ACCT-US-1003', 'ACCT-US-1004'],
    shared_devices: ['DEV-F8821 (IMEI: 869402049182910)'],
    proxy_ips: ['185.220.101.45 (Tor Exit Relay)'],
    risk_factors: ['SHARED_IMEI_HARDWARE_COLLISION', 'TOR_EXIT_NODE_BURST', 'HIGH_VELOCITY_DRAIN']
  },
  benign_context: {
    is_benign_cluster: false,
    infrastructure_type: 'ANONYMIZED_EMULATOR_FARM',
    public_nat_detected: false,
    confidence: 0.92
  },
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
