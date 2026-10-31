from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.services.enterprise_dataset import get_master_database
from app.services.graph_engine import (
    get_or_build_master_graph, extract_investigation_subgraph
)
from app.services.entity_resolver import resolve_enterprise_entities
from app.schemas.financial_graph import GraphData, ResolvedCluster

router = APIRouter()

@router.get("/alerts", summary="List enterprise alerts triggered across master dataset")
def get_enterprise_alerts() -> List[Dict[str, Any]]:
    """
    Returns the real-time queue of triggered alerts in the enterprise database.
    Investigators click on any alert to launch a network investigation.
    """
    db = get_master_database()
    return db.alerts

@router.get("/network/stats", summary="Get master enterprise network statistics")
def get_master_network_stats() -> Dict[str, Any]:
    """
    Returns top-level metrics for the entire enterprise dataset (nodes, edges, volume).
    """
    _, master_data = get_or_build_master_graph()
    return master_data.metrics

@router.get("/network/full", response_model=GraphData, summary="Get full master enterprise graph")
def get_full_master_network():
    """
    Returns the complete master enterprise knowledge graph (for global visualization).
    """
    _, master_data = get_or_build_master_graph()
    return master_data

@router.get("/subgraph/{seed_or_alert_id}", response_model=GraphData, summary="Extract investigation subgraph around seed entity or alert")
def get_investigation_subgraph(
    seed_or_alert_id: str,
    radius: int = Query(default=2, ge=1, le=4, description="Graph traversal hops (depth)")
):
    """
    Extracts the connected sub-network around a target seed entity or alert ID
    from the master enterprise dataset using multi-hop graph traversal.
    """
    try:
        return extract_investigation_subgraph(seed_or_alert_id, radius=radius)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/clusters", response_model=List[ResolvedCluster], summary="Get resolved entity clusters across enterprise dataset")
def get_resolved_clusters():
    """
    Runs multi-dimensional entity resolution across all accounts, devices, and IPs in the master database.
    """
    return resolve_enterprise_entities()
