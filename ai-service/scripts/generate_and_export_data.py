import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import json
import csv
from typing import Dict, Any

# Ensure app imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.dataset_generator import CASES_REGISTRY, get_case
from app.schemas.financial_graph import CaseDataset

EXPORT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

def export_case_to_csv_and_json(case: CaseDataset):
    case_folder = os.path.join(EXPORT_DIR, case.case_id)
    os.makedirs(case_folder, exist_ok=True)

    print(f"📦 Exporting {case.case_id} ({case.title})...")

    # 1. Export Full Case as JSON
    json_path = os.path.join(case_folder, f"{case.case_id}_full.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(case.model_dump(), f, indent=2)
    print(f"   ✓ JSON: {json_path}")

    # 2. Export 8 Individual Entity CSVs
    entity_maps = {
        "customers.csv": [c.model_dump() for c in case.customers],
        "accounts.csv": [a.model_dump() for a in case.accounts],
        "devices.csv": [d.model_dump() for d in case.devices],
        "ip_addresses.csv": [i.model_dump() for i in case.ips],
        "merchants.csv": [m.model_dump() for m in case.merchants],
        "beneficiaries.csv": [b.model_dump() for b in case.beneficiaries],
        "locations.csv": [l.model_dump() for l in case.locations],
        "transactions.csv": [t.model_dump() for t in case.transactions],
    }

    for filename, rows in entity_maps.items():
        csv_path = os.path.join(case_folder, filename)
        if rows:
            keys = rows[0].keys()
            with open(csv_path, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
                writer.writerows(rows)
            print(f"   ✓ CSV: {filename} ({len(rows)} rows)")
        else:
            # Create empty CSV with placeholder
            with open(csv_path, "w", newline="", encoding="utf-8") as f:
                f.write("id,info\n")
            print(f"   ✓ CSV: {filename} (0 rows - empty)")

def main():
    os.makedirs(EXPORT_DIR, exist_ok=True)
    print(f"🚀 Generating & Exporting Financial Crime Datasets into: {EXPORT_DIR}\n")

    for case_id, case in CASES_REGISTRY.items():
        export_case_to_csv_and_json(case)
        print("-" * 50)

    print("\n✅ All 4 benchmark datasets successfully generated and exported!")
    print(f"📁 Location: {EXPORT_DIR}")

if __name__ == "__main__":
    main()
