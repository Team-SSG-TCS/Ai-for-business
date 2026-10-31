"""
Verification script for LangGraph Multi-Agent Forensic Investigation Engine.
Tests execution on both a suspicious entity (ACCT-US-1001) and a false positive entity (128.146.172.84).
"""

import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure app imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.langgraph_pipeline import compiled_investigation_graph


def run_langgraph_test(seed_id: str):
    print("=" * 80)
    print(f"🕸️ EXECUTING LANGGRAPH FORENSIC STATE MACHINE ON SEED: {seed_id}")
    print("=" * 80)
    
    initial_state = {
        "seed_id": seed_id,
        "seed_type": "",
        "profile": {},
        "network_summary": {},
        "structuring_velocity": {},
        "swarm_telemetry": {},
        "benign_context": {},
        "evidence_items": [],
        "prosecution_hypothesis": {},
        "defense_hypothesis": {},
        "adjudication": {},
        "sar_report": {},
        "remediation_status": {},
        "stage": "INITIATED",
        "requires_human_approval": False
    }
    
    config = {"configurable": {"thread_id": f"thread_{seed_id}"}}
    
    # Execute graph
    final_state = compiled_investigation_graph.invoke(initial_state, config=config)
    
    print(f"\n[TRIAGE] Seed Entity Type: {final_state['seed_type']}")
    print(f"[TOPOLOGY] Nodes Discovered: {final_state['network_summary'].get('node_count')}, Links: {final_state['network_summary'].get('edge_count')}")
    print(f"           Most Central Hub: {final_state['network_summary'].get('most_central_hub')}")
    
    pros = final_state.get("prosecution_hypothesis", {})
    print(f"\n[PROSECUTION AGENT]")
    print(f"  • Typology: {pros.get('crime_typology')}")
    print(f"  • Confidence: {pros.get('prosecution_confidence') * 100:.0f}%")
    print(f"  • Evidence Items ({len(final_state.get('evidence_items', []))}):")
    for ev in final_state.get("evidence_items", []):
        print(f"    - [{ev['type']}] {ev['description']} (Statute: {ev['statutory_violation']})")
        
    defense = final_state.get("defense_hypothesis", {})
    print(f"\n[DEFENSE AGENT / DEVIL'S ADVOCATE]")
    print(f"  • Classification: {defense.get('benign_classification')}")
    print(f"  • Innocent Plausibility: {defense.get('innocent_plausibility') * 100:.0f}%")
    print(f"  • Counter Theory: {defense.get('counter_theory')}")
    
    adj = final_state.get("adjudication", {})
    print(f"\n[CHIEF COMPLIANCE ADJUDICATOR]")
    print(f"  • Final Verdict: {adj.get('verdict')}")
    print(f"  • Risk Score: {adj.get('risk_score')}/100 | Legitimacy Score: {adj.get('legitimacy_score')}/100")
    print(f"  • Recommended Action: {adj.get('recommended_action')}")
    print(f"  • Sign-off Required: {adj.get('investigator_signoff_required')}")
    
    rem = final_state.get("remediation_status", {})
    print(f"\n[REMEDIATION EXECUTION]")
    print(f"  • Action Status: {rem.get('status')} | Message: {rem.get('message')}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    # Test 1: Criminal Mule Seed
    run_langgraph_test("ACCT-US-1001")
    
    # Test 2: Benign Campus Wi-Fi Seed
    run_langgraph_test("128.146.172.84")
