import React, { useState } from 'react';
import {
  History, Search, Filter, Shield, User, FileText,
  UploadCloud, Play, CheckCircle2, AlertTriangle, Eye, Lock
} from 'lucide-react';
import { PageId } from '../components/layout/AppLayout';

interface AuditLogsPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  category: 'UPLOAD' | 'INVESTIGATION' | 'CASE' | 'EVIDENCE' | 'REPORT' | 'PERMISSION';
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionCategory, setActionCategory] = useState<string>('ALL');
  const [userFilter, setUserFilter] = useState<string>('ALL');

  const auditLogs: AuditEntry[] = [
    { id: 'LOG-88120', user: 'Rajesh V. (Senior Investigator)', action: 'Investigation Executed', resource: 'CASE-2026-0041 (NET-004)', timestamp: '2026-10-31 09:47:12 IST', ipAddress: '10.14.88.21 (Internal VPN)', status: 'SUCCESS', category: 'INVESTIGATION' },
    { id: 'LOG-88119', user: 'Rajesh V. (Senior Investigator)', action: 'Report Exported (PDF)', resource: 'REP-2026-0041 STR Disclosure', timestamp: '2026-10-31 09:42:00 IST', ipAddress: '10.14.88.21 (Internal VPN)', status: 'SUCCESS', category: 'REPORT' },
    { id: 'LOG-88118', user: 'Sunita P. (Fraud Specialist)', action: 'Evidence Inspected', resource: 'EVD-105 (Sensor Accelerometer Parquet)', timestamp: '2026-10-31 09:30:15 IST', ipAddress: '10.14.88.45', status: 'SUCCESS', category: 'EVIDENCE' },
    { id: 'LOG-88117', user: 'Deepak S. (Senior Analyst)', action: 'Case Priority Escalated', resource: 'CASE-2026-0089 (NET-012)', timestamp: '2026-10-31 09:15:30 IST', ipAddress: '10.14.88.19', status: 'SUCCESS', category: 'CASE' },
    { id: 'LOG-88116', user: 'Ingestion Pipeline Service', action: 'Dataset Upload Completed', resource: 'core_banking_txns_oct2026.csv', timestamp: '2026-10-31 08:30:15 IST', ipAddress: '10.200.4.1 (ETL Service)', status: 'SUCCESS', category: 'UPLOAD' },
    { id: 'LOG-88115', user: 'Kavita N. (Risk Officer)', action: 'Evidence Access Attempt', resource: 'EVD-104 (Restricted FIU Str Vault)', timestamp: '2026-10-31 08:12:44 IST', ipAddress: '10.14.88.92', status: 'WARNING', category: 'EVIDENCE' },
    { id: 'LOG-88114', user: 'System Admin (SecOps)', action: 'User Permission Modified', resource: 'Analyst S. Raman granted STR signatory', timestamp: '2026-10-30 18:22:10 IST', ipAddress: '10.14.99.1', status: 'SUCCESS', category: 'PERMISSION' },
    { id: 'LOG-88113', user: 'Deepak S. (Senior Analyst)', action: 'Money Trail Filter Scanned', resource: 'ACC-9004 Multi-Hop Trace (TXN-88041)', timestamp: '2026-10-30 17:40:02 IST', ipAddress: '10.14.88.19', status: 'SUCCESS', category: 'INVESTIGATION' },
    { id: 'LOG-88112', user: 'Sunita P. (Fraud Specialist)', action: 'Investigator Reassigned', resource: 'CASE-2026-0062 -> Deepak S.', timestamp: '2026-10-30 16:10:00 IST', ipAddress: '10.14.88.45', status: 'SUCCESS', category: 'CASE' },
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (actionCategory !== 'ALL' && log.category !== actionCategory) return false;
    if (userFilter !== 'ALL' && !log.user.includes(userFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = log.id.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.resource.toLowerCase().includes(q) || log.user.toLowerCase().includes(q);
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
            <span>Audit & Compliance Activity Logs</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              Immutable Ledger
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track dataset uploads, AI agent investigation executions, case updates, and evidence access for statutory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Cryptographic hash chaining active (SHA-256)</span>
        </div>
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
              placeholder="Search user, action, resource, or log ID..."
              className="pl-8 pr-3 py-1.5 bg-[#0B0F19] text-xs text-white rounded border border-[#273449] focus:border-indigo-500 w-64"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={actionCategory}
            onChange={e => setActionCategory(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            <option value="ALL">All Action Categories</option>
            <option value="UPLOAD">Dataset Uploads</option>
            <option value="INVESTIGATION">Investigation Executions</option>
            <option value="CASE">Case Updates</option>
            <option value="EVIDENCE">Evidence Access</option>
            <option value="REPORT">Report Exports</option>
            <option value="PERMISSION">User Permissions</option>
          </select>

          {/* User Filter */}
          <select
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
          >
            <option value="ALL">All Users & Services</option>
            <option value="Rajesh V.">Rajesh V.</option>
            <option value="Sunita P.">Sunita P.</option>
            <option value="Deepak S.">Deepak S.</option>
            <option value="Kavita N.">Kavita N.</option>
            <option value="Ingestion Pipeline">Pipeline Service</option>
          </select>
        </div>

        <span className="text-xs font-mono text-gray-400">
          {filteredLogs.length} events logged
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#131B2B] rounded-xl border border-[#273449] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">User / System Actor</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#182235] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{log.id}</td>
                  <td className="py-3.5 px-4 text-white font-medium flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{log.user}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-200">{log.action}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{log.resource}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
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
