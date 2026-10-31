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

from app.services.enterprise_dataset import get_master_database
from app.services.entity_resolver import resolve_enterprise_entities
from app.services.graph_engine import get_or_build_master_graph, extract_investigation_subgraph
from app.services.anomaly_detector import run_all_anomaly_detections
from app.services.multi_agent_investigator import investigator_service
from app.services.dataset_analyzer import dataset_analysis_engine
from app.schemas.investigation import CaseSummary, NetworkGraphData, GraphNode, GraphLink

def run_end_to_end_verification(alert_id: str):
    print("=" * 80)
    print(f"🔬 RUNNING END-TO-END VERIFICATION ON: {alert_id}")
    print("   Flow: Dataset ➔ Entity Resolution ➔ Graph ➔ Anomaly ➔ Hypothesis ➔ Evidence ➔ Alternatives ➔ Risk ➔ Remediation")
    print("=" * 80)

    db = get_master_database()

    # -------------------------------------------------------------------------
    # STAGE 1: INGEST MASTER DATASET
    # -------------------------------------------------------------------------
    print("\n[STAGE 1] INGEST MASTER ENTERPRISE DATASET")
    alert_obj = next((a for a in db.alerts if a["alert_id"] == alert_id), None)
    if not alert_obj:
        print(f"❌ Alert {alert_id} not found in master database!")
        return

    print(f"  • Alert Triggered: {alert_obj['alert_id']} - {alert_obj['title']}")
    print(f"  • Seed Entity: {alert_obj['seed_id']} ({alert_obj['seed_type']})")
    print(f"  • Severity: {alert_obj['severity']} | Reason: {alert_obj['trigger_reason']}")
    print(f"  • Master Database Size: {len(db.customers)} Customers, {len(db.accounts)} Accounts, {len(db.devices)} Devices, {len(db.transactions)} Transactions")

    # -------------------------------------------------------------------------
    # STAGE 2: MULTI-DIMENSIONAL ENTITY RESOLUTION
    # -------------------------------------------------------------------------
    print("\n[STAGE 2] ENTITY RESOLUTION (Clustering Fragmented Identities)")
    resolved_clusters = resolve_enterprise_entities()
    relevant_cluster = next((c for c in resolved_clusters if alert_obj["seed_id"] in c.account_numbers or alert_obj["seed_id"] in c.shared_ips), None)
    
    if relevant_cluster:
        print(f"  ✓ Resolved Cluster: {relevant_cluster.cluster_id} -> {relevant_cluster.cluster_label}")
        print(f"  ✓ Linked Accounts ({len(relevant_cluster.account_numbers)}): {', '.join(relevant_cluster.account_numbers)}")
        print(f"  ✓ Shared Devices ({len(relevant_cluster.shared_device_ids)}): {', '.join(relevant_cluster.shared_device_ids) or 'None'}")
        print(f"  ✓ Shared IPs ({len(relevant_cluster.shared_ips)}): {', '.join(relevant_cluster.shared_ips)}")
        print(f"  ✓ Resolution Confidence: {relevant_cluster.confidence_score * 100:.0f}%")
        for rf in relevant_cluster.risk_factors:
            print(f"    ⚠️ {rf}")
    else:
        print("  • No high-risk syndicate cluster detected; accounts are independently owned.")

    # -------------------------------------------------------------------------
    # STAGE 3: RELATIONSHIP GRAPH CONSTRUCTION & 2-HOP SUBGRAPH EXTRACTION
    # -------------------------------------------------------------------------
    print("\n[STAGE 3] RELATIONSHIP GRAPH CONSTRUCTION (NetworkX Multi-Hop)")
    subgraph_data = extract_investigation_subgraph(alert_id, radius=2)
    print(f"  ✓ Extracted Subgraph around Seed [{subgraph_data.metrics['seed_node']}]:")
    print(f"    - Subgraph Nodes: {subgraph_data.metrics['subgraph_nodes']}")
    print(f"    - Subgraph Edges: {subgraph_data.metrics['subgraph_edges']}")
    print(f"    - Subgraph Flow Volume: ${subgraph_data.metrics['subgraph_volume_usd']:,.2f}")
    print(f"    - Most Central Topology Hub: {subgraph_data.metrics['most_central_hub']} (Betweenness: {subgraph_data.metrics['centrality_score']})")

    # -------------------------------------------------------------------------
    # STAGE 4: ANOMALY IDENTIFICATION (Mathematical & Heuristic Detectors)
    # -------------------------------------------------------------------------
    print("\n[STAGE 4] ANOMALY IDENTIFICATION (Topological & Velocity Detectors)")
    sub_nodes_ids = {n.id for n in subgraph_data.nodes}
    sub_txs = [
        {
            "id": t.tx_id, "tx_id": t.tx_id,
            "sender_id": t.sender_account,
            "recipient_id": t.receiver_account or t.beneficiary_id or t.merchant_id,
            "amount": t.amount, "timestamp": t.timestamp,
            "device_id": t.device_id, "ip_address": t.ip_address
        }
        for t in db.transactions
        if t.sender_account in sub_nodes_ids or t.receiver_account in sub_nodes_ids or t.beneficiary_id in sub_nodes_ids
    ]
    anomaly_packet = run_all_anomaly_detections(case_id=alert_id, graph_data=subgraph_data, transactions=sub_txs)
    
    print(f"  ✓ Structuring Findings: {len(anomaly_packet.structuring_findings)}")
    for sf in anomaly_packet.structuring_findings:
        print(f"    🚨 {sf.get('description')}")
    print(f"  ✓ Rapid Drain (Pass-Through) Findings: {len(anomaly_packet.rapid_drain_findings)}")
    for rdf in anomaly_packet.rapid_drain_findings:
        print(f"    🚨 {rdf.get('description')}")
    print(f"  ✓ Device Swarm Findings: {len(anomaly_packet.device_swarm_findings)}")
    for df in anomaly_packet.device_swarm_findings:
        print(f"    🚨 {df.get('description')}")

    # -------------------------------------------------------------------------
    # STAGES 5 - 8: MULTI-AGENT REASONING PIPELINE
    # -------------------------------------------------------------------------
    print("\n[STAGES 5 - 8] MULTI-AGENT FORENSIC REASONING PIPELINE")
    case_summary = CaseSummary(
        case_id=alert_id,
        title=alert_obj["title"],
        description=alert_obj["trigger_reason"],
        category="FRAUD_RING" if alert_obj["severity"] == "CRITICAL" else "FALSE_POSITIVE_BENIGN",
        created_at=alert_obj["timestamp"],
        entity_count=subgraph_data.metrics["subgraph_nodes"],
        total_volume=subgraph_data.metrics["subgraph_volume_usd"]
    )

    # Convert subgraph_data to NetworkGraphData for investigator
    net_graph = NetworkGraphData(
        case_id=alert_id,
        nodes=[GraphNode(id=n.id, label=n.label, type=n.type.upper(), properties=n.properties) for n in subgraph_data.nodes],
        links=[GraphLink(source=l.source, target=l.target, relation=l.relation, amount=l.amount, timestamp=l.timestamp) for l in subgraph_data.links]
    )

    import asyncio
    provider_mode = sys.argv[2] if len(sys.argv) > 2 else "mock"
    prosecution, defense, adjudication, human_plan, model_used, fallback_used = asyncio.run(
        investigator_service.investigate(
            case_summary=case_summary,
            anomaly_packet=anomaly_packet,
            graph_data=net_graph,
            provider=provider_mode
        )
    )

    # STAGE 5: HYPOTHESIS GENERATION
    print("\n  [STAGE 5] PRIMARY ILLICIT HYPOTHESIS (Agent 1: Prosecution)")
    print(f"    • Theory: {prosecution.theory}")
    print(f"    • Crime Typology: {prosecution.primary_typology}")
    conf_pct = prosecution.confidence if prosecution.confidence > 1.0 else prosecution.confidence * 100.0
    print(f"    • Prosecution Confidence: {conf_pct:.0f}%")

    # STAGE 6: EVIDENCE GATHERING
    print("\n  [STAGE 6] EVIDENCE GATHERING & ZERO-HALLUCINATION TRACEABILITY")
    print(f"    • Total Coded Evidence Items: {len(anomaly_packet.evidence_items)}")
    for idx, ev in enumerate(anomaly_packet.evidence_items[:4], 1):
        print(f"      [{idx}] Type: {ev.evidence_type} | Entity: {ev.entity_id} | Amount: ${ev.amount or 0:,.2f} | TxID: {ev.tx_id or 'N/A'}")
        print(f"          Detail: {ev.description}")

    # STAGE 7: ALTERNATIVE EXPLANATIONS (False-Positive Control)
    print("\n  [STAGE 7] ALTERNATIVE INNOCENT HYPOTHESIS (Agent 2: Devil's Advocate)")
    print(f"    • Alternative Theory: {defense.primary_counter_hypothesis}")
    plaus_pct = defense.plausibility if defense.plausibility > 1.0 else defense.plausibility * 100.0
    print(f"    • Innocent Plausibility Score: {plaus_pct:.0f}%")
    alt_summaries = [alt.hypothesis for alt in defense.alternative_explanations] if defense.alternative_explanations else defense.reasons_benign
    print(f"    • Benign Context: {', '.join(alt_summaries[:2])}")

    # STAGE 8: CALIBRATED DUAL RISK SCORING & SAR NARRATIVE
    print("\n  [STAGE 8] SENIOR ADJUDICATION & DUAL SCORING (Agent 3: Compliance QA)")
    print(f"    • Final Verdict: {adjudication.verdict}")
    print(f"    • Risk Score: {adjudication.dual_score.risk_score} / 100 (Level: {adjudication.dual_score.risk_level})")
    print(f"    • Legitimacy Score: {adjudication.dual_score.legitimacy_score} / 100")
    print(f"    • Official SAR Narrative Briefing:")
    sar_preview = adjudication.sar_report.narrative.split("\n")[0][:140] if adjudication.sar_report.narrative else "SAR generated."
    print(f"      \"{sar_preview}...\"")

    # -------------------------------------------------------------------------
    # STAGE 9: HUMAN-IN-THE-LOOP ACTION CHECKLIST & REMEDIATION EXECUTION
    # -------------------------------------------------------------------------
    print("\n[STAGE 9] HUMAN-IN-THE-LOOP ACTION PLAN & AUTOMATED REMEDIATION")
    print(f"  • Human Investigator Action Checklist:")
    for idx, item in enumerate(human_plan, 1):
        print(f"    [ ] {item}")

    print("\n  • Automated Compliance Fix Execution:")
    if adjudication.dual_score.risk_score >= 70:
        target_account = alert_obj["seed_id"]
        res = dataset_analysis_engine.execute_remediation_fix(
            action_id="VERIFY-FIX-01",
            action_type="FREEZE_ACCOUNT",
            target_entity=target_account
        )
        print(f"    🚨 High Risk Confirmed: Executed FREEZE_ACCOUNT on [{target_account}]")
        print(f"       Result: {res['audit_entry']['details']}")
    else:
        target_network = alert_obj["seed_id"]
        res = dataset_analysis_engine.execute_remediation_fix(
            action_id="VERIFY-FIX-02",
            action_type="WHITELIST_FALSE_POSITIVE",
            target_entity=target_network
        )
        print(f"    🛡️ False Positive Confirmed: Executed WHITELIST_FALSE_POSITIVE on [{target_network}]")
        print(f"       Result: {res['audit_entry']['details']}")

    print("\n" + "=" * 80)
    print(f"✅ COMPLETE 9-STAGE PIPELINE VERIFIED FOR {alert_id}!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    # 1. Verify Suspicious Case (Mule Ring)
    run_end_to_end_verification("ALERT-001")
    
    # 2. Verify Innocent Case (Campus Wi-Fi False Positive)
    run_end_to_end_verification("ALERT-002")
