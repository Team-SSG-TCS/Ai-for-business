from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class TemporalFrame(BaseModel):
    step_number: int = Field(..., description="Chronological sequence index (1-based)")
    timestamp: str = Field(..., description="ISO 8601 timestamp of transaction event")
    tx_id: Optional[str] = Field(None, description="Unique transaction ID")
    from_node: str = Field(..., description="Sender account or external source node ID")
    to_node: str = Field(..., description="Recipient account, merchant, or beneficiary node ID")
    amount: float = Field(..., description="Transaction amount")
    currency: str = Field("USD", description="Currency code")
    running_balance_drain_pct: float = Field(..., description="Cumulative velocity-to-drain percentage across target cluster")
    active_devices: List[str] = Field(default_factory=list, description="Hardware devices involved in this event")
    active_ips: List[str] = Field(default_factory=list, description="IP addresses involved in this event")
    cumulative_flow: float = Field(..., description="Running total dollar volume transferred up to this step")
    tx_type: Optional[str] = Field("TRANSFER", description="Transaction classification: DEPOSIT, TRANSFER, PURCHASE, etc.")
    description: Optional[str] = Field("", description="Transaction memo or narrative description")


class TemporalMoneyTrailResponse(BaseModel):
    seed_id: str = Field(..., description="Seed entity or alert ID")
    total_frames: int = Field(..., description="Total count of chronological flow frames")
    total_cumulative_volume: float = Field(..., description="Total dollar volume across the timeline")
    start_time: Optional[str] = Field(None, description="First transaction timestamp")
    end_time: Optional[str] = Field(None, description="Latest transaction timestamp")
    participating_nodes: List[str] = Field(default_factory=list, description="All unique entities involved in the money trail")
    frames: List[TemporalFrame] = Field(default_factory=list, description="Ordered timeline frames for slider playback")


class InterdictionRequest(BaseModel):
    target_node_id: str = Field(..., description="Node ID to sever/freeze (device, account, IP, customer)")
    seed_id: str = Field(..., description="Context seed entity or alert ID to anchor the blast radius analysis")
    radius: Optional[int] = Field(2, ge=1, le=4, description="Ego subgraph radius for blast radius assessment")


class InterdictionResponse(BaseModel):
    target_node_id: str = Field(..., description="Severed entity identifier")
    interdiction_status: str = Field("SIMULATED_SEVERED", description="Simulation status")
    total_capital_at_risk: float = Field(..., description="Total suspicious volume flowing through the unsevered subnetwork")
    capital_saved: float = Field(..., description="Estimated dollar volume intercepted from reaching ultimate sinks")
    remaining_illicit_flow: float = Field(0.0, description="Residual illicit volume that still escapes post-interdiction")
    syndicate_disruption_pct: float = Field(..., description="Percentage of illicit flow successfully severed (0-100)")
    collateral_benign_impact_pct: float = Field(..., description="Percentage of legitimate/innocent entities disrupted (0-100)")
    interdiction_efficiency_score: float = Field(..., description="Ratio of criminal disruption to collateral benign impact")
    severed_accounts: List[str] = Field(default_factory=list, description="Bank accounts immobilized by this interdiction")
    severed_nodes: List[str] = Field(default_factory=list, description="All graph nodes effectively severed or isolated")
    regulatory_justification: str = Field(..., description="Legally articulate BSA/AML rationale for the action")
