import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, CheckCircle2, XCircle, AlertCircle, Server, Database, Bot, Globe } from 'lucide-react';
import { checkBackendHealth, checkDatabaseHealth, checkAiServiceHealth, backendApi, BACKEND_BASE_URL, AI_BASE_URL } from '../../services/api';

interface ServiceItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai';
  url: string;
  status: 'online' | 'offline' | 'checking';
  details?: string;
  latency?: number;
}

export const ServiceStatus: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([
    {
      name: 'Client App (React + TS)',
      category: 'frontend',
      url: window.location.origin,
      status: 'online',
      details: 'Vite Dev Server Active',
    },
    {
      name: 'Backend API (Node/Express)',
      category: 'backend',
      url: BACKEND_BASE_URL,
      status: 'checking',
    },
    {
      name: 'Supabase PostgreSQL',
      category: 'database',
      url: 'Supabase Cloud (Direct Pool)',
      status: 'checking',
    },
    {
      name: 'AI Engine (FastAPI)',
      category: 'ai',
      url: AI_BASE_URL,
      status: 'checking',
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const runHealthChecks = async () => {
    setIsRefreshing(true);

    // 1. Check Backend
    let backendOnline = false;
    try {
      const backendRes = await checkBackendHealth();
      backendOnline = true;
      setServices((prev) =>
        prev.map((s) =>
          s.category === 'backend'
            ? { ...s, status: 'online', latency: backendRes.latency, details: 'Express Server Online' }
            : s
        )
      );
    } catch {
      setServices((prev) =>
        prev.map((s) =>
          s.category === 'backend'
            ? { ...s, status: 'offline', details: 'Start via cd backend && npm run dev' }
            : s
        )
      );
    }

    // 2. Check Database & pgvector (via backend if backend is online)
    if (backendOnline) {
      try {
        const dbRes = await checkDatabaseHealth();
        const connected = dbRes.data?.connected;
        let detailsText = connected ? 'Connected to Supabase Pool' : 'Check backend/.env password';

        if (connected) {
          try {
            const ragRes = await backendApi.get('/rag/status');
            if (ragRes.data?.pgvector?.enabled) {
              detailsText = `pgvector v${ragRes.data.pgvector.version} Active (${ragRes.data.pgvector.documentsCount} docs)`;
            }
          } catch {
            // keep default details
          }
        }

        setServices((prev) =>
          prev.map((s) =>
            s.category === 'database'
              ? {
                  ...s,
                  status: connected ? 'online' : 'offline',
                  details: detailsText,
                }
              : s
          )
        );
      } catch {
        setServices((prev) =>
          prev.map((s) =>
            s.category === 'database'
              ? { ...s, status: 'offline', details: 'Database query route error' }
              : s
          )
        );
      }
    } else {
      setServices((prev) =>
        prev.map((s) =>
          s.category === 'database'
            ? { ...s, status: 'offline', details: 'Backend offline (needs backend to verify)' }
            : s
        )
      );
    }

    // 3. Check AI Service
    try {
      const aiRes = await checkAiServiceHealth();
      setServices((prev) =>
        prev.map((s) =>
          s.category === 'ai'
            ? { ...s, status: 'online', latency: aiRes.latency, details: 'FastAPI Uvicorn Online' }
            : s
        )
      );
    } catch {
      setServices((prev) =>
        prev.map((s) =>
          s.category === 'ai'
            ? { ...s, status: 'offline', details: 'Start via cd ai-service && uvicorn main:app' }
            : s
        )
      );
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'frontend':
        return <Globe className="h-5 w-5 text-cyan-400" />;
      case 'backend':
        return <Server className="h-5 w-5 text-emerald-400" />;
      case 'database':
        return <Database className="h-5 w-5 text-amber-400" />;
      case 'ai':
        return <Bot className="h-5 w-5 text-purple-400" />;
      default:
        return <Activity className="h-5 w-5 text-indigo-400" />;
    }
  };

  return (
    <div className="bg-gray-900/80 rounded-2xl border border-gray-800 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>Architecture Live Monitor</span>
          </h2>
          <p className="text-sm text-gray-400">Verifying end-to-end connectivity across microservices</p>
        </div>
        <button
          onClick={runHealthChecks}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-sm font-medium transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                  {getIcon(item.category)}
                </div>
                {item.status === 'online' && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> Online
                  </span>
                )}
                {item.status === 'offline' && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <XCircle className="h-3 w-3" /> Offline
                  </span>
                )}
                {item.status === 'checking' && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <AlertCircle className="h-3 w-3" /> Checking
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-white text-sm">{item.name}</h3>
              <p className="text-xs font-mono text-gray-500 truncate mt-1">{item.url}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-900 flex items-center justify-between text-xs">
              <span className="text-gray-400 truncate">{item.details || 'Ready'}</span>
              {item.latency !== undefined && (
                <span className="font-mono text-indigo-400 text-[11px] ml-2 shrink-0">{item.latency}ms</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
