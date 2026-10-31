import math
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional
from app.schemas.investigation import AnomalyEvidencePacket, EvidenceItem, EvidenceType, NetworkGraphData


def _parse_timestamp(ts: Any) -> Optional[datetime]:
    """Parse various timestamp representations into a UTC datetime object."""
    if not ts:
        return None
    if isinstance(ts, datetime):
        return ts if ts.tzinfo else ts.replace(tzinfo=timezone.utc)
    if isinstance(ts, (int, float)):
        # Support epoch seconds or ms
        if ts > 1e11:
            ts = ts / 1000.0
        return datetime.fromtimestamp(ts, tz=timezone.utc)
    if isinstance(ts, str):
        cleaned = ts.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(cleaned)
        except Exception:
            for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
                try:
                    return datetime.strptime(ts, fmt).replace(tzinfo=timezone.utc)
                except Exception:
                    continue
    return None


def _haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the Great-Circle distance between two points in kilometers."""
    R = 6371.0  # Earth's radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def detect_structuring(txs: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[EvidenceItem]]:
    """
    Detects financial structuring (smurfing) by identifying:
    1. Direct threshold evasion: Transactions clustered just under the legal $10,000 CTR reporting threshold ($9,000 - $9,999.99).
    2. Velocity aggregation: Multiple transactions within 24-72 hours whose individual amounts are sub-threshold but aggregate > $10,000.
    """
    findings: List[Dict[str, Any]] = []
    evidence_items: List[EvidenceItem] = []

    if not txs:
        return findings, evidence_items

    # 1. Direct threshold evasion
    # India: FIU-IND CTR Threshold: ₹10,00,000 (Structuring Band: ₹9,00,000 - ₹9,99,999.99)
    inr_ctr_txs = [t for t in txs if 900000.0 <= float(t.get("amount", 0.0)) < 1000000.0]
    # India: Rule 114B PAN Threshold: ₹50,000 (Structuring Band: ₹45,000 - ₹49,999.99)
    inr_pan_txs = [t for t in txs if 45000.0 <= float(t.get("amount", 0.0)) < 50000.0]

    # Process Indian ₹10 Lakh CTR Structuring (FIU-IND / PMLA 2002)
    if inr_ctr_txs:
        total_inr = sum(float(t.get("amount", 0.0)) for t in inr_ctr_txs)
        tx_ids = [str(t.get("id") or t.get("tx_id", "unknown")) for t in inr_ctr_txs]
        findings.append({
            "type": "FIU_IND_CTR_STRUCTURING",
            "jurisdiction": "INDIA",
            "regulatory_body": "FIU-IND",
            "statutory_reference": "PMLA 2002 Section 3 & 12 (Rule 3 CTR Reporting)",
            "count": len(inr_ctr_txs),
            "threshold_limit": 1000000.0,
            "total_amount": round(total_inr, 2),
            "tx_ids": tx_ids,
            "description": f"Detected {len(inr_ctr_txs)} transactions intentionally structured between ₹9,00,000 and ₹9,99,999 (totaling ₹{total_inr:,.2f}) to evade mandatory ₹10,00,000 (10 Lakhs) Cash Transaction Reporting (CTR) under FIU-IND & PMLA 2002.",
            "severity": "CRITICAL" if len(inr_ctr_txs) >= 2 else "HIGH"
        })
        for t in inr_ctr_txs:
            tid = str(t.get("id") or t.get("tx_id", "unknown"))
            amt = float(t.get("amount", 0.0))
            ts = str(t.get("timestamp", ""))
            account = str(t.get("account_id") or t.get("sender_id") or t.get("recipient_id") or "account")
            evidence_items.append(EvidenceItem(
                tx_id=tid,
                amount=amt,
                timestamp=ts,
                entity_id=account,
                evidence_type=EvidenceType.STRUCTURING.value,
                description=f"Transaction {tid} structured at ₹{amt:,.2f} on {ts} just below India's ₹10,00,000 FIU-IND CTR threshold (PMLA 2002).",
                severity="HIGH"
            ))

    if inr_pan_txs and len(inr_pan_txs) >= 2:
        total_pan = sum(float(t.get("amount", 0.0)) for t in inr_pan_txs)
        tx_ids = [str(t.get("id") or t.get("tx_id", "unknown")) for t in inr_pan_txs]
        findings.append({
            "type": "PAN_THRESHOLD_EVASION_BAND",
            "jurisdiction": "INDIA",
            "regulatory_body": "Income Tax Department / FIU-IND",
            "statutory_reference": "Rule 114B Income Tax Rules / PMLA 2002",
            "count": len(inr_pan_txs),
            "threshold_limit": 50000.0,
            "total_amount": round(total_pan, 2),
            "tx_ids": tx_ids,
            "description": f"Detected {len(inr_pan_txs)} cash transactions structured between ₹45,000 and ₹49,999 (totaling ₹{total_pan:,.2f}) to evade mandatory PAN quoting threshold of ₹50,000 under Rule 114B.",
            "severity": "HIGH"
        })

    # Standard / base demo threshold evasion (sub-10,000 or normalized)
    sub_threshold_txs = []
    for tx in txs:
        amt = float(tx.get("amount", 0.0))
        if 9000.0 <= amt < 10000.0:
            sub_threshold_txs.append(tx)

    if sub_threshold_txs:
        total_sub_amt = sum(float(t.get("amount", 0.0)) for t in sub_threshold_txs)
        tx_ids = [str(t.get("id") or t.get("tx_id", "unknown")) for t in sub_threshold_txs]
        finding = {
            "type": "CTR_THRESHOLD_EVASION",
            "count": len(sub_threshold_txs),
            "total_amount": round(total_sub_amt, 2),
            "tx_ids": tx_ids,
            "description": f"Detected {len(sub_threshold_txs)} transactions intentionally structured between $9,000 and $9,999.99 (totaling ${total_sub_amt:,.2f}) to evade mandatory $10,000 Currency Transaction Reporting (CTR) thresholds.",
            "severity": "CRITICAL" if len(sub_threshold_txs) >= 3 else "HIGH"
        }
        findings.append(finding)

        for t in sub_threshold_txs:
            tid = str(t.get("id") or t.get("tx_id", "unknown"))
            amt = float(t.get("amount", 0.0))
            ts = str(t.get("timestamp", ""))
            account = str(t.get("account_id") or t.get("sender_id") or t.get("recipient_id") or "account")
            evidence_items.append(EvidenceItem(
                tx_id=tid,
                amount=amt,
                timestamp=ts,
                entity_id=account,
                evidence_type=EvidenceType.STRUCTURING.value,
                description=f"Transaction {tid} structured at ${amt:,.2f} on {ts} just under the $10,000 BSA limit.",
                severity="HIGH"
            ))

    # 2. Clustered Multi-Hop Deposits by Entity within 72 hours
    entity_grouped: Dict[str, List[Dict[str, Any]]] = {}
    for tx in txs:
        ent = str(tx.get("recipient_id") or tx.get("account_id") or tx.get("target") or "target")
        entity_grouped.setdefault(ent, []).append(tx)

    for ent, ent_txs in entity_grouped.items():
        if len(ent_txs) >= 2:
            sorted_txs = sorted(
                ent_txs,
                key=lambda x: _parse_timestamp(x.get("timestamp")) or datetime.min.replace(tzinfo=timezone.utc)
            )
            # Check cluster sums
            window_txs = []
            for t in sorted_txs:
                t_dt = _parse_timestamp(t.get("timestamp"))
                if not t_dt:
                    continue
                window_txs = [w for w in window_txs if (_parse_timestamp(w.get("timestamp")) and (t_dt - _parse_timestamp(w.get("timestamp"))).total_seconds() <= 72 * 3600)]
                window_txs.append(t)
                win_sum = sum(float(w.get("amount", 0.0)) for w in window_txs)
                if len(window_txs) >= 3 and win_sum > 10000.0:
                    win_ids = [str(w.get("id") or w.get("tx_id")) for w in window_txs]
                    findings.append({
                        "type": "TEMPORAL_STRUCTURING_CLUSTER",
                        "entity_id": ent,
                        "cluster_tx_count": len(window_txs),
                        "cluster_total": round(win_sum, 2),
                        "tx_ids": win_ids,
                        "description": f"Entity {ent} received {len(window_txs)} rapid sequential deposits within 72h aggregating ${win_sum:,.2f}, indicating smurfing consolidation.",
                        "severity": "HIGH"
                    })
                    break

    return findings, evidence_items


def detect_rapid_drain(txs: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[EvidenceItem]]:
    """
    Calculates velocity-to-drain percentage.
    Flags when >90% of an inbound deposit is drained out of an account within 2 hours (7200 seconds).
    Hallmark of money mule / pass-through accounts.
    """
    findings: List[Dict[str, Any]] = []
    evidence_items: List[EvidenceItem] = []

    if not txs:
        return findings, evidence_items

    # Normalize transactions into accounts timeline
    accounts: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
    for tx in txs:
        source = tx.get("sender_id") or tx.get("source") or tx.get("from_account")
        target = tx.get("recipient_id") or tx.get("target") or tx.get("to_account")
        amt = float(tx.get("amount", 0.0))
        ts_dt = _parse_timestamp(tx.get("timestamp"))
        tx_id = str(tx.get("id") or tx.get("tx_id") or "tx")

        if target:
            accounts.setdefault(str(target), {"in": [], "out": []})["in"].append({
                "tx_id": tx_id, "amount": amt, "dt": ts_dt, "raw": tx
            })
        if source:
            accounts.setdefault(str(source), {"in": [], "out": []})["out"].append({
                "tx_id": tx_id, "amount": amt, "dt": ts_dt, "raw": tx
            })

    for acc_id, flows in accounts.items():
        for inbound in flows["in"]:
            in_amt = inbound["amount"]
            in_dt = inbound["dt"]
            if in_amt <= 0.0 or not in_dt:
                continue

            # Find matching outbound transactions within 2 hours (7200 seconds)
            matching_out = []
            for out in flows["out"]:
                out_dt = out["dt"]
                if out_dt and in_dt <= out_dt:
                    diff_sec = (out_dt - in_dt).total_seconds()
                    if diff_sec <= 7200:
                        matching_out.append(out)

            total_out = sum(m["amount"] for m in matching_out)
            if in_amt > 0:
                drain_pct = (total_out / in_amt) * 100.0
                if drain_pct >= 90.0:
                    earliest_out = min(m["dt"] for m in matching_out)
                    drain_minutes = max(1, int((earliest_out - in_dt).total_seconds() / 60))
                    out_ids = [m["tx_id"] for m in matching_out]

                    finding = {
                        "type": "RAPID_MULE_DRAIN",
                        "account_id": acc_id,
                        "inbound_tx_id": inbound["tx_id"],
                        "inbound_amount": round(in_amt, 2),
                        "outbound_amount": round(total_out, 2),
                        "drain_percentage": round(drain_pct, 1),
                        "time_to_drain_minutes": drain_minutes,
                        "outbound_tx_ids": out_ids,
                        "description": f"Account {acc_id} received ${in_amt:,.2f} (Tx: {inbound['tx_id']}) and drained {drain_pct:.1f}% (${total_out:,.2f}) within {drain_minutes} minutes via Txs: {', '.join(out_ids)}.",
                        "severity": "CRITICAL"
                    }
                    findings.append(finding)

                    evidence_items.append(EvidenceItem(
                        tx_id=inbound["tx_id"],
                        amount=in_amt,
                        timestamp=str(inbound["raw"].get("timestamp")),
                        entity_id=acc_id,
                        evidence_type=EvidenceType.RAPID_DRAIN.value,
                        description=f"Pass-through rapid drain: ${total_out:,.2f} ({drain_pct:.1f}%) departed within {drain_minutes} mins of receipt.",
                        severity="CRITICAL"
                    ))

    return findings, evidence_items


def detect_device_swarms(graph_data: Any) -> Tuple[List[Dict[str, Any]], List[EvidenceItem]]:
    """
    Finds 1 device connected to >= 3 distinct customer accounts.
    Hallmark of emulator farms, device reuse rings, or credential stuffing operations.
    Accepts NetworkGraphData or dictionary with 'nodes' and 'links'.
    """
    findings: List[Dict[str, Any]] = []
    evidence_items: List[EvidenceItem] = []

    if not graph_data:
        return findings, evidence_items

    # Convert to standard dict if Pydantic model
    if hasattr(graph_data, "dict"):
        data = graph_data.dict()
    elif hasattr(graph_data, "model_dump"):
        data = graph_data.model_dump()
    elif isinstance(graph_data, dict):
        data = graph_data
    else:
        return findings, evidence_items

    nodes = data.get("nodes", [])
    links = data.get("links", [])

    node_type_map = {n.get("id"): n.get("type", "").upper() for n in nodes if isinstance(n, dict)}

    # Map device ID -> connected accounts/customers
    device_to_entities: Dict[str, set] = {}

    for link in links:
        src = link.get("source")
        tgt = link.get("target")
        rel = (link.get("relation") or "").upper()

        src_type = node_type_map.get(src, "")
        tgt_type = node_type_map.get(tgt, "")

        # Check if one endpoint is DEVICE and the other is CUSTOMER or BANK_ACCOUNT
        if src_type == "DEVICE" and tgt_type in ("CUSTOMER", "BANK_ACCOUNT", "ACCOUNT"):
            device_to_entities.setdefault(src, set()).add(tgt)
        elif tgt_type == "DEVICE" and src_type in ("CUSTOMER", "BANK_ACCOUNT", "ACCOUNT"):
            device_to_entities.setdefault(tgt, set()).add(src)
        elif "DEVICE" in rel or "LOGGED" in rel:
            # Fallback by relation name
            if src_type == "DEVICE":
                device_to_entities.setdefault(src, set()).add(tgt)
            elif tgt_type == "DEVICE":
                device_to_entities.setdefault(tgt, set()).add(src)

    # Evaluate swarm threshold (>= 3 distinct accounts)
    for dev_id, connected_accs in device_to_entities.items():
        if len(connected_accs) >= 3:
            acc_list = sorted(list(connected_accs))
            finding = {
                "type": "DEVICE_SWARM_FARM",
                "device_id": dev_id,
                "connected_accounts_count": len(acc_list),
                "connected_accounts": acc_list,
                "description": f"Hardware Device [{dev_id}] is linked to {len(acc_list)} distinct customer accounts ({', '.join(acc_list[:5])}), indicating a device farm or sybil identity cluster.",
                "severity": "CRITICAL" if len(acc_list) >= 5 else "HIGH"
            }
            findings.append(finding)

            evidence_items.append(EvidenceItem(
                tx_id=None,
                amount=None,
                timestamp=None,
                entity_id=dev_id,
                evidence_type=EvidenceType.DEVICE_SWARM.value,
                description=f"Device fingerprint {dev_id} shared across {len(acc_list)} accounts: {', '.join(acc_list[:4])}.",
                severity="CRITICAL" if len(acc_list) >= 5 else "HIGH"
            ))

    return findings, evidence_items


def detect_geo_velocity(logins: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[EvidenceItem]]:
    """
    Flags impossible travel speed (>800 km/h between logins).
    Calculates great-circle distance and elapsed time between successive logins for the same entity.
    """
    findings: List[Dict[str, Any]] = []
    evidence_items: List[EvidenceItem] = []

    if not logins:
        return findings, evidence_items

    # Group logins by user/customer/account
    user_logins: Dict[str, List[Dict[str, Any]]] = {}
    for log in logins:
        uid = str(log.get("user_id") or log.get("customer_id") or log.get("entity_id") or log.get("account_id") or "user")
        user_logins.setdefault(uid, []).append(log)

    for uid, records in user_logins.items():
        if len(records) < 2:
            continue

        # Sort chronologically
        valid_records = []
        for r in records:
            dt = _parse_timestamp(r.get("timestamp"))
            lat = r.get("lat") or r.get("latitude")
            lon = r.get("lon") or r.get("longitude") or r.get("lng")
            if dt and lat is not None and lon is not None:
                try:
                    valid_records.append({
                        "dt": dt,
                        "lat": float(lat),
                        "lon": float(lon),
                        "city": r.get("city") or r.get("location") or f"{lat},{lon}",
                        "ip": r.get("ip") or r.get("ip_address") or "unknown",
                        "raw": r
                    })
                except Exception:
                    continue

        valid_records.sort(key=lambda x: x["dt"])

        for i in range(len(valid_records) - 1):
            r1 = valid_records[i]
            r2 = valid_records[i + 1]

            time_diff_hours = (r2["dt"] - r1["dt"]).total_seconds() / 3600.0
            if time_diff_hours <= 0.001:  # Simultaneous logins from different locations
                time_diff_hours = 0.001

            dist_km = _haversine_distance_km(r1["lat"], r1["lon"], r2["lat"], r2["lon"])
            if dist_km < 50.0:  # Ignore trivial nearby cell-tower jumps
                continue

            speed_kmh = dist_km / time_diff_hours
            if speed_kmh > 800.0:
                elapsed_mins = int((r2["dt"] - r1["dt"]).total_seconds() / 60)
                finding = {
                    "type": "IMPOSSIBLE_TRAVEL_SPEED",
                    "user_id": uid,
                    "location_1": r1["city"],
                    "location_2": r2["city"],
                    "distance_km": round(dist_km, 1),
                    "elapsed_minutes": elapsed_mins,
                    "velocity_kmh": round(speed_kmh, 1),
                    "ip_1": r1["ip"],
                    "ip_2": r2["ip"],
                    "description": f"User {uid} logged in from {r1['city']} and subsequently from {r2['city']} ({round(dist_km)} km away) within {elapsed_mins} minutes, requiring an impossible velocity of {round(speed_kmh):,} km/h.",
                    "severity": "CRITICAL"
                }
                findings.append(finding)

                evidence_items.append(EvidenceItem(
                    tx_id=None,
                    amount=None,
                    timestamp=str(r2["raw"].get("timestamp")),
                    entity_id=uid,
                    evidence_type=EvidenceType.IMPOSSIBLE_TRAVEL.value,
                    description=f"Impossible geo-velocity for {uid}: {r1['city']} ➔ {r2['city']} ({round(dist_km)} km in {elapsed_mins} mins, {round(speed_kmh):,} km/h).",
                    severity="CRITICAL"
                ))

    return findings, evidence_items


def run_all_anomaly_detections(
    case_id: str,
    graph_data: Optional[Any] = None,
    transactions: Optional[List[Dict[str, Any]]] = None,
    logins: Optional[List[Dict[str, Any]]] = None,
) -> AnomalyEvidencePacket:
    """
    Orchestrates all 4 forensic anomaly detection modules and compiles
    a structured AnomalyEvidencePacket.
    """
    txs = transactions or []
    logs = logins or []

    # If transactions weren't provided separately, extract financial links from graph_data
    if not txs and graph_data:
        g_dict = graph_data.dict() if hasattr(graph_data, "dict") else (graph_data if isinstance(graph_data, dict) else {})
        for link in g_dict.get("links", []):
            amt = link.get("amount")
            if amt is not None and float(amt) > 0:
                props = link.get("properties") or {}
                txs.append({
                    "id": props.get("tx_id") or f"TX-{link.get('source')}-{link.get('target')}",
                    "amount": float(amt),
                    "sender_id": link.get("source"),
                    "recipient_id": link.get("target"),
                    "timestamp": link.get("timestamp") or props.get("timestamp"),
                })

    structuring_findings, structuring_ev = detect_structuring(txs)
    drain_findings, drain_ev = detect_rapid_drain(txs)
    swarm_findings, swarm_ev = detect_device_swarms(graph_data)
    geo_findings, geo_ev = detect_geo_velocity(logs)

    all_evidence = structuring_ev + drain_ev + swarm_ev + geo_ev

    raw_metrics = {
        "total_transactions_analyzed": len(txs),
        "total_logins_analyzed": len(logs),
        "structuring_events_count": len(structuring_findings),
        "rapid_drain_events_count": len(drain_findings),
        "device_swarms_count": len(swarm_findings),
        "impossible_travel_events_count": len(geo_findings),
        "total_evidence_citations": len(all_evidence),
    }

    return AnomalyEvidencePacket(
        case_id=case_id,
        structuring_findings=structuring_findings,
        rapid_drain_findings=drain_findings,
        device_swarm_findings=swarm_findings,
        geo_velocity_findings=geo_findings,
        evidence_items=all_evidence,
        raw_metrics=raw_metrics,
    )

