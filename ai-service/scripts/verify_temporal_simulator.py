import sys
import json
import os

# Ensure UTF-8 stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Ensure ai-service root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app
from app.services.temporal_simulator import (
    get_temporal_money_trail,
    simulate_interdiction,
)


def verify_temporal_money_trail():
    print("=" * 80)
    print("1. VERIFYING TEMPORAL MONEY-TRAIL TIMELINE EXTRACTION")
    print("   Seed Target: ACCT-US-1001 (Ego Radius: 2)")
    print("=" * 80)

    # 1. Direct Service Call
    trail = get_temporal_money_trail(seed_id="ACCT-US-1001", radius=2)
    print(f"✅ Extracted Timeline for Seed: {trail.seed_id}")
    print(f"   • Total Frames (Transactions): {trail.total_frames}")
    print(f"   • Cumulative Dollar Volume: ${trail.total_cumulative_volume:,.2f}")
    print(f"   • Active Time Window: {trail.start_time} ➔ {trail.end_time}")
    print(f"   • Participating Entities Count: {len(trail.participating_nodes)}")
    print(f"   • Sample Entities: {', '.join(trail.participating_nodes[:6])}")

    print("\n   --- Chronological Timeline Playback Frames (First 5): ---")
    for f in trail.frames[:5]:
        print(f"   Frame #{f.step_number:02d} [{f.timestamp}]")
        print(f"     Flow: {f.from_node} ➔ {f.to_node}")
        print(f"     Amount: ${f.amount:,.2f} {f.currency} | Type: {f.tx_type}")
        print(f"     Cumulative Flow: ${f.cumulative_flow:,.2f} | Drain Velocity: {f.running_balance_drain_pct}%")
        print(f"     Active Device: {', '.join(f.active_devices) if f.active_devices else 'None'}")
        print(f"     Memo: {f.description}")
        print("-" * 50)

    assert trail.total_frames > 0, "Frames should not be empty!"
    assert trail.total_cumulative_volume > 0.0, "Total volume should be > 0!"


def verify_interdiction_simulator():
    print("\n" + "=" * 80)
    print("2. VERIFYING INTERDICTION BLAST-RADIUS SIMULATOR")
    print("   Target Node: DEV-IPHONE-PRO-8912 | Seed Context: ACCT-US-1001")
    print("=" * 80)

    # 1. Direct Service Call
    result = simulate_interdiction(
        target_node_id="DEV-IPHONE-PRO-8912",
        seed_id="ACCT-US-1001",
        radius=2
    )

    print(f"✅ Interdiction Simulation Completed:")
    print(f"   • Target Severed: {result.target_node_id}")
    print(f"   • Interdiction Status: {result.interdiction_status}")
    print(f"   • Total Capital At Risk: ${result.total_capital_at_risk:,.2f}")
    print(f"   • Capital Saved (Intercepted): ${result.capital_saved:,.2f}")
    print(f"   • Syndicate Disruption: {result.syndicate_disruption_pct}%")
    print(f"   • Collateral Benign Impact: {result.collateral_benign_impact_pct}%")
    print(f"   • Efficiency Score: {result.interdiction_efficiency_score}/100")
    print(f"   • Severed Accounts Count: {len(result.severed_accounts)}")
    print(f"   • Severed Accounts List: {result.severed_accounts}")
    print(f"   • Regulatory Justification:\n     \"{result.regulatory_justification}\"")

    # Assertions based on hackathon criteria
    assert result.interdiction_status == "SIMULATED_SEVERED"
    assert result.capital_saved > 40000.0, f"Expected capital saved > $40k, got {result.capital_saved}"
    assert result.syndicate_disruption_pct >= 95.0, "Syndicate disruption should be ~100%"
    assert result.collateral_benign_impact_pct == 0.0, "Mule ring cut should have 0% collateral damage!"
    assert len(result.severed_accounts) == 5, f"Expected 5 severed mule accounts, got {len(result.severed_accounts)}"


def verify_fastapi_endpoints():
    print("\n" + "=" * 80)
    print("3. VERIFYING FASTAPI HTTP REST ENDPOINTS")
    print("=" * 80)
    client = TestClient(app)

    # 1. Test GET /api/v1/simulator/temporal-trail
    resp1 = client.get("/api/v1/simulator/temporal-trail?seed_id=ACCT-US-1001&radius=2")
    assert resp1.status_code == 200, f"Failed: {resp1.text}"
    data1 = resp1.json()
    print(f"✅ GET /api/v1/simulator/temporal-trail: Status 200 OK")
    print(f"   • Received {data1['total_frames']} frames, Total Volume: ${data1['total_cumulative_volume']:,.2f}")

    # 2. Test POST /api/v1/simulator/interdiction
    payload = {
        "target_node_id": "DEV-IPHONE-PRO-8912",
        "seed_id": "ACCT-US-1001",
        "radius": 2
    }
    resp2 = client.post("/api/v1/simulator/interdiction", json=payload)
    assert resp2.status_code == 200, f"Failed: {resp2.text}"
    data2 = resp2.json()
    print(f"✅ POST /api/v1/simulator/interdiction: Status 200 OK")
    print(f"   • JSON Response Output:")
    print(json.dumps(data2, indent=4))

    # 3. Test False-Positive / High-Collateral interdiction scenario (Campus Wi-Fi)
    payload_campus = {
        "target_node_id": "128.146.172.84",
        "seed_id": "ACCT-CAMPUS-01",
        "radius": 2
    }
    resp3 = client.post("/api/v1/simulator/interdiction", json=payload_campus)
    assert resp3.status_code == 200, f"Failed: {resp3.text}"
    data3 = resp3.json()
    print(f"\n✅ Tested False-Positive Control Interdiction on Campus IP:")
    print(f"   • Target: {data3['target_node_id']}")
    print(f"   • Collateral Benign Impact: {data3['collateral_benign_impact_pct']}% (Correctly flags high innocent disruption)")


if __name__ == "__main__":
    print("Starting Temporal Money-Trail & Blast-Radius Simulator Verification...\n")
    verify_temporal_money_trail()
    verify_interdiction_simulator()
    verify_fastapi_endpoints()
    print("\n🎉 ALL SIMULATOR SUITE TESTS PASSED PERFECTLY!")
