import React, { useState, useEffect } from 'react';
import { PageId } from '../components/layout/AppLayout';
import {
  ShieldAlert, TrendingUp, AlertTriangle, Cpu, Layers,
  ArrowRight, ArrowUpRight, CheckCircle2, Clock, DollarSign,
  Activity, Users, Smartphone, Globe, CreditCard
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [recentUpload, setRecentUpload] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('forensic_recent_upload');
      if (stored) {
        setRecentUpload(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse recent upload', e);
    }
  }, []);
  // Chart Data: Hourly Transaction Volume & Flagged Anomalies
  const hourlyData = [
    { time: '00:00', totalVolume: 120, flaggedVolume: 8 },
    { time: '02:00', totalVolume: 80, flaggedVolume: 24 }, // Anomaly spike off-hours
    { time: '04:00', totalVolume: 140, flaggedVolume: 65 }, // Major syndicate trigger (NET-004)
    { time: '06:00', totalVolume: 320, flaggedVolume: 18 },
    { time: '08:00', totalVolume: 890, flaggedVolume: 12 },
    { time: '10:00', totalVolume: 1650, flaggedVolume: 35 },
    { time: '12:00', totalVolume: 2100, flaggedVolume: 42 },
    { time: '14:00', totalVolume: 1950, flaggedVolume: 28 },
    { time: '16:00', totalVolume: 2400, flaggedVolume: 51 },
    { time: '18:00', totalVolume: 2200, flaggedVolume: 39 },
    { time: '20:00', totalVolume: 1400, flaggedVolume: 22 },
    { time: '22:00', totalVolume: 600, flaggedVolume: 15 }
  ];

  // Chart Data: Risk Distribution
  const riskDistribution = [
    { category: 'Low (0-39)', count: 21450, fill: '#10B981' },
    { category: 'Medium (40-69)', count: 2860, fill: '#F59E0B' },
    { category: 'High (70-84)', count: 408, fill: '#EA580C' },
    { category: 'Critical (85-100)', count: 138, fill: '#DC2626' }
  ];

  // Chart Data: Channel Share
  const channelData = [
    { name: 'UPI', value: 48, fill: '#059669' },
    { name: 'IMPS', value: 28, fill: '#2563EB' },
    { name: 'RTGS', value: 14, fill: '#7C3AED' },
    { name: 'NEFT', value: 10, fill: '#D97706' }
  ];

  // Urgent Flagged Transactions
  const urgentQueue = [
    ...(recentUpload ? [{
      id: recentUpload.seedId,
      customer: recentUpload.riskLevel === 'BENIGN' ? 'Campus Network / Benign User' : 'Syndicate Seed (Uploaded)',
      account: recentUpload.seedId,
      amount: recentUpload.riskLevel === 'BENIGN' ? 120000 : 988000,
      score: recentUpload.riskLevel === 'BENIGN' ? 15 : 96,
      cluster: recentUpload.riskLevel === 'BENIGN' ? 'NET-NAT-01' : 'NET-004',
      reason: `Uploaded Batch: ${recentUpload.syndicate}`,
      time: 'Just now'
    }] : []),
    {
      id: 'TXN-88041',
      customer: 'Vikram Mehra',
      account: 'ACC-9004',
      amount: 1000000,
      score: 95,
      cluster: 'NET-004',
      reason: 'Android Emulator + Circular Mule Layering + Tor IP',
      time: '18 mins ago'
    },
    {
      id: 'TXN-88042',
      customer: 'Priya Sharma',
      account: 'ACC-9019',
      amount: 500000,
      score: 88,
      cluster: 'NET-004',
      reason: 'Rapid Funnel Outflow to Bullion Merchant',
      time: '14 mins ago'
    },
    {
      id: 'TXN-88043',
      customer: 'Amit Verma',
      account: 'ACC-9042',
      amount: 500000,
      score: 85,
      cluster: 'NET-004',
      reason: 'Shared Hardware Terminal with Multiple Names',
      time: '11 mins ago'
    },
    {
      id: 'TXN-88099',
      customer: 'Sunil Joshi',
      account: 'ACC-9012',
      amount: 850000,
      score: 88,
      cluster: 'NET-012',
      reason: 'Automated Bot Emulator Device Farm',
      time: '24 mins ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <span>Financial Crime Surveillance Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono font-semibold">
              Live Core Banking Grid
            </span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time analytics across 24,856 daily core banking transactions, network clustering, and automated hold alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('transactions')}
            className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>View All Transactions & Scores</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Notification: Newly Uploaded & Processed Dataset */}
      {recentUpload && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-950">
                  New Dataset Ingested: {recentUpload.fileName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-200/70 text-emerald-800">
                  +{recentUpload.recordsCount || 125} Records Enriched
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  recentUpload.riskLevel === 'BENIGN' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {recentUpload.riskLevel}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Surveillance pipeline identified seed <strong>{recentUpload.seedId}</strong> ({recentUpload.syndicate}) at {recentUpload.uploadedAt}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('investigation-pipeline', { transactionId: recentUpload.seedId, networkId: 'NET-004' })}
              className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Investigate Seed ({recentUpload.seedId}) ➔</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('forensic_recent_upload');
                setRecentUpload(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded text-xs"
              title="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>Total Volume Monitored</span>
            <Activity className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#0F172A] mt-2">₹482.4 Cr</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">↑ 12.4% vs last 24h</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>Transactions Ingested</span>
            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#0F172A] mt-2">24,856</div>
          <div className="text-[11px] text-[#64748B] font-medium mt-1">100% Core Switch Enriched</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Critical Hold Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-2">38</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Score ≥ 85 • Immediate Action</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>Identified Syndicates</span>
            <Layers className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#0F172A] mt-2">14 Clusters</div>
          <div className="text-[11px] text-[#7C3AED] font-medium mt-1">Graph Partitions Formed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#A7F3D0] shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-[#065F46] text-xs font-semibold">
            <span>Protected Asset Capital</span>
            <ShieldAlert className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#065F46] mt-2">₹6.85 Cr</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">Interdicted in Transit</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: 24-Hour Velocity & Anomaly Inflow */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">24-Hour Transaction Volume & Anomaly Spikes</h3>
              <p className="text-xs text-[#64748B]">Notice the sharp anomaly spike at 02:00-04:00 AM (Cluster NET-004 activation)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#64748B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
                <span>Normal Volume</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>Flagged Anomalies</span>
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="totalVolume" stroke="#CBD5E1" fill="#F8FAFC" strokeWidth={2} />
                <Area type="monotone" dataKey="flaggedVolume" stroke="#DC2626" fill="#FEE2E2" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Score Distribution */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="pb-3 border-b border-[#E2E8F0] mb-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Risk Score Distribution</h3>
            <p className="text-xs text-[#64748B]">Transactions graded by multi-factor score</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} layout="vertical" margin={{ top: 5, right: 15, left: 25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis dataKey="category" type="category" stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Urgent Flagged Queue (Ready for 1-Click Investigation) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Urgent Flagged Queue • Immediate Action Required</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Top prioritized high-risk transactions awaiting human investigator approval and regulatory filing.
            </p>
          </div>

          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {urgentQueue.map(item => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-mono font-bold text-xs shrink-0">
                  {item.score}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0F172A] text-sm">{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-700">
                      CRITICAL HOLD
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-700">
                      Cluster: {item.cluster}
                    </span>
                  </div>

                  <div className="text-xs text-[#334155] mt-1">
                    Subject: <strong>{item.customer}</strong> ({item.account}) • Amount: <strong className="font-mono font-bold text-[#0F172A]">₹{item.amount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="text-[11px] text-rose-600 font-medium mt-0.5">
                    Trigger: {item.reason}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#94A3B8] font-mono">{item.time}</span>
                <button
                  onClick={() => onNavigate('investigation-pipeline', { transactionId: item.id, networkId: item.cluster })}
                  className="px-3.5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Investigate Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
