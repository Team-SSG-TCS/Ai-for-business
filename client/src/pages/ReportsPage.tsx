import React, { useState } from 'react';
import {
  FileText, Download, Printer, Share2, CheckCircle2,
  ExternalLink, Eye, ChevronRight, X, Shield, Sparkles
} from 'lucide-react';
import { SUSPICIOUS_NETWORKS, formatINR } from '../mock/financialData';
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
      format: 'XML / FIU Format',
      badge: 'Statutory Filing'
    }
  ];

  const reportHistory = [
    { id: 'REP-2026-0041', name: 'CASE-2026-0041 (NET-004) Formal STR Report', type: 'Network Investigation Report', generatedAt: '2026-10-31 09:12 IST', generatedBy: 'Rajesh V.', size: '4.2 MB', status: 'Signed & Approved' },
    { id: 'REP-2026-0089', name: 'CASE-2026-0089 (NET-012) Headless Android Forensic Log', type: 'Device & Telemetry Report', generatedAt: '2026-10-30 18:40 IST', generatedBy: 'Sunita P.', size: '8.1 MB', status: 'Under Review' },
    { id: 'REP-2026-0105', name: 'CASE-2026-0105 (NET-021) Benign Co-working Hub Disposition', type: 'Risk Assessment Report', generatedAt: '2026-10-29 14:15 IST', generatedBy: 'Kavita N.', size: '1.8 MB', status: 'Closed - Cleared' },
    { id: 'REP-2026-0062', name: 'CASE-2026-0062 Micro-Structuring Flow Summary', type: 'Transaction Analysis Report', generatedAt: '2026-10-28 11:20 IST', generatedBy: 'Deepak S.', size: '3.4 MB', status: 'Exported' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Investigation Reports & Statutory Exports</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              FIU-IND Ready
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Generate and export cryptographically signed investigation summaries, money trails, and regulatory filings.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveReportNetwork(SUSPICIOUS_NETWORKS[0]);
            setIsViewerModalOpen(true);
          }}
          className="px-4 py-2 bg-[#00D06C] hover:bg-[#05B860] text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/20 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Active Case STR Report (NET-004)</span>
        </button>
      </div>

      {/* 5 Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#131715] p-5 rounded-xl border border-[#1C2420] hover:border-[#00D06C]/50 shadow-lg flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {card.badge}
                </span>
                <span className="text-xs text-gray-400 font-mono">{card.type}</span>
              </div>

              <h3 className="text-sm font-bold text-white mt-3 group-hover:text-[#00D06C] transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1C2420] flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono text-[11px]">{card.format}</span>
              <button
                onClick={() => {
                  setSelectedReportType(card.title);
                  setIsViewerModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#182235] hover:bg-[#00D06C] text-gray-200 hover:text-black rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report History Table */}
      <div className="bg-[#131B2B] rounded-xl border border-[#273449] shadow-lg overflow-hidden">
        <div className="p-4 border-b border-[#273449] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Generated Reports Audit Archive</h2>
            <p className="text-xs text-gray-400">Past investigation reports signed and downloaded by authorized analysts.</p>
          </div>
          <span className="text-xs text-gray-400 font-mono">{reportHistory.length} reports on record</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Report Title</th>
                <th className="py-3 px-4">Template Category</th>
                <th className="py-3 px-4">Generated At</th>
                <th className="py-3 px-4">Generated By</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {reportHistory.map(rep => (
                <tr key={rep.id} className="hover:bg-[#182235]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00D06C]">{rep.id}</td>
                  <td className="py-3.5 px-4 text-white font-medium">{rep.name}</td>
                  <td className="py-3.5 px-4 text-gray-300">{rep.type}</td>
                  <td className="py-3.5 px-4 text-gray-400 font-mono">{rep.generatedAt}</td>
                  <td className="py-3.5 px-4 text-gray-300">{rep.generatedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{rep.size}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setIsViewerModalOpen(true)}
                      className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Report Viewer Modal */}
      {isViewerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131715] border border-[#1C2420] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#1C2420] flex items-center justify-between bg-[#0D110F]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0D2619] border border-[#00D06C]/30 flex items-center justify-center text-[#00D06C]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedReportType} – {activeReportNetwork.caseId}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Formal Regulatory STR/SAR Compliance Dossier</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-[#182235] hover:bg-[#1E2D45] text-gray-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-[#1C2420]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setIsViewerModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Report Document Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300 bg-[#08090A]">
              {/* Report Header Band */}
              <div className="p-4 bg-[#131715] rounded-xl border border-[#1C2420] flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#00D06C] uppercase tracking-wider block">FIU-IND COMPLIANCE DOSSIER</span>
                  <h2 className="text-base font-bold text-white mt-1">
                    SUSPICIOUS TRANSACTION & NETWORK DISCLOSURE REPORT
                  </h2>
                  <div className="flex gap-4 mt-2 text-[11px] font-mono text-gray-400">
                    <span>Case ID: <strong className="text-white">{activeReportNetwork.caseId}</strong></span>
                    <span>Cluster: <strong className="text-cyan-400">{activeReportNetwork.id}</strong></span>
                    <span>Risk Level: <strong className="text-rose-400">{activeReportNetwork.riskScore}/100 HIGH</strong></span>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-gray-400 block">Date of Generation:</span>
                  <span className="font-mono text-white font-bold">2026-10-31 10:30 IST</span>
                  <span className="text-[#00D06C] font-medium block mt-1">Digital Signature Verified</span>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#00D06C]">
                  1. Executive Summary
                </h3>
                <p className="leading-relaxed bg-[#131B2B] p-3 rounded-lg border border-[#273449]">
                  On October 28, 2026, the NEXUS Financial Intelligence graph engine detected an coordinated fund dispersion pattern involving four domestic bank accounts and one shared physical Android handset. An inward remittance of ₹10,00,000 was split within 19 minutes into accounts held by Priya Sharma (ACC-9019) and Amit Verma (ACC-9042), subsequently liquidated through bullion merchant accounts with ₹1,50,000 returned to the origin account.
                </p>
              </div>

              {/* 2. Network Overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                  2. Network Overview & Identified Entities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-[#131B2B] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Customers</span>
                    <span className="font-mono text-white font-bold text-sm">4 Identified</span>
                  </div>
                  <div className="p-2.5 bg-[#131B2B] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Bank Accounts</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm">5 Accounts</span>
                  </div>
                  <div className="p-2.5 bg-[#131B2B] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Total Volume</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">{formatINR(activeReportNetwork.totalVolume)}</span>
                  </div>
                  <div className="p-2.5 bg-[#131B2B] rounded border border-[#273449]">
                    <span className="text-gray-400 text-[10px] block">Shared Hardware</span>
                    <span className="font-mono text-purple-400 font-bold text-sm">DEV-F8821</span>
                  </div>
                </div>
              </div>

              {/* 3. Suspicious Patterns & Evidence Ledger */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-rose-400">
                  3. Suspicious Patterns & Cryptographic Evidence Ledger
                </h3>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 bg-[#131B2B] rounded border border-[#273449] text-gray-200">
                    <strong className="text-rose-400">[EVD-101]</strong> DEV-F8821: Hardware fingerprint sha256_984191 bound to CUST-1004, 1019, 1042, 1077.
                  </div>
                  <div className="p-2 bg-[#131B2B] rounded border border-[#273449] text-gray-200">
                    <strong className="text-rose-400">[EVD-102]</strong> IP-185.220.101.45: Concurrent NordVPN Amsterdam session egress.
                  </div>
                  <div className="p-2 bg-[#131B2B] rounded border border-[#273449] text-gray-200">
                    <strong className="text-rose-400">[EVD-103]</strong> TXN-88041-88046: 94.2% balance velocity exhaustion in 45 minutes.
                  </div>
                </div>
              </div>

              {/* 4. Alternative Explanations & Remaining Uncertainty */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">
                  4. Alternative Explanation & Objective Uncertainty
                </h3>
                <p className="leading-relaxed bg-[#131B2B] p-3 rounded-lg border border-[#273449]">
                  {activeReportNetwork.alternativeExplanation} Enrolled corporate MDM dispatch inventory (EVD-108) suggests possible shared operations terminal. Verification of initial inward wire origin remains open pending correspondent bank response.
                </p>
              </div>

              {/* 5. Recommended Actions & Audit Trail */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-emerald-400">
                  5. Recommended Actions & Formal Investigator Sign-off
                </h3>
                <div className="p-4 bg-[#131B2B] rounded-lg border border-[#273449] space-y-2">
                  <p className="text-white font-medium">Recommended Next Steps:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Maintain active transaction monitoring hold on Account ACC-9004.</li>
                    <li>Conduct physical verification of dispatch unit DEV-F8821 at BKC office.</li>
                    <li>File preliminary disclosure with FIU-IND under Category ML-MULE-CIRCULAR.</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-[#1C2420] flex justify-between text-[11px] text-gray-400">
                    <span>Lead Investigator: <strong>Rajesh V. (Senior AML Officer)</strong></span>
                    <span>Audit Token: <strong className="font-mono text-[#00D06C]">0x8892FA109B3</strong></span>
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
