import React, { useState } from 'react';
import {
  LayoutDashboard, Database, Network, ShieldAlert, Cpu,
  GitBranch, Smartphone, FolderKanban, FileText, History,
  Settings, ChevronLeft, ChevronRight, Search, Bell,
  Building, Calendar, Shield, X, CheckCircle2, ArrowRight
} from 'lucide-react';
import { CUSTOMERS, ACCOUNTS, TRANSACTIONS, SUSPICIOUS_NETWORKS } from '../../mock/financialData';

export type PageId =
  | 'dashboard'
  | 'transactions'
  | 'investigation-pipeline'
  | 'data-management'
  | 'reports'
  | 'settings'
  | 'overview'
  | 'detection-center'
  | 'investigation-workspace'
  | 'money-trail'
  | 'network-intelligence'
  | 'device-intelligence'
  | 'case-management'
  | 'audit-logs'
  | 'landing';

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
  const [selectedOrg, setSelectedOrg] = useState<string>('State Bank of India – FIU Surveillance Core');

  // Primary Navigation Items
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'transactions' as PageId, label: 'Transactions & Scores', icon: ShieldAlert, badge: '38 Critical' },
    { id: 'investigation-pipeline' as PageId, label: 'Investigation Pipeline', icon: Cpu, badge: 'Active AI' },
    { id: 'data-management' as PageId, label: 'Data Ingestion & ETL', icon: Database, badge: 'Ingest' },
    { id: 'reports' as PageId, label: 'Regulatory Reports', icon: FileText, badge: 'FIU-IND' },
    { id: 'settings' as PageId, label: 'Risk Rules & Policy', icon: Settings, badge: null },
  ];

  // Quick search results
  const searchResults = searchQuery.trim()
    ? [
        ...SUSPICIOUS_NETWORKS.filter(n => n.id.toLowerCase().includes(searchQuery.toLowerCase()) || n.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(n => ({ type: 'Syndicate', label: `${n.id} – ${n.name}`, action: () => onNavigate('investigation-pipeline', { networkId: n.id }) })),
        ...TRANSACTIONS.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.fromCustomerName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4).map(t => ({ type: 'Transaction', label: `${t.id} – ₹${t.amount.toLocaleString('en-IN')} (${t.fromCustomerName})`, action: () => onNavigate('investigation-pipeline', { transactionId: t.id }) })),
        ...CUSTOMERS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(c => ({ type: 'Customer', label: `${c.id} – ${c.name}`, action: () => onNavigate('transactions') }))
      ]
    : [];

  const getBreadcrumb = () => {
    const item = navItems.find(n => n.id === activePage);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#334155]">
      {/* 1. LEFT SIDEBAR (Clean Crisp White Theme) */}
      <aside
        className={`bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-200 z-30 shrink-0 shadow-xs ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                <Shield className="w-5 h-5 text-[#059669]" />
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-base text-[#0F172A] block leading-tight">
                  NEXUS
                </span>
                <span className="text-[10px] text-[#059669] font-bold block uppercase tracking-wider">
                  Financial Crime AI
                </span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
              <Shield className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
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
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] shadow-xs'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#059669]' : 'text-[#94A3B8] group-hover:text-[#0F172A]'
                  }`}
                />

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-[#059669] text-white'
                            : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Officer Info Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] font-bold text-xs">
                RK
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#0F172A] truncate">Senior AML Officer</div>
                <div className="text-[10px] text-[#059669] font-medium truncate">Clearance Level 3 • FIU</div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] font-bold text-xs">
              RK
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between gap-4 shrink-0 z-20 shadow-xs">
          {/* Left: Breadcrumbs & System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64748B] font-medium">NEXUS Financial Intelligence</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#0F172A] font-bold">{getBreadcrumb()}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>Production Live Monitoring Grid</span>
            </div>
          </div>

          {/* Right: Global search, bank selector, notifications */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] text-xs hover:border-[#94A3B8] transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="hidden md:inline">Search entities, accounts, transactions...</span>
                <kbd className="hidden lg:inline text-[9px] px-1.5 py-0.5 bg-white rounded border border-[#CBD5E1] text-[#64748B] font-mono">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Institution Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#334155]">
              <Building className="w-3.5 h-3.5 text-[#059669]" />
              <select
                value={selectedOrg}
                onChange={e => setSelectedOrg(e.target.value)}
                className="bg-transparent text-xs text-[#0F172A] font-semibold outline-none cursor-pointer"
              >
                <option value="State Bank of India – FIU Surveillance Core">State Bank of India – FIU</option>
                <option value="HDFC Bank – Central Fraud Prevention">HDFC Bank – Fraud Unit</option>
                <option value="ICICI Bank – National Risk Core">ICICI Bank – Risk Core</option>
                <option value="Axis Bank – Financial Intelligence Group">Axis Bank – FIG</option>
              </select>
            </div>

            {/* Bell Notification */}
            <button
              className="p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] relative transition-colors"
              title="3 Critical Risk Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            </button>
          </div>
        </header>

        {/* Global Search Modal Dialog */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4">
            <div className="bg-white border border-[#CBD5E1] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-[#E2E8F0] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type an account ID (ACC-9004), transaction (TXN-88041), or customer..."
                  className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-[#94A3B8] hover:text-[#0F172A] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 max-h-80 overflow-y-auto space-y-1 text-xs">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        res.action();
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#E2E8F0]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#2563EB]">
                          {res.type}
                        </span>
                        <span className="text-[#0F172A] font-medium">{res.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#94A3B8]">
                    {searchQuery ? 'No matching banking entities found.' : 'Search across all accounts, transactions, and syndicates.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
