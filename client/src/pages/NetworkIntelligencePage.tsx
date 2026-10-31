import React, { useState } from 'react';
import {
  Sparkles, ArrowRight
} from 'lucide-react';
import { NetworkGraph } from '../components/network/NetworkGraph';
import { SUSPICIOUS_NETWORKS } from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface NetworkIntelligencePageProps {
  onNavigate: (page: PageId, meta?: any) => void;
  selectedEntityId?: string | null;
}

export const NetworkIntelligencePage: React.FC<NetworkIntelligencePageProps> = ({
  onNavigate,
  selectedEntityId
}) => {
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('NET-004');
  const [activePreset, setActivePreset] = useState<'all' | 'mule' | 'emulator' | 'legitimate'>('mule');

  const activeNetwork = SUSPICIOUS_NETWORKS.find(n => n.id === selectedNetworkId) || SUSPICIOUS_NETWORKS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Financial Network Intelligence</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0D2619] text-[#00D06C] border border-[#00D06C]/30 font-mono">
              Graph Engine Active
            </span>
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Explore topological relationships between customers, accounts, devices, merchants, and transactions.
          </p>
        </div>

        {/* Quick Cluster Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSelectedNetworkId('NET-004'); setActivePreset('mule'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activePreset === 'mule'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-[#131715] text-[#9CA3AF] border-[#1C2420] hover:text-white'
            }`}
          >
            NET-004: Mule & Circular Ring
          </button>
          <button
            onClick={() => { setSelectedNetworkId('NET-012'); setActivePreset('emulator'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activePreset === 'emulator'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[#131715] text-[#9CA3AF] border-[#1C2420] hover:text-white'
            }`}
          >
            NET-012: Emulator Farm
          </button>
          <button
            onClick={() => { setSelectedNetworkId('NET-021'); setActivePreset('legitimate'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activePreset === 'legitimate'
                ? 'bg-[#0D2619] text-[#00D06C] border-[#00D06C]/50'
                : 'bg-[#131715] text-[#9CA3AF] border-[#1C2420] hover:text-white'
            }`}
          >
            NET-021: Benign Co-working Hub
          </button>
        </div>
      </div>

      {/* Primary Interactive Graph Visualization (70% width) + Details Panel (30% width) */}
      <NetworkGraph
        selectedEntityId={selectedEntityId}
        initialNetworkId={selectedNetworkId}
        onInvestigateNetwork={(netId) => onNavigate('investigation-workspace', { networkId: netId })}
      />

      {/* Bottom Insights Bar */}
      <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0D2619] border border-[#00D06C]/30 flex items-center justify-center text-[#00D06C] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Graph Topology Insight for {activeNetwork.id}</h4>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Identified 4 tightly-coupled accounts linked to a single hardware hash with zero human sensor jitter and rapid RTGS dispersion.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('investigation-workspace', { networkId: activeNetwork.id })}
          className="px-4 py-2 bg-[#00D06C] hover:bg-[#05B860] text-black rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg shadow-[#00D06C]/25 transition-all"
        >
          <span>Open Full Investigation Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
