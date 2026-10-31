import React, { useState, useEffect } from 'react';
import { fetchLangGraphInvestigation, executeRemediationAction, MOCK_LANGGRAPH_RESULT } from '../services/api';
import type { LangGraphInvestigationResult } from '../types';
import { PageId } from '../components/layout/AppLayout';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { AIForensicAssistant } from '../components/assistant/AIForensicAssistant';
import {
  ShieldAlert, ArrowLeft, Bot, CheckCircle2, AlertTriangle,
  GitBranch, Smartphone, Globe, User, Layers, FileText,
  SlidersHorizontal, Download, Share2, Clock, Check, Cpu,
  HelpCircle, Eye, Sparkles
} from 'lucide-react';

interface InvestigationPipelinePageProps {
  transactionId?: string;
  networkId?: string;
  onNavigate: (page: PageId, meta?: any) => void;
}

export const InvestigationPipelinePage: React.FC<InvestigationPipelinePageProps> = ({
  transactionId = 'TXN-88041',
  networkId = 'NET-004',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<string>('graph');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(true);
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);
  const [investigationData, setInvestigationData] = useState<LangGraphInvestigationResult>(MOCK_LANGGRAPH_RESULT);
  const [isLoadingLangGraph, setIsLoadingLangGraph] = useState<boolean>(false);
  const [remediationMsg, setRemediationMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingLangGraph(true);
    fetchLangGraphInvestigation(transactionId)
      .then((data) => setInvestigationData(data))
      .catch(() => setInvestigationData(MOCK_LANGGRAPH_RESULT))
      .finally(() => setIsLoadingLangGraph(false));
  }, [transactionId]);

  const handleExecuteRemediation = async () => {
    const action = investigationData.adjudication?.recommended_action || 'FREEZE_ACCOUNT';
    const res = await executeRemediationAction(action, transactionId);
    setRemediationMsg(res.message);
    setIsSignedOff(true);
  };

  // Pipeline stages
  const pipelineStages = [
    { id: 'entity-resolution', label: '1. Entity Resolution', icon: User },
    { id: 'graph', label: '2. Relationship Graph', icon: Layers },
    { id: 'anomalies', label: '3. Anomaly Detection', icon: AlertTriangle },
    { id: 'reasoning', label: '4. Pattern Reasoning', icon: GitBranch },
    { id: 'hypothesis', label: '5. AI Hypothesis', icon: Bot },
    { id: 'evidence', label: '6. Evidence Discovery', icon: FileText },
    { id: 'alternatives', label: '7. Alternative Explanations', icon: HelpCircle },
    { id: 'scoring', label: '8. Confidence Scoring', icon: SlidersHorizontal },
    { id: 'narrative', label: '9. Investigation Narrative', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('transactions')}
            className="p-2 hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-lg border border-[#CBD5E1] transition-colors"
            title="Back to Transactions List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-[#0F172A]">{transactionId}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-rose-100 text-rose-700 border border-rose-300">
                Score: 95 / 100 [CRITICAL RISK]
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Cluster: {networkId}
              </span>
            </div>
            <div className="text-xs text-[#64748B] mt-0.5">
              Subject: <strong>Vikram Mehra</strong> (HDFC Bank: ACC-9004) → Inward ₹10,00,000 Dispersal via Android Emulator DEV-F8821
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isAssistantOpen
                ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                : 'bg-white text-[#334155] border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isAssistantOpen ? 'Hide AI Copilot' : 'Open AI Copilot'}</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="px-3 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export FIU STR</span>
          </button>
        </div>
      </div>

      {/* 9-Stage Pipeline Horizontal Stepper */}
      <div className="bg-white p-2 rounded-xl border border-[#E2E8F0] shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeTab === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveTab(stage.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#34D399]' : 'text-[#94A3B8]'}`} />
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live LangGraph Multi-Agent Status Banner */}
      <div className="bg-[#0F172A] text-white p-3.5 rounded-xl border border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🕸️</span>
          <div>
            <span className="font-bold text-slate-100 flex items-center gap-2">
              LangGraph State Machine Active • Seed: <code className="text-emerald-400 font-mono font-bold">{investigationData.seed_id}</code>
              {isLoadingLangGraph && <span className="text-amber-400 text-[11px] animate-pulse font-normal">(Running Agent Nodes...)</span>}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Prosecution Typology Reasoner ➔ Devil's Advocate ➔ Compliance Adjudicator ➔ Automated Interdiction
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs flex items-center gap-2">
            <div>
              <span className="text-slate-400 text-[10px] block leading-none">CRIMINAL RISK</span>
              <span className="text-red-400 font-bold">{investigationData.adjudication?.risk_score || 94}/100</span>
            </div>
            <div className="h-5 w-px bg-slate-700"></div>
            <div>
              <span className="text-slate-400 text-[10px] block leading-none">LEGITIMACY</span>
              <span className="text-emerald-400 font-bold">{investigationData.adjudication?.legitimacy_score || 15}/100</span>
            </div>
          </div>
          <a
            href="http://localhost:8000/langgraph-view"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1"
          >
            <span>Live Agent Visualizer</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Main Content Layout (Grid: Pipeline Content on Left, AI Assistant on Right if Open) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${isAssistantOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          {/* STAGE 1: Entity Resolution */}
          {activeTab === 'entity-resolution' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#059669]" />
                  <span>Stage 1: Multi-Entity Resolution & Cross-Account Identity Linking</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Automated entity resolution has grouped 4 bank customer records into 1 unified criminal syndicate based on physical device IMEI and network fingerprint overlap.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-2.5 px-3">Resolved Customer</th>
                      <th className="py-2.5 px-3">Bank & Account</th>
                      <th className="py-2.5 px-3">PAN / Tax ID</th>
                      <th className="py-2.5 px-3">Bound Hardware IMEI</th>
                      <th className="py-2.5 px-3">Match Confidence</th>
                      <th className="py-2.5 px-3">Syndicate Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-bold text-[#0F172A]">Vikram Mehra</td>
                      <td className="py-3 px-3 font-mono">HDFC • ACC-9004</td>
                      <td className="py-3 px-3 font-mono text-[#059669]">ABCPM9182F (Verified)</td>
                      <td className="py-3 px-3 font-mono text-rose-600 font-bold">869402049182910</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">99.4% Deterministic</span></td>
                      <td className="py-3 px-3 font-semibold text-rose-700">Origin Account Holder</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-bold text-[#0F172A]">Priya Sharma</td>
                      <td className="py-3 px-3 font-mono">ICICI • ACC-9019</td>
                      <td className="py-3 px-3 font-mono text-[#059669]">BKPPS8492K (Verified)</td>
                      <td className="py-3 px-3 font-mono text-rose-600 font-bold">869402049182910</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">99.4% Deterministic</span></td>
                      <td className="py-3 px-3 font-semibold text-amber-800">Layering Mule 1</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-bold text-[#0F172A]">Amit Verma</td>
                      <td className="py-3 px-3 font-mono">SBI • ACC-9042</td>
                      <td className="py-3 px-3 font-mono text-amber-600">ALMPV3910L (Mismatch)</td>
                      <td className="py-3 px-3 font-mono text-rose-600 font-bold">869402049182910</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">99.4% Deterministic</span></td>
                      <td className="py-3 px-3 font-semibold text-amber-800">Layering Mule 2</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-bold text-[#0F172A]">Ramesh Chawla</td>
                      <td className="py-3 px-3 font-mono">Axis • ACC-9088</td>
                      <td className="py-3 px-3 font-mono text-rose-600">CKHPC9281M (Suspended)</td>
                      <td className="py-3 px-3 font-mono text-rose-600 font-bold">869402049182910</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">99.4% Deterministic</span></td>
                      <td className="py-3 px-3 font-semibold text-purple-700">Circular Return Intermediary</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Hardware Fingerprint Resolution Finding:</strong> All 4 account credentials have logged into mobile banking exclusively from IMEI <code>869402049182910</code> (DEV-F8821), proving common beneficial control and ruling out independent retail transactions.
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Relationship Graph Construction (Cytoscape.js) */}
          {activeTab === 'graph' && (
            <div className="space-y-4 animate-in fade-in">
              <CytoscapeGraph networkId={networkId} />

              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-xs text-[#475569] space-y-2">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Cytoscape.js Graph Construction Analysis</span>
                </div>
                <p>
                  The graph topology demonstrates a classic <strong>Split-Disperse-Recombine (Mule Ring)</strong> architecture. Outward remittances of ₹5,00,000 each to ACC-9019 and ACC-9042 occurred within 18 minutes of credit, with ₹1,50,000 looped back to origin ACC-9004 from intermediary ACC-9088.
                </p>
              </div>
            </div>
          )}

          {/* STAGE 3: Anomaly Identification */}
          {activeTab === 'anomalies' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Stage 3: Anomaly Detection Engine Results</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Statistical outliers identified against normal 90-day baseline activity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      ANOM-01 • HIGH IMPACT
                    </span>
                    <span className="font-mono font-bold text-rose-700">+10 Risk Pts</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Rapid Fund Velocity Funnel</h4>
                  <p className="text-xs text-[#475569]">
                    98% of inward credit (₹9,80,000 of ₹10,00,000) was evacuated within 18 minutes. Normal retail holding time is 7.4 days.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      ANOM-02 • CRITICAL IMPACT
                    </span>
                    <span className="font-mono font-bold text-rose-700">+50 Risk Pts</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Android Emulator Sandbox Environment</h4>
                  <p className="text-xs text-[#475569]">
                    Device reports <code>ro.kernel.qemu=1</code>, static null accelerometer vectors, and hooked Goldfish drivers indicating virtual machine execution.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      ANOM-03 • HIGH IMPACT
                    </span>
                    <span className="font-mono font-bold text-amber-800">+20 Risk Pts</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Tor / VPN Network Obfuscation</h4>
                  <p className="text-xs text-[#475569]">
                    Origin IP 185.220.101.45 verified as M247 European Tor Exit relay, masquerading local domestic Indian retail banking session.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      ANOM-04 • SYNDICATE IMPACT
                    </span>
                    <span className="font-mono font-bold text-rose-700">+15 Risk Pts</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Circular Layering Return Loop</h4>
                  <p className="text-xs text-[#475569]">
                    ₹1,50,000 returned to Vikram Mehra (ACC-9004) from intermediary Ramesh Chawla (ACC-9088), completing a circular round-tripping circuit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: Transaction-Pattern Reasoning */}
          {activeTab === 'reasoning' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#2563EB]" />
                  <span>Stage 4: Transaction-Pattern Reasoning & Money Trail Reconstruction</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Chronological reconstruction of fund hops across network nodes.
                </p>
              </div>

              {/* Step by Step Flow */}
              <div className="space-y-4">
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#2563EB]">HOP 0 • OCT 28, 04:12 IST</span>
                    <h5 className="font-bold text-sm text-[#0F172A]">Inward Influx ₹10,00,000</h5>
                    <p className="text-xs text-[#64748B]">External Wire deposit credited into Vikram Mehra (ACC-9004).</p>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#0F172A]">₹10,00,000</span>
                </div>

                <div className="flex justify-center -my-2">
                  <span className="w-0.5 h-6 bg-[#CBD5E1]" />
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-800">HOP 1 • OCT 28, 04:26 IST (14 MINS LATENCY)</span>
                    <h5 className="font-bold text-sm text-[#0F172A]">Fund Split to Layering Accounts</h5>
                    <p className="text-xs text-[#64748B]">₹5,00,000 to Priya Sharma (ACC-9019) & ₹5,00,000 to Amit Verma (ACC-9042).</p>
                  </div>
                  <span className="font-mono font-bold text-sm text-amber-800">₹10,00,000 Outflow</span>
                </div>

                <div className="flex justify-center -my-2">
                  <span className="w-0.5 h-6 bg-[#CBD5E1]" />
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-700">HOP 2 • OCT 28, 04:31 IST</span>
                    <h5 className="font-bold text-sm text-[#0F172A]">Liquidation & Circular Recombine</h5>
                    <p className="text-xs text-[#64748B]">₹3,50,000 spent at Zaveri Bullion (MER-301) + ₹1,50,000 returned to Vikram Mehra (ACC-9004).</p>
                  </div>
                  <span className="font-mono font-bold text-sm text-rose-700">₹1,50,000 Recombination</span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: AI Hypothesis Generation */}
          {activeTab === 'hypothesis' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#059669]" />
                  <span>Stage 5: Multi-Agent AI Hypothesis Synthesis</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Autonomous forensic hypothesis formulated by the Lead Forensic Agent.
                </p>
              </div>

              {/* LangGraph Agent Input/Output State */}
              <div className="bg-[#0F172A] text-slate-100 p-3.5 rounded-xl border border-slate-700 text-xs font-mono space-y-1.5 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-400 flex items-center gap-1.5">
                    <span>⚖️</span>
                    <span>AGENT NODE: Prosecution Typology Reasoner</span>
                  </span>
                  <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono border border-slate-700">
                    Tool: detect_structuring_and_velocity
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400">Agent Input: </span>
                  <span>Ego-subgraph for {investigationData.seed_id} + Ledger velocity logs + Device Farm Swarms</span>
                </div>
                <div className="text-[11px] text-red-300">
                  <span className="text-slate-400">Agent Output: </span>
                  <span>Typology: {investigationData.prosecution?.crime_typology || 'MULE_RING_STRUCTURING_AND_PASS_THROUGH'} (Confidence: {((investigationData.prosecution?.prosecution_confidence || 0.94) * 100).toFixed(0)}%)</span>
                </div>
              </div>

              <div className="p-5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#059669] text-white">
                    Primary Forensic Indictment ({((investigationData.prosecution?.prosecution_confidence || 0.94) * 100).toFixed(0)}% Confidence)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#065F46]">31 U.S.C. 5324 VIOLATION</span>
                </div>

                <h4 className="text-sm font-bold text-[#065F46]">
                  Syndicate-Orchestrated Money Mule Ring with Hardware Virtualization
                </h4>

                <p className="text-xs text-[#065F46] leading-relaxed">
                  The evidence overwhelmingly demonstrates that Account ACC-9004 serves as a conduit account in a professional money mule network. Transactions were executed from an Android Emulator (DEV-F8821) routed through European VPN infrastructure to intentionally evade geographic IP velocity checks. Funds were distributed across 2 secondary mule accounts to purchase physical gold bullion, while a 15% kickback commission (₹1,50,000) was returned to origin.
                </p>
              </div>
            </div>
          )}

          {/* STAGE 6: Evidence Gathering */}
          {activeTab === 'evidence' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#059669]" />
                  <span>Stage 6: Cryptographic Evidence Discovery</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Tamper-evident logs extracted for law enforcement & regulatory court submission.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'EVD-101', type: 'Core Banking Switch Packet', desc: 'Wire settlement log TXN-88041 with HMAC-SHA256 timestamp signature.', hash: '0x992b1a...48fa' },
                  { id: 'EVD-102', type: 'Hardware VM Fingerprint', desc: 'Android build.prop containing ro.kernel.qemu=1 and static sensor report.', hash: '0x8841fa...20bd' },
                  { id: 'EVD-103', type: 'Tor Exit Node Relay Log', desc: 'Confirmed routing from 185.220.101.45 at timestamp 2026-10-28 04:12 IST.', hash: '0x773da2...91aa' },
                  { id: 'EVD-104', type: 'Merchant Bullion POS Receipt', desc: 'Invoice #ZB-2026-9921 for ₹3,50,000 gold bullion liquidation.', hash: '0x551bc9...38cc' }
                ].map(evd => (
                  <div key={evd.id} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0F172A]">{evd.id}</span>
                        <span className="font-bold text-[#059669]">{evd.type}</span>
                      </div>
                      <p className="text-[#64748B] mt-0.5">{evd.desc}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#94A3B8]">{evd.hash}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 7: Alternative Explanations */}
          {activeTab === 'alternatives' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  <span>Stage 7: Alternative Explanations & Counter-Hypothesis Analysis</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Rigorous testing of non-malicious business explanations to avoid false positives.
                </p>
              </div>

              {/* LangGraph Agent Input/Output State */}
              <div className="bg-[#0F172A] text-slate-100 p-3.5 rounded-xl border border-slate-700 text-xs font-mono space-y-1.5 shadow-xs mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-400 flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>AGENT NODE: Devil's Advocate (Defense Counsel)</span>
                  </span>
                  <span className="text-[10px] bg-slate-800 text-purple-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                    Tool: evaluate_benign_business_context
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400">Agent Input: </span>
                  <span>Prosecution Indictment + Scheduled Corporate Payroll + University Campus Wi-Fi NAT</span>
                </div>
                <div className="text-[11px] text-emerald-300">
                  <span className="text-slate-400">Agent Output: </span>
                  <span>Innocent Plausibility: {((investigationData.defense?.innocent_plausibility || 0.15) * 100).toFixed(0)}% • Rebuttal: {investigationData.defense?.counter_theory || 'Activity ungrounded in commercial records'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white border border-[#CBD5E1] rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#0F172A]">Hypothesis Alt-1: Legitimate Corporate Vendor Settlement</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold text-[10px]">REJECTED (&lt;3% Probability)</span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    Rebuttal: Corporate settlements do not loop back funds (₹1,50,000 return to sender) or execute from rooted Android emulators running Tor clients.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#CBD5E1] rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#0F172A]">Hypothesis Alt-2: Shared Co-Working Space Wi-Fi Collateral</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold text-[10px]">REJECTED (&lt;1% Probability)</span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    Rebuttal: The link between all 4 accounts is not a shared IP address, but a unique hardware terminal IMEI (869402049182910) signing identical mobile banking sessions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 8: Confidence Scoring Breakdown */}
          {activeTab === 'scoring' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
                  <span>Stage 8: Transparent Confidence Scoring & Mathematical Audit Matrix</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Complete breakdown of how the final risk score of 95 was calculated.
                </p>
              </div>

              {/* Exact Formula Table */}
              <div className="space-y-2">
                {[
                  { factor: 'Base Account Velocity', category: 'Baseline', points: '+10', desc: 'Standard baseline retail transactional velocity rate.' },
                  { factor: 'VPN / Tor Exit Proxy (185.220.101.45)', category: 'Infrastructure', points: '+20', desc: 'Commercial anonymizer masking domestic Indian retail session.' },
                  { factor: 'Virtualized Android Emulator (DEV-F8821)', category: 'Terminal Risk', points: '+50', desc: 'QEMU virtual machine environment running automated script hooks.' },
                  { factor: 'Circular Mule Layering Pattern', category: 'Graph Topology', points: '+15', desc: '₹1.5L returned to origin account through secondary intermediary.' },
                  { factor: 'Rapid Outflow Speed (<18 mins)', category: 'Velocity Spike', points: '+10', desc: 'Immediate evacuation of 98% of inward credit volume.' },
                  { factor: 'KYC Document Validation Dampener', category: 'Mitigation', points: '-10', desc: 'PAN Card validation on file partially mitigates synthetic identity risk.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#0F172A]">{item.factor}</div>
                      <div className="text-[11px] text-[#64748B]">{item.desc}</div>
                    </div>
                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-white border border-[#CBD5E1] text-[#0F172A]">
                      {item.points}
                    </span>
                  </div>
                ))}

                <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center justify-between font-bold text-[#065F46] mt-4">
                  <div>
                    <span className="text-sm">Final Cumulative Risk Score</span>
                    <span className="text-xs block text-[#059669] font-normal">Calculated by NEXUS Forensic Intelligence Model</span>
                  </div>
                  <div className="text-2xl font-mono">95 / 100 [CRITICAL]</div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 9: Investigation Narrative */}
          {activeTab === 'narrative' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Stage 9: Regulatory Investigation Narrative & STR Filing</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Formal regulatory disclosure draft compliant with FIU-IND and PMLA 2002 guidelines.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-4 text-xs text-[#334155] leading-relaxed font-mono">
                <div>
                  <span className="font-bold text-[#0F172A] block uppercase">1. Case Subject & Classification:</span>
                  <span>Primary Subject: Vikram Mehra | Account: HDFC 5010049281 (ACC-9004) | Classification: Organized Mule Syndicate / Circular Layering.</span>
                </div>

                <div>
                  <span className="font-bold text-[#0F172A] block uppercase">2. Executive Summary of Detected Activity:</span>
                  <span>On October 28, 2026, inward remittance of ₹10,00,000 was split within 18 minutes into two downstream accounts (Priya Sharma: ACC-9019, Amit Verma: ACC-9042). All operations originated from virtualized emulator terminal DEV-F8821 routed via Tor exit relay 185.220.101.45. A circular refund of ₹1,50,000 was returned to source via intermediary ACC-9088.</span>
                </div>

                <div>
                  <span className="font-bold text-[#0F172A] block uppercase">3. Recommended Statutory Enforcement Actions:</span>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-[#0F172A]">
                    <li>Place immediate debit freeze on Account ACC-9004, ACC-9019, and ACC-9042.</li>
                    <li>Blacklist hardware IMEI 869402049182910 across all participating CBS nodes.</li>
                    <li>Submit Suspicious Transaction Report (STR) Form-A to FIU-IND under PMLA Category ML-CIRCULAR.</li>
                  </ul>
                </div>
              </div>

              {/* Digital Sign-off Block */}
              <div className="p-4 bg-white border border-[#CBD5E1] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Lead AML Investigator Approval</span>
                  <span className="text-[11px] text-[#64748B]">
                    {isSignedOff ? 'Digitally Signed & Validated with Token 0x8892FA109B3' : 'Awaiting Senior AML Officer Digital Signature'}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {remediationMsg && (
                    <span className="text-[11px] font-mono text-emerald-600 font-semibold">{remediationMsg}</span>
                  )}
                  <button
                    onClick={handleExecuteRemediation}
                    disabled={isSignedOff}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSignedOff
                        ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSignedOff ? 'Interdiction Executed & Signed' : `Execute ${investigationData.adjudication?.recommended_action || 'FREEZE_ACCOUNT'} ➔`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Forensic Assistant (Interactive Copilot) */}
        {isAssistantOpen && (
          <div className="lg:col-span-4 sticky top-4">
            <AIForensicAssistant
              transactionId={transactionId}
              riskScore={95}
              customerName="Vikram Mehra"
              amount="₹10,00,000"
              onClose={() => setIsAssistantOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
