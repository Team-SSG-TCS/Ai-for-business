import React, { useState } from 'react';
import {
  HelpCircle, Sparkles, Download, Send, Filter,
  BarChart3, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight
} from 'lucide-react';
import { PageId } from '../components/layout/AppLayout';

interface DBAssistantProps {
  onNavigate?: (page: PageId, meta?: any) => void;
}

interface PresetItem {
  id: number;
  category: string;
  categoryColor: string;
  question: string;
  userQuery: string;
  timestamp: string;
  chartTitle: string;
  bars: { label: string; value: number }[];
  maxValue: number;
  stats: {
    totalLabel: string;
    totalValue: string;
    criticalLabel: string;
    criticalValue: string;
    clearedLabel: string;
    clearedValue: string;
  };
  diagnosis: string;
  tableData: {
    txnId: string;
    account: string;
    customer: string;
    channel: 'IMPS' | 'UPI' | 'RTGS' | 'NEFT';
    amount: string;
    score: number;
    status: 'CRITICAL' | 'HIGH' | 'CLEARED' | 'BLOCKED';
  }[];
}

const PRESETS: PresetItem[] = [
  {
    id: 1,
    category: 'TELEMETRY',
    categoryColor: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    question: 'What is the high-velocity transaction volume distribution across metro branches?',
    userQuery: 'What is the high-velocity transaction volume distribution across metro branches?',
    timestamp: '12:33 PM',
    chartTitle: 'High-Velocity Transaction Volume by Metro Branch (₹ Cr)',
    maxValue: 100,
    bars: [
      { label: 'Mumbai Fort', value: 94 },
      { label: 'Delhi Connaught Place', value: 91 },
      { label: 'Bengaluru Indiranagar', value: 88 },
      { label: 'Kolkata Salt Lake', value: 85 }
    ],
    stats: {
      totalLabel: 'TOTAL TRANSACTIONS',
      totalValue: '248 Analyzed',
      criticalLabel: 'FLAGGED CRITICAL',
      criticalValue: '226 Critical (91.1%)',
      clearedLabel: 'CLEARED / NORMAL',
      clearedValue: '22 Cleared'
    },
    diagnosis: 'Mumbai Fort branch concentrates 42.8% of structuring volume; 3 enterprise accounts exhibit coordinated rapid smurfing requiring immediate interdiction.',
    tableData: [
      { txnId: 'TXN-88041', account: 'ACC-9120', customer: 'Apex Traders Mumbai', channel: 'IMPS', amount: '₹10,00,000', score: 95, status: 'CRITICAL' },
      { txnId: 'TXN-88042', account: 'ACC-9042', customer: 'Kavita Enterprises', channel: 'UPI', amount: '₹49,500', score: 92, status: 'BLOCKED' },
      { txnId: 'TXN-88045', account: 'ACC-8411', customer: 'Suresh Trading Corp', channel: 'RTGS', amount: '₹9,80,000', score: 88, status: 'HIGH' },
      { txnId: 'TXN-88049', account: 'ACC-7729', customer: 'Global Logistics FZE', channel: 'NEFT', amount: '₹24,50,000', score: 85, status: 'HIGH' },
      { txnId: 'TXN-88053', account: 'ACC-6102', customer: 'Pooja Hegde', channel: 'UPI', amount: '₹15,000', score: 28, status: 'CLEARED' },
      { txnId: 'TXN-88057', account: 'ACC-5519', customer: 'Rohan Mehra', channel: 'IMPS', amount: '₹35,000', score: 22, status: 'CLEARED' }
    ]
  },
  {
    id: 2,
    category: 'HIGH PRIORITY',
    categoryColor: 'bg-red-50 text-red-600 border-red-200',
    question: 'Which accounts are exhibiting rapid smurfing and structuring below ₹50,000 threshold?',
    userQuery: 'Which accounts are exhibiting rapid smurfing and structuring below ₹50,000 threshold?',
    timestamp: '12:35 PM',
    chartTitle: 'Structuring Alert Counts by Account Cluster',
    maxValue: 50,
    bars: [
      { label: 'Cluster ACC-9004', value: 38 },
      { label: 'Cluster ACC-9019', value: 24 },
      { label: 'Cluster ACC-9042', value: 18 },
      { label: 'Cluster ACC-9088', value: 12 }
    ],
    stats: {
      totalLabel: 'STRUCTURING ACCOUNTS',
      totalValue: '18 Identified',
      criticalLabel: 'HIGH CONFIDENCE SMURFING',
      criticalValue: '12 Accounts (66.7%)',
      clearedLabel: 'ESCROW REVIEW',
      clearedValue: '6 Pending'
    },
    diagnosis: 'Cluster ACC-9004 conducted 38 micro-deposits between ₹48,000 and ₹49,990 within 12 minutes to circumvent CTR filing thresholds.',
    tableData: [
      { txnId: 'TXN-88102', account: 'ACC-9004', customer: 'Vikram Mehra', channel: 'UPI', amount: '₹49,900', score: 96, status: 'CRITICAL' },
      { txnId: 'TXN-88103', account: 'ACC-9004', customer: 'Vikram Mehra', channel: 'UPI', amount: '₹49,500', score: 95, status: 'CRITICAL' },
      { txnId: 'TXN-88118', account: 'ACC-9019', customer: 'Kiran Rao', channel: 'IMPS', amount: '₹48,800', score: 91, status: 'BLOCKED' },
      { txnId: 'TXN-88125', account: 'ACC-9042', customer: 'Sanjay Dutt', channel: 'UPI', amount: '₹49,200', score: 89, status: 'HIGH' }
    ]
  },
  {
    id: 3,
    category: 'EVALUATION',
    categoryColor: 'bg-blue-50 text-blue-600 border-blue-200',
    question: 'Show transaction risk score distribution by payment channel (IMPS, UPI, RTGS, NEFT)',
    userQuery: 'Show transaction risk score distribution by payment channel (IMPS, UPI, RTGS, NEFT)',
    timestamp: '12:38 PM',
    chartTitle: 'Average Fraud Risk Centrality Index by Payment Channel',
    maxValue: 100,
    bars: [
      { label: 'IMPS (Immediate)', value: 89 },
      { label: 'UPI (P2P / QR)', value: 78 },
      { label: 'RTGS (High Value)', value: 45 },
      { label: 'NEFT (Batch Clearing)', value: 24 }
    ],
    stats: {
      totalLabel: 'CHANNELS MONITORED',
      totalValue: '4 Channels',
      criticalLabel: 'HIGHEST ANOMALY RATE',
      criticalValue: 'IMPS (89/100 Index)',
      clearedLabel: 'SAFE THRESHOLD',
      clearedValue: 'NEFT (98.2% Clean)'
    },
    diagnosis: 'IMPS channel accounts for 68% of mule layering hops due to sub-second settlement; automated velocity throttling recommended.',
    tableData: [
      { txnId: 'TXN-88201', account: 'ACC-8114', customer: 'Sunil Gavaskar', channel: 'IMPS', amount: '₹4,50,000', score: 94, status: 'CRITICAL' },
      { txnId: 'TXN-88208', account: 'ACC-7221', customer: 'Rahul Dravid', channel: 'UPI', amount: '₹95,000', score: 81, status: 'HIGH' },
      { txnId: 'TXN-88219', account: 'ACC-6003', customer: 'Tata Steel Vendors', channel: 'RTGS', amount: '₹85,00,000', score: 32, status: 'CLEARED' },
      { txnId: 'TXN-88225', account: 'ACC-5110', customer: 'Infosys Payroll', channel: 'NEFT', amount: '₹42,00,000', score: 15, status: 'CLEARED' }
    ]
  },
  {
    id: 4,
    category: 'NETWORK FRAUD',
    categoryColor: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    question: 'Which suspect accounts share high-risk device fingerprints and Tor/VPN exit nodes?',
    userQuery: 'Which suspect accounts share high-risk device fingerprints and Tor/VPN exit nodes?',
    timestamp: '12:40 PM',
    chartTitle: 'Syndicate Accounts Linked per Shared Hardware Fingerprint',
    maxValue: 12,
    bars: [
      { label: 'DEV-F8821 (Android VM)', value: 10 },
      { label: 'DEV-F4419 (Rooted Pixel)', value: 8 },
      { label: 'DEV-F2201 (Tor Gateway)', value: 6 },
      { label: 'DEV-F1099 (Mullvad Node)', value: 3 }
    ],
    stats: {
      totalLabel: 'HARDWARE SIGNATURES',
      totalValue: '4 Suspicious Hubs',
      criticalLabel: 'LINKED MULE ACCOUNTS',
      criticalValue: '27 Accounts Compromised',
      clearedLabel: 'AUTOMATED BLOCK',
      clearedValue: '100% Intercepted'
    },
    diagnosis: 'Hardware fingerprint DEV-F8821 confirmed operating as an automated QEMU Android emulator hopping across 10 distinct mule credentials.',
    tableData: [
      { txnId: 'TXN-88301', account: 'ACC-9012', customer: 'Mule Operative #1', channel: 'IMPS', amount: '₹2,50,000', score: 98, status: 'CRITICAL' },
      { txnId: 'TXN-88302', account: 'ACC-9013', customer: 'Mule Operative #2', channel: 'IMPS', amount: '₹3,00,000', score: 98, status: 'CRITICAL' },
      { txnId: 'TXN-88303', account: 'ACC-9014', customer: 'Mule Operative #3', channel: 'UPI', amount: '₹1,50,000', score: 97, status: 'CRITICAL' },
      { txnId: 'TXN-88310', account: 'ACC-9015', customer: 'Mule Operative #4', channel: 'RTGS', amount: '₹8,00,000', score: 95, status: 'BLOCKED' }
    ]
  },
  {
    id: 5,
    category: 'DIAGNOSTICS',
    categoryColor: 'bg-purple-50 text-purple-600 border-purple-200',
    question: 'Identify dormant accounts that suddenly received high-value circular layering deposits',
    userQuery: 'Identify dormant accounts that suddenly received high-value circular layering deposits',
    timestamp: '12:42 PM',
    chartTitle: 'Dormancy Breakout Volume by Tier (₹ Lakhs)',
    maxValue: 60,
    bars: [
      { label: 'Savings > 180d Dormant', value: 54 },
      { label: 'Current > 90d Inactive', value: 42 },
      { label: 'Jan Dhan High-Balance Spikes', value: 31 },
      { label: 'NRE Foreign Wire Inflow', value: 21 }
    ],
    stats: {
      totalLabel: 'DORMANT BREAKOUTS',
      totalValue: '34 Accounts',
      criticalLabel: 'CIRCULAR LAYERING MATCH',
      criticalValue: '21 Accounts (61.8%)',
      clearedLabel: 'KYC RE-VERIFICATION',
      clearedValue: 'Mandate Triggered'
    },
    diagnosis: 'Savings accounts dormant for over 180 days received ₹54L in collective deposits within 30 minutes, immediately wired to off-shore crypto gateways.',
    tableData: [
      { txnId: 'TXN-88401', account: 'ACC-4491', customer: 'Harish Chandra', channel: 'IMPS', amount: '₹9,95,000', score: 97, status: 'CRITICAL' },
      { txnId: 'TXN-88405', account: 'ACC-4492', customer: 'Sunita Devi', channel: 'RTGS', amount: '₹14,50,000', score: 96, status: 'CRITICAL' },
      { txnId: 'TXN-88411', account: 'ACC-4498', customer: 'Amitabh Sen', channel: 'NEFT', amount: '₹7,20,000', score: 90, status: 'BLOCKED' }
    ]
  }
];

export const DBAssistant: React.FC<DBAssistantProps> = ({ onNavigate }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [showDataTable, setShowDataTable] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (id: number) => {
    setSelectedPresetId(id);
  };

  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const q = inputValue.toLowerCase();
    if (q.includes('smurf') || q.includes('structur') || q.includes('50000') || q.includes('priority')) {
      setSelectedPresetId(2);
    } else if (q.includes('channel') || q.includes('upi') || q.includes('imps') || q.includes('rtgs')) {
      setSelectedPresetId(3);
    } else if (q.includes('device') || q.includes('fingerprint') || q.includes('vpn') || q.includes('tor')) {
      setSelectedPresetId(4);
    } else if (q.includes('dormant') || q.includes('layer') || q.includes('circular')) {
      setSelectedPresetId(5);
    } else {
      setSelectedPresetId(1);
    }
    setInputValue('');
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['TXN ID', 'Account ID', 'Customer Name', 'Channel', 'Amount', 'Risk Score', 'Status'];
      const rows = activePreset.tableData.map(r => [r.txnId, r.account, r.customer, r.channel, r.amount, `${r.score}/100`, r.status]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${activePreset.category.toLowerCase()}_surveillance_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header (Clean, Compact, Within AppLayout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#059669]" />
            <span>AI Database Query Assistant</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono font-bold">
              Natural Language to SQL
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Query live banking ledgers, mule accounts, structuring velocity, and forensic risk signals using plain English.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('transactions')}
              className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Transactions List</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Split Workspace (Left Presets, Right Analytics Canvas) */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* LEFT COLUMN: QUERY SUGGESTIONS (5 PRESETS) */}
        <aside className="w-full lg:w-80 shrink-0 bg-white border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#475569]">
                <HelpCircle className="w-4 h-4 text-[#059669]" />
                <span>Query Suggestions</span>
              </div>
              <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                5 Presets
              </span>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              {PRESETS.map(preset => {
                const isActive = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer border flex gap-2.5 ${
                      isActive
                        ? 'bg-[#ECFDF5] border-[#059669] shadow-xs ring-1 ring-[#059669]/30'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* Number Badge */}
                    <div
                      className={`w-5 h-5 rounded-md font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-xs'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {preset.id}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md mb-1 border ${
                          isActive
                            ? 'bg-[#059669]/10 text-[#059669] border-[#059669]/20'
                            : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                        }`}
                      >
                        {preset.category}
                      </span>
                      <p
                        className={`text-xs leading-snug line-clamp-2 ${
                          isActive ? 'font-semibold text-[#0F172A]' : 'font-normal text-[#475569]'
                        }`}
                      >
                        {preset.question}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Telemetry Status */}
          <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Surveillance Pipeline</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span>Live Synced</span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: CHAT STREAM & ANALYTICS CANVAS */}
        <main className="flex-1 w-full space-y-4">
          {/* User Speech Bubble */}
          <div className="flex items-start gap-2.5 justify-end">
            <div className="max-w-2xl bg-[#059669] text-white px-4 py-2.5 rounded-xl rounded-tr-xs shadow-[0_2px_8px_rgba(5,150,105,0.15)]">
              <p className="text-xs font-medium leading-relaxed">
                {activePreset.userQuery}
              </p>
              <div className="text-[10px] text-white/80 text-right mt-1 font-mono">
                {activePreset.timestamp}
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
              👤
            </div>
          </div>

          {/* AI Response Card Container */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-4">
              {/* Analytics Header & Controls */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#059669]" />
                  <h2 className="text-xs font-bold text-[#0F172A] tracking-tight">
                    {activePreset.chartTitle}
                  </h2>
                </div>

                <button
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg transition cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                </button>
              </div>

              {/* 1. VISUAL BAR CHART */}
              <div className="pt-1">
                <div className="h-44 w-full flex items-end justify-around gap-4 px-2 pb-2 border-b border-[#E2E8F0]">
                  {activePreset.bars.map((bar, idx) => {
                    const heightPercent = Math.min(100, Math.round((bar.value / activePreset.maxValue) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group max-w-[120px]">
                        <div className="text-[11px] font-bold text-[#0F172A] mb-1 font-mono group-hover:text-[#059669] transition">
                          {bar.value}
                        </div>

                        <div className="w-full bg-[#F1F5F9] rounded-t-md overflow-hidden h-36 flex items-end">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-linear-to-t from-[#059669] to-[#34D399] rounded-t-sm transition-all duration-500 ease-out group-hover:brightness-110 shadow-xs"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-around gap-4 px-2 pt-2 text-center text-[11px] text-[#64748B] font-medium">
                  {activePreset.bars.map((bar, idx) => (
                    <div key={idx} className="flex-1 max-w-[120px] truncate">
                      {bar.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. STAT SUMMARY BOXES (3 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg shadow-2xs">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">
                    {activePreset.stats.totalLabel}
                  </div>
                  <div className="text-sm font-extrabold text-[#0F172A]">
                    {activePreset.stats.totalValue}
                  </div>
                </div>

                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg shadow-2xs">
                  <div className="text-[10px] font-bold text-[#059669] uppercase tracking-wider mb-0.5">
                    {activePreset.stats.criticalLabel}
                  </div>
                  <div className="text-sm font-extrabold text-[#059669]">
                    {activePreset.stats.criticalValue}
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg shadow-2xs">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">
                    {activePreset.stats.clearedLabel}
                  </div>
                  <div className="text-sm font-extrabold text-[#0F172A]">
                    {activePreset.stats.clearedValue}
                  </div>
                </div>
              </div>

              {/* 3. AI ANALYTICAL DIAGNOSIS BANNER */}
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex items-start gap-2 text-xs text-[#065F46]">
                <Sparkles className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <strong className="font-bold text-[#059669]">AI Analytical Diagnosis: </strong>
                  {activePreset.diagnosis}
                </div>
              </div>

              {/* 4. FILTERED DATA DRILL-DOWN TABLE */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3 h-3 text-[#059669]" />
                    Filtered Database Records ({activePreset.tableData.length})
                  </span>
                  <button
                    onClick={() => setShowDataTable(!showDataTable)}
                    className="text-xs text-[#059669] font-semibold hover:underline cursor-pointer"
                  >
                    {showDataTable ? 'Collapse Table' : 'Expand Table'}
                  </button>
                </div>

                {showDataTable && (
                  <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] uppercase tracking-wider text-[10px] font-bold">
                        <tr>
                          <th className="py-2 px-3">TXN ID</th>
                          <th className="py-2 px-3">Account</th>
                          <th className="py-2 px-3">Entity Name</th>
                          <th className="py-2 px-3">Channel</th>
                          <th className="py-2 px-3">Amount</th>
                          <th className="py-2 px-3">Risk Score</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                        {activePreset.tableData.map(row => (
                          <tr key={row.txnId} className="hover:bg-[#F8FAFC] transition">
                            <td className="py-1.5 px-3 font-mono font-semibold text-[#0F172A]">{row.txnId}</td>
                            <td className="py-1.5 px-3 font-mono text-[#64748B]">{row.account}</td>
                            <td className="py-1.5 px-3 font-medium">{row.customer}</td>
                            <td className="py-1.5 px-3">
                              <span className="px-1.5 py-0.5 rounded-sm bg-[#F1F5F9] text-[#475569] font-mono text-[10px]">
                                {row.channel}
                              </span>
                            </td>
                            <td className="py-1.5 px-3 font-bold font-mono">{row.amount}</td>
                            <td className="py-1.5 px-3 font-mono font-bold">
                              <span className={row.score >= 90 ? 'text-red-600' : row.score >= 75 ? 'text-amber-600' : 'text-emerald-600'}>
                                {row.score}/100
                              </span>
                            </td>
                            <td className="py-1.5 px-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  row.status === 'CRITICAL'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : row.status === 'BLOCKED'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : row.status === 'HIGH'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM QUERY INPUT BAR */}
          <div className="pt-2">
            <form
              onSubmit={handleCustomQuery}
              className="relative flex items-center bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#059669] focus-within:border-transparent transition"
            >
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask any custom natural language question about transactions, mule accounts, risk scores, or structuring..."
                className="flex-1 pl-3.5 pr-24 py-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Query</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DBAssistant;
