import React from 'react';
import { GitBranch, ShieldAlert, Cpu, ArrowRight, Download } from 'lucide-react';
import { MoneyTrailFlow } from '../components/moneytrail/MoneyTrailFlow';
import { PageId } from '../components/layout/AppLayout';

interface MoneyTrailPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const MoneyTrailPage: React.FC<MoneyTrailPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Money Trail Reconstruction</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Graph Flow Engine
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Trace how funds move across connected financial accounts, calculate inter-hop latency, and uncover layering rings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('investigation-workspace', { networkId: 'NET-004' })}
            className="px-4 py-2 bg-[#00D06C] hover:bg-[#05B860] text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/20 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Open in Investigation Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Flow Reconstruction */}
      <MoneyTrailFlow />
    </div>
  );
};
