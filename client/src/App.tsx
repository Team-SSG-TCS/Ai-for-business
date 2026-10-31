import { FacultyDataAssistantPage } from './pages/FacultyDataAssistantPage';
import React, { useState } from 'react';
import { AppLayout, PageId } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { InvestigationPipelinePage } from './pages/InvestigationPipelinePage';
import { DataManagementPage } from './pages/DataManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [activeTransactionId, setActiveTransactionId] = useState<string>('TXN-88041');
  const [activeNetworkId, setActiveNetworkId] = useState<string>('NET-004');

  const handleNavigate = (page: PageId, meta?: { transactionId?: string; networkId?: string; entityId?: string }) => {
    if (meta?.transactionId) {
      setActiveTransactionId(meta.transactionId);
    }
    if (meta?.networkId) {
      setActiveNetworkId(meta.networkId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'faculty-assistant':
        return <FacultyDataAssistantPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'transactions':
        return <TransactionsPage onNavigate={handleNavigate} />;
      case 'investigation-pipeline':
        return (
          <InvestigationPipelinePage
            transactionId={activeTransactionId}
            networkId={activeNetworkId}
            onNavigate={handleNavigate}
          />
        );
      case 'data-management':
        return <DataManagementPage onNavigate={handleNavigate} />;
      case 'reports':
        return <ReportsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppLayout activePage={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </AppLayout>
  );
};

export default App;
