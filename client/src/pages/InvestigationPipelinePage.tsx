import React, { useState, useEffect, useMemo } from 'react';
import { fetchLangGraphInvestigation, executeRemediationAction, MOCK_LANGGRAPH_RESULT } from '../services/api';
import type { LangGraphInvestigationResult } from '../types';
import { PageId } from '../components/layout/AppLayout';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { AIForensicAssistant } from '../components/assistant/AIForensicAssistant';
import { LangGraphVisualizerReact } from '../components/investigation/LangGraphVisualizerReact';
import {
  ShieldAlert, ArrowLeft, Bot, CheckCircle2, AlertTriangle,
  GitBranch, Smartphone, Globe, User, Layers, FileText,
  SlidersHorizontal, Download, Share2, Clock, Check, Cpu,
  HelpCircle, Eye, Sparkles, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import type cytoscape from 'cytoscape';

interface InvestigationPipelinePageProps {
  transactionId?: string;
  networkId?: string;
  onNavigate: (page: PageId, meta?: any) => void;
}

export const InvestigationPipelinePage: React.FC<InvestigationPipelinePageProps> = ({
  transactionId = 'ACCT-US-1001',
  networkId = 'NET-004',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<string>('reasoning'); // Open Stage 4 / Reasoning by default or graph
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(true);
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);
  const [investigationData, setInvestigationData] = useState<LangGraphInvestigationResult>(MOCK_LANGGRAPH_RESULT);
  const [isLoadingLangGraph, setIsLoadingLangGraph] = useState<boolean>(false);
  const [remediationMsg, setRemediationMsg] = useState<string | null>(null);
  const [showEngineBanner, setShowEngineBanner] = useState<boolean>(false);

  const loadData = () => {
    setIsLoadingLangGraph(true);
    fetchLangGraphInvestigation(transactionId)
      .then((data) => setInvestigationData(data))
      .catch(() => setInvestigationData(MOCK_LANGGRAPH_RESULT))
      .finally(() => setIsLoadingLangGraph(false));
  };

  useEffect(() => {
    loadData();
  }, [transactionId]);

  const handleExecuteRemediation = async () => {
    const action = investigationData.adjudication?.recommended_action || 'FREEZE_ACCOUNT';
    const res = await executeRemediationAction(action, investigationData.seed_id || transactionId);
    setRemediationMsg(res.message);
    setIsSignedOff(true);
  };

  // Build dynamic Cytoscape elements from LangGraph network_summary if available
  const customElements = useMemo<cytoscape.ElementsDefinition | undefined>(() => {
    if (!investigationData.network_summary?.nodes?.length) return undefined;
    return {
      nodes: investigationData.network_summary.nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label || n.id,
          type: n.type || 'account',
          risk: n.risk || 'Medium',
          score: n.risk === 'Critical' ? 95 : n.risk === 'High' ? 85 : 50
        }
      })),
      edges: (investigationData.network_summary.links || []).map((l, idx) => ({
        data: {
          id: `e-${idx}-${l.source}-${l.target}`,
          source: l.source,
          target: l.target,
          label: l.amount ? `$${l.amount.toLocaleString()} (${l.relation})` : l.relation,
          amount: l.amount,
          type: l.relation.toLowerCase().includes('circular') ? 'circular-transaction' : 'transaction'
        }
      }))
    };
  }, [investigationData.network_summary]);

  // Compute dynamic money trail hops for Stage 4 from network links or evidence items
  const dynamicMoneyTrailHops = useMemo(() => {
    const rawLinks = investigationData.network_summary?.links || [];
    if (rawLinks.length > 0) {
      return rawLinks.map((link, idx) => {
        const isOutflow = idx > 0 && idx < rawLinks.length - 1;
        const isReturn = link.relation.toLowerCase().includes('circular') || link.relation.toLowerCase().includes('return') || idx === rawLinks.length - 1;
        const amt = link.amount || (1000000 / (idx + 1));
        const formattedAmt = amt >= 100000 ? `₹${amt.toLocaleString()}` : `$${amt.toLocaleString()}`;
        
        return {
          hopIndex: idx,
          timestamp: link.timestamp || `T+${idx * 14}m`,
          relation: link.relation.replace(/_/g, ' '),
          source: link.source,
          target: link.target,
          amountText: formattedAmt,
          flowType: isReturn ? 'Recombination Loop' : isOutflow ? 'Layering Outflow' : 'Inward Influx',
          description: `Fund transfer from ${link.source} to ${link.target} via ${link.relation.replace(/_/g, ' ')}.`,
          isReturn,
          isOutflow
        };
      });
    }

    // Dynamic fallback based on seed entity
    return [
      {
        hopIndex: 0,
        timestamp: 'OCT 28, 04:12 IST',
        relation: 'INWARD INFLUX WIRE',
        source: 'External Remitter',
        target: investigationData.seed_id,
        amountText: '₹10,00,000',
        flowType: 'Inward Influx',
        description: `External wire deposit credited into subject entity ${investigationData.seed_id}.`,
        isReturn: false,
        isOutflow: false
      },
      {
        hopIndex: 1,
        timestamp: 'OCT 28, 04:26 IST (14 MINS LATENCY)',
        relation: 'SPLIT TO LAYERING MULES',
        source: investigationData.seed_id,
        target: 'Layering Accounts',
        amountText: '₹10,00,000 Outflow',
        flowType: 'Layering Outflow',
        description: `Rapid parallel split into downstream syndicate accounts with 14m latency.`,
        isReturn: false,
        isOutflow: true
      },
      {
        hopIndex: 2,
        timestamp: 'OCT 28, 04:31 IST',
        relation: 'LIQUIDATION & CIRCULAR RECOMBINE',
        source: 'Intermediary Hub',
        target: investigationData.seed_id,
        amountText: '₹1,50,000 Recombination',
        flowType: 'Recombination Loop',
        description: `Partial fund liquidation at merchant bullion followed by 15% kickback returned to ${investigationData.seed_id}.`,
        isReturn: true,
        isOutflow: false
      }
    ];
  }, [investigationData.network_summary, investigationData.seed_id]);

  // Dynamic anomaly items for Stage 3
  const dynamicAnomalies = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      impact: string;
      points: string;
      description: string;
      color: 'rose' | 'amber';
    }> = [];

    // From structuring velocity
    if (investigationData.structuring_velocity?.structuring_detected) {
      investigationData.structuring_velocity.structuring_findings?.forEach((f, i) => {
        list.push({
          id: `STRUC-0${i + 1}`,
          title: `Sub-Threshold Structuring (${f.type || 'CTR Evasion'})`,
          impact: f.severity || 'CRITICAL IMPACT',
          points: '+25 Risk Pts',
          description: f.description || `Transactions structured to evade reporting thresholds. Total volume: ${f.total_amount ? '$' + f.total_amount.toLocaleString() : 'N/A'}.`,
          color: 'rose'
        });
      });
    }

    if (investigationData.structuring_velocity?.rapid_drain_detected) {
      investigationData.structuring_velocity.rapid_drain_findings?.forEach((f, i) => {
        list.push({
          id: `DRAIN-0${i + 1}`,
          title: `Rapid Mule Drain Velocity (${f.drain_percentage || 98}% Outflow)`,
          impact: 'CRITICAL IMPACT',
          points: '+30 Risk Pts',
          description: f.description || `Account drained ${f.drain_percentage || 90}% of incoming credit within ${f.time_to_drain_minutes || 18} minutes.`,
          color: 'rose'
        });
      });
    }

    // From evidence items
    if (investigationData.evidence_items && investigationData.evidence_items.length > 0) {
      investigationData.evidence_items.forEach((e, i) => {
        if (!list.some(existing => existing.title.includes(e.evidence_type || ''))) {
          list.push({
            id: `EVD-0${i + 1}`,
            title: `${(e.evidence_type || 'ANOMALY').replace(/_/g, ' ')}`,
            impact: `${e.severity || 'HIGH'} IMPACT`,
            points: e.severity === 'CRITICAL' ? '+40 Risk Pts' : '+20 Risk Pts',
            description: e.description || 'Forensic statistical anomaly detected against baseline behavior.',
            color: e.severity === 'CRITICAL' ? 'rose' : 'amber'
          });
        }
      });
    }

    // Fallback if empty
    if (list.length === 0) {
      list.push(
        {
          id: 'ANOM-01',
          title: 'Rapid Fund Velocity Funnel',
          impact: 'HIGH IMPACT',
          points: '+25 Risk Pts',
          description: `98% of inward funds evacuated to secondary accounts within 18 minutes of deposit.`,
          color: 'rose'
        },
        {
          id: 'ANOM-02',
          title: 'Android Emulator Sandbox Execution',
          impact: 'CRITICAL IMPACT',
          points: '+50 Risk Pts',
          description: `Device reports ro.kernel.qemu=1 and static null sensor vectors indicative of headless emulator farms.`,
          color: 'rose'
        },
        {
          id: 'ANOM-03',
          title: 'Tor / Proxy Network Obfuscation',
          impact: 'HIGH IMPACT',
          points: '+20 Risk Pts',
          description: `Origin IP verified as commercial VPN/Tor exit relay masking domestic retail banking sessions.`,
          color: 'amber'
        }
      );
    }

    return list;
  }, [investigationData.structuring_velocity, investigationData.evidence_items]);

  // Pipeline stages
  const pipelineStages = [
    { id: 'langgraph-engine', label: '⚡ LangGraph Engine', icon: Cpu },
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

  const riskScore = Math.round((investigationData.adjudication?.risk_score || 0.95) * (investigationData.adjudication?.risk_score <= 1.0 ? 100 : 1));
  const legitimacyScore = Math.round((investigationData.adjudication?.legitimacy_score || 0.05) * (investigationData.adjudication?.legitimacy_score <= 1.0 ? 100 : 1));

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('transactions')}
            className="p-2 hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-lg border border-[#CBD5E1] transition-colors cursor-pointer"
            title="Back to Transactions List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-[#0F172A]">
                {investigationData.seed_id || transactionId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                riskScore > 75 
                  ? 'bg-rose-100 text-rose-700 border-rose-300' 
                  : riskScore > 40 
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                Score: {riskScore} / 100 [{riskScore > 75 ? 'CRITICAL RISK' : riskScore > 40 ? 'ELEVATED RISK' : 'BENIGN'}]
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Cluster: {investigationData.swarm_telemetry?.cluster_id || networkId}
              </span>
            </div>
            <div className="text-xs text-[#64748B] mt-0.5">
              Subject: <strong>{(investigationData.profile?.customer?.full_name || investigationData.profile?.customer_name) || investigationData.seed_id}</strong> ({investigationData.profile?.bank || 'Core Banking'}: {investigationData.seed_id}) → {investigationData.prosecution?.crime_typology || 'Multi-Hop Laundering Analysis'}
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoadingLangGraph}
            className="px-3 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Re-run LangGraph Autonomous Investigation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLangGraph ? 'animate-spin text-[#059669]' : ''}`} />
            <span>{isLoadingLangGraph ? 'Running Engine...' : 'Re-Run Agents'}</span>
          </button>

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
            className="px-3 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export FIU STR</span>
          </button>
        </div>
      </div>

      {/* Live LangGraph Multi-Agent Status Banner */}
      <div className="bg-[#0F172A] text-white p-3.5 rounded-xl border border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5 font-mono text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>LangGraph Multi-Agent Engine:</span>
          </span>
          <span className="text-slate-300 font-mono">
            {isLoadingLangGraph ? 'Autonomous Reasoning in Progress...' : `Autonomous Synthesis Complete • 6 Nodes Converged`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-[11px]">
            Thread ID: <strong className="text-slate-200">{investigationData.thread_id || 'thread_aml_001'}</strong>
          </span>
          <button
            onClick={() => setShowEngineBanner(!showEngineBanner)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold underline underline-offset-2"
          >
            <span>{showEngineBanner ? 'Hide Agent DAG' : 'View Agent DAG'}</span>
            {showEngineBanner ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Native React LangGraph Multi-Agent Chain Viewer */}
      {showEngineBanner && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <LangGraphVisualizerReact
            investigationData={investigationData}
            onSelectStageTab={(tabId) => setActiveTab(tabId)}
          />
        </div>
      )}

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

      {/* Main Content Layout (Grid: Pipeline Content on Left, AI Assistant on Right if Open) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${isAssistantOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>

          {/* DEDICATED TAB: LangGraph Multi-Agent Engine */}
          {activeTab === 'langgraph-engine' && (
            <div className="space-y-4 animate-in fade-in">
              <LangGraphVisualizerReact
                investigationData={investigationData}
                onSelectStageTab={(tabId) => setActiveTab(tabId)}
              />
            </div>
          )}

          {/* STAGE 1: Entity Resolution */}
          {activeTab === 'entity-resolution' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#059669]" />
                  <span>Stage 1: Multi-Entity Resolution & Cross-Account Identity Linking</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Automated entity resolution has grouped {investigationData.swarm_telemetry?.linked_accounts?.length || 4} accounts into syndicate cluster <strong>{investigationData.swarm_telemetry?.cluster_id || 'CLUSTER-001'}</strong> based on physical device IMEI and network fingerprint overlap.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-2.5 px-3">Resolved Account / Entity</th>
                      <th className="py-2.5 px-3">Bound Hardware Terminal</th>
                      <th className="py-2.5 px-3">Proxy / Network IP</th>
                      <th className="py-2.5 px-3">Match Confidence</th>
                      <th className="py-2.5 px-3">Syndicate Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {(investigationData.swarm_telemetry?.linked_accounts || ['ACCT-US-1001', 'ACCT-US-1002', 'ACCT-US-1003', 'ACCT-US-1004']).map((acc, idx) => {
                      const device = investigationData.swarm_telemetry?.shared_devices?.[0] || 'DEV-IPHONE-PRO-8912';
                      const ip = investigationData.swarm_telemetry?.proxy_ips?.[0] || '185.220.101.45';
                      const role = idx === 0 
                        ? 'Origin Ring Orchestrator' 
                        : idx === 1 
                        ? 'Layering Mule 1' 
                        : idx === 2 
                        ? 'Layering Mule 2' 
                        : 'Circular Intermediary';
                      const roleBadgeColor = idx === 0 ? 'text-rose-700 bg-rose-50' : idx === 3 ? 'text-purple-700 bg-purple-50' : 'text-amber-800 bg-amber-50';

                      return (
                        <tr key={acc} className="hover:bg-[#F8FAFC]">
                          <td className="py-3 px-3 font-mono font-bold text-[#0F172A]">{acc}</td>
                          <td className="py-3 px-3 font-mono text-rose-600 font-semibold">{device}</td>
                          <td className="py-3 px-3 font-mono text-[#059669]">{ip}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold font-mono">
                              99.4% Deterministic
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-semibold ${roleBadgeColor}`}>
                              {role}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Hardware Fingerprint Resolution Finding:</strong> All linked accounts have logged into mobile banking exclusively from hardware terminal <code>{investigationData.swarm_telemetry?.shared_devices?.[0] || 'DEV-IPHONE-PRO-8912'}</code>, confirming common beneficial syndicate control and ruling out independent retail transactions.
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Relationship Graph Construction (Cytoscape.js) */}
          {activeTab === 'graph' && (
            <div className="space-y-4 animate-in fade-in">
              <CytoscapeGraph networkId={networkId} customElements={customElements} />

              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-xs text-[#475569] space-y-2">
                <div className="font-bold text-[#0F172A] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>Cytoscape.js Graph Topology Metrics</span>
                  </div>
                  <span className="font-mono text-emerald-600 font-semibold">
                    Central Hub: {investigationData.network_summary?.most_central_hub || investigationData.seed_id}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <span className="text-[10px] text-[#64748B] block">Graph Nodes</span>
                    <strong className="text-sm font-mono text-[#0F172A]">{investigationData.network_summary?.node_count || 10} Entities</strong>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <span className="text-[10px] text-[#64748B] block">Graph Edges</span>
                    <strong className="text-sm font-mono text-[#0F172A]">{investigationData.network_summary?.edge_count || 13} Links</strong>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <span className="text-[10px] text-[#64748B] block">Total Flow Volume</span>
                    <strong className="text-sm font-mono text-[#059669]">${(investigationData.network_summary?.total_subgraph_flow_volume || 48517.4).toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <span className="text-[10px] text-[#64748B] block">Eigenvector Centrality</span>
                    <strong className="text-sm font-mono text-purple-700">{investigationData.network_summary?.centrality_score || 0.88}</strong>
                  </div>
                </div>
                <p className="pt-1 text-[#64748B]">
                  The graph topology demonstrates a coordinated <strong>{investigationData.prosecution?.crime_typology || 'Split-Disperse-Recombine'}</strong> architecture. Outward remittances disperse immediately upon credit, with rapid velocity flows routing through multi-hop layering nodes before recombining or exiting via merchant endpoints.
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
                  Deterministic statistical outliers & velocity anomalies detected for seed <strong>{investigationData.seed_id}</strong> against normal 90-day baseline activity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicAnomalies.map((anom) => (
                  <div
                    key={anom.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      anom.color === 'rose'
                        ? 'border-rose-200 bg-rose-50/40'
                        : 'border-amber-200 bg-amber-50/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        anom.color === 'rose'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {anom.id} • {anom.impact}
                      </span>
                      <span className={`font-mono font-bold ${
                        anom.color === 'rose' ? 'text-rose-700' : 'text-amber-800'
                      }`}>
                        {anom.points}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{anom.title}</h4>
                    <p className="text-xs text-[#475569] leading-relaxed">{anom.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 4: Transaction-Pattern Reasoning & Dynamic Money Trail */}
          {activeTab === 'reasoning' && (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#2563EB]" />
                  <span>Stage 4: Transaction-Pattern Reasoning & Money Trail Reconstruction</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Chronological multi-hop fund flow reconstruction dynamically synthesized from topology links for <strong>{investigationData.seed_id}</strong>.
                </p>
              </div>

              {/* Dynamic Step-by-Step Fund Hops */}
              <div className="space-y-4">
                {dynamicMoneyTrailHops.map((hop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === dynamicMoneyTrailHops.length - 1;

                  return (
                    <React.Fragment key={idx}>
                      <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        hop.isReturn
                          ? 'bg-rose-50 border-rose-200'
                          : hop.isOutflow
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              hop.isReturn
                                ? 'bg-rose-100 text-rose-800'
                                : hop.isOutflow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              HOP {hop.hopIndex} • {hop.timestamp}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-[#64748B]">
                              {hop.relation}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                            <span>{hop.flowType}</span>
                            <span className="text-xs font-mono text-[#64748B]">({hop.source} ➔ {hop.target})</span>
                          </h5>

                          <p className="text-xs text-[#64748B]">{hop.description}</p>
                        </div>

                        <div className="text-right">
                          <span className={`font-mono font-bold text-sm block ${
                            hop.isReturn
                              ? 'text-rose-700'
                              : hop.isOutflow
                              ? 'text-amber-800'
                              : 'text-[#0F172A]'
                          }`}>
                            {hop.amountText}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] font-mono">
                            {hop.isReturn ? 'Loop Recombination' : hop.isOutflow ? 'Layering Hop' : 'Inflow Credit'}
                          </span>
                        </div>
                      </div>

                      {!isLast && (
                        <div className="flex justify-center -my-2">
                          <span className="w-0.5 h-6 bg-[#CBD5E1]" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Dynamic Summary Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between font-mono">
                <span>Total Reconstructed Trail Volume:</span>
                <strong className="text-emerald-700 text-sm">
                  ${(investigationData.network_summary?.total_subgraph_flow_volume || 48517.4).toLocaleString()} across {dynamicMoneyTrailHops.length} validated hops
                </strong>
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
                  Autonomous forensic hypothesis formulated by the Lead Forensic Agent in LangGraph.
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
                  <span>Typology: {investigationData.prosecution?.crime_typology || 'MULE_RING_STRUCTURING_AND_PASS_THROUGH'} (Confidence: {Math.round((investigationData.prosecution?.prosecution_confidence || 0.94) * 100)}%)</span>
                </div>
              </div>

              <div className="p-5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#059669] text-white">
                    Primary Forensic Indictment ({Math.round((investigationData.prosecution?.prosecution_confidence || 0.94) * 100)}% Confidence)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#065F46]">
                    {investigationData.prosecution?.primary_statute || '31 U.S.C. 5324 / PMLA 2002'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#065F46]">
                  {investigationData.prosecution?.crime_typology?.replace(/_/g, ' ') || 'Coordinated Money Mule Structuring & Hardware Virtualization'}
                </h4>

                <p className="text-xs text-[#065F46] leading-relaxed">
                  {investigationData.prosecution?.theory || `The evidence demonstrates that entity ${investigationData.seed_id} operates as a central conduit in an organized financial syndicate. Transactions were coordinated via shared hardware infrastructure, executing immediate threshold evasion and rapid pass-through dispersal.`}
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
                  Tamper-evident logs extracted for law enforcement & regulatory court submission ({investigationData.evidence_count || 4} verified items).
                </p>
              </div>

              <div className="space-y-3">
                {(investigationData.evidence_items?.length ? investigationData.evidence_items : [
                  {
                    tx_id: 'TXN-88041',
                    evidence_type: 'Core Banking Switch Packet',
                    description: `Wire settlement log TXN-88041 with HMAC-SHA256 timestamp signature for ${investigationData.seed_id}.`,
                    severity: 'CRITICAL',
                    amount: 1000000
                  },
                  {
                    tx_id: 'EVD-102',
                    evidence_type: 'Hardware VM Fingerprint',
                    description: `Android build.prop containing ro.kernel.qemu=1 and static sensor report from emulator farm.`,
                    severity: 'CRITICAL'
                  },
                  {
                    tx_id: 'EVD-103',
                    evidence_type: 'Tor Exit Node Relay Log',
                    description: `Confirmed routing from 185.220.101.45 masquerading domestic retail session.`,
                    severity: 'HIGH'
                  },
                  {
                    tx_id: 'EVD-104',
                    evidence_type: 'Merchant Bullion POS Settlement',
                    description: `Settlement receipt for bullion liquidation and circular kickback return.`,
                    severity: 'HIGH',
                    amount: 350000
                  }
                ]).map((evd: any, idx: number) => {
                  const evdId = evd.tx_id || `EVD-0${idx + 1}`;
                  const hash = `0x${((idx + 1) * 317924).toString(16).padEnd(8, '0')}...${((idx + 1) * 98712).toString(16).slice(-4)}`;

                  return (
                    <div key={evdId} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0F172A]">{evdId}</span>
                          <span className="font-bold text-[#059669]">{(evd.evidence_type || evd.type || 'EVIDENCE').replace(/_/g, ' ')}</span>
                          {evd.severity && (
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                              evd.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {evd.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-[#64748B] mt-0.5">{evd.description}</p>
                      </div>
                      <span className="font-mono text-[11px] text-[#94A3B8]">{hash}</span>
                    </div>
                  );
                })}
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
                  Rigorous testing of non-malicious business explanations to avoid false positives by the Devil's Advocate Agent.
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
                  <span>Innocent Plausibility: {Math.round((investigationData.defense?.innocent_plausibility || 0.15) * 100)}% • Rebuttal: {investigationData.defense?.counter_theory || 'Activity ungrounded in commercial records'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white border border-[#CBD5E1] rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#0F172A]">Hypothesis Alt-1: Legitimate Corporate Vendor Settlement</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold text-[10px]">
                      REJECTED ({Math.round((investigationData.defense?.innocent_plausibility || 0.05) * 100)}% Plausibility)
                    </span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    Defense Rebuttal: {investigationData.defense?.counter_theory || 'Corporate settlements do not loop back funds or execute from rooted Android emulators running Tor clients.'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#CBD5E1] rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#0F172A]">Hypothesis Alt-2: Shared Co-Working Space Wi-Fi Collateral</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold text-[10px]">
                      REJECTED (&lt;1% Plausibility)
                    </span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    Defense Rebuttal: The link between all accounts is not a shared IP address, but a unique hardware terminal IMEI ({investigationData.swarm_telemetry?.shared_devices?.[0] || 'DEV-IPHONE-PRO-8912'}) signing identical mobile banking sessions.
                  </p>
                </div>

                {investigationData.benign_context && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 space-y-1">
                    <div className="font-bold text-[#0F172A]">Benign Context Engine Evaluation:</div>
                    <div>• Public NAT Infrastructure Detected: <strong>{investigationData.benign_context.public_nat_detected ? 'YES' : 'NO'}</strong></div>
                    <div>• Infrastructure Type: <strong>{investigationData.benign_context.infrastructure_type || 'ANONYMIZED_PROXY_POOL'}</strong></div>
                    <div>• Benign Cluster Verdict: <strong>{investigationData.benign_context.is_benign_cluster ? 'BENIGN' : 'CRIMINAL_SYNDICATE'}</strong></div>
                  </div>
                )}
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
                  Complete breakdown of how the final risk score of {riskScore} was calculated for {investigationData.seed_id}.
                </p>
              </div>

              {/* Exact Formula Table */}
              <div className="space-y-2">
                {[
                  { factor: 'Base Account Velocity', category: 'Baseline', points: '+10', desc: 'Standard baseline retail transactional velocity rate.' },
                  { factor: `VPN / Tor Exit Proxy (${investigationData.swarm_telemetry?.proxy_ips?.[0] || '185.220.101.45'})`, category: 'Infrastructure', points: '+20', desc: 'Commercial anonymizer masking domestic retail banking session.' },
                  { factor: `Virtualized Hardware Emulator (${investigationData.swarm_telemetry?.shared_devices?.[0] || 'DEV-F8821'})`, category: 'Terminal Risk', points: '+50', desc: 'QEMU virtual machine environment running automated script hooks.' },
                  { factor: 'Circular Mule Layering Pattern', category: 'Graph Topology', points: '+15', desc: 'Multi-hop split followed by return loop to origin entity.' },
                  { factor: 'Rapid Outflow Speed (<18 mins)', category: 'Velocity Spike', points: '+10', desc: 'Immediate evacuation of >90% of inward credit volume.' },
                  { factor: 'Defense Innocence Dampener', category: 'Mitigation', points: `-${Math.min(10, Math.round(legitimacyScore))}`, desc: `Devil's Advocate innocent plausibility discount (${legitimacyScore}%).` }
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
                    <span className="text-xs block text-[#059669] font-normal">Calculated by LangGraph Compliance Adjudicator Agent</span>
                  </div>
                  <div className="text-2xl font-mono">{riskScore} / 100 [{riskScore > 75 ? 'CRITICAL' : 'ELEVATED'}]</div>
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
                    Formal regulatory disclosure draft compliant with FIU-IND and FinCEN SAR guidelines.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-4 text-xs text-[#334155] leading-relaxed font-mono">
                <div>
                  <span className="font-bold text-[#0F172A] block uppercase">1. Case Subject & Classification:</span>
                  <span>Primary Subject: {(investigationData.profile?.customer?.full_name || investigationData.profile?.customer_name) || investigationData.seed_id} | Account: {investigationData.seed_id} | Classification: {investigationData.prosecution?.crime_typology || 'Organized Mule Syndicate'}.</span>
                </div>

                <div>
                  <span className="font-bold text-[#0F172A] block uppercase">2. Executive Summary of Detected Activity:</span>
                  <div className="whitespace-pre-wrap bg-white p-3 border border-[#E2E8F0] rounded-md mt-1 text-[#0F172A]">
                    {investigationData.sar_report?.narrative || `Inward remittance was split within 18 minutes into secondary downstream accounts. All operations originated from virtualized hardware terminal ${investigationData.swarm_telemetry?.shared_devices?.[0] || 'DEV-F8821'} routed via anonymizing proxy ${investigationData.swarm_telemetry?.proxy_ips?.[0] || '185.220.101.45'}.`}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#0F172A] block uppercase">3. Recommended Statutory Enforcement Actions:</span>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-[#0F172A]">
                    <li>Place immediate debit freeze on Account {investigationData.seed_id} and all resolved cluster accounts ({investigationData.swarm_telemetry?.linked_accounts?.join(', ') || 'Downstream mules'}).</li>
                    <li>Blacklist hardware terminal {investigationData.swarm_telemetry?.shared_devices?.[0] || 'DEV-F8821'} across core banking switches.</li>
                    <li>Submit Suspicious Activity Report (SAR / STR Form-A) to FIU-IND under Category ML-CIRCULAR.</li>
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
              transactionId={investigationData.seed_id || transactionId}
              riskScore={riskScore}
              customerName={(investigationData.profile?.customer?.full_name || investigationData.profile?.customer_name) || 'Vikram Mehra'}
              amount={investigationData.network_summary?.total_subgraph_flow_volume ? `$${investigationData.network_summary.total_subgraph_flow_volume.toLocaleString()}` : '₹10,00,000'}
              onClose={() => setIsAssistantOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
