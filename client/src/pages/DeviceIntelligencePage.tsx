import React, { useState } from 'react';
import {
  Smartphone, Globe, ShieldAlert, Cpu, AlertTriangle,
  CheckCircle2, Clock, Info, Shield, Layers, ArrowRight,
  ExternalLink, Search, RefreshCw, X
} from 'lucide-react';
import {
  DEVICES, IP_ADDRESSES, Device, IPAddress, formatINR
} from '../mock/financialData';
import { PageId } from '../components/layout/AppLayout';

interface DeviceIntelligencePageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const DeviceIntelligencePage: React.FC<DeviceIntelligencePageProps> = ({ onNavigate }) => {
  const [selectedIP, setSelectedIP] = useState<IPAddress>(IP_ADDRESSES[0]);
  const [selectedDevice, setSelectedDevice] = useState<Device>(DEVICES.find(d => d.id === 'DEV-F8821') || DEVICES[0]);
  const [activeTab, setActiveTab] = useState<'vpn' | 'emulator' | 'shared' | 'timeline'>('vpn');

  // Suspicious Session Timeline Items
  const sessionTimeline = [
    {
      time: '09:15:00 IST',
      account: 'ACC-9004 (Account A - Vikram Mehra)',
      device: 'DEV-F8821',
      ip: '185.220.101.45 (NordVPN Datacenter)',
      event: 'Session Authenticated via VPN-associated IP',
      type: 'VPN',
      severity: 'HIGH'
    },
    {
      time: '09:18:22 IST',
      account: 'ACC-9019 (Account B - Priya Sharma)',
      device: 'DEV-F8821 (Same Hardware Fingerprint)',
      ip: '185.220.101.45 (NordVPN Datacenter)',
      event: 'Immediate login switch on identical hardware profile',
      type: 'SHARED_DEVICE',
      severity: 'CRITICAL'
    },
    {
      time: '09:24:10 IST',
      account: 'ACC-9042 (Account C - Amit Verma)',
      device: 'DEV-F8834 (QEMU Android VM)',
      ip: '104.28.19.88 (Cloudflare WARP Proxy)',
      event: 'Emulator-associated headless session with zero gyro jitter',
      type: 'EMULATOR',
      severity: 'CRITICAL'
    },
    {
      time: '09:31:45 IST',
      account: 'ACC-9004 (Account A - Vikram Mehra)',
      device: 'DEV-F8821',
      ip: '185.220.101.45',
      event: 'High-value outgoing RTGS transfer of ₹6,00,000 dispatched',
      type: 'TRANSACTION',
      severity: 'CRITICAL'
    },
    {
      time: '09:47:05 IST',
      account: 'ACC-9077 (Account D - Ramesh Chawla)',
      device: 'DEV-F8821 (Same Hardware Fingerprint)',
      ip: '194.26.29.112 (Tor Exit Node)',
      event: 'Dormant account accessed via Tor relay to liquidate ₹5,50,000',
      type: 'TOR',
      severity: 'CRITICAL'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Device & Network Intelligence</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Hardware & IP Telemetry
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Investigate relationships between account activity, hardware fingerprints, emulator environments, and network infrastructure.
          </p>
        </div>

        <button
          onClick={() => onNavigate('investigation-workspace', { networkId: 'NET-004' })}
          className="px-4 py-2 bg-[#00D06C] hover:bg-[#05B860] text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/20 cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-black" />
          <span>Investigate NET-004 Ring</span>
        </button>
      </div>

      {/* Critical Compliance Guidelines Banner */}
      <div className="bg-[#131B2B] p-4 rounded-xl border border-amber-500/30 flex items-start gap-3 text-xs shadow-lg">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-gray-300">
          <span className="font-bold text-amber-300 block">Investigative Principles & Regulatory Boundaries:</span>
          <p className="leading-relaxed">
            • <strong>VPN alone must never imply fraud</strong> (privacy tooling is widely used by benign executives).<br />
            • <strong>An emulator alone must never imply fraud</strong> (developers and mobile testing teams run virtualization).<br />
            • <strong>Shared IP addresses must not automatically merge customers</strong> (Carrier-Grade NAT like Jio/Airtel subnets combine thousands of domestic users).<br />
            • Distinguish directly observed telemetry facts from inferred or machine-learned relationships.
          </p>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Unique Devices</span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">40</div>
          <span className="text-[11px] text-gray-500 block mt-1">Registered hardware profiles</span>
        </div>

        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Shared Device Fingerprints</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">12</div>
          <span className="text-[11px] text-amber-400/80 block mt-1">Bound to 2+ unrelated KYC profiles</span>
        </div>

        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">VPN / Proxy Sessions</span>
            <Globe className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-2">87</div>
          <span className="text-[11px] text-rose-400/80 block mt-1">Datacenter / Hosting egress nodes</span>
        </div>

        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Emulator Sessions</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">29</div>
          <span className="text-[11px] text-cyan-400/80 block mt-1">QEMU / Bluestacks virtual environments</span>
        </div>
      </div>

      {/* Navigation Tabs for Deep Sections */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#273449] pb-3">
        <button
          onClick={() => setActiveTab('vpn')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'vpn'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-[#131B2B] text-gray-400 hover:text-white border border-[#273449]'
          }`}
        >
          A. VPN & Proxy Intelligence
        </button>
        <button
          onClick={() => setActiveTab('emulator')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'emulator'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#131B2B] text-gray-400 hover:text-white border border-[#273449]'
          }`}
        >
          B. Emulator Intelligence
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'shared'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-[#131B2B] text-gray-400 hover:text-white border border-[#273449]'
          }`}
        >
          C. Shared Device Network Graph
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'timeline'
              ? 'bg-[#0D2619] text-[#00D06C] border border-[#00D06C]/40'
              : 'bg-[#131B2B] text-gray-400 hover:text-white border border-[#273449]'
          }`}
        >
          D. Suspicious Session Timeline
        </button>
      </div>

      {/* SECTION A: VPN & Proxy Intelligence */}
      {activeTab === 'vpn' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#131B2B] rounded-xl border border-[#273449] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
              <div>
                <h2 className="text-sm font-bold text-white">Network Classification & IP Infrastructure</h2>
                <p className="text-xs text-gray-400">Classified IP ingress addresses across residential, CG-NAT, and VPN hosts.</p>
              </div>
              <span className="text-xs font-mono text-gray-400">{IP_ADDRESSES.length} monitored IPs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
                  <tr>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3">ISP / ASN</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Accounts</th>
                    <th className="py-2.5 px-3">Sessions</th>
                    <th className="py-2.5 px-3">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {IP_ADDRESSES.slice(0, 8).map(ip => {
                    const isSelected = selectedIP.ip === ip.ip;
                    return (
                      <tr
                        key={ip.ip}
                        onClick={() => setSelectedIP(ip)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#182235] ring-1 ring-inset ring-rose-500/50' : 'hover:bg-[#182235]'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-white">{ip.ip}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ip.classification === 'VPN' || ip.classification === 'Tor Exit Node'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : ip.classification === 'Proxy' || ip.classification === 'Hosting Provider'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {ip.classification}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-300 truncate max-w-[150px]">{ip.isp}</td>
                        <td className="py-3 px-3 text-gray-300">{ip.country}</td>
                        <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{ip.associatedAccounts.length}</td>
                        <td className="py-3 px-3 font-mono text-gray-400">{ip.sessionCount}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-mono font-bold text-[11px] ${
                              ip.riskScore >= 80 ? 'text-rose-400' : (ip.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400')
                            }`}
                          >
                            {ip.riskScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right IP Intelligence Inspector Panel */}
          <div className="lg:col-span-4 bg-[#131B2B] rounded-xl border border-[#273449] p-5 shadow-lg space-y-4">
            <div className="pb-3 border-b border-[#273449]">
              <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">IP Details Inspector</span>
              <h3 className="text-base font-bold font-mono text-white mt-1">{selectedIP.ip}</h3>
              <span className="text-xs text-gray-400">{selectedIP.isp} ({selectedIP.asn})</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Classification:</span>
                <span className="text-rose-400 font-bold">{selectedIP.classification}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Jurisdiction:</span>
                <span className="text-white">{selectedIP.city}, {selectedIP.country}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Associated Accounts:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedIP.associatedAccounts.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Session Frequency:</span>
                <span className="font-mono text-white">{selectedIP.sessionCount} sessions logged</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#273449] space-y-1.5 text-xs">
              <span className="font-bold text-white block">Observed Risk Indicators:</span>
              <p className="text-gray-300 leading-relaxed">
                Known commercial datacenter exit node associated with anonymizing tunnel traffic. High concurrency across accounts with disparate registered domestic mobile numbers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: Emulator Intelligence */}
      {activeTab === 'emulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#131B2B] rounded-xl border border-[#273449] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
              <div>
                <h2 className="text-sm font-bold text-white">Hardware Telemetry & Emulator Environments</h2>
                <p className="text-xs text-gray-400">Inspection of Android virtual machines, build.prop hooks, and sensor anomalies.</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                Sandbox Telemetry Engine
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
                  <tr>
                    <th className="py-2.5 px-3">Device ID</th>
                    <th className="py-2.5 px-3">Hardware Model</th>
                    <th className="py-2.5 px-3">Virtual Environment</th>
                    <th className="py-2.5 px-3">Sensor Anomalies</th>
                    <th className="py-2.5 px-3">Accounts</th>
                    <th className="py-2.5 px-3">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {DEVICES.slice(0, 6).map(dev => {
                    const isSelected = selectedDevice.id === dev.id;
                    return (
                      <tr
                        key={dev.id}
                        onClick={() => setSelectedDevice(dev)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#182235] ring-1 ring-inset ring-amber-500/50' : 'hover:bg-[#182235]'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-[#00D06C]">{dev.id}</td>
                        <td className="py-3 px-3 text-white font-medium">{dev.model}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dev.isEmulator
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {dev.isEmulator ? 'EMULATOR DETECTED' : 'PHYSICAL HARDWARE'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                          {dev.emulatorIndicators.length > 0 ? `${dev.emulatorIndicators.length} flags` : 'Clean sensors'}
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{dev.associatedAccounts.length}</td>
                        <td className="py-3 px-3">
                          <span className={`font-mono font-bold ${dev.riskScore >= 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {dev.riskScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Emulator Details Panel */}
          <div className="lg:col-span-4 bg-[#131B2B] rounded-xl border border-[#273449] p-5 shadow-lg space-y-4">
            <div className="pb-3 border-b border-[#273449]">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Emulator Evidence Inspector</span>
              <h3 className="text-base font-bold text-white mt-1">{selectedDevice.model}</h3>
              <span className="text-xs font-mono text-gray-400">{selectedDevice.id}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Fingerprint Hash:</span>
                <span className="font-mono text-purple-400 truncate max-w-[160px]">{selectedDevice.fingerprintHash}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Root Access:</span>
                <span className={selectedDevice.isRooted ? 'text-rose-400 font-bold' : 'text-gray-300'}>
                  {selectedDevice.isRooted ? 'ROOTED (su binary found)' : 'Unrooted'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">First / Last Seen:</span>
                <span className="font-mono text-gray-300 text-[10px]">2026-09-12 / 2026-10-31</span>
              </div>
            </div>

            {selectedDevice.emulatorIndicators.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-300">Triggered Virtual Indicators:</span>
                <div className="space-y-1 text-xs">
                  {selectedDevice.emulatorIndicators.map((ind, i) => (
                    <div key={i} className="p-2 bg-[#0B0F19] rounded border border-rose-500/30 text-rose-300 font-mono text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION C: Shared Device Network Graph */}
      {activeTab === 'shared' && (
        <div className="bg-[#131B2B] rounded-xl border border-[#273449] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
            <div>
              <h2 className="text-sm font-bold text-white">
                Customer → Device → IP Address → Account → Transaction Graph
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Topological visualization highlighting physical terminals bound to disparate customer identities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('network-intelligence')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Full Graph View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Topology Walkthrough Diagram */}
          <div className="p-6 bg-[#0B0F19] rounded-xl border border-[#273449] min-h-[360px] flex flex-col justify-center items-center">
            <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl w-full">
              {/* Customer Column */}
              <div className="flex flex-col gap-2.5 text-center">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Customers</span>
                <div className="p-2.5 bg-[#131B2B] border border-indigo-500/40 rounded-lg text-xs text-white font-medium">Vikram Mehra</div>
                <div className="p-2.5 bg-[#131B2B] border border-indigo-500/40 rounded-lg text-xs text-white font-medium">Priya Sharma</div>
                <div className="p-2.5 bg-[#131B2B] border border-indigo-500/40 rounded-lg text-xs text-white font-medium">Amit Verma</div>
                <div className="p-2.5 bg-[#131B2B] border border-indigo-500/40 rounded-lg text-xs text-white font-medium">Ramesh Chawla</div>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-gray-600 shrink-0 hidden sm:block" />

              {/* Shared Device Box */}
              <div className="p-5 bg-purple-950/30 border-2 border-purple-500 rounded-xl text-center shadow-lg shadow-purple-600/20 max-w-xs">
                <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
                <span className="text-[10px] font-bold text-purple-400 uppercase block tracking-wider">Shared Core Device</span>
                <span className="text-sm font-bold text-white block mt-1">DEV-F8821</span>
                <span className="text-xs text-gray-400 block mt-0.5">Redmi Note 10S · Android 11</span>
                <span className="mt-2 inline-block px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/40">
                  4 Disparate KYC Customers Linked
                </span>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-gray-600 shrink-0 hidden sm:block" />

              {/* IP / Accounts Column */}
              <div className="flex flex-col gap-2.5 text-center">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">IP & Accounts</span>
                <div className="p-2.5 bg-[#131B2B] border border-rose-500/40 rounded-lg text-xs text-rose-300 font-mono">185.220.101.45 (VPN)</div>
                <div className="p-2.5 bg-[#131B2B] border border-cyan-500/40 rounded-lg text-xs text-white font-mono">ACC-9004 (HDFC)</div>
                <div className="p-2.5 bg-[#131B2B] border border-cyan-500/40 rounded-lg text-xs text-white font-mono">ACC-9019 (ICICI)</div>
                <div className="p-2.5 bg-[#131B2B] border border-cyan-500/40 rounded-lg text-xs text-white font-mono">ACC-9077 (SBI)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: Suspicious Session Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-[#131B2B] rounded-xl border border-[#273449] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
            <div>
              <h2 className="text-sm font-bold text-white">Chronological Suspicious Session Timeline</h2>
              <p className="text-xs text-gray-400 mt-0.5">Sequential authentication events and high-velocity fund transfers on October 28, 2026.</p>
            </div>
            <span className="text-xs font-mono text-gray-400">5 synchronized events</span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-[#273449] pl-2">
            {sessionTimeline.map((item, index) => (
              <div
                key={index}
                className="relative pl-10 p-3.5 bg-[#0B0F19] rounded-xl border border-[#273449] hover:border-gray-600 transition-all"
              >
                <div className="absolute left-3.5 top-4 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-600/20 border border-rose-500 flex items-center justify-center text-rose-400">
                  <Clock className="w-3 h-3" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{item.time}</span>
                    <span className="text-white font-bold text-xs">{item.account}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-1">{item.event}</p>

                <div className="mt-2 pt-2 border-t border-[#182235] flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-400">
                  <span>Device: <span className="text-purple-300">{item.device}</span></span>
                  <span>•</span>
                  <span>IP Egress: <span className="text-cyan-300">{item.ip}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Device & Network Analysis Section */}
      <div className="bg-[#131B2B] border border-[#273449] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#273449]">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">AI Device & Network Synthesis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-[#273449] space-y-1.5">
            <span className="font-bold text-rose-400 block">Suspicious Correlations:</span>
            <p className="text-gray-300 leading-relaxed">
              4 distinct individuals logged into mobile banking within 16 minutes from the same Redmi hardware hash while masked via foreign datacenter IP addresses (Amsterdam). This velocity violates normal human device handoff probability by 99.8%.
            </p>
          </div>

          <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-[#273449] space-y-1.5">
            <span className="font-bold text-emerald-400 block">Possible Legitimate Explanations:</span>
            <p className="text-gray-300 leading-relaxed">
              Shared office dispatch unit: If Mehra-Sharma Logistics operates a dedicated field operations tablet where drivers or accounts staff process approved vendor settlements, telemetry would exhibit identical hardware profiles and corporate VPN tunnels.
            </p>
          </div>

          <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-[#273449] space-y-1.5">
            <span className="font-bold text-cyan-400 block">Evidence References:</span>
            <p className="text-gray-300 font-mono text-[11px]">
              EVD-101 (Redmi Fingerprint Hash) · EVD-102 (NordVPN Datacenter Telemetry) · EVD-105 (Sensor Accelerometer Zero-Variance) · EVD-108 (Corporate MDM Fleet CSV)
            </p>
          </div>

          <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-[#273449] space-y-1.5">
            <span className="font-bold text-amber-400 block">Recommended Investigation Steps:</span>
            <p className="text-gray-300 leading-relaxed">
              1. Issue step-up Biometric Face-ID verification on next login for CUST-1077.<br />
              2. Inspect corporate MDM audit logs for DEV-F8821 to verify active employee assignment.<br />
              3. Request correspondent clearing wire trail for initial ₹10L funding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
