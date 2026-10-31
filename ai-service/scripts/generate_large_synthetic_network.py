import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import random
import uuid
import json
import csv
from datetime import datetime, timedelta

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "SYNTHETIC_LARGE_ENTERPRISE"))

FIRST_NAMES = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Charlotte", "Elijah", "Amelia", "James", "Sophia", "William", "Isabella", "Benjamin", "Mia", "Lucas", "Evelyn", "Henry", "Harper", "Alexander", "Camila"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

MERCHANT_NAMES = [
    ("Amazon Retail", "E-Commerce", "LOW"),
    ("Target Superstore", "Retail", "LOW"),
    ("Shell Gas & Express", "Fuel", "LOW"),
    ("Starbucks Coffee", "Food & Beverage", "LOW"),
    ("Delta Air Lines", "Travel", "LOW"),
    ("Uber Technologies", "Transportation", "LOW"),
    ("BVI Offshore Digital Pay", "Virtual Currency", "CRITICAL"),
    ("Panama Escrow Global", "Financial Services", "HIGH"),
    ("Global Remit Express", "Money Service Business", "HIGH"),
]

DEVICE_TYPES = [
    ("MOBILE", "iOS 18.2", "MobileBankingApp/v4.2"),
    ("MOBILE", "Android 15", "Chrome/130"),
    ("DESKTOP", "macOS 15.1", "Safari/18.0"),
    ("DESKTOP", "Windows 11", "Edge/129"),
    ("EMULATOR", "Linux Android Emulator", "HeadlessBankingBot/v1"),
]

CITIES = [
    ("New York", "NY", "US", 40.7128, -74.0060),
    ("Chicago", "IL", "US", 41.8781, -87.6298),
    ("Columbus", "OH", "US", 40.0076, -83.0305),
    ("San Francisco", "CA", "US", 37.7749, -122.4194),
    ("London", "ENG", "GB", 51.5074, -0.1278),
    ("Amsterdam", "NH", "NL", 52.3676, 4.9041),
    ("Panama City", "PA", "PA", 8.9824, -79.5199),
]

def generate_large_network(num_customers=50, num_transactions=250):
    os.makedirs(DATA_DIR, exist_ok=True)
    print(f"⚙️  Synthesizing Enterprise Financial Network: {num_customers} Customers, {num_transactions} Transactions...")

    # 1. Generate Locations
    locations = []
    for i, (city, state, country, lat, lon) in enumerate(CITIES):
        locations.append({
            "location_id": f"LOC-{i+1:03d}",
            "city": city,
            "state": state,
            "country": country,
            "lat": lat,
            "lon": lon
        })

    # 2. Generate Merchants
    merchants = []
    for i, (name, cat, risk) in enumerate(MERCHANT_NAMES):
        merchants.append({
            "merchant_id": f"MERCH-{i+1:03d}",
            "merchant_name": name,
            "category": cat,
            "risk_level": risk,
            "country": "US" if risk == "LOW" else "VG"
        })

    # 3. Generate Devices & IPs
    devices = []
    for i in range(15):
        dtype, os_name, browser = random.choice(DEVICE_TYPES)
        devices.append({
            "device_id": f"DEV-{uuid.uuid4().hex[:8].upper()}",
            "device_type": dtype,
            "os": os_name,
            "browser_or_app": browser,
            "hardware_fingerprint": f"HW-{uuid.uuid4().hex[:12].upper()}"
        })

    ips = []
    for i in range(12):
        is_proxy = i >= 9  # Last 3 are proxies
        ips.append({
            "ip_address": f"192.168.{i+1}.{random.randint(10, 240)}",
            "subnet": f"192.168.{i+1}.0/24",
            "isp": "Cloudflare Proxy Network" if is_proxy else "Comcast Business",
            "country": "NL" if is_proxy else "US",
            "city": "Amsterdam" if is_proxy else "New York",
            "is_vpn_or_proxy": is_proxy
        })

    # 4. Generate Customers & Bank Accounts
    customers = []
    accounts = []
    for i in range(num_customers):
        cid = f"CUST-{i+1:03d}"
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        risk = "HIGH" if i < 5 else "LOW"

        customers.append({
            "customer_id": cid,
            "full_name": f"{first} {last}",
            "tax_id": f"TAX-{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}",
            "phone": f"+1-555-{random.randint(1000, 9999)}",
            "email": f"{first.lower()}.{last.lower()}@example.com",
            "risk_rating": risk,
            "kyc_status": "VERIFIED"
        })

        # 1-2 accounts per customer
        acc_num = f"ACCT-US-{10000 + i}"
        accounts.append({
            "account_number": acc_num,
            "customer_id": cid,
            "account_type": "CHECKING" if i % 4 != 0 else "BUSINESS",
            "balance": round(random.uniform(500.0, 35000.0), 2),
            "currency": "USD",
            "created_at": "2025-01-10"
        })

    # 5. Generate Transactions (Normal Activity + Injected Smurfing + Layering)
    transactions = []
    base_time = datetime(2026, 10, 30, 8, 0, 0)

    # Injected Mule Syndicate Device (Shared across first 4 accounts)
    syndicate_device = devices[0]["device_id"]
    syndicate_ip = ips[-1]["ip_address"]

    for tx_idx in range(num_transactions):
        tx_id = f"TX-{tx_idx+1:05d}"
        time_offset = timedelta(minutes=tx_idx * 4)
        current_time = (base_time + time_offset).isoformat() + "Z"

        # 10% chance: Structured Smurfing into one of the syndicate accounts
        if tx_idx < 10:
            sender = "EXTERNAL-DEPOSIT"
            receiver = accounts[tx_idx % 4]["account_number"]
            amt = round(random.uniform(9200.0, 9950.0), 2)  # Structuring!
            dev_id = syndicate_device
            ip_addr = syndicate_ip
            tx_type = "DEPOSIT"
            desc = "Structured consulting disbursement"
            merch_id = None
            loc_id = locations[0]["location_id"]
        # Normal retail spending or P2P transfer
        else:
            sender = random.choice(accounts)["account_number"]
            dev = random.choice(devices)
            dev_id = dev["device_id"]
            ip_addr = random.choice(ips)["ip_address"]
            loc_id = random.choice(locations)["location_id"]

            if random.random() < 0.60:
                # Merchant Purchase
                receiver = None
                merch = random.choice(merchants)
                merch_id = merch["merchant_id"]
                amt = round(random.uniform(5.0, 250.0), 2)
                tx_type = "PURCHASE"
                desc = f"Payment to {merch['merchant_name']}"
            else:
                # Account-to-Account P2P
                receiver = random.choice(accounts)["account_number"]
                while receiver == sender:
                    receiver = random.choice(accounts)["account_number"]
                merch_id = None
                amt = round(random.uniform(25.0, 1200.0), 2)
                tx_type = "TRANSFER"
                desc = "Peer-to-peer transfer"

        transactions.append({
            "tx_id": tx_id,
            "sender_account": sender,
            "receiver_account": receiver,
            "merchant_id": merch_id,
            "beneficiary_id": None,
            "amount": amt,
            "currency": "USD",
            "timestamp": current_time,
            "device_id": dev_id,
            "ip_address": ip_addr,
            "location_id": loc_id,
            "tx_type": tx_type,
            "description": desc
        })

    # 6. Save as CSVs and JSON
    tables = {
        "customers.csv": customers,
        "accounts.csv": accounts,
        "devices.csv": devices,
        "ip_addresses.csv": ips,
        "merchants.csv": merchants,
        "locations.csv": locations,
        "transactions.csv": transactions,
    }

    for fname, data in tables.items():
        fpath = os.path.join(DATA_DIR, fname)
        if data:
            keys = data[0].keys()
            with open(fpath, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
                writer.writerows(data)
        print(f"   ✓ Generated: {fname} ({len(data)} rows)")

    full_json_path = os.path.join(DATA_DIR, "enterprise_network_full.json")
    with open(full_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "customers": customers,
            "accounts": accounts,
            "devices": devices,
            "ips": ips,
            "merchants": merchants,
            "locations": locations,
            "transactions": transactions
        }, f, indent=2)

    print(f"\n🎉 Large Enterprise Synthetic Network exported to:\n📁 {DATA_DIR}")

if __name__ == "__main__":
    generate_large_network(50, 250)
