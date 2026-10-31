import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from app.schemas.financial_graph import (
    Customer, BankAccount, Device, IPAddress, Merchant,
    Beneficiary, Location, Transaction
)

class EnterpriseDatabase:
    """
    Unified Single Enterprise Dataset.
    Contains all customers, accounts, devices, IPs, merchants, beneficiaries,
    locations, and transactions in ONE interconnected master database.
    """
    def __init__(self):
        self.customers: Dict[str, Customer] = {}
        self.accounts: Dict[str, BankAccount] = {}
        self.devices: Dict[str, Device] = {}
        self.ips: Dict[str, IPAddress] = {}
        self.merchants: Dict[str, Merchant] = {}
        self.beneficiaries: Dict[str, Beneficiary] = {}
        self.locations: Dict[str, Location] = {}
        self.transactions: List[Transaction] = []
        self.alerts: List[Dict[str, Any]] = []
        self._seed_master_database()

    def _seed_master_database(self):
        # 1. Common Reference Data (Locations & Merchants)
        cities = [
            ("LOC-NY", "New York", "NY", "US", 40.7128, -74.0060),
            ("LOC-CHI", "Chicago", "IL", "US", 41.8781, -87.6298),
            ("LOC-COL", "Columbus", "OH", "US", 40.0076, -83.0305),
            ("LOC-AMS", "Amsterdam", "NH", "NL", 52.3676, 4.9041),
            ("LOC-PAN", "Panama City", "PA", "PA", 8.9824, -79.5199),
            ("LOC-LON", "London", "ENG", "GB", 51.5074, -0.1278),
        ]
        for lid, city, st, co, lat, lon in cities:
            self.locations[lid] = Location(location_id=lid, city=city, state=st, country=co, lat=lat, lon=lon)

        merchants_data = [
            ("MERCH-AMAZON", "Amazon Retail", "E-Commerce", "LOW", "US"),
            ("MERCH-TARGET", "Target Superstore", "Retail", "LOW", "US"),
            ("MERCH-BOOKSTORE", "University Campus Bookstore", "Education", "LOW", "US"),
            ("MERCH-DINING", "Campus Dining Commons", "Food & Beverage", "LOW", "US"),
            ("MERCH-COFFEE", "Metro Coffee House", "Food & Beverage", "LOW", "US"),
            ("MERCH-CRYPTO-BVI", "BVI Offshore Digital Pay", "Virtual Currency", "CRITICAL", "VG"),
            ("MERCH-PANAMA-ESCROW", "Panama Escrow Partners", "Financial Services", "HIGH", "PA"),
        ]
        for mid, name, cat, risk, country in merchants_data:
            self.merchants[mid] = Merchant(merchant_id=mid, merchant_name=name, category=cat, risk_level=risk, country=country)

        # 2. Add Beneficiaries
        self.beneficiaries["BENEF-CYPRUS-88"] = Beneficiary(
            beneficiary_id="BENEF-CYPRUS-88",
            name="Apex Holdings International Ltd",
            bank_name="Bank of Cyprus Offshore",
            country="CY",
            is_high_risk_jurisdiction=True
        )

        # -------------------------------------------------------------
        # CLUSTER A: THE MULE RING (Embedded inside master dataset)
        # -------------------------------------------------------------
        mule_dev = Device(device_id="DEV-IPHONE-PRO-8912", device_type="MOBILE", os="iOS 18.2", browser_or_app="MobileBankingApp/v4.2", hardware_fingerprint="HW-IPHONE-SYNDICATE")
        self.devices[mule_dev.device_id] = mule_dev

        mule_ip1 = IPAddress(ip_address="185.220.101.5", subnet="185.220.101.0/24", isp="M247 Europe Ltd", country="NL", city="Amsterdam", is_vpn_or_proxy=True)
        mule_ip2 = IPAddress(ip_address="185.220.101.6", subnet="185.220.101.0/24", isp="M247 Europe Ltd", country="NL", city="Amsterdam", is_vpn_or_proxy=True)
        self.ips[mule_ip1.ip_address] = mule_ip1
        self.ips[mule_ip2.ip_address] = mule_ip2

        mule_names = [("CUST-101", "Lucas Vance"), ("CUST-102", "Marcus Vance"), ("CUST-103", "Elena Rostova"), ("CUST-104", "Darius Thorne"), ("CUST-105", "Chloe Bennett")]
        mule_accs = ["ACCT-US-1001", "ACCT-US-1002", "ACCT-US-1003", "ACCT-US-1004", "ACCT-US-1005"]

        for (cid, name), acc_num in zip(mule_names, mule_accs):
            self.customers[cid] = Customer(customer_id=cid, full_name=name, tax_id=f"TAX-{cid}", phone=f"+1-555-010{cid[-1]}", email=f"{name.lower().replace(' ', '.')}@example.com", risk_rating="MEDIUM")
            self.accounts[acc_num] = BankAccount(account_number=acc_num, customer_id=cid, balance=25.0, created_at="2026-08-15")

            # Structured Inflow ($9,500 - $9,900)
            inflow_tx = f"TX-MULE-IN-{cid}"
            self.transactions.append(Transaction(
                tx_id=inflow_tx, sender_account="EXTERNAL-DEPOSIT", receiver_account=acc_num,
                amount=round(random.uniform(9600.0, 9900.0), 2), timestamp="2026-10-30T14:15:00Z",
                device_id=mule_dev.device_id, ip_address=mule_ip1.ip_address, location_id="LOC-AMS",
                tx_type="DEPOSIT", description="Consulting invoice settlement"
            ))
            # Immediate Outflow to Cyprus
            outflow_tx = f"TX-MULE-OUT-{cid}"
            self.transactions.append(Transaction(
                tx_id=outflow_tx, sender_account=acc_num, beneficiary_id="BENEF-CYPRUS-88",
                amount=round(random.uniform(9500.0, 9850.0), 2), timestamp="2026-10-30T14:45:00Z",
                device_id=mule_dev.device_id, ip_address=mule_ip2.ip_address, location_id="LOC-AMS",
                tx_type="TRANSFER", description="Disbursement to holding escrow"
            ))

        # Alert triggered on Mule Ring
        self.alerts.append({
            "alert_id": "ALERT-001",
            "seed_id": "ACCT-US-1001",
            "seed_type": "ACCOUNT",
            "title": "Structuring & Rapid Pass-Through Velocity Detected",
            "trigger_reason": "Multiple structured deposits under $10,000 threshold followed by 99% liquidation to offshore beneficiary within 30 minutes.",
            "severity": "CRITICAL",
            "status": "OPEN",
            "timestamp": "2026-10-30T15:00:00Z"
        })

        # -------------------------------------------------------------
        # CLUSTER B: CAMPUS WI-FI (False-Positive Control in Master DB)
        # -------------------------------------------------------------
        campus_ip = IPAddress(ip_address="128.146.172.84", subnet="128.146.0.0/16", isp="Ohio State University", country="US", city="Columbus", is_vpn_or_proxy=False)
        self.ips[campus_ip.ip_address] = campus_ip

        students = [("CUST-201", "Sarah Jenkins", "ACCT-CAMPUS-01"), ("CUST-202", "David Patel", "ACCT-CAMPUS-02"), ("CUST-203", "Maya Lin", "ACCT-CAMPUS-03"), ("CUST-204", "James O'Connor", "ACCT-CAMPUS-04")]
        for cid, name, acc_num in students:
            self.customers[cid] = Customer(customer_id=cid, full_name=name, tax_id=f"TAX-{cid}", phone=f"+1-555-020{cid[-1]}", email=f"{name.lower().replace(' ', '.')}@osu.edu", risk_rating="LOW")
            self.accounts[acc_num] = BankAccount(account_number=acc_num, customer_id=cid, balance=1250.0, created_at="2025-08-01")
            
            dev_id = f"DEV-STUDENT-{cid}"
            self.devices[dev_id] = Device(device_id=dev_id, device_type="MOBILE", os="Android/iOS", browser_or_app="Chrome", hardware_fingerprint=f"HW-{cid}")

            self.transactions.append(Transaction(
                tx_id=f"TX-CAMPUS-{cid}", sender_account=acc_num, merchant_id="MERCH-BOOKSTORE",
                amount=round(random.uniform(15.0, 120.0), 2), timestamp="2026-10-30T11:00:00Z",
                device_id=dev_id, ip_address=campus_ip.ip_address, location_id="LOC-COL",
                tx_type="PURCHASE", description="Semester supplies"
            ))

        self.alerts.append({
            "alert_id": "ALERT-002",
            "seed_id": "128.146.172.84",
            "seed_type": "IP_ADDRESS",
            "title": "High-Volume Account Convergence on Single IP",
            "trigger_reason": "Multiple distinct customer accounts authenticating from single IP address 128.146.172.84.",
            "severity": "LOW",
            "status": "OPEN",
            "timestamp": "2026-10-30T12:00:00Z"
        })

        # -------------------------------------------------------------
        # CLUSTER C: SHELL PASS-THROUGH LAYERING (Embedded in Master DB)
        # -------------------------------------------------------------
        shell_dev = Device(device_id="DEV-LINUX-PANAMA", device_type="DESKTOP", os="Linux", browser_or_app="HeadlessBot", hardware_fingerprint="HW-PANAMA-HEADLESS")
        self.devices[shell_dev.device_id] = shell_dev

        panama_ip = IPAddress(ip_address="194.38.20.15", subnet="194.38.20.0/24", isp="DataCamp S.R.O.", country="PA", city="Panama City", is_vpn_or_proxy=True)
        self.ips[panama_ip.ip_address] = panama_ip

        self.customers["CUST-301"] = Customer(customer_id="CUST-301", full_name="Horizon Trading LLC", tax_id="TAX-US-9910", phone="+1-555-0301", email="ops@horizontrade.org", risk_rating="HIGH")
        self.customers["CUST-302"] = Customer(customer_id="CUST-302", full_name="BlueSky Logistics Corp", tax_id="TAX-US-9911", phone="+1-555-0302", email="settlement@blueskystock.net", risk_rating="HIGH")
        self.accounts["ACCT-SHELL-A"] = BankAccount(account_number="ACCT-SHELL-A", customer_id="CUST-301", balance=150.0, created_at="2026-09-01")
        self.accounts["ACCT-SHELL-B"] = BankAccount(account_number="ACCT-SHELL-B", customer_id="CUST-302", balance=85.0, created_at="2026-09-05")

        self.transactions.append(Transaction(
            tx_id="TX-LAYER-01", sender_account="EXTERNAL-WIRE", receiver_account="ACCT-SHELL-A",
            amount=75000.0, timestamp="2026-10-30T09:00:00Z", device_id=shell_dev.device_id, ip_address=panama_ip.ip_address, location_id="LOC-PAN", tx_type="DEPOSIT", description="International invoice"
        ))
        self.transactions.append(Transaction(
            tx_id="TX-LAYER-02", sender_account="ACCT-SHELL-A", receiver_account="ACCT-SHELL-B",
            amount=74400.0, timestamp="2026-10-30T09:14:00Z", device_id=shell_dev.device_id, ip_address=panama_ip.ip_address, location_id="LOC-PAN", tx_type="TRANSFER", description="Intercompany sub-contract"
        ))
        self.transactions.append(Transaction(
            tx_id="TX-LAYER-03", sender_account="ACCT-SHELL-B", merchant_id="MERCH-CRYPTO-BVI",
            amount=73900.0, timestamp="2026-10-30T09:35:00Z", device_id=shell_dev.device_id, ip_address=panama_ip.ip_address, location_id="LOC-PAN", tx_type="PURCHASE", description="Digital asset swap"
        ))

        self.alerts.append({
            "alert_id": "ALERT-003",
            "seed_id": "ACCT-SHELL-A",
            "seed_type": "ACCOUNT",
            "title": "High-Velocity Pass-Through Layering via Shell Entity",
            "trigger_reason": "Rapid transfer of $75,000 hopped across commercial accounts to offshore crypto merchant in under 40 minutes.",
            "severity": "CRITICAL",
            "status": "OPEN",
            "timestamp": "2026-10-30T10:00:00Z"
        })

        # -------------------------------------------------------------
        # CLUSTER D: CORPORATE PAYROLL BATCH (False-Positive Control)
        # -------------------------------------------------------------
        self.customers["CUST-CORP-400"] = Customer(customer_id="CUST-CORP-400", full_name="Nexus Health Logistics Corp", tax_id="TAX-CORP-4401", phone="+1-555-0400", email="payroll@nexushealth.com", risk_rating="LOW")
        self.accounts["ACCT-CORP-MAIN"] = BankAccount(account_number="ACCT-CORP-MAIN", customer_id="CUST-CORP-400", balance=350000.0, created_at="2022-03-10")

        corp_dev = Device(device_id="DEV-OFFICE-FINANCE-PC", device_type="DESKTOP", os="Windows 11", browser_or_app="Chrome Enterprise", hardware_fingerprint="HW-CORP-PC-01")
        self.devices[corp_dev.device_id] = corp_dev
        corp_ip = IPAddress(ip_address="64.104.22.18", subnet="64.104.22.0/24", isp="Cisco Systems Fiber", country="US", city="Chicago", is_vpn_or_proxy=False)
        self.ips[corp_ip.ip_address] = corp_ip

        for i in range(1, 6):
            cid = f"CUST-EMP-{i:03d}"
            acc = f"ACCT-EMP-{i:03d}"
            self.customers[cid] = Customer(customer_id=cid, full_name=f"Employee {i}", tax_id=f"TAX-EMP-{i}", phone=f"+1-555-050{i}", email=f"emp{i}@nexushealth.com", risk_rating="LOW")
            self.accounts[acc] = BankAccount(account_number=acc, customer_id=cid, balance=5000.0, created_at="2023-01-01")

            self.transactions.append(Transaction(
                tx_id=f"TX-PAYROLL-{i}", sender_account="ACCT-CORP-MAIN", receiver_account=acc,
                amount=round(random.uniform(3800.0, 5200.0), 2), timestamp="2026-10-30T08:00:00Z",
                device_id=corp_dev.device_id, ip_address=corp_ip.ip_address, location_id="LOC-CHI",
                tx_type="PAYROLL", description="Monthly Payroll Run"
            ))

        self.alerts.append({
            "alert_id": "ALERT-004",
            "seed_id": "ACCT-CORP-MAIN",
            "seed_type": "ACCOUNT",
            "title": "High Outbound Fan-Out Velocity",
            "trigger_reason": "Rapid sequence of outbound transfers executed within 60 seconds from business checking account.",
            "severity": "MEDIUM",
            "status": "OPEN",
            "timestamp": "2026-10-30T08:05:00Z"
        })

        # -------------------------------------------------------------
        # BACKGROUND NOISE: 40 Normal Everyday Customers & 150 Transactions
        # -------------------------------------------------------------
        for i in range(1, 41):
            cid = f"CUST-BG-{i:03d}"
            acc = f"ACCT-BG-{i:04d}"
            dev_id = f"DEV-BG-{i:03d}"
            ip_addr = f"72.14.{i}.{random.randint(10, 240)}"

            self.customers[cid] = Customer(customer_id=cid, full_name=f"Consumer {i}", tax_id=f"TAX-BG-{i}", phone=f"+1-555-9{i:03d}", email=f"user{i}@gmail.com", risk_rating="LOW")
            self.accounts[acc] = BankAccount(account_number=acc, customer_id=cid, balance=round(random.uniform(500.0, 8000.0), 2), created_at="2024-05-10")
            self.devices[dev_id] = Device(device_id=dev_id, device_type="MOBILE", os="iOS/Android", browser_or_app="MobileSafari", hardware_fingerprint=f"HW-BG-{i}")
            self.ips[ip_addr] = IPAddress(ip_address=ip_addr, subnet="72.14.0.0/16", isp="Verizon Fios", country="US", city="New York", is_vpn_or_proxy=False)

            # Normal retail transactions
            for t_idx in range(random.randint(2, 5)):
                tx_id = f"TX-BG-{i}-{t_idx}"
                merch_id = random.choice(["MERCH-AMAZON", "MERCH-TARGET", "MERCH-COFFEE"])
                self.transactions.append(Transaction(
                    tx_id=tx_id, sender_account=acc, merchant_id=merch_id,
                    amount=round(random.uniform(8.0, 180.0), 2), timestamp="2026-10-30T13:00:00Z",
                    device_id=dev_id, ip_address=ip_addr, location_id="LOC-NY",
                    tx_type="PURCHASE", description="Standard retail purchase"
                ))

# Singleton Master Database instance
master_db = EnterpriseDatabase()

def get_master_database() -> EnterpriseDatabase:
    return master_db
