import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, Filter, Search, ExternalLink,
  ChevronRight, X, Info, CheckCircle2, ArrowRight, Eye, Shield
} from 'lucide-react';
import { SUSPICIOUS_NETWORKS, SuspiciousNetwork, formatINR } from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface DetectionCenterPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const DetectionCenterPage: React.FC<DetectionCenterPageProps> = ({ onNavigate }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<SuspiciousNetwork | null>(SUSPICIOUS_NETWORKS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'ALL',
    'Mule Account Network',
    'Circular Fund Transfers',
    'Layering-like Transaction Chains',
    'Transaction Structuring',
    'Shared Device Networks',
    'VPN / Proxy Anomalies',
    'Emulator-Associated Activity',
    'Suspicious Merchant Networks'
  ];

  const filteredNetworks = SUSPICIOUS_NETWORKS.filter(net => {
    if (categoryFilter !== 'ALL' && !net.detectionPattern.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
    if (riskFilter !== 'ALL' && net.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'ALL' && net.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = net.id.toLowerCase().includes(q) || net.name.toLowerCase().includes(q) || net.caseId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Suspicious Activity Detection</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              38 Networks Flagged
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Identify unusual financial behavior, shared infrastructure anomalies, and connected suspicious networks.
          </p>
        </div>

        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center gap-2 max-w-md">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Compliance notice: Indicators represent algorithmic anomaly alerts, not confirmed criminal findings.
          </span>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <span className="text-xs text-gray-400 block">Networks Detected</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">38</div>
          <span className="text-[11px] text-gray-500 block mt-1">Across 100 KYC customers</span>
        </div>

        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <span className="text-xs text-gray-400 block">Critical Networks</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">9</div>
          <span className="text-[11px] text-rose-400/80 block mt-1">Risk score &gt; 85 / 100</span>
        </div>

        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <span className="text-xs text-gray-400 block">New Anomalies</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">14</div>
          <span className="text-[11px] text-amber-400/80 block mt-1">Flagged in last 48 hours</span>
        </div>

        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <span className="text-xs text-gray-400 block">Pending Investigations</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">16</div>
          <span className="text-[11px] text-indigo-400/80 block mt-1">Awaiting compliance review</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Network or Case ID..."
              className="pl-8 pr-3 py-1.5 bg-[#0B0F19] text-xs text-white rounded border border-[#273449] focus:border-indigo-500 w-52"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Detection Categories' : cat}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (Score 85+)</option>
            <option value="HIGH">High (Score 70-84)</option>
            <option value="MEDIUM">Medium (Score 50-69)</option>
            <option value="LOW">Low (Score &lt;50)</option>
          </select>

          {/* Investigation Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="NEW">New</option>
            <option value="AWAITING_EVIDENCE">Awaiting Evidence</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ESCALATED">Escalated</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <span className="text-xs font-mono text-gray-400">
          Showing {filteredNetworks.length} of {SUSPICIOUS_NETWORKS.length} networks
        </span>
      </div>

      {/* Main Detection Results Table */}
      <div className="bg-[#131B2B] rounded-xl border border-[#273449] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
              <tr>
                <th className="py-3 px-4">Network ID</th>
                <th className="py-3 px-4">Detection Pattern</th>
                <th className="py-3 px-4">Entities Involved</th>
                <th className="py-3 px-4">Flagged Volume</th>
                <th className="py-3 px-4">Primary Detection Signal</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Detected At</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {filteredNetworks.map(item => {
                const isSelected = selectedNetwork?.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedNetwork(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#182235] ring-1 ring-inset ring-indigo-500/40' : 'hover:bg-[#182235]/60'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                      <span>{item.id}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{item.detectionPattern}</td>
                    <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">
                      {item.entitiesInvolved.customers}c · {item.entitiesInvolved.accounts}a · {item.entitiesInvolved.devices}d
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">{formatINR(item.totalVolume)}</td>
                    <td className="py-3.5 px-4 text-gray-300 max-w-xs truncate">{item.detectionSignals[0]}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.riskScore >= 85
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : item.riskScore >= 70
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">{item.detectedAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('investigation-workspace', { networkId: item.id });
                        }}
                        className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded border border-indigo-500/40 font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Detection Panel (When a network is selected) */}
      {selectedNetwork && (
        <div className="bg-[#131B2B] rounded-xl border border-[#273449] p-6 shadow-xl space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#273449] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-indigo-400">{selectedNetwork.id}</span>
                <span className="text-gray-500">|</span>
                <span className="font-mono text-xs text-gray-400">{selectedNetwork.caseId}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    selectedNetwork.riskLevel === 'CRITICAL'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedNetwork.riskScore} {selectedNetwork.riskLevel}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{selectedNetwork.name}</h2>
            </div>

            <button
              onClick={() => onNavigate('investigation-workspace', { networkId: selectedNetwork.id })}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Launch Multi-Agent Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Why this network was flagged & Rules Triggered */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Why This Network Was Flagged
                </h3>
                <p className="text-xs text-gray-300 bg-[#0B0F19] p-3 rounded-lg border border-[#273449] leading-relaxed">
                  {selectedNetwork.whyFlagged}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Detection Rules Triggered
                </h3>
                <div className="space-y-2">
                  {selectedNetwork.detectionRulesTriggered.map((rule, idx) => (
                    <div key={idx} className="p-2.5 bg-[#0B0F19] border border-rose-500/30 rounded text-xs flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                      <span className="font-mono text-gray-200">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Related Entities, Evidence References & Missing Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Entities & Graph Relationships
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-[#0B0F19] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Customers:</span>
                    <span className="font-mono text-white font-bold">{selectedNetwork.customerIds.join(', ')}</span>
                  </div>
                  <div className="p-2.5 bg-[#0B0F19] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Accounts:</span>
                    <span className="font-mono text-white font-bold">{selectedNetwork.accountIds.join(', ')}</span>
                  </div>
                  <div className="p-2.5 bg-[#0B0F19] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Devices:</span>
                    <span className="font-mono text-purple-400 font-bold">{selectedNetwork.deviceIds.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Missing Information / Unresolved Questions
                </h3>
                <div className="p-3 bg-[#0B0F19] border border-amber-500/30 rounded text-xs text-amber-200/90 leading-relaxed">
                  {selectedNetwork.missingInfo}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Linked Evidence Ledger
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNetwork.evidenceIds.map(evId => (
                    <span key={evId} className="px-2 py-0.5 bg-gray-800 text-indigo-300 rounded font-mono text-[10px] border border-gray-700">
                      {evId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
