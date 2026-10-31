import React, { useState } from 'react';
import { AppLayout, PageId } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { DataManagementPage } from './pages/DataManagementPage';
import { NetworkIntelligencePage } from './pages/NetworkIntelligencePage';
import { DetectionCenterPage } from './pages/DetectionCenterPage';
import { InvestigationWorkspacePage } from './pages/InvestigationWorkspacePage';
import { MoneyTrailPage } from './pages/MoneyTrailPage';
import { DeviceIntelligencePage } from './pages/DeviceIntelligencePage';
import { CaseManagementPage } from './pages/CaseManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [activeNetworkId, setActiveNetworkId] = useState<string>('NET-004');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const handleNavigate = (page: PageId, meta?: { networkId?: string; entityId?: string }) => {
    if (meta?.networkId) {
      setActiveNetworkId(meta.networkId);
    }
    if (meta?.entityId) {
      setSelectedEntityId(meta.entityId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage onNavigate={handleNavigate} />;
      case 'data-management':
        return <DataManagementPage onNavigate={handleNavigate} />;
      case 'network-intelligence':
        return (
          <NetworkIntelligencePage
            onNavigate={handleNavigate}
            selectedEntityId={selectedEntityId}
          />
        );
      case 'detection-center':
        return <DetectionCenterPage onNavigate={handleNavigate} />;
      case 'investigation-workspace':
        return (
          <InvestigationWorkspacePage
            onNavigate={handleNavigate}
            networkId={activeNetworkId}
          />
        );
      case 'money-trail':
        return <MoneyTrailPage onNavigate={handleNavigate} />;
      case 'device-intelligence':
        return <DeviceIntelligencePage onNavigate={handleNavigate} />;
      case 'case-management':
        return <CaseManagementPage onNavigate={handleNavigate} />;
      case 'reports':
        return <ReportsPage onNavigate={handleNavigate} />;
      case 'audit-logs':
        return <AuditLogsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  if (activePage === 'landing') {
    return <LandingPage onOpenPlatform={() => handleNavigate('overview')} />;
  }

  return (
    <AppLayout activePage={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </AppLayout>
  );
};

export default App;
