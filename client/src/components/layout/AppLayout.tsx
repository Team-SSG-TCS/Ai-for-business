import React, { useState } from 'react';
import {
  LayoutDashboard, Database, Network, ShieldAlert, Cpu,
  GitBranch, Smartphone, FolderKanban, FileText, History,
  Settings, ChevronLeft, ChevronRight, Search, Bell,
  Building, Calendar, Shield, X
} from 'lucide-react';
import { CUSTOMERS, ACCOUNTS, TRANSACTIONS, SUSPICIOUS_NETWORKS } from '../../mock/financialData';

export type PageId =
  | 'landing'
  | 'overview'
  | 'data-management'
  | 'network-intelligence'
  | 'detection-center'
  | 'investigation-workspace'
  | 'money-trail'
  | 'device-intelligence'
  | 'case-management'
  | 'reports'
  | 'audit-logs'
  | 'settings';

interface AppLayoutProps {
  activePage: PageId;
  onNavigate: (page: PageId, meta?: any) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activePage,
  onNavigate,
  children
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<string>('Nexus Financial Demo Bank');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days (Oct 2026)');

  // Navigation Items with badges
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'data-management', label: 'Data Management', icon: Database, badge: '9 Ingested' },
    { id: 'network-intelligence', label: 'Network Intelligence', icon: Network, badge: null },
    { id: 'detection-center', label: 'Detection Center', icon: ShieldAlert, badge: '38 Active' },
    { id: 'investigation-workspace', label: 'Investigation Workspace', icon: Cpu, badge: 'Live AI' },
    { id: 'money-trail', label: 'Money Trail Analysis', icon: GitBranch, badge: null },
    { id: 'device-intelligence', label: 'Device & Network Intel', icon: Smartphone, badge: '12 Shared' },
    { id: 'case-management', label: 'Case Management', icon: FolderKanban, badge: '16 Open' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'audit-logs', label: 'Audit Logs', icon: History, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  // Quick search results
  const searchResults = searchQuery.trim()
    ? [
        ...SUSPICIOUS_NETWORKS.filter(n => n.id.toLowerCase().includes(searchQuery.toLowerCase()) || n.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(n => ({ type: 'Network', label: `${n.id} – ${n.name}`, action: () => onNavigate('investigation-workspace', { networkId: n.id }) })),
        ...CUSTOMERS.filter(c => c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(c => ({ type: 'Customer', label: `${c.id} – ${c.name}`, action: () => onNavigate('network-intelligence', { entityId: c.id }) })),
        ...ACCOUNTS.filter(a => a.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(a => ({ type: 'Account', label: `${a.id} – ${a.bankName}`, action: () => onNavigate('money-trail') })),
        ...TRANSACTIONS.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(t => ({ type: 'Transaction', label: `${t.id} – ₹${t.amount.toLocaleString('en-IN')}`, action: () => onNavigate('money-trail') }))
      ]
    : [];

  const getBreadcrumb = () => {
    const item = navItems.find(n => n.id === activePage);
    return item ? item.label : 'Overview';
  };

  return (
    <div className="min-h-screen flex bg-[#08090A] text-[#D1D5DB] ambient-green-glow">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`bg-[#0D110F] border-r border-[#1C2420] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Brand Header */}
        <div className="p-4 border-b border-[#1C2420] flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0D2619] border border-[#00D06C]/40 flex items-center justify-center text-[#00D06C]">
                <Shield className="w-5 h-5 text-[#00D06C]" />
              </div>
              <div>
                <span className="font-extrabold tracking-wider text-base text-white block">NEXUS</span>
                <span className="text-[10px] text-[#9CA3AF] block tracking-tight">AI Financial Intelligence</span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-lg bg-[#0D2619] border border-[#00D06C]/40 flex items-center justify-center text-[#00D06C]">
              <Shield className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[#131715] text-[#9CA3AF] hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Link List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PageId)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00D06C] text-[#000000] shadow-md shadow-[#00D06C]/25'
                    : 'text-[#9CA3AF] hover:bg-[#131715] hover:text-[#FFFFFF]'
                } ${collapsed ? 'justify-center' : 'justify-between'}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#9CA3AF]'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-black/20 text-black font-bold'
                        : 'bg-[#0D2619] text-[#34D399] border border-[#00D06C]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User & Organization Profile */}
        <div className="p-3 border-t border-[#1C2420] bg-[#08090A]">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0D2619] border border-[#00D06C]/40 flex items-center justify-center text-[#00D06C] font-semibold text-xs shrink-0">
                  RV
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Senior Investigator</div>
                  <div className="text-[10px] text-[#9CA3AF] truncate">Compliance Analyst</div>
                </div>
              </div>
              <div className="pt-2 border-t border-[#1C2420] text-[10px] text-[#9CA3AF]">
                <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                  <Building className="w-3 h-3 text-[#00D06C]" />
                  <span className="truncate">{selectedOrg}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-full bg-[#0D2619] border border-[#00D06C]/40 flex items-center justify-center text-[#00D06C] font-semibold text-xs">
              RV
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 bg-[#0D110F] border-b border-[#1C2420] px-6 flex items-center justify-between gap-4 shrink-0 z-20">
          {/* Left: Breadcrumbs & System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#9CA3AF] font-medium">NEXUS</span>
              <span className="text-gray-600">/</span>
              <span className="text-white font-semibold">{getBreadcrumb()}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D2619] border border-[#00D06C]/30 text-[#00D06C] text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D06C] animate-pulse" />
              <span>All intelligence systems operational</span>
            </div>

            <button
              onClick={() => onNavigate('landing')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131715] hover:bg-[#0D2619] border border-[#1C2420] hover:border-[#00D06C]/50 text-xs text-gray-300 hover:text-[#00D06C] transition-colors"
              title="Return to Competera Marketing Homepage"
            >
              <span>← Marketing Home</span>
            </button>
          </div>

          {/* Right: Global search, selectors, notifications, profile */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#08090A] border border-[#1C2420] text-[#9CA3AF] hover:text-white text-xs hover:border-[#2A3630] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Search entities, transactions, IPs...</span>
                <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 bg-[#131715] rounded border border-[#2A3630] text-[#9CA3AF]">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Organization Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#08090A] border border-[#1C2420] rounded-lg text-xs text-gray-300">
              <Building className="w-3.5 h-3.5 text-[#00D06C]" />
              <select
                value={selectedOrg}
                onChange={e => setSelectedOrg(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="Nexus Financial Demo Bank" className="bg-[#131715]">Nexus Demo Bank</option>
                <option value="HDFC Correspondent Clearing" className="bg-[#131715]">HDFC Clearing</option>
                <option value="SBI National AML Unit" className="bg-[#131715]">SBI AML Unit</option>
              </select>
            </div>

            {/* Date Range Selector */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#08090A] border border-[#1C2420] rounded-lg text-xs text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-[#00D06C]" />
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="Last 30 Days (Oct 2026)" className="bg-[#131715]">Last 30 Days (Oct 2026)</option>
                <option value="Last 7 Days" className="bg-[#131715]">Last 7 Days</option>
                <option value="Q3 2026 Comprehensive" className="bg-[#131715]">Q3 2026</option>
              </select>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg bg-[#08090A] border border-[#1C2420] text-[#9CA3AF] hover:text-white relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#131715] border border-[#1C2420] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C2420]">
                    <span className="text-xs font-bold text-white">Active Alerts (3)</span>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-[#9CA3AF] hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 mt-2 text-xs">
                    <div className="p-2 rounded bg-[#08090A] border border-rose-500/30">
                      <div className="font-semibold text-rose-400 flex items-center justify-between">
                        <span>NET-004 Velocity Surge</span>
                        <span className="text-[10px] text-gray-500">12m ago</span>
                      </div>
                      <p className="text-gray-300 text-[11px] mt-0.5">₹10 Lakh dispersed in 45 mins across 4 mule accounts.</p>
                    </div>
                    <div className="p-2 rounded bg-[#08090A] border border-amber-500/30">
                      <div className="font-semibold text-amber-400 flex items-center justify-between">
                        <span>Emulator Ingress Alert</span>
                        <span className="text-[10px] text-gray-500">1h ago</span>
                      </div>
                      <p className="text-gray-300 text-[11px] mt-0.5">QEMU Android signatures detected for DEV-F8834.</p>
                    </div>
                    <div className="p-2 rounded bg-[#08090A] border border-[#1C2420]">
                      <div className="font-semibold text-gray-200 flex items-center justify-between">
                        <span>Dataset Processed</span>
                        <span className="text-[10px] text-gray-500">3h ago</span>
                      </div>
                      <p className="text-[#9CA3AF] text-[11px] mt-0.5">Oct-2026 Core Banking transactions imported successfully.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#1C2420]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D06C] to-emerald-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0D110F] flex items-center justify-center text-xs font-bold text-[#00D06C]">
                  RV
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Global Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            <div className="bg-[#131715] border border-[#1C2420] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[#1C2420] flex items-center gap-3">
                <Search className="w-5 h-5 text-[#00D06C]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type an account ID (ACC-9004), customer name, IP (185.220...), or network ID..."
                  className="bg-transparent text-white placeholder-gray-500 flex-1 focus:outline-none text-sm"
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="p-1 text-[#9CA3AF] hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-[#9CA3AF] tracking-wider px-2">Matches</span>
                    {searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          item.action();
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161C19] text-xs flex items-center justify-between group"
                      >
                        <span className="text-gray-200 group-hover:text-white font-medium">{item.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#0D2619] text-[#00D06C] font-mono border border-[#00D06C]/30">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-[#9CA3AF]">
                    {searchQuery ? 'No matching financial entities found' : 'Quick jump: Try searching "NET-004", "Vikram", "ACC-9004", or "185.220"'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. MAIN PAGE CONTENT SCROLLABLE VIEW */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#08090A]">
          {children}
        </main>
      </div>
    </div>
  );
};
