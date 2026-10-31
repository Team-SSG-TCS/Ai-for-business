import React, { useState } from 'react';
import type { LangGraphInvestigationResult } from '../../types';
import {
  Cpu, Bot, ShieldCheck, Scale, Network, Zap,
  ChevronRight, CheckCircle2, Code2, Database,
  ArrowRight, ShieldAlert, FileText, Check
} from 'lucide-react';

interface LangGraphVisualizerReactProps {
  investigationData: LangGraphInvestigationResult;
  onSelectStageTab?: (tabId: string) => void;
}

export const LangGraphVisualizerReact: React.FC<LangGraphVisualizerReactProps> = ({
  investigationData,
  onSelectStageTab
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(2); // Default to Prosecution

  const nodes = [
    {
      id: 'triage',
      title: 'Triage & Resolution',
      agent: 'Lead Intake Agent',
      icon: Database,
      tool: 'resolve_cross_account_identities',
      stageTab: 'entity-resolution',
      status: 'COMPLETED',
      inputSummary: `Seed Identifier: ${investigationData.seed_id} (${investigationData.seed_type})`,
      outputSummary: `Resolved Syndicate Cluster: ${investigationData.swarm_telemetry?.cluster_id || 'CLUSTER-001'} (${investigationData.swarm_telemetry?.linked_accounts?.length || 4} accounts, ${investigationData.swarm_telemetry?.shared_devices?.length || 1} devices)`,
      stateSlice: {
        seed_id: investigationData.seed_id,
        seed_type: investigationData.seed_type,
        swarm_telemetry: investigationData.swarm_telemetry,
        profile: investigationData.profile
      }
    },
    {
      id: 'network',
      title: 'Graph Traversal',
      agent: 'Topology Forensics Agent',
      icon: Network,
      tool: 'extract_ego_subgraph',
      stageTab: 'graph',
      status: 'COMPLETED',
      inputSummary: `Seed Entity + 3-Hop Ego Graph Expansion around ${investigationData.seed_id}`,
      outputSummary: `Extracted ${investigationData.network_summary?.node_count || 10} nodes, ${investigationData.network_summary?.edge_count || 13} links with $${(investigationData.network_summary?.total_subgraph_flow_volume || 48517.4).toLocaleString()} total flow volume`,
      stateSlice: investigationData.network_summary
    },
    {
      id: 'prosecution',
      title: 'Prosecution Typology',
      agent: 'Forensic Prosecutor Agent',
      icon: Scale,
      tool: 'detect_structuring_and_velocity',
      stageTab: 'hypothesis',
      status: 'COMPLETED',
      inputSummary: `Ego-subgraph + Transaction Ledger + Structuring Band Matrix`,
      outputSummary: `Typology: ${investigationData.prosecution?.crime_typology || 'MULE_RING_STRUCTURING_AND_PASS_THROUGH'} (${Math.round((investigationData.prosecution?.prosecution_confidence || 0.94) * 100)}% Confidence)`,
      stateSlice: {
        prosecution: investigationData.prosecution,
        structuring_velocity: investigationData.structuring_velocity
      }
    },
    {
      id: 'defense',
      title: "Devil's Advocate",
      agent: 'Defense Counsel Agent',
      icon: ShieldCheck,
      tool: 'evaluate_benign_business_context',
      stageTab: 'alternatives',
      status: 'COMPLETED',
      inputSummary: `Indictment hypothesis + Corporate Payroll schedules + Campus Wi-Fi NAT logs`,
      outputSummary: `Innocent Plausibility: ${Math.round((investigationData.defense?.innocent_plausibility || 0.15) * 100)}% • Rebuttal: ${investigationData.defense?.counter_theory?.slice(0, 75)}...`,
      stateSlice: {
        defense: investigationData.defense,
        benign_context: investigationData.benign_context
      }
    },
    {
      id: 'adjudication',
      title: 'Compliance Adjudicator',
      agent: 'Senior Adjudication Agent',
      icon: Bot,
      tool: 'adjudicate_aml_risk',
      stageTab: 'scoring',
      status: 'COMPLETED',
      inputSummary: `Dialectical Debate (Prosecution vs. Defense) + Regulatory Risk Matrix`,
      outputSummary: `Risk Score: ${Math.round((investigationData.adjudication?.risk_score || 0.95) * 100)}/100 • Action: ${investigationData.adjudication?.recommended_action || 'FREEZE_ACCOUNT'}`,
      stateSlice: investigationData.adjudication
    },
    {
      id: 'interdiction',
      title: 'Interdiction & SAR',
      agent: 'Remediation Enforcement Agent',
      icon: Zap,
      tool: 'execute_remediation_interdiction',
      stageTab: 'narrative',
      status: 'READY',
      inputSummary: `Adjudication Decision (${investigationData.adjudication?.recommended_action || 'FREEZE_ACCOUNT'}) + Evidence Logs (${investigationData.evidence_count} items)`,
      outputSummary: `FIU-IND STR Narrative Generated • Enforcement: ${investigationData.remediation?.message || 'Ready for Automated Core Banking Interdiction'}`,
      stateSlice: {
        sar_report: investigationData.sar_report,
        remediation: investigationData.remediation,
        evidence_count: investigationData.evidence_count
      }
    }
  ];

  const activeNode = nodes[selectedNodeIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-white">
      {/* Visualizer Top Header */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>LangGraph Multi-Agent State Machine</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE CONVERGENCE
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Deterministic state transitions executing in real-time across 6 collaborative LLM agent roles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">
            Thread ID: <strong className="text-slate-200">{investigationData.thread_id || 'thread_aml_001'}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Seed: <strong className="text-emerald-400">{investigationData.seed_id}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Agent Flow Sequence (Horizontal Step DAG) */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = selectedNodeIndex === idx;
            const isLast = idx === nodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setSelectedNodeIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 min-w-[170px] ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Step {idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-200 truncate">{node.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{node.agent}</div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{node.tool}</span>
                  </div>
                </button>

                {!isLast && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & State Inspector */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Node Narrative & Execution Context */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {React.createElement(activeNode.icon, { className: 'w-4 h-4' })}
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-100">{activeNode.title}</h5>
                <p className="text-xs text-slate-400">{activeNode.agent}</p>
              </div>
            </div>

            {onSelectStageTab && (
              <button
                onClick={() => onSelectStageTab(activeNode.stageTab)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Jump to Stage View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <span>📥</span>
                <span>Agent Ingestion Inputs:</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">{activeNode.inputSummary}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <span>📤</span>
                <span>Agent Synthesis Output:</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">{activeNode.outputSummary}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Autonomous Tool Invoked:</span>
              <span className="text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {activeNode.tool}()
              </span>
            </div>
          </div>
        </div>

        {/* Live LangGraph State Slice JSON Viewer */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-3.5 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>State Slice: {activeNode.id}</span>
            </span>
            <span className="text-[10px] text-emerald-400">langgraph.channels.State</span>
          </div>

          <div className="max-h-56 overflow-y-auto pr-1 text-slate-300 text-[10px] leading-snug">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(activeNode.stateSlice, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
