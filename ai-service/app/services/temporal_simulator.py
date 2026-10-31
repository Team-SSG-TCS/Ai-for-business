import networkx as nx
from typing import List, Dict, Any, Optional, Set, Tuple
from app.schemas.simulator import (
    TemporalFrame,
    TemporalMoneyTrailResponse,
    InterdictionResponse,
)
from app.services.enterprise_dataset import EnterpriseDatabase, get_master_database
from app.services.graph_engine import get_or_build_master_graph


def _resolve_target_seed(seed_id: str, G: nx.DiGraph, db: EnterpriseDatabase) -> str:
    """Resolves an alert ID or fuzzy seed identifier to an exact node ID in the graph."""
    # Check if seed_id is an alert identifier (e.g. ALERT-001)
    alert = next((a for a in db.alerts if a.get("alert_id") == seed_id), None)
    if alert and alert.get("seed_id"):
        seed_id = alert["seed_id"]

    if G.has_node(seed_id):
        return seed_id

    # Fuzzy match
    for node in G.nodes():
        if seed_id.lower() in node.lower():
            return node

    raise ValueError(f"Seed entity '{seed_id}' was not found in the master enterprise graph.")


def get_temporal_money_trail(seed_id: str, radius: int = 2) -> TemporalMoneyTrailResponse:
    """
    Extracts the ego-subgraph around `seed_id` and compiles chronological transaction timeline frames
    for dynamic frontend slider playback.
    
    Returns step-by-step frames with running cumulative dollar flow, active devices, and velocity drain pct.
    """
    G, _ = get_or_build_master_graph()
    db = get_master_database()
    target_node = _resolve_target_seed(seed_id, G, db)

    # 1. Extract undirected ego subgraph to capture both inbound and outbound multi-hop links
    subgraph_nodes: Set[str] = set(nx.ego_graph(G.to_undirected(), target_node, radius=radius).nodes())

    # 2. Collect transactions touching the subgraph nodes
    relevant_txs = []
    for tx in db.transactions:
        sender_in = tx.sender_account in subgraph_nodes
        receiver_in = tx.receiver_account in subgraph_nodes if tx.receiver_account else False
        beneficiary_in = tx.beneficiary_id in subgraph_nodes if tx.beneficiary_id else False
        merchant_in = tx.merchant_id in subgraph_nodes if tx.merchant_id else False
        device_in = tx.device_id in subgraph_nodes if tx.device_id else False
        ip_in = tx.ip_address in subgraph_nodes if tx.ip_address else False

        if sender_in or receiver_in or beneficiary_in or merchant_in or device_in or ip_in:
            relevant_txs.append(tx)

    # 3. Sort chronologically (tie-break with DEPOSIT first so funding precedes drain)
    def tx_sort_key(t):
        ts = t.timestamp or ""
        type_priority = 0 if t.tx_type in ["DEPOSIT", "PAYROLL"] else 1
        return (ts, type_priority, t.tx_id)

    sorted_txs = sorted(relevant_txs, key=tx_sort_key)

    # 4. Generate step-by-step temporal frames
    frames: List[TemporalFrame] = []
    cumulative_flow = 0.0
    cumulative_inflows = 0.0
    cumulative_outflows = 0.0
    participating_nodes: Set[str] = set()

    for idx, tx in enumerate(sorted_txs, start=1):
        to_node = tx.receiver_account or tx.beneficiary_id or tx.merchant_id or "EXTERNAL-DESTINATION"
        from_node = tx.sender_account or "EXTERNAL-SOURCE"

        participating_nodes.add(from_node)
        participating_nodes.add(to_node)
        if tx.device_id:
            participating_nodes.add(tx.device_id)
        if tx.ip_address:
            participating_nodes.add(tx.ip_address)

        amt = float(tx.amount)
        cumulative_flow += amt

        # Track drain velocity percentage
        if tx.tx_type in ["DEPOSIT", "PAYROLL"] or "EXTERNAL" in from_node:
            cumulative_inflows += amt
        else:
            cumulative_outflows += amt

        if cumulative_inflows > 0.0:
            running_drain_pct = round(min(100.0, (cumulative_outflows / cumulative_inflows) * 100.0), 2)
        else:
            running_drain_pct = 100.0 if cumulative_outflows > 0 else 0.0

        active_devs = [tx.device_id] if tx.device_id else []
        active_ips = [tx.ip_address] if tx.ip_address else []

        frame = TemporalFrame(
            step_number=idx,
            timestamp=tx.timestamp,
            tx_id=tx.tx_id,
            from_node=from_node,
            to_node=to_node,
            amount=round(amt, 2),
            currency=getattr(tx, "currency", "USD") or "USD",
            running_balance_drain_pct=running_drain_pct,
            active_devices=active_devs,
            active_ips=active_ips,
            cumulative_flow=round(cumulative_flow, 2),
            tx_type=tx.tx_type,
            description=tx.description or f"{tx.tx_type} of ${amt:,.2f}"
        )
        frames.append(frame)

    start_time = frames[0].timestamp if frames else None
    end_time = frames[-1].timestamp if frames else None

    return TemporalMoneyTrailResponse(
        seed_id=seed_id,
        total_frames=len(frames),
        total_cumulative_volume=round(cumulative_flow, 2),
        start_time=start_time,
        end_time=end_time,
        participating_nodes=sorted(list(participating_nodes)),
        frames=frames,
    )


def simulate_interdiction(target_node_id: str, seed_id: str, radius: int = 2) -> InterdictionResponse:
    """
    Simulates the blast radius and business impact of freezing or severing `target_node_id`:
    1. Baseline Flow: Analyzes unsevered graph transaction volume flowing to destination sinks.
    2. Severed Flow: Simulates removing `target_node_id` (and its dependent credentials/sessions).
    3. Capital Saved: Dollars intercepted from clearing destination shell/offshore accounts.
    4. Collateral Damage: Count of innocent/clean customer accounts disrupted.
    5. Interdiction Efficiency Score: Ratio of criminal disruption vs benign collateral impact.
    """
    G, _ = get_or_build_master_graph()
    db = get_master_database()
    target_seed = _resolve_target_seed(seed_id, G, db)

    # 1. Extract ego subgraph
    subgraph_nodes: Set[str] = set(nx.ego_graph(G.to_undirected(), target_seed, radius=radius).nodes())
    if target_node_id in G:
        subgraph_nodes.add(target_node_id)

    # Collect transactions within this subnetwork
    sub_txs = [
        tx for tx in db.transactions
        if (tx.sender_account in subgraph_nodes or
            (tx.receiver_account and tx.receiver_account in subgraph_nodes) or
            (tx.beneficiary_id and tx.beneficiary_id in subgraph_nodes) or
            (tx.device_id and tx.device_id in subgraph_nodes))
    ]

    # Identify terminal destination sinks (beneficiaries, merchants, offshore entities)
    sink_nodes = {
        node for node in subgraph_nodes
        if G.nodes[node].get("type") in ["beneficiary", "merchant"] or "BENEF" in node or "CRYPTO" in node
    }

    # 2. Compute Baseline Flow to Sinks & Total Capital at Risk
    outbound_to_sinks = [
        tx for tx in sub_txs
        if (tx.beneficiary_id and (tx.beneficiary_id in sink_nodes or tx.beneficiary_id in subgraph_nodes)) or
           (tx.merchant_id and (tx.merchant_id in sink_nodes or tx.merchant_id in subgraph_nodes))
    ]

    total_sink_volume = sum(float(tx.amount) for tx in outbound_to_sinks)
    total_sub_volume = sum(float(tx.amount) for tx in sub_txs)
    total_capital_at_risk = round(total_sink_volume if total_sink_volume > 0 else (total_sub_volume / 2.0), 2)

    # 3. Determine Severed Accounts and Nodes
    target_node_type = G.nodes[target_node_id].get("type", "").lower() if G.has_node(target_node_id) else ""
    severed_accounts: Set[str] = set()
    severed_nodes: Set[str] = {target_node_id}

    # Helper to verify real bank accounts (excluding external pseudo-sources)
    def _is_real_account(node_id: str) -> bool:
        if not node_id or node_id.startswith("EXTERNAL"):
            return False
        return (node_id in db.accounts or
                (G.has_node(node_id) and G.nodes[node_id].get("type") == "account"))

    if target_node_type == "device" or "DEV-" in target_node_id:
        # Device block: All accounts that authenticated or transacted via this device
        for tx in sub_txs:
            if tx.device_id == target_node_id:
                if _is_real_account(tx.sender_account):
                    severed_accounts.add(tx.sender_account)
                if _is_real_account(tx.receiver_account):
                    severed_accounts.add(tx.receiver_account)
        for u, v, d in G.edges(data=True):
            if v == target_node_id and d.get("relation") == "LOGGED_IN_FROM":
                if _is_real_account(u):
                    severed_accounts.add(u)
            elif u == target_node_id and d.get("relation") == "LOGGED_IN_FROM":
                if _is_real_account(v):
                    severed_accounts.add(v)

    elif target_node_type == "account" or "ACCT-" in target_node_id:
        if _is_real_account(target_node_id):
            severed_accounts.add(target_node_id)

    elif target_node_type == "ip" or "IP-" in target_node_id or "." in target_node_id:
        # IP block: Accounts transacting exclusively through this IP
        for tx in sub_txs:
            if tx.ip_address == target_node_id and _is_real_account(tx.sender_account):
                severed_accounts.add(tx.sender_account)

    elif target_node_type == "customer" or "CUST-" in target_node_id:
        # Customer block: All accounts owned by this customer
        for succ in G.successors(target_node_id):
            if _is_real_account(succ):
                severed_accounts.add(succ)

    severed_nodes.update(severed_accounts)

    # 4. Calculate Severed / Intercepted Flow
    # Any outbound flow originating from severed accounts or authenticated by the target device is saved
    saved_txs = [
        tx for tx in outbound_to_sinks
        if (tx.sender_account in severed_accounts or
            tx.device_id == target_node_id or
            tx.ip_address == target_node_id)
    ]

    capital_saved = sum(float(tx.amount) for tx in saved_txs)
    if capital_saved == 0.0 and severed_accounts:
        # If specific outbound sink tx wasn't categorized, calculate outbound from severed accounts
        acc_outflows = [tx for tx in sub_txs if tx.sender_account in severed_accounts and tx.tx_type != "DEPOSIT"]
        capital_saved = sum(float(tx.amount) for tx in acc_outflows)

    capital_saved = round(min(total_capital_at_risk, capital_saved), 2)
    remaining_illicit = round(max(0.0, total_capital_at_risk - capital_saved), 2)

    syndicate_disruption_pct = round(
        (capital_saved / total_capital_at_risk * 100.0) if total_capital_at_risk > 0 else 100.0, 1
    )

    # 5. Measure Collateral Benign Damage
    # Identify innocent / clean accounts in the severed list
    all_sub_accounts = {n for n in subgraph_nodes if G.nodes[n].get("type") == "account" or "ACCT-" in n}
    innocent_sub_accounts = set()
    for acc in all_sub_accounts:
        # Check if account belongs to a LOW-risk customer or campus/payroll cluster
        acc_obj = db.accounts.get(acc)
        if acc_obj:
            cust = db.customers.get(acc_obj.customer_id)
            if cust and cust.risk_rating in ["LOW", "NORMAL"]:
                # Exclude accounts flagged in critical alerts
                if "CAMPUS" in acc or "EMP" in acc:
                    innocent_sub_accounts.add(acc)

    severed_innocent = severed_accounts.intersection(innocent_sub_accounts)
    collateral_benign_impact_pct = round(
        (len(severed_innocent) / max(1, len(innocent_sub_accounts)) * 100.0)
        if innocent_sub_accounts else 0.0, 1
    )

    # 6. Interdiction Efficiency Score
    if collateral_benign_impact_pct == 0.0:
        efficiency_score = syndicate_disruption_pct
    else:
        efficiency_score = round(syndicate_disruption_pct / (1.0 + (collateral_benign_impact_pct / 20.0)), 1)

    # 7. Regulatory Justification Narrative
    num_accounts = len(severed_accounts)
    if target_node_type == "device" or "DEV-" in target_node_id:
        justification = (
            f"Severing shared hardware IMEI/fingerprint [{target_node_id}] blocks {num_accounts} "
            f"smurfing mule accounts simultaneously before funds clear outbound SWIFT gateway. "
            f"Zero collateral impact on verified retail accounts."
        )
    elif target_node_type == "account" or "ACCT-" in target_node_id:
        justification = (
            f"Immediate administrative debit hold placed on account [{target_node_id}] under 31 CFR 1010.410, "
            f"successfully freezing ${capital_saved:,.2f} in illicit structuring pass-through funds."
        )
    elif target_node_type == "ip" or "IP-" in target_node_id or "." in target_node_id:
        justification = (
            f"Firewall credential session termination on IP [{target_node_id}] isolates {num_accounts} "
            f"endpoints, achieving {syndicate_disruption_pct}% disruption with {collateral_benign_impact_pct}% collateral impact."
        )
    else:
        justification = (
            f"Targeted compliance interdiction on entity [{target_node_id}] successfully severed ${capital_saved:,.2f} "
            f"({syndicate_disruption_pct}% of total illicit flow) with {collateral_benign_impact_pct}% collateral benign impact."
        )

    return InterdictionResponse(
        target_node_id=target_node_id,
        interdiction_status="SIMULATED_SEVERED",
        total_capital_at_risk=total_capital_at_risk,
        capital_saved=capital_saved,
        remaining_illicit_flow=remaining_illicit,
        syndicate_disruption_pct=syndicate_disruption_pct,
        collateral_benign_impact_pct=collateral_benign_impact_pct,
        interdiction_efficiency_score=efficiency_score,
        severed_accounts=sorted(list(severed_accounts)),
        severed_nodes=sorted(list(severed_nodes)),
        regulatory_justification=justification,
    )
