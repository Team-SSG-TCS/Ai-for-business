import React, { useState } from 'react';
import { Database, Play, AlertCircle, CheckCircle, Server, Code } from 'lucide-react';
import { backendApi } from '../../services/api';

export const DbTester: React.FC = () => {
  const [queryName, setQueryName] = useState('server-time');
  const [result, setResult] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (queryName === 'server-time') {
        const res = await backendApi.get('/health/db');
        setResult(res.data);
      } else if (queryName === 'items-list') {
        const res = await backendApi.get('/items');
        setResult(res.data);
      } else if (queryName === 'create-sample-item') {
        const res = await backendApi.post('/items', {
          title: `Hackathon Project Item #${Math.floor(Math.random() * 900 + 100)}`,
          description: 'Created from React Client via Express pg-pool',
        });
        setResult(res.data);
      } else if (queryName === 'rag-status') {
        const res = await backendApi.get('/rag/status');
        setResult(res.data);
      } else if (queryName === 'rag-search') {
        const res = await backendApi.post('/rag/search', {
          query_text: 'What architecture and AI database are we using?',
          match_count: 3,
        });
        setResult(res.data);
      } else if (queryName === 'rag-ask') {
        const res = await backendApi.post('/rag/ask', {
          query: 'What database and backend are used for this RAG starter?',
          match_count: 3,
        });
        setResult(res.data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reach Express Backend or Supabase PostgreSQL');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/80 rounded-2xl border border-gray-800 p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Backend + Supabase DB & pgvector</h3>
            <p className="text-xs text-gray-400">Express Node.js • Supabase PostgreSQL • pgvector RAG</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono">
          pgvector Ready
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <label className="block text-xs font-medium text-gray-300">Select Test Action</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setQueryName('server-time')}
            className={`p-2.5 rounded-xl text-left border text-xs font-medium transition cursor-pointer ${
              queryName === 'server-time'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-white">1. DB Ping</div>
            <div className="text-[11px] text-gray-400">SELECT NOW()</div>
          </button>
          <button
            type="button"
            onClick={() => setQueryName('rag-status')}
            className={`p-2.5 rounded-xl text-left border text-xs font-medium transition cursor-pointer ${
              queryName === 'rag-status'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-white">2. pgvector Status</div>
            <div className="text-[11px] text-emerald-400">GET /api/rag/status</div>
          </button>
          <button
            type="button"
            onClick={() => setQueryName('rag-search')}
            className={`p-2.5 rounded-xl text-left border text-xs font-medium transition cursor-pointer ${
              queryName === 'rag-search'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-white">3. Vector Search</div>
            <div className="text-[11px] text-cyan-400">POST /api/rag/search</div>
          </button>
          <button
            type="button"
            onClick={() => setQueryName('rag-ask')}
            className={`p-2.5 rounded-xl text-left border text-xs font-medium transition cursor-pointer ${
              queryName === 'rag-ask'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-white">4. RAG Pipeline Q&A</div>
            <div className="text-[11px] text-purple-400">POST /api/rag/ask</div>
          </button>
          <button
            type="button"
            onClick={() => setQueryName('items-list')}
            className={`p-2.5 rounded-xl text-left border text-xs font-medium transition cursor-pointer ${
              queryName === 'items-list'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-white">5. Fetch Items</div>
            <div className="text-[11px] text-gray-400">GET /api/items</div>
          </button>
          <button
            type="button"
            onClick={() => setQueryName('create-sample-item')}
            className={`p-2.5 rounded-xl text-left border text-xs font-medium transition cursor-pointer ${
              queryName === 'create-sample-item'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-white">6. Insert Item</div>
            <div className="text-[11px] text-gray-400">POST /api/items</div>
          </button>
        </div>

        <button
          onClick={executeTest}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <Server className="h-4 w-4 animate-bounce" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
          <span>Execute Test Route</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-start gap-2 mb-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold">Backend / Database Notice</p>
            <p>{error}</p>
            <p className="mt-1 text-gray-400">Ensure backend server is running and your Supabase password in backend/.env is set.</p>
          </div>
        </div>
      )}

      {result !== null && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Query Result
            </span>
            <span className="text-[11px] text-gray-500 font-mono">Status: 200 OK</span>
          </div>
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-xs font-mono text-emerald-300/90 overflow-y-auto max-h-56">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}

      {result === null && !error && (
        <div className="flex-1 flex items-center justify-center border border-dashed border-gray-800 rounded-xl p-4 text-center text-gray-500 text-xs">
          <div>
            <Code className="h-6 w-6 mx-auto mb-1 text-gray-600" />
            <span>Click &apos;Execute Test Route&apos; to verify Supabase PostgreSQL connection</span>
          </div>
        </div>
      )}
    </div>
  );
};
