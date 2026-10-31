import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from fastapi.testclient import TestClient
from main import app

def test_investigation_pipeline():
    client = TestClient(app)

    print("--- 1. Testing GET /api/v1/investigation/cases ---")
    r1 = client.get("/api/v1/investigation/cases")
    assert r1.status_code == 200, f"Failed: {r1.text}"
    cases = r1.json()
    print(f"✅ Success: Retrieved {len(cases)} demo cases:")
    for c in cases:
        print(f"   • [{c['category']}] {c['case_id']}: {c['title']} (Volume: ${c['total_volume']:,.2f})")

    print("\n--- 2. Testing GET /api/v1/investigation/{case_id}/graph ---")
    r2 = client.get("/api/v1/investigation/CASE-2026-8812/graph")
    assert r2.status_code == 200, f"Failed: {r2.text}"
    graph = r2.json()
    print(f"✅ Success: Retrieved graph with {len(graph['nodes'])} nodes and {len(graph['links'])} links.")

    print("\n--- 3. Testing POST /api/v1/investigation/CASE-2026-8812/run (Fraud Ring) ---")
    r3 = client.post("/api/v1/investigation/CASE-2026-8812/run", json={"provider": "mock"})
    assert r3.status_code == 200, f"Failed: {r3.text}"
    res3 = r3.json()
    dual = res3["adjudication"]["dual_score"]
    print(f"✅ Success: Fraud Ring Analysis:")
    print(f"   • Risk Score: {dual['risk_score']} | Legitimacy Score: {dual['legitimacy_score']} | Level: {dual['risk_level']}")
    print(f"   • Verdict: {res3['adjudication']['verdict']}")
    print(f"   • Identified Typologies: {res3['adjudication']['sar_report']['typologies_identified']}")
    print(f"   • Structuring Findings: {len(res3['anomaly_packet']['structuring_findings'])}")
    print(f"   • Rapid Drain Findings: {len(res3['anomaly_packet']['rapid_drain_findings'])}")
    print(f"   • Device Swarms: {len(res3['anomaly_packet']['device_swarm_findings'])}")
    print(f"   • Human Action Checklist Items: {len(res3['human_action_plan'])}")
    for step in res3['human_action_plan']:
        print(f"     -> {step[:80]}...")

    print("\n--- 4. Testing POST /api/v1/investigation/CASE-2026-4409/run (False Positive Benign) ---")
    r4 = client.post("/api/v1/investigation/CASE-2026-4409/run", json={"provider": "mock"})
    assert r4.status_code == 200, f"Failed: {r4.text}"
    res4 = r4.json()
    dual4 = res4["adjudication"]["dual_score"]
    print(f"✅ Success: Benign Payroll False-Positive Control:")
    print(f"   • Risk Score: {dual4['risk_score']} | Legitimacy Score: {dual4['legitimacy_score']} | Level: {dual4['risk_level']}")
    print(f"   • Verdict: {res4['adjudication']['verdict']}")
    print(f"   • Primary Counter Hypothesis: {res4['defense']['primary_counter_hypothesis']}")
    assert dual4["legitimacy_score"] > dual4["risk_score"], "False positive should have higher legitimacy score!"

    print("\n--- 5. Testing POST /api/v1/investigation/CASE-2026-9034/run (Impossible Travel / ATO) ---")
    r5 = client.post("/api/v1/investigation/CASE-2026-9034/run", json={"provider": "mock"})
    assert r5.status_code == 200, f"Failed: {r5.text}"
    res5 = r5.json()
    print(f"✅ Success: ATO Impossible Travel Findings:")
    print(f"   • Geo Velocity Findings: {len(res5['anomaly_packet']['geo_velocity_findings'])}")
    for gf in res5['anomaly_packet']['geo_velocity_findings']:
        print(f"     -> Speed: {gf['velocity_kmh']:,} km/h between {gf['location_1']} and {gf['location_2']}")

    print("\n--- 6. Testing POST /api/v1/investigation/run (Ad-hoc custom payload from Laptop 1) ---")
    adhoc_payload = {
        "case_id": "CASE-LAPTOP1-LIVE",
        "provider": "mock",
        "custom_transactions": [
            {"id": "TX-L1-01", "amount": 9500.0, "recipient_id": "ACC-MULE-1", "sender_id": "CASH", "timestamp": "2026-10-31T10:00:00Z"},
            {"id": "TX-L1-02", "amount": 9400.0, "sender_id": "ACC-MULE-1", "recipient_id": "ACC-OFFSHORE", "timestamp": "2026-10-31T10:30:00Z"}
        ],
        "custom_graph": {
            "case_id": "CASE-LAPTOP1-LIVE",
            "nodes": [
                {"id": "ACC-MULE-1", "label": "Mule Account", "type": "BANK_ACCOUNT"},
                {"id": "ACC-OFFSHORE", "label": "Offshore Account", "type": "BENEFICIARY"}
            ],
            "links": [
                {"source": "ACC-MULE-1", "target": "ACC-OFFSHORE", "relation": "TRANSFERRED_TO", "amount": 9400.0}
            ]
        }
    }
    r6 = client.post("/api/v1/investigation/run", json=adhoc_payload)
    assert r6.status_code == 200, f"Failed: {r6.text}"
    res6 = r6.json()
    print(f"✅ Success: Ad-hoc case evaluated. Verdict: {res6['adjudication']['verdict']}, Risk: {res6['adjudication']['dual_score']['risk_score']}")

    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_investigation_pipeline()
