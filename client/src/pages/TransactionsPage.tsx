import React, { useState, useMemo } from 'react';
import {
  TRANSACTIONS, CUSTOMERS, ACCOUNTS, SUSPICIOUS_NETWORKS, Transaction
} from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';
import {
  Search, Filter, ShieldAlert, Cpu, ArrowUpRight,
  TrendingUp, Layers, CheckCircle2, AlertTriangle, ArrowRight,
  SlidersHorizontal, Download, Eye, Network
} from 'lucide-react';

interface TransactionsPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  // Enhance transactions with explicit calculated scores & forensic risk factors
  const enrichedTransactions = useMemo(() => {
    return TRANSACTIONS.map((txn, index) => {
      let score = 25;
      const drivers: { label: string; points: string }[] = [];

      // Link to known clusters
      const isMuleCluster = ['ACC-9004', 'ACC-9019', 'ACC-9042', 'ACC-9088'].includes(txn.fromAccount) ||
                            ['ACC-9004', 'ACC-9019', 'ACC-9042', 'ACC-9088'].includes(txn.toAccount);
      const isEmulatorCluster = ['ACC-9012', 'ACC-9013', 'ACC-9014', 'ACC-9015'].includes(txn.fromAccount);

      if (isMuleCluster) {
        score = 95;
        drivers.push({ label: 'Mule Ring Pattern', points: '+15' });
        drivers.push({ label: 'Emulator Sandbox', points: '+50' });
        drivers.push({ label: 'VPN Obfuscation', points: '+20' });
        drivers.push({ label: 'High Velocity', points: '+10' });
      } else if (isEmulatorCluster) {
        score = 88;
        drivers.push({ label: 'Automated Emulator', points: '+50' });
        drivers.push({ label: 'VPN IP Cluster', points: '+20' });
        drivers.push({ label: 'Rapid Structuring', points: '+18' });
      } else if (txn.amount > 500000) {
        score = 74;
        drivers.push({ label: 'High Value Threshold', points: '+35' });
        drivers.push({ label: 'Cross-Bank Velocity', points: '+25' });
        drivers.push({ label: 'KYC Verified', points: '-10' });
      } else if (txn.amount > 200000) {
        score = 58;
        drivers.push({ label: 'Velocity Anomaly', points: '+25' });
        drivers.push({ label: 'Off-Hours Timing', points: '+15' });
      } else {
        score = Math.max(12, 10 + (index % 25));
        drivers.push({ label: 'Normal Activity', points: 'Baseline' });
      }

      const clusterId = isMuleCluster ? 'NET-004' : (isEmulatorCluster ? 'NET-012' : (index % 5 === 0 ? 'NET-007' : 'None'));

      return {
        ...txn,
        computedScore: score,
        clusterId,
        scoreDrivers: drivers
      };
    });
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return enrichedTransactions.filter(txn => {
      // Risk filter
      if (selectedRiskFilter === 'CRITICAL' && txn.computedScore < 85) return false;
      if (selectedRiskFilter === 'HIGH' && (txn.computedScore < 70 || txn.computedScore >= 85)) return false;
      if (selectedRiskFilter === 'MEDIUM' && (txn.computedScore < 40 || txn.computedScore >= 70)) return false;
      if (selectedRiskFilter === 'LOW' && txn.computedScore >= 40) return false;

      // Channel filter
      if (selectedChannel !== 'ALL' && txn.channel !== selectedChannel) return false;

      // Cluster filter
      if (selectedCluster !== 'ALL' && txn.clusterId !== selectedCluster) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          txn.id.toLowerCase().includes(query) ||
          txn.fromAccount.toLowerCase().includes(query) ||
          txn.toAccount.toLowerCase().includes(query) ||
          txn.fromCustomerName.toLowerCase().includes(query) ||
          txn.toCustomerName.toLowerCase().includes(query) ||
          (txn.patternFlag && txn.patternFlag.toLowerCase().includes(query)) ||
          (txn.networkId && txn.networkId.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [enrichedTransactions, selectedRiskFilter, selectedChannel, selectedCluster, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const currentTransactions = filteredTransactions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  const handleInvestigate = (txnId: string, networkId: string = 'NET-004') => {
    onNavigate('investigation-pipeline', { transactionId: txnId, networkId: networkId === 'None' ? 'NET-004' : networkId });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <span>Transaction Intelligence & Risk Scoring</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono font-semibold">
              Real-time Ingestion Stream
            </span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Continuous scoring of all core banking transactions. Click any transaction to launch the multi-agent investigation pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('data-management')}
            className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#334155] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>+ Ingest New Transactions</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#64748B]">Total Monitored Stream</span>
          <div className="text-2xl font-bold text-[#0F172A] font-mono mt-1">24,856</div>
          <span className="text-[11px] text-[#059669] font-medium mt-0.5 block">100% Ingestion Coverage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#FECACA] shadow-xs bg-rose-50/30">
          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Critical Anomaly (≥85)</span>
          </span>
          <div className="text-2xl font-bold text-rose-700 font-mono mt-1">38</div>
          <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Immediate Hold Triggered</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#FED7AA] shadow-xs bg-amber-50/30">
          <span className="text-xs font-semibold text-amber-800">High Risk (70–84)</span>
          <div className="text-2xl font-bold text-amber-800 font-mono mt-1">104</div>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">Automated Watch Assigned</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#64748B]">Active Syndicates / Clusters</span>
          <div className="text-2xl font-bold text-[#2563EB] font-mono mt-1">14 Clusters</div>
          <span className="text-[11px] text-[#64748B] font-medium mt-0.5 block">Clustering Engine Active</span>
        </div>
      </div>

      {/* Filters & Syndicate Cluster Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPageNumber(1); }}
              placeholder="Search by Transaction ID (e.g. TXN-88041), Account, Customer, IP..."
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#059669] outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Risk filter */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0] text-xs">
              <span className="text-[11px] font-semibold text-[#64748B] px-1.5">Score:</span>
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(rf => (
                <button
                  key={rf}
                  onClick={() => { setSelectedRiskFilter(rf); setPageNumber(1); }}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    selectedRiskFilter === rf
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {rf}
                </button>
              ))}
            </div>

            {/* Payment Channel */}
            <select
              value={selectedChannel}
              onChange={e => { setSelectedChannel(e.target.value); setPageNumber(1); }}
              className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#334155] focus:border-[#059669] outline-none"
            >
              <option value="ALL">All Channels</option>
              <option value="UPI">UPI</option>
              <option value="IMPS">IMPS</option>
              <option value="RTGS">RTGS</option>
              <option value="NEFT">NEFT</option>
            </select>
          </div>
        </div>

        {/* Syndicate Cluster Quick Bar */}
        <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#475569] flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#059669]" />
            <span>Group by Cluster / Syndicate:</span>
          </span>

          <button
            onClick={() => { setSelectedCluster('ALL'); setPageNumber(1); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedCluster === 'ALL'
                ? 'bg-[#059669] text-white'
                : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
            }`}
          >
            All Clusters ({enrichedTransactions.length})
          </button>

          <button
            onClick={() => { setSelectedCluster('NET-004'); setPageNumber(1); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
              selectedCluster === 'NET-004'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span>🚨 NET-004: Mule Ring & Circular Layering</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded">Score 95</span>
          </button>

          <button
            onClick={() => { setSelectedCluster('NET-012'); setPageNumber(1); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
              selectedCluster === 'NET-012'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>📱 NET-012: Virtual Emulator Syndicate</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded">Score 88</span>
          </button>

          <button
            onClick={() => { setSelectedCluster('NET-007'); setPageNumber(1); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
              selectedCluster === 'NET-007'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span>⚡ NET-007: Rapid Velocity Funnel</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded">Score 74</span>
          </button>
        </div>
      </div>

      {/* Main Transactions Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Sender & Account</th>
                <th className="py-3.5 px-4">Receiver / Beneficiary</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Calculated Risk Score</th>
                <th className="py-3.5 px-4">Key Score Drivers</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {currentTransactions.map(txn => {
                const isCritical = txn.computedScore >= 85;
                const isHigh = txn.computedScore >= 70 && txn.computedScore < 85;
                const isMedium = txn.computedScore >= 40 && txn.computedScore < 70;

                return (
                  <tr
                    key={txn.id}
                    className={`hover:bg-[#F8FAFC] transition-colors ${
                      isCritical ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    {/* Txn ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">
                      <div className="flex items-center gap-1.5">
                        <span>{txn.id}</span>
                        {txn.clusterId !== 'None' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#F1F5F9] text-[#2563EB] border border-[#CBD5E1]">
                            {txn.clusterId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-[#64748B] font-mono whitespace-nowrap">
                      {txn.timestamp}
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{txn.fromCustomerName}</div>
                      <div className="font-mono text-[11px] text-[#64748B]">{txn.fromAccount}</div>
                    </td>

                    {/* Receiver */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{txn.toCustomerName}</div>
                      <div className="font-mono text-[11px] text-[#64748B]">{txn.toAccount}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F172A] text-sm whitespace-nowrap">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Channel */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        {txn.channel}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono font-bold text-xs whitespace-nowrap ${
                            isCritical
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : isHigh
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isMedium
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {txn.computedScore} / 100
                        </span>

                        <div className="w-14 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${
                              isCritical ? 'bg-rose-600' : (isHigh ? 'bg-amber-500' : 'bg-emerald-500')
                            }`}
                            style={{ width: `${txn.computedScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Drivers Preview */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {txn.scoreDrivers.slice(0, 2).map((d, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
                          >
                            {d.label}: <strong>{d.points}</strong>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Action: Launch Investigation Pipeline */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleInvestigate(txn.id, txn.clusterId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                          isCritical
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-[#059669] hover:bg-[#047857] text-white'
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Investigate Pipeline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <div>
            Showing {(pageNumber - 1) * pageSize + 1} to {Math.min(pageNumber * pageSize, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-[#334155] font-semibold disabled:opacity-40 hover:bg-[#F1F5F9]"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-mono text-[#0F172A] font-bold">
              Page {pageNumber} of {totalPages || 1}
            </span>
            <button
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-[#334155] font-semibold disabled:opacity-40 hover:bg-[#F1F5F9]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
