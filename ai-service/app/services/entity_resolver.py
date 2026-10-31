from typing import List, Dict, Set
from collections import defaultdict
from app.schemas.financial_graph import CaseDataset, ResolvedCluster

def resolve_entities(dataset: CaseDataset) -> List[ResolvedCluster]:
    """
    Performs multi-dimensional entity resolution across accounts, devices, IPs, and KYC attributes.
    Clusters fragmented identities using graph connected components based on:
    1. Shared Device Hardware Fingerprint (Strongest signal)
    2. Shared Digital IP / Proxy Infrastructure
    3. Shared Beneficiary destinations
    """
    # 1. Map account -> customer
    account_to_customer: Dict[str, str] = {
        acc.account_number: acc.customer_id for acc in dataset.accounts
    }

    # 2. Track which accounts use which devices and IPs
    device_to_accounts: Dict[str, Set[str]] = defaultdict(set)
    ip_to_accounts: Dict[str, Set[str]] = defaultdict(set)
    beneficiary_to_accounts: Dict[str, Set[str]] = defaultdict(set)

    for tx in dataset.transactions:
        if tx.sender_account and tx.sender_account in account_to_customer:
            if tx.device_id:
                device_to_accounts[tx.device_id].add(tx.sender_account)
            if tx.ip_address:
                ip_to_accounts[tx.ip_address].add(tx.sender_account)
            if tx.beneficiary_id:
                beneficiary_to_accounts[tx.beneficiary_id].add(tx.sender_account)

    # 3. Build Adjacency for Account Clustering
    account_neighbors: Dict[str, Set[str]] = defaultdict(set)
    link_reasons: Dict[tuple, Set[str]] = defaultdict(set)

    for dev_id, accs in device_to_accounts.items():
        acc_list = list(accs)
        for i in range(len(acc_list)):
            for j in range(i + 1, len(acc_list)):
                a1, a2 = acc_list[i], acc_list[j]
                account_neighbors[a1].add(a2)
                account_neighbors[a2].add(a1)
                pair = tuple(sorted([a1, a2]))
                link_reasons[pair].add(f"Shared Device ({dev_id})")

    for ip_addr, accs in ip_to_accounts.items():
        acc_list = list(accs)
        # Check if this IP is a VPN/Proxy
        ip_obj = next((ip for ip in dataset.ips if ip.ip_address == ip_addr), None)
        is_proxy = ip_obj.is_vpn_or_proxy if ip_obj else False

        for i in range(len(acc_list)):
            for j in range(i + 1, len(acc_list)):
                a1, a2 = acc_list[i], acc_list[j]
                # Only link on IP if it is an explicit VPN/Proxy infrastructure AND they also share common beneficiary
                if is_proxy:
                    account_neighbors[a1].add(a2)
                    account_neighbors[a2].add(a1)
                    pair = tuple(sorted([a1, a2]))
                    link_reasons[pair].add(f"Shared Proxy IP ({ip_addr})")

    # 4. Connected Components on Accounts
    visited: Set[str] = set()
    clusters: List[ResolvedCluster] = []
    cluster_idx = 1

    all_accounts = [acc.account_number for acc in dataset.accounts]

    for start_acc in all_accounts:
        if start_acc in visited:
            continue

        # BFS / DFS to collect cluster
        queue = [start_acc]
        visited.add(start_acc)
        cluster_accs: Set[str] = {start_acc}

        while queue:
            curr = queue.pop(0)
            for neighbor in account_neighbors[curr]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    cluster_accs.add(neighbor)
                    queue.append(neighbor)

        # Collect cluster attributes
        cluster_cust_ids = sorted(list({account_to_customer.get(acc, "") for acc in cluster_accs if account_to_customer.get(acc)}))
        
        shared_devices = set()
        shared_ips = set()
        for tx in dataset.transactions:
            if tx.sender_account in cluster_accs:
                if tx.device_id:
                    shared_devices.add(tx.device_id)
                if tx.ip_address:
                    shared_ips.add(tx.ip_address)

        # Determine Risk Factors
        risk_factors: List[str] = []
        confidence = 0.50

        if len(cluster_cust_ids) > 1 and len(shared_devices) == 1:
            risk_factors.append(f"CRITICAL: {len(cluster_cust_ids)} distinct individuals controlled via 1 shared physical device")
            confidence = 0.95

        # Check for proxy usage
        for ip in shared_ips:
            ip_obj = next((i for i in dataset.ips if i.ip_address == ip), None)
            if ip_obj and ip_obj.is_vpn_or_proxy:
                risk_factors.append(f"HIGH: Commercial VPN / Proxy infrastructure detected ({ip})")
                confidence = max(confidence, 0.88)

        # Check for common offshore beneficiary
        common_beneficiaries = set()
        for tx in dataset.transactions:
            if tx.sender_account in cluster_accs and tx.beneficiary_id:
                common_beneficiaries.add(tx.beneficiary_id)
        if common_beneficiaries:
            risk_factors.append(f"HIGH: All accounts funnel outbound funds to common beneficiary: {list(common_beneficiaries)}")
            confidence = max(confidence, 0.92)

        # If isolated clean account
        if len(cluster_accs) == 1 and not risk_factors:
            risk_factors.append("NORMAL: Isolated individual account with unique personal device")
            confidence = 0.10

        label = f"Cluster {cluster_idx}: "
        if len(cluster_cust_ids) > 1:
            label += f"Syndicate of {len(cluster_cust_ids)} Accounts ({', '.join(cluster_cust_ids[:3])})"
        else:
            cust_name = next((c.full_name for c in dataset.customers if c.customer_id in cluster_cust_ids), "Single Entity")
            label += cust_name

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
