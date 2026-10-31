from typing import List, Dict, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field


class CaseCategory(str, Enum):
    FRAUD_RING = "FRAUD_RING"
    FALSE_POSITIVE_BENIGN = "FALSE_POSITIVE_BENIGN"
    ACCOUNT_TAKEOVER = "ACCOUNT_TAKEOVER"
    MONEY_MULE_NETWORK = "MONEY_MULE_NETWORK"
    STRUCTURING_LAYER = "STRUCTURING_LAYER"
    MERCHANT_COLLUSION = "MERCHANT_COLLUSION"


class RiskLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class EntityType(str, Enum):
    CUSTOMER = "CUSTOMER"
    BANK_ACCOUNT = "BANK_ACCOUNT"
    MERCHANT = "MERCHANT"
    DEVICE = "DEVICE"
    IP_ADDRESS = "IP_ADDRESS"
    BENEFICIARY = "BENEFICIARY"
    LOCATION = "LOCATION"
    TRANSACTION = "TRANSACTION"


class EvidenceType(str, Enum):
    STRUCTURING = "STRUCTURING"
    RAPID_DRAIN = "RAPID_DRAIN"
    DEVICE_SWARM = "DEVICE_SWARM"
    IMPOSSIBLE_TRAVEL = "IMPOSSIBLE_TRAVEL"
    GRAPH_CYCLE = "GRAPH_CYCLE"
    HIGH_VELOCITY = "HIGH_VELOCITY"
    SYNTHETIC_IDENTITY = "SYNTHETIC_IDENTITY"


class CaseSummary(BaseModel):
    case_id: str = Field(..., description="Unique case identifier")
    title: str = Field(..., description="Short title describing the case")
    description: str = Field(..., description="Summary overview of the network investigation")
    category: str = Field(..., description="Category: FRAUD_RING, FALSE_POSITIVE_BENIGN, etc.")
    created_at: Optional[str] = Field(None, description="ISO timestamp of case creation")
    entity_count: Optional[int] = Field(None, description="Total number of entities in the network")
    total_volume: Optional[float] = Field(None, description="Total monetary transaction volume under review")


class DualScore(BaseModel):
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Probability of illicit financial crime activity (0-100)")
    legitimacy_score: float = Field(..., ge=0.0, le=100.0, description="Plausibility of innocent or legitimate commercial explanation (0-100)")
    risk_level: str = Field(..., description="Classification: CRITICAL, HIGH, MEDIUM, LOW")
    confidence_score: Optional[float] = Field(90.0, ge=0.0, le=100.0, description="Confidence level of adjudication engine")
    adjudication_summary: Optional[str] = Field(None, description="Brief justification for the dual-score balance")


class EvidenceItem(BaseModel):
    tx_id: Optional[str] = Field(None, description="Associated transaction ID if applicable")
    amount: Optional[float] = Field(None, description="Monetary amount involved in the evidence item")
    timestamp: Optional[str] = Field(None, description="Exact timestamp or time window of evidence event")
    entity_id: Optional[str] = Field(None, description="Entity identifier (account, device, ip, user)")
    evidence_type: str = Field(..., description="Evidence classification: STRUCTURING, RAPID_DRAIN, DEVICE_SWARM, etc.")
    description: str = Field(..., description="Specific factual finding with exact metrics")
    severity: Optional[str] = Field("HIGH", description="Severity weight: CRITICAL, HIGH, MEDIUM, LOW")


class AlternativeExplanation(BaseModel):
    hypothesis: str = Field(..., description="Innocent or benign alternative theory")
    plausibility_score: float = Field(..., ge=0.0, le=100.0, description="Plausibility rating (0-100)")
    supporting_factors: List[str] = Field(default_factory=list, description="Factual factors supporting this benign theory")
    why_unlikely: str = Field(..., description="Forensic counter-evidence explaining why this benign hypothesis fails or holds")


class SARReport(BaseModel):
    narrative: str = Field(..., description="Formal FinCEN-style Suspicious Activity Report narrative")
    typologies_identified: List[str] = Field(default_factory=list, description="Identified financial crime typologies")
    human_action_checklist: List[str] = Field(default_factory=list, description="Specific human investigator checklist items")
    fincen_xml_reference: Optional[str] = Field(None, description="Generated FinCEN BSA reference code")
    recommended_action: Optional[str] = Field("FILE_SAR", description="Recommended action: FILE_SAR, CLOSE_FALSE_POSITIVE, EDD_REQUIRED")


# Visual Graph Representation for Frontend
class GraphNode(BaseModel):
    id: str = Field(..., description="Unique entity ID")
    label: str = Field(..., description="Display label or entity name")
    type: str = Field(..., description="Node type: CUSTOMER, BANK_ACCOUNT, MERCHANT, DEVICE, IP_ADDRESS, BENEFICIARY, LOCATION")
    risk_score: Optional[float] = Field(0.0, description="Individual node suspicion score (0-100)")
    properties: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Custom metadata for tooltip/inspector")


class GraphLink(BaseModel):
    source: str = Field(..., description="Source node id")
    target: str = Field(..., description="Target node id")
    relation: str = Field(..., description="Relationship type: TRANSFERRED_TO, USED_DEVICE, LOGGED_IN_FROM, OWNS_ACCOUNT")
    amount: Optional[float] = Field(None, description="Transaction amount if edge represents financial flow")
    timestamp: Optional[str] = Field(None, description="Timestamp of interaction")
    properties: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Metadata such as channel, velocity, tx_id")


class NetworkGraphData(BaseModel):
    case_id: str
    nodes: List[GraphNode] = Field(default_factory=list)
    links: List[GraphLink] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


# Anomaly Engine Packets
class AnomalyEvidencePacket(BaseModel):
    case_id: str
    structuring_findings: List[Dict[str, Any]] = Field(default_factory=list)
    rapid_drain_findings: List[Dict[str, Any]] = Field(default_factory=list)
    device_swarm_findings: List[Dict[str, Any]] = Field(default_factory=list)
    geo_velocity_findings: List[Dict[str, Any]] = Field(default_factory=list)
    evidence_items: List[EvidenceItem] = Field(default_factory=list)
    raw_metrics: Dict[str, Any] = Field(default_factory=dict)


# Multi-Agent Theory Outputs
class ProsecutionTheory(BaseModel):
    theory: str = Field(..., description="Primary illicit theory formulated by Agent 1")
    primary_typology: str = Field(..., description="Lead typology classification")
    evidence_citations: List[str] = Field(default_factory=list, description="Citations referencing specific transactions & entities")
    estimated_illicit_volume: float = Field(0.0, description="Calculated proceeds of suspicious activity")
    confidence: float = Field(..., ge=0.0, le=100.0)


class DefenseTheory(BaseModel):
    primary_counter_hypothesis: str = Field(..., description="Innocent counter-argument formulated by Agent 2")
    plausibility: float = Field(..., ge=0.0, le=100.0)
    alternative_explanations: List[AlternativeExplanation] = Field(default_factory=list)
    reasons_benign: List[str] = Field(default_factory=list)


class AdjudicationResult(BaseModel):
    dual_score: DualScore
    verdict: str = Field(..., description="Adjudication summary verdict")
    sar_report: SARReport


# API Top-Level Request & Response
class InvestigationRequest(BaseModel):
    case_id: Optional[str] = Field(None, description="Existing case ID to investigate")
    custom_graph: Optional[NetworkGraphData] = Field(None, description="Optional custom graph provided by Laptop 1 or user")
    custom_transactions: Optional[List[Dict[str, Any]]] = Field(None, description="Optional raw transactions")
    custom_logins: Optional[List[Dict[str, Any]]] = Field(None, description="Optional login events for impossible travel")
    provider: Optional[str] = Field("auto", description="LLM provider: auto, gemini, groq, mock")
    temperature: Optional[float] = Field(0.2, ge=0.0, le=1.0)


class InvestigationResponse(BaseModel):
    success: bool = True
    case_summary: CaseSummary
    graph: Optional[NetworkGraphData] = None
    anomaly_packet: AnomalyEvidencePacket
    prosecution: ProsecutionTheory
    defense: DefenseTheory
    adjudication: AdjudicationResult
    human_action_plan: List[str]
    execution_time_ms: int
    model_used: str
    offline_fallback_used: bool = False

