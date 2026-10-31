export interface Customer {
  id: string;
  name: string;
  panMask: string;
  phoneMask: string;
  email: string;
  city: string;
  state: string;
  occupation: string;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  kycStatus: 'VERIFIED' | 'TIER1' | 'PENDING';
  accounts: string[];
  devices: string[];
  networkId?: string;
}

export interface BankAccount {
  id: string;
  customerId: string;
  bankName: string;
  accountNumberMask: string;
  ifsc: string;
  type: 'SAVINGS' | 'CURRENT' | 'NRE' | 'CORPORATE';
  balance: number;
  currency: string;
  openedDate: string;
  status: 'ACTIVE' | 'RESTRICTED' | 'FROZEN';
  riskScore: number;
}

export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  fromCustomerName: string;
  toCustomerName: string;
  amount: number;
  timestamp: string;
  channel: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI';
  status: 'COMPLETED' | 'FLAGGED' | 'BLOCKED';
  patternFlag?: string;
  networkId?: string;
  narrative?: string;
}

export interface Device {
  id: string;
  fingerprintHash: string;
  model: string;
  os: string;
  isEmulator: boolean;
  emulatorIndicators: string[];
  isRooted: boolean;
  firstSeen: string;
  lastSeen: string;
  associatedAccounts: string[];
  associatedCustomers: string[];
  sessionCount: number;
  riskScore: number;
}

export interface IPAddress {
  ip: string;
  classification: 'VPN' | 'Proxy' | 'Tor Exit Node' | 'Hosting Provider' | 'Residential' | 'Mobile Carrier';
  isp: string;
  asn: string;
  country: string;
  city: string;
  riskScore: number;
  sessionCount: number;
  associatedAccounts: string[];
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumberMask: string;
  bankName: string;
  ifsc: string;
  addedDate: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  flagReason?: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  upiId: string;
  terminalId: string;
  riskScore: number;
  volume30d: number;
}

export interface HistoricalAlert {
  id: string;
  customerId: string;
  accountId: string;
  type: string;
  triggerDate: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  disposition: 'ESCALATED' | 'CLEARED' | 'SUSPICIOUS_REPORT_FILED';
  description: string;
}

export interface EvidenceItem {
  id: string;
  type: 'TRANSACTION' | 'DEVICE' | 'IP' | 'ACCOUNT' | 'HISTORICAL_ALERT';
  description: string;
  sourceRecord: string;
  relatedEntity: string;
  supportsHypothesis: 'SUSPICIOUS' | 'LEGITIMATE' | 'NEUTRAL';
  timestamp: string;
  confidenceScore: number;
  details: Record<string, any>;
}

export interface SuspiciousNetwork {
  id: string;
  name: string;
  caseId: string;
  caseTitle: string;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detectionPattern: string;
  detectionSignals: string[];
  totalVolume: number;
  detectedAt: string;
  status: 'UNDER_INVESTIGATION' | 'NEW' | 'AWAITING_EVIDENCE' | 'PENDING_REVIEW' | 'ESCALATED' | 'CLOSED';
  assignedInvestigator: string;
  entitiesInvolved: {
    customers: number;
    accounts: number;
    devices: number;
    ips: number;
    beneficiaries: number;
  };
  customerIds: string[];
  accountIds: string[];
  deviceIds: string[];
  ipAddresses: string[];
  whyFlagged: string;
  detectionRulesTriggered: string[];
  missingInfo: string;
  evidenceIds: string[];
  observedActivity: string;
  suspiciousIndicators: string[];
  contradictoryEvidence: string[];
  alternativeExplanation: string;
  recommendedActions: string[];
}

// ---------------- PROGRAMMATIC SYNTHESIS OF REALISTIC DATA ----------------

const FIRST_NAMES = [
  'Rajesh', 'Vikram', 'Priya', 'Amit', 'Ramesh', 'Sanjay', 'Sunil', 'Neha', 'Pooja', 'Ananya',
  'Deepak', 'Arun', 'Manish', 'Kavita', 'Suresh', 'Rahul', 'Vivek', 'Sneha', 'Gaurav', 'Aditya',
  'Rohit', 'Kiran', 'Meera', 'Alok', 'Ritu', 'Prashant', 'Swati', 'Nikhil', 'Tanvi', 'Abhishek',
  'Harish', 'Divya', 'Siddharth', 'Bhavna', 'Girish', 'Shilpa', 'Vikas', 'Monika', 'Kunal', 'Tarun',
  'Pankaj', 'Payal', 'Sachin', 'Sonali', 'Naveen', 'Archana', 'Ashish', 'Geeta', 'Mayank', 'Rekha'
];

const LAST_NAMES = [
  'Mehra', 'Sharma', 'Verma', 'Chawla', 'Patel', 'Deshmukh', 'Joshi', 'Gupta', 'Iyer', 'Menon',
  'Reddy', 'Agarwal', 'Bansal', 'Singhania', 'Nair', 'Kulkarni', 'Bhatia', 'Chopra', 'Malhotra', 'Rao',
  'Kapoor', 'Saxena', 'Pandey', 'Mishra', 'Trivedi', 'Shah', 'Dalal', 'Pillai', 'Ranganathan', 'Bhatt'
];

const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi NCR' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Surat', state: 'Gujarat' }
];

const BANKS = [
  { name: 'HDFC Bank', code: 'HDFC' },
  { name: 'State Bank of India', code: 'SBIN' },
  { name: 'ICICI Bank', code: 'ICIC' },
  { name: 'Axis Bank', code: 'UTIB' },
  { name: 'Kotak Mahindra Bank', code: 'KKBK' },
  { name: 'Punjab National Bank', code: 'PUNB' },
  { name: 'Bank of Baroda', code: 'BARB' },
  { name: 'IndusInd Bank', code: 'INDB' }
];

// Generate 100 Customers
export const CUSTOMERS: Customer[] = Array.from({ length: 100 }, (_, i) => {
  const idNum = 1001 + i;
  const id = `CUST-${idNum}`;
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(i / 2) % LAST_NAMES.length];
  const loc = CITIES[i % CITIES.length];
  const isTargetNetwork = idNum === 1004 || idNum === 1019 || idNum === 1042 || idNum === 1077;
  const isNet12 = idNum === 1012 || idNum === 1033 || idNum === 1065 || idNum === 1081;

  let riskScore = 15 + ((i * 17) % 45);
  let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (isTargetNetwork) {
    riskScore = idNum === 1004 ? 94 : 88;
    riskLevel = 'CRITICAL';
  } else if (isNet12) {
    riskScore = 82;
    riskLevel = 'HIGH';
  } else if (riskScore > 45) {
    riskLevel = 'MEDIUM';
  }

  const panMask = `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(66 + ((i * 3) % 26))}CPK${1000 + i}${String.fromCharCode(65 + ((i * 7) % 26))}`;

  return {
    id,
    name: `${firstName} ${lastName}`,
    panMask,
    phoneMask: `+91 98${((i * 47) % 89 + 10)}•••${((i * 31) % 89 + 10)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@corpnet.in`,
    city: loc.city,
    state: loc.state,
    occupation: isTargetNetwork ? 'Independent Contractor' : (i % 3 === 0 ? 'Retail Merchant' : (i % 3 === 1 ? 'Software Engineer' : 'Consultant')),
    riskScore,
    riskLevel,
    kycStatus: isTargetNetwork && idNum === 1077 ? 'TIER1' : 'VERIFIED',
    accounts: [`ACC-${9001 + i}`],
    devices: [`DEV-F88${(i % 35) + 10}`],
    networkId: isTargetNetwork ? 'NET-004' : (isNet12 ? 'NET-012' : undefined)
  };
});

// Explicit setup for target network NET-004 customers
CUSTOMERS[3].name = 'Vikram Mehra';      // CUST-1004
CUSTOMERS[18].name = 'Priya Sharma';     // CUST-1019
CUSTOMERS[41].name = 'Amit Verma';       // CUST-1042
CUSTOMERS[76].name = 'Ramesh Chawla';    // CUST-1077

// Generate 120 Bank Accounts
export const ACCOUNTS: BankAccount[] = Array.from({ length: 120 }, (_, i) => {
  const id = `ACC-${9001 + i}`;
  const custId = `CUST-${1001 + (i % 100)}`;
  const bank = BANKS[i % BANKS.length];
  const isNet4 = [9004, 9019, 9042, 9077, 9098].includes(9001 + i);
  const isNet12 = [9012, 9033, 9065, 9081].includes(9001 + i);

  let balance = 85000 + ((i * 34217) % 1800000);
  let riskScore = 18 + ((i * 13) % 40);
  if (isNet4) {
    riskScore = 91;
    balance = i === 3 ? 142000 : 45000;
  } else if (isNet12) {
    riskScore = 79;
  }

  return {
    id,
    customerId: custId,
    bankName: bank.name,
    accountNumberMask: `${bank.code}••••${3000 + i}`,
    ifsc: `${bank.code}000${1000 + (i % 250)}`,
    type: i % 4 === 0 ? 'CURRENT' : (i % 15 === 0 ? 'NRE' : 'SAVINGS'),
    balance,
    currency: 'INR',
    openedDate: `202${3 + (i % 4)}-0${(i % 9) + 1}-14`,
    status: isNet4 && i === 3 ? 'RESTRICTED' : 'ACTIVE',
    riskScore
  };
});

// Generate 40 Devices
export const DEVICES: Device[] = Array.from({ length: 40 }, (_, i) => {
  const id = `DEV-F88${10 + i}`;
  const isTargetShared = id === 'DEV-F8821';
  const isEmulatorDevice = id === 'DEV-F8834' || id === 'DEV-F8835';

  const models = ['Redmi Note 11 Pro', 'Samsung Galaxy S22', 'OnePlus 10R', 'Apple iPhone 14 Pro', 'Vivo V25', 'Motorola Edge 30', 'Google Pixel 7', 'Xiaomi Poco X4'];
  const osList = ['Android 12', 'Android 13', 'Android 14', 'iOS 17.2', 'Android 11 (Kernel-patched)'];

  const associatedCusts = isTargetShared
    ? ['CUST-1004', 'CUST-1019', 'CUST-1042', 'CUST-1077']
    : [`CUST-${1001 + i}`, `CUST-${1001 + ((i + 7) % 100)}`];

  const associatedAccs = isTargetShared
    ? ['ACC-9004', 'ACC-9019', 'ACC-9042', 'ACC-9077']
    : [`ACC-${9001 + i}`];

  return {
    id,
    fingerprintHash: `fp_sha256_${(i + 13) * 894191}_${isTargetShared ? 'MULE_RING_CORE' : 'NORM'}`,
    model: isTargetShared ? 'Redmi Note 10S' : models[i % models.length],
    os: isTargetShared ? 'Android 11 (QEMU_VM_DETECTED)' : (isEmulatorDevice ? 'Android 10 (Bluestacks_x86)' : osList[i % osList.length]),
    isEmulator: isTargetShared || isEmulatorDevice,
    emulatorIndicators: (isTargetShared || isEmulatorDevice)
      ? ['build.prop qemu=1 detected', 'SensorManager: Accelerometer static vector spoofed', 'Null battery hardware report', 'Goldfish kernel driver hook']
      : [],
    isRooted: isTargetShared || i % 7 === 0,
    firstSeen: '2026-09-12 04:12:00 IST',
    lastSeen: '2026-10-31 09:35:10 IST',
    associatedAccounts: associatedAccs,
    associatedCustomers: associatedCusts,
    sessionCount: isTargetShared ? 142 : 12 + (i % 25),
    riskScore: isTargetShared ? 96 : (isEmulatorDevice ? 88 : 14 + (i % 30))
  };
});

// Generate 30 IP Addresses
export const IP_ADDRESSES: IPAddress[] = [
  {
    ip: '185.220.101.45',
    classification: 'VPN',
    isp: 'NordVPN Datacenter Services B.V.',
    asn: 'AS200052',
    country: 'Netherlands',
    city: 'Amsterdam',
    riskScore: 92,
    sessionCount: 84,
    associatedAccounts: ['ACC-9004', 'ACC-9019', 'ACC-9042', 'ACC-9077']
  },
  {
    ip: '103.21.144.12',
    classification: 'Proxy',
    isp: 'Zenlayer Datacenter Cloud',
    asn: 'AS21859',
    country: 'India',
    city: 'Mumbai',
    riskScore: 86,
    sessionCount: 42,
    associatedAccounts: ['ACC-9004', 'ACC-9019']
  },
  {
    ip: '194.26.29.112',
    classification: 'Tor Exit Node',
    isp: 'Tor Network Node Association',
    asn: 'AS51852',
    country: 'Germany',
    city: 'Frankfurt',
    riskScore: 98,
    sessionCount: 16,
    associatedAccounts: ['ACC-9042', 'ACC-9077']
  },
  {
    ip: '104.28.19.88',
    classification: 'Hosting Provider',
    isp: 'Cloudflare Ingress Warp',
    asn: 'AS13335',
    country: 'United States',
    city: 'San Jose',
    riskScore: 78,
    sessionCount: 55,
    associatedAccounts: ['ACC-9012', 'ACC-9033', 'ACC-9065']
  },
  {
    ip: '49.36.128.74',
    classification: 'Mobile Carrier',
    isp: 'Reliance Jio Infocomm Ltd (CG-NAT)',
    asn: 'AS55836',
    country: 'India',
    city: 'Mumbai',
    riskScore: 24,
    sessionCount: 310,
    associatedAccounts: ['ACC-9001', 'ACC-9002', 'ACC-9021', 'ACC-9022']
  },
  {
    ip: '182.72.190.22',
    classification: 'Residential',
    isp: 'Bharti Airtel Broadband',
    asn: 'AS9498',
    country: 'India',
    city: 'Bengaluru',
    riskScore: 12,
    sessionCount: 180,
    associatedAccounts: ['ACC-9008', 'ACC-9009']
  },
  {
    ip: '103.115.197.8',
    classification: 'Residential',
    isp: 'ACT Fibernet Bangalore',
    asn: 'AS24309',
    country: 'India',
    city: 'Bengaluru',
    riskScore: 15,
    sessionCount: 220,
    associatedAccounts: ['ACC-9014', 'ACC-9015']
  },
  {
    ip: '115.99.230.15',
    classification: 'Mobile Carrier',
    isp: 'Vodafone Idea Telecommunications (CG-NAT)',
    asn: 'AS38266',
    country: 'India',
    city: 'Pune',
    riskScore: 22,
    sessionCount: 145,
    associatedAccounts: ['ACC-9025', 'ACC-9026']
  },
  ...Array.from({ length: 22 }, (_, i) => ({
    ip: `157.48.${10 + i}.${40 + (i * 3)}`,
    classification: (i % 5 === 0 ? 'VPN' : (i % 6 === 0 ? 'Proxy' : (i % 2 === 0 ? 'Residential' : 'Mobile Carrier'))) as any,
    isp: i % 2 === 0 ? 'Bharti Airtel Broadband' : 'Reliance Jio Infocomm',
    asn: i % 2 === 0 ? 'AS9498' : 'AS55836',
    country: 'India',
    city: CITIES[i % CITIES.length].city,
    riskScore: 15 + ((i * 19) % 55),
    sessionCount: 40 + (i * 8),
    associatedAccounts: [`ACC-${9030 + i}`]
  }))
];

// Generate 20 Beneficiaries
export const BENEFICIARIES: Beneficiary[] = [
  {
    id: 'BEN-401',
    name: 'Apex Bullion & Precious Metals LLP',
    accountNumberMask: 'HDFC••••9901',
    bankName: 'HDFC Bank',
    ifsc: 'HDFC0000128',
    addedDate: '2026-10-15',
    riskLevel: 'CRITICAL',
    category: 'Bullion & Commodities',
    flagReason: 'High-velocity cash-equivalent liquidator; destination for rapid mule dispersion'
  },
  {
    id: 'BEN-402',
    name: 'Quickremit Global Services FZE',
    accountNumberMask: 'ICIC••••4410',
    bankName: 'ICICI Bank',
    ifsc: 'ICIC0000004',
    addedDate: '2026-10-18',
    riskLevel: 'HIGH',
    category: 'Cross-Border Money Remittance',
    flagReason: 'Offshore jurisdiction settlement node'
  },
  {
    id: 'BEN-403',
    name: 'Royal Crown Gaming Pvt Ltd',
    accountNumberMask: 'KKBK••••8120',
    bankName: 'Kotak Mahindra Bank',
    ifsc: 'KKBK0000958',
    addedDate: '2026-09-02',
    riskLevel: 'HIGH',
    category: 'Online Gaming / Betting',
    flagReason: 'Unregistered online betting aggregator gateway'
  },
  ...Array.from({ length: 17 }, (_, i) => ({
    id: `BEN-${404 + i}`,
    name: `${FIRST_NAMES[(i + 15) % FIRST_NAMES.length]} ${LAST_NAMES[(i + 8) % LAST_NAMES.length]} Traders`,
    accountNumberMask: `SBIN••••${5100 + i}`,
    bankName: BANKS[i % BANKS.length].name,
    ifsc: `${BANKS[i % BANKS.length].code}000${2000 + i}`,
    addedDate: `2026-08-${10 + (i % 18)}`,
    riskLevel: (i % 4 === 0 ? 'MEDIUM' : 'LOW') as any,
    category: i % 2 === 0 ? 'Wholesale Supplier' : 'Consulting Services'
  }))
];

// Generate 15 Merchants
export const MERCHANTS: Merchant[] = [
  { id: 'MER-501', name: 'Zaveri Bazaar Gold Trading', category: 'Precious Metals', upiId: 'zaveri.gold@icici', terminalId: 'POS-MUM-8910', riskScore: 89, volume30d: 48500000 },
  { id: 'MER-502', name: 'WinFast Virtual Casino Gateway', category: 'Gaming', upiId: 'winfast.pay@axis', terminalId: 'VPA-WIN-3321', riskScore: 94, volume30d: 32000000 },
  { id: 'MER-503', name: 'BitKrypt Financial Technologies', category: 'Crypto Asset Gateway', upiId: 'bitkrypt@hdfcbank', terminalId: 'API-CRYPTO-99', riskScore: 84, volume30d: 64000000 },
  { id: 'MER-504', name: 'Reliance Digital Retail Mumbai', category: 'Electronics & Retail', upiId: 'reliancedigital@yesbank', terminalId: 'POS-REL-1120', riskScore: 12, volume30d: 12400000 },
  { id: 'MER-505', name: 'Tata Croma Electronics Hub', category: 'Consumer Tech', upiId: 'croma.pos@hdfcbank', terminalId: 'POS-CROMA-77', riskScore: 10, volume30d: 15200000 },
  { id: 'MER-506', name: 'Infosys Tech Park Food Court', category: 'Food & Beverage', upiId: 'infyfoods@icici', terminalId: 'POS-FOOD-44', riskScore: 8, volume30d: 3100000 },
  { id: 'MER-507', name: 'WeWork Enpar Hub Mumbai', category: 'Office Infrastructure', upiId: 'wework.mumbai@hdfcbank', terminalId: 'INV-WEWORK-10', riskScore: 14, volume30d: 8900000 },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `MER-${508 + i}`,
    name: `Apex Retail Store ${i + 1}`,
    category: i % 2 === 0 ? 'Apparel' : 'Hardware Supply',
    upiId: `apexstore${i + 1}@kotak`,
    terminalId: `POS-APX-${400 + i}`,
    riskScore: 15 + (i * 3),
    volume30d: 4500000 + (i * 800000)
  }))
];

// Generate 10 Historical Alerts
export const HISTORICAL_ALERTS: HistoricalAlert[] = [
  { id: 'ALT-3001', customerId: 'CUST-1004', accountId: 'ACC-9004', type: 'RAPID_VELOCITY_SPIKE', triggerDate: '2026-08-14', severity: 'HIGH', disposition: 'ESCALATED', description: 'Surge in high-frequency RTGS inflows from unverified third-party business entity.' },
  { id: 'ALT-3002', customerId: 'CUST-1019', accountId: 'ACC-9019', type: 'SHARED_DEVICE_ANOMALY', triggerDate: '2026-09-02', severity: 'CRITICAL', disposition: 'ESCALATED', description: 'Account accessed simultaneously from same Redmi hardware fingerprint as CUST-1004.' },
  { id: 'ALT-3003', customerId: 'CUST-1042', accountId: 'ACC-9042', type: 'CIRCULAR_TRANSACTION_DETECTED', triggerDate: '2026-09-28', severity: 'CRITICAL', disposition: 'ESCALATED', description: 'Immediate onward transfer within 4 minutes of receiving ₹6,00,000 credit.' },
  { id: 'ALT-3004', customerId: 'CUST-1077', accountId: 'ACC-9077', type: 'MULE_BEHAVIOR_PROFILE', triggerDate: '2026-10-04', severity: 'HIGH', disposition: 'SUSPICIOUS_REPORT_FILED', description: 'Dormant account activated with high-value round-trip transfers to bullion broker.' },
  { id: 'ALT-3005', customerId: 'CUST-1012', accountId: 'ACC-9012', type: 'EMULATOR_FARM_INGRESS', triggerDate: '2026-10-11', severity: 'CRITICAL', disposition: 'ESCALATED', description: 'Automated headless Android session detected via QEMU hypervisor signatures.' },
  { id: 'ALT-3006', customerId: 'CUST-1033', accountId: 'ACC-9033', type: 'VPN_DATA_CENTER_HOP', triggerDate: '2026-10-18', severity: 'MEDIUM', disposition: 'CLEARED', description: 'Login from NordVPN Netherlands exit node; investigator noted travel explanation.' },
  { id: 'ALT-3007', customerId: 'CUST-1021', accountId: 'ACC-9021', type: 'STRUCTURING_THRESHOLD_RULE', triggerDate: '2026-10-20', severity: 'MEDIUM', disposition: 'CLEARED', description: '3 consecutive transfers of ₹49,500 just under ₹50,000 PAN reporting threshold.' },
  { id: 'ALT-3008', customerId: 'CUST-1065', accountId: 'ACC-9065', type: 'PROXY_TOR_EXIT_DETECTED', triggerDate: '2026-10-22', severity: 'HIGH', disposition: 'ESCALATED', description: 'Session initiated through Frankfurt Tor relay during mobile banking session.' },
  { id: 'ALT-3009', customerId: 'CUST-1081', accountId: 'ACC-9081', type: 'HIGH_FREQUENCY_UPI_BURST', triggerDate: '2026-10-25', severity: 'MEDIUM', disposition: 'CLEARED', description: '42 micro-transactions to gaming merchant within 15 minutes.' },
  { id: 'ALT-3010', customerId: 'CUST-1090', accountId: 'ACC-9090', type: 'UNUSUAL_GEO_LOCATION_VELOCITY', triggerDate: '2026-10-26', severity: 'HIGH', disposition: 'SUSPICIOUS_REPORT_FILED', description: 'Impossible travel: session in Mumbai followed by Delhi within 14 minutes.' }
];

// Generate 500 Realistic Transactions
export const TRANSACTIONS: Transaction[] = [
  // 1. SPECIFIC MONEY TRAIL TRANSACTIONS (Reconstruction scenario from prompt)
  // Account A (ACC-9004) receives ₹10,00,000 -> ACC-9019 (₹6,00,000) & ACC-9042 (₹4,00,000)
  // ACC-9019 -> ACC-9077 (₹5,50,000)
  // ACC-9042 -> Merchant X (MER-501) (₹3,80,000)
  // ACC-9077 -> ACC-9098 (₹5,00,000)
  {
    id: 'TXN-88041',
    fromAccount: 'ACC-9001',
    toAccount: 'ACC-9004',
    fromCustomerName: 'Rajesh Mehra',
    toCustomerName: 'Vikram Mehra (Account A)',
    amount: 1000000,
    timestamp: '2026-10-28 09:15:00 IST',
    channel: 'RTGS',
    status: 'FLAGGED',
    patternFlag: 'INITIAL_FUNDING_SPIKE',
    networkId: 'NET-004',
    narrative: 'RTGS/HDFC/CAPITAL_ADVANCE_SETTLEMENT'
  },
  {
    id: 'TXN-88042',
    fromAccount: 'ACC-9004',
    toAccount: 'ACC-9019',
    fromCustomerName: 'Vikram Mehra (Account A)',
    toCustomerName: 'Priya Sharma (Account B)',
    amount: 600000,
    timestamp: '2026-10-28 09:32:15 IST',
    channel: 'NEFT',
    status: 'FLAGGED',
    patternFlag: 'RAPID_DISPERSION_HOP_1',
    networkId: 'NET-004',
    narrative: 'NEFT/TRF/CONSULTING_COMMISSION'
  },
  {
    id: 'TXN-88043',
    fromAccount: 'ACC-9004',
    toAccount: 'ACC-9042',
    fromCustomerName: 'Vikram Mehra (Account A)',
    toCustomerName: 'Amit Verma (Account C)',
    amount: 400000,
    timestamp: '2026-10-28 09:34:40 IST',
    channel: 'IMPS',
    status: 'FLAGGED',
    patternFlag: 'RAPID_DISPERSION_HOP_1',
    networkId: 'NET-004',
    narrative: 'IMPS/P2A/INTER_PARTY_SETTLE'
  },
  {
    id: 'TXN-88044',
    fromAccount: 'ACC-9019',
    toAccount: 'ACC-9077',
    fromCustomerName: 'Priya Sharma (Account B)',
    toCustomerName: 'Ramesh Chawla (Account D)',
    amount: 550000,
    timestamp: '2026-10-28 09:47:05 IST',
    channel: 'IMPS',
    status: 'FLAGGED',
    patternFlag: 'MULE_CHAIN_HOP_2',
    networkId: 'NET-004',
    narrative: 'IMPS/984210/FAST_CLEAR'
  },
  {
    id: 'TXN-88045',
    fromAccount: 'ACC-9042',
    toAccount: 'ACC-9099', // Merchant X Bullion
    fromCustomerName: 'Amit Verma (Account C)',
    toCustomerName: 'Zaveri Bazaar Gold Trading (Merchant X)',
    amount: 380000,
    timestamp: '2026-10-28 09:52:30 IST',
    channel: 'RTGS',
    status: 'FLAGGED',
    patternFlag: 'MERCHANT_CASH_LIQUIDATION',
    networkId: 'NET-004',
    narrative: 'RTGS/PRECIOUS_METALS_PURCHASE'
  },
  {
    id: 'TXN-88046',
    fromAccount: 'ACC-9077',
    toAccount: 'ACC-9098',
    fromCustomerName: 'Ramesh Chawla (Account D)',
    toCustomerName: 'Apex Bullion Trade (Account E)',
    amount: 500000,
    timestamp: '2026-10-28 10:02:12 IST',
    channel: 'RTGS',
    status: 'FLAGGED',
    patternFlag: 'FINAL_CONSOLIDATION_HOP_3',
    networkId: 'NET-004',
    narrative: 'RTGS/BULLION_EXPORT_SETTLEMENT'
  },
  // Circular return loop
  {
    id: 'TXN-88047',
    fromAccount: 'ACC-9098',
    toAccount: 'ACC-9004',
    fromCustomerName: 'Apex Bullion Trade (Account E)',
    toCustomerName: 'Vikram Mehra (Account A)',
    amount: 150000,
    timestamp: '2026-10-28 10:45:00 IST',
    channel: 'NEFT',
    status: 'FLAGGED',
    patternFlag: 'CIRCULAR_LOOP_KICKBACK',
    networkId: 'NET-004',
    narrative: 'NEFT/REBATE_COMMISSION_CYCLE'
  },

  // 2. NET-012 Emulator Syndicate transactions
  {
    id: 'TXN-88121',
    fromAccount: 'ACC-9012',
    toAccount: 'ACC-9033',
    fromCustomerName: 'Alok Saxena',
    toCustomerName: 'Kunal Chopra',
    amount: 1450000,
    timestamp: '2026-10-29 02:14:10 IST',
    channel: 'RTGS',
    status: 'FLAGGED',
    patternFlag: 'EMULATOR_NIGHT_SPIKE',
    networkId: 'NET-012',
    narrative: 'RTGS/BULK_CLEARING_NIGHT'
  },
  {
    id: 'TXN-88122',
    fromAccount: 'ACC-9033',
    toAccount: 'ACC-9065',
    fromCustomerName: 'Kunal Chopra',
    toCustomerName: 'Prashant Dalal',
    amount: 980000,
    timestamp: '2026-10-29 02:22:45 IST',
    channel: 'IMPS',
    status: 'FLAGGED',
    patternFlag: 'RAPID_EMULATOR_HOP',
    networkId: 'NET-012',
    narrative: 'IMPS/API_HEADLESS_TRANSFER'
  },
  {
    id: 'TXN-88123',
    fromAccount: 'ACC-9065',
    toAccount: 'ACC-9081',
    fromCustomerName: 'Prashant Dalal',
    toCustomerName: 'Tarun Saxena',
    amount: 940000,
    timestamp: '2026-10-29 02:38:15 IST',
    channel: 'IMPS',
    status: 'FLAGGED',
    patternFlag: 'EMULATOR_CONSOLIDATION',
    networkId: 'NET-012',
    narrative: 'IMPS/TOKEN_REDEEM_GATEWAY'
  },

  // Remaining synthetic normal & flagged transactions to reach 500
  ...Array.from({ length: 490 }, (_, i) => {
    const idNum = 88011 + i;
    const fromIdx = (i * 3) % 100;
    const toIdx = (fromIdx + 1 + (i % 20)) % 100;
    const channels: ('IMPS' | 'NEFT' | 'RTGS' | 'UPI')[] = ['UPI', 'IMPS', 'NEFT', 'RTGS'];
    const channel = channels[i % 4];

    let amount = 4500 + ((i * 12349) % 350000);
    if (channel === 'RTGS') amount = 250000 + ((i * 45000) % 1800000);
    if (channel === 'UPI') amount = 500 + ((i * 1350) % 95000);

    const isFlagged = i % 18 === 0;

    return {
      id: `TXN-${idNum}`,
      fromAccount: `ACC-${9001 + fromIdx}`,
      toAccount: `ACC-${9001 + toIdx}`,
      fromCustomerName: CUSTOMERS[fromIdx].name,
      toCustomerName: CUSTOMERS[toIdx].name,
      amount,
      timestamp: `2026-10-${String((i % 28) + 1).padStart(2, '0')} ${String((i * 7) % 24).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}:22 IST`,
      channel,
      status: (isFlagged ? 'FLAGGED' : 'COMPLETED') as 'FLAGGED' | 'COMPLETED',
      patternFlag: isFlagged ? (i % 2 === 0 ? 'VELOCITY_ANOMALY' : 'UNUSUAL_HOURS_TRANSFER') : undefined,
      narrative: `${channel}/INFRA_SETTLEMENT_${idNum}`
    };
  })
];

// Evidence items catalog
export const EVIDENCE_STORE: Record<string, EvidenceItem> = {
  'EVD-101': {
    id: 'EVD-101',
    type: 'DEVICE',
    description: 'Shared physical device fingerprint (DEV-F8821) used to authenticate 4 distinct customer accounts within 45 minutes.',
    sourceRecord: 'device_audit_logs.json #REC-98214',
    relatedEntity: 'DEV-F8821',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 09:30:12 IST',
    confidenceScore: 0.96,
    details: {
      hardwareHash: 'fp_sha256_984191_MULE_RING_CORE',
      model: 'Redmi Note 10S',
      os: 'Android 11',
      imeiHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      uniqueIdentitiesBound: 4
    }
  },
  'EVD-102': {
    id: 'EVD-102',
    type: 'IP',
    description: 'Sessions initiated simultaneously via NordVPN Amsterdam Datacenter Exit Node (185.220.101.45) masking domestic mobile coordinates.',
    sourceRecord: 'ip_geo_telemetry.log #IP-00912',
    relatedEntity: '185.220.101.45',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 09:18:22 IST',
    confidenceScore: 0.91,
    details: {
      asn: 'AS200052',
      classification: 'VPN Datacenter',
      torExitFlag: false,
      hopLatencyMs: 142
    }
  },
  'EVD-103': {
    id: 'EVD-103',
    type: 'TRANSACTION',
    description: 'Rapid dispersion sequence: ₹10,00,000 distributed into two streams with 94.2% fund velocity exhaustion in <45 mins.',
    sourceRecord: 'core_banking_ledger_rtgs.csv #TXN-88041-88046',
    relatedEntity: 'ACC-9004',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 09:47:05 IST',
    confidenceScore: 0.98,
    details: {
      initialAmount: 1000000,
      dispersedAmount: 980000,
      hopCount: 3,
      interHopDeltaMins: [17, 2, 13, 5, 10]
    }
  },
  'EVD-104': {
    id: 'EVD-104',
    type: 'ACCOUNT',
    description: 'Beneficiary BEN-401 (Apex Bullion Trade) is a known high-risk liquidation node flagged in 3 prior STR disclosures.',
    sourceRecord: 'fiud_str_repository_2026.db #STR-IN-4921',
    relatedEntity: 'BEN-401',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 10:05:00 IST',
    confidenceScore: 0.89,
    details: {
      strCount: 3,
      primaryJurisdiction: 'Zaveri Bazaar, Mumbai',
      fiuReference: 'FIU-IND/2026/STR/49218'
    }
  },
  'EVD-105': {
    id: 'EVD-105',
    type: 'DEVICE',
    description: 'QEMU virtual hardware driver artifacts and zero accelerometer tilt variation detected during banking auth.',
    sourceRecord: 'device_sensor_telemetry.parquet #SEN-8812',
    relatedEntity: 'DEV-F8821',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 09:16:04 IST',
    confidenceScore: 0.94,
    details: {
      sensorDeviation: 0.000,
      batteryLevel: 'NULL_REVENUE_HOOK',
      buildPropHook: 'ro.kernel.qemu=1'
    }
  },
  'EVD-106': {
    id: 'EVD-106',
    type: 'ACCOUNT',
    description: 'CUST-1004 and CUST-1019 share a registered business address at Bandra Kurla Complex (Unit 402, Trade Link Tower).',
    sourceRecord: 'mca_gstin_corporate_filing.json #GST-27AABCT8192',
    relatedEntity: 'CUST-1004',
    supportsHypothesis: 'LEGITIMATE',
    timestamp: '2026-10-28 11:20:00 IST',
    confidenceScore: 0.84,
    details: {
      gstin: '27AABCT8192K1Z8',
      entityName: 'Mehra-Sharma Logistics LLP',
      incorporationDate: '2023-04-12',
      registeredAddress: 'Unit 402, Trade Link Tower, BKC, Mumbai'
    }
  },
  'EVD-107': {
    id: 'EVD-107',
    type: 'ACCOUNT',
    description: 'Corporate payroll and vendor agreement contracts on file between CUST-1004 and CUST-1042 for IT consulting services.',
    sourceRecord: 'kyc_document_store.s3 #DOC-AGR-4912',
    relatedEntity: 'CUST-1042',
    supportsHypothesis: 'LEGITIMATE',
    timestamp: '2026-10-28 11:25:00 IST',
    confidenceScore: 0.79,
    details: {
      contractValue: 4800000,
      serviceScope: 'Enterprise ERP Implementation Support',
      signedOn: '2025-11-01'
    }
  },
  'EVD-108': {
    id: 'EVD-108',
    type: 'DEVICE',
    description: 'Device DEV-F8821 is registered in MDM inventory of Mehra-Sharma Logistics as a shared field dispatch terminal.',
    sourceRecord: 'enterprise_mdm_fleet.csv #MDM-99120',
    relatedEntity: 'DEV-F8821',
    supportsHypothesis: 'LEGITIMATE',
    timestamp: '2026-10-28 11:30:00 IST',
    confidenceScore: 0.76,
    details: {
      fleetId: 'FLEET-MUM-TRK-04',
      mdmStatus: 'ENROLLED_COSU',
      profile: 'Dedicated Shared Operations Terminal'
    }
  },
  'EVD-109': {
    id: 'EVD-109',
    type: 'HISTORICAL_ALERT',
    description: 'Prior cleared alert from 2026-08 (ALT-3001) where high RTGS influx was verified against client export advances.',
    sourceRecord: 'historical_compliance_case.db #CASE-2026-0012',
    relatedEntity: 'CUST-1004',
    supportsHypothesis: 'LEGITIMATE',
    timestamp: '2026-08-14 16:40:00 IST',
    confidenceScore: 0.72,
    details: {
      alertId: 'ALT-3001',
      clearedBy: 'Senior Compliance Officer S. Raman',
      justification: 'Export invoice LC document verified with correspondent bank'
    }
  },
  'EVD-110': {
    id: 'EVD-110',
    type: 'IP',
    description: 'ISP routing telemetry indicates domestic Airtel connection was abruptly dropped 4 minutes prior to NordVPN activation.',
    sourceRecord: 'network_session_drops.log #NET-DROP-102',
    relatedEntity: '185.220.101.45',
    supportsHypothesis: 'NEUTRAL',
    timestamp: '2026-10-28 09:14:10 IST',
    confidenceScore: 0.68,
    details: {
      disconnectReason: 'TCP_RST_CARRIER_RECONNECT',
      previousIP: '49.36.128.74 (Jio CG-NAT)'
    }
  },
  'EVD-111': {
    id: 'EVD-111',
    type: 'TRANSACTION',
    description: 'Partial circular loop transaction TXN-88047 returns ₹1,50,000 back to originating account ACC-9004 via rebate invoice.',
    sourceRecord: 'core_banking_ledger_rtgs.csv #TXN-88047',
    relatedEntity: 'ACC-9004',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 10:45:00 IST',
    confidenceScore: 0.93,
    details: {
      loopPercentage: '15.0%',
      invoiceRef: 'REB-2026-OCT-881'
    }
  },
  'EVD-112': {
    id: 'EVD-112',
    type: 'ACCOUNT',
    description: 'Ramesh Chawla (CUST-1077) account was dormant for 14 months before receiving ₹5,50,000 and immediately liquidating it.',
    sourceRecord: 'account_dormancy_lifecycle.db #ACC-9077',
    relatedEntity: 'ACC-9077',
    supportsHypothesis: 'SUSPICIOUS',
    timestamp: '2026-10-28 09:48:00 IST',
    confidenceScore: 0.95,
    details: {
      dormancyDurationDays: 426,
      averageBalancePrior: 1240,
      activationCreditAmount: 550000
    }
  }
};

// 38 Suspicious Networks with detailed metadata
export const SUSPICIOUS_NETWORKS: SuspiciousNetwork[] = [
  {
    id: 'NET-004',
    name: 'Mule Funnel & Circular Transfer Ring',
    caseId: 'CASE-2026-0041',
    caseTitle: 'Suspected Coordinated Mule Syndicate - Bandra West Cluster',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    detectionPattern: 'Mule Account Network / Circular Fund Transfers',
    detectionSignals: [
      'Shared Device DEV-F8821 across 4 unrelated KYC profiles',
      'NordVPN Netherlands Datacenter ingress within 3 minutes of transfers',
      'Circular transfer loop ₹10,00,000 funneling into bullion broker BEN-401',
      'Abrupt awakening of 14-month dormant savings account ACC-9077'
    ],
    totalVolume: 10000000, // ₹1.0 Cr
    detectedAt: '2026-10-28 09:42:15 IST',
    status: 'UNDER_INVESTIGATION',
    assignedInvestigator: 'Rajesh V. (Senior Investigator)',
    entitiesInvolved: {
      customers: 4,
      accounts: 5,
      devices: 2,
      ips: 3,
      beneficiaries: 2
    },
    customerIds: ['CUST-1004', 'CUST-1019', 'CUST-1042', 'CUST-1077'],
    accountIds: ['ACC-9004', 'ACC-9019', 'ACC-9042', 'ACC-9077', 'ACC-9098'],
    deviceIds: ['DEV-F8821', 'DEV-F8834'],
    ipAddresses: ['185.220.101.45', '103.21.144.12', '194.26.29.112'],
    whyFlagged: 'Rapid multi-hop funnel of ₹10,00,000 originating from Account ACC-9004 routed through three intermediate mule savings accounts within 45 minutes, consolidated into bullion dealer BEN-401.',
    detectionRulesTriggered: [
      'RULE-AML-084: Velocity Spike (> ₹5L in <1hr)',
      'RULE-DEV-019: Shared Hardware Fingerprint across disparate KYC identities',
      'RULE-NET-003: Multi-party Circular Value Dispersion',
      'RULE-GEO-041: Foreign Datacenter VPN ingress during high-value RTGS'
    ],
    missingInfo: 'Original source of inward wire to ACC-9004 from offshore entity; verification of employer letter for CUST-1042.',
    evidenceIds: ['EVD-101', 'EVD-102', 'EVD-103', 'EVD-104', 'EVD-105', 'EVD-106', 'EVD-107', 'EVD-108', 'EVD-109', 'EVD-110', 'EVD-111', 'EVD-112'],
    observedActivity: '₹10,00,000 entered Account A (ACC-9004) at 09:15. Within 45 minutes, funds were split into Account B (₹6,00,000) and Account C (₹4,00,000), subsequently forwarded to Account D and liquidated via Bullion merchant and broker accounts.',
    suspiciousIndicators: [
      'Common device fingerprint DEV-F8821 shared across 4 distinct individuals.',
      'Active session initiated through NordVPN Amsterdam Datacenter exit node.',
      'Immediate onward fund velocity (94.2% transferred out within 32 minutes).',
      'Common liquidation beneficiary (Apex Bullion Trade) with 3 prior STRs.'
    ],
    contradictoryEvidence: [
      'CUST-1004 and CUST-1019 share a registered business entity (Mehra-Sharma Logistics LLP).',
      'Valid GSTIN filings and shared registered office address at BKC, Mumbai.',
      'Device DEV-F8821 enrolled in corporate MDM inventory as an authorized dispatch terminal.',
      'Prior 2026-08 alert cleared with verified export shipping documentation.'
    ],
    alternativeExplanation: 'The accounts may represent legitimate centralized treasury operations of Mehra-Sharma Logistics LLP utilizing a shared field dispatch terminal for urgent vendor and bullion supplier settlements.',
    recommendedActions: [
      'Obtain bank account statements from correspondent bank for origin of initial ₹10L credit to ACC-9004.',
      'Request physical audit of MDM dispatch device DEV-F8821 at BKC office.',
      'Conduct video KYC re-verification for Ramesh Chawla (CUST-1077).',
      'Do not place immediate freeze; maintain active transaction monitoring hold.'
    ]
  },
  {
    id: 'NET-012',
    name: 'Emulator Farm & Account Takeover Syndicate',
    caseId: 'CASE-2026-0089',
    caseTitle: 'Automated Night-time Ingress via Headless QEMU Android Cluster',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    detectionPattern: 'Emulator-Associated Activity / Layering Chains',
    detectionSignals: [
      'Bluestacks/Genymotion QEMU build tags on 18 sessions',
      'Cloudflare WARP proxy masking ingress IPs',
      'Systematic night-time transfers between 02:00 and 03:00 IST',
      'Rapid token liquidation into crypto asset gateway MER-503'
    ],
    totalVolume: 24000000, // ₹2.4 Cr
    detectedAt: '2026-10-29 02:40:00 IST',
    status: 'UNDER_INVESTIGATION',
    assignedInvestigator: 'Sunita P. (Fraud Specialist)',
    entitiesInvolved: {
      customers: 6,
      accounts: 8,
      devices: 3,
      ips: 4,
      beneficiaries: 3
    },
    customerIds: ['CUST-1012', 'CUST-1033', 'CUST-1065', 'CUST-1081'],
    accountIds: ['ACC-9012', 'ACC-9033', 'ACC-9065', 'ACC-9081'],
    deviceIds: ['DEV-F8834', 'DEV-F8835'],
    ipAddresses: ['104.28.19.88', '194.26.29.112'],
    whyFlagged: 'High-frequency batch transfers originating during off-peak hours from emulated Android environments with zero sensor variance.',
    detectionRulesTriggered: ['RULE-EMU-001: Headless Virtual Machine Detection', 'RULE-TIME-009: Off-Hours Batch Liquidation'],
    missingInfo: 'Device hardware sensor logs for secondary confirmation; IP ISP routing confirmation.',
    evidenceIds: ['EVD-101', 'EVD-105'],
    observedActivity: 'Coordinated automated transfers totaling ₹2.4 Cr routed through 4 accounts into crypto liquidity provider.',
    suspiciousIndicators: ['Emulated device signatures', 'High velocity night transactions', 'Tor exit node participation'],
    contradictoryEvidence: ['All accounts have verified Tier-1 KYC documentation.'],
    alternativeExplanation: 'Algorithmic trading company using virtual server orchestration for treasury rebalancing.',
    recommendedActions: ['Require biometric re-authentication for all 4 accounts', 'Liaise with crypto gateway MER-503']
  },
  {
    id: 'NET-021',
    name: 'Mumbai Co-Working Hub Shared Network',
    caseId: 'CASE-2026-0105',
    caseTitle: 'WeWork Enpar IP Sharing Cluster - Benign Corporate Cohort',
    riskScore: 34,
    riskLevel: 'LOW',
    detectionPattern: 'Shared Device & Network Co-location',
    detectionSignals: [
      'Common public IP (182.72.190.22) across 14 unrelated corporate customers',
      'Shared conference room presentation tablets'
    ],
    totalVolume: 12000000,
    detectedAt: '2026-10-25 14:10:00 IST',
    status: 'CLOSED',
    assignedInvestigator: 'Kavita N. (Risk Officer)',
    entitiesInvolved: { customers: 14, accounts: 18, devices: 5, ips: 2, beneficiaries: 6 },
    customerIds: ['CUST-1008', 'CUST-1009', 'CUST-1021'],
    accountIds: ['ACC-9008', 'ACC-9009', 'ACC-9021'],
    deviceIds: ['DEV-F8818'],
    ipAddresses: ['182.72.190.22'],
    whyFlagged: 'Triggered shared-IP rule due to 14 customers logging in from same Class C subnet within 1 hour.',
    detectionRulesTriggered: ['RULE-IP-004: Shared Enterprise Subnet'],
    missingInfo: 'None. Corporate tenancy lease contract verified.',
    evidenceIds: ['EVD-106'],
    observedActivity: 'Routine payroll transfers and vendor invoices originating from shared co-working enterprise WiFi.',
    suspiciousIndicators: ['Multiple unrelated bank customers using same external IP address.'],
    contradictoryEvidence: ['Confirmed WeWork commercial tenant register', 'Standard payroll dates and recurring vendor payments'],
    alternativeExplanation: 'Legitimate shared corporate infrastructure and NAT gateway at WeWork Enpar Hub.',
    recommendedActions: ['Whitelist corporate ASN', 'Case closed as false positive']
  },
  {
    id: 'NET-007',
    name: 'Rapid Fund Movement & Structuring Chain',
    caseId: 'CASE-2026-0062',
    caseTitle: 'Micro-Structuring Burst just below ₹50,000 CTR Limit',
    riskScore: 78,
    riskLevel: 'HIGH',
    detectionPattern: 'Transaction Structuring',
    detectionSignals: ['18 consecutive ₹49,800 transfers', 'Multiple UPI IDs created in 24 hours'],
    totalVolume: 8900000,
    detectedAt: '2026-10-27 16:30:00 IST',
    status: 'PENDING_REVIEW',
    assignedInvestigator: 'Deepak S. (Senior Analyst)',
    entitiesInvolved: { customers: 5, accounts: 6, devices: 3, ips: 2, beneficiaries: 2 },
    customerIds: ['CUST-1007', 'CUST-1014'],
    accountIds: ['ACC-9007', 'ACC-9014'],
    deviceIds: ['DEV-F8817'],
    ipAddresses: ['103.115.197.8'],
    whyFlagged: 'High frequency of transfers just under ₹50,000 threshold to evade mandatory PAN reporting.',
    detectionRulesTriggered: ['RULE-AML-014: Smurfing / Structuring Pattern'],
    missingInfo: 'Merchant POS receipts for beneficiary.',
    evidenceIds: ['EVD-103'],
    observedActivity: 'Repetitive transactions of ₹49,800 sent to digital gaming wallets.',
    suspiciousIndicators: ['Amounts calibrated just below reporting ceiling.'],
    contradictoryEvidence: ['Customer claimed high-volume retail goods purchases.'],
    alternativeExplanation: 'Legitimate small retail vendor inventory settlements.',
    recommendedActions: ['Request itemized invoices from sender.']
  },
  {
    id: 'NET-018',
    name: 'Suspicious High-Risk Merchant Funnel',
    caseId: 'CASE-2026-0077',
    caseTitle: 'Unregistered Gaming Merchant Payment Aggregation',
    riskScore: 82,
    riskLevel: 'HIGH',
    detectionPattern: 'Suspicious Merchant Networks',
    detectionSignals: ['Rapid inflow from 40 student accounts', 'Immediate settlement into overseas FZE'],
    totalVolume: 19000000,
    detectedAt: '2026-10-26 18:20:00 IST',
    status: 'AWAITING_EVIDENCE',
    assignedInvestigator: 'Rajesh V. (Senior Investigator)',
    entitiesInvolved: { customers: 12, accounts: 15, devices: 8, ips: 6, beneficiaries: 4 },
    customerIds: ['CUST-1018', 'CUST-1025'],
    accountIds: ['ACC-9018', 'ACC-9025'],
    deviceIds: ['DEV-F8828'],
    ipAddresses: ['157.48.15.55'],
    whyFlagged: 'High influx of small deposits from retail accounts funneling into offshore gaming gateway.',
    detectionRulesTriggered: ['RULE-MER-008: Gambling Gateway Smurfing'],
    missingInfo: 'Offshore corporate ownership documents for MER-502.',
    evidenceIds: ['EVD-104'],
    observedActivity: 'Aggregated funds consolidated every 6 hours and transferred offshore.',
    suspiciousIndicators: ['Multiple small credits, single large debit to FZE account.'],
    contradictoryEvidence: ['Merchant has an active domestic gaming license in Goa.'],
    alternativeExplanation: 'Regulated casino player deposit handling.',
    recommendedActions: ['Verify Goa gaming commission license validity.']
  },
  {
    id: 'NET-029',
    name: 'Layering-like Cross-Border Outflow',
    caseId: 'CASE-2026-0094',
    caseTitle: 'Multi-Tiered Layering Chain with SWIFT Outward Remittance',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    detectionPattern: 'Layering-like Transaction Chains',
    detectionSignals: ['7 account hops within 2 hours', 'Conversion into trade invoice remittance'],
    totalVolume: 32000000,
    detectedAt: '2026-10-24 11:15:00 IST',
    status: 'ESCALATED',
    assignedInvestigator: 'Sunita P. (Fraud Specialist)',
    entitiesInvolved: { customers: 7, accounts: 9, devices: 4, ips: 5, beneficiaries: 3 },
    customerIds: ['CUST-1029', 'CUST-1048'],
    accountIds: ['ACC-9029', 'ACC-9048'],
    deviceIds: ['DEV-F8839'],
    ipAddresses: ['185.220.101.45'],
    whyFlagged: 'Deep multi-tier layering chain designed to obscure origin of funds prior to foreign outward remittance.',
    detectionRulesTriggered: ['RULE-AML-099: Deep Layering Chain (>5 Hops)'],
    missingInfo: 'Customs bill of entry corresponding to foreign remittance.',
    evidenceIds: ['EVD-103', 'EVD-102'],
    observedActivity: '₹3.2 Cr moved across 7 accounts before wire transfer to Singapore commodity trading firm.',
    suspiciousIndicators: ['Near-instantaneous fund transit with minimal balance retention.'],
    contradictoryEvidence: ['Importer-Exporter Code (IEC) is active and valid with DGFT.'],
    alternativeExplanation: 'Back-to-back commodity trade finance settlement.',
    recommendedActions: ['Cross-check Bill of Entry on ICEGATE portal.']
  },
  // Additional 32 synthetic networks to complete 38 total
  ...Array.from({ length: 32 }, (_, i) => {
    const netNum = 35 + i;
    const risk = 45 + ((i * 17) % 50);
    const riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = risk >= 85 ? 'CRITICAL' : (risk >= 70 ? 'HIGH' : (risk >= 50 ? 'MEDIUM' : 'LOW'));
    const patterns = [
      'Mule Account Network',
      'Circular Fund Transfers',
      'Layering-like Transaction Chains',
      'Transaction Structuring',
      'Shared Device Networks',
      'VPN / Proxy Anomalies',
      'Emulator-Associated Activity',
      'Suspicious Merchant Networks'
    ];

    return {
      id: `NET-0${netNum}`,
      name: `Synthetic Anomaly Cluster #${netNum}`,
      caseId: `CASE-2026-${String(110 + i).padStart(4, '0')}`,
      caseTitle: `Investigation of Cluster NET-0${netNum} (${patterns[i % patterns.length]})`,
      riskScore: risk,
      riskLevel,
      detectionPattern: patterns[i % patterns.length],
      detectionSignals: [`Telemetry anomaly detected on pattern ${patterns[i % patterns.length]}`],
      totalVolume: 2500000 + (i * 1800000),
      detectedAt: `2026-10-${String((i % 26) + 1).padStart(2, '0')} 12:00:00 IST`,
      status: (i % 3 === 0 ? 'UNDER_INVESTIGATION' : (i % 3 === 1 ? 'NEW' : 'AWAITING_EVIDENCE')) as any,
      assignedInvestigator: i % 2 === 0 ? 'Rajesh V. (Senior Investigator)' : 'Deepak S. (Senior Analyst)',
      entitiesInvolved: {
        customers: 3 + (i % 5),
        accounts: 4 + (i % 6),
        devices: 2 + (i % 3),
        ips: 2 + (i % 4),
        beneficiaries: 1 + (i % 3)
      },
      customerIds: [`CUST-${1010 + (i * 2)}`, `CUST-${1011 + (i * 2)}`],
      accountIds: [`ACC-${9010 + (i * 2)}`, `ACC-${9011 + (i * 2)}`],
      deviceIds: [`DEV-F88${15 + (i % 20)}`],
      ipAddresses: [`157.48.${12 + (i % 10)}.42`],
      whyFlagged: `Automated rule trigger: ${patterns[i % patterns.length]} flagged by graph analytics engine.`,
      detectionRulesTriggered: ['RULE-AML-GENERIC: Graph Topology Density Anomaly'],
      missingInfo: 'Awaiting customer response to source of funds inquiry.',
      evidenceIds: ['EVD-101'],
      observedActivity: `Observed ${patterns[i % patterns.length]} spanning multiple bank accounts.`,
      suspiciousIndicators: ['High velocity', 'Unusual network density'],
      contradictoryEvidence: ['Standard KYC records present'],
      alternativeExplanation: 'Legitimate retail trade settlement.',
      recommendedActions: ['Conduct standard source of funds verification.']
    };
  })
];

// Helper functions for easy querying across the app
export const formatINR = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};
