import React, { useState } from 'react';
import {
  Cpu, ShieldAlert, CheckCircle2, Clock, Play,
  Sparkles, FileText, Check, AlertTriangle,
  ExternalLink, ChevronDown, Download,
  UserCheck, Network, Shield, X
} from 'lucide-react';
import {
  SUSPICIOUS_NETWORKS, EVIDENCE_STORE, EvidenceItem, formatINR
} from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface InvestigationWorkspacePageProps {
  onNavigate: (page: PageId, meta?: any) => void;
  networkId?: string;
}

interface AgentState {
  id: string;
  name: string;
  iconName: string;
  status: 'Completed' | 'Running' | 'Pending';
  shortDesc: string;
  detailedFindings: string;
  evidenceCount: number;
  timestamp: string;
  expanded?: boolean;
}

export const InvestigationWorkspacePage: React.FC<InvestigationWorkspacePageProps> = ({
  onNavigate,
  networkId = 'NET-004'
}) => {
  const currentNetwork = SUSPICIOUS_NETWORKS.find(n => n.id === networkId) || SUSPICIOUS_NETWORKS[0];

  // Evidence state & modal
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [evidenceFilter, setEvidenceFilter] = useState<string>('ALL');
  const [selectedHypothesisTab, setSelectedHypothesisTab] = useState<'both' | 'suspicious' | 'legitimate'>('both');

  // Human investigator action feedback
  const [reportApproved, setReportApproved] = useState<boolean>(false);
  const [additionalEvidenceRequested, setAdditionalEvidenceRequested] = useState<boolean>(false);
  const [assignedInvestigator, setAssignedInvestigator] = useState<string>(currentNetwork.assignedInvestigator);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

  // Agent execution timeline state
  const [agents, setAgents] = useState<AgentState[]>([
    {
      id: 'agent-1',
      name: 'Network Analysis Agent',
      iconName: 'Network',
      status: 'Completed',
      shortDesc: 'Constructed multi-hop topological graph and identified entity bindings.',
      detailedFindings: 'Identified 4 connected customer accounts (CUST-1004, CUST-1019, CUST-1042, CUST-1077), 2 common beneficiaries (BEN-401 Apex Bullion), and 1 shared hardware device fingerprint (DEV-F8821). Graph clustering coefficient: 0.84.',
      evidenceCount: 4,
      timestamp: '2026-10-28 09:43:10 IST',
      expanded: false
    },
    {
      id: 'agent-2',
      name: 'Pattern Investigation Agent',
      iconName: 'Activity',
      status: 'Completed',
      shortDesc: 'Discovered rapid multi-hop dispersion and circular fund returns.',
      detailedFindings: 'Detected rapid fund movement of ₹10,00,000 originating from Account A (ACC-9004), divided across two branches within 19 minutes, and partially cycling back (₹1,50,000 via TXN-88047) completing a circular transaction path.',
      evidenceCount: 3,
      timestamp: '2026-10-28 09:44:02 IST',
      expanded: false
    },
    {
      id: 'agent-3',
      name: 'Hypothesis Generation Agent',
      iconName: 'Sparkles',
      status: 'Completed',
      shortDesc: 'Formulated competing criminal syndicate vs legitimate treasury models.',
      detailedFindings: 'Generated two primary competing hypotheses: (1) Mule account network coordinating rapid layering to convert funds to precious metals, and (2) Authorized shared corporate treasury terminal for Mehra-Sharma Logistics LLP.',
      evidenceCount: 2,
      timestamp: '2026-10-28 09:44:45 IST',
      expanded: false
    },
    {
      id: 'agent-4',
      name: 'Evidence Investigation Agent',
      iconName: 'FileText',
      status: 'Completed',
      shortDesc: 'Retrieved core banking ledger, MDM telemetry, and FIU disclosures.',
      detailedFindings: 'Retrieved 12 supporting records (EVD-101 through EVD-112) including 7 core transactions, device sensor telemetry hooks, NordVPN session drops, and 5 contradictory corporate filing records.',
      evidenceCount: 12,
      timestamp: '2026-10-28 09:45:30 IST',
      expanded: true
    },
    {
      id: 'agent-5',
      name: 'Alternative Explanation Agent',
      iconName: 'HelpCircle',
      status: 'Completed',
      shortDesc: 'Evaluated legitimate business operations and co-located hardware.',
      detailedFindings: 'Identified possible legitimate business relationship between CUST-1004 and CUST-1019 under Mehra-Sharma Logistics LLP with valid GSTIN registration. Device DEV-F8821 is listed in enterprise MDM fleet inventory as a logistics field dispatch unit.',
      evidenceCount: 4,
      timestamp: '2026-10-28 09:46:12 IST',
      expanded: false
    },
    {
      id: 'agent-6',
      name: 'Risk Assessment Agent',
      iconName: 'ShieldAlert',
      status: 'Running',
      shortDesc: 'Calculating composite threat index and regulatory reporting probability.',
      detailedFindings: 'Currently synthesizing contradictory corporate filings against high-frequency circular fund velocity. Preliminary composite threat score: 94 / 100.',
      evidenceCount: 6,
      timestamp: '2026-10-28 09:47:00 IST',
      expanded: false
    },
    {
      id: 'agent-7',
      name: 'Investigation Report Agent',
      iconName: 'FileCheck',
      status: 'Pending',
      shortDesc: 'Generating formal Suspicious Activity Report (SAR / STR) draft.',
      detailedFindings: 'Standing by for completion of Risk Assessment Agent to compile final executive findings and audit trail.',
      evidenceCount: 0,
      timestamp: 'Pending trigger',
      expanded: false
    }
  ]);

  const [isRunningInvestigation, setIsRunningInvestigation] = useState<boolean>(false);

  // Trigger live simulated re-investigation
  const handleRunInvestigation = () => {
    setIsRunningInvestigation(true);
    setAgents(prev => prev.map((a, i) => {
      if (i === 5) return { ...a, status: 'Running' };
      if (i === 6) return { ...a, status: 'Running' };
      return a;
    }));

    setTimeout(() => {
      setAgents(prev => prev.map((a, i) => {
        if (i === 5) {
          return {
            ...a,
            status: 'Completed',
            detailedFindings: 'Risk index established at 94/100 (HIGH). High probability of synthetic mule funnel with non-conforming device telemetry.',
            timestamp: new Date().toLocaleTimeString() + ' IST'
          };
        }
        if (i === 6) {
          return {
            ...a,
            status: 'Completed',
            detailedFindings: 'Generated comprehensive regulatory STR disclosure draft referencing all 12 evidence artifacts and human review stipulations.',
            timestamp: new Date().toLocaleTimeString() + ' IST'
          };
        }
        return a;
      }));
      setIsRunningInvestigation(false);
    }, 1800);
  };

  const toggleAgentExpand = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, expanded: !a.expanded } : a));
  };

  // Evidence list
  const evidenceList = currentNetwork.evidenceIds.map(id => EVIDENCE_STORE[id]).filter(Boolean);
  const filteredEvidence = evidenceList.filter(item => {
    if (evidenceFilter === 'ALL') return true;
    return item.type === evidenceFilter;
  });

  return (
    <div className="space-y-6">
      {/* Investigation Dossier Header */}
      <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-5 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#00D06C]">{currentNetwork.caseId}</span>
              <span className="text-gray-600">/</span>
              <span className="font-mono text-xs font-semibold text-cyan-400">{currentNetwork.id}</span>
              <span className="text-gray-600">/</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#0D2619] text-[#00D06C] border border-[#00D06C]/30 font-semibold">
                Status: {currentNetwork.status.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono font-bold">
                Risk Priority: HIGH ({currentNetwork.riskScore}/100)
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-2">{currentNetwork.caseTitle}</h1>
            <p className="text-xs text-[#9CA3AF] mt-1">
              {currentNetwork.detectionPattern} · Detected at {currentNetwork.detectedAt} · Assigned to {assignedInvestigator}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('money-trail')}
              className="px-3.5 py-2 bg-[#161C19] hover:bg-[#1C2420] text-[#00D06C] rounded-lg text-xs font-semibold border border-[#00D06C]/30 flex items-center gap-1.5 transition-colors"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Trace Money Trail</span>
            </button>

            <button
              onClick={handleRunInvestigation}
              disabled={isRunningInvestigation}
              className="px-4 py-2 bg-[#00D06C] hover:bg-[#05B860] disabled:opacity-50 text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/25 transition-all"
            >
              {isRunningInvestigation ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Executing AI Agents...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Run Investigation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Panel A (Network Summary) & Panel B (AI Agent Investigation Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL A – Network Summary (4 cols) */}
        <div className="lg:col-span-4 bg-[#131715] border border-[#1C2420] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2420]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00D06C]" />
                <span>Panel A – Network Summary</span>
              </h2>
              <span className="text-[10px] font-mono text-[#9CA3AF]">Cluster {currentNetwork.id}</span>
            </div>

            {/* Metrics List */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">Connected Customers:</span>
                <span className="font-mono text-white font-bold">{currentNetwork.entitiesInvolved.customers} Profiles</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">Bank Accounts:</span>
                <span className="font-mono text-cyan-400 font-bold">{currentNetwork.entitiesInvolved.accounts} Accounts</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">Shared Hardware Devices:</span>
                <span className="font-mono text-[#34D399] font-bold">{currentNetwork.deviceIds.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">VPN / Datacenter IPs:</span>
                <span className="font-mono text-rose-400 font-bold">185.220.101.45 (NordVPN)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">Emulator Indicators:</span>
                <span className="font-mono text-rose-400 font-bold">QEMU hypervisor, Null Gyro</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">Total Flagged Volume:</span>
                <span className="font-mono text-white font-bold">{formatINR(currentNetwork.totalVolume)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">First Observed Activity:</span>
                <span className="font-mono text-gray-300">2026-10-28 09:15:00 IST</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1C2420]">
                <span className="text-[#9CA3AF]">Last Observed Activity:</span>
                <span className="font-mono text-gray-300">2026-10-28 10:45:00 IST</span>
              </div>
            </div>

            {/* Mini Network Topology Visual */}
            <div className="mt-4 p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#9CA3AF]">Mini Graph Schema</span>
                <button
                  onClick={() => onNavigate('network-intelligence')}
                  className="text-[10px] text-[#00D06C] hover:text-[#05B860] flex items-center gap-1 font-semibold"
                >
                  <span>Interactive View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="h-28 w-full flex items-center justify-center relative">
                <svg viewBox="0 0 240 100" className="w-full h-full">
                  <line x1="40" y1="50" x2="120" y2="25" stroke="#1C2420" strokeWidth="1.5" />
                  <line x1="40" y1="50" x2="120" y2="75" stroke="#1C2420" strokeWidth="1.5" />
                  <line x1="120" y1="25" x2="200" y2="50" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="120" y1="75" x2="200" y2="50" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="40" cy="50" r="14" fill="#131715" stroke="#00D06C" strokeWidth="2" />
                  <text x="40" y="53" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="sans-serif">ACC-A</text>
                  <circle cx="120" cy="25" r="12" fill="#131715" stroke="#06B6D4" strokeWidth="2" />
                  <text x="120" y="28" fill="#FFFFFF" fontSize="7" textAnchor="middle" fontFamily="sans-serif">ACC-B</text>
                  <circle cx="120" cy="75" r="12" fill="#131715" stroke="#06B6D4" strokeWidth="2" />
                  <text x="120" y="78" fill="#FFFFFF" fontSize="7" textAnchor="middle" fontFamily="sans-serif">ACC-C</text>
                  <circle cx="200" cy="50" r="14" fill="#131715" stroke="#EF4444" strokeWidth="2" />
                  <text x="200" y="53" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="sans-serif">BEN-401</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C2420] text-[11px] text-[#9CA3AF] text-center">
            Cluster resolution confidence: 96.4% via Spectral Partitioning
          </div>
        </div>

        {/* PANEL B – AI Agent Investigation Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-[#131715] border border-[#1C2420] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2420]">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00D06C]" />
                  <span>Panel B – Specialized AI Agent Investigation Timeline</span>
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Autonomous agents collaborate to dissect graph topology, gather evidence, challenge assumptions, and produce audit-ready findings.
                </p>
              </div>
              <span className="text-xs font-mono text-[#00D06C] bg-[#0D2619] px-2 py-1 rounded border border-[#00D06C]/30">
                7 Specialized Agents
              </span>
            </div>

            {/* Vertical Agent Execution Timeline */}
            <div className="mt-4 space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#1C2420]">
              {agents.map((agent) => {
                const isRunning = agent.status === 'Running';
                const isCompleted = agent.status === 'Completed';

                return (
                  <div
                    key={agent.id}
                    className={`relative pl-11 rounded-xl p-3 border transition-all ${
                      isRunning
                        ? 'bg-[#0D2619]/40 border-[#00D06C]/60 shadow-md shadow-[#00D06C]/10'
                        : isCompleted
                        ? 'bg-[#08090A] border-[#1C2420] hover:border-[#2A3630]'
                        : 'bg-[#08090A]/40 border-[#1C2420] opacity-60'
                    }`}
                  >
                    {/* Status Circle Node on Timeline */}
                    <div className="absolute left-2.5 top-3.5 -translate-x-1/2">
                      {isRunning ? (
                        <div className="w-6 h-6 rounded-full bg-[#00D06C] flex items-center justify-center text-black text-[10px] animate-radar">
                          <Cpu className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-[#0D2619] border border-[#00D06C] flex items-center justify-center text-[#00D06C]">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#131715] border border-[#2A3630] flex items-center justify-center text-[#9CA3AF]">
                          <Clock className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Agent Header */}
                    <div
                      onClick={() => toggleAgentExpand(agent.id)}
                      className="flex items-start justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{agent.name}</span>
                          <span
                            className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                              isCompleted
                                ? 'bg-[#0D2619] text-[#00D06C] border border-[#00D06C]/30'
                                : isRunning
                                ? 'bg-[#00D06C] text-black font-bold animate-pulse'
                                : 'bg-[#131715] text-[#9CA3AF]'
                            }`}
                          >
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5">{agent.shortDesc}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {agent.evidenceCount > 0 && (
                          <span className="text-[10px] font-mono text-[#00D06C] bg-[#0D2619] px-2 py-0.5 rounded border border-[#00D06C]/30">
                            {agent.evidenceCount} records
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">{agent.timestamp}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            agent.expanded ? 'rotate-180 text-white' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expandable Detailed Findings */}
                    {agent.expanded && (
                      <div className="mt-3 pt-3 border-t border-[#1C2420] text-xs text-gray-300 space-y-2 animate-in fade-in duration-150">
                        <div className="p-2.5 bg-[#131715] rounded border border-[#1C2420] leading-relaxed">
                          <strong className="text-white block mb-1">Synthesized Output:</strong>
                          {agent.detailedFindings}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Panel C – Competing Hypotheses & Reconciliation Matrix */}
      <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1C2420] gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D06C]" />
              <span>Panel C – Competing Hypotheses & Objective Reconciliation</span>
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              NEXUS rigorously tests both criminal syndicate and benign corporate models before rendering human review recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedHypothesisTab('both')}
              className={`px-3 py-1 rounded text-xs font-semibold ${selectedHypothesisTab === 'both' ? 'bg-[#00D06C] text-black font-bold' : 'bg-[#08090A] text-gray-400'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setSelectedHypothesisTab('suspicious')}
              className={`px-3 py-1 rounded text-xs font-semibold ${selectedHypothesisTab === 'suspicious' ? 'bg-rose-600 text-white' : 'bg-[#08090A] text-gray-400'}`}
            >
              Suspicious Model
            </button>
            <button
              onClick={() => setSelectedHypothesisTab('legitimate')}
              className={`px-3 py-1 rounded text-xs font-semibold ${selectedHypothesisTab === 'legitimate' ? 'bg-emerald-600 text-white' : 'bg-[#08090A] text-gray-400'}`}
            >
              Legitimate Model
            </button>
          </div>
        </div>

        {/* Side-by-Side Hypotheses Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hypothesis 1: Suspicious Activity */}
          {(selectedHypothesisTab === 'both' || selectedHypothesisTab === 'suspicious') && (
            <div className="bg-[#08090A] border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Suspicious Activity Hypothesis</span>
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                    Confidence: 82%
                  </span>
                </div>

                <p className="text-xs font-semibold text-white mt-2 leading-relaxed">
                  "Multiple accounts may be coordinating rapid fund movements through shared device infrastructure to obscure origin and liquidate into bullion."
                </p>

                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block">Key Supporting Evidence:</span>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-rose-400 font-mono font-bold text-[10px]">[EVD-101]</span>
                      <span>Common hardware device fingerprint DEV-F8821 shared across 4 distinct individuals.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-400 font-mono font-bold text-[10px]">[EVD-102]</span>
                      <span>Multiple concurrent sessions initiated through NordVPN Amsterdam Datacenter node.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-400 font-mono font-bold text-[10px]">[EVD-103]</span>
                      <span>Rapid multi-hop transfers (94.2% balance wiped within 45 mins).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-400 font-mono font-bold text-[10px]">[EVD-104]</span>
                      <span>Final common beneficiary Apex Bullion Trade (BEN-401) flagged in 3 prior STRs.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-900/30 text-[10px] text-rose-300/80">
                Primary Threat Classification: Smurfing & Mule Account Ring
              </div>
            </div>
          )}

          {/* Hypothesis 2: Alternative Legitimate Explanation */}
          {(selectedHypothesisTab === 'both' || selectedHypothesisTab === 'legitimate') && (
            <div className="bg-[#08090A] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Alternative Legitimate Explanation</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Confidence: 68%
                  </span>
                </div>

                <p className="text-xs font-semibold text-white mt-2 leading-relaxed">
                  "The accounts may belong to a legitimate organization using shared field devices and centralized financial operations for urgent trade procurement."
                </p>

                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block">Key Contradictory Evidence:</span>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">[EVD-106]</span>
                      <span>CUST-1004 & CUST-1019 share registered entity (Mehra-Sharma Logistics LLP) with valid GSTIN.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">[EVD-107]</span>
                      <span>Signed IT consulting and logistics contracts on file with correspondent bank.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">[EVD-108]</span>
                      <span>Device DEV-F8821 is registered in enterprise MDM fleet inventory as an authorized dispatch unit.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">[EVD-109]</span>
                      <span>Prior August 2026 CTR alert cleared with verified export shipping invoices.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/30 text-[10px] text-emerald-300/80">
                Plausible Business Mechanism: Field Terminal Procurement Settlement
              </div>
            </div>
          )}
        </div>

        {/* Reconciliation Section */}
        <div className="bg-[#08090A] rounded-xl p-4 border border-[#1C2420]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>Reconciliation & Investigator Uncertainty Matrix</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded">
              Requires Human Decision
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
            <div className="p-3 bg-[#131715] rounded border border-[#1C2420]">
              <span className="text-[#9CA3AF] block mb-1 font-semibold">Evidence Supporting Suspicious:</span>
              <p className="text-gray-200">
                4 unrelated customer profiles sharing a single phone, VPN masking domestic coordinates, and 14-month dormancy awakening on Ramesh Chawla (CUST-1077).
              </p>
            </div>

            <div className="p-3 bg-[#131715] rounded border border-[#1C2420]">
              <span className="text-[#9CA3AF] block mb-1 font-semibold">Evidence Supporting Legitimate:</span>
              <p className="text-gray-200">
                Genuine corporate entity registration, shared office address at BKC Mumbai, and enrolled corporate MDM fleet management profiles.
              </p>
            </div>

            <div className="p-3 bg-[#131715] rounded border border-[#1C2420]">
              <span className="text-[#9CA3AF] block mb-1 font-semibold">Unresolved Questions:</span>
              <p className="text-amber-300">
                Why was gold bullion selected as settlement destination instead of regular corporate banking NEFT? Origin of initial ₹10L offshore wire remains unverified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Panel D – Evidence Explorer */}
      <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1C2420] gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00D06C]" />
              <span>Panel D – Evidence Explorer Ledger</span>
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Every factual AI deduction is bound to a verified evidence artifact with cryptographic source tracking.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'TRANSACTION', 'DEVICE', 'IP', 'ACCOUNT', 'HISTORICAL_ALERT'].map(type => (
              <button
                key={type}
                onClick={() => setEvidenceFilter(type)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  evidenceFilter === type
                    ? 'bg-[#00D06C] text-black font-bold'
                    : 'bg-[#08090A] text-gray-400 hover:text-white border border-[#1C2420]'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D110F] text-[#9CA3AF] font-semibold border-b border-[#1C2420]">
              <tr>
                <th className="py-2.5 px-3">Evidence ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Factual Description</th>
                <th className="py-2.5 px-3">Source Record</th>
                <th className="py-2.5 px-3">Related Entity</th>
                <th className="py-2.5 px-3">Supports</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2420]">
              {filteredEvidence.map(item => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedEvidence(item)}
                  className="hover:bg-[#161C19] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#00D06C]">{item.id}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#0D2619] text-[#34D399] font-mono border border-[#00D06C]/30">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white max-w-md">{item.description}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#9CA3AF]">{item.sourceRecord}</td>
                  <td className="py-3 px-3 font-mono text-cyan-400">{item.relatedEntity}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.supportsHypothesis === 'SUSPICIOUS'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : item.supportsHypothesis === 'LEGITIMATE'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#1C2420] text-gray-400'
                      }`}
                    >
                      {item.supportsHypothesis}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2 py-1 bg-[#161C19] group-hover:bg-[#00D06C] text-[#D1D5DB] group-hover:text-black rounded text-[11px] font-bold transition-colors">
                      View Raw
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Panel E – Investigation Conclusion & Human Investigator Approval */}
      <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1C2420] gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#00D06C]" />
              <span>Panel E – Structured Investigation Synthesis & Human Review</span>
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Compliance requirement: AI recommendations require senior investigator validation prior to regulatory filing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3 py-2 bg-[#161C19] hover:bg-[#1C2420] text-gray-200 rounded-lg text-xs font-semibold border border-[#1C2420] flex items-center gap-1.5"
            >
              <span>Assign Investigator</span>
            </button>

            <button
              onClick={() => setAdditionalEvidenceRequested(true)}
              className="px-3 py-2 bg-[#161C19] hover:bg-[#1C2420] text-amber-300 rounded-lg text-xs font-semibold border border-amber-900/40 flex items-center gap-1.5"
            >
              <span>Request Additional Evidence</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="px-3.5 py-2 bg-[#161C19] hover:bg-[#1C2420] text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-800/40 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={() => setReportApproved(true)}
              disabled={reportApproved}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
                reportApproved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#00D06C] hover:bg-[#05B860] text-black shadow-[#00D06C]/25'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{reportApproved ? 'Report Approved & Signed' : 'Approve Investigation Report'}</span>
            </button>
          </div>
        </div>

        {reportApproved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Investigation approved by Senior Investigator Rajesh V. Cryptographic digital signature appended (SHA-256: 8f9b4c21...). Case escalated to PMLA / FIU-IND queue.
            </span>
          </div>
        )}

        {additionalEvidenceRequested && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Request dispatched to Correspondent Clearing Operations: Subpoena copy for initial offshore wire origin and on-site audit of BKC dispatch terminal.
            </span>
          </div>
        )}

        {/* 7-Step Structured Investigation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
            <span className="font-bold text-[#00D06C] block mb-1">1. Observed Activity</span>
            <p className="text-gray-300">{currentNetwork.observedActivity}</p>
          </div>

          <div className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
            <span className="font-bold text-rose-400 block mb-1">2. Suspicious Indicators</span>
            <ul className="list-disc pl-4 space-y-1 text-gray-300">
              {currentNetwork.suspiciousIndicators.map((ind, i) => (
                <li key={i}>{ind}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
            <span className="font-bold text-emerald-400 block mb-1">3. Contradictory Evidence</span>
            <ul className="list-disc pl-4 space-y-1 text-gray-300">
              {currentNetwork.contradictoryEvidence.map((ev, i) => (
                <li key={i}>{ev}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
            <span className="font-bold text-amber-400 block mb-1">4. Alternative Explanations</span>
            <p className="text-gray-300">{currentNetwork.alternativeExplanation}</p>
          </div>

          <div className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
            <span className="font-bold text-cyan-400 block mb-1">5. Remaining Uncertainty</span>
            <p className="text-gray-300">{currentNetwork.missingInfo}</p>
          </div>

          <div className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420]">
            <span className="font-bold text-white block mb-1">6. Recommended Next Actions</span>
            <ul className="list-disc pl-4 space-y-1 text-gray-300">
              {currentNetwork.recommendedActions.slice(0, 2).map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Evidence Source Raw Inspector Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131715] border border-[#1C2420] rounded-xl w-full max-w-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2420]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#00D06C]">{selectedEvidence.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#0D2619] text-[#34D399] font-mono border border-[#00D06C]/30">
                  {selectedEvidence.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-1 text-[#9CA3AF] hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#9CA3AF] block">Description:</span>
                <p className="text-white font-medium mt-0.5">{selectedEvidence.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#9CA3AF] block">Source Record:</span>
                  <span className="font-mono text-[#00D06C]">{selectedEvidence.sourceRecord}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">Related Entity:</span>
                  <span className="font-mono text-cyan-400">{selectedEvidence.relatedEntity}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">Timestamp:</span>
                  <span className="font-mono text-gray-200">{selectedEvidence.timestamp}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">Confidence:</span>
                  <span className="font-mono text-[#00D06C] font-bold">
                    {(selectedEvidence.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#9CA3AF] block mb-1">Raw Payload / Cryptographic Telemetry:</span>
                <pre className="p-3 bg-[#08090A] rounded-lg border border-[#1C2420] text-[11px] font-mono text-[#34D399] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedEvidence.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1C2420] flex justify-end">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-1.5 bg-[#161C19] hover:bg-[#1C2420] text-white rounded text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investigator Re-assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131715] border border-[#1C2420] rounded-xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Re-assign Lead Investigator</h3>
            <p className="text-xs text-[#9CA3AF]">Select an authorized senior AML compliance analyst.</p>

            <div className="space-y-2 text-xs">
              {[
                'Rajesh V. (Senior Investigator - Lead)',
                'Sunita P. (Senior Fraud Specialist)',
                'Deepak S. (Senior Compliance Analyst)',
                'Kavita N. (Risk & Regulatory Officer)'
              ].map(name => (
                <button
                  key={name}
                  onClick={() => {
                    setAssignedInvestigator(name);
                    setIsAssignModalOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    assignedInvestigator === name
                      ? 'bg-[#0D2619] border-[#00D06C] text-[#00D06C] font-bold'
                      : 'bg-[#08090A] border-[#1C2420] text-gray-300 hover:bg-[#161C19]'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
