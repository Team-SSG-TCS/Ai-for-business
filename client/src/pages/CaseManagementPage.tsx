import React, { useState } from 'react';
import {
  FolderKanban, Search, Filter, ExternalLink, ChevronRight,
  ShieldAlert, Clock, UserCheck, AlertTriangle, CheckCircle2,
  Plus, Edit3
} from 'lucide-react';
import { SUSPICIOUS_NETWORKS, SuspiciousNetwork, formatINR } from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface CaseManagementPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const CaseManagementPage: React.FC<CaseManagementPageProps> = ({ onNavigate }) => {
  const [cases, setCases] = useState<SuspiciousNetwork[]>(SUSPICIOUS_NETWORKS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);

  const statuses = ['ALL', 'NEW', 'UNDER_INVESTIGATION', 'AWAITING_EVIDENCE', 'PENDING_REVIEW', 'ESCALATED', 'CLOSED'];
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.riskLevel !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = c.caseId.toLowerCase().includes(q) || c.caseTitle.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.assignedInvestigator.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = (caseId: string, newStatus: any) => {
    setCases(prev => prev.map(c => c.caseId === caseId ? { ...c, status: newStatus } : c));
  };

  const handleUpdateInvestigator = (caseId: string, newInvestigator: string) => {
    setCases(prev => prev.map(c => c.caseId === caseId ? { ...c, assignedInvestigator: newInvestigator } : c));
    setEditingCaseId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Investigation Case Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              {cases.length} Total Dossiers
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track, assign, prioritize, and escalate active financial crime network cases across compliance teams.
          </p>
        </div>

        <button
          onClick={() => onNavigate('investigation-workspace', { networkId: 'NET-004' })}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Active Workspace (CASE-2026-0041)</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Case ID, Network, or Analyst..."
              className="pl-8 pr-3 py-1.5 bg-[#0B0F19] text-xs text-white rounded border border-[#273449] focus:border-indigo-500 w-64"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            {statuses.map(st => (
              <option key={st} value={st}>
                {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            {priorities.map(pr => (
              <option key={pr} value={pr}>
                {pr === 'ALL' ? 'All Priorities' : pr}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono text-gray-400">
          Showing {filteredCases.length} active cases
        </span>
      </div>

      {/* Cases Table */}
      <div className="bg-[#131B2B] rounded-xl border border-[#273449] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Network ID</th>
                <th className="py-3 px-4">Case Title</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Investigator</th>
                <th className="py-3 px-4">Flagged Volume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {filteredCases.map(item => (
                <tr
                  key={item.caseId}
                  className="hover:bg-[#182235] transition-colors group cursor-pointer"
                  onClick={() => onNavigate('investigation-workspace', { networkId: item.id })}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.caseId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">{item.id}</td>
                  <td className="py-3.5 px-4 text-gray-200 font-medium max-w-xs truncate">{item.caseTitle}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : item.riskLevel === 'HIGH'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300" onClick={e => e.stopPropagation()}>
                    <select
                      value={item.assignedInvestigator}
                      onChange={e => handleUpdateInvestigator(item.caseId, e.target.value)}
                      className="bg-[#0B0F19] text-xs text-gray-200 border border-[#273449] rounded px-2 py-1 focus:border-indigo-500"
                    >
                      <option value="Rajesh V. (Senior Investigator)">Rajesh V. (Senior)</option>
                      <option value="Sunita P. (Fraud Specialist)">Sunita P. (Fraud)</option>
                      <option value="Deepak S. (Senior Analyst)">Deepak S. (Analyst)</option>
                      <option value="Kavita N. (Risk Officer)">Kavita N. (Risk)</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{formatINR(item.totalVolume)}</td>
                  <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                    <select
                      value={item.status}
                      onChange={e => handleUpdateStatus(item.caseId, e.target.value)}
                      className={`text-[11px] font-semibold rounded px-2 py-1 border bg-[#0B0F19] ${
                        item.status === 'UNDER_INVESTIGATION'
                          ? 'text-indigo-300 border-indigo-500/40'
                          : item.status === 'ESCALATED'
                          ? 'text-rose-400 border-rose-500/40'
                          : item.status === 'CLOSED'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : 'text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <option value="NEW">New</option>
                      <option value="UNDER_INVESTIGATION">Under Investigation</option>
                      <option value="AWAITING_EVIDENCE">Awaiting Evidence</option>
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="ESCALATED">Escalated</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('investigation-workspace', { networkId: item.id });
                      }}
                      className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded border border-indigo-500/40 font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
