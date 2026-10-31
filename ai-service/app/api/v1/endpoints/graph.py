from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.dataset_generator import get_case, list_cases
from app.services.entity_resolver import resolve_entities
from app.services.graph_engine import build_financial_graph
from app.schemas.financial_graph import GraphData, ResolvedCluster

router = APIRouter()

@router.get("/cases", summary="List available financial crime and false-positive benchmark scenarios")
def get_available_cases() -> List[Dict[str, str]]:
    """
    Returns list of canonical benchmark cases:
    - CASE_001_MULE_RING (Suspicious)
    - CASE_002_CAMPUS_WIFI (Benign False-Positive Control)
    - CASE_003_RAPID_LAYERING (Suspicious)
    - CASE_004_CORPORATE_PAYROLL (Benign False-Positive Control)
    """
    return list_cases()

@router.get("/{case_id}", response_model=GraphData, summary="Get relationship graph for a case")
def get_case_graph(case_id: str):
    """
    Constructs and returns the full relationship graph with nodes, links, and topological metrics.
    Includes all 8 entities: Customer, Account, Device, IP, Merchant, Beneficiary, Location, Transaction.
    """
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    clusters = resolve_entities(case)
    _, graph_data = build_financial_graph(case, clusters)
    return graph_data

@router.get("/{case_id}/clusters", response_model=List[ResolvedCluster], summary="Get resolved entity clusters")
def get_case_clusters(case_id: str):
    """
    Runs multi-dimensional entity resolution and returns grouped Golden Entity clusters.
    """
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    clusters = resolve_entities(case)
    return clusters
