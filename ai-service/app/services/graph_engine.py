import networkx as nx
from typing import Dict, Any, List, Tuple
from app.schemas.financial_graph import (
    CaseDataset, ResolvedCluster, GraphData, GraphNode, GraphLink
)

def build_financial_graph(dataset: CaseDataset, clusters: List[ResolvedCluster]) -> Tuple[nx.DiGraph, GraphData]:
    """
    Constructs a heterogeneous directed relationship graph using NetworkX.
    Maps all 8 entities: Customer, Account, Device, IP, Merchant, Beneficiary, Location, Transaction.
    Returns both the NetworkX graph object and the serializable GraphData.
    """
    G = nx.DiGraph()

    # Create a quick lookup for account cluster
    account_to_cluster: Dict[str, str] = {}
    for c in clusters:
        for acc in c.account_numbers:
            account_to_cluster[acc] = c.cluster_id

    nodes_list: List[GraphNode] = []
    links_list: List[GraphLink] = []

    # 1. Add Customer Nodes
    for cust in dataset.customers:
        risk = "CRITICAL" if cust.risk_rating in ["HIGH", "CRITICAL"] else "NORMAL"
        props = {
            "full_name": cust.full_name,
            "tax_id": cust.tax_id,
            "phone": cust.phone,
            "email": cust.email,
            "risk_rating": cust.risk_rating,
        }
        G.add_node(cust.customer_id, type="customer", label=cust.full_name, **props)
        nodes_list.append(
            GraphNode(id=cust.customer_id, label=cust.full_name, type="customer", risk_level=risk, properties=props)
        )

    # 2. Add Bank Account Nodes & OWNS Edges
    for acc in dataset.accounts:
        cluster_id = account_to_cluster.get(acc.account_number, "UNCLUSTERED")
        props = {
            "account_number": acc.account_number,
            "balance": acc.balance,
            "account_type": acc.account_type,
            "cluster_id": cluster_id,
        }
        G.add_node(acc.account_number, type="account", label=acc.account_number, **props)
        nodes_list.append(
            GraphNode(id=acc.account_number, label=acc.account_number, type="account", risk_level="NORMAL", properties=props)
        )

        # Edge: Customer OWNS Account
        if G.has_node(acc.customer_id):
            G.add_edge(acc.customer_id, acc.account_number, relation="OWNS")
            links_list.append(
                GraphLink(source=acc.customer_id, target=acc.account_number, relation="OWNS")
            )

    # 3. Add Device Nodes
    for dev in dataset.devices:
        props = {
            "device_id": dev.device_id,
            "device_type": dev.device_type,
            "os": dev.os,
            "hardware_fingerprint": dev.hardware_fingerprint,
        }
        G.add_node(dev.device_id, type="device", label=f"{dev.os} ({dev.device_id[:12]})", **props)
        nodes_list.append(
            GraphNode(id=dev.device_id, label=f"{dev.os} ({dev.device_id[:12]})", type="device", risk_level="SUSPICIOUS", properties=props)
        )

    # 4. Add IP Address Nodes
    for ip in dataset.ips:
        risk = "CRITICAL" if ip.is_vpn_or_proxy else "NORMAL"
        props = {
            "ip_address": ip.ip_address,
            "isp": ip.isp,
            "country": ip.country,
            "city": ip.city,
            "is_vpn_or_proxy": ip.is_vpn_or_proxy,
        }
        label = f"{ip.ip_address} ({ip.city}, {ip.country})"
        if ip.is_vpn_or_proxy:
            label += " [PROXY]"
        G.add_node(ip.ip_address, type="ip", label=label, **props)
        nodes_list.append(
            GraphNode(id=ip.ip_address, label=label, type="ip", risk_level=risk, properties=props)
        )

    # 5. Add Merchant Nodes
    for m in dataset.merchants:
        risk = "CRITICAL" if m.risk_level in ["HIGH", "CRITICAL"] else "NORMAL"
        props = {
            "merchant_name": m.merchant_name,
            "category": m.category,
            "risk_level": m.risk_level,
            "country": m.country,
        }
        G.add_node(m.merchant_id, type="merchant", label=m.merchant_name, **props)
        nodes_list.append(
            GraphNode(id=m.merchant_id, label=m.merchant_name, type="merchant", risk_level=risk, properties=props)
        )

    # 6. Add Beneficiary Nodes
    for b in dataset.beneficiaries:
        risk = "CRITICAL" if b.is_high_risk_jurisdiction else "NORMAL"
        props = {
            "name": b.name,
            "bank_name": b.bank_name,
            "country": b.country,
            "is_high_risk_jurisdiction": b.is_high_risk_jurisdiction,
        }
        label = f"{b.name} ({b.country})"
        G.add_node(b.beneficiary_id, type="beneficiary", label=label, **props)
        nodes_list.append(
            GraphNode(id=b.beneficiary_id, label=label, type="beneficiary", risk_level=risk, properties=props)
        )

    # 7. Add Locations
    for loc in dataset.locations:
        props = {"city": loc.city, "country": loc.country, "lat": loc.lat, "lon": loc.lon}
        label = f"{loc.city}, {loc.country}"
        G.add_node(loc.location_id, type="location", label=label, **props)
        nodes_list.append(
            GraphNode(id=loc.location_id, label=label, type="location", risk_level="NORMAL", properties=props)
        )

    # 8. Add Transaction Edges & Telemetry Links
    total_volume = 0.0
    for tx in dataset.transactions:
        total_volume += tx.amount

        # Telemetry: Account -> Device (LOGGED_IN_FROM)
        if tx.sender_account and tx.device_id and G.has_node(tx.sender_account) and G.has_node(tx.device_id):
            if not G.has_edge(tx.sender_account, tx.device_id):
                G.add_edge(tx.sender_account, tx.device_id, relation="LOGGED_IN_FROM")
                links_list.append(
                    GraphLink(source=tx.sender_account, target=tx.device_id, relation="LOGGED_IN_FROM")
                )

        # Telemetry: Device -> IP (CONNECTED_VIA)
        if tx.device_id and tx.ip_address and G.has_node(tx.device_id) and G.has_node(tx.ip_address):
            if not G.has_edge(tx.device_id, tx.ip_address):
                G.add_edge(tx.device_id, tx.ip_address, relation="CONNECTED_VIA")
                links_list.append(
                    GraphLink(source=tx.device_id, target=tx.ip_address, relation="CONNECTED_VIA")
                )

        # Transaction Edge: Account -> Account
        if tx.sender_account and tx.receiver_account and G.has_node(tx.sender_account) and G.has_node(tx.receiver_account):
            G.add_edge(tx.sender_account, tx.receiver_account, relation="TRANSFERRED_TO", amount=tx.amount, timestamp=tx.timestamp, tx_id=tx.tx_id)
            links_list.append(
                GraphLink(source=tx.sender_account, target=tx.receiver_account, relation="TRANSFERRED_TO", amount=tx.amount, timestamp=tx.timestamp, tx_id=tx.tx_id)
            )

        # Transaction Edge: Account -> Merchant
        if tx.sender_account and tx.merchant_id and G.has_node(tx.sender_account) and G.has_node(tx.merchant_id):
            G.add_edge(tx.sender_account, tx.merchant_id, relation="PAID_MERCHANT", amount=tx.amount, timestamp=tx.timestamp, tx_id=tx.tx_id)
            links_list.append(
                GraphLink(source=tx.sender_account, target=tx.merchant_id, relation="PAID_MERCHANT", amount=tx.amount, timestamp=tx.timestamp, tx_id=tx.tx_id)
            )

        # Transaction Edge: Account -> Beneficiary
        if tx.sender_account and tx.beneficiary_id and G.has_node(tx.sender_account) and G.has_node(tx.beneficiary_id):
            G.add_edge(tx.sender_account, tx.beneficiary_id, relation="SENT_TO_BENEFICIARY", amount=tx.amount, timestamp=tx.timestamp, tx_id=tx.tx_id)
            links_list.append(
                GraphLink(source=tx.sender_account, target=tx.beneficiary_id, relation="SENT_TO_BENEFICIARY", amount=tx.amount, timestamp=tx.timestamp, tx_id=tx.tx_id)
            )

    # 9. Compute Graph Metrics
    betweenness = nx.betweenness_centrality(G)
    max_betweenness_node = max(betweenness, key=betweenness.get) if betweenness else "N/A"

    # In-degree & Out-degree analysis
    in_degrees = dict(G.in_degree())
    out_degrees = dict(G.out_degree())

    # Cycle Detection
    cycles: List[List[str]] = []
    try:
        cycles = list(nx.simple_cycles(G))
    except Exception:
        pass

    metrics: Dict[str, Any] = {
        "node_count": G.number_of_nodes(),
        "edge_count": G.number_of_edges(),
        "transaction_count": len(dataset.transactions),
        "total_volume_usd": round(total_volume, 2),
        "max_betweenness_hub": max_betweenness_node,
        "max_betweenness_score": round(betweenness.get(max_betweenness_node, 0.0), 4),
        "cycles_detected": len(cycles),
        "cycles": cycles[:5],
        "top_inflow_nodes": sorted(in_degrees.items(), key=lambda x: x[1], reverse=True)[:3],
        "top_outflow_nodes": sorted(out_degrees.items(), key=lambda x: x[1], reverse=True)[:3],
    }

    graph_data = GraphData(
        case_id=dataset.case_id,
        nodes=nodes_list,
        links=links_list,
        metrics=metrics
    )

    return G, graph_data
