import React from 'react';
import {
  Activity, ShieldAlert, Users, TrendingUp, AlertTriangle,
  ArrowUpRight, ExternalLink, ChevronRight,
  Network, Cpu
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid
} from 'recharts';
import { SUSPICIOUS_NETWORKS, formatINR } from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface OverviewPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

const TREND_DATA = [
  { day: 'Day 1', networks: 18, flaggedVolume: 2.1 },
  { day: 'Day 5', networks: 21, flaggedVolume: 2.8 },
  { day: 'Day 10', networks: 19, flaggedVolume: 3.4 },
  { day: 'Day 15', networks: 26, flaggedVolume: 4.2 },
  { day: 'Day 20', networks: 29, flaggedVolume: 5.6 },
  { day: 'Day 25', networks: 33, flaggedVolume: 6.9 },
  { day: 'Day 30', networks: 38, flaggedVolume: 8.4 },
];

const RISK_DONUT = [
  { name: 'Critical (Score 85-100)', value: 9, color: '#EF4444' },
  { name: 'High (Score 70-84)', value: 14, color: '#F59E0B' },
  { name: 'Medium (Score 50-69)', value: 11, color: '#06B6D4' },
  { name: 'Low (Score <50)', value: 4, color: '#00D06C' },
];

const CATEGORY_BARS = [
  { category: 'VPN / Proxy Anomalies', count: 28 },
  { category: 'Rapid Fund Movement', count: 24 },
  { category: 'Mule Account Networks', count: 19 },
  { category: 'Shared Device Activity', count: 16 },
  { category: 'Circular Transactions', count: 12 },
  { category: 'Emulator Activity', count: 8 },
];

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const recentCases = SUSPICIOUS_NETWORKS.slice(0, 5);
  const featuredNetworks = [
    SUSPICIOUS_NETWORKS[0], // NET-004
    SUSPICIOUS_NETWORKS[1], // NET-012
    SUSPICIOUS_NETWORKS[4], // NET-018
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Financial Intelligence Overview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0D2619] text-[#00D06C] border border-[#00D06C]/30 font-mono">
              Live Monitor
            </span>
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Monitor suspicious financial networks and ongoing investigations across connected institutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('detection-center')}
            className="px-3.5 py-2 rounded-lg bg-[#131715] hover:bg-[#161C19] text-gray-200 border border-[#1C2420] text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>View All Detections</span>
          </button>
          <button
            onClick={() => onNavigate('investigation-workspace', { networkId: 'NET-004' })}
            className="px-4 py-2 rounded-lg bg-[#00D06C] hover:bg-[#05B860] text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/25 transition-all"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Launch Active Investigation</span>
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#131715] p-4 rounded-xl border border-[#1C2420] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Total Transactions</span>
            <div className="w-8 h-8 rounded-lg bg-[#0D2619] border border-[#00D06C]/30 flex items-center justify-center text-[#00D06C]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">24,856</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#00D06C] font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#131715] p-4 rounded-xl border border-[#1C2420] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Suspicious Networks</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-2">38</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-rose-400 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+4 discovered this week</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#131715] p-4 rounded-xl border border-[#1C2420] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Active Investigations</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">16</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-400 font-semibold">
            <AlertTriangle className="w-3 h-3" />
            <span>6 critical priority</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#131715] p-4 rounded-xl border border-[#1C2420] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">High-Risk Entities</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">124</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-400 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18 identified in graph</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-[#131715] p-4 rounded-xl border border-[#1C2420] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Flagged Volume</span>
            <div className="w-8 h-8 rounded-lg bg-[#0D2619] border border-[#00D06C]/30 flex items-center justify-center text-[#00D06C]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#00D06C] mt-2">₹8.4 Cr</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#00D06C] font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+₹1.2 Cr in last 30d</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart A: Suspicious Network Trends */}
        <div className="lg:col-span-2 bg-[#131715] p-5 rounded-xl border border-[#1C2420] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2420]">
            <div>
              <h2 className="text-sm font-bold text-white">Suspicious Network Trends (30 Days)</h2>
              <p className="text-xs text-[#9CA3AF]">Cumulative networks detected and associated transaction exposure.</p>
            </div>
            <span className="text-xs font-mono text-[#00D06C] font-semibold bg-[#0D2619] px-2 py-1 rounded border border-[#00D06C]/30">
              38 Networks (₹8.4 Cr)
            </span>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D06C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D06C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2420" vertical={false} />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D110F', borderColor: '#1C2420', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
                <Area type="monotone" dataKey="networks" stroke="#00D06C" strokeWidth={2.5} fillOpacity={1} fill="url(#networkGradient)" name="Suspicious Networks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Risk Distribution */}
        <div className="bg-[#131715] p-5 rounded-xl border border-[#1C2420] shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-[#1C2420]">
            <h2 className="text-sm font-bold text-white">Risk Distribution</h2>
            <p className="text-xs text-[#9CA3AF]">Active network classification by threat severity.</p>
          </div>

          <div className="h-48 mt-2 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DONUT}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={4}
                >
                  {RISK_DONUT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0D110F" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D110F', borderColor: '#1C2420', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1C2420]">
            {RISK_DONUT.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#D1D5DB] truncate">{item.name.split(' ')[0]}:</span>
                <span className="font-mono text-white font-bold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Detection Categories Bar Chart & Recently Discovered Networks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart C: Detection Categories Horizontal Bars */}
        <div className="lg:col-span-2 bg-[#131715] p-5 rounded-xl border border-[#1C2420] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2420]">
            <div>
              <h2 className="text-sm font-bold text-white">Detection Categories Breakdown</h2>
              <p className="text-xs text-[#9CA3AF]">Suspicious topology patterns and anomaly triggers.</p>
            </div>
            <button
              onClick={() => onNavigate('detection-center')}
              className="text-xs text-[#00D06C] hover:text-[#05B860] font-semibold flex items-center gap-1"
            >
              <span>View Rule Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={CATEGORY_BARS}
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2420" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={11} />
                <YAxis type="category" dataKey="category" stroke="#9CA3AF" fontSize={11} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D110F', borderColor: '#1C2420', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#00D06C" radius={[0, 4, 4, 0]} name="Triggered Networks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* E. Recently Discovered Networks (3 Compact Cards) */}
        <div className="bg-[#131715] p-5 rounded-xl border border-[#1C2420] shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-[#1C2420]">
            <h2 className="text-sm font-bold text-white">Recently Discovered Networks</h2>
            <p className="text-xs text-[#9CA3AF]">Top prioritized clusters requiring investigator intervention.</p>
          </div>

          <div className="space-y-3 mt-3 flex-1 flex flex-col justify-around">
            {featuredNetworks.map(net => (
              <div
                key={net.id}
                onClick={() => onNavigate('investigation-workspace', { networkId: net.id })}
                className="p-3 bg-[#08090A] hover:bg-[#161C19] border border-[#1C2420] hover:border-[#00D06C]/50 rounded-lg cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00D06C]">{net.id}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        net.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {net.riskScore}/100 {net.riskLevel}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{formatINR(net.totalVolume)}</span>
                </div>

                <div className="text-xs font-semibold text-gray-200 mt-1.5 truncate group-hover:text-white">
                  {net.name}
                </div>
                <div className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                  {net.detectionSignals[0]}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('network-intelligence')}
            className="w-full mt-3 py-2 bg-[#161C19] hover:bg-[#0D2619] text-[#00D06C] rounded text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#00D06C]/30 transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Open Network Graph Explorer</span>
          </button>
        </div>
      </div>

      {/* Row 4: Recent Investigations Table */}
      <div className="bg-[#131715] rounded-xl border border-[#1C2420] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#1C2420] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Investigations</h2>
            <p className="text-xs text-[#9CA3AF]">Active intelligence dossiers pending review and escalation.</p>
          </div>
          <button
            onClick={() => onNavigate('case-management')}
            className="text-xs text-[#00D06C] hover:text-[#05B860] font-semibold flex items-center gap-1"
          >
            <span>All Cases ({SUSPICIOUS_NETWORKS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D110F] text-[#9CA3AF] font-semibold border-b border-[#1C2420]">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Network ID</th>
                <th className="py-3 px-4">Detection Pattern</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Flagged Volume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Investigator</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2420]">
              {recentCases.map(item => (
                <tr key={item.id} className="hover:bg-[#161C19] transition-colors group">
                  <td className="py-3.5 px-4 font-mono font-medium text-white">{item.caseId}</td>
                  <td className="py-3.5 px-4 font-mono text-[#00D06C] font-semibold">{item.id}</td>
                  <td className="py-3.5 px-4 text-gray-300 max-w-xs truncate">{item.detectionPattern}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.riskScore >= 85
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.riskScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">{formatINR(item.totalVolume)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#0D2619] text-[#34D399] border border-[#00D06C]/30 font-medium">
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">{item.assignedInvestigator}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate('investigation-workspace', { networkId: item.id })}
                      className="px-3 py-1 rounded bg-[#0D2619] hover:bg-[#00D06C] text-[#00D06C] hover:text-black border border-[#00D06C]/40 text-[11px] font-bold transition-all inline-flex items-center gap-1"
                    >
                      <span>Investigate</span>
                      <ExternalLink className="w-3 h-3" />
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
