from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional
from app.schemas.simulator import (
    TemporalMoneyTrailResponse,
    InterdictionRequest,
    InterdictionResponse,
)
from app.services.temporal_simulator import (
    get_temporal_money_trail,
    simulate_interdiction,
)

router = APIRouter()


@router.get(
    "/temporal-trail",
    response_model=TemporalMoneyTrailResponse,
    summary="Get chronological 4D money-trail timeline for frontend slider playback"
)
def get_timeline(
    seed_id: str = Query(default="ACCT-US-1001", description="Seed account, alert ID, or entity ID"),
    radius: int = Query(default=2, ge=1, le=4, description="Ego-network hop radius")
):
    """
    Extracts the connected sub-network around a target seed entity and returns
    chronologically ordered transaction events.
    
    Includes cumulative dollar flow, active devices, and running velocity drain percentage
    ideal for frontend timeline scrubber / animation playback.
    """
    try:
        return get_temporal_money_trail(seed_id=seed_id, radius=radius)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate temporal trail: {str(e)}")


@router.post(
    "/interdiction",
    response_model=InterdictionResponse,
    summary="Simulate interdiction blast-radius and capital saved from severing a node"
)
def run_interdiction_simulation(request: InterdictionRequest = Body(...)):
    """
    Calculates the forensic blast radius and business disruption of severing a hardware device,
    IP address, bank account, or customer node:
    - Total Capital At Risk
    - Capital Saved from Reaching High-Risk Sinks
    - Syndicate Disruption Percentage
    - Collateral Benign Damage Assessment
    - Legal & Regulatory Justification Narrative
    """
    try:
        return simulate_interdiction(
            target_node_id=request.target_node_id,
            seed_id=request.seed_id,
            radius=request.radius or 2,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to simulate interdiction: {str(e)}")
