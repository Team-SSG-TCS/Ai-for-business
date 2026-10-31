from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class Customer(BaseModel):
    customer_id: str
    full_name: str
    tax_id: str
    phone: str
    email: str
    risk_rating: str = "LOW"  # LOW, MEDIUM, HIGH, CRITICAL
    kyc_status: str = "VERIFIED"

class BankAccount(BaseModel):
    account_number: str
    customer_id: str
    account_type: str = "CHECKING"  # CHECKING, SAVINGS, BUSINESS, OFFSHORE
    balance: float = 0.0
    currency: str = "USD"
    created_at: str

class Device(BaseModel):
    device_id: str
    device_type: str = "MOBILE"  # MOBILE, DESKTOP, TABLET, EMULATOR
    os: str
    browser_or_app: str
    hardware_fingerprint: str

class IPAddress(BaseModel):
    ip_address: str
    subnet: str
    isp: str
    country: str
    city: str
    is_vpn_or_proxy: bool = False

class Merchant(BaseModel):
    merchant_id: str
    merchant_name: str
    category: str
    risk_level: str = "LOW"
    country: str = "US"

class Beneficiary(BaseModel):
    beneficiary_id: str
    name: str
    bank_name: str
    country: str
    is_high_risk_jurisdiction: bool = False

class Location(BaseModel):
    location_id: str
    city: str
    state: str
    country: str
    lat: float
    lon: float

class Transaction(BaseModel):
    tx_id: str
    sender_account: str
    receiver_account: Optional[str] = None
    merchant_id: Optional[str] = None
    beneficiary_id: Optional[str] = None
    amount: float
    currency: str = "USD"
    timestamp: str
    device_id: str
    ip_address: str
    location_id: str
    tx_type: str = "TRANSFER"  # TRANSFER, DEPOSIT, WITHDRAWAL, PURCHASE, PAYROLL
    description: str = ""

class CaseDataset(BaseModel):
    case_id: str
    title: str
    description: str
    expected_category: str  # FRAUD_RING, PASS_THROUGH_LAYERING, BENIGN_FALSE_POSITIVE, CORPORATE_PAYROLL
    customers: List[Customer]
    accounts: List[BankAccount]
    devices: List[Device]
    ips: List[IPAddress]
    merchants: List[Merchant]
    beneficiaries: List[Beneficiary]
    locations: List[Location]
    transactions: List[Transaction]

class ResolvedCluster(BaseModel):
    cluster_id: str
    cluster_label: str
    customer_ids: List[str]
    account_numbers: List[str]
    shared_device_ids: List[str]
    shared_ips: List[str]
    risk_factors: List[str]
    confidence_score: float

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # customer, account, device, ip, merchant, beneficiary, location
    risk_level: str = "NORMAL"  # NORMAL, SUSPICIOUS, CRITICAL
    properties: Dict[str, Any] = Field(default_factory=dict)

class GraphLink(BaseModel):
    source: str
    target: str
    relation: str  # OWNS, LOGGED_IN_FROM, CONNECTED_VIA, LOCATED_AT, TRANSFERRED_TO, PAID_MERCHANT, SENT_TO_BENEFICIARY
    amount: Optional[float] = None
    timestamp: Optional[str] = None
    tx_id: Optional[str] = None

class GraphData(BaseModel):
    case_id: str
    nodes: List[GraphNode]
    links: List[GraphLink]
    metrics: Dict[str, Any] = Field(default_factory=dict)
