from typing import Dict, List, Optional
from app.schemas.financial_graph import (
    Customer, BankAccount, Device, IPAddress, Merchant,
    Beneficiary, Location, Transaction, CaseDataset
)

def generate_case_001_mule_ring() -> CaseDataset:
    """
    CASE 001: Money Mule Ring (Structuring & Single Orchestration Device)
    Suspicious Typology:
    - 5 student accounts owned by distinct people.
    - All 5 accounts authenticate from ONE single mobile device (DEV-IPHONE-PRO-8912).
    - Structured incoming deposits ($9,500 - $9,850) just below the $10,000 regulatory reporting threshold.
    - Rapid pass-through: >99% drained within 30 minutes to an offshore beneficiary.
    """
    customers = [
        Customer(customer_id="CUST-101", full_name="Lucas Vance", tax_id="XXX-XX-1120", phone="+1-555-0101", email="lucas.v@gmail.com", risk_rating="MEDIUM"),
        Customer(customer_id="CUST-102", full_name="Marcus Vance", tax_id="XXX-XX-1121", phone="+1-555-0102", email="marcus.v@gmail.com", risk_rating="MEDIUM"),
        Customer(customer_id="CUST-103", full_name="Elena Rostova", tax_id="XXX-XX-4491", phone="+1-555-0103", email="elena.r@outlook.com", risk_rating="HIGH"),
        Customer(customer_id="CUST-104", full_name="Darius Thorne", tax_id="XXX-XX-8823", phone="+1-555-0104", email="darius.t@gmail.com", risk_rating="MEDIUM"),
        Customer(customer_id="CUST-105", full_name="Chloe Bennett", tax_id="XXX-XX-9012", phone="+1-555-0105", email="chloe.b@yahoo.com", risk_rating="MEDIUM"),
    ]

    accounts = [
        BankAccount(account_number="ACCT-US-1001", customer_id="CUST-101", account_type="CHECKING", balance=45.20, created_at="2026-08-15"),
        BankAccount(account_number="ACCT-US-1002", customer_id="CUST-102", account_type="CHECKING", balance=32.10, created_at="2026-08-20"),
        BankAccount(account_number="ACCT-US-1003", customer_id="CUST-103", account_type="CHECKING", balance=18.50, created_at="2026-09-01"),
        BankAccount(account_number="ACCT-US-1004", customer_id="CUST-104", account_type="CHECKING", balance=55.00, created_at="2026-09-10"),
        BankAccount(account_number="ACCT-US-1005", customer_id="CUST-105", account_type="CHECKING", balance=22.80, created_at="2026-09-14"),
    ]

    # Shared device linking all accounts!
    devices = [
        Device(device_id="DEV-IPHONE-PRO-8912", device_type="MOBILE", os="iOS 18.2", browser_or_app="MobileBankingApp/v4.2", hardware_fingerprint="A9F1-E832-77BC-D091")
    ]

    ips = [
        IPAddress(ip_address="185.220.101.5", subnet="185.220.101.0/24", isp="M247 Europe Ltd", country="NL", city="Amsterdam", is_vpn_or_proxy=True),
        IPAddress(ip_address="185.220.101.6", subnet="185.220.101.0/24", isp="M247 Europe Ltd", country="NL", city="Amsterdam", is_vpn_or_proxy=True),
    ]

    merchants: List[Merchant] = []

    beneficiaries = [
        Beneficiary(beneficiary_id="BENEF-CYPRUS-88", name="Apex Holdings International Ltd", bank_name="Bank of Cyprus Offshore", country="CY", is_high_risk_jurisdiction=True)
    ]

    locations = [
        Location(location_id="LOC-NY", city="New York", state="NY", country="US", lat=40.7128, lon=-74.0060),
        Location(location_id="LOC-AMS", city="Amsterdam", state="NH", country="NL", lat=52.3676, lon=4.9041),
    ]

    transactions = [
        # Structured Deposits (Smurfing into the 5 accounts)
        Transaction(tx_id="TX-MULE-01", sender_account="EXTERNAL-SOURCE-A", receiver_account="ACCT-US-1001", amount=9800.0, timestamp="2026-10-30T14:10:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.5", location_id="LOC-AMS", tx_type="DEPOSIT", description="Consulting invoice settlement"),
        Transaction(tx_id="TX-MULE-02", sender_account="EXTERNAL-SOURCE-B", receiver_account="ACCT-US-1002", amount=9650.0, timestamp="2026-10-30T14:18:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.5", location_id="LOC-AMS", tx_type="DEPOSIT", description="Private project fee"),
        Transaction(tx_id="TX-MULE-03", sender_account="EXTERNAL-SOURCE-C", receiver_account="ACCT-US-1003", amount=9900.0, timestamp="2026-10-30T14:25:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.6", location_id="LOC-AMS", tx_type="DEPOSIT", description="Contract research stipend"),
        Transaction(tx_id="TX-MULE-04", sender_account="EXTERNAL-SOURCE-D", receiver_account="ACCT-US-1004", amount=9750.0, timestamp="2026-10-30T14:35:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.6", location_id="LOC-AMS", tx_type="DEPOSIT", description="E-commerce distribution grant"),
        Transaction(tx_id="TX-MULE-05", sender_account="EXTERNAL-SOURCE-E", receiver_account="ACCT-US-1005", amount=9850.0, timestamp="2026-10-30T14:42:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.6", location_id="LOC-AMS", tx_type="DEPOSIT", description="Software development advance"),

        # Immediate Rapid Pass-Through Wires to Cyprus Beneficiary
        Transaction(tx_id="TX-DRAIN-01", sender_account="ACCT-US-1001", beneficiary_id="BENEF-CYPRUS-88", amount=9750.0, timestamp="2026-10-30T14:55:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.5", location_id="LOC-AMS", tx_type="TRANSFER", description="Disbursement to holding escrow"),
        Transaction(tx_id="TX-DRAIN-02", sender_account="ACCT-US-1002", beneficiary_id="BENEF-CYPRUS-88", amount=9600.0, timestamp="2026-10-30T15:02:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.5", location_id="LOC-AMS", tx_type="TRANSFER", description="Disbursement to holding escrow"),
        Transaction(tx_id="TX-DRAIN-03", sender_account="ACCT-US-1003", beneficiary_id="BENEF-CYPRUS-88", amount=9850.0, timestamp="2026-10-30T15:10:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.6", location_id="LOC-AMS", tx_type="TRANSFER", description="Disbursement to holding escrow"),
        Transaction(tx_id="TX-DRAIN-04", sender_account="ACCT-US-1004", beneficiary_id="BENEF-CYPRUS-88", amount=9700.0, timestamp="2026-10-30T15:15:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.6", location_id="LOC-AMS", tx_type="TRANSFER", description="Disbursement to holding escrow"),
        Transaction(tx_id="TX-DRAIN-05", sender_account="ACCT-US-1005", beneficiary_id="BENEF-CYPRUS-88", amount=9800.0, timestamp="2026-10-30T15:20:00Z", device_id="DEV-IPHONE-PRO-8912", ip_address="185.220.101.6", location_id="LOC-AMS", tx_type="TRANSFER", description="Disbursement to holding escrow"),
    ]

    return CaseDataset(
        case_id="CASE_001_MULE_RING",
        title="Syndicate Money Mule Ring with Shared Hardware Orchestration",
        description="5 student accounts structured deposits below $10,000 from one device and drained to Cyprus beneficiary.",
        expected_category="FRAUD_RING",
        customers=customers,
        accounts=accounts,
        devices=devices,
        ips=ips,
        merchants=merchants,
        beneficiaries=beneficiaries,
        locations=locations,
        transactions=transactions
    )

def generate_case_002_campus_wifi() -> CaseDataset:
    """
    CASE 002: Campus Wi-Fi Shared Infrastructure (Benign False-Positive Control)
    Innocent Typology:
    - 6 university students sharing 1 single campus Wi-Fi IP address.
    - Each student has their own unique device and personal account.
    - Normal retail purchases (bookstore, café, campus dining).
    - AI must recognize this as legitimate shared network infrastructure and reject fraud claims!
    """
    customers = [
        Customer(customer_id="CUST-201", full_name="Sarah Jenkins", tax_id="XXX-XX-3011", phone="+1-555-0201", email="s.jenkins@osu.edu", risk_rating="LOW"),
        Customer(customer_id="CUST-202", full_name="David Patel", tax_id="XXX-XX-3012", phone="+1-555-0202", email="d.patel@osu.edu", risk_rating="LOW"),
        Customer(customer_id="CUST-203", full_name="Maya Lin", tax_id="XXX-XX-3013", phone="+1-555-0203", email="m.lin@osu.edu", risk_rating="LOW"),
        Customer(customer_id="CUST-204", full_name="James O'Connor", tax_id="XXX-XX-3014", phone="+1-555-0204", email="j.oconnor@osu.edu", risk_rating="LOW"),
        Customer(customer_id="CUST-205", full_name="Aisha Rahman", tax_id="XXX-XX-3015", phone="+1-555-0205", email="a.rahman@osu.edu", risk_rating="LOW"),
        Customer(customer_id="CUST-206", full_name="Tyler Brooks", tax_id="XXX-XX-3016", phone="+1-555-0206", email="t.brooks@osu.edu", risk_rating="LOW"),
    ]

    accounts = [
        BankAccount(account_number="ACCT-CAMPUS-01", customer_id="CUST-201", balance=1420.0, created_at="2025-08-01"),
        BankAccount(account_number="ACCT-CAMPUS-02", customer_id="CUST-202", balance=890.0, created_at="2025-08-01"),
        BankAccount(account_number="ACCT-CAMPUS-03", customer_id="CUST-203", balance=2100.0, created_at="2025-08-01"),
        BankAccount(account_number="ACCT-CAMPUS-04", customer_id="CUST-204", balance=640.0, created_at="2025-08-01"),
        BankAccount(account_number="ACCT-CAMPUS-05", customer_id="CUST-205", balance=1850.0, created_at="2025-08-01"),
        BankAccount(account_number="ACCT-CAMPUS-06", customer_id="CUST-206", balance=920.0, created_at="2025-08-01"),
    ]

    devices = [
        Device(device_id="DEV-MAC-201", device_type="DESKTOP", os="macOS 15.1", browser_or_app="Safari/18.0", hardware_fingerprint="MAC-CUST-201"),
        Device(device_id="DEV-PIXEL-202", device_type="MOBILE", os="Android 15", browser_or_app="Chrome/130", hardware_fingerprint="PIXEL-CUST-202"),
        Device(device_id="DEV-IPHONE-203", device_type="MOBILE", os="iOS 18.1", browser_or_app="MobileBankingApp", hardware_fingerprint="IPHONE-CUST-203"),
        Device(device_id="DEV-DELL-204", device_type="DESKTOP", os="Windows 11", browser_or_app="Edge/129", hardware_fingerprint="DELL-CUST-204"),
        Device(device_id="DEV-SAMSUNG-205", device_type="MOBILE", os="Android 14", browser_or_app="Chrome/130", hardware_fingerprint="SAMSUNG-CUST-205"),
        Device(device_id="DEV-MAC-206", device_type="DESKTOP", os="macOS 14.7", browser_or_app="Chrome/130", hardware_fingerprint="MAC-CUST-206"),
    ]

    ips = [
        IPAddress(ip_address="128.146.172.84", subnet="128.146.0.0/16", isp="Ohio State University", country="US", city="Columbus", is_vpn_or_proxy=False)
    ]

    merchants = [
        Merchant(merchant_id="MERCH-BOOKSTORE", merchant_name="University Campus Bookstore", category="Education", risk_level="LOW"),
        Merchant(merchant_id="MERCH-DINING", merchant_name="Campus Commons Dining", category="Food & Beverage", risk_level="LOW"),
        Merchant(merchant_id="MERCH-COFFEE", merchant_name="Buckeye Coffee House", category="Food & Beverage", risk_level="LOW"),
    ]

    locations = [
        Location(location_id="LOC-COLUMBUS", city="Columbus", state="OH", country="US", lat=40.0076, lon=-83.0305)
    ]

    transactions = [
        Transaction(tx_id="TX-CAMPUS-01", sender_account="ACCT-CAMPUS-01", merchant_id="MERCH-BOOKSTORE", amount=124.50, timestamp="2026-10-30T10:15:00Z", device_id="DEV-MAC-201", ip_address="128.146.172.84", location_id="LOC-COLUMBUS", tx_type="PURCHASE", description="Textbooks semester fall"),
        Transaction(tx_id="TX-CAMPUS-02", sender_account="ACCT-CAMPUS-02", merchant_id="MERCH-DINING", amount=18.75, timestamp="2026-10-30T11:45:00Z", device_id="DEV-PIXEL-202", ip_address="128.146.172.84", location_id="LOC-COLUMBUS", tx_type="PURCHASE", description="Lunch meal pass"),
        Transaction(tx_id="TX-CAMPUS-03", sender_account="ACCT-CAMPUS-03", merchant_id="MERCH-COFFEE", amount=6.50, timestamp="2026-10-30T12:05:00Z", device_id="DEV-IPHONE-203", ip_address="128.146.172.84", location_id="LOC-COLUMBUS", tx_type="PURCHASE", description="Latte and snack"),
        Transaction(tx_id="TX-CAMPUS-04", sender_account="ACCT-CAMPUS-04", merchant_id="MERCH-BOOKSTORE", amount=89.00, timestamp="2026-10-30T13:20:00Z", device_id="DEV-DELL-204", ip_address="128.146.172.84", location_id="LOC-COLUMBUS", tx_type="PURCHASE", description="Lab chemistry notebook"),
        Transaction(tx_id="TX-CAMPUS-05", sender_account="ACCT-CAMPUS-05", merchant_id="MERCH-DINING", amount=24.10, timestamp="2026-10-30T14:00:00Z", device_id="DEV-SAMSUNG-205", ip_address="128.146.172.84", location_id="LOC-COLUMBUS", tx_type="PURCHASE", description="Dinner meal plan"),
        Transaction(tx_id="TX-CAMPUS-06", sender_account="ACCT-CAMPUS-06", merchant_id="MERCH-COFFEE", amount=8.20, timestamp="2026-10-30T14:40:00Z", device_id="DEV-MAC-206", ip_address="128.146.172.84", location_id="LOC-COLUMBUS", tx_type="PURCHASE", description="Coffee with study group"),
    ]

    return CaseDataset(
        case_id="CASE_002_CAMPUS_WIFI",
        title="University Dormitory Shared Wi-Fi (False-Positive Control)",
        description="Multiple student accounts sharing 1 single public IP. Distinct devices and normal low-risk merchant retail purchases.",
        expected_category="BENIGN_FALSE_POSITIVE",
        customers=customers,
        accounts=accounts,
        devices=devices,
        ips=ips,
        merchants=merchants,
        beneficiaries=[],
        locations=locations,
        transactions=transactions
    )

def generate_case_003_rapid_layering() -> CaseDataset:
    """
    CASE 003: Multi-Hop Rapid Layering (Pass-Through Shell Accounts)
    Suspicious Typology:
    - $75,000 injected into Shell A.
    - Hops from Shell A -> Shell B -> Shell C within 45 minutes.
    - Rapid 99% velocity-to-drain into high-risk offshore crypto merchant.
    - Zero resting balance, dormant accounts revived suddenly.
    """
    customers = [
        Customer(customer_id="CUST-301", full_name="Horizon Trading LLC", tax_id="TAX-US-9910", phone="+1-555-0301", email="finance@horizontrade.org", risk_rating="HIGH"),
        Customer(customer_id="CUST-302", full_name="BlueSky Logistics Corp", tax_id="TAX-US-9911", phone="+1-555-0302", email="ops@blueskystock.net", risk_rating="HIGH"),
        Customer(customer_id="CUST-303", full_name="Vanguard Consulting Partners", tax_id="TAX-US-9912", phone="+1-555-0303", email="settlement@vanguardconsult.co", risk_rating="CRITICAL"),
    ]

    accounts = [
        BankAccount(account_number="ACCT-SHELL-A", customer_id="CUST-301", account_type="BUSINESS", balance=150.0, created_at="2026-09-01"),
        BankAccount(account_number="ACCT-SHELL-B", customer_id="CUST-302", account_type="BUSINESS", balance=85.0, created_at="2026-09-05"),
        BankAccount(account_number="ACCT-SHELL-C", customer_id="CUST-303", account_type="BUSINESS", balance=40.0, created_at="2026-09-10"),
    ]

    devices = [
        Device(device_id="DEV-LINUX-PROXY-01", device_type="DESKTOP", os="Linux Ubuntu 24", browser_or_app="HeadlessChrome/128", hardware_fingerprint="VIRT-LINUX-HASH-1"),
        Device(device_id="DEV-LINUX-PROXY-02", device_type="DESKTOP", os="Linux Ubuntu 24", browser_or_app="HeadlessChrome/128", hardware_fingerprint="VIRT-LINUX-HASH-2"),
    ]

    ips = [
        IPAddress(ip_address="194.38.20.15", subnet="194.38.20.0/24", isp="DataCamp S.R.O.", country="PA", city="Panama City", is_vpn_or_proxy=True),
        IPAddress(ip_address="194.38.20.16", subnet="194.38.20.0/24", isp="DataCamp S.R.O.", country="PA", city="Panama City", is_vpn_or_proxy=True),
    ]

    merchants = [
        Merchant(merchant_id="MERCH-CRYPTO-OFFSHORE", merchant_name="BVI Digital Asset Exchange", category="Virtual Currency", risk_level="CRITICAL", country="VG")
    ]

    locations = [
        Location(location_id="LOC-PANAMA", city="Panama City", state="PA", country="PA", lat=8.9824, lon=-79.5199)
    ]

    transactions = [
        # Inflow
        Transaction(tx_id="TX-LAYER-01", sender_account="EXTERNAL-WIRE-ORIGIN", receiver_account="ACCT-SHELL-A", amount=75000.0, timestamp="2026-10-30T09:00:00Z", device_id="DEV-LINUX-PROXY-01", ip_address="194.38.20.15", location_id="LOC-PANAMA", tx_type="DEPOSIT", description="International invoice settlement"),
        # Hop 1: A -> B
        Transaction(tx_id="TX-LAYER-02", sender_account="ACCT-SHELL-A", receiver_account="ACCT-SHELL-B", amount=74400.0, timestamp="2026-10-30T09:14:00Z", device_id="DEV-LINUX-PROXY-01", ip_address="194.38.20.15", location_id="LOC-PANAMA", tx_type="TRANSFER", description="Intercompany sub-contracting"),
        # Hop 2: B -> C
        Transaction(tx_id="TX-LAYER-03", sender_account="ACCT-SHELL-B", receiver_account="ACCT-SHELL-C", amount=73900.0, timestamp="2026-10-30T09:32:00Z", device_id="DEV-LINUX-PROXY-02", ip_address="194.38.20.16", location_id="LOC-PANAMA", tx_type="TRANSFER", description="Escrow consulting allocation"),
        # Final Hop: C -> Crypto Merchant
        Transaction(tx_id="TX-LAYER-04", sender_account="ACCT-SHELL-C", merchant_id="MERCH-CRYPTO-OFFSHORE", amount=73500.0, timestamp="2026-10-30T09:44:00Z", device_id="DEV-LINUX-PROXY-02", ip_address="194.38.20.16", location_id="LOC-PANAMA", tx_type="PURCHASE", description="Liquidity purchase digital tokens"),
    ]

    return CaseDataset(
        case_id="CASE_003_RAPID_LAYERING",
        title="High-Velocity Shell Pass-Through & Layering Chain",
        description="Rapid 3-hop transfer chain moving $75,000 to offshore crypto exchange in under 45 minutes with zero resting balance.",
        expected_category="PASS_THROUGH_LAYERING",
        customers=customers,
        accounts=accounts,
        devices=devices,
        ips=ips,
        merchants=merchants,
        beneficiaries=[],
        locations=locations,
        transactions=transactions
    )

def generate_case_004_corporate_payroll() -> CaseDataset:
    """
    CASE 004: Corporate Payroll Batch Disbursement (Benign False-Positive Control)
    Innocent Typology:
    - 1 corporate commercial account ("Nexus Health Logistics Corp") disbursing 5 employee salaries on the 30th.
    - Rapid fan-out within 5 minutes, but regular recurring monthly cadence and registered corporate tax ID.
    - AI must recognize that fan-out velocity alone is NOT proof of crime!
    """
    customers = [
        Customer(customer_id="CUST-CORP-400", full_name="Nexus Health Logistics Corp", tax_id="TAX-CORP-4401", phone="+1-555-0400", email="payroll@nexushealth.com", risk_rating="LOW"),
        Customer(customer_id="CUST-EMP-401", full_name="Rachel Green", tax_id="XXX-XX-5501", phone="+1-555-0401", email="rachel.g@gmail.com", risk_rating="LOW"),
        Customer(customer_id="CUST-EMP-402", full_name="Ross Geller", tax_id="XXX-XX-5502", phone="+1-555-0402", email="ross.g@gmail.com", risk_rating="LOW"),
        Customer(customer_id="CUST-EMP-403", full_name="Monica Geller", tax_id="XXX-XX-5503", phone="+1-555-0403", email="monica.g@gmail.com", risk_rating="LOW"),
        Customer(customer_id="CUST-EMP-404", full_name="Chandler Bing", tax_id="XXX-XX-5504", phone="+1-555-0404", email="chandler.b@gmail.com", risk_rating="LOW"),
        Customer(customer_id="CUST-EMP-405", full_name="Joey Tribbiani", tax_id="XXX-XX-5505", phone="+1-555-0405", email="joey.t@gmail.com", risk_rating="LOW"),
    ]

    accounts = [
        BankAccount(account_number="ACCT-CORP-MAIN", customer_id="CUST-CORP-400", account_type="BUSINESS", balance=285000.0, created_at="2022-03-10"),
        BankAccount(account_number="ACCT-EMP-01", customer_id="CUST-EMP-401", balance=4120.0, created_at="2023-01-15"),
        BankAccount(account_number="ACCT-EMP-02", customer_id="CUST-EMP-402", balance=5890.0, created_at="2023-02-10"),
        BankAccount(account_number="ACCT-EMP-03", customer_id="CUST-EMP-403", balance=6200.0, created_at="2023-04-05"),
        BankAccount(account_number="ACCT-EMP-04", customer_id="CUST-EMP-404", balance=7800.0, created_at="2023-06-20"),
        BankAccount(account_number="ACCT-EMP-05", customer_id="CUST-EMP-405", balance=3450.0, created_at="2023-08-11"),
    ]

    devices = [
        Device(device_id="DEV-OFFICE-FINANCE-PC", device_type="DESKTOP", os="Windows 11 Enterprise", browser_or_app="Chrome/130 Enterprise", hardware_fingerprint="NEXUS-FIN-CORP-01")
    ]

    ips = [
        IPAddress(ip_address="64.104.22.18", subnet="64.104.22.0/24", isp="Cisco Systems Dedicated Fiber", country="US", city="Chicago", is_vpn_or_proxy=False)
    ]

    locations = [
        Location(location_id="LOC-CHICAGO", city="Chicago", state="IL", country="US", lat=41.8781, lon=-87.6298)
    ]

    transactions = [
        Transaction(tx_id="TX-PAY-01", sender_account="ACCT-CORP-MAIN", receiver_account="ACCT-EMP-01", amount=4850.0, timestamp="2026-10-30T08:00:01Z", device_id="DEV-OFFICE-FINANCE-PC", ip_address="64.104.22.18", location_id="LOC-CHICAGO", tx_type="PAYROLL", description="Monthly Payroll - October 2026"),
        Transaction(tx_id="TX-PAY-02", sender_account="ACCT-CORP-MAIN", receiver_account="ACCT-EMP-02", amount=5200.0, timestamp="2026-10-30T08:00:03Z", device_id="DEV-OFFICE-FINANCE-PC", ip_address="64.104.22.18", location_id="LOC-CHICAGO", tx_type="PAYROLL", description="Monthly Payroll - October 2026"),
        Transaction(tx_id="TX-PAY-03", sender_account="ACCT-CORP-MAIN", receiver_account="ACCT-EMP-03", amount=5600.0, timestamp="2026-10-30T08:00:05Z", device_id="DEV-OFFICE-FINANCE-PC", ip_address="64.104.22.18", location_id="LOC-CHICAGO", tx_type="PAYROLL", description="Monthly Payroll - October 2026"),
        Transaction(tx_id="TX-PAY-04", sender_account="ACCT-CORP-MAIN", receiver_account="ACCT-EMP-04", amount=6100.0, timestamp="2026-10-30T08:00:07Z", device_id="DEV-OFFICE-FINANCE-PC", ip_address="64.104.22.18", location_id="LOC-CHICAGO", tx_type="PAYROLL", description="Monthly Payroll - October 2026"),
        Transaction(tx_id="TX-PAY-05", sender_account="ACCT-CORP-MAIN", receiver_account="ACCT-EMP-05", amount=3900.0, timestamp="2026-10-30T08:00:09Z", device_id="DEV-OFFICE-FINANCE-PC", ip_address="64.104.22.18", location_id="LOC-CHICAGO", tx_type="PAYROLL", description="Monthly Payroll - October 2026"),
    ]

    return CaseDataset(
        case_id="CASE_004_CORPORATE_PAYROLL",
        title="Corporate Monthly Payroll Batch Run (False-Positive Control)",
        description="Single commercial enterprise account executing rapid fan-out disbursements to employees on monthly payday.",
        expected_category="BENIGN_FALSE_POSITIVE",
        customers=customers,
        accounts=accounts,
        devices=devices,
        ips=ips,
        merchants=[],
        beneficiaries=[],
        locations=locations,
        transactions=transactions
    )

CASES_REGISTRY: Dict[str, CaseDataset] = {
    "CASE_001_MULE_RING": generate_case_001_mule_ring(),
    "CASE_002_CAMPUS_WIFI": generate_case_002_campus_wifi(),
    "CASE_003_RAPID_LAYERING": generate_case_003_rapid_layering(),
    "CASE_004_CORPORATE_PAYROLL": generate_case_004_corporate_payroll(),
}

def get_case(case_id: str) -> Optional[CaseDataset]:
    return CASES_REGISTRY.get(case_id)

def list_cases() -> List[Dict[str, str]]:
    return [
        {
            "case_id": c.case_id,
            "title": c.title,
            "description": c.description,
            "category": c.expected_category,
            "customer_count": str(len(c.customers)),
            "transaction_count": str(len(c.transactions)),
        }
        for c in CASES_REGISTRY.values()
    ]

