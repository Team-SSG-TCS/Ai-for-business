import time
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Body

from app.schemas.investigation import (
    CaseSummary,
    InvestigationRequest,
    InvestigationResponse,
    NetworkGraphData,
    GraphNode,
    GraphLink,
    AnomalyEvidencePacket,
)
from app.services.anomaly_detector import run_all_anomaly_detections
from app.services.multi_agent_investigator import investigator_service

router = APIRouter()

# =============================================================================
# Rich Demo Datasets (Instantly available for Frontend visualizer & Laptop 1)
# =============================================================================

DEMO_CASES: Dict[str, Dict[str, Any]] = {
    "CASE-2026-8812": {
        "summary": CaseSummary(
            case_id="CASE-2026-8812",
            title="Operation Chimera: Layered Structuring & Mule Drain Network",
            description="Syndicate utilizing a shared emulator device to coordinate sub-$10,000 structuring deposits across 3 mule accounts, drained offshore within 45 minutes.",
            category="FRAUD_RING",
            created_at="2026-10-31T08:00:00Z",
            entity_count=9,
            total_volume=38450.00,
        ),
        "graph": NetworkGraphData(
            case_id="CASE-2026-8812",
            nodes=[
                GraphNode(id="DEV-EMULATOR-X9", label="Rooted Device [X9-EMU]", type="DEVICE", risk_score=95.0, properties={"os": "Android 14 (Rooted)", "model": "Pixel Emulator", "carrier": "None"}),
                GraphNode(id="CUST-8812-01", label="Alice Vance (Mule 1)", type="CUSTOMER", risk_score=88.0, properties={"kyc_tier": "Basic Tier 1", "account_age_days": 14}),
                GraphNode(id="CUST-8812-02", label="Bob Sterling (Mule 2)", type="CUSTOMER", risk_score=85.0, properties={"kyc_tier": "Basic Tier 1", "account_age_days": 21}),
                GraphNode(id="CUST-8812-03", label="Carlos Mendez (Mule 3)", type="CUSTOMER", risk_score=89.0, properties={"kyc_tier": "Basic Tier 1", "account_age_days": 8}),
                GraphNode(id="ACC-8812-A1", label="Chase Checking - *4412", type="BANK_ACCOUNT", risk_score=90.0, properties={"bank": "JPMorgan Chase", "balance": 120.00}),
                GraphNode(id="ACC-8812-B2", label="Wells Fargo - *8819", type="BANK_ACCOUNT", risk_score=87.0, properties={"bank": "Wells Fargo", "balance": 95.00}),
                GraphNode(id="ACC-8812-C3", label="Citi Checking - *1034", type="BANK_ACCOUNT", risk_score=91.0, properties={"bank": "Citibank", "balance": 150.00}),
                GraphNode(id="OFFSHORE-CRYPTO-HK", label="Beneficiary: CryptoGateway HK", type="BENEFICIARY", risk_score=98.0, properties={"jurisdiction": "Hong Kong", "entity_type": "VASP / OTC Desk"}),
                GraphNode(id="IP-TOR-EXIT-5", label="IP 185.220.101.5 (Tor Relay)", type="IP_ADDRESS", risk_score=94.0, properties={"isp": "Tor Exit Node", "country": "Germany"}),
            ],
            links=[
                GraphLink(source="DEV-EMULATOR-X9", target="CUST-8812-01", relation="USED_DEVICE"),
                GraphLink(source="DEV-EMULATOR-X9", target="CUST-8812-02", relation="USED_DEVICE"),
                GraphLink(source="DEV-EMULATOR-X9", target="CUST-8812-03", relation="USED_DEVICE"),
                GraphLink(source="IP-TOR-EXIT-5", target="DEV-EMULATOR-X9", relation="ROUTED_THROUGH"),
                GraphLink(source="CUST-8812-01", target="ACC-8812-A1", relation="OWNS_ACCOUNT"),
                GraphLink(source="CUST-8812-02", target="ACC-8812-B2", relation="OWNS_ACCOUNT"),
                GraphLink(source="CUST-8812-03", target="ACC-8812-C3", relation="OWNS_ACCOUNT"),
                GraphLink(source="ACC-8812-A1", target="OFFSHORE-CRYPTO-HK", relation="TRANSFERRED_TO", amount=9400.00, timestamp="2026-10-31T09:15:00Z", properties={"tx_id": "TX-DRAIN-01", "channel": "Wire"}),
                GraphLink(source="ACC-8812-B2", target="OFFSHORE-CRYPTO-HK", relation="TRANSFERRED_TO", amount=9750.00, timestamp="2026-10-31T09:22:00Z", properties={"tx_id": "TX-DRAIN-02", "channel": "Wire"}),
                GraphLink(source="ACC-8812-C3", target="OFFSHORE-CRYPTO-HK", relation="TRANSFERRED_TO", amount=9550.00, timestamp="2026-10-31T09:30:00Z", properties={"tx_id": "TX-DRAIN-03", "channel": "Wire"}),
            ],
            metadata={"network_type": "MULE_DRAIN_RING", "alert_urgency": "IMMEDIATE"}
        ),
        "transactions": [
            # Inbound Structured Deposits
            {"id": "TX-DEP-01", "amount": 9500.00, "sender_id": "CASH_DEPOSIT", "recipient_id": "ACC-8812-A1", "timestamp": "2026-10-31T08:30:00Z", "type": "deposit"},
            {"id": "TX-DEP-02", "amount": 9800.00, "sender_id": "CASH_DEPOSIT", "recipient_id": "ACC-8812-B2", "timestamp": "2026-10-31T08:42:00Z", "type": "deposit"},
            {"id": "TX-DEP-03", "amount": 9650.00, "sender_id": "CASH_DEPOSIT", "recipient_id": "ACC-8812-C3", "timestamp": "2026-10-31T08:50:00Z", "type": "deposit"},
            {"id": "TX-DEP-04", "amount": 9500.00, "sender_id": "CASH_DEPOSIT", "recipient_id": "ACC-8812-A1", "timestamp": "2026-10-31T09:00:00Z", "type": "deposit"},
            # Rapid Drains within 45 mins (>95% drained)
            {"id": "TX-DRAIN-01", "amount": 9400.00, "sender_id": "ACC-8812-A1", "recipient_id": "OFFSHORE-CRYPTO-HK", "timestamp": "2026-10-31T09:15:00Z", "type": "wire_out"},
            {"id": "TX-DRAIN-02", "amount": 9750.00, "sender_id": "ACC-8812-B2", "recipient_id": "OFFSHORE-CRYPTO-HK", "timestamp": "2026-10-31T09:22:00Z", "type": "wire_out"},
            {"id": "TX-DRAIN-03", "amount": 9550.00, "sender_id": "ACC-8812-C3", "recipient_id": "OFFSHORE-CRYPTO-HK", "timestamp": "2026-10-31T09:30:00Z", "type": "wire_out"},
        ],
        "logins": [
            {"user_id": "CUST-8812-01", "timestamp": "2026-10-31T08:25:00Z", "lat": 40.7128, "lon": -74.0060, "city": "New York, USA", "ip": "185.220.101.5"},
            {"user_id": "CUST-8812-02", "timestamp": "2026-10-31T08:35:00Z", "lat": 40.7128, "lon": -74.0060, "city": "New York, USA", "ip": "185.220.101.5"},
            {"user_id": "CUST-8812-03", "timestamp": "2026-10-31T08:45:00Z", "lat": 40.7128, "lon": -74.0060, "city": "New York, USA", "ip": "185.220.101.5"},
        ]
    },

    "CASE-2026-4409": {
        "summary": CaseSummary(
            case_id="CASE-2026-4409",
            title="Apex Tech Global: High-Velocity End-of-Month Payroll Dispersal",
            description="Verified corporate software consultancy distributing month-end contractor payroll to 6 regional engineering specialists. High velocity alert is an innocent False Positive.",
            category="FALSE_POSITIVE_BENIGN",
            created_at="2026-10-31T07:30:00Z",
            entity_count=8,
            total_volume=29800.00,
        ),
        "graph": NetworkGraphData(
            case_id="CASE-2026-4409",
            nodes=[
                GraphNode(id="CUST-APEX-CORP", label="Apex Tech Global Inc", type="CUSTOMER", risk_score=8.0, properties={"tin": "XX-XXX4192", "jurisdiction": "Delaware, USA", "kyc_status": "Verified Tier 3"}),
                GraphNode(id="ACC-APEX-TREASURY", label="Apex Master Operating Treasury", type="BANK_ACCOUNT", risk_score=10.0, properties={"bank": "Silicon Valley Bank", "balance": 450000.00}),
                GraphNode(id="DEV-APEX-HQ", label="Apex Corp Gateway [HQ-SAML]", type="DEVICE", risk_score=5.0, properties={"hardware": "MacBook Pro Fleet", "mfa": "Okta FIDO2"}),
                GraphNode(id="ACC-ENG-01", label="Contractor: Senior DevOps Lead", type="BANK_ACCOUNT", risk_score=12.0, properties={"role": "Cloud Architect", "vendor_id": "VND-104"}),
                GraphNode(id="ACC-ENG-02", label="Contractor: AI Research Eng", type="BANK_ACCOUNT", risk_score=10.0, properties={"role": "LLM Specialist", "vendor_id": "VND-105"}),
                GraphNode(id="ACC-ENG-03", label="Contractor: Frontend Architect", type="BANK_ACCOUNT", risk_score=9.0, properties={"role": "React UI Lead", "vendor_id": "VND-106"}),
                GraphNode(id="ACC-ENG-04", label="Contractor: QA Automation", type="BANK_ACCOUNT", risk_score=11.0, properties={"role": "SDET Lead", "vendor_id": "VND-107"}),
                GraphNode(id="IP-APEX-STATIC", label="IP 199.16.156.12 (Apex HQ)", type="IP_ADDRESS", risk_score=5.0, properties={"isp": "Apex Dedicated Fiber", "city": "San Francisco, CA"}),
            ],
            links=[
                GraphLink(source="CUST-APEX-CORP", target="ACC-APEX-TREASURY", relation="OWNS_ACCOUNT"),
                GraphLink(source="DEV-APEX-HQ", target="ACC-APEX-TREASURY", relation="AUTHORIZED_PAYMENT"),
                GraphLink(source="IP-APEX-STATIC", target="DEV-APEX-HQ", relation="CONNECTED_FROM"),
                GraphLink(source="ACC-APEX-TREASURY", target="ACC-ENG-01", relation="TRANSFERRED_TO", amount=8500.00, timestamp="2026-10-31T09:00:00Z", properties={"invoice": "INV-2026-OCT-01"}),
                GraphLink(source="ACC-APEX-TREASURY", target="ACC-ENG-02", relation="TRANSFERRED_TO", amount=8200.00, timestamp="2026-10-31T09:02:00Z", properties={"invoice": "INV-2026-OCT-02"}),
                GraphLink(source="ACC-APEX-TREASURY", target="ACC-ENG-03", relation="TRANSFERRED_TO", amount=7100.00, timestamp="2026-10-31T09:04:00Z", properties={"invoice": "INV-2026-OCT-03"}),
                GraphLink(source="ACC-APEX-TREASURY", target="ACC-ENG-04", relation="TRANSFERRED_TO", amount=6000.00, timestamp="2026-10-31T09:05:00Z", properties={"invoice": "INV-2026-OCT-04"}),
            ],
            metadata={"network_type": "COMMERCIAL_PAYROLL_BATCH", "alert_urgency": "ROUTINE"}
        ),
        "transactions": [
            {"id": "TX-PAY-01", "amount": 8500.00, "sender_id": "ACC-APEX-TREASURY", "recipient_id": "ACC-ENG-01", "timestamp": "2026-10-31T09:00:00Z", "type": "ach_credit"},
            {"id": "TX-PAY-02", "amount": 8200.00, "sender_id": "ACC-APEX-TREASURY", "recipient_id": "ACC-ENG-02", "timestamp": "2026-10-31T09:02:00Z", "type": "ach_credit"},
            {"id": "TX-PAY-03", "amount": 7100.00, "sender_id": "ACC-APEX-TREASURY", "recipient_id": "ACC-ENG-03", "timestamp": "2026-10-31T09:04:00Z", "type": "ach_credit"},
            {"id": "TX-PAY-04", "amount": 6000.00, "sender_id": "ACC-APEX-TREASURY", "recipient_id": "ACC-ENG-04", "timestamp": "2026-10-31T09:05:00Z", "type": "ach_credit"},
        ],
        "logins": [
            {"user_id": "CUST-APEX-CORP", "timestamp": "2026-10-31T08:55:00Z", "lat": 37.7749, "lon": -122.4194, "city": "San Francisco, CA", "ip": "199.16.156.12"},
        ]
    },

    "CASE-2026-9034": {
        "summary": CaseSummary(
            case_id="CASE-2026-9034",
            title="GhostSwarm: Device Farm Credential Stuffing & ATO Ring",
            description="Automated credential stuffing device farm hijacking multiple consumer retail accounts with impossible travel velocities and immediate drain.",
            category="ACCOUNT_TAKEOVER",
            created_at="2026-10-31T06:15:00Z",
            entity_count=10,
            total_volume=48900.00,
        ),
        "graph": NetworkGraphData(
            case_id="CASE-2026-9034",
            nodes=[
                GraphNode(id="DEV-GHOST-SWARM-9", label="Farm Device ID [SWARM-99]", type="DEVICE", risk_score=98.0, properties={"imei": "MOD-88319-FAKE", "platform": "NoxPlayer Emulator"}),
                GraphNode(id="VICTIM-CUST-1", label="Victim: David Miller", type="CUSTOMER", risk_score=75.0, properties={"account_status": "Compromised"}),
                GraphNode(id="VICTIM-CUST-2", label="Victim: Elena Rostova", type="CUSTOMER", risk_score=72.0, properties={"account_status": "Compromised"}),
                GraphNode(id="VICTIM-CUST-3", label="Victim: Michael Chang", type="CUSTOMER", risk_score=78.0, properties={"account_status": "Compromised"}),
                GraphNode(id="VICTIM-CUST-4", label="Victim: Sarah Jenkins", type="CUSTOMER", risk_score=74.0, properties={"account_status": "Compromised"}),
                GraphNode(id="LIQUIDATION-WALLET", label="Tether USDT Instant OTC Wallet", type="BENEFICIARY", risk_score=99.0, properties={"blockchain": "Tron TRC-20", "mixer_linked": True}),
                GraphNode(id="IP-NYC", label="IP 72.14.200.1 (New York)", type="IP_ADDRESS", risk_score=40.0, properties={"city": "New York, USA"}),
                GraphNode(id="IP-LONDON", label="IP 81.2.69.142 (London)", type="IP_ADDRESS", risk_score=85.0, properties={"city": "London, UK"}),
            ],
            links=[
                GraphLink(source="DEV-GHOST-SWARM-9", target="VICTIM-CUST-1", relation="USED_DEVICE"),
                GraphLink(source="DEV-GHOST-SWARM-9", target="VICTIM-CUST-2", relation="USED_DEVICE"),
                GraphLink(source="DEV-GHOST-SWARM-9", target="VICTIM-CUST-3", relation="USED_DEVICE"),
                GraphLink(source="DEV-GHOST-SWARM-9", target="VICTIM-CUST-4", relation="USED_DEVICE"),
                GraphLink(source="VICTIM-CUST-1", target="LIQUIDATION-WALLET", relation="TRANSFERRED_TO", amount=9800.00, timestamp="2026-10-31T07:10:00Z"),
                GraphLink(source="VICTIM-CUST-2", target="LIQUIDATION-WALLET", relation="TRANSFERRED_TO", amount=9950.00, timestamp="2026-10-31T07:18:00Z"),
                GraphLink(source="VICTIM-CUST-3", target="LIQUIDATION-WALLET", relation="TRANSFERRED_TO", amount=9450.00, timestamp="2026-10-31T07:25:00Z"),
                GraphLink(source="VICTIM-CUST-4", target="LIQUIDATION-WALLET", relation="TRANSFERRED_TO", amount=9700.00, timestamp="2026-10-31T07:32:00Z"),
            ],
            metadata={"network_type": "ATO_DEVICE_FARM", "alert_urgency": "CRITICAL"}
        ),
        "transactions": [
            # Victim 1
            {"id": "TX-ATO-01", "amount": 9800.00, "sender_id": "VICTIM-CUST-1", "recipient_id": "LIQUIDATION-WALLET", "timestamp": "2026-10-31T07:10:00Z", "type": "instant_drain"},
            # Victim 2
            {"id": "TX-ATO-02", "amount": 9950.00, "sender_id": "VICTIM-CUST-2", "recipient_id": "LIQUIDATION-WALLET", "timestamp": "2026-10-31T07:18:00Z", "type": "instant_drain"},
            # Victim 3
            {"id": "TX-ATO-03", "amount": 9450.00, "sender_id": "VICTIM-CUST-3", "recipient_id": "LIQUIDATION-WALLET", "timestamp": "2026-10-31T07:25:00Z", "type": "instant_drain"},
            # Victim 4
            {"id": "TX-ATO-04", "amount": 9700.00, "sender_id": "VICTIM-CUST-4", "recipient_id": "LIQUIDATION-WALLET", "timestamp": "2026-10-31T07:32:00Z", "type": "instant_drain"},
        ],
        "logins": [
            # Impossible travel: New York to London (5,580 km) in 35 minutes (>9,000 km/h)
            {"user_id": "VICTIM-CUST-1", "timestamp": "2026-10-31T06:30:00Z", "lat": 40.7128, "lon": -74.0060, "city": "New York, USA", "ip": "72.14.200.1"},
            {"user_id": "VICTIM-CUST-1", "timestamp": "2026-10-31T07:05:00Z", "lat": 51.5074, "lon": -0.1278, "city": "London, UK", "ip": "81.2.69.142"},
            {"user_id": "VICTIM-CUST-2", "timestamp": "2026-10-31T06:40:00Z", "lat": 34.0522, "lon": -118.2437, "city": "Los Angeles, USA", "ip": "66.249.66.1"},
            {"user_id": "VICTIM-CUST-2", "timestamp": "2026-10-31T07:15:00Z", "lat": 51.5074, "lon": -0.1278, "city": "London, UK", "ip": "81.2.69.142"},
        ]
    },

    "CASE-2026-1127": {
        "summary": CaseSummary(
            case_id="CASE-2026-1127",
            title="Horizon Imports: Trade-Based Structuring & Smurfing Funnel",
            description="Recurring cash structuring deposits clustered tightly under $10,000 across multiple retail accounts, wired immediately to offshore shell suppliers.",
            category="STRUCTURING_LAYER",
            created_at="2026-10-31T05:00:00Z",
            entity_count=7,
            total_volume=48200.00,
        ),
        "graph": NetworkGraphData(
            case_id="CASE-2026-1127",
            nodes=[
                GraphNode(id="HORIZON-IMPORTS", label="Horizon Import Corp", type="MERCHANT", risk_score=89.0),
                GraphNode(id="BRANCH-ACC-1", label="Branch Account East", type="BANK_ACCOUNT", risk_score=85.0),
                GraphNode(id="BRANCH-ACC-2", label="Branch Account West", type="BANK_ACCOUNT", risk_score=84.0),
                GraphNode(id="OFFSHORE-PANAMA-WIRE", label="Beneficiary: Panama Trade Corp", type="BENEFICIARY", risk_score=94.0),
            ],
            links=[
                GraphLink(source="HORIZON-IMPORTS", target="BRANCH-ACC-1", relation="OPERATES"),
                GraphLink(source="HORIZON-IMPORTS", target="BRANCH-ACC-2", relation="OPERATES"),
                GraphLink(source="BRANCH-ACC-1", target="OFFSHORE-PANAMA-WIRE", relation="TRANSFERRED_TO", amount=19200.00),
                GraphLink(source="BRANCH-ACC-2", target="OFFSHORE-PANAMA-WIRE", relation="TRANSFERRED_TO", amount=19400.00),
            ],
            metadata={"network_type": "TRADE_BASED_STRUCTURING"}
        ),
        "transactions": [
            {"id": "TX-STR-H1", "amount": 9600.00, "sender_id": "CASH_COUNTER", "recipient_id": "BRANCH-ACC-1", "timestamp": "2026-10-31T05:10:00Z"},
            {"id": "TX-STR-H2", "amount": 9600.00, "sender_id": "CASH_COUNTER", "recipient_id": "BRANCH-ACC-1", "timestamp": "2026-10-31T05:15:00Z"},
            {"id": "TX-STR-H3", "amount": 9700.00, "sender_id": "CASH_COUNTER", "recipient_id": "BRANCH-ACC-2", "timestamp": "2026-10-31T05:20:00Z"},
            {"id": "TX-STR-H4", "amount": 9700.00, "sender_id": "CASH_COUNTER", "recipient_id": "BRANCH-ACC-2", "timestamp": "2026-10-31T05:25:00Z"},
            {"id": "TX-STR-H5", "amount": 9600.00, "sender_id": "CASH_COUNTER", "recipient_id": "BRANCH-ACC-2", "timestamp": "2026-10-31T05:30:00Z"},
        ],
        "logins": []
    }
}


# =============================================================================
# API Endpoints
# =============================================================================

@router.get("/cases", response_model=List[CaseSummary], summary="List all forensic investigation demo cases")
async def list_cases():
    """
    Returns all demo cases for the frontend visualizer.
    Enables instant frontend testing across Fraud Rings, Benign False Positives, and ATO Networks.
    """
    return [c["summary"] for c in DEMO_CASES.values()]


@router.get("/{case_id}/graph", response_model=NetworkGraphData, summary="Get network visualizer graph for a case")
async def get_case_graph(case_id: str):
    """
    Returns nodes & links format compatible with D3, ForceGraph, Cytoscape, or custom React canvas visualizers.
    """
    if case_id not in DEMO_CASES:
        raise HTTPException(
            status_code=404,
            detail=f"Case '{case_id}' not found. Available cases: {list(DEMO_CASES.keys())}"
        )
    return DEMO_CASES[case_id]["graph"]


@router.post("/{case_id}/run", response_model=InvestigationResponse, summary="Run forensic anomaly detection & multi-agent investigation on a case")
async def run_investigation(
    case_id: str,
    request: Optional[InvestigationRequest] = Body(default=None)
):
    """
    Full Forensic Multi-Agent Pipeline Execution:
    1. Anomaly Detection Engine: Inspects structuring, rapid drain, device swarms, and geo-velocity.
    2. Agent 1 (Prosecution): Formulates primary illicit theory with exact citations.
    3. Agent 2 (Devil's Advocate / Defense): Evaluates innocent counter-explanations for False-Positive Control.
    4. Agent 3 (Compliance Adjudicator): Computes calibrated Dual Scores and generates FinCEN-style SAR narrative.
    5. Agent 4 (Action Planner): Formulates 4-5 concrete next investigative steps for human compliance officers.
    """
    start_time = time.perf_counter()

    # Determine input data: custom graph/transactions if supplied, else lookup from demo cases
    case_data = DEMO_CASES.get(case_id)
    if not case_data and not (request and request.custom_graph):
        raise HTTPException(
            status_code=404,
            detail=f"Case '{case_id}' not found and no custom graph was provided. Available cases: {list(DEMO_CASES.keys())}"
        )

    # Resolve case summary
    if case_data:
        case_summary = case_data["summary"]
        graph_data = (request and request.custom_graph) or case_data["graph"]
        txs = (request and request.custom_transactions) or case_data["transactions"]
        logs = (request and request.custom_logins) or case_data["logins"]
    else:
        case_summary = CaseSummary(
            case_id=case_id,
            title=f"Ad-hoc Investigation: {case_id}",
            description="Dynamic case loaded from external graph constructor (Laptop 1)",
            category="CUSTOM_INVESTIGATION",
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            entity_count=len(request.custom_graph.nodes) if request and request.custom_graph else 0,
            total_volume=0.0
        )
        graph_data = request.custom_graph
        txs = request.custom_transactions or []
        logs = request.custom_logins or []

    provider = (request.provider if request else "auto") or "auto"

    # Step 1: Execute Forensic Anomaly Engine
    anomaly_packet = run_all_anomaly_detections(
        case_id=case_id,
        graph_data=graph_data,
        transactions=txs,
        logins=logs
    )

    # Step 2: Execute Multi-Agent Reasoning Pipeline
    prosecution, defense, adjudication, human_plan, model_used, fallback_used = await investigator_service.investigate(
        case_summary=case_summary,
        anomaly_packet=anomaly_packet,
        graph_data=graph_data,
        provider=provider,
    )

    elapsed_ms = int((time.perf_counter() - start_time) * 1000)

    return InvestigationResponse(
        success=True,
        case_summary=case_summary,
        graph=graph_data,
        anomaly_packet=anomaly_packet,
        prosecution=prosecution,
        defense=defense,
        adjudication=adjudication,
        human_action_plan=human_plan,
        execution_time_ms=elapsed_ms,
        model_used=model_used,
        offline_fallback_used=fallback_used,
    )


@router.post("/run", response_model=InvestigationResponse, summary="Run ad-hoc investigation on custom graph/transactions")
async def run_custom_investigation(request: InvestigationRequest):
    """
    Direct endpoint for Laptop 1's graph builder to post arbitrary NetworkX or custom graph payloads.
    """
    case_id = request.case_id or f"CUSTOM-{int(time.time())}"
    return await run_investigation(case_id=case_id, request=request)



@router.post("/scan-dataset", summary="Autonomously scan entire enterprise dataset, discover anomalies, and plan fixes")
def scan_dataset_for_anomalies():
    from app.services.dataset_analyzer import dataset_analysis_engine
    return dataset_analysis_engine.scan_entire_dataset()

@router.post("/remediate", summary="Execute compliance remediation fix on an anomalous entity")
def apply_remediation_fix(payload: Dict[str, str] = Body(...)):
    from app.services.dataset_analyzer import dataset_analysis_engine
    action_id = payload.get("action_id", "ACT-001")
    action_type = payload.get("action_type", "FREEZE_ACCOUNT")
    target_entity = payload.get("target_entity", "")
    if not target_entity:
        raise HTTPException(status_code=400, detail="target_entity is required")
    return dataset_analysis_engine.execute_remediation_fix(action_id, action_type, target_entity)

@router.get("/remediation-audit", summary="Get audit trail of all applied compliance remediation fixes")
def get_remediation_audit():
    from app.services.dataset_analyzer import dataset_analysis_engine
    return dataset_analysis_engine.remediation_audit_log
