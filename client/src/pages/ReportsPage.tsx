import React, { useState } from 'react';
import {
  FileText, Download, Printer, Share2, CheckCircle2,
  ExternalLink, Eye, ChevronRight, X, Shield, Sparkles, Check
} from 'lucide-react';
import { SUSPICIOUS_NETWORKS } from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface ReportsPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('Network Investigation Report');
  const [isViewerModalOpen, setIsViewerModalOpen] = useState<boolean>(false);
  const [activeReportNetwork, setActiveReportNetwork] = useState(SUSPICIOUS_NETWORKS[0]);

  const reportCards = [
    {
      title: 'Network Investigation Report',
      desc: 'Complete dossier detailing cluster topology, member customer KYC, device binding, and multi-agent synthesis.',
      type: 'Executive Dossier',
      format: 'PDF · STR / SAR Format',
      badge: 'Regulatory Grade'
    },
    {
      title: 'Transaction Analysis Report',
      desc: 'Chronological core banking ledger analysis, rapid fund velocity metrics, and circular kickback loops.',
      type: 'Financial Audit',
      format: 'CSV · XLSX · PDF',
      badge: 'Core Banking'
    },
    {
      title: 'Device & Telemetry Report',
      desc: 'Hardware fingerprints, QEMU hypervisor flags, sensor accelerometer telemetry, and carrier CG-NAT hops.',
      type: 'Cyber Forensics',
      format: 'JSON · PDF',
      badge: 'Forensic Sandbox'
    },
    {
      title: 'Money Trail Reconstruction Report',
      desc: 'Hop-by-hop fund dispersion flow diagrams, inter-hop latency stamps, and liquidation destination accounting.',
      type: 'Fund Flow Analysis',
      format: 'Sankey Vector · PDF',
      badge: 'Asset Tracing'
    },
    {
      title: 'Risk Assessment & STR Filing Report',
      desc: 'PMLA / FIU-IND compliant draft disclosure incorporating competing hypotheses and human investigator digital signature.',
      type: 'Compliance Filing',
      format: 'XML · JSON · PDF',
      badge: 'FIU-IND STR'
    }
  ];

  const reportHistory = [
    { id: 'REP-2026-904', name: 'Mule Ring Layering Dossier (NET-004)', type: 'FIU-IND STR', generatedAt: '2026-10-31 09:15 IST', generatedBy: 'Lead AML Officer', size: '3.4 MB', status: 'Ready for Dispatch' },
    { id: 'REP-2026-903', name: 'Emulator Farm Forensic Extraction (NET-012)', type: 'Device Audit', generatedAt: '2026-10-30 18:40 IST', generatedBy: 'Cyber Fraud Team', size: '5.1 MB', status: 'Approved' },
    { id: 'REP-2026-902', name: 'Rapid Velocity Smurfing Ledger (NET-007)', type: 'Core Banking Audit', generatedAt: '2026-10-29 14:22 IST', generatedBy: 'Compliance Core', size: '2.8 MB', status: 'Archived' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <span>Regulatory STR Reports & Audit Export Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono font-semibold">
              FIU-IND & FinCEN Compliant
            </span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Generate formal Suspicious Transaction Reports (STRs) and evidence disclosure packages for law enforcement submission.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveReportNetwork(SUSPICIOUS_NETWORKS[0]);
            setIsViewerModalOpen(true);
          }}
          className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Preview Active Case STR (NET-004)</span>
        </button>
      </div>

      {/* 5 Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-[#E2E8F0] hover:border-[#059669] shadow-xs flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  {card.badge}
                </span>
                <span className="text-xs text-[#64748B] font-mono">{card.type}</span>
              </div>

              <h3 className="text-sm font-bold text-[#0F172A] mt-3 group-hover:text-[#059669] transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] font-mono text-[11px]">{card.format}</span>
              <button
                onClick={() => {
                  setSelectedReportType(card.title);
                  setIsViewerModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#059669] text-[#334155] hover:text-white border border-[#CBD5E1] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report History Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">Generated Compliance Dossiers Archive</h3>
          <span className="text-xs text-[#64748B]">All documents cryptographically timestamped and signed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Report Token</th>
                <th className="py-3 px-4">Dossier Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Generated By</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {reportHistory.map(rep => (
                <tr key={rep.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">{rep.id}</td>
                  <td className="py-3.5 px-4 text-[#0F172A] font-medium">{rep.name}</td>
                  <td className="py-3.5 px-4 text-[#64748B]">{rep.type}</td>
                  <td className="py-3.5 px-4 text-[#64748B] font-mono">{rep.generatedAt}</td>
                  <td className="py-3.5 px-4 text-[#334155]">{rep.generatedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-[#64748B]">{rep.size}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setIsViewerModalOpen(true)}
                      className="px-2.5 py-1 text-xs bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#334155] rounded inline-flex items-center gap-1 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Viewer Modal */}
      {isViewerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#CBD5E1] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{selectedReportType} – {activeReportNetwork.caseId}</h3>
                  <span className="text-[10px] text-[#64748B] font-mono">FIU-IND Suspicious Transaction Disclosure Packet</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-white hover:bg-[#F1F5F9] text-[#334155] rounded text-xs font-semibold flex items-center gap-1.5 border border-[#CBD5E1]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setIsViewerModalOpen(false)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#334155] bg-[#FFFFFF]">
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#059669] font-bold uppercase tracking-wider block">FIU-IND DISCLOSURE DOSSIER</span>
                  <h2 className="text-base font-bold text-[#0F172A] mt-1">
                    SUSPICIOUS TRANSACTION & NETWORK INVESTIGATION REPORT
                  </h2>
                  <div className="flex gap-4 mt-2 text-[11px] font-mono text-[#64748B]">
                    <span>Case ID: <strong className="text-[#0F172A]">{activeReportNetwork.caseId}</strong></span>
                    <span>Cluster: <strong className="text-[#2563EB]">{activeReportNetwork.id}</strong></span>
                    <span>Risk: <strong className="text-rose-600 font-bold">{activeReportNetwork.riskScore}/100 CRITICAL</strong></span>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-[#64748B] block">Date of Generation:</span>
                  <span className="font-mono text-[#0F172A] font-bold">2026-10-31 10:30 IST</span>
                  <span className="text-[#059669] font-semibold block mt-1">Digital Signature Verified</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  1. Executive Summary
                </h3>
                <p className="leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  On October 28, 2026, the NEXUS Financial Crime Intelligence engine detected a coordinated fund dispersion pattern involving four domestic bank accounts and one shared physical Android handset. An inward remittance of ₹10,00,000 was split within 18 minutes into accounts held by Priya Sharma (ACC-9019) and Amit Verma (ACC-9042), subsequently liquidated through bullion merchant accounts with ₹1,50,000 returned to the origin account.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  2. Identified Violations & Recommended Actions
                </h3>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Maintain active transaction monitoring hold on Account ACC-9004.</li>
                    <li>Conduct physical verification of dispatch unit DEV-F8821 at BKC office.</li>
                    <li>File preliminary disclosure with FIU-IND under Category ML-MULE-CIRCULAR.</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex justify-between text-[11px] text-[#64748B]">
                    <span>Lead Investigator: <strong>Rajesh V. (Senior AML Officer)</strong></span>
                    <span>Audit Token: <strong className="font-mono text-[#059669]">0x8892FA109B3</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
