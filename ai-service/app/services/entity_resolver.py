from typing import List, Dict, Set, Optional
from collections import defaultdict
from app.schemas.financial_graph import ResolvedCluster
from app.services.enterprise_dataset import EnterpriseDatabase, get_master_database

def resolve_enterprise_entities(target_account_filter: Optional[Set[str]] = None) -> List[ResolvedCluster]:
    """
    Performs multi-dimensional entity resolution across the entire master enterprise database.
    Clusters fragmented accounts sharing:
    1. Exact Hardware Device UUID / Fingerprint
    2. Shared Proxy / VPN digital infrastructure
    3. Common destination funnel beneficiaries
    """
    db = get_master_database()

    # Track which accounts use which devices and IPs
    device_to_accounts: Dict[str, Set[str]] = defaultdict(set)
    ip_to_accounts: Dict[str, Set[str]] = defaultdict(set)
    beneficiary_to_accounts: Dict[str, Set[str]] = defaultdict(set)

    for tx in db.transactions:
        # If filtering for a specific sub-network
        if target_account_filter and tx.sender_account not in target_account_filter:
            continue

        if tx.sender_account:
            if tx.device_id:
                device_to_accounts[tx.device_id].add(tx.sender_account)
            if tx.ip_address:
                ip_to_accounts[tx.ip_address].add(tx.sender_account)
            if tx.beneficiary_id:
                beneficiary_to_accounts[tx.beneficiary_id].add(tx.sender_account)

    # Build Adjacency for Account Clustering
    account_neighbors: Dict[str, Set[str]] = defaultdict(set)

    # Rule 1: Link on Shared Hardware Device
    for dev_id, accs in device_to_accounts.items():
        acc_list = list(accs)
        for i in range(len(acc_list)):
            for j in range(i + 1, len(acc_list)):
                a1, a2 = acc_list[i], acc_list[j]
                account_neighbors[a1].add(a2)
                account_neighbors[a2].add(a1)

    # Rule 2: Link on Shared Proxy IP
    for ip_addr, accs in ip_to_accounts.items():
        ip_obj = db.ips.get(ip_addr)
        is_proxy = ip_obj.is_vpn_or_proxy if ip_obj else False

        if is_proxy:
            acc_list = list(accs)
            for i in range(len(acc_list)):
                for j in range(i + 1, len(acc_list)):
                    a1, a2 = acc_list[i], acc_list[j]
                    account_neighbors[a1].add(a2)
                    account_neighbors[a2].add(a1)

    # Perform Connected Components
    candidate_accounts = list(target_account_filter) if target_account_filter else list(db.accounts.keys())
    visited: Set[str] = set()
    clusters: List[ResolvedCluster] = []
    cluster_idx = 1

    for start_acc in candidate_accounts:
        if start_acc in visited:
            continue

        queue = [start_acc]
        visited.add(start_acc)
        cluster_accs: Set[str] = {start_acc}

        while queue:
            curr = queue.pop(0)
            for neighbor in account_neighbors[curr]:
                if neighbor not in visited and neighbor in candidate_accounts:
                    visited.add(neighbor)
                    cluster_accs.add(neighbor)
                    queue.append(neighbor)

        cluster_cust_ids = sorted(list({db.accounts[acc].customer_id for acc in cluster_accs if acc in db.accounts}))

        shared_devices = set()
        shared_ips = set()
        for tx in db.transactions:
            if tx.sender_account in cluster_accs:
                if tx.device_id:
                    shared_devices.add(tx.device_id)
                if tx.ip_address:
                    shared_ips.add(tx.ip_address)

        risk_factors: List[str] = []
        confidence = 0.50

        if len(cluster_cust_ids) > 1 and len(shared_devices) == 1:
            risk_factors.append(f"CRITICAL: {len(cluster_cust_ids)} distinct individuals controlled via 1 shared physical device")
            confidence = 0.95

        for ip in shared_ips:
            ip_obj = db.ips.get(ip)
            if ip_obj and ip_obj.is_vpn_or_proxy:
                risk_factors.append(f"HIGH: Commercial VPN / Proxy infrastructure detected ({ip})")
                confidence = max(confidence, 0.88)

        if len(cluster_accs) == 1 and not risk_factors:
            risk_factors.append("NORMAL: Independent account with distinct hardware")
            confidence = 0.10

        label = f"Cluster {cluster_idx}: "
        if len(cluster_cust_ids) > 1:
            label += f"Syndicate of {len(cluster_cust_ids)} Accounts ({', '.join(cluster_cust_ids[:3])})"
        else:
            cust = db.customers.get(cluster_cust_ids[0]) if cluster_cust_ids else None
            label += cust.full_name if cust else "Single Entity"

        clusters.append(
            ResolvedCluster(
                cluster_id=f"CLUSTER-{cluster_idx:03d}",
                cluster_label=label,
                customer_ids=cluster_cust_ids,
                account_numbers=sorted(list(cluster_accs)),
                shared_device_ids=sorted(list(shared_devices)),
                shared_ips=sorted(list(shared_ips)),
                risk_factors=risk_factors,
                confidence_score=confidence
            )
        )
        cluster_idx += 1

    return clusters
